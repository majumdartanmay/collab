import { MonacoBinding } from 'y-monaco';


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
