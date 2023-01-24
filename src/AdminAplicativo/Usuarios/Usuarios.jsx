import React, { useState, useEffect, useContext } from "react";
import AADService from "../../auth/authFunctions";
import axios from "axios";
import { Link } from "react-router-dom";

import { withStyles, makeStyles } from "@material-ui/core/styles";

import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import TablePagination from "@material-ui/core/TablePagination";

import { Row, Col, Form, Alert, Button, Container } from "react-bootstrap";

import { useForm, Controller, useWatch, FormProvider } from "react-hook-form";

import { UsuarioContext } from "../../Context/UsuarioContext";

import { FormInputTexto } from "../../form-components/FormInputTexto";

// import { ModalEfectosFinancieros } from "./ModalesEventos/ModalEfectosFinancieros";

import Select from "react-select";
import makeAnimated from "react-select/animated";

import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";

const animatedComponents = makeAnimated();

function AlertDismissibleExample({ alerta }) {
  switch (alerta.id) {
    case 1:
      return <Alert variant="warning">Alerta</Alert>;

    case 2:
      return <Alert variant="success">Busqueda Exitosa!</Alert>;

    case 3:
      return <Alert variant="danger">{alerta.data}</Alert>;

    case 4:
      return <Alert variant="warning">Error al enviar la información</Alert>;

    case 5:
      return <Alert variant="danger">Error en el servidor</Alert>;

    case 7:
      return (
        <Alert variant="warning">
          Corrige los siguientes errores:
          <br></br>• Debe completar los campos obligatorios
        </Alert>
      );
    default:
      return <p></p>;
  }
}

const defaultValues = {
  idEvento: null,
  compania: null,
  areaReporta: null,
  areaOcurrencia: null,
  proceso: null,
  fechaInicial: null,
  fechaFinal: null,
  fechaDescubrimiento: null,
};
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
    zIndex: 0,
    width: "100%",
  },
  container: {
    maxHeight: "60vh",
    minHeight: "60vh",
    zIndex: 0,
  },
  cabecera: {
    zIndex: -1,
  },
});

