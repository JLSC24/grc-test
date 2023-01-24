import React, { useState, useEffect } from "react";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import TablePagination from "@material-ui/core/TablePagination";
import Checkbox from "@material-ui/core/Checkbox";
import Toolbar from "@material-ui/core/Toolbar";
import { Button, Row, Col, Form, Alert } from "react-bootstrap";
import { Link } from "react-router-dom";

import { adalApiFetch } from "../auth/adalConfig";
import AADService from "../auth/authFunctions";
import Loader from "react-loader-spinner";
import axios from "axios";
import XLSX from "xlsx";
import { w3cwebsocket as W3CWebSocket } from "websocket";
import { UsuarioContext } from "../Context/UsuarioContext";
import { IoMdDownload } from "react-icons/io";

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

function AlertDismissibleExample({ alerta }) {
  switch (alerta.id) {
    case 1:
      return <Alert variant="warning">Alerta</Alert>;

    case 2:
      return <Alert variant="success">{alerta.data}</Alert>;

    case 3:
      return <Alert variant="danger">{alerta.data}</Alert>;

    case 4:
      return <Alert variant="warning">Error al enviar la información</Alert>;

    case 5:
      return <Alert variant="danger">Error en el servidor</Alert>;

    case 7:
      return (
        <Alert variant="warning">
          Corrige los siguientes errores:
          <br></br>• Debe completar los campos obligatorios
        </Alert>
      );
    default:
      return <p></p>;
  }
}

const serviceAAD = new AADService();

