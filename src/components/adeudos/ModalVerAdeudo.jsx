import React, { useEffect, useRef, useState } from "react";
import "./adeudo.css";
import image from "../../assets/logo_autodema.png";
import gobierno from "../../assets/gobierno.png";
import {
  Select,
  Input,
  Image,
  Button,
  DatePicker,
  notification,
  Modal,
} from "antd";
import { useReactToPrint } from "react-to-print";
import dayjs from "dayjs";
import "./adeudo.css";

import "dayjs/locale/es";
dayjs.locale("es");
const { TextArea } = Input;
const formatDate = () => {
  const day = dayjs().format("DD"); // Día con dos dígitos
  const month = dayjs().format("MMMM"); // Nombre completo del mes
  const year = dayjs().format("YYYY"); // Año con cuatro dígitos

  return `${day} de ${month} del ${year}`;
};
const ModalVerAdeudo = ({ data, setMostrar, mostrar }) => {
  const componentRef = useRef();
  const componentRef2 = useRef();
  const textRef = useRef();
  const [lineWidth, setLineWidth] = useState("100%");

  const closeModal = () => {
    setMostrar(false);
  };
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,

    pageStyle: `
    @page {
      size: A4 landscape !important;
      margin: 0;
    }
    @media print {
      .print-container {
        display: flex;
        justify-content: space-between;
        width: 100%;
        height: 100%;
        padding: 0;
        margin: 0;
      }
      .print-container > div {
        width: 50%;
        box-sizing: border-box;
        padding: 10mm;
        margin: 0;
      }
    }
  `,
  });

  return (
    <Modal
      title={`Adeudo Nº ${data.correlativo}`}
      open={mostrar}
      onCancel={closeModal}
      cancelText={"Cancelar"}
      width={"650px"}
      footer={null}
    >
      <div className="print-container" ref={componentRef}>
        <div
          style={{
            backgroundColor: "white",
            width: "148mm", // A5 width
            height: "200mm", // A5 height
            padding: "10mm", // Padding for content
            boxSizing: "border-box",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column",
            }}
          >
            <section className="header1">
              <div className="imagen1">
                <Image
                  src={gobierno}
                  preview={false}
                  style={{ width: "100px" }}
                />
              </div>
              <div className="title">
                <p style={{ fontSize: "14px" }}>
                  GOBIERNO REGIONAL DE AREQUIPA
                </p>
                <p style={{ fontSize: "14px" }}>AUTORIDAD AUTONOMA DE MAJES</p>
                <p style={{ fontSize: "14px" }}>
                  PROYECTO ESPECIAL MAJES - SIGUAS
                </p>
              </div>
              <div className="imagen2">
                <Image src={image} preview={false} style={{ width: "80px" }} />
              </div>
            </section>
            <hr style={{ width: "100%", marginTop: "10px" }} />
            <p
              style={{
                fontSize: "12px",
                marginTop: "5px",
                justifyContent: "center",
              }}
            >
              {data?.nombre_anio === ""
                ? '"AÑO DEL BICENTENARIO DE LAS BATALLAS HEROICAS DE AYACUCHO Y JUNIN"'
                : data?.nombre_anio}
            </p>
            <section className="title">
              <u>CONSTANCIA Nº {data.correlativo} - 2024</u>
            </section>
            <section className="body">
              <p style={{ textAlign: "justify", marginTop: "15px" }}>
                El que suscribe, jefe(e) del Área de Control y Saneamiento
                Patrimonial del Proyecto Especial Majes Siguas - AUTODEMA
              </p>
              <p style={{ textAlign: "justify", marginTop: "15px" }}>
                Hace constar:
              </p>
              <p style={{ textAlign: "justify", marginTop: "15px" }}>
                Que el Sr. (a,ta):{" "}
                <strong>
                  {data?.trabajador ? data.trabajador : "_______________"}
                </strong>
              </p>

              <p
                style={{
                  textAlign: "justify",
                  marginTop: "15px",
                  textJustify: "",
                }}
              >
                Ex trabajador (a) del Proyecto Especial MAJES - AUTODEMA
                <strong>
                  {" "}
                  {data?.adeudo ? data?.adeudo : "_______________"}
                </strong>{" "}
                ningun bien patrimonial,{" "}
                {data?.contenido
                  ? data?.contenido
                  : "al término de su contrato con fecha"}{" "}
                {data?.fecha ? data?.fecha : dayjs().format("DD-MM-YYYY")} en la
                modalidad de {data?.modalidad ? data?.modalidad : "___________"}
                .
              </p>

              <p style={{ textAlign: "justify", marginTop: "15px" }}>
                Se expide la presente solicitud del interesado, para los fines
                que estime convenientes.
              </p>

              <p style={{ textAlign: "justify", marginTop: "15px" }}>
                Arequipa, {data?.fecha_texto}
              </p>

              <p
                style={{
                  marginTop: "40px",
                  width: "100%",
                  textAlign: "center",
                }}
              >
                _______________________
              </p>
              <p
                style={{
                  width: "100%",
                  textAlign: "center",
                  textTransform: "capitalize",
                }}
              >
                Lic. {data?.jefe}
              </p>
              <p
                style={{
                  width: "100%",
                  textAlign: "center",
                }}
              >
                Responsable Control y Saneamiento Patrimonial(e)
              </p>
            </section>
            <p
              style={{
                textAlign: "left",
                marginTop: "20px",
                width: "100%",
              }}
            >
              Revisado, Verificado y Elaborado Por:
            </p>
            <p
              style={{ textAlign: "left", marginTop: "40px", width: lineWidth }}
            >
              ___________________________
            </p>
            <p
              ref={textRef}
              style={{ textAlign: "left", marginTop: "5px", width: "100%" }}
            >
              {data?.encargado_tipo} {data?.encargado}
            </p>
          </div>
        </div>
        <div
          className="print-only"
          style={{
            backgroundColor: "white",
            width: "148mm",
            height: "200mm",
            padding: "10mm",
            boxSizing: "border-box",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column",
            }}
          >
            <section className="header1">
              <div className="imagen1">
                <Image
                  src={gobierno}
                  preview={false}
                  style={{ width: "100px" }}
                />
              </div>
              <div className="title">
                <p style={{ fontSize: "14px" }}>
                  GOBIERNO REGIONAL DE AREQUIPA
                </p>
                <p style={{ fontSize: "14px" }}>AUTORIDAD AUTONOMA DE MAJES</p>
                <p style={{ fontSize: "14px" }}>
                  PROYECTO ESPECIAL MAJES - SIGUAS
                </p>
              </div>
              <div className="imagen2">
                <Image src={image} preview={false} style={{ width: "80px" }} />
              </div>
            </section>
            <hr style={{ width: "100%", marginTop: "10px" }} />
            <p
              style={{
                fontSize: "12px",
                marginTop: "5px",
                justifyContent: "center",
              }}
            >
              {data?.nombre_anio === ""
                ? '"AÑO DEL BICENTENARIO DE LAS BATALLAS HEROICAS DE AYACUCHO Y JUNIN"'
                : data?.nombre_anio}
            </p>
            <section className="title">
              <u>CONSTANCIA Nº {data.correlativo} - 2024</u>
            </section>
            <section className="body">
              <p style={{ textAlign: "justify", marginTop: "15px" }}>
                El que suscribe, jefe(e) del Área de Control y Saneamiento
                Patrimonial del Proyecto Especial Majes Siguas - AUTODEMA
              </p>
              <p style={{ textAlign: "justify", marginTop: "15px" }}>
                Hace constar:
              </p>
              <p style={{ textAlign: "justify", marginTop: "15px" }}>
                Que el Sr. (a,ta):{" "}
                <strong>
                  {data?.trabajador ? data.trabajador : "_______________"}
                </strong>
              </p>

              <p
                style={{
                  textAlign: "justify",
                  marginTop: "15px",
                  textJustify: "",
                }}
              >
                Ex trabajador (a) del Proyecto Especial MAJES - AUTODEMA
                <strong>
                  {" "}
                  {data?.adeudo ? data?.adeudo : "_______________"}
                </strong>{" "}
                ningun bien patrimonial,{" "}
                {data?.contenido
                  ? data?.contenido
                  : "al término de su contrato con fecha"}{" "}
                {data?.fecha ? data?.fecha : dayjs().format("DD-MM-YYYY")} en la
                modalidad de {data?.modalidad ? data?.modalidad : "___________"}
                .
              </p>

              <p style={{ textAlign: "justify", marginTop: "15px" }}>
                Se expide la presente solicitud del interesado, para los fines
                que estime convenientes.
              </p>

              <p style={{ textAlign: "justify", marginTop: "15px" }}>
                Arequipa, {data?.fecha_texto}
              </p>

              <p
                style={{
                  marginTop: "40px",
                  width: "100%",
                  textAlign: "center",
                }}
              >
                _______________________
              </p>
              <p
                style={{
                  width: "100%",
                  textAlign: "center",
                  textTransform: "capitalize",
                }}
              >
                Lic. {data?.jefe}
              </p>
              <p
                style={{
                  width: "100%",
                  textAlign: "center",
                }}
              >
                Responsable Control y Saneamiento Patrimonial(e)
              </p>
            </section>
            <p
              style={{
                textAlign: "left",
                marginTop: "20px",
                width: "100%",
              }}
            >
              Revisado, Verificado y Elaborado Por:
            </p>
            <p
              style={{ textAlign: "left", marginTop: "40px", width: lineWidth }}
            >
              ___________________________
            </p>
            <p
              ref={textRef}
              style={{ textAlign: "left", marginTop: "5px", width: "100%" }}
            >
              {data?.encargado_tipo} {data?.encargado}
            </p>
          </div>
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <Button type="primary" onClick={handlePrint}>
          Imprimir
        </Button>
      </div>
    </Modal>
  );
};

export default ModalVerAdeudo;
