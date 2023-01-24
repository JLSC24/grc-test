import React, { useState, useEffect } from "react";
import { Button, Form, Row, Col, Modal } from "react-bootstrap";
import AADService from "../auth/authFunctions";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import TablePagination from "@material-ui/core/TablePagination";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import Checkbox from "@material-ui/core/Checkbox";

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
    //minHeight: "57vh",
  },
  containerModal: {
    maxHeight: "50vh",
    //minHeight: "50vh",
  },
});

export default function ModalPA({
  showPA,
  setShowPA,
  dataAllPA,
  dataPA,
  setDataPA,
  dataPAQuitar,
  setDataPAQuitar,
  setDataPAActualizar,
  setDataPANuevo,
  decision,
}) {
  const [show, setShow] = useState(false);
  const classes = useStyles();

  const serviceAAD = new AADService();
  const [data, setData] = React.useState([]);
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [dataBusqueda, setDataBusqueda] = React.useState([]);
  const [buscando, setBuscando] = React.useState("");

  useEffect(() => {
    if (showPA === true) {
      setShow(true);
    }
    const fetchdata = async () => {
      const result = await fetch(process.env.REACT_APP_API_URL + "/planesdeAccion/", {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: "Bearer " + serviceAAD.getToken(),
        },
      });
      let data = await result.json();

      /* const planesDeAccionDisponibles = data.filter(
        ({ idplanaccion: id1 }) =>
          !dataPA.some(({ idplanaccion: id2 }) => id2 === id1)
      );

      setData(planesDeAccionDisponibles);
      setDataBusqueda(planesDeAccionDisponibles); */

      setData(data);
      setDataBusqueda(data);
    };
    fetchdata();
    let tempSelected = [];
    if (dataPA) {
      dataPA.map((dat) => {
        tempSelected.push(dat.idplanaccion);
      });
    }
    setSelected(tempSelected);
  }, [showPA, setShow]);

  const handleClose = () => {
    setShow(false);
    setShowPA(false);
  };

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
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }
    if (selectedIndex !== -1) {
      let quitarSelec = [];
      quitarSelec = quitarSelec.concat(dataPAQuitar, name);
      setDataPAQuitar(quitarSelec);
    }
    setSelected(newSelected);
  };
  const isSelected = (name) => selected.indexOf(name) !== -1;

  const retornarSelected = (dataSelected) => {
    let temp = [];
    let tempNuevosPA = [];
    let tempActualizarPA = [];

    if (dataAllPA) {
      dataAllPA.map((pa) => {
        dataSelected.map((paS, index) => {
          if (pa.idplanaccion === paS) {
            pa["estadoasociacion"] = 1;
            temp.push(pa);
            tempActualizarPA.push({
              iddecision_planaccion: pa.iddecision_planaccion,
              iddecision: pa.iddecision_id,
              idplanaccion: pa.idplanaccion,
              estadoasociacion: 1,
            });
            dataSelected.splice(index, 1);
          }
        });
      });
    }

    if (data) {
      data.map((dat) => {
        dataSelected.map((dataS) => {
          if (dat.idplanaccion == dataS) {
            temp.push(dat);
            tempNuevosPA.push({
              iddecision_planaccion: 0,
              iddecision: decision,
              idplanaccion: dat.idplanaccion,
              estadoasociacion: 1,
            });
          }
        });
      });
    }

    let tempQuitar = [];
    if (dataPA && dataPAQuitar) {
      dataPA.map((pa) => {
        dataPAQuitar.map((idQuitar) => {
          if (pa.idplanaccion === idQuitar) {
            tempQuitar.push({
              iddecision_planaccion: pa.iddecision_planaccion,
              iddecision: pa.iddecision_id,
              idplanaccion: pa.idplanaccion,
              estadoasociacion: 0,
            });
          }
        });
      });
    }
    setDataPAQuitar(tempQuitar);
    setDataPA(temp);
    setDataPANuevo(tempNuevosPA);
    setDataPAActualizar(tempActualizarPA);
  };

  async function buscar(e) {
    e.persist();
    //await setBuscando(e.target.value);
    var search = data.filter((item) => {
      if (
        item.nombre.toLowerCase().includes(e.target.value.toLowerCase()) ||
        item.estadopa.toLowerCase().includes(e.target.value.toLowerCase())
      ) {
        return item;
      }
    });
    await setBuscando(e.target.value);
    await setDataBusqueda(search);
  }

  return (
    <>
      <Modal
        size="sm"
        show={show}
        onHide={handleClose}
        aria-labelledby="contained-modal-title-vcenter"
        centered
        dialogClassName="my-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title id="example-modal-sizes-title-sm">
            Añadir plan de acción
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Control
              value={buscando}
              onChange={(e) => buscar(e)}
              type="text"
              placeholder="Buscar"
            />
          </Form>
          <Row className="mb-2">
            <Col sm={4} xs={12}>
              {/* <Form>
                <Form.Control type="text" placeholder="Buscar" />
              </Form> */}
            </Col>
          </Row>
          <Paper className={classes.root}>
            <TableContainer
              component={Paper}
              className={classes.containerModal}
            >
              <Table className={"text"} stickyHeader aria-label="sticky table">
                {/* Inicio de encabezado */}
                <TableHead className="titulo">
                  <TableRow>
                    <StyledTableCell padding="checkbox"></StyledTableCell>
                    <StyledTableCell align="left">
                      ID Plan Acción
                    </StyledTableCell>
                    <StyledTableCell align="left">
                      Plan de Acción
                    </StyledTableCell>
                    <StyledTableCell align="left">
                      Estado plan de Acción
                    </StyledTableCell>
                    <StyledTableCell align="left">Responsable</StyledTableCell>
                    <StyledTableCell align="left">
                      Analista de Riesgo
                    </StyledTableCell>
                    <StyledTableCell align="left">
                      Fecha Compromiso
                    </StyledTableCell>
                    <StyledTableCell align="left">
                      Último Seguimiento
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
                            {row.analistariesgos ? row.analistariesgos : null}
                          </StyledTableCell>
                          <StyledTableCell align="left">
                            {row.fechacreacion ? row.fechacreacion : null}
                          </StyledTableCell>
                          <StyledTableCell align="left">
                            {row.fechamodificacion
                              ? row.fechamodificacion
                              : null}
                          </StyledTableCell>
                          <StyledTableCell align="left">
                            {row.porcentajeavance
                              ? parseFloat(row.porcentajeavance) * 100
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
        </Modal.Body>
        <Modal.Footer>
          <Button
            className="botonPositivo"
            onClick={() => {
              handleClose();
              retornarSelected(selected);
            }}
          >
            Aceptar
          </Button>
          <Button variant="secondary" onClick={handleClose}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
      <span></span>
    </>
  );
}
