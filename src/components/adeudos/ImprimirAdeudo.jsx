import React from "react";
import { Select, Input, Image } from "antd";
import { useReactToPrint } from 'react-to-print';
import dayjs from "dayjs";

import "./adeudo.css";

const ImprimirAdeudo = ({data, image}) => {
  return (
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
          El que suscribe, jefe(e) del Área de Control y Saneamiento Patrimonial
          del Proyecto Especial Majes Siguas - AUTODEMA
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
          <strong> {data.adeudo ? data.adeudo : "_______________"}</strong>{" "}
          ningun bien patrimonial, al término de su contrato con fecha{" "}
          {dayjs().format("DD/MM/YYYY")} en la modalidad de construcción civil.
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
  );
};

export default ImprimirAdeudo;
