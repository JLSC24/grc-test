import React, { useState, useEffect, useContext } from "react";
import AADService from "../../auth/authFunctions";
import axios from "axios";

import { forwardRef } from "react";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import Check from "@material-ui/icons/Check";
import Clear from "@material-ui/icons/Clear";
import Edit from "@material-ui/icons/Edit";
import Loader from "react-loader-spinner";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import { Link, useHistory, useLocation } from "react-router-dom";

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

import { FormSearchListArea } from "../../form-components/FormSearchListArea";
import { FormSearchListProceso } from "../../form-components/FormSearchListProceso";
import { FormInputDateRange } from "../../form-components/FormInputDateRange";
import { FormInputEfectoFinanciero } from "../../form-components/FormInputEfectoFinanciero";
import { FormInputTipoEfecto } from "../../form-components/FormInputTipoEfecto";
import { FormInputGeografia } from "../../form-components/FormInputGeografia";
import { FormInputLineasNegocio } from "../../form-components/FormInputLineasNegocio";
import { FormInputProducto } from "../../form-components/FormInputProducto";
import { FormInputCanal } from "../../form-components/FormInputCanal";
import { FormInputObjetoCosto } from "../../form-components/FormInputObjetoCosto";
import { FormInputCasosEspeciales } from "../../form-components/FomrInputCasosEspeciales";
import { FormInputOtrosEfectosRelacionados } from "../../form-components/FormInputOtrosEfectosRelacionados";
import { FormInputClasificacionDemanda } from "../../form-components/FormInputClasificacionDemanda";
import { FormInputMonedaOrigen } from "../../form-components/FormInputMonedaOrigen";
import { FormSearchListCuentasContables } from "../../form-components/FormSearchListCuentasContables";
import { FormSearchListCompania } from "../../form-components/FormSearchListCompania";
import { FormInputDate } from "../../form-components/FormInputDate";
import { NumericCellType } from "handsontable/cellTypes";
import { width } from "@mui/system";
import { FormSearchListTiposFalla } from "../../form-components/FormSearchListTiposFalla";
import { FormSearchListFuenteRecuperacion } from "../../form-components/FormSearchListFuenteRecuperacion";

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
  cabecera: {
    zIndex: -1,
  },
});

const defaultValues = {
  companiaContable: null,
  cuentaContable: null,
  fuenteRecuperacion: null,
  rangoFechaContable: null,
};

