import { Input, Modal, Select, Typography, notification } from "antd";
import React, { useEffect, useRef, useState } from "react";
import CargoPersonal from "../PDF/CargoPersonal";
import { useReactToPrint } from "react-to-print";
import { PDFDownloadLink, PDFViewer,pdf } from "@react-pdf/renderer";
const ImprimirCargo = ({data}) => {
  const printRef = useRef();

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
  });


  return (
    <div>
      <div ref={printRef}>
        {data?.map((doc, index) => (
          <PDFViewer key={index} style={{ width: "100%", height: "800px" }}>
            <CargoPersonal data={doc} />
          </PDFViewer>
        ))}
      </div>
      <button onClick={handlePrint}>Imprimir</button>
    </div>
  );
};

export default ImprimirCargo;
