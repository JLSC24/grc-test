import React, { useState, useEffect, useContext } from "react";
import AADService from "../../../auth/authFunctions";
import axios from "axios";

import { forwardRef } from "react";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import Check from "@material-ui/icons/Check";
import Clear from "@material-ui/icons/Clear";
import Edit from "@material-ui/icons/Edit";
import Loader from "react-loader-spinner";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import { Link } from "react-router-dom";

import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import TablePagination from "@material-ui/core/TablePagination";

import {
  Row,
  Col,
  Form,
  Alert,
  Button,
  Container,
  Modal,
} from "react-bootstrap";

import { useForm, Controller, useWatch, FormProvider } from "react-hook-form";

import { UsuarioContext } from "../../../Context/UsuarioContext";

import { FormInputTexto } from "../../../form-components/FormInputTexto";

// import { ModalEfectosFinancieros } from "./ModalesEventos/ModalEfectosFinancieros";

import Select from "react-select";
import makeAnimated from "react-select/animated";

import Checkbox from "@mui/material/Checkbox";

import { FormInputDateRange } from "../../../form-components/FormInputDateRange";
import { FormInputEfectoFinanciero } from "../../../form-components/FormInputEfectoFinanciero";
import { FormInputTipoEfecto } from "../../../form-components/FormInputTipoEfecto";

import { FormInputProducto } from "../../../form-components/FormInputProducto";

import { FormInputObjetoCosto } from "../../../form-components/FormInputObjetoCosto";
import { FormInputMonedaOrigen } from "../../../form-components/FormInputMonedaOrigen";

const animatedComponents = makeAnimated();

function AlertDismissibleExample({ alerta }) {
  switch (alerta) {
    case 1:
      return <Alert variant="warning">Alerta</Alert>;

    case 2:
      return <Alert variant="success">Guardó exitosamente</Alert>;

    case 3:
      return <Alert variant="danger"></Alert>;

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
});

const defaultValues = {
  idEfecto: null,
  idEvento: null,
  efectoFinanciero: null,
  tipoEfecto: null,
  tipoFalla: null,
  objetoCosto: null,
  producto: null,
  divisaOrigen: null,
  rangoFechaContable: null,
};

