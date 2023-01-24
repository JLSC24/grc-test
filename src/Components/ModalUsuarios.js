////////// *** Modo de uso *** \\\\\\\\

/* 
  <ModalUsuarios
    showModUsuarios={showModUsuarios}
    setShowModUsuarios={setShowModUsuarios}
    data={data}
    setData={setData}
    rolUsr={"all"} //puede contener el id de rol (número), "null" o "all" si son todos los usuarios
    multi={false}
  /> 
*/

import React, { useState, useEffect } from "react";
import { Button, Form, Row, Col, Modal } from "react-bootstrap";
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

import Queries from "./QueriesAxios";

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

export default function ModalUsuarios({
  showModUsuarios,
  setShowModUsuarios,
  data,
  setData,
  rolUsr,
  multi,
}) {
  const [show, setShow] = useState(false);
  const classes = useStyles();

  const [dataMod, setDataMod] = React.useState([]);
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [dataBusqueda, setDataBusqueda] = React.useState([]);
  const [buscando, setBuscando] = React.useState("");
  const [tempRol, setTempRol] = React.useState(null);

  useEffect(() => {
    const fetchdata = async () => {
      setTempRol(rolUsr);
      let usrFunctRespQuerie = [];

      if (rolUsr !== "all") {
        if (rolUsr.length > 1) {
          let tempResultQuerie = [];
          usrFunctRespQuerie = await rolUsr.map(async (rol) => {
            let tempQuerie = await Queries(
              null,
              "/usuariosrol/0/" + rol + "/",
              "GET"
            );

            return await tempQuerie;
          });

          Promise.all(usrFunctRespQuerie).then(function (results) {
            results.map((dat) => {
              tempResultQuerie = tempResultQuerie.concat(dat);
              setDataMod(tempResultQuerie);
              setDataBusqueda(tempResultQuerie);
            });
            usrFunctRespQuerie = tempResultQuerie;
          });
        } else {
          usrFunctRespQuerie = await Queries(
            null,
            "/usuariosrol/0/" + rolUsr + "/",
            "GET"
          );
        }
      } else if (rolUsr === "all" || !rolUsr) {
        usrFunctRespQuerie = await Queries(
          null,
          "/usuario/",
          "GET"
        );
      }

      setDataMod(usrFunctRespQuerie);
      setDataBusqueda(usrFunctRespQuerie);
    };

    if (showModUsuarios === true) {
      setShow(true);
      if (rolUsr !== tempRol) {
        fetchdata();
      }
    }

    let tempSelected = [];
    if (data) {
      data.map((dat) => {
        tempSelected.push(dat.idposicion);
      });
    }
    setSelected(tempSelected);
  }, [showModUsuarios, setShow]);

  const handleClose = () => {
    setShow(false);
    setShowModUsuarios(false);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];
    if (selectedIndex === -1) {
      if (multi) {
        newSelected = newSelected.concat(selected, name);
      } else {
        newSelected = newSelected.concat([], name);
      }
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
      //lógica para quitar los elementos
      /* let quitarSelec = [];
      quitarSelec = quitarSelec.concat(dataQuitar, name);
      setDataQuitar(quitarSelec); */
    }
    setSelected(newSelected);
  };
  const isSelected = (name) => selected.indexOf(name) !== -1;

  const retornarSelected = (dataSelected) => {
    let tempUsrSelected = [];
    dataMod.map((usrMod) => {
      dataSelected.map((usrSelected) => {
        if (usrSelected === usrMod.idposicion) {
          tempUsrSelected.push(usrMod);
        }
      });
    });
    setData(tempUsrSelected);
  };

  async function buscar(e) {
    e.persist();
    //await setBuscando(e.target.value);
    var search = dataMod.filter((item) => {
      if (
        item.nombre.toLowerCase().includes(e.target.value.toLowerCase()) ||
        item.email.toLowerCase().includes(e.target.value.toLowerCase()) /* ||
        item.nombreposicion.toLowerCase().includes(e.target.value.toLowerCase()) */
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
            Seleccionar usuario
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
                    <StyledTableCell align="left">Posición</StyledTableCell>
                    <StyledTableCell align="left">Nombre</StyledTableCell>
                    <StyledTableCell align="left">Correo</StyledTableCell>
                  </TableRow>
                </TableHead>
                {/* Fin de encabezado */}
                {/* Inicio de cuerpo de la tabla */}
                <TableBody>
                  {dataBusqueda
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row, index) => {
                      const isItemSelected = isSelected(row.idposicion);

                      return (
                        <StyledTableRow
                          key={row.idposicion}
                          hover
                          onClick={(event) =>
                            handleClick(event, row.idposicion)
                          }
                          selected={isItemSelected}
                          role="checkbox"
                          tabIndex={-1}
                        >
                          <StyledTableCell component="th" scope="row">
                            <Checkbox checked={isItemSelected} />
                          </StyledTableCell>
                          <StyledTableCell component="th" scope="row">
                            {row.nombreposicion ? row.nombreposicion : null}
                          </StyledTableCell>
                          <StyledTableCell align="left">
                            {row.nombre ? row.nombre : null}
                          </StyledTableCell>
                          <StyledTableCell align="left">
                            {row.email ? row.email : null}
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
