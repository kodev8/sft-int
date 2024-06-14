import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { InputField } from '../components/FormElements';

// check if input field renders correctly
const mockInputField = {
    label: "Full Name",
    name: "name",
    value: "John Doe"
    
};

test("renders input field label", () => {
    render(<InputField {...mockInputField} />);
    const inputFieldLabel = screen.getByText("Full Name");
    expect(inputFieldLabel).toBeInTheDocument();
});

test("renders input field value", () => {
    render(<InputField {...mockInputField} />);
    const inputFieldValue = screen.getByDisplayValue("John Doe");
    expect(inputFieldValue).toBeInTheDocument();
});

test("renders input field", () => {
    render(<InputField {...mockInputField} />);
    const inputField = screen.getByTestId("input-field");
    expect(inputField).toBeInTheDocument();
});

// check if input field is updated when value is changed
test("updates input field value", () => {
    render(<InputField {...mockInputField} />);
    const inputField = screen.getByTestId("input-field");
    expect(inputField).toHaveValue("John Doe");
    inputField.value = "Jane Doe";
    expect(inputField).toHaveValue("Jane Doe");
});