import { useState, useRef } from 'react'
import Editor from "@monaco-editor/react"
import * as Y from "yjs";
import {WebrtcProvider} from "y-webrtc"
import { MonacoBinding } from 'y-monaco';
import { useParams } from 'react-router-dom';
import config from '../backend/config.json'

function App() {
  
  let { hash } = useParams();
  const hostname = config.SERVER_URL;
  const port = config.PORT;
  console.log("API is " + config.SERVER_URL);

  const editorRef = useRef(null)

  function handleEditorDidMount(editor, monaco) {
    editorRef.current = editor;
    const doc = new Y.Doc();
    const provider = new WebrtcProvider(hash, doc, { signaling: [`ws://${hostname}:${port}`] });
    const type = doc.getText("monaco");
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
