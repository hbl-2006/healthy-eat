import React, { useRef } from "react";
import Navbar from "./Navbar";
import "./Dashboard.css";
import { useNavigate } from "react-router-dom";
import { auth } from "./config/firebase";
import { useState, useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { db } from "./config/firebase";
import { collection, addDoc } from "firebase/firestore";
import { combineArrays } from "../utils";

const AddDish = () => {
  const [dishName, setDishName] = useState("");
  const [calories, setCalories] = useState(0);
  const [ingredientName, setIngredientName] = useState([]);
  const [ingredientCal, setIngredientCal] = useState([]);
  const [ingredientServe, setIngredientServe] = useState([]);
  const [tempIngName, setTempIngName] = useState("");
  const [tempIngCal, setTempIngCal] = useState(0);
  const [tempIngServe, setTempIngServe] = useState(0);

  const ingRef = useRef(null);
  const calRef = useRef(null);
  const servRef = useRef(null);
  const dishRef = useRef(null);

  const dishCollectionRef = collection(db, "dishes");

  const navigate = useNavigate();

  const [user, loading, _] = useAuthState(auth);

  const addIngredient = async () => {
    try {
      if (tempIngName == "") {
        alert("please enter an ingredient name");
        return;
      }
      if (tempIngCal <= 0 || tempIngServe <= 0) {
        alert("ingredient calories and servings must be positive numbers");
        return;
      }
      ingredientName.push(tempIngName);
      ingredientCal.push(tempIngCal);
      ingredientServe.push(tempIngServe);
      setCalories(calories + tempIngCal * tempIngServe);

      ingRef.current.value = "";
      servRef.current.value = 0;
      calRef.current.value = 0;

      alert("new ingredient added!");
    } catch (err) {
      console.log(err);
    }
  };

  const onSubmitDish = async () => {
    try {
      if (dishName == "") {
        alert("please enter a dish name");
        return;
      }
      await addDoc(dishCollectionRef, {
        dishName: dishName,
        calories: calories,
        ingredients: combineArrays(
          ingredientName,
          ingredientCal,
          ingredientServe
        ),
        userId: auth?.currentUser?.uid,
        isSelected: false,
      });
      alert("new dish added!");
      setCalories(0);
      setIngredientName([]);
      setIngredientCal([]);
      setIngredientServe([]);
      dishRef.current.value = "";
      navigate("/manage-dishes");
    } catch (err) {
      console.log(err);
    }
  };

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
      <Navbar />
      <div className="header">
        <h1 style={{ color: "#38B2AC" }}>Add Dish</h1>
        <p className="note">Note: you can still edit the dish later in "Manage Dishes"</p>
      </div>
      <div className="button-options">
        <div>
          <input
            className="dish-name-button"
            placeholder="Dish Name"
            ref={dishRef}
            onChange={(e) => setDishName(e.target.value)}
          ></input>
        </div>
        <div className="ingredient-options">
          <input
            className="ingredient-input"
            placeholder="Ingredient Name"
            ref={ingRef}
            onChange={(e) => setTempIngName(e.target.value)}
          ></input>
          <input
            className="ingredient-input"
            placeholder="Calories Per Serving"
            type="number"
            ref={calRef}
            onChange={(e) => setTempIngCal(e.target.value)}
          ></input>
          <input
            className="ingredient-input"
            placeholder="Serving Size"
            type="number"
            ref={servRef}
            onChange={(e) => setTempIngServe(e.target.value)}
          ></input>
        </div>
      </div>
      <div className="add-dish-buttons">
        <div>
          <a className="add-ing" onClick={addIngredient}>
            Add Ingredient
          </a>
        </div>
        <div>
          <a className="addDish" onClick={onSubmitDish}>
            Add Dish
          </a>
        </div>
      </div>
    </div>
  );
};

export default AddDish;