export default function Recuperaciones() {
  const classes = useStyles();

  const serviceAAD = new AADService();

  const history = useHistory();

  const location = useLocation();

  const { dataUsuario } = useContext(UsuarioContext);

  const [idEfectoFinanciero, setIdEfectoFinanciero] = useState(null);

  const [estadoPost, setEstadoPost] = useState({
    alerta: { id: 0, data: null },
  });

  const [dataGrid, setDataGrid] = useState([]);

  const [columns, setColumns] = useState([
    // {
    //   title: "Nombre de la causa de nivel 1",
    //   field: "CausaNivel1",
    //   lookup: ListaCausasN1,
    // },
    // {
    //   title: "Nombre de la causa de nivel 2",
    //   field: "CausaNivel2",
    //   lookup: ListaCausasN2,
    // },
    // {
    //   title: "Relevancia de la causa",
    //   field: "RelevanciaCausa",
    //   type: "textfield",
    // },
    // {
    //   title: "Peso de la causa",
    //   field: "PesoCausa",
    //   type: "numeric",
    // },
  ]);

  const [data, setData] = React.useState([]);

  const [buscandoEvento, setBuscandoEvento] = useState(null);
  const [buscandoEfecto, setBuscandoEfecto] = useState(null);
  const [dataBusqueda, setDataBusqueda] = React.useState([]);
  const [showBusquedaAvanzada, setShowBusquedaAvanzada] = useState(false);

  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const [idSearch, setIDSearch] = useState(null);
  const [showBotonEditar, setShowBotonEditar] = useState(0);

  const handleArrayBusquedas = (obj) => {
    // Funcion para determinar si el array dataBusquedas tiene un id igual
    if (typeof dataBusqueda != "undefined" && dataBusqueda != []) {
      // La funcion .unshift() toma el elemento ingresado y lo coloca en el inicio del array
      obj.map((item) => {
        dataBusqueda.unshift(item);
      });

      let data = dataBusqueda;

      //funcion para crear un array sin copias
      const uniqueIds = new Set();

      const newArraySinCopias = data.filter((evento) => {
        const isDuplicate = uniqueIds.has(evento.idrecuperacion);

        uniqueIds.add(evento.idrecuperacion);

        return !isDuplicate ? true : false;
      });

      if (newArraySinCopias.length > 500) {
        let newArrayRecortadoYsinCopias = newArraySinCopias.pop();
        data = newArrayRecortadoYsinCopias;
      } else {
        data = newArraySinCopias;
      }

      setDataBusqueda(data);

      console.log(data);

      localStorage.setItem("listaRecuperacionesBuscadas", JSON.stringify(data));
    }
  };

  const buscarEventoAPI = (dataEnviar) => {
    try {
      axios
        .post(process.env.REACT_APP_API_URL + "/buscar_recuperacion/", dataEnviar, {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + serviceAAD.getToken(),
          },
        })
        .then((response) => {
          if (response.status >= 200 && response.status < 300) {
            alert("Busqueda exitosa");
            handleArrayBusquedas(response.data);
            //setDataBusqueda([response.data]);
            //setEstadoPost(2);
          } else if (response.status >= 300 && response.status < 400) {
            setEstadoPost(4);
          } else if (response.status >= 400 && response.status < 512) {
            setEstadoPost(5);
          }
        })
        .catch((errors) => {
          console.log(errors.response);
          let msg_error = errors.response.data.message;
          console.log("MENSAJE DE ERROR", msg_error);
          setEstadoPost({
            id: 3,
            data: msg_error,
          });
          setTimeout(() => {
            // if (state === 2) {
            //   history.push("/EditarAreaOrganizacional");
            // }
            setEstadoPost({ id: 0, data: null });
          }, 3000);
        });
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    let buscados = JSON.parse(
      localStorage.getItem("listaRecuperacionesBuscadas")
    );

    console.log("Recuperaciones buscadas : ", buscados);

    if (typeof buscados != "undefined" && buscados != null) {
      if (buscados.length > 0 && buscados[0].idrecuperacion != null) {
        console.log("es un array de objetos", buscados);
        setDataBusqueda(buscados);
      } else {
        console.log("no es un array de objetos", buscados);
        setDataBusqueda([]);
      }
    } else {
      setDataBusqueda([]);
    }
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

    console.log("id del efecto seleccionado : ", name);

    console.log("Evento del efecto seleccionado : ", event);

    setIDSearch(name);
  };

  const isSelected = (name) => selected.indexOf(name) !== -1;
  {
    /* <-------------------------------------REACT-HOOK-FORM-------------------------------------> */
  }
  const methods = useForm({
    defaultValues,
  });

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = methods;

  const onSubmit = (data) => {
    console.log(data);
    let busquedaID = {
      idrecuperacion: data.idRecuperacion ? data.idRecuperacion : null,
      idefecto_financiero: data.idEfecto ? data.idEfecto : null,
    };

    let busquedaAvanzada = {
      compania_contable_recuperacion: data.companiaContable
        ? data.companiaContable.label
        : null,

      cuenta_contable: data.cuentaContable ? data.cuentaContable.label : null,

      fuente_recuperacion: data.fuenteRecuperacion
        ? data.fuenteRecuperacion.label
        : null,

      fecha_contable: data.rangoFechaContable ? data.rangoFechaContable : null,
    };

    if (!showBusquedaAvanzada) {
      buscarEventoAPI(busquedaID);
    } else {
      buscarEventoAPI(busquedaAvanzada);
    }
    console.log("Datos prepreocesados: ", data);
    console.log("busquedaID: ", busquedaID);
    // console.log("busquedaAvanzada: ", busquedaAvanzada);
  };

  const onError = (errors, e) => console.log(errors, e);

  {
    /* <-------------------------------------REACT-HOOK-FORM-------------------------------------> */
  }
  return (
    <>
      <AlertDismissibleExample alerta={estadoPost} />
      <FormProvider {...methods}>
        <Row className="mb-3 mt-3">
          <Col sm={2} xs={12}>
            <h1 className="titulo">Recuperaciones</h1>
          </Col>
          {!showBusquedaAvanzada ? (
            <>
              <Col sm={3} xs={12}>
                <input
                  {...register("idRecuperacion")}
                  type="text"
                  value={buscandoEfecto}
                  className="form-control text-center texto"
                  placeholder="ID de la Recuperación"
                  onChange={(e) => {
                    setBuscandoEfecto(e.target.value);
                  }}
                ></input>
              </Col>
              <Col sm={3} xs={12}>
                <input
                  {...register("idEfecto")}
                  type="text"
                  value={buscandoEvento}
                  className="form-control text-center texto"
                  placeholder=" ID del Efecto"
                  onChange={(e) => {
                    setBuscandoEvento(e.target.value);
                  }}
                ></input>
              </Col>
            </>
          ) : (
            <>
              <Col sm={6} xs={12}></Col>
            </>
          )}

          <Col sm={1} xs={12}>
            <button
              type="button"
              class="btn btn-primary btn-md"
              onClick={handleSubmit(onSubmit)}
            >
              Buscar
            </button>
          </Col>

          <Col sm={2} xs={12}>
            <Button
              variant="info"
              size="md"
              onClick={() => {
                setShowBusquedaAvanzada((estado) => !estado);
              }}
              name="busquedaAvanzada"
            >
              Busqueda Avanzada
            </Button>
          </Col>
          {!!showBotonEditar ? (
            <Col sm={1} xs={12}>
              <Link
                to={{
                  pathname: "/EditarRecuperacion",
                  state: { idRecuperacion: selected[0] },
                }}
              >
                <Button type="button" className="botonNegativo">
                  Editar
                </Button>
              </Link>
            </Col>
          ) : (
            <></>
          )}

          <hr />
        </Row>

        {/* <----------------------------------------Busqueda avanzada----------------------------------------> */}

        {!!showBusquedaAvanzada ? (
          <>
            {" "}
            <hr />
            <Row className="mb-4">
              <Col sm={6} xs={12}>
                <Row className="mb-4">
                  <Col sm={4} xs={12}>
                    <label className="forn-label label">
                      Compañia contable
                    </label>
                  </Col>

                  <Col sm={8} xs={12}>
                    <FormSearchListCompania
                      control={control}
                      name="companiaContable"
                      label="Compañia contable"
                    />
                    <p>{errors.companiaContable?.message}</p>
                  </Col>
                </Row>

                <Row className="mb-4">
                  <Col sm={4} xs={12}>
                    <label className="forn-label label">
                      Fuente de recuperación
                    </label>
                  </Col>

                  <Col sm={8} xs={12}>
                    <FormSearchListFuenteRecuperacion
                      control={control}
                      name="fuenteRecuperacion"
                      label="Fuente de recuperación"
                    />
                    <p>{errors.fuenteRecuperacion?.message}</p>
                  </Col>
                </Row>
              </Col>

              <Col sm={6} xs={12}>
                <Row className="mb-4">
                  <Col sm={4} xs={12}>
                    <label className="forn-label label">Cuenta contable</label>
                  </Col>

                  <Col sm={8} xs={12}>
                    <FormSearchListCuentasContables
                      control={control}
                      name="cuentaContable"
                      label="Cuentas contables"
                    />
                    <p>{errors.cuentaContable?.message}</p>
                  </Col>
                </Row>

                <Row className="mb-4">
                  <Col sm={5} xs={12}>
                    <label className="forn-label label">
                      Rango fecha contable:
                    </label>
                  </Col>

                  <Col sm={4} xs={12}>
                    <FormInputDateRange
                      control={control}
                      name="rangoFechaContable"
                      label="Rango fecha contable"
                    />
                    <p>{errors.rangoFechaContable?.message}</p>
                  </Col>

                  <Col sm={2} xs={12}>
                    <button
                      type="button"
                      class="btn btn-primary btn-md"
                      onClick={handleSubmit(onSubmit)}
                    >
                      Buscar
                    </button>
                  </Col>
                </Row>
              </Col>
            </Row>
          </>
        ) : (
          <></>
        )}
        <hr />
        {/* <-------------Tabla de eventos-------------------> */}

        <Paper className={classes.root}>
          <TableContainer component={Paper} className={classes.container}>
            <Table className={classes.cabecera}>
              {/* Inicio de encabezado */}
              <TableHead>
                <TableRow>
                  <StyledTableCell padding="checkbox"></StyledTableCell>
                  <StyledTableCell>ID Recuperación</StyledTableCell>
                  <StyledTableCell align="left">
                    Fuente recuoeración
                  </StyledTableCell>
                  <StyledTableCell align="left">Moneda origen</StyledTableCell>
                  <StyledTableCell align="left">
                    Recuperación en divisa origen
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    Compañia contable
                  </StyledTableCell>
                  <StyledTableCell align="left">Estado</StyledTableCell>
                </TableRow>
              </TableHead>
              {/* Fin de encabezado */}
              {/* Inicio de cuerpo de la tabla */}
              <TableBody>
                {dataBusqueda
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, index) => {
                    const isItemSelected = isSelected(row.idrecuperacion);
                    return (
                      <StyledTableRow
                        key={row.idrecuperacion}
                        hover
                        onClick={(event) =>
                          handleClick(event, row.idrecuperacion)
                        }
                        selected={isItemSelected}
                        role="checkbox"
                        tabIndex={-1}
                      >
                        <StyledTableCell component="th" scope="row">
                          <Checkbox checked={isItemSelected} />
                        </StyledTableCell>
                        <StyledTableCell component="th" scope="row">
                          {row.idrecuperacion}
                        </StyledTableCell>
                        <StyledTableCell align="left">
                          {row.fuente_recuperacion}
                        </StyledTableCell>
                        <StyledTableCell align="left">
                          {row.divisa_origen_recuperacion}
                        </StyledTableCell>
                        <StyledTableCell align="left">
                          {row.recuperacion_divisa_origen}
                        </StyledTableCell>

                        <StyledTableCell align="left">
                          {row.compania_contable_recuperacion}
                        </StyledTableCell>
                        <StyledTableCell align="left">
                          {row.recuperacion_anulada == 1
                            ? "Inactiva"
                            : "Activa"}
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
      </FormProvider>
    </>
  );
}
