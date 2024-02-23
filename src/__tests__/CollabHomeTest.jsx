import { render, screen, fireEvent } from '@testing-library/react'
import * as utils from '../utils/WebrtcUtils'
import userEvent from '@testing-library/user-event'
import {navigationMocker} from './TestUtils'
import CollabHome from '../CollabHome';

/**
 * Check the elements of the <CollabHome>
 * component
 *
 */
test("CollabHome Dom element testing", () => {
    render(<CollabHome/>);

    const usernameElement = screen.getByTestId('username').querySelector('input');
    const roomIdElement = screen.getByTestId('roomid')
    const copyrightElement = screen.getByTestId('copyRightTestId')

    expect(usernameElement).toBeInTheDocument();
    expect(roomIdElement).toBeInTheDocument();
    expect(copyrightElement).toBeInTheDocument();
    
})

/**
 * Check the value of different text fields
 * and see if their value reflects
 *
 */
test('Test collab home change value', () => {

    render(<CollabHome />);

    const testValue = 'testValue';
    const roomIdElement = screen.getByTestId('roomid').querySelector('input');
    const usernameElement = screen.getByTestId('username').querySelector('input');
    
    fireEvent.change(usernameElement, {
      target: {
          value: testValue
      }
    });

    fireEvent.change(roomIdElement, {
      target: {
          value: testValue
      }
    });

    expect(usernameElement).toHaveValue(testValue);
    expect(roomIdElement).toHaveValue(testValue);
});

/**
 * We want to mock the navigation hook before all tests
 *
 */
beforeAll(() => {
    navigationMocker();
});

/**
 * Enter the username and the room and
 * then check the behavior of the submit
 * button
 *
 * @async
 */
test('Handle submit behaviour', async () => {
   
    const testRoomId = "breakingbenjamin";
    const testUsername = 'beatles';
    const useNavigateMock = navigationMocker(`/app/${testRoomId}`);
    const mockAddUser = jest.spyOn(utils, 'addUsers');

    mockAddUser.mockImplementation((username) => {
        expect(testUsername).toBe(username);
    });
        
    render(<CollabHome />);

    const usernameElement = screen.getByTestId('username').querySelector('input');
    const roomIdElement = screen.getByTestId('roomid').querySelector('input');
        
    fireEvent.change(usernameElement, {
      target: {
          value: testUsername
      }
    });

    fireEvent.change(roomIdElement, {
      target: {
          value: testRoomId
      }
    });
        
    await userEvent.click(screen.getByTestId('submit'));
    expect(mockAddUser).toHaveBeenCalled();
    expect(useNavigateMock).toHaveBeenCalled();

});

