import React, { useState, useEffect, useContext } from "react";

import { Button, Row, Col, Form, Container, Modal } from "react-bootstrap";

import AADService from "../../auth/authFunctions";

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
import { useCallback } from "react";
import { DataObject } from "@mui/icons-material";
import { useMemo } from "react";

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

export default function ModalAsociarOrigen(props) {
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
        .get(process.env.REACT_APP_API_URL + "/plandeAccion/origen/", {
          headers: {
            Authorization: "Bearer " + serviceAAD.getToken(),
          },
        })
        .then((response) => {
          let data = response.data;

          let filteredlist = data.filter(
            (element) =>
              !props.dataOrigen.some(
                (item) => item.idorigen === element.idorigen
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
    setSelected(newSelected);
  };

  const isSelected = (name) => selected.indexOf(name) !== -1;

  const Asociar = () => {
    let origen = data.filter((item) => item.idorigen === selected[0]);
    let dataArray = props.dataOrigen;
    let newList = data.filter((item) => item.idorigen !== selected[0]);
    setData(newList);
    dataArray.push(origen[0]);
    props.setDataOrigen(dataArray);
    props.onHide();
    setSelected([]);
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
            Asociar Origen
          </Modal.Title>
        </Col>
        <Col sm={2} xs={12}>
          <button type="button" className="btn botonPositivo" onClick={Asociar}>
            Asociar origen
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
                    <StyledTableCell align="left">ID Origen</StyledTableCell>
                    <StyledTableCell align="left">Origen</StyledTableCell>
                    <StyledTableCell align="left">Descripcion</StyledTableCell>
                    <StyledTableCell align="left">ID Informe</StyledTableCell>
                    <StyledTableCell align="left">Fecha</StyledTableCell>
                    <StyledTableCell align="left">Creador</StyledTableCell>
                    <StyledTableCell align="left">Adjunto</StyledTableCell>
                    <StyledTableCell align="left">Estado</StyledTableCell>
                  </TableRow>
                </TableHead>
                {/* Fin de encabezado */}
                {/* Inicio de cuerpo de la tabla */}
                <TableBody>
                  {data
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row) => {
                      const isItemSelected = isSelected(row.idorigen);
                      return (
                        <StyledTableRow
                          key={row.idorigen}
                          hover
                          onClick={(event) => handleClick(event, row.idorigen)}
                          selected={isItemSelected}
                          role="checkbox"
                          tabIndex={-1}
                        >
                          <StyledTableCell component="th" scope="row">
                            <Checkbox checked={isItemSelected} />
                          </StyledTableCell>

                          <StyledTableCell component="th" scope="row">
                            {row.idorigen !== null ? row.idorigen : null}
                          </StyledTableCell>

                          <StyledTableCell align="left">
                            {row.origen !== null ? row.origen : null}
                          </StyledTableCell>

                          <StyledTableCell align="left">
                            {row.descripcion !== null ? row.descripcion : null}
                          </StyledTableCell>

                          <StyledTableCell component="th" scope="row">
                            {row.id_informe ? row.id_informe : null}
                          </StyledTableCell>

                          <StyledTableCell align="left">
                            {row.fecha !== null ? row.fecha : null}
                          </StyledTableCell>

                          <StyledTableCell align="left">
                            {row.creador !== null ? row.creador : null}
                          </StyledTableCell>

                          <StyledTableCell align="left">
                            {row.link ? (
                              <a href={row.link}>{row.adjunto}</a>
                            ) : null}
                          </StyledTableCell>

                          <StyledTableCell align="left">
                            {row.estado ? "Activo" : "Inactivo"}
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
