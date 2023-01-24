import React, { useEffect } from "react";
import { Row, Col, Form, Button, Modal } from "react-bootstrap";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import Paper from "@mui/material/Paper";
import Checkbox from "@mui/material/Checkbox";
import { visuallyHidden } from "@mui/utils";

const _ = require("lodash");

const useStylesModal = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  paper: {
    width: "100%",
    //marginBottom: theme.spacing(2),
  },
  table: {
    minWidth: 750,
  },
  head: {
    backgroundColor: "#2c2a29",
    color: "#ffffff",
  },
  visuallyHidden: {
    border: 0,
    clip: "rect(0 0 0 0)",
    height: 1,
    margin: -1,
    overflow: "hidden",
    padding: 0,
    position: "absolute",
    top: 20,
    width: 1,
  },
  container: {
    maxHeight: "55vh",
    minHeight: "55vh",
  },
}));

const headCellsModal = [
  {
    id: "idriesgo",
    numeric: false,
    disablePadding: true,
    label: "Id Riesgo",
  },
  {
    id: "categoria_corporativa",
    numeric: false,
    disablePadding: false,
    label: "Categoría corporativa",
  },
  {
    id: "sub_categoria_riesgo",
    numeric: false,
    disablePadding: false,
    label: "Subcategoría corporativa",
  },
  {
    id: "nombre_riesgo",
    numeric: false,
    disablePadding: false,
    label: "Riesgo",
  },
  {
    id: "descripcion_riesgo",
    numeric: false,
    disablePadding: false,
    label: "Descripción",
  },
  {
    id: "p50",
    numeric: false,
    disablePadding: false,
    label: "P50",
  },
  {
    id: "p95",
    numeric: false,
    disablePadding: false,
    label: "P95",
  },
  {
    id: "nivel_riesgo_inherente",
    numeric: false,
    disablePadding: false,
    label: "Riesgo Inherente",
  },
  {
    id: "nivel_riesgo_residual",
    numeric: false,
    disablePadding: false,
    label: "Riesgo Residual",
  }, 
  {
    id: "exposicion_inherente",
    numeric: false,
    disablePadding: false,
    label: "Exposición Inherente",
  },
  {
    id: "exposicion_residual",
    numeric: false,
    disablePadding: false,
    label: "Exposición Residual",
  }, 
];

