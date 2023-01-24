import React, { useEffect, useState, useContext, useCallback } from "react";
import { useForm, Controller, useWatch, FormProvider } from "react-hook-form";
import { Link, Routes, Route, useHistory, useLocation } from "react-router-dom";

import { withStyles, makeStyles } from "@material-ui/core/styles";
import {
  Row,
  Col,
  Form,
  Alert,
  Button,
  Container,
  Modal,
} from "react-bootstrap";

import axios from "axios";

import AADService from "../../auth/authFunctions";

import { forwardRef } from "react";
import Check from "@material-ui/icons/Check";
import Clear from "@material-ui/icons/Clear";
import Edit from "@material-ui/icons/Edit";
import Loader from "react-loader-spinner";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import Checkbox from "@material-ui/core/Checkbox";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableRow from "@material-ui/core/TableRow";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TextField from "@material-ui/core/TextField";
import TableContainer from "@material-ui/core/TableContainer";

import Select from "react-select";
import makeAnimated from "react-select/animated";

import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";

import { FormSearchListCompania } from "../../form-components/FormSearchListCompania";
import { FormInputFactor } from "../../form-components/FormInputFactor";
import ModalAsociarCausa from "./Modales/ModalAsociarCausa";

const animatedComponents = makeAnimated();

const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: "#2c2a29",
    color: theme.palette.common.white,
  },
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
  root: {
    backgroundColor: "#f4f4f4",
    heigth: "10px",
  },
}))(TableRow);

const useStyles = makeStyles({
  root: {
    width: "100%",
  },
  container: {
    /* maxHeight: "60vh", */
    minHeight: "20vh",
  },

  MuiTableRow: {
    root: {
      //This can be referred from Material UI API documentation.
      heigth: "10px",
    },
  },
});

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

