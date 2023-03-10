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
import { UsuarioContext } from "../Context/UsuarioContext";

import { adalApiFetch } from "../auth/adalConfig";
import AADService from "../auth/authFunctions";

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

export default function PlanesAccion(props) {
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
  const [descarga, setDescarga] = React.useState(true);
  const { dataUsuario } = React.useContext(UsuarioContext);

  useEffect(() => {
    const GetPlanesAccion = async () => {
      const result = await fetch(process.env.REACT_APP_API_URL + "/planesdeAccion/", {
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
    GetPlanesAccion();
  }, []);

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
      SetButtonEdit(true);
    } else {
      SetButtonEdit(false);
    }
    setSelected(newSelected);
  };
  const editar = (event) => {
    localStorage.setItem("idPlanAccion", selected[0]);
  };
  const isSelected = (name) => selected.indexOf(name) !== -1;

  async function buscar(e) {
    e.persist();
    //await setBuscando(e.target.value);

    var search = data.filter((item) => {
      if (
        String(item.idplanaccion)
          .toLowerCase()
          .includes(e.target.value.toLowerCase()) ||
        item.nombre.toLowerCase().includes(e.target.value.toLowerCase()) ||
        item.responsablepa
          .toLowerCase()
          .includes(e.target.value.toLowerCase()) ||
        item.analistariesgos
          .toLowerCase()
          .includes(e.target.value.toLowerCase()) ||
        item.estadopa.toLowerCase().includes(e.target.value.toLowerCase()) ||
        item.descripcionpa
          .toLowerCase()
          .includes(e.target.value.toLowerCase()) /* ||
        item.fechacompromisoactual
          .toLowerCase()
          .includes(e.target.value.toLowerCase()) */
      ) {
        return item;
      }
    });

    setBuscando(e.target.value);
    setDataBusqueda(search);
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
          <h1 className="titulo">Planes de Acci??n</h1>
        </Col>
      </Row>
      <Row
        style={{ marginTop: "1%", marginBottom: "0.5%" }}
        className="mb-3 mt-3"
      >
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
        {/* <Col style={{ paddingTop: "0.3%" }} sm={2} xs={6}></Col> */}
        <Col
          style={{ paddingTop: "0.3%" }}
          className="d-flex justify-content-end"
          sm={3}
          xs={12}
        >
          {ButtonEdit && (props.permisos.ver || props.permisos.editar) ? (
            <Link to="editarPlanAccion">
              <Button
                className="botonNegativo"
                onClick={(event) => editar(event)}
              >
                Editar Plan
              </Button>
            </Link>
          ) : null}
        </Col>
        <Col
          style={{ paddingTop: "0.3%" }}
          className="d-flex justify-content-end"
          sm={3}
          xs={12}
        >
          {props.permisos.crear ? (
            <Link to="crearPlanAccion">
              <Button className="botonPositivo">Crear Plan</Button>
            </Link>
          ) : null}
        </Col>
        <Col
          style={{ paddingTop: "0.3%" }}
          className="d-flex justify-content-end"
          sm={3}
          xs={12}
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
                  <StyledTableCell>Id Plan Acci??n</StyledTableCell>
                  <StyledTableCell align="left">Nombre</StyledTableCell>
                  <StyledTableCell align="left">Estado</StyledTableCell>
                  <StyledTableCell align="left">Responsable</StyledTableCell>
                  <StyledTableCell align="left">
                    Analista de Riesgo
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    Fecha Compromiso Actual
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    ??ltimo Seguimiento
                  </StyledTableCell>
                  <StyledTableCell align="left">Avance (%)</StyledTableCell>
                </TableRow>
              </TableHead>
              {/* Fin de encabezado */}
              {/* Inicio de cuerpo de la tabla */}
              <TableBody>
                {dataBusqueda
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, index) => {
                    const isItemSelected = isSelected(row.idplanaccion);
                    return (
                      <StyledTableRow
                        key={row.idplanaccion}
                        hover
                        onClick={(event) =>
                          handleClick(event, row.idplanaccion)
                        }
                        selected={isItemSelected}
                        role="checkbox"
                        tabIndex={-1}
                      >
                        <StyledTableCell component="th" scope="row">
                          <Checkbox checked={isItemSelected} />
                        </StyledTableCell>
                        <StyledTableCell component="th" scope="row">
                          {row.idplanaccion ? row.idplanaccion : null}
                        </StyledTableCell>
                        <StyledTableCell align="left">
                          {row.nombre ? row.nombre : null}
                        </StyledTableCell>
                        <StyledTableCell align="left">
                          {row.estadopa ? row.estadopa : null}
                        </StyledTableCell>
                        <StyledTableCell align="left">
                          {row.responsablepa ? row.responsablepa : null}
                        </StyledTableCell>
                        <StyledTableCell align="left">
                          {row.analistariesgos !== null
                            ? row.analistariesgos
                            : null}
                        </StyledTableCell>
                        <StyledTableCell align="left">
                          {row.fechacompromisoactual
                            ? row.fechacompromisoactual
                            : null}
                        </StyledTableCell>
                        <StyledTableCell align="left">
                          {row.fechaseguimiento ? row.fechaseguimiento : null}
                        </StyledTableCell>
                        <StyledTableCell align="left">
                          {row.porcentajeavance
                            ? parseFloat(row.porcentajeavance) <= 1
                              ? parseFloat(row.porcentajeavance) * 100 + "%"
                              : parseFloat(row.porcentajeavance)
                            : null}
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
            rowsPerPageOptions={[20, 30, 100]}
            component="div"
            count={dataBusqueda.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
          {/* Fin de paginaci??n */}
        </Paper>
      )}
    </>
  );
}
