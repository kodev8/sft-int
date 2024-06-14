import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import UserPage from '../components/UserPage';

const mockUser = {  
    name: "John Doe",
    email: "johndoe@email.com"
};


// check if user details are rendered (name, email)
test('renders user details when a user card is clicked', () => {
    render(<UserPage user={mockUser} />);
    const name = screen.getByText(mockUser.name);
    const email = screen.getByText(mockUser.email);
    expect(name).toBeInTheDocument();
    expect(email).toBeInTheDocument();
});


// check if back button appears when user card is clicked
test('renders back button when a user card is clicked', () => {
    log = jest.fn()
    render(<UserPage user={mockUser} setActiveUser={() => log('clicked')}/>);
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent('Back');
    button.click();
    expect(log).toHaveBeenCalledWith('clicked')
});


