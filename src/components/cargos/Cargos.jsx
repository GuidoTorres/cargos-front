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
  Space,
  Form,
} from "antd";
import React, { useEffect, useState } from "react";
import RegistrarCargos from "./RegistrarCargos";
import {
  CheckOutlined,
  CloseOutlined,
  EditOutlined,
  EyeOutlined,
  FolderOutlined,
  PrinterOutlined,
} from "@ant-design/icons";
import Search from "antd/es/input/Search";
import ImprimirCargo from "./ImprimirCargo";
import ModalDetalles from "./ModalDetalles";
import { API_URL } from "../../config/api";

import CargoPersonal from "../PDF/CargoPersonal";
import { PDFDownloadLink, PDFViewer, pdf } from "@react-pdf/renderer";
import dayjs from "dayjs";
import ModalObservaciones from "./ModalObservaciones";
const { RangePicker } = DatePicker;

const Cargos = ({ setTitle }) => {
  const [form] = Form.useForm();
  const [centroCosto, setCentroCosto] = useState([]);
  const [ubicacion, setUbicacion] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [asignaciones, setAsignaciones] = useState([]);
  const [bienes, setBienes] = useState([]);
  const [modalDetalles, setModalDetalles] = useState(false);
  const [modalObservaciones, setModalObservaciones] = useState(false);
  const [dataObservacion, setDataObservacion] = useState();
  const [editingKey, setEditingKey] = useState(null);
  const [correlativoFilter, setCorrelativoFilter] = useState("todos"); // Nuevo estado para el filtro de correlativos
  const isEditing = (record) => record.key === editingKey;

  const handleEdit = (record) => {
    form.setFieldsValue({ ...record }); // Establecer valores iniciales del formulario
    setEditingKey(record.key); // Configurar el registro en edición
  };

  const handleSave = async (record) => {
    try {
      const updatedRecord = await form.validateFields(); // Validar los valores editados
      const response = await fetch(
        "http://10.30.1.42:8084/api/v1/asignacion/actualizar/correlativo",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...record,
            ID_CORRELATIVO: updatedRecord.id_correlativo, // El nuevo valor editado
          }),
        }
      );

      if (response.ok) {
        const updatedDataSource = asignaciones.map((item) =>
          item.secuencia === record.secuencia
            ? { ...item, ...updatedRecord }
            : item
        );
        setAsignaciones(updatedDataSource);
        const result = await response.json();
        notification.success({
          message: result.msg,
        });
        setEditingKey(""); // Salir del modo edición
        // getAsignaciones()
      } else {
        const error = await response.json();
        notification.error({
          message: error.msg,
        });
      }
    } catch (err) {
      console.error("Error al guardar:", err);
    }
  };

  useEffect(() => {
    setTitle("Cargos");
    getAsignaciones();
  }, []);

  const getAsignaciones = async () => {
    const response = await fetch(`${API_URL}/asignacion`);
    const info = await response.json();
    if (info) {
      setOriginalData(info.data);
      // Aplicar filtro de correlativo a los datos iniciales
      filterByCorrelativo(info.data, correlativoFilter);
    }
  };

  const columns = [
    {
      title: "Nro Orden",
      dataIndex: "patrimonio_nro_orden",
      align: "center",
    },
    {
      title: "Correlativo",
      dataIndex: "id_correlativo",
      align: "center",
      editable: true,
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
      render: (_, record) => {
        return isEditing(record) ? (
          <Space>
            <Button
              icon={<CheckOutlined />}
              onClick={() => handleSave(record)}
            ></Button>
            <Button icon={<CloseOutlined />} onClick={cancel}></Button>
          </Space>
        ) : (
          <Space size={"small"}>
            <Button onClick={() => handleEdit(record)}>
              <EditOutlined />
            </Button>
            <Button onClick={() => handlePrint(record)}>
              <PrinterOutlined />
            </Button>
            <Button onClick={() => handleDetalles(record)}>
              <FolderOutlined />
            </Button>
            <Button onClick={() => handleObservaciones(record)}>
              <EyeOutlined />
            </Button>
          </Space>
        );
      },
    },
  ];
  const EditableCell = ({
    editing,
    dataIndex,
    title,
    children,
    ...restProps
  }) => {
    return (
      <td {...restProps}>
        {editing ? (
          <Form.Item
            name={dataIndex}
            style={{ margin: 0 }}
            rules={[
              {
                required: true,
                message: `Por favor ingrese ${title}!`,
              },
            ]}
          >
            <Input style={{ width: "80px" }} />
          </Form.Item>
        ) : (
          children
        )}
      </td>
    );
  };

  // Función para cancelar la edición
  const cancel = () => {
    setEditingKey("");
  };
  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record) => ({
        record,
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record), // Activa la edición solo si coincide con la clave
      }),
    };
  });

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

  // Función unificada para aplicar todos los filtros (búsqueda, fechas y correlativo)
  const applyFilters = async (searchValue = null, dateRange = null, correlativoValue = null) => {
    // Obtener los valores actuales si no se proporcionan
    const currentSearchValue = searchValue !== null ? searchValue : 
      document.querySelector(".ant-input-search-input")?.value || "";
    
    const currentCorrelativoValue = correlativoValue !== null ? correlativoValue : correlativoFilter;
    
    // Obtener fechas actuales del DatePicker si no se proporcionan
    let currentDateRange = dateRange;
    if (dateRange === null) {
      const datePickerElement = document.querySelector(".ant-picker-range");
      if (datePickerElement && 
          datePickerElement.__reactProps$ && 
          datePickerElement.__reactProps$.value && 
          datePickerElement.__reactProps$.value.length === 2) {
        currentDateRange = datePickerElement.__reactProps$.value;
      }
    }

    // Si el buscador está vacío (se borró el texto) y no hay fechas seleccionadas
    if (searchValue === "" || (!currentSearchValue && !currentDateRange) || (currentSearchValue === "" && !currentDateRange)) {
      // Siempre hacer una petición para obtener datos frescos cuando se borra el buscador
      const response = await fetch("http://10.30.1.42:8084/api/v1/asignacion");
      const info = await response.json();
      if (info) {
        setOriginalData(info.data);
        filterByCorrelativo(info.data, currentCorrelativoValue);
      }
      return;
    }

    // Construir la URL base para la búsqueda
    let url = `http://10.30.1.42:8084/api/v1/asignacion`;
    let hasQueryParams = false;

    // Añadir parámetro de búsqueda si existe
    if (currentSearchValue) {
      url += `?search=${currentSearchValue}`;
      hasQueryParams = true;
    }

    // Añadir parámetros de fecha si existen
    if (currentDateRange) {
      const fechas = currentDateRange.map(item => dayjs(item).format("YYYY-MM-DD"));
      const fechaInicio = fechas[0];
      const fechaFin = fechas[1];
      
      url += hasQueryParams 
        ? `&inicio=${fechaInicio}&fin=${fechaFin}` 
        : `?inicio=${fechaInicio}&fin=${fechaFin}`;
      
      hasQueryParams = true;
    }

    // Realizar la petición
    const response = await fetch(url);
    const info = await response.json();
    if (info) {
      setOriginalData(info.data);
      // Aplicar filtro de correlativo a los datos obtenidos
      filterByCorrelativo(info.data, currentCorrelativoValue);
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

  // Función simplificada para manejar cambios en las fechas
  const registrarFechas = async (date) => {
    // Si date es null, significa que el usuario limpió el DatePicker
    if (!date) {
      // Restaurar datos originales pero manteniendo el filtro de correlativo actual
      // Primero obtenemos los datos frescos del servidor para asegurarnos de no usar datos filtrados
      const response = await fetch("http://10.30.1.42:8084/api/v1/asignacion");
      const info = await response.json();
      if (info) {
        setOriginalData(info.data);
        // Aplicar solo el filtro de correlativo a los datos frescos
        filterByCorrelativo(info.data, correlativoFilter);
      }
      return;
    }
    // Llamar a la función unificada de filtros con las nuevas fechas
    await applyFilters(null, date, null);
  };

  // Estado para mantener los datos originales sin filtrar
  const [originalData, setOriginalData] = useState([]);

  // Función para filtrar por correlativo (ahora solo aplica el filtro a los datos, no hace peticiones)
  const filterByCorrelativo = (data, filterValue) => {
    if (!data) return;

    let filteredData = [...data];

    if (filterValue === "con_correlativo") {
      filteredData = filteredData.filter((item) => item.id_correlativo);
    } else if (filterValue === "sin_correlativo") {
      filteredData = filteredData.filter((item) => !item.id_correlativo);
    }

    setAsignaciones(filteredData);
  };

  // Manejador para el cambio en el filtro de correlativo
  const handleCorrelativoFilterChange = (value) => {
    setCorrelativoFilter(value);
    // Llamar a la función unificada de filtros con el nuevo valor de correlativo
    applyFilters(null, null, value);
  };

  // const handleUpdate = async () => {
  //   const response = await fetch(
  //     `http://10.30.1.42:8084/api/v1/asignacion/actualizar`,
  //     {
  //       method: "PUT",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //     }
  //   );
  //   const confirm = await response.json();

  //   if (response.status === 200) {
  //     const response = await fetch(`http://10.30.1.42:8084/api/v1/asignacion`);
  //     const info = await response.json();
  //     if (info) {
  //       setAsignaciones(info.data);
  //       setOriginalData(info.data);
  //     }
  //     notification.success({
  //       message: confirm.msg,
  //     });
  //   } else {
  //     notification.error({
  //       message: confirm.msg,
  //     });
  //   }
  // };

  // const handleDelete = async (id) => {
  //   const response = await fetch(`http://10.30.1.42:8084/api/v1/cargos/${id}`, {
  //     method: "DELETE",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //   });
  //   const confirm = await response.json();

  //   if (response.status === 200) {
  //     notification.success({
  //       message: confirm.msg,
  //     });
  //     // getCargos();
  //   } else {
  //     notification.error({
  //       message: confirm.msg,
  //     });
  //   }
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
                  width: "60%",
                  gap: "10px",
                }}
              >
                <Search
                  placeholder="Buscar por nro orden o usuario final"
                  onChange={(e) => applyFilters(e.target.value, null, null)}
                  allowClear={true}
                  style={{ width: "50%" }}
                />
                <Select
                  placeholder="Filtrar por correlativo"
                  style={{ width: "30%" }}
                  onChange={handleCorrelativoFilterChange}
                  value={correlativoFilter}
                  options={[
                    { value: "todos", label: "Todos los registros" },
                    { value: "con_correlativo", label: "Con correlativo" },
                    { value: "sin_correlativo", label: "Sin correlativo" },
                  ]}
                />
              </div>
              <div>
                <RangePicker
                  format="DD-MM-YYYY"
                  placeholder={["Inicio", "Fin"]}
                  onChange={(date) => registrarFechas(date)}
                  allowClear={true}
                />
                {/* <Button onClick={() => handleUpdate()}>
                  Actualizar correlativo
                </Button> */}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Form form={form} component={false}>
        <Table
          components={{
            body: {
              cell: EditableCell,
            },
          }}
          columns={mergedColumns}
          dataSource={asignaciones?.map((item, index) => ({
            ...item,
            key: item.id || index,
          }))}
        />
      </Form>

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
