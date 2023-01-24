import React, { useState, useEffect } from "react";

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
import PropTypes, { object } from "prop-types";
import { AiFillDelete, AiFillCaretDown } from "react-icons/ai";
import { MdAddCircleOutline } from "react-icons/md";
import ModalProveedor from "../Maestros/Proveedores/ModalProveedor";

import axios from "axios";
import AADService from "../auth/authFunctions";

import Queries from "../Components/QueriesAxios";
import ModalCrearEfecto from "./ModalesNewRiesgos/ModalCrearEfecto";

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

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  container: {
    maxHeight: "50vh",
  },
  content: {
    flexGrow: 1,
    overflow: "auto",
  },
  appBarSpacer: theme.mixins.toolbar,
}));

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

///////////////////////////////* Filas para las causas *//////////////////////////////////
const defaultState = {
  id: "",
  descripcion: "",
  causaN1: "",
  causaN2: "",
  estado: true,
  porcentaje: "",
};

let listaContratos;

// const listaAristas = [
//   {
//     name: "RO",
//     value: "RO",
//   },
//   {
//     name: "SOX",
//     value: "SOX",
//   },
//   {
//     name: "LAFT",
//     value: "LAFT",
//   },
//   {
//     name: "PDP",
//     value: "PDP",
//   },
//   {
//     name: "SAC",
//     value: "SAC",
//   },
//   {
//     name: "Corrupción int.",
//     value: "Corrupción interna",
//   },
//   {
//     name: "Corrupción ext.",
//     value: "Corrupción externa",
//   },
//   {
//     name: "Reputacional",
//     value: "Reputacional",
//   },
//   {
//     name: "Legal",
//     value: "Legal",
//   },
//   {
//     name: "ESG",
//     value: "ESG",
//   },
// ];

