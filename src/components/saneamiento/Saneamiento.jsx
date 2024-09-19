import { Input, Select, Table, Button, InputNumber, DatePicker, notification } from "antd";
import React, { useEffect, useState, useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { PrinterOutlined } from "@ant-design/icons";
import "../etiquetas/etiquetas.css";
import BarCode from "../etiquetas/BarCode";
const { Search } = Input;
const Saneamiento = ({ setTitle }) => {
  const barcodeRef = useRef();
  const [printTrigger, setPrintTrigger] = useState(false);
  const [data, setData] = useState([]);
  const [centroCosto, setCentroCosto] = useState([]);
  const [sedes, setSedes] = useState([]);
  const [ubicacion, setUbicacion] = useState([]);
  const [usuario, setUsuario] = useState([]);
  const [barCode, setBarcode] = useState();
  const [filtros, setFiltros] = useState({
    sede: "",
    centroCosto: "",
    ubicacion: "",
    usuario: "",
    familia: "",
    endSeq: "",
    startSeq: "",
    anio: "2024",
    startCodigoActivo: "",
    endCodigoActivo: "",
    endCodigoActivo: "",
    desc: "",
  });

  useEffect(() => {
    setTitle("Saneamiento");
    getCentroCosto();
    getUbicacion();
    getSedes();
    getUsuario();
  }, []);

  useEffect(() => {
    getEtiquetas();
  }, [filtros]);

  const getSedes = async (docData) => {
    const response = await fetch(`http://10.30.1.42:8084/api/v1/sedes`);
    const info = await response.json();
    if (info) {
      setSedes(info.data);
    }
    return info.data;
  };
  const getUsuario = async (docData) => {
    const response = await fetch(`http://10.30.1.42:8084/api/v1/usuario`);
    const info = await response.json();
    if (info) {
      setUsuario(info.data);
    }
    return info.data;
  };

  const getCentroCosto = async (docData) => {
    const response = await fetch(
      `http://10.30.1.42:8084/api/v1/centro_costo/all`
    );
    const info = await response.json();
    if (info) {
      setCentroCosto(info.data);
    }
    return info.data;
  };
  const getUbicacion = async (docData) => {
    const response = await fetch(`http://10.30.1.42:8084/api/v1/ubicacion`);
    const info = await response.json();
    if (info) {
      setUbicacion(info.data);
    }
    return info.data;
  };
  const getEtiquetas = async () => {
    const params = {};

    for (const key in filtros) {
      if (filtros[key]) {
        params[key] = filtros[key];
      }
    }
    const queryParams = new URLSearchParams(params).toString();
    const response = await fetch(
      `http://10.30.1.42:8084/api/v1/etiqueta?${queryParams}`
    );
    const info = await response.json();
    if (info) {
      setData(info.data);
    }
  };
  const columns = [
    {
      title: "Sec",
      dataIndex: "secuencia",
      align: "center",
    },
    {
      title: "Código Patrimonial",
      dataIndex: "codigo_activo",
      align: "center",
    },
    {
      title: "Cod Barra / Inv. Anterior",
      dataIndex: "codigo_barra",
      align: "center",
    },
    {
      title: "Descripción",
      dataIndex: "descripcion",
      align: "center",
    },
    {
      title: "Nro serie",
      dataIndex: "nro_serie",
      align: "center",
    },
    {
      title: "Acciones",
      align: "center",
      key: "action",
      render: (_, record) => (
        <Button onClick={() => handleBarcodePrint(record)}>
          <PrinterOutlined />
        </Button>
      ),
    },
  ];

  const handlePrint = useReactToPrint({
    content: () => barcodeRef.current,
  });

  useEffect(() => {
    if (printTrigger && barCode.length > 0) {
      handlePrint();
      setPrintTrigger(false);
    }
  }, [barCode, printTrigger]);

  const handleBarcodePrint = (record) => {
    setBarcode([record]);
    setPrintTrigger(true);
  };

  const handleMultiBarcodePrint = () => {
    if(data.length <= 100 ){
      setBarcode(data);
      setPrintTrigger(true);

    }else{
      notification.error({
        message: "Solo es posible imprimir 100 etiquetas a la vez.",
      });
    }
  };


  return (
    <div className="container">
      <div className="filters">
        <section className="filters-left">
          <div className="inputs">
            <label htmlFor="">Año</label>
            <DatePicker
              placeholder="Selecione un año"
              style={{ width: "400px" }}
              onChange={(e) => setFiltros((value) => ({ ...value, anio: e }))}
              picker="year"
            />
          </div>
          {/* <div className="inputs">
            <label htmlFor="">Tipo de registro</label>
            <Select />
          </div> */}
          <div className="inputs">
            <label htmlFor="">Sede</label>
            <Select
              className="input-form"
              value={filtros.sede || undefined}
              placeholder={"Sede"}
              onChange={(e) => setFiltros((value) => ({ ...value, sede: e }))}
              showSearch
              style={{ width: "400px" }}
              optionFilterProp="children"
              filterOption={(input, option) =>
                (option?.label ?? "")
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
              popupMatchSelectWidth={false}
              allowClear
              options={sedes.map((item) => {
                return {
                  value: item.sede,
                  label: item.nombre_sede,
                };
              })}
            />
          </div>
          <div className="inputs">
            <label htmlFor="">Centro Costo</label>
            <Select
              className="input-form"
              value={filtros.centroCosto || undefined}
              placeholder={"Centro de costo"}
              onChange={(e) =>
                setFiltros((value) => ({ ...value, centroCosto: e }))
              }
              showSearch
              style={{ width: "400px" }}
              optionFilterProp="children"
              filterOption={(input, option) =>
                (option?.label ?? "")
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
              allowClear
              popupMatchSelectWidth={false}
              options={centroCosto.map((item) => {
                return {
                  value: item.centro_costo,
                  label: item.nombre_depend,
                };
              })}
            />
          </div>
          <div className="inputs">
            <label htmlFor="">Ubicación Final</label>
            <Select
              className="input-form"
              value={filtros.ubicacion || undefined}
              placeholder={"Ubicación Final"}
              onChange={(e) =>
                setFiltros((value) => ({ ...value, ubicacion: e }))
              }
              showSearch
              style={{ width: "400px" }}
              optionFilterProp="children"
              filterOption={(input, option) =>
                (option?.label ?? "")
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
              allowClear
              popupMatchSelectWidth={false}
              options={ubicacion.map((item) => {
                return {
                  value: item.cod_ubicac,
                  label: item.ubicac_fisica,
                };
              })}
            />
          </div>
          <div className="inputs">
            <label htmlFor="">Usuario Final</label>
            <Select
              className="input-form"
              value={filtros.usuario || undefined}
              placeholder={"Usuario Final"}
              onChange={(e) =>
                setFiltros((value) => ({ ...value, usuario: e }))
              }
              showSearch
              style={{ width: "400px" }}
              optionFilterProp="children"
              filterOption={(input, option) =>
                (option?.label ?? "")
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
              allowClear
              popupMatchSelectWidth={false}
              options={usuario.map((item) => {
                return {
                  value: item.EMPLEADO,
                  label:
                    item.APELLIDO_PATERNO +
                    " " +
                    item.APELLIDO_MATERNO +
                    " " +
                    item.NOMBRES,
                };
              })}
            />
          </div>
          <div className="inputs">
            <label htmlFor="">Familia</label>
            <Select style={{ width: "400px" }} />
          </div>
        </section>

        <section className="filters-right">
          <div className="filters">
            <label htmlFor="">Por Secuencia</label>
            <div>
              <label htmlFor="">Desde</label>
              <InputNumber
                min={0}

                onChange={(e) =>
                  setFiltros((value) => ({ ...value, startSeq: e }))
                }
                controls={false}
              />
            </div>
            <div style={{ marginTop: "10px" }}>
              <label htmlFor="">Hasta</label>
              <InputNumber
                min={0}
                onChange={(e) =>
                  setFiltros((value) => ({ ...value, endSeq: e }))
                }
                controls={false}
              />
            </div>
          </div>
          <div className="filters">
            <label htmlFor="">Por Código Patrimonial</label>
            <div>
              <label htmlFor="">Desde</label>
              <InputNumber
                min={1}

                onChange={(e) =>
                  setFiltros((value) => ({ ...value, startCodigoActivo: e }))
                }
                controls={false}
              />
            </div>
            <div style={{ marginTop: "10px" }}>
              <label htmlFor="">Hasta</label>
              <InputNumber
                min={1}
                onChange={(e) =>
                  setFiltros((value) => ({ ...value, endCodigoActivo: e }))
                }
                controls={false}

              />
            </div>
          </div>
        </section>
      </div>
      <section className="search">
        <Search
          placeholder="Buscar"
          style={{ width: "300px" }}
          onChange={(e) => setFiltros((value) => ({ ...value, desc: e.target.value }))}
        />
        <Button onClick={(e) => handleMultiBarcodePrint()}>
          Imprimir Varios
        </Button>
      </section>

      <section className="table">
        <Table columns={columns} dataSource={data} />
      </section>
      <div style={{ display: "none" }}>
        <div ref={barcodeRef}>
          <BarCode values={barCode} saneamiento={true} />
        </div>
      </div>
    </div>
  );
};

export default Saneamiento;
