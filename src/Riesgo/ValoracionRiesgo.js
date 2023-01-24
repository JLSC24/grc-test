import React, { useState, useEffect, Children } from "react";
import ModalEfectosPropios from "./ModalesNewRiesgos/ModalEfectosPropios";
import ModalEfectosDesencadenados from "./ModalesNewRiesgos/ModalEfectosDesencadenados";
import ModalEfectosRecibidos from "./ModalesNewRiesgos/ModalEfectosRecibidos";
import ResumenDeEfectos from "./ResumenValoracion.js";
import ResumenCalculo from "./ResumenCalculo";
import ModalAlerta from "../Globales/ModalAlerta";
import {
  Row,
  Col,
  Form,
  Alert,
  Navbar,
  Container,
  Nav,
  Button,
  Modal,
} from "react-bootstrap";
import Switch from "@material-ui/core/Switch";
import { Link, useHistory } from "react-router-dom";
import Select from "react-select";
import makeAnimated from "react-select/animated";

import Table from "@material-ui/core/Table";
import Paper from "@material-ui/core/Paper";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableBody from "@material-ui/core/TableBody";
import TablePagination from "@material-ui/core/TablePagination";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import TableCell from "@material-ui/core/TableCell";
import Checkbox from "@material-ui/core/Checkbox";
import TableRow from "@material-ui/core/TableRow";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import { Box } from "@material-ui/core";
import Loader from "react-loader-spinner";
import PropTypes from "prop-types";
import { AiFillDelete, AiFillCaretDown } from "react-icons/ai";
import { MdAddCircleOutline } from "react-icons/md";
import axios from "axios";
import AADService from "../auth/authFunctions";
//import { CausaControlContext } from "../contexts/CausaControlContext";

import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControl from "@mui/material/FormControl";

import { ModalEliminarEfecto } from "./ModalesNewRiesgos/ModalEliminarEfecto";
import ModalConfirmar from "../Components/ModalConfirmar";
import Queries from "../Components/QueriesAxios";

const _ = require("lodash");

const AlertDismissibleExample = ({ alerta }) => {
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

    case 6:
      return (
        <Alert variant="warning">
          Ya existe una evaluación para el activo seleccionado
        </Alert>
      );
    case 7:
      return (
        <Alert variant="warning">
          Corrige los siguientes errores: • Debe completar los campos
          obligatorios
        </Alert>
      );
    case 8:
      return (
        <Alert variant="warning">
          No se permite crear un riesgo con el mismo nombre
        </Alert>
      );
    default:
      return <p></p>;
  }
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
    width: "100%",
  },
  container: {
    maxHeight: "57vh",
    //minHeight: "57vh",
  },
  containerModal: {
    maxHeight: "50vh",
    //minHeight: "50vh",
  },
});

const useStylesModal = makeStyles({
  root: {
    width: "100%",
  },
  container: {
    maxHeight: "30vh",
    //minHeight: "57vh",
  },
  containerModal: {
    maxHeight: "30vh",
    //minHeight: "50vh",
  },
});
const animatedComponents = makeAnimated();
const defaultState = {
  id: "",
  descripcion: "",
  causaN1: "",
  causaN2: "",
  estado: true,
  porcentaje: "",
};

