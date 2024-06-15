import { Modal, Input, notification } from "antd";
import React, { useState } from "react";

const ModalObservaciones = ({
  modalObservaciones,
  setModalObservaciones,
  data, getAsignaciones
}) => {
  const [observacion, setObservacion] = useState("");
  const closeModal = () => {
    setModalObservaciones(false);
  };
  console.log(data);
  const handleObservacion = async (e) => {
    console.log(e.target.value);

    const asignacion = {
      ANO_EJE: data.ano_eje,
      SEC_EJEC: data.sec_ejec,
      TIPO_MODALIDAD: data.tipo_modalidad,
      SECUENCIA: data.secuencia,
      NRO_ASIGNAC: data.nro_asignac,
      OBSERVACIONES: observacion,
    };
    console.log(asignacion);
    const response = await fetch(`http://localhost:3001/api/v1/asignacion`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(asignacion),
    });
    const confirm = await response.json();

    if (response.status === 200) {
      notification.success({
        message: confirm.msg,
      });
      getAsignaciones()
      closeModal();
    }
  };

  return (
    <Modal
      title="Añadir Observación"
      open={modalObservaciones}
      onCancel={closeModal}
      cancelText={"Cancelar"}
      width={"30%"}
      onOk={handleObservacion}
      okText={"Actualizar"}
    >
      <Input.TextArea
        defaultValue={data.observaciones}
        onChange={(e) => setObservacion(e.target.value)}
      />
    </Modal>
  );
};

export default ModalObservaciones;
