import { render, screen,  } from '@testing-library/react'
import App from '../App';
import { navigationMocker } from './TestUtils'
import * as appUtils from '../utils/AppUtils'

/**
 * We want to mock the navigation hook before all tests
 *
 */
beforeAll(() => {
    navigationMocker();
});

/**
 * Once <App> component is created, we need to verify whether
 * the editor is also being created in the component
 *
 * @async
 */
test("Room is created", async () => {
    render(<App/>);

    const editorContainer = screen.getByTestId('editor-container');
    expect(editorContainer).toBeInTheDocument();
})

/**
 * We want authentication to happen when user 
 * a valid username has been passed and which is
 * present in user's cookies
 *
 * @async
 */
test("check mount behavior when valid username is passed" , async () => {
    const username = 'ceaser';
    const authCallBack = jest.fn();
    appUtils.doHandleEditorMount({username}, {}, {}, {}, {
        setAdmin: jest.fn(),
        setPromptOpened: jest.fn(),
        callback: authCallBack
    }, jest.fn());

    expect(authCallBack).toHaveBeenCalled();
})

/**
 * Handle the situation when there is no username
 * present in the cookies. Ideally user should be sent
 * back to the homepage
 *
 * @async
 */
test("check mount behavior when there is no username" , async () => {
    const username = '';
    const authCallBack = jest.fn();
    const navigate = jest.fn();
    appUtils.doHandleEditorMount({username}, {}, {}, {}, {
        setAdmin: jest.fn(),
        setPromptOpened: jest.fn(),
        callback: authCallBack
    }, navigate);

    expect(authCallBack).toHaveBeenCalledTimes(0);
    expect(navigate).toHaveBeenCalledTimes(1);
})

/**
 * When an empty password and empty room ID has been supplied
 *
 */
test("Test Room state validation when password is null and room is null", () => {
    const errorHandler = jest.fn();
    appUtils.validateRoomState('', '', errorHandler);
    expect(errorHandler).toHaveBeenCalledTimes(1);
});

/**
 * When a room id is present, but no password has been given
 *
 */
test("Test Room state validation when password is not null and room is null", () => {
    const errorHandler = jest.fn();
    const roomId = "";
    const pwd = "pwdTest";
    appUtils.validateRoomState(pwd, roomId, errorHandler);
    expect(errorHandler).toHaveBeenCalledTimes(1);
});

/**
 * When both password and room ID have been supplied
 *
 */
test("Test Room state validation when password is not null and room is not null", () => {
    const errorHandler = jest.fn();
    const roomId = "roomId";
    const pwd = "pwdTest";
    appUtils.validateRoomState(pwd, roomId, errorHandler);
    expect(errorHandler).toHaveBeenCalledTimes(0);
});
