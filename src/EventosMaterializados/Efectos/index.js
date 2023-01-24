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
import { Link } from "react-router-dom";

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

import Checkbox from "@mui/material/Checkbox";

import { FormInputDateRange } from "../../form-components/FormInputDateRange";
import { FormSearchListDivisaOrigen } from "../../form-components/FormSearchListDivisaOrigen";

import { FormInputProducto } from "../../form-components/FormInputProducto";

import { FormInputObjetoCosto } from "../../form-components/FormInputObjetoCosto";

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

export default function Efectos() {
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

  const [buscandoEvento, setBuscandoEvento] = useState(null);
  const [buscandoEfecto, setBuscandoEfecto] = useState(null);
  const [dataBusqueda, setDataBusqueda] = React.useState([]);
  const [showBusquedaAvanzada, setShowBusquedaAvanzada] = useState(false);

  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const [idSearch, setIDSearch] = useState(null);
  const [showBotonEditar, setShowBotonEditar] = useState(0);

  const [listaTipoEfecto, setListaTipoEfecto] = useState([]);
  const [listaTipoEfectoFiltrada, setListaTipoEfectoFiltrada] = useState([]);
  const [listaEfectosFinancieros, setListaEfectoFinancieros] = useState([]);

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
        const isDuplicate = uniqueIds.has(evento.idefecto_financiero);

        uniqueIds.add(evento.idefecto_financiero);

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

      localStorage.setItem("listaEfectosBuscados", JSON.stringify(data));
    }
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
          }, 10000);
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
      setShowBotonEditar(true);
    } else {
      setShowBotonEditar(false);
    }
    setSelected(newSelected);

    console.log("id del efecto seleccionado : ", name);

    setIDSearch(name);
  };

  const isSelected = (name) => selected.indexOf(name) !== -1;

  useEffect(() => {
    let buscados = JSON.parse(localStorage.getItem("listaEfectosBuscados"));

    console.log("Efectos bucados : ", buscados);

    if (typeof buscados != "undefined" && buscados != null) {
      if (buscados.length > 0 && buscados[0].idefecto_financiero != null) {
        console.log("es un array de objetos", buscados);
        setDataBusqueda(buscados);
      } else {
        console.log("no es un array de objetos", buscados);
        setDataBusqueda([]);
      }
    } else {
      setDataBusqueda([]);
    }

    const getEfectosFinancieros = async () => {
      try {
        const responseTipoEfecto = await axios.get(
          process.env.REACT_APP_API_URL + "/generales/tipo_de_efecto/",
          {
            headers: {
              Authorization: "Bearer " + serviceAAD.getToken(),
            },
          }
        );

        const responseEfectoFinanciero = await axios.get(
          process.env.REACT_APP_API_URL + "/generales/Efecto_financiero/efecto_financiero",
          {
            headers: {
              Authorization: "Bearer " + serviceAAD.getToken(),
            },
          }
        );

        let efectoFinanciero = responseEfectoFinanciero.data.map(
          ({ idm_parametrosgenerales: value, valor: label }) => ({
            value,
            label,
          })
        );
        let tipoEfecto = responseTipoEfecto.data.map(
          ({ idm_parametrosgenerales: value, valor: label, parametro }) => ({
            value,
            label,
            parametro,
          })
        );

        setListaEfectoFinancieros(efectoFinanciero);

        setListaTipoEfecto(tipoEfecto);
      } catch (error) {
        console.error(error);
      }
    };
    getEfectosFinancieros();
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
      efecto_financiero: data.efectoFinanciero
        ? data.efectoFinanciero.label
        : null,
      tipo_efecto: data.tipoEfecto ? data.tipoEfecto.label : null,
      nombre_oc: data.objetoCosto ? data.objetoCosto.label : null,
      nombre_prod: data.producto ? data.producto.label : null,
      divisa_origen: data.divisaOrigen ? data.divisaOrigen.label : null,
      fecha_contable: data.rangoFechaContable ? data.rangoFechaContable : null,
    };

    if (!showBusquedaAvanzada) {
      buscarEventoAPI(busquedaID);
    } else {
      buscarEventoAPI(busquedaAvanzada);
    }
    console.log("Datos prepreocesados: ", data);
    console.log("busquedaID: ", busquedaID);
    console.log("busquedaAvanzada: ", busquedaAvanzada);
  };

  const onError = (errors, e) => console.log(errors, e);

  const editar = (event) => {
    localStorage.setItem("idSelected", selected[0]);
  };

  const FiltrarTipoDeEfecto = (objTipoEfecto) => {
    setValue("tipoEfecto", null);

    let tempListaTipoEfecto = listaTipoEfecto.map((tipoEfecto) => {
      let newParametro = tipoEfecto.parametro.replace(/_/g, " ");

      return { ...tipoEfecto, parametro: newParametro };
    });

    let tempListaTipoEfectoFiltrado = [];

    switch (objTipoEfecto.label) {
      case "Contable en cuentas RO":
        tempListaTipoEfectoFiltrado = tempListaTipoEfecto.filter(
          (tipoEfecto) => {
            return tipoEfecto.parametro === "Contable en cuentas RO";
          }
        );

        break;

      case "Provisionado":
        tempListaTipoEfectoFiltrado = tempListaTipoEfecto.filter(
          (tipoEfecto) => {
            return tipoEfecto.parametro === "Provisionado";
          }
        );

        break;

      case "Sin asiento contable":
        tempListaTipoEfectoFiltrado = tempListaTipoEfecto.filter(
          (tipoEfecto) => {
            return tipoEfecto.parametro === "Sin asiento contable";
          }
        );

        setValue("companiaContable", null);
        setValue("cuentaContable", null);
        setValue("documentoContable", null);
        setValue("fechaContable", null);
        break;

      case "Contable en otras cuentas":
        tempListaTipoEfectoFiltrado = tempListaTipoEfecto.filter(
          (tipoEfecto) => {
            return tipoEfecto.parametro === "Contable en otras cuentas";
          }
        );

        break;

      case "Ingresos":
        tempListaTipoEfectoFiltrado = tempListaTipoEfecto.filter(
          (tipoEfecto) => {
            return tipoEfecto.parametro === "Ingresos";
          }
        );

        break;

      default:
        break;
    }

    setListaTipoEfectoFiltrada(tempListaTipoEfectoFiltrado);
  };

  {
    /* <-------------------------------------REACT-HOOK-FORM-------------------------------------> */
  }
  return (
    <>
      <AlertDismissibleExample alerta={estadoPost} />
      <FormProvider {...methods}>
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
                />
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
                />
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
              onClick={handleSubmit(onSubmit, onError)}
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
                  pathname: "/EditarEfecto",
                  state: {
                    idEfectoFinanciero: selected[0],
                  },
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
                      Efecto financiero
                    </label>
                  </Col>

                  <Col sm={8} xs={12}>
                    <Controller
                      control={control}
                      name="efectoFinanciero"
                      render={({ field }) => (
                        <Select
                          components={animatedComponents}
                          options={listaEfectosFinancieros}
                          onChange={(e) => {
                            FiltrarTipoDeEfecto(e);
                            field.onChange(e);
                          }}
                          value={field.value}
                          placeholder="Seleccione el efecto financiero"
                        />
                      )}
                      rules={{
                        required: "Te faltó completar este campo",
                      }}
                    />
                    <p>{errors.efectoFinanciero?.message}</p>
                  </Col>
                </Row>

                <Row className="mb-4">
                  <Col sm={4} xs={12}>
                    <label className="forn-label label">Tipo de efecto</label>
                  </Col>

                  <Col sm={8} xs={12}>
                    <Controller
                      control={control}
                      name="tipoEfecto"
                      render={({ field }) => (
                        <Select
                          components={animatedComponents}
                          options={listaTipoEfectoFiltrada}
                          onChange={(e) => {
                            field.onChange(e);
                          }}
                          value={field.value}
                          placeholder="Seleccione el tipo de efecto"
                        />
                      )}
                      rules={{
                        required: "Te faltó completar este campo",
                      }}
                    />
                    <p>{errors.tipoEfecto?.message}</p>
                  </Col>
                </Row>

                <Row className="mb-4">
                  <Col sm={4} xs={12}>
                    <label className="forn-label label">Objeto de costo</label>
                  </Col>

                  <Col sm={8} xs={12}>
                    <FormInputObjetoCosto
                      control={control}
                      name="objetoCosto"
                      label="Objeto de costo"
                    />
                    <p>{errors.objetoCosto?.message}</p>
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
                    <p>{errors.producto?.message}</p>
                  </Col>
                </Row>

                <Row className="mb-4">
                  <Col sm={5} xs={12}>
                    <label className="forn-label label">Moneda</label>
                  </Col>

                  <Col sm={7} xs={12}>
                    <FormSearchListDivisaOrigen
                      control={control}
                      name="divisaOrigen"
                      label="Moneda"
                    />
                    <p>{errors.divisaOrigen?.message}</p>
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
                  <StyledTableCell>ID Efecto</StyledTableCell>
                  <StyledTableCell align="left">
                    Efecto financiero
                  </StyledTableCell>
                  <StyledTableCell align="left">Tipo de efecto</StyledTableCell>
                  <StyledTableCell align="left">Moneda origen</StyledTableCell>
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
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, index) => {
                    const isItemSelected = isSelected(row.idefecto_financiero);
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
                          {row.efecto_anulado == 1 ? "Inactivo" : "Activo"}
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
