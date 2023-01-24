import React, { useEffect, useState } from "react";
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
import { Button, Row, Col, Form } from "react-bootstrap";
import { IoMdDownload } from "react-icons/io";
import { Link } from "react-router-dom";
import Loader from "react-loader-spinner";
import axios from "axios";

import { adalApiFetch } from "../auth/adalConfig";
import AADService from "../auth/authFunctions";

import { UsuarioContext } from "../Context/UsuarioContext";

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
    minHeight: "57vh",
  },
});
export default function Evaluaciones(props) {
  const serviceAAD = new AADService();
  const classes = useStyles();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [selected, setSelected] = React.useState([]);
  const [ButtonEdit, SetButtonEdit] = React.useState(false);
  const [data, setData] = React.useState([]);
  const [evaluacion, setEvaluacion] = React.useState([]);
  const [dataBusqueda, setDataBusqueda] = React.useState([]);
  const [loadingData, setLoadingData] = React.useState(false);
  const [buscando, setBuscando] = React.useState(null);
  const [descarga, setDescarga] = React.useState(true);

  const { dataUsuario } = React.useContext(UsuarioContext);
  const [estadoPost, setEstadoPost] = useState({
    alerta: { id: 0, data: null },
  });

  useEffect(() => {
    async function getEvaluacion() {
      setLoadingData(true);
      try {
        const response_eval = await axios.get(
          process.env.REACT_APP_API_URL + "/evaluacion/",
          {
            headers: {
              Authorization: "Bearer " + serviceAAD.getToken(),
            },
          }
        );
        let data = response_eval.data;
        /*
      let riesgo = data.map((e) => {
        if (e.estado === 1) {
          e.estado = "Activo";
          return e;
        } else if (e.estado === 0) {
          e.estado = "Inactivo";
          return e;
        }
      }); */
        let tempEvaluacion = [];
        // if (dataUsuario.idrol == 3) {
        //   data.map((evaluacion) => {
        //     //verifica si el usuario es el validador de la evaluación.
        //     if (evaluacion.email_validador === dataUsuario.email) {
        //       tempEvaluacion.push(evaluacion);
        //     }
        //   });
        //   setEvaluacion(tempEvaluacion);
        //   setDataBusqueda(tempEvaluacion);
        // } else {
        setEvaluacion(data);
        setDataBusqueda(data);
        // }

        setLoadingData(false);
      } catch (error) {
        setLoadingData(false);
      }
    }
    getEvaluacion();
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
    localStorage.setItem("idEvaluacion", selected[0]);
  };
  const isSelected = (name) => selected.indexOf(name) !== -1;

  async function buscar(e) {
    e.persist();
    //await setBuscando(e.target.value);
    var search = evaluacion.filter((item) => {
      if (
        String(item.idevaluacion)
          .toLowerCase()
          .includes(e.target.value.toLowerCase()) ||
        item.elemento_ppal_evaluado
          .toLowerCase()
          .includes(e.target.value.toLowerCase()) ||
        item.nombre_evaluacion
          .toLowerCase()
          .includes(e.target.value.toLowerCase()) ||
        item.tipo_elemento_evaluado
          .toLowerCase()
          .includes(e.target.value.toLowerCase()) ||
        item.estado.toLowerCase().includes(e.target.value.toLowerCase()) /* ||
        item.usuario_creador
          .toLowerCase()
          .includes(e.target.value.toLowerCase()) ||
        item.fecha_creacion.toLowerCase().includes(e.target.value.toLowerCase()) */
      ) {
        return item;
      }
    });
    await setBuscando(e.target.value);
    await setDataBusqueda(search);
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
  async function descargaEvaluaciones() {
    setDescarga(false);
    let urlConsulta = process.env.REACT_APP_API_URL + "/informes";
    const data = {
      informe: "evaluaciones",
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

    // axios({
    //   url: urlConsulta,
    //   method: "POST",
    //   responseType: "blob",
    //   headers: {
    //     "Content-Type": "application/json",
    //     Authorization: "Bearer " + serviceAAD.getToken(),
    //   },
    //   data: {
    //     informe: "evaluaciones",
    //     idcompania: dataUsuario.idcompania,
    //   },
    // }).then((response) => {
    //   let name = urlConsulta.split("/").pop();
    //   const url = window.URL.createObjectURL(new Blob([response.data]));
    //   const link = document.createElement("a");
    //   link.href = url;
    //   link.setAttribute("download", name);
    //   document.body.appendChild(link);
    //   link.click();
    // });
  }

  return (
    <>
      <Row className="mb-3 mt-3">
        <Col md={12}>
          <h1 className="titulo">Evaluaciones</h1>
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
          {ButtonEdit && (props.permisos.editar || props.permisos.ver) ? (
            <Link to="editarEvaluacion">
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
            <Link to="nuevaEvaluacion">
              <Button className="botonPositivo">Crear evaluación</Button>
            </Link>
          ) : null}
        </Col>
        <Col
          style={{ paddingTop: "0.3%" }}
          className="d-flex justify-content-end"
          sm={3}
          xs={6}
        >
          {props.permisos.descargar ?     
          ( descarga ? (
            <Button
              className="botonPositivo"
              onClick={() => descargaEvaluaciones()}
            >
              Descargar evaluaciones &nbsp; <IoMdDownload />
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
          ))
     
           : null} 
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
                <TableRow className="tr">
                  <StyledTableCell padding="checkbox"></StyledTableCell>
                  <StyledTableCell align="left">Id evaluación</StyledTableCell>
                  <StyledTableCell align="left">Nombre</StyledTableCell>
                  <StyledTableCell align="left">Estado</StyledTableCell>
                  <StyledTableCell align="left">
                    Tipo de elemento evaluado
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    Elemento Principal Evaluado
                  </StyledTableCell>
                  <StyledTableCell align="left">Fecha Creacion</StyledTableCell>
                  <StyledTableCell align="left">
                    Fecha de modificacion
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    Usuario Creador
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    Usuario Modificador
                  </StyledTableCell>
                  <StyledTableCell align="left">Validador</StyledTableCell>
                  <StyledTableCell align="left">
                    Correo Validador
                  </StyledTableCell>
                </TableRow>
              </TableHead>
              {/* Fin de encabezado */}
              {/* Inicio de cuerpo de la tabla */}
              <TableBody>
                {dataBusqueda
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, index) => {
                    const isItemSelected = isSelected(row.idevaluacion);
                    return (
                      <StyledTableRow
                        key={row.idevaluacion}
                        hover
                        onClick={(event) =>
                          handleClick(event, row.idevaluacion)
                        }
                        selected={isItemSelected}
                        role="checkbox"
                        tabIndex={-1}
                      >
                        <StyledTableCell component="th" scope="row">
                          <Checkbox checked={isItemSelected} />
                        </StyledTableCell>
                        <StyledTableCell component="th" scope="row">
                          {row.idevaluacion !== null ? row.idevaluacion : null}
                        </StyledTableCell>
                        <StyledTableCell align="left">
                          {row.nombre_evaluacion !== null
                            ? row.nombre_evaluacion
                            : null}
                        </StyledTableCell>
                        <StyledTableCell align="left">
                          {row.estado !== null ? row.estado : null}
                        </StyledTableCell>
                        <StyledTableCell align="left">
                          {row.tipo_elemento_evaluado !== null
                            ? row.tipo_elemento_evaluado
                            : null}
                        </StyledTableCell>
                        <StyledTableCell align="left">
                          {row.elemento_ppal_evaluado !== null
                            ? row.elemento_ppal_evaluado
                            : null}
                        </StyledTableCell>
                        <StyledTableCell align="left">
                          {row.fecha_creacion !== null
                            ? row.fecha_creacion
                            : null}
                        </StyledTableCell>
                        <StyledTableCell align="left">
                          {row.fecha_modificacion !== null
                            ? row.fecha_modificacion
                            : null}
                        </StyledTableCell>
                        <StyledTableCell align="left">
                          {row.usuario_creador !== null
                            ? row.usuario_creador
                            : null}
                        </StyledTableCell>
                        <StyledTableCell align="left">
                          {row.usuario_modificador !== null
                            ? row.usuario_modificador
                            : null}
                        </StyledTableCell>
                        <StyledTableCell align="left">
                          {row.validador !== null ? row.validador : null}
                        </StyledTableCell>
                        <StyledTableCell align="left">
                          {row.email_validador !== null
                            ? row.email_validador
                            : null}
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
