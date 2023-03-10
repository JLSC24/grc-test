import React, { useState, useEffect } from "react";
import axios from "axios";
import AADService from "../auth/authFunctions";
import { Row, Col, Button, Form } from "react-bootstrap";
import { IoMdDownload } from "react-icons/io";
import { useHistory } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
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
import { Link } from "react-router-dom";
import Loader from "react-loader-spinner";
import { adalApiFetch } from "../auth/adalConfig";

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

export default function RegistrosPendientes(props) {
  const serviceAAD = new AADService();
  const classes = useStyles();
  const [permisos, setPermisos] = React.useState(props.permisos);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [selected, setSelected] = React.useState([]);
  const [ButtonEdit, SetButtonEdit] = React.useState(false);
  const [data, setData] = React.useState([]);
  const [dataBusqueda, setDataBusqueda] = React.useState([]);
  const [loadingData, setLoadingData] = React.useState(false);
  const [buscando, setBuscando] = React.useState(null);

  useEffect(() => {
    let compa??ias;
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
      compa??ias = await result.json();
    };
    const fetchdata = async () => {
      setLoadingData(true);
      await getCompanias();
      const result = await fetch(process.env.REACT_APP_API_URL + "/maestros_ro/area_o/", {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: "Bearer " + serviceAAD.getToken(),
        },
      });
      let data = await result.json();
      if (data) {
        data.map((dat) => {
          compa??ias.map((comp) => {
            if (dat.idcompania == comp.idcompania) {
              dat.idcompania = {
                idcompania: comp.idcompania,
                compa??ia: comp.compania,
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
    //getCompanias();
    fetchdata();
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

  async function buscar(e) {
    e.persist();
    //await setBuscando(e.target.value);
    var search = data.filter((item) => {
      if (
        String(item.idarea_organizacional)
          .toLowerCase()
          .includes(e.target.value.toLowerCase()) ||
        item.nombre.toLowerCase().includes(e.target.value.toLowerCase()) ||
        item.idcompania.compa??ia
          .toLowerCase()
          .includes(e.target.value.toLowerCase()) /* ||
        item.idcompania.compa??ia
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
  const editar = (event) => {
    localStorage.setItem("idArea", selected[0]);
  };

  const isSelected = (name) => selected.indexOf(name) !== -1;

  return (
    <>
      {/* <-------------------------------------fila 1-------------------------------------> */}
      <Row className="mb-3 mt-3">
        <Col md={12}>
          <h1 className="titulo">Registros pendientes de reclasificaci??n</h1>
        </Col>
      </Row>
      {/* <-------------------------------------fila 2-------------------------------------> */}
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
        <Col style={{ paddingTop: "0.3%" }} sm={2} xs={6}></Col>
        <Col
          style={{ paddingTop: "0.3%" }}
          className="d-flex justify-content-end"
          sm={3}
          xs={6}
        >
          {ButtonEdit && (props.permisos.editar || props.permisos.ver) ? (
            <Link to="EditarRegistro">
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
            <Link to="NuevoRegistro">
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
                  <StyledTableCell>ID</StyledTableCell>
                  <StyledTableCell align="left">
                    Compa????a contable
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    Cuenta contable
                  </StyledTableCell>
                  <StyledTableCell align="left">A??o contable</StyledTableCell>
                  <StyledTableCell align="left">Mes contable</StyledTableCell>
                  <StyledTableCell align="left">valor</StyledTableCell>
                </TableRow>
              </TableHead>
              {/* Fin de encabezado */}
              {/* Inicio de cuerpo de la tabla */}
              <TableBody>
                {dataBusqueda
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, index) => {
                    const isItemSelected = isSelected(
                      row.idarea_organizacional
                    );
                    return (
                      <StyledTableRow
                        key={row.idarea_organizacional}
                        hover
                        onClick={(event) =>
                          handleClick(event, row.idarea_organizacional)
                        }
                        selected={isItemSelected}
                        role="checkbox"
                        tabIndex={-1}
                      >
                        <StyledTableCell component="th" scope="row">
                          <Checkbox checked={isItemSelected} />
                        </StyledTableCell>
                        <StyledTableCell component="th" scope="row">
                          {row.idarea_organizacional !== null
                            ? row.idarea_organizacional
                            : null}
                        </StyledTableCell>
                        <StyledTableCell align="left">
                          {row.nombre !== null ? row.nombre : null}
                        </StyledTableCell>
                        <StyledTableCell align="left">
                          {row.idcompania !== null
                            ? row.idcompania.compa??ia
                            : null}
                        </StyledTableCell>
                        <StyledTableCell align="left">
                          {row.nivel !== null ? row.nivel : null}
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
      )}
    </>
  );
}
