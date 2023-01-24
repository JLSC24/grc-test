import React, { useEffect, useState, useContext, useCallback } from "react";

import { Link, Routes, Route, useHistory, useLocation } from "react-router-dom";

import { Button, Row, Col, Form, Container } from "react-bootstrap";

import AADService from "../auth/authFunctions";

import { UsuarioContext } from "../Context/UsuarioContext";

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

import Loader from "react-loader-spinner";

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
    minHeight: "60vh",
  },
});

export default function Macroriesgos() {
  const serviceAAD = new AADService();

  const history = useHistory();

  const location = useLocation();

  const { dataUsuario } = useContext(UsuarioContext);

  const classes = useStyles();

  const [data, setData] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [selected, setSelected] = React.useState([]);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const [buscando, setBuscando] = React.useState(null);

  const [ButtonEdit, SetButtonEdit] = React.useState(false);
  const [loadingData, setLoadingData] = React.useState(false);
  const [dataBusqueda, setDataBusqueda] = React.useState([]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };
  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat([], name);
      SetButtonEdit(true);
    } else {
      SetButtonEdit(false);
    }

    console.log(newSelected);
    setSelected(newSelected);
  };
  const isSelected = (name) => selected.indexOf(name) !== -1;

  const Editar = () => {
    history.push({
      pathname: "/EditarMacroriesgo",
      state: {
        idMacroriesgo: selected[0],
      },
    });
  };

  const Crear = () => {
    history.push({
      pathname: "/CrearMacroriesgo",
    });
  };

  async function buscar(e) {
    e.persist();
    //await setBuscando(e.target.value);
    var search = data.filter((item) => {
      if (
        String(item.idarea_organizacional)
          .toLowerCase()
          .includes(e.target.value.toLowerCase()) ||
        item.nombre.toLowerCase().includes(e.target.value.toLowerCase()) ||
        item.idcompania.compañia
          .toLowerCase()
          .includes(e.target.value.toLowerCase()) /* ||
        item.idcompania.compañia
          .toLowerCase()
          .includes(e.target.value.toLowerCase()) */
      ) {
        return item;
      }
    });
    //await setBuscando(e.target.value);
    //await setDataBusqueda(search);
    await setDatosBusqueda(e.target.value, search);
  }
  const setDatosBusqueda = async (buscando, busqueda) => {
    setBuscando(buscando);
    setDataBusqueda(busqueda);
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoadingData(true);

      const result = await fetch(process.env.REACT_APP_API_URL + "/macroriesgos/", {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: "Bearer " + serviceAAD.getToken(),
        },
      });

      let data = await result.json();

      setData(data);
      setDataBusqueda(data);
      setLoadingData(false);
    };

    fetchData();
  }, []);

  const goBack = () => {
    history.goBack();
  };

  return (
    <>
      <Container fluid>
        <Row className="mb-3 mt-3">
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

          <Col sm={4} xs={12}></Col>

          <Col sm={2} xs={12}>
            {ButtonEdit ? (
              <Button
                className="botonNegativo"
                onClick={(event) => Editar(event)}
              >
                Editar
              </Button>
            ) : (
              <></>
            )}
          </Col>
          <Col sm={2} xs={12}>
            <Link to="CrearMacroriesgo">
              <Button className="botonPositivo">Crear</Button>
            </Link>
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
                    <StyledTableCell>ID Macro riesgo</StyledTableCell>
                    <StyledTableCell align="left">Macro riesgo</StyledTableCell>
                    <StyledTableCell align="left">Descripción</StyledTableCell>

                    <StyledTableCell align="left">
                      Tipo ubicación
                    </StyledTableCell>

                    <StyledTableCell align="left">Ubicación</StyledTableCell>

                    <StyledTableCell align="left">Arista</StyledTableCell>
                    <StyledTableCell align="left">Estado</StyledTableCell>
                  </TableRow>
                </TableHead>
                {/* Fin de encabezado */}
                {/* Inicio de cuerpo de la tabla */}
                <TableBody>
                  {dataBusqueda
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row, index) => {
                      const isItemSelected = isSelected(row.idmacroriesgos);
                      return (
                        <StyledTableRow
                          key={row.idmacroriesgos}
                          hover
                          onClick={(event) =>
                            handleClick(event, row.idmacroriesgos)
                          }
                          selected={isItemSelected}
                          role="checkbox"
                          tabIndex={-1}
                        >
                          <StyledTableCell component="th" scope="row">
                            <Checkbox checked={isItemSelected} />
                          </StyledTableCell>

                          <StyledTableCell component="th" scope="row">
                            {row.idmacroriesgos ? row.idmacroriesgos : null}
                          </StyledTableCell>

                          <StyledTableCell align="left">
                            {row.macroriesgo ? row.macroriesgo : null}
                          </StyledTableCell>

                          <StyledTableCell align="left">
                            {row.descripcion ? row.descripcion : null}
                          </StyledTableCell>

                          <StyledTableCell align="left">
                            {row.ubicacion_1 ? row.ubicacion_1 : null}
                          </StyledTableCell>

                          <StyledTableCell align="left">
                            {row.ubicacion_2 ? row.ubicacion_2 : null}
                          </StyledTableCell>

                          <StyledTableCell align="left">
                            {row.arista ? row.arista : null}
                          </StyledTableCell>

                          <StyledTableCell align="left">
                            {row.estado ? "Activa" : "Inactiva"}
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
      </Container>
    </>
  );
}
