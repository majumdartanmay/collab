import { render, screen, fireEvent } from '@testing-library/react'
import * as utils from '../utils/WebrtcUtils'
import userEvent from '@testing-library/user-event'
import {navigationMocker} from './TestUtils'
import CollabHome from '../CollabHome';

test("CollabHome Dom element testing", () => {
    render(<CollabHome/>);

    const usernameElement = screen.getByTestId('username').querySelector('input');
    const roomIdElement = screen.getByTestId('roomid')
    const copyrightElement = screen.getByTestId('copyRightTestId')

    expect(usernameElement).toBeInTheDocument();
    expect(roomIdElement).toBeInTheDocument();
    expect(copyrightElement).toBeInTheDocument();
    
})

test('Test collab home change value', () => {

    render(<CollabHome />);

    const testValue = 'testValue';

    const usernameElement = screen.getByTestId('username').querySelector('input');
    const roomIdElement = screen.getByTestId('roomid').querySelector('input');
    
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

beforeAll(() => {
    navigationMocker();
});

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

