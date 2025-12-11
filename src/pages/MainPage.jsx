import React, { useContext, useEffect, useState } from "react";
import { Button, Layout } from "antd";
import Sidebar from "../components/Sidebar";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import "./styles/mainPage.css";
import HeaderContent from "../components/HeaderContent";
import TablaTrabajador from "../components/trabajador/TablaTrabajador";
import Equipos from "../components/equipos/Equipos";
import { Routes, Route, Navigate } from "react-router-dom";
import Areas from "../components/areas/Areas";
import Mantenimientos from "../components/mantenimientos/Mantenimientos";
import Dashboard from "../components/dashboard/Dashboard";
import Cargos from "../components/cargos/Cargos";

import { useNavigate, useLocation } from "react-router-dom";
import Login from "../components/login/Login";
import { InventarioContext } from "../context/InventarioContext";
import { ProtectedRoute } from "../routes/ProtectedRoute";
import Adeudo from "../components/adeudos/Adeudo";
import Etiquetas from "../components/etiquetas/Etiquetas";
import OpcionAdeudo from "../components/adeudos/OpcionAdeudo";
import HistorialAdeudo from "../components/adeudos/HistorialAdeudo";
import Saneamiento from "../components/saneamiento/Saneamiento";
const { Sider, Header, Content } = Layout;

const MainPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [collapsed, setCollapsed] = useState(true);
  const [title, setTitle] = useState("Cargos");
  const { setIsLogged, isLogged } = useContext(InventarioContext);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setIsLogged(false);
    }
  }, [setIsLogged]);

  return (
    <Layout>
      {!isLogged && !localStorage.getItem("token") ? (
        <Login setIsLogged={setIsLogged} />
      ) : (
        <>
          <Sider
            theme="light"
            trigger={null}
            collapsible
            collapsed={collapsed}
            className="sider"
          >
            <Sidebar />
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              className="triger-btn"
            />
          </Sider>

          <Layout>
            <Header className="header">
              <HeaderContent title={title} />
            </Header>
            <Content className="content">
              <Routes>
                <Route
                  path="/"
                  element={<Navigate to="/cargos" replace />}
                />
                {/* <Route
                  path="/trabajadores"
                  element={<ProtectedRoute><TablaTrabajador setTitle={setTitle} /></ProtectedRoute>}
                />
                <Route
                  path="/equipos"
                  element={<ProtectedRoute><Equipos setTitle={setTitle} /></ProtectedRoute>}
                />
                <Route path="/unidad" element={<ProtectedRoute><Areas setTitle={setTitle} /></ProtectedRoute>} /> */}
                <Route
                  path="/cargos"
                  element={
                    <ProtectedRoute>
                      <Cargos setTitle={setTitle} />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/adeudo"
                  element={
                    <ProtectedRoute>
                      <OpcionAdeudo setTitle={setTitle} />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/adeudo/historial"
                  element={
                    <ProtectedRoute>
                      <HistorialAdeudo setTitle={setTitle} />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/adeudo/crear"
                  element={
                    <ProtectedRoute>
                      <Adeudo setTitle={setTitle} />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/etiquetas"
                  element={
                    <ProtectedRoute>
                      <Etiquetas setTitle={setTitle} />
                    </ProtectedRoute>
                  }
                />
                                <Route
                  path="/saneamiento"
                  element={
                    <ProtectedRoute>
                      <Saneamiento setTitle={setTitle} />
                    </ProtectedRoute>
                  }
                />
                {/* <Route
                  path="/dashboard"
                  element={<ProtectedRoute><Dashboard setTitle={setTitle} /></ProtectedRoute>}
                /> */}
              </Routes>
            </Content>
          </Layout>
        </>
      )}
    </Layout>
  );
};

export default MainPage;
