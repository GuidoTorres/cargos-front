import React, { useEffect, useRef, useState } from "react";
import "./adeudo.css";
import image from "../../assets/logo_autodema.png";
import gobierno from "../../assets/gobierno.png";
import { Select, Input, Image, Button, DatePicker } from "antd";
import { useReactToPrint } from "react-to-print";
import dayjs from "dayjs";
import 'dayjs/locale/es';

dayjs.locale('es');
const { TextArea } = Input;
const formatDate = () => {
  const day = dayjs().format('DD'); // Día con dos dígitos
  const month = dayjs().format('MMMM'); // Nombre completo del mes
  const year = dayjs().format('YYYY'); // Año con cuatro dígitos

  return `${day} de ${month} del ${year}`;
};
const Adeudo = () => {
  const componentRef = useRef();

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });
  const [data, setData] = useState({
    trabajador: "",
    anio: "",
    contenido: "",
    adeudo: "",
    modalidad: "",
    fecha: ""
  });

  const [trabajadores, setTrabajadores] = useState([]);

  const getTrabajadores = async () => {
    const response = await fetch(`http://localhost:3001/api/v1/planilla`);
    const info = await response.json();
    if (info) {
      setTrabajadores(info.data);
    }
    return info.data;
  };
  useEffect(() => {
    getTrabajadores();
  }, []);

  const adeudo = [
    { label: "ADEUDA", value: "ADEUDA" },
    { label: "NO ADEUDA", value: "NO ADEUDA" },
  ];
  return (
    <div className="container">
      <div className="options">
        <h3 style={{ textAlign: "left" }}>
          Ingrese las opciones para completar la constancia
        </h3>
        <div style={{ marginTop: "20px" }}>
          <p
            style={{
              textAlign: "left",
              marginBottom: "10px",
              fontWeight: "bold",
            }}
          >
            Año
          </p>
          <TextArea
            rows={2}
            onChange={(e) =>
              setData((data) => ({ ...data, anio: e.target.value }))
            }
            placeholder="AÑO DEL BICENTENARIO DE LAS BATALLAS HEROICAS DE AYACUCHO Y JUNIN"
          />
        </div>
        <div style={{ marginTop: "20px" }}>
          <p
            style={{
              textAlign: "left",
              marginBottom: "10px",
              fontWeight: "bold",
            }}
          >
            Trabajador
          </p>
          <Select
            style={{ width: "100%" }}
            options={trabajadores.map((item) => {
              return {
                value: item.AP_PATE + " " + item.DE_NOMB,
                label: item.AP_PATE + " " + item.DE_NOMB,
              };
            })}
            placeholder="Trabajador"
            onChange={(e) => setData((data) => ({ ...data, trabajador: e }))}
          ></Select>
        </div>
        <div style={{ marginTop: "20px" }}>
          <p
            style={{
              textAlign: "left",
              marginBottom: "10px",
              fontWeight: "bold",
            }}
          >
            Adeudo
          </p>
          <Select
            style={{ width: "100%" }}
            options={adeudo.map((item) => item)}
            onChange={(e) => setData((data) => ({ ...data, adeudo: e }))}
            placeholder="Adeudo"
          ></Select>
        </div>
        <div style={{ marginTop: "20px" }}>
          <p
            style={{
              textAlign: "left",
              marginBottom: "10px",
              fontWeight: "bold",
            }}
          >
            Contenido
          </p>
          <TextArea
            rows={3}
            onChange={(e) =>
              setData((data) => ({ ...data, contenido: e.target.value }))
            }
            placeholder="al término de su contrato con fecha"
          />
        </div>
        <div style={{ marginTop: "20px" }}>
          <p
            style={{
              textAlign: "left",
              marginBottom: "10px",
              fontWeight: "bold",
            }}
          >
            Fecha
          </p>
          <DatePicker
            style={{ width: "100%" }}
            
            onchange={(e) =>  setData((data) => ({ ...data, fecha: e.target.value }))}
          />
        </div>
        <div style={{ marginTop: "20px" }}>
          <p
            style={{
              textAlign: "left",
              marginBottom: "10px",
              fontWeight: "bold",
            }}
          >
            Modalidad
          </p>
          <Select
            style={{ width: "100%" }}
            options={adeudo.map((item) => item)}
            onChange={(e) => setData((data) => ({ ...data, modalidad: e }))}
          ></Select>
        </div>
      </div>
      <div
        style={{
          backgroundColor: "white",
          width: "148mm", // A5 width
          height: "210mm", // A5 height
          padding: "10mm", // Padding for content
          boxSizing: "border-box",
          flex: 1,
        }}
        ref={componentRef}
      >
        <section className="header1">
          <div className="imagen1">
            <Image src={gobierno} preview={false} style={{width:"100%"}} />
          </div>
          <div className="title">
            <p style={{fontSize:"14px"}}>GOBIERNO REGIONAL DE AREQUIPA</p>
            <p style={{fontSize:"14px"}}>AUTORIDAD AUTONOMA DE MAJES</p>
            <p style={{fontSize:"14px"}}>PROYECTO ESPECIAL MAJES - SIGUAS</p>
          </div>
          <div className="imagen1">
            <Image src={image} preview={false} style={{width:"100%"}} />
          </div>
        </section>
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
            Que el Sr. (a,ta):{" "}
            <strong>
              {data.trabajador ? data.trabajador : "_______________"}
            </strong>
          </p>

          <p style={{ textAlign: "left", marginTop: "15px" }}>
            Ex trabajador (a) del Proyecto Especial MAJES - AUTODEMA
            <strong>
              {" "}
              {data.adeudo ? data.adeudo : "_______________"}
            </strong>{" "}
            ningun bien patrimonial,{" "}
            {data.contenido
              ? data.contenido
              : "al término de su contrato con fecha"}{" "}
            {data.fecha} en la modalidad de{" "}
            {data.modalidad ? data.modalidad : "___________"}.
          </p>

          <p style={{ textAlign: "left", marginTop: "15px" }}>
            Se expide la presente a solicitud del interesado, para los fines que
            estime convenientes.
          </p>

          <p style={{ textAlign: "left", marginTop: "15px" }}>
            Arequipa, {formatDate()}
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
      <Button onClick={handlePrint} style={{ marginTop: "20px" }}>
        Imprimir
      </Button>
    </div>
  );
};

export default Adeudo;