export default function EditarRiesgo(props) {
  const serviceAAD = new AADService();
  const [actualizar, setActualizar] = useState(false);

  const [enableButton, setEnableButton] = React.useState(true);
  //*Lista general de efectos, esta variable es la fuente de todas las tablas y modales
  const [listaGeneralEfectos, setListaGeneralEfectos] = useState([]);

  /* Datos para los modales */

  const [editarAsociacion_propios, setEditarAsociacion_propios] =
    useState(false);
  const [editarAsociacion_desencadenados, setEditarAsociacion_desencadenados] =
    useState(false);
  const [editarAsociacion_recibidos, setEditarAsociacion_recibidos] =
    useState(false);
  const [dataEfectos, setDataEfectos] = useState([]);
  const [dataRiesgos, setDataRiesgos] = useState([]);
  const [rxRiesgosEfectos, setRxRiesgosEfectos] = useState([]);
  const [modalEfectosPropiosShow, setModalEfectosPropiosShow] = useState(false);

  const [modalEfectosDesencadenadosShow, setModalEfectosDesencadenadosShow] =
    useState(false);

  const [modalEfectosRecibidosShow, setModalEfectosRecibidosShow] =
    useState(false);

  const [modalEditarEfectosPropiosShow, setModalEditarEfectosPropiosShow] =
    useState(false);
  const [
    modalEditarEfectosDesencadenadosShow,
    setModalEditarEfectosDesencadenadosShow,
  ] = useState(false);

  const [modalEditarEfectosRecibidosShow, setModalEditarEfectosREcibidosShow] =
    useState(false);
  /* Datos para editar efectos propios */
  const [selected_propios, setSelected_propios] = React.useState([]);
  const [selectedRiesgosEfecto_propios, setSelectedRiesgosEfecto_propios] =
    useState([]);

  /* Datos para editar efectos desencadenados */
  const [selected_desencadenados, setSelected_desencadenados] = React.useState(
    []
  );
  const [
    selectedRiesgosEfecto_desencadenados,
    setSelectedRiesgosEfecto_desencadenados,
  ] = useState([]);

  /* Datos para editar efectos recibidos */
  const [selected_recibidos, setSelected_recibidos] = React.useState([]);
  const [selectedRiesgosEfecto_recibidos, setSelectedRiesgosEfecto_recibidos] =
    useState([]);
  //* Reciben los datos para llenar cada uno de los Select

  const [companias, setCompanias] = useState([]);

  //const [listaProveedor, setListaProveedor] = useState(["sin informacion"]);
  //const [listaProyecto, setListaProyecto] = useState(["sin informacion"]);

  const [estados, setEstados] = useState([]);

  // const [contratoSelec, setContratoSelec] = useState([]);
  // const [contratoOtros, setContratoOtros] = useState([]);
  // const [listaProveedores, setListaProveedores] = useState([]);
  // const [Proveedor, setProveedor] = useState([]);

  //* Reciben los datos filtrados

  //* Reciben los datos ingresados/elegidos por el usuario
  const [rows, setRows] = useState([defaultState]);
  const [rowsAll, setRowsAll] = useState();

  const [idRiesgo, setIdRiesgo] = useState(null);
  const [estadoRiesgo, setEstadoRiesgo] = useState(null);
  const [compania, setCompania] = useState(null);
  const [idcompania, setIdCompania] = useState(null);
  const [obj_compania, setObj_compania] = useState(null);

  //* Variables relacionadas con el resumen del calculo (DetalleRO)
  const [exposicionIn, setExposicionIn] = useState(null);
  const [efectividadCtrl, setEfectividadCtrl] = useState(null);
  const [exposicionResidual, setExposicionResidual] = useState(null);
  const [nivelRiesgoInherente, setNivelRiesgoInherente] = useState(null);
  const [nivelRiesgoResidual, setNivelRiesgoResidual] = useState(null);
  const [par, setPar] = useState(null);

  //* Variables relacionadas con el resumen de la valoracion (Efectos)
  const [resumenValoracion, setResumenValoracion] = useState(null);
  const [loadingData, setLoadingData] = React.useState(true);
  const [loadingDataCausas, setLoadingDataCausas] = React.useState(true);

  const history = useHistory();

  //* Controla comportamiento de la vista

  const [isCheckedRO, setIsCheckedRO] = useState(false);
  const [Calculado, setCalculado] = useState(false);

  const [checkedStateImpacto, setCheckedStateImpacto] = useState(false);
  const [checkedStateComprometeLicencia, setCheckedStateComprometeLicencia] =
    useState(false);
  const [validated, setValidated] = useState(false);
  const [estadoPost, setEstadoPost] = useState({
    alerta: { id: 0, data: null },
  });
  const [showAlerta, setShowAlerta] = useState(false);
  const [textAlerta, setTextAlerta] = useState(null);
  const [loadingResumen, setLoadingResumen] = useState(false);

  const classes = useStylesModal();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  //* Variables involucradas en el modal de confimación de desasociar efectos
  const [openModal, setOpenModal] = React.useState(false);
  const [tipoDeEfecto, setTipoDeEfecto] = React.useState(null);

  const [confirm, setConfirm] = React.useState(false);
  const [dataEnviada, setDataEnviada] = React.useState(null);
  const [showConfirmar, setShowConfirmar] = React.useState(false);
  const [cargado, setCargado] = React.useState(false);

  const setIneherentes = async (valoracion) => {
    let aux = valoracion.p95_total;
    let aux_2 = valoracion.nivel_riesgo_inherente;
    setExposicionIn(aux);
    setNivelRiesgoInherente(aux_2);
  };

  useEffect(async () => {
    let companias;
    let riesgo;
    let resumenRiesgo;
    let detalleRO;
    let listaEfectos;
    let listaRiesgos;
    let rx_riesgo_efectos;
    let existeDetalleRO;

    const listadoEstados = [
      { value: 1, label: "Activo" },
      { value: 0, label: "Inactivo" },
    ];

    setEstados(listadoEstados);

    //*Recibe los datos de la compania ////////////////////////
    const getCompanias = async () => {
      setLoadingDataCausas(true);
      try {
        const response_compania = await axios.get(
          process.env.REACT_APP_API_URL + "/maestros_ro/compania/",
          {
            headers: {
              Authorization: "Bearer " + serviceAAD.getToken(),
            },
          }
        );
        companias = await response_compania.data.map(
          ({ idcompania: value, compania: label, pais }) => ({
            value,
            label,
            pais,
          })
        );
        setCompanias(companias);
      } catch (error) {
        console.error(error);
      }
    };

    const getRiesgo = async () => {
      setLoadingDataCausas(true);
      try {
        const response_riesgo = await axios.get(
          process.env.REACT_APP_API_URL + "/GuardarEfectividad/" +
            localStorage.getItem("idRiesgo") +
            "/",
          {
            headers: {
              Authorization: "Bearer " + serviceAAD.getToken(),
            },
          }
        );
        riesgo = await response_riesgo.data;
        setIdRiesgo(riesgo.idriesgo);
        setIdCompania(riesgo.idcompania);
      } catch (error) {
        console.error(error);
      }
    };

    const getResumenRiesgo = async () => {
      setLoadingDataCausas(true);
      try {
        const response_resumen_riesgo = await axios.get(
          process.env.REACT_APP_API_URL + "/resumen_valoracion/" +
            localStorage.getItem("idRiesgo") +
            "/",
          {
            headers: {
              Authorization: "Bearer " + serviceAAD.getToken(),
            },
          }
        );
        resumenRiesgo = await response_resumen_riesgo.data;
        setExposicionIn(resumenRiesgo.p95_total);
        if (resumenRiesgo.compromete_licencia === 1) {
          setCheckedStateComprometeLicencia(true);
        } else {
          setCheckedStateComprometeLicencia(false);
        }
        setExposicionIn(resumenRiesgo.p95_total ? resumenRiesgo.p95_total : 0);
        if (resumenRiesgo.riesgo_mitigado === 1) {
          setCheckedStateImpacto(true);
        } else {
          setCheckedStateImpacto(false);
        }
      } catch (error) {
        console.error(error);
      }
      setLoadingDataCausas(false);
    };

    const getDetalleRO = async () => {
      setLoadingDataCausas(true);
      const verificaDetalleRO = (aristasDelRiesgo) => {
        if (aristasDelRiesgo) {
          let aristas = aristasDelRiesgo.split(",");
          let isRO = false;
          aristas.map((e) => {
            if (e === "RO") {
              isRO = true;
            }
          });
          return isRO;
        }
      };
      existeDetalleRO = verificaDetalleRO(riesgo.arista_del_riesgo);
      setIsCheckedRO(existeDetalleRO);
      try {
        if (existeDetalleRO === true) {
          const response_DetalleRO = await axios.get(
            process.env.REACT_APP_API_URL + "/rx_detalle_ro/" + riesgo.idriesgo + "/",
            {
              headers: {
                Authorization: "Bearer " + serviceAAD.getToken(),
              },
            }
          );
          detalleRO = await response_DetalleRO.data;
          setNivelRiesgoInherente(
            detalleRO.nivel_riesgo_inherente
              ? detalleRO.nivel_riesgo_inherente
              : "Tolerable"
          );
          setNivelRiesgoResidual(detalleRO.nivel_riesgo_residual);
          setExposicionResidual(detalleRO.exposicion_residual);
          getPar(riesgo.idcompania);
        }
      } catch (error) {
        console.error(error);
      }
    };

    async function getEfectos() {
      try {
        const response = await axios.get(process.env.REACT_APP_API_URL + "/efectos", {
          headers: {
            Authorization: "Bearer " + serviceAAD.getToken(),
          },
        });
        listaEfectos = response.data;
        listaEfectos.map((efecto) => (efecto.estado_enVista = "Buscado"));
        setListaGeneralEfectos(listaEfectos);
        setDataEfectos(listaEfectos);
      } catch (error) {
        console.error(error);
      }
    }
    if (!actualizar) {
      getEfectos();
    }
    async function getRiesgos() {
      try {
        const response = await axios.get(process.env.REACT_APP_API_URL + "/riesgos", {
          headers: {
            Authorization: "Bearer " + serviceAAD.getToken(),
          },
        });
        listaRiesgos = response.data;
        setDataRiesgos(listaRiesgos);
      } catch (error) {
        console.error(error);
      }
    }
    if (!actualizar) {
      getRiesgos();
    }
    async function getRx_riesgo_efecto() {
      try {
        const response = await axios.get(
          process.env.REACT_APP_API_URL + "/rx_riesgo_efecto/" + riesgo.idriesgo + "/",
          {
            headers: {
              Authorization: "Bearer " + serviceAAD.getToken(),
            },
          }
        );
        rx_riesgo_efectos = response.data;

        setRxRiesgosEfectos(rx_riesgo_efectos);
      } catch (error) {
        console.error(error);
      }
    }

    const cargaRiesgo = async () => {
      await getCompanias();
      await getRiesgo();
      await getDetalleRO();
      //await getEfectos();
      await getRx_riesgo_efecto();
      await getResumenRiesgo();

      //** filtra efectos para evitar registros repetidos */
      const filtraEfectos = (listaGeneral, nuevaLista, tipoNuevaLista) => {
        //** Toma como propiedades 1. la lista general o consolidada de todos los efectos: Activos + Inactivos +Agregados + Buscados 2.La nueva lista de efectos que se agregará: efectos Activos, efectos Escaneados, efectos Buscados

        //* Devuelve el efecto de mayor prelación Activo||Inactivo > Sugerido > Buscado --- Es invocado mas adelante
        const comparaefectos = (efectoAntiguo, efectoNuevo) => {
          if (
            efectoAntiguo.estado_enVista === "Activo" ||
            efectoAntiguo.estado_enVista === "Inactivo"
          ) {
            return efectoAntiguo;
          } else if (
            efectoNuevo.estado_enVista === "Activo" ||
            efectoNuevo.estado_enVista === "Inactivo"
          ) {
            return efectoNuevo;
          } else if (efectoAntiguo.estado_enVista === "Agregado") {
            return efectoAntiguo;
          } else if (efectoNuevo.estado_enVista === "Agregado") {
            return efectoNuevo;
          } else if (efectoAntiguo.estado_enVista === "Buscado") {
            return efectoAntiguo;
          } else if (efectoNuevo.estado_enVista === "Buscado") {
            return efectoNuevo;
          }
        };

        let consolidadoEfectos;

        //* funcion principal: Compara la listaGeneral de efectos y la NuevaLista de efectos, obtiene los repetidos y prevalece el mas importante (ver función comparaefectos)...
        //* ... Luego obtiene los efectos que no se repiten de cada lista, y une todos los efectos en Consolidado Efectos
        //* ... consolidado efectos se mostrará en cada tabla respectivamente según su propiedad "estado_enVista"
        let arr = [];
        let res;
        nuevaLista.map((efectoNuevo) => {
          //* devuelve el indice del riesgo repetido, de lo contrario devuelve -1
          res = _.findIndex(
            listaGeneral,
            (e) => {
              return e.idefecto == efectoNuevo.idefecto;
            },
            0
          );

          //*
          if (res !== -1) {
            var efectoAntiguo = listaGeneral.filter(
              (e) => e.idefecto === efectoNuevo.idefecto
            )[0];
            let aux = comparaefectos(efectoAntiguo, efectoNuevo);
            arr.push(aux);
          }
        });

        //* Obtienen los efectos únicos de cada array de efectos
        let dif1 = _.differenceBy(nuevaLista, listaGeneral, "idefecto");
        let dif2 = _.differenceBy(listaGeneral, nuevaLista, "idefecto");

        let efectosUnicos = _.concat(dif1, dif2);
        consolidadoEfectos = _.concat(efectosUnicos, arr);

        consolidadoEfectos.sort(function (a, b) {
          if (a.idefecto > b.idefecto) {
            return 1;
          }
          if (a.idefecto < b.idefecto) {
            return -1;
          }
          // a must be equal to b
          return 0;
        });

        return consolidadoEfectos;
      };

      //** Cambia estado de Efectos */

      const completarTabla2 = (nuevosEfectos) => {
        //* Agrega las propiedades de los efectos seleccionados y actualiza su estado segun nuevoEstado
        let aux = [];
        let nuevaLista = [];

        nuevosEfectos.map((a) => {
          if (a.estado === 1) {
            let efectoCompleto = listaEfectos.filter(
              (e) => e.idefecto === a.idefecto
            )[0];

            efectoCompleto.estado_enVista = "Activo";
            efectoCompleto.tipoEfecto = a.tipo_relacion;
            aux.push(efectoCompleto);
          }
          if (a.estado === 0) {
            let efectoCompleto = listaEfectos.filter(
              (e) => e.idefecto === a.idefecto
            )[0];

            efectoCompleto.estado_enVista = "Inactivo";
            efectoCompleto.tipoEfecto = a.tipo_relacion;
            aux.push(efectoCompleto);
          }
        });

        const efectosRepetidos = _.countBy(rx_riesgo_efectos, "idefecto");

        Object.entries(efectosRepetidos).map((item) => {
          let idEfecto = Number(item[0]);

          let vecesRepetido = item[1];

          let tipoRelacion;
          let efectoCompleto = [];

          if (vecesRepetido > 1) {
            let idsRiesgos = "";
            let riesgo_relacionado = "";

            _.forEach(
              nuevosEfectos.filter((e) => e.idefecto === idEfecto),
              function (value) {
                tipoRelacion = value.tipo_relacion;
                if (tipoRelacion === "Desencadenado") {
                  idsRiesgos += value.id_desencadenado_en + ",";
                  riesgo_relacionado += value.desencadenado_en + ",";
                }
                if (tipoRelacion === "Recibido") {
                  idsRiesgos += value.id_recibido_de + ",";
                  riesgo_relacionado += value.recibido_de + ",";
                }
              }
            );

            let efectoCompleto = listaEfectos.filter(
              (e) => e.idefecto === idEfecto
            )[0];

            efectoCompleto.riesgos_asociados = riesgo_relacionado;
            efectoCompleto.id_riesgos_asociados = idsRiesgos;

            nuevaLista.push(efectoCompleto);
          }
          if (vecesRepetido === 1) {
            efectoCompleto = aux.filter((e) => e.idefecto === idEfecto)[0];
            nuevaLista.push(efectoCompleto);
          }
        });

        let efectos_filtrados = filtraEfectos(listaEfectos, nuevaLista);

        setListaGeneralEfectos(efectos_filtrados);
      };

      //completarTabla(rx_riesgo_efectos, "Activo");

      try {
        //* Filtra maestros según la compañía del riesgo a Editar ////////
        const checkCompania = (compania) => {
          return compania.label === riesgo.compania;
        };

        const compRiesgoEditar = companias.filter(checkCompania);
        const valueCompania = compRiesgoEditar[0].value;
        setCompania(compRiesgoEditar[0]);
        setIdCompania(compRiesgoEditar[0]);

        function convierteCompaniafilter(companiaRiesgo, listadoCompanias) {
          return listadoCompanias.filter((compania) => {
            if (compania.label === companiaRiesgo) {
              return {
                value: compania.value,
                label: compania.label,
              };
            }
          });
        }

        function convierteCompania(companiaRiesgo, listadoCompanias) {
          return listadoCompanias.map((compania) => {
            if (compania.label === companiaRiesgo) {
              return {
                value: compania.value,
                label: compania.label,
              };
            }
          });
        }

        setCompania(convierteCompania(riesgo.compania, companias));
        setIdCompania(riesgo.idcompania);
        setObj_compania(riesgo.idcompania);
        setIdRiesgo(riesgo.idriesgo);
        setEfectividadCtrl(riesgo.efectividad_control);

        if (resumenRiesgo) {
          setResumenValoracion(resumenRiesgo);
        }

        if (rx_riesgo_efectos && listaEfectos) {
          completarTabla2(rx_riesgo_efectos);
        }
        if (existeDetalleRO === false) {
          setLoadingData(false);
        }
        if (!actualizar) {
          setActualizar([true]);
        }
        return null;
      } catch (error) {
        console.error(error);
      }
      setLoadingDataCausas(false);
    };

    if (!cargado) {
      cargaRiesgo();
      setCargado(true);
    }
    if (confirm) {
      sendData();
      setConfirm(false);
    }
  }, [actualizar, confirm]);

  const headCells_AsociaActivas = [
    {
      id: "ID_Causa_N2",
      num: "0",
      align: "left",
      disablePadding: false,
      label: "ID Causa N2",
    },
    {
      id: "causa_N1",
      num: "1",
      align: "center",
      col: 3,
      disablePadding: false,
      label: "Causa N1",
    },
    {
      id: "nombre_Causa",
      num: "2",
      align: "center",
      disablePadding: true,
      label: "Nombre Estandar Causa",
    },
    {
      id: "descripcion_causa",
      num: "3",
      align: "center",
      disablePadding: true,
      label: "Descripción específica causa",
    },
    {
      id: "participacion_causa",
      num: "3",
      align: "center",
      disablePadding: true,
      label: "Participación en el riesgo",
    },
    {
      id: "participacion_causa",
      num: "3",
      align: "center",
      disablePadding: true,
      label: "Participación en el riesgo",
    },
    {
      id: "estado_causa",
      num: "3",
      align: "center",
      disablePadding: true,
      label: "Estado",
    },
  ];

  function EnhancedTableHead(props) {
    const { classes } = props;
    return (
      <TableHead>
        <TableRow>
          <TableCell style={{ backgroundColor: "#2c2a29", color: "#ffffff" }} />
          {headCells_AsociaActivas.map((headCell) => (
            <TableCell
              key={headCell.id}
              align={headCell.align}
              padding={headCell.disablePadding ? "none" : "default"}
              style={{ backgroundColor: "#2c2a29", color: "#ffffff" }}
              colSpan={headCell.col ? headCell.col : 1}
            >
              <label className="label" style={{ marginRight: "20%" }}>
                {headCell.label}
              </label>
            </TableCell>
          ))}
        </TableRow>
      </TableHead>
    );
  }
  function Item(props) {
    const { sx, ...other } = props;
    return (
      <Box
        sx={{
          textAlign: "center",
          m: 2,
          ...sx,
        }}
        {...other}
      />
    );
  }

  Item.propTypes = {
    sx: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
  };
  EnhancedTableHead.propTypes = {
    classes: PropTypes.object.isRequired,
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
      return -1;
    }
    if (b[orderBy] > a[orderBy]) {
      return 1;
    }
    return 0;
  }

  function getComparator(order, orderBy) {
    return order === "desc"
      ? (a, b) => descendingComparator(a, b, orderBy)
      : (a, b) => -descendingComparator(a, b, orderBy);
  }
  const filtraCategoria_XPais = (categorias, compania) => {
    let categoriasFiltradas = [];
    if (compania.pais === "Colombia") {
      categorias.map((categoria) => {
        if (categoria.atributo === "Local - COL") {
          categoriasFiltradas.push(categoria);
        }
        return null;
      });
    } else if (compania.pais === "Panamá") {
      categorias.map((categoria) => {
        if (categoria.atributo === "Local -PAN") {
          categoriasFiltradas.push(categoria);
        }
        return null;
      });
    } else if (compania.pais === "Guatemala") {
      categorias.map((categoria) => {
        if (categoria.atributo === "Local - GTM") {
          categoriasFiltradas.push(categoria);
        }
        return null;
      });
    } else if (compania.pais === "General") {
      categorias.map((categoria) => {
        categoriasFiltradas.push(categoria);
        return null;
      });
    }
    return categoriasFiltradas;
  };

  const isSelected_propios = (name) => selected_propios.indexOf(name) !== -1;
  const isSelected_desencadenados = (name) =>
    selected_desencadenados.indexOf(name) !== -1;
  const isSelected_recibidos = (name) =>
    selected_recibidos.indexOf(name) !== -1;

  const handleClick = (event, name, efecto, tipo_efecto) => {
    if (tipo_efecto === "propio") {
      const selectedIndex = selected_propios.indexOf(name);
      let newSelected = [];
      setSelectedRiesgosEfecto_propios(efecto.idefecto);

      if (selectedIndex === -1) {
        setEditarAsociacion_propios(true);
        newSelected = newSelected.concat([], name);
      } else {
        setEditarAsociacion_propios(false);
      }
      setSelected_propios(newSelected);
    } else if (tipo_efecto === "desencadenado") {
      const selectedIndex = selected_desencadenados.indexOf(name);
      let newSelected = [];
      setSelectedRiesgosEfecto_desencadenados(efecto.idefecto);

      if (selectedIndex === -1) {
        setEditarAsociacion_desencadenados(true);
        newSelected = newSelected.concat([], name);
      } else {
        setEditarAsociacion_desencadenados(false);
      }
      setSelected_desencadenados(newSelected);
    } else if (tipo_efecto === "recibido") {
      const selectedIndex = selected_recibidos.indexOf(name);
      let newSelected = [];
      setSelectedRiesgosEfecto_recibidos(efecto.idefecto);
      if (selectedIndex === -1) {
        setEditarAsociacion_recibidos(true);
        newSelected = newSelected.concat([], name);
      } else {
        setEditarAsociacion_recibidos(false);
      }
      setSelected_recibidos(newSelected);
    }
  };

  const muestraEfectosXTabla = (consolidadoEfectos, tabla) => {
    let efectosXmostrar = [];
    consolidadoEfectos.map((efecto) => {
      if (
        (efecto.estado_enVista === "Activo" ||
          efecto.estado_enVista === "Agregado") &&
        efecto.tipoEfecto === "Propio" &&
        tabla === "Tabla_Propios"
      ) {
        efectosXmostrar.push(efecto);
      } else if (
        (efecto.estado_enVista === "Activo" ||
          efecto.estado_enVista === "Agregado") &&
        efecto.tipoEfecto === "Desencadenado" &&
        tabla === "Tabla_Desencadenados"
      ) {
        efectosXmostrar.push(efecto);
      } else if (
        (efecto.estado_enVista === "Activo" ||
          efecto.estado_enVista === "Agregado") &&
        efecto.tipoEfecto === "Recibido" &&
        tabla === "Tabla_Recibidos"
      ) {
        efectosXmostrar.push(efecto);
      } else if (efecto.estado_enVista === "Buscado" && tabla === "Modal") {
        efectosXmostrar.push(efecto);
      } else if (
        efecto.estado_enVista === "Inactivos" &&
        tabla === "Inactivos"
      ) {
        efectosXmostrar.push(efecto);
      }
    });
    return efectosXmostrar;
  };

  const filtraEfectos = (listaGeneral, nuevaLista, tipoNuevaLista) => {
    //** Toma como propiedades 1. la lista general o consolidada de todos los efectos: Activos + Inactivos +Agregados + Buscados 2.La nueva lista de efectos que se agregará: efectos Activos, efectos Escaneados, efectos Buscados

    //* Devuelve el efecto de mayor prelación Activo||Inactivo > Sugerido > Buscado --- Es invocado mas adelante
    const comparaefectos = (efectoAntiguo, efectoNuevo) => {
      if (
        efectoAntiguo.estado_enVista === "Activo" ||
        efectoAntiguo.estado_enVista === "Inactivo"
      ) {
        return efectoAntiguo;
      } else if (
        efectoNuevo.estado_enVista === "Activo" ||
        efectoNuevo.estado_enVista === "Inactivo"
      ) {
        return efectoNuevo;
      } else if (efectoAntiguo.estado_enVista === "Agregado") {
        return efectoAntiguo;
      } else if (efectoNuevo.estado_enVista === "Agregado") {
        return efectoNuevo;
      } else if (efectoAntiguo.estado_enVista === "Buscado") {
        return efectoAntiguo;
      } else if (efectoNuevo.estado_enVista === "Buscado") {
        return efectoNuevo;
      }
    };

    let consolidadoEfectos;

    if (listaGeneral.length !== 0) {
      //* funcion principal: Compara la listaGeneral de efectos y la NuevaLista de efectos, obtiene los repetidos y prevalece el mas importante (ver función comparaefectos)...
      //* ... Luego obtiene los efectos que no se repiten de cada lista, y une todos los efectos en Consolidado Efectos
      //* ... consolidado efectos se mostrará en cada tabla respectivamente según su propiedad "estado_enVista"
      let arr = [];
      let res;
      nuevaLista.map((efectoNuevo) => {
        //* devuelve el indice del riesgo repetido, de lo contrario devuelve -1
        res = _.findIndex(
          listaGeneral,
          (e) => {
            return e.idefecto == efectoNuevo.idefecto;
          },
          0
        );

        //*
        if (res !== -1) {
          var efectoAntiguo = listaGeneral.filter(
            (e) => e.idefecto === efectoNuevo.idefecto
          )[0];
          let aux = comparaefectos(efectoAntiguo, efectoNuevo);
          arr.push(aux);
        }
      });

      //* Obtienen los efectos únicos de cada array de efectos
      let dif1 = _.differenceBy(nuevaLista, listaGeneral, "idefecto");
      let dif2 = _.differenceBy(listaGeneral, nuevaLista, "idefecto");

      let efectosUnicos = _.concat(dif1, dif2);
      consolidadoEfectos = _.concat(efectosUnicos, arr);

      consolidadoEfectos.sort(function (a, b) {
        if (a.idefecto > b.idefecto) {
          return 1;
        }
        if (a.idefecto < b.idefecto) {
          return -1;
        }
        // a must be equal to b
        return 0;
      });
    } else if (listaGeneral.length === 0) {
      consolidadoEfectos = nuevaLista;
    }

    return consolidadoEfectos;
  };

  //** Cambia estado de Efectos */

  const completarTabla = (efectos, nuevoEstado, tipoEfecto) => {
    //* Agrega las propiedades de los efectos seleccionados y actualiza su estado segun nuevoEstado

    let nuevaLista = [];
    efectos.map((a) => {
      let efectoCompleto = listaGeneralEfectos.filter(
        (e) => e.idefecto === a
      )[0];

      efectoCompleto.estado_enVista = nuevoEstado;
      efectoCompleto.tipoEfecto = tipoEfecto;
      nuevaLista.push(efectoCompleto);
    });
    let efectos_filtrados = filtraEfectos(listaGeneralEfectos, nuevaLista);
    setListaGeneralEfectos(efectos_filtrados);
  };

  //** Envía los datos al back */

  const perteneceDist = (data, unknown) => {
    let temp = false;
    data.map((dat) => {
      if (dat.idcontrol === unknown.idcontrol) {
        temp = true;
      }
      return null;
    });
    return temp;
  };
  const sendData = async (event) => {
    if (event) {
      event.preventDefault();
    }

    if (isCheckedRO === true && Calculado === true) {
      setLoadingResumen(true);

      let statusResume = await sendResumenValoracion(idRiesgo, 1);

      sendEfectos(idRiesgo);
      let detalleRiesgo = {
        id_riesgo: idRiesgo,
        valoracion: 1,
        nivel_riesgo_inherente: nivelRiesgoInherente,
        exposicion_residual: exposicionResidual,
        nivel_riesgo_residual: nivelRiesgoResidual,
      };
      JSON.stringify(detalleRiesgo);
      if (statusResume < 300) {
        axios
          .put(
            process.env.REACT_APP_API_URL + "/rx_detalle_ro/" + idRiesgo,
            detalleRiesgo,
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + serviceAAD.getToken(),
              },
            }
          )
          .then(function (respuesta) {
            // sendCausas(idRiesgo);
            localStorage.setItem("idRiesgo", idRiesgo);

            setEstadoPost(2);

            setTimeout(() => {
              history.push("/valoracionRiesgo");
              setEstadoPost(0);
            }, 2000);
          })
          .catch((error) => {
            console.error(error);
          });
      }
    } else if (isCheckedRO === true && Calculado === false) {
      setLoadingResumen(true);

      let result_calculo;
      result_calculo = await saveResumenValoracion(idRiesgo, 1);
      sendEfectos(idRiesgo);
      let detalleRiesgo = {
        id_riesgo: idRiesgo,
        valoracion: 1,
        nivel_riesgo_inherente: result_calculo.nivel_inherente,
        exposicion_residual: result_calculo.exp_residual,
        nivel_riesgo_residual: result_calculo.niv_residual,
      };
      JSON.stringify(detalleRiesgo);
      axios
        .put(process.env.REACT_APP_API_URL + "/rx_detalle_ro/" + idRiesgo, detalleRiesgo, {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + serviceAAD.getToken(),
          },
        })
        .then(function (respuesta) {
          // sendCausas(idRiesgo);
          localStorage.setItem("idRiesgo", idRiesgo);

          setEstadoPost(2);

          setTimeout(() => {
            history.push("/valoracionRiesgo");
            setEstadoPost(0);
          }, 2000);
        })
        .catch((error) => {
          console.error(error);
        });
    } else {
      sendResumenValoracion(idRiesgo, 1);
      sendEfectos(idRiesgo);
      // sendCausas(idRiesgo);
      localStorage.setItem("idRiesgo", idRiesgo);
      setEstadoPost(2);
      setTimeout(() => {
        history.push("/editarRiesgo");
        setEstadoPost(0);
      }, 2000);
    }
    setValidated(true);
    // }
  };
  const postData = async (data, url, fuente) => {
    try {
      const resp = await axios.post(process.env.REACT_APP_API_URL + "/" + url, data, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + serviceAAD.getToken(),
        },
      });
      return resp;
    } catch (error) {
      console.error(error.response);
    }
  };

  const putData = async (data, url, fuente) => {
    try {
      axios
        .put(process.env.REACT_APP_API_URL + "/" + url, data, {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + serviceAAD.getToken(),
          },
        })
        .then(function (response_rx_efecto) {
          console.warn("Envío exitoso desde " + fuente);
        });
    } catch (error) {
      console.error(error.response);
    }
  };

  const sendEfectos = (idRiesgo) => {
    let efectosPropios = listaGeneralEfectos.filter(
      (efecto) =>
        efecto.estado_enVista === "Agregado" && efecto.tipoEfecto === "Propio"
    );
    let efectosDesencadenados = listaGeneralEfectos.filter(
      (efecto) =>
        efecto.estado_enVista === "Agregado" &&
        efecto.tipoEfecto === "Desencadenado"
    );
    let efectosRecibidos = listaGeneralEfectos.filter(
      (efecto) =>
        efecto.estado_enVista === "Agregado" && efecto.tipoEfecto === "Recibido"
    );
    let lista_efectosPropios = [];
    let lista_efectosDesencadenados = [];
    let lista_efectosRecibidos = [];
    let resEfectosPropios = [];
    let resEfectosDesencadenados = [];
    let resEfectosRecibidos = [];

    if (efectosPropios.length > 0) {
      efectosPropios.map((data) => {
        lista_efectosPropios.push({
          idriesgo: idRiesgo,
          idefecto: data.idefecto,
          tipo_relacion: "Propio",
          estado: 1,
        });

        return null;
      });

      lista_efectosPropios.forEach((element) => {
        (async () => {
          var respuesta = await postData(
            element,
            "rx_riesgo_efecto",
            "efectos propios"
          );

          if (respuesta) {
            resEfectosPropios.push({
              efecto: respuesta.data.idefecto,
              Estado: respuesta.status,
            });
          } else {
            resEfectosPropios.push({
              efecto: element.idefecto,
              Estado: "Error",
            });
          }
        })();
      });
    }

    if (efectosDesencadenados.length > 0) {
      efectosDesencadenados.map((data) => {
        lista_efectosDesencadenados.push({
          idriesgo: idRiesgo,
          idefecto: data.idefecto,
          desencadenado_en: data.riesgos_asociados,
          id_desencadenado_en: data.id_riesgos_asociados,
          tipo_relacion: "Desencadenado",
          estado: 1,
        });

        return null;
      });

      lista_efectosDesencadenados.forEach((element) => {
        (async () => {
          var respuesta = await postData(
            element,
            "rx_riesgo_efecto",
            "efectos desencadenados"
          );

          if (respuesta) {
            resEfectosDesencadenados.push({
              efecto: respuesta.data.idefecto,
              Estado: respuesta.status,
            });
          } else {
            resEfectosDesencadenados.push({
              efecto: element.idefecto,
              Estado: "Error",
            });
          }
        })();
      });
    }

    if (efectosRecibidos.length > 0) {
      let id_riesgos_asociados;
      efectosRecibidos.map((data) => {
        id_riesgos_asociados = data.id_riesgos_asociados.split(",");
        id_riesgos_asociados.pop();

        lista_efectosRecibidos.push({
          idriesgo: idRiesgo,
          idefecto: data.idefecto,
          recibido_de: data.riesgos_asociados,
          id_recibido_de: id_riesgos_asociados,
          tipo_relacion: "Recibido",
          estado: 1,
        });

        return null;
      });

      lista_efectosRecibidos.forEach((element) => {
        (async () => {
          var respuesta = await postData(
            element,
            "rx_riesgo_efecto",
            "efectos recibidos"
          );

          if (respuesta) {
            resEfectosRecibidos.push({
              efecto: respuesta.data.idefecto,
              Estado: respuesta.status,
            });
          } else {
            resEfectosRecibidos.push({
              efecto: element.idefecto,
              Estado: "Error",
            });
          }
        })();
      });
    }
  };

  const calculaResumenValoracion = async (
    idRiesgo,
    consolidadosEfectos,
    compania,
    guardar
  ) => {
    let data = {
      confirmar: confirm ? 1 : 0,
      datos: consolidadosEfectos,
      idriesgo: idRiesgo,
      estado: "Vigente",
      guardar: guardar,
      compania: idcompania,
      compromete_licencia: checkedStateComprometeLicencia ? 1 : 0,
      riesgo_mitigado: checkedStateImpacto ? 1 : 0,
    };
    let returnResume;

    try {
      setDataEnviada(data);
      let result = await Queries(data, "/resumen_valoracion/", "POST");
      returnResume = result.status;
      if (result && result.status !== 409) {
        setResumenValoracion(result.data);
        setIneherentes(result.data);
      } else if (result && result.status === 409) {
        setShowConfirmar(true);
      }
    } catch (error) {}

    return returnResume;
  };

  const savecalculaResumenValoracion = async (
    idRiesgo,
    consolidadosEfectos,
    compania,
    guardar
  ) => {
    let data = {
      confirmar: confirm ? 1 : 0,
      datos: consolidadosEfectos,
      idriesgo: idRiesgo,
      estado: "Vigente",
      guardar: guardar,
      compania: idcompania,
      compromete_licencia: checkedStateComprometeLicencia ? 1 : 0,
      riesgo_mitigado: checkedStateImpacto ? 1 : 0,
    };
    let resultado;
    try {
      setDataEnviada(data);
      let result = await Queries(data, "/resumen_valoracion/", "POST");
      if (result && result.status !== 409) {
        setResumenValoracion(result.data);
        setExposicionIn(result.data.p95_total);
        setNivelRiesgoInherente(result.data.nivel_riesgo_inherente);
        let exp_residual = result.data.p95_total * (1 - efectividadCtrl / 100);

        let niv_residual;
        if (par) {
          if (exp_residual <= par.tolerable) {
            niv_residual = "Tolerable";
            setNivelRiesgoResidual("Tolerable");
          } else if (exp_residual > par.tolerable && result <= par.moderado) {
            setNivelRiesgoResidual("Moderado");

            niv_residual = "Moderado";
          } else if (exp_residual > par.moderado && result <= par.critico) {
            setNivelRiesgoResidual("Crítico");

            niv_residual = "Crítico";
          } else if (exp_residual > par.critico && result <= par.muy_critico) {
            setNivelRiesgoResidual("Muy crítico");
            niv_residual = "Muy crítico";
          } else if (exp_residual > par.muy_critico) {
            niv_residual = "Muy crítico";
          }
        }

        resultado = {
          exp_inherente: result.data.p95_total,
          nivel_inherente: result.data.nivel_riesgo_inherente,
          exp_residual: exp_residual,
          niv_residual: niv_residual,
        };
      } else if (result && result.status === 409) {
        setShowConfirmar(true);
      }
    } catch (error) {}

    return resultado;
  };
  const getPar = async (compania) => {
    try {
      const response = await axios.get(
        process.env.REACT_APP_API_URL + "/par/" + compania,
        {
          headers: {
            Authorization: "Bearer " + serviceAAD.getToken(),
          },
        }
      );
      let aux = await response.data;

      setPar(aux);
    } catch (error) {
      console.error(error);
    }
  };

  const sendResumenValoracion = async (idRiesgo, guardar) => {
    setCalculado(true);
    function asignaTipoEfecto(tipoEfecto) {
      if (tipoEfecto === "Propio") {
        return "propio";
      }
      if (tipoEfecto === "Desencadenado") {
        return "desencadenado";
      }
      if (tipoEfecto === "Recibido") {
        return "recibido";
      }
    }

    let aux = [];

    listaGeneralEfectos.map((data) => {
      if (
        data.estado_enVista === "Agregado" ||
        data.estado_enVista === "Activo"
      ) {
        aux.push({
          idefecto: data.idefecto,
          media: data.media,
          nombreefecto: data.nombreefecto,
          tipoimpacto: data.tipoefecto,
          relacion: asignaTipoEfecto(data.tipoEfecto),
          resultado_p50: data.resultado_p50,
          resultado_p95: data.resultado_p95,
          resultado_p99: data.resultado_p99,
        });

        return null;
      }
    });

    let resumeStatus = await calculaResumenValoracion(
      idRiesgo,
      aux,
      obj_compania.value,
      guardar
    );
    await setLoadingResumen(false);
    return resumeStatus;
  };

  const saveResumenValoracion = async (idRiesgo, guardar) => {
    setCalculado(false);
    function asignaTipoEfecto(tipoEfecto) {
      if (tipoEfecto === "Propio") {
        return "propio";
      }
      if (tipoEfecto === "Desencadenado") {
        return "desencadenado";
      }
      if (tipoEfecto === "Recibido") {
        return "recibido";
      }
    }

    let aux = [];

    listaGeneralEfectos.map((data) => {
      if (
        data.estado_enVista === "Agregado" ||
        data.estado_enVista === "Activo"
      ) {
        aux.push({
          idefecto: data.idefecto,
          media: data.media,
          nombreefecto: data.nombreefecto,
          tipoimpacto: data.tipoefecto,
          relacion: asignaTipoEfecto(data.tipoEfecto),
          resultado_p50: data.resultado_p50,
          resultado_p95: data.resultado_p95,
          resultado_p99: data.resultado_p99,
        });

        return null;
      }
    });
    let dat_inherente = [];
    dat_inherente = await savecalculaResumenValoracion(
      idRiesgo,
      aux,
      obj_compania.value,
      guardar
    );
    setLoadingResumen(false);
    return dat_inherente;
  };
  async function desasociarEfectos() {
    setOpenModal((prevState) => !prevState);
    /**
     * * La variable de estado "rxRiesgosEfectos" contiene la lista de objetos de los efectos propios, desencadenados y recibidos en general,
     * * esta lista proviene de el "useEffect()" en donde se realiza el query a la base de datos y se ejecuta "setRxRiesgoEfectos()".
     * * A esta variable de estado se le realiza el metodo Array.prototype.filter() para llenar el array "temp" con el efecto seleccionado en la pantalla,
     * * con el objetivo de enviar los campos pertinentes a la API ("rx_riesgo_efecto/" + idRiesgo).
     * ? Esto sucede ya que los campos del riesgo seleccionado en el front no coinciden con los de la API donde se guardan estos tres tipos de efectos,
     * ? Por eso se realiza la comparación de id's entre la lista de objetos totales y el objeto seleccionado en la tabla.
     * TODO: Una posible optimización puede ser que la tabla se llene con los campos de la API "/rx_riesgo_efecto/", de esta manera,
     * TODO: se envia el objeto seleccionado sin tener que pasar por una comparación y corroboración.
     **/

    let temp = [];
    let idRiesgoSeleccionado = null;

    switch (tipoDeEfecto) {
      case "propio":
        idRiesgoSeleccionado = selectedRiesgosEfecto_propios;
        break;
      case "desencadenado":
        idRiesgoSeleccionado = selectedRiesgosEfecto_desencadenados;
        break;
      case "recibido":
        idRiesgoSeleccionado = selectedRiesgosEfecto_recibidos;
        break;
      default:
        break;
    }

    temp = rxRiesgosEfectos.filter(
      (efectos) => efectos.idefecto === idRiesgoSeleccionado
    );

    var datosRiesgoEfecto = {
      idrx_riesgo_efecto: temp[0].idrx_riesgo_efecto,
      idriesgo: temp[0].idriesgo,
      nombre_riesgo: temp[0].nombre_riesgo,
      descripcion_riesgo: temp[0].descripcion_riesgo,
      estado_riesgo: temp[0].estado_riesgo,
      idefecto: temp[0].idefecto,
      nombreefecto: temp[0].nombreefecto,
      descripcionefecto: temp[0].descripcionefecto,
      tipoimpacto: temp[0].tipoimpacto,
      materializado_en: temp[0].materializado_en,
      incluir_en_var: temp[0].incluir_en_var,
      metodovaloracion: temp[0].metodovaloracion,
      resultado_p50: temp[0].resultado_p50,
      resultado_p95: temp[0].resultado_p95,
      resultado_p99: temp[0].resultado_p99,
      analista: temp[0].analista,
      media: temp[0].media,
      desencadenado_en: temp[0].desencadenado_en,
      recibido_de: temp[0].recibido_de,
      tipo_relacion: temp[0].tipo_relacion,
      estado: 0,
      id_recibido_de: temp[0].id_recibido_de ? [temp[0].id_recibido_de] : null,
      id_desencadenado_en: temp[0].id_desencadenado_en
        ? [temp[0].id_desencadenado_en]
        : null,
    };

    JSON.stringify(datosRiesgoEfecto);
    //Guarda

    axios.put(
      process.env.REACT_APP_API_URL + "/rx_riesgo_efecto/" + idRiesgo + "/",
      datosRiesgoEfecto,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + serviceAAD.getToken(),
        },
      }
    );
    /**
     * !Poner alerta de ¿Seguro desea desasociar??
     *
     **/
  }

  return (
    <>
      <>
        <ModalConfirmar
          showMod={showConfirmar}
          setShowMod={setShowConfirmar}
          data={
            "El nivel de riesgo cambió a cero, ¿Desea guardar el riesgo sin efectos?"
          }
          setConfirm={setConfirm}
        />
        <Row>
          <Col>
            <div
              style={{ position: "fixed", zIndex: 10, minWidth: "80vw" }}
              className={classes.content}
            >
              <div className={classes.appBarSpacer}>
                <Navbar bg="dark" variant="dark" expand="xl">
                  <Container>
                    <Navbar id="justify-content-center">
                      <Nav className="ml-auto">
                        <Nav.Link>
                          <Link to="editarRiesgo" className="link2">
                            Información General
                          </Link>
                        </Nav.Link>
                        <Nav.Link>
                          <Link to="causaControles" className="link2">
                            Causas y controles
                          </Link>
                        </Nav.Link>
                        <Nav.Link>
                          <Link to="valoracionRiesgo" className="link2">
                            Valoración RO
                          </Link>
                        </Nav.Link>
                        <Nav.Link>
                          <Link to="valoracionSOX" className="link2">
                            Valoración SOX
                          </Link>
                        </Nav.Link>
                        <Nav.Link href="#resumenPorEfecto">
                          <Link to="riesgos">
                            <button
                              type="button"
                              className="btn botonNegativo2"
                            >
                              Cancelar
                            </button>
                          </Link>
                        </Nav.Link>
                        <Nav.Link href="#resumenPorEfecto">
                          {props.permisos.editar ? (
                            <button
                              type="button"
                              className="btn botonPositivo2"
                              id="send"
                              onClick={sendData}
                            >
                              Guardar
                            </button>
                          ) : null}
                        </Nav.Link>
                      </Nav>
                    </Navbar>
                  </Container>
                </Navbar>
              </div>
            </div>
          </Col>
        </Row>
        <Container className="mb-5 ">
          <Form
            id="formData"
            noValidate
            validated={validated}
            onSubmit={sendData}
            className="mb-5"
          >
            {/* ///////////////////// ventanas modales //////////////////// */}
            <ModalEfectosPropios
              listaGeneralEfectos={listaGeneralEfectos}
              setListaGeneralEfectos={setListaGeneralEfectos}
              modalEfectosPropiosShow={modalEfectosPropiosShow}
              setModalEfectosPropiosShow={setModalEfectosPropiosShow}
            />
            <ModalEfectosDesencadenados
              dataRiesgos={dataRiesgos}
              listaGeneralEfectos={listaGeneralEfectos}
              setListaGeneralEfectos={setListaGeneralEfectos}
              modalEfectosDesencadenadosShow={modalEfectosDesencadenadosShow}
              setModalEfectosDesencadenadosShow={
                setModalEfectosDesencadenadosShow
              }
            />
            <ModalEfectosRecibidos
              dataRiesgos={dataRiesgos}
              listaGeneralEfectos={listaGeneralEfectos}
              setListaGeneralEfectos={setListaGeneralEfectos}
              rxRiesgosEfectos={rxRiesgosEfectos}
              modalEfectosRecibidosShow={modalEfectosRecibidosShow}
              setModalEfectosRecibidosShow={setModalEfectosRecibidosShow}
            />
            <ModalAlerta
              showAlerta={showAlerta}
              setShowAlerta={setShowAlerta}
              text={textAlerta}
            />
            <Row className="mt-5 mb-3">
              <Col md={12}>
                {" "}
                <AlertDismissibleExample
                  alerta={estadoPost}
                  className="mb-3 mt-5"
                />{" "}
              </Col>
            </Row>
            {/* ///////////////////////////// Acciones ////////////////////////////// */}
            <Row className="mb-3 mt-5">
              <Col md={12}>
                <h1 className="titulo">Riesgo # {idRiesgo} </h1>
              </Col>
            </Row>
            <Row className="mb-3 ">
              <Col md={12}>
                <h1 className="subtitulo text-center">Resumen del riesgo</h1>
              </Col>
            </Row>
            {loadingResumen ? (
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
              <ResumenCalculo
                resumenValoracion={resumenValoracion}
                exposicionIn={exposicionIn}
                efectividadCtrl={efectividadCtrl}
                nivelRiesgoInherente={nivelRiesgoInherente}
                nivelRiesgoResidual={nivelRiesgoResidual}
                exposicionResidual={exposicionResidual}
                setExposicionResidual={setExposicionResidual}
                setNivelRiesgoResidual={setNivelRiesgoResidual}
                par={par}
                Calculado={Calculado}
                isHiddenDecision={false}
              />
            )}
            <Row className="justify-content-center mt-4">
              <Col className="text-center">
                {" "}
                {loadingDataCausas ? (
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
                  <button
                    type="button"
                    className="btn botonPositivo2"
                    id=""
                    onClick={() => {
                      setLoadingResumen(true);
                      sendResumenValoracion(0, 0);
                    }}
                  >
                    Calcular
                  </button>
                )}
              </Col>
            </Row>
            {/* //////////////////////////////////////// Tablas para efectos ////////////////////////////////////////////// */}
            <hr className="separador mb-5 mt-5" />
            <Row className="mb-3 mt-4">
              <Col sm={12} xs={12}>
                <h1 className="subtitulo text-center">
                  Valoración de impactos financieros (pérdidas)
                </h1>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col sm={4}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={checkedStateImpacto}
                      onChange={(event) => {
                        setCheckedStateImpacto(event.target.checked);
                      }}
                      name="gilad"
                    />
                  }
                  label="Riesgo completamente mitigado"
                />
              </Col>
            </Row>

            <Row className="mb-3">
              <Col sm={4}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={checkedStateComprometeLicencia}
                      value={checkedStateComprometeLicencia ? 1 : 0}
                      onChange={(event) => {
                        setCheckedStateComprometeLicencia(event.target.checked);
                      }}
                      name="gilad"
                    />
                  }
                  label="Compromete licencia"
                />
              </Col>
            </Row>

            <ModalEliminarEfecto
              openModal={openModal}
              setOpenModal={setOpenModal}
              desasociarEfectos={desasociarEfectos}
              tipoDeEfecto={tipoDeEfecto}
            />
            <Box>
              <Row className="mb-3">
                <Col sm={12} xs={12}>
                  <hr />
                  <label className="form-label label">Efectos propios</label>
                </Col>
              </Row>
              <p></p>
              <Row className="mb-3 justify-content-end">
                <Col sm={2} xs={12} className="text-right">
                  <button className="btn botonPositivo2" id="efecto_propio">
                    <td
                      onClick={() => window.open("crearEfecto", "_blank")}
                    ></td>
                    Crear Efecto
                  </button>
                </Col>
                <Col sm={2} xs={12} className="text-right">
                  <button
                    type="submit"
                    className="btn botonPositivo2"
                    id="efecto_propio"
                  >
                    <td onClick={() => window.open("agregarEfecto", "_blank")}>
                      Agregar Efectos
                    </td>
                  </button>
                </Col>
                <Col sm={2} xs={12} className="text-right">
                  <button
                    type="button"
                    className="btn botonPositivo2"
                    id="efecto_propio"
                    onClick={() => {
                      if (compania) {
                        setModalEfectosPropiosShow(true);
                      } else {
                        setTextAlerta(
                          "Recuerda elegir una compañía antes de asociar un efecto!"
                        );
                        setShowAlerta(true);
                      }
                    }}
                  >
                    Asociar Efecto
                  </button>
                </Col>

                {selected_propios.length > 0 ? (
                  <Col sm={2} xs={12} className="text-right">
                    <button
                      data-toggle="modal"
                      data-target="#exampleModal"
                      type="button"
                      className="btn botonNegativo2"
                      id="efecto_propio"
                      onClick={() => {
                        setOpenModal(true);
                        setTipoDeEfecto("propio");
                        completarTabla(selected_propios, "Buscado", "");
                        setSelected_propios([]);
                      }}
                    >
                      Desasociar efecto
                    </button>
                  </Col>
                ) : null}
              </Row>
              {/* Tabla riesgos inactivos */}
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
                          Id efecto*
                        </StyledTableCell>
                        <StyledTableCell align="left">Nombre</StyledTableCell>
                        <StyledTableCell align="left">
                          Descripción
                        </StyledTableCell>
                        <StyledTableCell align="left">
                          Tipo Impacto
                        </StyledTableCell>
                        <StyledTableCell align="left">
                          ¿Incluir en el VaR?
                        </StyledTableCell>
                        <StyledTableCell align="left">
                          Método valoración
                        </StyledTableCell>
                        <StyledTableCell align="left">P50</StyledTableCell>
                        <StyledTableCell align="left">P95</StyledTableCell>
                        <StyledTableCell align="left">P99</StyledTableCell>
                        <StyledTableCell align="left">Analista</StyledTableCell>
                      </TableRow>
                    </TableHead>
                    {/* Fin de encabezado */}
                    {/* Inicio de cuerpo de la tabla */}
                    <TableBody>
                      {muestraEfectosXTabla(
                        listaGeneralEfectos,
                        "Tabla_Propios"
                      )
                        .slice(
                          page * rowsPerPage,
                          page * rowsPerPage + rowsPerPage
                        )
                        .map((row, index) => {
                          const isItemSelected = isSelected_propios(
                            row.idefecto
                          );
                          return (
                            <StyledTableRow
                              key={row.idefecto}
                              hover
                              onClick={(event) =>
                                handleClick(event, row.idefecto, row, "propio")
                              }
                              role="checkbox"
                              tabIndex={-1}
                            >
                              <StyledTableCell component="th" scope="row">
                                <Checkbox checked={isItemSelected} />
                              </StyledTableCell>
                              <StyledTableCell component="th" scope="row">
                                {row.idefecto ? row.idefecto : null}
                              </StyledTableCell>
                              <StyledTableCell align="left">
                                {row.nombreefecto ? row.nombreefecto : null}
                              </StyledTableCell>
                              <StyledTableCell align="left">
                                {row.descripcionefecto
                                  ? row.descripcionefecto
                                  : null}
                              </StyledTableCell>
                              <StyledTableCell align="left">
                                {row.tipoefecto ? row.tipoefecto : null}
                              </StyledTableCell>
                              <StyledTableCell align="left">
                                {row.var ? row.var : null}
                              </StyledTableCell>
                              <StyledTableCell align="left">
                                {row.metodovaloracion
                                  ? row.metodovaloracion
                                  : null}
                              </StyledTableCell>
                              <StyledTableCell align="left">
                                {row.resultado_p50
                                  ? parseFloat(
                                      row.resultado_p50
                                    ).toLocaleString()
                                  : null}
                              </StyledTableCell>
                              <StyledTableCell align="left">
                                {row.resultado_p95
                                  ? parseFloat(
                                      row.resultado_p95
                                    ).toLocaleString()
                                  : null}
                              </StyledTableCell>
                              <StyledTableCell align="left">
                                {row.resultado_p99
                                  ? parseFloat(
                                      row.resultado_p99
                                    ).toLocaleString()
                                  : null}
                              </StyledTableCell>
                              <StyledTableCell align="left">
                                {row.analista ? row.analista : null}
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
                  count={
                    muestraEfectosXTabla(listaGeneralEfectos, "Tabla_Propios")
                      .length
                  }
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                />
                {/* Fin de paginación */}
              </Paper>

              <hr />
              <Row className="mb-3">
                <Col sm={12} xs={12}>
                  <label className="form-label label">
                    Efectos Desencadenados
                  </label>
                </Col>
              </Row>
              <p></p>
              <Row className="mb-3 justify-content-end">
                <Col sm={2} xs={12} className="text-right">
                  <button
                    type="submit"
                    className="btn botonPositivo2"
                    id="efecto_propio"
                  >
                    {" "}
                    <td
                      onClick={() => window.open("crearEfecto", "_blank")}
                    ></td>
                    Crear Efecto
                  </button>
                </Col>
                <Col sm={2} xs={12} className="text-right">
                  <button
                    type="submit"
                    className="btn botonPositivo2"
                    id="efecto_propio"
                  >
                    {" "}
                    <td onClick={() => window.open("agregarEfecto", "_blank")}>
                      Agregar Efectos
                    </td>
                  </button>
                </Col>
                <Col sm={2} xs={12} className="text-right">
                  <button
                    type="button"
                    className="btn botonPositivo2"
                    id="efecto_desencadenado"
                    onClick={() => {
                      if (compania) {
                        setModalEfectosDesencadenadosShow(true);
                      } else {
                        setTextAlerta(
                          "Recuerda elegir una compañía antes de asociar un efecto!"
                        );
                        setShowAlerta(true);
                      }
                    }}
                  >
                    Asociar Efecto
                  </button>
                </Col>
                {selected_desencadenados.length > 0 ? (
                  <Col sm={2} xs={12} className="text-right">
                    <button
                      type="button"
                      className="btn botonNegativo2"
                      id="efecto_desencadenado"
                      onClick={() => {
                        setOpenModal(true);
                        setTipoDeEfecto("desencadenado");
                        completarTabla(selected_desencadenados, "Buscado", "");
                        setSelected_desencadenados([]);
                      }}
                    >
                      Desasociar efecto
                    </button>
                  </Col>
                ) : null}
              </Row>
              {/* Tabla riesgos inactivos */}
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
                          Id efecto*
                        </StyledTableCell>
                        <StyledTableCell align="left">Nombre</StyledTableCell>
                        <StyledTableCell align="left">
                          Descripción
                        </StyledTableCell>
                        <StyledTableCell align="left">
                          Tipo Impacto
                        </StyledTableCell>
                        <StyledTableCell align="left">
                          tipo Efecto
                        </StyledTableCell>
                        <StyledTableCell align="left">
                          Desencadenado en
                        </StyledTableCell>
                        <StyledTableCell align="left">
                          ¿Incluir en el VaR?
                        </StyledTableCell>
                        <StyledTableCell align="left">
                          Método valoración
                        </StyledTableCell>
                        <StyledTableCell align="left">P50</StyledTableCell>
                        <StyledTableCell align="left">P95</StyledTableCell>
                        <StyledTableCell align="left">P99</StyledTableCell>
                        <StyledTableCell align="left">Analista</StyledTableCell>
                      </TableRow>
                    </TableHead>
                    {/* Fin de encabezado */}
                    {/* Inicio de cuerpo de la tabla */}
                    <TableBody>
                      {muestraEfectosXTabla(
                        listaGeneralEfectos,
                        "Tabla_Desencadenados"
                      )
                        .slice(
                          page * rowsPerPage,
                          page * rowsPerPage + rowsPerPage
                        )
                        .map((row, index) => {
                          const isItemSelected = isSelected_desencadenados(
                            row.idefecto
                          );
                          let DesencadenadoEN;
                          rxRiesgosEfectos.map((rx) => {
                            if (
                              rx.idefecto === row.idefecto &&
                              rx.tipo_relacion === "Desencadenado"
                            ) {
                              DesencadenadoEN = rx.desencadenado_en;
                            }
                          });
                          return (
                            <StyledTableRow
                              key={row.idefecto}
                              hover
                              onClick={(event) =>
                                handleClick(
                                  event,
                                  row.idefecto,
                                  row,
                                  "desencadenado"
                                )
                              }
                              role="checkbox"
                              tabIndex={-1}
                            >
                              <StyledTableCell component="th" scope="row">
                                <Checkbox checked={isItemSelected} />
                              </StyledTableCell>
                              <StyledTableCell component="th" scope="row">
                                {row.idefecto ? row.idefecto : null}
                              </StyledTableCell>
                              <StyledTableCell align="left">
                                {row.nombreefecto ? row.nombreefecto : null}
                              </StyledTableCell>
                              <StyledTableCell align="left">
                                {row.descripcionefecto
                                  ? row.descripcionefecto
                                  : null}
                              </StyledTableCell>
                              <StyledTableCell align="left">
                                {row.tipoefecto ? row.tipoefecto : null}
                              </StyledTableCell>
                              <StyledTableCell align="left">
                                {row.tipoEfecto ? row.tipoEfecto : null}
                              </StyledTableCell>
                              <StyledTableCell align="left">
                                {DesencadenadoEN ? DesencadenadoEN : null}
                              </StyledTableCell>
                              <StyledTableCell align="left">
                                {row.var ? row.var : null}
                              </StyledTableCell>
                              <StyledTableCell align="left">
                                {row.metodovaloracion
                                  ? row.metodovaloracion
                                  : null}
                              </StyledTableCell>
                              <StyledTableCell align="left">
                                {row.resultado_p50
                                  ? parseFloat(
                                      row.resultado_p50
                                    ).toLocaleString()
                                  : null}
                              </StyledTableCell>
                              <StyledTableCell align="left">
                                {row.resultado_p95
                                  ? parseFloat(
                                      row.resultado_p95
                                    ).toLocaleString()
                                  : null}
                              </StyledTableCell>
                              <StyledTableCell align="left">
                                {row.resultado_p99
                                  ? parseFloat(
                                      row.resultado_p99
                                    ).toLocaleString()
                                  : null}
                              </StyledTableCell>
                              <StyledTableCell align="left">
                                {row.analista ? row.analista : null}
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
                  count={
                    muestraEfectosXTabla(
                      listaGeneralEfectos,
                      "Tabla_Desencadenados"
                    ).length
                  }
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                />
                {/* Fin de paginación */}
              </Paper>

              <hr />
              <Row className="mb-3">
                <Col sm={12} xs={12}>
                  <label className="form-label label">Efectos Recibidos</label>
                </Col>
              </Row>
              <p></p>
              <Row className="mb-3 justify-content-end">
                <Col sm={2} xs={12} className="text-right">
                  <button
                    type="button"
                    className="btn botonPositivo2"
                    id="efecto_recibido"
                    onClick={() => setModalEfectosRecibidosShow(true)}
                  >
                    Asociar Efecto
                  </button>
                </Col>
                {selected_recibidos.length > 0 ? (
                  <Col sm={2} xs={12}>
                    <button
                      type="button"
                      className="btn botonNegativo2"
                      id="efecto_recibido"
                      onClick={() => {
                        setOpenModal(true);
                        setTipoDeEfecto("recibido");
                        completarTabla(selected_recibidos, "Buscado", "");
                        //setSelected_recibidos([]);
                      }}
                    >
                      Desasociar efecto
                    </button>
                  </Col>
                ) : null}
              </Row>
              {/* Tabla riesgos inactivos */}
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
                          Id efecto*
                        </StyledTableCell>
                        <StyledTableCell align="left">Nombre</StyledTableCell>
                        <StyledTableCell align="left">
                          Descripción
                        </StyledTableCell>
                        <StyledTableCell align="left">
                          Tipo Impacto
                        </StyledTableCell>
                        <StyledTableCell align="left">
                          Tipo Efecto
                        </StyledTableCell>
                        <StyledTableCell align="left">
                          Recibido de
                        </StyledTableCell>
                        <StyledTableCell align="left">
                          Método valoración
                        </StyledTableCell>
                        <StyledTableCell align="left">P50</StyledTableCell>
                        <StyledTableCell align="left">P95</StyledTableCell>
                        <StyledTableCell align="left">P99</StyledTableCell>
                        <StyledTableCell align="left">Analista</StyledTableCell>
                      </TableRow>
                    </TableHead>
                    {/* Fin de encabezado */}
                    {/* Inicio de cuerpo de la tabla */}
                    <TableBody>
                      {muestraEfectosXTabla(
                        listaGeneralEfectos,
                        "Tabla_Recibidos"
                      )
                        .slice(
                          page * rowsPerPage,
                          page * rowsPerPage + rowsPerPage
                        )
                        .map((row, index) => {
                          const isItemSelected = isSelected_recibidos(
                            row.idefecto
                          );
                          let recibidoDE;
                          rxRiesgosEfectos.map((rx) => {
                            if (
                              rx.idefecto === row.idefecto &&
                              rx.tipo_relacion === "Recibido"
                            ) {
                              recibidoDE = rx.recibido_de;
                            }
                          });
                          return (
                            <StyledTableRow
                              key={row.idefecto}
                              hover
                              onClick={(event) =>
                                handleClick(
                                  event,
                                  row.idefecto,
                                  row,
                                  "recibido"
                                )
                              }
                              role="checkbox"
                              tabIndex={-1}
                            >
                              <StyledTableCell component="th" scope="row">
                                <Checkbox checked={isItemSelected} />
                              </StyledTableCell>
                              <StyledTableCell component="th" scope="row">
                                {row.idefecto ? row.idefecto : null}
                              </StyledTableCell>
                              <StyledTableCell align="left">
                                {row.nombreefecto ? row.nombreefecto : null}
                              </StyledTableCell>
                              <StyledTableCell align="left">
                                {row.descripcionefecto
                                  ? row.descripcionefecto
                                  : null}
                              </StyledTableCell>
                              <StyledTableCell align="left">
                                {row.tipoefecto ? row.tipoefecto : null}
                              </StyledTableCell>
                              <StyledTableCell align="left">
                                {row.tipoEfecto ? row.tipoEfecto : null}
                              </StyledTableCell>
                              <StyledTableCell align="left">
                                {recibidoDE ? recibidoDE : null}
                              </StyledTableCell>
                              <StyledTableCell align="left">
                                {row.metodovaloracion
                                  ? row.metodovaloracion
                                  : null}
                              </StyledTableCell>
                              <StyledTableCell align="left">
                                {row.resultado_p50
                                  ? parseFloat(
                                      row.resultado_p50
                                    ).toLocaleString()
                                  : null}
                              </StyledTableCell>
                              <StyledTableCell align="left">
                                {row.resultado_p95
                                  ? parseFloat(
                                      row.resultado_p95
                                    ).toLocaleString()
                                  : null}
                              </StyledTableCell>
                              <StyledTableCell align="left">
                                {row.resultado_p99
                                  ? parseFloat(
                                      row.resultado_p99
                                    ).toLocaleString()
                                  : null}
                              </StyledTableCell>
                              <StyledTableCell align="left">
                                {row.analista ? row.analista : null}
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
                  count={
                    muestraEfectosXTabla(listaGeneralEfectos, "Tabla_Recibidos")
                      .length
                  }
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                />
                {/* Fin de paginación */}
              </Paper>
            </Box>
            {(() => {
              if (checkedStateImpacto === false) {
                return (
                  <>
                    <hr className="mb-5 mt-5" />

                    {loadingResumen ? (
                      <Row className="mb-3 mt-5">
                        <Col>
                          <Loader
                            type="Oval"
                            color="#FFBF00"
                            style={{
                              textAlign: "center",
                              position: "static",
                            }}
                          />
                        </Col>
                      </Row>
                    ) : (
                      <ResumenDeEfectos resumenValoracion={resumenValoracion} />
                    )}
                  </>
                );
              } else if (checkedStateImpacto === true) {
                return null;
              }
            })()}
            <Row className="mb-5 mt-5"></Row>
          </Form>
        </Container>
      </>
      {/* )} */}
    </>
  );
}
