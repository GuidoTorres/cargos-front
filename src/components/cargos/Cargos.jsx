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
    const response = await fetch("http://10.30.1.42:8084/api/v1/asignacion");
    const info = await response.json();
    if (info) {
      setAsignaciones(info.data);
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
          <Space size={'small'}>
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
