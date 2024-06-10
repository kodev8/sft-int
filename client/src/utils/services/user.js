import instance from "../axios";


export const createUser = async (user) => {
    try {
        const response = await instance.post("/users", { ...user });
        return response.data;
    } catch (error) {
        throw new Error(error);
    }
}

