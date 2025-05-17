import * as React from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import { Button } from "@mui/material";
import { useCustomers } from "../../../api/useCustomers";
import type { Customer } from "../../../interface/customer-interface";
import { Link } from "react-router-dom";

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
];

export const CustomersRecentsTable = () => {
  const { data, isLoading, isError } = useCustomers();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

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

  // mostrar apenas os clientes criados nos ultimos 3 dias
  const now = new Date();
  const threeDaysAgo = new Date();
  threeDaysAgo.setDate(now.getDate() - 3);

  const recentCustomers = rows.filter((customer) => {
    if (!customer.created_at) return false;
    const createdAt = new Date(customer.created_at);
    return createdAt >= threeDaysAgo;
  });

  const count = recentCustomers.length;

  const paginatedRows = recentCustomers.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <Paper
      className="mt-10 bg-slate-900"
      sx={{ width: "100%", overflow: "hidden" }}
    >
      <div className="flex justify-between items-center px-3">
        <h3 className="text-2xl font-bold p-4 text-slate-50">
          Clientes Recentes
        </h3>
        <Link to="/customers">
          <Button
            className="bg-slate-700 hover:bg-slate-600 border-zinc-500 border"
            variant="contained"
          >
            Ver todos
          </Button>
        </Link>
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
                  className="bg-slate-900 text-slate-50"
                  key={column.id}
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
                  const value = (
                    customer as unknown as Record<string, unknown>
                  )[column.id];
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
    </Paper>
  );
};
