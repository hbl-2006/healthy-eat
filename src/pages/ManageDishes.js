import React from 'react';
import Navbar from "./Navbar";
import { auth } from './config/firebase';
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { db } from "./config/firebase";
import { getDocs, getDoc, collection, deleteDoc, updateDoc, doc, } from "firebase/firestore";
import "./Dashboard.css";
import { deconstructArray } from '../utils';

const ManageDishes = () => {
    const navigate = useNavigate();
    const [dishes, setDishes] = useState([]);
    const dishCollectionRef = collection(db, "dishes");
    const [user, loading, _] = useAuthState(auth);
    const [updatedName, setUpdatedName] = useState("");
    const [tempIngName, setTempIngName] = useState("");
    const [tempIngCal, setTempIngCal] = useState(0);
    const [tempIngServe, setTempIngServe] = useState(0);

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

    useEffect(() => {
        console.log(user);
        if (loading) return;
        if (!user) {
            navigate("/");
            alert("you are not signed in yet");
        }
        getDishes();
    }, [user, loading]);

    const deleteDish = async (id) => {
        const dishDoc = doc(db, "dishes", id);
        await deleteDoc(dishDoc);
        alert("dish deleted!");
        getDishes();
    }

    const updateDishName = async (id) => {
        try {
            if (updatedName == "") {
                alert("the new dish name cannot be empty");
                return;
            }
            const dishDoc = doc(db, "dishes", id);
            await updateDoc(dishDoc, { dishName: updatedName });
            setUpdatedName("");
            alert("dish name updated!");
            getDishes();
        } catch (err) {
            console.log(err);
        }
    }

    const addIngredient = async (id) => {
        try {
            if (tempIngName == "") {
                alert("please enter an ingredient name");
                return;
            }
            if (tempIngCal <= 0 || tempIngServe <= 0) {
                alert("ingredient calories and servings must be positive numbers");
                return;
            }

            const dishRef = doc(db, "dishes", id);
            const dishDoc = await getDoc(dishRef);
            const dishData = dishDoc.data();
            const newIngredients = dishData.ingredients;
            let newCal = dishData.calories;
            newIngredients.push(tempIngName + "," + tempIngCal + "," + tempIngServe);
            newCal = newCal + (tempIngCal * tempIngServe);

            await updateDoc(dishRef, { ingredients: newIngredients, calories: newCal });

            setTempIngName("");
            setTempIngCal(0);
            setTempIngServe(0);

            alert("new ingredient added!");
            getDishes();
        } catch (err) {
            console.log(err);
        }
    }

    const deleteIngredient = async (id, name) => {
        const dishRef = doc(db, "dishes", id);
        const dishDoc = await getDoc(dishRef);
        const dishData = dishDoc.data();
        const newIngredients = dishData.ingredients;
        let newCal = dishData.calories;
        for (let i = 0; i < newIngredients.length; i++) {
            if (newIngredients[i].substring(0, newIngredients[i].indexOf(",")) == name) {
                let currIng = newIngredients[i];
                currIng = currIng.substring(currIng.indexOf(",") + 1);
                const cal = parseInt(currIng.substring(0, currIng.indexOf(",")));
                currIng = currIng.substring(currIng.indexOf(",") + 1);
                const serve = parseInt(currIng);
                newCal = (newCal - cal * serve);
                console.log("deleted " + name);
                newIngredients.splice(i, 1);
                break;
            }
        }
        await updateDoc(dishRef, { ingredients: newIngredients, calories: newCal });
        alert("ingredient deleted!");
        getDishes();
    }

    return (
        <div className="dashboard">
            <Navbar />
            <div className="header">
                <h1 style={{ color: "#38B2AC" }}>Manage Dishes</h1>
                <p className="note">Note: all dishes are displayed in alphabetical order</p>
            </div>
            <div className="dish-list">
                {dishes.map((dish) => {
                    if (dish.userId != user.uid) {
                        return;
                    }

                    const { names, serves, cals } = deconstructArray(dish.ingredients);
                    let i = -1;

                    return (
                        <div className="dish-container">
                            <h1 className="dish-name"> {dish.dishName} </h1>
                            <h2 className="calorie-name"> Total Calories: {dish.calories} </h2>
                            <p>
                                <div>
                                    {names.map((name) => {
                                        i++;
                                        return (
                                            <div>
                                                <div>
                                                    {name + ": " + cals[i] + " * " + serves[i] + " = " + cals[i] * serves[i] + " calories"}
                                                </div>
                                                <div className="del-ing-group">
                                                    <a className="delete-ingredient" onClick={() => deleteIngredient(dish.id, name)}>Delete Ingredient</a>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            </p>
                            <div className="ingredient-options-m">
                                <input
                                    className="ingredient-input-m"
                                    placeholder="Ingredient Name"
                                    value={tempIngName}
                                    onChange={(e) => setTempIngName(e.target.value)}
                                ></input>
                                <input
                                    className="ingredient-input-m"
                                    placeholder="Calories Per Serving"
                                    type="number"
                                    value={tempIngCal}
                                    onChange={(e) => setTempIngCal(e.target.value)}
                                ></input>
                                <input
                                    className="ingredient-input-m"
                                    placeholder="Serving Size"
                                    type="number"
                                    value={tempIngServe}
                                    onChange={(e) => setTempIngServe(e.target.value)}
                                ></input>
                            </div>
                            <div className="add-dish-buttons-m">
                                <a className="add-ing-m" onClick={() => addIngredient(dish.id)}>
                                    Add New Ingredient
                                </a>
                            </div>
                            <div className="new-name-wrapper">
                                <input className="new-name" value={updatedName} placeholder="New Dish Name" onChange={(e) => setUpdatedName(e.target.value)}></input>
                                <a className="update-name" onClick={() => updateDishName(dish.id)}>Update Name</a>
                            </div>
                            <div className="delete-dish-wrapper">
                                <a className="delete-dish" onClick={() => deleteDish(dish.id)}>Delete Dish</a>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default ManageDishes;