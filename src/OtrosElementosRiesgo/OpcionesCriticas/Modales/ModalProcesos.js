import React, { useState, useEffect } from "react";
import { Button, Form, Row, Col, Modal } from "react-bootstrap";
import AADService from "../../../auth/authFunctions";
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

import Queries from "../../../Components/QueriesAxios";

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

export default function ModalProcesos({
  showModProcesos,
  setShowModProcesos,
  proceso,
  setProceso,
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
    let compañias;
    const getCompanias = async () => {
      compañias = await Queries(
        null,
        "/maestros_ro/compania/",
        "GET"
      );
    };
    const fetchdata = async () => {
      await getCompanias();
      let data = await Queries(
        null,
        "/maestros_ro/proceso/",
        "GET"
      );

      if (data) {
        data.map((dat) => {
          compañias.map((comp) => {
            if (dat.idcompania == comp.idcompania) {
              dat.idcompania = {
                idcompania: comp.idcompania,
                compania: comp.compania,
              };
              dat["compania"] = comp.compania;
              return null;
            }
          });
        });
      }
      setData(data);
      setDataBusqueda(data);
    };

    if (showModProcesos === true) {
      setShow(true);
      if (data.length === 0) {
        fetchdata();
      }
    }

    let tempSelected = [];
    if (proceso) {
      proceso.map((dat) => {
        if (dat.idprco) {
          tempSelected.push(dat.idprco);
        } else if (dat.id) {
          tempSelected.push(dat.id);
        }
      });
    }
    setSelected(tempSelected);
  }, [showModProcesos, setShow]);

  const handleClose = () => {
    setShow(false);
    setShowModProcesos(false);
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
      /* let quitarSelec = [];
      quitarSelec = quitarSelec.concat(dataPAQuitar, name);
      setDataPAQuitar(quitarSelec); */
    }
    setSelected(newSelected);
  };
  const isSelected = (name) => selected.indexOf(name) !== -1;

  const retornarSelected = (dataSelected) => {
    let tempReturnProc = [];
    data.map((proc) => {
      dataSelected.map((dat) => {
        if (proc.id === dat) {
          tempReturnProc.push(proc);
        }
      });
    });
    setProceso(tempReturnProc);
  };

  async function buscar(e) {
    e.persist();
    //await setBuscando(e.target.value);
    var search = data.filter((item) => {
      if (
        item.nombre.toLowerCase().includes(e.target.value.toLowerCase()) ||
        item.idproceso.toLowerCase().includes(e.target.value.toLowerCase())
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
            Añadir procesos
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
                    <StyledTableCell align="left">ID Proceso</StyledTableCell>
                    <StyledTableCell align="left">Nombre</StyledTableCell>
                    <StyledTableCell align="left">Compañia</StyledTableCell>
                  </TableRow>
                </TableHead>
                {/* Fin de encabezado */}
                {/* Inicio de cuerpo de la tabla */}
                <TableBody>
                  {dataBusqueda
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row, index) => {
                      const isItemSelected = isSelected(row.id);

                      return (
                        <StyledTableRow
                          key={row.id}
                          hover
                          onClick={(event) => handleClick(event, row.id)}
                          selected={isItemSelected}
                          role="checkbox"
                          tabIndex={-1}
                        >
                          <StyledTableCell component="th" scope="row">
                            <Checkbox checked={isItemSelected} />
                          </StyledTableCell>
                          <StyledTableCell component="th" scope="row">
                            {row.idproceso ? row.idproceso : null}
                          </StyledTableCell>
                          <StyledTableCell align="left">
                            {row.nombre ? row.nombre : null}
                          </StyledTableCell>
                          <StyledTableCell align="left">
                            {row.idcompania.compania
                              ? row.idcompania.compania
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
