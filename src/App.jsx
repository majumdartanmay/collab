import { useRef } from 'react'
import Editor from "@monaco-editor/react"
import * as Y from "yjs";
import { WebrtcProvider } from "y-webrtc"
import { MonacoBinding } from 'y-monaco';
import { useParams } from 'react-router-dom';
import config from '../backend/config.json'

function App() {
  let { hash } = useParams();
  const hostname = config.SERVER_URL;
  const port = config.SIGNALLING_PORT;
  const editorRef = useRef(null)

  function addcss(css) {

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

  function updateYRemoteCSS(currentColorCode, userHash) {

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
          content: '${userHash}';
          border-left: 4px solid ${currentColorCode};
          border-right: 4px solid ${currentColorCode};
          top: -22px;
          left: -2px;
          background-color: ${currentColorCode} ;
      }
    `;

    addcss(css)
  }

  function handleEditorDidMount(editor, monaco) {

    const curentUser = generateRandomString(6)
    const currentColorCode = generateRandomColor()
    const doc = new Y.Doc();
    const provider = new WebrtcProvider(hash, doc, { signaling: [`ws://${hostname}:${port}`] });
    const type = doc.getText("monaco");
    const awareness = provider.awareness

    editorRef.current = editor;
    new MonacoBinding(type, editorRef.current.getModel(), new Set([editorRef.current]), provider.awareness);

    awareness.setLocalStateField('user', {
      clientID: doc.clientID,
      color: currentColorCode,
      updatedCSS: false
    });
    awareness.on('update', changes => {
      console.log(Array.from(awareness.getStates().values()));
      Array.from(awareness.getStates().values()).forEach(x => {
        const user = x['user'];
        if (user) {
          const clientId = user.clientID;
          const colorHash = user.color;
          user.updatedCSS = true;
          updateYRemoteCSS(colorHash, clientId);
        }
      });
    });
  }

  function generateRandomColor() {
    let maxVal = 0xFFFFFF; // 16777215
    let randomNumber = Math.random() * maxVal;
    randomNumber = Math.floor(randomNumber);
    randomNumber = randomNumber.toString(16);
    let randColor = randomNumber.padStart(6, 0);
    return `#${randColor.toUpperCase()}`
  }

  function generateRandomString(length) {
    const characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let randomString = '';

    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      randomString += characters[randomIndex];
    }

    return randomString;
  }

  function updateCSSPty(className, pty, value) {
    elements = document.querySelectorAll(`.${className}`);
    elements.forEach(element => {
      element.style[pty] = value;
    });
  }

  return (
    <Editor
      height="100vh"
      width="100vw"
      theme='vs-dark'
      onMount={handleEditorDidMount}
    />
  )
}

export default App
