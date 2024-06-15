import { Input, Modal, Select, Typography, notification } from "antd";
import React, { useEffect, useState } from "react";

const RegistrarAreas = ({
  isModalOpen,
  setIsOpenModal,
  getAreas,
  editar,
  setEditar,
}) => {
  const [area, setArea] = useState([]);
  const [base, setBase] = useState([]);
  const closeModal = () => {
    setIsOpenModal(false);
    setEditar();
  };

  const getBase = async () => {
    const response = await fetch("http://localhost:3005/api/v1/base");

    const info = await response.json();
    if (info) {
      setBase(info.data);
    }
  };
  useEffect(()=>{
    getBase()
  },[])
  useEffect(() => {
    if (editar) {
      setArea(editar);
    }

  }, [editar]);

  const valoresAqp= [
    {
      value: "Modulo 1",
      label: "Modulo 1",
    },
    {
      value: "Modulo 2",
      label: "Modulo 2",
    },
    {
      value: "Modulo 3",
      label: "Modulo 3",
    },
    {
      value: "Modulo 4",
      label: "Modulo 4",
    },
    {
      value: "Modulo 5",
      label: "Modulo 5",
    },
    {
      value: "Modulo 6",
      label: "Modulo 6",
    },
    {
      value: "Modulo 7",
      label: "Modulo 7",
    },
    {
      value: "OCI",
      label: "OCI",
    },
    {
      value: "OPIP",
      label: "OPIP",
    },
    {
      value: "Gestión ambiental",
      label: "Gestión ambiental",
    },
    {
      value: "Almacén",
      label: "Almacén",
    },
    {
      value: "Transporte",
      label: "Transporte",
    },
  ]

  const valoresMajes= [
    {
      value: "Sector Majes",
      label: "Sector Majes",
    },
    {
      value: "Canal 2R",
      label: "Canal 2R",
    },
    {
      value: "Canal 3R",
      label: "Canal 3R",
    },
    {
      value: "Pitay",
      label: "Pitay",
    },
    {
      value: "Santa Rita",
      label: "Santa Rita",
    },
    {
      value: "Rio Arma",
      label: "Rio Arma",
    },
    
  ]


  const handleChange = (value, text) => {
    setArea((values) => {
      return { ...values, [text]: value };
    });
  };
  const postArea = async () => {
    if (editar) {
      const response = await fetch(
        `http://localhost:3005/api/v1/unidad/${editar.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(area),
        }
      );
      const confirm = await response.json();

      if (response.status === 200) {
        notification.success({
          message: confirm.msg,
        });
        getAreas();
        closeModal();
      } else {
        notification.error({
          message: confirm.msg,
        });
      }
    } else {
      const response = await fetch("http://localhost:3005/api/v1/unidad", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(area),
      });
      const confirm = await response.json();

      if (response.status === 200) {
        notification.success({
          message: confirm.msg,
        });
        getAreas();
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
      title="Registrar Unidad"
      open={isModalOpen}
      onCancel={closeModal}
      onOk={postArea}
      okText={editar ? "Editar" : "Registrar"}
      cancelText={"Cancelar"}

    >
      <div>
        <Typography.Title level={5}>Nombres</Typography.Title>
        <Input
          onChange={(e) => handleChange(e.target.value, "nombres")}
          value={area.nombres}
        />
        <Typography.Title level={5}>Descripción</Typography.Title>
        <Input
          onChange={(e) => handleChange(e.target.value, "descripcion")}
          value={area.descripcion}
        />
                <Typography.Title level={5}>Base</Typography.Title>
        <Select
          className="input-form"
          value={area.base}
          style={{width: "100%"}}
          popupMatchSelectWidth={false}
          onChange={(e) => handleChange(e, "base")}
          showSearch
          optionFilterProp="children"
          filterOption={(input, option) =>
            (option?.label ?? "")
              .toLowerCase()
              .includes(input.toLowerCase())
          }
          allowClear
          options={base.map((item) => {
            return {
              label: item.nombres,
              value: item.nombres,
            };
          })}
        />
        <Typography.Title level={5}>Modulo</Typography.Title>
        <Select
        style={{width: "100%"}}
              className="input-form"
              value={area.modulo}
              onChange={(e) => handleChange(e, "modulo")}
              showSearch
              optionFilterProp="children"
              filterOption={(input, option) =>
                (option?.label ?? "")
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
              allowClear
              options={area.base === "Cayma" ? valoresAqp : area.base === "Majes" ? valoresMajes : null}
            />

      </div>
    </Modal>
  );
};

export default RegistrarAreas;
