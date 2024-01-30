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

