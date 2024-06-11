import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import Users from '../components/Users'; 
import { createUser, fetchUsers } from '../utils/services/user';
import { useToast } from '../utils/useToast';

jest.mock('../constants/loader', () => ({
    ENVIRONMENT: {
        VITE_API_URL: ''
    }
}));
jest.mock('../utils/services/user');
jest.mock('../utils/useToast');

describe('Users component', () => {
    let mockUserJohn, mockUserJane, mockUsers;
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

        mockUsers = [mockUserJohn, mockUserJane]
    });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Reading user data', () => {
    // check if no users found is render when users is empty
    test('No users found', async () => {
        fetchUsers.mockResolvedValueOnce([]);
        render(<Users />);
        expect(await screen.findByText("No users found")).toBeInTheDocument();
    });

    // check if multiple users are rendered when users is not empty
    test('Users are rendered', async () => {
        fetchUsers.mockResolvedValueOnce(mockUsers);
        render(<Users />);

        await waitFor( async() => {
            for (const user of mockUsers) {
                expect(screen.getByText(user.name)).toBeInTheDocument();
                expect(screen.getByText(user.email)).toBeInTheDocument();
            }
            expect(screen.queryByText("No users found")).not.toBeInTheDocument();
            expect(fetchUsers).toHaveBeenCalledTimes(1);
        });
    }); 

    // check if form rendered is on initial render
    test('Form is rendered', async () => {
        fetchUsers.mockResolvedValueOnce([]);
        render(<Users />);
        expect(await screen.findByText('Full Name')).toBeInTheDocument();
        expect(await screen.findByText('Email')).toBeInTheDocument();
        expect(screen.getByText('Add User')).toBeInTheDocument();
    });

    test('Error message is displayed when an error occurs while fetching users', async () => {
        fetchUsers.mockImplementationOnce(() => Promise.reject(new Error('An error occurred')));
        render(<Users />);
        await waitFor(() => {
            expect(fetchUsers).toHaveBeenCalledTimes(1);
            expect(useToast).toHaveBeenCalledTimes(1);
            expect(useToast).toHaveBeenCalledWith('An error occurred', 'error', 'toast', { limit: 1 });
        })
    });
     // check if active user appears when user is clicked
     test('Active user appears when user is clicked', async () => {
        fetchUsers.mockResolvedValueOnce(mockUsers);
        render(<Users />);

        
        const userName = await screen.findByText(mockUsers[0].name); // the user to click -- john doe
        for (const user of mockUsers) {
            expect(screen.getByText(user.name)).toBeInTheDocument();
            expect(screen.getByText(user.email)).toBeInTheDocument();
        }
        

        // check if form is rendered
        expect(await screen.getByText("Add User")).toBeInTheDocument();
        expect(await screen.getByLabelText("Email")).toBeInTheDocument();
        expect(await screen.getByLabelText("Full Name")).toBeInTheDocument();

        // click user
        await userEvent.click(userName);

        await waitFor( async() => {
            // check if user is active
            const profile = await screen.findByText('Profile');
            const backButton = await screen.findByText('Back');

            expect(profile).toBeInTheDocument();
            expect(backButton).toBeInTheDocument();
            
            expect(await screen.getByText(mockUserJohn.name)).toBeInTheDocument();
            expect(await screen.getByText(mockUserJohn.email)).toBeInTheDocument();

            // ensure form is not rendered
            expect(screen.queryByLabelText('Full Name')).not.toBeInTheDocument();
            expect(screen.queryByLabelText('Email')).not.toBeInTheDocument();
            expect(screen.queryByText('Add User')).not.toBeInTheDocument();
        })

        await userEvent.click(screen.getByText('Back'));

        await waitFor(() => {
            // check if user is not active
            expect(screen.queryByText('Profile')).not.toBeInTheDocument();
            expect(screen.queryByText('Back')).not.toBeInTheDocument();
            expect(screen.queryByText(mockUserJohn.name)).toBeInTheDocument();
            expect(screen.queryByText(mockUserJohn.email)).toBeInTheDocument();
            
            expect(screen.queryByLabelText('Full Name')).toBeInTheDocument();
            expect(screen.queryByLabelText('Email')).toBeInTheDocument();
            expect(screen.queryByText('Add User')).toBeInTheDocument();
        })
    });
    
    });

    // CREATE
    // check if new user is added when form is submitted with correct data and inputs are cleared
    describe('Creating user', () => {
        
        beforeEach(() => {
            fetchUsers.mockResolvedValueOnce([]);
        });

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