const client_controles = new W3CWebSocket(
  process.env.REACT_APP_WS_URL + "/ws/eros/controles_" +
    serviceAAD.getUser().userName.split("@")[0]
);
const useStyles = makeStyles({
  root: {
    width: "100%",
  },
  container: {
    maxHeight: "57vh",
    minHeight: "57vh",
  },
});
export default function ServiciosValoracion(props) {
  const serviceAAD = new AADService();
  const classes = useStyles();

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const [buscando, setBuscando] = React.useState([]);
  const [dataBusqueda, setDataBusqueda] = React.useState([]);

  const [selected, setSelected] = React.useState([]);

  const [data, setData] = React.useState([]);

  const [ButtonEdit, SetButtonEdit] = React.useState(false);
  const [showEditar, setShowEditar] = React.useState(false);
  const [idEditarTemp, setIdEditarTemp] = React.useState(null);
  const [rutaEditar, setRutaEditar] = React.useState("editarAgregarEfecto");
  const [carga, setCarga] = React.useState(false);
  const [enableButton, setEnableButton] = React.useState(true);
  const [descarga, setDescarga] = React.useState(true);
  const [url, setURL] = React.useState(null);
  const { dataUsuario } = React.useContext(UsuarioContext);
  const [loading, setLoading] = React.useState(false);
  const [archivo, setArchivo] = React.useState([]);
  const [stateArchivo, setStateArchivo] = React.useState([]);
  const [names, setNames] = React.useState([]);
  const [namesN, setNamesN] = React.useState([]);
  const [estadoPost, setEstadoPost] = useState({
    alerta: { id: 0, data: null },
  });
  let tempArchivo = [];
  let temp = [];
  useEffect(() => {
    const fetchdata = async () => {
      const result = await fetch(process.env.REACT_APP_API_URL + "/efectos/", {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: "Bearer " + serviceAAD.getToken(),
        },
      });
      let data = await result.json();
      setDataBusqueda(data);
      setData(data);
    };
    fetchdata();
  }, []);

  /* Funciones para paginación */
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const definirRuta = async (ruta) => {
    setRutaEditar(ruta);
  };
  /* Fin de funciones para paginación */
  /* Función para seleccionar un Área para Editar */
  const handleClick = async (event, name, element) => {
    setIdEditarTemp(name);
    localStorage.setItem("idEfecto", name);
    if (name === idEditarTemp) {
      setShowEditar(!showEditar);
    } else {
      setShowEditar(true);
    }

    if (element.metodovaloracion === "Mezcla independientes") {
      await definirRuta("editarAgregarEfecto");
    } else {
      await definirRuta("editarCrearEfecto");
    }
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat([], name);
      SetButtonEdit(true);
    } else {
      SetButtonEdit(false);
    }
    setSelected(newSelected);
  };
  const editar = (event) => {
    localStorage.setItem("idArea", selected[0]);
  };
  const isSelected = (name) => selected.indexOf(name) !== -1;

  async function buscar(e) {
    e.persist();
    //await setBuscando(e.target.value);
    try {
      var search = dataBusqueda.filter((item) => {
        if (
          String(item.idefecto)
            .toLowerCase()
            .includes(e.target.value.toLowerCase()) ||
          item.metodovaloracion
            .toLowerCase()
            .includes(e.target.value.toLowerCase()) ||
          item.nombreefecto
            .toLowerCase()
            .includes(e.target.value.toLowerCase()) ||
          item.tipo_moneda.toLowerCase().includes(e.target.value.toLowerCase())
        ) {
          return item;
        }
      });
      await setBuscando(e.target.value);
      await setData(search);
    } catch (error) {
      console.error("No se encuentra el riesgo");
    }
  }

  useEffect(() => {
    client_controles.onopen = () => {
      console.warn("WebSocket Client Connected");
    };
    client_controles.onClose = () => {
      console.warn("WebSocket Client Disconnected");
      closeWS();
    };
    client_controles.onmessage = (message) => {
      recibirMensaje(JSON.parse(message.data));
    };
  }, []);

  const recibirMensaje = (data) => {
    if (data.payload.message === "Error_File") {
      setCarga(false);
      setEnableButton(true);
      setEstadoPost({
        id: 3,
        data: "Error: Por favor verificar la estructura del archivo",
      });
      setTimeout(() => {
        // if (state === 2) {
        //   history.push("/EditarAreaOrganizacional");
        // }
        setEstadoPost({ id: 0, data: null });
      }, 10000);
    } else if (data.payload.message === "Error") {
      setCarga(false);
      setEnableButton(true);
      setEstadoPost({
        id: 3,
        data: data.payload.Detail,
      });
      setTimeout(() => {
        // if (state === 2) {
        //   history.push("/EditarAreaOrganizacional");
        // }
        setEstadoPost({ id: 0, data: null });
      }, 10000);
    } else if (data.payload.message === "Success") {
      setEstadoPost({
        id: 2,
        data: "Carga finalizada, recuerde revisar su informe de cargue",
      });
      setTimeout(() => {
        // if (state === 2) {
        //   history.push("/EditarAreaOrganizacional");
        // }
        setEstadoPost({ id: 0, data: null });
      }, 5000);
      if (data.payload.URL) {
        setURL(data.payload.URL);
        setCarga(true);
        setEnableButton(true);
      }
    }
  };

  function closeWS() {
    var mensaje = window.confirm(
      "Se ha cerrado la conexión con el servidor, es necesario recargar la página para continuar"
    );
    if (mensaje) {
      window.location.reload();
    } else {
      alert("No podrá hacer uso de los cargadores hasta recargar la página");
    }
  }

  async function fileFromURL(url) {
    let urlConsulta = url;
    axios({
      url: urlConsulta,
      method: "GET",
      responseType: "blob",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + serviceAAD.getToken(),
      },
    }).then((response) => {
      let name = urlConsulta.split("/").pop();
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", name);
      document.body.appendChild(link);
      link.click();
      setCarga(false);
      setDescarga(true);
    });
  }

  const sendMessageSocket = (msg) => {
    if (msg) {
      if (client_controles.readyState !== 0) {
        client_controles.send(JSON.stringify(msg));
      } else {
        /* console.warn("reconectando");
        const tempClient = new W3CWebSocket(
          process.env.REACT_APP_API_URL + "/ws/post_" +
            serviceAAD.getUser().userName.split("@")[0]
        );
        tempClient.onmessage = (event) =>
          recibirMensaje(JSON.parse(event.data));
        tempClient.onerror = (event) => {
          recibirError(event.data);
        };
        setClient(tempClient);
        sendMessageSocket(msg); */
      }
    }
  };
  const subirArchivo = (e) => {
    setEstadoPost({ id: 0, data: null });
    setArchivo([]);
    setNames([]);
    setStateArchivo([]);
    setNames([]);
    setNamesN([]);

    if (
      e[0].name.split(".")[1] == "xlsx" /*  ||
        e[i].name.split(".")[1] == "csv" */
    ) {
      temp.push(e[0].name);
      tempArchivo.push(e[0]);
    }

    setArchivo(tempArchivo);
  };

  const uploadArchivo = async (file, action, confirm) => {
    setEnableButton(false);
    setLoading(true);
    if (file.length > 0) {
      let jsonObject = {};
      var fileReader = new FileReader();
      fileReader.onload = function (event) {
        var data = event.target.result;
        var workbook = XLSX.read(data, {
          type: "binary",
          cellDates: true,
          dateNF: "dd-mm-yyy HH:mm:ss",
        });
        workbook.SheetNames.forEach((sheet) => {
          let rowObject = XLSX.utils.sheet_to_json(workbook.Sheets[sheet], {
            raw: true,
            blankRows: true,
            defval: null,
          });
          jsonObject[sheet.trim()] = rowObject;
        });
        jsonObject["guardar"] = confirm;
        jsonObject["method"] = action;
        jsonObject["user"] = serviceAAD.getUser().userName;

        let compañia_temp = serviceAAD
          .getUser()
          .userName.split("@")[1]
          .split(".")[0]
          .toLowerCase();
        if (
          compañia_temp === "bam" ||
          compañia_temp === "banistmo" ||
          dataUsuario.idcompania === 5 ||
          dataUsuario.idcompania === 3
        ) {
          axios
            .post(process.env.REACT_APP_API_URL + "/rx_efecto_oc_masivo/", jsonObject, {
              headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + serviceAAD.getToken(),
              },
            })
            .then(function (response) {
              recibirMensaje(response.data);
            })
            .catch((errors) => {
              // react on errors.
              console.error(errors);
              setEstadoPost({
                id: 3,
                data: "Ha ocurrido un error, favor recargue la página e intente de nuevo, si persiste, revise su cargador o contácte al administrador",
              });
              setTimeout(() => {
                // if (state === 2) {
                //   history.push("/EditarAreaOrganizacional");
                // }
                setEstadoPost({ id: 0, data: null });
              }, 10000);
              setCarga(false);
              setEnableButton(true);
            });
        } else {
          sendMessageSocket(jsonObject);
        }
      };
      fileReader.readAsBinaryString(file[0]);
    } else {
      window.alert("No se ha seleccionado un archivo");
      setEnableButton(true);
    }
  };
  return (
    <>
      <AlertDismissibleExample alerta={estadoPost} />
      <Row className="mb-3">
        <Col md={12}>
          <h1 className="titulo">Servicios de valoración</h1>
        </Col>
      </Row>
      <hr className="separador mb-3 mt-3" />
      {props.permisos.editar || props.permisos.crear ? (
        <Row className="mb-3">
          <Col sm={3} xs={12}>
            <label className="label forn-label">
              Formato de distribución de OC
            </label>
          </Col>
          <Col sm={3} xs={12}>
            <label className="label forn-label">Seleccione archivo</label>
          </Col>
          <Col sm={6} xs={12}>
            <input
              type="file"
              name="files"
              accept=".xlsx,.csv"
              onChange={(e) => subirArchivo(e.target.files)}
            ></input>
          </Col>
        </Row>
      ) : (
        <Col sm={3} xs={12}>
          {" "}
        </Col>
      )}
      <Row className="mb-3">
        <Col sm={3} xs={12}>
          <button
            type="button"
            className="btn botonPositivo"
            onClick={() =>
              fileFromURL(
                process.env.REACT_APP_API_URL + "/download/cargadores/cargador_efecto_oc.xlsx"
              )
            }
          >
            Descargar formato &nbsp;
            <IoMdDownload />
          </button>
        </Col>
        {props.permisos.crear ? (
          enableButton ? (
            <Col sm={3} xs={12}>
              <button
                type="button"
                className="btn botonPositivo"
                onClick={(e) => uploadArchivo(archivo, "post", 0)}
              >
                Cargar OC masivamente
              </button>
            </Col>
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
          )
        ) : (
          <Col sm={3} xs={12}>
            {" "}
          </Col>
        )}
        {props.permisos.editar ? (
          <Col sm={3} xs={12}>
            {enableButton ? (
              <button
                type="button"
                className="btn botonGeneral"
                onClick={(e) => uploadArchivo(archivo, "put", 0)}
              >
                Actualizar OC masivamente
              </button>
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
          </Col>
        ) : (
          <Col sm={3} xs={12}>
            {" "}
          </Col>
        )}
        {props.permisos.editar || props.permisos.crear ? (
          <Col sm={3} xs={12}>
            <Button
              id="buttonEfectos"
              type="button"
              className="btn botonPositivo"
              disabled={!carga}
              onClick={() => fileFromURL(url)}
            >
              Descargar Informe de cargue &nbsp;
              <IoMdDownload />
            </Button>
          </Col>
        ) : (
          <Col sm={3} xs={12}>
            {" "}
          </Col>
        )}
        <Col sm={3} xs={0}></Col>
      </Row>
      <hr className="separador mb-3 mt-3" />

      <Row>
        <Col sm={3} xs={12}>
          <Form className="buscar">
            <Form.Control
              value={buscando}
              onChange={(e) => buscar(e)}
              type="text"
              placeholder="Buscar"
            />
          </Form>
        </Col>

        {/* <Col sm={2} xs={6}></Col> */}

        <Col sm={2} xs={6}>
          {showEditar && (props.permisos.editar || props.permisos.ver) ? (
            <Link to={rutaEditar}>
              <Button className="botonNegativo2">Editar efecto</Button>
            </Link>
          ) : null}
        </Col>
        <Col sm={2} xs={6}>
          {props.permisos.crear ? (
            <Link to="crearEfecto">
              <Button
                className="botonPositivo2"
                onClick={(event) => editar(event)}
              >
                Crear efecto
              </Button>
            </Link>
          ) : null}
        </Col>

        <Col sm={2} xs={6}>
          {props.permisos.crear ? (
            <Link to="agregarEfecto">
              <Button className="botonPositivo2">Agregar efectos</Button>
            </Link>
          ) : null}
        </Col>

        <Col
          style={{ paddingTop: "0.3%" }}
          className="d-flex justify-content-end"
          sm={3}
          xs={12}
        >
          {props.permisos.ver ? (
            descarga ? (
              <Button
                className="botonPositivo"
                onClick={() =>
                  fileFromURL(
                    process.env.REACT_APP_API_URL + "/download/efectos/Info_Efectos.xlsx"
                  )
                }
              >
                Descargar efectos &nbsp; <IoMdDownload />
              </Button>
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
            )
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
                <StyledTableCell align="left">Id efecto</StyledTableCell>
                <StyledTableCell align="left">Nombre</StyledTableCell>
                <StyledTableCell align="left">Tipo Impacto</StyledTableCell>
                <StyledTableCell align="left">P50</StyledTableCell>
                <StyledTableCell align="left">P95</StyledTableCell>
                <StyledTableCell align="left">P99</StyledTableCell>
                <StyledTableCell align="left">Método</StyledTableCell>
                <StyledTableCell align="left">Analista</StyledTableCell>
              </TableRow>
            </TableHead>
            {/* Fin de encabezado */}
            {/* Inicio de cuerpo de la tabla */}
            <TableBody>
              {data
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  const isItemSelected = isSelected(row.idefecto);
                  return (
                    <StyledTableRow
                      key={row.idefecto}
                      hover
                      onClick={(event) => handleClick(event, row.idefecto, row)}
                      selected={isItemSelected}
                      role="checkbox"
                      tabIndex={-1}
                    >
                      <StyledTableCell component="th" scope="row">
                        <Checkbox checked={isItemSelected} />
                      </StyledTableCell>
                      <StyledTableCell component="th" scope="row">
                        {row.idefecto !== null ? row.idefecto : null}
                      </StyledTableCell>
                      <StyledTableCell align="left">
                        {row.nombreefecto !== null ? row.nombreefecto : null}
                      </StyledTableCell>
                      <StyledTableCell align="left">
                        {row.tipoefecto !== null ? row.tipoefecto : null}
                      </StyledTableCell>
                      <StyledTableCell align="left">
                        {row.resultado_p50 !== null
                          ? parseFloat(row.resultado_p50).toLocaleString()
                          : null}
                      </StyledTableCell>
                      <StyledTableCell align="left">
                        {row.resultado_p95 !== null
                          ? parseFloat(row.resultado_p95).toLocaleString()
                          : null}
                      </StyledTableCell>
                      <StyledTableCell align="left">
                        {row.resultado_p99 !== null
                          ? parseFloat(row.resultado_p99).toLocaleString()
                          : null}
                      </StyledTableCell>
                      <StyledTableCell align="left">
                        {row.metodovaloracion !== null
                          ? row.metodovaloracion
                          : null}
                      </StyledTableCell>
                      <StyledTableCell align="left">
                        {row.analista !== null ? row.analista : null}
                      </StyledTableCell>
                    </StyledTableRow>
                  );
                })}
            </TableBody>
            {/* Fin de cuerpo de la tabla */}
          </Table>
        </TableContainer>
        {/* Inicio de paginación */}
        <TablePagination
          rowsPerPageOptions={[10, 25, 100]}
          component="div"
          count={data.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
        {/* Fin de paginación */}
      </Paper>
    </>
  );
}
