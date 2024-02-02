import Editor from "@monaco-editor/react"
import { navigateHook } from './utils/HookUtils'
import * as Y from "yjs";
import {createMonacoProvider, createWebrtcProvider} from './utils/DependencyUtils'
import config from '../backend/backend.json'
import './App.css';
import CollabPrompt from './utils/CollabPrompt';
import { roomExists,  addRoomMetadata , verifyRoomPwd } from './utils/WebrtcUtils'
import {paramsHook, refHook, stateHook, cookiesHook } from './utils/HookUtils'
import {validateRoomState, doHandleEditorMount} from './utils/AppUtils.jsx'

function App() {

  // hooks
  const { hash } = paramsHook();
  const [cookies, _] = cookiesHook(["user"]);
  const [admin, setAdmin] = stateHook(false);
  const [authFailedErrorMsg, setAuthFailedErrorMsg] = stateHook('');
  const [promptOpened, setPromptOpened] = stateHook(false);
  const navigate = navigateHook(); 
  const editorRef = refHook(null);
  const userNameRef = refHook(null);
  const componentController = {
    setAdmin,
    setPromptOpened, 
    callback : () => {
      handleUserAuth(hash);
    }
  }

  // variables
  const hostname = config.CLIENT.SIGNALLING_SERVER;
  const port = config.SIGNALLING_PORT;
  const userColorState = {}

  const requirePasswordProps = {
    prompt: "Please enter the password",
    processPwd: verifyPwd
  }

  const createPasswordProps = {
    prompt: "You are creating a new room. Please create a password which everyone will use.",
    processPwd: addPasswordToRoom,
    room: null
  }

  function verifyPwd(pwd, room) {

    if (!validateRoomState(pwd, room, setAuthFailedErrorMsg)) {
      return;
    }

    if (verifyRoomPwd(room, pwd)) {
      setPromptOpened(false);
      provisionMonacoEditor();
    }else {
      setAuthFailedErrorMsg('Password is not correct.');
    }
  }

  function addPasswordToRoom(pwd, room) {

    if (!validateRoomState(pwd, room, setAuthFailedErrorMsg)) {
      return;
    }

    addRoomMetadata(room, pwd);
    setPromptOpened(false);
    provisionMonacoEditor();
  }


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
          background-color: ${currentColorCode}; 
      }
      ${yRemoteSelectionHeadAttr} {
          position: absolute;
          border-left: ${currentColorCode} solid 2px;
          border-top: ${currentColorCode} solid 4px;
          border-bottom: ${currentColorCode} solid 2px;
          height: 60%;
          animation: blink 1s linear infinite;
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
          animation: fadeOut 8s;
          animation-iteration-count: infinite;
          animation-fill-mode: forwards;

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

    awareness.on('update', __ => {
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

  function handleUserAuth(roomName) {
    const exists = roomExists(roomName);
    setAdmin(!exists);
    setPromptOpened(true);
  }

  function handleEditorDidMount(editor, _) {
    doHandleEditorMount(cookies, editorRef, userNameRef, editor,componentController, navigate);
  }

  function provisionMonacoEditor() {
    const userName = userNameRef.current;
    const currentColorCode = generateRandomColor()
    const doc = new Y.Doc();
    const provider = createWebrtcProvider()(hash, doc, { signaling: [`ws://${hostname}:${port}`] });
    const type = doc.getText("monaco");
    const awareness = provider.awareness

    createMonacoProvider(
      type,
      editorRef.current.getModel(),
      new Set([editorRef.current]),
      awareness);

    notifyUserPresence(doc.clientID, currentColorCode, awareness, userName);
  }

  function generateRandomColor() {
    const colorHashCodes = [
      "#FF5733",
      "#33FF57",
      "#5733FF",
      "#FF33A1",
      "#33A1FF",
      "#A1FF33",
      "#FF3361",
      "#3361FF",
      "#61FF33",
      "#FF33F7",
      "#33F7FF",
      "#F7FF33"
    ];
    let maxVal = colorHashCodes.length - 1;
    let randomNumber = Math.random() * maxVal;
    randomNumber = Math.floor(randomNumber);
    randomNumber = randomNumber.toString(16);
    return colorHashCodes[randomNumber];
  }


  return (
    <div id="app-container">
      <CollabPrompt data={admin ? createPasswordProps : requirePasswordProps} room={hash} open={promptOpened} error = {authFailedErrorMsg}/>
      <div id="editor-container" data-testid="editor-container">
        <Editor
          data-testid = "monaco-editor-collab"
          height="100vh"
          width="100vw"
          onMount={handleEditorDidMount}
        />
      </div>
    </div>
  )
}

export default App;
