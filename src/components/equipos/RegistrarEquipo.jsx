import {
  Input,
  Modal,
  Select,
  Typography,
  notification,
  Form,
  Button,
} from "antd";
import React, { useEffect, useState } from "react";

import "./styles/registrarEquipos.css";

const RegistrarEquipo = ({
  isModalOpen,
  setIsOpenModal,
  getEquipos,
  editar,
  setEditar,
}) => {
  const [form] = Form.useForm();
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
  const [equipo, setEquipo] = useState({});
  const [area, setArea] = useState([]);
  const [trabajador, setTrabajador] = useState([]);
  const initialValues = {
    sbn: "",
    descripcion: "",
    marca: "",
    sector: "",
    tipo: "",
    ingreso: "",
    modulo: "",
    area: "",
    procesador: "",
    disco_duro: "",
    capacidad: "",
    memoria: "",
    tarjeta_video: "",
    estado: "",
    proveedor: "",
  };
  const closeModal = () => {
    setIsOpenModal(false);
    setEditar();
    form.resetFields();
  };
  useEffect(() => {
    if (editar) {
      setEquipo(editar);
    } else {
      setEquipo(initialValues);
    }
  }, [editar]);

  useEffect(() => {
    getArea();
    getTrabajador();
  }, []);

  const getArea = async () => {
    const response = await fetch("http://localhost:3005/api/v1/unidad");

    const info = await response.json();
    if (info) setArea(info.data);
  };

  const getTrabajador = async () => {
    const response = await fetch(
      "http://localhost:3005/api/v1/trabajadores/select"
    );

    const info = await response.json();
    if (info) setTrabajador(info.data);
  };

  const handleData = (value, text) => {
    setEquipo((values) => {
      return { ...values, [text]: value };
    });
    form.setFieldValue((value) => {
      return { ...value, [text]: value };
    });
  };

  const postEquipo = async () => {
    if (editar) {
      const response = await fetch(
        `http://localhost:3005/api/v1/equipos/${editar.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(equipo),
        }
      );
      const confirm = await response.json();

      if (response.status === 200) {
        notification.success({
          message: confirm.msg,
        });
        getEquipos();
        closeModal();
      } else {
        notification.error({
          message: confirm.msg,
        });
      }
    } else {
      const response = await fetch("http://localhost:3005/api/v1/equipos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(equipo),
      });
      const confirm = await response.json();

      if (response.status === 200) {
        notification.success({
          message: confirm.msg,
        });
        getEquipos();
        closeModal();
      } else {
        notification.error({
          message: confirm.msg,
        });
      }
    }
  };

  console.log(editar);
  return (
    <Modal
      title={
        <Typography.Title level={5} className="title">
          Registrar equipo
        </Typography.Title>
      }
      open={isModalOpen}
      onCancel={closeModal}
      footer={null}
    >
      <Form form={form} layout="vertical" onFinish={postEquipo}>
        <div className="flex">
          <Form.Item
            className="flex-content"
            label="Tipo"
            name="tipo"
            rules={[
              {
                required: true,
                message: "Campo obligatorio.",
              },
            ]}
          >
            <Select
              className="input-form"
              value={equipo.tipo}
              onChange={(e) => handleData(e, "tipo")}
              showSearch
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
                {
                  value: "Estabilizador",
                  label: "Estabilizador",
                },
                {
                  value: "Proyector",
                  label: "Proyector",
                },

                {
                  value: "Cpu",
                  label: "Cpu",
                },
                {
                  value: "Monitor",
                  label: "Monitor",
                },
                {
                  value: "Laptop",
                  label: "Laptop",
                },
                {
                  value: "Telefono",
                  label: "Teléfono",
                },
                {
                  value: "Teclado",
                  label: "Teclado",
                },
                {
                  value: "Mouse",
                  label: "Mouse",
                },
                {
                  value: "Switch",
                  label: "Switch",
                },
                {
                  value: "Router",
                  label: "Router",
                },
                {
                  value: "Servidor",
                  label: "Servidor",
                },
                {
                  value: "Lector de cd",
                  label: "Lector de cd",
                },

                {
                  value: "Impresora",
                  label: "Impresora",
                },
              ]}
            />
          </Form.Item>
          <Form.Item
            className="flex-content"
            label="SBN"
            name="sbn"
            rules={[
              {
                required: true,
                message: "Campo obligatorio.",
              },
            ]}
          >
            <Input
              value={equipo.sbn}
              onChange={(e) => handleData(e.target.value, "sbn")}
              className="input-form"
            />
          </Form.Item>
        </div>
        <div className="flex">
          <Form.Item
            className="flex-content"
            label="Descripción"
            name="descripcion"
            rules={[
              {
                required: true,
                message: "Campo obligatorio.",
              },
            ]}
          >
            <Input
              value={equipo.descripcion}
              onChange={(e) => handleData(e.target.value, "descripcion")}
              className="input-form"
            />
          </Form.Item>
          <Form.Item
            className="flex-content"
            label="Marca"
            name="marca"
            rules={[
              {
                required: true,
                message: "Campo obligatorio.",
              },
            ]}
          >
            <Input
              value={equipo.marca}
              onChange={(e) => handleData(e.target.value, "marca")}
              className="input-form"
            />
          </Form.Item>
        </div>

        <div className="flex">
          <Form.Item
            className="flex-content"
            label="Estado"
            name="estado"
            rules={[
              {
                required: true,
                message: "Campo obligatorio.",
              },
            ]}
          >
            <Select
              className="input-form"
              value={equipo.estado}
              onChange={(e) => handleData(e, "estado")}
              showSearch
              optionFilterProp="children"
              filterOption={(input, option) =>
                (option?.label ?? "")
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
              allowClear
              options={[
                {
                  value: "Bueno",
                  label: "Bueno",
                },
                {
                  value: "Regular",
                  label: "Regular",
                },
                {
                  value: "Malo",
                  label: "Malo",
                },
              ]}
            />
          </Form.Item>
          <Form.Item
            className="flex-content"
            label="Año de ingreso"
            name="ingreso"
            rules={[
              {
                required: true,
                message: "Campo obligatorio.",
              },
            ]}
          >
            <Input
              value={equipo.ingreso}
              onChange={(e) => handleData(e.target.value, "ingreso")}
              className="input-form"
            />
          </Form.Item>
        </div>

        <div className="flex">
          <Form.Item
            className="flex-content"
            label="Sector"
            name="sector"
            rules={[
              {
                required: false,
                message: "Campo obligatorio.",
              },
            ]}
          >
            <Select
              className="input-form"
              value={equipo.sector}
              onChange={(e) => handleData(e, "sector")}
              allowClear
              options={[
                {
                  value: "Cayma",
                  label: "Cayma",
                },
                {
                  value: "Majes",
                  label: "Majes",
                },
              ]}
            />
          </Form.Item>
          <Form.Item
            className="flex-content"
            label="Modulo"
            name="modulo"
            rules={[
              {
                required: false,
                message: "Campo obligatorio.",
              },
            ]}
          >
            <Select
              className="input-form"
              value={equipo.modulo}
              onChange={(e) => handleData(e, "modulo")}
              allowClear
              options={equipo.sector === "Cayma" ? valoresAqp : equipo.sector === "Majes" ? valoresMajes : null}

            />
          </Form.Item>
        </div>
        {equipo.tipo === "Cpu" ||
        equipo.tipo === "Laptop" ||
        equipo.tipo === "pc escritorio" ? (
          <>
            <div className="flex">
              <Form.Item
                className="flex-content"
                label="Procesador"
                name="procesador"
                rules={[
                  {
                    required: false,
                    message: "Campo obligatorio.",
                  },
                ]}
              >
                <Input
                  value={equipo.procesador}
                  onChange={(e) => handleData(e, "procesador")}
                  className="input-form"
                />
              </Form.Item>
              <Form.Item
                className="flex-content"
                label="Disco duro"
                name="disco_duro"
                rules={[
                  {
                    required: false,
                    message: "Campo obligatorio.",
                  },
                ]}
              >
                <Input
                  style={{ width: "100%" }}
                  value={equipo.disco_duro}
                  onChange={(e) => handleData(e.target.value, "disco_duro")}
                  className="input-form"
                />
              </Form.Item>
            </div>

            <div className="flex">
              <Form.Item
                className="flex-content"
                label="Capacidad"
                name="capacidad"
                rules={[
                  {
                    required: false,
                    message: "Campo obligatorio.",
                  },
                ]}
              >
                <Input
                  style={{ width: "100%" }}
                  value={equipo.capacidad}
                  onChange={(e) => handleData(e.target.value, "capacidad")}
                  className="input-form"
                />
              </Form.Item>

              <Form.Item
                className="flex-content"
                label="Memoria"
                name="memoria"
                rules={[
                  {
                    required: false,
                    message: "Campo obligatorio.",
                  },
                ]}
              >
                <Input
                  style={{ width: "100%" }}
                  value={equipo.memoria}
                  onChange={(e) => handleData(e.target.value, "memoria")}
                  className="input-form"
                />
              </Form.Item>
            </div>

            <div className="flex">
              <Form.Item
                className="flex-content"
                label="Tarjeta de video"
                name="tarjeta_video"
                rules={[
                  {
                    required: false,
                    message: "Campo obligatorio.",
                  },
                ]}
              >
                <Input
                  style={{ width: "100%" }}
                  value={equipo.tarjeta_video}
                  onChange={(e) => handleData(e.target.value, "tarjeta_video")}
                  className="input-form"
                />
              </Form.Item>
              <Form.Item
                className="flex-content"
                label="Estado"
                name="estado"
                rules={[
                  {
                    required: true,
                    message: "Campo obligatorio.",
                  },
                ]}
              >
                <Select
                  className="input-form"
                  value={equipo.estado}
                  onChange={(e) => handleData(e, "estado")}
                  showSearch
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    (option?.label ?? "")
                      .toLowerCase()
                      .includes(input.toLowerCase())
                  }
                  options={[
                    {
                      value: "Bueno",
                      label: "Bueno",
                    },
                    {
                      value: "Regular",
                      label: "Regular",
                    },
                    {
                      value: "Malo",
                      label: "Malo",
                    },
                  ]}
                />
              </Form.Item>
            </div>

            <div className="flex">
              <Form.Item
                className="flex-content"
                label="Proveedor (RUC)"
                name="proveedor"
                rules={[
                  {
                    required: false,
                    message: "Campo obligatorio.",
                  },
                ]}
              >
                <Input
                  value={equipo.proveedor}
                  onChange={(e) => handleData(e.target.value, "proveedor")}
                  className="input-form"
                />
              </Form.Item>
              <Form.Item
                className="flex-content"
                label="Encargado"
                name="encargado"
                rules={[
                  {
                    required: true,
                    message: "Campo obligatorio.",
                  },
                ]}
              >
                <Select
                  className="input-form"
                  value={equipo.trabajador_id}
                  onChange={(e) => handleData(e, "trabajador_id")}
                  allowClear
                  options={trabajador.map((item) => {
                    return {
                      label: item.nombre,
                      value: item.id,
                    };
                  })}
                />
              </Form.Item>
            </div>
            <Form.Item style={{ display: "flex", justifyContent: "flex-end" }}>
              <Button htmlType="submit" type="primary">
                {editar ? "Editar" : "Registrar"}
              </Button>
            </Form.Item>
          </>
        ) : (
          <>
            <div className="flex">
              <Form.Item
                className="flex-content"
                label="Unidad"
                name="unidad"
                rules={[
                  {
                    required: false,
                    message: "Campo obligatorio.",
                  },
                ]}
              >
                <Select
                  className="input-form"
                  value={equipo.area}
                  popupMatchSelectWidth={false}
                  onChange={(e) => handleData(e, "area")}
                  allowClear
                  options={area.map((item) => {
                    return {
                      label: item.nombres,
                      value: item.nombres,
                    };
                  })}
                />
              </Form.Item>
              <Form.Item
                className="flex-content"
                label="Proveedor"
                name="proveedor"
                rules={[
                  {
                    required: false,
                    message: "Campo obligatorio.",
                  },
                ]}
              >
                <Input
                  value={equipo.proveedor}
                  onChange={(e) => handleData(e.target.value, "proveedor")}
                  className="input-form"
                />
              </Form.Item>
            </div>

            <div className="flex">
              <Form.Item
                className="flex-content"
                label="Encargado"
                name="encargado"
                rules={[
                  {
                    required: true,
                    message: "Campo obligatorio.",
                  },
                ]}
              >
                <Select
                  className="input-form"
                  value={equipo.trabajador_id || undefined}
                  onChange={(e) => handleData(e, "trabajador_id")}
                  allowClear
                  options={trabajador.map((item) => item)}
                />
              </Form.Item>
              <div className="flex-content"></div>
            </div>
            <Form.Item style={{ display: "flex", justifyContent: "flex-end" }}>
              <Button htmlType="submit" type="primary">
                {editar ? "Editar" : "Registrar"}
              </Button>
            </Form.Item>
          </>
        )}
      </Form>
    </Modal>
  );
};

export default RegistrarEquipo;
