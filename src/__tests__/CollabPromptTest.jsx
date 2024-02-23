import { render, fireEvent, screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { navigationMocker } from './TestUtils'
import CollabPrompt from '../utils/CollabPrompt'


/**
 * We want to mock the navigation hook before all tests
 *
 */
beforeAll(() => {
    navigationMocker();
});


/**
 * We are checking if some of the essential components
 * are present in <CollabPrompt>
 *
 */
test("Check for basic components", () => {
    const createPasswordProps = {
        prompt: "test",
        processPwd: jest.fn(),
        room: null
    }
    const open = true;
    const roomHash  = "testHash";
    const { getByTestId } = render(<CollabPrompt data = {createPasswordProps} open = {open} room = { roomHash} />);

    const collabPromptElem = getByTestId('collab-prompt-container');
    expect(collabPromptElem).toBeInTheDocument();

});

/**
 * There are different dialogues for room creators (admin)
 * and room users. Based on the input, we will check if the
 * correct UI is being populated
 *
 */
test("Check if correct dialog is created", () => {
    const createPasswordProps = {
        prompt: "test",
        processPwd: jest.fn(),
        room: null
    }
    const open = true;
    const roomHash  = "testHash";
    const { getByText } = render(<CollabPrompt data = {createPasswordProps} open = {open} room = { roomHash} />);
    expect(getByText(createPasswordProps.prompt)).toBeInTheDocument();
});

/**
 * Check the behavior of the submit button.
 * The submit button depends on the input of
 * the user.
 *
 * @async
 */
test("Is submit being called correctly", async () => {
    const roomHash  = "testHash";
    const testPwd = "test12345";
    const processPwd = jest.fn();
    const createPasswordProps = {
        prompt: "test",
        processPwd,
        room: roomHash
    }
    const open = true;
    render(<CollabPrompt data = {createPasswordProps} open = {open} room = { roomHash} />);
    const roomIdElement = screen.getByTestId('roomPwd').querySelector('input');
    fireEvent.change(roomIdElement, {
      target: {
          value: testPwd
      }
    });

    await userEvent.click(screen.getByTestId('collab-prompt-ok'));
    expect(processPwd).toHaveBeenCalledTimes(1);
});

/**
 * Check the behavior of the cancel button
 *
 * @async
 */
test("Is cancel being called correctly", async () => {
    const roomHash  = "testHash";
    const testPwd = "test12345";
    const processPwd = jest.fn();
    const useNavigateMock = navigationMocker('/');
    const createPasswordProps = {
        prompt: "test",
        processPwd,
        room: roomHash
    }
    const open = true;
    render(<CollabPrompt data = {createPasswordProps} open = {open} room = { roomHash} />);
    const roomIdElement = screen.getByTestId('roomPwd').querySelector('input');
    fireEvent.change(roomIdElement, {
      target: {
          value: testPwd
      }
    });

    await userEvent.click(screen.getByTestId('collab-prompt-cancel'));
    expect(processPwd).toHaveBeenCalledTimes(0);
    expect(useNavigateMock).toHaveBeenCalled();
});
