import { render, screen, fireEvent } from '@testing-library/react'
import App from '../App';
import {navigationMocker} from './TestUtils'

beforeAll(() => {
    navigationMocker();
});

test("Room is created", () => {
    render(<App/>);
    const collabPromptElem = screen.getByTestId('collab-prompt');
    expect(collabPromptElem).toBeInTheDocument();
})

