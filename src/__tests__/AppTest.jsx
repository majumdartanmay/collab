import { render, screen,  } from '@testing-library/react'
import App from '../App';
import { navigationMocker } from './TestUtils'
import * as appUtils from '../utils/AppUtils'

beforeAll(() => {
    navigationMocker();
});

test("Room is created", async () => {
    render(<App/>);

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

test("Test Room state validation when password is null and room is null", () => {
    const errorHandler = jest.fn();
    appUtils.validateRoomState('', '', errorHandler);
    expect(errorHandler).toBeCalledTimes(1);
});

test("Test Room state validation when password is not null and room is null", () => {
    const errorHandler = jest.fn();
    const roomId = "";
    const pwd = "pwdTest";
    appUtils.validateRoomState(pwd, roomId, errorHandler);
    expect(errorHandler).toBeCalledTimes(1);
});

test("Test Room state validation when password is not null and room is not null", () => {
    const errorHandler = jest.fn();
    const roomId = "roomId";
    const pwd = "pwdTest";
    appUtils.validateRoomState(pwd, roomId, errorHandler);
    expect(errorHandler).toBeCalledTimes(0);
});
