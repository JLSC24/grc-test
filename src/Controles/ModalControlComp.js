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
    id: "idcontrol",
    numeric: false,
    disablePadding: true,
    label: "Id Control",
  },
  {
    id: "nombre",
    numeric: false,
    disablePadding: false,
    label: "Nombre control",
  },
  {
    id: "descripcion_control",
    numeric: false,
    disablePadding: false,
    label: "Descripción control",
  },
  {
    id: "automiatizacion",
    numeric: false,
    disablePadding: false,
    label: "Automatización",
  },
  {
    id: "naturaleza",
    numeric: false,
    disablePadding: false,
    label: "Naturaleza",
  },
  {
    id: "cubrimiento",
    numeric: false,
    disablePadding: false,
    label: "Cubrimiento",
  },
  {
    id: "prevalorizacion",
    numeric: false,
    disablePadding: false,
    label: "Prevaloraizacion",
  },
  {
    id: "resultado_testing_VAI",
    numeric: false,
    disablePadding: false,
    label: "Resultado_testig_VAI",
  },
  {
    id: "cobertura",
    numeric: false,
    disablePadding: false,
    label: "Cobertura del control a la causa",
  },
  {
    id: "justificacion",
    numeric: false,
    disablePadding: false,
    label: "Justificación de la cobertura a la causa",
  },
];

