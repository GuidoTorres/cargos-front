import { useContext, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { InventarioContext } from "../context/InventarioContext";

export const ProtectedRoute = ({ children }) => {
  const { isLogged } = useContext(InventarioContext);
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);
  }, [isLogged]);

  if (isAuthenticated === null) {
    return null; // Puedes mostrar un spinner o un mensaje de carga aquí si lo prefieres
  }

  return isAuthenticated ? children : <Navigate to="/" replace />;
};
