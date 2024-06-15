// PDFDocument.js
import React from "react";
import { Page, Text, View, Document, StyleSheet, Font } from "@react-pdf/renderer";
import dayjs, { Dayjs } from "dayjs";

import { es } from "dayjs/locale/es";

dayjs.locale("es");
Font.register({
    family: 'Helvetica',
    fonts: [
      { src: 'https://fonts.gstatic.com/s/helveticaneue/v9/KFOkCnqEu92Fr1Mu51xIIzc.ttf' }, // Normal
      { src: 'https://fonts.gstatic.com/s/helveticaneue/v9/KFOkCnqEu92Fr1Mu51xHIzc.ttf', fontWeight: 'bold' } // Bold
    ]
  });
const styles = StyleSheet.create({
  page: {
    padding: 15,
  },
  section: {
    margin: 10,
    padding: 10,
    display: "flex",
    flexDirection: "row",
    fontSize: 8,
    gap: 5,
  },
  header: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: "center",
  },
  table: {
    display: "table",
    width: "auto",
    borderStyle: "solid",
    borderWidth: 0,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    borderLeftWidth: 0,
  },
  tableRow: {
    flexDirection: "row",
    justifyContent: "center",
  },
  tableCol1: {
    borderStyle: "solid",
    borderWidth: 0,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  tableCell: {
    margin: "auto",
    marginTop: 5,
    fontSize: 10,
  },
  footer: {
    position: "absolute",
    bottom: 15,
    left: 15,
    right: 15,
    textAlign: "center",
    display: "flex",
    flexDirection: "row",
    fontSize: 10,
    justifyContent: "space-between",
  },
  footerColumn: {
    flex: 1,
    alignItems: "center",
  },
  footerText: {
    marginVertical: 2,
  },
  bold: {
    fontFamily: 'Helvetica',
    fontWeight: 'bold',
  },
});

