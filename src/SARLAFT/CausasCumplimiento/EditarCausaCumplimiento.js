import React, { useEffect, useState, useContext, useCallback } from "react";
import { useForm, Controller, useWatch, FormProvider } from "react-hook-form";
import { Link, Routes, Route, useHistory, useLocation } from "react-router-dom";

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
import { withStyles, makeStyles } from "@material-ui/core/styles";

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
import ModalAsociarSegmento from "./Modales/ModalAsociarSegmento";
import ModalIndicadores from "./Modales/ModalIndicadores";
import { SignalCellularNull } from "@material-ui/icons";

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
    zIndex: 0,
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

export default function EditarCausaCumplimiento() {
  let history = useHistory();
  const classes = useStyles();
  const serviceAAD = new AADService();
  const location = useLocation();

  const [estadoPost, setEstadoPost] = useState({
    alerta: { id: 0, data: null },
  });

  const [activo, setActivo] = useState(true);
  const [inactivar, setInactivar] = useState(false);

  const [id, setID] = useState(null);
  const [loadingData, setLoadingData] = useState(null);

  const [valor, setValor] = React.useState(0);
  const [isSelectedLAFT, setIsSelectedLAFT] = useState(null);

  const [listaAristas, setListaAristas] = useState(null);
  const [listaFactor, setListaFactor] = useState(null);
  const [listaMarcaciones, setListaMarcaciones] = useState(null);
  const [listaDelitos, setListaDelitos] = useState(null);
  const [listaCategorias, setListaCategorias] = useState(null);
  const [listaControles, setlistaControles] = useState(null);
  const [listaSegmentos, setlistaSegmentos] = useState(null);
  const [listaIndicadores, setlistaIndicadores] = useState(null);

  const [showAsociarMacroriesgo, setShowAsociarMacroriesgo] = useState(false);
  const [showAsociarCategoria, setShowAsociarCategoria] = useState(false);
  const [showAsociarTipologia, setShowAsociarTipologia] = useState(false);
  const [showVerMacroriesgo, setShowVerMacroriesgo] = useState(false);
  const [showCategorias, setShowCategorias] = useState(false);
  const [showTipologias, setShowTipologias] = useState(false);
  const [showVerControles, setShowVerControles] = useState(false);
  const [showAsociarControles, setShowAsociarControles] = useState(false);
  const [showAsociarSegmentos, setShowAsociarSegmentos] = useState(false);
  const [showAsociarIndicadores, setShowAsociarIndicadores] = useState(false);
  const [showIndicadores, setShowIndicadores] = useState(false);

  const [dataMacroriesgos, setDataMacroriesgos] = useState([]);
  const [dataCategorias, setDataCategorias] = useState([]);
  const [dataTipologias, setDataTipologias] = useState([]);
  const [dataControles, setDataControles] = useState([]);
  const [dataSegmentos, setDataSegmentos] = useState([]);
  const [dataIndicadores, setDataIndicadores] = useState([]);
  const [dataConsecuencias, setDataConsecuencias] = useState([]);

  const [selectedMacroriesgos, setSelectedMacroriesgos] = useState([]);
  const [selectedCategorias, setSelectedCategorias] = useState([]);
  const [selectedTipologias, setSelectedTipologias] = useState([]);
  const [selectedControles, setSelectedControles] = useState([]);
  const [selectedSegmentos, setSelectedSegmentos] = useState([]);
  const [selectedIndicadores, setSelectedIndicadores] = useState([]);

  const [flagExpertos, setFlagExpertos] = useState(false);

  const isSelectedMacroriesgos = (name) =>
    selectedMacroriesgos.indexOf(name) !== -1;
  const isSelectedCategorias = (name) =>
    selectedCategorias.indexOf(name) !== -1;
  const isSelectedTipologias = (name) =>
    selectedTipologias.indexOf(name) !== -1;
  const isSelectedControles = (name) => selectedControles.indexOf(name) !== -1;
  const isSelectedSegmentos = (name) => selectedSegmentos.indexOf(name) !== -1;
  const isSelectedIndicadores = (name) =>
    selectedIndicadores.indexOf(name) !== -1;

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

  const handleClickSegmentos = (event, name) => {
    const selectedIndex = selectedSegmentos.indexOf(name);

    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat([], name);
      //SetButtonEdit(true);
    } else {
      //SetButtonEdit(false);
    }

    setSelectedSegmentos(newSelected);
  };

  const handleClickIndicadores = (event, name) => {
    const selectedIndex = selectedIndicadores.indexOf(name);

    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat([], name);
      //SetButtonEdit(true);
    } else {
      //SetButtonEdit(false);
    }

    setSelectedIndicadores(newSelected);
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

  const llenarFormulario = async (id) => {
    try {
      const response = await axios.get(process.env.REACT_APP_API_URL + "/causas/" + id, {
        headers: {
          Authorization: "Bearer " + serviceAAD.getToken(),
        },
      });

      let data = response.data;

      console.log("Datos del back", data);

      const responseCategorias = await axios.get(
        process.env.REACT_APP_API_URL + "/categoriacausas",
        {
          headers: {
            Authorization: "Bearer " + serviceAAD.getToken(),
          },
        }
      );

      let listaCategorias = responseCategorias.data;

      setValue("id", id);
      setValue("compania", { value: data.compania, label: data.compania });
      setValue("nombre", data.nombre);
      setValue("descripcion", data.descripcion);

      //--------------------------------Manejo de las Aristas (MULTISELECT)------------------------

      let arrayAristas = data.arista_causa.split(",");

      let aristas = [];

      arrayAristas.forEach((string) => {
        aristas.push({ value: string, label: string });
      });

      if (aristas.some((obj) => obj.label === "LAFT")) {
        setIsSelectedLAFT(true);
      } else {
        setIsSelectedLAFT(false);
      }

      setValue("aristas", aristas);

      //------------------------------Detalle LAFT-------------------------------------------------

      setValue("factor", { value: data.factor, label: data.factor });

      setValue("marcaciones", {
        value: data.marcaciones,
        label: data.marcaciones,
      });

      setValue("delitos", {
        value: data.delitos_fuentes,
        label: data.delitos_fuentes,
      });

      setValue("origen", { value: data.origen, label: data.origen });

      setDataMacroriesgos(data.macroriesgos);
      setDataTipologias(data.tipologias);

      console.log("listaCategorias------------>", listaCategorias);

      let categoria = listaCategorias.filter(
        (cat) => cat.idcategoria_causas == data.categoria_causa
      );

      console.log(categoria);

      setDataCategorias(categoria);

      setDataControles(data.controles);
    } catch (error) {}
  };

  useEffect(() => {
    //---------------------------------------------------------Manejo de ids...
    console.log("Ubicación de donde provengo : ", location);

    if (typeof location.state != "undefined") {
      if (location.state.idCausa) {
        let id = location.state.idCausa;
        setID(id);
        setValue("idcausa", id);
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

    let macroriesgos = [];
    dataMacroriesgos.forEach((obj) => {
      macroriesgos.push(obj.idmacroriesgos);
    });

    let tipologias = [];
    dataTipologias.forEach((obj) => {
      tipologias.push(obj.idtipologias);
    });

    let arrayControles = [];
    dataControles.forEach((obj) => arrayControles.push(obj.idcontrol));

    let arraySegmentos = [];
    dataSegmentos.forEach((obj) => arraySegmentos.push(obj.idsegmentos));

    var datosEnviar = {
      //Causas, datos generales (PUT)
      idcausa: id ? id : null,
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
      macroriesgos: dataMacroriesgos ? macroriesgos : null,
      categoria_causa: dataCategorias
        ? dataCategorias[0].idcategoria_causas
        : null,
      tipologias: dataTipologias ? tipologias : null,
      controles: dataControles ? arrayControles : null,
      segmentos: dataSegmentos ? arraySegmentos : null,
    };

    console.log("JSON a enviar:", datosEnviar);

    try {
      axios
        .put(process.env.REACT_APP_API_URL + "/causas/" + id, datosEnviar, {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + serviceAAD.getToken(),
          },
        })
        .then(function (response) {
          if (response.status >= 200 && response.status < 300) {
            setEstadoPost(2);
            console.log(response);
            alert("Guardado con éxito");
            history.push({
              pathname: "/EditarCausaCumplimiento",
              state: { idCausa: id },
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
      setSelectedMacroriesgos([]);
    } else {
    }
  };

  const DesasociarTipologia = () => {
    if (selectedTipologias[0]) {
      const selectedData = dataTipologias.filter(
        (tipologia) => tipologia.idtipologias !== selectedTipologias[0]
      );
      setDataTipologias(selectedData);
      setSelectedTipologias([]);
    } else {
    }
  };

  const DesasociarControl = () => {
    if (selectedControles[0]) {
      const selectedData = dataControles.filter(
        (control) => control.idcontrol !== selectedControles[0]
      );
      setDataControles(selectedData);
      setSelectedControles([]);
    } else {
    }
  };

  const DesasociarSegmento = () => {
    if (selectedSegmentos[0]) {
      const selectedData = dataSegmentos.filter(
        (item) => item.idsegmentos !== selectedSegmentos[0]
      );
      setDataSegmentos(selectedData);
      setSelectedSegmentos([]);
    } else {
    }
  };

  const DesasociarIndicador = () => {
    if (selectedIndicadores[0]) {
      const selectedData = dataSegmentos.filter(
        (item) => item.idindicadores !== selectedIndicadores[0]
      );
      setDataIndicadores(selectedData);
      setSelectedIndicadores([]);
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

          <ModalAsociarSegmento
            show={showAsociarSegmentos}
            onHide={() => setShowAsociarSegmentos(false)}
            dataSegmentos={dataSegmentos}
            setDataSegmentos={setDataSegmentos}
          />

          <ModalVerMacroriesgos
            show={showVerMacroriesgo}
            onHide={() => {
              setShowVerMacroriesgo(false);
            }}
            dataMacroriesgos={dataMacroriesgos}
            selected={selectedMacroriesgos}
          />

          <ModalCategoriasCausa
            show={showCategorias}
            setShowCategorias={setShowCategorias}
            onHide={() => {
              setShowCategorias(false);
              setSelectedCategorias([]);
            }}
            dataCategorias={dataCategorias}
            setDataCategorias={setDataCategorias}
            selected={selectedCategorias}
          />

          <ModalTipologias
            show={showTipologias}
            onHide={() => {
              setShowTipologias(false);
              setSelectedTipologias([]);
            }}
            dataTipologias={dataTipologias}
            setDataTipologias={setDataTipologias}
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

          <ModalIndicadores
            show={showIndicadores}
            onHide={() => {
              setShowIndicadores(false);
              setSelectedIndicadores([]);
            }}
            dataIndicadores={dataIndicadores}
            setDataIndicadores={setDataIndicadores}
            selected={selectedIndicadores}
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
              <Col sm={4} xs={12}>
                <h1 className="titulo">Editar Causa </h1>
              </Col>

              <Col sm={2} xs={12}>
                <input
                  type="text"
                  className="form-control text-center texto"
                  placeholder="Nuevo Estado del evento"
                  value={!!activo ? "Activo" : "Inactivo"}
                  disabled
                />
              </Col>

              {!!activo == true ? (
                <Col sm={2} xs={12}>
                  <Button
                    type="button"
                    className="botonGeneral2"
                    onClick={Inactivar}
                  >
                    Inactivar
                  </Button>
                </Col>
              ) : (
                <Col sm={2} xs={12}>
                  <Button
                    type="button"
                    className="botonGeneral2"
                    onClick={Activar}
                  >
                    Activar
                  </Button>
                </Col>
              )}

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
                <label className="forn-label label">ID Causa</label>
              </Col>
              <Col sm={4} xs={12}>
                <input
                  {...register("idcausa")}
                  disabled
                  type="text"
                  className="form-control text-center texto"
                  placeholder="ID Causa"
                />
              </Col>
            </Row>

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
                {selectedControles[0] ? (
                  <button
                    type="button"
                    className="btn botonNegativo"
                    onClick={DesasociarControl}
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
                      placeholder="Origen"
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

            {/* <---------------------------------------- Modal  Segmentos----------------------------------------> */}
            <Row className="mb-3">
              <Col sm={4} xs={12}>
                <label className="form-label label">Segmentos</label>
              </Col>

              <Col sm={2} xs={12}>
                {selectedSegmentos[0] ? (
                  <button
                    type="button"
                    className="btn botonNegativo"
                    onClick={() => {
                      history.push({
                        pathname: "/EditarSegmento",
                        state: { idSegmento: selectedSegmentos[0] },
                      });
                    }}
                  >
                    Editar
                  </button>
                ) : (
                  <></>
                )}
              </Col>
              <Col sm={2} xs={12}>
                <Link to="/CrearSegmento" target="_blank">
                  <button type="button" className="btn botonPositivo">
                    Crear
                  </button>
                </Link>
              </Col>
              <Col sm={2} xs={12}>
                <button
                  type="button"
                  className="btn botonPositivo"
                  onClick={() => setShowAsociarSegmentos(true)}
                >
                  Asociar
                </button>
              </Col>
              <Col sm={2} xs={12}>
                {selectedSegmentos[0] ? (
                  <button
                    type="button"
                    className="btn botonNegativo"
                    onClick={DesasociarSegmento}
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
                          ID Segmento
                        </StyledTableCell>
                        <StyledTableCell align="left">Compañia</StyledTableCell>

                        <StyledTableCell align="left">Factor</StyledTableCell>

                        <StyledTableCell align="left">
                          Segmento a priori
                        </StyledTableCell>

                        <StyledTableCell align="left">Cluster</StyledTableCell>

                        <StyledTableCell align="left">
                          Descripción Cluster
                        </StyledTableCell>

                        <StyledTableCell align="left">
                          Nivel Probabilidad
                        </StyledTableCell>

                        <StyledTableCell align="left">
                          Nivel Riesgo-Causa-Segmento Inherente
                        </StyledTableCell>

                        <StyledTableCell align="left">
                          Nivel Riesgo-Causa-Segmento Inherente
                        </StyledTableCell>
                      </TableRow>
                    </TableHead>
                    {/* Fin de encabezado */}
                    {/* Inicio de cuerpo de la tabla */}
                    <TableBody>
                      {dataSegmentos.map((row, index) => {
                        const isItemSelected = isSelectedSegmentos(
                          row.idsegmentos
                        );
                        return (
                          <StyledTableRow
                            key={row.idsegmentos}
                            hover
                            onClick={(event) =>
                              handleClickSegmentos(event, row.idsegmentos)
                            }
                            selected={isItemSelected}
                            role="checkbox"
                            tabIndex={-1}
                          >
                            <StyledTableCell component="th" scope="row">
                              <Checkbox checked={isItemSelected} />
                            </StyledTableCell>
                            <StyledTableCell component="th" scope="row">
                              {row.idsegmentos}
                            </StyledTableCell>
                            <StyledTableCell align="left">
                              {row.compania ? row.compania : null}
                            </StyledTableCell>

                            <StyledTableCell align="left">
                              {row.factor ? row.factor : null}
                            </StyledTableCell>

                            <StyledTableCell align="left">
                              {row.segmento_a_priori
                                ? row.segmento_a_priori
                                : null}
                            </StyledTableCell>

                            <StyledTableCell align="left">
                              {row.cluster ? row.cluster : null}
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
            {/* <---------------------------------------- Valoración----------------------------------------> */}

            <br />

            <Row className="mb-3">
              <Col sm={12} xs={12}>
                <h2 className="titulo text-left">Valoración</h2>
              </Col>
            </Row>

            <hr />

            <Row className="mb-3">
              <Col sm={12} xs={12}>
                <label className="subtitulo text-left">Impacto</label>
              </Col>
            </Row>

            <Container>
              <Row className="mb-3">
                <Col sm={3} xs={12}>
                  <label className="form-label label">
                    Método de valoración
                  </label>
                </Col>

                <Col sm={9} xs={12}>
                  <Select
                    components={animatedComponents}
                    placeholder="Método de valoración"
                    options={[{ value: 0, label: "Delphi – Impacto LAFT" }]}
                    // value={field.value}
                  />
                </Col>
              </Row>

              <Row className="mb-4">
                <Col sm={3} xs={12}>
                  <label className="form-label label">Consecuencias</label>
                </Col>
                <Col sm={9} xs={12}>
                  <Paper className={classes.root}>
                    <TableContainer
                      component={Paper}
                      className={classes.container}
                    >
                      <Table>
                        {/* Inicio de encabezado */}
                        <TableHead className="titulo">
                          <TableRow>
                            <StyledTableCell align="left">
                              Riesgo con impacto reputacional
                            </StyledTableCell>
                            <StyledTableCell align="left">
                              Riesgo legal
                            </StyledTableCell>

                            <StyledTableCell align="left">
                              Riesgo operacional
                            </StyledTableCell>

                            <StyledTableCell align="left">
                              Riesgo de contagio
                            </StyledTableCell>
                          </TableRow>
                        </TableHead>
                        {/* Fin de encabezado */}
                        {/* Inicio de cuerpo de la tabla */}
                        <TableBody>
                          {dataConsecuencias.map((row, index) => {
                            const isItemSelected = isSelectedSegmentos(
                              row.idsegmentos
                            );
                            return (
                              <StyledTableRow
                                key={row.idsegmentos}
                                hover
                                onClick={(event) =>
                                  handleClickSegmentos(event, row.idsegmentos)
                                }
                                selected={isItemSelected}
                                role="checkbox"
                                tabIndex={-1}
                              >
                                <StyledTableCell component="th" scope="row">
                                  {row.idsegmentos}
                                </StyledTableCell>
                                <StyledTableCell align="left">
                                  {row.compania ? row.compania : null}
                                </StyledTableCell>

                                <StyledTableCell align="left">
                                  {row.factor ? row.factor : null}
                                </StyledTableCell>

                                <StyledTableCell align="left">
                                  {row.segmento_a_priori
                                    ? row.segmento_a_priori
                                    : null}
                                </StyledTableCell>
                              </StyledTableRow>
                            );
                          })}
                        </TableBody>
                        {/* Fin de cuerpo de la tabla */}
                      </Table>
                    </TableContainer>
                  </Paper>
                </Col>
              </Row>

              <Row className="mb-3">
                <Col sm={3} xs={12}>
                  <label className="form-label label">
                    Calificación impacto
                  </label>
                </Col>
                <Col sm={3} xs={12}>
                  <input
                    {...register("impacto")}
                    type="text"
                    disabled
                    className="form-control text-center texto"
                  />
                </Col>
              </Row>

              <hr />
            </Container>

            <Row className="mb-3">
              <Col sm={12} xs={12}>
                <label className="subtitulo text-left">Probabilidad</label>
              </Col>
            </Row>

            <Container>
              <Row className="mb-3">
                <Col sm={3} xs={12}>
                  <label className="form-label label">
                    Método de valoración
                  </label>
                </Col>

                <Col sm={9} xs={12}>
                  <Select
                    components={animatedComponents}
                    placeholder="Método de valoración"
                    options={[
                      {
                        value: "Indicadores de probabilidad ",
                        label: "Indicadores de probabilidad ",
                      },
                      { value: "Expertos", label: "Expertos" },
                    ]}
                    // value={field.value}
                    onChange={(e) => {
                      if (e.label === "Expertos") {
                        setFlagExpertos(true);
                      } else {
                        setFlagExpertos(false);
                      }
                    }}
                  />
                </Col>
              </Row>

              {!flagExpertos ? (
                <>
                  <Row className="mb-3">
                    <Col sm={4} xs={12}>
                      <label className="form-label label">Indicador</label>
                    </Col>

                    <Col sm={2} xs={12}>
                      {selectedIndicadores[0] ? (
                        <button
                          type="button"
                          className="btn botonNegativo"
                          // onClick={}
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
                        onClick={setShowIndicadores}
                      >
                        Crear
                      </button>
                    </Col>
                    <Col sm={2} xs={12}>
                      <button
                        type="button"
                        className="btn botonPositivo"
                        //onClick={() => setShowAsociarSegmentos(true)}
                      >
                        Asociar
                      </button>
                    </Col>
                    <Col sm={2} xs={12}>
                      {selectedSegmentos[0] ? (
                        <button
                          type="button"
                          className="btn botonNegativo"
                          //onClick={DesasociarSegmento}
                        >
                          Desasociar
                        </button>
                      ) : (
                        <></>
                      )}
                    </Col>
                  </Row>

                  <Row className="mb-4">
                    <Col sm={3} xs={12}></Col>
                    <Col sm={9} xs={12}>
                      <Paper className={classes.root}>
                        <TableContainer
                          component={Paper}
                          className={classes.container}
                        >
                          <Table>
                            {/* Inicio de encabezado */}
                            <TableHead className="titulo">
                              <TableRow>
                                <StyledTableCell padding="checkbox"></StyledTableCell>

                                <StyledTableCell align="left">
                                  ID Indicador
                                </StyledTableCell>

                                <StyledTableCell align="left">
                                  Fórmula
                                </StyledTableCell>
                              </TableRow>
                            </TableHead>
                            {/* Fin de encabezado */}
                            {/* Inicio de cuerpo de la tabla */}
                            <TableBody>
                              {dataIndicadores.map((row, index) => {
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
                                  </StyledTableRow>
                                );
                              })}
                            </TableBody>
                            {/* Fin de cuerpo de la tabla */}
                          </Table>
                        </TableContainer>
                      </Paper>
                    </Col>
                  </Row>
                </>
              ) : null}

              <Row className="mb-3">
                <Col sm={3} xs={12}>
                  <label className="form-label label">
                    Calificación probabilidad
                  </label>
                </Col>
                <Col sm={3} xs={12}>
                  <input
                    {...register("probabilidad")}
                    type="text"
                    disabled
                    className="form-control text-center texto"
                  />
                </Col>
              </Row>

              <hr />
            </Container>
          </TabPanel>
        </FormProvider>
      </Container>
    </>
  );
}
