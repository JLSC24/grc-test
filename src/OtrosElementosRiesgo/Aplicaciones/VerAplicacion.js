//Espacio para realizar las importaciones
import React, { useEffect, useState } from "react";
import { Row, Col } from "react-bootstrap";
import { Link, useHistory } from "react-router-dom";
import axios from "axios";
import TableCustom from "../../Components/TableCustom";

//Definición del componente
export default function VerAplicacion() {
  //Declaración de variables
  const [aplicativo, setAplicativo] = useState(null);
  const [opciones, setOpciones] = useState([]);
  //Uso de funciones propias de react
  useEffect(() => {
    const fetchdata = async () => {
      const response = await axios.get(
        "https://grc-rotic-alb-qa.apps.ambientesbc.com/aplicativos/",
        {
          headers: {},
        }
      );
      let dataPrin = response.data.filter((o) => o.componente_principal);
      dataPrin = dataPrin.filter(
        (o) => o.idactivo === parseInt(localStorage.getItem("idactivo"))
      );
      setAplicativo(dataPrin[0]);
    };
    //////////////////////////////////////////
    if (!aplicativo) {
      fetchdata();
    }
  }, []);

  //Funciones para la vista en específico
  const funcionBase = (parametro) => {};

  return (
    <>
      <p></p>
      <Row className="mb-3">
        <Col md={12}>
          <h1 className="titulo">Ver información de la aplicación</h1>
        </Col>
      </Row>

      <hr></hr>
      <Row className="mb-3">
        <Col sm={4} xs={12}>
          <label className="label forn-label">Id Aplicación</label>
        </Col>
        <Col sm={3} xs={12}>
          <input
            type="text"
            disabled
            defaultValue={aplicativo ? aplicativo.idactivo : null}
            className="form-control text-center texto"
            placeholder="ID Automático"
            id="IdOpcion"
          ></input>
        </Col>
        <Col sm={2} xs={12}>
          <label className="label forn-label">Estado</label>
        </Col>
        <Col sm={3} xs={12}>
          <input
            type="text"
            disabled
            defaultValue={
              aplicativo && aplicativo.estado ? "Activo" : "Inactivo"
            }
            className="form-control text-center texto"
            placeholder="Automático"
            id="estadoOC"
          ></input>
        </Col>
      </Row>
      <Row className="mb-3">
        <Col sm={4} xs={12}>
          <label className="label forn-label">Tipo activo</label>
        </Col>
        <Col sm={8} xs={12}>
          <input
            type="text"
            disabled
            defaultValue={aplicativo ? aplicativo.tipo_activo : null}
            className="form-control text-center texto"
            placeholder="Tipo Activo"
            id="IdOpcion"
          ></input>
        </Col>
      </Row>

      <Row className="mb-3">
        <Col sm={4} xs={12}>
          <label className="label forn-label">Nombre aplicación</label>
        </Col>
        <Col sm={8} xs={12}>
          <input
            type="text"
            disabled
            defaultValue={aplicativo ? aplicativo.nombre : null}
            className="form-control text-center texto"
            placeholder="Nombre Aplicación"
            id="IdOpcion"
          ></input>
        </Col>
      </Row>
      <Row className="mb-3">
        <Col sm={4} xs={12}>
          <label className="label forn-label">Descripción</label>
        </Col>
        <Col sm={8} xs={12}>
          <textarea
            className="form-control text-center"
            placeholder="Descripción de la aplicación"
            defaultValue={aplicativo ? aplicativo.descripcion : null}
            rows="3"
            disabled
            id="Descripcion"
          ></textarea>
        </Col>
      </Row>

      <Row className="mb-3">
        <Col sm={4} xs={12}>
          <label className="label forn-label">Usuario Responsable TI</label>
        </Col>
        <Col sm={8} xs={12}>
          <input
            type="text"
            disabled
            defaultValue={aplicativo ? aplicativo.UsuarioResponsableTI : null}
            className="form-control text-center texto"
            placeholder="Usuario responsable TI"
            id="usrRespTI"
          ></input>
        </Col>
      </Row>

      <Row className="mb-3">
        <Col sm={4} xs={12}>
          <label className="label forn-label">
            Usuario Responsable Negocio
          </label>
        </Col>
        <Col sm={8} xs={12}>
          <input
            type="text"
            disabled
            defaultValue={
              aplicativo ? aplicativo.UsuarioResponsableNegocio : null
            }
            className="form-control text-center texto"
            placeholder="Usuario Responsable Negocio"
            id="usrRespNeg"
          ></input>
        </Col>
      </Row>

      <Row className="mb-3">
        <Col sm={4} xs={12}>
          <label className="label forn-label">Niver Criticidad Ciber</label>
        </Col>
        <Col sm={8} xs={12}>
          <input
            type="text"
            disabled
            defaultValue={aplicativo ? aplicativo.nivel_criticidad : null}
            className="form-control text-center texto"
            placeholder="Niver Criticidad Ciber"
            id="criticidad"
          ></input>
        </Col>
      </Row>

      <Row className="mb-3">
        <Col sm={6} xs={12}>
          {/* <label className="label forn-label">Niver Criticidad Ciber</label> */}
        </Col>
        <Col sm={3} xs={12}>
          <label className="form-label texto ml-2">BIA &nbsp;</label>
          <input
            disabled
            type="checkbox"
            value={null}
            checked={aplicativo && aplicativo.bia}
          />
        </Col>
        <Col sm={3} xs={12}>
          <label className="form-label texto ml-2">SOX &nbsp;</label>
          <input
            disabled
            type="checkbox"
            value={null}
            checked={aplicativo && aplicativo.sox}
          />
        </Col>
      </Row>

      <TableCustom
        data={opciones}
        nameCol={[
          "ID Opción",
          "Nombre opción técnica",
          "Código opción técnica",
          "Descripción técnica",
          "ID del proceso",
        ]}
        nameRow={["idproceso", "nombre", "compania", "ciclo"]}
        nameId={"idopcion"}
      />

      {/* Campos para todas las vistas de los maestros */}
      <Row className="mb-3">
        <Col sm={8} xs={1}></Col>
        <Col sm={3} xs={3}>
          <Link to="Aplicaciones">
            <button type="button" className="btn botonNegativo">
              Volver
            </button>
          </Link>
        </Col>
      </Row>
      <Row className="mb-5 mt-5">
        <br></br>
      </Row>
    </>
  );
}
