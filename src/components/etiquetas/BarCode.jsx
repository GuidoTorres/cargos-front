// BarcodeComponent.js
import React from "react";
import Barcode from "react-barcode";
import image from "../../assets/logo_autodema.png";
import image1 from "../../assets/gobierno.png";

const BarCode = ({ values }) => {
  return (
    <>
      {values?.map((value, index) => (
      <div key={index} style={{ width: "5cm", height: "2.5cm", textAlign: "center", padding: "2mm", marginBottom: "5mm" }}>
      <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "2px",
            }}
          >
            <div>
              <img
                src={image1}
                alt="Custom Logo"
                style={{ marginBottom: "10px", height: "20px" }}
              />
            </div>
            <div style={{ fontSize: "5px" }}>
              <p>AUTORIDAD AUTONOMA DE MAJES</p>
              <p>OFICINA DE CONTROL Y SANEAMIENTO PATRIMONIAL - 2024</p>
            </div>
            <div>
              <img
                src={image}
                alt="Custom Logo"
                style={{ marginBottom: "10px", height: "20px" }}
              />
            </div>
          </div>
          <Barcode
            value={value.codigo_activo}
            width={1.5}
            height={20}
            fontSize={10}
            marginTop={1}
            marginBottom={5}
          />
          <p style={{fontSize:"6px"}}>{value.descripcion}</p>
        </div>
      ))}
    </>
  );
};

export default BarCode;
