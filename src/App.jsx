import { useRef } from 'react'
import Editor from "@monaco-editor/react"
import * as Y from "yjs";
import { WebrtcProvider } from "y-webrtc"
import { MonacoBinding } from 'y-monaco';
import { useParams } from 'react-router-dom';
import config from '../backend/config.json'
import { CssBaseline } from '@mui/material';
import { useCookies } from "react-cookie";
import { useAtom } from 'jotai';
import { useNavigate, /* other hooks */ } from 'react-router-dom';

function App() {
  // hooks
  let { hash } = useParams();
  const [cookies, setCookie] = useCookies(["user"]);
  const editorRef = useRef(null)
  const navigate = useNavigate();
  // variables
  const hostname = config.SERVER_URL;
  const port = config.SIGNALLING_PORT;
  const userColorState = {}

  function addCSS(css) {

    var head = document.getElementsByTagName('head')[0];
    var s = document.createElement('style');
    s.setAttribute('type', 'text/css');
    if (s.styleSheet) {   // IE
      s.styleSheet.cssText = css;
    } else {                // the world
      s.appendChild(document.createTextNode(css));
    }
    head.appendChild(s);
  }

  function updateYRemoteCSS(currentColorCode, userHash, name) {

    const yRemoteSelectionAttr = `.yRemoteSelection-${userHash}`;
    const yRemoteSelectionHeadAttr = `.yRemoteSelectionHead-${userHash}`;
    const yRemoteSelectionHeadAfterAttr = `.yRemoteSelectionHead-${userHash}::after`;
    const css = `
      ${yRemoteSelectionAttr} {
          background-color: red 
      }
      ${yRemoteSelectionHeadAttr} {
          position: absolute;
          border-left: ${currentColorCode} solid 2px;
          border-top: ${currentColorCode} solid 4px;
          border-bottom: ${currentColorCode} solid 2px;
          height: 100%;
          box-sizing: border-box;
      }
      ${yRemoteSelectionHeadAfterAttr} {
          position: absolute;
          content: '${name}';
          border-left: 4px solid ${currentColorCode};
          border-right: 4px solid ${currentColorCode};
          top: -22px;
          left: -2px;
          background-color: ${currentColorCode} ;
          font-size: 10px;
      }
    `;

    addCSS(css)
  }

  function initUserCSS(clientID, color, name) {

    const clientId = clientID;
    const colorHash = color;
    if (userColorState[clientId]) return;
    userColorState[clientId] = color;
    updateYRemoteCSS(colorHash, clientId, name);

  }

  function notifyUserPresence(clientID, currentColorCode, awareness, userName) {

    awareness.setLocalStateField('user', {
      clientID: clientID,
      color: currentColorCode,
      name: userName
    });

    awareness.on('update', changes => {
      const docStates = Array.from(awareness.getStates().values());
      docStates.forEach(x => {
        const user = x['user'];
        if (user) {
          initUserCSS(user.clientID, user.color, user.name);
          handleUserAddition(user.clientID, user.name);
        }
      });
    });
  }

  function handleUserAddition(clientId, userId) {
  }

  function handleEditorDidMount(editor, monaco) {

    const userName = cookies.username;
    if (!userName) {
      navigate("/");
      return;
    }
    const currentColorCode = generateRandomColor()
    const doc = new Y.Doc();
    const provider = new WebrtcProvider(hash, doc, { signaling: [`ws://${hostname}:${port}`] });
    const type = doc.getText("monaco");
    const awareness = provider.awareness

    editorRef.current = editor;
    new MonacoBinding(
      type,
      editorRef.current.getModel(),
      new Set([editorRef.current]),
      awareness);

    notifyUserPresence(doc.clientID, currentColorCode, awareness, userName);

  }

  function generateRandomColor() {
    let maxVal = 0xFFFFFF; // 16777215
    let randomNumber = Math.random() * maxVal;
    randomNumber = Math.floor(randomNumber);
    randomNumber = randomNumber.toString(16);
    let randColor = randomNumber.padStart(6, 0);
    return `#${randColor.toUpperCase()}`
  }

  function updateCSSPty(className, pty, value) {
    elements = document.querySelectorAll(`.${className}`);
    elements.forEach(element => {
      element.style[pty] = value;
    });
  }

  return (
    <div>
      <CssBaseline />
      <Editor
        height="100vh"
        width="100vw"
        theme='vs-dark'
        onMount={handleEditorDidMount}
      />
    </div>
  )
}

export default App