export default function CrearRiesgo(props) {
  const serviceAAD = new AADService();

  const [reloadCount, setReloadCount] = useState(0);

  const [listaDetalleSox, setListaDetalleSox] = useState([
    {
      name: "Existencia",
      value: "Existencia",
      state: false,
    },
    {
      name: "Integridad",
      value: "Integridad",
      state: false,
    },
    {
      name: "Exactitud",
      value: "Exactitud",
      state: false,
    },
    {
      name: "Valuación",
      value: "Valuación",
      state: false,
    },
    {
      name: "Derechos y Oblig.",
      value: "Derechos y Oblig.",
      state: false,
    },
    {
      name: "Presentación y Rev.",
      value: "Presentación y Rev.",
      state: false,
    },
  ]);

  const [elementoNegPal, setElementoNegPal] = useState([]);
  const [companias, setCompanias] = useState([]);
  const [listaElementos, setTipoElementoSelect] = useState([]);
  const [listaProceso, setListaProceso] = useState([]);
  const [listaProducto, setListaProducto] = useState([]);
  const [listaCanal, setListaCanal] = useState([]);
  const [catRiesgos, setCatRiesgos] = useState([]);
  const [subCatRiesgo, setSubCatRiesgo] = useState([]);
  const [catRiesgos_local, setCatRiesgos_Local] = useState([]);
  const [subCatRiesgos_local, setSubCatRiesgos_Local] = useState([]);
  const [listaContratosPrin, setListaContratosPrin] = useState([]);
  const [contrato, setContrato] = useState([]);
  const [Proveedor, setProveedor] = useState([]);
  const [listaProveedores, setListaProveedores] = useState([]);
  const [listaContratos, setListaContratos] = useState([]);
  const [contratoSelec, setContratoSelec] = useState([]);
  const [contratoOtros, setContratoOtros] = useState([]);

  //* Reciben los datos filtrados

  const [listaProceso_filtered, setListaProcesoFiltered] = useState([]);
  const [listaProveedor_filtered, setListaProveedorFiltered] = useState([]);
  const [listaProyecto_filtered, setListaProyectoFiltered] = useState([]);
  const [listaProducto_filtered, setListaProductoFiltered] = useState([]);
  const [listaCanal_filtered, setListaCanalFiltered] = useState([]);
  const [subCatRiesgo_filtered, setsubCatRiesgoFiltered] = useState([]);
  const [catRiesgosRO_filtered, setCat_RO_localFiltered] = useState([]);
  const [subCatRiesgosRO_filtered, setSubCat_RO_localFiltered] = useState([]);

  //* Reciben los datos ingresados/elegidos por el usuario
  const [tipoProveedor, setTipoProveedor] = useState([]);

  const [estadoRiesgo, setEstadoRiesgo] = useState(null);
  const [compania, setCompania] = useState(null);
  const [idcompania, setIdCompania] = useState(null);

  const [nombre_riesgo, setNombre_riesgo] = useState(null);
  const [descripcion, setDescripcion] = useState(null);
  // --------------------------------Aristas
  const [aristas, setAristas] = useState(null);
  const [strAristas, setStrAristas] = useState([]);  
  const [listaAristas, setListaAristas] = React.useState([]);
  // --------------------------------------------
  const [tipoElemento, setTipoElemento] = useState(null);
  const [elemento, setElementoEv] = useState(null);
  const [proceso, setProceso] = useState(null);
  const [canal, setCanal] = useState(null);
  const [producto, setProducto] = useState(null);
  const [showContratos, setShowContratos] = useState(false);
  const [showProveedor, setShowProveedor] = useState(false);
  const [showProceso, setShowProceso] = useState(false);
  const [cicloProceso, setCicloProceso] = useState(false);

  const [showModalProveedor, setShowModalProveedor] = React.useState(false);
  const [nombreElemento, setNombreElemento] = React.useState(null);
  const [nombreElementoOtros, setNombreElementoOtros] = React.useState(null);

  const [riesgoRO, setRiesgoRo] = useState(null);
  const [subRiesgoRO, setSubRiesgoRo] = useState(null);
  const [riesgoLocal, setRiesgoLocal] = useState(null);
  const [subRiesgoLocal, setSubRiesgoLocal] = useState(null);
  const [malversacion, setMalversacion] = useState(null);

  const [descripComplementaria, setDescComplementaria] = useState(null);
  const [riesgoCont, setRiesgoCont] = useState(null);

  //* Variables relacionadas con el resumen del calculo (DetalleRO)
  const [exposicionIn, setExposicionIn] = useState(null);
  const [metEfectividadCtrl, setMetEfectividadCtrl] = useState(null);
  const [efectividadCtrl, setEfectividadCtrl] = useState(null);
  const [exposicionResidual, setExposicionResidual] = useState(null);
  const [nivelRiesgoInherente, setNivelRiesgoInherente] = useState(null);
  const [nivelRiesgoResidual, setNivelRiesgoResidual] = useState(null);
  const [par, setPar] = useState(null);
  const [justificacionCausas, setJustificacionCausas] = useState(null);
  const [modelosDetalleRO, setModelosDetalleRO] = useState(null);

  //* Variables relacionadas con el resumen de la valoracion (Efectos)
  const [calculaResumen, setCalculaResumen] = useState(false);
  const [resumenValoracion, setResumenValoracion] = useState(null);
  const [loadingData, setLoadingData] = React.useState(false);
  const [validador, setValidador] = useState(null);

  //* Controla comportamiento de la vista

  const [tipoCompo, setTipoComponente] = useState("Select");
  const [isCheckedRO, setIsCheckedRO] = useState(false);
  const [isCheckedSOX, setIsCheckedSOX] = useState(false);
  const [checkedStateImpacto, setCheckedStateImpacto] = useState(false);
  const [validated, setValidated] = useState(false);
  const [estadoPost, setEstadoPost] = useState({
    alerta: { id: 0, data: null },
  });
  const [showAlerta, setShowAlerta] = useState(false);
  const [textAlerta, setTextAlerta] = useState(null);
  const [loadingResumen, setLoadingResumen] = useState(false);
  const [checkedState, setCheckedState] = useState(
    new Array(listaAristas.length).fill(false)
  );
  const history = useHistory();

  //* Variables para el resumen de efectos */

  const [dataResumenEfecto, setDataResumenEfecto] = useState([]);
  const classes = useStyles();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  //* Variable para habilitar el botón de guardar y mostrar spinner */
  const [habilitarBoton, setHabilitarBoton] = React.useState(true);

  const [malverObligatorio, setMalverObligatorio] = useState(false);

  const [fraudeInt, setFraudeInt] = useState(null);
  const [fraudeMalv, setFraudeMalv] = useState(null);
  const [fraudeRepFin, setFraudeRepFin] = useState(null);
  const [listaCatSOX, setListaCatSOX] = useState(null);
  const [dataAristas, setDataAristas] = useState([]);

  useEffect(() => {
    async function getCompania() {
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
        setCompanias(companias);
      } catch (error) {
        console.error(error);
      }
    }
    getCompania();

    let listaProveedor;
    const getProveedor = async () => {
      try {
        let response = await axios.get(
          process.env.REACT_APP_API_URL + "/maestros_ro/proveedor/",
          {
            headers: {
              Authorization: "Bearer " + serviceAAD.getToken(),
            },
          }
        );
        listaProveedor = await response.data.map(
          ({ ID_SAP: value, Nombre_Proveedor: label, grupo, parametro }) => ({
            value,
            label,
            grupo,
            parametro,
          })
        );
        setListaProveedorFiltered(listaProveedor);
        setListaProveedores(listaProveedor);
      } catch (error) {
        console.error(error);
      }
    };

    getProveedor();

    async function getElementoNegPal() {
      try {
        const response = await axios.get(
          process.env.REACT_APP_API_URL + "/generales/Evaluaciones/Tipo_elemento_negocio_principal",
          {
            headers: {
              Authorization: "Bearer " + serviceAAD.getToken(),
            },
          }
        );
        let elementoPpal = response.data.map(
          ({ idm_parametrosgenerales: value, valor: label }) => ({
            value,
            label,
          })
        );
        setElementoNegPal(elementoPpal);
      } catch (error) {
        console.error(error);
      }
    }
    getElementoNegPal();
    async function getProceso() {
      try {
        const response = await axios.get(
          process.env.REACT_APP_API_URL + "/ultimonivel/Proceso",
          {
            headers: {
              Authorization: "Bearer " + serviceAAD.getToken(),
            },
          }
        );
        console.log(response.data);
        let datos = response.data.map(
          ({ id: value, nombre: label, idcompania, ciclo }) => ({
            value,
            label,
            idcompania,
            ciclo,
          })
        );
        setListaProceso(datos);
      } catch (error) {
        console.error(error);
      }
    }
    getProceso();

    async function getProductos() {
      try {
        const response = await axios.get(
          process.env.REACT_APP_API_URL + "/ultimonivel/Producto",
          {
            headers: {
              Authorization: "Bearer " + serviceAAD.getToken(),
            },
          }
        );
        let datos = response.data.map(
          ({ id: value, nombre: label, idcompania }) => ({
            value,
            label,
            idcompania,
          })
        );
        setListaProducto(datos);
      } catch (error) {
        console.error(error);
      }
    }
    getProductos();
    async function getCanal() {
      try {
        const response = await axios.get(
          process.env.REACT_APP_API_URL + "/ultimonivel/Canal",
          {
            headers: {
              Authorization: "Bearer " + serviceAAD.getToken(),
            },
          }
        );
        let datos = response.data.map(
          ({ id: value, nombre: label, idcompania }) => ({
            value,
            label,
            idcompania,
          })
        );
        setListaCanal(datos);
      } catch (error) {
        console.error(error);
      }
    }
    getCanal();
    async function getCategoriaRiesgo() {
      //* Filtra categorias de RO según territorio ///////////////

      try {
        const response = await axios.get(
          process.env.REACT_APP_API_URL + "/maestros_ro/categoria_riesgo/",
          {
            headers: {
              Authorization: "Bearer " + serviceAAD.getToken(),
            },
          }
        );
        let datos = response.data.map(
          ({
            idcategoria_riesgo: value,
            nombre: label,
            atributo,
            nivel,
            categoria_riesgos_n1,
          }) => ({
            value,
            label,
            atributo,
            nivel,
            categoria_riesgos_n1,
          })
        );
        let CatRiesgo_Corp = [];
        let SubCatRiesgo_Corp = [];
        let CatRiesgoRO_Local = [];
        let subCatRiesgos_local = [];
        datos.map((riesgo) => {
          if (
            riesgo.atributo !== "Corporativa" &&
            riesgo.atributo !== "Oculta" &&
            riesgo.nivel === 1
          ) {
            CatRiesgoRO_Local.push(riesgo);
          } else if (
            riesgo.atributo !== "Corporativa" &&
            riesgo.atributo !== "Oculta" &&
            riesgo.nivel === 3
          ) {
            subCatRiesgos_local.push(riesgo);
          } else if (riesgo.nivel === 1) {
            CatRiesgo_Corp.push(riesgo);
          } else if (riesgo.nivel === 3) {
            SubCatRiesgo_Corp.push(riesgo);
          }
          return null;
        });

        console.log(SubCatRiesgo_Corp);
        setListaCatSOX(
          SubCatRiesgo_Corp.filter((obj) => obj.categoria_riesgos_n1 === 26)
        );
        setCatRiesgos(CatRiesgo_Corp);
        setSubCatRiesgo(SubCatRiesgo_Corp);
        setCatRiesgos_Local(CatRiesgoRO_Local);
        setSubCatRiesgos_Local(subCatRiesgos_local);
      } catch (error) {
        console.error(error);
      }
    }
    getCategoriaRiesgo();
    // const getAristas = async () => {
    //   let requestAristas = await Queries(null, "/maestros_ro/aristas/", "GET");
    //   requestAristas = requestAristas.map(({ nombre }) => ({
    //     label: nombre,
    //     value: nombre,
    //     state:false
    //   }));
    //   setDataAristas(requestAristas);
    // };
    async function getAristas() {
      let requestAristas = await Queries(
        null,
        "/maestros_ro/aristas/",
        "GET"
      );
      requestAristas = requestAristas.map(({ nombre }) => ({
        value: nombre,
        label: nombre,
      }));
      console.log({ requestAristas });
      setListaAristas(requestAristas);
    }
    getAristas();

  }, [reloadCount, listaDetalleSox]);

  const FiltrarAristas = (aristasSelected) => {
    if (aristasSelected.some((obj) => obj.label === "RO")) {
      setIsCheckedRO(true);
    } else if(aristasSelected.some((obj) => obj.label === "SOX")) {
      setIsCheckedSOX(true);
    }else{
      setIsCheckedRO(false);
      setIsCheckedSOX(false);
    }
  };

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
      label: "Participación en el riesgo (0-100)",
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

  //* Filtra segun la compañia seleccionada  y renderiza nuevamente la lista de Componentes Ppales///////////////////

  const FiltrarMaestros = (compania) => {
    if (compania !== null) {
      setCompania({ value: compania.value, label: compania.label });
      setIdCompania(compania.value);
      setTipoElemento(null);
      setCanal(null);
      setProceso(null);
      setProducto(null);
      setRiesgoRo(null);
      setSubRiesgoRo(null);
      setRiesgoLocal(null);
      setSubRiesgoLocal(null);
      setElementoEv(null);

      //* Filtra maestros según la compañía seleccionada ////////
      let procesosFiltrados = [];
      let canalesFiltrados = [];
      let productosFiltrados = [];
      listaProceso.map((dato) => {
        if (dato.idcompania === compania.value) {
          procesosFiltrados.push(dato);
        }
        return null;
      });
      listaCanal.map((dato) => {
        if (dato.idcompania === compania.value) {
          canalesFiltrados.push(dato);
        }
        return null;
      });
      listaProducto.map((dato) => {
        if (dato.idcompania === compania.value) {
          productosFiltrados.push(dato);
        }
        return null;
      });
      setListaCanalFiltered(canalesFiltrados);
      setListaProcesoFiltered(procesosFiltrados);
      setListaProductoFiltered(productosFiltrados);
      setCat_RO_localFiltered(
        filtraCategoria_XPais(catRiesgos_local, compania)
      );
      setSubCat_RO_localFiltered(
        filtraCategoria_XPais(subCatRiesgos_local, compania)
      );
    }
  };

  const getSubRiesgoLocal = (catNivel1) => {
    setSubCatRiesgos_Local(null);
    if (catNivel1) {
      let categoriasNivel3 = subCatRiesgos_local.filter(
        (e) => e.categoria_riesgos_n1 === catNivel1
      );
      //* Filtra categorias de RO según territorio ///////////////

      setSubCat_RO_localFiltered(categoriasNivel3);
    }
  };

  //* Carga la lista de elementos correspondientes según la selección de Elemento de NEgocio PPal

  const setElementos = (event) => {
    setTipoElemento(event);
    if (event !== null) {
      if (event.label === "Proceso") {
        setTipoComponente("Select");
        setTipoElementoSelect(listaProceso_filtered);
        setElementoEv(null);
      } else if (event.label === "Proveedor") {
        setTipoComponente("Select");
        setTipoElementoSelect(listaProveedor_filtered);
        setElementoEv(null);
      } else if (event.label === "Producto") {
        setTipoComponente("Select");
        setTipoElementoSelect(listaProducto_filtered);
        setElementoEv(null);
      } else if (event.label === "Canal") {
        setTipoComponente("Select");
        setTipoElementoSelect(listaCanal_filtered);
        setElementoEv(null);
      } else if (event.label === "Proyecto") {
        setTipoComponente("Select");
        setTipoElementoSelect(listaProyecto_filtered);
        setElementoEv(null);
      } else if (event.label === "Otras iniciativas") {
        setTipoComponente("Input");
        setElementoEv(null);
      }
    }
  };

  async function ContratoProveedor(proveedor, elemento) {
    const response_proveedor = await axios.get(
      process.env.REACT_APP_API_URL + "/maestros_ro/proveedor/" + proveedor + "/",
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + serviceAAD.getToken(),
        },
      }
    );
    if (response_proveedor.data.Contratos) {
      let contratosP = [];

      response_proveedor.data.Contratos.map((contr) => {
        contratosP.push({
          value: contr.Id_contrato,
          label: contr.Nombre,
          principal: true,
        });
      });
      if (elemento === "Principal") {
        contratosP.map((o) => {
          o.principal = 1;
        });
        setListaContratosPrin(contratosP);
      } else if (elemento === "Otros") {
        contratosP.map((o) => {
          o.principal = 0;
        });
        setListaContratos(contratosP);
      }
    }
  }

  //* Controla los checkboxes, recibe su valor y lo guarda en un string ///////////////////////

  const handleOnChangeDetalleSOX = (position) => {
    let tempDetalleSOX = listaDetalleSox;
    tempDetalleSOX[position].state = !listaDetalleSox[position].state;

    console.log(tempDetalleSOX);

    setListaDetalleSox(tempDetalleSOX);
  };

  const handleOnChangePosition = (position) => {
    const updatedCheckedState = checkedState.map((item, index) =>
      index === position ? !item : item
    );
    setCheckedState(updatedCheckedState);

    const arrayAristas = updatedCheckedState.reduce(
      (arista, currentState, index) => {
        if (currentState === true) {
          arista.push(listaAristas[index].value);
          return arista;
        }
        return arista;
      },
      []
    );
    setIsCheckedRO(
      arrayAristas.some(function (element) {
        return element === "RO";
      })
    );

    setIsCheckedSOX(
      arrayAristas.some(function (element) {
        return element === "SOX";
      })
    );

    var stringAristas = arrayAristas.join(",");
    setAristas(stringAristas);
  };

  //* Filtra segun la categoria Nivel 1 y las subcategorías de riesgo correspondientes*/

  const getSubCatRiesgo = (catNivel1, type) => {
    setSubRiesgoRo(null);
    let categoriasNivel3;
    if (catNivel1) {
      categoriasNivel3 = subCatRiesgo.filter(
        (e) => e.categoria_riesgos_n1 === catNivel1
      );
      setsubCatRiesgoFiltered(categoriasNivel3);
    }

    if (catNivel1 == 53 || catNivel1 == 26) {
      setMalverObligatorio(true);
    }

    if (type === "SOX") {
      setListaCatSOX(categoriasNivel3);
    }

    console.log(categoriasNivel3);
  };

  const checkValidez = () => {
    if (nombre_riesgo !== null && nombre_riesgo !== "") {
      if (tipoElemento !== null) {
        if (elemento !== null) {
          if (isCheckedRO) {
            if (riesgoRO !== null) {
              if (riesgoCont !== null) {
                if (riesgoRO.value == 53 || riesgoRO.value == 26) {
                  if (malversacion !== null) {
                    return true;
                  } else {
                    return false;
                  }
                } else {
                  return true;
                }
              } else {
                return false;
              }
            } else {
              return false;
            }
          } else if (aristas !== null) {
            return true;
          } else {
            return false;
          }
        } else {
          return false;
        }
      } else {
        return false;
      }
    } else {
      return false;
    }
  };

  //** Envía los datos al back */

  async function getValidador(elemento) {
    const tipoElemento_peticion = tipoElemento
      ? Object.values(tipoElemento)[1]
      : null;
    let dataPeticion = { [tipoElemento_peticion]: elemento };

    dataPeticion = JSON.stringify(dataPeticion);

    const response = await axios
      .post(process.env.REACT_APP_API_URL + "/validador", dataPeticion, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + serviceAAD.getToken(),
        },
      })
      .then(function (response) {
        if (response.status >= 200 && response.status < 300) {
          if (response.data.validated !== null) {
            setValidated(response.data.validated);
          } else {
            setValidated("No tiene un validador asignado");
          }
        } else if (response.status >= 500) {
          return "No tiene un validador asignado";
        }
      });
  }

  const sendData = async (event) => {
    event.preventDefault();

    setHabilitarBoton(false);

    async function limpiar(state) {
      setTimeout(() => {
        setHabilitarBoton(true);
        setEstadoPost({ id: 0, data: null });
      }, 3000);
    }

    if (checkValidez() === false) {
      setEstadoPost(7);
    } else if (checkValidez() === true) {
      let productos = [];
      let canales = [];
      let procesoData;

      if (producto !== null) {
        producto.map((e) => {
          productos.push(Object.values(e)[0]);
        });
      }
      if (canal !== null) {
        canal.map((e) => {
          canales.push(Object.values(e)[0]);
        });
      }
      let elemento_ppal_evaluado;
      if (Object.values(tipoElemento)[1] === "Otras iniciativas") {
        elemento_ppal_evaluado = elemento ? elemento : null;
      } else if (Object.values(tipoElemento)[1] === "Proveedor") {
        elemento_ppal_evaluado = elemento ? elemento : null;
      } else {
        elemento_ppal_evaluado = elemento ? Object.values(elemento)[0] : null;
      }
      let stringAristas = strAristas.map((obj) => obj.label).join(",");
      console.log({ stringAristas });
      var datosRiesgo = {
        nombre_riesgo: nombre_riesgo,
        idcompania: compania.value,
        descripcion_general: descripcion,
        arista_del_riesgo: strAristas ? stringAristas : null,
        tipo_de_evento: 1,
        estado: 1,
        tipo_elemento_evaluado: Object.values(tipoElemento)[1],
        elemento_ppal_evaluado: elemento_ppal_evaluado,
        idproceso: proceso ? Object.values(proceso)[0] : null,
        idcanal: canales,
        idproducto: productos,
        efectividad_control: efectividadCtrl,
        efectividad_control: efectividadCtrl,
        metodo_efectividad_ctrol: metEfectividadCtrl,
        justificacion_participacion_causa: justificacionCausas,
        idproveedor: Proveedor ? Proveedor.ID_SAP : null,
        Id_contrato: contratoOtros,
        Id_contrato_prin: contratoSelec,
      };

      JSON.stringify(datosRiesgo);
      //Guarda
      axios
        .post(process.env.REACT_APP_API_URL + "/riesgos/", datosRiesgo, {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + serviceAAD.getToken(),
          },
        })
        .then(async function (response) {
          if (
            response.status >= 200 &&
            response.status < 300 &&
            isCheckedSOX === true
          ) {
            let tempAseveraciones = listaDetalleSox.filter((obj) => obj.state);
            let aseveracionesSOX = tempAseveraciones.map((obj) => obj.name);
            aseveracionesSOX = aseveracionesSOX.join(";");

            let data = {
              malversacion: fraudeMalv ? fraudeMalv.value : null,
              fraude_rep_financiero: fraudeRepFin ? fraudeRepFin.value : null,
              aseveraciones: aseveracionesSOX,
              idriesgo: response.data.idriesgo,
              id_subcategoria_riesgo: fraudeInt ? fraudeInt.value : null,
            };

            let requestDetSOX = await Queries(data, "/rx_detalle_sox", "PUT");

            console.log(requestDetSOX);
            if (requestDetSOX.status === 201) {
              setEstadoPost(2);
              setTimeout(() => {
                setEstadoPost(0);
              }, 4000);
            }
          }
          if (
            response.status >= 200 &&
            response.status < 300 &&
            isCheckedRO === true
          ) {
            let detalleRiesgo = {
              id_riesgo: response.data.idriesgo,
              idcatro_corporativa: riesgoRO ? Object.values(riesgoRO)[0] : null,
              idsubcatro_corporativa: subRiesgoRO
                ? Object.values(subRiesgoRO)[0]
                : null,
              idcatro_local: riesgoLocal ? Object.values(riesgoLocal)[0] : null,
              idsubcatro_local: subRiesgoLocal
                ? Object.values(subRiesgoLocal)[0]
                : null,
              riesgo_contingencia: riesgoCont
                ? Object.values(riesgoCont)[0]
                : null,
              descripcion_complementaria: descripComplementaria,
              malversacion: malversacion,
              nivel_riesgo_inherente: nivelRiesgoInherente,
              exposicion_residual: exposicionResidual,
              nivel_riesgo_residual: nivelRiesgoResidual,
              modelos: modelosDetalleRO,
            };
            JSON.stringify(detalleRiesgo);

            axios
              .post(process.env.REACT_APP_API_URL + "/rx_detalle_ro/", detalleRiesgo, {
                headers: {
                  "Content-Type": "application/json",
                  Authorization: "Bearer " + serviceAAD.getToken(),
                },
              })
              .then(function (responseDetalleRO) {
                localStorage.setItem("idRiesgo", response.data.idriesgo);
                setEstadoPost(2);
                setTimeout(() => {
                  history.push("/editarRiesgo");
                }, 2000);
              })
              .catch((errors) => {
                // react on errors.
                console.error(errors);
              });
          } else if (response.status >= 200 && response.status < 300) {
            localStorage.setItem("idRiesgo", response.data.idriesgo);
            setEstadoPost(2);
          } else if (response.status >= 500) {
            setEstadoPost(5);

            if (
              response.data.non_field_errors[0] ===
              "The fields idactivo must make a unique set."
            ) {
              setEstadoPost(6);
            }
          } else if (response.status >= 400 && response.status < 500) {
            setEstadoPost(4);
          }
        })
        .catch((error) => {
          console.error(error);
        });
      setValidated(true);
    }
    limpiar();
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
      console.error(error.response, fuente);
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
      console.error(error);
    }
  };

  const FiltrarProveedor = (e) => {
    let elemento = e.value;
    setShowProveedor(true);
  };

  return (
    <>
      <ModalProveedor
        showModalProveedor={showModalProveedor}
        setShowModalProveedor={setShowModalProveedor}
        setProveedor={setProveedor}
        ContratoProveedorPrin={ContratoProveedor}
        setListaContratosPrin={setListaContratosPrin}
        setListaContratos={setListaContratos}
        identificacionModal={"Riesgos"}
        setElementoEv={setElementoEv}
        tipoProveedor={tipoProveedor}
        setShowProveedor={setShowProveedor}
        setShowContratos={setShowContratos}
        setNombreElemento={setNombreElemento}
        setNombreElementoOtros={setNombreElementoOtros}
      ></ModalProveedor>
      {loadingData ? (
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
          <div name="infoGeneral" id="infoGeneral"></div>
          <Row>
            <Col>
              <div
                style={{ position: "fixed", zIndex: 10, minWidth: "80vw" }}
                className={classes.content}
              >
                <div className={classes.appBarSpacer}>
                  <Navbar bg="dark" variant="dark" expand="xl">
                    <Container className="justify-content-center">
                      <Navbar id="basic-navbar-nav">
                        <Nav>
                          <Nav.Link href="#infoGeneral" className="link">
                            Información General
                          </Nav.Link>
                          <Nav.Link href="#detalleRO" className="link">
                            Detalle RO
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
                          {habilitarBoton ? (
                            <Nav.Link href="#resumenPorEfecto">
                              {props.permisos.crear ? (
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
                          ) : (
                            <Col className="col-auto" sm={3} xs={3}>
                              <Loader
                                type="Oval"
                                color="#FFBF00"
                                height={30}
                                width={30}
                                style={{
                                  textAlign: "center",
                                  position: "static",
                                }}
                              />
                            </Col>
                          )}
                        </Nav>
                      </Navbar>
                    </Container>
                  </Navbar>
                </div>
              </div>
            </Col>
          </Row>
          <Container className="mb-5 mt-5 ">
            <Form
              id="formData"
              noValidate
              validated={validated}
              onSubmit={sendData}
              className="mb-5 mt-5"
            >
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

              <Row className="mt-5 mb-3">
                <Col md={12}>
                  <h1 className="titulo">Crear Riesgo</h1>
                </Col>
              </Row>

              {/* ///////////////////// ventanas modales //////////////////// */}

              <Row className="mb-3 mt-3">
                <Col md={12}>
                  <h1 className="subtitulo text-center">Información General</h1>
                </Col>
              </Row>
              <Row className="mb-3">
                <Col sm={12} xs={0}></Col>
                <Col>
                  <div className="form-text text-center">
                    * Campos obligatorios
                  </div>
                </Col>
              </Row>
              {/* ID evaluación */}
              <Row className="mb-3">
                <Col sm={4} xs={12} className="label">
                  <label className="form-label">Compañía*</label>
                </Col>
                <Col sm={4} xs={12}>
                  <Select
                    components={animatedComponents}
                    options={companias}
                    //hideSelectedOptions={true}
                    placeholder={"Seleccione la compañia"}
                    onChange={FiltrarMaestros}
                  />
                </Col>
                <Col sm={2} xs={12} className="text-center">
                  <label className="label ">Id Riesgo</label>
                </Col>
                <Col sm={2} xs={12}>
                  <input
                    type="text"
                    disabled
                    className="form-control text-center texto"
                    id="IDevaluacion"
                  ></input>
                </Col>
              </Row>

              {/* Nombre Evaluación */}
              <Row className="mb-3">
                <Col sm={4} xs={12}>
                  <label className="form-label label">Nombre de Riesgo*</label>
                </Col>
                <Col sm={8} xs={12}>
                  <input
                    type="text"
                    className="form-control text-center texto"
                    placeholder="Nuevo"
                    required
                    id="NombreEval"
                    onChange={(e) => {
                      setNombre_riesgo(e.target.value);
                    }}
                  ></input>
                </Col>
              </Row>

              <Row className="mb-3">
                <Col sm={4} xs={12}>
                  <label className="form-label label">
                    Descripción del riesgo*
                  </label>
                </Col>
                <Col sm={8} xs={12}>
                  <textarea
                    className="form-control text-center"
                    placeholder="Descripción del Riesgo"
                    rows="3"
                    id="Descripcion"
                    onChange={(e) => {
                      setDescripcion(e.target.value);
                    }}
                  ></textarea>
                </Col>
              </Row>
              <Row className="mb-3">
                <Col sm={4} xs={12}>
                  <label className="form-label label">
                    Elemento de negocio principal*
                  </label>
                </Col>
                <Col sm={4} xs={12}>
                  <Select
                    value={tipoElemento}
                    options={elementoNegPal}
                    components={animatedComponents}
                    placeholder={"Seleccione Tipo de Elemento"}
                    onChange={(e) => {
                      setElementos(e);
                      if (e.label === "Proveedor") {
                        setShowModalProveedor(true);
                        //FiltrarProveedor(e);
                        setContratoSelec([]);
                        //setListaContratosPrin([]);
                        setTipoComponente("Input");
                        setTipoProveedor("Principal");
                        setNombreElemento(null);
                        setShowProceso(false);
                      } else if (e.label === "Proceso") {
                        setShowProceso(true);
                        setShowProveedor(false);
                      } else {
                        setShowProveedor(false);
                        setShowProceso(false);
                      }
                    }}
                  />
                </Col>

                <Col sm={4} xs={12}>
                  {(() => {
                    if (tipoCompo === "Select") {
                      return (
                        <Select
                          key={listaElementos}
                          options={listaElementos}
                          value={elemento}
                          components={animatedComponents}
                          placeholder={"Seleccione Elemento"}
                          onChange={(e) => {
                            getValidador(e.value);
                            setElementoEv(e);
                            setCicloProceso(e.ciclo);
                          }}
                        />
                      );
                    } else if (tipoCompo === "Input") {
                      return (
                        <input
                          type="text"
                          disabled={
                            tipoElemento && tipoElemento.label !== "Proveedor"
                              ? false
                              : true
                          }
                          className="form-control text-left texto"
                          placeholder={
                            tipoElemento && tipoElemento.label !== "Proveedor"
                              ? "Escriba la iniciativa"
                              : "Proveedor"
                          }
                          defaultValue={nombreElemento}
                          onChange={(e) => {
                            setElementoEv(e.target.value);
                          }}
                        ></input>
                      );
                    }
                  })()}
                </Col>
              </Row>

              {showProveedor ? (
                <Row className="mb-3">
                  <Col sm={4} xs={12}>
                    <label className="form-label label">
                      Contratos Asociados*
                    </label>
                  </Col>
                  <Col sm={8} xs={12}>
                    <Select
                      value={contratoSelec}
                      options={listaContratosPrin}
                      components={animatedComponents}
                      isMulti
                      placeholder={"Seleccione el contrato"}
                      onChange={(e) => {
                        let contratos = [];
                        e.map((a) => contratos.push(a));
                        setContratoSelec(contratos);
                      }}
                    />
                  </Col>
                </Row>
              ) : (
                <></>
              )}

              {showProceso ? (
                <Row className="mb-3">
                  <Col sm={4} xs={12}>
                    <label className="form-label label">Ciclo</label>
                  </Col>
                  <Col sm={8} xs={12}>
                    <input
                      type="text"
                      disabled={true}
                      className="form-control text-left texto"
                      placeholder={"Ciclo"}
                      defaultValue={cicloProceso ? cicloProceso : null}
                    ></input>
                  </Col>
                </Row>
              ) : (
                <></>
              )}

              {/*/////////////////////Otros Elementos*/}

              <Row className="mb-3">
                <Col md={12}>
                  <hr />
                  <label className="form-label label">
                    Otros elementos de negocio relacionados
                  </label>
                </Col>
              </Row>

              <Row className="mb-3">
                <Col sm={4} xs={12}>
                  <label className="form-label label">Proceso</label>
                </Col>
                <Col sm={8} xs={12}>
                  <Select
                    isClearable
                    components={animatedComponents}
                    options={listaProceso_filtered}
                    value={proceso}
                    placeholder={"Seleccione los procesos  asociados"}
                    onChange={(e) => {
                      setProceso(e);
                    }}
                  />
                </Col>
              </Row>
              <Row className="mb-3">
                <Col sm={4} xs={12}>
                  <label className="form-label label">Producto</label>
                </Col>
                <Col sm={8} xs={12}>
                  <Select
                    components={animatedComponents}
                    isMulti
                    options={listaProducto_filtered}
                    value={producto}
                    placeholder={"Seleccione el producto"}
                    onChange={(e) => {
                      var productos = [];
                      e.map((a) => productos.push(a));
                      setProducto(productos);
                    }}
                  />
                </Col>
              </Row>
              <div name="detalleRO" id="detalleRO"></div>
              <Row className="mb-3">
                <Col sm={4} xs={12}>
                  <label className="form-label label">Canal</label>
                </Col>
                <Col sm={8} xs={12}>
                  <Select
                    id={"Canal"}
                    components={animatedComponents}
                    isMulti
                    value={canal}
                    options={listaCanal_filtered}
                    placeholder={"Seleccione el canal"}
                    onChange={(e) => {
                      var canales = [];
                      e.map((a) => canales.push(a));
                      setCanal(canales);
                    }}
                  />
                </Col>
              </Row>

              <Row className="mb-3">
                <Col sm={4} xs={12}>
                  <label className="form-label label">Proveedor</label>
                </Col>
                <Col sm={2} xs={12} className="text-left">
                  <button
                    type="button"
                    className="btn botonPositivo2"
                    onClick={() => {
                      setTipoProveedor("Otros");
                      setShowModalProveedor(true);
                      setContratoOtros(null);
                      setListaContratos([]);
                    }}
                  >
                    Agregar
                  </button>
                </Col>
                <Col sm={1} xs={12} className="text-left">
                  <button
                    type="button"
                    className="btn botonNegativo2"
                    onClick={() => {
                      setContratoOtros([]);
                      setNombreElementoOtros(null);
                      setProveedor(null);
                      setShowContratos(false);
                    }}
                  >
                    Quitar
                  </button>
                </Col>
                <Col>
                  <input
                    type="text"
                    disabled
                    className="form-control text-left texto"
                    placeholder={"Proveedor"}
                    defaultValue={nombreElementoOtros}
                  ></input>
                </Col>
              </Row>

              {!!showContratos ? (
                <Row className="mb-3">
                  <Col sm={4} xs={12}>
                    <label className="form-label label">
                      Contratos Asociados​
                    </label>
                  </Col>
                  <Col sm={8} xs={12}>
                    <Select
                      value={contratoOtros}
                      options={listaContratos}
                      components={animatedComponents}
                      isMulti
                      placeholder={"Seleccione el contrato"}
                      onChange={(e) => {
                        let contrato = [];
                        e.map((a) => contrato.push(a));
                        setContratoOtros(contrato);
                      }}
                    />
                  </Col>
                </Row>
              ) : (
                <></>
              )}

              {/* ///////////////////////////////////////////  Usuarios //////////////////////////////////////// */}

              <Row className="mb-3">
                <Col sm={4} xs={12}>
                  <label className="form-label label">
                    Aristas del riesgo*
                  </label>
                </Col>
                <Col sm={8}>
                <Select
                  options={listaAristas}
                  isMulti
                  name="aristas"
                  id="aristas"
                  onChange={(e) => {
                    FiltrarAristas(e);
                    const fiteredProgramas = new Set();
                    const newArray = e.filter((element) => {
                      const isDuplicate = fiteredProgramas.has(element.label);

                      fiteredProgramas.add(element.label);

                      if (!isDuplicate) {
                        return true;
                      } else {
                        return false;
                      }
                    });

                    console.log("newArray", newArray);
                    setStrAristas(newArray);
                    if (newArray.some((obj) => obj.label === "RO")) {
                      setIsCheckedRO(true);
                    }else if(newArray.some((obj) => obj.label === "SOX")){
                      setIsCheckedSOX(true);
                    } 
                    else {
                      setIsCheckedRO(false);
                      setIsCheckedSOX(false);
                    }

                    // field.onChange(newArray);
                  }}
                />
              </Col>
              </Row>
              {/* /////////////////////////////////////// Checkbox list ///////////////////////////////////////// */}
              
              {/* Riesgo operacional
        
        <RiesgoOperacional />*/}
              {(() => {
                if (isCheckedRO === true) {
                  return (
                    <Box>
                      <hr />
                      <Row className="mb-3 mt-4">
                        <Col md={12}>
                          <h1 className="subtitulo text-center">Detalle RO</h1>
                        </Col>
                      </Row>
                      <Row className="mb-3 mt-4">
                        <Col sm={4} xs={12}>
                          <label className="form-label label">
                            Categoria del Riesgo Corporativo*
                          </label>
                        </Col>
                        <Col sm={8} xs={12}>
                          <Select
                            components={animatedComponents}
                            options={catRiesgos}
                            required={true}
                            value={riesgoRO}
                            placeholder={"Categrorias"}
                            onChange={(e) => {
                              setRiesgoRo(e);
                              getSubCatRiesgo(e.value);
                              console.log(e);
                            }}
                          />
                        </Col>
                      </Row>
                      <Row className="mb-3 mt-4">
                        <Col sm={4} xs={12}>
                          <label className="form-label label">
                            Subcategoria del Riesgo Corporativo*
                          </label>
                        </Col>
                        <Col sm={8} xs={12}>
                          <Select
                            isClearable
                            components={animatedComponents}
                            options={subCatRiesgo_filtered}
                            required={true}
                            value={subRiesgoRO}
                            placeholder={"Subcategrorias"}
                            onChange={(e) => setSubRiesgoRo(e)}
                          />
                        </Col>
                      </Row>
                      <Row className="mb-3 mt-4">
                        <Col sm={4} xs={12}>
                          <label className="form-label label">
                            Categoria del riesgo RO Local
                          </label>
                        </Col>
                        <Col sm={8} xs={12}>
                          <Select
                            isClearable
                            components={animatedComponents}
                            options={catRiesgosRO_filtered}
                            required={true}
                            value={riesgoLocal}
                            placeholder={"Categrorias RO local"}
                            onChange={(e) => {
                              setRiesgoLocal(e);
                              getSubRiesgoLocal(e.value);
                            }}
                          />
                        </Col>
                      </Row>
                      <Row className="mb-3">
                        <Col sm={4} xs={12}>
                          <label className="form-label label">
                            Subcategoria del riesgo RO Local
                          </label>
                        </Col>
                        <Col sm={8} xs={12}>
                          <Select
                            isClearable
                            components={animatedComponents}
                            options={subCatRiesgosRO_filtered}
                            required={true}
                            value={subRiesgoLocal}
                            placeholder={"Subcategrorias RO local"}
                            onChange={(e) => setSubRiesgoLocal(e)}
                          />
                        </Col>
                      </Row>
                      <Row className="mb-3">
                        <Col sm={4} xs={12}>
                          <label className="form-label label">
                            Riesgo de la contingencia*
                          </label>
                        </Col>
                        <Col sm={4} xs={12}>
                          <Select
                            components={animatedComponents}
                            options={[
                              { value: 0, label: "No" },
                              { value: 1, label: "Si" },
                            ]}
                            required={true}
                            onChange={(e) => {
                              setRiesgoCont(e);
                            }}
                          />
                        </Col>
                        <Col sm={2} xs={12}>
                          <label className="form-label label">
                            Malversación*
                          </label>
                        </Col>
                        <Col sm={2} xs={12}>
                          <Select
                            isClearable
                            components={animatedComponents}
                            options={[
                              { value: "No", label: "No" },
                              { value: "Si", label: "Si" },
                            ]}
                            onChange={(e) => {
                              setMalversacion(e.label);
                            }}
                            required={malverObligatorio}
                          />
                        </Col>
                      </Row>
                      <Row className="mb-4">
                        <Col sm={4} xs={12}>
                          <label className="form-label label">
                            Descripción complementaria del riesgo
                          </label>
                        </Col>
                        <Col sm={8} xs={12}>
                          <textarea
                            className="form-control text-center"
                            placeholder="Descripción complementaria del evento"
                            rows="3"
                            id="Descripcion"
                            onChange={(e) => {
                              setDescComplementaria(e.target.value);
                            }}
                          ></textarea>
                        </Col>
                      </Row>

                      <Row className="mb-4">
                        <Col sm={4} xs={12}>
                          <label className="form-label label">Modelo(s)</label>
                        </Col>
                        <Col sm={8} xs={12}>
                          <textarea
                            className="form-control text-center"
                            placeholder='Digite el(los) ID de los modelos. Separados por  ","  (coma)'
                            rows="2"
                            id="Modelo"
                            onChange={(e) => {
                              setModelosDetalleRO(e.target.value);
                            }}
                          ></textarea>
                        </Col>
                      </Row>
                    </Box>
                  );
                } else if (isCheckedRO === false) {
                  return null;
                }
              })()}
              <hr />
              {isCheckedSOX ? (
                <>
                  <Row className="mb-3 mt-4">
                    <Col md={12}>
                      <h1 className="subtitulo text-center">Detalle SOX</h1>
                    </Col>
                  </Row>

                  {listaDetalleSox.map(({ name, value }, index) => {
                    return (
                      <Row className="mb-3 mt-3">
                        <Col sm={3}>
                          <div>
                            <input
                              type="checkbox"
                              id={`custom-checkbox-sox-${index}`}
                              name={name}
                              value={value}
                              defaultChecked={listaDetalleSox[index].state}
                              onChange={() => handleOnChangeDetalleSOX(index)}
                            />
                            <label
                              className="form-label texto ml-2"
                              htmlFor={`custom-checkbox-sox-${index}`}
                            >
                              {name}
                            </label>
                          </div>
                        </Col>{" "}
                      </Row>
                    );
                  })}

                  <Row className="mb-3 mt-4">
                    <Col sm={4} xs={12}>
                      <label className="form-label label">
                        Categoría de riesgo de fraude en el reporte financiero
                      </label>
                    </Col>
                    <Col sm={8} xs={12}>
                      <Select
                        components={animatedComponents}
                        options={listaCatSOX}
                        required={true}
                        value={fraudeInt}
                        placeholder={"Categrorias"}
                        onChange={(e) => {
                          setFraudeInt(e);
                        }}
                      />
                    </Col>
                  </Row>
                  <Row className="mb-3 mt-4">
                    <Col sm={4} xs={12}>
                      <label className="form-label label">
                        Fraude Malversación
                      </label>
                    </Col>
                    <Col sm={8} xs={12}>
                      <Select
                        components={animatedComponents}
                        options={[
                          { label: "SI", value: "SI" },
                          { label: "NO", value: "NO" },
                        ]}
                        required={true}
                        value={fraudeMalv}
                        placeholder={"Fraude Malversación"}
                        onChange={(e) => {
                          setFraudeMalv(e);
                        }}
                      />
                    </Col>
                  </Row>
                  <Row className="mb-3 mt-4">
                    <Col sm={4} xs={12}>
                      <label className="form-label label">
                        Fraude Reporte Financiero
                      </label>
                    </Col>
                    <Col sm={8} xs={12}>
                      <Select
                        components={animatedComponents}
                        options={[
                          { label: "SI", value: "SI" },
                          { label: "NO", value: "NO" },
                        ]}
                        required={true}
                        value={fraudeRepFin}
                        placeholder={"Fraude Reporte Financiero"}
                        onChange={(e) => {
                          setFraudeRepFin(e);
                        }}
                      />
                    </Col>
                  </Row>
                  <hr />
                </>
              ) : null}
              <Row className="mb-5 mt-5"></Row>
            </Form>
          </Container>
        </>
      )}
    </>
  );
}
