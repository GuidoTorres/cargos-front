// PDFDocument.js
import React from "react";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Font,
  Image,
} from "@react-pdf/renderer";
import dayjs, { Dayjs } from "dayjs";
import image from "../../assets/logo_autodema.png";
import font from "../../assets/autodema.png";
import { es } from "dayjs/locale/es";

dayjs.locale("es");
Font.register({
  family: "Roboto",
  fonts: [
    {
      src: `${process.env.PUBLIC_URL}/fonts/Roboto-Medium.ttf`,
    }, // Normal
    {
      src: `${process.env.PUBLIC_URL}/fonts/Roboto-Bold.ttf`,
      fontWeight: "bold",
    }, // Bold
  ],
});
const styles = StyleSheet.create({
  page: {
    padding: 15,
  },
  section: {
    margin: 5,
    padding: 5,
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
    fontSize: 7,
  },
  tableCell: {
    margin: "auto",
    marginTop: 3,
    fontSize: 7,
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
    fontFamily: "Roboto",
    fontWeight: "bold",
  },
  regular: {
    fontFamily: "Roboto",
  },
});

const CargoPersonal = ({ data, docData, centroCosto, ubicacion }) => {
  const ITEMS_PER_PAGE = 10;
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
          <View
            style={{
              display: "flex",
              justifyContent: "space-between",
              flexDirection: "row",
            }}
          >
            <View style={{ flex: 1, flexDirection: "row", fontSize: 7 }}>
              <View style={{ flex: 1, justifyContent: "center" }}>
                <Image src={image} style={{ width: "60px", height: "60px" }} />
              </View>
              <View style={{ flex: 3, paddingTop: "10px" }}>
                <Text style={{ ...styles.bold, paddingLeft: "10px" }}>
                  Sistema Integrado de Gestión Administrativa
                </Text>
                <Text style={{ ...styles.bold, paddingLeft: "10px" }}>
                  Módulo de Patrimonio
                </Text>
                <Text style={{ ...styles.bold, paddingLeft: "10px" }}>
                  Version 24.01.00.U2.MCMM
                </Text>
              </View>
            </View>
            <View
              style={{
                flex: 2,
                flexDirection: "column",
                fontSize: 12,
                textAlign: "center",
                marginTop: "30px",
              }}
            >
              <Text style={styles.bold}>
                CARGO PERSONAL POR ASIGNACIÓN DE BIENES EN USO
                {docData.id_correlativo
                  ? " " +
                    "-" +
                    " " +
                    docData.id_correlativo.toString().padStart(6, "0")
                  : ""}
              </Text>
              <Text
                style={{
                  ...styles.header,
                  ...styles.bold,
                  fontSize: 12,
                  textTransform: "uppercase",
                }}
              >
                MES : {dayjs(docData.fecha_asigna).format("MMMM")}
              </Text>
            </View>
            <View
              style={{
                flex: 1,
                flexDirection: "column",
                fontSize: 7,
                alignItems: "flex-end",
                paddingTop: "10px",
              }}
            >
              <View
                style={{
                  ...styles.bold,
                  width: "40%",
                  textAlign: "left",
                  fontFamily: "Roboto",
                  fontWeight: "bold",
                  display: "flex",
                  flexDirection: "row",
                }}
              >
                <Text style={{ ...styles.bold, textAlign: "left", flex: 0.6 }}>
                  Fecha:{" "}
                </Text>
                <Text style={{ ...styles.bold, textAlign: "left", flex: 1 }}>
                  {dayjs().format("DD-MM-YYYY")}
                </Text>
              </View>
              <View
                style={{
                  ...styles.bold,
                  width: "40%",
                  textAlign: "left",
                  fontFamily: "Roboto",
                  fontWeight: "bold",
                  display: "flex",
                  flexDirection: "row",
                }}
              >
                <Text style={{ ...styles.bold, textAlign: "left", flex: 0.6 }}>
                  Hora:{" "}
                </Text>
                <Text style={{ ...styles.bold, textAlign: "left", flex: 1 }}>
                  {dayjs().format("HH:mm:s")}
                </Text>
              </View>
              <View
                style={{
                  width: "40%",
                  textAlign: "left",
                  fontFamily: "Roboto",
                  fontWeight: "bold",
                  display: "flex",
                  flexDirection: "row",
                }}
              >
                <Text style={{ ...styles.bold, textAlign: "left", flex: 0.6 }}>
                  Página:{" "}
                </Text>
                <Text style={{ ...styles.bold, textAlign: "left", flex: 1 }}>
                  {pageIndex + 1} de {paginatedData.length}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <View style={{ flex: 2.5, gap: 4, fontSize: 7 }}>
              <View style={{ flexDirection: "row" }}>
                <Text style={styles.bold}>UNIDAD EJECUTORA: </Text>
                <Text style={styles.regular}>
                  005 AUTORIDAD AUTONOMA DE MAJES
                </Text>
              </View>
              <View style={{ flexDirection: "row" }}>
                <Text style={styles.bold}>NRO IDENTIFICACIÓN: </Text>
                <Text style={styles.regular}>001137</Text>
              </View>
              <View style={{ flexDirection: "row" }}>
                <Text style={styles.bold}>DEPENDENCIA: </Text>
                <Text style={styles.regular}>
                  {centroCosto.at(-1).CENTRO_COSTO +
                    " " +
                    centroCosto.at(-1).NOMBRE_DEPEND}
                </Text>
              </View>
              <View style={{ flexDirection: "row" }}>
                <Text style={styles.bold}>UBICACIÓN FÍSICA: </Text>
                <Text style={styles.regular}>
                  {ubicacion.at(-1)?.UBICAC_FISICA}
                </Text>
              </View>
            </View>
            <View
              style={{
                flex: 2,
                justifyContent: "flex-end",
                textAlign: "center",
                gap: 4,
                fontSize: 7,
              }}
            >
              <View style={{ flexDirection: "row" }}>
                <Text style={styles.bold}>RESPONSABLE: </Text>
                <Text style={styles.regular}>{docData?.de_usuario}</Text>
              </View>
              <View style={{ flexDirection: "row" }}>
                <Text style={styles.bold}>USUARIO FINAL: </Text>
                <Text style={styles.regular}>{docData?.para_usuario}</Text>
              </View>
            </View>
            <View
              style={{
                flex: 1,
                textAlign: "center",
                justifyContent: "flex-end",
                fontSize: 7,
                flexDirection: "column",
              }}
            >
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  marginBottom: 15,
                  fontSize: 8,
                }}
              >
                <Text style={styles.bold}>FECHA ASIGNACIÓN: </Text>
                <Text style={styles.regular}>{docData?.fecha_asig}</Text>
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <View style={styles.table}>
              <View
                style={{
                  ...styles.tableRow,
                  borderTopWidth: 0.5,
                  borderLeftWidth: 0.5,
                  borderRightWidth: 0.5,
                  borderBottomWidth: 0.5,
                  fontSize: 7,
                }}
              >
                <View
                  style={{ ...styles.tableCol1, width: "5%", height: "25px" }}
                >
                  <Text
                    style={{
                      ...styles.tableCell,
                      ...styles.bold,
                      verticalAlign: "center",
                    }}
                  >
                    Nro
                  </Text>
                </View>
                <View
                  style={{ ...styles.tableCol1, width: "10%", height: "25px" }}
                >
                  <Text
                    style={{
                      ...styles.tableCell,
                      ...styles.bold,
                      textAlign: "center",
                    }}
                  >
                    Código Patrimonial
                  </Text>
                </View>
                <View
                  style={{
                    ...styles.tableCol1,
                    ...styles.bold,
                    width: "10%",
                    height: "25px",
                  }}
                >
                  <Text style={{ ...styles.tableCell, textAlign: "center" }}>
                    Código Barras / Inv. Ant
                  </Text>
                </View>
                <View
                  style={{
                    ...styles.tableCol1,
                    ...styles.bold,
                    width: "25%",
                    height: "25px",
                  }}
                >
                  <Text style={styles.tableCell}>Descripción</Text>
                </View>
                <View
                  style={{
                    ...styles.tableCol1,
                    ...styles.bold,
                    width: "16%",
                    height: "25px",
                  }}
                >
                  <Text style={styles.tableCell}>Marca</Text>
                </View>
                <View
                  style={{
                    ...styles.tableCol1,
                    ...styles.bold,
                    width: "10%",
                    height: "25px",
                  }}
                >
                  <Text style={styles.tableCell}>Modelo</Text>
                </View>
                <View
                  style={{
                    ...styles.tableCol1,
                    ...styles.bold,
                    width: "10%",
                    height: "25px",
                  }}
                >
                  <Text style={styles.tableCell}>Serie</Text>
                </View>
                <View
                  style={{
                    ...styles.tableCol1,
                    ...styles.bold,
                    width: "7%",
                    height: "25px",
                  }}
                >
                  <Text style={styles.tableCell}>Medidas</Text>
                </View>
                <View
                  style={{
                    ...styles.tableCol1,
                    ...styles.bold,
                    width: "7%",
                    height: "25px",
                  }}
                >
                  <Text style={styles.tableCell}>Estado</Text>
                </View>
              </View>
              {pageData.map((item, index) => (
                <View
                  style={{
                    ...styles.tableRow,
                    borderWidth: 0,
                    borderLeftWidth: 0,
                    borderStyle: 0,
                    height: "20px",
                  }}
                  key={index + 1}
                >
                  <View
                    style={{
                      ...styles.tableCol,
                      width: "5%",
                      height: "40px",
                      borderWidth: 0,
                      fontSize: 7,
                      borderLeftWidth: 0,
                      borderStyle: 0,
                    }}
                  >
                    <Text style={styles.tableCell}>
                      {index + 1 + pageIndex * ITEMS_PER_PAGE}
                    </Text>
                  </View>
                  <View
                    style={{
                      ...styles.tableCol,
                      width: "10%",
                      height: "40px",
                      fontSize: 7,
                    }}
                  >
                    <Text style={{ ...styles.tableCell, fontSize: 7 }}>
                      {item?.codigo_activo}
                    </Text>
                  </View>
                  <View
                    style={{
                      ...styles.tableCol,
                      width: "10%",
                      height: "40px",
                      fontSize: 7,
                    }}
                  >
                    <Text style={{ ...styles.tableCell, fontSize: 7 }}>
                      {item?.codigo_barra}
                    </Text>
                  </View>
                  <View
                    style={{
                      ...styles.tableCol,
                      width: "25%",
                      height: "40px",
                      fontSize: 7,
                    }}
                  >
                    <Text
                      style={{
                        ...styles.tableCell,
                        fontSize: 7,
                        textAlign: "left",
                      }}
                    >
                      {item?.descripcion}
                    </Text>
                  </View>
                  <View
                    style={{
                      ...styles.tableCol,
                      width: "16%",
                      height: "40px",
                      fontSize: 7,
                    }}
                  >
                    <Text style={{ ...styles.tableCell, fontSize: 7 }}>
                      {item?.nombre_marca}
                    </Text>
                  </View>
                  <View
                    style={{
                      ...styles.tableCol,
                      width: "10%",
                      height: "40px",
                      fontSize: 7,
                    }}
                  >
                    <Text style={{ ...styles.tableCell, fontSize: 7 }}>
                      {item?.modelo}
                    </Text>
                  </View>
                  <View
                    style={{
                      ...styles.tableCol,
                      width: "10%",
                      height: "40px",
                      fontSize: 7,
                    }}
                  >
                    <Text style={{ ...styles.tableCell, fontSize: 8 }}>
                      {item?.nro_serie}
                    </Text>
                  </View>
                  <View
                    style={{
                      ...styles.tableCol,
                      width: "7%",
                      height: "40px",
                      fontSize: 7,
                    }}
                  >
                    <Text style={{ ...styles.tableCell, fontSize: 8 }}>
                      {item?.medidad}
                    </Text>
                  </View>
                  <View
                    style={{
                      ...styles.tableCol,
                      width: "7%",
                      height: "40px",
                      fontSize: 7,
                    }}
                  >
                    <Text style={{ ...styles.tableCell, fontSize: 7 }}>
                      {item?.estado == "1"
                        ? "Bueno"
                        : item?.estado == "2"
                        ? "Regular"
                        : item?.estado == "3"
                        ? "Malo"
                        : item?.estado == "4"
                        ? "Muy Malo"
                        : item?.estado == "5"
                        ? "Nuevo"
                        : item?.estado == "6"
                        ? "Chatarra"
                        : item?.estado == "7"
                        ? "RAEE"
                        : ""}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
          <View
            style={{
              ...styles.section,
              fontSize: 8,
              marginTop: 2,
              paddingLeft: "10px",
            }}
          >
            <Text style={{ paddingLeft: "10px" }}>
              Observaciones:{" "}
              {docData?.observaciones
                ? docData.observaciones
                : "__________________________________________________________________________________________________________________________________________________________________________\n\n__________________________________________________________________________________________________________________________________________________________________________\n\n__________________________________________________________________________________________________________________________________________________________________________"}
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
  );
};

export default CargoPersonal;
