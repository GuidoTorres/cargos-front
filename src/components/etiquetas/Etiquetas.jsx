import { Input, Select, Table, Button, InputNumber, DatePicker } from "antd";
import React, { useEffect, useState, useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { PrinterOutlined } from "@ant-design/icons";
import "./etiquetas.css";
import BarCode from "./BarCode";
const { Search } = Input;
const Etiquetas = ({ setTitle }) => {
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
  });

  useEffect(() => {
    setTitle("Etiquetas");
    getCentroCosto();
    getUbicacion();
    getSedes();
    getUsuario();
  }, []);

  useEffect(() => {
    getEtiquetas();
  }, [filtros]);

  const getSedes = async (docData) => {
    const response = await fetch(`http://localhost:3001/api/v1/sedes`);
    const info = await response.json();
    if (info) {
      setSedes(info.data);
    }
    return info.data;
  };
  const getUsuario = async (docData) => {
    const response = await fetch(`http://localhost:3001/api/v1/usuario`);
    const info = await response.json();
    if (info) {
      setUsuario(info.data);
    }
    return info.data;
  };

  const getCentroCosto = async (docData) => {
    const response = await fetch(
      `http://localhost:3001/api/v1/centro_costo/all`
    );
    const info = await response.json();
    if (info) {
      setCentroCosto(info.data);
    }
    return info.data;
  };
  const getUbicacion = async (docData) => {
    const response = await fetch(`http://localhost:3001/api/v1/ubicacion`);
    const info = await response.json();
    if (info) {
      setUbicacion(info.data);
    }
    return info.data;
  };
  const getEtiquetas = async () => {
    const params = {};

    // Agrega solo los parámetros que tienen valores
    for (const key in filtros) {
      if (filtros[key]) {
        params[key] = filtros[key];
      }
    }

    const queryParams = new URLSearchParams(params).toString();
    const response = await fetch(
      `http://localhost:3001/api/v1/adeudo/etiqueta?${queryParams}`
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
    setBarcode(data);
    setPrintTrigger(true);
  };

  console.log(filtros);

  return (
    <div className="container">
      <div className="filters">
        <section className="filters-left">
          <div className="inputs">
            <label htmlFor="">Año</label>
            <DatePicker
              placeholder="Selecione un año"
              style={{ width:"400px" }}
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
              style={{ width:"400px" }}
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
              style={{ width:"400px" }}
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
              style={{ width:"400px" }}
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
              style={{ width:"400px" }}
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
            <Select               style={{ width:"400px" }}
/>
          </div>
        </section>

        <section className="filters-right">
          {/* <Select
            style={{ width: "200px" }}
            options={[
              { value: 0, label: "Ninguno" },
              { value: 1, label: "Por Secuencia" },
              { value: 2, label: "Por Código Patrimonial" },
            ]}
          /> */}
          <label htmlFor="">Por Secuencia</label>
          <div>
            <label htmlFor="">Desde</label>
            <InputNumber
              min={1}
              onChange={(e) =>
                setFiltros((value) => ({ ...value, startSeq: e }))
              }
            />
          </div>
          <div style={{marginTop:"10px"}}>
            <label htmlFor="">Hasta</label>
            <InputNumber
              min={1}
              onChange={(e) => setFiltros((value) => ({ ...value, endSeq: e }))}
            />
          </div>
        </section>
      </div>
      <section className="search">
        <Search placeholder="Buscar" style={{ width: "300px" }} />
        <Button onClick={(e) => handleMultiBarcodePrint()}>
          Imprimir Varios
        </Button>
      </section>

      <section className="table">
        <Table columns={columns} dataSource={data} />
      </section>
      <div style={{display:"none"}}>

      <div ref={barcodeRef}>
        <BarCode values={barCode} />
      </div>
      </div>
    </div>
  );
};

export default Etiquetas;
