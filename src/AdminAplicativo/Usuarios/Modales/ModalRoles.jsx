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

export default function ModalRoles({
  showModal,
  setShowModal,
  userRols,
  setUserRoles,
  dataAllPA,
  dataPA,
  setDataPA,
  dataPAQuitar,
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

  const tempArraySelectedData = userRols ? [...userRols] : []

  useEffect(() => {
    if (showModal === true) {
      setShow(true);
    }
    const fetchdata = async () => {
      const resultRol = await fetch(process.env.REACT_APP_API_URL + "/rol/", {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: "Bearer " + serviceAAD.getToken(),
        },
      });
      let data = await resultRol.json();

      /* const planesDeAccionDisponibles = data.filter(
        ({ idrol: id1 }) =>
          !dataPA.some(({ idrol: id2 }) => id2 === id1)
      );

      setData(planesDeAccionDisponibles);
      setDataBusqueda(planesDeAccionDisponibles); */

      setData(data);
      setDataBusqueda(data);
    };
    fetchdata();
    let tempSelected = [];
    if (userRols) {
      userRols.map((dat) => {
        tempSelected.push(dat.idrol);
      });
    }
    setSelected(tempSelected);
  }, [showModal, setShow]);

  const handleClose = () => {
    setShow(false);
    setShowModal(false);
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
    setSelected(newSelected);
  };

  const returnData = (dataRow, isItemSelected) => {
    if(!isItemSelected){
      tempArraySelectedData.push(dataRow)  
      
      //let arrayObj = userRols.concat(tempArraySelectedData)

      setUserRoles(tempArraySelectedData)

    } else {
      tempArraySelectedData.filter(e => {
        setUserRoles(e.idrol !== dataRow.idrol)
      })
    }

  };
  

  const isSelected = (name) => selected.indexOf(name) !== -1;

  const retornarSelected = (dataSelected) => {
    let temp = [];
    let tempNuevosPA = [];
    let tempActualizarPA = [];

    if (dataAllPA) {
      dataAllPA.map((pa) => {
        dataSelected.map((paS, index) => {
          if (pa.idrol === paS) {
            pa["estadoasociacion"] = 1;
            temp.push(pa);
            tempActualizarPA.push({
              iddecision_planaccion: pa.iddecision_planaccion,
              iddecision: pa.iddecision_id,
              idrol: pa.idrol,
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
          if (dat.idrol == dataS) {
            temp.push(dat);
            tempNuevosPA.push({
              iddecision_planaccion: 0,
              iddecision: decision,
              idrol: dat.idrol,
              estadoasociacion: 1,
            });
          }
        });
      });
    }

    let tempQuitar = [];
    if (userRols && dataPAQuitar) {
      userRols.map((pa) => {
        dataPAQuitar.map((idQuitar) => {
          if (pa.idrol === idQuitar) {
            tempQuitar.push({
              idrol: pa.idrol,
            });
          }
        });
      });
    }
    setDataPA(temp);
    setDataPANuevo(tempNuevosPA);
    setDataPAActualizar(tempActualizarPA);
  };

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
            Añadir roles del usuario
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
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
                    <StyledTableCell align="left">ID Rol</StyledTableCell>
                    <StyledTableCell align="left">
                      Nombre del rol
                    </StyledTableCell>
                    <StyledTableCell align="left">
                      Descripción del rol
                    </StyledTableCell>
                    <StyledTableCell align="left">
                      Población del rol
                    </StyledTableCell>
                  </TableRow>
                </TableHead>
                {/* Fin de encabezado */}
                {/* Inicio de cuerpo de la tabla */}
                <TableBody>
                  {dataBusqueda
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row, index) => {
                      const isItemSelected = isSelected(row.idrol);

                      return (
                        <StyledTableRow
                          key={row.idrol}
                          hover
                          onClick={(event) => {
                            handleClick(event, row.idrol);
                            returnData(row, isItemSelected);
                          }}
                          selected={isItemSelected}
                          role="checkbox"
                          tabIndex={-1}
                        >
                          <StyledTableCell component="th" scope="row">
                            <Checkbox checked={isItemSelected} />
                          </StyledTableCell>
                          <StyledTableCell component="th" scope="row">
                            {row.idrol ? row.idrol : null}
                          </StyledTableCell>
                          <StyledTableCell align="left">
                            {row.nombre_rol ? row.nombre_rol : null}
                          </StyledTableCell>
                          <StyledTableCell align="left">
                            {row.descripcion_rol ? row.descripcion_rol : null}
                          </StyledTableCell>

                          <StyledTableCell align="left">
                            {row.poblacion ? row.poblacion : null}
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
              rowsPerPageOptions={[6, 12]}
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
