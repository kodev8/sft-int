import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import User from "../components/UserCard";


describe('User card tests', () => {

    let mockUser
    beforeEach(() => {

            mockUser = {  
                name: "John Doe",
                email: "johndoe@email.com"
            };

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
})





