import React, { useState, useEffect, useContext } from "react";
import AADService from "../auth/authFunctions";
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

import { UsuarioContext } from "../Context/UsuarioContext";

import { FormInputTexto } from "../form-components/FormInputTexto";
import { FormSearchListRol } from "../form-components/FormSearchListRol";

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
      return <Alert variant="success">{alerta.data}</Alert>;

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

export default function OpcionRol() {
  const classes = useStyles();

  const serviceAAD = new AADService();

  const { dataUsuario } = useContext(UsuarioContext);

  const [idEfectoFinanciero, setIdEfectoFinanciero] = useState(null);

  const [estadoPost, setEstadoPost] = useState({
    alerta: { id: 0, data: null },
  });

  const [data, setData] = React.useState([]);
  const [rolSelected, SetRolSelected] = useState();
  const [placesOptions, setPlacesOptions] = useState([]);
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
        `http://127.0.0.1:8000/opcionrolpermisos/${rolSelected.value}`,

        {
          method: "GET",
          headers: {
            Accept: "application/json",
            Authorization: "Bearer " + serviceAAD.getToken(),
          },
        }
      );
      data = await response_eval.data;
      
      setPlacesOptions(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {

  }, [placesOptions,setPlacesOptions]);
  const validCheck = (id,index) => {
    let modifyPlaces = placesOptions[index].permisos.split(';');
    if(modifyPlaces.includes(id)){
      modifyPlaces = modifyPlaces.filter(obj=>obj!==id)
    }else{
      modifyPlaces.push(id)
    }
    let tempPlacesOptions = placesOptions;
    tempPlacesOptions[index].permisos = modifyPlaces.join(';');
    
    setPlacesOptions(tempPlacesOptions);
    };

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

  const onSubmit = () => {
    //guardar aqui
    const insertPermision = {
      placesOptions: placesOptions,
      idrol: rolSelected.value,
    }
    try{

      fetch(`http://127.0.0.1:8000/opcionrolpermisos/${rolSelected.value}`, {
            method: "PUT",
            headers: {
              Authorization: "Bearer " + serviceAAD.getToken(),
              Accept: "application/json",
              "Content-Type": "application/json; charset=UTF-8"
            },
            body: JSON.stringify(insertPermision),
          });

    }catch(error){
      console.error(error);
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
              <h1 className="titulo">Permisos por rol</h1>
            </Col>
          </Row>
          <hr />

          {/* <-------------------------------------inicio: Busqueda-------------------------------------> */}
          <Row className="mb-3 mt-3">
            <Col sm={2} xs={12}>
              <label>Rol</label>
            </Col>
            <Col sm={4} xs={12}>
              <FormSearchListRol
                control={control}
                name="roles"
                label="Roles"
                SetRolSelected={SetRolSelected}
              />
            </Col>
            <Col sm={2} xs={12}>
              <Button
                onClick={buscarEventoAPI}
                variant={"contained"}
                className="btn botonPositivo"
              >
                Buscar
              </Button>
            </Col>
            <Col sm={2} xs={12}>
              <Button
                type="submit"
                onClick={handleSubmit(onSubmit, onError)}
                variant={"contained"}
                className="btn botonPositivo"
              >
                Guardar
              </Button>
            </Col>
          </Row>
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
                    <StyledTableCell>ID opción Rol</StyledTableCell>
                    <StyledTableCell align="left">Opción</StyledTableCell>
                    <StyledTableCell align="left">Ver</StyledTableCell>
                    <StyledTableCell align="left">Crear</StyledTableCell>
                    <StyledTableCell align="left">Editar</StyledTableCell>
                    <StyledTableCell align="left">Inactivar</StyledTableCell>
                    <StyledTableCell align="left">Descargar</StyledTableCell>
                  </TableRow>
                </TableHead>
                {/* Fin de encabezado */}
                {/* Inicio de cuerpo de la tabla */}
                <TableBody>
                  {placesOptions
                    .slice(
                      page * rowsPerPage,
                      page * rowsPerPage + rowsPerPage
                    )
                    .map((row, index) => {
                      let permisosCampo = row.permisos.split(";");
                      
                      
                      return (
                        <StyledTableRow

                        >
                          <StyledTableCell align="left">
                            {row.idopcion}
                          </StyledTableCell>
                          <StyledTableCell align="left">
                            {row.opcion}
                          </StyledTableCell>
                          <StyledTableCell align="left">
                            <input
                              type="checkbox"
                              name="ver"
                              id="ver"
                              onChange={(e)=>{              
                                validCheck('V',index)}}
                              
                              defaultChecked={placesOptions[index].permisos.split(";").includes("V")}
                            />
                          </StyledTableCell>
                          <StyledTableCell align="left">
                            <input
                              type="checkbox"
                              name="crear"
                              id="crear"
                              onChange={(e)=>{              
                                validCheck('C',index)}}
                              
                              defaultChecked={placesOptions[index].permisos.split(";").includes("C")}
                            />
                          </StyledTableCell>
                          <StyledTableCell align="left">
                          {/* <Checkbox 
                          name="editar"
                          onChange={(e)=>{
                            console.log("placesOptions[index].permisos.split",placesOptions[index].permisos.split(";").includes("E"))
                            validCheck('E',index)}}
                            checked={permisosCampo.includes("E")}
                            /> */}

                            
                            <input
                              type="checkbox"
                              name="editar"
                              id="editar"
                              onChange={(e)=>{              
                                validCheck('E',index)}}
                              
                              defaultChecked={placesOptions[index].permisos.split(";").includes("E")}
                            />
                          </StyledTableCell>
                          <StyledTableCell align="left">
                            <input
                              type="checkbox"
                              name="inactivar"
                              id="inactivar"
                              onChange={(e)=>{              
                                validCheck('I',index)}}
                              defaultChecked={placesOptions[index].permisos.split(";").includes("I")}
                            />
                          </StyledTableCell>
                          <StyledTableCell align="left">
                            <input
                              type="checkbox"
                              name="descargar"
                              id="descargar"
                              onChange={(e)=>{              
                                validCheck('D',index)}}
                              
                              defaultChecked={placesOptions[index].permisos.split(";").includes("D")}
                            />
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
              rowsPerPageOptions={[10, 25, 1000]}
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
