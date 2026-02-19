
import HomeLayout from "@/pages/Home/home";
import Dashboard from "@/pages/Home/dashboard/dashboard";
import SettingsPage from "@/pages/Home/settings/settings";


const homeRoutes = {
  path: "/home",
  element: <HomeLayout />,
  children: [
    {
      index: true,          // /home
      element: <Dashboard />,
    },
    {
      path: "settings",     // /home/settings
      element: <SettingsPage />,
    },
  ],
};

export default homeRoutes;