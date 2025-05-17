import CardCustomers from "./components/cardsCustomers";
import { CustomersRecentsTable } from "./components/customersRecentsTable";

const Home = () => {
  return (
    <main className="ml-44 2xl:ml-64 p-10 pt-24">
      <CardCustomers />
      <CustomersRecentsTable />
    </main>
  );
};

export { Home };
