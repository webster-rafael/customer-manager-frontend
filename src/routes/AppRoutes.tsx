import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { Home } from "../pages/Home";
import { Aside } from "../components/aside";
import { Header } from "../components/header";
import { CustomersPage } from "../pages/Customers";
import { CreateCustomerPage } from "../pages/CreateCustomers";
import { Login } from "../pages/Login";
import PrivateRoute from "../components/privateRoute";

function Layout() {
  const location = useLocation();

  const showAside = location.pathname !== "/login";

  return (
    <>
      <Header />
      {showAside && <Aside />}
      <Routes>
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Home />
            </PrivateRoute>
          }
        />
        <Route
          path="/customers"
          element={
            <PrivateRoute>
              <CustomersPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/customers/create"
          element={
            <PrivateRoute>
              <CreateCustomerPage />
            </PrivateRoute>
          }
        />
        <Route path="/login" element={<Login />} />
      </Routes>
    </>
  );
}

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  );
}
