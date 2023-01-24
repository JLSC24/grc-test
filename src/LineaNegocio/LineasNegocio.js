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
import { Button, Row, Col, Form } from "react-bootstrap";
import { Link } from "react-router-dom";
import Loader from "react-loader-spinner";

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

export default function LineasNegocio(props) {
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

  useEffect(() => {
    const fetchdata = async () => {
      setLoadingData(true);
      const result = await fetch(process.env.REACT_APP_API_URL + "/maestros_ro/ln/", {
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
    localStorage.setItem("idLineaNegocio", selected[0]);
  };
  const isSelected = (name) => selected.indexOf(name) !== -1;

  async function buscar(e) {
    e.persist();
    //await setBuscando(e.target.value);
    var search = data.filter((item) => {
      if (
        String(item.idln).includes(e.target.value.toLowerCase()) ||
        item.nombre.toLowerCase().includes(e.target.value.toLowerCase())
      ) {
        return item;
      }
    });
    await setBuscando(e.target.value);
    await setDataBusqueda(search);
  }

  return (
    <>
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
          <Link to="EditarLineaNegocio">
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
            <Link to="NuevaLineaNegocio">
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
                  <StyledTableCell>ID Linea de Negocio</StyledTableCell>
                  <StyledTableCell align="left">Nombre</StyledTableCell>
                  <StyledTableCell align="left">Description</StyledTableCell>
                  <StyledTableCell align="left">Nivel</StyledTableCell>
                  <StyledTableCell align="left">Estado</StyledTableCell>
                </TableRow>
              </TableHead>
              {/* Fin de encabezado */}
              {/* Inicio de cuerpo de la tabla */}
              <TableBody>
                {dataBusqueda
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, index) => {
                    const isItemSelected = isSelected(row.idln);
                    return (
                      <StyledTableRow
                        key={row.idln}
                        hover
                        onClick={(event) => handleClick(event, row.idln)}
                        selected={isItemSelected}
                        role="checkbox"
                        tabIndex={-1}
                      >
                        <StyledTableCell component="th" scope="row">
                          <Checkbox checked={isItemSelected} />
                        </StyledTableCell>
                        <StyledTableCell component="th" scope="row">
                          {row.idln}
                        </StyledTableCell>
                        <StyledTableCell align="left">
                          {row.nombre}
                        </StyledTableCell>
                        <StyledTableCell align="left">
                          {row.descripcion_ln}
                        </StyledTableCell>
                        <StyledTableCell align="left">
                          {row.nivel}
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
    </>
  );
}
