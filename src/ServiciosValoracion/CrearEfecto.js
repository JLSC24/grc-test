import React, { useEffect } from "react";
import { Button, Row, Col, Form, Modal, Alert } from "react-bootstrap";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import TablePagination from "@material-ui/core/TablePagination";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import { Link, useHistory } from "react-router-dom";
import Checkbox from "@material-ui/core/Checkbox";

import { HotTable, HotColumn } from "@handsontable/react";
import Handsontable from "handsontable";
import "handsontable/dist/handsontable.full.css";
import $, { data } from "jquery";
import Plot from "react-plotly.js";
import ReactLoading from "react-loading";
import XLSX from "xlsx";

import { adalApiFetch } from "../auth/adalConfig";
import AADService from "../auth/authFunctions";
import { w3cwebsocket as W3CWebSocket } from "websocket";

const serviceAAD = new AADService();
const client = new W3CWebSocket(
  process.env.REACT_APP_WS_URL + "/ws/dropdown/calcular_" +
    serviceAAD.getUser().userName.split("@")[0]
);

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
    maxHeight: "57vh",
    //minHeight: "57vh",
  },
  containerModal: {
    maxHeight: "50vh",
    //minHeight: "50vh",
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
      return <Alert variant="success">Guard?? exitosamente</Alert>;
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
          Ya existe una evaluaci??n para el activo seleccionado
        </Alert>
      );
      break;
    default:
      return <p></p>;
      break;
  }
}
export default function CrearEfecto(props) {
  const serviceAAD = new AADService();
  /* /////////////////////// Data generales /////////////////////////////// */
  let history = useHistory();
  const [dataTE, setDataTE] = React.useState(null);
  const [dataME, setDataME] = React.useState(null);
  const [dataMEx, setDataMEx] = React.useState(null);
  const [dataTV, setDataTV] = React.useState(null);
  const [dataHS, setDataHS] = React.useState(null);
  const [dataFA, setDataFA] = React.useState(null);
  const [dataF2, setDataF2] = React.useState(null);
  const [dataUF, setDataUF] = React.useState(null);
  const [estadoPost, setEstadoPost] = React.useState({
    alerta: { id: 0, data: null },
  });
  /* /////////////////////// Data generales /////////////////////////////// */
  const classes = useStyles();
  const [data, setData] = React.useState([]);
  const [dataGroup, setDataGroup] = React.useState([]);
  const [dataMinVec, setDataMinVec] = React.useState(null);
  const [dataMaxVec, setDataMaxVec] = React.useState(null);
  const [dataEnviada, setDataEnviada] = React.useState([]);
  const [dataCalculada, setDataCalculada] = React.useState(null);
  const [modalShow, setModalShow] = React.useState(false);
  const [modalShowVector, setModalShowVector] = React.useState(false);
  const [erroresModal, setErroresModal] = React.useState(null);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [selected, setSelected] = React.useState([]);

  const [exclusion, setExclusion] = React.useState(false);

  const [tabTipoValoracion, setTabTipoValoracion] = React.useState(null);
  const [tabTipoFrecuenciaA, setTabTipoFrecuenciaA] = React.useState(null);
  const [tabTipoFrecuencia2, setTabTipoFrecuencia2] = React.useState(null);
  const [tabDuracion, setTabDuracion] = React.useState(null);
  const [tabHorario, setTabHorario] = React.useState(null);
  const [labelFrecuencia2, setLabelFrecuencia2] = React.useState(null);
  const [labelFrecuenciaA, setLabelFrecuenciaA] = React.useState(null);
  const [labelHorario, setLabelHorario] = React.useState(null);
  const [loading, setLoading] = React.useState(null);
  const [loadingSave, setLoadingSave] = React.useState(false);
  const [buttons, setButtons] = React.useState(false);

  const [hotVector, setHotVector] = React.useState([
    { valores: null },
    { valores: null },
    { valores: null },
    { valores: null },
    { valores: null },
    { valores: null },
    { valores: null },
    { valores: null },
    { valores: null },
    { valores: null },
  ]);

  const [hotTipoValoracion, setHotTipoValoracion] = React.useState([
    { valueInf: null, valueSup: null, valueProb: null },
    { valueInf: null, valueSup: null, valueProb: null },
    { valueInf: null, valueSup: null, valueProb: null },
    { valueInf: null, valueSup: null, valueProb: null },
    { valueInf: null, valueSup: null, valueProb: null },
    { valueInf: null, valueSup: null, valueProb: null },
    { valueInf: null, valueSup: null, valueProb: null },
    { valueInf: null, valueSup: null, valueProb: null },
    { valueInf: null, valueSup: null, valueProb: null },
    { valueInf: null, valueSup: null, valueProb: null },
  ]);

  const [hotDuracion, setHotDuracion] = React.useState([
    { valueInf: null, valueSup: null, valueProb: null },
    { valueInf: null, valueSup: null, valueProb: null },
    { valueInf: null, valueSup: null, valueProb: null },
    { valueInf: null, valueSup: null, valueProb: null },
    { valueInf: null, valueSup: null, valueProb: null },
    { valueInf: null, valueSup: null, valueProb: null },
    { valueInf: null, valueSup: null, valueProb: null },
    { valueInf: null, valueSup: null, valueProb: null },
    { valueInf: null, valueSup: null, valueProb: null },
    { valueInf: null, valueSup: null, valueProb: null },
  ]);
  const [hotFrecuenciaA1, setHotFrecuenciaA1] = React.useState([
    { valueInf: null, valueSup: null, valueProb: null },
    { valueInf: null, valueSup: null, valueProb: null },
    { valueInf: null, valueSup: null, valueProb: null },
    { valueInf: null, valueSup: null, valueProb: null },
    { valueInf: null, valueSup: null, valueProb: null },
    { valueInf: null, valueSup: null, valueProb: null },
    { valueInf: null, valueSup: null, valueProb: null },
    { valueInf: null, valueSup: null, valueProb: null },
    { valueInf: null, valueSup: null, valueProb: null },
    { valueInf: null, valueSup: null, valueProb: null },
  ]);

  const [hotFrecuenciaA2, setHotFrecuenciaA2] = React.useState([
    { veces: null, a??os: null },
  ]);

  const [hotFrecuenciaA3, setHotFrecuenciaA3] = React.useState([
    { poblacion: null, probabilidad: null },
  ]);

  const [hotFrecuencia21, setHotFrecuencia21] = React.useState([
    { valueInf: null, valueSup: null, valueProb: null },
    { valueInf: null, valueSup: null, valueProb: null },
    { valueInf: null, valueSup: null, valueProb: null },
    { valueInf: null, valueSup: null, valueProb: null },
    { valueInf: null, valueSup: null, valueProb: null },
    { valueInf: null, valueSup: null, valueProb: null },
    { valueInf: null, valueSup: null, valueProb: null },
    { valueInf: null, valueSup: null, valueProb: null },
    { valueInf: null, valueSup: null, valueProb: null },
    { valueInf: null, valueSup: null, valueProb: null },
  ]);

  const [hotFrecuencia22, setHotFrecuencia22] = React.useState([
    { veces: null },
  ]);

  const [hotFrecuencia23, setHotFrecuencia23] = React.useState([
    { poblacion: null, probabilidad: null },
  ]);

  useEffect(() => {
    client.onclose = () => {
      console.warn("WebSocket Client Disconnected Client_riesgos");
      closeWS();
    };

    client.onopen = () => {
      console.warn("WebSocket Client Connected");
    };
    client.onmessage = (message) => {
      recibirMensaje(JSON.parse(message.data));
    };

    function closeWS() {
      var mensaje = window.confirm(
        "Se ha cerrado la conexi??n con el servidor, es necesario recargar la p??gina para continuar"
      );
      if (mensaje) {
        window.location.reload();
      } else {
        alert("No podr?? hacer uso de los cargadores hasta recargar la p??gina");
      }
    }
    const fetchdata = async () => {
      const result = await fetch(process.env.REACT_APP_API_URL + "/grid/OC/", {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: "Bearer " + serviceAAD.getToken(),
        },
      });
      let data = await result.json();
      if (data) {
        data.map((data) => {
          if (data.compania !== "Banistmo") {
            data.nivel2 = "";
          }
        });
      }
      const filtered = data.filter(function (element) {
        return !(
          (element.compania === "Banistmo" && element.nivel_oc === 1) ||
          (element.compania !== "Banistmo" && element.nivel_oc === 2)
        );
      });
      setData(filtered);
    };
    const generales = async () => {
      const resultTE = await fetch(
        process.env.REACT_APP_API_URL + "/generales/Servicios_de_valoracion/tipo_de_efecto/",
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            Authorization: "Bearer " + serviceAAD.getToken(),
          },
        }
      );
      let data = await resultTE.json();
      setDataTE(data);
      const resultME = await fetch(
        process.env.REACT_APP_API_URL + "/generales/Servicios_de_valoracion/materializado_en/",
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            Authorization: "Bearer " + serviceAAD.getToken(),
          },
        }
      );
      data = await resultME.json();
      setDataME(data);
      const resultMEx = await fetch(
        process.env.REACT_APP_API_URL + "/generales/Servicios_de_valoracion/motivo_de_exclusion/",
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            Authorization: "Bearer " + serviceAAD.getToken(),
          },
        }
      );
      data = await resultMEx.json();
      setDataMEx(data);
      const resultTV = await fetch(
        process.env.REACT_APP_API_URL + "/generales/Servicios_de_valoracion/tipo_valoracion/",
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            Authorization: "Bearer " + serviceAAD.getToken(),
          },
        }
      );
      data = await resultTV.json();
      setDataTV(data);
      const resultHS = await fetch(
        process.env.REACT_APP_API_URL + "/generales/Servicios_de_valoracion/horarios_servicio/",
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            Authorization: "Bearer " + serviceAAD.getToken(),
          },
        }
      );
      data = await resultHS.json();
      setDataHS(data);
      const resultFA = await fetch(
        process.env.REACT_APP_API_URL + "/generales/Servicios_de_valoracion/frecuenciaa_anual/",
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            Authorization: "Bearer " + serviceAAD.getToken(),
          },
        }
      );
      data = await resultFA.json();
      setDataFA(data);
      const resultF2 = await fetch(
        process.env.REACT_APP_API_URL + "/generales/Servicios_de_valoracion/frecuencia_2/",
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            Authorization: "Bearer " + serviceAAD.getToken(),
          },
        }
      );
      data = await resultF2.json();
      setDataF2(data);
      const resultUF = await fetch(
        process.env.REACT_APP_API_URL + "/generales/Servicios_de_valoracion/ubicacion_de_la_fuente/",
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            Authorization: "Bearer " + serviceAAD.getToken(),
          },
        }
      );
      data = await resultUF.json();
      setDataUF(data);
    };
    generales();
    fetchdata();
  }, []);

  // function closeWS() {
  //   var mensaje = window.confirm(
  //     "Se ha cerrado la conexi??n con el servidor, es necesario recargar la p??gina para continuar"
  //   );
  //   if (mensaje) {
  //     window.location.reload();
  //   } else {
  //     alert("No podr?? hacer uso de los cargadores hasta recargar la p??gina");
  //   }
  // }

  const recibirMensaje = async (data) => {
    if (data.payload.Error) {
      window.alert("Error ocurrido en el c??lculo: " + data.payload.Detail);
      setButtons(true);
      setLoading(false);
    } else if (data.payload.message === "sucess") {
      setDataCalculada(data.payload.Detail);
      setButtons(true);
      setLoading(false);
    }
  };

  const sendMessageSocket = (msg) => {
    if (msg) {
      if (client.readyState !== 0) {
        client.send(JSON.stringify(msg));
      }
    }
  };

  /* Funciones para paginaci??n */
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };
  /* Fin de funciones para paginaci??n */
  /* Funci??n para seleccionar un ??rea para Editar */
  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat([], name);
      //SetButtonEdit(true);
    } else {
      //SetButtonEdit(false);
    }
    setSelected(newSelected);
  };

  const isSelected = (name) => selected.indexOf(name) !== -1;
  const asignarValVector = (minVal, maxVal) => {
    setDataMinVec(minVal);
    setDataMaxVec(maxVal);
  };

  //Grupo de riesgos
  function ModalGrupoRiesgos(props) {
    const [selected, setSelected] = React.useState([]);
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [dataBusqueda, setDataBusqueda] = React.useState(data);
    const [buscando, setBuscando] = React.useState(null);
    /* Funciones para paginaci??n */

    /* Funciones para paginaci??n */
    const handleChangePage = (event, newPage) => {
      setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
      setRowsPerPage(+event.target.value);
      setPage(0);
    };
    /* Fin de funciones para paginaci??n */
    /* Funci??n para seleccionar un ??rea para Editar */
    const handleClick = (event, name) => {
      const selectedIndex = selected.indexOf(name);
      let newSelected = [];

      if (selectedIndex === -1) {
        newSelected = newSelected.concat(selected, name);
      } else if (selectedIndex === 0) {
        newSelected = newSelected.concat(selected.slice(1));
      } else if (selectedIndex === selected.length - 1) {
        newSelected = newSelected.concat(selected.slice(0, -1));
      } else if (selectedIndex > 0) {
        newSelected = newSelected.concat(
          selected.slice(0, selectedIndex),
          selected.slice(selectedIndex + 1)
        );
      }
      setSelected(newSelected);
    };
    const isSelected = (name) => selected.indexOf(name) !== -1;
    const retornarSelected = (dataSelected) => {
      let temp = [];
      if (data) {
        data.map((dat) => {
          dataSelected.map((dataS) => {
            if (dat.idoc == dataS) {
              temp.push(dat);
            }
          });
        });
      }

      setDataGroup(temp);
    };

    async function buscar(e) {
      e.persist();
      //await setBuscando(e.target.value);
      var search = data.filter((item) => {
        if (
          item.nombre_oc.toLowerCase().includes(e.target.value.toLowerCase()) ||
          item.compania.toLowerCase().includes(e.target.value.toLowerCase()) ||
          item.idoc.toString().includes(e.target.value) ||
          item.nivel1.toLowerCase().includes(e.target.value.toLowerCase()) ||
          item.nivel2.toLowerCase().includes(e.target.value.toLowerCase())
        ) {
          return item;
        }
      });
      await setBuscando(e.target.value);
      await setDataBusqueda(search);
    }

    return (
      <Modal
        {...props}
        aria-labelledby="contained-modal-title-vcenter"
        centered
        className="modalCustom"
      >
        <Modal.Header closeButton>
          <Modal.Title className="subtitulo" id="contained-modal-title-vcenter">
            Agregar Objetos de costo
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Control
              value={buscando}
              onChange={(e) => buscar(e)}
              type="text"
              placeholder="Buscar"
            />
          </Form>
          <Row className="mb-2">
            <Col sm={4} xs={12}>
              {/* <Form>
                <Form.Control type="text" placeholder="Buscar" />
              </Form> */}
            </Col>
          </Row>
          <Paper className={classes.root}>
            <TableContainer
              component={Paper}
              className={classes.containerModal}
            >
              <Table className={"text"} stickyHeader aria-label="sticky table">
                {/* Inicio de encabezado */}
                <TableHead className="titulo">
                  <TableRow>
                    <StyledTableCell padding="checkbox"></StyledTableCell>
                    <StyledTableCell align="left">ID OC</StyledTableCell>
                    <StyledTableCell align="left">Compa????a</StyledTableCell>
                    <StyledTableCell align="left">OC Nivel 1</StyledTableCell>
                    <StyledTableCell align="left">OC Nivel 2</StyledTableCell>
                    <StyledTableCell align="left">Nombre OC</StyledTableCell>
                  </TableRow>
                </TableHead>
                {/* Fin de encabezado */}
                {/* Inicio de cuerpo de la tabla */}
                <TableBody>
                  {dataBusqueda
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row, index) => {
                      const isItemSelected = isSelected(row.idoc);

                      return (
                        <StyledTableRow
                          key={row.idoc}
                          hover
                          onClick={(event) => handleClick(event, row.idoc)}
                          selected={isItemSelected}
                          role="checkbox"
                          tabIndex={-1}
                        >
                          <StyledTableCell component="th" scope="row">
                            <Checkbox checked={isItemSelected} />
                          </StyledTableCell>
                          <StyledTableCell component="th" scope="row">
                            {row.idoc !== null ? row.idoc : null}
                          </StyledTableCell>
                          <StyledTableCell align="left">
                            {row.compania !== null ? row.compania : null}
                          </StyledTableCell>
                          <StyledTableCell align="left">
                            {row.nivel1 !== null ? row.nivel1 : null}
                          </StyledTableCell>
                          <StyledTableCell align="left">
                            {row.nivel2 !== null ? row.nivel2 : null}
                          </StyledTableCell>
                          <StyledTableCell align="left">
                            {row.nombre_oc !== null ? row.nombre_oc : null}
                          </StyledTableCell>
                        </StyledTableRow>
                      );
                    })}
                </TableBody>
                {/* Fin de cuerpo de la tabla */}
              </Table>
            </TableContainer>
            {/* Inicio de paginaci??n */}
            <TablePagination
              rowsPerPageOptions={[10, 25, 100]}
              component="div"
              count={data.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
            {/* Fin de paginaci??n */}
          </Paper>
          <Row className="mt-2">
            <Col sm={8} xs={0}></Col>
            <Col sm={4} xs={12}>
              <Button
                className="botonPositivo"
                onClick={() => {
                  retornarSelected(selected);
                  setModalShow(false);
                }}
              >
                A??adir
              </Button>
            </Col>
          </Row>
        </Modal.Body>
      </Modal>
    );
  }

  function ModalVector(props) {
    return (
      <Modal
        {...props}
        aria-labelledby="contained-modal-title-vcenter"
        centered
        className="modalCustom"
      >
        <Modal.Header closeButton>
          <Modal.Title className="subtitulo" id="contained-modal-title-vcenter">
            Calculo desde un vector
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row className="mb-2">
            <Col sm={4} xs={12}>
              <label className="form-label label">Insumos</label>
            </Col>
            <Col sm={4} xs={12}>
              <label className="form-label label">
                Alertas sobre el insumo
              </label>
            </Col>
            <Col sm={4} xs={12}>
              <label className="form-label label">
                Informaci??n complementaria
              </label>
            </Col>
          </Row>
          <hr />
          <Row className="mb-2">
            <Col sm={4} xs={12}>
              <div className="contenedorVector">
                <HotTable
                  data={hotVector}
                  colHeaders={["Valores"]}
                  rowHeaders={true}
                  height="auto"
                  width="auto"
                  licenseKey="non-commercial-and-evaluation"
                >
                  <HotColumn data="valores" type="numeric" />
                </HotTable>
              </div>
            </Col>
            <Col sm={4} xs={12}></Col>
            <Col sm={4} xs={12}>
              <Row>
                <label className="form-label label">
                  Si cuentas con cifras de minimas o maximas a las indicadas en
                  el vector numerico, incluyelas a continuaci??n:
                </label>
              </Row>
              <Row className="mb-3">
                <Col md={3}>
                  <label className="form-label label">M??nimo: </label>
                </Col>
                <Col md={9}>
                  <input
                    defaultValue={dataMinVec ? dataMinVec : null}
                    type="numeric"
                    id="minimoVector"
                    className="form-control text-center texto texto"
                    placeholder="M??nimo"
                  />
                </Col>
              </Row>
              <Row className="mb-3">
                <Col md={3}>
                  <label className="form-label label">M??ximo: </label>
                </Col>
                <Col md={9}>
                  <input
                    defaultValue={dataMaxVec ? dataMaxVec : null}
                    type="numeric"
                    id="maximoVector"
                    className="form-control text-center texto texto"
                    placeholder="M??ximo"
                  />
                </Col>
              </Row>
            </Col>
          </Row>
          <hr />
          <Row className="mb-2">
            <Col sm={8} xs={0}></Col>
            <Col sm={4} xs={12}>
              <Button
                className="botonPositivo"
                onClick={() => {
                  asignarValVector(
                    document.getElementById("minimoVector").value,
                    document.getElementById("maximoVector").value
                  );
                  addVector(
                    document.getElementById("minimoVector").value,
                    document.getElementById("maximoVector").value
                  );
                  setModalShowVector(false);
                }}
              >
                A??adir
              </Button>
            </Col>
          </Row>
        </Modal.Body>
      </Modal>
    );
  }

  function ModalErrores(props) {
    return (
      <Modal
        {...props}
        aria-labelledby="contained-modal-title-vcenter"
        centered
        className="modalCustom"
      >
        <Modal.Body>
          <Row className="mb-3">
            <Col>
              <h1 className="titulo">Errores al enviar el c??lculo</h1>
            </Col>
          </Row>
          <Row className="mb-3">
            <Col>
              {erroresModal ? (
                <ul>
                  {erroresModal.map((dat) => {
                    return (
                      <>
                        <li>
                          <label className="text">{dat}</label>
                        </li>
                      </>
                    );
                  })}
                </ul>
              ) : null}
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button
            className="botonPositivo"
            onClick={() => setErroresModal(null)}
          >
            aceptar
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }

  const cambiaValoracion = () => {
    const tipoValoracion = document.getElementById("tipoValoracion").value;
    setTabTipoFrecuenciaA(null);
    setTabTipoFrecuencia2(null);
    /* Validaci??n para tablas, labels y selects que dependen del tipo de valoraci??n */
    if (tipoValoracion) {
      setTabTipoValoracion(true);
      if (tipoValoracion === "Valoraci??n con duraci??n") {
        setLabelFrecuenciaA(false);
        setTimeout(function () {
          setLabelFrecuenciaA(true);
        }, 1);
        setLabelFrecuencia2(false);
        setLabelHorario(true);
        setTabDuracion(true);
        setTabTipoValoracion(true);
      } else if (
        tipoValoracion === "Valoraci??n con duraci??n y doble frecuencia"
      ) {
        setLabelFrecuenciaA(false);
        setTimeout(function () {
          setLabelFrecuenciaA(true);
        }, 1);
        setLabelHorario(true);
        setLabelFrecuencia2(false);
        setTimeout(function () {
          setLabelFrecuencia2(true);
        }, 1);
        setTabDuracion(true);
        setTabTipoValoracion(true);
      } else if (tipoValoracion === "Valoraci??n con doble frecuencia") {
        setLabelFrecuenciaA(false);
        setTimeout(function () {
          setLabelFrecuenciaA(true);
        }, 1);
        setTabDuracion(false);
        setLabelHorario(false);
        setLabelFrecuencia2(false);
        setTimeout(function () {
          setLabelFrecuencia2(true);
        }, 1);
      } else if (
        tipoValoracion === "Valoraci??n tradicional (Impacto/Frecuencia)"
      ) {
        setLabelFrecuenciaA(false);
        setTimeout(function () {
          setLabelFrecuenciaA(true);
        }, 1);
        setTabDuracion(false);
        setLabelFrecuencia2(false);
        setTabTipoFrecuencia2(false);
        setLabelHorario(false);
      }
    } else {
      setLabelHorario(false);
      setLabelFrecuenciaA(false);
      setLabelFrecuencia2(false);
      setTabDuracion(false);
      setTabTipoFrecuenciaA(false);
      setTabTipoFrecuencia2(false);
      setTabTipoValoracion(false);
    }
  };

  const cambiarFrecuenciaA = () => {
    const tipoFrecuenciaA = document.getElementById("tipoFrecuenciaA")
      ? document.getElementById("tipoFrecuenciaA").value
      : null;

    /* Validaci??n para tablas que dependen de Tipo de Frecuencia Anual */
    if (tipoFrecuenciaA) {
      setTabTipoFrecuenciaA({ state: true, table: null });
      if (tipoFrecuenciaA === "M??todo 1 (Por rangos)") {
        let tabla = (
          <HotTable
            data={hotFrecuenciaA1}
            rowHeaders={true}
            colHeaders={["L??m. Inf.", "L??m. Sup.", "Prob (%)"]}
            height="auto"
            width="auto"
            licenseKey="non-commercial-and-evaluation"
          >
            <HotColumn data="valueInf" type="numeric" />
            <HotColumn data="valueSup" type="numeric" />
            <HotColumn data="valueProb" type="numeric" />
          </HotTable>
        );
        setTabTipoFrecuenciaA({ state: true, table: tabla });
      } else if (tipoFrecuenciaA === "M??todo 2 (Poisson)") {
        setTabTipoFrecuenciaA({ state: true, table: null });
        let tabla = (
          <HotTable
            data={hotFrecuenciaA2}
            rowHeaders={true}
            colHeaders={["Veces", "A??os"]}
            height="auto"
            width="auto"
            licenseKey="non-commercial-and-evaluation"
          >
            <HotColumn data="veces" type="numeric" />
            <HotColumn data="a??os" type="numeric" />
          </HotTable>
        );
        setTabTipoFrecuenciaA({ state: true, table: tabla });
      } else if (tipoFrecuenciaA === "M??todo 3 (Binomial)") {
        let tabla = (
          <HotTable
            data={hotFrecuenciaA3}
            rowHeaders={true}
            colHeaders={["Poblaci??n", "Probabilidad"]}
            height="auto"
            width="auto"
            licenseKey="non-commercial-and-evaluation"
          >
            <HotColumn data="poblacion" type="numeric" />
            <HotColumn data="probabilidad" type="numeric" />
          </HotTable>
        );
        setTabTipoFrecuenciaA({ state: true, table: tabla });
      }
    } else {
      setTabTipoFrecuenciaA(false);
    }
  };

  const cambiarFrecuencia2 = () => {
    const tipoFrecuencia2 = document.getElementById("tipoFrecuencia2")
      ? document.getElementById("tipoFrecuencia2").value
      : null;

    /* Validaci??n para tablas que dependen de Tipo de Frecuencia Anual */
    if (tipoFrecuencia2) {
      setTabTipoFrecuencia2({ state: true, table: null });
      if (tipoFrecuencia2 === "M??todo 1 (Por rangos)") {
        let tabla = (
          <HotTable
            data={hotFrecuencia21}
            rowHeaders={true}
            colHeaders={["L??m. Inf.", "L??m. Sup.", "Prob (%)"]}
            height="auto"
            width="auto"
            licenseKey="non-commercial-and-evaluation"
          >
            <HotColumn data="valueInf" type="numeric" />
            <HotColumn data="valueSup" type="numeric" />
            <HotColumn data="valueProb" type="numeric" />
          </HotTable>
        );
        setTabTipoFrecuencia2({ state: true, table: tabla });
      } else if (tipoFrecuencia2 === "M??todo 2 (Poisson)") {
        setTabTipoFrecuencia2({ state: true, table: null });
        let tabla = (
          <HotTable
            data={hotFrecuencia22}
            rowHeaders={true}
            colHeaders={["Veces Esperadas"]}
            height="auto"
            width="auto"
            licenseKey="non-commercial-and-evaluation"
          >
            <HotColumn data="veces" type="numeric" />
          </HotTable>
        );
        setTabTipoFrecuencia2({ state: true, table: tabla });
      } else if (tipoFrecuencia2 === "M??todo 3 (Binomial)") {
        let tabla = (
          <HotTable
            data={hotFrecuencia23}
            rowHeaders={true}
            colHeaders={["Poblaci??n", "Probabilidad"]}
            height="auto"
            width="auto"
            licenseKey="non-commercial-and-evaluation"
          >
            <HotColumn data="poblacion" type="numeric" />
            <HotColumn data="probabilidad" type="numeric" />
          </HotTable>
        );
        setTabTipoFrecuencia2({ state: true, table: tabla });
      }
    } else {
      setTabTipoFrecuencia2(false);
    }
  };

  const sendCalificacion = () => {
    const tipoFrecuenciaA = document.getElementById("tipoFrecuenciaA")
      ? document.getElementById("tipoFrecuenciaA").value
      : null;
    const tipoFrecuencia2 = document.getElementById("tipoFrecuencia2")
      ? document.getElementById("tipoFrecuencia2").value
      : null;
    const horarioproceso = document.getElementById("horarioServicio")
      ? document.getElementById("horarioServicio").value
      : null;

    let tempHotTipoValoracion = hotTipoValoracion;
    let tempHotFrecuenciaA1 = hotFrecuenciaA1;
    let tempHotFrecuenciaA2 = hotFrecuenciaA2;
    let tempHotFrecuenciaA3 = hotFrecuenciaA3;
    let tempHotFrecuencia21 = hotFrecuencia21;
    let tempHotFrecuencia22 = hotFrecuencia22;
    let tempHotFrecuencia23 = hotFrecuencia23;
    let tempHotDuracion = hotDuracion;
    let nulosVI = 0;
    let nulosVS = 0;
    let nulosVP = 0;
    let tempPorc = 0.0;
    let tempErrores = [];

    //validar tabla de impacto
    let datValueInfTemp;
    tempHotTipoValoracion.map((dat, index) => {
      datValueInfTemp = tempHotTipoValoracion[index - 1]
        ? tempHotTipoValoracion[index - 1].valueInf
        : null;
      if (!dat.valueInf) {
        if (index !== 0 || datValueInfTemp === 0) {
          nulosVI += 1;
        }
      }
      if (!dat.valueSup) {
        if (index !== 0 || datValueInfTemp !== 0) {
          nulosVS += 1;
        }
      }
      if (!dat.valueProb) {
        nulosVP += 1;
      }
    });
    if (nulosVI === 10 || nulosVS === 10 || nulosVP === 10) {
      tempErrores.push("Faltan datos en la tabla de impacto");
    } else {
      tempHotTipoValoracion.map((dat, index) => {
        if (dat.valueInf > dat.valueSup) {
          tempErrores.push(
            "El l??mite inferior en la tabla de impacto no puede ser mayor al superior en la fila " +
              (index + 1) +
              " del impacto"
          );
        } else if (dat.valueInf < 0 || dat.valueSup < 0) {
          tempErrores.push(
            "No puede incluir un valor negativo en la fila " +
              (index + 1) +
              " para el impacto"
          );
        }
      });
    }
    tempHotTipoValoracion.map((dat) => {
      tempPorc += dat.valueProb;
    });
    if (tempPorc >= 99.9) {
      tempPorc = Math.round(tempPorc);
    }
    if (tempPorc !== 100) {
      tempErrores.push(
        "La probabilidad para el impacto debe sumar el 100%, asegurese de solo usar n??meros"
      );
    }
    //Validar tabla de frecuencia Anual
    nulosVI = 0;
    nulosVS = 0;
    nulosVP = 0;
    tempPorc = 0;
    datValueInfTemp = null;
    if (tipoFrecuenciaA) {
      if (tipoFrecuenciaA === "M??todo 1 (Por rangos)") {
        tempHotFrecuenciaA1.map((dat, index) => {
          datValueInfTemp = tempHotFrecuenciaA1[index - 1]
            ? tempHotFrecuenciaA1[index - 1].valueInf
            : null;
          if (!dat.valueInf || datValueInfTemp === 0) {
            if (index !== 0) {
              nulosVI += 1;
            }
          }
          if (!dat.valueSup || datValueInfTemp !== 0) {
            if (index !== 0) {
              nulosVS += 1;
            }
          }
          if (!dat.valueProb) {
            nulosVP += 1;
          }
        });
        if (nulosVI === 10 || nulosVS === 10 || nulosVP === 10) {
          tempErrores.push("Faltan datos en la tabla de frecuencia anual");
        } else {
          tempHotFrecuenciaA1.map((dat, index) => {
            if (dat.valueInf > dat.valueSup) {
              tempErrores.push(
                "El l??mite inferior en la tabla frecuencia anual no puede ser mayor al superior en la fila " +
                  (index + 1) +
                  " de la frecuencia anual"
              );
            } else if (dat.valueInf < 0 || dat.valueSup < 0) {
              tempErrores.push(
                "No puede incluir un valor negativo en la fila " +
                  (index + 1) +
                  " para la frecuencia anual"
              );
            }
          });
        }
        tempHotFrecuenciaA1.map((dat) => {
          tempPorc += dat.valueProb;
        });
        if (tempPorc >= 99.9) {
          tempPorc = Math.round(tempPorc);
        }
        if (tempPorc !== 100) {
          tempErrores.push(
            "La probabilidad en la frecuencia debe sumar el 100%, asegurese de solo usar n??meros"
          );
        }
      } else if (tipoFrecuenciaA === "M??todo 2 (Poisson)") {
        tempHotFrecuenciaA2.map((dat) => {
          if (!dat.veces) {
            nulosVI += 1;
          }
          if (!dat.a??os) {
            nulosVS += 1;
          }
        });
        if (nulosVI === 10 || nulosVS === 10 || nulosVI !== nulosVS) {
          tempErrores.push("Faltan datos en la tabla de frecuencia anual");
        }
      } else if (tipoFrecuenciaA === "M??todo 3 (Binomial)") {
        tempHotFrecuenciaA3.map((dat) => {
          if (!dat.poblacion) {
            nulosVI += 1;
          }
          if (!dat.probabilidad) {
            nulosVS += 1;
          }
        });
        if (nulosVI === 10 || nulosVS === 10 || nulosVI !== nulosVS) {
          tempErrores.push("Faltan datos en la tabla de frecuencia anual");
        }
      }
    } else {
      tempErrores.push("Seleccione un tipo de frecuencia anual");
    }
    //Validaci??n para la frecuencia 2
    nulosVI = 0;
    nulosVS = 0;
    nulosVP = 0;
    tempPorc = null;
    datValueInfTemp = null;
    if (tipoFrecuencia2 && labelFrecuencia2) {
      if (tipoFrecuencia2 === "M??todo 1 (Por rangos)") {
        tempHotFrecuencia21.map((dat, index) => {
          datValueInfTemp = tempHotFrecuencia21[index - 1]
            ? tempHotFrecuencia21[index - 1].valueInf
            : null;
          if (!dat.valueInf) {
            if (index !== 0 || datValueInfTemp === 0) {
              nulosVI += 1;
            }
          }
          if (!dat.valueSup || datValueInfTemp !== 0) {
            if (index !== 0) {
              nulosVS += 1;
            }
          }
          if (!dat.valueProb) {
            nulosVP += 1;
          }
        });
        if (nulosVI === 10 || nulosVS === 10 || nulosVP === 10) {
          tempErrores.push("Faltan datos en la tabla de frecuencia 2");
        } else {
          tempHotFrecuencia21.map((dat, index) => {
            if (dat.valueInf > dat.valueSup) {
              tempErrores.push(
                "El l??mite inferior en la tabla frecuencia 2 no puede ser mayor al superior en la fila " +
                  (index + 1)
              );
            }
          });
        }
        tempHotFrecuencia21.map((dat) => {
          tempPorc += dat.valueProb;
        });
        if (tempPorc >= 99.9) {
          tempPorc = Math.round(tempPorc);
        }
        if (tempPorc !== 100) {
          tempErrores.push(
            "La probabilidad en la frecuencia debe sumar el 100%, asegurese de solo usar n??meros"
          );
        }
      } else if (tipoFrecuencia2 === "M??todo 2 (Poisson)") {
        tempHotFrecuencia22.map((dat) => {
          if (!dat.veces) {
            nulosVI += 1;
          }
        });
        if (nulosVI === 10) {
          tempErrores.push("Faltan datos en la tabla de frecuencia 2");
        }
      } else if (tipoFrecuencia2 === "M??todo 3 (Binomial)") {
        tempHotFrecuencia23.map((dat) => {
          if (!dat.poblacion) {
            nulosVI += 1;
          }
          if (!dat.probabilidad) {
            nulosVS += 1;
          }
        });
        if (nulosVI === 10 || nulosVS === 10 || nulosVI !== nulosVS) {
          tempErrores.push("Faltan datos en la tabla de frecuencia 2");
        }
      }
    } else if (labelFrecuencia2) {
      tempErrores.push("Seleccione un tipo de frecuencia 2");
    }

    //Validaci??n para la duraci??n
    nulosVI = 0;
    nulosVS = 0;
    nulosVP = 0;
    tempPorc = null;
    datValueInfTemp = null;
    if (tempHotDuracion && tabDuracion) {
      tempHotDuracion.map((dat, index) => {
        datValueInfTemp = tempHotDuracion[index - 1]
          ? tempHotDuracion[index - 1].valueInf
          : null;
        if (!dat.valueInf || datValueInfTemp === 0) {
          if (index !== 0) {
            nulosVI += 1;
          }
        }
        if (!dat.valueSup || datValueInfTemp !== 0) {
          if (index !== 0) {
            nulosVS += 1;
          }
        }
        if (!dat.valueProb) {
          nulosVP += 1;
        }
      });
      if (nulosVI === 10 || nulosVS === 10 || nulosVP === 10) {
        tempErrores.push("Faltan datos en la tabla de duraci??n");
      }
      tempHotDuracion.map((dat) => {
        tempPorc += dat.valueProb;
      });
      if (tempPorc >= 99.9) {
        tempPorc = Math.round(tempPorc);
      }
      if (tempPorc !== 100) {
        tempErrores.push(
          "La probabilidad en la duraci??n debe sumar el 100%, asegurese de solo usar n??meros"
        );
      }
    }

    if (tabDuracion) {
      if (!horarioproceso) {
        tempErrores.push(
          "Debe seleccionar un horario de servicio para continuar"
        );
      }
    }

    if (tempErrores.length !== 0) {
      setErroresModal(tempErrores);
    } else {
      sendData(tipoFrecuenciaA, tipoFrecuencia2, horarioproceso);
    }
  };

  const sendData = (tipoFrecuenciaA, tipoFrecuencia2, horarioprocesoT) => {
    let impacto = [];
    let frecuenciaA = [];
    let frecuencia2 = [];
    let duracion = [];
    let valoracion = document.getElementById("tipoValoracion").value;

    let tempHotTipoValoracion = hotTipoValoracion;
    let tempHotFrecuenciaA1 = hotFrecuenciaA1;
    let tempHotFrecuenciaA2 = hotFrecuenciaA2;
    let tempHotFrecuenciaA3 = hotFrecuenciaA3;
    let tempHotDuracion = hotDuracion;
    let tempHotFrecuencia21 = hotFrecuencia21;
    let tempHotFrecuencia22 = hotFrecuencia22;
    let tempHotFrecuencia23 = hotFrecuencia23;

    //Creaci??n de datos para la tabla de impacto

    tempHotTipoValoracion.map((dat, index) => {
      impacto.push([dat.valueInf, dat.valueSup, dat.valueProb]);
    });

    //Creaci??n de datos para la tabla de frecuencia anual
    if (tipoFrecuenciaA === "M??todo 1 (Por rangos)") {
      tempHotFrecuenciaA1.map((dat, index) => {
        frecuenciaA.push([dat.valueInf, dat.valueSup, dat.valueProb]);
      });
    } else if (tipoFrecuenciaA === "M??todo 2 (Poisson)") {
      tempHotFrecuenciaA2.map((dat) => {
        if (dat.veces && dat.a??os) {
          frecuenciaA.push([dat.veces, dat.a??os]);
        } else {
          frecuenciaA.push([null, null]);
        }
      });
    } else if (tipoFrecuenciaA === "M??todo 3 (Binomial)") {
      tempHotFrecuenciaA3.map((dat) => {
        if (dat.poblacion && dat.probabilidad) {
          frecuenciaA.push([dat.poblacion, dat.probabilidad]);
        } else {
          frecuenciaA.push([null, null]);
        }
      });
    }

    //creaci??n de datos para la tabla de duraci??n
    if (tabDuracion) {
      tempHotDuracion.map((dat, index) => {
        duracion.push([dat.valueInf, dat.valueSup, dat.valueProb]);
      });
    } else {
      duracion = [];
    }

    //Creaci??n de datos para la tabla de frecuencia 2
    if (tabTipoFrecuencia2) {
      if (tipoFrecuencia2 === "M??todo 1 (Por rangos)") {
        tempHotFrecuencia21.map((dat, index) => {
          //if (dat.valueSup && dat.valueInf && dat.valueProb) {
          //  frecuencia2.push([dat.valueInf, dat.valueSup, dat.valueProb]);
          //} else {
          frecuencia2.push([dat.valueInf, dat.valueSup, dat.valueProb]);
          //  if (index !== 0) {
          //    frecuencia2.push([null, null, null]);
          //  } else {
          //    frecuencia2.push([dat.valueInf, dat.valueSup, dat.valueProb]);
          //  }
          //}
        });
      } else if (tipoFrecuencia2 === "M??todo 2 (Poisson)") {
        tempHotFrecuencia22.map((dat) => {
          if (dat.veces) {
            frecuencia2.push([dat.veces]);
          } else {
            frecuencia2.push([null]);
          }
        });
      } else if (tipoFrecuencia2 === "M??todo 3 (Binomial)") {
        tempHotFrecuencia23.map((dat) => {
          if (dat.poblacion && dat.probabilidad) {
            frecuencia2.push([dat.poblacion, dat.probabilidad]);
          } else {
            frecuencia2.push([null, null]);
          }
        });
      }
    } else {
      frecuencia2 = [];
    }

    const data = {
      val: valoracion,
      anual: tipoFrecuenciaA,
      frec: tipoFrecuencia2,
      imp: impacto,
      d: duracion,
      f2: frecuencia2,
      fanu: frecuenciaA,
      horarioproceso: horarioprocesoT,
      analista: serviceAAD.getUser().userName,
    };
    setDataEnviada(data);

    $("body").addClass("no-scroll");
    setLoading(true);
    let resp_json;
    let compa??ia_temp = data.analista.split("@")[1].split(".")[0].toLowerCase();
    if (compa??ia_temp === "bam" || compa??ia_temp === "banistmo") {
      $.ajax({
        data: data,
        url: process.env.REACT_APP_API_URL + "/dropdown/",
        type: "POST",
        headers: {
          Authorization: "Bearer " + serviceAAD.getToken(),
        },
        success: function (json) {
          resp_json = json;
          if (json !== "error") {
            setDataCalculada(json);
            setLoading(false);
            setButtons(true);
          } else {
            window.alert("Error ocurrido en el c??lculo");
            setLoading(false);
            setButtons(true);
          }
        },
      });
    } else {
      sendMessageSocket(data);
    }
  };
  function limpiar(_callback) {
    _callback();
    setTimeout(() => {
      setEstadoPost({ id: 0, data: null });
    }, 3000);
  }
  const saveData = (e) => {
    e.preventDefault();
    setLoadingSave(true);

    let temp = [];
    //Calculo para datos del impacto
    let impacto = {
      limite_inf_impacto: null,
      limite_sup_impacto: null,
      probabilidad_impacto: null,
    };
    dataEnviada.imp.map((dat) => {
      if (dat[0] !== null) {
        temp.push(dat[0]);
      }
    });
    impacto.limite_inf_impacto = temp.join();
    temp = [];
    dataEnviada.imp.map((dat) => {
      if (dat[1] !== null) {
        temp.push(dat[1]);
      }
    });
    impacto.limite_sup_impacto = temp.join();
    temp = [];
    dataEnviada.imp.map((dat) => {
      if (dat[2] !== null) {
        temp.push(dat[2]);
      }
    });
    impacto.probabilidad_impacto = temp.join();
    /////////////////////////////////////////////////////////////////////
    temp = [];
    let impacto_duracion = {
      horarioproceso: null,
      limite_inf_duracion: null,
      limite_sup_duracion: null,
      probabilidad_duracion: null,
    };

    impacto_duracion.horarioproceso = dataEnviada.horarioproceso;
    dataEnviada.d.map((dat) => {
      if (dat[0] !== null) {
        temp.push(dat[0]);
      }
    });
    impacto_duracion.limite_inf_duracion = temp.join();
    temp = [];
    dataEnviada.d.map((dat) => {
      if (dat[1] !== null) {
        temp.push(dat[1]);
      }
    });
    impacto_duracion.limite_sup_duracion = temp.join();
    temp = [];
    dataEnviada.d.map((dat) => {
      if (dat[2] !== null) {
        temp.push(dat[2]);
      }
    });
    impacto_duracion.probabilidad_duracion = temp.join();
    ///////////////////////////////////////////////////
    temp = impacto.probabilidad_impacto.split(",");
    temp.map((dat, index) => {
      temp[index] = parseInt(dat) / 100;
    });

    let probabilidad_impactovar = temp.join();
    //////////////////////////////////////////////////
    const timeElapsed = Date.now();
    const today = new Date(timeElapsed);
    //////////////////////////////////////////////////
    let frecuencia_anual_temp = {
      tipofrecuencia: "Frecuencia Anual",
      metodofrecuencia: document.getElementById("tipoFrecuenciaA").value,
      limite_inf: "",
      limite_sup: "",
      probabilidad: "",
      veces: "",
      anios: "",
      poblacion: "",
    };
    temp = [];
    dataEnviada.fanu.map((dat) => {
      /* if (dat.valueInf && dat.valueProb) {
        temp.push(dat.valueInf);
      } */
      if (dat[0] !== null) {
        temp.push(dat[0]);
      }
    });
    frecuencia_anual_temp.limite_inf = temp.join();
    temp = [];
    dataEnviada.fanu.map((dat) => {
      /* if (dat.valueSup) {
        temp.push(dat.valueSup);
      } */
      if (dat[1] !== null) {
        temp.push(dat[1]);
      }
    });
    frecuencia_anual_temp.limite_sup = temp.join();
    temp = [];
    dataEnviada.fanu.map((dat) => {
      /* if (dat.valueProb) {
        temp.push(dat.valueProb);
      } */
      if (dat[2] !== null) {
        temp.push(dat[2]);
      }
    });
    frecuencia_anual_temp.probabilidad = temp.join();

    frecuencia_anual_temp.veces = hotFrecuenciaA2[0].veces
      ? hotFrecuenciaA2[0].veces.toString()
      : "";
    frecuencia_anual_temp.anios = hotFrecuenciaA2[0].a??os
      ? hotFrecuenciaA2[0].a??os.toString()
      : "";

    if (frecuencia_anual_temp.probabilidad === "") {
      frecuencia_anual_temp.probabilidad = hotFrecuenciaA3[0].probabilidad
        ? hotFrecuenciaA3[0].probabilidad.toString()
        : null;
    }

    frecuencia_anual_temp.poblacion = hotFrecuenciaA3[0].poblacion
      ? hotFrecuenciaA3[0].poblacion.toString()
      : "";
    //////////////////////////////////////////////////////////////////////
    let frecuencia_secundaria = {
      tipofrecuencia: "Frecuencia Secundaria",
      metodofrecuencia: document.getElementById("tipoFrecuencia2")
        ? document.getElementById("tipoFrecuencia2").value
        : "",
      limite_inf: "",
      limite_sup: "",
      probabilidad: "",
      veces: "",
      anios: "",
      poblacion: "",
    };
    temp = [];
    dataEnviada.f2.map((dat) => {
      if (dat[0] !== null) {
        temp.push(dat[0]);
      }
    });
    frecuencia_secundaria.limite_inf = temp.join();
    temp = [];
    dataEnviada.f2.map((dat) => {
      if (dat[1] !== null) {
        temp.push(dat[1]);
      }
    });
    frecuencia_secundaria.limite_sup = temp.join();
    temp = [];
    dataEnviada.f2.map((dat) => {
      if (dat[2] !== null) {
        temp.push(dat[2]);
      }
    });
    frecuencia_secundaria.probabilidad = temp.join();

    frecuencia_secundaria.veces = hotFrecuencia22[0].veces
      ? hotFrecuencia22[0].veces.toString()
      : "";
    frecuencia_secundaria.anios = hotFrecuencia22[0].a??os
      ? hotFrecuencia22[0].a??os.toString()
      : "";

    if (frecuencia_secundaria.probabilidad === "") {
      frecuencia_secundaria.probabilidad = hotFrecuencia23[0].probabilidad
        ? hotFrecuencia23[0].probabilidad.toString()
        : "";
    }
    frecuencia_secundaria.poblacion = hotFrecuencia23[0].poblacion
      ? hotFrecuencia23[0].poblacion.toString()
      : "";
    let tempPg = [];
    let tempIdG = [];
    const data = {
      impacto: impacto,
      impacto_duracion: impacto_duracion,
      efecto: {
        tipoefecto: document.getElementById("tipoEfecto").value,
        nombreefecto: document.getElementById("nombreEfecto").value,
        descripcionefecto: document.getElementById("descripcionEfecto").value,
        metodovaloracion: dataEnviada.val,
        resultado_p50: dataCalculada.result.P50,
        resultado_p95: dataCalculada.result.P95,
        resultado_p99: dataCalculada.result.P99,
        resultado_impactos_hora:
          dataCalculada.resultados["Impacto por hora promedio"] !== ""
            ? dataCalculada.resultados["Impacto por hora promedio"]
            : null,
        media: dataCalculada.result.media,
        fuente:
          document.getElementById("ubicacionFuente").value == ""
            ? "No tiene"
            : document.getElementById("ubicacionFuente").value,
        descripcionfuente: document.getElementById("descripcionFuente").value,
        limite_inf_impactovar: JSON.stringify(
          dataCalculada.frec_tiempos.Inf_VAR
        )
          .replace("[", "")
          .replace("]", ""),
        limite_sup_impactovar: JSON.stringify(
          dataCalculada.frec_tiempos.Sup_VAR
        )
          .replace("[", "")
          .replace("]", ""),
        probabilidad_impactovar: JSON.stringify(
          dataCalculada.frec_tiempos.Prob_VAR
        )
          .replace("[", "")
          .replace("]", ""),
        otroriesgo: document.getElementById("materializado").value,
        fechaejecucion: today,
        duraciontotalejecucion: new Date(
          dataCalculada.frec_tiempos["DuracionTotalEjecucion"] * 1000
        )
          .toISOString()
          .substr(11, 8),
        tiempomezcla1: new Date(
          dataCalculada.frec_tiempos["TiempoMezcla1"] * 1000
        )
          .toISOString()
          .substr(11, 8),
        tiempomezcla2: new Date(
          dataCalculada.frec_tiempos["TiempoMezcla2"] * 1000
        )
          .toISOString()
          .substr(11, 8),
        tiempomezcla3: new Date(
          dataCalculada.frec_tiempos["TiempoMezcla3"] * 1000
        )
          .toISOString()
          .substr(11, 8),
        ttagregacion: new Date(
          dataCalculada.frec_tiempos["TTAgregacion"] * 1000
        )
          .toISOString()
          .substr(11, 8),
        frecuenciaanualmaxima: dataCalculada.frec_tiempos["AnualMax"],
        frecuencia2maxima: dataCalculada.frec_tiempos["F2Max"],
        duracionmaxima: dataCalculada.frec_tiempos["DurMax"],
        combfqhoraxduracionmaxima: dataCalculada.frec_tiempos["combFq"],
        frecuenciaanual_esperanza:
          dataCalculada.frec_tiempos["FrecuenciaAnual_esperanza"],
        frecuenciaanual_p50: dataCalculada.frec_tiempos["FrecuenciaAnual_P50"],
        impacto_p50: dataCalculada.frec_tiempos["Impacto_p50"],
        analista: document.getElementById("analista").value,
        var: document.getElementById("var").value,
        motivoexclusion: document.getElementById("motivoExclusion")
          ? document.getElementById("motivoExclusion").value
          : "",
        min_impacto_vector: dataMinVec,
        max_impacto_vector: dataMaxVec,
        nombre_fuente: document.getElementById("nombreTabla").value,
        tipo_moneda: document.getElementById("tipoMonedaFuente").value,
        filtros_fuente: document.getElementById("filtrosFuente").value,
        idgrupo_riesgos: tempIdG.length === 0 ? "" : tempIdG.join(), //TODO: falta implementar
        prob_gr_riesgo: tempPg, //TODO: falta implementar
        campo_fuente: document.getElementById("nombreCampo").value,
      },
      frecuencia_anual: frecuencia_anual_temp,
      frecuencia_secundaria: frecuencia_secundaria,
      ImpF: dataCalculada.ImpF,
      VectorFqA: dataCalculada.VectorFqA,
      ma: dataCalculada.ma_front,
      agreg: "No",
    };
    fetch(process.env.REACT_APP_API_URL + "/impacto/", {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
        Authorization: "Bearer " + serviceAAD.getToken(),
      },
    })
      .then((data) =>
        data.json().then((response) => {
          if (data.status >= 200 && data.status < 300) {
            setEstadoPost({ id: 2, data: response });
            limpiar(() => {});
            senDataOC(response.idefecto);
            localStorage.setItem("idEfecto", response.idefecto);
            setTimeout(() => {
              setLoadingSave(false);
              history.push("/editarCrearEfecto");
            }, 2500);
          } else if (data.status >= 500) {
            setEstadoPost({ id: 5, data: response });
            limpiar(() => {});
            setLoadingSave(false);
          } else if (data.status >= 400 && data.status < 500) {
            setEstadoPost({ id: 4, data: response });
            limpiar(() => {});
            setLoadingSave(false);
          }
        })
      )
      .catch(function (error) {
        console.error(error);
        setLoadingSave(false);
      });
  };

  const senDataOC = (idEfecto) => {
    let listOC = {};

    if (dataGroup) {
      dataGroup.map((oc) => {
        listOC[oc.idoc] = document.getElementById(
          "porcentajeG" + oc.idoc
        ).value;
      });
    }
    let dataOC = {
      idefecto: idEfecto,
      idoc: listOC,
    };

    fetch(process.env.REACT_APP_API_URL + "/rx_efectos_OC/", {
      method: "POST",
      body: JSON.stringify(dataOC),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
        Authorization: "Bearer " + serviceAAD.getToken(),
      },
    })
      .then((data) =>
        data.json().then((response) => {
          if (data.status >= 200 && data.status < 300) {
            setEstadoPost({ id: 2, data: response });
            limpiar(() => {});
            setLoadingSave(false);
          } else if (data.status >= 500) {
            setEstadoPost({ id: 5, data: response });
            limpiar(() => {});
            setLoadingSave(false);
          } else if (data.status >= 400 && data.status < 500) {
            setEstadoPost({ id: 4, data: response });
            limpiar(() => {});
            setLoadingSave(false);
          }
        })
      )
      .catch(function (error) {
        console.error(error);
        setLoadingSave(false);
      });
  };

  const addResume = () => {
    let createXLSLFormat3 = [];
    let createXLSLFormat = data_m7(dataCalculada.resultados);
    let createXLSLFormat2 = data_m7(dataCalculada.rangosImp);
    let createXLSLFormat4 = data_excel(dataCalculada.Insumos);

    /* File Name */
    let d = new Date();
    let filename =
      "M7_IND_" +
      d.getDate() +
      ":" +
      d.getHours() +
      "-" +
      d.getMinutes() +
      "-" +
      d.getSeconds() +
      ".xlsx";

    /* Sheet Name */
    let ws_name = "Resultados";
    let ws_name2 = "Impacto";
    let ws_name4 = "Insumos";

    let wb = XLSX.utils.book_new(),
      ws = XLSX.utils.aoa_to_sheet(createXLSLFormat),
      ws2 = XLSX.utils.aoa_to_sheet(createXLSLFormat2),
      ws4 = XLSX.utils.aoa_to_sheet(createXLSLFormat4);

    /* Add worksheet to workbook */
    XLSX.utils.book_append_sheet(wb, ws, ws_name);
    XLSX.utils.book_append_sheet(wb, ws2, ws_name2);
    XLSX.utils.book_append_sheet(wb, ws4, ws_name4);

    if (dataEnviada.val != "Valoracion con duraci??n") {
      createXLSLFormat3 = data_m7(dataCalculada.fqA1);
      let ws3 = XLSX.utils.aoa_to_sheet(createXLSLFormat3);
      let ws_name3 = "Frecuencia";
      XLSX.utils.book_append_sheet(wb, ws3, ws_name3);
    }
    /* Write workbook and Download */
    XLSX.writeFile(wb, filename);
  };

  function data_m7(obj) {
    let head = [],
      rows = [],
      createXLSLFormat = [];
    for (let k in obj) {
      head.push(k);
      rows.push(obj[k]);
    }
    createXLSLFormat.push(head, rows);
    return createXLSLFormat;
  }

  function data_excel(obj) {
    let createXLSLFormatObj = [],
      xlsHeader = [];
    Object.keys(obj[0]).forEach(function (key) {
      xlsHeader.push(key);
    });
    createXLSLFormatObj.push(xlsHeader);
    for (let i = 0; i < obj.length; i++) {
      createXLSLFormatObj.push(Object.values(obj[i]));
    }
    return createXLSLFormatObj;
  }

  const addVector = async (vecMin, vecMax) => {
    let temp = [];
    hotVector.map((dat) => {
      if (dat.valores) {
        temp.push(dat.valores);
      }
    });

    let dataVect = JSON.stringify({
      VectorInicial: temp,
      min: vecMin,
      max: vecMax,
    });

    const result = await fetch(process.env.REACT_APP_API_URL + "/calculovector/", {
      method: "POST",
      body: dataVect,
      headers: {
        "Content-type": "application/json; charset=UTF-8",
        Authorization: "Bearer " + serviceAAD.getToken(),
      },
    });
    let data = await result.json();
    let l_inferior = Object.values(data["L. Inferior"]);
    let l_sup = Object.values(data["L. Superior"]);
    let prob = Object.values(data["Probabilidad"]);

    /* Llenar tabla de impacto */
    let tablaImpacto = hotTipoValoracion;
    if (l_inferior) {
      tablaImpacto.map((dataImp, index) => {
        hotTipoValoracion[index] = {
          valueInf: l_inferior[index],
          valueSup: l_sup[index],
          valueProb: prob[index]
            ? parseFloat((prob[index] * 100).toFixed(2))
            : null,
        };
      });
    }
    setHotTipoValoracion(tablaImpacto);
    setTabTipoValoracion(false);
    setTimeout(function () {
      setTabTipoValoracion(true);
    }, 1);
  };

  return (
    <>
      <AlertDismissibleExample alerta={estadoPost} />
      <ModalGrupoRiesgos
        show={modalShow}
        onHide={() => {
          setModalShow(false);
        }}
      />
      <ModalVector
        show={modalShowVector}
        onHide={() => {
          setModalShowVector(false);
        }}
      />
      {erroresModal ? (
        <ModalErrores
          show
          onHide={() => {
            setErroresModal(false);
          }}
        />
      ) : null}
      <Form id="formData" onSubmit={(e) => saveData(e)}>
        <Row className="mb-3">
          <Col md={12}>
            <h1 className="titulo">Informaci??n general del efecto</h1>
          </Col>
        </Row>
        <Row className="mb-3">
          <Col md={3}>
            <label className="label form-label">Id del Efecto</label>
          </Col>
          <Col md={3}>
            {/* <label className="texto form-label">Automatico</label> */}
            <input
              type="text"
              disabled
              className="form-control text-center texto"
              placeholder="ID Autom??tico"
              id="IDactivo"
              defaultValue="Automatico"
            ></input>
          </Col>
          <Col md={3}>
            <label className="label form-label">Analista RO</label>
          </Col>
          <Col md={3}>
            {/* <label className="texto form-label">Automatico</label> */}
            <input
              type="text"
              disabled
              className="form-control text-center texto"
              placeholder="ID Autom??tico"
              id="analista"
              defaultValue={
                serviceAAD.getUser().userName
                  ? serviceAAD.getUser().userName
                  : "AnonymousUser"
              }
            ></input>
          </Col>
        </Row>
        <Row className="mb-3">
          <Col md={3}>
            <label className="label form-label">Tipo de efecto*</label>
          </Col>
          <Col md={3}>
            {/* <label className="texto form-label">Automatico</label> */}
            <select className="form-control texto" required id="tipoEfecto">
              <option value="">-- Seleccione --</option>
              {dataTE
                ? dataTE.map((value) => {
                    return (
                      <option
                        value={value.valor}
                        key={value.idm_parametrosgenerales}
                      >
                        {value.valor}
                      </option>
                    );
                  })
                : null}
            </select>
          </Col>
          <Col md={3}>
            <label className="label form-label">Materializado en:</label>
          </Col>
          <Col md={3}>
            {/* <label className="texto form-label">Automatico</label> */}
            <select className="form-control texto" id="materializado">
              <option value="">-- Seleccione --</option>
              {dataME
                ? dataME.map((value) => {
                    return (
                      <option
                        value={value.valor}
                        key={value.idm_parametrosgenerales}
                      >
                        {value.valor}
                      </option>
                    );
                  })
                : null}
            </select>
          </Col>
        </Row>
        <Row className="mb-3">
          <Col md={3}>
            <label className="label form-label">Nombre del efecto*</label>
          </Col>
          <Col md={9}>
            <input
              required
              type="text"
              className="form-control text-center texto"
              placeholder="Ingrese nombre del efecto"
              id="nombreEfecto"
            ></input>
          </Col>
        </Row>
        <Row className="mb-3">
          <Col md={3}>
            <label className="label form-label">Descripci??n del efecto</label>
          </Col>
          <Col md={9}>
            <textarea
              className="form-control text-center"
              placeholder="Ingrese la descripci??n del efecto"
              rows="3"
              id="descripcionEfecto"
            ></textarea>
          </Col>
        </Row>
        <hr />
        <Row className="mb-3">
          <Col md={12}>
            <h1 className="titulo">Informaci??n para el VaR</h1>
          </Col>
        </Row>
        <Row className="mb-3">
          <Col md={3}>
            <label className="label form-label">Incluir en el Var</label>
          </Col>
          <Col md={3}>
            <select
              className="form-control texto"
              required
              id="var"
              onChange={(e) => setExclusion(!exclusion)}
            >
              <option value={"Si"} key={1}>
                Si
              </option>
              <option value={"No"} key={2}>
                No
              </option>
            </select>
          </Col>
          {exclusion ? (
            <>
              <Col md={3}>
                <label className="label form-label">Motivo de exclusi??n</label>
              </Col>
              <Col md={3}>
                <select
                  className="form-control texto"
                  required
                  id="motivoExclusion"
                >
                  <option value="">-- Seleccione --</option>
                  {dataMEx
                    ? dataMEx.map((value) => {
                        return (
                          <option
                            value={value.valor}
                            key={value.idm_parametrosgenerales}
                          >
                            {value.valor}
                          </option>
                        );
                      })
                    : null}
                </select>
              </Col>
            </>
          ) : null}
        </Row>
        {exclusion ? (
          <>
            <Row className="mb-3">
              <Col sm={3} xs={12}>
                <label className="label form-label">Justificaci??n</label>
              </Col>
              <Col sm={9} xs={12}>
                <textarea
                  className="form-control text-center"
                  placeholder="Ingrese la justificaci??n"
                  rows="3"
                  id="justificacion"
                ></textarea>
              </Col>
            </Row>
          </>
        ) : null}

        <Row>
          <Col sm={8} xs={12}></Col>
          <Col sm={4} xs={6}>
            <Button
              className="botonPositivo"
              onClick={() => {
                setModalShow(true);
              }}
            >
              A??adir Objetos de Costo
            </Button>
          </Col>
        </Row>
        <br />
        <Paper className={classes.root}>
          <TableContainer component={Paper} className={classes.container}>
            <Table className={"text"} stickyHeader aria-label="sticky table">
              {/* Inicio de encabezado */}
              <TableHead className="titulo">
                <TableRow>
                  {/* <StyledTableCell padding="checkbox"></StyledTableCell> */}
                  <StyledTableCell align="left">Id OC</StyledTableCell>
                  <StyledTableCell align="left">Nombre OC</StyledTableCell>
                  <StyledTableCell align="left">Porcentaje</StyledTableCell>
                </TableRow>
              </TableHead>
              {/* Fin de encabezado */}
              {/* Inicio de cuerpo de la tabla */}
              <TableBody>
                {dataGroup.map((row, index) => {
                  const isItemSelected = isSelected(row.idoc);
                  return (
                    <StyledTableRow
                      key={row.idoc}
                      hover
                      onClick={(event) => handleClick(event, row.idoc)}
                      selected={isItemSelected}
                      role="checkbox"
                      tabIndex={-1}
                    >
                      {/* <StyledTableCell component="th" scope="row">
                        <Checkbox checked={isItemSelected} />
                      </StyledTableCell> */}
                      <StyledTableCell component="th" scope="row">
                        {row.idoc !== null ? row.idoc : null}
                      </StyledTableCell>
                      <StyledTableCell align="left">
                        {row.nombre_oc !== null ? row.nombre_oc : null}
                      </StyledTableCell>
                      <StyledTableCell align="left">
                        <input
                          step="any"
                          type="number"
                          placeholder="Porcentaje (0-100)"
                          required
                          className="form-control text-center texto"
                          id={"porcentajeG" + row.idoc}
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
        <hr />
        <Row className="mb-3">
          <Col md={6}>
            <h1 className="titulo">C??lculos</h1>
          </Col>
        </Row>
        <Row className="mb-3">
          <Col md={2}>
            <label className="label form-label">Tipo de Moneda*:</label>
          </Col>
          <Col md={4}>
            <select
              className="form-control texto"
              id="tipoMonedaFuente"
              required
            >
              <option value="">-- Seleccione --</option>
              <option value={"COP"} key={1}>
                COP (Millones)
              </option>
              <option value={"USD"} key={2}>
                USD
              </option>
              <option value={"GTQ"} key={3}>
                GTQ
              </option>
            </select>
          </Col>
        </Row>
        <Row className="mb-3">
          <Col md={3}>
            <label className="label form-label">Tipo de Valoraci??n:</label>
          </Col>
          <Col md={3}>
            {labelHorario ? (
              <>
                <label className="label form-label">Horario de servicio:</label>
              </>
            ) : null}
          </Col>

          <Col md={3}>
            {labelFrecuenciaA ? (
              <>
                <label className="label form-label">
                  Tipo de Frecuencia Anual:
                </label>
              </>
            ) : null}
          </Col>

          <Col md={3}>
            {labelFrecuencia2 ? (
              <>
                <label className="label form-label">
                  Tipo de Frecuencia 2:
                </label>
              </>
            ) : null}
          </Col>
        </Row>
        {/* Selects para definir que se muestra en la tabla */}
        <Row>
          {/* Select para tipo de valoraci??n */}
          <Col md={3}>
            <select
              className="form-control texto"
              required
              id="tipoValoracion"
              onChange={cambiaValoracion}
            >
              <option value="">-- Seleccione --</option>
              {dataTV
                ? dataTV.map((value) => {
                    return (
                      <option
                        value={value.valor}
                        key={value.idm_parametrosgenerales}
                      >
                        {value.valor}
                      </option>
                    );
                  })
                : null}
            </select>
          </Col>
          {/* Select para Horario de servicio */}
          <Col md={3}>
            {labelHorario ? (
              <>
                <select
                  className="form-control texto"
                  required
                  id="horarioServicio"
                  onChange={cambiaValoracion}
                >
                  <option value="">-- Seleccione --</option>
                  {dataHS
                    ? dataHS.map((value) => {
                        return (
                          <option
                            value={value.valor}
                            key={value.idm_parametrosgenerales}
                          >
                            {value.valor}
                          </option>
                        );
                      })
                    : null}
                </select>
              </>
            ) : null}
          </Col>

          {/* Select para Tipo de Frecuencia Anual */}
          <Col md={3}>
            {labelFrecuenciaA ? (
              <>
                <select
                  className="form-control texto"
                  required
                  id="tipoFrecuenciaA"
                  onChange={cambiarFrecuenciaA}
                >
                  <option value="">-- Seleccione --</option>
                  {dataFA
                    ? dataFA.map((value) => {
                        return (
                          <option
                            value={value.valor}
                            key={value.idm_parametrosgenerales}
                          >
                            {value.valor}
                          </option>
                        );
                      })
                    : null}
                </select>{" "}
              </>
            ) : null}
          </Col>

          {/* Select para Tipo de Frecuencia 2 */}
          <Col md={3}>
            {labelFrecuencia2 ? (
              <>
                <select
                  className="form-control texto"
                  required
                  id="tipoFrecuencia2"
                  onChange={cambiarFrecuencia2}
                >
                  <option value="">-- Seleccione --</option>
                  {dataF2
                    ? dataF2.map((value) => {
                        return (
                          <option
                            value={value.valor}
                            key={value.idm_parametrosgenerales}
                          >
                            {value.valor}
                          </option>
                        );
                      })
                    : null}
                </select>
              </>
            ) : null}
          </Col>
        </Row>
        <Row className="mb-3 mt-2">
          {/* Tabla para impacto */}
          <Col md={3}>
            {tabTipoValoracion ? (
              <>
                <label className="label form-label">Impacto ($):</label>
                <br />
                <HotTable
                  data={hotTipoValoracion}
                  colHeaders={["L??m. Inf.", "L??m. Sup.", "Prob (%)"]}
                  rowHeaders={true}
                  height="auto"
                  width="auto"
                  licenseKey="non-commercial-and-evaluation"
                >
                  <HotColumn data="valueInf" type="numeric" />
                  <HotColumn data="valueSup" type="numeric" />
                  <HotColumn data="valueProb" type="numeric" />
                </HotTable>
                <br />
                <label className="text form-label">
                  * Diligenciar l??mite inferior y superior en t??rminos
                  monetarios.
                  <br />
                  NOTA: Usar datos num??ricos ??nicamente
                </label>
              </>
            ) : null}
          </Col>

          {/* Tabla para duraci??n */}
          <Col md={3}>
            {tabDuracion ? (
              <>
                <label className="label form-label">Duraci??n (Horas):</label>
                <br />
                <HotTable
                  data={hotDuracion}
                  colHeaders={["L??m. Inf.", "L??m. Sup.", "Prob (%)"]}
                  rowHeaders={true}
                  height="auto"
                  width="auto"
                  licenseKey="non-commercial-and-evaluation"
                >
                  <HotColumn data="valueInf" type="numeric" />
                  <HotColumn data="valueSup" type="numeric" />
                  <HotColumn data="valueProb" type="numeric" />
                </HotTable>
                <br />
                <label className="text form-label">
                  * Diligenciar l??mite inferior y superior en t??rminos de horas,
                  incluyendo puntos o comas solo para decimales. <br />
                  NOTA: Usar datos num??ricos ??nicamente
                </label>{" "}
              </>
            ) : null}
          </Col>
          {/* Tabla para Frecuencia Anual */}
          <Col md={3}>
            {tabTipoFrecuenciaA && tabTipoFrecuenciaA.state ? (
              <>
                <label className="label form-label">Frecuencia Anual:</label>
                <br />
                {tabTipoFrecuenciaA.table}
                <br />
                <label className="text form-label">
                  * Diligenciar l??mite inferior y superior en t??rminos
                  monetarios. NOTA: Usar datos num??ricos ??nicamente
                </label>
              </>
            ) : null}
          </Col>

          {/* Tabla para Frecuencia 2 */}
          {tabTipoFrecuencia2 && tabTipoFrecuencia2.state ? (
            <>
              <Col md={3}>
                <label className="label form-label">Frecuencia 2:</label>
                <br />
                {tabTipoFrecuencia2.table}
                <br />
                <label className="text form-label">
                  * Diligenciar l??mite inferior y superior en t??rminos
                  monetarios. NOTA: Usar datos num??ricos ??nicamente
                </label>
              </Col>
            </>
          ) : null}
        </Row>
        {tabTipoValoracion ? (
          <>
            <Row className="mb-3">
              <Col md={1}></Col>
              <Col md={3}>
                <Button
                  className="botonPositivo"
                  onClick={() => {
                    setModalShowVector(true);
                  }}
                >
                  Calcular rangos desde un vector
                </Button>
              </Col>
              <Col md={4}></Col>
              {tabTipoFrecuenciaA && tabTipoFrecuenciaA.state ? (
                <Col md={3}>
                  <Button
                    className="botonPositivo"
                    disabled={loading}
                    onClick={sendCalificacion}
                  >
                    Calcular
                  </Button>
                </Col>
              ) : null}
            </Row>
          </>
        ) : null}

        <Row className="mb-3 justify-content-center">
          {loading ? (
            <>
              <Row className="mb-3 justify-content-center">
                <Col className="col-auto text-center">
                  <ReactLoading
                    type={"spin"}
                    color={"#FDDA24"}
                    height={80}
                    width={80}
                  />
                </Col>
              </Row>
            </>
          ) : dataCalculada ? (
            <>
              <Col>
                <Row className="mb-3">
                  {dataCalculada.VectorIm !== "null" ? (
                    <Col>
                      <Plot
                        responsive
                        data={[
                          {
                            x: dataCalculada.VectorIm.x,
                            y: dataCalculada.VectorIm.y,
                            type: "scatter",
                            mode: "lines",
                            marker: { color: "#00c389" },
                            xaxis: "x1",
                            yaxis: "y1",
                            showlegend: false,
                          },
                        ]}
                        layout={{
                          width: 300,
                          height: 350,
                          bargap: 0.05,
                          bargroupgap: 0.2,
                          barmode: "overlay",
                          title: "<b>Impacto</b>",
                          font: {
                            family: "Nunito, sans-serif",
                            color: "#2c2a29",
                          },
                        }}
                      />
                    </Col>
                  ) : null}
                  {dataCalculada.VectorFqA !== "null" ? (
                    <Col>
                      <Plot
                        responsive
                        data={[
                          {
                            x: dataCalculada.VectorFqA,
                            type: "histogram",
                            marker: {
                              color: "#fdda24",
                            },
                          },
                        ]}
                        layout={{
                          width: 300,
                          height: 350,
                          bargap: 0.05,
                          bargroupgap: 0.2,
                          barmode: "overlay",
                          title: "<b>Frecuencia Anual</b>",
                          font: {
                            family: "Nunito, sans-serif",
                            color: "#2c2a29",
                          },
                        }}
                      />
                    </Col>
                  ) : null}

                  {dataCalculada.VectorFqH !== "null" ? (
                    <Col>
                      <Plot
                        responsive
                        data={[
                          {
                            x: dataCalculada.VectorFqH,
                            type: "histogram",
                            marker: {
                              color: "#fdda24",
                            },
                          },
                        ]}
                        layout={{
                          width: 300,
                          height: 350,
                          bargap: 0.05,
                          bargroupgap: 0.2,
                          barmode: "overlay",
                          title: "<b>Frecuencia 2</b>",
                          font: {
                            family: "Nunito, sans-serif",
                            color: "#2c2a29",
                          },
                        }}
                      />
                    </Col>
                  ) : null}

                  {dataCalculada.VectorDur !== "null" ? (
                    <Col>
                      <Plot
                        responsive
                        data={[
                          {
                            mode: "lines",
                            type: "scatter",
                            x: dataCalculada.VectorDur.x,
                            y: dataCalculada.VectorDur.y,
                            xaxis: "x1",
                            yaxis: "y1",
                            marker: { color: "#00c389" },
                            showlegend: false,
                          },
                        ]}
                        layout={{
                          width: 300,
                          height: 350,
                          title: "<b>Duraci??n</b>",
                          font: {
                            family: "Nunito, sans-serif",
                            color: "#2c2a29",
                          },
                          xaxis: {
                            range: [
                              0,
                              Math.max.apply(null, dataCalculada.VectorDur.x),
                            ],
                          },
                        }}
                      />
                    </Col>
                  ) : null}
                  {dataCalculada.ma !== "null" ? (
                    <Col>
                      <Plot
                        responsive
                        data={[
                          {
                            mode: "lines",
                            type: "scatter",
                            x: dataCalculada.ma.x,
                            y: dataCalculada.ma.y,
                            xaxis: "x1",
                            yaxis: "y1",
                            marker: { color: "#00c389" },
                            showlegend: false,
                          },
                        ]}
                        layout={{
                          width: 300,
                          height: 350,
                          title: "<b>Matriz Agregada de P??rdidas</b>",
                          font: {
                            family: "Nunito, sans-serif",
                            color: "#2c2a29",
                          },
                          xaxis: {
                            range: [
                              0,
                              Math.max.apply(null, dataCalculada.ma.x),
                            ],
                          },
                        }}
                      />
                    </Col>
                  ) : null}
                </Row>
                <Row className="mb-3 justify-content-center">
                  {dataCalculada.franjas_res !== "null" ? (
                    <>
                      <Col className="col-auto text-center">
                        <Paper className={classes.root}>
                          <TableContainer
                            component={Paper}
                            className={classes.container}
                          >
                            <Table
                              className={"text"}
                              stickyHeader
                              sx={{ minWidth: 650 }}
                              aria-label="sticky table"
                            >
                              {/* Inicio de encabezado */}
                              <TableHead className="titulo">
                                <TableRow>
                                  <StyledTableCell align="center">
                                    Rango
                                  </StyledTableCell>
                                  <StyledTableCell align="center">
                                    P50
                                  </StyledTableCell>
                                  <StyledTableCell align="center">
                                    P95
                                  </StyledTableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {dataCalculada.franjas_res[
                                  "Rangos horarios"
                                ].map((row, index) => {
                                  return (
                                    <>
                                      <TableRow
                                        key={index}
                                        sx={{
                                          "&:last-child td, &:last-child th": {
                                            border: 0,
                                          },
                                        }}
                                      >
                                        <TableCell component="th" scope="row">
                                          {row}
                                        </TableCell>
                                        <TableCell align="center">
                                          {
                                            dataCalculada.franjas_res[
                                              "Exposicion P50"
                                            ][index]
                                          }
                                        </TableCell>
                                        <TableCell align="center">
                                          {
                                            dataCalculada.franjas_res[
                                              "Exposicion P95"
                                            ][index]
                                          }
                                        </TableCell>
                                      </TableRow>
                                    </>
                                  );
                                })}
                              </TableBody>
                            </Table>
                          </TableContainer>
                        </Paper>
                      </Col>
                    </>
                  ) : null}
                  <Col className="col-auto text-center">
                    <Paper className={classes.root}>
                      <TableContainer
                        component={Paper}
                        className={classes.container}
                      >
                        <Table
                          className={"text"}
                          stickyHeader
                          sx={{ minWidth: 650 }}
                          aria-label="sticky table"
                        >
                          {/* Inicio de encabezado */}
                          <TableHead className="titulo">
                            <TableRow>
                              <StyledTableCell align="center">
                                Promedio
                              </StyledTableCell>
                              <StyledTableCell align="center">
                                P50
                              </StyledTableCell>
                              <StyledTableCell align="center">
                                P95
                              </StyledTableCell>
                              <StyledTableCell align="center">
                                P99
                              </StyledTableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            <TableRow
                              key={1}
                              sx={{
                                "&:last-child td, &:last-child th": {
                                  border: 0,
                                },
                              }}
                            >
                              <TableCell component="th" scope="row">
                                {dataCalculada.result.media}
                              </TableCell>
                              <TableCell align="center">
                                {dataCalculada.result.P50}
                              </TableCell>
                              <TableCell align="center">
                                {dataCalculada.result.P95}
                              </TableCell>
                              <TableCell align="center">
                                {dataCalculada.result.P99}
                              </TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </Paper>
                  </Col>
                </Row>
              </Col>
            </>
          ) : null}
        </Row>
        <Row className="mb-3">
          <Col md={12}>
            <h1 className="titulo">Fuente de informaci??n</h1>
          </Col>
        </Row>
        <Row className="mb-3">
          <Col md={3}>
            <label className="label form-label">Ubicaci??n de la fuente:</label>
          </Col>
          <Col md={3}>
            <select className="form-control texto" id="ubicacionFuente">
              <option value="">-- Seleccione --</option>
              {dataUF
                ? dataUF.map((value) => {
                    return (
                      <option
                        value={value.valor}
                        key={value.idm_parametrosgenerales}
                      >
                        {value.valor}
                      </option>
                    );
                  })
                : null}
            </select>
          </Col>
          <Col md={2}>
            <label className="label form-label">Nombre:</label>
          </Col>
          <Col md={4}>
            <input
              type="text"
              className="form-control texto"
              placeholder="Nombre t??cnico de la tabla"
              id="nombreTabla"
            ></input>
          </Col>
        </Row>
        <Row className="mb-3">
          <Col md={3}>
            <label className="label form-label">Nombre de campo:</label>
          </Col>
          <Col md={3}>
            <input
              type="text"
              className="form-control texto"
              placeholder="Nombre de campo elegido"
              id="nombreCampo"
            ></input>
          </Col>
        </Row>
        <Row className="mb-3">
          <Col md={3}>
            <label className="label form-label">
              Filtros y transformaciones:
            </label>
          </Col>
          <Col md={3}>
            <textarea
              className="form-control text-center"
              placeholder="Ingrese los filtros y las transformaciones"
              rows="2"
              id="filtrosFuente"
            ></textarea>
          </Col>
          <Col md={2}>
            <label className="label form-label">Descripci??n:</label>
          </Col>
          <Col md={4}>
            <textarea
              className="form-control text-center"
              placeholder="Ingrese la descripci??n de la fuente"
              rows="2"
              id="descripcionFuente"
            ></textarea>
          </Col>
        </Row>
        <Row className="mb-3 justify-content-center">
          {/* <Col md={1}></Col> */}
          {!loadingSave ? (
            <>
              {buttons ? (
                <>
                  <Col md={2}>
                    {props.permisos.crear ? (
                      <Button type="submit" className="botonPositivo2">
                        Guardar
                      </Button>
                    ) : null}
                  </Col>
                  <Col md={3}>
                    <Button
                      className="botonGeneral2"
                      onClick={() => window.location.reload()}
                    >
                      Calcular nuevo efecto
                    </Button>
                  </Col>
                  <Col md={2}>
                    <Link to="agregarEfecto">
                      <Button className="botonGeneral2">Agregar efecto</Button>
                    </Link>
                  </Col>
                  <Col md={3}>
                    <Button
                      className="botonGeneral2"
                      onClick={addResume}
                      id="desc1"
                    >
                      Resumen valoraci??n
                    </Button>
                  </Col>
                </>
              ) : (
                <Col md={10}></Col>
              )}
              <Col md={2}>
                <Link to="Valoraciones">
                  <Button className="botonNegativo2">Cancelar</Button>
                </Link>
              </Col>
            </>
          ) : (
            <Row className="mb-3 justify-content-center">
              <Col className="col-auto text-center">
                <ReactLoading
                  type={"spin"}
                  color={"#FDDA24"}
                  height={80}
                  width={80}
                />
              </Col>
            </Row>
          )}
        </Row>
      </Form>
    </>
  );
}
