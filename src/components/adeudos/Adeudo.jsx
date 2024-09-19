import React, { useEffect, useRef, useState } from "react";
import "./adeudo.css";
import image from "../../assets/logo_autodema.png";
import gobierno from "../../assets/gobierno.png";
import { Select, Input, Image, Button, DatePicker, notification } from "antd";
import { useReactToPrint } from "react-to-print";
import dayjs from "dayjs";
import { useNavigate } from 'react-router-dom';

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
  const navigate = useNavigate(); // Obtén la función navigate

  const componentRef = useRef();
  const componentRef2 = useRef();

  const textRef = useRef();
  const [lineWidth, setLineWidth] = useState("100%");

  useEffect(() => {
    setTitle("Adeudos");
  }, []);
  const validateBeforePrint = () => {
    if (!data.modalidad || !data.encargado || !data.trabajador) {
      notification.error({
        message:
          "Los campos: Trabajador, Modalidad y Revisado por son obligatorios!",
      });
      return false;
    }

    return true;
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

  const handlePrintWithValidation = () => {
    if (validateBeforePrint()) {
      handlePrint();
    }
  };
  const [trabajadores, setTrabajadores] = useState([]);
  const [planilla, setPlanilla] = useState();
  const [showOtherInput, setShowOtherInput] = useState(false)
  const [todosTrabajadores, setTodosTrabajadores] = useState([]);

  const [data, setData] = useState({
    trabajador: "",
    nombre_anio:
      '"AÑO DEL BICENTENARIO, DE LA CONSOLIDACIÓN DE NUESTRA INDEPENDENCIA, Y DE LA CONMEMORACIÓN DE LAS HEROICAS BATALLAS DE JUNIN Y AYACUCHO"',
    contenido: "al término de su contrato con fecha",
    adeudo: "NO ADEUDA",
    modalidad: "",
    fecha: dayjs().format("DD-MM-YYYY"),
    tipo_encargado: "",
    encargado: "",
    fecha_texto: formatDate(),
    jefe: "",
  });

  useEffect(() => {
    if (textRef.current) {
      const width = textRef.current.offsetWidth;
      console.log(textRef.current);
      console.log(`Offset width: ${width}`); // Log para depurar el valor de offsetWidth
      setLineWidth(`${width}px`);
    }
  }, [data.encargado, data.tipo_encargado]);

  const getTrabajadores = async () => {
    const response = await fetch(`http://10.30.1.42:8084/api/v1/planilla`);
    const info = await response.json();
    if (info) {
      setTrabajadores(info.data);
    }
    return info.data;
  };
  // const getTodosTrabajadores = async () => {
  //   const response = await fetch(`http://10.30.1.42:8084/api/v1/usuario`);
  //   const info = await response.json();
  //   if (info) {
  //     setTodosTrabajadores(info.data);
  //   }
  //   return info.data;
  // };
  useEffect(() => {
    getTrabajadores();
  }, []);

  useEffect(() => {
    if (trabajadores.length > 0) {
      const filter = trabajadores.filter(
        (item) =>
          item.DE_FUNC == "Encargado De Control Y Saneamiento Patrimonial"
      );
      setPlanilla(filter);
    }
  }, [trabajadores]);
  const postAdeudo = async () => {
    const format = {
      ...data,
      jefe:
        planilla?.at(-1)?.DE_NOMB +
        " " +
        planilla?.at(-1)?.AP_PATE +
        " " +
        planilla?.at(-1)?.AP_MATE || "",
      usuario_id: localStorage.getItem("usuario")
    };
    if (!format.modalidad || !format.encargado || !format.trabajador) {
      notification.error({
        message:
          "Los campos: Trabajador, Modalidad y Revisado por son obligatorios!",
      });
    } else {
      const response = await fetch(`http://10.30.1.42:8084/api/v1/adeudos`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(format),
      });
      const confirm = await response.json();
      if (response.status === 201) {
        notification.success({
          message: confirm.msg,
        });
        navigate('/adeudo/historial');
      } else {
        notification.error({
          message: confirm.msg,
        });
      }
    }
  };

  const adeudo = [
    { label: "ADEUDA", value: "ADEUDA" },
    { label: "NO ADEUDA", value: "NO ADEUDA" },
  ];

  const modalidad = [
    { label: "construcción civil", value: "construcción civil" },
    { label: "indeterminado", value: "indeterminado" },
    { label: "contrato", value: "contrato" },
  ];

  console.log(data);
  
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
              Nombre del año
            </p>
            <TextArea
              rows={2}
              onChange={(e) =>
                setData((data) => ({ ...data, nombre_anio: e.target.value }))
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
              options={[
                ...trabajadores.map((item) => {
                  return {
                    value: item.DE_NOMB + " " + item.AP_PATE + " " + item.AP_MATE,
                    label: item.DE_NOMB + " " + item.AP_PATE + " " + item.AP_MATE,
                  };
                }),
                { value: "Otro", label: "Otro" }, // Agrega la opción "Otro"
              ]}
              placeholder="Trabajador"
              onChange={(e) => {
                if (e === "Otro") {
                  // Lógica cuando se selecciona "Otro", por ejemplo, mostrar un campo de texto adicional
                  setShowOtherInput(true);
                } else {
                  setShowOtherInput(false);
                }
                setData((data) => ({ ...data, trabajador: e }));
              }}
              showSearch
              optionFilterProp="children"
              filterOption={(input, option) =>
                (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
              }
              allowClear
            ></Select>
            {showOtherInput && (
              <Input
                style={{ marginTop: 8 }}
                placeholder="Ingrese al trabajador"
                onChange={(e) => setData((data) => ({ ...data, trabajador: e.target.value }))}
              />
            )}
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
              placeholder="Selecciona una fecha o se guardara la fecha actual."
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
              options={modalidad.map((item) => item)}
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
              Revisado por
            </p>
            <div style={{ display: "flex", gap: "2px" }}>
              <Input
                style={{ width: "20%" }}
                onChange={(e) =>
                  setData((data) => ({
                    ...data,
                    tipo_encargado: e.target.value,
                  }))
                }
              />
              <Select
                style={{ width: "80%" }}
                options={trabajadores.map((item) => {
                  return {
                    value:
                      item.DE_NOMB + " " + item.AP_PATE + " " + item.AP_MATE,
                    label:
                      item.DE_NOMB + " " + item.AP_PATE + " " + item.AP_MATE,
                  };
                })}
                placeholder="Revisado por"
                onChange={(e) => setData((data) => ({ ...data, encargado: e }))}
                showSearch
                optionFilterProp="children"
                popupMatchSelectWidth={false}
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
        <div className="print-container" ref={componentRef}>
          <div
            style={{
              backgroundColor: "white",
              width: "148mm", // A5 width
              height: "190mm", // A5 height
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
                  <p style={{ fontSize: "14px" }}>
                    AUTORIDAD AUTONOMA DE MAJES
                  </p>
                  <p style={{ fontSize: "14px" }}>
                    PROYECTO ESPECIAL MAJES - SIGUAS
                  </p>
                </div>
                <div className="imagen2">
                  <Image
                    src={image}
                    preview={false}
                    style={{ width: "80px" }}
                  />
                </div>
              </section>
              <hr style={{ width: "100%", marginTop: "8px" }} />
              <p style={{ fontSize: "12px", marginTop: "8px" }}>
                {data.anio === ""
                  ? '"AÑO DEL BICENTENARIO DE LAS BATALLAS HEROICAS DE AYACUCHO Y JUNIN"'
                  : data.nombre_anio}
              </p>
              <section className="title">
                <u>CONSTANCIA Nº XXX - 2024</u>
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
                  Que el Sr. (a,ta):
                  <strong> {data.trabajador}</strong>
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
                  <strong>
                    {data.fecha ? data.fecha : dayjs().format("DD-MM-YYYY")}
                  </strong>{" "}
                  en la modalidad de {data.modalidad}.
                </p>

                <p style={{ textAlign: "justify", marginTop: "15px" }}>
                  Se expide la presente solicitud del interesado, para los fines
                  que estime convenientes.
                </p>

                <p style={{ textAlign: "justify", marginTop: "15px" }}>
                  Arequipa, {formatDate()}
                </p>

                <p
                  style={{
                    marginTop: "60px",
                    width: "100%",
                    textAlign: "center",
                  }}
                >
                  __________________________________
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
              <div
                style={{
                  width: "100%",
                  display: "flex",
                  flexDirection: "column",
                  alignContent: "flex-start",
                }}
              >
                <p
                  style={{
                    textAlign: "left",
                    marginTop: "40px",
                    width: "100%",
                  }}
                >
                  Revisado, Verificado y Elaborado Por:
                </p>

                <span
                  style={{
                    textAlign: "left",
                    marginTop: "40px",
                    width: lineWidth,
                  }}
                >
                  ___________________________
                </span>
                <p
                  ref={textRef}
                  style={{
                    textAlign: "left",
                    marginTop: "5px",
                    display: "inline-block",
                    width: "auto",
                    whiteSpace: "nowrap",
                  }}
                >
                  {`${data?.tipo_encargado} ${data?.encargado}`}
                </p>
              </div>
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
                  <p style={{ fontSize: "14px" }}>
                    AUTORIDAD AUTONOMA DE MAJES
                  </p>
                  <p style={{ fontSize: "14px" }}>
                    PROYECTO ESPECIAL MAJES - SIGUAS
                  </p>
                </div>
                <div className="imagen2">
                  <Image
                    src={image}
                    preview={false}
                    style={{ width: "80px" }}
                  />
                </div>
              </section>
              <hr style={{ width: "100%", marginTop: "8px" }} />
              <p style={{ fontSize: "12px", marginTop: "8px" }}>
                {data.anio === ""
                  ? '"AÑO DEL BICENTENARIO DE LAS BATALLAS HEROICAS DE AYACUCHO Y JUNIN"'
                  : data.nombre_anio}
              </p>
              <section className="title">
                <u>CONSTANCIA Nº XXX - 2024</u>
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
                  Que el Sr. (a,ta):
                  <strong> {data.trabajador}</strong>
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
                  <strong>
                    {data.fecha ? data.fecha : dayjs().format("DD-MM-YYYY")}
                  </strong>{" "}
                  en la modalidad de {data.modalidad}.
                </p>

                <p style={{ textAlign: "justify", marginTop: "15px" }}>
                  Se expide la presente solicitud del interesado, para los fines
                  que estime convenientes.
                </p>

                <p style={{ textAlign: "justify", marginTop: "15px" }}>
                  Arequipa, {formatDate()}
                </p>

                <p
                  style={{
                    marginTop: "60px",
                    width: "100%",
                    textAlign: "center",
                  }}
                >
                  __________________________________
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
              <div
                style={{
                  width: "100%",
                  display: "flex",
                  flexDirection: "column",
                  alignContent: "flex-start",
                }}
              >
                <p
                  style={{
                    textAlign: "left",
                    marginTop: "20px",
                    width: "100%",
                  }}
                >
                  Revisado, Verificado y Elaborado Por:
                </p>

                <span
                  style={{
                    textAlign: "left",
                    marginTop: "40px",
                    width: lineWidth,
                  }}
                >
                  ___________________________
                </span>
                <p
                  ref={textRef}
                  style={{
                    textAlign: "left",
                    marginTop: "5px",
                    display: "inline-block",
                    width: "auto",
                    whiteSpace: "nowrap",
                  }}
                >
                  {`${data?.tipo_encargado} ${data?.encargado}`}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <section className="buttons">
        <div>
          <Button type="primary" onClick={postAdeudo}>
            Guardar
          </Button>
          {/* <Button onClick={handlePrintWithValidation}>Imprimir</Button> */}
        </div>
      </section>
    </>
  );
};

export default Adeudo;
