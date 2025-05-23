import { Input, Typography, Button, notification } from "antd";
import React, { useContext, useState } from "react";
import imagen from "../../assets/autodema.png";
import { useNavigate, useLocation } from "react-router-dom";
import { InventarioContext } from "../../context/InventarioContext";
import { API_URL } from "../../config/api";
const Login = ({}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setIsLogged, isLogged } = useContext(InventarioContext);
  const [data, setData] = useState({
    usuario: "",
    contrasenia: "",
  });
  const handleData = (value, text) => {
    setData((values) => {
      return { ...values, [text]: value };
    });
  };

  const auth = async () => {
    const response = await fetch(`${API_URL}/auth`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const confirm = await response.json();

    if (response.status === 200) {
      notification.success({
        message: confirm.msg,
      });
      setIsLogged(true);
      localStorage.setItem("token", confirm.tokenSession);
      localStorage.setItem("usuario", confirm.data.id);
      navigate("/cargos");
    } else {
      notification.error({
        message: confirm.msg,
      });
    }
  };
  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          border: "1px solid ligthgrey",
          width: "400px",
          height: "380px",
          borderRadius: "8px",
          padding: "20px",
          backgroundColor: "white",
        }}
      >
        <img src={imagen} alt="logo" width={"100%"} />

        <div style={{ marginTop: "40px", textAlign: "left" }}>
          <Input
            onChange={(e) => handleData(e.target.value, "usuario")}
            placeholder={"Usuario"}
          />
        </div>
        <div style={{ marginTop: "25px", textAlign: "left" }}>
          <Input.Password
            onChange={(e) => handleData(e.target.value, "contrasenia")}
            placeholder={"Contraseña"}
          />
        </div>
        <div style={{ marginTop: "30px" }}>
          <Button
            style={{
              width: "100%",
              backgroundColor: "#03A859",
              color: "white",
            }}
            onClick={auth}
          >
            Iniciar Sesión
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Login;
