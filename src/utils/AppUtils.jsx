import { Cookies } from "react-cookie";

/**
 * Will get you the username from cookie
 * This username gets saved in the cookie
 * during user is trying to create a room
 * or enter into an existing room
 *
 * @param {string} cookie - React cookie
 * @returns {string} username
 */
export function getUsernameFromCookie(cookie) {
  return cookie.username;
}


/**
 * Called when the Monaco editor is getting mount.
 * This method will redirect to home page if there
 * is no user name in the cookie. 
 *
 * Otherwise it will populate 
 *
 * @param {Cookies} cookies - Used to get the username from cookies
 *
 * @param {import("@monaco-editor/react").MonacoDiffEditor} editorRef - This is a component property
 * that stores the reference to the monaco editor
 *
 * @param {import("react").MutableRefObject} userNameRef - Username component property
 *
 * @param {@function} editor - This is the reference of the monaco editor
 * <code>
 * import Editor from "@monaco-editor/react" 
 * </code>
 *
 * @param {import("../App").ComponentController} componentControllers - An object which will hold some 
 * information needed by this method to operate
 *
 * @param {import("react-router-dom").NavigateFunction} navigate - Used to navigate to home page
 */
export function doHandleEditorMount(cookies, editorRef, userNameRef, editor, componentControllers, navigate) {
  const userName = getUsernameFromCookie(cookies);
  if (!userName) {
    navigate("/");
    return;
  }
  editorRef.current = editor;
  userNameRef.current = userName;
  componentControllers.callback();
}

/**
 * Validates the sanity of password and 
 * room hash
 *
 * @param {string} pwd - Password of the room
 * @param {string} room - Hash of the room
 * @param {@function} errorHandler - Used to passback the error message
 * @returns {boolean} <code>true</code> if the room state is valid
 */
export function validateRoomState(pwd, room, errorHandler) {

  if (!pwd) {
    errorHandler("Password cannot be empty");
    return false;
  }

  if (!room) {
    errorHandler("Room identified cannot be empty. Please try to login again and retry");
    return false;
  }

  return true;
}

