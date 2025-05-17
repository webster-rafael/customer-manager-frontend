import NotificationsIcon from "@mui/icons-material/Notifications";
// import NotificationImportantIcon from "@mui/icons-material/NotificationImportant";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";

const Header = () => {
  return (
    <header className="flex w-full fixed justify-between items-center bg-slate-900 h-16 border-b border-slate-600 pr-4">
      <div className="p-4 2xl:text-xl font-bold text-white border-r border-slate-600 w-48 2xl:w-64 flex items-center text-sm gap-2">
        Customer Manager
        <ManageAccountsIcon className="text-white 2xl:size-8" />
      </div>
      <div className="flex items-center gap-4">
        <NotificationsIcon className="text-white" />
        <span className="rounded-full bg-zinc-50 flex text-xs size-7 items-center justify-center font-bold">
          WR
        </span>
      </div>
    </header>
  );
};

export { Header };
