import React from "react";
import { auth, googleProvider } from "./config/firebase";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";

const SignIn = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const passRef = useRef(null);

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

    const signIn = async () => {
        try {
            await signInWithEmailAndPassword(auth, email, password);
            navigate("/dashboard");
            alert("you have been signed in");
        } catch (err) {
            alert("the account you entered does not exist, or the fields don't match");
            console.error(err);
            passRef.current.value = "";
        }
    };

    const signInWithGoogle = async () => {
        try {
            await signInWithPopup(auth, googleProvider);
            navigate("/dashboard");
            alert("you have been signed in");
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="sign-in">
            <div className="header">
                <h1>Sign-In</h1>
            </div>
            <div className="buttons">
                <div className="user-info">
                    <input
                        className="info"
                        placeholder="Email"
                        onChange={(e) => setEmail(e.target.value)}
                    ></input>
                    <input
                        className="info"
                        placeholder="Password"
                        type="password"
                        ref={passRef}
                        onChange={(e) => setPassword(e.target.value)}
                    ></input>
                    <a onClick={signIn} className="register-button">
                        Sign In
                    </a>
                    <div className="option">
                        <h1>OR</h1>
                    </div>
                    <a onClick={signInWithGoogle} className="register-button-google">
                        Sign In With Google
                    </a>
                </div>
                <a className="return" href="/">
                    Return
                </a>
            </div>
        </div>
    );
};

export default SignIn;