export default function EditarSegmento() {
  const classes = useStyles();
  const serviceAAD = new AADService();
  const location = useLocation();
  const history = useHistory();

  const [estadoPost, setEstadoPost] = useState({
    alerta: { id: 0, data: null },
  });

  const [activo, setActivo] = useState(true);
  const [inactivar, setInactivar] = useState(false);

  const [ID, setID] = useState(null);
  const [loadingData, setLoadingData] = useState(null);

  const [listaSegmentos, setListaSegmentos] = useState(null);

  const [dataCausas, setDataCausas] = useState([]);
  const [selectedCausas, setSelectedCausas] = useState([]);
  const [showAsociarCausas, setShowAsociarCausas] = useState(false);

  const [flagNivel, setFlagNivel] = useState(false);

  const isSelectedCausas = (name) => selectedCausas.indexOf(name) !== -1;

  const handleClickCausas = (event, name) => {
    const selectedIndex = selectedCausas.indexOf(name);

    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat([], name);
      //SetButtonEdit(true);
    } else {
      //SetButtonEdit(false);
    }

    setSelectedCausas(newSelected);
  };

  const defaultValues = {
    id: null,
    estado: null,
    corte: null,
    compania: null,
    factor: null,
    nivel: null,
    segmento: null,
    cluster: null,
    silueta: null,
    concentracion: null,
    nombre: null,
    descripcion: null,
    causas: [],
  };

  const methods = useForm({
    defaultValues,
    mode: "onChange",
  });

  const {
    register,
    handleSubmit,
    control,
    setValue,
    reset,
    formState: { errors },
  } = methods;

  const llenarFormulario = async (id) => {
    try {
      const response = await axios.get(
        process.env.REACT_APP_API_URL + "/segmentos/" + id,
        {
          headers: {
            Authorization: "Bearer " + serviceAAD.getToken(),
          },
        }
      );

      let data = response.data[0];

      console.log(data);

      setValue("corte", data.corte_informacion);

      setValue("compania", { value: data.compania, label: data.compania });
      setValue("factor", { value: data.factor, label: data.factor });
      setValue("nivel", { value: data.nivel, label: data.nivel });

      if (data.nivel === "Segmento a priori") {
        setValue("segmento", data.segmento_a_priori);
      } else {
        setFlagNivel(true);
        setValue("segmentos", {
          value: data.segmento_a_priori,
          label: data.segmento_a_priori,
        });
      }

      setValue("silueta", data.silueta);
      setValue("cluster", data.cluster);
      setValue("concentracion", data.concentracion);
      setValue("nombre", data.nombre);
      setValue("descripcion", data.descripcion);

      setDataCausas(data.causas);
    } catch (error) {}
  };

  useEffect(() => {
    //---------------------------------------------------------Manejo de ids...
    console.log("Ubicación de donde provengo : ", location);

    if (typeof location.state != "undefined") {
      if (location.state.idSegmento) {
        let id = location.state.idSegmento;
        setValue("id", id);
        llenarFormulario(id);
      }
    } else {
      alert("Ups, ocurrió un error, trata de recargar la página");
    }

    let config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + serviceAAD.getToken(),
      },
    };

    let APIS = [fetch(process.env.REACT_APP_API_URL + "/segmentos", config)];

    Promise.all(APIS)
      .then(async ([segmentos]) => {
        const listSegmentos = await segmentos.json();

        let listaSegmentos = listSegmentos.map(
          ({
            idsegmentos: value,
            segmento_a_priori: label,
            nivel,
            silueta,
          }) => ({
            value,
            label,
            nivel,
          })
        );
        //Función para filtrar las aristas según el tipo de riesgo (erm,orm,it)
        let ListaSegmentosN1 = listaSegmentos.filter(
          (segmento) => segmento.nivel == "Segmento a priori"
        );
        let ListaSegmentosN2 = listaSegmentos.filter(
          (segmento) => segmento.nivel == "Cluster"
        );

        setListaSegmentos(ListaSegmentosN1);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const onSubmit = (data) => {
    console.log("Datos recopilados:", data);

    let config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + serviceAAD.getToken(),
      },
    };

    let causasArray = dataCausas.map(({ idcausa }) => idcausa);

    var dataEnviar = {
      idsegmentos: data.id,
      estado: data.estado,
      corte_informacion: data.corte,
      compania: data.compania.label,
      factor: data.factor.label,
      nivel: data.nivel.label,
      segmento_a_priori: flagNivel ? data.segmentos.label : data.segmento,
      silueta: data.silueta,
      cluster: data.cluster,
      concentracion: data.concentracion,
      nombre: data.nombre,
      descripcion: data.descripcion,
      causas: causasArray,
    };

    console.log("JSON a enviar:", dataEnviar);

    try {
      axios
        .put(process.env.REACT_APP_API_URL + "/segmentos/", dataEnviar, config)
        .then(function (response) {
          if (response.status >= 200 && response.status < 300) {
            //setEstadoPost(2);
            console.log(response);
            alert("Guardado con éxito");
            history.push({
              pathname: "/EditarSegmento",
              state: { idSegmento: response.data.idsegmentos },
            });
          } else if (response.status >= 300 && response.status < 400) {
            setEstadoPost(4);
            alert("Error en el servidor");
          } else if (response.status >= 400 && response.status < 512) {
            setEstadoPost(5);
            alert("Error en el servidor");
          }
        })
        .catch((errors) => {
          console.log("CATCH", errors.response.data);
        });
    } catch (error) {
      console.error(error);
    }
  };

  const onError = (errors) => console.log(errors);

  const Inactivar = () => {
    setInactivar((prev) => !prev);
  };

  const Activar = () => {
    setActivo((prev) => !prev);
  };

  const DesasociarCausa = () => {
    if (selectedCausas[0]) {
      const selectedData = dataCausas.filter(
        (causa) => causa.idcausa !== selectedCausas[0]
      );
      setDataCausas(selectedData);
      selectedCausas([]);
    } else {
    }
  };

  const FilterNivel = (e) => {
    if (e.label === "Segmento a priori") {
      setFlagNivel(false);
      setValue("Cluster", null);
      setDataCausas([]);
    } else {
      setFlagNivel(true);
    }
  };

  const EditarCausa = () => {
    history.push({
      pathname: "/EditarCausaCumplimiento",
      state: { idCausa: selectedCausas[0] },
    });
  };

  const col1 = 2;
  const col2 = 10;
  const col3 = 10;

  return (
    <>
      <AlertDismissibleExample alerta={estadoPost} />
      <Container fluid>
        <FormProvider {...methods}>
          {/* <----------------------------------------Modales----------------------------------------> */}
          <ModalAsociarCausa
            show={showAsociarCausas}
            onHide={() => setShowAsociarCausas(false)}
            dataCausas={dataCausas}
            setDataCategorias={setDataCausas}
          />
          {/* <----------------------------------------Titulo----------------------------------------> */}

          <Row className="mb-3 mt-3">
            <Col sm={4} xs={12}>
              <h1 className="titulo">Editar Segmento </h1>
            </Col>

            <Col sm={2} xs={12}>
              {/* <input
                type="text"
                className="form-control text-center texto"
                placeholder="Nuevo Estado del evento"
                value={!!activo ? "Activo" : "Inactivo"}
                disabled
              /> */}
            </Col>

            {!!activo == true ? (
              <Col sm={2} xs={12}>
                {/* <Button
                  type="button"
                  className="botonGeneral2"
                  onClick={Inactivar}
                >
                  Inactivar
                </Button> */}
              </Col>
            ) : (
              <Col sm={2} xs={12}>
                {/* <Button
                  type="button"
                  className="botonGeneral2"
                  onClick={Activar}
                >
                  Activar
                </Button> */}
              </Col>
            )}

            <Col sm={2} xs={12}>
              <Link to="Segmentos">
                <Button type="button" className="botonNegativo">
                  Cancelar
                </Button>
              </Link>
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
          <hr />
          {/* <----------------------------------------Formulario----------------------------------------> */}
          <Row className="mb-4">
            <Col sm={2} xs={12}>
              <label className="forn-label label">ID Segmento</label>
            </Col>
            <Col sm={4} xs={12}>
              <input
                disabled
                type="text"
                className="form-control text-center texto"
                placeholder="ID"
                {...register("id")}
              />
            </Col>

            <Col sm={2} xs={12}>
              <label className="forn-label label">Corte información</label>
            </Col>
            <Col sm={4} xs={12}>
              <input
                type="text"
                className="form-control text-center texto"
                placeholder="Corte información"
                {...register("corte")}
              />
              <p className="text-center">{errors.corte?.message}</p>
            </Col>
          </Row>

          <Row className="mb-4">
            <Col sm={2} xs={12}>
              <label className="forn-label label">Compañia</label>
            </Col>
            <Col sm={4} xs={12}>
              <FormSearchListCompania
                control={control}
                name="compania"
                label="Compañia"
              />
              <p className="text-center">{errors.compania?.message}</p>
            </Col>

            <Col sm={2} xs={12}>
              <label className="forn-label label">Factor</label>
            </Col>
            <Col sm={4} xs={12}>
              <FormInputFactor control={control} name="factor" label="Factor" />
              <p className="text-center">{errors.factor?.message}</p>
            </Col>
          </Row>

          <Row className="mb-4">
            <Col sm={2} xs={12}>
              <label className="forn-label label">Nivel</label>
            </Col>
            <Col sm={4} xs={12}>
              <Controller
                control={control}
                name="nivel"
                rules={{
                  required: `Te faltó completar este campo`,
                }}
                render={({ field }) => (
                  <Select
                    components={animatedComponents}
                    options={[
                      {
                        value: "Segmento a priori",
                        label: "Segmento a priori",
                      },
                      { value: "Clúster", label: "Clúster" },
                    ]}
                    onChange={(e) => {
                      FilterNivel(e);
                      field.onChange(e);
                    }}
                    value={field.value}
                    placeholder="Seleccione el Nivel"
                  />
                )}
              />
              <p className="text-center">{errors.nivel?.message}</p>
            </Col>
          </Row>

          <Row className="mb-4">
            <Col sm={2} xs={12}>
              <label className="forn-label label">Segmento a priori</label>
            </Col>
            <Col sm={6} xs={12}>
              {!!flagNivel ? (
                <Controller
                  control={control}
                  name="segmentos"
                  rules={{
                    required: `Te faltó completar este campo`,
                  }}
                  render={({ field }) => (
                    <Select
                      components={animatedComponents}
                      options={listaSegmentos}
                      onChange={(e) => {
                        field.onChange(e);
                        if (!!flagNivel) {
                          setValue("silueta", e.silueta);
                        }
                      }}
                      value={field.value}
                      placeholder="Seleccione el Segmento"
                    />
                  )}
                />
              ) : (
                <input
                  type="text"
                  className="form-control text-center texto"
                  {...register("segmento")}
                />
              )}
              <p className="text-center">{errors.segmento?.message}</p>
            </Col>

            <Col sm={2} xs={12}>
              <label className="forn-label label">Silueta</label>
            </Col>
            <Col sm={1} xs={12}>
              <input
                {...register("silueta")}
                type="text"
                className="form-control text-center texto"
                disabled={!!flagNivel}
              />
              <p className="text-center">{errors.silueta?.message}</p>
            </Col>
          </Row>

          {!!flagNivel ? (
            <>
              <Row className="mb-4">
                <Col sm={2} xs={12}>
                  <label className="forn-label label">Cluster</label>
                </Col>
                <Col sm={6} xs={12}>
                  <input
                    {...register("cluster")}
                    type="text"
                    className="form-control text-center texto"
                    placeholder="Cluster"
                  />
                  <p className="text-center">{errors.cluster?.message}</p>
                </Col>

                <Col sm={2} xs={12}>
                  <label className="forn-label label">Concentración</label>
                </Col>
                <Col sm={1} xs={12}>
                  <input
                    type="number"
                    className="form-control text-center texto"
                    {...register("concentracion")}
                  />
                  <p className="text-center">{errors.concentracion?.message}</p>
                </Col>
              </Row>

              <Row className="mb-4">
                <Col sm={2} xs={12}>
                  <label className="forn-label label">Nombre</label>
                </Col>
                <Col sm={10} xs={12}>
                  <input
                    type="text"
                    className="form-control text-center texto"
                    placeholder="Nombre"
                    {...register("nombre")}
                  />
                  <p className="text-center">{errors.nombre?.message}</p>
                </Col>
              </Row>

              <Row className="mb-4">
                <Col sm={2} xs={12}>
                  <label className="forn-label label">Descripción</label>
                </Col>
                <Col sm={10} xs={12}>
                  <textarea
                    className="form-control text-center"
                    placeholder="Descripción"
                    rows="4"
                    {...register("descripcion")}
                  />
                  <p className="text-center">{errors.descripcion?.message}</p>
                </Col>
              </Row>

              <Row className="mb-3">
                <Col sm={4} xs={12}>
                  <label className="form-label label">Causas asociadas</label>
                </Col>
                <Col sm={2} xs={12}>
                  <button
                    type="button"
                    className="btn botonNegativo"
                    onClick={EditarCausa}
                  >
                    Editar
                  </button>
                </Col>
                <Col sm={2} xs={12}>
                  <Link to={"/CrearCausaCumplimiento"}>
                    <button type="button" className="btn botonPositivo">
                      Crear
                    </button>
                  </Link>
                </Col>
                <Col sm={2} xs={12}>
                  <button
                    type="button"
                    className="btn botonPositivo"
                    onClick={() => setShowAsociarCausas(true)}
                  >
                    Asociar
                  </button>
                </Col>
                <Col sm={2} xs={12}>
                  <button
                    type="button"
                    className="btn botonNegativo"
                    onClick={DesasociarCausa}
                  >
                    Desasociar
                  </button>
                </Col>
              </Row>

              <Row className="mb-4">
                <Paper className={classes.root}>
                  <TableContainer
                    component={Paper}
                    className={classes.container}
                  >
                    <Table
                      className={"text"}
                      stickyHeader
                      aria-label="sticky table"
                    >
                      {/* Inicio de encabezado */}
                      <TableHead className="titulo">
                        <TableRow>
                          <StyledTableCell padding="checkbox"></StyledTableCell>
                          <StyledTableCell align="left">
                            ID Causa
                          </StyledTableCell>
                          <StyledTableCell align="left">Causa</StyledTableCell>
                          <StyledTableCell align="left">
                            Compañia
                          </StyledTableCell>
                          <StyledTableCell align="left">Estado</StyledTableCell>
                        </TableRow>
                      </TableHead>
                      {/* Fin de encabezado */}
                      {/* Inicio de cuerpo de la tabla */}
                      <TableBody>
                        {dataCausas.map((row, index) => {
                          const isItemSelected = isSelectedCausas(row.idcausa);
                          return (
                            <StyledTableRow
                              key={row.idcausa}
                              hover
                              onClick={(event) =>
                                handleClickCausas(event, row.idcausa)
                              }
                              selected={isItemSelected}
                              role="checkbox"
                              tabIndex={-1}
                            >
                              <StyledTableCell component="th" scope="row">
                                <Checkbox checked={isItemSelected} />
                              </StyledTableCell>

                              <StyledTableCell component="th" scope="row">
                                {row.idcausa ? row.idcausa : null}
                              </StyledTableCell>

                              <StyledTableCell align="left">
                                {row.nombre ? row.nombre : null}
                              </StyledTableCell>

                              <StyledTableCell align="left">
                                {row.compania ? row.compania : null}
                              </StyledTableCell>

                              <StyledTableCell align="left">
                                {row.estado == 1 ? "Activo" : "Inactivo"}
                              </StyledTableCell>
                            </StyledTableRow>
                          );
                        })}
                      </TableBody>
                      {/* Fin de cuerpo de la tabla */}
                    </Table>
                  </TableContainer>
                </Paper>
              </Row>
            </>
          ) : (
            <></>
          )}
        </FormProvider>
      </Container>
    </>
  );
}
