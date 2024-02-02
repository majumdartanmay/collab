export function getUsernameFromCookie(cookie) {
  return cookie.username;
}

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

