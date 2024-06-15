import { Input, Modal, Select, Typography, notification } from "antd";
import React, { useEffect, useState } from "react";

const RegistrarCargos = ({
  isModalOpen,
  setIsOpenModal,
  getCargos,
  editar,
  setEditar,
}) => {
  const [area, setArea] = useState([]);
  const [cargo, setCargos] = useState([]);

  const closeModal = () => {
    setIsOpenModal(false);
    setEditar();
  };

  const getArea = async () => {
    const response = await fetch("http://10.30.1.42:8084/api/v1/unidad");

    const info = await response.json();
    if (info) setArea(info.data);
  };
  useEffect(() => {
    if (editar) {
      setCargos(editar);
    }
  }, [editar]);

  useEffect(()=>{
    getArea()
  },[])

  const handleChange = (value, text) => {
    setCargos((values) => {
      return { ...values, [text]: value };
    });
  };

  const postCargos = async () => {
    if (editar !== undefined) {
      const response = await fetch(
        `http://10.30.1.42:8084/api/v1/cargos/${editar.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(cargo),
        }
      );
      const confirm = await response.json();

      if (response.status === 200) {
        notification.success({
          message: confirm.msg,
        });
        getCargos();
        closeModal();
      } else {
        notification.error({
          message: confirm.msg,
        });
      }
    } else {
      const response = await fetch("http://10.30.1.42:8084/api/v1/cargos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(cargo),
      });
      const confirm = await response.json();

      if (response.status === 200) {
        notification.success({
          message: confirm.msg,
        });
        getCargos();
        closeModal();
      } else {
        notification.error({
          message: confirm.msg,
        });
      }
    }
  };
  return (
    <Modal
      title="Registrar Cargo"
      open={isModalOpen}
      onCancel={closeModal}
      onOk={postCargos}
      okText={editar === undefined ? "Registrar" : "Editar"}
      cancelText={"Cancelar"}

    >
      <div>
        <Typography.Title level={5}>Nombres</Typography.Title>
        <Input
          onChange={(e) => handleChange(e.target.value, "nombres")}
          value={cargo.nombres}
        />
        <Typography.Title level={5}>Descripción</Typography.Title>
        <Input
          onChange={(e) => handleChange(e.target.value, "descripcion")}
          value={cargo.descripcion}
        />
        <Typography.Title level={5}>Área</Typography.Title>

        <Select
          style={{
            width: "100%",
          }}
          onChange={(e) => handleChange(e, "area_id")}
          value={cargo?.unidad?.id}
          allowClear
          options={area.length > 0 && area?.map((item) => {
            return {
              value: item.id,
              label: item.nombres,
            };
          })}
        />
      </div>
    </Modal>
  );
};

export default RegistrarCargos;
