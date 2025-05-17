import { Button } from "@mui/material";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { useCustomers } from "../../../api/useCustomers";

const GeneratePdf = () => {
  const { data: customers = [] } = useCustomers();

  const generatePdf = () => {
    const doc = new jsPDF();
    doc.text("Lista de Clientes", 14, 15);

    autoTable(doc, {
      startY: 20,
      head: [
        [
          "Nome",
          "Email",
          "Telefone",
          "Ativo",
          "CEP",
          "Cidade/Estado",
          "Endereço",
        ],
      ],
      body: customers.map((customer) => [
        customer.name,
        customer.email,
        customer.phone,
        customer.active ? "Sim" : "Não",
        customer.address?.zip_code ?? "",
        `${customer.address?.city ?? ""}/${customer.address?.state ?? ""}`,
        `${customer.address?.street ?? ""}, ${customer.address?.number ?? ""}, ${customer.address?.neighborhood ?? ""}`,
      ]),
    });

    doc.save("clientes.pdf");
  };

  return (
    <Button
      className="bg-slate-600 hover:bg-slate-500 flex items-center gap-2"
      variant="contained"
      onClick={generatePdf}
    >
      Exportar em PDF
      <PictureAsPdfIcon />
    </Button>
  );
};

export { GeneratePdf };
