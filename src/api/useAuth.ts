import { useMutation, type UseMutationResult } from "@tanstack/react-query";

export interface LoginData {
  username: string;
  password: string;
}

interface LoginResponse {
  token: string;
}

async function loginUser(data: LoginData): Promise<LoginResponse> {
  const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Email ou senha inválidos");
  }

  return response.json();
}

function useLogin(): UseMutationResult<LoginResponse, Error, LoginData> {
  return useMutation<LoginResponse, Error, LoginData>({
    mutationFn: loginUser,
    onSuccess: (data) => {
      localStorage.setItem("token", data.token);
    },
  });
}

export { useLogin };
