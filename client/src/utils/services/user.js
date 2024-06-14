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

export const deleteUser = async (email) => {
    try {
        const response = await instance.delete(`/users`,{data: {email}});
        return response.data;
    } catch (error) {
        throw new Error(error);
    }
}

export const updateUser = async (email, data) => {
    try {
        const response = await instance.patch(`/users`,  {email, ...data});
        if (response.status === 204){
            response.data = 204;
        }
        return response.data;
    } catch (error) {
        throw new Error(error);
    }
}

