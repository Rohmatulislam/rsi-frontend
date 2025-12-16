import { axiosInstance } from "~/lib/axios";

export const changePassword = async (data: {
    currentPassword: string;
    newPassword: string;
}): Promise<{ message: string }> => {
    const res = await axiosInstance.post("/users/me/change-password", data);
    return res.data;
};
