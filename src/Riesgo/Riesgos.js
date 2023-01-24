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
import { Button, Row, Col, Form, Modal } from "react-bootstrap";
import { IoMdDownload } from "react-icons/io";
import { Link } from "react-router-dom";
import Loader from "react-loader-spinner";
import axios from "axios";
import { adalApiFetch } from "../auth/adalConfig";
import AADService from "../auth/authFunctions";

import { UsuarioContext } from "../Context/UsuarioContext";

import ModalDecision from "./SolicitarDecision";
import Select from "react-select";
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
    maxHeight: "60vh",
    minHeight: "60vh",
  },

  MuiTableRow: {
    root: {
      //This can be referred from Material UI API documentation.
      heigth: "10px",
    },
  },
});

export default function Riesgos(props) {
  const serviceAAD = new AADService();
  const classes = useStyles();
  const [riesgoDecision, setResgoDecision] = React.useState(null);
  const [estadoPost, setEstadoPost] = useState({
    alerta: { id: 0, data: null },
  });
  const [showDecision, setShowDecision] = React.useState(false);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [selected, setSelected] = React.useState([]);
  const [ButtonEdit, SetButtonEdit] = React.useState(false);
  const [data, setData] = React.useState([]);
  const [riesgos, setRiesgos] = React.useState([]);
  const [dataBusqueda, setDataBusqueda] = React.useState([]);
  const [loadingData, setLoadingData] = React.useState(false);
  const [buscando, setBuscando] = React.useState(null);
  const [datResponsables, setDatResponsables] = React.useState(null);
  const [descarga, setDescarga] = React.useState(true);

  const { dataUsuario } = React.useContext(UsuarioContext);

  useEffect(() => {
    async function getRiesgos() {
      const response_riesgos = await axios.get(
        process.env.REACT_APP_API_URL + "/riesgos/",
        {
          headers: {
            Authorization: "Bearer " + serviceAAD.getToken(),
          },
        }
      );

      let dataRiesgo = response_riesgos.data;
      setRiesgos(dataRiesgo);
      setDataBusqueda(dataRiesgo);
      setLoadingData(false);
    }
    getRiesgos();
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
    localStorage.setItem("idRiesgo", selected[0]);
  };
  const isSelected = (name) => selected.indexOf(name) !== -1;

  async function buscar(e) {
    e.persist();
    //await setBuscando(e.target.value);
    try {
      var search = riesgos.filter((item) => {
        if (
          String(item.idriesgo)
            .toLowerCase()
            .includes(e.target.value.toLowerCase()) ||
          item.tipo_elemento_evaluado
            .toLowerCase()
            .includes(e.target.value.toLowerCase()) ||
          item.descripcion_general
            .toLowerCase()
            .includes(e.target.value.toLowerCase()) ||
          item.nombre_riesgo
            .toLowerCase()
            .includes(e.target.value.toLowerCase()) ||
          item.arista_del_riesgo
            .toLowerCase()
            .includes(e.target.value.toLowerCase())
        ) {
          return item;
        }
      });
      await setBuscando(e.target.value);
      await setDataBusqueda(search);
    } catch (error) {
      console.error("No se encuentra el riesgo");
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
    })
      .then((response) => {
        let name = urlConsulta.split("/").pop();
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", name);
        document.body.appendChild(link);
        link.click();
        setDescarga(true);
      })
      .catch((error) => {
        if (error.response.status == 401) {
          setEstadoPost({
            id: 3,
            data: "No estas autorizado para realizar esta accion o tu sesión esta vencida",
          });
          setTimeout(() => {
            setEstadoPost({ id: 0, data: null });
          }, 10000);
        } else if (error.response.status == 404) {
          setEstadoPost({
            id: 3,
            data: "No se encontró el archivo seleccionado",
          });
          setTimeout(() => {
            setEstadoPost({ id: 0, data: null });
          }, 10000);
        }
      });
  }

  async function descargaRiesgos() {
    setDescarga(false);
    let urlConsulta = process.env.REACT_APP_API_URL + "/informes";
    const data = {
      informe: "riesgos",
      idcompania: dataUsuario.idcompania,
    };

    fetch(urlConsulta, {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        Accept: "application/json",
        "Content-type": "application/json; charset=UTF-8",
        Authorization: "Bearer " + serviceAAD.getToken(),
      },
    })
      .then((response) => {
        response.json().then((data) => {
          let urlFetch = data.URL;

          fileFromURL(urlFetch);
        });
      })
      .catch((error) => {
        if (error.response.status == 401) {
          setEstadoPost({
            id: 3,
            data: "No estas autorizado para realizar esta accion o tu sesión esta vencida",
          });
          setTimeout(() => {
            setEstadoPost({ id: 0, data: null });
          }, 10000);
        } else if (error.response.status == 404) {
          setEstadoPost({
            id: 3,
            data: "No se encontró el archivo seleccionado",
          });
          setTimeout(() => {
            setEstadoPost({ id: 0, data: null });
          }, 10000);
        }
      });
  }

  return (
    <>
      <ModalDecision
        showDecision={showDecision}
        setShowDecision={setShowDecision}
        riesgo={riesgoDecision}
      />
      <Row className="mb-3 mt-3">
        <Col md={12}>
          <h1 className="titulo">Riesgos</h1>
        </Col>
      </Row>
      <Row
        style={{ marginTop: "1%", marginBottom: "0.5%" }}
        className="mb-3 mt-3"
      >
        <Col sm={4} xs={12}>
          <Form className="buscar">
            <Form.Control
              value={buscando}
              onChange={(e) => buscar(e)}
              type="text"
              placeholder="Buscar"
            />
          </Form>
        </Col>
        <Col
          style={{ paddingTop: "0.3%" }}
          className="d-flex justify-content-end"
          sm={2}
          xs={6}
        >
          {ButtonEdit && (props.permisos.ver || props.permisos.editar) ? (
            <Link to="editarRiesgo">
              <Button
                className="botonNegativo"
                onClick={(event) => editar(event)}
              >
                Ver / Editar
              </Button>
            </Link>
          ) : null}
        </Col>
        <Col
          style={{ paddingTop: "0.3%" }}
          className="d-flex justify-content-end"
          sm={3}
          xs={6}
        >
          {props.permisos.crear ? (
            <Link to="crearRiesgo">
              <Button className="botonPositivo">Crear Riesgo</Button>
            </Link>
          ) : null}
        </Col>
        <Col
          style={{ paddingTop: "0.3%" }}
          className="d-flex justify-content-end"
          sm={3}
          xs={6}
        >
          {props.permisos.descargar ? (
            descarga ? (
              <Button
                className="botonPositivo"
                onClick={() => descargaRiesgos()}
              >
                Descargar riesgos &nbsp; <IoMdDownload />
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
                  <StyledTableCell>Id Riesgo</StyledTableCell>
                  <StyledTableCell align="left">
                    Tipo de Elemento
                  </StyledTableCell>
                  {/* <StyledTableCell align="left">
                    Elemento Principal
                  </StyledTableCell> */}
                  <StyledTableCell align="left">Nombre</StyledTableCell>
                  <StyledTableCell align="left">Descripción</StyledTableCell>
                  <StyledTableCell align="left">
                    Arista del Riesgo
                  </StyledTableCell>
                  {/* <StyledTableCell align="left">Responsable</StyledTableCell> */}
                  <StyledTableCell align="left">
                    Riesgo Residual RO
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    Riesgo Residual SOX
                  </StyledTableCell>
                  <StyledTableCell align="left">Decisión</StyledTableCell>
                </TableRow>
              </TableHead>
              {/* Fin de encabezado */}
              {/* Inicio de cuerpo de la tabla */}
              <TableBody>
                {dataBusqueda
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, index) => {
                    const isItemSelected = isSelected(row.idriesgo);
                    return (
                      <StyledTableRow
                        key={row.idriesgo}
                        hover
                        onClick={(event) => handleClick(event, row.idriesgo)}
                        selected={isItemSelected}
                        role="checkbox"
                        tabIndex={-1}
                      >
                        <StyledTableCell component="th" scope="row">
                          <Checkbox checked={isItemSelected} />
                        </StyledTableCell>
                        <StyledTableCell component="th" scope="row">
                          {row.idriesgo !== null ? row.idriesgo : null}
                        </StyledTableCell>
                        <StyledTableCell align="left">
                          {row.tipo_elemento_evaluado !== null
                            ? row.tipo_elemento_evaluado
                            : null}
                        </StyledTableCell>

                        {/* <StyledTableCell align="left">
                          {row.elemento_ppal_evaluado !== null
                            ? row.elemento_ppal_evaluado
                            : null}
                        </StyledTableCell> */}
                        <StyledTableCell align="left">
                          {row.nombre_riesgo !== null
                            ? row.nombre_riesgo
                            : null}
                        </StyledTableCell>
                        <StyledTableCell align="left">
                          {row.descripcion_general !== null
                            ? row.descripcion_general
                            : null}
                        </StyledTableCell>
                        <StyledTableCell align="left">
                          {row.arista_del_riesgo !== null
                            ? row.arista_del_riesgo
                            : null}
                        </StyledTableCell>
                        {/* <StyledTableCell align="left">
                          {row.nombre !== null ? row.nombre : null}
                        </StyledTableCell> */}
                        <StyledTableCell align="left">
                          {row.nivel_riesgo_residual
                            ? row.nivel_riesgo_residual
                            : null}
                        </StyledTableCell>
                        <StyledTableCell align="left">
                          {row.nivel_riesgo_sox
                            ? row.nivel_riesgo_sox
                            : null}
                        </StyledTableCell>
                        <StyledTableCell align="left">
                          {row.decision ? row.decision : null}
                          <hr></hr>
                          <Button
                            className="botonNegativo3"
                            onClick={() => {
                              setResgoDecision(row);
                              setShowDecision(true);
                            }}
                          >
                            Solicitar decisión
                          </Button>
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
            rowsPerPageOptions={[20, 30, 100]}
            component="div"
            count={dataBusqueda.length}
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
