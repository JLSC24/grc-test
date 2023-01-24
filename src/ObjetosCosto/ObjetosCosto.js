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
import { Button, Row, Col, Form, Alert } from "react-bootstrap";
import { Link } from "react-router-dom";
import Loader from "react-loader-spinner";

import { adalApiFetch } from "../auth/adalConfig";
import AADService from "../auth/authFunctions";
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
    maxHeight: "60vh",
    minHeight: "60vh",
  },
});

export default function ObjetosCosto(props) {
  const serviceAAD = new AADService();
  const classes = useStyles();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [selected, setSelected] = React.useState([]);
  const [ButtonEdit, SetButtonEdit] = React.useState(false);
  const [data, setData] = React.useState([]);
  const [dataBusqueda, setDataBusqueda] = React.useState([]);
  const [loadingData, setLoadingData] = React.useState(false);
  const [buscando, setBuscando] = React.useState(null);
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
    let compañias;
    const getCompanias = async () => {
      const result = await fetch(
        process.env.REACT_APP_API_URL + "/maestros_ro/compania/",
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            Authorization: "Bearer " + serviceAAD.getToken(),
          },
        }
      );
      compañias = await result.json();
    };
    const fetchdata = async () => {
      setLoadingData(true);
      await getCompanias();
      const result = await fetch(process.env.REACT_APP_API_URL + "/maestros_ro/oc/", {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: "Bearer " + serviceAAD.getToken(),
        },
      });
      let data = await result.json();
      if (data) {
        data.map((dat) => {
          compañias.map((comp) => {
            if (dat.idcompania == comp.idcompania) {
              dat.idcompania = {
                idcompania: comp.idcompania,
                compania: comp.compania,
              };
              return null;
            }
          });
        });
      }
      setData(data);
      setDataBusqueda(data);
      setLoadingData(false);
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
  /* Fin de funciones para paginación */
  /* Función para seleccionar un Área para Editar */
  const handleClick = (event, name) => {
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
    localStorage.setItem("idObjetoCosto", selected[0]);
  };
  const isSelected = (name) => selected.indexOf(name) !== -1;

  async function buscar(e) {
    e.persist();
    //await setBuscando(e.target.value);
    var search = data.filter((item) => {
      if (
        item.nombre.toLowerCase().includes(e.target.value.toLowerCase()) ||
        item.idoc.toString().includes(e.target.value) ||
        item.idcompania.compania
          .toLowerCase()
          .includes(e.target.value.toLowerCase()) ||
        item.fecha_lanzamiento
          .toLowerCase()
          .includes(e.target.value.toLowerCase())
      ) {
        return item;
      }
    });
    await setBuscando(e.target.value);
    await setDataBusqueda(search);
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
            .post(
              process.env.REACT_APP_API_URL + "/rx_oc_distribucion_masivo/",
              jsonObject,
              {
                headers: {
                  "Content-Type": "application/json",
                  Authorization: "Bearer " + serviceAAD.getToken(),
                },
              }
            )
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
          <h1 className="titulo">Objetos de costo</h1>
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
                process.env.REACT_APP_API_URL + "/download/cargadores/cargador_distribucion_oc.xlsx"
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
                Cargar Distribucion de OC
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
                Actualizar Distribucion de OC
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
      <Row
        style={{ marginTop: "1%", marginBottom: "0.5%" }}
        className="mb-3 mt-3"
      >
        <Col sm={4} xs={12}>
          <Form>
            <Form.Control
              value={buscando}
              onChange={(e) => buscar(e)}
              type="text"
              placeholder="Buscar"
            />
          </Form>
        </Col>
        <Col sm={4} xs={6}>
          <Link to="EditarObjetoCosto">
            <Button
              className="botonNegativo"
              style={{
                display:
                  ButtonEdit && (props.permisos.editar || props.permisos.ver)
                    ? "inline"
                    : "none",
              }}
              onClick={(event) => editar(event)}
            >
              Ver / Editar
            </Button>
          </Link>
        </Col>
        <Col sm={4} xs={6}>
          {props.permisos.crear ? (
            <Link to="NuevoObjetoCosto">
              <Button className="botonPositivo">Nuevo</Button>
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
        <Paper className={classes.root}>
          <TableContainer component={Paper} className={classes.container}>
            <Table className={"text"} stickyHeader aria-label="sticky table">
              {/* Inicio de encabezado */}
              <TableHead className="titulo">
                <TableRow>
                  <StyledTableCell padding="checkbox"></StyledTableCell>
                  <StyledTableCell>ID Objeto de Costo</StyledTableCell>
                  <StyledTableCell align="left">Nombre</StyledTableCell>
                  <StyledTableCell align="left">Compañia</StyledTableCell>
                  <StyledTableCell align="left">
                    Fecha Lanzamiento
                  </StyledTableCell>
                  <StyledTableCell align="left">Nivel</StyledTableCell>
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
                          {row.idoc}
                        </StyledTableCell>
                        <StyledTableCell align="left">
                          {row.nombre}
                        </StyledTableCell>
                        <StyledTableCell align="left">
                          {row.idcompania !== null
                            ? row.idcompania.compania
                            : null}
                        </StyledTableCell>
                        <StyledTableCell align="left">
                          {row.fecha_lanzamiento}
                        </StyledTableCell>
                        <StyledTableCell align="left">
                          {row.nivel}
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
      )}
    </>
  );
}
