import React, { useEffect, useState } from "react";
import "./adeudo.css";
import image from "../../assets/logo_autodema.png";
import { Select, Input, Image } from "antd";
import dayjs from "dayjs";
const { TextArea } = Input;

const Adeudo = () => {
  const [data, setData] = useState({
    trabajador: "",
    anio: "",
    contenido: "",
    adeudo: "",
  });

  const [trabajadores, setTrabajadores] = useState([]);
  const trabajador = [
    { label: "Guido Torres", value: "Guido Torres" },
    { label: "Prueba1", value: "Prueba1" },
    { label: "Prueba2", value: "Prueba2" },
    { label: "Prueba3", value: "Prueba3" },
  ];

  const getTrabajadores = async () => {
      const response = await fetch(`http://localhost:3001/api/v1/planilla`);
      const info = await response.json();
      if (info) {
        setTrabajadores(info.data);
      }
      return info.data;
  };
  useEffect(()=>{
    getTrabajadores()
  },[])

  const adeudo = [
    { label: "ADEUDA", value: "ADEUDA" },
    { label: "NO ADEUDA", value: "NO ADEUDA" },
  ];
  console.log(data);
  return (
    <div className="container">
      <div className="options">
        <div style={{ marginTop: "20px" }}>
          <p style={{ textAlign: "left", marginBottom: "10px" }}>Año</p>
          <TextArea
            rows={2}
            onChange={(e) =>
              setData((data) => ({ ...data, anio: e.target.value }))
            }
          />
        </div>
        <div style={{ marginTop: "20px" }}>
          <p style={{ textAlign: "left", marginBottom: "10px" }}>Trabajador</p>
          <Select
            style={{ width: "100%" }}
            options={trabajadores.map((item) => {
              return {
                value: item.AP_PATE + " " + item.DE_NOMB,
                label: item.AP_PATE + " " + item.DE_NOMB,
              };
            })}
            onChange={(e) => setData((data) => ({ ...data, trabajador: e }))}
          ></Select>
        </div>
        <div style={{ marginTop: "20px" }}>
          <p style={{ textAlign: "left", marginBottom: "10px" }}>Adeudo</p>
          <Select
            style={{ width: "100%" }}
            options={adeudo.map((item) => item)}
            onChange={(e) => setData((data) => ({ ...data, adeudo: e }))}
          ></Select>
        </div>
        <div style={{ marginTop: "20px" }}>
          <p style={{ textAlign: "left", marginBottom: "10px" }}>Contenido</p>
          <TextArea
            rows={3}
            onChange={(e) =>
              setData((data) => ({ ...data, contenido: e.target.value }))
            }
          />
        </div>
      </div>
      <div
        style={{
          backgroundColor: "white",
          padding: "40px",
          width: "650px",
          flex: 1,
        }}
      >
        <section className="header1">
          <div className="imagen1">
            <Image src={image} preview={false} height={100} />
          </div>
          <div className="title">
            <p>GOBIERNO REGIONAL DE AREQUIPA</p>
            <p>AUTORIDAD AUTONOMA DE MAJES</p>
            <p>PROYECTO ESPECIAL MAJES - SIGUAS</p>
          </div>
          <div className="imagen1">
            <Image src={image} preview={false} height={100} />
          </div>
        </section>
        <br />
        <br />
        <hr />
        <br />
        <p>
          {data.anio === ""
            ? '"AÑO DEL BICENTENARIO DE LAS BATALLAS HEROICAS DE AYACUCHO Y JUNIN"'
            : data.anio}
        </p>
        <br />
        <section className="title">
          <u>CONSTANCIA Nº 053 - 2024</u>
        </section>
        <section className="body">
          <p style={{ textAlign: "left", marginTop: "15px" }}>
            El que suscribe, jefe(e) del Área de Control y Saneamiento
            Patrimonial del Proyecto Especial Majes Siguas - AUTODEMA
          </p>
          <p style={{ textAlign: "left", marginTop: "15px" }}>Hace constar:</p>
          <p style={{ textAlign: "left", marginTop: "15px" }}>
            Que el Sr. (a,ta): <strong>{data.trabajador}</strong>
          </p>

          <p style={{ textAlign: "left", marginTop: "15px" }}>
            Ex trabajador (a) del Proyecto Especial MAJES - AUTODEMA
            <strong> {data.adeudo}</strong> ningun bien patrimonial, al término
            de su contrato con fecha {dayjs().format("DD/MM/YYYY")} en la
            modalidad de construcción civil.
          </p>

          <p style={{ textAlign: "left", marginTop: "15px" }}>
            Se expide la presente a solicitud del interesado, para los fines que
            estime convenientes.
          </p>

          <p style={{ textAlign: "left", marginTop: "15px" }}>
            Arequipa, 05 de Junio del 2024
          </p>

          <p style={{ marginTop: "80px" }}>
            _____________________________________________
          </p>
          <p>Lic. Edgar Cornejo Choquecota</p>
          <p>Responsable Control y Saneamiento Patrimonial(e)</p>
        </section>
        <p style={{ textAlign: "left", marginTop: "20px" }}>
          Revisado, Verificado y Elaborado Por:
        </p>
        <p style={{ textAlign: "left", marginTop: "80px" }}>
          ______________________________
        </p>
        <p style={{ textAlign: "left", marginTop: "15px" }}>
          C.P.C J. Javier Torres Huarcaya
        </p>
      </div>
    </div>
  );
};

export default Adeudo;
