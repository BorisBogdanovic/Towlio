import {
    Filters,
    UpdatePasswordInput,
    UpdatePasswordResponse,
    UpdateUserResponse,
} from "../types/types";
import { getAuthToken } from "../utils/auth";
import { API_URL } from "./apiConfig";

export const fetchUsers = async (filters: Filters = {}) => {
    const token = getAuthToken();
    const params = new URLSearchParams();

    if (filters.city != null) params.append("city", String(filters.city));
    if (filters.status != null) params.append("status", String(filters.status));
    if (filters.search) params.append("search", filters.search);
    if (filters.page) params.append("page", filters.page.toString());

    const response = await fetch(`${API_URL}/users?${params.toString()}`, {
        method: "GET",
        headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        throw new Error("Failed to fetch users");
    }

    const data = await response.json();
    return data;
};
///////////////////////////////////////////////////////////////////////// DELETE USER
export const deleteUser = async (userId: number) => {
    const token = getAuthToken();
    const response = await fetch(`${API_URL}/user/${userId}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    });
    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Failed to delete user");
    }

    return data;
};

///////////////////////////////////////////////////////////////////////// EDIT IMAGE AND USER INFO

export const updateUser = async (
    data: FormData
): Promise<UpdateUserResponse> => {
    const token = getAuthToken();

    data.append("_method", "PATCH");

    try {
        const response = await fetch(`${API_URL}/user/settings`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: "application/json",
            },
            body: data,
        });

        const json = await response.json();

        if (!response.ok) {
            throw new Error(json.message || "Failed to update user");
        }

        return json as UpdateUserResponse;
    } catch (error) {
        if (error instanceof Error) {
            throw error;
        } else {
            throw new Error("An unknown error occurred");
        }
    }
};
///////////////////////////////////////////////////////////////////////// EDIT USER PASSWORD
export async function updatePassword(
    data: UpdatePasswordInput
): Promise<UpdatePasswordResponse> {
    const token = getAuthToken();

    const response = await fetch(`${API_URL}/user/password`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update password");
    }

    return await response.json();
}
