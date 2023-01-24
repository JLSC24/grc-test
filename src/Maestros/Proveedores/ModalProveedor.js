import React, { useState, useEffect } from "react";
import { Button, Form, Row, Col, Modal } from "react-bootstrap";
import AADService from "../../auth/authFunctions";
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
import axios from "axios";

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

export default function ModalProveedor({
  showModalProveedor,
  setShowModalProveedor,
  contratosProv,
  setProveedor,
  setShowContratos,
  setShowProveedor,
  setListaContratos,
  setListaContratosPrin,
  ContratoProveedorPrin,
  setElementoEv,
  identificacionModal,
  tipoProveedor,
  setNombreElemento,
  setNombreElementoOtros,
}) {
  const [show, setShow] = useState(false);
  const classes = useStyles();

  const serviceAAD = new AADService();
  const [data, setData] = React.useState([]);
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [dataBusqueda, setDataBusqueda] = React.useState([]);
  const [buscando, setBuscando] = React.useState(null);

  async function ContratoProveedor(proveedor) {
    const response_proveedor = await axios.get(
      process.env.REACT_APP_API_URL + "/maestros_ro/proveedor/" + proveedor + "/",
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + serviceAAD.getToken(),
        },
      }
    );
    if (response_proveedor.data.Contratos) {
      let contratosP = [];

      response_proveedor.data.Contratos.map((contr) => {
        contratosP.push({
          value: contr.Id_contrato,
          label: contr.Nombre,
          principal: true,
        });
      });
      contratosP.map((o) => {
        o.principal = 0;
      });
      setListaContratos(contratosP);
    }
  }

  useEffect(() => {
    if (showModalProveedor === true) {
      setShow(true);
    }
    const fetchdata = async () => {
      const result = await fetch(
        process.env.REACT_APP_API_URL + "/maestros_ro/proveedor/",
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            Authorization: "Bearer " + serviceAAD.getToken(),
          },
        }
      );
      let data = await result.json();
      setData(data);
      setDataBusqueda(data);
    };
    fetchdata();
  }, [showModalProveedor, setShow]);

  const handleClose = () => {
    setShow(false);
    setShowModalProveedor(false);
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
          if (dat.ID_SAP == dataS) {
            dat["estado"] = 1;
            temp.push(dat);
          }
        });
      });
    }

    if (identificacionModal === "Evaluacion") {
      ContratoProveedorPrin(dataSelected[0], tipoProveedor);
      if (tipoProveedor === "Principal") {
        setShowProveedor(true);
        setElementoEv(temp[0].ID_SAP);
        setNombreElemento(temp[0].Nombre_Proveedor);
      } else if (tipoProveedor === "Otros") {
        setProveedor(temp[0]);
        setShowContratos(true);
        setNombreElementoOtros(temp[0].Nombre_Proveedor);
      }
    } else if (identificacionModal === "Riesgos") {
      ContratoProveedorPrin(dataSelected[0], tipoProveedor);
      if (tipoProveedor === "Principal") {
        setShowProveedor(true);
        setElementoEv(temp[0].ID_SAP);
        setNombreElemento(temp[0].Nombre_Proveedor);
      } else if (tipoProveedor === "Otros") {
        setProveedor(temp[0]);
        setShowContratos(true);
        setNombreElementoOtros(temp[0].Nombre_Proveedor);
      }
    } else {
      setProveedor(temp[0]);
      ContratoProveedor(dataSelected[0]);
      setShowContratos(true);
      setNombreElementoOtros(temp[0].Nombre_Proveedor);
    }
  };

  async function buscar(e) {
    e.persist();
    //await setBuscando(e.target.value);
    var search = data.filter((item) => {
      if (
        item.Nombre_Proveedor.toLowerCase().includes(
          e.target.value.toLowerCase()
        ) ||
        item.NIT.toLowerCase().includes(e.target.value.toLowerCase())
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
            Añadir Proveedor
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
                    <StyledTableCell align="left">ID SAP</StyledTableCell>
                    <StyledTableCell align="left">NIT</StyledTableCell>
                    <StyledTableCell align="left">
                      Nombre Proveedor
                    </StyledTableCell>
                  </TableRow>
                </TableHead>
                {/* Fin de encabezado */}
                {/* Inicio de cuerpo de la tabla */}
                <TableBody>
                  {dataBusqueda
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row, index) => {
                      const isItemSelected = isSelected(row.ID_SAP);

                      return (
                        <StyledTableRow
                          key={row.ID_SAP}
                          hover
                          onClick={(event) => handleClick(event, row.ID_SAP)}
                          selected={isItemSelected}
                          role="checkbox"
                          tabIndex={-1}
                        >
                          <StyledTableCell component="th" scope="row">
                            <Checkbox checked={isItemSelected} />
                          </StyledTableCell>
                          <StyledTableCell component="th" scope="row">
                            {row.ID_SAP ? row.ID_SAP : null}
                          </StyledTableCell>
                          <StyledTableCell component="th" scope="row">
                            {row.NIT ? row.NIT : null}
                          </StyledTableCell>
                          <StyledTableCell align="left">
                            {row.Nombre_Proveedor ? row.Nombre_Proveedor : null}
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
            onClick={(e) => {
              e.preventDefault();
              handleClose();
              retornarSelected(selected);
              setListaContratosPrin([]);
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
