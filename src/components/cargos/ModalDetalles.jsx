import React from "react";
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
  Modal,
} from "antd";
const ModalDetalles = ({ modalDetalle, setModalDetalle, data, setBienes }) => {
  const closeModal = () => {
    setModalDetalle(false);
    setBienes([])
  };

  const columns = [
    {
      title: "Nro",
      render: (id, record, index) => { ++index; return index; },
      align: "center",
      
    },
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
      title: "Cód Barra / Inv. Anterior",
      dataIndex: "codigo_barra",
      align: "center",
    },
    {
      title: "Descripción",
      dataIndex: "descripcion",
      align: "center",
    },
    {
      title: "Nro Serie",
      dataIndex: "nro_serie",
      align: "center",
    },
    // {
    //   title: "Acciones",
    //   align: "center",
    //   key: "action",
    //   render: (_, record) => (
    //     <Flex align="center" justify="center" gap={2}>
    //       <Button onClick={() => handlePrint(record)}>
    //         <PrinterOutlined />
    //       </Button>
    //       <Button onClick={() => handleDetalles(record)}>
    //         <FolderOutlined />
    //       </Button>
    //     </Flex>
    //   ),
    // },
  ];
  return (
    <Modal
      title="Detalle"
      open={modalDetalle}
      onCancel={closeModal}
      cancelText={"Cancelar"}
      width={"60%"}
      footer={null}
    >
      <Table columns={columns} dataSource={data} />
    </Modal>
  );
};

export default ModalDetalles;
