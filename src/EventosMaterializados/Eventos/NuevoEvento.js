import React, { useState, useEffect, useContext } from "react";

import AADService from "../../auth/authFunctions";

import axios from "axios";

import { Link, Routes, Route, useHistory } from "react-router-dom";

import { Row, Col, Form, Alert, Button, Container } from "react-bootstrap";

import { useForm, Controller, useWatch, FormProvider } from "react-hook-form";

import { forwardRef } from "react";
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
import Checkbox from "@material-ui/core/Checkbox";
import { withStyles, makeStyles } from "@material-ui/core/styles";

import ModalRiesgo from "./Modales/ModalRiesgos";
import ModalEfectos from "./Modales/ModalEfectos";
import ModalCausas from "./Modales/ModalCausas";

import { FormInputDate } from "../../form-components/FormInputDate";
import { FormSearchListSiNo } from "../../form-components/FormSearchListSiNo";
import { FormSearchListRiesgos } from "../../form-components/FormSearchListRiesgos";
import { FormSearchListTiposFalla } from "../../form-components/FormSearchListTiposFalla";
import { FormSearchListPlanesAccion } from "../../form-components/FormSearchListPlanesAccion";
import { FormInputOtrosRiesgosImpactados } from "../../form-components/FormInputOtrosRiesgosImpactados";

import Select from "react-select";

import makeAnimated from "react-select/animated";

import { UsuarioContext } from "../../Context/UsuarioContext";

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

// function AlertDismissibleExample(data) {
//   let temp = [];
//   let errors = "";
//   let temp2 = [];
//   if (data.alerta.data !== null && data.alerta.data !== undefined) {
//     temp = JSON.stringify(data.alerta.data).split('"');
//     temp.map((dat, index) => {
//       if (index % 2 !== 0) {
//         temp2.push(dat);
//       }
//     });
//     for (let index = 0; index < temp2.length; index += 2) {
//       errors = errors + temp2[index] + ": " + temp2[index + 1] + "\n";
//     }
//   }
//   switch (data.alerta.id) {
//     case 1:
//       return (
//         <Alert className="alerta" variant="warning">
//           Alerta
//         </Alert>
//       );
//       break;
//     case 2:
//       return <Alert variant="success">Guardó exitosamente</Alert>;
//       break;
//     case 3:
//       return <Alert variant="danger"></Alert>;
//       break;
//     case 4:
//       return <Alert variant="warning">{errors}</Alert>;
//       break;
//     case 5:
//       return <Alert variant="danger">Error en el servidor</Alert>;
//       break;
//     case 6:
//       return (
//         <Alert variant="warning">
//           Ya existe una evaluación para el activo seleccionado
//         </Alert>
//       );
//       break;
//     default:
//       return <p></p>;
//       break;
//   }
// }

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
  DescCategoriaCorp: null,
  categoriaLocal1: null,
  categoriaLocal3: null,
  DescCategoriaLocal: null,
  tipoFalla: null,
  afectoConsumidor: null,
  otrosRiesgosImpact: null,
  idMacroevento: null,
  planesAccion: null,
  infoAdicional: null,
  efectoReputacional: null,
};

