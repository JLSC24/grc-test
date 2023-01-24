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
    maxHeight: "60vh",
    //minHeight: "57vh",
  },
  containerModal: {
    maxHeight: "60vh",
    //minHeight: "50vh",
  },
});

export default function ModalEfectosValoracion({
  setValue,
  getValues,
  showEfectosValoracion,
  setShowEfectosValoracion,
}) {
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
    const fetchdata = async () => {
      const result = await fetch(process.env.REACT_APP_API_URL + "/efectos/", {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: "Bearer " + serviceAAD.getToken(),
        },
      });
      let data = await result.json();

      setDataBusqueda(data);
      setData(data);
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
  const handleClick = async (event, name, element) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat([], name);
    }

    setSelected(newSelected);
  };

  const isSelected = (name) => selected.indexOf(name) !== -1;

  const retornarSelected = () => {
    //let objSelected = data.filter((item) => item.idefecto == idCausaValoracion);
    //setDataEfectosValoracion(objSelected)
    if (selected.length > 0) {
      setValue("idEfectoValoracion", selected[0]);
      setShowEfectosValoracion(false);
    } else {
      alert("Seleccione un efecto");
    }
  };

  async function buscar(e) {
    e.persist();
    //await setBuscando(e.target.value);
    try {
      var search = dataBusqueda.filter((item) => {
        if (
          String(item.idefecto)
            .toLowerCase()
            .includes(e.target.value.toLowerCase()) ||
          item.tipoefecto
            .toLowerCase()
            .includes(e.target.value.toLowerCase()) ||
          item.nombreefecto
            .toLowerCase()
            .includes(e.target.value.toLowerCase()) ||
          item.tipo_moneda.toLowerCase().includes(e.target.value.toLowerCase())
        ) {
          return item;
        }
      });
      setBuscando(e.target.value);
      setData(search);
    } catch (error) {
      console.error("No se encuentra el riesgo");
    }
  }

  return (
    <>
      <Modal show={showEfectosValoracion} onHide={setShowEfectosValoracion}>
        <Modal.Body>
          <Row className="mb-4">
            <Col sm={8} xs={12}>
              <Form className="buscar">
                <Form.Control
                  value={buscando}
                  onChange={(e) => buscar(e)}
                  type="text"
                  placeholder="Buscar"
                />
              </Form>
            </Col>

            <Col sm={2} xs={12}>
              <Button className="botonPositivo2" onClick={retornarSelected}>
                Asociar
              </Button>
            </Col>
            <Col sm={2} xs={12}>
              <Button
                className="botonNegativo"
                onClick={() => setShowEfectosValoracion(false)}
              >
                Cancelar
              </Button>
            </Col>
          </Row>
          <br />
          <Paper className={classes.root}>
            <TableContainer component={Paper} className={classes.container}>
              <Table className={"text"} stickyHeader aria-label="sticky table">
                {/* Inicio de encabezado */}
                <TableHead className="titulo">
                  <TableRow>
                    <StyledTableCell padding="checkbox"></StyledTableCell>
                    <StyledTableCell align="left">Id efecto</StyledTableCell>
                    <StyledTableCell align="left">Nombre</StyledTableCell>
                    <StyledTableCell align="left">Tipo Impacto</StyledTableCell>
                    <StyledTableCell align="left">P50</StyledTableCell>
                    <StyledTableCell align="left">P95</StyledTableCell>
                    <StyledTableCell align="left">P99</StyledTableCell>
                    <StyledTableCell align="left">Método</StyledTableCell>
                    <StyledTableCell align="left">Analista</StyledTableCell>
                  </TableRow>
                </TableHead>
                {/* Fin de encabezado */}
                {/* Inicio de cuerpo de la tabla */}
                <TableBody>
                  {data
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row, index) => {
                      const isItemSelected = isSelected(row.idefecto);
                      return (
                        <StyledTableRow
                          key={row.idefecto}
                          hover
                          onClick={(event) =>
                            handleClick(event, row.idefecto, row)
                          }
                          selected={isItemSelected}
                          role="checkbox"
                          tabIndex={-1}
                        >
                          <StyledTableCell component="th" scope="row">
                            <Checkbox checked={isItemSelected} />
                          </StyledTableCell>
                          <StyledTableCell component="th" scope="row">
                            {row.idefecto !== null ? row.idefecto : null}
                          </StyledTableCell>
                          <StyledTableCell align="left">
                            {row.nombreefecto !== null
                              ? row.nombreefecto
                              : null}
                          </StyledTableCell>
                          <StyledTableCell align="left">
                            {row.tipoefecto !== null ? row.tipoefecto : null}
                          </StyledTableCell>
                          <StyledTableCell align="left">
                            {row.resultado_p50 !== null
                              ? parseFloat(row.resultado_p50).toLocaleString()
                              : null}
                          </StyledTableCell>
                          <StyledTableCell align="left">
                            {row.resultado_p95 !== null
                              ? parseFloat(row.resultado_p95).toLocaleString()
                              : null}
                          </StyledTableCell>
                          <StyledTableCell align="left">
                            {row.resultado_p99 !== null
                              ? parseFloat(row.resultado_p99).toLocaleString()
                              : null}
                          </StyledTableCell>
                          <StyledTableCell align="left">
                            {row.metodovaloracion !== null
                              ? row.metodovaloracion
                              : null}
                          </StyledTableCell>
                          <StyledTableCell align="left">
                            {row.analista !== null ? row.analista : null}
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
        </Modal.Body>
      </Modal>
      <span></span>
    </>
  );
}
