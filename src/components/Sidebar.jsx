import React, { useEffect, useState } from "react";
import { Flex, Menu } from "antd";
import {
  UserOutlined,
  LaptopOutlined,
  ApartmentOutlined,
  ToolOutlined,
  AreaChartOutlined,
  SolutionOutlined,
} from "@ant-design/icons";
import "./styles/sidebar.css";
import imagen from "../assets/autodema.png";
import { useNavigate, useLocation } from "react-router-dom";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Usar un string que corresponda a la 'key' del ítem del menú
  const [selectedKey, setSelectedKey] = useState("");

  // Actualizar la clave seleccionada en función de la ruta actual
  useEffect(() => {
    const path = location.pathname;
    setSelectedKey(path);
  }, [location]);

  const handleMenuClick = (e) => {
    navigate(e.key);
  };

  
  return (
    <>
      <Flex align="center" justify="center">
        <div className="logo">
          <img src={imagen} alt="autodema" width={"90%"} height={"90%"} />
        </div>
      </Flex>

      <Menu
        mode="inline"
        selectedKeys={[selectedKey]}
        className="menu-bar"
        items={[
          // { key: "/trabajadores", icon: <UserOutlined />, label: "Trabajadores" },
          // { key: "/equipos", icon: <LaptopOutlined />, label: "Equipos" },
          // { key: "/unidad", icon: <ApartmentOutlined />, label: "Unidad" },
          { key: "/cargos", icon: <SolutionOutlined />, label: "Cargos" },
          // { key: "/mantenimiento", icon: <ToolOutlined />, label: "Mantenimiento" },
          // { key: "/dashboard", icon: <AreaChartOutlined />, label: "Dashboard" },
        ]}
        onClick={handleMenuClick}
      />
    </>
  );
};

export default Sidebar;
