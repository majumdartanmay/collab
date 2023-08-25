import { useState, useRef } from 'react'
import Editor from "@monaco-editor/react"
import * as Y from "yjs";
import {WebrtcProvider} from "y-webrtc"
import { MonacoBinding } from 'y-monaco';
import { useParams } from 'react-router-dom';
import os from 'os'

function App() {
  
  let { hash } = useParams();
  console.log("Hash is " + hash);

  const editorRef = useRef(null)
  let docName = "myContent";

  function handleEditorDidMount(editor, monaco) {
    const hostname = os.hostname()
    editorRef.current = editor;
    const doc = new Y.Doc();
    const provider = new WebrtcProvider(hash, doc, { signaling: ['ws://localhost:14444'] });
    const type = doc.getText(docName);
    const binding = new MonacoBinding(type, editorRef.current.getModel(), new Set([editorRef.current]), provider.awareness);
    console.log(provider.awareness);
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
