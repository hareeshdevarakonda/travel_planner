import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/auth/AuthContext";

import Left from "./SignIn/leftside";
import Right from "./SignIn/rightside";

import { loginUser } from "@/api/authApi";

const SignIn = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /**
   * ✅ Login Handler
   * receives rememberMe from Right component
   */
  const handleLogin = async (e, rememberMe) => {
    e.preventDefault();

    if (!username || !password) {
      setError("Please enter username and password");
      return;
    }

    try {
      setLoading(true);
      setError("");

      // API call
      const data = await loginUser(username, password);

      // ✅ Save token using AuthContext
      login(data.access_token, rememberMe);

      // ✅ Remove login page from history
      navigate("/home", { replace: true });

    } catch (err) {
      setError("Invalid username or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      <Left />

      <Right
        username={username}
        password={password}
        setUsername={setUsername}
        setPassword={setPassword}
        handleLogin={handleLogin}
        loading={loading}
        error={error}
      />
    </div>
  );
};

export default SignIn;