export default function ModalBuscarRiesgos({
  modalShow,
  setModalShow,
  listaGeneralRiesgos,
  setListaGeneralRiesgos,
  selected,
  setFlagEstado,
  setSelected,
}) {
  const classes = useStylesModal();
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("name");
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const [riesgosSelected_BuscarRiesgos, setRiesgosSelected_BuscarRiesgos] =
    React.useState([]);
  const [buscando, setBuscando] = React.useState(null);
  const [modalBuscarR, setModalBuscarR] = React.useState([]);

  useEffect(() => {
    //** filtra riesgos segun su propiedad estado_enVista */

    const muestraRiesgosXTabla = (consolidadoRiesgos, tabla) => {
      let riesgosXmostrar = [];
      consolidadoRiesgos.map((riesgo) => {
        if (
          (riesgo.estado_enVista === "Activo" ||
            riesgo.estado_enVista === "Sugerido" ||
            riesgo.estado_enVista === "Agregado") &&
          tabla === "Tabla_Activos"
        ) {
          riesgosXmostrar.push(riesgo);
        } else if (
          riesgo.estado_enVista === "Inactivos" &&
          tabla === "Inactivos"
        ) {
          riesgosXmostrar.push(riesgo);
        } else if (
          riesgo.estado_enVista === "Buscado" &&
          tabla === "Busqueda_riesgos"
        ) {
          riesgosXmostrar.push(riesgo);
        }
      });
      return riesgosXmostrar;
    };

    let riesgos_ModalBuscar = muestraRiesgosXTabla(
      listaGeneralRiesgos,
      "Busqueda_riesgos"
    );
    setModalBuscarR(riesgos_ModalBuscar);
  }, [listaGeneralRiesgos]);

  function EnhancedTableHeadModal(props) {
    const { order, orderBy, onRequestSort } = props;

    const createSortHandler = (property) => (event) => {
      onRequestSort(event, property);
    };

    return (
      <TableHead>
        <TableRow style={{ backgroundColor: "#2c2a29", color: "#ffffff" }}>
          <TableCell
            padding="checkbox"
            align="center"
            style={{ backgroundColor: "#2c2a29", color: "#ffffff" }}
          ></TableCell>
          {headCellsModal.map((headCell) => (
            <TableCell
              key={headCell.id}
              align="center"
              padding={headCell.disablePadding ? "none" : "normal"}
              sortDirection={orderBy === headCell.id ? order : false}
              style={{ backgroundColor: "#2c2a29", color: "#ffffff" }}
            >
              <TableSortLabel
                active={orderBy === headCell.id}
                direction={orderBy === headCell.id ? order : "asc"}
                onClick={createSortHandler(headCell.id)}
                className="text"
              >
                {headCell.label}
                {orderBy === headCell.id ? (
                  <Box component="span" sx={visuallyHidden}>
                    {order === "desc"
                      ? "sorted descending"
                      : "sorted ascending"}
                  </Box>
                ) : null}
              </TableSortLabel>
            </TableCell>
          ))}
        </TableRow>
      </TableHead>
    );
  }

  EnhancedTableHeadModal.propTypes = {
    numSelected: PropTypes.number.isRequired,
    onRequestSort: PropTypes.func.isRequired,
    onSelectAllClick: PropTypes.func.isRequired,
    order: PropTypes.oneOf(["asc", "desc"]).isRequired,
    orderBy: PropTypes.string.isRequired,
    rowCount: PropTypes.number.isRequired,
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleClick_BuscarRiesgos = (event, id) => {
    const selectedIndex = riesgosSelected_BuscarRiesgos.indexOf(id);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(riesgosSelected_BuscarRiesgos, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(riesgosSelected_BuscarRiesgos.slice(1));
    } else if (selectedIndex === riesgosSelected_BuscarRiesgos.length - 1) {
      newSelected = newSelected.concat(
        riesgosSelected_BuscarRiesgos.slice(0, -1)
      );
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        riesgosSelected_BuscarRiesgos.slice(0, selectedIndex),
        riesgosSelected_BuscarRiesgos.slice(selectedIndex + 1)
      );
    }
    setRiesgosSelected_BuscarRiesgos(newSelected);
  };
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  function stableSortModal(array, comparator) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
      const order = comparator(a[0], b[0]);
      if (order !== 0) {
        return order;
      }
      return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
  }
  const isSelected = (id) => riesgosSelected_BuscarRiesgos.indexOf(id) !== -1;

  async function buscar(e) {
    e.persist();
    //await setBuscando(e.target.value);
    try {
      var search = muestraRiesgosXTabla(
        listaGeneralRiesgos,
        "Busqueda_riesgos"
      ).filter((item) => {
        if (
          String(item.idriesgo)
            .toLowerCase()
            .includes(e.target.value.toLowerCase()) ||
          item.nombre_riesgo
            .toLowerCase()
            .includes(e.target.value.toLowerCase())
        ) {
          return item;
        }
      });
      await setBuscando(e.target.value);
      await setModalBuscarR(search);
    } catch (error) {
      console.error("No se encuentra el riesgo");
    }
  }

  //** muestra riesgos segun su propiedad estado_enVista */

  const muestraRiesgosXTabla = (consolidadoRiesgos, tabla) => {
    let riesgosXmostrar = [];
    consolidadoRiesgos.map((riesgo) => {
      if (
        (riesgo.estado_enVista === "Activo" ||
          riesgo.estado_enVista === "Sugerido" ||
          riesgo.estado_enVista === "Agregado") &&
        tabla === "Tabla_Activos"
      ) {
        riesgosXmostrar.push(riesgo);
      } else if (
        riesgo.estado_enVista === "Inactivos" &&
        tabla === "Inactivos"
      ) {
        riesgosXmostrar.push(riesgo);
      } else if (
        riesgo.estado_enVista === "Buscado" &&
        tabla === "Busqueda_riesgos"
      ) {
        riesgosXmostrar.push(riesgo);
      }
    });
    return riesgosXmostrar;
  };

  //** filtra riesgos para evitar registros repetidos */

  const filtraRiesgos = (listaGeneral, nuevaLista, tipoNuevaLista) => {
    //** Toma como propiedades 1. la lista general o consolidada de todos los riesgos: Activos + Inactivos + Sugeridos + Buscados 2.La nueva lista de Riesgos que se agregará: Riesgos Activos, Riesgos Escaneados, Riesgos Buscados

    //* Devuelve el riesgo de mayor prelación Activo||Inactivo > Sugerido > Buscado --- Es invocado mas adelante
    const comparaRiesgos = (riesgoAntiguo, riesgoNuevo) => {
      if (
        riesgoAntiguo.estado_enVista === "Activo" ||
        riesgoAntiguo.estado_enVista === "Inactivo"
      ) {
        return riesgoAntiguo;
      } else if (
        riesgoNuevo.estado_enVista === "Activo" ||
        riesgoNuevo.estado_enVista === "Inactivo"
      ) {
        return riesgoNuevo;
      } else if (riesgoAntiguo.estado_enVista === "Agregado") {
        return riesgoAntiguo;
      } else if (riesgoNuevo.estado_enVista === "Agregado") {
        return riesgoNuevo;
      } else if (riesgoAntiguo.estado_enVista === "Sugerido") {
        return riesgoAntiguo;
      } else if (riesgoNuevo.estado_enVista === "Sugerido") {
        return riesgoNuevo;
      } else if (riesgoAntiguo.estado_enVista === "Buscado") {
        return riesgoAntiguo;
      } else if (riesgoNuevo.estado_enVista === "Buscado") {
        return riesgoNuevo;
      }
    };

    let consolidadoRiesgos;
    if (nuevaLista.length === 0) {
      //* Solamente existe un caso cuando la nueva lista está vacía, sucede cuando hace una consulta en "ScanRiesgos" y no hay ninguno asociado

      consolidadoRiesgos = listaGeneral.filter(
        (riesgoConsolidado) => riesgoConsolidado.estado_enVista !== "Sugerido"
      );
    } else if (nuevaLista.length !== 0) {
      if (listaGeneral.length !== 0) {
        //** Elimina los riesgos Anteriormente escaneados si el filtro se hace desde Escanear Riesgos*/

        if (tipoNuevaLista === "Riesgos_escaneados") {
          listaGeneral = listaGeneral.filter(
            (riesgo) => riesgo.estado_enVista !== "Sugerido"
          );
        }

        //* funcion principal: Compara la listaGeneral de Riesgos y la NuevaLista de Riesgos, obtiene los repetidos y prevalece el mas importante (ver función comparaRiesgos)...
        //* ... Luego obtiene los riesgos que no se repiten de cada lista, y une todos los riesgos en Consolidado Riesgo
        //* ... consolidado riesgos se mostrará en cada tabla respectivamente según su propiedad "estado_enVista"
        let arr = [];
        let res;
        nuevaLista.map((riesgoNuevo) => {
          //* devuelve el indice del riesgo repetido, de lo contrario devuelve -1
          res = _.findIndex(
            listaGeneral,
            (e) => {
              return e.idriesgo == riesgoNuevo.idriesgo;
            },
            0
          );

          //*
          if (res !== -1) {
            var riesgoAntiguo = listaGeneral.filter(
              (e) => e.idriesgo === riesgoNuevo.idriesgo
            )[0];
            let aux = comparaRiesgos(riesgoAntiguo, riesgoNuevo);
            arr.push(aux);
          }
        });

        //* Obtienen los riesgos únicos de cada array de riesgos
        let dif1 = _.differenceBy(nuevaLista, listaGeneral, "idriesgo");
        let dif2 = _.differenceBy(listaGeneral, nuevaLista, "idriesgo");

        let riesgosUnicos = _.concat(dif1, dif2);
        consolidadoRiesgos = _.concat(riesgosUnicos, arr);

        consolidadoRiesgos.sort(function (a, b) {
          if (a.idriesgo > b.idriesgo) {
            return 1;
          }
          if (a.idriesgo < b.idriesgo) {
            return -1;
          }
          // a must be equal to b
          return 0;
        });
      } else if (listaGeneral.length === 0) {
        consolidadoRiesgos = nuevaLista;
      }
    }

    return consolidadoRiesgos;
  };

  //**Agrega los riesgos seleccionados al consolidado de riesgos */

  const completarTabla = (riesgos) => {
    const seleccionaRiesgos = (riesgosAgregados) => {
      let newSelected = selected.concat(riesgosAgregados);

      setSelected(newSelected);
    };

    seleccionaRiesgos(riesgos);

    //* Agrega las propiedades de los riesgos seleccionados y actualiza su estado en vista a "Agregado"

    let nuevaLista = [];
    riesgos.map((a) => {
      let riesgoCompleto = listaGeneralRiesgos.filter(
        (e) => e.idriesgo === a
      )[0];
      riesgoCompleto.estado_enVista = "Agregado";
      nuevaLista.push(riesgoCompleto);
    });

    let riesgos_filtrados = filtraRiesgos(listaGeneralRiesgos, nuevaLista);

    setListaGeneralRiesgos(riesgos_filtrados);
    setModalShow(false);
  };

  //**Los riesgos que agrega aparecen como seleccionados */

  function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
      return -1;
    }
    if (b[orderBy] > a[orderBy]) {
      return 1;
    }
    return 0;
  }

  function getComparator(order, orderBy) {
    return order === "desc"
      ? (a, b) => descendingComparator(a, b, orderBy)
      : (a, b) => -descendingComparator(a, b, orderBy);
  }

  return (
    <Modal
      show={modalShow}
      onHide={() => {
        setModalShow(false);
      }}
      size="xl"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      backdrop="static"
    >
      <Modal.Header closeButton>
        <Modal.Title className="subtitulo" id="contained-modal-title-vcenter">
          Buscar riesgos
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className={classes.root}>
          <Row className="mb-3">
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
          </Row>
          <Paper className={classes.paper}>
            <TableContainer className={classes.container}>
              <Table
                stickyHeader
                className={classes.table}
                aria-labelledby="tableTitle"
                size={dense ? "small" : "medium"}
                aria-label="enhanced table"
              >
                <EnhancedTableHeadModal
                  style={{ backgroundColor: "#2c2a29", color: "#ffffff" }}
                  classes={classes.head}
                  numSelected={riesgosSelected_BuscarRiesgos.length}
                  order={order}
                  orderBy={orderBy}
                  onRequestSort={handleRequestSort}
                  rowCount={modalBuscarR.length}
                />

                <TableBody>
                  {stableSortModal(modalBuscarR, getComparator(order, orderBy))
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row, index) => {
                      const isItemSelected = isSelected(row.idriesgo);
                      const labelId = `enhanced-table-checkbox-${index}`;
                      return (
                        <TableRow
                          onClick={(event) =>
                            handleClick_BuscarRiesgos(event, row.idriesgo)
                          }
                          role="checkbox"
                          aria-checked={isItemSelected}
                          tabIndex={-1}
                          key={row.idriesgo}
                          selected={isItemSelected}
                        >
                          <TableCell padding="checkbox">
                            <Checkbox
                              checked={isItemSelected}
                              inputProps={{ "aria-labelledby": labelId }}
                            />
                          </TableCell>
                          <TableCell
                            component="th"
                            id={labelId}
                            scope="row"
                            align="left"
                          >
                            {row.idriesgo}
                          </TableCell>
                          <TableCell align="right">
                            {row.categoria_corporativa
                              ? row.categoria_corporativa
                              : null}
                          </TableCell>
                          <TableCell align="right">
                            {row.sub_categoria_riesgo
                              ? row.sub_categoria_riesgo
                              : null}
                          </TableCell>

                          <TableCell align="right">
                            {row.nombre_riesgo ? row.nombre_riesgo : null}
                          </TableCell>
                          <TableCell align="right">
                            {row.descripcion_riesgo
                              ? row.descripcion_riesgo
                              : null}
                          </TableCell>
                          <TableCell align="right">
                            {" "}
                            {row.p50 ? row.p50 : null}
                          </TableCell>
                          <TableCell align="right">
                            {row.p95 ? row.p95 : null}
                          </TableCell>
                          <TableCell align="center">
                              {row.nivel_riesgo_inherente
                                ? row.nivel_riesgo_inherente
                                : null}
                            </TableCell>
                            <TableCell align="center">
                              {row.nivel_riesgo_residual
                                ? row.nivel_riesgo_residual
                                : null}
                            </TableCell>
                            <TableCell align="right">
                              {row.exposicion_inherente
                                ? parseFloat(row.exposicion_inherente).toLocaleString()
                                : null}
                            </TableCell>
                            <TableCell align="right">
                              {row.exposicion_residual
                                ? parseFloat(row.exposicion_residual).toLocaleString()
                                : null}
                            </TableCell>
                        </TableRow>
                      );
                    })}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[10, 20, 30]}
              component="div"
              count={modalBuscarR.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              labelRowsPerPage={"Filas por página"}
            />
          </Paper>
          <Row className="mt-3 justify-content-end">
            <Col sm={4} xs={6}>
              <Button
                className="botonPositivo"
                style={{ marginTop: "1%", width: "100%" }}
                onClick={() => {
                  completarTabla(riesgosSelected_BuscarRiesgos);
                  setFlagEstado(true);
                  setModalShow(false);
                }}
              >
                {" "}
                Agregar{" "}
              </Button>
            </Col>
          </Row>
        </div>
      </Modal.Body>
    </Modal>
  );
}
