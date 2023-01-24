import React, { useState, useEffect, useContext } from "react";
import { useForm, Controller, useWatch, FormProvider } from "react-hook-form";
import { Link, Routes, Route, useHistory, useLocation } from "react-router-dom";
import { FormControl, MenuItem, FormHelperText } from "@material-ui/core";
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

import { default as SelectMaterial } from "@material-ui/core/Select";

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

import ModalRiesgo from "./Modales/ModalRiesgos";
import ModalInactivar from "./Modales/ModalInactivar";

import { FormInputDate } from "../../form-components/FormInputDate";
import { FormSearchListSiNo } from "../../form-components/FormSearchListSiNo";
import { FormSearchListRiesgos } from "../../form-components/FormSearchListRiesgos";
import { FormSearchListTiposFalla } from "../../form-components/FormSearchListTiposFalla";
import { FormSearchListPlanesAccion } from "../../form-components/FormSearchListPlanesAccion";
import { FormInputOtrosRiesgosImpactados } from "../../form-components/FormInputOtrosRiesgosImpactados";

import { UsuarioContext } from "../../Context/UsuarioContext";

import ModalCausas from "./Modales/ModalCausas";

import ModalInactivarCausas from "./Modales/ModalInactivarCausas";

import Select from "react-select";
import makeAnimated from "react-select/animated";
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

