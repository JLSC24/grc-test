import React, { useState, useEffect, useContext } from "react";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import { Row, Col, Form, Alert } from "react-bootstrap";
import { Link, useHistory } from "react-router-dom";
import Loader from "react-loader-spinner";
import { UsuarioContext } from "../Context/UsuarioContext";
import makeAnimated from "react-select/animated";
import ModCargaArchivo from "../AdminAplicativo/ModCargaArchivo";
import AADService from "../auth/authFunctions";
import ModalPA from "./ModalPA";

const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: "#2c2a29",
    color: theme.palette.common.white,
  },
}))(TableCell);
const StyledTableRow = withStyles((theme) => ({
  root: {
    backgroundColor: "#f4f4f4",
    heigth: "10px",
  },
}))(TableRow);

const useStyles = makeStyles({
  root: {
    width: "100%",
  },
  container: {
    /* maxHeight: "60vh", */
    minHeight: "20vh",
  },

  MuiTableRow: {
    root: {
      //This can be referred from Material UI API documentation.
      heigth: "10px",
    },
  },
});

function AlertDismissibleExample(data) {
  let temp = [];
  let errors = "";
  let temp2 = [];
  if (data.alerta.data !== null && data.alerta.data !== undefined) {
    temp = JSON.stringify(data.alerta.data).split('"');
    temp.map((dat, index) => {
      if (index % 2 !== 0) {
        temp2.push(dat);
      }
    });
    for (let index = 0; index < temp2.length; index += 2) {
      errors = errors + temp2[index] + ": " + temp2[index + 1] + "\n";
    }
  }
  switch (data.alerta.id) {
    case 1:
      return (
        <Alert className="alerta" variant="warning">
          Alerta
        </Alert>
      );
      break;
    case 2:
      return <Alert variant="success">Guardó exitosamente</Alert>;
      break;
    case 3:
      return <Alert variant="danger"></Alert>;
      break;
    case 4:
      return <Alert variant="warning">{errors}</Alert>;
      break;
    case 5:
      return <Alert variant="danger">Error en el servidor</Alert>;
      break;
    case 6:
      return (
        <Alert variant="warning">
          Ya existe una evaluación para el activo seleccionado
        </Alert>
      );
      break;
    default:
      return <p></p>;
      break;
  }
}
export default function TomarDecision(props) {
  const serviceAAD = new AADService();
  const classes = useStyles();

  const [dataSeguimiento, setDataSeguimiento] = React.useState([]);
  const [showPA, setShowPA] = React.useState(false);
  const [dataPA, setDataPA] = React.useState([]);
  const [dataAllPA, setDataAllPA] = React.useState([]);
  const [dataPAQuitar, setDataPAQuitar] = React.useState([]);
  const [dataPANuevo, setDataPANuevo] = React.useState([]);
  const [dataPAActualizar, setDataPAActualizar] = React.useState([]);
  const [usuario, setUsuario] = React.useState(null);
  const [decididoPor, setDecididoPor] = React.useState(null);
  const [seguimientoDecision, setSeguimientoDecision] = React.useState([]);
  const [archivo, setArchivo] = useState(null);
  const [adjunto, setAdjunto] = useState(null);
  const [riesgoLocal, setRiesgoLocal] = useState(null);

  const [dataDecision, setDataDecision] = React.useState(null);

  const { dataUsuario } = React.useContext(UsuarioContext);

  const [estadoPost, setEstadoPost] = useState({
    alerta: { id: 0, data: null },
  });
  const [habilitarBoton, setHabilitarBoton] = React.useState(true);
  let history = useHistory();
  useEffect(() => {
    let idDecision;
    const GetDecision = async () => {
      const result = await fetch(
        process.env.REACT_APP_API_URL + "/decisiones/" +
          localStorage.getItem("idDecision") +
          "/",
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            Authorization: "Bearer " + serviceAAD.getToken(),
          },
        }
      );
      let data = await result.json();
      setDataDecision(data[0]);
      setRiesgoLocal(data[0].categoria_local);
      idDecision = data[0].iddecision;
    };

    const GetAdjuntos = async () => {
      await GetDecision();
      const result = await fetch(
        process.env.REACT_APP_API_URL + "/adjuntos/decision_de_riesgo/" + idDecision + "/",
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            Authorization: "Bearer" + serviceAAD.getToken(),
          },
        }
      );
      let data = await result.json();
      setAdjunto(data);
    };
    const GetPlanes = async () => {
      const result = await fetch(
        process.env.REACT_APP_API_URL + "/EditarDecisiones_planAccion/" +
          localStorage.getItem("idDecision") +
          "/",
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            Authorization: "Bearer " + serviceAAD.getToken(),
          },
        }
      );
      let data = await result.json();
      let tempPAActivos = [];
      if (data) {
        data.map((pa) => {
          if (pa.estadoasociacion === 1) {
            tempPAActivos.push(pa);
          }
        });
      }
      setDataPA(tempPAActivos);
      setDataAllPA(data);
    };
    const GetUser = async () => {
      const result = await fetch(
        process.env.REACT_APP_API_URL + "/usuario/" + serviceAAD.getUser().userName + "/",
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            Authorization: "Bearer " + serviceAAD.getToken(),
          },
        }
      );
      let data = await result.json();
      setUsuario(data);
    };
    const historial = async () => {
      const result = await fetch(
        process.env.REACT_APP_API_URL + "/seguimientoDecision/" +
          localStorage.getItem("idDecision") +
          "/",
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            Authorization: "Bearer " + serviceAAD.getToken(),
          },
        }
      );
      let data = await result.json();
      data.map((log) => {
        log.seguimiento_decisiones = JSON.parse(log.seguimiento_decisiones);
      });

      setSeguimientoDecision(data);
    };
    historial();
    GetAdjuntos();
    GetUser();
    GetPlanes();
  }, []);

  const handleFileChange = (e) => {
    setArchivo(e.target.files[0]);
  };

  const sendData = (e) => {
    e.preventDefault();
    setHabilitarBoton(false);

    async function limpiar(state) {
      setTimeout(() => {
        setHabilitarBoton(true);
        setEstadoPost({ id: 0, data: null });
      }, 3000);
    }

    const timeElapsed = Date.now();
    const today = new Date(timeElapsed);
    let data = dataDecision;
    data.decision = document.getElementById("Decision").value;
    data.tomadordecision = usuario.nombreposicion;
    data.idusuario_decision = usuario.idposicion;
    data.idusuariomodificacion = usuario.idposicion;
    data.idusuariocreacion = dataDecision.idresponsabledecision;
    data.fechamodificacion = today.toISOString();
    data.observaciones = document.getElementById("observaciones").value;
    data.decidido_por = decididoPor;
    let planesDecision = [];

    planesDecision = dataPANuevo.concat(dataPAActualizar.concat(dataPAQuitar));

    let jsonSeguimiento = {
      nivel_riesgo_residual: dataDecision.nivel_riesgo_residual,
      nivel_riesgo_inherente: dataDecision.nivel_riesgo_inherente,
      exposicion_residual: dataDecision.exposicion_residual,
      usuario_decision: usuario.email,
      observaciones: document.getElementById("observaciones").value,
      nombre_posicion: usuario.nombreposicion,
      decidido_por: decididoPor,
    };

    var dataSeguimiento = {
      iddecision: dataDecision.iddecision,
      seguimiento_decisiones: JSON.stringify(jsonSeguimiento),
      fecha_decision: today.toISOString(),
      decision: document.getElementById("Decision").value,
    };

    if (dataDecision && usuario) {
      if (
        dataDecision.email.toLowerCase() === usuario.email.toLowerCase() ||
        props.idrol.includes(2)
      ) {
        fetch(
          process.env.REACT_APP_API_URL + "/EditarDecisiones/" +
            dataDecision.iddecision +
            "/",
          {
            method: "PUT",
            body: JSON.stringify(data),
            headers: {
              "Content-type": "application/json; charset=UTF-8",
              Authorization: "Bearer " + serviceAAD.getToken(),
            },
          }
        )
          .then((data) =>
            data.json().then((response) => {
              if (data.status >= 200 && data.status < 300) {
                setEstadoPost({ id: 2, data: data });
                limpiar();
                fetch(
                  process.env.REACT_APP_API_URL + "/seguimientoDecision/" +
                    dataDecision.iddecision +
                    "/",
                  {
                    method: "POST",
                    body: JSON.stringify(dataSeguimiento),
                    headers: {
                      "Content-type": "application/json; charset=UTF-8",
                      Authorization: "Bearer " + serviceAAD.getToken(),
                    },
                  }
                )
                  .then((data) =>
                    data.json().then((response) => {
                      if (data.status >= 200 && data.status < 300) {
                        setEstadoPost({ id: 2, data: "Seguimiento agregado" });
                        limpiar();
                      } else if (data.status >= 500) {
                        setEstadoPost({ id: 5, data: response });
                        limpiar();
                      } else if (data.status >= 400 && data.status < 500) {
                        setEstadoPost({ id: 4, data: response });
                        limpiar();
                      }
                    })
                  )
                  .catch(function (err) {
                    console.error(err);
                    setHabilitarBoton(true);
                  });
              } else if (data.status >= 500) {
                setEstadoPost({ id: 5, data: response });
                limpiar();
              } else if (data.status >= 400 && data.status < 500) {
                setEstadoPost({ id: 4, data: response });
                limpiar();
              }
            })
          )
          .catch(function (err) {
            console.error(err);
            setHabilitarBoton(true);
          });
      }
    }

    fetch(
      process.env.REACT_APP_API_URL + "/EditarDecisiones_planAccion/" +
        dataDecision.iddecision +
        "/",
      {
        method: "PUT",
        body: JSON.stringify(planesDecision),
        headers: {
          "Content-type": "application/json; charset=UTF-8",
          Authorization: "Bearer " + serviceAAD.getToken(),
        },
      }
    )
      .then((data) =>
        data.json().then((response) => {
          if (data.status >= 200 && data.status < 300) {
            setEstadoPost({ id: 2, data: data });
            limpiar();
            //window.location.reload();
          } else if (data.status >= 500) {
            setEstadoPost({ id: 5, data: response });
            limpiar();
          } else if (data.status >= 400 && data.status < 500) {
            setEstadoPost({ id: 4, data: response });
            limpiar();
          }
        })
      )
      .catch(function (err) {
        console.error(err);
        setHabilitarBoton(true);
      });
    let infoArchivo = {
      metodo: "POST",
      id_adjunto: null,
    };
    if (adjunto) {
      infoArchivo.metodo = "PUT";
      infoArchivo.id_adjunto = adjunto[0].id_adjunto;
    }
    let response_file = ModCargaArchivo(
      "decision_de_riesgo",
      dataDecision.iddecision,
      null,
      archivo.name,
      archivo,
      infoArchivo.metodo,
      infoArchivo.id_adjunto
    );
    console.warn(response_file);
  };

  return (
    <>
      <AlertDismissibleExample alerta={estadoPost} />
      <ModalPA
        showPA={showPA}
        setShowPA={setShowPA}
        dataAllPA={dataAllPA}
        dataPA={dataPA}
        setDataPA={setDataPA}
        dataPAQuitar={dataPAQuitar}
        setDataPAQuitar={setDataPAQuitar}
        setDataPAActualizar={setDataPAActualizar}
        setDataPANuevo={setDataPANuevo}
        decision={
          dataDecision && dataDecision.iddecision
            ? dataDecision.iddecision
            : null
        }
      ></ModalPA>
      <Row className="mb-3">
        <Col md={12}>
          <h1 className="titulo">Tomar Decisión</h1>
        </Col>
      </Row>
      <Form id="formData" onSubmit={(e) => sendData(e)}>
        <Row className="mb-3">
          <Col sm={2} xs={12}>
            <label className="label forn-label">ID Decisión</label>
          </Col>
          <Col sm={2} xs={12}>
            <input
              type="text"
              disabled
              className="form-control text-center texto"
              placeholder="ID Automático"
              id="IDdecision"
              defaultValue={
                dataDecision && dataDecision.iddecision
                  ? dataDecision.iddecision
                  : null
              }
            ></input>
          </Col>
          <Col sm={2} xs={12}>
            <label className="form-label label">Fecha Decisión</label>
          </Col>
          <Col sm={6} xs={12}>
            <input
              type="text"
              className="form-control text-center texto"
              placeholder="Fecha de la Decisión"
              disabled
              id="FechaDecision"
              defaultValue={
                dataDecision && dataDecision.fechacreacion
                  ? dataDecision.fechacreacion
                  : null
              }
            ></input>
            <Form.Control.Feedback type="invalid">
              Por favor introduzca un nombre.
            </Form.Control.Feedback>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col sm={2} xs={12}>
            <label className="form-label label">ID Riesgo</label>
          </Col>
          <Col sm={2} xs={10}>
            <input
              type="text"
              className="form-control text-center texto"
              placeholder="ID Riesgo"
              disabled
              id="IDriesgo"
              defaultValue={
                dataDecision && dataDecision.idriesgo
                  ? dataDecision.idriesgo
                  : null
              }
            ></input>
          </Col>
          <Col sm={2} xs={12}>
            <label className="form-label label">Riesgo Residual (MM)</label>
          </Col>
          <Col sm={2} xs={10}>
            <input
              type="text"
              className="form-control text-center texto"
              placeholder="Riesgo Residual (MM)"
              disabled
              id="RiesgoResidual"
              defaultValue={
                dataDecision && dataDecision.exposicion_residual
                  ? parseFloat(
                      dataDecision.exposicion_residual
                    ).toLocaleString()
                  : null
              }
            ></input>
          </Col>
          <Col sm={2} xs={12}>
            <label className="form-label label">Nivel Riesgo Residual</label>
          </Col>
          <Col sm={2} xs={10}>
            <input
              type="text"
              className="form-control text-center texto"
              placeholder="Nivel Riesgo"
              disabled
              id="NivelRiesgo"
              defaultValue={
                dataDecision && dataDecision.nivel_riesgo_residual
                  ? dataDecision.nivel_riesgo_residual
                  : null
              }
            ></input>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col sm={2} xs={12}>
            <label className="label forn-label">Riesgo</label>
          </Col>
          <Col sm={10} xs={12}>
            <input
              type="text"
              disabled
              className="form-control text-center texto"
              placeholder="Riesgo"
              id="NombreRiesgo"
              defaultValue={
                dataDecision && dataDecision.nombre_riesgo
                  ? dataDecision.nombre_riesgo
                  : null
              }
            ></input>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col sm={2} xs={12}>
            <label className="label forn-label">Categoría</label>
          </Col>
          <Col sm={10} xs={12}>
            <input
              type="text"
              disabled
              className="form-control text-center texto"
              placeholder="Categoría"
              id="Categoria"
              defaultValue={
                dataDecision && dataDecision.categoria_corporativa
                  ? dataDecision.categoria_corporativa
                  : null
              }
            ></input>
          </Col>
        </Row>
        <Row className="mb-3 mt-4">
          <Col sm={2} xs={12}>
            <label className="form-label label">Categoria Local</label>
          </Col>
          <Col sm={10} xs={12}>
            <input
              type="text"
              disabled
              className="form-control text-center texto"
              placeholder="Categoría"
              id="Categoria"
              defaultValue={
                dataDecision && dataDecision.categoria_local
                  ? dataDecision.categoria_local
                  : null
              }
            ></input>
          </Col>
        </Row>
        <Row className="mb-3">
          <Col sm={2} xs={12}>
            <label className="label forn-label">Subcategoría</label>
          </Col>
          <Col sm={10} xs={12}>
            <input
              type="text"
              disabled
              className="form-control text-center texto"
              placeholder="Subcategoría"
              id="Subcategoria"
              defaultValue={
                dataDecision && dataDecision.sub_categoria_corporativa
                  ? dataDecision.sub_categoria_corporativa
                  : null
              }
            ></input>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col sm={2} xs={12}>
            <label className="label forn-label">Descripción</label>
          </Col>
          <Col sm={10} xs={12}>
            <textarea
              className="form-control text-center"
              placeholder="Descripción del Riesgo"
              rows="3"
              disabled
              id="Descripcion"
              defaultValue={
                dataDecision && dataDecision.descripcionriesgo
                  ? dataDecision.descripcionriesgo
                  : null
              }
            ></textarea>
          </Col>
        </Row>
        <Row className="mb-3">
          <Col sm={2} xs={12}>
            <label className="label forn-label">Responsable</label>
          </Col>
          <Col sm={10} xs={12}>
            <input
              type="text"
              disabled
              className="form-control text-center texto"
              placeholder="Riesgo"
              id="NombreRiesgo"
              defaultValue={
                dataDecision && dataDecision.nombreresponsable
                  ? dataDecision.nombreresponsable
                  : null
              }
            ></input>
          </Col>
        </Row>
        {/* {console.log(dataDecision.nombre_decidido_por)} */}
        {dataDecision && dataDecision.nombre_decidido_por ? (
          <Row className="mb-3">
            <Col sm={2} xs={12}>
              <label className="label forn-label">Decidido por</label>
            </Col>
            <Col sm={10} xs={12}>
              <input
                type="text"
                disabled
                className="form-control text-center texto"
                placeholder="Riesgo"
                id="NombreRiesgo"
                defaultValue={
                  dataDecision && dataDecision.nombre_decidido_por
                    ? dataDecision.nombre_decidido_por
                    : null
                }
              ></input>
            </Col>
          </Row>
        ) : null}
        <Row className="mb-3">
          <Col sm={2} xs={12}>
            <label className="form-label label">Decisión</label>
          </Col>
          <Col sm={10} xs={10}>
            <select
              className="form-control texto"
              id="Decision"
              required
              onChange={() => setDecididoPor(usuario.email.toLowerCase())}
              disabled={
                dataDecision && usuario
                  ? dataDecision.email.toLowerCase() ===
                      usuario.email.toLowerCase() || props.idrol.includes(2)
                    ? false
                    : true
                  : null
              }
            >
              <option
                value={
                  dataDecision && dataDecision.decision
                    ? dataDecision.decision
                    : ""
                }
              >
                {dataDecision && dataDecision.decision
                  ? dataDecision.decision
                  : "Seleccione Decisión"}
              </option>
              <option value="Aceptar">Aceptar</option>
              <option value="Evitar">Evitar</option>
              <option value="Mitigar">Mitigar</option>
            </select>
          </Col>
        </Row>

        <Row className="mb-4">
          <Col sm={2} xs={12}>
            <label className="forn-label label">Observaciones</label>
          </Col>

          <Col sm={10} xs={12}>
            <textarea
              className="form-control text-center"
              placeholder="Observaciones de la decisión"
              rows="3"
              id="observaciones"
              defaultValue={
                dataDecision && dataDecision.observaciones
                  ? dataDecision.observaciones
                  : null
              }
              disabled={
                dataDecision && usuario
                  ? dataDecision.email.toLowerCase() ===
                      usuario.email.toLowerCase() || props.idrol.includes(2)
                    ? false
                    : true
                  : null
              }
            />
          </Col>
        </Row>

        <Row className="mb-3">
          <Col sm={4} xs={12}>
            <label className="form-label label">Adjunto</label>
          </Col>
          <Col sm={3} xs={12}>
            <input
              type="file"
              name="files"
              accept="*"
              onChange={(e) => handleFileChange(e)}
              disabled={
                dataDecision && usuario
                  ? dataDecision.email.toLowerCase() ===
                      usuario.email.toLowerCase() || props.idrol.includes(2)
                    ? false
                    : true
                  : null
              }
            ></input>
          </Col>

          <Col sm={5} xs={12}>
            <a
              href={adjunto && adjunto[0].url ? adjunto[0].url : null}
              class={
                dataDecision && usuario
                  ? dataDecision.email.toLowerCase() ===
                      usuario.email.toLowerCase() ||
                    dataDecision.emailusuariocreacion.toLowerCase() ===
                      usuario.email.toLowerCase() ||
                    dataDecision.emailusuariomodificacion.toLowerCase() ===
                      usuario.email.toLowerCase() ||
                    props.idrol.includes(2)
                    ? false
                    : "disabled_link"
                  : null
              }
            >
              {adjunto && adjunto[0].nombre_archivo
                ? adjunto[0].nombre_archivo
                : null}
            </a>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col sm={4} xs={1}></Col>
          {habilitarBoton ? (
            <>
              <Col sm={3} xs={3}>
                {props.permisos.editar ? (
                  <button type="submit" className="btn botonPositivo" id="send">
                    Guardar
                  </button>
                ) : null}
              </Col>
            </>
          ) : (
            <Col className="col-auto" sm={3} xs={3}>
              <Loader
                type="Oval"
                color="#FFBF00"
                height={30}
                width={30}
                style={{
                  textAlign: "center",
                  position: "static",
                }}
              />
            </Col>
          )}

          <Col sm={3} xs={3}>
            <Link to="Geografias">
              <button type="button" className="btn botonNegativo">
                Descartar
              </button>
            </Link>
          </Col>
        </Row>
        <Row className="mb-5 mt-5">
          <br></br>
        </Row>

        <Row className="mb-3">
          <Col sm={8} xs={2}>
            <label className="form-label label">
              Planes de acción asociados a la decisión
            </label>
          </Col>
          <Col sm={2} xs={4}></Col>
          <Col sm={2} xs={4}>
            {!props.idrol.includes(3) ? (
              <button
                type="button"
                className="btn botonNegativo3"
                onClick={() => setShowPA(true)}
              >
                Modificar
              </button>
            ) : null}
          </Col>
        </Row>

        <Paper className={classes.root}>
          <TableContainer component={Paper} className={classes.container}>
            <Table className={"text"} stickyHeader aria-label="sticky table">
              {/* Inicio de encabezado */}
              <TableHead className="titulo">
                <TableRow>
                  <StyledTableCell padding="checkbox"></StyledTableCell>
                  <StyledTableCell>ID Plan acción</StyledTableCell>
                  <StyledTableCell align="left">
                    Nombre Plan acción
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    Porcentaje Plan acción
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    Informacion Plan acción
                  </StyledTableCell>
                  <StyledTableCell align="left">Responsable</StyledTableCell>
                </TableRow>
              </TableHead>
              {/* Fin de encabezado */}
              {/* Inicio de cuerpo de la tabla */}
              <TableBody>
                {dataPA.map((row, index) => {
                  return (
                    <StyledTableRow
                      key={
                        row.idplanaccion
                          ? row.idplanaccion
                          : row.iddecision_planaccion
                      }
                      hover
                      role="checkbox"
                      tabIndex={-1}
                    >
                      <StyledTableCell
                        component="th"
                        scope="row"
                      ></StyledTableCell>
                      <StyledTableCell component="th" scope="row">
                        {row.idplanaccion
                          ? row.idplanaccion
                          : row.iddecision_planaccion
                          ? row.iddecision_planaccion
                          : null}
                      </StyledTableCell>
                      <StyledTableCell align="left">
                        {row.nombre ? row.nombre : null}
                      </StyledTableCell>
                      <StyledTableCell align="left">
                        {row.porcentajeavance
                          ? parseFloat(row.porcentajeavance) * 100
                          : null}
                      </StyledTableCell>

                      <StyledTableCell align="left">
                        {row.descripcionpa
                          ? row.descripcionpa
                          : row.descripcion
                          ? row.descripcion
                          : null}
                      </StyledTableCell>
                      <StyledTableCell align="left">
                        {row.responsablepa ? row.responsablepa : null}
                      </StyledTableCell>
                    </StyledTableRow>
                  );
                })}
              </TableBody>
              {/* Fin de cuerpo de la tabla */}
            </Table>
          </TableContainer>
        </Paper>

        <Row className="mb-3 mt-3">
          <Col sm={4} xs={2}>
            <label className="form-label label">
              Seguimiento de la Decisión
            </label>
          </Col>
        </Row>

        <Paper className={classes.root}>
          <TableContainer component={Paper} className={classes.container}>
            <Table className={"text"} stickyHeader aria-label="sticky table">
              {/* Inicio de encabezado */}
              <TableHead className="titulo">
                <TableRow>
                  <StyledTableCell padding="checkbox"></StyledTableCell>
                  <StyledTableCell>Fecha Decisión</StyledTableCell>
                  <StyledTableCell align="left">
                    Riesgo Residual
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    Nivel del Riesgo
                  </StyledTableCell>
                  <StyledTableCell align="left">Decisión</StyledTableCell>
                  <StyledTableCell align="left">Responsable</StyledTableCell>
                  <StyledTableCell align="left">Posición</StyledTableCell>
                  <StyledTableCell align="left">Decidido Por</StyledTableCell>
                  <StyledTableCell align="left">Observaciones</StyledTableCell>
                </TableRow>
              </TableHead>
              {/* Fin de encabezado */}
              {/* Inicio de cuerpo de la tabla */}
              <TableBody>
                {seguimientoDecision.map((row, index) => {
                  return (
                    <StyledTableRow
                      key={row.iddecision}
                      hover
                      role="checkbox"
                      tabIndex={-1}
                    >
                      <StyledTableCell component="th" scope="row">
                        {/* <Checkbox checked={isItemSelected} /> */}
                      </StyledTableCell>
                      <StyledTableCell component="th" scope="row">
                        {row.fecha_decision ? row.fecha_decision : null}
                      </StyledTableCell>
                      <StyledTableCell align="left">
                        {row.seguimiento_decisiones.exposicion_residual
                          ? parseFloat(
                              row.seguimiento_decisiones.exposicion_residual
                            ).toLocaleString()
                          : null}
                      </StyledTableCell>
                      <StyledTableCell align="left">
                        {row.seguimiento_decisiones.nivel_riesgo_residual
                          ? row.seguimiento_decisiones.nivel_riesgo_residual
                          : null}
                      </StyledTableCell>
                      <StyledTableCell align="left">
                        {row.decision ? row.decision : null}
                      </StyledTableCell>
                      <StyledTableCell align="left">
                        {row.seguimiento_decisiones.usuario_decision
                          ? row.seguimiento_decisiones.usuario_decision
                          : null}
                      </StyledTableCell>
                      <StyledTableCell align="left">
                        {row.seguimiento_decisiones.nombre_posicion
                          ? row.seguimiento_decisiones.nombre_posicion
                          : null}
                      </StyledTableCell>
                      <StyledTableCell align="left">
                        {row.seguimiento_decisiones.decidido_por
                          ? row.seguimiento_decisiones.decidido_por
                          : null}
                      </StyledTableCell>
                      <StyledTableCell align="left">
                        {row.seguimiento_decisiones.observaciones
                          ? row.seguimiento_decisiones.observaciones
                          : null}
                      </StyledTableCell>
                    </StyledTableRow>
                  );
                })}
              </TableBody>
              {/* Fin de cuerpo de la tabla */}
            </Table>
          </TableContainer>
        </Paper>
      </Form>
    </>
  );
}
