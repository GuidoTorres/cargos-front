// BarcodeComponent.js
import React from "react";
import Barcode from "react-barcode";
import image from "../../assets/logo_autodema.png";
import image1 from "../../assets/gobierno.png";

const BarCode = ({ values, saneamiento }) => {
  return (
    <>
      {values?.map((value, index) => (
        <div
          key={index}
          style={{
            width: "5cm",
            height: "2.5cm",
            textAlign: "center",
            marginBottom: "2mm",
            boxSizing: "border-box",
            padding: "0.2mm",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "2px",
            }}
          >
            <div style={{ flex: 1 }}>
              <img
                src={image1}
                alt="Custom Logo"
                style={{ height: "15px", imageRendering: "crisp-edges" }}
              />
            </div>
            <div
              style={{
                fontSize: saneamiento ? "7px" : "8px",
                fontFamily: "Helvetica",
                lineHeight: "1",
                flex: 8,
                textAlign: "center",
              }}
            >
              <p
                style={{
                  margin: 0,
                  width: "100%",
                  letterSpacing: "0.4px",
                  textRendering: "optimizeLegibility",
                }}
              >
                {saneamiento
                  ? "PEIMS - AUTODEMA - SANEAMIENTO"
                  : "PEIMS - AUTODEMA - PATRIMONIO"}
              </p>
              <div
                style={{
                  border: "0.2px solid black",
                  marginTop: "2px",
                  borderTop: 0,
                }}
              ></div>
              {/* <p style={{ margin: 0, width:"100%" }}>AUTODEMA - PATRIMONIO</p> */}
            </div>
            <div style={{ flex: 1 }}>
              <img
                src={image}
                alt="Custom Logo"
                style={{ height: "15px", imageRendering: "crisp-edges" }}
              />
            </div>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div
              style={{
                transform: "rotate(-90deg)",
                fontSize: "6px",
                marginLeft: "-5px",
                paddingLeft: "0",
              }}
            >
              <label>{`O/C` + " " + value.nro_orden}</label>
            </div>

            <Barcode
              value={value.codigo_activo}
              width={1.25}
              height={20}
              fontSize={12}
              marginTop={2}
              marginBottom={5}
              marginLeft={-0.5}
            />
            <div>
              <p
                style={{
                  transform: "rotate(90deg)",
                  fontSize: "7px",
                  marginRight: "-2px",
                }}
              >
                {saneamiento ? "2023" : new Date().getFullYear()}
              </p>
            </div>
          </div>
          <p
            style={{
              overflow: "hidden",
              fontFamily: "Helvetica",
              fontSize: "8px",
              margin: 0,
              textRendering: "optimizeLegibility",
              height: "19.5px",
            }}
          >
            {value.descripcion}
          </p>
        </div>
      ))}
    </>
  );
};

export default BarCode;
