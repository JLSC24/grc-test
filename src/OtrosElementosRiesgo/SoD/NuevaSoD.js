import React, { useState, useEffect } from "react";
import { Row, Col, Form, Alert } from "react-bootstrap";
import { Link, useHistory } from "react-router-dom";
import Loader from "react-loader-spinner";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import Select from "react-select";

import AlertDismissible from "../../Components/AlertDismissible";
import Queries from "../../Components/QueriesAxios";
import TableCustom from "../../Components/TableCustom";
import ModalSelectTableCustom from "../../Components/ModalSelectTableCustom";
import Tooltip from "@mui/material/Tooltip";
//Variables para la tabla
const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: "#2c2a29",
    color: theme.palette.common.white,
  },
}))(TableCell);
const StyledTableRow = withStyles((theme) => ({
  root: {
    backgroundColor: "#f4f4f4",
  },
}))(TableRow);

const useStyles = makeStyles({
  root: {
    width: "100%",
  },
  container: {
    maxHeight: "60vh",
    minHeight: "50vh",
  },
});

export default function NuevaSoD(props) {
  const classes = useStyles();
  const [estado, setEstado] = useState(null);
  const [riesgo, setRiesgo] = useState(null);
  const [riesgoTemp, setRiesgoTemp] = useState(null);
  const [actualizar, setActualizar] = useState(false);
  const [opcionesC, setOpcionesC] = useState(null);
  const [listaRiesgos, setListaRiesgos] = useState(null);
  const [listaOpciones, setListaOpciones] = useState(null);
  const [opciones, setOpciones] = useState([]);

  //Variables para los modales
  const [showModRiesgos, setShowModRiesgos] = useState(false);
  const [dataModRiesgos, setDataModRiesgos] = useState(null);
  const [showModOpciones, setShowModOpciones] = useState(false);
  const [dataModOpciones, setDataModOpciones] = useState(null);

  const [selectVarMod, setSelectVarMod] = useState(null);

  const [estadoPost, setEstadoPost] = useState(null);
  const [habilitarBoton, setHabilitarBoton] = React.useState(true);
  let history = useHistory();

  useEffect(() => {
    const consulta_riesgo = async () => {
      setRiesgoTemp(riesgo);
      const riesgoTempQ = await Queries(
        null,
        "/riesgos/" + riesgo.idriesgo + "/",
        "GET"
      );
      setRiesgo(riesgoTempQ);
    };

    if (
      riesgo &&
      riesgo.idriesgo &&
      (!riesgoTemp || riesgoTemp.idriesgo !== riesgo.idriesgo)
    ) {
      consulta_riesgo();
    }

    if (opciones.length > 2) {
      window.alert("No puede seleccionar m??s de dos opciones");
    }
    setOpciones(opciones);
  }, [opciones, riesgo]);

  const querieRiesgos = async () => {
    let qRiesgo;
    if (!dataModRiesgos) {
      qRiesgo = await Queries(null, "/riesgos/", "GET");
    } else {
      qRiesgo = dataModRiesgos;
    }
    setDataModRiesgos(qRiesgo);

    let tempJsonRiesgo = {
      dataTable: qRiesgo,
      nameCol: [
        "Id Riesgo",
        "Nombre Riesgo",
        "Tipo Elemento Evaluado",
        "Elemento Evaluado",
      ],
      nameRow: [
        "idriesgo",
        "nombre_riesgo",
        "tipo_elemento_evaluado",
        "tipo_elemento_evaluado",
      ],
      nameId: "idriesgo",
      busqueda: true,
      nameBusqueda: ["idriesgo", "nombre_riesgo", "tipo_elemento_evaluado"],
    };

    setListaRiesgos(tempJsonRiesgo);
  };

  const querieOpciones = async () => {
    let qOpcionesC;
    if (!dataModOpciones) {
      qOpcionesC = await Queries(null, "/opciones_criticas/", "GET");
    } else {
      qOpcionesC = dataModOpciones;
    }

    setDataModOpciones(qOpcionesC);

    let tempJsonOpciones = {
      dataTable: qOpcionesC,
      nameCol: [
        "ID",
        "Aplicativo",
        "C??digo Opci??n T??cnica",
        "Descripci??n Actividad",
        "Nombre Actividad",
      ],
      nameRow: [
        "id_opcion_critica",
        "id_aplicacion",
        "codigo_opcion_tecninca",
        "descripcion_actividad",
        "nombre_actividad",
      ],
      nameId: "id_opcion_critica",
      busqueda: true,
      nameBusqueda: [
        "id_opcion_critica",
        "id_aplicacion",
        "descripcion_actividad",
        "nombre_actividad",
      ],
    };

    setListaOpciones(tempJsonOpciones);
  };

  const sendData = async (e) => {
    e.preventDefault();

    setHabilitarBoton(true);

    opciones.map((opc) => (opc["estado"] = 1));

    if (opciones.length > 0 && opciones.length <= 2) {
      if (
        opciones.filter((opc) => opc.responsabilidad).length === opciones.length
      ) {
        if (opciones[0].responsabilidad !== opciones[1].responsabilidad) {
          let opcionesFinal = opciones.map(
            ({
              id_opcion_critica,
              responsabilidad,
              cargo_q_ejecuta,
              estado,
            }) => ({
              id_opcion_critica,
              responsabilidad,
              cargo_q_ejecuta,
              estado,
            })
          );
          const data = {
            id_riesgo: riesgo ? riesgo.idriesgo : null,
            estado: "Creada",
            opciones: opcionesFinal,
          };
          try {
            const queriePostSoD = await Queries(data, "/sod/", "POST");
            setEstadoPost(queriePostSoD);
          } catch (error) {
            setEstadoPost(error);
          }
        } else {
          setEstadoPost({
            status: "custom",
            name: "Atenci??n",
            message:
              "Debe seleccionar reponsabilidad diferente en cada opci??n para continuar",
          });
        }
      } else {
        setEstadoPost({
          status: "custom",
          name: "Atenci??n",
          message:
            "Debe seleccionar reponsabilidad y cargo que ejecuta la opci??n para continuar",
        });
      }
    } else {
      setEstadoPost({
        status: "custom",
        name: "Error",
        message: "Debe seleccionar m??nimo una opci??n y m??ximo dos",
      });
    }
  };
  return (
    <>
      <AlertDismissible data={estadoPost} />
      <ModalSelectTableCustom
        showMod={
          selectVarMod === "riesgo"
            ? showModRiesgos
            : selectVarMod === "opciones"
            ? showModOpciones
            : null
        }
        setShowMod={
          selectVarMod === "riesgo"
            ? setShowModRiesgos
            : selectVarMod === "opciones"
            ? setShowModOpciones
            : null
        }
        dataTable={
          selectVarMod === "riesgo"
            ? listaRiesgos
            : selectVarMod === "opciones"
            ? listaOpciones
            : null
        }
        data={
          selectVarMod === "riesgo"
            ? riesgo
            : selectVarMod === "opciones"
            ? opciones
            : null
        }
        setData={
          selectVarMod === "riesgo"
            ? setRiesgo
            : selectVarMod === "opciones"
            ? setOpciones
            : null
        }
        multi={
          selectVarMod === "riesgo"
            ? false
            : selectVarMod === "opciones"
            ? true
            : null
        }
      />
      <Row className="mb-3">
        <Col md={12}>
          <h1 className="titulo">Creaci??n de una nueva regla SoD</h1>
        </Col>
      </Row>
      <Form id="formData" onSubmit={(e) => sendData(e)}>
        <hr></hr>
        <Row className="mb-3">
          <Col sm={4} xs={12}>
            <label className="label forn-label">
              Id Regla SoD (Automatico)
            </label>
          </Col>
          <Col sm={3} xs={12}>
            <input
              type="text"
              disabled
              className="form-control text-center texto"
              placeholder="ID Autom??tico"
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
              className="form-control text-center texto"
              placeholder="Autom??tico"
              id="estadoOC"
            ></input>
          </Col>
        </Row>
        <Row className="mb-3">
          <Col sm={4} xs={12}>
            <label className="forn-label label">Nombre Riesgo</label>
          </Col>
          <Col sm={6} xs={10}>
            <input
              type="text"
              disabled
              defaultValue={
                riesgo && riesgo.nombre_riesgo ? riesgo.nombre_riesgo : null
              }
              className="form-control text-center texto"
              placeholder="Seleccione riesgo para cargar la informaci??n"
              id="UsrFuncResp"
            ></input>
          </Col>
          <Col sm={2} xs={10}>
            <button
              type="button"
              className="btn botonPositivo"
              onClick={async () => {
                await querieRiesgos();
                setSelectVarMod("riesgo");
                setShowModRiesgos(true);
              }}
            >
              Seleccionar
            </button>
          </Col>
        </Row>
        <Row className="mb-3">
          <Col sm={4} xs={12}>
            <label className="forn-label label">Categor??a del riesgo</label>
          </Col>
          <Col sm={8} xs={10}>
            <input
              type="text"
              disabled
              defaultValue={
                riesgo && riesgo.Categoria_riesgo
                  ? riesgo.Categoria_riesgo
                  : null
              }
              className="form-control text-center texto"
              placeholder="Categor??a del riesgo"
              id="categoriaRiesgo"
            ></input>
          </Col>
        </Row>
        <Row className="mb-3">
          <Col sm={4} xs={12}>
            <label className="forn-label label">
              Elemento principal del riesgo
            </label>
          </Col>
          <Col sm={4} xs={10}>
            <input
              type="text"
              disabled
              defaultValue={
                riesgo && riesgo.tipo_elemento_evaluado
                  ? riesgo.tipo_elemento_evaluado
                  : null
              }
              className="form-control text-center texto"
              placeholder="Tipo elemento principal"
              id="elePrin"
            ></input>
          </Col>
          <Col sm={4} xs={10}>
            <input
              type="text"
              disabled
              defaultValue={
                riesgo && riesgo.elemento_ppal_evaluado
                  ? riesgo.elemento_ppal_evaluado
                  : null
              }
              className="form-control text-center texto"
              placeholder="Nombre elemento principal"
              id="nombElePrin"
            ></input>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col sm={4} xs={12}>
            <label className="forn-label label">Opciones</label>
          </Col>
          <Col sm={6} xs={12}></Col>
          <Col sm={2} xs={10}>
            <Tooltip title="Debe seleccionar m??nimo una opci??n" arrow>
              <button
                type="button"
                className="btn botonPositivo"
                onClick={async () => {
                  await querieOpciones();
                  setSelectVarMod("opciones");
                  setShowModOpciones(true);
                }}
              >
                A??adir
              </button>
            </Tooltip>
          </Col>
        </Row>

        {/* <TableCustom
          data={opciones}
          nameCol={[
            "ID",
            "Aplicativo",
            "C??digo Opci??n T??cnica",
            "Descripci??n Actividad",
            "Nombre Actividad",
            "Responsabilidad",
            "Cargo que ejecuta la opci??n",
          ]}
          nameRow={[
            "id_opcion_critica",
            "id_aplicacion",
            "codigo_opcion_tecninca",
            "descripcion_actividad",
            "nombre_actividad",
          ]}
          nameId={"id_opcion_critica"}
          style={{ minHeight: "10vh" }}
        /> */}

        <Paper className={classes.root}>
          <TableContainer component={Paper} className={classes.container}>
            <Table className={"text"} stickyHeader aria-label="sticky table">
              {/* Inicio de encabezado */}
              <TableHead className="titulo">
                <TableRow>
                  <StyledTableCell padding="checkbox"></StyledTableCell>
                  <StyledTableCell align="left">ID</StyledTableCell>
                  <StyledTableCell align="left">Aplicativo</StyledTableCell>
                  <StyledTableCell align="left">
                    C??digo Opci??n T??cnica
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    Descripci??n Actividad
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    Nombre Actividad
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    Responsabilidad
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    Cargo que ejecuta la opci??n
                  </StyledTableCell>
                </TableRow>
              </TableHead>
              {/* Fin de encabezado */}
              {/* Inicio de cuerpo de la tabla */}
              <TableBody>
                {opciones.map((row, index) => {
                  return (
                    <StyledTableRow
                      key={row.id_opcion_critica}
                      hover
                      role="checkbox"
                      tabIndex={-1}
                    >
                      <StyledTableCell
                        component="th"
                        scope="row"
                      ></StyledTableCell>
                      <StyledTableCell component="th" scope="row">
                        {row.id_opcion_critica}
                      </StyledTableCell>
                      <StyledTableCell component="th" scope="row">
                        {row.id_aplicacion}
                      </StyledTableCell>
                      <StyledTableCell component="th" scope="row">
                        {row.codigo_opcion_tecninca}
                      </StyledTableCell>
                      <StyledTableCell component="th" scope="row">
                        {row.descripcion_actividad}
                      </StyledTableCell>
                      <StyledTableCell component="th" scope="row">
                        {row.nombre_actividad}
                      </StyledTableCell>
                      <StyledTableCell component="th" scope="row">
                        <Select
                          className="texto"
                          onChange={(e) => (row["responsabilidad"] = e.value)}
                          options={[
                            { label: "A-Registro", value: "A-Registro" },
                            {
                              label: "B-Autorizaci??n",
                              value: "B-Autorizaci??n",
                            },
                            {
                              label: "C-Custodia de datos",
                              value: "C-Custodia de datos",
                            },
                            {
                              label: "D-Verificaci??n",
                              value: "D-Verificaci??n",
                            },
                          ]}
                        />
                      </StyledTableCell>
                      <StyledTableCell component="th" scope="row">
                        <Select
                          className="texto"
                          onChange={(e) => (row["cargo_q_ejecuta"] = e.value)}
                          options={[
                            {
                              label:
                                "Matriz: Cargo + rol (Analista III de cr??dito)",
                              value:
                                "Matriz: Cargo + rol (Analista III de cr??dito)",
                            },
                            {
                              label:
                                "SOX: Carges est??ndar (Vp, Gerente, director)",
                              value:
                                "SOX: Carges est??ndar (Vp, Gerente, director)",
                            },
                          ]}
                        />
                      </StyledTableCell>
                    </StyledTableRow>
                  );
                })}
              </TableBody>
              {/* Fin de cuerpo de la tabla */}
            </Table>
          </TableContainer>
        </Paper>

        <p></p>

        {/* Campos para todas las vistas de los maestros */}
        <Row className="mb-3">
          <Col sm={4} xs={0}></Col>
          <Col>
            <div className="form-text">* Campos obligatorios</div>
          </Col>
        </Row>
        <Row className="mb-3">
          <Col sm={2} xs={1}></Col>
          {habilitarBoton ? (
            <>
              <Col sm={3} xs={3} />
              <Col sm={3} xs={3}>
                {props.permisos.crear ? (
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
            <Link to="Procesos">
              <button type="button" className="btn botonNegativo">
                Descartar
              </button>
            </Link>
          </Col>
        </Row>
        <Row className="mb-5 mt-5">
          <br></br>
        </Row>
      </Form>
    </>
  );
}
