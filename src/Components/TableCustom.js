//Espacio para realizar las importaciones
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
import { Row, Col, Form } from "react-bootstrap";

export default function TableCustom({
  data,
  nameCol,
  nameRow,
  nameId,
  style,
  busqueda,
  nameBusqueda,
  selectedData,
  setSelectedData,
  deletedData,
  setDeletedData,
  multi,
}) {
  //Variables para la tabla
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
      maxHeight: style && style.maxHeight ? style.maxHeight : "60vh",
      minHeight: style && style.minHeight ? style.minHeight : "0vh",
    },
  });

  const classes = useStyles();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [selected, setSelected] = React.useState([]);
  const [dataT, setDataT] = React.useState([]);
  const [dataBusqueda, setDataBusqueda] = React.useState([]);
  const [buscando, setBuscando] = React.useState(null);
  //Uso de funciones propias de react
  useEffect(() => {
    if (data) {
      if (dataT.length === 0) {
        setDataBusqueda(data);
        setDataT(data);
      } else {
        setDataBusqueda(data);
        setDataT(data);
      }
    } else {
      setDataBusqueda([]);
    }
    try {
      let tempSelected = [];
      selectedData.map((item) => {
        if (item[nameId]) {
          tempSelected.push(item[nameId]);
        } else if (item) {
          tempSelected.push(item);
        }
      });
      setSelected(tempSelected);
    } catch (error) {
      if (selectedData) {
        setSelected([selectedData[nameId]]);
      }
    }
  }, [data, setDataT, selectedData, setSelected]);

  //Funciones para la vista en específico
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
    setSelectedData(newSelected);
  };

  const isSelected = (name) => selected.indexOf(name) !== -1;

  function validarBusqueda(item, e) {
    let state = false;
    nameBusqueda.map((nameKey) => {
      try {
        if (
          item[nameKey].toLowerCase().includes(e.target.value.toLowerCase())
        ) {
          state = true;
        }
      } catch (error) {
        if (item[nameKey].toString().includes(e.target.value)) {
          state = true;
        }
      }
      return null;
    });
    return state;
  }

  async function buscar(e) {
    e.persist();
    //await setBuscando(e.target.value);
    setDataBusqueda([]);
    if (nameBusqueda) {
      let dataBuscada = dataT.filter((item) => {
        if (validarBusqueda(item, e)) {
          return item;
        }
      });

      await setBuscando(e.target.value);
      await setDataBusqueda(dataBuscada);
    }
  }

  return (
    <>
      {busqueda ? (
        <Row
          style={{ marginTop: "1%", marginBottom: "0.5%" }}
          className="mb-3 mt-3"
        >
          <Col sm={6} xs={12}>
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
        </Row>
      ) : (
        <p />
      )}

      <Paper className={classes.root}>
        <TableContainer component={Paper} className={classes.container}>
          <Table className={"text"} stickyHeader aria-label="sticky table">
            {/* Inicio de encabezado */}
            <TableHead className="titulo">
              <TableRow>
                <StyledTableCell padding="checkbox"></StyledTableCell>

                {nameCol.map((col) => (
                  <StyledTableCell align="left">{col}</StyledTableCell>
                ))}
              </TableRow>
            </TableHead>
            {/* Fin de encabezado */}
            {/* Inicio de cuerpo de la tabla */}
            <TableBody>
              {dataBusqueda
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  const isItemSelected = isSelected(row[nameId]);
                  if (row[nameId]) {
                    return (
                      <StyledTableRow
                        key={row[nameId]}
                        hover
                        onClick={(event) => handleClick(event, row[nameId])}
                        selected={isItemSelected}
                        role="checkbox"
                        tabIndex={-1}
                      >
                        <StyledTableCell component="th" scope="row">
                          <Checkbox checked={isItemSelected} />
                        </StyledTableCell>

                        {nameRow.map((name) => (
                          <StyledTableCell component="th" scope="row">
                            {row[name]}
                          </StyledTableCell>
                        ))}
                      </StyledTableRow>
                    );
                  } else {
                    return null;
                  }
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
    </>
  );
}
