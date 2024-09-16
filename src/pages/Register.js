import React from "react";
import { auth, googleProvider } from "./config/firebase";
import { createUserWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";

const Register = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const passRef = useRef(null);
    const confRef = useRef(null);

    const navigate = useNavigate();

    const [user, loading, _] = useAuthState(auth);

    useEffect(() => {
        if (loading) {
            return;
        }
        console.log(user);
        if (user) {
            navigate("/dashboard");
            alert("you have been signed in");
        }
    }, [user]);

    console.log(auth?.currentUser?.email);

    const register = async () => {
        try {
            await createUserWithEmailAndPassword(auth, email, password);
            navigate("/dashboard");
            alert("new account registered");
        } catch (err) {
            console.error(err);
        }
    };

    const signInWithGoogle = async () => {
        try {
            await signInWithPopup(auth, googleProvider);
            navigate("/dashboard");
            alert("you have been signed in");
        } catch (err) {
            alert("invalid input");
            console.error(err);
        }
    };

    return (
        <div className="register">
            <div className="header">
                <h1>Register</h1>
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
                    <input
                        className="info"
                        placeholder="Confirm Password"
                        type="password"
                        ref={confRef}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    ></input>
                    <a
                        onClick={() => {
                            if (password != confirmPassword) {
                                console.log("passwords don't match");
                                alert("your passwords don't match");
                                passRef.current.value = "";
                                confRef.current.value = "";
                                navigate("/register");
                                return;
                            }
                            if (email == "" || password == "" || confirmPassword == "") {
                                console.log("please fill out all required fields");
                                alert("please fill out all required fields");
                                navigate("/register");
                                return;
                            }
                            if (password.length < 6) {
                                console.log("your password must be at least 6 characters");
                                alert("your password must be at least 6 characters");
                                passRef.current.value = "";
                                confRef.current.value = "";
                                navigate("/register");
                                return;
                            }
                            register();
                            console.log("registered");
                        }}
                        className="register-button"
                    >
                        Register
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

export default Register;