export default function EditarEvento() {
  let history = useHistory();
  const classes = useStyles();
  const serviceAAD = new AADService();
  const location = useLocation();

  const [idEventoMaterializado, setIdEventoMaterializado] = useState(null);

  const [estadoPost, setEstadoPost] = useState({
    alerta: { id: 0, data: null },
  });

  const [editEfectoFinanciero, setEditEfectosFinancieros] = useState(null);
  

  const [ListaCompaniasInicial, setListaCompaniasInicial] = useState([]);
  const [ListaAreasInicial, setListaAreasInicial] = useState([]);
  const [ListaProcesosInicial, setListaProcesosInicial] = useState([]);
  const [ListaCategoriasRiesgo, setListaCategoriasRiesgo] = useState([]);

  const [ListaAreas, setListaAreas] = useState([]);
  const [ListaProcesos, setListaProcesos] = useState([]);

  const [ListaCatCorp1, setListaCatCorp1] = useState([]);
  const [ListaCatCorp3, setListaCatCorp3] = useState([]);

  const [ListaCatLocal1, setListaCatLocal1] = useState([]);
  const [ListaCatLocal3, setListaCatLocal3] = useState([]);

  const [ButtonEdit, SetButtonEdit] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selected, setSelected] = useState([]);
  const [showDisplayR, setShowDisplayR] = useState(false);
  const [showModalR, setShowModalR] = useState(false);
  const [dataR, setDataR] = useState([]);
 

  const [showModalCausas, setShowModalCausas] = useState(false);
  const [showEditCausas, setShowEditCausas] = useState(false);
  const [causaSelected, setCausaSelected] = useState([]);
  const [dataCausas, setDataCausas] = useState([]);

  const [showBotonEditarEfectos, setShowBotonEditarEfectos] = useState(false);
  const [selectedEfectos, setSelectedEfectos] = useState([]);
  const [dataEfectos, setDataEfectos] = useState([]);

  const [Activo, setActivo] = useState(true);
  const [Inactivar, setInactivar] = useState(false);
  const [motivoInactivacion, setMotivoInactivacion] = useState(null);

  const [Region, setRegion] = useState(null);

  const [loadingData, setLoadingData] = React.useState(false);

  const [monedaCOP, setMonedaCOP] = useState(null);
  const [monedaUSD, setMonedaUSD] = useState(null);
  const [perdidas, setPerdidas] = useState(null);
  const [selectMoneda, setSelectMoneda] = useState(null);
  

  const defaultValues = {
    idRiesgo: null,
    riesgo: null,
    compania: null,
    areaReporta: null,
    areaOcurrencia: null,
    proceso: null,
    fechaInicial: null,
    fechaFinal: null,
    fechaDescubrimiento: null,
    asociadoCambio: null,
    categoriaCorp1: null,
    categoriaCorp3: null,
    categoriaLocal1: null,
    categoriaLocal3: null,
    DescCategoriaCorp: null,
    DescCategoriaLocal: null,
    tipoFalla: null,
    afectoConsumidor: null,
    otrosRiesgosImpact: null,
    idMacroevento: null,
    planesAccion: null,
    infoAdicional: null,
    efectoReputacional: null,
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

  const response = {};

  useEffect(() => {
    const llenarFormulario = async () => {
      try {
        //---------------------------------------------------------Manejo de ids...
        // console.log("Ubicación de donde provengo : ", location);

        let tempIDevento = "";
        let ultimaBusqueda = "";

        if (typeof location.state != "undefined") {
          if (
            location.state.idEventoMaterializado &&
            location.state.idEventoMaterializado.length > 0
          ) {
            tempIDevento = location.state.idEventoMaterializado;
            setIdEventoMaterializado(tempIDevento);
            localStorage.setItem("idEventoMaterializado", tempIDevento);
          }
        } else {
          ultimaBusqueda = localStorage.getItem("idEventoMaterializado");
          if (ultimaBusqueda && ultimaBusqueda.length > 0) {
            tempIDevento = ultimaBusqueda;
            setIdEventoMaterializado(tempIDevento);
          } else {
            alert("Ups, ocurrió un error, trata de recargar la página");
          }
        }

        //-------------------------------------------------------------------------------------

        const response = await axios.get(
          process.env.REACT_APP_API_URL + "/evento_materializado/" + tempIDevento,
          {
            headers: {
              Authorization: "Bearer " + serviceAAD.getToken(),
            },
          }
        );
        const responseCompanias = await axios.get(
          process.env.REACT_APP_API_URL + "/maestros_ro/compania/",
          {
            headers: {
              Authorization: "Bearer " + serviceAAD.getToken(),
            },
          }
        );
        const responseAreas = await axios.get(
          process.env.REACT_APP_API_URL + "/maestros_ro/area_o/",
          {
            headers: {
              Authorization: "Bearer " + serviceAAD.getToken(),
            },
          }
        );
        const responseProcesos = await axios.get(
          process.env.REACT_APP_API_URL + "/ultimonivel/Proceso",
          {
            headers: {
              Authorization: "Bearer " + serviceAAD.getToken(),
            },
          }
        );
        const responseCategorias = await axios.get(
          process.env.REACT_APP_API_URL + "/maestros_ro/categoria_riesgo/",
          {
            headers: {
              Authorization: "Bearer " + serviceAAD.getToken(),
            },
          }
        );
        let procesos = responseProcesos.data.map(
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
        let areas = responseAreas.data.map(
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
        let companias = responseCompanias.data.map(
          ({ idcompania: value, compania: label, pais }) => ({
            value,
            label,
            pais,
          })
        );
        let categoriasRiesgo = responseCategorias.data.map(
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

        setListaCompaniasInicial(companias);

        setListaAreasInicial(areas);

        setListaProcesosInicial(procesos);

        setListaCategoriasRiesgo(categoriasRiesgo);

        let data = response.data;

        setMonedaCOP(data.moneda_COP)
        setMonedaUSD(data.moneda_USD)
        setPerdidas(data.moneda_COP)


        let objCompania = companias.find(
          (compania) => compania.label == data.compania_que_reporta
        );

        let idcompania = objCompania.value;

        let region = objCompania.pais;

        let tempListaAreas = areas.filter(
          (area) => area.idcompania == idcompania
        );

        let tempListaProcesos = procesos.filter(
          (proceso) => proceso.idcompania == idcompania
        );

        setListaAreas(tempListaAreas);

        setListaProcesos(tempListaProcesos);

        let fecha_inicial = Date.parse(data.primera_fecha_evento);
        let fecha_final = Date.parse(data.ultima_fecha_evento);
        let fecha_descubrimiento = Date.parse(data.fecha_descubrimiento);

        let dataReset = {
          idRiesgo: data.idriesgo,

          riesgo: {
            value: data.nombre_riesgo,
            label: data.nombre_riesgo,
          },
          compania: {
            value: data.compania_que_reporta,
            label: data.compania_que_reporta,
          },
          areaReporta: {
            value: data.nombrearea_que_reporta,
            label: data.nombrearea_que_reporta,
          },
          areaOcurrencia: {
            value: data.nombrearea_de_ocurrecnia,
            label: data.nombrearea_de_ocurrecnia,
          },
          proceso: {
            value: data.nombre_proceso,
            label: data.nombre_proceso,
          },

          fechaInicial: fecha_inicial,

          fechaFinal: fecha_final,

          fechaDescubrimiento: fecha_descubrimiento,

          asociadoCambio: {
            value: data.cambio_transformacion,
            label: data.cambio_transformacion === 1 ? "Si" : "No",
          },

          categoriaCorp1: {
            value: data.categoria_riesgos_corporativa_n1,
            label: data.categoria_riesgos_corporativa_n1,
          },
          categoriaCorp3: {
            value: data.categoria_riesgos_corporativa_n3,
            label: data.categoria_riesgos_corporativa_n3,
          },
          categoriaLocal1: {
            value: data.categoria_riesgos_local_n1,
            label: data.categoria_riesgos_local_n1,
          },
          categoriaLocal3: {
            value: data.categoria_riesgos_local_n3,
            label: data.categoria_riesgos_local_n3,
          },

          DescCategoriaCorp: data.descripcion_evento,

          DescCategoriaLocal: data.descripcion_evento_local,

          tipoFalla: {
            value: data.tipo_de_falla,
            label: data.tipo_de_falla,
          },

          afectoConsumidor: {
            value: data.afecto_consumidor,
            label: data.afecto_consumidor,
          },

          otrosRiesgosImpact: {
            value: data.otros_riesgos_impactados,
            label: data.otros_riesgos_impactados,
          },

          idMacroevento: data.idmacroevento,

          planesAccion: {
            value: data.id_plan_accion,
            label: data.id_plan_accion,
          },

          infoAdicional: data.informacion_adicional,

          efectoReputacional: {
            value: data.evento_reputacional,
            label: data.evento_reputacional,
          },
        };

        reset(dataReset);

        let tempListaCatCorp1 = categoriasRiesgo.filter(
          (categoria) =>
            categoria.nivel == 1 && categoria.atributo === "Corporativa"
        );

        let tempListaCatCorp3 = categoriasRiesgo.filter(
          (categoria) =>
            categoria.nivel == 3 &&
            categoria.atributo === "Corporativa" &&
            categoria.categoria_riesgos_n1 ==
              data.id_categoria_riesgos_corporativa_n1
        );

        let tempListaCatLocal1 = categoriasRiesgo.filter((categoria) => {
          switch (region) {
            case "Colombia":
              if (categoria.atributo === "Local - COL") {
                return true;
              } else {
                return false;
              }
              break;
            case "Panamá":
              if (categoria.atributo === "Local -PAN") {
                return true;
              } else {
                return false;
              }
              break;
            case "Guatemala":
              if (categoria.atributo === "Local - GTM") {
                return true;
              } else {
                return false;
              }
              break;
            case "El Salvador":
              break;
            default:
              break;
          }
        });

        //* se sobreescribe el array para encontrar los indices de la categoria de riesgo homologas perteneciente a cada categoria local.
        tempListaCatLocal1 = tempListaCatLocal1.map((categoria) => {
          return categoria.categoria_riesgos_n1;
        });
        //* Se eliminan los valores repetidos
        tempListaCatLocal1 = [...new Set(tempListaCatLocal1)];

        const temp = [];

        //* Se genera el array de objetos con la categoria de riesgos equivalente.
        tempListaCatLocal1.map((currentValue, i) => {
          temp.push(
            ListaCategoriasRiesgo.filter((cat) => cat.value == currentValue)[0]
          );
        });

        let tempListaCatLocal3 = categoriasRiesgo.filter((categoria) => {
          switch (region) {
            case "Colombia":
              if (
                categoria.atributo === "Local - COL" &&
                categoria.nivel == 3 &&
                categoria.categoria_riesgos_n1 ==
                  data.id_categoria_riesgos_local_n1
              ) {
                return true;
              } else {
                return false;
              }
              break;
            case "Panamá":
              if (
                categoria.atributo === "Local -PAN" &&
                categoria.nivel == 3 &&
                categoria.categoria_riesgos_n1 ==
                  data.id_categoria_riesgos_local_n1
              ) {
                return true;
              } else {
                return false;
              }
              break;
            case "Guatemala":
              if (
                categoria.atributo === "Local - GTM" &&
                categoria.nivel == 3 &&
                categoria.categoria_riesgos_n1 ==
                  data.id_categoria_riesgos_local_n1
              ) {
                return true;
              } else {
                return false;
              }
              break;
            case "El Salvador":
              break;
            default:
              break;
          }
        });

        setDataCausas(data.causas_del_evento);
        setDataEfectos(data.efectos_financieros);
        setListaCatCorp1(tempListaCatCorp1);
        setListaCatCorp3(tempListaCatCorp3);
        setListaCatLocal1(temp);
        setListaCatLocal3(tempListaCatLocal3);

        setLoadingData(true);
      } catch (error) {
        console.error(error);
      }
    };
    llenarFormulario();
    const poblarTablaEfectos = () => {
      if (location.state !== undefined) {
        setDataEfectos([location.state]);
      }
    };

    poblarTablaEfectos();
  }, []);

  const onSubmitEfectosFinancieros = (data) => {
    

    var datosEnviar = {
      cambio_transformacion: data.asociadoCambio
        ? data.asociadoCambio.value
        : null,

      id_evento_materializado: idEventoMaterializado
        ? idEventoMaterializado
        : null,

      id_riesgo: data.idRiesgo ? data.idRiesgo : null,

      compañia_que_reporta: data.compania.label ? data.compania.label : null,

      descripcion_del_evento: data.DescCategoriaCorp
        ? data.DescCategoriaCorp
        : null,

      fecha_descubrimiento: data.fechaDescubrimiento
        ? new Date(data.fechaDescubrimiento)
        : null,

      primera_fecha_del_evento: data.fechaInicial
        ? new Date(data.fechaInicial)
        : null,

      ultima_fecha_del_evento: data.fechaFinal
        ? new Date(data.fechaFinal)
        : null,

      afecto_consumidor_financiero: data.afectoConsumidor.label
        ? data.afectoConsumidor.label
        : null,

      estado_del_evento: "Abierto",

      evento_anulado: "No",

      informacion_adicional: data.infoAdicional ? data.infoAdicional : null,

      idmacroevento: data.idMacroevento ? data.idMacroevento : null,

      evento_reputacional: data.efectoReputacional
        ? data.efectoReputacional.label
        : null,

      otros_riesgos_impactados: data.otrosRiesgosImpact
        ? data.otrosRiesgosImpact.label
        : null,

      id_plan_de_accion: data.planesAccion ? data.planesAccion.value : null,

      justificacion_anulacion_evento: null,

      area_que_reporta: data.areaReporta.label ? data.areaReporta.label : null,

      area_de_ocurrencia: data.areaOcurrencia.label
        ? data.areaOcurrencia.label
        : null,

      proceso: data.proceso.label ? data.proceso.label : null,

      categoria_de_riesgo_corporativa_nivel_3: data.categoriaCorp3
        ? data.categoriaCorp3.label
        : null,

      categoria_de_riesgo_local_nivel_3: data.categoriaLocal3
        ? data.categoriaLocal3.label
        : null,

      descripcion_evento_local: data.DescCategoriaLocal
        ? data.DescCategoriaLocal
        : null,

      tipo_de_falla: data.tipoFalla ? data.tipoFalla.label : null,

      causas_del_evento: dataCausas ? dataCausas : [],
    };


    try {
      axios
        .put(
          process.env.REACT_APP_API_URL + "/evento_materializado/" +
            localStorage.idEventoMaterializado,
          datosEnviar,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + serviceAAD.getToken(),
            },
          }
        )
        .then(function (response) {
          if (response.status >= 200 && response.status < 300) {
            //setEstadoPost(2);
            alert("Guardado con éxito");
            history.push({
              pathname: "/NuevoEfecto",
              state: { idEventoMaterializado: idEventoMaterializado },
            });
          } else if (response.status >= 300 && response.status < 400) {
            setEstadoPost(4);
          } else if (response.status >= 400 && response.status < 512) {
            setEstadoPost(5);
          }
        })
        .catch((errors) => {
          // console.log("CHATCH", errors.response.data);
          let result = JSON.stringify(errors.response.data).split(",");
          let msg = [];
          // console.log("RESUTL", result);

          result.map((dato) => {
            msg.push(
              "\n ■" +
                dato
                  .replace("[", "")
                  .replace("]", "")
                  .replace("{", "")
                  .replace("}", "")
                  .replace(".", "")
            );
            return null;
          });
          msg = msg.toString().replace(",", "");
          console.log("MENSAJE", msg);

          setEstadoPost({
            id: 3,
            data: msg,
          });
          setTimeout(() => {
            setEstadoPost({ id: 0, data: null });
          }, 10000);
        });
    } catch (error) {
      console.error(error);
    }
  };

  const onSubmit = (data) => {

    var datosEnviar = {
      cambio_transformacion: data.asociadoCambio
        ? data.asociadoCambio.value
        : null,

      id_evento_materializado: idEventoMaterializado
        ? idEventoMaterializado
        : null,

      id_riesgo: data.idRiesgo ? data.idRiesgo : null,

      compañia_que_reporta: data.compania.label ? data.compania.label : null,

      descripcion_del_evento: data.DescCategoriaCorp
        ? data.DescCategoriaCorp
        : null,

      fecha_descubrimiento: data.fechaDescubrimiento
        ? new Date(data.fechaDescubrimiento)
        : null,

      primera_fecha_del_evento: data.fechaInicial
        ? new Date(data.fechaInicial)
        : null,

      ultima_fecha_del_evento: data.fechaFinal
        ? new Date(data.fechaFinal)
        : null,

      afecto_consumidor_financiero: data.afectoConsumidor.label
        ? data.afectoConsumidor.label
        : null,

      estado_del_evento: "Abierto",

      evento_anulado: "No",

      informacion_adicional: data.infoAdicional ? data.infoAdicional : null,

      idmacroevento: data.idMacroevento ? data.idMacroevento : null,

      evento_reputacional: data.efectoReputacional
        ? data.efectoReputacional.label
        : null,

      otros_riesgos_impactados: data.otrosRiesgosImpact
        ? data.otrosRiesgosImpact.label
        : null,

      id_plan_de_accion: data.planesAccion ? data.planesAccion.value : null,

      justificacion_anulacion_evento: null,

      area_que_reporta: data.areaReporta.label ? data.areaReporta.label : null,

      area_de_ocurrencia: data.areaOcurrencia.label
        ? data.areaOcurrencia.label
        : null,

      proceso: data.proceso.label ? data.proceso.label : null,

      categoria_de_riesgo_corporativa_nivel_3: data.categoriaCorp3
        ? data.categoriaCorp3.label
        : null,

      categoria_de_riesgo_local_nivel_3: data.categoriaLocal3
        ? data.categoriaLocal3.label
        : null,

      descripcion_evento_local: data.DescCategoriaLocal
        ? data.DescCategoriaLocal
        : null,

      tipo_de_falla: data.tipoFalla ? data.tipoFalla.label : null,

      causas_del_evento: dataCausas ? dataCausas : [],
    };


    try {
      axios
        .put(
          process.env.REACT_APP_API_URL + "/evento_materializado/" +
            localStorage.idEventoMaterializado,
          datosEnviar,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + serviceAAD.getToken(),
            },
          }
        )
        .then(function (response) {
          if (response.status >= 200 && response.status < 300) {
            //setEstadoPost(2);
            alert("Guardado con éxito");
            history.push("/EditarEvento");
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
          let result = JSON.stringify(errors.response.data).split(",");
          let msg = [];
          console.log("RESUTL", result);

          result.map((dato) => {
            msg.push(
              "\n ■" +
                dato
                  .replace("[", "")
                  .replace("]", "")
                  .replace("{", "")
                  .replace("}", "")
                  .replace(".", "")
            );
            return null;
          });
          msg = msg.toString().replace(",", "");
          console.log("MENSAJE", msg);

          setEstadoPost({
            id: 3,
            data: msg,
          });
          setTimeout(() => {
            setEstadoPost({ id: 0, data: null });
          }, 10000);
        });
    } catch (error) {
      console.error(error);
    }
  };
  const onError = (errors) => console.log(errors);

  const EliminarRiesgo = () => {
    if (selected.length > 0) {
      setValue("idRiesgo", null);
      setDataR([]);
      setShowDisplayR(false);
    }
  };

  const isSelected = (name) => selected.indexOf(name) !== -1;

  const isSelectedCausas = (name) => causaSelected.indexOf(name) !== -1;

  const isSelectedEfecto = (name) => selectedEfectos.indexOf(name) !== -1;

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
  };

  const handleClickCausas = (event, name) => {
    const selectedIndex = causaSelected.indexOf(name);

    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat([], name);
      setShowEditCausas(true);
    } else {
      setShowEditCausas(false);
    }

    setCausaSelected(newSelected);
  };

  const handleClickEfectos = (event, name) => {
    const selectedIndex = selectedEfectos.indexOf(name);

    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat([], name);
      SetButtonEdit(true);
    } else {
      SetButtonEdit(false);
    }

    setEditEfectosFinancieros(newSelected);

    if (newSelected.length > 0) {
      setShowBotonEditarEfectos(true);
    } else {
      setShowBotonEditarEfectos(false);
    }

    setSelectedEfectos(newSelected);
  };

  const InactivarEvento = () => {
    setInactivar((prev) => !prev);
  };

  const ActivarEvento = () => {
    setActivo((prev) => !prev);
  };

  const FiltrarCategoriaCorp = (cat) => {
    setValue("categoriaCorp3", {
      value: null,
      label: null,
    });

    let tempListaCatCorp3 = ListaCategoriasRiesgo.filter(
      (categoria) =>
        categoria.nivel == 3 &&
        categoria.atributo === "Corporativa" &&
        categoria.categoria_riesgos_n1 == cat.categoria_riesgos_n1
    );

    setListaCatCorp3(tempListaCatCorp3);

  };

  const FiltrarCategoriaLocal = (cat) => {
    let region = Region;

    setValue("categoriaLocal3", {
      value: null,
      label: null,
    });

    let tempListaCatLocal3 = ListaCategoriasRiesgo.filter((categoria) => {
      switch (region) {
        case "Colombia":
          if (
            categoria.atributo === "Local - COL" &&
            categoria.nivel == 3 &&
            categoria.categoria_riesgos_n1 == cat.categoria_riesgos_n1
          ) {
            return true;
          } else {
            return false;
          }
          break;
        case "Panamá":
          if (
            categoria.atributo === "Local -PAN" &&
            categoria.nivel == 3 &&
            categoria.categoria_riesgos_n1 == cat.categoria_riesgos_n1
          ) {
            return true;
          } else {
            return false;
          }
          break;
        case "Guatemala":
          if (
            categoria.atributo === "Local - GTM" &&
            categoria.nivel == 3 &&
            categoria.categoria_riesgos_n1 == cat.categoria_riesgos_n1
          ) {
            return true;
          } else {
            return false;
          }
          break;
        case "El Salvador":
          break;
        default:
          break;
      }
    });

    setListaCatLocal3(tempListaCatLocal3);

  };


  const FiltrarMaestros = (objCompania) => {
    setValue("compania", {
      value: objCompania.value,
      label: objCompania.label,
    });

    setValue("areaReporta", {
      value: null,
      label: null,
    });

    setValue("areaOcurrencia", {
      value: null,
      label: null,
    });

    setValue("proceso", {
      value: null,
      label: null,
    });

    setValue("categoriaCorp1", {
      value: null,
      label: null,
    });

    setValue("categoriaCorp3", {
      value: null,
      label: null,
    });

    setValue("categoriaLocal1", {
      value: null,
      label: null,
    });

    setValue("categoriaLocal3", {
      value: null,
      label: null,
    });

    let idcompania = objCompania.value;

    let region = objCompania.pais;

    setRegion(region);

    let tempListaAreas = ListaAreasInicial.filter(
      (area) => area.idcompania == idcompania
    );

    let tempListaProcesos = ListaProcesosInicial.filter(
      (proceso) => proceso.idcompania == idcompania
    );

    let tempListaCatCorp1 = ListaCategoriasRiesgo.filter(
      (categoria) =>
        categoria.nivel == 1 && categoria.atributo === "Corporativa"
    );

    console.log(tempListaCatCorp1);

    let tempListaCatLocal1 = ListaCategoriasRiesgo.filter((categoria) => {
      switch (region) {
        case "Colombia":
          if (categoria.atributo === "Local - COL") {
            return true;
          } else {
            return false;
          }
          break;
        case "Panamá":
          if (categoria.atributo === "Local -PAN") {
            return true;
          } else {
            return false;
          }
          break;
        case "Guatemala":
          if (categoria.atributo === "Local - GTM") {
            return true;
          } else {
            return false;
          }
          break;
        case "El Salvador":
          break;
        default:
          break;
      }
    });

    //* se sobreescribe el array para encontrar los indices de la categoria de riesgo homologas perteneciente a cada categoria local.
    tempListaCatLocal1 = tempListaCatLocal1.map((categoria) => {
      return categoria.categoria_riesgos_n1;
    });
    //* Se eliminan los valores repetidos
    tempListaCatLocal1 = [...new Set(tempListaCatLocal1)];

    const temp = [];

    //* Se genera el array de objetos con la categoria de riesgos equivalente.
    tempListaCatLocal1.map((currentValue, i) => {
      temp.push(
        ListaCategoriasRiesgo.filter((cat) => cat.value == currentValue)[0]
      );
    });

    setListaAreas(tempListaAreas);

    setListaProcesos(tempListaProcesos);

    setListaCatCorp1(tempListaCatCorp1);

    setListaCatLocal1(temp);
  };

  return (
    <>
      <AlertDismissibleExample alerta={estadoPost} />

      <Container>
        <FormProvider {...methods}>
          {/* <-------------------------------------Titulo-------------------------------------> */}
          <Row className="mb-3 mt-3">
            <Col sm={12} xs={12}>
              <h1 className="titulo">Evento: {idEventoMaterializado}</h1>
            </Col>
          </Row>

          {!loadingData ? (
            <Row className="mb-3 mt-5">
              <Col>
                <Loader
                  type="Oval"
                  color="#FFBF00"
                  style={{ textAlign: "center", position: "static" }}
                />
              </Col>
            </Row>
          ) : (
            <>
              <Row className="mb-3 mt-3">
                {!!Activo == true ? (
                  <Col sm={2} xs={12}>
                    <Button
                      type="button"
                      className="botonGeneral2"
                      onClick={InactivarEvento}
                    >
                      Inactivar
                    </Button>
                  </Col>
                ) : (
                  <Col sm={2} xs={12}>
                    <Button
                      type="button"
                      className="botonGeneral2"
                      onClick={ActivarEvento}
                    >
                      Activar
                    </Button>
                  </Col>
                )}

                <Col sm={2} xs={12}>
                  <Link to="Eventos">
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

                <Col sm={4} xs={12}>
                  <input
                    type="text"
                    className="form-control text-center texto"
                    placeholder="Nuevo Estado del evento"
                    value={!!Activo ? "Activo" : "Inactivo"}
                    disabled
                  />
                </Col>
              </Row>

              {/* <----------------------------------------Formulario----------------------------------------> */}

              {/* <----------------------------------------Modal riesgos asociados al evento---------------------------------------> */}

              <ModalInactivar
                setActivo={setActivo}
                Inactivar={Inactivar}
                setInactivar={setInactivar}
                setMotivoInactivacion={setMotivoInactivacion}
              ></ModalInactivar>

              <ModalRiesgo
                showModalR={showModalR}
                setShowModalR={setShowModalR}
                dataR={dataR}
                setDataR={setDataR}
                setShowDisplayR={setShowDisplayR}
                setValue={setValue}
              ></ModalRiesgo>

              {/* <-----------------------------------------------------------------------------------------------------------> */}
              <hr />
              <br />

              {!Activo ? (
                <>
                  <Row className="mb-4">
                    <Col sm={2} xs={12}>
                      <label className="forn-label label">
                        Motivo de inactivación
                      </label>
                    </Col>
                    <Col sm={10} xs={12}>
                      <textarea
                        className="form-control text-center"
                        placeholder="Motivo de inactivación"
                        rows="3"
                        value={motivoInactivacion}
                        disabled
                      />
                    </Col>
                  </Row>
                </>
              ) : (
                <></>
              )}
              {/* <--------------------------------------------------Información general---------------------------------------> */}

              <Row className="mb-4">
                <Col sm={3} xs={12}>
                  <label className="forn-label label">
                    ID del riesgo asociado al evento
                  </label>
                </Col>

                <Col sm={2} xs={12}>
                  <input
                    type="text"
                    className="form-control text-center texto"
                    placeholder="ID del riesgo"
                    {...register("idRiesgo")}
                  />
                </Col>

                {!showDisplayR ? (
                  <Col sm={1} xs={12}>
                    <button
                      type="button"
                      class="btn btn-primary btn-md"
                      onClick={() => {
                        setShowModalR(true);
                      }}
                    >
                      Asociar
                    </button>
                  </Col>
                ) : (
                  <Col sm={1} xs={4}>
                    <button
                      type="button"
                      className="btn botonNegativo"
                      onClick={EliminarRiesgo}
                    >
                      Eliminar
                    </button>
                  </Col>
                )}
              </Row>

              {showDisplayR ? (
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
                            <StyledTableCell>Id Riesgo</StyledTableCell>
                            <StyledTableCell align="left">
                              Tipo de Elemento
                            </StyledTableCell>
                            <StyledTableCell align="left">
                              Elemento Principal
                            </StyledTableCell>
                            <StyledTableCell align="left">
                              Nombre
                            </StyledTableCell>
                            <StyledTableCell align="left">
                              Descripción
                            </StyledTableCell>
                            <StyledTableCell align="left">
                              Arista del Riesgo
                            </StyledTableCell>
                            <StyledTableCell align="left">
                              Responsable
                            </StyledTableCell>
                            <StyledTableCell align="left">
                              Riesgo Residual
                            </StyledTableCell>
                          </TableRow>
                        </TableHead>
                        {/* Fin de encabezado */}
                        {/* Inicio de cuerpo de la tabla */}
                        <TableBody>
                          {dataR
                            .slice(
                              page * rowsPerPage,
                              page * rowsPerPage + rowsPerPage
                            )
                            .map((row, index) => {
                              const isItemSelected = isSelected(row.idriesgo);
                              return (
                                <StyledTableRow
                                  key={row.idriesgo}
                                  hover
                                  onClick={(event) =>
                                    handleClick(event, row.idriesgo)
                                  }
                                  selected={isItemSelected}
                                  role="checkbox"
                                  tabIndex={-1}
                                >
                                  <StyledTableCell component="th" scope="row">
                                    <Checkbox checked={isItemSelected} />
                                  </StyledTableCell>

                                  <StyledTableCell component="th" scope="row">
                                    {row.idriesgo !== null
                                      ? row.idriesgo
                                      : null}
                                  </StyledTableCell>
                                  <StyledTableCell align="left">
                                    {row.tipo_elemento_evaluado !== null
                                      ? row.tipo_elemento_evaluado
                                      : null}
                                  </StyledTableCell>

                                  <StyledTableCell align="left">
                                    {row.elemento_ppal_evaluado !== null
                                      ? row.elemento_ppal_evaluado
                                      : null}
                                  </StyledTableCell>
                                  <StyledTableCell align="left">
                                    {row.nombre_riesgo !== null
                                      ? row.nombre_riesgo
                                      : null}
                                  </StyledTableCell>
                                  <StyledTableCell align="left">
                                    {row.descripcion_general !== null
                                      ? row.descripcion_general
                                      : null}
                                  </StyledTableCell>
                                  <StyledTableCell align="left">
                                    {row.arista_del_riesgo !== null
                                      ? row.arista_del_riesgo
                                      : null}
                                  </StyledTableCell>
                                  <StyledTableCell align="left">
                                    {row.nombre !== null ? row.nombre : null}
                                  </StyledTableCell>
                                  <StyledTableCell align="left">
                                    {row.nivel_riesgo_residual
                                      ? row.nivel_riesgo_residual
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
                </Row>
              ) : (
                <></>
              )}

              <Row className="mb-4">
                <Col sm={2} xs={12}>
                  <label className="forn-label label">
                    Compañía que reporta*
                  </label>
                </Col>
                <Col sm={4} xs={12}>
                  <Controller
                    control={control}
                    name="compania"
                    render={({ field: { value } }) => (
                      <Select
                        components={animatedComponents}
                        options={ListaCompaniasInicial}
                        onChange={FiltrarMaestros}
                        value={value}
                        placeholder="Seleccione la compañia"
                      />
                    )}
                    rules={{
                      required: "Te faltó completar este campo",
                    }}
                  />
                  <p>{errors.compania?.message}</p>
                </Col>

                <Col sm={2} xs={12}>
                  <label className="forn-label label">Proceso*</label>
                </Col>
                <Col sm={4} xs={12}>
                  <Controller
                    control={control}
                    name="proceso"
                    render={({ field: { onChange, value } }) => (
                      <Select
                        components={animatedComponents}
                        options={ListaProcesos}
                        onChange={onChange}
                        value={value}
                        placeholder="Seleccione el proceso"
                      />
                    )}
                    rules={{
                      required: "Te faltó completar este campo",
                    }}
                  />
                  <p>{errors.proceso?.message}</p>
                </Col>
              </Row>

              <Row className="mb-4">
                <Col sm={2} xs={12}>
                  <label className="forn-label label">Área que reporta*</label>
                </Col>
                <Col sm={4} xs={12}>
                  <Controller
                    control={control}
                    name="areaReporta"
                    render={({ field: { onChange, value } }) => (
                      <Select
                        components={animatedComponents}
                        options={ListaAreas}
                        onChange={onChange}
                        value={value}
                        placeholder="Seleccione el area que reporta"
                      />
                    )}
                    rules={{
                      required: "Te faltó completar este campo",
                    }}
                  />
                  <p>{errors.areaReporta?.message}</p>
                </Col>

                <Col sm={2} xs={12}>
                  <label className="forn-label label">
                    Área de ocurrencia*
                  </label>
                </Col>
                <Col sm={4} xs={12}>
                  <Controller
                    control={control}
                    name="areaOcurrencia"
                    render={({ field: { onChange, value } }) => (
                      <Select
                        components={animatedComponents}
                        options={ListaAreas}
                        onChange={onChange}
                        value={value}
                        placeholder="Seleccione el area de ocurrencia"
                      />
                    )}
                    rules={{
                      required: `Se requiere el campo de`,
                    }}
                  />
                </Col>
              </Row>

              <Row className="mb-4">
                <Col sm={2} xs={12}>
                  <label className="forn-label label">Tipo de falla*</label>
                </Col>

                <Col sm={4} xs={12}>
                  <FormSearchListTiposFalla
                    control={control}
                    name="tipoFalla"
                    label="TipoFalla"
                  />
                </Col>

                <Col sm={2} xs={12}>
                  <label className="forn-label label">
                    Afectó consumidor financiero*
                  </label>
                </Col>

                <Col sm={4} xs={12}>
                  <FormSearchListSiNo
                    control={control}
                    name="afectoConsumidor"
                    label="AfectoConsumidor"
                    placeholder="Afectó consumidor financiero"
                  />
                </Col>
              </Row>

              <Row className="mb-4">
                <Col sm={2} xs={12}>
                  <label className="forn-label label">Id plan de acción</label>
                </Col>

                <Col sm={4} xs={12}>
                  <FormSearchListPlanesAccion
                    control={control}
                    name="planesAccion"
                    label="PlanesAccion"
                  />
                </Col>

                <Col sm={2} xs={12}>
                  <label className="forn-label label">
                    Evento asociado a transformación
                  </label>
                </Col>

                <Col sm={4} xs={12}>
                  <FormSearchListSiNo
                    control={control}
                    name="asociadoCambio"
                    label="AsociadoCambio"
                  />
                </Col>
              </Row>

              <Row className="mb-4">
                <Col sm={2} xs={12}>
                  <label className="forn-label label">
                    Otros riesgos impactados
                  </label>
                </Col>

                <Col sm={4} xs={12}>
                  <FormInputOtrosRiesgosImpactados
                    control={control}
                    name="otrosRiesgosImpact"
                    label="OtrosRiesgosImpact"
                  />
                </Col>

                <Col sm={2} xs={12}>
                  <label className="forn-label label">
                    Efecto reputacional
                  </label>
                </Col>
                <Col sm={4} xs={12}>
                  <FormSearchListSiNo
                    control={control}
                    name="efectoReputacional"
                    label="EfectoReputacional"
                  />
                </Col>
              </Row>

              <hr />
              <br />

              <Row className="mb-4">
                <Col sm={2} xs={12}>
                  <label className="forn-label label">Fecha inicial:</label>
                </Col>

                <Col sm={2} xs={12}>
                  <FormInputDate
                    control={control}
                    name="fechaInicial"
                    label="FechaInicial"
                  />
                </Col>

                <Col sm={2} xs={12}>
                  <label className="forn-label label">Fecha final:</label>
                </Col>

                <Col sm={2} xs={12}>
                  <FormInputDate
                    control={control}
                    name="fechaFinal"
                    label="FechaFinal"
                  />
                </Col>

                <Col sm={2} xs={12}>
                  <label className="forn-label label">
                    Fecha de descubrimiento :
                  </label>
                </Col>

                <Col sm={2} xs={12}>
                  <FormInputDate
                    control={control}
                    name="fechaDescubrimiento"
                    label="FechaDescubrimiento"
                  />
                </Col>
              </Row>

              <hr />
              <br />

              {/* <---------------------------------------------- DETALLE RO-----------------------------------------------> */}

              <Row className="mb-3 mt-3">
                <Col sm={2} xs={12}>
                  <h2 className="subtitulo">Detalle RO</h2>
                  <hr />
                </Col>
              </Row>

              <Row className="mb-4">
                <Col sm={2} xs={12}>
                  <label className="forn-label label">
                    Categoría corporativa 1*
                  </label>
                </Col>

                <Col sm={4} xs={12}>
                  <Controller
                    control={control}
                    name="categoriaCorp1"
                    render={({ field }) => (
                      <Select
                        components={animatedComponents}
                        options={ListaCatCorp1}
                        onChange={(event) => {
                          FiltrarCategoriaCorp(event);
                          field.onChange(event);
                        }}
                        value={field.value}
                        placeholder="Seleccione la categoria"
                      />
                    )}
                    rules={{
                      required: `Se requiere el campo de`,
                    }}
                  />
                </Col>

                <Col sm={2} xs={12}>
                  <label className="forn-label label">
                    Categoría corporativa 3*
                  </label>
                </Col>

                <Col sm={4} xs={12}>
                  <Controller
                    control={control}
                    name="categoriaCorp3"
                    render={({ field: { onChange, value } }) => (
                      <Select
                        components={animatedComponents}
                        options={ListaCatCorp3}
                        onChange={onChange}
                        value={value}
                        placeholder="Seleccione la categoria"
                      />
                    )}
                    rules={{
                      required: `Se requiere el campo de`,
                    }}
                  />
                </Col>
              </Row>

              <Row className="mb-4">
                <Col sm={2} xs={12}>
                  <label className="forn-label label">
                    Descripción corporativa*
                  </label>
                </Col>

                <Col sm={10} xs={12}>
                  <textarea
                    className="form-control text-center"
                    placeholder="Descripción corporativa del evento"
                    rows="3"
                    {...register("DescCategoriaCorp")}
                  />
                </Col>
              </Row>

              <Row className="mb-4">
                <Col sm={2} xs={12}>
                  <label className="forn-label label">Categoría local 1</label>
                </Col>

                <Col sm={4} xs={12}>
                  <Controller
                    control={control}
                    name="categoriaLocal1"
                    render={({ field }) => (
                      <Select
                        components={animatedComponents}
                        options={ListaCatLocal1}
                        onChange={(event) => {
                          FiltrarCategoriaLocal(event);
                          field.onChange(event);
                        }}
                        value={field.value}
                        placeholder="Seleccione la categoria"
                      />
                    )}
                    rules={{
                      required: `Se requiere el campo de`,
                    }}
                  />
                </Col>

                <Col sm={2} xs={12}>
                  <label className="forn-label label">Categoría local 3</label>
                </Col>

                <Col sm={4} xs={12}>
                  <Controller
                    control={control}
                    name="categoriaLocal3"
                    render={({ field: { onChange, value } }) => (
                      <Select
                        components={animatedComponents}
                        options={ListaCatLocal3}
                        onChange={onChange}
                        value={value}
                        placeholder="Seleccione la categoria"
                      />
                    )}
                    rules={{
                      required: `Se requiere el campo de`,
                    }}
                  />
                </Col>
              </Row>

              <Row className="mb-4">
                <Col sm={2} xs={12}>
                  <label className="forn-label label">
                    Descripción local del evento
                  </label>
                </Col>

                <Col sm={10} xs={12}>
                  <textarea
                    className="form-control text-center"
                    placeholder="Descripción local del evento"
                    rows="3"
                    {...register("DescCategoriaLocal")}
                  />
                </Col>
              </Row>

              <br />

              {/* <Row className="mb-4">
            <Col sm={2} xs={12}>
              <label className="forn-label label">ID macro-evento:</label>
            </Col>

            <Col sm={4} xs={12}>
              <input
                type="text"
                className="form-control text-center texto"
                placeholder="Nuevo Estado del evento"
                {...register("idMacroevento")}
              />
            </Col>
          </Row> */}

              <Row className="mb-4">
                <Col sm={2} xs={12}>
                  <label className="forn-label label">
                    Información adicional
                  </label>
                </Col>

                <Col sm={10} xs={12}>
                  <textarea
                    {...register("infoAdicional")}
                    className="form-control text-center"
                    placeholder="Información adicional"
                    rows="3"
                  />
                </Col>
              </Row>

              <hr />
              <br />

              {/* <------------------------------------------ Causas​---------------------------------------------> */}
              <Row className="mb-4">
                <Col sm={10} xs={12} />
                {!showEditCausas ? (
                  <Col sm={2} xs={12}>
                    <Button
                      type="button"
                      className="botonPositivo"
                      onClick={setShowModalCausas}
                    >
                      Crear causa
                    </Button>
                  </Col>
                ) : (
                  <Col sm={2} xs={12}>
                    <Button
                      type="button"
                      className="botonNegativo"
                      onClick={setShowModalCausas}
                    >
                      Editar causa
                    </Button>
                  </Col>
                )}
              </Row>

              <ModalCausas
                show={showModalCausas}
                setShowModalCausas={setShowModalCausas}
                dataCausas={dataCausas}
                setDataCausas={setDataCausas}
                causaSelected={causaSelected}
                idEventoMaterializado={idEventoMaterializado}
              />

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
                          <StyledTableCell align="left">
                            Causa nivel 1
                          </StyledTableCell>

                          <StyledTableCell align="left">
                            Causa nivel 2
                          </StyledTableCell>

                          <StyledTableCell align="left">
                            Relevancia de la causa
                          </StyledTableCell>

                          <StyledTableCell align="left">
                            Peso de la causa
                          </StyledTableCell>

                          <StyledTableCell align="left">
                            Descripción de la incidencia
                          </StyledTableCell>

                          <StyledTableCell align="left">
                            Justificacion de anulación
                          </StyledTableCell>

                          <StyledTableCell align="left">Estado</StyledTableCell>
                        </TableRow>
                      </TableHead>
                      {/* Fin de encabezado */}
                      {/* Inicio de cuerpo de la tabla */}
                      <TableBody>
                        {dataCausas
                          .slice(
                            page * rowsPerPage,
                            page * rowsPerPage + rowsPerPage
                          )
                          .map((row, index) => {
                            const isItemSelectedCausa = isSelectedCausas(
                              row.id_causa_delevento
                            );
                            return (
                              <StyledTableRow
                                key={row.id_causa_delevento}
                                hover
                                onClick={(event) =>
                                  handleClickCausas(
                                    event,
                                    row.id_causa_delevento
                                  )
                                }
                                selected={isItemSelectedCausa}
                                role="checkbox"
                                tabIndex={-1}
                              >
                                <StyledTableCell component="th" scope="row">
                                  <Checkbox checked={isItemSelectedCausa} />
                                </StyledTableCell>
                                <StyledTableCell component="th" scope="row">
                                  {row.id_causa_delevento}
                                </StyledTableCell>
                                <StyledTableCell align="left">
                                  {row.causa_n1}
                                </StyledTableCell>
                                <StyledTableCell align="left">
                                  {row.causa_n2}
                                </StyledTableCell>
                                <StyledTableCell align="left">
                                  {row.relevancia_causa}
                                </StyledTableCell>
                                <StyledTableCell align="left">
                                  {row.peso_causa}
                                </StyledTableCell>
                                <StyledTableCell align="left">
                                  {row.descripcion_incidencia_causa}
                                </StyledTableCell>
                                <StyledTableCell align="left">
                                  {row.justificacion_anulacion_causa}
                                </StyledTableCell>
                                <StyledTableCell align="left">
                                  {row.causa_anulada == 1
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
                </Paper>
              </Row>

              <br />

              {/* <------------------------------------- Efectos financieros​-------------------------------------> */}

              <Row className="mb-4">
                <Col sm={6} xs={12}>
                  <label className="forn-label label">
                    Efectos financieros asociados al evento
                  </label>
                </Col>
                <Col sm={2} xs={12}></Col>

                <Col sm={2} xs={12}>
                  <button
                    type="submit"
                    className="btn botonPositivo"
                    onClick={handleSubmit(onSubmitEfectosFinancieros, onError)}
                  >
                    Crear efecto
                  </button>
                </Col>

                {showBotonEditarEfectos ? (
                  <Col sm={2} xs={12}>
                    <button
                      type="button"
                      className="btn botonNegativo"
                      onClick={() => {
                        localStorage.setItem(
                          "idEfectoFinanciero",
                          selectedEfectos
                        );
                        history.push({
                          pathname: "/EditarEfecto",
                          state: {
                            idEfectoFinanciero: editEfectoFinanciero[0],
                            idEventoMaterializado: idEventoMaterializado,
                          },
                        });
                      }}
                    >
                      Editar
                    </button>
                  </Col>
                ) : (
                  <></>
                )}
              </Row>

              <Row className="mb-1">
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
                          <StyledTableCell align="left">
                            Valor COP
                          </StyledTableCell>
                          <StyledTableCell align="left">Estado</StyledTableCell>
                        </TableRow>
                      </TableHead>
                      {/* Fin de encabezado */}
                      {/* Inicio de cuerpo de la tabla */}
                      <TableBody>
                        {dataEfectos
                          .slice(
                            page * rowsPerPage,
                            page * rowsPerPage + rowsPerPage
                          )
                          .map((row, index) => {
                            const isItemSelectedEfecto = isSelectedEfecto(
                              row.idefecto_financiero
                            );
                            return (
                              <StyledTableRow
                                key={row.idefecto_financiero}
                                hover
                                onClick={(event) =>
                                  handleClickEfectos(
                                    event,
                                    row.idefecto_financiero
                                  )
                                }
                                selected={isItemSelectedEfecto}
                                role="checkbox"
                                tabIndex={-1}
                              >
                                <StyledTableCell component="th" scope="row">
                                  <Checkbox checked={isItemSelectedEfecto} />
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
                                  {row.efecto_anulado == 1
                                    ? "Inactivo"
                                    : "Activo"}
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
              <br />
              <Row className="mb-1">
                <Col sm={2} xs={12}>
                <label>Elija moneda</label>
                </Col>
                <Col sm={4} xs={12}>
                <Select components={animatedComponents}
                    options={[{value:1, label: "COP"},{value:2, label: "USD"}]}
                    value = {selectMoneda}
                    onChange={
                      (e)=>{
                        switch (e.label) {
                          case "COP":
                            setPerdidas(monedaCOP)
                            break;
                          case "USD":
                            setPerdidas(monedaUSD)
                            break;
                        
                          default:
                            break;
                        }
                        setSelectMoneda(e)
                      }
                    }
                    />                
                </Col>
  
              
              </Row>
              <Row className="mb-3">
                <Col sm={3} xs={12}></Col>

                <Col sm={3} xs={12}>
                  <label>Total pérdidas</label>
                </Col>
                <Col sm={3} xs={12}>
                  <label>Total recuperaciones</label>
                </Col>
                  
                <Col sm={3} xs={12}>
                  <label>Total pérdida neta</label>
                </Col>
              </Row>
              <Row className="mb-3">
                <Col sm={3} xs={12}>
                  <label className="forn-label label">
                    Contabilizado en RO
                  </label>
                </Col>

                <Col sm={3} xs={12}>
                <input type="number" className="form-control text-center texto" disabled value={perdidas.perdidas.contable_cuentas_RO} />
                </Col>
                <Col sm={3} xs={12}>
                <input type="number" className="form-control text-center texto" disabled value={perdidas.recuperaciones.contable_cuentas_RO} />
                </Col>
                  
                <Col sm={3} xs={12}>
                  <input type="number" className="form-control text-center texto" disabled value={perdidas.perdida_neta.contable_cuentas_RO} />
                </Col>
              </Row>
              <Row className="mb-3">
                <Col sm={3} xs={12}>
                  <label className="forn-label label">
                    Contabilizado otras cuentas
                  </label>
                </Col>

                <Col sm={3} xs={12}>
                <input type="number" className="form-control text-center texto" disabled value={perdidas.perdidas.contabilizado_otras_cuentas} />
                </Col>
                <Col sm={3} xs={12}>
                <input type="number" className="form-control text-center texto" disabled value={perdidas.recuperaciones.contabilizado_otras_cuentas} />
                </Col>
                  
                <Col sm={3} xs={12}>
                  <input type="number" className="form-control text-center texto" disabled value={perdidas.perdida_neta.contabilizado_otras_cuentas} />
                </Col>
              </Row>
              <Row className="mb-3">
                <Col sm={3} xs={12}>
                  <label className="forn-label label">
                    Provisionado
                  </label>
                </Col>

                <Col sm={3} xs={12}>
                <input type="number" className="form-control text-center texto" disabled value={perdidas.perdidas.provisionado} />
                </Col>
                <Col sm={3} xs={12}>
                <input type="number" className="form-control text-center texto" disabled value={perdidas.recuperaciones.provisionado} />
                </Col>
                  
                <Col sm={3} xs={12}>
                  <input type="number" className="form-control text-center texto" disabled value={perdidas.perdida_neta.provisionado} />
                </Col>
              </Row>
              <Row className="mb-3">
                <Col sm={3} xs={12}>
                  <label className="forn-label label">
                    Sin contabilización
                  </label>
                </Col>

                <Col sm={3} xs={12}>
                <input type="number" className="form-control text-center texto" disabled value={perdidas.perdidas.sin_asiento_contable} />
                </Col>
                <Col sm={3} xs={12}>
                <input type="number" className="form-control text-center texto" disabled value={perdidas.recuperaciones.sin_asiento_contable} />
                </Col>
                  
                <Col sm={3} xs={12}>
                  <input type="number" className="form-control text-center texto" disabled value={perdidas.perdida_neta.sin_asiento_contable} />
                </Col>
              </Row>
              <Row className="mb-3">
                <Col sm={3} xs={12}>
                  <label className="forn-label label">
                    Ingresos
                  </label>
                </Col>

                <Col sm={3} xs={12}>
                <input type="number" className="form-control text-center texto" disabled value={perdidas.perdidas.ingresos} />
                </Col>
                <Col sm={3} xs={12}>
                <input type="number" className="form-control text-center texto" disabled value={perdidas.recuperaciones.ingresos} />
                </Col>
                  
                <Col sm={3} xs={12}>
                  <input type="number" className="form-control text-center texto" disabled value={perdidas.perdida_neta.ingresos} />
                </Col>
              </Row>
              <Row className="mb-3">
                <Col sm={3} xs={12}>
                  <label className="forn-label label">
                    Total
                  </label>
                </Col>

                <Col sm={3} xs={12}>
                <input type="number" className="form-control text-center texto" disabled value={perdidas.perdidas.total} />
                </Col>
                <Col sm={3} xs={12}>
                <input type="number" className="form-control text-center texto" disabled value={perdidas.recuperaciones.total} />
                </Col>
                  
                <Col sm={3} xs={12}>
                  <input type="number" className="form-control text-center texto" disabled value={perdidas.perdida_neta.total} />
                </Col>
              </Row>
              
            

              {/* <-------------------------------------Titulo-------------------------------------> */}

              <br />
              <hr />

              <Row className="mb-3 mt-3">
                <Col md={6}>
                  <h4 className="titulo">
                    Editar evento: {idEventoMaterializado}
                  </h4>
                </Col>

                {!!Activo == true ? (
                  <Col sm={2} xs={12}>
                    <Button
                      type="button"
                      className="botonGeneral2"
                      onClick={InactivarEvento}
                    >
                      Inactivar
                    </Button>
                  </Col>
                ) : (
                  <Col sm={2} xs={12}>
                    <Button
                      type="button"
                      className="botonGeneral2"
                      onClick={ActivarEvento}
                    >
                      Activar
                    </Button>
                  </Col>
                )}

                <Col sm={2} xs={12}>
                  <Link to="Eventos">
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
              <Row className="mb-4">
                <br />
              </Row>
              <Row className="mb-4">
                <br />
              </Row>
              <Row className="mb-4">
                <br />
              </Row>
            </>
          )}
        </FormProvider>
      </Container>
    </>
  );
}
