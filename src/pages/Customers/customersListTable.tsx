import * as React from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import type { Customer } from "../../interface/customer-interface";
import { useCustomers, useDeleteCustomer } from "../../api/useCustomers";
import FormCreateCustomer from "../CreateCustomers/components/formCreateUser";
import { GeneratePdf } from "./components/generatePdf";

interface Column {
  id: string;
  label: string;
  minWidth?: number;
  align?: "right";
  format?: (value: unknown, row: Customer) => string;
}

const columns: readonly Column[] = [
  { id: "name", label: "Nome", minWidth: 170 },
  { id: "email", label: "Email", minWidth: 200 },
  { id: "phone", label: "Telefone", minWidth: 100 },
  {
    id: "active",
    label: "Ativo",
    minWidth: 50,
    format: (_value, row) => (row.active ? "Sim" : "Não"),
  },
  {
    id: "zip_code",
    label: "CEP",
    minWidth: 100,
    format: (_value, row) => row.address?.zip_code ?? "",
  },
  {
    id: "city_state",
    label: "Cidade/Estado",
    minWidth: 140,
    format: (_value, row) =>
      `${row.address?.city ?? ""}, ${row.address?.state ?? ""}`,
  },
  {
    id: "street_info",
    label: "Endereço",
    minWidth: 140,
    format: (_value, row) =>
      `${row.address?.street ?? ""}, ${row.address?.number ?? ""}, ${row.address?.neighborhood ?? ""}`,
  },
  {
    id: "actions",
    label: "Ações",
    minWidth: 100,
  },
];

export const CustomersListTable = () => {
  const { data, isLoading, isError } = useCustomers();
  const { mutate: deleteCustomer } = useDeleteCustomer();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const [editingCustomer, setEditingCustomer] = React.useState<Customer | null>(
    null
  );
  const [openEditDialog, setOpenEditDialog] = React.useState(false);

  const handleEditClick = (customer: Customer) => {
    setEditingCustomer(customer);
    setOpenEditDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenEditDialog(false);
    setEditingCustomer(null);
  };

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  if (isLoading) {
    return (
      <Paper
        className=" bg-slate-900"
        sx={{ width: "100%", overflow: "hidden" }}
      >
        <div className="p-6 text-slate-50">Carregando clientes...</div>
      </Paper>
    );
  }

  if (isError) {
    return (
      <Paper
        className=" bg-slate-900"
        sx={{ width: "100%", overflow: "hidden" }}
      >
        <div className="p-6 text-red-500">Erro ao carregar clientes.</div>
      </Paper>
    );
  }

  const rows = data || [];
  const count = rows.length;
  const paginatedRows = rows.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <Paper className="bg-slate-900" sx={{ width: "100%", overflow: "hidden" }}>
      <div className="flex justify-between items-center px-3">
        <h3 className="text-2xl font-bold p-4 text-slate-50">
          Todos os Clientes
        </h3>
        <GeneratePdf />
      </div>
      <TableContainer
        className="bg-slate-100 scrollbar-hide"
        sx={{ maxHeight: 440 }}
      >
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  className="bg-slate-900 text-slate-50"
                  align={column.align}
                  style={{ minWidth: column.minWidth }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedRows.map((customer) => (
              <TableRow hover role="checkbox" tabIndex={-1} key={customer.id}>
                {columns.map((column) => {
                  if (column.id === "actions") {
                    return (
                      <TableCell key={column.id} align={column.align}>
                        <div className="flex gap-2">
                          <IconButton
                            color="primary"
                            onClick={() => handleEditClick(customer)}
                            size="small"
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                          <IconButton
                            color="error"
                            onClick={() => deleteCustomer(customer.id)}
                            size="small"
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </div>
                      </TableCell>
                    );
                  }

                  const value = customer[column.id as keyof Customer];
                  return (
                    <TableCell key={column.id} align={column.align}>
                      {column.format
                        ? column.format(value, customer)
                        : (value as string | number | undefined)}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        className="bg-slate-900 text-zinc-50"
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={count}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

      <Dialog
        open={openEditDialog}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Editar Cliente</DialogTitle>
        <DialogContent>
          <FormCreateCustomer
            existingCustomer={editingCustomer!}
            onClose={handleCloseDialog}
          />
        </DialogContent>
      </Dialog>
    </Paper>
  );
};
