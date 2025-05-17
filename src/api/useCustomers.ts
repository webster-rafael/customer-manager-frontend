import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import type { Customer, NewCustomer } from "../interface/customer-interface";

// função para listagem de cliente
const fetchCustomers = async (): Promise<Customer[]> => {
  const token = localStorage.getItem("token") || "";
  const response = await axios.get(
    `${import.meta.env.VITE_API_BASE_URL}/customers`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

const useCustomers = () => {
  const { data, isError, isLoading } = useQuery({
    queryKey: ["customers"],
    queryFn: fetchCustomers,
  });
  return {
    data,
    isError,
    isLoading,
  };
};

// função para criação de cliente
const createCustomer = async (newCustomer: NewCustomer): Promise<Customer> => {
  const token = localStorage.getItem("token") || "";
  const response = await axios.post(
    `${import.meta.env.VITE_API_BASE_URL}/customers`,
    newCustomer,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

const useCreateCustomer = () => {
  const queryClient = useQueryClient();

  const { mutate, isPending, isSuccess, isError } = useMutation({
    mutationFn: createCustomer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
    },
  });

  return {
    mutate,
    isPending,
    isSuccess,
    isError,
  };
};

// função para excluir cliente
const deleteCustomer = async (id: string): Promise<void> => {
  const token = localStorage.getItem("token") || "";
  await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/customers/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

const useDeleteCustomer = () => {
  const queryClient = useQueryClient();

  const { mutate, isPending, isSuccess, isError } = useMutation({
    mutationFn: deleteCustomer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
    },
  });
  return {
    mutate,
    isPending,
    isSuccess,
    isError,
  };
};

// função para atualizar cliente
const updateCustomer = async ({
  id,
  updatedData,
}: {
  id: string;
  updatedData: NewCustomer;
}): Promise<Customer> => {
  const token = localStorage.getItem("token") || "";
  const response = await axios.put(
    `${import.meta.env.VITE_API_BASE_URL}/customers/${id}`,
    updatedData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

const useUpdateCustomer = () => {
  const queryClient = useQueryClient();

  const { mutate, isPending, isSuccess, isError } = useMutation({
    mutationFn: updateCustomer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
    },
  });

  return {
    mutate,
    isPending,
    isSuccess,
    isError,
  };
};

export {
  useCustomers,
  useCreateCustomer,
  useDeleteCustomer,
  useUpdateCustomer,
};
