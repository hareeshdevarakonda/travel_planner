import JourneysContainer from "@/pages/Home/history/Jounerys"; 
import ItineraryPage from "@/pages/Home/iternaries/ItineraryPage";

const ItinerariesRoute = {
  path: "myjourneys", 
  children: [
    {
      index: true, 
      element: <JourneysContainer />, 
    },
    {
      path: ":id", 
      // This is the dynamic route where :id matches the itinerary_id from your API
      element: <ItineraryPage />, 
    },
  ],
};

export default ItinerariesRoute;