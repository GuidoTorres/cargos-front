import {
  Button,
  Flex,
  Popconfirm,
  Select,
  Table,
  notification,
  Input,
  Radio,
  DatePicker,
} from "antd";
import React, { useEffect, useState } from "react";
import RegistrarCargos from "./RegistrarCargos";
import {
  EditOutlined,
  FolderOutlined,
  PrinterOutlined,
} from "@ant-design/icons";
import Search from "antd/es/input/Search";
import ImprimirCargo from "./ImprimirCargo";
import ModalDetalles from "./ModalDetalles";

import CargoPersonal from "../PDF/CargoPersonal";
import { PDFDownloadLink, PDFViewer, pdf } from "@react-pdf/renderer";
import dayjs from "dayjs";
import ModalObservaciones from "./ModalObservaciones";
const { RangePicker } = DatePicker;
const Cargos = ({ setTitle }) => {
  const [cargos, setCargos] = useState([]);
  const [sedes, setSedes] = useState([]);
  const [usuario, setUsuario] = useState([]);
  const [centroCosto, setCentroCosto] = useState([]);
  const [ubicacion, setUbicacion] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [asignaciones, setAsignaciones] = useState([]);
  const [bienes, setBienes] = useState([]);
  const [tipo, setTipo] = useState("");
  const [inicio, setInicio] = useState("");
  const [modalDetalles, setModalDetalles] = useState(false);
  const [modalObservaciones, setModalObservaciones] = useState(false);
  const [dataObservacion, setDataObservacion] = useState();
  const [editar, setEditar] = useState();
  const [search, setSearch] = useState([]);
  useEffect(() => {
    setTitle("Cargos");
    getAsignaciones();
  }, []);

  const getAsignaciones = async () => {
    const response = await fetch("http://10.30.1.42:8084/api/v1/asignacion");
    const info = await response.json();
    if (info) {
      setAsignaciones(info.data);
    }
  };

  const columns = [
    {
      title: "Nro Desplaz",
      dataIndex: "nro_interno",
      align: "center",
    },
    {
      title: "Nro Orden",
      dataIndex: "patrimonio_nro_orden",
      align: "center",
    },
    {
      title: "Correlativo",
      dataIndex: "id_correlativo",
      align: "center",
    },
    {
      title: "De",
      dataIndex: "nombre_empleado",
      align: "center",
    },
    {
      title: "Para",
      dataIndex: "nombre_empleado_final",
      align: "center",
    },
    {
      title: "Fecha",
      dataIndex: "fecha_asig",
      align: "center",
      sorter: (a, b) => {
        const dateA = dayjs(a.fecha_asig, "DD-MM-YYYY");
        const dateB = dayjs(b.fecha_asig, "DD-MM-YYYY");
        return dateA.isBefore(dateB) ? -1 : dateA.isAfter(dateB) ? 1 : 0;
      },
    },
    {
      title: "Acciones",
      align: "center",
      key: "action",
      render: (_, record) => (
        <Flex align="center" justify="center" gap={2}>
          <Button onClick={() => handlePrint(record)}>
            <PrinterOutlined />
          </Button>
          <Button onClick={() => handleDetalles(record)}>
            <FolderOutlined />
          </Button>
          <Button onClick={() => handleObservaciones(record)}>
            <EditOutlined />
          </Button>
        </Flex>
      ),
    },
  ];

  const handleObservaciones = async (docData) => {
    setModalObservaciones(true);
    setDataObservacion(docData);
  };

  const handleDetalles = async (docData) => {
    setModalDetalles(true);
    const response = await fetch(
      `http://10.30.1.42:8084/api/v1/asignacion/bienes?cod_usuario=${docData.de_cod_usuario}&fecha_asig=${docData.fecha_asigna}&orden=${docData.patrimonio_nro_orden}`
    );
    const info = await response.json();
    if (info) {
      setBienes(info.data);
    }
  };

  const searchData = async (value) => {
    if (value) {
      const response = await fetch(
        `http://10.30.1.42:8084/api/v1/asignacion?search=${value}`
      );
      const info = await response.json();
      if (info) {
        setAsignaciones(info.data);
      }
    } else {
      const response = await fetch(`http://10.30.1.42:8084/api/v1/asignacion`);
      const info = await response.json();
      if (info) {
        setAsignaciones(info.data);
      }
    }
  };

  const handlePrint = async (docData) => {
    try {
      const centro_costo = await getCentroCosto(docData);
      const bien = await getBienes(docData);
      const ubicacion = await getUbicacion(docData);
      handlePrintDetalles(docData, bien, centro_costo.costo, ubicacion);
    } catch (error) {
      console.error("Error generating PDFs:", error);
    }
  };

  const getCentroCosto = async (docData) => {
    const response = await fetch(
      `http://10.30.1.42:8084/api/v1/centro_costo?centro=${docData.centro_costo}&ubicac=${docData.cod_ubicac}&anio=${docData.ano_eje}&${docData.sec_ejec}`
    );
    const info = await response.json();
    if (info) {
      setCentroCosto(info.data);
    }
    return info.data;
  };

  const getBienes = async (docData) => {
    const response = await fetch(
      `http://10.30.1.42:8084/api/v1/asignacion/bienes?cod_usuario=${docData.de_cod_usuario}&emple=${docData.para_cod_usuario}&fecha_asig=${docData.fecha_asigna}&orden=${docData.patrimonio_nro_orden}`
    );
    const info = await response.json();
    if (info) {
      setBienes(info.data);
    }
    return info.data;
  };

  const getUbicacion = async (docData) => {
    const response = await fetch(
      `http://10.30.1.42:8084/api/v1/ubicacion?tipo=${docData.tipo_ubicac}&cod_ubicac=${docData.cod_ubicac}`
    );
    const info = await response.json();
    if (info) {
      setUbicacion(info.data);
    }
    return info.data;
  };

  const handlePrintDetalles = async (
    docData,
    value,
    centroCosto,
    ubicacion
  ) => {
    const blob = await pdf(
      <CargoPersonal
        data={value}
        docData={docData}
        centroCosto={centroCosto}
        ubicacion={ubicacion}
      />
    ).toBlob();
    // Crea una URL de objeto para el Blob y abre en una nueva pestaña
    const url = URL.createObjectURL(blob);
    window.open(url, "_blank");
    URL.revokeObjectURL(url);
  };

  const registrarFechas = async (date) => {
    if (date) {
      const fechas = date?.map((item) => dayjs(item).format("YYYY-MM-DD"));

      const fechaInicio = fechas.at(0);
      const fechaFin = fechas.at(1);

      const response = await fetch(
        `http://10.30.1.42:8084/api/v1/asignacion?inicio=${fechaInicio}&fin=${fechaFin}`
      );
      const info = await response.json();
      if (info) {
        setAsignaciones(info.data);
      }
    } else {
      const response = await fetch(`http://10.30.1.42:8084/api/v1/asignacion`);
      const info = await response.json();
      if (info) {
        setAsignaciones(info.data);
      }
    }
  };

  const handleUpdate = async () => {
    const response = await fetch(
      `http://10.30.1.42:8084/api/v1/asignacion/actualizar`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const confirm = await response.json();

    if (response.status === 200) {
            const response = await fetch(`http://10.30.1.42:8084/api/v1/asignacion`);
      const info = await response.json();
      if (info) {
        setAsignaciones(info.data);
      }
      notification.success({
        message: confirm.msg,
      });
    } else {
      notification.error({
        message: confirm.msg,
      });
    }
  };

  const handleDelete = async (id) => {
    const response = await fetch(`http://10.30.1.42:8084/api/v1/cargos/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const confirm = await response.json();

    if (response.status === 200) {
      notification.success({
        message: confirm.msg,
      });
      // getCargos();
    } else {
      notification.error({
        message: confirm.msg,
      });
    }
  };
  // const onSearch = (val) => {
  //   const filterData = () => {
  //     let value = val.toLowerCase(); // Convertir el valor de búsqueda a minúsculas

  //     if (!val) {
  //       return cargos;
  //     } else {
  //       const filter = cargos.filter(
  //         (item) =>
  //           item?.nombres?.toLowerCase().includes(value) ||
  //           item?.descripcion?.toLowerCase().includes(value) ||
  //           item?.area?.nombre?.toLowerCase().includes(value)
  //       );
  //       return filter;
  //     }
  //   };
  //   setSearch(filterData());
  // };
  return (
    <>
      <div
        style={{
          marginBottom: "10px",
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "flex-start",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              width: "100%",
              gap: "5px",
            }}
          >
            {/* <div style={{ display: "flex", alignItems: "center" }}>
              <label htmlFor="" style={{ flex: 1, textAlign: "left" }}>
                Sede
              </label>
              <Select
                className="input-form"
                // value={tipo || undefined}
                placeholder={"Sede"}
                // onChange={(e) => setTipo(e)}
                showSearch
                style={{ flex: 2 }}
                optionFilterProp="children"
                filterOption={(input, option) =>
                  (option?.label ?? "")
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
                allowClear
                options={sedes.map((item) => {
                  return {
                    value: item.sede,
                    label: item.nombre_sede,
                  };
                })}
              />
            </div>
            <div style={{ display: "flex", alignItems: "center" }}>
              <label htmlFor="" style={{ flex: 1, textAlign: "left" }}>
                Centro de costo
              </label>

              <Select
                className="input-form"
                // value={tipo || undefined}
                placeholder={"Centro de costo"}
                // onChange={(e) => setTipo(e)}
                showSearch
                style={{ flex: 2 }}
                optionFilterProp="children"
                filterOption={(input, option) =>
                  (option?.label ?? "")
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
                allowClear
                options={centroCosto.map((item) => {
                  return {
                    value: item.nombre_depend,
                    label: item.centroCosto,
                  };
                })}
              />
            </div> */}
            {/* <div style={{ display: "flex", alignItems: "center" }}>
              <label htmlFor="" style={{ flex: 1, textAlign: "left" }}>
                Ubicación Fisica
              </label>

              <Select
                className="input-form"
                // value={tipo || undefined}
                placeholder={"Ubicación Fisica"}
                // onChange={(e) => setTipo(e)}
                showSearch
                style={{ flex: 2 }}
                optionFilterProp="children"
                filterOption={(input, option) =>
                  (option?.label ?? "")
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
                allowClear
                options={ubicacion?.map((item) => {
                  return {
                    value: item.COD_UBICAC,
                    label: item.UBICAC_FISICA,
                  };
                })}
              />
            </div> */}
            {/* <div style={{ display: "flex", alignItems: "center" }}>
              <Select
                className="input-form"
                // value={tipo || undefined}
                placeholder={"Por usuario"}
                // onChange={(e) => setTipo(e)}
                showSearch
                style={{ flex: 2 }}
                optionFilterProp="children"
                filterOption={(input, option) =>
                  (option?.label ?? "")
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
                allowClear
                options={usuario?.map((item) => {
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
            </div> */}
            {/* <div
              style={{
                display: "flex",
                alignItems: "center",
                width: "100%",
              }}
            >
              <label htmlFor="" style={{ flex: 1, textAlign: "left" }}>
                Familia
              </label>

              <Select
                className="input-form"
                // value={tipo || undefined}
                placeholder={"Familia"}
                // onChange={(e) => setTipo(e)}
                showSearch
                style={{ flex: 2 }}
                optionFilterProp="children"
                filterOption={(input, option) =>
                  (option?.label ?? "")
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
                allowClear
                options={[
                  {
                    value: "Access point",
                    label: "Access point",
                  },
                  {
                    value: "Disco Duro",
                    label: "Disco Duro",
                  },
                ]}
              />
            </div> */}
            <div
              style={{
                marginTop: "20px",
                display: "flex",
                justifyContent: "space-between",

                width: "100%",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-start",
                  width: "30%",
                }}
              >
                <Search
                  placeholder="Buscar por nro orden o usuario final"
                  onChange={(e) => searchData(e.target.value)}
                />
              </div>
              <div>
                <RangePicker
                  format="DD-MM-YYYY"
                  placeholder={["Inicio", "Fin"]}
                  onChange={(date) => registrarFechas(date)}
                />
                <Button onClick={() => handleUpdate()}>
                  Actualizar correlativo
                </Button>
              </div>
            </div>
          </div>
        </div>
        {/* <div
          style={{
            width: "30%",
            display: "flex",
            flexDirection: "column",
            padding: "5px",
            gap: "5px",
          }}
        >
          <Select
            className="input-form"
            // value={tipo || undefined}
            placeholder={"Por secuencia"}
            // onChange={(e) => setTipo(e)}
            showSearch
            style={{ width: "100%", flex: 3 }}
            optionFilterProp="children"
            filterOption={(input, option) =>
              (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
            }
            allowClear
            options={[
              {
                value: "Access point",
                label: "Access point",
              },
              {
                value: "Disco Duro",
                label: "Disco Duro",
              },
            ]}
          />
          <div style={{ display: "flex", alignItems: "center" }}>
            <label htmlFor="" style={{ flex: 1, textAlign: "left" }}>
              Desde
            </label>
            <Input style={{ flex: 2 }}></Input>
          </div>
          <div style={{ display: "flex", alignItems: "center" }}>
            <label htmlFor="" style={{ flex: 1, textAlign: "left" }}>
              Hasta
            </label>
            <Input style={{ flex: 2 }}></Input>
          </div>
        </div> */}
      </div>
      <Table columns={columns} dataSource={asignaciones} />
      {isModalOpen && (
        <div>
          <ImprimirCargo />
        </div>
      )}
      {modalDetalles && (
        <ModalDetalles
          modalDetalle={modalDetalles}
          setModalDetalle={setModalDetalles}
          data={bienes}
          setBienes={setBienes}
        />
      )}
      {modalObservaciones && (
        <ModalObservaciones
          modalObservaciones={modalObservaciones}
          setModalObservaciones={setModalObservaciones}
          data={dataObservacion}
          getAsignaciones={getAsignaciones}
        />
      )}
    </>
  );
};

export default Cargos;
