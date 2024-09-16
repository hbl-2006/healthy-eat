import React from 'react';
import Navbar from "./Navbar";
import { auth } from './config/firebase';
import { signOut } from 'firebase/auth';
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import "./Dashboard.css";

const Settings = () => {
    const navigate = useNavigate();

    const [user, loading, _] = useAuthState(auth);

    useEffect(() => {
        console.log(user);
        if (loading) {
            return;
        }
        if (!user) {
            navigate("/");
            alert("you are not signed in yet");
        }
    }, [user, loading]);

    const logout = async () => {
        try {
            await signOut(auth);
            navigate("/");
            alert("you have been signed out");
        } catch (err) {
            console.error(err);
        }
    }

    return (
        <div className="dashboard">
            <Navbar />
            <div className="header">
                <h1 style={{ color: "#38B2AC" }}>Settings</h1>
            </div>
            <div className="setting-options">
                <div className="user-buttons">
                    <div className="user-change">
                        <div className="change">
                            <h2 className="change">Change Password</h2>
                        </div>
                        <div className="input-wrapper">
                            <input className="change-type" placeholder="Enter Old Password"></input>
                            <input className="change-type" placeholder="Enter New Password"></input>
                            <input className="change-type" placeholder="Confirm New Password"></input>
                        </div>
                    </div>
                </div>
            </div>
            <div className="settings-button">
                <a className="confirm" href="/">Confirm</a>
                <a onClick={logout} className="logout" href="/">Log Out</a>
            </div>
        </div>
    )
}

export default Settings;