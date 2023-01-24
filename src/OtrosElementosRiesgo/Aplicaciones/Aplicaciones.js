import React, { useEffect } from "react";
import { Button, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import Loader from "react-loader-spinner";
import axios from "axios";

import Queries from "../../Components/QueriesAxios";
import TableCustom from "../../Components/TableCustom";

export default function Aplicaciones(props) {
  const [selected, setSelected] = React.useState([]);
  const [ButtonEdit, setButtonEdit] = React.useState(false);
  const [data, setData] = React.useState([]);
  const [loadingData, setLoadingData] = React.useState(false);

  useEffect(() => {
    const fetchdata = async () => {
      setLoadingData(true);
      const response = await axios.get(
        "https://grc-rotic-alb-qa.apps.ambientesbc.com/aplicativos/",
        {
          headers: {},
        }
      );
      let dataPrin = response.data.filter((o) => o.componente_principal);
      setData(dataPrin);
      setLoadingData(false);
    };
    //////////////////////////////////////////
    if (data.length === 0) {
      fetchdata();
    }
    if (selected.length !== 0) {
      setButtonEdit(true);
      localStorage.setItem("idactivo", selected[0]);
    } else {
      setButtonEdit(false);
    }
  }, [selected, setSelected]);

  return (
    <>
      <p></p>
      <Row
        style={{ marginTop: "1%", marginBottom: "0.5%" }}
        className="mb-3 mt-3"
      >
        <Col sm={4} xs={12}>
          <h1 className="titulo">Aplicaciones</h1>
        </Col>
        <Col style={{ paddingTop: "0.3%" }} sm={2} xs={6}></Col>
        <Col
          style={{ paddingTop: "0.3%" }}
          className="d-flex justify-content-end"
          sm={3}
          xs={6}
        >
          <Link to="VerAplicacion">
            <Button
              className="botonNegativo"
              style={{
                display:
                  ButtonEdit && (props.permisos.editar || props.permisos.ver)
                    ? "inline"
                    : "none",
              }}
            >
              Ver Detalles
            </Button>
          </Link>
        </Col>
        <Col
          style={{ paddingTop: "0.3%" }}
          className="d-flex justify-content-end"
          sm={3}
          xs={6}
        ></Col>
      </Row>

      {loadingData ? (
        <Row className="mb-3 mt-5">
          <Col>
            <Loader
              type="Oval"
              color="#FFBF00"
              style={{ textAlign: "center", position: "static" }}
            />
          </Col>
        </Row>
      ) : (
        <>
          <TableCustom
            data={data}
            nameCol={["ID Activo", "Nombre", "Descripción"]}
            nameRow={["idactivo", "nombre", "descripcion"]}
            nameId={"idactivo"}
            busqueda={true}
            nameBusqueda={["idactivo", "nombre", "descripcion"]}
            style={{ minHeight: "60vh" }}
            selectedData={selected}
            setSelectedData={setSelected}
          ></TableCustom>
        </>
      )}
    </>
  );
}
