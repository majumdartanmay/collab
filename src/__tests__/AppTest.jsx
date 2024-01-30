import { render, screen,  } from '@testing-library/react'
import App from '../App';
import { navigationMocker } from './TestUtils'
import * as appUtils from '../utils/appUtils'

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

test("check mount behavior when valid username is passed" , async () => {
    const username = 'ceaser';
    const authcallback = jest.fn();
    appUtils.doHandleEditorMount({username}, {}, {}, {}, {
        setadmin: jest.fn(),
        setpromptopened: jest.fn(),
        callback: authcallback
    }, jest.fn());

    expect(authcallback).toHaveBeenCalled();
})

test("check mount behavior when there is no username" , async () => {
    const username = '';
    const authcallback = jest.fn();
    const navigate = jest.fn();
    appUtils.doHandleEditorMount({username}, {}, {}, {}, {
        setadmin: jest.fn(),
        setpromptopened: jest.fn(),
        callback: authcallback
    }, navigate);

    expect(authcallback).toHaveBeenCalledTimes(0);
    expect(navigate).toHaveBeenCalledTimes(1);
})