export default function ModalEfectos({
  showModalEfectos,
  setShowModalEfectos,
  dataEfectos,
  setDataEfectos,
  setShowDisplayEfectos,
}) {
  const classes = useStyles();

  const serviceAAD = new AADService();

  const { dataUsuario } = useContext(UsuarioContext);

  const [idEfectoFinanciero, setIdEfectoFinanciero] = useState(null);

  const [estadoPost, setEstadoPost] = useState([]);

  const [dataGrid, setDataGrid] = useState([]);

  const [data, setData] = React.useState([]);
  const [ButtonEdit, SetButtonEdit] = React.useState(false);
  const [loadingData, setLoadingData] = React.useState(false);
  const [unidadesXCompania, setUnidadesXCompania] = React.useState([]);

  const [buscandoEvento, setBuscandoEvento] = useState(null);
  const [buscandoEfecto, setBuscandoEfecto] = useState(null);
  const [dataBusqueda, setDataBusqueda] = React.useState([]);
  const [showBusquedaAvanzada, setShowBusquedaAvanzada] = useState(false);

  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [ListaCompaniasInicial, setListaCompaniasInicial] = useState([]);
  const [ListaAreasInicial, setListaAreasInicial] = useState([]);
  const [ListaProcesosInicial, setListaProcesosInicial] = useState([]);
  const [ListaCategoriasRiesgo, setListaCategoriasRiesgo] = useState([]);

  const [idSearch, setIDSearch] = useState(null);
  const [showBotonEditar, setShowBotonEditar] = useState(0);

  const [show, setShow] = useState(false);

  const [ListaAreas, setListaAreas] = useState([]);
  const [ListaProcesos, setListaProcesos] = useState([]);
  const [ListaCatCorp1, setListaCatCorp1] = useState([]);
  const [ListaCatCorp3, setListaCatCorp3] = useState([]);
  const [ListaCatLocal1, setListaCatLocal1] = useState([]);
  const [ListaCatLocal3, setListaCatLocal3] = useState([]);
  const [ListaCausasN1, setListaCausasN1] = useState([]);
  const [ListaCausasN2, setListaCausasN2] = useState([]);

  const tableIcons = {
    Add: forwardRef((props, ref) => (
      <button type="button" className="btn botonPositivo2">
        <AddCircleOutlineIcon {...props} ref={ref} />
      </button>
    )),
    Check: forwardRef((props, ref) => (
      <button type="button" className="btn botonPositivo2">
        <Check {...props} ref={ref} />
      </button>
    )),
    Clear: forwardRef((props, ref) => (
      <button type="button" className="btn botonNegativo2">
        <Clear {...props} ref={ref} />
      </button>
    )),
    Delete: forwardRef((props, ref) => (
      <button type="button" className="btn botonNegativo2">
        <DeleteForeverIcon {...props} ref={ref} />
      </button>
    )),
    Edit: forwardRef((props, ref) => (
      <button type="button" className="btn botonGeneral2">
        <Edit {...props} ref={ref} />
      </button>
    )),
  };

  const buscarEventoAPI = (dataEnviar) => {
    try {
      axios
        .post(process.env.REACT_APP_API_URL + "/buscar_efecto/", dataEnviar, {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + serviceAAD.getToken(),
          },
        })
        .then((response) => {
          if (response.status >= 200 && response.status < 300) {
            setDataBusqueda([response.data]);
            console.log("datos fresquitos uwu : ", [response.data]);
            //setEstadoPost(2);
          } else if (response.status >= 300 && response.status < 400) {
            setEstadoPost(4);
          } else if (response.status >= 400 && response.status < 512) {
            setEstadoPost(5);
          }
        });
    } catch (error) {
      console.error(error);
    }
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
      SetButtonEdit(true);
    } else {
      SetButtonEdit(false);
    }

    setSelected(newSelected);

    console.log("id del efecto seleccionado : ", name);

    setIDSearch(name);

    setShowBotonEditar((prevState) => !prevState);
  };
  const handleClose = () => {
    setShowModalEfectos(false);
  };
  const retornarSelected = (dataSelected) => {
    let temp = [];
    if (data) {
      data.map((dat) => {
        dataSelected.map((dataS) => {
          if (dat.idriesgo == dataS) {
            temp.push(dat);
          }
        });
      });
    }
    setShowDisplayEfectos(true);
    console.log(temp);
    setDataEfectos(dataBusqueda);
  };

  const isSelected = (name) => selected.indexOf(name) !== -1;

  useEffect(() => {
    buscarEventoAPI({
      idevento_materializado: null,
      idefecto_financiero: localStorage.getItem("idSelected")
        ? localStorage.getItem("idSelected")
        : null,
    });

    async function getCompanias() {
      try {
        const response = await axios.get(
          process.env.REACT_APP_API_URL + "/maestros_ro/compania/",
          {
            headers: {
              Authorization: "Bearer " + serviceAAD.getToken(),
            },
          }
        );
        let companias = response.data.map(
          ({ idcompania: value, compania: label, pais }) => ({
            value,
            label,
            pais,
          })
        );
        setListaCompaniasInicial(companias);
      } catch (error) {
        console.error(error);
      }
    }
    async function getAreas() {
      try {
        const response = await axios.get(
          process.env.REACT_APP_API_URL + "/maestros_ro/area_o/",
          {
            headers: {
              Authorization: "Bearer " + serviceAAD.getToken(),
            },
          }
        );
        let areas = response.data.map(
          ({
            idarea_oraganizacional: value,
            nombre: label,
            idcompania,
            nivel,
            area_n1,
            area_n2,
            area_n3,
            area_n4,
            area_n5,
          }) => ({
            value,
            label,
            idcompania,
            nivel,
            area_n1,
            area_n2,
            area_n3,
            area_n4,
            area_n5,
          })
        );
        setListaAreasInicial(areas);
      } catch (error) {
        console.error(error);
      }
    }
    async function getProcesos() {
      try {
        const response = await axios.get(
          process.env.REACT_APP_API_URL + "/ultimonivel/Proceso",
          {
            headers: {
              Authorization: "Bearer " + serviceAAD.getToken(),
            },
          }
        );
        let procesos = response.data.map(
          ({
            id: value,
            nombre: label,
            padre,
            idcompania,
            estado_proceso,
          }) => ({
            value,
            label,
            padre,
            idcompania,
            estado_proceso,
          })
        );
        setListaProcesosInicial(procesos);
      } catch (error) {
        console.error(error);
      }
    }
    async function getCategoriasRiesgo() {
      try {
        const response = await axios.get(
          process.env.REACT_APP_API_URL + "/maestros_ro/categoria_riesgo/",
          {
            headers: {
              Authorization: "Bearer " + serviceAAD.getToken(),
            },
          }
        );
        let categoriasRiesgo = response.data.map(
          ({
            idcategoria_riesgo: value,
            nombre: label,
            nivel,
            padre,
            categoria_riesgos_n1,
            categoria_riesgos_n2,
            categoria_riesgos_n3,
            estado,
            atributo,
          }) => ({
            value,
            label,
            nivel,
            padre,
            categoria_riesgos_n1,
            categoria_riesgos_n2,
            categoria_riesgos_n3,
            estado,
            atributo,
          })
        );
        setListaCategoriasRiesgo(categoriasRiesgo);
      } catch (error) {
        console.error(error);
      }
    }
    async function getCausas() {
      try {
        const response = await axios.get(
          process.env.REACT_APP_API_URL + "/maestros_ro/causa/",
          {
            headers: {
              Authorization: "Bearer " + serviceAAD.getToken(),
            },
          }
        );
        let causas = response.data.map(
          ({
            nombre: value,
            // nombre: label,
            // clasificacion,
            // nivel,
            // padre,
            // causa_n1,
            // causa_n2,
            // causa_n3,
            // estado,
          }) => ({
            value,
            // label,
            // clasificacion,
            // nivel,
            // padre,
            // causa_n1,
            // causa_n2,
            // causa_n3,
            // estado,
          })
        );

        let tempN1 = causas.filter(function (causa) {
          return causa.nivel == 1;
        });

        let tempN2 = causas.filter(function (causa) {
          return causa.nivel == 2;
        });

        let temp3 = Object.values(causas);

        let temp5 = [];

        let temp4 = temp3.map(function (causa) {
          temp5.push(Object.values(causa)[0]);
        });

        setListaCausasN1(temp5);
        setListaCausasN2(temp5);
      } catch (error) {
        console.error(error);
      }
    }

    getCausas();

    getCompanias();
    getAreas();
    getProcesos();
    getCategoriasRiesgo();

    setIdEfectoFinanciero(dataUsuario.email.split("@")[0] + Date.now());
  }, []);

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
    let busquedaID = {
      idevento_materializado: data.idEvento ? data.idEvento : null,
      idefecto_financiero: data.idEfecto ? data.idEfecto : null,
    };

    let busquedaAvanzada = {
      efecto_financiero: data.efectoFinanciero ? data.efectoFinanciero : null,
      tipo_efecto: data.tipoEfecto ? data.tipoEfecto : null,
      nombre_oc: data.objetoCosto ? data.objetoCosto : null,
      nombre_prod: data.producto ? data.producto : null,
      divisa_origen: data.divisaOrigen ? data.divisaOrigen : null,
      fecha_contable: data.rangoFechaContable ? data.rangoFechaContable : null,
    };

    if (!showBusquedaAvanzada) {
      buscarEventoAPI(busquedaID);
    } else {
      //buscarEventoAPI(busquedaAvanzada);
    }
    console.log("Datos prepreocesados: ", data);
    console.log("busquedaID: ", busquedaID);
    console.log("busquedaAvanzada: ", busquedaAvanzada);
  };

  const onError = (errors, e) => console.log(errors);

  const Asociar = (event) => {
    localStorage.setItem("idEfectoDeEvento", selected[0]);
    setShowModalEfectos(false);
  };

  {
    /* <-------------------------------------REACT-HOOK-FORM-------------------------------------> */
  }
  return (
    <>
      <Modal
        size="sm"
        show={showModalEfectos}
        onHide={handleClose}
        aria-labelledby="contained-modal-title-vcenter"
        centered
        dialogClassName="my-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title id="example-modal-sizes-title-sm">
            Añadir riesgos al evento
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <FormProvider {...methods}>
            <AlertDismissibleExample alerta={estadoPost} />

            {/* <-------------------------------------Menú-------------------------------------> */}

            <Row className="mb-3 mt-3">
              <Col sm={2} xs={12}>
                <h1 className="titulo">Efectos financieros</h1>
              </Col>
              {!showBusquedaAvanzada ? (
                <>
                  <Col sm={3} xs={12}>
                    <input
                      {...register("idEfecto")}
                      type="text"
                      value={buscandoEfecto}
                      className="form-control text-center texto"
                      placeholder="Porfavor introduzca el ID del efecto"
                      onChange={(e) => {
                        setBuscandoEfecto(e.target.value);
                      }}
                    ></input>
                  </Col>
                  <Col sm={3} xs={12}>
                    <input
                      {...register("idEvento")}
                      type="text"
                      value={buscandoEvento}
                      className="form-control text-center texto"
                      placeholder="Porfavor introduzca el ID del evento"
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
                  <Button
                    type="button"
                    className="botonNegativo"
                    onClick={(event) => Asociar(event)}
                  >
                    Asociar
                  </Button>
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
                          Efecto financiero
                        </label>
                      </Col>

                      <Col sm={8} xs={12}>
                        <FormInputEfectoFinanciero
                          control={control}
                          name="efectoFinanciero"
                          label="Efecto financiero"
                        />
                      </Col>
                    </Row>

                    <Row className="mb-4">
                      <Col sm={4} xs={12}>
                        <label className="forn-label label">
                          Tipo de efecto
                        </label>
                      </Col>

                      <Col sm={8} xs={12}>
                        <FormInputTipoEfecto
                          control={control}
                          name="tipoEfecto"
                          label="Tipo de Efecto"
                        />
                      </Col>
                    </Row>

                    <Row className="mb-4">
                      <Col sm={4} xs={12}>
                        <label className="forn-label label">
                          Objeto de costo
                        </label>
                      </Col>

                      <Col sm={8} xs={12}>
                        <FormInputObjetoCosto
                          control={control}
                          name="objetoCosto"
                          label="Objeto de costo"
                        />
                      </Col>
                    </Row>
                  </Col>

                  <Col sm={6} xs={12}>
                    <Row className="mb-4">
                      <Col sm={5} xs={12}>
                        <label className="forn-label label">Producto:</label>
                      </Col>

                      <Col sm={7} xs={12}>
                        <FormInputProducto
                          control={control}
                          name="producto"
                          label="Producto"
                        />
                      </Col>
                    </Row>

                    <Row className="mb-4">
                      <Col sm={5} xs={12}>
                        <label className="forn-label label">Moneda</label>
                      </Col>

                      <Col sm={7} xs={12}>
                        <FormInputMonedaOrigen
                          control={control}
                          name="divisaOrigen"
                          label="Moneda"
                        />
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
                <Table
                  className={"text"}
                  stickyHeader
                  aria-label="sticky table"
                >
                  {/* Inicio de encabezado */}
                  <TableHead className="titulo">
                    <TableRow>
                      <StyledTableCell padding="checkbox"></StyledTableCell>
                      <StyledTableCell>ID Efecto</StyledTableCell>
                      <StyledTableCell align="left">
                        Efecto financiero
                      </StyledTableCell>
                      <StyledTableCell align="left">
                        Tipo de efecto
                      </StyledTableCell>
                      <StyledTableCell align="left">
                        Moneda origen
                      </StyledTableCell>
                      <StyledTableCell align="left">
                        Valor moneda origen
                      </StyledTableCell>
                      <StyledTableCell align="left">Valor COP</StyledTableCell>
                      <StyledTableCell align="left">Estado</StyledTableCell>
                    </TableRow>
                  </TableHead>
                  {/* Fin de encabezado */}
                  {/* Inicio de cuerpo de la tabla */}
                  <TableBody>
                    {dataBusqueda
                      .slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage
                      )
                      .map((row, index) => {
                        const isItemSelected = isSelected(
                          row.idefecto_financiero
                        );
                        return (
                          <StyledTableRow
                            key={row.idefecto_financiero}
                            hover
                            onClick={(event) =>
                              handleClick(event, row.idefecto_financiero)
                            }
                            selected={isItemSelected}
                            role="checkbox"
                            tabIndex={-1}
                          >
                            <StyledTableCell component="th" scope="row">
                              <Checkbox checked={isItemSelected} />
                            </StyledTableCell>
                            <StyledTableCell component="th" scope="row">
                              {row.idefecto_financiero}
                            </StyledTableCell>
                            <StyledTableCell align="left">
                              {row.efecto_financiero}
                            </StyledTableCell>
                            <StyledTableCell align="left">
                              {row.tipo_efecto}
                            </StyledTableCell>
                            <StyledTableCell align="left">
                              {row.divisa_origen}
                            </StyledTableCell>
                            <StyledTableCell align="left">
                              {row.valor_divisa_origen}
                            </StyledTableCell>
                            <StyledTableCell align="left">
                              {row.valor_cop}
                            </StyledTableCell>
                            <StyledTableCell align="left">
                              {row.efecto_anulado ? "Activa" : "Inactiva"}
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
    </>
  );
}
