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

import ModalAsociarMacroriesgos from "./Modales/ModalAsociarMacroriesgos";
import { FormSearchListCompania } from "../../form-components/FormSearchListCompania";
import ModalAsociarCategoria from "./Modales/ModalAsociarCategoria";
import ModalAsociarTipologia from "./Modales/ModalAsociarTipologia";
import ModalVerMacroriesgos from "./Modales/ModalVerMacroriesgos";
import ModalCategoriasCausa from "./Modales/ModalCategoriasCausa";
import ModalTipologias from "./Modales/ModalTipologias";

import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import ModalAsociarControl from "./Modales/ModalAsociarControl";
import ModalVerControl from "./Modales/ModalVerControl";

function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box style={{ padding: "0.5%" }} p={3}>
          <Typography component="div" style={{ padding: "0.5%" }}>
            {children}
          </Typography>
        </Box>
      )}
    </div>
  );
}

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
    zIndex: 0,
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

export default function CrearCausaCumplimiento() {
  let history = useHistory();
  const classes = useStyles();
  const serviceAAD = new AADService();
  const location = useLocation();

  const [estadoPost, setEstadoPost] = useState({
    alerta: { id: 0, data: null },
  });

  const [valor, setValor] = React.useState(0);

  const [activo, setActivo] = useState(true);
  const [inactivar, setInactivar] = useState(false);

  const [idCausa, setIdCausa] = useState(null);
  const [loadingData, setLoadingData] = useState(null);
  const [aristas, setAristas] = useState(null);
  const [listaAristas, setListaAristas] = useState(null);

  const [isSelectedLAFT, setIsSelectedLAFT] = useState(null);

  const [listaFactor, setListaFactor] = useState(null);
  const [listaMarcaciones, setListaMarcaciones] = useState(null);
  const [listaDelitos, setListaDelitos] = useState(null);

  const [showAsociarMacroriesgo, setShowAsociarMacroriesgo] = useState(false);
  const [showAsociarCategoria, setShowAsociarCategoria] = useState(false);
  const [showAsociarTipologia, setShowAsociarTipologia] = useState(false);
  const [showVerMacroriesgo, setShowVerMacroriesgo] = useState(false);
  const [showCategorias, setShowCategorias] = useState(false);
  const [showTipologias, setShowTipologias] = useState(false);
  const [showVerControles, setShowVerControles] = useState(false);
  const [showAsociarControles, setShowAsociarControles] = useState(false);

  const [dataMacroriesgos, setDataMacroriesgos] = useState([]);
  const [dataCategorias, setDataCategorias] = useState([]);
  const [dataTipologias, setDataTipologias] = useState([]);
  const [dataControles, setDataControles] = useState([]);
  const [dataIndicadores, setDataIndicadores] = useState([]);
  const [dataConsecuencias, setDataConsecuencias] = useState([]);

  const [selectedMacroriesgos, setSelectedMacroriesgos] = useState([]);
  const [selectedCategorias, setSelectedCategorias] = useState([]);
  const [selectedTipologias, setSelectedTipologias] = useState([]);
  const [selectedControles, setSelectedControles] = useState([]);

  const isSelectedMacroriesgos = (name) =>
    selectedMacroriesgos.indexOf(name) !== -1;
  const isSelectedCategorias = (name) =>
    selectedCategorias.indexOf(name) !== -1;
  const isSelectedTipologias = (name) =>
    selectedTipologias.indexOf(name) !== -1;
  const isSelectedControles = (name) => selectedControles.indexOf(name) !== -1;

  const handleClickMacroriesgos = (event, name) => {
    const selectedIndex = selectedMacroriesgos.indexOf(name);

    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat([], name);
      //SetButtonEdit(true);
    } else {
      //SetButtonEdit(false);
    }
    console.log("Selected:", newSelected);
    setSelectedMacroriesgos(newSelected);
  };

  const handleClickCategorias = (event, name) => {
    const selectedIndex = selectedCategorias.indexOf(name);

    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat([], name);
      //SetButtonEdit(true);
    } else {
      //SetButtonEdit(false);
    }

    setSelectedCategorias(newSelected);
  };

  const handleClickTipologias = (event, name) => {
    const selectedIndex = selectedTipologias.indexOf(name);

    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat([], name);
      //SetButtonEdit(true);
    } else {
      //SetButtonEdit(false);
    }

    setSelectedTipologias(newSelected);
  };

  const handleClickControles = (event, name) => {
    const selectedIndex = selectedControles.indexOf(name);

    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat([], name);
      //SetButtonEdit(true);
    } else {
      //SetButtonEdit(false);
    }

    setSelectedControles(newSelected);
  };

  const defaultValues = {
    idcausa: null,
    compania: null,
    nombre: null,
    descripcion: null,
    aristas: null,

    factor: null,
    marcaciones: null,
    delitos: null,
    origen: null,

    macroriesgos: [],
    categoria: [],
    tipologias: [],
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

  useEffect(() => {
    let config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + serviceAAD.getToken(),
      },
    };

    let APIS = [
      fetch(process.env.REACT_APP_API_URL + "/maestros_ro/aristas/", config),

      fetch(process.env.REACT_APP_API_URL + "/generales/Causas/Factor", config),

      fetch(process.env.REACT_APP_API_URL + "/generales/Causas/Marcaciones", config),

      fetch(process.env.REACT_APP_API_URL + "/generales/Causas/Delitos_Fuentes", config),
    ];

    Promise.all(APIS)
      .then(async ([arista, factor, marcaciones, delitos]) => {
        const listaAristas = await arista.json();

        let Aristas = listaAristas.map(
          ({ idaristas: value, nombre: label, orm, erm, it }) => ({
            value,
            label,
            orm,
            erm,
            it,
          })
        );

        setListaAristas(Aristas);

        const listFactor = await factor.json();

        let Factores = listFactor.map(
          ({ idm_parametrosgenerales: value, valor: label }) => ({
            value,
            label,
          })
        );

        setListaFactor(Factores);

        const listMarcaciones = await marcaciones.json();

        let Marcaciones = listMarcaciones.map(
          ({ idm_parametrosgenerales: value, valor: label }) => ({
            value,
            label,
          })
        );

        setListaMarcaciones(Marcaciones);

        const listDelitos = await delitos.json();

        let Delitos = listDelitos.map(
          ({ idm_parametrosgenerales: value, valor: label }) => ({
            value,
            label,
          })
        );

        setListaDelitos(Delitos);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const onSubmit = (data) => {
    console.log("Datos recopilados:", data);

    let stringAristas = data.aristas.map((obj) => obj.label).join(",");

    let arrayMacroriesgos = [];

    dataMacroriesgos.forEach((obj) =>
      arrayMacroriesgos.push(obj.idmacroriesgos)
    );

    let arrayTipologias = [];

    dataTipologias.forEach((obj) => arrayTipologias.push(obj.idtipologias));

    let arrayControles = [];

    dataControles.forEach((obj) => arrayControles.push(obj.idcontrol));

    var datosEnviar = {
      //Causas, datos generales (POST)
      compania: data.compania ? data.compania.label : null,
      nombre: data.nombre ? data.nombre : null,
      descripcion: data.descripcion ? data.descripcion : null,
      arista_causa: stringAristas ? stringAristas : null,
      // LAFT
      factor: data.factor ? data.factor.label : null,
      marcaciones: data.marcaciones ? data.marcaciones.label : null,
      delitos_fuentes: data.delitos ? data.delitos.label : null,
      origen: data.origen ? data.origen.label : null,
      //Tablas LAFT
      macroriesgos: dataMacroriesgos ? arrayMacroriesgos : null,
      categoria_causa: dataCategorias
        ? dataCategorias[0].idcategoria_causas
        : null,
      tipologias: dataTipologias ? arrayTipologias : null,

      controles: dataControles ? arrayControles : null,
    };

    console.log("JSON a enviar:", datosEnviar);

    try {
      axios
        .post(process.env.REACT_APP_API_URL + "/causas/", datosEnviar, {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + serviceAAD.getToken(),
          },
        })
        .then(function (response) {
          if (response.status >= 200 && response.status < 300) {
            //setEstadoPost(2);
            console.log(response);
            alert("Guardado con éxito");
            history.push({
              pathname: "/EditarCausaCumplimiento",
              state: { id: response.data.idcausa },
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
          console.log("CHATCH", errors.response.data);
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

  const FiltrarAristas = (aristasSelected) => {
    // let navbarData = navData;

    // navbarData.forEach((obj1) => {
    //   if (aristasSelected.some((obj2) => obj1.nombre === obj2.label)) {
    //     obj1.estado = true;
    //   } else {
    //     obj1.estado = false;
    //   }
    // });

    // setNavData(navbarData);

    if (aristasSelected.some((obj) => obj.label === "LAFT")) {
      setIsSelectedLAFT(true);
    } else {
      setIsSelectedLAFT(false);
    }
  };

  const DesasociarMacroriesgo = () => {
    if (selectedMacroriesgos[0]) {
      const selectedData = dataMacroriesgos.filter(
        (macroriesgo) => macroriesgo.idmacroriesgos !== selectedMacroriesgos[0]
      );
      setDataMacroriesgos(selectedData);
      selectedMacroriesgos([]);
    } else {
    }
  };
  const DesasociarCategoria = () => {
    if (selectedCategorias[0]) {
      const selectedData = dataCategorias.filter(
        (categoria) => categoria.idcategoria_causas !== selectedCategorias[0]
      );
      setDataCategorias(selectedData);
      selectedCategorias([]);
    } else {
    }
  };
  const DesasociarTipologia = () => {
    if (selectedTipologias[0]) {
      const selectedData = dataTipologias.filter(
        (tipologia) => tipologia.idtipologias !== selectedTipologias[0]
      );
      setDataTipologias(selectedData);
      selectedTipologias([]);
    } else {
    }
  };
  const DesasociarControl = () => {
    if (selectedControles[0]) {
      const selectedData = dataControles.filter(
        (control) => control.idcontrol !== selectedControles[0]
      );
      setDataControles(selectedData);
      selectedControles([]);
    } else {
    }
  };

  const handleChange = (event, newValue) => {
    setValor(newValue);
  };
  function a11yProps(index) {
    return {
      id: `simple-tab-${index}`,
      "aria-controls": `simple-tabpanel-${index}`,
    };
  }

  const col1 = 2;
  const col2 = 10;
  const col3 = 10;

  return (
    <>
      <AlertDismissibleExample alerta={estadoPost} />
      <Container fluid>
        <FormProvider {...methods}>
          {/* <----------------------------------------Modales----------------------------------------> */}
          <ModalAsociarMacroriesgos
            show={showAsociarMacroriesgo}
            onHide={() => setShowAsociarMacroriesgo(false)}
            dataMacroriesgos={dataMacroriesgos}
            setDataMacroriesgos={setDataMacroriesgos}
          />
          <ModalAsociarCategoria
            show={showAsociarCategoria}
            onHide={() => setShowAsociarCategoria(false)}
            dataCategorias={dataCategorias}
            setDataCategorias={setDataCategorias}
          />
          <ModalAsociarTipologia
            show={showAsociarTipologia}
            onHide={() => setShowAsociarTipologia(false)}
            dataTipologias={dataTipologias}
            setDataTipologias={setDataTipologias}
          />

          <ModalAsociarControl
            show={showAsociarControles}
            onHide={() => setShowAsociarControles(false)}
            dataControles={dataControles}
            setDataControles={setDataControles}
          />

          <ModalVerMacroriesgos
            show={showVerMacroriesgo}
            onHide={() => setShowVerMacroriesgo(false)}
            dataMacroriesgos={dataMacroriesgos}
            selected={selectedMacroriesgos}
          />

          <ModalCategoriasCausa
            show={showCategorias}
            onHide={() => setShowCategorias(false)}
            dataCategorias={dataCategorias}
            setDataCategorias={setDataCategorias}
            selected={selectedCategorias}
          />

          <ModalTipologias
            show={showTipologias}
            onHide={() => setShowTipologias(false)}
            dataCategorias={dataTipologias}
            setDataCategorias={setDataTipologias}
            selected={selectedTipologias}
          />

          <ModalVerControl
            show={showVerControles}
            onHide={() => {
              setShowVerControles(false);
              setSelectedControles([]);
            }}
            dataControles={dataControles}
            selected={selectedControles}
          />

          <AppBar
            position="static"
            style={{ background: "#2c2a29", color: "white" }}
          >
            <Tabs
              value={valor}
              onChange={handleChange}
              aria-label="simple tabs example"
            >
              <Tab label="Causas" {...a11yProps(0)} />
              {isSelectedLAFT ? <Tab label="LAFT" {...a11yProps(1)} /> : null}
            </Tabs>
          </AppBar>
          <TabPanel value={valor} index={0}>
            {/* <----------------------------------------Titulo----------------------------------------> */}

            <Row className="mb-3 mt-3">
              <Col sm={8} xs={12}>
                <h1 className="titulo">Crear Causa</h1>
              </Col>

              <Col sm={2} xs={12}>
                <Link to="CausasCumplimiento">
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
                <label className="forn-label label">
                  Compañía que reporta*
                </label>
              </Col>
              <Col sm={10} xs={12}>
                <FormSearchListCompania
                  control={control}
                  name={"compania"}
                  label={"Seleccione la compañia"}
                />
                <p className="text-center">{errors.compania?.message}</p>
              </Col>
            </Row>
            <Row className="mb-4">
              <Col sm={2} xs={12}>
                <label className="forn-label label">Nombre de la Causa*</label>
              </Col>

              <Col sm={10} xs={12}>
                <input
                  {...register("nombre", {
                    required: "Te faltó completar este campo",
                  })}
                  type="text"
                  className="form-control text-center texto"
                  placeholder="Nombre de la Causa"
                />
                <p className="text-center">{errors.nombre?.message}</p>
              </Col>
            </Row>

            <Row className="mb-4">
              <Col sm={2} xs={12}>
                <label className="forn-label label">
                  Descripción de la Causa*
                </label>
              </Col>

              <Col sm={10} xs={12}>
                <textarea
                  {...register("descripcion", {
                    required: "Te faltó completar este campo",
                  })}
                  className="form-control text-center"
                  placeholder="Descripción de la Causa"
                  rows="3"
                />
                <p className="text-center">{errors.descripcion?.message}</p>
              </Col>
            </Row>

            <Row className="mb-4">
              <Col sm={2} xs={12}>
                <label className="forn-label label">Aristas de la Causa*</label>
              </Col>

              <Col sm={col2} xs={10}>
                <Controller
                  control={control}
                  name="aristas"
                  rules={{ required: "Te faltó completar este campo" }}
                  render={({ field }) => (
                    <Select
                      isMulti
                      components={animatedComponents}
                      options={listaAristas}
                      value={field.value}
                      onChange={(event) => {
                        FiltrarAristas(event);
                        //Función para agregar las aristas que venian por default desde el backend a la lista de aristas,
                        // ya que estas se eliminan de la lista por venir seleccionadas.

                        //Funcion para eliminar los duplicados en el array de programas
                        const fiteredProgramas = new Set();
                        const newArray = event.filter((element) => {
                          const isDuplicate = fiteredProgramas.has(
                            element.label
                          );

                          fiteredProgramas.add(element.label);

                          if (!isDuplicate) {
                            return true;
                          } else {
                            return false;
                          }
                        });

                        console.log("newArray", newArray);

                        if (newArray.some((obj) => obj.label === "LAFT")) {
                          setIsSelectedLAFT(true);
                        } else {
                          setIsSelectedLAFT(false);
                        }

                        field.onChange(newArray);
                      }}
                    />
                  )}
                />
                <p className="text-center">{errors.aristas?.message}</p>
              </Col>
            </Row>

            {/* <---------------------------------------- Modal  Controles----------------------------------------> */}

            <Row className="mb-3">
              <Col sm={6} xs={12}>
                <label className="form-label label">Controles</label>
              </Col>

              <Col sm={2} xs={12}>
                {selectedControles[0] ? (
                  <button
                    type="button"
                    className="btn botonPositivo"
                    onClick={setShowVerControles}
                  >
                    Ver
                  </button>
                ) : (
                  <></>
                )}
              </Col>
              <Col sm={2} xs={12}>
                <button
                  type="button"
                  className="btn botonPositivo"
                  onClick={() => setShowAsociarControles(true)}
                >
                  Asociar
                </button>
              </Col>
              <Col sm={2} xs={12}>
                <button
                  type="button"
                  className="btn botonNegativo"
                  onClick={DesasociarControl}
                >
                  Desasociar
                </button>
              </Col>
            </Row>

            <Row className="mb-4">
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

                        <StyledTableCell align="left">
                          ID Control
                        </StyledTableCell>

                        <StyledTableCell align="left">Compañía</StyledTableCell>

                        <StyledTableCell align="left">Proceso</StyledTableCell>

                        <StyledTableCell align="left">Nombre</StyledTableCell>

                        <StyledTableCell align="left">
                          Descripción
                        </StyledTableCell>
                      </TableRow>
                    </TableHead>
                    {/* Fin de encabezado */}
                    {/* Inicio de cuerpo de la tabla */}
                    <TableBody>
                      {dataControles.map((row, index) => {
                        const isItemSelected = isSelectedControles(
                          row.idcontrol
                        );
                        return (
                          <StyledTableRow
                            key={row.idcontrol}
                            hover
                            onClick={(event) =>
                              handleClickControles(event, row.idcontrol)
                            }
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
              </Paper>
            </Row>
          </TabPanel>
          <TabPanel value={valor} index={1}>
            {/* <----------------------------------------Detalle LAFT----------------------------------------> */}

            <Row className="mb-3 mt-3">
              <Col sm={8} xs={12}>
                <h1 className="titulo">Detalle LAFT</h1>
              </Col>

              <Col sm={2} xs={12}>
                <Link to="CausasCumplimiento">
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

            <Row className="mb-3">
              <Col sm={col1} xs={12}>
                <label className="form-label label">Factor*</label>
              </Col>
              <Col sm={col2} xs={12}>
                <Controller
                  control={control}
                  name="factor"
                  // rules={{ required: "Te faltó completar este campo" }}
                  render={({ field }) => (
                    <Select
                      components={animatedComponents}
                      placeholder="Seleccione el Factor"
                      options={listaFactor}
                      value={field.value}
                      onChange={(e) => field.onChange(e)}
                    />
                  )}
                />
                <p className="text-center">{errors.factor?.message}</p>
              </Col>
            </Row>

            <Row className="mb-3">
              <Col sm={col1} xs={12}>
                <label className="form-label label">Marcaciones</label>
              </Col>
              <Col sm={col2} xs={12}>
                <Controller
                  control={control}
                  name="marcaciones"
                  //rules={{ required: "Te faltó completar este campo" }}
                  render={({ field }) => (
                    <Select
                      components={animatedComponents}
                      placeholder="Seleccione las Marcaciones"
                      options={listaMarcaciones}
                      value={field.value}
                      onChange={(e) => field.onChange(e)}
                    />
                  )}
                />
                <p className="text-center">{errors.marcaciones?.message}</p>
              </Col>
            </Row>

            <Row className="mb-3">
              <Col sm={col1} xs={12}>
                <label className="form-label label">Delitos Fuente</label>
              </Col>
              <Col sm={col2} xs={12}>
                <Controller
                  control={control}
                  name="delitos"
                  //rules={{ required: "Te faltó completar este campo" }}
                  render={({ field }) => (
                    <Select
                      components={animatedComponents}
                      placeholder="Seleccione los Delitos fuente"
                      options={listaDelitos}
                      value={field.value}
                      onChange={(e) => field.onChange(e)}
                    />
                  )}
                />
                <p className="text-center">{errors.delitos?.message}</p>
              </Col>
            </Row>

            <Row className="mb-3">
              <Col sm={col1} xs={12}>
                <label className="form-label label">Origen</label>
              </Col>
              <Col sm={col2} xs={12}>
                <Controller
                  control={control}
                  name="origen"
                  //rules={{ required: "Te faltó completar este campo" }}
                  render={({ field }) => (
                    <Select
                      components={animatedComponents}
                      placeholder="Seleccione el Origen"
                      options={[
                        { value: 1, label: "Interno" },
                        { value: 2, label: "Externo" },
                      ]}
                      value={field.value}
                      onChange={(e) => field.onChange(e)}
                    />
                  )}
                />
                <p className="text-center">{errors.origen?.message}</p>
              </Col>
            </Row>

            <br />

            {/* <---------------------------------------Modal Macro riesgos----------------------------------------> */}

            <Row className="mb-3">
              <Col sm={6} xs={12}>
                <label className="form-label label">Macro Riesgos</label>
              </Col>
              <Col sm={2} xs={12}>
                {selectedMacroriesgos[0] ? (
                  <button
                    type="button"
                    className="btn botonPositivo"
                    onClick={() => setShowVerMacroriesgo(true)}
                  >
                    Ver
                  </button>
                ) : (
                  <></>
                )}
              </Col>
              <Col sm={2} xs={12}>
                <button
                  type="button"
                  className="btn botonPositivo"
                  onClick={setShowAsociarMacroriesgo}
                >
                  Asociar
                </button>
              </Col>
              <Col sm={2} xs={12}>
                {selectedMacroriesgos[0] ? (
                  <button
                    type="button"
                    className="btn botonNegativo"
                    onClick={DesasociarMacroriesgo}
                  >
                    Desasociar
                  </button>
                ) : (
                  <></>
                )}
              </Col>
            </Row>

            <Row className="mb-4">
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
                        <StyledTableCell align="left">
                          ID Macro Riesgo
                        </StyledTableCell>
                        <StyledTableCell align="left">
                          Macro Riesgo
                        </StyledTableCell>

                        <StyledTableCell align="left">Estado</StyledTableCell>
                      </TableRow>
                    </TableHead>
                    {/* Fin de encabezado */}
                    {/* Inicio de cuerpo de la tabla */}
                    <TableBody>
                      {dataMacroriesgos.map((row, index) => {
                        const isItemSelected = isSelectedMacroriesgos(
                          row.idmacroriesgos
                        );
                        return (
                          <StyledTableRow
                            key={row.idmacroriesgos}
                            hover
                            onClick={(event) =>
                              handleClickMacroriesgos(event, row.idmacroriesgos)
                            }
                            selectedMacroriesgos={isItemSelected}
                            role="checkbox"
                            tabIndex={-1}
                          >
                            <StyledTableCell component="th" scope="row">
                              <Checkbox checked={isItemSelected} />
                            </StyledTableCell>

                            <StyledTableCell component="th" scope="row">
                              {row.idmacroriesgos}
                            </StyledTableCell>

                            <StyledTableCell align="left">
                              {row.macroriesgo}
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

            {/* <----------------------------------------Modal  CAtegoria de causas----------------------------------------> */}

            <Row className="mb-3">
              <Col sm={4} xs={12}>
                <label className="form-label label">Categoría</label>
              </Col>

              <Col sm={2} xs={12}>
                {selectedCategorias[0] ? (
                  <button
                    type="button"
                    className="btn botonNegativo"
                    onClick={() => setShowCategorias(true)}
                  >
                    Editar
                  </button>
                ) : (
                  <></>
                )}
              </Col>
              <Col sm={2} xs={12}>
                <button
                  type="button"
                  className="btn botonPositivo"
                  onClick={() => setShowCategorias(true)}
                >
                  Crear
                </button>
              </Col>
              <Col sm={2} xs={12}>
                <button
                  type="button"
                  className="btn botonPositivo"
                  onClick={setShowAsociarCategoria}
                >
                  Asociar
                </button>
              </Col>
              <Col sm={2} xs={12}>
                {/* <button
                  type="button"
                  className="btn botonNegativo"
                  onClick={DesasociarCategoria}
                >
                  Desasociar
                </button> */}
              </Col>
            </Row>

            <Row className="mb-4">
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
                        <StyledTableCell align="left">
                          ID Categoría
                        </StyledTableCell>
                        <StyledTableCell align="left">
                          Categoría
                        </StyledTableCell>
                        <StyledTableCell align="left">
                          Subcategoría
                        </StyledTableCell>
                        <StyledTableCell align="left">
                          Consecuecias
                        </StyledTableCell>

                        <StyledTableCell align="left">Estado</StyledTableCell>
                      </TableRow>
                    </TableHead>
                    {/* Fin de encabezado */}
                    {/* Inicio de cuerpo de la tabla */}
                    <TableBody>
                      {dataCategorias.map((row, index) => {
                        const isItemSelected = isSelectedCategorias(
                          row.idcategoria_causas
                        );
                        return (
                          <StyledTableRow
                            key={row.idcategoria_causas}
                            hover
                            onClick={(event) =>
                              handleClickCategorias(
                                event,
                                row.idcategoria_causas
                              )
                            }
                            selected={isItemSelected}
                            role="checkbox"
                            tabIndex={-1}
                          >
                            <StyledTableCell component="th" scope="row">
                              <Checkbox checked={isItemSelected} />
                            </StyledTableCell>

                            <StyledTableCell component="th" scope="row">
                              {row.idcategoria_causas
                                ? row.idcategoria_causas
                                : null}
                            </StyledTableCell>

                            <StyledTableCell align="left">
                              {row.nombre_categoria
                                ? row.nombre_categoria
                                : null}
                            </StyledTableCell>

                            <StyledTableCell align="left">
                              {row.nivel ? row.nivel : null}
                            </StyledTableCell>

                            <StyledTableCell align="left">
                              {row.consecuencias ? row.consecuencias : null}
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

            {/* <---------------------------------------- Modal  Tipologias----------------------------------------> */}

            <Row className="mb-3">
              <Col sm={4} xs={12}>
                <label className="form-label label">Tipologias</label>
              </Col>

              <Col sm={2} xs={12}>
                {selectedTipologias[0] ? (
                  <button
                    type="button"
                    className="btn botonNegativo"
                    onClick={setShowTipologias}
                  >
                    Editar
                  </button>
                ) : (
                  <></>
                )}
              </Col>
              <Col sm={2} xs={12}>
                <button
                  type="button"
                  className="btn botonPositivo"
                  onClick={setShowTipologias}
                >
                  Crear
                </button>
              </Col>
              <Col sm={2} xs={12}>
                <button
                  type="button"
                  className="btn botonPositivo"
                  onClick={() => setShowAsociarTipologia(true)}
                >
                  Asociar
                </button>
              </Col>
              <Col sm={2} xs={12}>
                {selectedTipologias[0] ? (
                  <button
                    type="button"
                    className="btn botonNegativo"
                    onClick={DesasociarTipologia}
                  >
                    Desasociar
                  </button>
                ) : (
                  <></>
                )}
              </Col>
            </Row>

            <Row className="mb-4">
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
                        <StyledTableCell align="left">
                          ID Tipología
                        </StyledTableCell>
                        <StyledTableCell align="left">
                          Tipología
                        </StyledTableCell>
                        <StyledTableCell align="left">
                          Descripción
                        </StyledTableCell>

                        <StyledTableCell align="left">Estado</StyledTableCell>
                      </TableRow>
                    </TableHead>
                    {/* Fin de encabezado */}
                    {/* Inicio de cuerpo de la tabla */}
                    <TableBody>
                      {dataTipologias.map((row, index) => {
                        const isItemSelected = isSelectedTipologias(
                          row.idtipologias
                        );
                        return (
                          <StyledTableRow
                            key={row.idtipologias}
                            hover
                            onClick={(event) =>
                              handleClickTipologias(event, row.idtipologias)
                            }
                            selected={isItemSelected}
                            role="checkbox"
                            tabIndex={-1}
                          >
                            <StyledTableCell component="th" scope="row">
                              <Checkbox checked={isItemSelected} />
                            </StyledTableCell>
                            <StyledTableCell component="th" scope="row">
                              {row.idtipologias}
                            </StyledTableCell>
                            <StyledTableCell align="left">
                              {row.tipologia ? row.tipologia : null}
                            </StyledTableCell>

                            <StyledTableCell align="left">
                              {row.descripcion ? row.descripcion : null}
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
          </TabPanel>
        </FormProvider>
      </Container>
    </>
  );
}
