import { useContext } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { InventarioContext } from "../context/InventarioContext";

export const ProtectedRoute = ({ children }) => {
  const navigate = useNavigate();

  const { isLogged } = useContext(InventarioContext);
  return localStorage.getItem("token") ? <Navigate to="/" replace /> : children;
};