export default function ModalBuscarComp({
  modalShow,
  setModalShow,
  listaGeneralControles,
  setListaGeneralControles,
  selected,
  setSelected,
}) {
  const classes = useStylesModal();
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("name");
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const [controlSelected, setControlSelected] = React.useState([]);
  const [buscando, setBuscando] = React.useState(null);
  const [modalBuscarC, setModalBuscarC] = React.useState([]);

  useEffect(() => {
    //** filtra controles segun su propiedad estado_enVista */
    const muestraControlesXTabla = (consolidadoControles, tabla) => {
      let controlesXmostrar = [];
      consolidadoControles.map((control) => {
        if (
          (control.estado_enVista === "Activo" ||
            control.estado_enVista === "Agregado") &&
          tabla === "Tabla_Activos"
        ) {
          controlesXmostrar.push(control);
        } else if (
          control.estado_enVista === "Inactivos" &&
          tabla === "Inactivos"
        ) {
          controlesXmostrar.push(control);
        } else if (
          control.estado_enVista === "Buscado" &&
          tabla === "Busqueda_controles"
        ) {
          controlesXmostrar.push(control);
        }
      });
      return controlesXmostrar;
    };

    let controles_ModalBuscar = muestraControlesXTabla(
      listaGeneralControles,
      "Busqueda_controles"
    );

    setModalBuscarC(controles_ModalBuscar);
  }, [listaGeneralControles]);

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

  const handleClick_BuscarControles = (event, id) => {
    const selectedIndex = controlSelected.indexOf(id);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat([], id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(controlSelected.slice(1));
    } else if (selectedIndex === controlSelected.length - 1) {
      newSelected = newSelected.concat(controlSelected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        controlSelected.slice(0, selectedIndex),
        controlSelected.slice(selectedIndex + 1)
      );
    }
    setControlSelected(newSelected);
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
  const isSelected = (id) => controlSelected.indexOf(id) !== -1;

  async function buscar(e) {
    e.persist();
    //await setBuscando(e.target.value);
    try {
      var search = muestraControlesXTabla(
        listaGeneralControles,
        "Busqueda_Controles"
      ).filter((item) => {
        if (
          String(item.idcontrol)
            .toLowerCase()
            .includes(e.target.value.toLowerCase()) ||
          item.nombre.toLowerCase().includes(e.target.value.toLowerCase())
        ) {
          return item;
        }
      });
      await setBuscando(e.target.value);
      await setModalBuscarC(search);
    } catch (error) {
      console.error("No se encuentra el control");
    }
  }

  //** muestra controles segun su propiedad estado_enVista */

  const muestraControlesXTabla = (consolidadoControles, tabla) => {
    let controlesXmostrar = [];
    consolidadoControles.map((control) => {
      if (
        (control.estado_enVista === "Activo" ||
          control.estado_enVista === "Agregado") &&
        tabla === "Tabla_Activos"
      ) {
        controlesXmostrar.push(control);
      } else if (
        control.estado_enVista === "Inactivos" &&
        tabla === "Inactivos"
      ) {
        controlesXmostrar.push(control);
      } else if (
        control.estado_enVista === "Buscado" &&
        tabla === "Busqueda_controles"
      ) {
        controlesXmostrar.push(control);
      }
    });
    return controlesXmostrar;
  };

  //** filtra Controles para evitar registros repetidos */

  const filtraControles = (listaGeneral, nuevaLista, tipoNuevaLista) => {
    //** Toma como propiedades 1. la lista general o consolidada de todos los controles: Activos + Inactivos + Sugeridos + Buscados 2.La nueva lista de controles que se agregará: controles Activos,  controles Buscados

    //* Devuelve el control de mayor prelación Activo||Inactivo > Sugerido > Buscado --- Es invocado mas adelante
    const comparaControles = (controlAntiguo, controlNuevo) => {
      if (
        controlAntiguo.estado_enVista === "Activo" ||
        controlAntiguo.estado_enVista === "Inactivo"
      ) {
        return controlAntiguo;
      } else if (
        controlNuevo.estado_enVista === "Activo" ||
        controlNuevo.estado_enVista === "Inactivo"
      ) {
        return controlNuevo;
      } else if (controlAntiguo.estado_enVista === "Agregado") {
        return controlAntiguo;
      } else if (controlNuevo.estado_enVista === "Agregado") {
        return controlNuevo;
      } else if (controlAntiguo.estado_enVista === "Buscado") {
        return controlAntiguo;
      } else if (controlNuevo.estado_enVista === "Buscado") {
        return controlNuevo;
      }
    };

    let consolidadoControles;
    if (nuevaLista.length !== 0) {
      if (listaGeneral.length !== 0) {
        //* funcion principal: Compara la listaGeneral de Controles y la NuevaLista de Controles, obtiene los repetidos y prevalece el mas importante (ver función comparaControles)...
        //* ... Luego obtiene los Controles que no se repiten de cada lista, y une todos los Controles en Consolidado control
        //* ... consolidado Controles se mostrará en cada tabla respectivamente según su propiedad "estado_enVista"
        let arr = [];
        let res;
        nuevaLista.map((controlNuevo) => {
          //* devuelve el indice del control repetido, de lo contrario devuelve -1
          res = _.findIndex(
            listaGeneral,
            (e) => {
              return e.idcontrol === controlNuevo.idcontrol;
            },
            0
          );

          //*
          if (res !== -1) {
            var controlAntiguo = listaGeneral.filter(
              (e) => e.idcontrol === controlNuevo.idcontrol
            )[0];

            let aux = comparaControles(controlAntiguo, controlNuevo);
            arr.push(aux);
          }
        });

        //* Obtienen los Controles únicos de cada array de Controles
        let dif1 = _.differenceBy(nuevaLista, listaGeneral, "idcontrol");
        let dif2 = _.differenceBy(listaGeneral, nuevaLista, "idcontrol");

        let controlesUnicos = _.concat(dif1, dif2);
        consolidadoControles = _.concat(controlesUnicos, arr);

        consolidadoControles.sort(function (a, b) {
          if (a.idcontrol > b.idcontrol) {
            return 1;
          }
          if (a.idcontrol < b.idcontrol) {
            return -1;
          }
          // a must be equal to b
          return 0;
        });
      } else if (listaGeneral.length === 0) {
        consolidadoControles = nuevaLista;
      }
    }
    return consolidadoControles;
  };
  //**Agrega los controles seleccionados al consolidado de controles */

  const completarTabla = (controles) => {
    const seleccionaControles = (controlesAgregados) => {
      let newSelected = selected.concat(controlesAgregados);
    };

    seleccionaControles(controles);

    //* Agrega las propiedades de los controles seleccionados y actualiza su estado en vista a "Agregado"

    let nuevaLista = [];
    controles.map((a) => {
      let controlCompleto = listaGeneralControles.filter(
        (e) => e.idcontrol === a
      )[0];
      controlCompleto.estado_enVista = "Agregado";
      nuevaLista.push(controlCompleto);
    });

    let controles_filtrados = filtraControles(
      listaGeneralControles,
      nuevaLista
    );

    setListaGeneralControles(controles_filtrados);

    setModalShow(false);
  };

  //**Los controles que agrega aparecen como seleccionados */

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
          Buscar controles
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
                  numSelected={controlSelected.length}
                  order={order}
                  orderBy={orderBy}
                  onRequestSort={handleRequestSort}
                  rowCount={modalBuscarC.length}
                />

                <TableBody>
                  {stableSortModal(modalBuscarC, getComparator(order, orderBy))
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row, index) => {
                      const isItemSelected = isSelected(row.idcontrol);
                      const labelId = `enhanced-table-checkbox-${index}`;
                      return (
                        <TableRow
                          onClick={(event) =>
                            handleClick_BuscarControles(event, row.idcontrol)
                          }
                          role="checkbox"
                          aria-checked={isItemSelected}
                          tabIndex={-1}
                          key={row.idcontrol}
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
                            {row.idcontrol}
                          </TableCell>

                          <TableCell align="left">
                            {row.nombre ? row.nombre : null}
                          </TableCell>
                          <TableCell align="left">
                            {row.descripcion ? row.descripcion : null}
                          </TableCell>
                          <TableCell align="left">
                            {row.automatizacion ? row.automatizacion : null}
                          </TableCell>
                          <TableCell align="left">
                            {row.naturaleza ? row.naturaleza : null}
                          </TableCell>
                          <TableCell align="left">
                            {row.cubrimiento ? row.cubrimiento : null}
                          </TableCell>
                          <TableCell align="left">
                            {row.prevaloracion ? row.prevaloracion : null}
                          </TableCell>
                          <TableCell align="left">{null}</TableCell>
                          <TableCell align="left">{null}</TableCell>
                          <TableCell align="left">{null}</TableCell>
                        </TableRow>
                      );
                    })}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[10, 20, 30]}
              component="div"
              count={modalBuscarC.length}
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
                  completarTabla(controlSelected);
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
