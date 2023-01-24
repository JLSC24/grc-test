import React, { useEffect } from "react";
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
import { Link } from "react-router-dom";
import Loader from "react-loader-spinner";
import axios from "axios";
import { IoMdDownload } from "react-icons/io";

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

export default function Decisiones(props) {
  const serviceAAD = new AADService();
  const classes = useStyles();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [selected, setSelected] = React.useState([]);
  const [ButtonEdit, SetButtonEdit] = React.useState(false);
  const [data, setData] = React.useState([]);
  const [decisiones, setDecisiones] = React.useState([]);
  const [dataBusqueda, setDataBusqueda] = React.useState([]);
  const [loadingData, setLoadingData] = React.useState(false);
  const [buscando, setBuscando] = React.useState(null);
  const [datResponsables, setDatResponsables] = React.useState(null);
  const [descarga, setDescarga] = React.useState(true);

  const { dataUsuario } = React.useContext(UsuarioContext);

  useEffect(() => {
    //Obtiene la infomacion de las decisiones
    let riesgo;
    const fetchdata = async () => {
      const result = await fetch(process.env.REACT_APP_API_URL + "/decisiones/0/", {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: "Bearer " + serviceAAD.getToken(),
        },
      });

      let data = await result.json();

      let tempDecision = [];
      if (
        props.idrol.includes(1) ||
        props.idrol.includes(2) ||
        props.idrol.includes(4) ||
        props.idrol.includes(11)
      ) {
        setDecisiones(data);
        setDataBusqueda(data);
      } else {
        if (props.idrol.includes(3) || props.idrol.includes(7)) {
          data.map((decision) => {
            //verifica si el usuario es el validador de la decisión.
            if (decision.email === dataUsuario.email.toLowerCase()) {
              tempDecision.push(decision);
            }
          });
          setDecisiones(tempDecision);
          setDataBusqueda(tempDecision);
        }
      }
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
    localStorage.setItem("idDecision", selected[0]);
  };
  const isSelected = (name) => selected.indexOf(name) !== -1;

  async function buscar(e) {
    e.persist();
    //await setBuscando(e.target.value);
    try {
      var search = decisiones.filter((item) => {
        if (
          String(item.iddecision)
            .toLowerCase()
            .includes(e.target.value.toLowerCase()) ||
          String(item.idriesgo)
            .toLowerCase()
            .includes(e.target.value.toLowerCase()) ||
          item.nombre_riesgo
            .toLowerCase()
            .includes(e.target.value.toLowerCase()) ||
          item.nombreresponsable
            .toLowerCase()
            .includes(e.target.value.toLowerCase()) ||
          item.decision.toLowerCase().includes(e.target.value.toLowerCase())
        ) {
          return item;
        }
      });
      await setBuscando(e.target.value);
      await setDataBusqueda(search);
    } catch (error) {
      console.error("No se encuentra la decisión");
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
      setDescarga(true);
    });
  }
  async function descargaDecisiones() {
    setDescarga(false);
    let urlConsulta = process.env.REACT_APP_API_URL + "/informes";
    const data = {
      informe: "decisiones_pa",
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
    }).then((response) => {
      response.json().then((data) => {
        let urlFetch = data.URL;

        fileFromURL(urlFetch);
      });
    });
  }

  return (
    <>
      <Row className="mb-3 mt-3">
        <Col md={12}>
          <h1 className="titulo">Decisiones</h1>
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
        <Col style={{ paddingTop: "0.3%" }} sm={2} xs={6}></Col>
        <Col
          style={{ paddingTop: "0.3%" }}
          className="d-flex justify-content-end"
          sm={3}
          xs={6}
        >
          {ButtonEdit && (props.permisos.ver || props.permisos.editar) ? (
            <Link to="TomarDecision">
              <Button
                className="botonNegativo"
                onClick={(event) => editar(event)}
              >
                Tomar decision
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
          {props.permisos.descargar ? (
            descarga ? (
              <Button
                className="botonPositivo"
                onClick={() => descargaDecisiones()}
              >
                Descargar Decisiones y PA &nbsp; <IoMdDownload />
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
        {/*  <Col
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
        </Col> */}
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
                  <StyledTableCell>ID Decisión</StyledTableCell>
                  <StyledTableCell align="left">ID Riesgo</StyledTableCell>
                  <StyledTableCell align="left">Riesgo</StyledTableCell>
                  <StyledTableCell align="left">
                    Riesgo Residual
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    Nivel del Riesgo Residual
                  </StyledTableCell>
                  <StyledTableCell align="left">Decisión</StyledTableCell>
                  <StyledTableCell align="left">Fecha Decisión</StyledTableCell>
                  <StyledTableCell align="left">Responsable</StyledTableCell>
                </TableRow>
              </TableHead>
              {/* Fin de encabezado */}
              {/* Inicio de cuerpo de la tabla */}
              <TableBody>
                {dataBusqueda
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, index) => {
                    const isItemSelected = isSelected(row.iddecision);
                    return (
                      <StyledTableRow
                        key={row.iddecision}
                        hover
                        onClick={(event) => handleClick(event, row.iddecision)}
                        selected={isItemSelected}
                        role="checkbox"
                        tabIndex={-1}
                      >
                        <StyledTableCell component="th" scope="row">
                          <Checkbox checked={isItemSelected} />
                        </StyledTableCell>
                        <StyledTableCell component="th" scope="row">
                          {row.iddecision ? row.iddecision : null}
                        </StyledTableCell>
                        <StyledTableCell align="left">
                          {row.idriesgo ? row.idriesgo : null}
                        </StyledTableCell>
                        <StyledTableCell align="left">
                          {row.nombre_riesgo ? row.nombre_riesgo : null}
                        </StyledTableCell>
                        <StyledTableCell align="left">
                          {row.exposicion_residual !== null
                            ? row.exposicion_residual
                            : null}
                        </StyledTableCell>

                        <StyledTableCell align="left">
                          {row.nivel_riesgo_residual !== null
                            ? row.nivel_riesgo_residual
                            : null}
                        </StyledTableCell>
                        <StyledTableCell align="left">
                          {row.decision !== null ? row.decision : null}
                        </StyledTableCell>
                        <StyledTableCell align="left">
                          {row.fechacreacion !== null
                            ? row.fechacreacion
                            : null}
                        </StyledTableCell>
                        <StyledTableCell align="left">
                          {row.nombreresponsable !== null
                            ? row.nombreresponsable
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
