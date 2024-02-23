import { WebrtcProvider } from "y-webrtc"
import { MonacoBinding } from 'y-monaco';
import { Doc } from "yjs";


/**
 * Creates a WebrtcProvider
 *
 * @param {string} hash - Hash of the room
 *
 * @param {Doc} doc - A YJS document. This will be bounded
 * to the WebRtc provider
 *
 * @param {Object} wsParam - Parameters of the WebrtcProvider
 * @see {@link WebrtcProvider#constructor}
 *
 * @returns {WebrtcProvider} instance of the webrtc provider
 */
export function createWebrtcProvider(hash, doc, wsParam) {
  return new WebrtcProvider(hash, doc, wsParam);
}

/**
 * Binds the YJS document for the room
 * to the monaco editor
 *
 * @param {YText} yjsText - This is the actual text that
 * we will see in front of us
 *
 * @param {monaco.editor.ITextModel} editorModel - Holds
 * information contained by the monaco editor
 *
 * @param {Set} editorSet - Holds the reference to Monaco
 * Editor, but in a set
 *
 * @param {Awareness} awareness - YJS awareness object. 
 * Its needed for userawareness
 *
 * @returns {MonacoBinding} YJS Monaco binding object
 */
export function bindMonaco(yjsText, editorModel, editorSet, awareness) {
    return new MonacoBinding(
      yjsText,
      editorModel,
      editorSet,
      awareness);
}

