import React, { useState, useEffect, useContext } from "react";

import { Button, Row, Col, Form, Container, Modal } from "react-bootstrap";

import AADService from "../../../auth/authFunctions";

import axios from "axios";
import Loader from "react-loader-spinner";

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
import { elementType } from "prop-types";

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
    minHeight: "60vh",
  },
});

export default function ModalAsociarControl(props) {
  const serviceAAD = new AADService();
  const classes = useStyles();

  const [data, setData] = useState([]);
  const [loadingData, setLoadingData] = React.useState(false);

  const [page, setPage] = React.useState(0);
  const [selected, setSelected] = React.useState([]);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  useEffect(() => {
    try {
      axios
        .get(process.env.REACT_APP_API_URL + "/controles/", {
          headers: {
            Authorization: "Bearer " + serviceAAD.getToken(),
          },
        })
        .then((response) => {
          let data = response.data;

          let filteredlist = data.filter(
            (element) =>
              !props.dataControles.some(
                (item) => item.idcontrol === element.idcontrol
              )
          );

          setData(filteredlist);
        });
    } catch (error) {
      console.error(error);
    }
  }, [props.show]);

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
      newSelected = newSelected.concat([], name);
    } else {
    }
    console.log(newSelected);

    setSelected(newSelected);
  };

  const isSelected = (name) => selected.indexOf(name) !== -1;

  const Asociar = () => {
    if (selected[0]) {
      const selectedData = data.filter(
        (control) => control.idcontrol == selected[0]
      );

      console.log(selectedData);
      props.dataControles.push(selectedData[0]);
      setSelected([]);
      props.onHide();
    } else {
    }
  };

  return (
    <Modal
      {...props}
      aria-labelledby="contained-modal-title-vcenter"
      centered
      backdrop="static"
    >
      <Modal.Header closeButton>
        <Col sm={8} xs={12}>
          <Modal.Title id="contained-modal-title-vcenter">
            Asociar Control
          </Modal.Title>
        </Col>
        <Col sm={2} xs={12}>
          <button type="button" className="btn botonPositivo" onClick={Asociar}>
            Asociar
          </button>
        </Col>

        <Col sm={2} xs={12}>
          <button
            type="button"
            className="btn botonNegativo"
            onClick={props.onHide}
          >
            Cancelar
          </button>
        </Col>
      </Modal.Header>
      <Modal.Body className="show-grid">
        <Container fluid>
          <Row className="mb-3 mt-3"></Row>

          <Paper className={classes.root}>
            <TableContainer component={Paper} className={classes.container}>
              <Table className={"text"} stickyHeader aria-label="sticky table">
                {/* Inicio de encabezado */}
                <TableHead className="titulo">
                  <TableRow>
                    <StyledTableCell padding="checkbox"></StyledTableCell>
                    <StyledTableCell align="left">ID Control</StyledTableCell>
                    <StyledTableCell align="left">Compañía</StyledTableCell>
                    <StyledTableCell align="left">Proceso</StyledTableCell>
                    <StyledTableCell align="left">Nombre</StyledTableCell>
                    <StyledTableCell align="left">Descripción</StyledTableCell>
                    <StyledTableCell align="left">Estado</StyledTableCell>
                  </TableRow>
                </TableHead>
                {/* Fin de encabezado */}
                {/* Inicio de cuerpo de la tabla */}
                <TableBody>
                  {data.map((row) => {
                    const isItemSelected = isSelected(row.idcontrol);
                    return (
                      <StyledTableRow
                        key={row.idcontrol}
                        hover
                        onClick={(event) => handleClick(event, row.idcontrol)}
                        selected={isItemSelected}
                        role="checkbox"
                        tabIndex={-1}
                      >
                        <StyledTableCell component="th" scope="row">
                          <Checkbox checked={isItemSelected} />
                        </StyledTableCell>

                        <StyledTableCell component="th" scope="row">
                          {row.idcontrol ? row.idcontrol : null}
                        </StyledTableCell>

                        <StyledTableCell align="left">
                          {row.compania ? row.compania : null}
                        </StyledTableCell>

                        <StyledTableCell align="left">
                          {row.proceso ? row.proceso : null}
                        </StyledTableCell>
                        <StyledTableCell align="left">
                          {row.nombre ? row.nombre : null}
                        </StyledTableCell>

                        <StyledTableCell align="left">
                          {row.descripcion ? row.descripcion : null}
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
        </Container>
      </Modal.Body>
      <Modal.Footer></Modal.Footer>
    </Modal>
  );
}