const CargoPersonal = ({ data, docData, centroCosto, ubicacion }) => {
    const ITEMS_PER_PAGE = 10
    const paginate = (items, itemsPerPage) => {
      const pages = [];
      for (let i = 0; i < items.length; i += itemsPerPage) {
        pages.push(items.slice(i, i + itemsPerPage));
      }
      return pages;
    };
  
    const paginatedData = paginate(data, ITEMS_PER_PAGE);
    console.log(data);
    return (
      <Document>
        {paginatedData.map((pageData, pageIndex) => (
          <Page style={styles.page} key={pageIndex} orientation="landscape">
            <View style={{ display: "flex", justifyContent: "space-between", flexDirection: "row" }}>
              <View style={{ flex: 1, flexDirection: "column", fontSize: 8 }}>
                <Text>Sistema Integrado de Gestión Administrativa</Text>
                <Text>Módulo de Patrimonio</Text>
                <Text>Version 24.01.00.U2.MCMM</Text>
              </View>
              <View style={{ flex: 2, flexDirection: "column", fontSize: 12, textAlign: "center", marginTop: "30px" }}>
                <Text>CARGO PERSONAL POR ASIGNACIÓN DE BIENES EN USO - {docData.id_correlativo}</Text>
              </View>
              <View style={{ flex: 1, flexDirection: "column", fontSize: 8, alignItems: "flex-end" }}>
                <Text>Fecha: {dayjs().format("DD/MM/YYYY")}</Text>
                <Text>Hora: {dayjs().format("HH:mm:s")}</Text>
                <Text>Página: {pageIndex + 1} de {paginatedData.length}</Text>
              </View>
            </View>
            <Text style={{ ...styles.header, fontSize: 12, textTransform: "uppercase" }}>MES : {dayjs(docData.fecha_asigna).format("MMMM")}</Text>
            <View style={styles.section}>
              <View style={{ flex: 2.5, gap: 4 }}>
                <Text style={styles.bold}>UNIDAD EJECUTORA: 005 AUTORIDAD AUTONOMA DE MAJES</Text>
                <Text style={styles.bold}>NRO IDENTIFICACIÓN: 001137</Text>
                <Text style={styles.bold}>DEPENDENCIA: {centroCosto.at(-1).CENTRO_COSTO +" "+ centroCosto.at(-1).NOMBRE_DEPEND}</Text>
                <Text style={styles.bold}>UBICACIÓN FÍSICA: {ubicacion.at(-1)?.UBICAC_FISICA}</Text>
              </View>
              <View style={{ flex: 2, justifyContent: "flex-end", textAlign: "center", gap: 4 }}>
                <Text>RESPONSABLE: {docData?.de_usuario}</Text>
                <Text>USUARIO FINAL: {docData?.para_usuario}</Text>
              </View>
              <View style={{ flex: 1, textAlign: "center", justifyContent: "flex-end" }}>
                <Text style={{ marginBottom: 15 }}>FECHA ASIGNACIÓN: {docData?.fecha_asig}</Text>
              </View>
            </View>
            <View style={styles.section}>
              <View style={styles.table}>
                <View style={{ ...styles.tableRow, borderTopWidth: 0.5, borderLeftWidth: 0.5, borderRightWidth: 0.5, borderBottomWidth: 0.5 }}>
                  <View style={{ ...styles.tableCol1, width: "5%", height: "35px" }}>
                    <Text style={{...styles.tableCell, verticalAlign:"center"}}>Nro</Text>
                  </View>
                  <View style={{ ...styles.tableCol1, width: "10%", height: "35px" }}>
                    <Text style={{ ...styles.tableCell, textAlign: "center" }}>Código Patrimonial</Text>
                  </View>
                  <View style={{ ...styles.tableCol1, width: "10%", height: "35px" }}>
                    <Text style={{ ...styles.tableCell, textAlign: "center" }}>Código Barras / Inv. Ant</Text>
                  </View>
                  <View style={{ ...styles.tableCol1, width: "25%", height: "35px" }}>
                    <Text style={styles.tableCell}>Descripción</Text>
                  </View>
                  <View style={{ ...styles.tableCol1, width: "16%", height: "35px" }}>
                    <Text style={styles.tableCell}>Marca</Text>
                  </View>
                  <View style={{ ...styles.tableCol1, width: "10%", height: "35px" }}>
                    <Text style={styles.tableCell}>Modelo</Text>
                  </View>
                  <View style={{ ...styles.tableCol1, width: "10%", height: "35px" }}>
                    <Text style={styles.tableCell}>Serie</Text>
                  </View>
                  <View style={{ ...styles.tableCol1, width: "7%", height: "35px" }}>
                    <Text style={styles.tableCell}>Medidas</Text>
                  </View>
                  <View style={{ ...styles.tableCol1, width: "7%", height: "35px" }}>
                    <Text style={styles.tableCell}>Estado</Text>
                  </View>
                </View>
                {pageData.map((item, index) => (
                  <View style={{ ...styles.tableRow, borderWidth: 0, borderLeftWidth: 0, borderStyle: 0, height: "20px" }} key={index + 1}>
                    <View style={{ ...styles.tableCol, width: "5%", height: "40px", borderWidth: 0, fontSize: 7, borderLeftWidth: 0, borderStyle: 0 }}>
                      <Text style={styles.tableCell}>{index + 1 + pageIndex * ITEMS_PER_PAGE}</Text>
                    </View>
                    <View style={{ ...styles.tableCol, width: "10%", height: "40px", fontSize: 7 }}>
                      <Text style={{ ...styles.tableCell, fontSize: 8 }}>{item?.codigo_activo}</Text>
                    </View>
                    <View style={{ ...styles.tableCol, width: "10%", height: "40px", fontSize: 7 }}>
                      <Text style={{ ...styles.tableCell, fontSize: 8 }}>{item?.codigo_barra}</Text>
                    </View>
                    <View style={{ ...styles.tableCol, width: "25%", height: "40px", fontSize: 7 }}>
                      <Text style={{ ...styles.tableCell, fontSize: 8 }}>{item?.descripcion}</Text>
                    </View>
                    <View style={{ ...styles.tableCol, width: "16%", height: "40px", fontSize: 7 }}>
                      <Text style={{ ...styles.tableCell, fontSize: 8 }}>{item?.nombre_marca}</Text>
                    </View>
                    <View style={{ ...styles.tableCol, width: "10%", height: "40px", fontSize: 7 }}>
                      <Text style={{ ...styles.tableCell, fontSize: 8 }}>{item?.modelo}</Text>
                    </View>
                    <View style={{ ...styles.tableCol, width: "10%", height: "40px", fontSize: 7 }}>
                      <Text style={{ ...styles.tableCell, fontSize: 8 }}>{item?.nro_serie}</Text>
                    </View>
                    <View style={{ ...styles.tableCol, width: "7%", height: "40px", fontSize: 7 }}>
                      <Text style={{ ...styles.tableCell, fontSize: 8 }}>{item?.medidad}</Text>
                    </View>
                    <View style={{ ...styles.tableCol, width: "7%", height: "40px", fontSize: 7 }}>
                      <Text style={{ ...styles.tableCell, fontSize: 8 }}>{item?.estado}</Text>
                    </View>
                  </View>
                ))}
              </View>
            </View>
            <View style={{ ...styles.section, fontSize: 8, marginTop: 2 }}>
            <Text>
              Observaciones: {docData?.observaciones ? docData.observaciones : 
              "__________________________________________________________________________________________________________________________________________________________________\n\n_________________________________________________________________________________________________________________________________________________________________________\n\n__________________________________________________________________________________________________________________________________________________________________________"}
            </Text>
          </View>
            <View style={styles.footer}>
              <View style={styles.footerColumn}>
                <Text style={styles.footerText}>____________________</Text>
                <Text style={styles.footerText}>Usuario del bien</Text>
              </View>
              <View style={styles.footerColumn}>
                <Text style={styles.footerText}>_____________________</Text>
                <Text style={styles.footerText}>Responsable del bien</Text>
              </View>
              <View style={styles.footerColumn}>
                <Text style={styles.footerText}>__________________________</Text>
                <Text style={styles.footerText}>Comité Gestión Patrimonial</Text>
              </View>
              <View style={styles.footerColumn}>
                <Text style={styles.footerText}>______________________</Text>
                <Text style={styles.footerText}>Jefe de la dependencia</Text>
              </View>
            </View>
          </Page>
        ))}
      </Document>
)};

export default CargoPersonal;
