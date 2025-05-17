import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import LogoutIcon from "@mui/icons-material/Logout";
import { Link, useNavigate } from "react-router-dom";

const menuItems = [
  {
    text: "Dashboard",
    icon: <DashboardIcon className="lg:size-5 2xl:size-7" />,
    to: "/",
  },
  {
    text: "Clientes",
    icon: <PeopleIcon className="lg:size-5 2xl:size-7" />,
    to: "/customers",
  },
  {
    text: "Cadastrar Novo",
    icon: <PersonAddAlt1Icon className="lg:size-5 2xl:size-7" />,
    to: "/customers/create",
  },
];

const Aside = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <Drawer
      variant="permanent"
      anchor="left"
      PaperProps={{
        className: "bg-[#0F172A] text-white lg:w-48 2xl:w-64 border-none mt-16",
      }}
    >
      <List className="flex-1 2xl:px-2 ">
        {menuItems.map((item, index) => (
          <ListItemButton
            key={index}
            component={Link}
            to={item.to}
            className="text-white rounded-md hover:bg-slate-700 transition-all duration-1 lg:-space-x-5 2xl:-space-x-0"
          >
            <ListItemIcon className="text-white">{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItemButton>
        ))}

        <ListItemButton
          onClick={handleLogout}
          className="text-white rounded-md hover:bg-slate-700 transition-all duration-150 lg:-space-x-5 2xl:-space-x-0"
        >
          <ListItemIcon className="text-white">
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText primary="Sair" />
        </ListItemButton>
      </List>
    </Drawer>
  );
};

export { Aside };
