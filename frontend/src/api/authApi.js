import api from "./axios";

export const loginUser = async (username, password) => {
  // We take 'username' from your form, 
  // but we label it 'email' for the backend
  const response = await api.post("/auth/login", {
    email: username, 
    password: password,
  });

  return response.data;
};

export const getProtectedData = async () => {
  const response = await api.get("/protected");
  return response.data;
  print(response.data);
};


/* ✅ GET CURRENT USER */
export const getMe = async () => {
  const response = await api.get("/auth/me");
  
  




  return response.data;

};