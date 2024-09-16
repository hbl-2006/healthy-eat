import React from 'react';
import NavbarNoReturn from "./NavbarNoReturn";
import "./Dashboard.css";
import { auth } from "./config/firebase";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import "./Dashboard.css";

const Dashboard = () => {
  const navigate = useNavigate();

  const [user, loading, _] = useAuthState(auth);

  useEffect(() => {
    console.log(user);
    if (loading) return;
    if (!user) {
      navigate("/");
      alert("you are not signed in yet");
    }
  }, [user, loading]);

  return (
    <div className="dashboard">
      <NavbarNoReturn />
      <div className="header">
        <h1 style={{ color: "#38B2AC" }}>Dashboard</h1>
      </div>
      <div className="dashboard-button-container">
        <div className="temp-buttons">
          <a href="/calculate-calories" className="calculate-calories-button"></a>
          <a href="/add-dish" className="add-dish-button"></a>
          <a href="/manage-dishes" className="manage-dishes-button"></a>
        </div>
      </div>
    </div>
  )
}

export default Dashboard;