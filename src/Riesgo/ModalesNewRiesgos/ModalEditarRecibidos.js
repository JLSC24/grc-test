import React, { useEffect } from "react";
import { Row, Col, Form, Button, Modal } from "react-bootstrap";
import Table from "@material-ui/core/Table";
import Paper from "@material-ui/core/Paper";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableBody from "@material-ui/core/TableBody";
import TablePagination from "@material-ui/core/TablePagination";
import TableCell from "@material-ui/core/TableCell";
import Checkbox from "@material-ui/core/Checkbox";
import TableRow from "@material-ui/core/TableRow";

import { withStyles, makeStyles } from "@material-ui/core/styles";

const useStylesModal = makeStyles({
  root: {
    width: "100%",
  },
  container: {
    maxHeight: "30vh",
    //minHeight: "57vh",
  },
  containerModal: {
    maxHeight: "30vh",
    //minHeight: "50vh",
  },
});

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

function ModalEditarEfectosRecibidos(props) {
  /* Variables para riesgos */
  const [selectedRiesgos, setSelectedRiesgos] = React.useState(
    selectedRiesgosEfecto_desencadenados
  );
  const [pageRiesgos, setPageRiesgos] = React.useState(0);
  const [rowsPerPageRiesgos, setRowsPerPageRiesgos] = React.useState(10);
  const [dataBusquedaRiesgos, setDataBusquedaRiesgos] =
    React.useState(dataRiesgos);
  const [buscandoRiesgos, setBuscandoRiesgos] = React.useState(null);

  /* ///////////////////////////////// Funciones para riesgos ////////////////////////////////////////// */
  /* Funciones para paginación */
  const handleChangePageRiesgos = (event, newPage) => {
    setPageRiesgos(newPage);
  };

  const handleChangeRowsPerPageRiesgos = (event) => {
    setRowsPerPageRiesgos(+event.target.value);
    setPageRiesgos(0);
  };
  /* Fin de funciones para paginación */
  /* Función para seleccionar un Área para Editar */
  const handleClickRiesgos = (event, name) => {
    const selectedIndex = selectedRiesgos.indexOf(name);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selectedRiesgos, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selectedRiesgos.slice(1));
    } else if (selectedIndex === selectedRiesgos.length - 1) {
      newSelected = newSelected.concat(selectedRiesgos.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selectedRiesgos.slice(0, selectedIndex),
        selectedRiesgos.slice(selectedIndex + 1)
      );
    }
    setSelectedRiesgos(newSelected);
  };

  const isSelectedRiesgos = (name) => selectedRiesgos.indexOf(name) !== -1;

  async function buscarRiesgos(e) {
    e.persist();
    //await setBuscando(e.target.value);
    var search = dataRiesgos.filter((item) => {
      if (
        item.nombre_riesgo
          .toLowerCase()
          .includes(e.target.value.toLowerCase()) ||
        /* item.descripcion_general
            .toLowerCase()
            .includes(e.target.value.toLowerCase()) || */
        /* item.otroriesgo
            .toLowerCase()
            .includes(e.target.value.toLowerCase()) || */
        /* item.idubicacion
            .toLowerCase()
            .includes(e.target.value.toLowerCase()) || */
        //item.analista.toLowerCase().includes(e.target.value.toLowerCase()) ||
        //item.var.toLowerCase().includes(e.target.value.toLowerCase()) ||
        item.idriesgo.toString().includes(e.target.value)
      ) {
        return item;
      }
    });
    await setBuscandoRiesgos(e.target.value);
    await setDataBusquedaRiesgos(search);
  }

  const retornarSelected = (riesgos) => {
    let tempRiesgos = [];
    let riesgosAsociados = "";

    if (dataRiesgos) {
      dataRiesgos.map((datRiesgos) => {
        riesgos.map((idRiesgo) => {
          if (datRiesgos.idriesgo == idRiesgo) {
            tempRiesgos.push(datRiesgos.idriesgo);
            riesgosAsociados +=
              datRiesgos.idriesgo + "-" + datRiesgos.nombre_riesgo + "; ";
          }
          return null;
        });
      });
    }

    if (efectosDesencadenados) {
      efectosDesencadenados.map((data) => {
        if (data.idefecto === selected_desencadenados[0]) {
          data.id_riesgos_asociados = tempRiesgos;
          data.riesgos_asociados = riesgosAsociados;
          return null;
        }
      });
    }

    //temp.riesgos_asociados = riesgosAsociados;
    //temp.id_riesgos_asociados = riesgos;
    //let newDataTable = [];
    //newDataTable = newDataTable.concat(efectosDesencadenados, temp);
    //setEfectosDesencadenados(newDataTable);
  };

  return (
    <Modal
      {...props}
      aria-labelledby="contained-modal-title-vcenter"
      centered
      className="modalCustom"
    >
      <Modal.Header closeButton>
        <Modal.Title className="subtitulo" id="contained-modal-title-vcenter">
          Editar Efecto propio
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Row className="mt-3">
          <Col>
            <h1 className="subtitulo">Elegir Riesgos</h1>
          </Col>
        </Row>
        <Row className="mb-3 mt-3">
          <Col>
            <Form>
              <Form.Control
                value={buscandoRiesgos}
                onChange={(e) => buscarRiesgos(e)}
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
                <Table
                  className={"text"}
                  stickyHeader
                  aria-label="sticky table"
                >
                  {/* Inicio de encabezado */}
                  <TableHead className="titulo">
                    <TableRow>
                      <StyledTableCell padding="checkbox"></StyledTableCell>
                      <StyledTableCell align="left">Id Riesgo</StyledTableCell>
                      <StyledTableCell align="left">
                        Nombre Riesgo
                      </StyledTableCell>
                      <StyledTableCell align="left">
                        Descripción Riesgo
                      </StyledTableCell>
                      {/* <StyledTableCell align="left">Ubicación</StyledTableCell> */}
                      <StyledTableCell align="left">
                        Analista dueño del riesgo
                      </StyledTableCell>
                    </TableRow>
                  </TableHead>
                  {/* Fin de encabezado */}
                  {/* Inicio de cuerpo de la tabla */}
                  <TableBody>
                    {dataBusquedaRiesgos
                      .slice(
                        pageRiesgos * rowsPerPageRiesgos,
                        pageRiesgos * rowsPerPageRiesgos + rowsPerPageRiesgos
                      )
                      .map((row) => {
                        const isItemSelected = isSelectedRiesgos(row.idriesgo);

                        return (
                          <StyledTableRow
                            key={row.idriesgo}
                            hover
                            onClick={(event) =>
                              handleClickRiesgos(event, row.idriesgo)
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
                            <StyledTableCell component="th" scope="row">
                              {row.nombre_riesgo !== null
                                ? row.nombre_riesgo
                                : null}
                            </StyledTableCell>
                            <StyledTableCell component="th" scope="row">
                              {row.descripcion_general !== null
                                ? row.descripcion_general
                                : null}
                            </StyledTableCell>
                            {/* <StyledTableCell component="th" scope="row">
                              {row.idubicacion !== null
                                ? row.idubicacion
                                : null}
                            </StyledTableCell> */}
                            <StyledTableCell component="th" scope="row">
                              {row.arista_del_riesgo !== null
                                ? row.arista_del_riesgo
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
                count={dataBusquedaRiesgos.length}
                rowsPerPage={rowsPerPageRiesgos}
                page={pageRiesgos}
                onPageChange={handleChangePageRiesgos}
                onRowsPerPageChange={handleChangeRowsPerPageRiesgos}
              />
              {/* Fin de paginación */}
            </Paper>
          </Col>
        </Row>
      </Modal.Body>
      <Modal.Footer>
        {selectedRiesgos.length > 0 ? (
          <Button
            className="botonPositivo"
            onClick={() => {
              retornarSelected(selectedRiesgos);
              setModalEditarEfectosPropiosShow(false);
            }}
          >
            Aceptar
          </Button>
        ) : null}
      </Modal.Footer>
    </Modal>
  );
}
