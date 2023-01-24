//Espacio para realizar las importaciones
import React, { useEffect } from "react";
import Queries from "../../Components/QueriesAxios";
import TableCustom from "../../Components/TableCustom";
import { Button, Row, Col, Form } from "react-bootstrap";
import { Link } from "react-router-dom";
import Loader from "react-loader-spinner";

//Definición del componente
export default function SoD(props) {
  //Declaración de variables
  const [selected, setSelected] = React.useState([]);
  const [buttonEdit, setButtonEdit] = React.useState(false);
  const [data, setData] = React.useState([]);
  const [loadingData, setLoadingData] = React.useState(false);
  //Uso de funciones propias de react
  useEffect(() => {
    const consultas = async () => {
      let querieSoD = await Queries(null, "/sod/", "GET");
      setData(querieSoD);
      setLoadingData(false);
    };
    if (data.length === 0) {
      consultas();
    }
    if (selected.length !== 0) {
      setButtonEdit(true);
      localStorage.setItem("idsod", selected[0]);
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
          <h1 className="titulo">SoD</h1>
        </Col>
        <Col style={{ paddingTop: "0.3%" }} sm={4} xs={6}></Col>
        <Col
          style={{ paddingTop: "0.3%" }}
          className="d-flex justify-content-end"
          sm={2}
          xs={6}
        >
          <Link to="EditarSoD">
            <Button
              className="botonNegativo"
              style={{
                display:
                  buttonEdit && (props.permisos.editar || props.permisos.ver)
                    ? "inline"
                    : "none",
              }}
            >
              Ver / Editar
            </Button>
          </Link>
        </Col>
        <Col
          style={{ paddingTop: "0.3%" }}
          className="d-flex justify-content-end"
          sm={2}
          xs={6}
        >
          {props.permisos.crear ? (
            <Link to="NuevaSoD">
              <Button className="botonPositivo">Crear</Button>
            </Link>
          ) : null}
        </Col>
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
        <TableCustom
          data={data}
          nameCol={["ID", "Riesgo", "Estado"]}
          nameRow={["idsod", "id_riesgo", "estado"]}
          nameId={"idsod"}
          busqueda={true}
          nameBusqueda={["idsod", "id_riesgo", "estado"]}
          selectedData={selected}
          setSelectedData={setSelected}
        />
      )}
    </>
  );
}
