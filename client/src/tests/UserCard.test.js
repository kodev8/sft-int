import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import User from "../components/UserCard";


describe('User card tests', () => {

    let mockUser, mockHandleDelete;
    beforeEach(() => {

            mockUser = {  
                name: "John Doe",
                email: "johndoe@email.com"
            };

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





