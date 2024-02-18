import Editor from "@monaco-editor/react"
import { navigateHook } from './utils/HookUtils'
import * as Y from "yjs";
import {bindMonaco, createWebrtcProvider} from './utils/DependencyUtils'
import config from '../backend/backend.json'
import './App.css';
import CollabPrompt from './utils/CollabPrompt';
import { roomExists,  addRoomMetadata , verifyRoomPwd, logDebug } from './utils/WebrtcUtils'
import {paramsHook, refHook, stateHook, cookiesHook } from './utils/HookUtils'
import {validateRoomState, doHandleEditorMount} from './utils/AppUtils.jsx'
import LinearProgress from '@mui/material/LinearProgress';
import Fade from "@mui/material/Fade";

function App() {

  // hooks
  const { hash } = paramsHook();
  const [cookies, _] = cookiesHook(["user"]);
  const [admin, setAdmin] = stateHook(false);
  const [authFailedErrorMsg, setAuthFailedErrorMsg] = stateHook('');
  const [promptOpened, setPromptOpened] = stateHook(false);
  const [loading, setLoading] = stateHook(true);
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
  
  /**
   * */
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

    setLoading(true);
    verifyRoomPwd(room, pwd, (success, msg) => {
      logDebug(`VerifyRoomPwd : ${msg}`);
      setLoading(false);
      if (success == 0 ) { // auth was success
        setPromptOpened(false);
        provisionMonacoEditor();
      } else {
        setAuthFailedErrorMsg(msg);
      }
    });
  }

  function addPasswordToRoom(pwd, room) {

    if (!validateRoomState(pwd, room, setAuthFailedErrorMsg)) {
      return;
    }
    setLoading(true);
    addRoomMetadata(room, pwd, userNameRef.current, (success, msg) => {
      setLoading(false);
      if (success == 0) {
        setPromptOpened(false);
        provisionMonacoEditor();
      } else  {
        setAuthFailedErrorMsg(msg);
      }
    });
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
        }
      });
    });
  }

  function handleUserAuth(roomName) {
    const exists = roomExists(roomName);
    setAdmin(!exists);
    setPromptOpened(true);
  }
  
  /*
   * @param {MonacoEditor} editor
   *
   * */
  function handleEditorDidMount(editor, _) {
    doHandleEditorMount(cookies, editorRef, userNameRef, editor,componentController, navigate);
  }

  /**
   * Method to enter the data in the editor. 
   * 
   * */
  function provisionMonacoEditor() {

    const userName = userNameRef.current;
    logDebug(`Attempting to provision monaco editor for ${userName}`);

    const currentColorCode = generateRandomColor()
    logDebug(`Color code is ${currentColorCode}`);

    const doc = new Y.Doc();
    logDebug(`Y doc is created `);

    const provider = createWebrtcProvider(hash, doc, { signaling: [`ws://${hostname}:${port}`] });
    logDebug(`Provider is created for ${hash}`);

    const type = doc.getText("monaco");
    logDebug(`Monaco editor has been created`);

    const awareness = provider.awareness
    logDebug(`User awareness for ${hash} has been created`);

    bindMonaco(
      type,
      editorRef.current.getModel(),
      new Set([editorRef.current]),
      awareness);
    logDebug(`Monaco provider has been created for ${hash}`);

    notifyUserPresence(doc.clientID, currentColorCode, awareness, userName);
    logDebug(`User presence has been notified`);
  }

  /**
   *
   * Each user has a color associated with them. 
   * This is how that color is randomly genereated
   *
   * */
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

      <Fade in = {loading} style={{ transitionDelay: loading ? "800ms" : "0ms",}} unmountOnExit> 

        <LinearProgress />

      </Fade>

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
