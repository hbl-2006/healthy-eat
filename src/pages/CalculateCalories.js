import React from 'react';
import Navbar from "./Navbar";
import { auth } from './config/firebase';
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { db } from "./config/firebase";
import { getDocs, getDoc, collection, updateDoc, doc, } from "firebase/firestore";
import "./Dashboard.css";

const ManageDishes = () => {
  const navigate = useNavigate();
  const [dishes, setDishes] = useState([]);
  const dishCollectionRef = collection(db, "dishes");
  const [user, loading, _] = useAuthState(auth);
  const [calories, setCalories] = useState(0);

  const initializeDishes = async () => {
    try {
      const data = await getDocs(dishCollectionRef);
      const filteredData = data.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
        isSelected: false,
      }))
      for (let i = 0; i < filteredData.length; i++) {
        const dishRef = doc(db, "dishes", filteredData[i].id);
        await updateDoc(dishRef, { isSelected: false });
      }

      for (let i = 0; i < filteredData.length - 1; i++) {
        for (let m = 0; m < filteredData.length - 1; m++) {
          let compare = filteredData[m].dishName.localeCompare(filteredData[m + 1].dishName);
          if (compare > 0) {
            filteredData.push(filteredData[m]);
            filteredData[m] = filteredData[m + 1];
            filteredData[m + 1] = filteredData[filteredData.length - 1];
            filteredData.pop();
          }
        }
      }
      setDishes(filteredData);
    } catch (err) {
      console.log(err);
    }
  }

  const getDishes = async () => {
    try {
      const data = await getDocs(dishCollectionRef);
      const filteredData = data.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }))
      for (let i = 0; i < filteredData.length - 1; i++) {
        for (let m = 0; m < filteredData.length - 1; m++) {
          let compare = filteredData[m].dishName.localeCompare(filteredData[m + 1].dishName);
          if (compare > 0) {
            filteredData.push(filteredData[m]);
            filteredData[m] = filteredData[m + 1];
            filteredData[m + 1] = filteredData[filteredData.length - 1];
            filteredData.pop();
          }
        }
      }
      setDishes(filteredData);
    } catch (err) {
      console.log(err);
    }
  }

  const selectDish = async (id) => {
    try {
      const dishRef = doc(db, "dishes", id);
      const dishDoc = await getDoc(dishRef);
      const dishData = dishDoc.data();
      let newIsSelected = dishData.isSelected;

      if (newIsSelected) {
        setCalories(calories - dishData.calories);
        console.log(calories);
        newIsSelected = false;
      } else {
        setCalories(calories + dishData.calories);
        console.log(calories);
        newIsSelected = true;
      }

      await updateDoc(dishRef, { isSelected: newIsSelected });

      getDishes();
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    console.log(user);
    if (loading) return;
    if (!user) {
      navigate("/");
      alert("you are not signed in yet");
    }
    initializeDishes();
  }, [user, loading]);

  return (
    <div className="dashboard">
      <Navbar />
      <div className="header">
        <h1 style={{ color: "#38B2AC" }}>Calculate Calories</h1>
        <p className="note">Note: all dishes are displayed in alphabetical order</p>
      </div>
      <div className="dish-list">
        {dishes.map((dish) => {
          if (dish.userId != user.uid) {
            return;
          }

          return (
            <div className="dish-container-calc">
              <div>
                <h1 className="dish-name"> {dish.dishName} </h1>
                <h2 className="calorie-name"> total calories: {dish.calories} </h2>
                <div className="select-button-container">
                  <input className="select-button" checked={dish.isSelected} onChange={() => selectDish(dish.id)} type="checkbox"></input>
                </div>
                <p>select</p>
              </div>
            </div>
          )
        })}
      </div>
      <div>
        <p>Total Calories:</p>
        <h1 className="calorie-number">{calories}</h1>
      </div>
    </div>
  )
}

export default ManageDishes;