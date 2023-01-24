import React, { useState, useEffect } from "react";
import { Row, Col, Form } from "react-bootstrap";
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
import ModalInactivar from "../../Components/ModalInactivar";

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

export default function EditarSoD(props) {
  const classes = useStyles();
  const [dataSoD, setDataSoD] = useState(null);

  const [estado, setEstado] = useState(null);
  const [riesgo, setRiesgo] = useState(null);
  const [opcionesC, setOpcionesC] = useState(null);
  const [listaRiesgos, setListaRiesgos] = useState(null);
  const [listaOpciones, setListaOpciones] = useState(null);
  const [opciones, setOpciones] = useState([]);
  const [opcionesAll, setOpcionesAll] = useState([]);
  const [listControles, setListControles] = useState(null);
  const [listControlesSelected, setListControlesSelected] = useState(null);
  const [selectedCert, setSelectedCert] = useState(null);
  const [rolCampo, setRolCampo] = useState(true);

  const [dataTablaControlesAll, setDataTablaControlesAll] = useState(null);
  const [dataTablaControlesFilter, setDataTablaControlesFilter] = useState([]);
  const [dataControlSelected, setDataControlSelected] = useState([]);

  const [dataTablaCertificaciones, setDataTablaCertificaciones] =
    useState(null);
  const [dataTablaCertificacionesAll, setDataTablaCertificacionesAll] =
    useState(null);
  const [showDetCert, setShowDetCert] = useState(false);
  const [showDetContr, setShowDetContr] = useState(false);
  const [dataInactivar, setDataInactivar] = useState(false);
  //Variables para los modales
  const [showModInactivar, setShowModInactivar] = useState(false);
  const [showModRiesgos, setShowModRiesgos] = useState(false);
  const [dataModRiesgos, setDataModRiesgos] = useState(null);
  const [showModOpciones, setShowModOpciones] = useState(false);
  const [dataModOpciones, setDataModOpciones] = useState(null);
  const [showModContr, setShowModContr] = useState(false);
  const [selectVarMod, setSelectVarMod] = useState(null);
  const [otrosControles, setOtrosControles] = useState(null);

  const [estadoPost, setEstadoPost] = useState(null);
  const [habilitarBoton, setHabilitarBoton] = React.useState(true);
  let history = useHistory();

  useEffect(() => {
    if (opciones.length > 2) {
      window.alert("No puede seleccionar más de dos opciones");
    }
    setOpciones(opciones);

    const peticiones = async function () {
      let SoDQuerie = await Queries(
        null,
        "/sod/" + localStorage.getItem("idsod") + "/",
        "GET"
      );

      setDataSoD(SoDQuerie);
      cargar_info(SoDQuerie);
    };

    const peticionResumen = async function () {
      try {
        let OpcionCertQuerie = await Queries(
          null,
          "/certificacion_sod/resumen/" + localStorage.getItem("idsod") + "/",
          "GET"
        );
        const opcCertQuerieTemp = OpcionCertQuerie.resumen.map((dat) => {
          dat["requiere_control"] = dat.requiere_control ? "SI" : "NO";
          return dat;
        });
        OpcionCertQuerie.resumen = opcCertQuerieTemp;
        setDataTablaCertificacionesAll(OpcionCertQuerie);
      } catch (error) {
        console.log("No tiene resumen");
      }
    };

    const cargar_info = async function (dataSoD) {
      if (dataSoD) {
        let qRiesgo;
        if (!dataModRiesgos) {
          qRiesgo = await Queries(null, "/riesgos/", "GET");
        } else {
          qRiesgo = dataModRiesgos;
        }
        setDataModRiesgos(qRiesgo);

        qRiesgo.map((riesgo) => {
          if (riesgo.idriesgo === dataSoD.id_riesgo) {
            setRiesgo(riesgo);
          }
        });

        if (dataSoD.opciones) {
          setOpciones(dataSoD.opciones);
        }
      }
    };
    const peticionControles = async function () {
      try {
        let OpcionContrQuerie = await Queries(
          null,
          "/rx_opcioncritica_controles/" +
            localStorage.getItem("id_opcion_critica") +
            "/",
          "GET"
        );

        setDataTablaControlesAll(OpcionContrQuerie);
      } catch (error) {
        console.log("No tiene resumen");
      }
    };
    if (
      listControlesSelected &&
      listControlesSelected[0] &&
      listControlesSelected[0].idcontrol
    ) {
      let tempControlesAll = dataTablaControlesAll;
      let tempControlesAnti = tempControlesAll.compensatorios.filter(
        (obj) => obj.id_certificacion !== selectedCert[0]
      );
      let tempControlesSelected = listControlesSelected.map((dat) => {
        dat.idcontrol = dat.idcontrol + selectedCert[0];
        dat["estado"] = "Activo";
        dat["id_certificacion"] = selectedCert[0];
        dataTablaControlesAll.compensatorios.map((datAll) => {
          if (datAll.idcontrol === dat.idcontrol) {
            //dat["estado"] = datAll.estado ? "Activo" : "Inactivo";
            dat["idrx_opciones_controles"] = datAll.idrx_opciones_controles;
          }
        });
        return dat;
      });

      let temp = listControlesSelected.concat(tempControlesAnti);
      setDataTablaControlesAll({
        otros_controles: dataTablaControlesAll.otros_controles,
        compensatorios: temp,
      });
      setListControlesSelected(null);
      setDataTablaControlesFilter(listControlesSelected);
    }
    if (!dataSoD) {
      peticiones();
      peticionResumen();
      peticionControles();
    }
    if (!selectedCert || selectedCert.length === 0) {
      setShowDetCert(false);
      setShowDetContr(false);
    }
    if (props.idrol.includes(12)) {
      setRolCampo(false);
    }
  }, [opciones, selectedCert, listControlesSelected]);

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
        "Código Opción Técnica",
        "Descripción Actividad",
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

  const encontrarMayor = (data) => {
    let tamano = data.map((dat) => dat.list_resultado.length);
    return tamano.reduce((a, b) => a + b, 0) + 4;
  };

  const detalleCert = () => {
    if (selectedCert && selectedCert.length === 1) {
      let tempDataTableCert = dataTablaCertificacionesAll.detalle.filter(
        (cert) => cert.id_certificacion === selectedCert[0]
      );

      setDataTablaCertificaciones(tempDataTableCert);
      setShowDetCert(true);
    } else {
      setShowDetCert(false);
    }
  };
  const detalleControles = () => {
    if (
      selectedCert &&
      selectedCert.length === 1 &&
      dataTablaControlesAll.compensatorios
    ) {
      let tempDataTableContr = dataTablaControlesAll.compensatorios.filter(
        (obj) => obj.id_certificacion === selectedCert[0]
      );
      tempDataTableContr = tempDataTableContr.map((dat) => {
        dat.estado =
          dat.estado === 1 || dat.estado === "Activo" ? "Activo" : "Inactivo";
        return dat;
      });
      if (
        dataTablaControlesAll.otros_controles.id_certificacion ===
        selectedCert[0]
      ) {
        setOtrosControles(dataTablaControlesAll.otros_controles.control);
      } else {
        setOtrosControles(null);
      }
      setDataTablaControlesFilter(tempDataTableContr);
      setShowDetContr(true);
    } else {
      setShowDetContr(false);
    }
  };
  const cargarControles = async () => {
    console.log(listControles);
    //if (!listControles || !listControles.dataTable) {
    let ControlesQuerie = await Queries(null, "/controles/", "GET");

    let tempJsonControles = {
      dataTable: ControlesQuerie,
      nameCol: [
        "ID Control",
        "Nombre control",
        "Responsable ejecución",
        "Automatización",
        "Naturaleza",
        "Cubrimiento",
        "Prevaloración",
      ],
      nameRow: [
        "idcontrol",
        "nombre",
        "responsable_ejecucion",
        "automatizacion",
        "naturaleza",
        "cubrimiento",
        "prevaloracion",
      ],
      nameId: "idcontrol",
      busqueda: true,
      nameBusqueda: [
        "idcontrol",
        "nombre",
        "responsable_ejecucion",
        "automatizacion",
        "naturaleza",
      ],
    };

    setListControles(tempJsonControles);
    //}
  };
  const inactivarControl = () => {
    let tempInactivarControl = dataTablaControlesAll.compensatorios.filter(
      (obj) => obj.idcontrol == dataControlSelected
    )[0];

    if (tempInactivarControl && tempInactivarControl.idrx_opciones_controles) {
      setDataInactivar(tempInactivarControl);
      setShowModInactivar(true);
    } else {
      let temp = dataTablaControlesAll;
      temp.compensatorios = dataTablaControlesAll.compensatorios.filter(
        (obj) => obj.idcontrol != dataControlSelected
      );
      setDataTablaControlesAll(temp);
      setDataTablaControlesFilter(
        temp.compensatorios.filter(
          (obj) => obj.id_certificacion == selectedCert[0]
        )
      );
    }
  };
  const activarControl = () => {
    let tempActivarControl = dataTablaControlesAll.compensatorios.filter(
      (obj) => obj.idcontrol == dataControlSelected
    )[0];

    tempActivarControl["estado"] = "Activo";
    setDataControlSelected(null);
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
            const queriePUTSoD = await Queries(
              data,
              "/sod/" + dataSoD.idsod + "/",
              "PUT"
            );
            setEstadoPost(queriePUTSoD);

            if (dataTablaControlesAll) {
              let dataControlesSend = {};
              dataControlesSend["compensatorios"] =
                dataTablaControlesAll.compensatorios.map(
                  ({
                    idrx_opciones_controles,
                    estado,
                    id_control_send,
                    id_certificacion,
                    motivo_inactivacion,
                    usuario_inactivacion,
                    fecha_inactivacion,
                  }) => ({
                    idrx_opciones_controles,
                    estado: estado === "Activo" ? 1 : 0,
                    idcontrol: id_control_send,
                    id_certificacion,
                    id_opcion_critica: dataSoD.idsod,
                    motivo_inactivacion,
                    usuario_inactivacion,
                    fecha_inactivacion,
                  })
                );

              if (otrosControles) {
                dataControlesSend["otros_controles"] = {
                  control: otrosControles,
                  id_certificacion: "CERT2",
                  id_opcion_critica: null,
                  id_otros_controles_opcion_sod: dataTablaControlesAll
                    .otros_controles.id_otros_controles_opcion_sod
                    ? dataTablaControlesAll.otros_controles
                        .id_otros_controles_opcion_sod
                    : null,
                  id_sod: dataSoD.idsod,
                  relacionado_con: "sod",
                };
              } else {
                dataControlesSend["otros_controles"] =
                  dataTablaControlesAll.otros_controles;
              }

              let QuerieControlesCert = await Queries(
                dataControlesSend,
                "/rx_sod_controles/" + dataSoD.idsod + "/",
                "PUT"
              );
              console.log(QuerieControlesCert);
            }
          } catch (error) {
            setEstadoPost(error);
          }
        } else {
          setEstadoPost({
            status: "custom",
            name: "Atención",
            message:
              "Debe seleccionar reponsabilidad diferente en cada opción para continuar",
          });
        }
      } else {
        setEstadoPost({
          status: "custom",
          name: "Atención",
          message:
            "Debe seleccionar reponsabilidad y cargo que ejecuta la opción para continuar",
        });
      }
    } else {
      setEstadoPost({
        status: "custom",
        name: "Error",
        message: "Debe seleccionar mínimo una opción y máximo dos",
      });
    }
  };
  return (
    <>
      <AlertDismissible data={estadoPost} />
      <ModalInactivar
        showMod={showModInactivar}
        setShowMod={setShowModInactivar}
        data={dataInactivar}
      ></ModalInactivar>
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
      <ModalSelectTableCustom
        id="ModalControles"
        showMod={showModContr}
        setShowMod={setShowModContr}
        data={listControlesSelected}
        setData={setListControlesSelected}
        dataTable={listControles}
        multi={true}
      />
      <Row className="mb-3">
        <Col md={12}>
          <h1 className="titulo">Creación de una nueva regla SoD</h1>
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
              defaultValue={dataSoD ? dataSoD.idsod : null}
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
              defaultValue={dataSoD ? dataSoD.estado : null}
              className="form-control text-center texto"
              placeholder="Automático"
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
              placeholder="Seleccione riesgo para cargar la información"
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
              disabled={!rolCampo}
            >
              Seleccionar
            </button>
          </Col>
        </Row>
        <Row className="mb-3">
          <Col sm={4} xs={12}>
            <label className="forn-label label">Categoría del riesgo</label>
          </Col>
          <Col sm={8} xs={10}>
            <input
              type="text"
              disabled
              defaultValue={
                riesgo && riesgo.nombre_riesgo ? riesgo.nombre_riesgo : null
              }
              className="form-control text-center texto"
              placeholder="Categoría del riesgo"
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
                riesgo && riesgo.tipo_elemento_evaluado
                  ? riesgo.tipo_elemento_evaluado
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
            <button
              type="button"
              className="btn botonPositivo"
              onClick={async () => {
                await querieOpciones();
                setSelectVarMod("opciones");
                setShowModOpciones(true);
              }}
              disabled={!rolCampo}
            >
              Añadir
            </button>
          </Col>
        </Row>

        {/* <TableCustom
          data={opciones}
          nameCol={[
            "ID",
            "Aplicativo",
            "Código Opción Técnica",
            "Descripción Actividad",
            "Nombre Actividad",
            "Responsabilidad",
            "Cargo que ejecuta la opción",
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
                    Código Opción Técnica
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    Descripción Actividad
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    Nombre Actividad
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    Responsabilidad
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    Cargo que ejecuta la opción
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
                          defaultValue={
                            row.responsabilidad
                              ? {
                                  label: row.responsabilidad,
                                  value: row.responsabilidad,
                                }
                              : null
                          }
                          options={[
                            { label: "A-Registro", value: "A-Registro" },
                            {
                              label: "B-Autorización",
                              value: "B-Autorización",
                            },
                            {
                              label: "C-Custodia de datos",
                              value: "C-Custodia de datos",
                            },
                            {
                              label: "D-Verificación",
                              value: "D-Verificación",
                            },
                          ]}
                        />
                      </StyledTableCell>
                      <StyledTableCell component="th" scope="row">
                        <Select
                          className="texto"
                          onChange={(e) => (row["cargo_q_ejecuta"] = e.value)}
                          defaultValue={
                            row.cargo_q_ejecuta
                              ? {
                                  label: row.cargo_q_ejecuta,
                                  value: row.cargo_q_ejecuta,
                                }
                              : null
                          }
                          options={[
                            {
                              label:
                                "Matriz: Cargo + rol (Analista III de crédito)",
                              value:
                                "Matriz: Cargo + rol (Analista III de crédito)",
                            },
                            {
                              label:
                                "SOX: Carges estándar (Vp, Gerente, director)",
                              value:
                                "SOX: Carges estándar (Vp, Gerente, director)",
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
        <Row className="mb-3">
          <Col sm={8} xs={12}></Col>
          <Col sm={2} xs={12}>
            <button
              type="button"
              className="btn botonPositivo"
              onClick={(e) => detalleCert()}
            >
              Detalle de la certificación
            </button>
          </Col>
          <Col sm={2} xs={12}>
            <button
              type="button"
              className="btn botonNegativo3"
              onClick={() => detalleControles()}
            >
              Controles
            </button>
          </Col>
        </Row>

        <TableCustom
          data={
            dataTablaCertificacionesAll && dataTablaCertificacionesAll.resumen
              ? dataTablaCertificacionesAll.resumen
              : []
          }
          nameCol={[
            "Id Certificación",
            "Resultado",
            "Fecha de  certificación",
            "Cantidad de usuarios con la opción",
            "% de materializados",
            "% de remediadas",
            "Requiere control compensatorio",
          ]}
          nameRow={[
            "id_certificacion",
            "Resultado",
            "Fecha_certificacion",
            "Num_usuarios_opcion",
            "Porcentage_meterializado",
            "porcentage_remediado",
            "requiere_control",
          ]}
          nameId={"id_certificacion"}
          selectedData={selectedCert}
          setSelectedData={setSelectedCert}
        ></TableCustom>
        <p />

        {showDetCert ? (
          <TableContainer component={Paper}>
            <Table className={"text"} stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  <StyledTableCell>ID Certificacion</StyledTableCell>
                  <StyledTableCell align="center">Opcion</StyledTableCell>
                  <StyledTableCell align="center">Resultado</StyledTableCell>
                  <StyledTableCell align="center">
                    Usuario que tiene la opción
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    Jefe de quien tiene la opción
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    Tipo de log validado
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    Resultado log
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    Fecha de último ingreso de acuerdo al log
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    ¿Requiere control compensatorio?
                  </StyledTableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {dataTablaCertificaciones.map((cert) => (
                  <>
                    <StyledTableRow>
                      <StyledTableCell
                        align="center"
                        rowSpan={encontrarMayor(cert.opcion)}
                      >
                        {cert.id_certificacion}
                      </StyledTableCell>
                    </StyledTableRow>

                    {cert.opcion.map((opc) => (
                      <>
                        <StyledTableRow>
                          <StyledTableCell
                            align="center"
                            rowSpan={opc.list_resultado.length + 1}
                          >
                            {opc.id_opcion}
                          </StyledTableCell>
                        </StyledTableRow>

                        {opc.list_resultado.map((result) => (
                          <>
                            <StyledTableRow>
                              <StyledTableCell align="center">
                                {result.resultado_opcion}
                              </StyledTableCell>
                              <StyledTableCell align="center">
                                {result.usuario_opcion}
                              </StyledTableCell>
                              <StyledTableCell align="center">
                                {result.jefe_usuario_opcion}
                              </StyledTableCell>
                              <StyledTableCell align="center">
                                {result.tipo_log_validado_opc}
                              </StyledTableCell>
                              <StyledTableCell align="center">
                                {result.resultado_log_opc}
                              </StyledTableCell>
                              <StyledTableCell align="center">
                                {result.fecha_ultimo_ingreso_opc}
                              </StyledTableCell>
                              <StyledTableCell align="center">
                                {result.requiere_control_compensatorio === 0
                                  ? "NO"
                                  : "SI"}
                              </StyledTableCell>
                            </StyledTableRow>
                          </>
                        ))}
                      </>
                    ))}
                  </>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : null}

        {showDetContr ? (
          <>
            <Row className="mb-3">
              <Col sm={6} xs={12}></Col>
              <Col sm={2} xs={12}>
                <button
                  type="button"
                  className="btn botonIngreso"
                  onClick={() => activarControl()}
                  disabled={rolCampo}
                >
                  Activar control
                </button>
              </Col>
              <Col sm={2} xs={12}>
                <button
                  type="button"
                  className="btn botonPositivo"
                  onClick={async () => {
                    await cargarControles();
                    setShowModContr(true);
                  }}
                  disabled={rolCampo}
                >
                  Asociar control
                </button>
              </Col>
              <Col sm={2} xs={12}>
                <button
                  type="button"
                  className="btn botonNegativo"
                  onClick={() => inactivarControl()}
                  disabled={rolCampo}
                >
                  Desasociar control
                </button>
              </Col>
            </Row>
            <p />
            <TableCustom
              data={dataTablaControlesFilter}
              nameCol={[
                "Id control",
                "Nombre control",
                "Estado relación",
                "Fecha inactivación",
                "Justificación inactivación",
              ]}
              nameRow={[
                "idcontrol",
                "nombre",
                "estado",
                "fecha_inactivación",
                "motivo_de_inactivacion",
              ]}
              nameId={"idcontrol"}
              selectedData={dataControlSelected}
              setSelectedData={setDataControlSelected}
            />
            <p />
            <Row className="mb-3">
              <Col sm={4} xs={12}>
                <label className="form-label label">Otros Controles</label>
              </Col>
              <Col sm={8} xs={12}>
                <textarea
                  className="form-control text-center"
                  placeholder="Otros controles"
                  rows="3"
                  id="Objetivo"
                  defaultValue={otrosControles}
                  onChange={(e) => setOtrosControles(e.target.value)}
                ></textarea>
              </Col>
            </Row>
          </>
        ) : null}

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
            <Link to="SoD">
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
