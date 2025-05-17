import { Card, CardContent } from "@mui/material";
import Diversity3Icon from "@mui/icons-material/Diversity3";
import { useCustomers } from "../../../api/useCustomers";

const CardCustomers = () => {
  const { data: customers = [], isLoading, isError } = useCustomers();

  // pegar os clientes que foramm criados hoje independente do horário
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const total = customers.length;

  const activeCount = customers.filter((c) => c.active).length;

  const newTodayCount = customers.filter((c) => {
    if (!c.created_at) return false;
    const created = new Date(c.created_at);
    created.setHours(0, 0, 0, 0);
    return created.getTime() === today.getTime();
  }).length;

  if (isLoading) {
    return <div className="p-6 text-slate-50">Carregando estatísticas...</div>;
  }

  if (isError) {
    return (
      <div className="p-6 text-red-500">Erro ao carregar estatísticas.</div>
    );
  }

  return (
    <div className="grid grid-cols-3 gap-10">
      <Card className="bg-slate-900 text-white">
        <CardContent>
          <div className="flex items-center justify-between">
            <h3>Total de Clientes</h3>
            <Diversity3Icon fontSize="large" />
          </div>
          <span className="font-bold text-2xl">{total}</span>
        </CardContent>
      </Card>

      <Card className="bg-slate-900 text-white">
        <CardContent>
          <div className="flex items-center justify-between">
            <h3>Clientes Ativos</h3>
            <Diversity3Icon fontSize="large" />
          </div>
          <span className="font-bold text-2xl">{activeCount}</span>
        </CardContent>
      </Card>

      <Card className="bg-slate-900 text-white">
        <CardContent>
          <div className="flex items-center justify-between">
            <h3>Novos Clientes Hoje</h3>
            <Diversity3Icon fontSize="large" />
          </div>
          <span className="font-bold text-2xl">{newTodayCount}</span>
        </CardContent>
      </Card>
    </div>
  );
};

export default CardCustomers;
