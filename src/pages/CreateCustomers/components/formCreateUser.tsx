import React, { useState } from "react";
import {
  TextField,
  MenuItem,
  Button,
  Paper,
  Typography,
  FormControl,
  FormHelperText,
  Select,
  FormLabel,
  Snackbar,
  Alert,
  type SelectChangeEvent,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import SaveIcon from "@mui/icons-material/Save";
import CloseIcon from "@mui/icons-material/Close";
import CheckIcon from "@mui/icons-material/Check";
import { z, ZodError } from "zod";
import {
  useCreateCustomer,
  useUpdateCustomer,
} from "../../../api/useCustomers";
import type { Customer } from "../../../interface/customer-interface";
import { AxiosError } from "axios";

const estados = [
  "AC",
  "AL",
  "AP",
  "AM",
  "BA",
  "CE",
  "DF",
  "ES",
  "GO",
  "MA",
  "MT",
  "MS",
  "MG",
  "PA",
  "PB",
  "PR",
  "PE",
  "PI",
  "RJ",
  "RN",
  "RS",
  "RO",
  "RR",
  "SC",
  "SP",
  "SE",
  "TO",
] as const;

const customerSchema = z.object({
  nome: z.string().min(3, "Nome deve ter ao menos 3 caracteres"),
  email: z.string().email("Email inválido"),
  telefone: z
    .string()
    .min(10, "Telefone deve ter ao menos 11 caracteres")
    .regex(/^(\(?\d{2}\)?\s?\d{4,5}-?\d{4})$/, "Formato de telefone inválido"),
  rua: z.string().min(1, "Rua é obrigatória"),
  numero: z.string().min(1, "Número é obrigatório"),
  bairro: z.string().min(1, "Bairro é obrigatório"),
  cidade: z.string().min(1, "Cidade é obrigatória"),
  estado: z.enum([...estados] as [string, ...string[]], {
    errorMap: (issue, ctx) => {
      if (issue.code === z.ZodIssueCode.invalid_enum_value) {
        return { message: "Estado inválido" };
      }
      return { message: ctx.defaultError };
    },
  }),
  cep: z.string().regex(/^\d{5}-\d{3}$/, "CEP deve estar no formato 00000-000"),
});

type FormData = z.infer<typeof customerSchema>;
type FormErrors = Partial<Record<keyof FormData, string>>;
type ErrorResponse = { message: string };

type FormCreateCustomerProps = {
  existingCustomer?: Customer;
  onSubmitEdit?: (data: FormData) => void;
  onClose?: () => void;
};

export default function FormCreateCustomer({
  existingCustomer,
  onSubmitEdit,
  onClose,
}: FormCreateCustomerProps) {
  const isEditing = !!existingCustomer;

  const [form, setForm] = useState<FormData>({
    nome: existingCustomer?.name ?? "",
    email: existingCustomer?.email ?? "",
    telefone: existingCustomer?.phone ?? "",
    rua: existingCustomer?.address?.street ?? "",
    numero: existingCustomer?.address?.number ?? "",
    bairro: existingCustomer?.address?.neighborhood ?? "",
    cidade: existingCustomer?.address?.city ?? "",
    estado: existingCustomer?.address?.state ?? "",
    cep: existingCustomer?.address?.zip_code ?? "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [alertInfo, setAlertInfo] = useState({
    open: false,
    severity: "success" as "success" | "error",
    message: "",
  });

  const { mutate, isPending } = useCreateCustomer();
  const { mutate: updateCustomer, isPending: isUpdating } = useUpdateCustomer();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSelectChange = (e: SelectChangeEvent<string>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const showAlert = (severity: "success" | "error", message: string) => {
    setAlertInfo({ open: true, severity, message });
  };

  const resetForm = () => {
    setForm({
      nome: "",
      email: "",
      telefone: "",
      rua: "",
      numero: "",
      bairro: "",
      cidade: "",
      estado: "",
      cep: "",
    });
    setErrors({});
  };

  const handleCancel = () => {
    onClose?.();
    resetForm();
  };

  const extractErrorMessage = (error: unknown): string => {
    if (error instanceof AxiosError) {
      return error.response?.data?.message || error.message;
    }
    if (typeof error === "object" && error && "message" in error) {
      return (error as ErrorResponse).message;
    }
    return "Erro desconhecido";
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const validated = customerSchema.parse(form);
      setErrors({});

      const customerData = {
        name: validated.nome,
        email: validated.email,
        phone: validated.telefone,
        address: {
          street: validated.rua,
          number: validated.numero,
          neighborhood: validated.bairro,
          city: validated.cidade,
          state: validated.estado,
          zip_code: validated.cep,
        },
      };

      const onSuccess = () => {
        showAlert(
          "success",
          isEditing
            ? "Cliente atualizado com sucesso!"
            : "Cliente cadastrado com sucesso!"
        );
        resetForm();
        onSubmitEdit?.(validated);
      };

      const onError = (error: unknown) => {
        const message = extractErrorMessage(error).toLowerCase();
        const fieldErrors: FormErrors = {};

        if (message.includes("email")) {
          fieldErrors.email = "Email já cadastrado";
        }

        setErrors(fieldErrors);
        showAlert("error", fieldErrors.email || "Erro ao salvar cliente.");
      };

      if (isEditing && existingCustomer) {
        updateCustomer(
          { id: existingCustomer.id, updatedData: customerData },
          { onSuccess, onError }
        );
      } else {
        mutate(customerData, { onSuccess, onError });
      }
    } catch (err) {
      if (err instanceof ZodError) {
        const fieldErrors: FormErrors = {};
        err.errors.forEach((issue) => {
          const field = issue.path[0] as keyof FormData;
          fieldErrors[field] ??= issue.message;
        });
        setErrors(fieldErrors);
      }
    }
  };

  const textFieldStyles = {
    color: "#62748e",
    input: {
      color: "white",
      "::placeholder": { color: "#62748e", opacity: 1 },
      "&:-webkit-autofill": {
        WebkitBoxShadow: "0 0 0 1000px #62748e inset",
        WebkitTextFillColor: "white",
        transition: "background-color 5000s ease-in-out 0s",
      },
    },
    label: { color: "#62748e" },
  };

  const fields: { name: keyof FormData; label: string }[] = [
    { name: "nome", label: "Nome Completo" },
    { name: "email", label: "E-mail" },
    { name: "telefone", label: "Telefone" },
    { name: "rua", label: "Rua" },
    { name: "numero", label: "Número" },
    { name: "bairro", label: "Bairro" },
    { name: "cidade", label: "Cidade" },
    { name: "cep", label: "CEP" },
  ];

  return (
    <Paper className="bg-slate-900 text-slate-50" sx={{ padding: 4 }}>
      <Typography variant="h5" gutterBottom>
        {isEditing ? "Editar Cliente" : "Novo Cliente"}
      </Typography>

      <form onSubmit={handleSubmit}>
        <Grid display="grid" gridTemplateColumns="repeat(2, 1fr)" gap={2}>
          {fields.map(({ name, label }) => (
            <FormControl
              fullWidth
              error={!!errors[name]}
              className="space-y-2"
              key={name}
            >
              <FormLabel className="text-slate-50 font-semibold">
                {label}
              </FormLabel>
              <TextField
                name={name}
                className="border rounded-md"
                value={form[name]}
                onChange={handleChange}
                placeholder={label}
                sx={textFieldStyles}
                aria-label={label}
              />
              {errors[name] && <FormHelperText>{errors[name]}</FormHelperText>}
            </FormControl>
          ))}

          <FormControl fullWidth error={!!errors.estado} className="space-y-2">
            <FormLabel className="text-slate-50 font-semibold">
              Estado
            </FormLabel>
            <Select
              name="estado"
              className="border rounded-md"
              value={form.estado}
              onChange={handleSelectChange}
              displayEmpty
              renderValue={(v) => (v ? v : "Selecione um estado")}
              sx={textFieldStyles}
              aria-label="Estado"
            >
              <MenuItem value="">Selecione um estado</MenuItem>
              {estados.map((uf) => (
                <MenuItem key={uf} value={uf}>
                  {uf}
                </MenuItem>
              ))}
            </Select>
            {errors.estado && <FormHelperText>{errors.estado}</FormHelperText>}
          </FormControl>
        </Grid>

        <div className="flex justify-end mt-4 gap-2">
          <Button
            variant="outlined"
            color="secondary"
            onClick={handleCancel}
            disabled={isPending || isUpdating}
            aria-label="Cancelar"
          >
            <CloseIcon /> Cancelar
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={isPending || isUpdating}
            aria-label={isEditing ? "Salvar alterações" : "Salvar cliente"}
          >
            <SaveIcon />
            {isPending || isUpdating
              ? "Salvando..."
              : isEditing
                ? "Salvar Alterações"
                : "Salvar Cliente"}
          </Button>
        </div>

        <Snackbar
          open={alertInfo.open}
          autoHideDuration={4000}
          onClose={() => setAlertInfo((prev) => ({ ...prev, open: false }))}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        >
          <Alert
            icon={
              alertInfo.severity === "success" ? (
                <CheckIcon fontSize="inherit" />
              ) : undefined
            }
            severity={alertInfo.severity}
            variant="filled"
            onClose={() => setAlertInfo((prev) => ({ ...prev, open: false }))}
            sx={{ width: "100%" }}
          >
            {alertInfo.message}
          </Alert>
        </Snackbar>
      </form>
    </Paper>
  );
}

export { FormCreateCustomer };
