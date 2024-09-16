import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import SignIn from "./pages/SignIn";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import CalculateCalories from "./pages/CalculateCalories";
import AddDishes from "./pages/AddDish";
import ManageDishes from "./pages/ManageDishes";
import Settings from "./pages/Settings";
import reportWebVitals from "./reportWebVitals";

import { createBrowserRouter, RouterProvider } from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "sign-in",
    element: <SignIn />,
  },
  {
    path: "register",
    element: <Register />,
  },
  {
    path: "dashboard",
    element: <Dashboard />,
  },
  {
    path: "calculate-calories",
    element: <CalculateCalories />,
  },
  {
    path: "add-dish",
    element: <AddDishes />,
  },
  {
    path: "manage-dishes",
    element: <ManageDishes />,
  },
  {
    path: "settings",
    element: <Settings />,
  },
]);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
