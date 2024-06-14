import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Button } from '../components/FormElements';

// check if button renders correctly and calls onClick function

const mockButtonData = {
    label: "b1",
    color: "any-color",
    type: "any-type",
    callText: "i was clicked",
};

beforeAll(() => {
    console.log("Running Button tests!");
});

beforeEach(() => {
    jest.spyOn(console, 'log').mockImplementation(() => {});
});

afterEach(() => {
    jest.clearAllMocks();
});

afterAll(() => {
    console.log("Button tests completed!");
});

test('renders button with custom color type, and is clicked', () => {
    render(<Button label={mockButtonData.label} color={mockButtonData.color} type={mockButtonData.type} onClick={() => console.log(mockButtonData.callText)}/>);
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent(mockButtonData.label);
    expect(button).toHaveClass(mockButtonData.color);
    expect(button).toHaveAttribute('type', mockButtonData.type);
    button.click();
    expect(console.log).toHaveBeenCalledWith(mockButtonData.callText);
    expect(console.log).toHaveBeenCalledTimes(1);
});

// chheck if button renders default color and type
test('renders button with default color and type, and is clicked', () => {
    render(<Button label={mockButtonData.label} onClick={() => console.log(mockButtonData.callText)}/>);
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent(mockButtonData.label);
    expect(button).toHaveClass("bg-purple-500 hover:bg-purple-400");
    expect(button).toHaveAttribute('type', 'button');
    button.click();
    expect(console.log).toHaveBeenCalledWith(mockButtonData.callText);
    expect(console.log).toHaveBeenCalledTimes(1);
});