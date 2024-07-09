// BarcodeComponent.js
import React from "react";
import Barcode from "react-barcode";
import image from "../../assets/logo_autodema.png";
import image1 from "../../assets/gobierno.png";

const BarCode = ({ values }) => {
  return (
    <>
      {values?.map((value, index) => (
      <div key={index} style={{ width: "5cm", height: "2.5cm", textAlign: "center", padding: "1mm", marginBottom: "2mm" }}>
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
                style={{ height: "20px" }}
              />
            </div>
            <div style={{ fontSize: "7px", fontWeight:"bold", fontFamily:"Roboto" }}>
              {/* <p>AUTODEMA</p> */}
              <p>OFICINA DE CONTROL Y SANEAMIENTO PATRIMONIAL - 2024</p>
            </div>
            <div>
              <img
                src={image}
                alt="Custom Logo"
                style={{  height: "20px" }}
              />
            </div>
          </div>
          <Barcode
            value={value.codigo_activo}
            width={1.25}
            height={18}
            fontSize={12}
            marginTop={3}
            marginBottom={2}
            
            
          />
          <p style={{fontSize:"7px", fontWeight:"bold", fontFamily:"Roboto"}}>{value.descripcion}</p>
        </div>
      ))}
    </>
  );
};

export default BarCode;
