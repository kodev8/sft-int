import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import Users from '../components/Users'; 
import { createUser } from '../utils/services/user';
import { useToast } from '../utils/useToast';

jest.mock('../constants/loader', () => ({
    ENVIRONMENT: {
        VITE_API_URL: ''
    }
}));
jest.mock('../utils/services/user');
jest.mock('../utils/useToast');

describe('Users component', () => {
    let mockUserJohn, mockUserJane
    beforeEach(() => {
        useToast.mockImplementation(() => {});
        mockUserJohn = {
            name: 'John Doe',
            email: 'johndoe@email.com'
        }
        
        mockUserJane = {
            name: 'Jane Doe',
            email: 'janedoe@email.com'
        }

    });

  afterEach(() => {
    jest.clearAllMocks();
  });

    // CREATE
    // check if new user is added when form is submitted with correct data and inputs are cleared
    describe('Creating user', () => {
        test('New user is added', async () => {
            createUser.mockResolvedValueOnce(mockUserJane);
            render(<Users />);

            // check if form is rendered
            const nameInput = screen.getByLabelText('Full Name');
            const emailInput = screen.getByLabelText('Email');
            expect(nameInput).toBeInTheDocument();
            expect(emailInput).toBeInTheDocument();

            // fill in form and submit
            await userEvent.type(nameInput, mockUserJane.name);
            await userEvent.type(emailInput, mockUserJane.email);
            await userEvent.click(screen.getByText('Add User'));

            // check if user is added

            await waitFor(async() => {
                expect(createUser).toHaveBeenCalledTimes(1);
                expect(createUser).toHaveBeenCalledWith(mockUserJane);
                expect(await screen.findByText(mockUserJane.name)).toBeInTheDocument();
                expect(await screen.findByText(mockUserJane.email)).toBeInTheDocument();
            });

            // check if inputs are cleared
            expect(nameInput.value).toBe('');
            expect(emailInput.value).toBe('');
        });

        // check if alert appears if form is not filled correctly
        test('Toast appears if form is not filled correctly', async () => {
            render(<Users />);
            await userEvent.click(screen.getByText('Add User'));
            expect(useToast).toHaveBeenCalledTimes(1);
            expect(useToast).toHaveBeenCalledWith('Please fill in all fields', 'warn', 'toast', { limit: 1 });
        });

        // check if alert appears if an error occurs when adding user
        test('Toast appears if an error occurs when adding user', async () => {
            createUser.mockRejectedValueOnce(new Error('An error occurred'));
            render(<Users />);
            const nameInput = screen.getByLabelText('Full Name');
            const emailInput = screen.getByLabelText('Email');
            await userEvent.type(nameInput, 'Jane Doe');
            await userEvent.type(emailInput, 'notanemail');
            await userEvent.click(screen.getByText('Add User'));

            expect(createUser).toHaveBeenCalledTimes(1);
            expect(createUser).toHaveBeenCalledWith({ name: 'Jane Doe', email: 'notanemail' });
            expect(useToast).toHaveBeenCalledTimes(1);
            expect(useToast).toHaveBeenCalledWith('An error occurred while creating user', 'error', 'toast', { limit: 1 });
        });
    });

})


