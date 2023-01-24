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

export default function UnidadesRiesgo(props) {
  const serviceAAD = new AADService();
  const classes = useStyles();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [selected, setSelected] = React.useState([]);
  const [ButtonEdit, SetButtonEdit] = React.useState(false);
  const [data, setData] = React.useState([]);
  const [dataBusqueda, setDataBusqueda] = React.useState([]);
  const [unidadesXCompania, setUnidadesXCompania] = React.useState([]);
  const [loadingData, setLoadingData] = React.useState(false);
  const [buscando, setBuscando] = React.useState(null);

  useEffect(() => {
    let compañias;
    let gerentes;
    let ids_unidadesRO = [];
    let lista_unidades_Companias;

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
    const getGerente = async () => {
      const result = await fetch(process.env.REACT_APP_API_URL + "/usuariosrol/0/2/", {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: "Bearer " + serviceAAD.getToken(),
        },
      });
      gerentes = await result.json();
    };

    const getCompaniasXunidad = async (ids_unidadesRO) => {
      const promises = ids_unidadesRO.map(async (unidadRO) => {
        const result = await fetch(
          process.env.REACT_APP_API_URL + "/maestros_ro/rx_unidad_compania/" +
            unidadRO +
            "/",
          {
            method: "GET",
            headers: {
              Accept: "application/json",
              Authorization: "Bearer " + serviceAAD.getToken(),
            },
          }
        );
        return await result.json();
      });

      lista_unidades_Companias = await Promise.all(promises);
      setUnidadesXCompania(lista_unidades_Companias);
    };

    const fetchdata = async () => {
      setLoadingData(true);
      await getCompanias();
      await getGerente();

      const result = await fetch(
        process.env.REACT_APP_API_URL + "/maestros_ro/unidad_riesgo/",
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            Authorization: "Bearer " + serviceAAD.getToken(),
          },
        }
      );
      let data = await result.json();

      if (data) {
        data.map((dat) => {
          ids_unidadesRO.push(dat.idunidad_riesgo);
          gerentes.map((ger) => {
            if (dat.gerente_riesgo == ger.idposicion) {
              dat.gerente_riesgo = {
                gerente_riesgo: ger.idposicion,
                nombre_usuario: ger.nombre,
              };
              return null;
            }
          });
        });
      }
      await getCompaniasXunidad(ids_unidadesRO);

      data.map((unidad) => {
        let compañias_name = lista_unidades_Companias.filter((compania) => {
          if (compania[0]) {
            return compania[0].idunidad_riesgo === unidad.idunidad_riesgo;
          }
        });
        let companias_join = [];
        if (compañias_name[0]) {
          compañias_name[0].map((companias) => {
            companias_join.push(companias.compania);
          });

          unidad["companias"] = companias_join.join();
          return true;
        } else {
          unidad["companias"] = "No se tiene";
          return false;
        }
        return null;
      });

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
    localStorage.setItem("idUnidad", selected[0]);
  };
  const isSelected = (name) => selected.indexOf(name) !== -1;

  async function buscar(e) {
    e.persist();
    //await setBuscando(e.target.value);
    try {
      var search = data.filter((item) => {
        if (
          String(item.idunidad_riesgo).includes(e.target.value.toLowerCase()) ||
          item.nombre.toLowerCase().includes(e.target.value.toLowerCase()) /* ||
          item.idcompania.compania
            .toLowerCase()
            .includes(e.target.value.toLowerCase()) ||
          item.gerente_riesgo
            .toLowerCase()
            .includes(e.target.value.toLowerCase()) */ ||
          item.riesgos_gestionados
            .toLowerCase()
            .includes(e.target.value.toLowerCase())
        ) {
          return item;
        }
      });
      /* await setBuscando(e.target.value);
      await setDataBusqueda(search); */
      await establecerBusqueda(search, e.target.value);
    } catch (error) {
      console.error("No se encuentra busqueda");
    }
  }

  const establecerBusqueda = async (data, value) => {
    setBuscando(value);
    setDataBusqueda(data);
  };

  let unidades_Companias = unidadesXCompania;

  /*  function pairUnidadesCompanias(idUnidadRO) {
    let nombreCompanias;

    unidades_Companias.map((e) => {
      if (e.length) {
        if (idUnidadRO == e[0].idunidad_riesgo) {
          nombreCompanias = e[0].compania;
        }
      } 
    });

    return String();
  } */
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
        <Col style={{ paddingTop: "0.3%" }} sm={2} xs={6}></Col>
        <Col
          style={{ paddingTop: "0.3%" }}
          className="d-flex justify-content-end"
          sm={3}
          xs={6}
        >
          <Link to="EditarUnidadRO">
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
        <Col
          style={{ paddingTop: "0.3%" }}
          className="d-flex justify-content-end"
          sm={3}
          xs={6}
        >
          {props.permisos.crear ? (
            <Link to="NuevaUnidadRO">
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
                  <StyledTableCell>ID Unidad</StyledTableCell>
                  <StyledTableCell align="left">Nombre</StyledTableCell>
                  <StyledTableCell align="left">Compañia</StyledTableCell>
                  <StyledTableCell align="left">Gerente</StyledTableCell>
                  <StyledTableCell align="left">
                    Riesgos Gestionados
                  </StyledTableCell>
                  <StyledTableCell align="left">Estado</StyledTableCell>
                </TableRow>
              </TableHead>
              {/* Fin de encabezado */}
              {/* Inicio de cuerpo de la tabla */}
              <TableBody>
                {dataBusqueda
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, index) => {
                    const isItemSelected = isSelected(row.idunidad_riesgo);
                    return (
                      <StyledTableRow
                        key={row.idunidad_riesgo}
                        hover
                        onClick={(event) =>
                          handleClick(event, row.idunidad_riesgo)
                        }
                        selected={isItemSelected}
                        role="checkbox"
                        tabIndex={-1}
                      >
                        <StyledTableCell component="th" scope="row">
                          <Checkbox checked={isItemSelected} />
                        </StyledTableCell>
                        <StyledTableCell component="th" scope="row">
                          {row.idunidad_riesgo}
                        </StyledTableCell>
                        <StyledTableCell align="left">
                          {row.nombre}
                        </StyledTableCell>
                        <StyledTableCell align="left">
                          {row.companias}
                        </StyledTableCell>
                        <StyledTableCell align="left">
                          {row.gerente_riesgo &&
                          row.gerente_riesgo.nombre_usuario
                            ? row.gerente_riesgo.nombre_usuario
                            : null}
                        </StyledTableCell>
                        <StyledTableCell align="left">
                          {row.riesgos_gestionados}
                        </StyledTableCell>
                        <StyledTableCell align="left">
                          {row.estado_riesgo ? "Activa" : "Inactiva"}
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
