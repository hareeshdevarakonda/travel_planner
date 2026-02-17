import api from "./axios";

export const loginUser = async (username, password) => {
  const response = await api.post("/login", {
    username,
    password,
  });

  return response.data;
};

export const getProtectedData = async () => {
  const response = await api.get("/protected");
  return response.data;
};
