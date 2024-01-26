import { render, screen,  } from '@testing-library/react'
import App from '../App';
import * as hookUtils from '../utils/HookUtils'
import {navigationMocker } from './TestUtils'
import * as appUtils from '../utils/AppUtils'

beforeAll(() => {
    navigationMocker();
});

test("Room is created", async () => {
    render(<App/>);

    await new Promise((r) => setTimeout(r, 2000));

    const collabPromptElem = screen.getByTestId('collab-prompt');
    expect(collabPromptElem).toBeInTheDocument();

    const editorContainer = screen.getByTestId('editor-container');
    expect(editorContainer).toBeInTheDocument();

})

test("Check mount behavior when valid username is passed" , async () => {
    const username = 'Ceaser';
    const authCallback = jest.fn();
    appUtils.doHandleEditorMount({username}, {}, {}, {}, {
        setAdmin: jest.fn(),
        setPromptOpened: jest.fn(),
        callback: authCallback
    }, jest.fn());

    expect(authCallback).toHaveBeenCalled();
})

