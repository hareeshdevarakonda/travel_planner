import HomeLayout from "@/pages/Home/home";
import Dashboard from "@/pages/Home/dashboard/dashboard";
import SettingsPage from "@/pages/Home/settings/settings";
import ItinerariesRoute from "@/routes/IternariesRoute";
import JourneysContainer from "@/pages/Home/history/Jounerys";
import ExploreMaps from "@/pages/maps/ExploreMaps"; // 1. Add this import

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

    {
      path: "explore-maps", // 2. Add /home/explore-maps
      element: <ExploreMaps />,
    },
    ItinerariesRoute,
  ],
};

export default homeRoutes;