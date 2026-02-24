import Itineraries from "@/pages/Home/iternaries/itenary";
import JourneysContainer from "@/pages/Home/history/Jounerys";

const ItinerariesRoute = {
  path: "myjourneys", // ✅ no slash

  children: [
    // ✅ lowercase

    {
      index: true, // ✅ default child route
      element: <JourneysContainer />, // ✅ show list on /home/myjourneys
    },
    {
      path: ":id", // ✅ no slash
      element: <Itineraries />,
    },
  ],
};

export default ItinerariesRoute;
