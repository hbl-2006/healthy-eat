import React from "react";
import { auth } from "./config/firebase";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";

const Home = () => {
    const navigate = useNavigate();

    const [user, loading, _] = useAuthState(auth);

    useEffect(() => {
        console.log("loading");
        if (loading) {
            return;
        }
        console.log("done");
        console.log(user);
        if (user) {
            navigate("/dashboard");
            alert("you have been signed in");
        }
    }, [user]);


    return (
        <div className="home">
            <div className="header">
                <h1>Healthy Eat</h1>
            </div>
            <div className="buttons">
                <div className="user-options">
                    <a href="/sign-in">Sign In</a>
                    <a href="/register">Register</a>
                </div>
            </div>
        </div>
    );
}

export default Home;