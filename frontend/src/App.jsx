import api from "./api/axios";
import { useEffect, useState } from "react";

function App() {
  const [status, setStatus] = useState("");

  useEffect(() => {
    api.get("/")
      .then((res) => setStatus(res.data.status))
      .catch(() => setStatus("Backend Not Connected"));
  }, []);

  return (
    <div>
      <h1>Travel Planner 🚀</h1>
      <p>{status}</p>
    </div>
  );
}

export default App;
