import React, { useEffect } from "react";
import "./opcionAdeudo.css";
import { useNavigate } from "react-router-dom";
import { EditOutlined, FormOutlined, ReadOutlined, StarOutlined } from "@ant-design/icons";

const OpcionAdeudo = ({ setTitle }) => {
  const navigate = useNavigate();

  useEffect(() => {
    setTitle("Adeudos");
  }, []);
  return (
    <div className="opcion-menu">
      <div onClick={() => navigate("/adeudo/historial")}>
        <section className="menu">
          <ReadOutlined style={{fontSize:"120px"}}/>{" "}
        </section>

        <label htmlFor="">Historial</label>
      </div>
      <div onClick={() => navigate("/adeudo/crear")}>
        <section className="menu">
          <FormOutlined style={{fontSize:"120px"}}/>
        </section>
        <label htmlFor="">Constancia adeudo</label>
      </div>
    </div>
  );
};

export default OpcionAdeudo;
