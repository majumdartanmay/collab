import { render, screen, fireEvent } from '@testing-library/react'
import App from '../App';

test("Room is created", () => {
    render(<App/>);
    const collabPromptElem = screen.getByTestId('collab-prompt');
    expect(collabPromptElem).toBeInTheDocument();
})
