import React, { useEffect } from "react";
import { Button, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import Loader from "react-loader-spinner";

import Queries from "../../Components/QueriesAxios";
import TableCustom from "../../Components/TableCustom";

export default function OpcionesCriticas(props) {
  const [selected, setSelected] = React.useState([]);
  const [ButtonEdit, setButtonEdit] = React.useState(false);
  const [data, setData] = React.useState([]);
  const [loadingData, setLoadingData] = React.useState(false);

  useEffect(() => {
    const fetchdata = async () => {
      setLoadingData(true);
      try {
        const QuerieOpcionesC = await Queries(
          null,
          "/opciones_criticas/",
          "GET"
        );
        setData(QuerieOpcionesC);
        setLoadingData(false);
      } catch (error) {
        setLoadingData(false);
      }
    };
    //////////////////////////////////////////
    if (data.length === 0) {
      fetchdata();
    }
    if (selected.length !== 0) {
      setButtonEdit(true);
      localStorage.setItem("id_opcion_critica", selected[0]);
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
          <h1 className="titulo">Opciones Críticas</h1>
        </Col>
        <Col style={{ paddingTop: "0.3%" }} sm={2} xs={6}></Col>
        <Col
          style={{ paddingTop: "0.3%" }}
          className="d-flex justify-content-end"
          sm={3}
          xs={6}
        >
          <Link to="EditarOpcionCritica">
            <Button
              className="botonNegativo"
              style={{
                display:
                  ButtonEdit && (props.permisos.editar || props.permisos.ver)
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
          sm={3}
          xs={6}
        >
          {props.permisos.crear ? (
            <Link to="NuevaOpcionCritica">
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
        <>
          <TableCustom
            data={data}
            nameCol={[
              "ID Opción",
              "Aplicativo",
              "Estado",
              "Usuario Func Resp",
              "Actividad",
            ]}
            nameRow={[
              "id_opcion_critica",
              "id_aplicacion",
              "estado",
              "nomb_usr_funcional",
              "nombre_actividad",
            ]}
            nameId={"id_opcion_critica"}
            busqueda={true}
            nameBusqueda={[
              "id_opcion_critica",
              "id_aplicacion",
              "estado",
              "nomb_usr_funcional",
              "nombre_actividad",
            ]}
            style={{ minHeight: "60vh" }}
            selectedData={selected}
            setSelectedData={setSelected}
          ></TableCustom>
        </>
      )}
    </>
  );
}