export default function NuevoEvento() {
  let history = useHistory();
  const classes = useStyles();
  const serviceAAD = new AADService();
  const { dataUsuario } = useContext(UsuarioContext);

  const [idEventoMaterializado, setIdEventoMaterializado] = useState(null);

  const [estadoPost, setEstadoPost] = useState({
    alerta: { id: 0, data: null },
  });

  const [buscando, setBuscando] = useState(null);
  const [dataBusqueda, setDataBusqueda] = useState([]);

  const [showDecision, setShowDecision] = useState(false);
  const [riesgoDecision, setResgoDecision] = useState(null);

  const [ButtonEdit, SetButtonEdit] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selected, setSelected] = useState([]);

  const [dataR, setDataR] = useState([]);
  const [showModalR, setShowModalR] = useState(false);
  const [showDisplayR, setShowDisplayR] = useState(false);

  const [dataEfectos, setDataEfectos] = useState([]);
  const [showEfectos, setShowEfectos] = useState(false);

  const [showModalEfectos, setShowModalEfectos] = useState(false);
  const [showDisplayEfectos, setShowDisplayEfectos] = useState(false);
  const [flagEfectosFinancieros, setFlagEfectosFinancieros] = useState(false);

  const [ListaCompaniasInicial, setListaCompaniasInicial] = useState([]);
  const [ListaAreasInicial, setListaAreasInicial] = useState([]);
  const [ListaProcesosInicial, setListaProcesosInicial] = useState([]);
  const [ListaCategoriasRiesgo, setListaCategoriasRiesgo] = useState([]);

  const [relevanciaCausa, setRelevanciaCausa] = useState([]);
  const [causaN1, setCausaN1] = useState(null);
  const [causaN2, setCausaN2] = useState(null);
  const [causasN2, setCausasN2] = useState([]);
  const [ListaCausasN1, setListaCausasN1] = useState([]);
  const [ListaCausasN2, setListaCausasN2] = useState([]);

  const [ListaAreas, setListaAreas] = useState([]);
  const [ListaProcesos, setListaProcesos] = useState([]);

  const [ListaCatCorp1, setListaCatCorp1] = useState([]);
  const [ListaCatCorp3, setListaCatCorp3] = useState([]);
  const [ListaCatLocal1, setListaCatLocal1] = useState([]);
  const [ListaCatLocal3, setListaCatLocal3] = useState([]);

  const [showModalCausas, setShowModalCausas] = useState(false);
  const [showEditCausas, setShowEditCausas] = useState(false);
  const [causaSelected, setCausaSelected] = useState([]);
  const [dataCausas, setDataCausas] = useState([]);

  const [Region, setRegion] = useState(null);

  const [columns, setColumns] = useState([]);

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

  useEffect(() => {
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

        let nombreCompañia = companias.filter(
          (compania) => compania.value == dataUsuario.idcompania
        );

        let idEvento =
          "EM-" +
          nombreCompañia[0].label +
          "-" +
          dataUsuario.email.split("@")[0] +
          "-" +
          Date.now().toString().slice(-7);

        setIdEventoMaterializado(idEvento.replaceAll(' ','_'));
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

        const responseRelevancia = await axios.get(
          process.env.REACT_APP_API_URL + "/generales/Causa_del_evento/",
          {
            headers: {
              Authorization: "Bearer " + serviceAAD.getToken(),
            },
          }
        );

        let causas = response.data.map(
          ({
            idcausa: value,
            nombre: label,
            nivel,
            padre,
            causa_n1,
            causa_n2,
            causa_n3,
            estado,
          }) => ({
            value,
            label,
            nivel,
            padre,
            causa_n1,
            causa_n2,
            causa_n3,
            estado,
          })
        );

        let relevancia = responseRelevancia.data.map(
          ({ idm_parametrosgenerales: value, valor: label }) => ({
            value,
            label,
          })
        );

        let causasN1 = causas.filter(function (causa) {
          return causa.nivel == 1;
        });

        let causasN2 = causas.filter(function (causa) {
          return causa.nivel == 2;
        });

        let valuesN1 = Object.values(causasN1);

        let temp1 = [];

        valuesN1.map(function (causa) {
          temp1.push(Object.values(causa)[0]);
        });

        setListaCausasN1(causasN1);
        setListaCausasN2(causasN2);
        setRelevanciaCausa(relevancia);
      } catch (error) {
        console.error(error);
      }
    }

    getCausas();
    getCompanias();
    getAreas();
    getProcesos();
    getCategoriasRiesgo();
  }, []);

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

  const onSubmitEfectosFinancieros = (data) => {
    console.log("Datos recpilados:", data);

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

    console.log("JSON a enviar:", datosEnviar);

    try {
      console.log("ENVIAR POST");
      axios
        .post(process.env.REACT_APP_API_URL + "/evento_materializado/", datosEnviar, {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + serviceAAD.getToken(),
          },
        })
        .then(function (response) {
          console.log(
            "------------------response.status---------------",
            response.status
          );
          if (response.status >= 200 && response.status < 300) {
            //setEstadoPost(2);
            alert("Guardado con éxito");
            history.push({
              pathname: "/NuevoEfecto",
              state: {
                idEventoMaterializado: idEventoMaterializado,
              },
            });
          } else if (response.status >= 300 && response.status < 400) {
            setEstadoPost(4);
          } else if (response.status >= 400 && response.status < 512) {
            console.log("*******response****** ", response);
            setEstadoPost({
              id: 3,
              data: "Error: PRUEBA MENSAJE DE ERROR",
            });
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
      console.log("catch error", error);
      console.error(error);
    }
  };

  const onSubmit = (data) => {
    console.log("Datos del formulario:", data);

    var datosEnviar = {
      cambio_transformacion: data.asociadoCambio
        ? data.asociadoCambio.label
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
        ? data.fechaDescubrimiento
        : null,

      primera_fecha_del_evento: data.fechaInicial ? data.fechaInicial : null,

      ultima_fecha_del_evento: data.fechaFinal ? data.fechaFinal : null,

      afecto_consumidor_financiero: data.afectoConsumidor.label
        ? data.afectoConsumidor.label
        : null,

      estado_del_evento: "Abierto",

      evento_anulado: "No",

      informacion_adicional: data.infoAdicional ? data.infoAdicional : null,

      idmacroevento: data.idMacroevento ? data.idMacroevento : null,

      evento_reputacional: data.eventoReputacional
        ? data.eventoReputacional.label
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

      causas_del_evento: dataCausas,
    };

    console.log("JSON a enviar:", datosEnviar);

    try {
      console.log("guardar evento****");
      axios
        .post(process.env.REACT_APP_API_URL + "/evento_materializado/", datosEnviar, {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + serviceAAD.getToken(),
          },
        })
        .then(function (response) {
          console.log("response.data:::::", response.data);
          if (response.status >= 200 && response.status < 300) {
            setEstadoPost(2);

            setTimeout(
              history.push({
                pathname: "/EditarEvento",
                state: { idEventoMaterializado: idEventoMaterializado },
              }),
              3000
            );
          } else if (response.status >= 300 && response.status < 400) {
            setEstadoPost(4);
          } else if (response.status >= 400 && response.status < 512) {
            setEstadoPost(5);
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

  const onError = (errors, e) => console.log(errors);

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

    const idcompania = objCompania.value;

    const region = objCompania.pais;

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
  };

  const isSelected = (name) => selected.indexOf(name) !== -1;

  const EliminarRiesgo = () => {
    if (selected.length > 0) {
      setDataR([]);

      setValue("idRiesgo", "");

      setShowDisplayR(false);
    }
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

    console.log(tempListaCatCorp3);
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

    console.log(tempListaCatLocal3);
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

  const isSelectedCausas = (name) => causaSelected.indexOf(name) !== -1;

  return (
    <>
      <AlertDismissibleExample alerta={estadoPost} />

      <Container>
        <FormProvider {...methods}>
          {/* <-------------------------------------Titulo-------------------------------------> */}
          <Row className="mb-3 mt-3">
            <Col md={8}>
              <h1 className="titulo">Evento: {idEventoMaterializado}</h1>
            </Col>
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

          {/* <----------------------------------------Modal riesgos asociados al evento---------------------------------------> */}

          <ModalRiesgo
            showModalR={showModalR}
            setShowModalR={setShowModalR}
            dataR={dataR}
            setDataR={setDataR}
            setShowDisplayR={setShowDisplayR}
            setValue={setValue}
            getValues={getValues}
          ></ModalRiesgo>

          <ModalEfectos
            showModalEfectos={showModalEfectos}
            setShowModalEfectos={setShowModalEfectos}
            dataEfectos={dataEfectos}
            setDataEfectos={setDataEfectos}
            setShowDisplayEfectos={setShowDisplayEfectos}
          ></ModalEfectos>

          {/* <-----------------------------------------------------------------------------------------------------------> */}
          <hr />
          <br />
          {/* <--------------------------------------------------Información general---------------------------------------> */}

          <Row className="mb-4">
            <Col sm={3} xs={4}>
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
              <Col sm={1} xs={4}>
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
                        <StyledTableCell>Id Riesgo</StyledTableCell>
                        <StyledTableCell align="left">
                          Tipo de Elemento
                        </StyledTableCell>
                        <StyledTableCell align="left">
                          Elemento Principal
                        </StyledTableCell>
                        <StyledTableCell align="left">Nombre</StyledTableCell>
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
                                {row.idriesgo !== null ? row.idriesgo : null}
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
              <label className="forn-label label">Compañía que reporta*</label>
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
                    placeholder="Seleccione la compañia que reporta"
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
              <label className="forn-label label">Área de ocurrencia*</label>
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
                  required: "Te faltó completar este campo",
                }}
              />
              <p>{errors.areaOcurrencia?.message}</p>
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
              <p>{errors.tipoFalla?.message}</p>
            </Col>

            <Col sm={2} xs={12}>
              <label className="forn-label label">
                Afectó consumidor financiero*
              </label>
            </Col>

            <Col sm={4} xs={12}>
              <Controller
                control={control}
                name="afectoConsumidor"
                render={({ field: { onChange, value } }) => (
                  <>
                    <Select
                      components={animatedComponents}
                      options={[
                        { value: "Si", label: "Si" },
                        { value: "Ni", label: "No" },
                      ]}
                      onChange={onChange}
                      value={value}
                      placeholder="Afectó consumidor financiero"
                    />
                  </>
                )}
                rules={{
                  required: "Te faltó completar este campo",
                }}
              />
              <p>{errors.afectoConsumidor?.message}</p>
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
              <label className="forn-label label">Efecto reputacional</label>
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
              <label className="forn-label label">Fecha inicial :</label>
            </Col>

            <Col sm={2} xs={12}>
              <FormInputDate
                control={control}
                name="fechaInicial"
                label="FechaInicial"
              />
              <p>{errors.fechaInicial?.message}</p>
            </Col>

            <Col sm={2} xs={12}>
              <label className="forn-label label">Fecha final :</label>
            </Col>

            <Col sm={2} xs={12}>
              <FormInputDate
                control={control}
                name="fechaFinal"
                label="FechaFinal"
              />
              <p>{errors.fechaFinal?.message}</p>
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
              <p>{errors.fechaDescubrimiento?.message}</p>
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
                  required: "Te faltó completar este campo",
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
                  required: "Te faltó completar este campo",
                }}
              />
              <p>{errors.categoriaCorp3?.message}</p>
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
                {...register("DescCategoriaCorp", {
                  required: "Te faltó completar este campo",
                })}
              />
              <p>{errors.DescCategoriaCorp?.message}</p>
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
              />
            </Col>
          </Row>

          <Row className="mb-4">
            <Col sm={2} xs={12}>
              <label className="forn-label label">Descripción local</label>
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
          {/* 
          <Row className="mb-4">
            <Col sm={2} xs={12}>
              <label className="forn-label label">ID macro-evento:</label>
            </Col>

            <Col sm={4} xs={12}>
              <input
                disabled
                type="text"
                className="form-control text-center texto"
                placeholder="Nuevo Estado del evento"
                {...register("idMacroevento")}
              />
            </Col>
          </Row> */}

          <Row className="mb-4">
            <Col sm={2} xs={12}>
              <label className="forn-label label">Información adicional</label>
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
                  className="botonPositivo"
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
                      <StyledTableCell align="left">ID Causa</StyledTableCell>
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
                              handleClickCausas(event, row.id_causa_delevento)
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
                              {row.causa_anulada == 0 ? "Activa" : "Inactiva"}
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
          <hr />

          {/* <------------------------------------- Efectos financieros​-------------------------------------> */}

          <Row className="mb-4">
            <Col sm={4} xs={4}>
              <label className="forn-label label">
                Efectos financieros asociados al evento
              </label>
            </Col>

            <Col sm={2} xs={4}>
              <button
                type="button"
                variant={"contained"}
                className="btn botonPositivo"
                onClick={handleSubmit(onSubmitEfectosFinancieros, onError)}
              >
                Crear efecto
              </button>
            </Col>

            <Col sm={2} xs={4}>
              <button type="button" className="btn botonNegativo">
                Eliminar
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
                    {dataEfectos
                      .slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage
                      )
                      .map((row, index) => {
                        const isItemSelected = isSelected(row.idriesgo);
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
                              {row.efecto_anulado != 0 ? "Activa" : "Inactiva"}
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
          <hr />

          <Row className="mb-3 mt-3">
            <Col md={8}>
              <h1 className="titulo">Evento: {idEventoMaterializado}</h1>
            </Col>
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
        </FormProvider>
      </Container>
    </>
  );
}