export default function Usuarios() {
  const classes = useStyles();

  const serviceAAD = new AADService();

  const { dataUsuario } = useContext(UsuarioContext);

  const [idEfectoFinanciero, setIdEfectoFinanciero] = useState(null);

  const [estadoPost, setEstadoPost] = useState({
    alerta: { id: 0, data: null },
  });

  const [data, setData] = React.useState([]);
  const [ButtonEdit, SetButtonEdit] = React.useState(false);
  const [loadingData, setLoadingData] = React.useState(false);

  const [buscando, setBuscando] = useState(null);
  const [dataBusqueda, setDataBusqueda] = React.useState([]);
  const [showBusquedaAvanzada, setShowBusquedaAvanzada] = useState(false);
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const [showBotonEditar, setShowBotonEditar] = useState(false);

  const [idSearch, setIDSearch] = useState(null);

  const buscarEventoAPI = async (dataEnviar) => {
    let data = null;
    let companyInfo = null;

    try {
        const response_eval = await axios.get(

            `http://127.0.0.1:8000/usuario/${dataEnviar.idevento_materializado}/`,
    
            {
                method: "GET",      
                headers: {      
                  Accept: "application/json",      
                  Authorization: "Bearer " + serviceAAD.getToken(),      
                },      
              }    
          )
          data = await response_eval.data;
          
        
    } catch (error) {
      console.error(error);
    }

    try {

       const responseCompany = await axios.get(`http://127.0.0.1:8000/maestros_ro/compania/`, {
          method: "GET",
          headers: {      
              Accept: "application/json",      
              Authorization: "Bearer " + serviceAAD.getToken(),      
            },
        })
        companyInfo = await responseCompany.data;
    } catch (error) {
        console.error(error)
    }
    
    if (companyInfo !== null && data !== null) {
        const companySelected = companyInfo.filter( company => company.idcompania === data.idcompania)
        
        const completeDataUser = {
            userInfo: data,
            companyInfo: companySelected
        }
        setDataBusqueda([completeDataUser])
    }

  };

  useEffect(() => {
  }, [dataBusqueda])

  /* Funciones para paginación */
  const handleChangePage = (newPage) => {
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
      setShowBotonEditar(true);
    } else {
      setShowBotonEditar(false);
    }
    setSelected(newSelected);


    setIDSearch(name);
  };

  const isSelected = (name) => selected.indexOf(name) !== -1;

  const methods = useForm({
    defaultValues,
    mode: "onChange",
  });

  const {
    register,
    handleSubmit,
    control,
    setValue,
    getValues,
    formState: { errors },
  } = methods;

  const onSubmit = (data) => {

    let busquedaID = {
      idevento_materializado: data.idEvento,
    };

    let busquedaAvanzada = {
      compania_que_reporta: data.compania ? data.compania.label : null,
      nombrearea_que_reporta: data.areaReporta ? data.areaReporta.label : null,
      nombrearea_de_ocurrecnia: data.areaOcurrencia
        ? data.areaOcurrencia.label
        : null,
      nombre_proceso: data.proceso ? data.proceso.label : null,
      ultima_fecha_evento: data.fechaFinal ? data.fechaFinal : null,
      primera_fecha_evento: data.fechaInicial ? data.fechaInicial : null,
      fecha_descubrimiento: data.fechaDescubrimiento
        ? data.fechaDescubrimiento
        : null,
    };


    if (!showBusquedaAvanzada) {
      buscarEventoAPI(busquedaID);
    } else {
      buscarEventoAPI(busquedaAvanzada);
    }
  };

  const onError = (errors, e) => console.log(errors, e);

  return (
    <>
      <AlertDismissibleExample alerta={estadoPost} />
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit, onError)}>

          {/* <-------------------------------------Titulo-------------------------------------> */}

          <Row className="mb-3 mt-3">
            <Col sm={3} xs={12}>
              <h1 className="titulo">Usuarios</h1>
            </Col>

            {!showBusquedaAvanzada ? (
              <>
                <Col sm={3} xs={12}>
                  <input
                    {...register("idEvento")}
                    type="text"
                    className="form-control text-center texto"
                    placeholder="Porfavor introduzca el email del usuario"
                    required
                  ></input>
                </Col>

                <Col sm={1} xs={12}>
                  <button type="submit" class="btn btn-primary btn-md">
                    Buscar
                  </button>
                </Col>
              </>
            ) : (
              <>
                
                
              </>
            )}

            {!!showBotonEditar ? (
              <Col sm={1} xs={12}>
                <Link
                  to={{
                    pathname: "EditarUsuario",
                    state: { email: selected[0] },
                  }}
                >
                  <Button type="button" className="botonNegativo">
                    Editar
                  </Button>
                </Link>
              </Col>
            ) : (
              <>
                <Col sm={1} xs={12}>
                  {" "}
                </Col>
              </>
            )}
            <Col sm={2} xs={12}>
              <Link to="NuevoUsuario">
                <Button type="button" className="botonPositivo">
                  Nuevo Usuario 
                </Button>
              </Link>
            </Col>
          </Row>
          <hr />

          {/* <-------------------------------------inicio: Busqueda-------------------------------------> */}

          {/* <----------------------------------------Busqueda avanzada----------------------------------------> */}

            <></>
          <hr />
          {/* <-------------Tabla de Usuarios-------------------> */}

          <Paper className={classes.root}>
            <TableContainer component={Paper} className={classes.container}>
              <Table className={classes.cabecera}>
                {/* Inicio de encabezado */}
                <TableHead>
                  <TableRow>
                    <StyledTableCell padding="checkbox"></StyledTableCell>
                    <StyledTableCell>Nombre</StyledTableCell>
                    <StyledTableCell align="left">
                      Email
                    </StyledTableCell>
                    <StyledTableCell align="left">
                      Rol
                    </StyledTableCell>
                    <StyledTableCell align="left">
                      Compañia
                    </StyledTableCell>
                    <StyledTableCell align="left">
                      Area organizacional
                    </StyledTableCell>
                    <StyledTableCell align="left">
                      Posición
                    </StyledTableCell>
                    <StyledTableCell align="left">
                      Id Posición
                    </StyledTableCell>
                    <StyledTableCell align="left">
                      Id Usuario
                    </StyledTableCell>
                  </TableRow>
                </TableHead>
                {/* Fin de encabezado */}
                {/* Inicio de cuerpo de la tabla */}
                <TableBody>
                  {dataBusqueda

                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row, index) => {
                      const isItemSelected = isSelected(
                        row.userInfo.email
                      );
                      return (
                        <StyledTableRow
                          key={row.email}
                          hover
                          onClick={(event) =>
                            handleClick(event, row.userInfo.email)
                          }
                          selected={isItemSelected}
                          role="checkbox"
                          tabIndex={-1}
                        >
                          <StyledTableCell component="th" scope="row">
                            <Checkbox checked={isItemSelected} />
                          </StyledTableCell>
                          <StyledTableCell component="th" scope="row">
                            {row.userInfo.nombre}
                          </StyledTableCell>
                          <StyledTableCell align="left">
                            {row.userInfo.email}
                          </StyledTableCell>
                          <StyledTableCell align="left">
                            {row.userInfo.perfil}
                          </StyledTableCell>
                          <StyledTableCell align="left">
                            {row.companyInfo[0].compania}
                          </StyledTableCell>
                          <StyledTableCell align="left">
                            {row.userInfo.area_organizacional}
                          </StyledTableCell>
                          <StyledTableCell align="left">
                            {row.userInfo.nombreposicion}
                          </StyledTableCell>
                          <StyledTableCell align="left">
                            {row.userInfo.idposicion}
                          </StyledTableCell>
                          <StyledTableCell align="left">
                            {row.userInfo.idusuario}
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

          <Row className="mb-4">
            <br />
          </Row>
          <Row className="mb-4">
            <br />
          </Row>
          <Row className="mb-4">
            <br />
          </Row>
          <Row className="mb-4">
            <br />
          </Row>
        </form>
      </FormProvider>
    </>
  );
}
