import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import User from "../components/UserCard";
import * as toastLib from '../utils/useToast';


describe('User card tests', () => {

    let mockUser, mockHandleDelete, mockHandleUpdate, mockUpdatedUser;
    beforeEach(() => {

            mockUser = {  
                name: "John Doe",
                email: "johndoe@email.com"
            };

            mockUpdatedUser = {
                ...mockUser,
                name: "Jane Doe",
            }

            mockHandleUpdate = jest.fn();
            mockHandleDelete = jest.fn();

    })

    afterEach(() => {
        jest.clearAllMocks();
    })

    // check if user card renders user details (name, email, edit button, delete button)
    test('User card renders user details', () => {
        render(<User user={mockUser} />);
        const name = screen.getByText(mockUser.name);
        const email = screen.getByText(mockUser.email);

        const editButton = screen.getByText('Edit');
        const deleteButton = screen.getByText('Delete');

        expect(name).toBeInTheDocument();
        expect(email).toBeInTheDocument();
        expect(editButton).toBeInTheDocument();
        expect(deleteButton).toBeInTheDocument();
    })

    // check if cancel, confirm buttons appear when edit button is clicked (inputs should be prefilled with user details)
    test('Clicking edit button shows cancel and confirm buttons', async() => {
        render(<User user={mockUser} />);
        const editButton = screen.getByText('Edit');
        await userEvent.click(editButton);
        const cancelButton = screen.getByText('Cancel');
        const confirmButton = screen.getByText('Confirm');
        expect(cancelButton).toBeInTheDocument();
        expect(confirmButton).toBeInTheDocument();
    })

    // check if cancel button returns to user details when clicked
    test('Cancel button returns to user details', async() => {
        render(<User user={mockUser} />);
        const editButton = screen.getByText('Edit');
        await userEvent.click(editButton);
        const cancelButton = screen.getByText('Cancel');
        await userEvent.click(cancelButton);
        const name = screen.getByText(mockUser.name);
        const email = screen.getByText(mockUser.email);
        expect(name).toBeInTheDocument();
        expect(email).toBeInTheDocument();
    })


    // check if user details are updated when confirm button is clicked (inputs should be cleared)
    test('Confirm button updates calls update user', async() => {
        render(<User user={mockUser} handleUpdate={mockHandleUpdate} />);
        const editButton = screen.getByText('Edit');
        await userEvent.click(editButton);

        const nameInput = screen.getByTestId(`input-${mockUser.email}`);

        await userEvent.clear(nameInput);
        await userEvent.type(nameInput, mockUpdatedUser.name);
        expect(nameInput).toHaveValue(mockUpdatedUser.name);

        const confirmButton = screen.queryByText('Confirm');
        await userEvent.click(confirmButton);

        await waitFor(() => {
            expect(mockHandleUpdate).toHaveBeenCalledTimes(1); // update logic tested for Users.jsx
            expect(mockHandleUpdate).toHaveBeenCalledWith(mockUser.email, {name: mockUpdatedUser.name});

        });

        const name = screen.getByText(mockUser.name);
        expect(name).toBeInTheDocument(); // since user is not updated in this component
    })

    test("Error message is displayed when update fails", async() => {
        jest.spyOn(toastLib, 'useToast').mockImplementation(() => {})

        mockHandleUpdate.mockImplementation(() => Promise.reject(new Error('Error updating user')));
        render(<User user={mockUser} handleUpdate={mockHandleUpdate} />);
        const editButton = screen.getByText('Edit');
        await userEvent.click(editButton);

        await waitFor(async () => {
            const nameInput = screen.getByTestId(`input-${mockUser.email}`);
            await userEvent.clear(nameInput);
            await userEvent.type(nameInput, mockUpdatedUser.name);
            expect(nameInput).toHaveValue(mockUpdatedUser.name);

        })

        mockHandleUpdate.mockImplementation(() => {
            throw new Error('Error updating user');
        })

        const confirmButton = screen.queryByText('Confirm');
        await userEvent.click(confirmButton);

        expect(toastLib.useToast).toHaveBeenCalledTimes(1);
        expect(toastLib.useToast).toHaveBeenCalledWith('Error updating user', 'error', 'user-update-request-error', {limit: 1});
       
    });

    test('Delete button calls delete user', async() => {
        const {container, unmount } = render(<User user={mockUser} handleDelete={mockHandleDelete} />);
        mockHandleDelete.mockImplementation(() => {
            unmount()
        });

        const deleteButton = screen.queryByText('Delete');
        await userEvent.click(deleteButton);
        expect(mockHandleDelete).toHaveBeenCalledTimes(1); // delete logic tested for Users.jsx

        expect(container).toBeEmptyDOMElement();
        expect(screen.queryByText(mockUser.name)).not.toBeInTheDocument();
        expect(screen.queryByText(mockUser.email)).not.toBeInTheDocument();
    })
})





