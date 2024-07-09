// BarcodeComponent.js
import React from "react";
import Barcode from "react-barcode";
import image from "../../assets/logo_autodema.png";
import image1 from "../../assets/gobierno.png";

const BarCode = ({ values }) => {
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
            border: "1px solid red",
            padding: "0.2mm"
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
            <div style={{flex:1}}>
              <img src={image1} alt="Custom Logo" style={{ height: "15px" }} />
            </div>
            <div
              style={{
                fontSize: "8px",
                fontFamily: "Helvetica",
                lineHeight: "1",
                flex: 8,
                textAlign:"center"
              }}
            >
            <p style={{ margin: 0, width:"100%" }}>PEIMS - AUTODEMA - PATRIMONIO</p>
            
            <hr style={{border:"0.3px solid black", marginTop:"2px"}}/>
            {/* <p style={{ margin: 0, width:"100%" }}>AUTODEMA - PATRIMONIO</p> */}

            </div>
            <div style={{flex:1}}>
              <img src={image} alt="Custom Logo" style={{ height: "15px" }} />
            </div>
          </div>
          <Barcode
            value={value.codigo_activo}
            width={1.25}
            height={25}
            fontSize={12}
            marginTop={2}
            marginBottom={2}
          />
          <p style={{ fontSize: "8px", fontFamily: "Helvetica", margin: 0 }}>
            {value.descripcion}
          </p>
        </div>
      ))}
    </>
  );
};

export default BarCode;
