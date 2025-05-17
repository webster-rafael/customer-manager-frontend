import axios from "axios";

export interface LoginData {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
}

export const loginUser = async (data: LoginData): Promise<LoginResponse> => {
  const response = await axios.post("/login", data);
  return response.data;
};
