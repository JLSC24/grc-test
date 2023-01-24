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

import { adalApiFetch } from "../../auth/adalConfig";
import AADService from "../../auth/authFunctions";

import { UsuarioContext } from "../../Context/UsuarioContext";

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
export default function Listas(props) {
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
    const fetchdata = async () => {
      const resultRol = await fetch(process.env.REACT_APP_API_URL + "/listas_generales/", {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: "Bearer " + serviceAAD.getToken(),
        },
      })
      let data = await resultRol.json();


      setData(data);
      setDataBusqueda(data);
      setEvaluacion(data);
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
    localStorage.setItem("idm_parametrosgenerales", selected[0]);
  };
  const isSelected = (name) => selected.indexOf(name) !== -1;

  async function buscar(e) {
    e.persist();
    //await setBuscando(e.target.value);
    try {
      var search = data.filter((item) => {
        if (
          String(item.idm_parametrosgenerales).includes(e.target.value.toLowerCase()) ||
          item.grupo.toLowerCase().includes(e.target.value.toLowerCase()) /* ||
          item.idcompania.compania
            .toLowerCase()
            .includes(e.target.value.toLowerCase()) ||
          item.gerente_riesgo
            .toLowerCase()
            .includes(e.target.value.toLowerCase()) */ ||
          item.parametro
            .toLowerCase()
            .includes(e.target.value.toLowerCase())
        ) {
          return item;
        }
      });
      
      await establecerBusqueda(search, e.target.value);
    } catch (error) {
      console.error("No se encuentra busqueda");
    }
  }
  const establecerBusqueda = async (data, value) => {
    setBuscando(value);
    setDataBusqueda(data);
  };




  return (
    <>
      <Row className="mb-3 mt-3">
        <Col md={12}>
          <h1 className="titulo">Listas Generales</h1>
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
            <Link to={{
              pathname:"EditarLista",
              state: {idlista: selected[0]}
              }}>
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
            <Link to="NuevaLista">
              <Button className="botonPositivo">Crear Lista</Button>
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
                <TableRow className="tr">
                  <StyledTableCell padding="checkbox"></StyledTableCell>
                  <StyledTableCell align="left">Id</StyledTableCell>
                  <StyledTableCell align="left">Grupo</StyledTableCell>
                  <StyledTableCell align="left">Parametro</StyledTableCell>
                  <StyledTableCell align="left">
                    Valor
                  </StyledTableCell>
                </TableRow>
              </TableHead>
              {/* Fin de encabezado */}
              {/* Inicio de cuerpo de la tabla */}
              <TableBody>
                {dataBusqueda
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, index) => {
                    const isItemSelected = isSelected(row.idm_parametrosgenerales);
                    return (
                      <StyledTableRow
                        key={row.idm_parametrosgenerales}
                        hover
                        onClick={(event) =>
                          handleClick(event, row.idm_parametrosgenerales)
                        }
                        selected={isItemSelected}
                        role="checkbox"
                        tabIndex={-1}
                      >
                        <StyledTableCell component="th" scope="row">
                          <Checkbox checked={isItemSelected} />
                        </StyledTableCell>
                        <StyledTableCell component="th" scope="row">
                          {row.idm_parametrosgenerales !== null ? row.idm_parametrosgenerales : null}
                        </StyledTableCell>
                        <StyledTableCell align="left">
                          {row.grupo !== null
                            ? row.grupo
                            : null}
                        </StyledTableCell>
                        <StyledTableCell align="left">
                          {row.parametro !== null ? row.parametro : null}
                        </StyledTableCell>
                        <StyledTableCell align="left">
                          {row.valor !== null
                            ? row.valor
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
