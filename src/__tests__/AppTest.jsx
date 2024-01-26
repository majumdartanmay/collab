import { render, screen, fireEvent } from '@testing-library/react'
import App from '../App';

test("When room is created for first time.", () => {
    render(<App/>);

    const usernameElement = screen.getByTestId('username').querySelector('input');
    const roomIdElement = screen.getByTestId('roomid')
    const copyrightElement = screen.getByTestId('copyRightTestId')

    expect(usernameElement).toBeInTheDocument();
    expect(roomIdElement).toBeInTheDocument();
    expect(copyrightElement).toBeInTheDocument();
    
})
