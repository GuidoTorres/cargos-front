import React, { useEffect, useRef, useState } from "react";
import "./adeudo.css";
import image from "../../assets/logo_autodema.png";
import gobierno from "../../assets/gobierno.png";
import { Select, Input, Image, Button, DatePicker } from "antd";
import { useReactToPrint } from "react-to-print";
import dayjs from "dayjs";
import "dayjs/locale/es";

dayjs.locale("es");
const { TextArea } = Input;
const formatDate = () => {
  const day = dayjs().format("DD"); // Día con dos dígitos
  const month = dayjs().format("MMMM"); // Nombre completo del mes
  const year = dayjs().format("YYYY"); // Año con cuatro dígitos

  return `${day} de ${month} del ${year}`;
};
const Adeudo = ({ setTitle }) => {
  const componentRef = useRef();
  const textRef = useRef();
const [lineWidth, setLineWidth] = useState("100%");

  useEffect(() => {
    setTitle("Adeudos");
  }, []);

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });
  const [data, setData] = useState({
    trabajador: "",
    anio: "",
    contenido: "",
    adeudo: "",
    modalidad: "",
    fecha: "",
    encargado_tipo: "",
    encargado: "",
  });
  const [trabajadores, setTrabajadores] = useState([]);
  const [planilla, setPlanilla] = useState();

  console.log(lineWidth);
  useEffect(() => {
    if (textRef.current) {
      setLineWidth(`${textRef.current.offsetWidth}px`);
    }
  }, [data]);

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

  useEffect(() => {
    const filter = trabajadores.filter(
      (item) => item.DE_FUNC == "ENCARGADO DE CONTROL Y SANEAMIENTO PATRIMONIAL"
    );
    setPlanilla(filter);
  }, [trabajadores]);

  const adeudo = [
    { label: "ADEUDA", value: "ADEUDA" },
    { label: "NO ADEUDA", value: "NO ADEUDA" },
  ];
  return (
    <>
      <div className="container-adeudo">
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
              showSearch
              optionFilterProp="children"
              filterOption={(input, option) =>
                (option?.label ?? "")
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
              allowClear
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
              showSearch
              optionFilterProp="children"
              filterOption={(input, option) =>
                (option?.label ?? "")
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
              allowClear
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
              format={"DD-MM-YYYY"}
              placeholder="Selecciona una fecha"
              onChange={(e) =>
                setData((data) => ({
                  ...data,
                  fecha: dayjs(e).format("DD-MM-YYYY"),
                }))
              }
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
              placeholder="Modalidad"
              style={{ width: "100%" }}
              options={adeudo.map((item) => item)}
              onChange={(e) => setData((data) => ({ ...data, modalidad: e }))}
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
              Encargado
            </p>
            <div style={{ display: "flex", gap: "2px" }}>
              <Input
                style={{ width: "20%" }}
                onChange={(e) =>
                  setData((data) => ({ ...data, encargado_tipo: e.target.value }))
                }
              />
              <Select
                style={{ width: "80%" }}
                options={trabajadores.map((item) => {
                  return {
                    value:
                      item.AP_MATE + " " + item.AP_PATE + " " + item.DE_NOMB,
                    label:
                      item.AP_MATE + " " + item.AP_PATE + " " + item.DE_NOMB,
                  };
                })}
                placeholder="Encargado"
                onChange={(e) => setData((data) => ({ ...data, encargado: e }))}
                showSearch
                optionFilterProp="children"
                filterOption={(input, option) =>
                  (option?.label ?? "")
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
                allowClear
              ></Select>
            </div>
          </div>
        </div>
        <div
          style={{
            backgroundColor: "white",
            width: "148mm", // A5 width
            height: "210mm", // A5 height
            padding: "10mm", // Padding for content
            boxSizing: "border-box",
            width: "600px",
            border: "1px solid lightgray",
          }}
          ref={componentRef}
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
            <br />
            <hr style={{ width: "95%" }} />
            <p style={{ fontSize: "12px" }}>
              {data.anio === ""
                ? '"AÑO DEL BICENTENARIO DE LAS BATALLAS HEROICAS DE AYACUCHO Y JUNIN"'
                : data.anio}
            </p>
            <section className="title">
              <u>CONSTANCIA Nº 053 - 2024</u>
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
                  {data.trabajador ? data.trabajador : "_______________"}
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
                  {data.adeudo ? data.adeudo : "_______________"}
                </strong>{" "}
                ningun bien patrimonial,{" "}
                {data.contenido
                  ? data.contenido
                  : "al término de su contrato con fecha"}{" "}
                {data.fecha ? data.fecha : dayjs().format("DD-MM-YYYY")} en la
                modalidad de {data.modalidad ? data.modalidad : "___________"}.
              </p>

              <p style={{ textAlign: "justify", marginTop: "15px" }}>
                Se expide la presente a solicitud del interesado, para los fines
                que estime convenientes.
              </p>

              <p style={{ textAlign: "justify", marginTop: "15px" }}>
                Arequipa, {formatDate()}
              </p>

              <p
                style={{
                  marginTop: "80px",
                  width: "100%",
                  textAlign: "center",
                }}
              >
                _____________________________________________
              </p>
              <p
                style={{
                  width: "100%",
                  textAlign: "center",
                  textTransform: "capitalize",
                }}
              >
                Lic.{" "}
                {planilla?.at(-1)?.DE_NOMB +
                  " " +
                  planilla?.at(-1)?.AP_PATE +
                  " " +
                  planilla?.at(-1)?.AP_MATE}
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
            <p style={{ textAlign: "left", marginTop: "80px", width: lineWidth }}>
              ___________________________
            </p>
            <p ref={textRef} style={{ textAlign: "left", marginTop: "5px", width: "100%" }}>
              {data?.encargado_tipo} {data?.encargado}
            </p>
          </div>
        </div>
      </div>
      <section className="buttons">
        <div>
          <Button type="primary">Guardar</Button>
          <Button onClick={handlePrint}>Imprimir</Button>
        </div>
      </section>
    </>
  );
};

export default Adeudo;
