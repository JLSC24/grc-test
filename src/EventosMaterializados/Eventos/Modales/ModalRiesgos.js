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
import { withStyles, makeStyles } from "@material-ui/styles";
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
    maxHeight: "70vh",
    //minHeight: "57vh",
  },
  containerModal: {
    maxHeight: "70vh",
    //minHeight: "50vh",
  },
});

export default function ModalRiesgo({
  showModalR,
  setShowModalR,
  setDataR,
  setShowDisplayR,
  setValue,
}) {
  const [show, setShow] = useState(false);
  const classes = useStyles();

  const serviceAAD = new AADService();
  const [data, setData] = React.useState([]);
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [dataBusqueda, setDataBusqueda] = React.useState(data);
  const [buscando, setBuscando] = React.useState(null);
  const [loadingData, setLoadingData] = React.useState(true);

  useEffect(() => {
    if (showModalR === true) {
      setShow(true);
    }
    const fetchdata = async () => {
      setLoadingData(true);
      const result = await fetch(process.env.REACT_APP_API_URL + "/riesgos/", {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: "Bearer " + serviceAAD.getToken(),
        },
      });
      let data = await result.json();
      data = data.filter((o) => o.iddecision !== "");
      setData(data);
      setDataBusqueda(data);
      setLoadingData(false);
    };
    fetchdata();
  }, [showModalR, setShow]);

  const handleClose = () => {
    setShow(false);
    setShowModalR(false);
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
      newSelected = newSelected.concat([], name);
    }
    setSelected(newSelected);
  };

  const isSelected = (name) => selected.indexOf(name) !== -1;

  const retornarSelected = (dataSelected) => {
    let temp = [];
    if (data) {
      data.map((dat) => {
        dataSelected.map((dataS) => {
          if (dat.idriesgo == dataS) {
            temp.push(dat);
          }
        });
      });
    }
    setShowDisplayR(true);
    console.log(temp);
    setDataR(temp);
    setValue("idRiesgo", temp[0].idriesgo);
  };

  async function buscar(e) {
    e.persist();
    //await setBuscando(e.target.value);
    var search = data.filter((item) => {
      if (
        item.nombre_oc.toLowerCase().includes(e.target.value.toLowerCase()) ||
        item.compania.toLowerCase().includes(e.target.value.toLowerCase()) ||
        item.idoc.toString().includes(e.target.value)
      ) {
        return item;
      }
    });
    setBuscando(e.target.value);
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
            Añadir riesgos al evento
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
                <Table
                  className={"text"}
                  stickyHeader
                  aria-label="sticky table"
                >
                  {/* Inicio de encabezado */}
                  <TableHead className="titulo">
                    <TableRow>
                      <StyledTableCell padding="checkbox"></StyledTableCell>
                      <StyledTableCell>Id Riesgo</StyledTableCell>
                      <StyledTableCell align="left">
                        Tipo de Elemento
                      </StyledTableCell>
                      <StyledTableCell align="left">
                        Elemento Principal
                      </StyledTableCell>
                      <StyledTableCell align="left">Nombre</StyledTableCell>
                      <StyledTableCell align="left">
                        Descripción
                      </StyledTableCell>
                      <StyledTableCell align="left">
                        Arista del Riesgo
                      </StyledTableCell>
                      <StyledTableCell align="left">
                        Responsable
                      </StyledTableCell>
                      <StyledTableCell align="left">
                        Riesgo Residual
                      </StyledTableCell>
                    </TableRow>
                  </TableHead>
                  {/* Fin de encabezado */}
                  {/* Inicio de cuerpo de la tabla */}
                  <TableBody>
                    {dataBusqueda
                      .slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage
                      )
                      .map((row, index) => {
                        const isItemSelected = isSelected(row.idriesgo);
                        return (
                          <StyledTableRow
                            key={row.idriesgo}
                            hover
                            onClick={(event) =>
                              handleClick(event, row.idriesgo)
                            }
                            selected={isItemSelected}
                            role="checkbox"
                            tabIndex={-1}
                          >
                            <StyledTableCell component="th" scope="row">
                              <Checkbox checked={isItemSelected} />
                            </StyledTableCell>
                            <StyledTableCell component="th" scope="row">
                              {row.idriesgo !== null ? row.idriesgo : null}
                            </StyledTableCell>
                            <StyledTableCell align="left">
                              {row.tipo_elemento_evaluado !== null
                                ? row.tipo_elemento_evaluado
                                : null}
                            </StyledTableCell>

                            <StyledTableCell align="left">
                              {row.elemento_ppal_evaluado !== null
                                ? row.elemento_ppal_evaluado
                                : null}
                            </StyledTableCell>
                            <StyledTableCell align="left">
                              {row.nombre_riesgo !== null
                                ? row.nombre_riesgo
                                : null}
                            </StyledTableCell>
                            <StyledTableCell align="left">
                              {row.descripcion_general !== null
                                ? row.descripcion_general
                                : null}
                            </StyledTableCell>
                            <StyledTableCell align="left">
                              {row.arista_del_riesgo !== null
                                ? row.arista_del_riesgo
                                : null}
                            </StyledTableCell>
                            <StyledTableCell align="left">
                              {row.nombre !== null ? row.nombre : null}
                            </StyledTableCell>
                            <StyledTableCell align="left">
                              {row.nivel_riesgo_residual
                                ? row.nivel_riesgo_residual
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
                rowsPerPageOptions={[20, 30, 100]}
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
