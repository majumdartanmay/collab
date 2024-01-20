import { render, screen } from '@testing-library/react'
import CollabHome from '../CollabHome';

test("CollabHome Dom element testing", () => {
    render(<CollabHome/>);

    const usernameElement = screen.getByTestId('username')
    const roomIdElement = screen.getByTestId('roomid')

    expect(usernameElement).toBeInTheDocument();
    expect(roomIdElement).toBeInTheDocument();
})
