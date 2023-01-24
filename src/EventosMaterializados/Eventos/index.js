import React, { useState, useEffect, useContext } from "react";
import AADService from "../../auth/authFunctions";
import axios from "axios";
import { Link } from "react-router-dom";

import { forwardRef } from "react";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import Check from "@material-ui/icons/Check";
import Clear from "@material-ui/icons/Clear";
import Edit from "@material-ui/icons/Edit";
import Loader from "react-loader-spinner";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";

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

export default function Eventos() {
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
        const isDuplicate = uniqueIds.has(evento.idevento_materializado);

        uniqueIds.add(evento.idevento_materializado);

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

      localStorage.setItem("listaEventosBuscados", JSON.stringify(data));
    }
  };

  const buscarEventoAPI = (dataEnviar) => {
    try {
      axios
        .post(process.env.REACT_APP_API_URL + "/buscar_evento/", dataEnviar, {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + serviceAAD.getToken(),
          },
        })
        .then((response) => {
          if (response.status >= 200 && response.status < 300) {
            alert("Busqueda exitosa");

            handleArrayBusquedas(response.data);

            localStorage.setItem(
              "idEventoMaterializado",
              response.data.idevento_materializado
            );
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
          }, 10000);
        });
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    let buscados = JSON.parse(localStorage.getItem("listaEventosBuscados"));

    console.log(buscados);

    if (typeof buscados != "undefined" && buscados != null) {
      if (buscados.length > 0 && buscados[0].idevento_materializado != null) {
        console.log("es un array de objetos", buscados);
        setDataBusqueda(buscados);
      } else {
        console.log("no es un array de objetos", buscados);
        setDataBusqueda([]);
      }
    } else {
      setDataBusqueda([]);
    }

    //setDataBusqueda(localStorage.getItem("listaEventosBuscados"));
    // buscarEventoAPI({
    //   idevento_materializado: localStorage.getItem("idEventoMaterializado"),
    // });
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

    console.log("id del evento seleccionado : ", name);

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
    console.log("Datos prepreocesados: ", data);

    let busquedaID = {
      idevento_materializado: data.idEvento,
    };
    console.log("busquedaID: ", busquedaID);

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

    console.log("busquedaAvanzada: ", busquedaAvanzada);

    if (!showBusquedaAvanzada) {
      buscarEventoAPI(busquedaID);
    } else {
      buscarEventoAPI(busquedaAvanzada);
    }
  };

  console.log(" dataBusqueda : ", dataBusqueda);

  const onError = (errors, e) => console.log(errors, e);

  return (
    <>
      <AlertDismissibleExample alerta={estadoPost} />
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit, onError)}>
          {/* <-------------------------------------Titulo-------------------------------------> */}

          <Row className="mb-3 mt-3">
            <Col sm={3} xs={12}>
              <h1 className="titulo">Eventos materializados</h1>
            </Col>

            {!showBusquedaAvanzada ? (
              <>
                <Col sm={3} xs={12}>
                  <input
                    {...register("idEvento")}
                    type="text"
                    className="form-control text-center texto"
                    placeholder="Porfavor introduzca el ID del evento"
                    required
                  ></input>
                </Col>

                <Col sm={1} xs={12}>
                  <button type="submit" class="btn btn-primary btn-md">
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
              </>
            ) : (
              <>
                <Col sm={4} xs={12}></Col>
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
              </>
            )}

            {!!showBotonEditar ? (
              <Col sm={1} xs={12}>
                <Link
                  to={{
                    pathname: "/EditarEvento",
                    state: { idEventoMaterializado: selected[0] },
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
              <Link to="NuevoEvento">
                <Button type="button" className="botonPositivo">
                  Crear evento
                </Button>
              </Link>
            </Col>
          </Row>
          <hr />

          {/* <-------------------------------------inicio: Busqueda-------------------------------------> */}

          {/* <----------------------------------------Busqueda avanzada----------------------------------------> */}

          {!!showBusquedaAvanzada ? (
            <>
              <Row className="mb-4">
                <Col sm={6} xs={12}>
                  <Row className="mb-4">
                    <Col sm={4} xs={12}>
                      <label className="forn-label label">
                        Compañia que reporta:
                      </label>
                    </Col>

                    <Col sm={8} xs={12}>
                      <FormSearchListCompania
                        control={control}
                        name="compania"
                        label="Compañia"
                      />
                      <p>{errors.compania?.message}</p>
                    </Col>
                  </Row>

                  <Row className="mb-4">
                    <Col sm={4} xs={12}>
                      <label className="forn-label label">
                        Área que reporta:
                      </label>
                    </Col>

                    <Col sm={8} xs={12}>
                      <FormSearchListArea
                        control={control}
                        name="areaReporta"
                        label="Área que reporta"
                      />
                      <p>{errors.areaReporta?.message}</p>
                    </Col>
                  </Row>

                  <Row className="mb-4">
                    <Col sm={4} xs={12}>
                      <label className="forn-label label">
                        Área de ocurrencia:
                      </label>
                    </Col>

                    <Col sm={8} xs={12}>
                      <FormSearchListArea
                        control={control}
                        name="areaOcurrencia"
                        label="Área de ocurrencia"
                      />
                      <p>{errors.areaOcurrencia?.message}</p>
                    </Col>
                  </Row>

                  <Row className="mb-4">
                    <Col sm={4} xs={12}>
                      <label className="forn-label label">Proceso:</label>
                    </Col>

                    <Col sm={8} xs={12}>
                      <FormSearchListProceso
                        control={control}
                        name="proceso"
                        label="Proceso"
                      />
                      <p>{errors.proceso?.message}</p>
                    </Col>
                  </Row>
                </Col>

                <Col sm={6} xs={12}>
                  <Row className="mb-4">
                    <Col sm={5} xs={12}>
                      <label className="forn-label label">
                        Rango fecha inicial:{" "}
                      </label>
                    </Col>

                    <Col sm={7} xs={12}>
                      <FormInputDateRange
                        control={control}
                        name="fechaInicial"
                        label="Rango fecha inicial"
                      />
                      <p>{errors.fechaInicial?.message}</p>
                    </Col>
                  </Row>

                  <Row className="mb-4">
                    <Col sm={5} xs={12}>
                      <label className="forn-label label">
                        Rango fecha final:{" "}
                      </label>
                    </Col>

                    <Col sm={7} xs={12}>
                      <FormInputDateRange
                        control={control}
                        name="fechaFinal"
                        label="Rango fecha final"
                      />
                      <p>{errors.fechaFinal?.message}</p>
                    </Col>
                  </Row>

                  <Row className="mb-4">
                    <Col sm={5} xs={12}>
                      <label className="forn-label label">
                        Rango fecha descubrimiento:
                      </label>
                    </Col>

                    <Col sm={7} xs={12}>
                      <FormInputDateRange
                        control={control}
                        name="fechaDescubrimiento"
                        label="Rango fecha descubrimiento"
                      />
                      <p>{errors.fechaDescubrimiento?.message}</p>
                    </Col>
                  </Row>

                  <Row className="mb-4">
                    <Col sm={4} xs={12}></Col>

                    <Col sm={6} xs={12}>
                      <button
                        type="submit"
                        class="btn btn-primary btn-lg btn-block"
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
                    <StyledTableCell>ID</StyledTableCell>
                    <StyledTableCell align="left">
                      Compañía que reporta
                    </StyledTableCell>
                    <StyledTableCell align="left">
                      Categoría corporativa N1
                    </StyledTableCell>
                    <StyledTableCell align="left">
                      Tipo de falla
                    </StyledTableCell>
                    {/* <StyledTableCell align="left">
                      Pérdida Neta COP
                    </StyledTableCell>
                    <StyledTableCell align="left">
                      Pérdida Neta USD
                    </StyledTableCell> */}
                    <StyledTableCell align="left">
                      Estado del evento
                    </StyledTableCell>
                  </TableRow>
                </TableHead>
                {/* Fin de encabezado */}
                {/* Inicio de cuerpo de la tabla */}
                <TableBody>
                  {console.log("dataBusqueda", dataBusqueda)}
                  {dataBusqueda

                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row, index) => {
                      const isItemSelected = isSelected(
                        row.idevento_materializado
                      );
                      return (
                        <StyledTableRow
                          key={row.idevento_materializado}
                          hover
                          onClick={(event) =>
                            handleClick(event, row.idevento_materializado)
                          }
                          selected={isItemSelected}
                          role="checkbox"
                          tabIndex={-1}
                        >
                          <StyledTableCell component="th" scope="row">
                            <Checkbox checked={isItemSelected} />
                          </StyledTableCell>
                          <StyledTableCell component="th" scope="row">
                            {row.idevento_materializado}
                          </StyledTableCell>
                          <StyledTableCell align="left">
                            {row.compania_que_reporta}
                          </StyledTableCell>
                          <StyledTableCell align="left">
                            {row.categoria_riesgos_corporativa_n1}
                          </StyledTableCell>
                          <StyledTableCell align="left">
                            {row.tipo_de_falla}
                          </StyledTableCell>
                          {/* <StyledTableCell align="left">
                            Pérdida Neta COP
                          </StyledTableCell>
                          <StyledTableCell align="left">
                            Pérdida Neta USD
                          </StyledTableCell> */}
                          <StyledTableCell align="left">
                            {row.evento_anulado == 1 ? "Anulado" : "Activo"}
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
