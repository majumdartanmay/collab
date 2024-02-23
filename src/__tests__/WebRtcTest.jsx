import * as Y from 'yjs'

/**
 * Checks basic YJS input/output functions
 *
 * @async
 */
test("Basic YJS functionality test", async () => {
    // Yjs documents are collections of
    // shared objects that sync automatically.
    const ydoc = new Y.Doc()
    // Define a shared Y.Map instance
    const ymap = ydoc.getMap()
    ymap.set('keyA', 'valueA')

    // Create another Yjs document (simulating a remote user)
    // and create some conflicting changes
    const ydocRemote = new Y.Doc()
    const ymapRemote = ydocRemote.getMap()
    ymapRemote.set('keyB', 'valueB')

    // Merge changes from remote
    const update = Y.encodeStateAsUpdate(ydocRemote)
    Y.applyUpdate(ydoc, update)
    
    const assertMap = {
        'keyA': 'valueA',
        'keyB': 'valueB'
    }

    expect(JSON.stringify(ymap.toJSON())).toBe(JSON.stringify(assertMap));
})

