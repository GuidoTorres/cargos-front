import React, { useEffect, useState, useRef } from "react";
import { Button, Table } from "antd";
import {
  EditOutlined,
  EyeFilled,
  FolderOutlined,
  PrinterOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import ModalVerAdeudo from "./ModalVerAdeudo";

const HistorialAdeudo = ({ setTitle}) => {


  const [adeudo, setAdeudo] = useState([]);
  const [mostrar, setMostrar] = useState(false);
  const [editar, setEditar] = useState();

  const getAdeudo = async () => {
    const response = await fetch(`http://10.30.1.42:8084/api/v1/adeudos`);
    const info = await response.json();
    if (info) {
      setAdeudo(info.data);
    }
  };

  useEffect(() => {
    setTitle("Historial de adeudos")
    getAdeudo();
  }, []);

  const columns = [
    {
      title: "Id",
      dataIndex: "id",
      render: (_, record) => record.anio +" - "+ record.correlativo,
      align: "center",
    },
    {
      title: "Trabajador",
      dataIndex: "trabajador",
      align: "center",
    },
    {
      title: "Encargado",
      dataIndex: "encargado",
      align: "center",
    },
    {
      title: "Fecha",
      dataIndex: "createdAt",
      render: (_, record) => dayjs(record.createdAt).format("DD-MM-YYYY"),
      align: "center",
    },

    {
      title: "Acciones",
      align: "center",
      key: "action",
      render: (_, record) => (
        <Button onClick={() => viewData(record)}>
          <EyeFilled />
        </Button>
      ),
    },
  ];

  const viewData = async (e) => {
    setMostrar(true);
    setEditar(e);
  };

  return (
    <div>
      <Table columns={columns} dataSource={adeudo} />

      {mostrar ? (
        <>
          <ModalVerAdeudo
            mostrar={mostrar}
            setMostrar={setMostrar}
            data={editar}
          />
        </>
      ) : null}
    </div>
  );
};

export default HistorialAdeudo;
