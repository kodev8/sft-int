import instance from "../axios";

export const fetchUsers = async () => {
    try {
        const response = await instance.get("/users");
        return response.data;
    } catch (error) {
        throw new Error(error);
    }
}

export const createUser = async (user) => {
    try {
        const response = await instance.post("/users", { ...user });
        return response.data;
    } catch (error) {
        throw new Error(error);
    }
}

