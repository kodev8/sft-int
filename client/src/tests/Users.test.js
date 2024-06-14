import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import Users from '../components/Users'; 
import { createUser, fetchUsers, deleteUser, updateUser } from '../utils/services/user';
import { useToast } from '../utils/useToast';

jest.mock('../constants/loader', () => ({
    ENVIRONMENT: {
        VITE_API_URL: ''
    }
}));
jest.mock('../utils/services/user');
jest.mock('../utils/useToast');

describe('Users component', () => {
    let mockUserJohn, mockUserJane, mockUsers, updatedJohn;
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

        updatedJohn = {
            ...mockUserJohn,
            name: "John Smith",
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

    // DELETE
    // check if user is deleted when delete button is clicked
    describe('Deleting user', () => {
        test('User is deleted successfully', async () => {
        
            fetchUsers.mockResolvedValueOnce([{ name: mockUserJohn.name, email: mockUserJohn.email }]);
            deleteUser.mockResolvedValueOnce({});

            render(<Users />);
            expect(await screen.findByText(mockUserJohn.name)).toBeInTheDocument();
            expect(await screen.findByText(mockUserJohn.email)).toBeInTheDocument();
            const delButton = screen.getByTestId(`delete-${mockUserJohn.email}`)
            expect(delButton).toBeInTheDocument();
            await userEvent.click(screen.getByText('Delete'));
            await waitFor(() => {

                // user is removed from the list
                expect(screen.queryByText(mockUserJohn.name)).not.toBeInTheDocument();
                expect(screen.queryByText('john@email.com')).not.toBeInTheDocument();

                // delete function is called
                expect(deleteUser).toHaveBeenCalledTimes(1);
                expect(deleteUser).toHaveBeenCalledWith(mockUserJohn.email);

                // toast appears
                expect(useToast).toHaveBeenCalledTimes(1);
                expect(useToast).toHaveBeenCalledWith('User deleted successfully', 'success', 'toast', { limit: 1 });

                // no users found message appears
                expect(screen.getByText("No users found")).toBeInTheDocument();
            });
        })

        // check if alert appears if an error occurs when deleting user
        test('Toast appears if an error occurs when deleting user', async () => {
            fetchUsers.mockResolvedValueOnce([{ name: mockUserJohn.name, email: mockUserJohn.email }]);
            deleteUser.mockImplementationOnce(() => Promise.reject(new Error('An error occurred')));
            render(<Users />);
            expect(await screen.findByText(mockUserJohn.name)).toBeInTheDocument();
            expect(await screen.findByText(mockUserJohn.email)).toBeInTheDocument();
            const delButton = screen.getByTestId(`delete-${mockUserJohn.email}`)
            expect(delButton).toBeInTheDocument();
            await userEvent.click(screen.getByText('Delete'));
            await waitFor(() => {
                expect(deleteUser).toHaveBeenCalledTimes(1);
                expect(deleteUser).toHaveBeenCalledWith(mockUserJohn.email);
                expect(useToast).toHaveBeenCalledTimes(1);
                expect(useToast).toHaveBeenCalledWith('An error occurred while deleting user', 'error', 'toast', { limit: 1 });
                expect(screen.getByText(mockUserJohn.name)).toBeInTheDocument();
                expect(screen.getByText(mockUserJohn.email)).toBeInTheDocument();
            });
        })
    });

    describe('Updating user', () => {
        // check if user is updated when edit button is clicked
        test('User is updated successfully (without editing others)', async () => {
            fetchUsers.mockResolvedValueOnce(mockUsers);
            updateUser.mockResolvedValueOnce(updatedJohn);
            render(<Users />);
            // check if users are rendered

            await waitFor( async() => {
            for (const user of mockUsers) {
                expect( await screen.getByText(user.name)).toBeInTheDocument();
                expect(await screen.getByText(user.email)).toBeInTheDocument();
            }});


            // click edit button
            const editButtons = screen.getAllByText('Edit')
            expect(editButtons).toHaveLength(mockUsers.length);
            const editButton = editButtons[0];
            await userEvent.click(editButton);

            // check if cancel and confirm buttons and inputs are rendered
            const cancelButton = screen.getByText('Cancel');
            const confirmButton = screen.getByText('Confirm');
            const nameInput = screen.getByTestId(`input-${mockUserJohn.email}`);
            expect(cancelButton).toBeInTheDocument();
            expect(confirmButton).toBeInTheDocument();
            expect(nameInput).toBeInTheDocument();
            
            // clear input and type new name
            await userEvent.clear(nameInput);
            await userEvent.type(nameInput, updatedJohn.name);

            // checks if state value is being updated
            expect(nameInput.value).toEqual(updatedJohn.name);

            // click confirm button
            await userEvent.click(confirmButton);

            // check if user is updated
            await waitFor(() => {
                expect(updateUser).toHaveBeenCalledTimes(1);
                expect(updateUser).toHaveBeenCalledWith(mockUserJohn.email, { name: updatedJohn.name });
                expect(useToast).toHaveBeenCalledTimes(1);
                expect(useToast).toHaveBeenCalledWith(`${mockUserJohn.email} updated successfully`, 'success', 'toast', { limit: 1 });
                expect(screen.getByText(updatedJohn.name)).toBeInTheDocument();
                expect(screen.queryByText(mockUserJohn.name)).not.toBeInTheDocument();

                expect(screen.getByText(mockUserJane.name)).toBeInTheDocument(); // ensure jane is not updated
                expect(screen.getByText(mockUserJane.email)).toBeInTheDocument();

            })

        });

        // check if alert appears if an error occurs when updating user without changing data
        test('Toast appears when unchanged data submitted', async () => {
            fetchUsers.mockResolvedValueOnce(mockUsers);
            updateUser.mockResolvedValueOnce(204);
            render(<Users />);

            await waitFor( async() => {
            const editButton = screen.getByTestId(`edit-${mockUserJohn.email}`);
            await userEvent.click(editButton);
            const confirmButton = screen.getByTestId(`confirm-${mockUserJohn.email}`);
            await userEvent.click(confirmButton);
            })

            await waitFor(() => {
                expect(updateUser).toHaveBeenCalledTimes(1);
                expect(useToast).toHaveBeenCalledTimes(1);
                expect(useToast).toHaveBeenCalledWith(`${mockUserJohn.email}'s data not changed`, "success", "toast", { limit: 1});
                expect(screen.getByText(mockUserJohn.name)).toBeInTheDocument();
                expect(screen.getByText(mockUserJohn.email)).toBeInTheDocument();
            });
        });

        // check if toast appears when sending empty name
        test('Error Toast appears when sending empty name for edit', async () => {
            fetchUsers.mockResolvedValueOnce(mockUsers);
            updateUser.mockImplementationOnce(() => Promise.reject(new Error('An error occurred')));
            render(<Users />);
            await waitFor( async() => {
            const editButton = screen.getByTestId(`edit-${mockUserJohn.email}`);
            await userEvent.click(editButton);
            const input = screen.getByTestId(`input-${mockUserJohn.email}`);
            await userEvent.clear(input);
            const confirmButton = screen.getByTestId(`confirm-${mockUserJohn.email}`);
            await userEvent.click(confirmButton);
            })

            await waitFor(() => {
                expect(updateUser).toHaveBeenCalledTimes(1);
                expect(useToast).toHaveBeenCalledTimes(1);
                expect(useToast).toHaveBeenCalledWith('Error updating user', 'error', 'user-update-request-error', {limit: 1});
            });
        });


        // check if cancel button returns to user details when clicked
        test('Cancel button returns to user details', async () => {
            updateUser.mockResolvedValueOnce(updatedJohn);
            fetchUsers.mockResolvedValueOnce([mockUserJohn]);
            render(<Users />);
            // check if user is rendered
            const userName = await screen.findByText(mockUserJohn.name);
            const userEmail = await screen.findByText(mockUserJohn.email)
            expect(userName).toBeInTheDocument();
            expect(userEmail).toBeInTheDocument();

            // click edit button
            const editButton = screen.getByText('Edit');
            await userEvent.click(editButton);

        
            // check if cancel and confirm buttons and inputs are rendered
            const cancelButton = screen.getByText('Cancel');
            const confirmButton = screen.getByText('Confirm');
            const nameInput = screen.getByTestId(`input-${mockUserJohn.email}`);
            expect(cancelButton).toBeInTheDocument();
            expect(confirmButton).toBeInTheDocument();
            expect(nameInput).toBeInTheDocument();
            
            // clear input and type new name
            await userEvent.clear(nameInput);
            await userEvent.type(nameInput, updatedJohn.name);
        
            expect(nameInput.value).toEqual(updatedJohn.name);

            // click cancel button
            await userEvent.click(cancelButton);

            // check if user is not updated
            await waitFor(() => {
                expect(updateUser).toHaveBeenCalledTimes(0);
                expect(useToast).toHaveBeenCalledTimes(0);
                expect(screen.getByText(mockUserJohn.name)).toBeInTheDocument();
                expect(screen.queryByText(updatedJohn.name)).not.toBeInTheDocument();
            })

            // ensure form value is also reset
            await userEvent.click(screen.getByText('Edit'));
            await waitFor(() => {
                expect(screen.getByTestId(`input-${mockUserJohn.email}`).value).toEqual(mockUserJohn.name);
            })

        });
    });

})


