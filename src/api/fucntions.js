import api from "./apiClient";

export const loginFunct = async (body) => {
  try {
    const response = await api.post("auth/googleSign", body);
    return response.data;
  } catch (error) {
    throw error;
  }
};