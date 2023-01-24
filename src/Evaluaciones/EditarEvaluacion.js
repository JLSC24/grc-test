import React, { useState, useEffect } from "react";
import ResumenEvaluacion from "./ResumenEvaluacion";
import ModalBuscarRiesgos from "./ModalBuscarRiesgos";
import ModalAlerta from "../Globales/ModalAlerta";
import { Row, Col, Form, Alert, Container } from "react-bootstrap";
import { Link, useHistory } from "react-router-dom";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import { Button, Modal } from "react-bootstrap";
import PropTypes, { object } from "prop-types";
import { alpha } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";

import Switch from "@mui/material/Switch";

import { visuallyHidden } from "@mui/utils";

import { withStyles, makeStyles } from "@material-ui/core/styles";
import ModalMotivoInactiva from "./ModalMotivoInactiva";
import Loader from "react-loader-spinner";

import axios from "axios";
/* import TablePagination from "@material-ui/core/TablePagination"; */

import AADService from "../auth/authFunctions";

import { UsuarioContext } from "../Context/UsuarioContext";
import Checkbox from "@material-ui/core/Checkbox";
import ModalProveedor from "../Maestros/Proveedores/ModalProveedor";

import ModalEstadoCrear from "./Modales/ModalEstadoCrear";

const _ = require("lodash");

const serviceAAD = new AADService();
/* const style = {
  tree: {
    base: {
      listStyle: "none",
      backgroundColor: "#fafafa",
      margin: 0,
      padding: 0,
      color: "#000000DE",
      fontFamily: "CIBFont Sans Book",
      fontSize: "120%",
    },
    node: {
      activeLink: {
        background: "#b6b6b6",
      },
      toggle: {
        base: {
          position: "relative",
          display: "inline-block",
          verticalAlign: "top",
          marginLeft: "-5px",
          height: "24px",
          width: "24px",
        },
        wrapper: {
          position: "absolute",
          top: "50%",
          left: "50%",
          margin: "-7px 0 0 -7px",
          height: "14px",
        },
        height: 14,
        width: 14,
        arrow: {
          fill: "#000000DE",
          strokeWidth: 0,
        },
      },
      header: {
        base: {
          display: "inline-block",
          verticalAlign: "top",
          color: "#000000DE",
        },
        connector: {
          width: "2px",
          height: "12px",
          borderLeft: "solid 2px black",
          borderBottom: "solid 2px black",
          position: "absolute",
          top: "0px",
          left: "-21px",
        },
        title: {
          lineHeight: "24px",
          verticalAlign: "middle",
        },
      },
      subtree: {
        listStyle: "none",
        paddingLeft: "19px",
      },
      loading: {
        color: "#ff7f41",
      },
    },
  },
}; */

/* function AlertDismissibleExample(data) {
 /*  let temp = [];
  let errors = "";
  let temp2 = [];

  if (data.alerta.data !== null && data.alerta.data !== undefined) {
    temp = JSON.stringify(data.alerta.data).split('"');
    temp.map((dat, index) => {
      if (index % 2 !== 0) {
        temp2.push(dat);
      }
      return null;
    });
    for (let index = 0; index < temp2.length; index += 2) {
      errors = errors + temp2[index] + ": " + temp2[index + 1] + "\n";
    }
  } 
  
  switch (data.alerta.id) {
    case 1:
      return (
        <Alert className="alerta" variant="warning">
          Alerta
        </Alert>
      );
    case 2:
      return <Alert variant="success">Guardó exitosamente</Alert>;
    case 3:
      return <Alert variant="danger"></Alert>;
    case 4:
      return <Alert variant="warning">{errors}</Alert>;
    case 5:
      return <Alert variant="danger">Error en el servidor</Alert>;
    case 6:
      return (
        <Alert variant="warning">
          Ya existe una evaluación para el activo seleccionado
        </Alert>
      );
    default:
      return <p></p>;
  }
} */
function AlertDismissibleExample({ alerta, estado, data }) {
  // let temp = [];
  // let errors = "";
  // let temp2 = [];

  // if (data.alerta.data !== null && data.alerta.data !== undefined) {
  //   temp = JSON.stringify(data.alerta.data).split('"');
  //   temp.map((dat, index) => {
  //     if (index % 2 !== 0) {
  //       temp2.push(dat);
  //     }
  //     return null;
  //   });
  //   for (let index = 0; index < temp2.length; index += 2) {
  //     errors = errors + temp2[index] + ": " + temp2[index + 1] + "\n";
  //   }

  switch (alerta) {
    case 1:
      return <Alert variant="warning">Alerta</Alert>;

    case 2:
      return (
        <Alert variant="success">
          {estado === "Creada" ? "Editado" : estado} exitosamente
        </Alert>
      );

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

const useStyles = makeStyles((theme) => ({
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
  paper: {
    backgroundColor: "white",
    width: "100%",
    //margintom: theme.spacing(2),
  },
  head: {
    backgroundColor: "#2c2a29",
    color: theme.palette.common.white,
  },
}));

const animatedComponents = makeAnimated();

export default function EditarEvaluacion(props) {
  const serviceAAD = new AADService();
  const [datEvaluacion, setDatEvaluacion] = useState(null);

  //* Reciben los datos para llenar cada uno de los Select

  const [elementoNegPal, setElementoNegPal] = useState([]);
  const [companias, setCompanias] = useState([]);
  const [listaElementos, setTipoElementoSelect] = useState([]);
  const [listaProceso, setListaProceso] = useState([]);
  const [listaProveedores, setListaProveedores] = useState([]);
  //const [listaProveedor, setListaProveedor] = useState(["sin informacion"]);
  const [listaProducto, setListaProducto] = useState([]);
  const [listaCanal, setListaCanal] = useState([]);
  const [listaContratos, setListaContratos] = useState([]);
  const [listaContratosPrin, setListaContratosPrin] = useState([]);
  const [contrato, setContrato] = useState([]);
  const [contratoSelec, setContratoSelec] = useState([]);
  const [contratoOtros, setContratoOtros] = useState([]);
  const [showValidadorOtrasIniciativas, setShowValidadorOtrasIniciativas] =
    useState(false);
  const [Proveedor, setProveedor] = useState([]);
  const [showProveedor, setShowProveedor] = useState(false);
  const [showContratos, setShowContratos] = useState(false);
  //* REciben los datos filtrados

  const [listaProceso_filtered, setListaProcesoFiltered] = useState([]);
  const [listaProveedor_filtered, setListaProveedorFiltered] = useState([]);
  const [listaProyecto_filtered, setListaProyectoFiltered] = useState([]);
  const [listaProducto_filtered, setListaProductoFiltered] = useState([]);
  const [listaCanal_filtered, setListaCanalFiltered] = useState([]);
  const [responsable, setResponsable] = useState([]);
  //* Reciben los datos cargados o elegidos por el usuario

  const [idEvaluacion, setIdEvlauacion] = useState(null);
  const [estadoEval, setEstadoEval] = useState(null);
  const [compania, setCompania] = useState(null);
  const [nombreEvaluacion, setNombreEvaluacion] = useState(null);
  const [correoValidador, setCorreoValidador] = useState(null);
  const [tipoElemento, setTipoElemento] = useState(null);
  const [elemento, setElementoEv] = useState(null);
  const [proceso, setProceso] = useState(null);
  const [canal, setCanal] = useState(null);
  const [producto, setProducto] = useState(null);
  const [validador, setValidador] = useState(null);
  const [analista, setAnalista] = useState(null);
  const [fechaCreacion, setFechaCreacion] = useState(null);
  const [fechaValidacion, setFechaValidac] = useState(null);
  const [fechaInactivacion, setfechaInactivac] = useState(null);

  //* controla el comportamiento de los componentes

  const [tipoCompo, setTipoComponente] = useState("Select");
  const [validated, setValidated] = useState(false);
  const history = useHistory();
  const [showAlerta, setShowAlerta] = useState(false);
  const [textAlerta, setTextAlerta] = useState(false);

  const [dataGrid, setDataGrid] = useState([]);
  const [isShowingAlert, setShowingAlert] = useState(false);
  const [rolValidador, setRolValidador] = useState(false);
  const classes = useStyles();
  const [idOtrasIniciativas, setIdOtrasIniciativas] = useState(false);
  //const [estadoPost, setEstadoPost] = useState([]);

  //* variables para modal buscar riesgos
  const [listaGeneralRiesgos, setListaGeneralRiesgos] = useState([]);
  const [disableAll, setDisableAll] = useState(false);
  const [modalShow, setModalShow] = React.useState(false);
  const [modalShowMotivo, setModalShowMotivo] = React.useState(false);
  const [disableValidador, setDisableValidador] = useState(true);
  //* variables para modal Motivo inactivacion
  const [riesgoInactivado, setRiesgosInactivado] = useState([]);

  //* Variables para tabla de Riesgos Activos

  const [rerender, setRerender] = useState(0);
  const [consolidadoRiesgos, setConsolidadoRiesgos] = useState([]);
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("idriesgo");
  const [selected, setSelected] = React.useState([]);
  const [dataRiesgos_Eval, setDataRiesgos_Eval] = useState([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const correoAnalistaLog = serviceAAD.getUser().userName;
  const [estadoPost, setEstadoPost] = useState({
    alerta: { id: 0, data: null },
  });
  const [loadingData, setLoadingData] = React.useState(false);

  const { dataUsuario } = React.useContext(UsuarioContext);
  const [responsableSelected, setResponsableSelected] = useState(null);
  const [nombreElemento, setNombreElemento] = React.useState(null);
  const [nombreElementoOtros, setnombreElementoOtros] = React.useState(null);
  const [showModalProveedor, setShowModalProveedor] = React.useState(false);
  const [showModalAlertaGuardar, setShowModalAlertaGuardar] =
    React.useState(false);
  const [enviarInfo, setEnviarInfo] = React.useState(false);
  const [tipoProveedor, setTipoProveedor] = useState([]);
  const [stateBussiness, setStateBussiness] = useState(false);
  const [selectedValueResponsable, setSelectedValueResponsable] =
    useState(null);

  const [selectedInactivos, setSelectedInactivos] = React.useState([]);

  const [flagEstado, setFlagEstado] = useState(false);
  const [showModalEstadoCrear, setShowModalEstadoCrear] = React.useState(false);

  useEffect(() => {
    setLoadingData(true);

    let correoUsuario = serviceAAD.getUser().userName.toLowerCase();

    let companias;
    let elementosNegPpal;
    let listaProcesos;
    let listaProductos;
    let listaCanales;
    let ubicacion_elementoPpal;
    let ubicacion_Proceso;
    let evaluacion;
    let productos;
    let canales;
    let riesgosXEvaluacion;
    let riesgosActivos = [];
    let riesgosInactivos = [];
    let listaProveedor;

    //*Recibe los datos de la compania ////////////////////////
    const getCompanias = async () => {
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

    //* Recibe los datos de los elementos de negocio prinicpales ///////
    const getElementosNegPpal = async () => {
      try {
        const response_elemNegPpal = await axios.get(
          process.env.REACT_APP_API_URL + "/generales/Evaluaciones/Tipo_elemento_negocio_principal",
          {
            headers: {
              Authorization: "Bearer " + serviceAAD.getToken(),
            },
          }
        );
        elementosNegPpal = await response_elemNegPpal.data.map(
          ({ idm_parametrosgenerales: value, valor: label }) => ({
            value,
            label,
          })
        );
        setElementoNegPal(elementosNegPpal);
      } catch (error) {
        console.error(error);
      }
    };
    //* Recibe los datos de los procesos ///////////////////////
    const getListaProcesos = async () => {
      try {
        const response_procesos = await axios.get(
          process.env.REACT_APP_API_URL + "/ultimonivel/Proceso",
          {
            headers: {
              Authorization: "Bearer " + serviceAAD.getToken(),
            },
          }
        );
        listaProcesos = await response_procesos.data.map(
          ({ id: value, nombre: label, idcompania }) => ({
            value,
            label,
            idcompania,
          })
        );
        setListaProceso(listaProcesos);
      } catch (error) {
        console.error(error);
      }
    };
    //* Recibe los datos de los productos ///////////////////////
    const getProductos = async () => {
      try {
        const response_productos = await axios.get(
          process.env.REACT_APP_API_URL + "/ultimonivel/Producto",
          {
            headers: {
              Authorization: "Bearer " + serviceAAD.getToken(),
            },
          }
        );
        listaProductos = await response_productos.data.map(
          ({ id: value, nombre: label, idcompania }) => ({
            value,
            label,
            idcompania,
          })
        );
        setListaProducto(listaProductos);
      } catch (error) {
        console.error(error);
      }
    };
    //* Recibe los datos de los canales ///////////////////////
    const getCanales = async () => {
      try {
        const response_canales = await axios.get(
          process.env.REACT_APP_API_URL + "/ultimonivel/Canal",
          {
            headers: {
              Authorization: "Bearer " + serviceAAD.getToken(),
            },
          }
        );
        listaCanales = response_canales.data.map(
          ({ id: value, nombre: label, idcompania }) => ({
            value,
            label,
            idcompania,
          })
        );
        setListaCanal(listaCanales);
      } catch (error) {
        console.error(error);
      }
    };
    const getUbicacion_elementoPpal = async () => {
      if (evaluacion.id_ubicacion_elemento_ppal) {
        try {
          const response_UElementoPpal = await axios.get(
            process.env.REACT_APP_API_URL + "/ubicacion/" +
              evaluacion.id_ubicacion_elemento_ppal,
            {
              headers: {
                Authorization: "Bearer " + serviceAAD.getToken(),
              },
            }
          );

          ubicacion_elementoPpal = await response_UElementoPpal.data;
        } catch (error) {
          console.error(error);
        }
      } else {
        ubicacion_elementoPpal = null;
      }
    };
    const getUbicacion_procesoEvaluacion = async () => {
      if (evaluacion.idubicacion) {
        try {
          const response_UProceso = await axios.get(
            process.env.REACT_APP_API_URL + "/ubicacion/" + evaluacion.idubicacion + "/",
            {
              headers: {
                Authorization: "Bearer " + serviceAAD.getToken(),
              },
            }
          );
          ubicacion_Proceso = await response_UProceso.data;
        } catch (error) {
          ubicacion_Proceso = null;
          console.error(error);
        }
      } else {
        ubicacion_Proceso = null;
      }
    };
    //*Recibe los datos de la evaluacion a editar  ///////////////
    const getEvaluacion = async () => {
      try {
        const response_eval = await axios.get(
          process.env.REACT_APP_API_URL + "/evaluacion/" +
            localStorage.getItem("idEvaluacion") +
            "/",
          {
            headers: {
              Authorization: "Bearer " + serviceAAD.getToken(),
            },
          }
        );

        evaluacion = response_eval.data;

        setDatEvaluacion(evaluacion);

        setSelectedValueResponsable({
          value: evaluacion.idposicion,
          label: evaluacion.validador,
        });
        if (evaluacion.tipo_elemento_evaluado === "Otras iniciativas") {
          setShowValidadorOtrasIniciativas(true);
        } else {
          setShowValidadorOtrasIniciativas(false);
        }

        setfechaInactivac();
      } catch (error) {
        console.error(error);
      }
    };
    const productosEvaluacion = async () => {
      try {
        const responseProductos = await axios.get(
          process.env.REACT_APP_API_URL + "/rx_evaluacion_producto/" +
            evaluacion.idevaluacion +
            "/",
          {
            headers: {
              Authorization: "Bearer " + serviceAAD.getToken(),
            },
          }
        );

        let auxProductos = responseProductos.data.map((e) => e.idproducto);
        productos = auxProductos.map(({ idprod: value, nombre: label }) => ({
          value,
          label,
        }));
      } catch (error) {
        console.error(error);
      }
    };
    const canalesEvaluacion = async () => {
      try {
        const responseCanales = await axios.get(
          process.env.REACT_APP_API_URL + "/rx_evaluacion_canal/" +
            evaluacion.idevaluacion +
            "/",
          {
            headers: {
              Authorization: "Bearer " + serviceAAD.getToken(),
            },
          }
        );

        let auxCanales = responseCanales.data.map((e) => e.idcanal);
        canales = auxCanales.map(({ idcanal: value, nombre: label }) => ({
          value,
          label,
        }));
      } catch (error) {
        console.error(error);
      }
    };
    async function getUsuarios() {
      const response_BO = await axios.get(
        process.env.REACT_APP_API_URL + "/usuariosrol/0/3",
        {
          headers: {
            Authorization: "Bearer " + serviceAAD.getToken(),
          },
        }
      );
      let dataBO = response_BO.data;

      const response_RM = await axios.get(
        process.env.REACT_APP_API_URL + "/usuariosrol/0/2",
        {
          headers: {
            Authorization: "Bearer " + serviceAAD.getToken(),
          },
        }
      );
      let dataRM = response_RM.data;
      const response_RO = await axios.get(
        process.env.REACT_APP_API_URL + "/usuariosrol/0/7",
        {
          headers: {
            Authorization: "Bearer " + serviceAAD.getToken(),
          },
        }
      );
      let dataRO = response_RO.data;
      dataRM = dataRM.concat(dataRO);
      let data_concat = dataBO.concat(dataRM);
      let temp = [];
      data_concat.map((dat) => {
        temp.push({
          value: dat.idposicion,
          label: dat.nombre,
          rol: dat.perfil,
        });
        return null;
      });
      setResponsable(temp);
    }
    getUsuarios();

    const getRiesgosXEvaluacion = async () => {
      try {
        const response = await axios.get(
          process.env.REACT_APP_API_URL + "/rx_evaluacion_riesgo/" +
            evaluacion.idevaluacion +
            "/",
          {
            headers: {
              Authorization: "Bearer " + serviceAAD.getToken(),
            },
          }
        );

        riesgosXEvaluacion = await response.data;
      } catch (error) {
        console.error(error);
      }
    };
    const cargaEvaluacion = async () => {
      await getCompanias();
      await getElementosNegPpal();
      await getListaProcesos();
      await getProductos();
      await getCanales();
      await getEvaluacion();
      await getUbicacion_elementoPpal();
      await getUbicacion_procesoEvaluacion();
      await productosEvaluacion();
      await canalesEvaluacion();
      await getRiesgosXEvaluacion();

      try {
        //* Filtra maestros según la compañía de la Evaluacion a Editar //////
        function checkCompania(compania) {
          return compania.value === evaluacion.idcompania;
        }

        const compEvalEditar = companias.filter(checkCompania);
        const valueCompania = compEvalEditar[0].value;

        let procesosFiltrados = [];
        let canalesFiltrados = [];
        let productosFiltrados = [];
        listaProcesos.map((dato) => {
          if (dato.idcompania === valueCompania) {
            procesosFiltrados.push(dato);
          }
          return null;
        });
        listaCanales.map((dato) => {
          if (dato.idcompania === valueCompania) {
            canalesFiltrados.push(dato);
          }
          return null;
        });
        listaProductos.map((dato) => {
          if (dato.idcompania === valueCompania) {
            productosFiltrados.push(dato);
          }
          return null;
        });

        setListaCanalFiltered(canalesFiltrados);
        setListaProcesoFiltered(procesosFiltrados);
        setListaProductoFiltered(productosFiltrados);

        //* Carga la lista de elementos correspondientes según la selección de Elemento de NEgocio PPal

        function controlaElementoPpal(tipoElemento) {
          if (tipoElemento === "Proceso") {
            setTipoComponente("Select");
            setTipoElementoSelect(procesosFiltrados);
          } else if (tipoElemento === "Proveedor") {
            setTipoComponente("Select");
            setTipoElementoSelect(null);
            setShowContratos(true);
          } else if (tipoElemento === "Producto") {
            setTipoComponente("Select");
            setTipoElementoSelect(productosFiltrados);
          } else if (tipoElemento === "Canal") {
            setTipoComponente("Select");
            setTipoElementoSelect(canalesFiltrados);
          } else if (tipoElemento === "Proyecto") {
            setTipoComponente("Select");
            setTipoElementoSelect(null);
          } else if (tipoElemento === "Otras iniciativas") {
            setTipoComponente("Input");
          }
        }

        controlaElementoPpal(evaluacion.tipo_elemento_evaluado);

        function convierteCompania(companiaEvaluacion, listadoCompanias) {
          return listadoCompanias.filter((e) => e.value === companiaEvaluacion);
        }

        function convierteTipoElemento(tipoEvaluacion, TiposDeELementoPpal) {
          return TiposDeELementoPpal.filter(
            (elemento) => elemento.label === tipoEvaluacion
          );
        }

        function convierteElementoPpal(tipoElemento) {
          if (
            tipoElemento === "E_ElementoPpal_Producto" ||
            tipoElemento === "R_ElementoPpal_Producto"
          ) {
            return {
              value: ubicacion_elementoPpal.idproducto,
              label: ubicacion_elementoPpal.nombre_prod,
            };
          } else if (
            tipoElemento === "E_ElementoPpal_Proceso" ||
            tipoElemento === "R_ElementoPpal_Proceso"
          ) {
            return {
              value: ubicacion_elementoPpal.idproceso,
              label: ubicacion_elementoPpal.nombre_proceso,
            };
          } else if (
            tipoElemento === "E_ElementoPpal_Canal" ||
            tipoElemento === "R_ElementoPpal_Canal"
          ) {
            return {
              value: ubicacion_elementoPpal.idcanal,
              label: ubicacion_elementoPpal.nombre_canal,
            };
          } else if (
            tipoElemento === "E_ElementoPpal_Proveedor" ||
            tipoElemento === "R_ElementoPpal_Proveedor"
          ) {
            setShowProveedor(true);
            let temp_contratos_prin = [];
            let temp_contratos = [];
            evaluacion.contratos.map((o) => {
              if (o.principal) {
                temp_contratos_prin.push({
                  value: o.id_contrato,
                  label: o.nombre,
                });
              } else {
                temp_contratos.push({
                  value: o.id_contrato,
                  label: o.nombre,
                });
              }
            });
            setContratoSelec(temp_contratos_prin);
            setContratoOtros(temp_contratos);
            if (ubicacion_Proceso && ubicacion_Proceso.nombre_proveedor) {
              setnombreElementoOtros(ubicacion_Proceso.nombre_proveedor);
            }

            return {
              value: ubicacion_elementoPpal.idprovedor,
              label: ubicacion_elementoPpal.nombre_proveedor,
            };
          }
        }

        function convierteProceso(proceso) {
          if (proceso && proceso.idproceso) {
            return {
              value: proceso.idproceso,
              label: proceso.nombre_proceso,
            };
          } else {
            return null;
          }
        }

        //* Verifica si existe un validador para el elemento ppal evaluado

        const getValidador = async (tipo_elemento, elemento) => {
          let dataPeticion = { [tipo_elemento]: elemento };
          let dataPeticion1 = { tipo_elemento };
          let correoValidador = "";
          dataPeticion = JSON.stringify(dataPeticion);
          try {
            const response = await axios.post(
              process.env.REACT_APP_API_URL + "/validador",
              dataPeticion,
              {
                headers: {
                  "Content-Type": "application/json",
                  Authorization: "Bearer " + serviceAAD.getToken(),
                },
              }
            );

            if (response.status >= 200 && response.status < 300) {
              if (response.data.validador !== null) {
                setValidador(response.data.validador);
                correoValidador = response.data.validador;
                return response.data.correo;
              } else {
                setValidador("No tiene un validador asignado");
                return "No tiene un validador asignado";
              }
            } else if (response.status >= 500) {
              setValidador("No tiene un validador asignado");
              return "No tiene un validador asignado";
            }

            return correoValidador;
          } catch (error) {
            console.error("No tiene un validador asignado", error);
          }
        };

        getValidador(
          evaluacion.tipo_elemento_evaluado,
          evaluacion.id_elemento_ppal_evaluado
        );

        let correoVal = await getValidador(
          evaluacion.tipo_elemento_evaluado,
          evaluacion.id_elemento_ppal_evaluado
        );

        const evaluaValidador = (correoVal, correoUsuario) => {
          if (correoVal) {
            correoVal = correoVal.toLowerCase();
          }
          if (correoUsuario.toLowerCase() === correoVal) {
            setRolValidador(true);
            setDisableAll(true);
          } else {
            setRolValidador(false);
            setDisableAll(false);
          }
        };

        evaluaValidador(correoVal, correoUsuario);

        if (evaluacion.tipo_elemento_evaluado === "Otras iniciativas") {
          if (
            evaluacion.email_validador.toLowerCase() ===
            correoUsuario.toLowerCase()
          ) {
            setRolValidador(true);
            setDisableAll(true);
          } else {
            setRolValidador(false);
            setDisableAll(false);
          }
        }
        //* Divide los riesgos en Activos e inactivos

        const getIdsRiesgos = (riesgosXEval) => {
          let idsRiesgos = [];
          riesgosXEval.map((e) => {
            idsRiesgos.push(e.idriesgo);
          });
          return idsRiesgos;
        };

        riesgosXEvaluacion.map((e) => {
          if (e.estado_asociacion === "Activo") {
            e.estado_enVista = "Activo";
            riesgosActivos.push(e);
          } else if (e.estado_asociacion === "Inactivo") {
            e.estado_enVista = "Inactivo";
            riesgosInactivos.push(e);
          }
        });

        //* Asignar valores predeterminados del Riesgo a editar

        setEstadoEval(evaluacion.estado);
        setCompania(convierteCompania(evaluacion.idcompania, companias)[0]);
        setIdEvlauacion(evaluacion.idevaluacion);
        setNombreEvaluacion(evaluacion.nombre_evaluacion);
        setCorreoValidador(evaluacion.correo_validador);
        setTipoElemento(
          convierteTipoElemento(
            evaluacion.tipo_elemento_evaluado,
            elementosNegPpal
          )[0]
        );
        if (evaluacion.tipo_elemento_evaluado === "Otras iniciativas") {
          setElementoEv(evaluacion.descripcion_otras_iniciativas);
        } else {
          setElementoEv(
            convierteElementoPpal(ubicacion_elementoPpal.tipo_objeto)
          );
        }
        setProceso(convierteProceso(ubicacion_Proceso));
        setProducto(productos);
        setCanal(canales);
        setValidador(evaluacion.validador);
        setAnalista(evaluacion.analista_ro);

        if (ubicacion_Proceso) {
          setProveedor({
            value: ubicacion_Proceso.idProveedor,
            label: ubicacion_Proceso.nombre_proveedor,
          });
          if (ubicacion_Proceso.idProveedor) {
            setShowContratos(true);
          }
        }

        //*Asigna variables relacionadas con los riesgos de la evaluación

        setListaGeneralRiesgos(riesgosXEvaluacion); //* Lista General de Riesgos
        setConsolidadoRiesgos(riesgosActivos); //* Riesgos activos
        setSelected(getIdsRiesgos(riesgosActivos)); //* Riesgos activos aparecen seleccionados/
        setDataRiesgos_Eval(getIdsRiesgos(riesgosActivos)); //* esta variable se utiliza para almacenar el estado inicial de los riesgos activos/
        setFechaValidac(evaluacion.fecha_validada);
        setFechaCreacion(evaluacion.fecha_creacion);
        setfechaInactivac(evaluacion.fecha_inactivada);
        setLoadingData(false);
      } catch (error) {
        console.error(error);
      }
      return null;
    };

    cargaEvaluacion();
  }, [rerender]);

  // Funciones para activar riesgos
  const handleClickInactivos = (event, name) => {
    const selectedIndex = selectedInactivos.indexOf(name);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selectedInactivos, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selectedInactivos.slice(1));
    } else if (selectedIndex === selectedInactivos.length - 1) {
      newSelected = newSelected.concat(selectedInactivos.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selectedInactivos.slice(0, selectedIndex),
        selectedInactivos.slice(selectedIndex + 1)
      );
    }
    setSelectedInactivos(newSelected);
  };
  const handleChangeResp = (e) => {
    setSelectedValueResponsable({ value: e.value, label: e.label });
    setValidador(e.label);
  };

  const MySelect = (props) => (
    <Select
      {...props}
      className="texto"
      defaultValue={selectedValueResponsable}
      options={props.options}
      placeholder={props.placeholder}
      setIdOtrasIniciativas
    />
  );
  const isSelectedInactivos = (name) => selectedInactivos.indexOf(name) !== -1;

  const AsociarRiesgo = (event) => {
    event.preventDefault();
    let dataNuevaRiesgosActivos = listaGeneralRiesgos;
    dataNuevaRiesgosActivos.map((dataRiesgo) => {
      selectedInactivos.map((dataIdInactivos) => {
        let year = new Date();
        let month = new Date();
        let day = new Date();
        let today =
          String(year.getFullYear()) +
          "-" +
          String(("0" + (month.getMonth() + 1)).slice(-2)) +
          "-" +
          String(("0" + day.getDate()).slice(-2));

        if (dataIdInactivos === dataRiesgo.idriesgo) {
          dataRiesgo.estado_enVista = "Activo";
          dataRiesgo.estado_asociacion = "Activo";
          dataRiesgo.usuario_asociador = correoAnalistaLog;
          dataRiesgo.usuario_inactivador = null;
          dataRiesgo.fecha_inactivacion = null;
          dataRiesgo.fecha_asociacion = today;
        }
        return null;
      });
      return null;
    });

    try {
      axios
        .put(
          process.env.REACT_APP_API_URL + "/rx_evaluacion_riesgo/",
          dataNuevaRiesgosActivos,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + serviceAAD.getToken(),
            },
          }
        )
        .then(function (response_rx_eval) {
          /*  console.warn("Envío exitoso desde " + fuente) */
          localStorage.setItem("idEvaluacion", idEvaluacion);

          setEstadoPost(2);
          setTimeout(() => {
            setEstadoPost(0);
          }, 5000);
          setRerender(rerender + 1);
        });
    } catch (error) {
      console.error(error.response);
    }
  };

  //*Funciones para tabla de riesgos activos  */

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

  // This method is created for cross-browser compatibility, if you don't
  // need to support IE11, you can use Array.prototype.sort() directly
  function stableSort(array, comparator) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
      const order = comparator(a[0], b[0]);
      if (order !== 0) {
        return order;
      }
      return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
  }

  const headCells = [
    {
      id: "detalleRiesgo",
      numeric: false,
      disablePadding: false,
      label: "",
    },
    {
      id: "idriesgo",
      numeric: false,
      disablePadding: false,
      label: "Id Riesgo",
    },
    {
      id: "categoria_corporativa",
      numeric: false,
      disablePadding: false,
      label: "Categoría corporativa",
    },
    {
      id: "sub_categoria_riesgo",
      numeric: false,
      disablePadding: false,
      label: "Subcategoría corporativa",
    },
    {
      id: "nombre_riesgo",
      numeric: false,
      disablePadding: false,
      label: "Riesgo",
    },
    {
      id: "descripcion_riesgo",
      numeric: false,
      disablePadding: false,
      label: "Descripción",
    },
    {
      id: "p50",
      numeric: false,
      disablePadding: false,
      label: "P50",
    },
    {
      id: "p95",
      numeric: false,
      disablePadding: false,
      label: "P95",
    },
    {
      id: "nivel_riesgo_inherente",
      numeric: false,
      disablePadding: false,
      label: "Riesgo Inherente",
    },
    {
      id: "nivel_riesgo_residual",
      numeric: false,
      disablePadding: false,
      label: "Riesgo Residual",
    }, 
    {
      id: "exposicion_inherente",
      numeric: false,
      disablePadding: false,
      label: "Exposición Inherente",
    },
    {
      id: "exposicion_residual",
      numeric: false,
      disablePadding: false,
      label: "Exposición Residual",
    }, 
    {
      id: "estado_asociacion",
      numeric: false,
      disablePadding: false,
      label: "Estado",
    },
    {
      id: "usuario_asociador",
      numeric: false,
      disablePadding: false,
      label: "Usuario que asoció",
    },
  ];

  function EnhancedTableHead(props) {
    const { order, orderBy, onRequestSort } = props;

    const createSortHandler = (property) => (event) => {
      onRequestSort(event, property);
    };

    return (
      <TableHead>
        <TableRow style={{ backgroundColor: "#2c2a29", color: "#ffffff" }}>
          {headCells.map((headCell) => (
            <TableCell
              key={headCell.id}
              align={headCell.numeric ? "right" : "center"}
              padding={headCell.disablePadding ? "none" : "normal"}
              sortDirection={orderBy === headCell.id ? order : false}
              style={{ backgroundColor: "#2c2a29", color: "#ffffff" }}
            >
              <TableSortLabel
                active={orderBy === headCell.id}
                direction={orderBy === headCell.id ? order : "asc"}
                onClick={createSortHandler(headCell.id)}
                className="text"
              >
                {headCell.label}
                {orderBy === headCell.id ? (
                  <Box component="span" sx={visuallyHidden}>
                    {order === "desc"
                      ? "sorted descending"
                      : "sorted ascending"}
                  </Box>
                ) : null}
              </TableSortLabel>
            </TableCell>
          ))}
          <TableCell
            padding="normal"
            align="center"
            style={{ backgroundColor: "#2c2a29", color: "#ffffff" }}
          >
            Asociar
          </TableCell>
        </TableRow>
      </TableHead>
    );
  }

  EnhancedTableHead.propTypes = {
    numSelected: PropTypes.number.isRequired,
    onRequestSort: PropTypes.func.isRequired,
    onSelectAllClick: PropTypes.func.isRequired,
    order: PropTypes.oneOf(["asc", "desc"]).isRequired,
    orderBy: PropTypes.string.isRequired,
    rowCount: PropTypes.number.isRequired,
  };

  const EnhancedTableToolbar = (props) => {
    const { numSelected } = props;

    return (
      <Toolbar
        sx={{
          pl: { sm: 2 },
          pr: { xs: 1, sm: 1 },
          ...(numSelected > 0 && {
            bgcolor: (theme) =>
              alpha(
                theme.palette.primary.main,
                theme.palette.action.activatedOpacity
              ),
          }),
        }}
      >
        {numSelected > 0 ? (
          <Typography
            sx={{ flex: "1 1 100%" }}
            color="inherit"
            variant="subtitle1"
            component="div"
          >
            {numSelected} Riesgos asociados
          </Typography>
        ) : (
          <></>
        )}
      </Toolbar>
    );
  };

  EnhancedTableToolbar.propTypes = {
    numSelected: PropTypes.number.isRequired,
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
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

  const muestraRiesgosXTabla = (consolidadoRiesgos, tabla) => {
    let riesgosXmostrar = [];
    consolidadoRiesgos.map((riesgo) => {
      if (
        (riesgo.estado_enVista === "Activo" ||
          riesgo.estado_enVista === "Sugerido" ||
          riesgo.estado_enVista === "Agregado") &&
        tabla === "Tabla_Activos"
      ) {
        riesgosXmostrar.push(riesgo);
      } else if (
        riesgo.estado_enVista === "Inactivo" &&
        tabla === "Tabla_Inactivos"
      ) {
        riesgosXmostrar.push(riesgo);
      } else if (
        riesgo.estado_enVista === "Buscado" &&
        tabla === "Busqueda_riesgos"
      ) {
        riesgosXmostrar.push(riesgo);
      }
    });
    return riesgosXmostrar;
  };

  const getMotivoInactivacion = (idRiesgo) => {
    let riesgo_isActivo = _.some(listaGeneralRiesgos, {
      idriesgo: idRiesgo,
      estado_enVista: "Activo",
    });

    if (riesgo_isActivo) {
      setRiesgosInactivado(idRiesgo);
      setModalShowMotivo(true);
    }
  };

  const handleClick = (event, idRiesgo) => {
    const selectedIndex = selected.indexOf(idRiesgo);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, idRiesgo);
    } else if (selectedIndex === 0) {
      getMotivoInactivacion(idRiesgo);
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      getMotivoInactivacion(idRiesgo);
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      getMotivoInactivacion(idRiesgo);
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }
    setSelected(newSelected);
  };

  const isSelected = (idRiesgo) => selected.indexOf(idRiesgo) !== -1;

  const emptyRows =
    page > 0
      ? Math.max(
          0,
          (1 + page) * rowsPerPage -
            muestraRiesgosXTabla(listaGeneralRiesgos, "Tabla_Activos").length
        )
      : 0;

  //* Filtra segun la compañia seleccionada  y renderiza nuevamente la lista de Componentes Ppales///////////////////

  const FiltrarMaestros = (compania) => {
    setCompania(compania);

    if (compania !== null) {
      setTipoElemento(null);
      setCanal(null);
      setProceso(null);
      setProducto(null);
      setElementoEv(null);
      setValidador("");
      setTipoElementoSelect([]);

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

  //** Trae el nombre del validador según el elemento ppal seleccionado */
  async function getValidador(elemento) {
    const tipoElemento_peticion = tipoElemento
      ? Object.values(tipoElemento)[1]
      : null;

    elemento =
      typeof elemento === "object" ? Object.values(elemento)[0] : elemento;
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
          if (response.data.validador !== null) {
            setValidador(response.data.validador);
          } else {
            setValidador("No tiene un validador asignado");
          }
        } else if (response.status >= 500) {
          return "No tiene un validador asignado";
        }
      });
  }
  //** Verifica de los campos obligatorios sean llenados antes de guardar */

  const checkValidez = () => {
    if (idEvaluacion !== null) {
      if (nombreEvaluacion !== null && nombreEvaluacion !== "") {
        if (tipoElemento !== null) {
          if (elemento !== null) {
            if (compania !== null) {
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
    } else {
      return false;
    }
  };

  const filtraRiesgos = (listaGeneral, nuevaLista, tipoNuevaLista) => {
    //** Toma como propiedades 1. la lista general o consolidada de todos los riesgos: Activos + Inactivos + Sugeridos + Buscados 2.La nueva lista de Riesgos que se agregará: Riesgos Activos, Riesgos Escaneados, Riesgos Buscados
    //* Devuelve el riesgo de mayor prelación Activo||Inactivo > Sugerido > Buscado --- Es invocado mas adelante
    const comparaRiesgos = (riesgoAntiguo, riesgoNuevo) => {
      if (
        riesgoAntiguo.estado_enVista === "Activo" ||
        riesgoAntiguo.estado_enVista === "Inactivo"
      ) {
        return riesgoAntiguo;
      } else if (
        riesgoNuevo.estado_enVista === "Activo" ||
        riesgoNuevo.estado_enVista === "Inactivo"
      ) {
        return riesgoNuevo;
      } else if (riesgoAntiguo.estado_enVista === "Sugerido") {
        return riesgoAntiguo;
      } else if (riesgoNuevo.estado_enVista === "Sugerido") {
        return riesgoNuevo;
      } else if (riesgoAntiguo.estado_enVista === "Buscado") {
        return riesgoAntiguo;
      } else if (riesgoNuevo.estado_enVista === "Buscado") {
        return riesgoNuevo;
      }
    };

    let consolidadoRiesgos;
    if (nuevaLista.length === 0) {
      //* Solamente existe un caso cuando la nueva lista está vacía, sucede cuando hace una consulta en "ScanRiesgos" y no hay ninguno asociado

      consolidadoRiesgos = listaGeneral.filter(
        (riesgoConsolidado) => riesgoConsolidado.estado_enVista !== "Sugerido"
      );
      setTextAlerta(
        "No se encontraron riesgos relacionados con los elementos seleccionados"
      );
      setShowAlerta(true);
    } else if (nuevaLista.length !== 0) {
      if (listaGeneral.length !== 0) {
        //** Elimina los riesgos Anteriormente escaneados si el filtro se hace desde Escanear Riesgos*/

        if (tipoNuevaLista === "Riesgos_escaneados") {
          listaGeneral = listaGeneral.filter(
            (riesgo) => riesgo.estado_enVista !== "Sugerido"
          );
        }

        //* funcion principal: Compara la listaGeneral de Riesgos y la NuevaLista de Riesgos, obtiene los repetidos y prevalece el mas importante (ver función comparaRiesgos)...
        //* ... Luego obtiene los riesgos que no se repiten de cada lista, y une todos los riesgos en Consolidado Riesgo
        //* ... consolidado riesgos se mostrará en cada tabla respectivamente según su propiedad "estado_enVista"
        let arr = [];
        let res;
        nuevaLista.map((riesgoNuevo) => {
          //* devuelve el indice del riesgo repetido, de lo contrario devuelve -1
          res = _.findIndex(
            listaGeneral,
            (e) => {
              return e.idriesgo == riesgoNuevo.idriesgo;
            },
            0
          );

          //*
          if (res !== -1) {
            var riesgoAntiguo = listaGeneral.filter(
              (e) => e.idriesgo === riesgoNuevo.idriesgo
            )[0];
            let aux = comparaRiesgos(riesgoAntiguo, riesgoNuevo);
            arr.push(aux);
          }
        });

        //* Obtienen los riesgos únicos de cada array de riesgos
        let dif1 = _.differenceBy(nuevaLista, listaGeneral, "idriesgo");
        let dif2 = _.differenceBy(listaGeneral, nuevaLista, "idriesgo");

        let riesgosUnicos = _.concat(dif1, dif2);
        consolidadoRiesgos = _.concat(riesgosUnicos, arr);

        consolidadoRiesgos.sort(function (a, b) {
          if (a.idriesgo > b.idriesgo) {
            return 1;
          }
          if (a.idriesgo < b.idriesgo) {
            return -1;
          }
          // a must be equal to b
          return 0;
        });
      } else if (listaGeneral.length === 0) {
        consolidadoRiesgos = nuevaLista;
      }
    }
    return consolidadoRiesgos;
  };

  //** Envía los datos de toda la evalaucion al back */

  const postData = async (data, fuente) => {
    try {
      axios
        .post(process.env.REACT_APP_API_URL + "/rx_evaluacion_riesgo/", data, {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + serviceAAD.getToken(),
          },
        })
        .then(function (response_rx_eval) {
          /*  console.warn("Envío exitoso desde " + fuente) */
          localStorage.setItem("idEvaluacion", idEvaluacion);

          setEstadoPost(2);
          setTimeout(() => {
            setEstadoPost(0);
          }, 5000);
        });
    } catch (error) {
      console.error(error.response);
    }
  };

  const putData = async (data, fuente) => {
    try {
      axios
        .put(process.env.REACT_APP_API_URL + "/rx_evaluacion_riesgo/", data, {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + serviceAAD.getToken(),
          },
        })
        .then(function (response_rx_eval) {
          /*  console.warn("Envío exitoso desde " + fuente) */
          localStorage.setItem("idEvaluacion", idEvaluacion);
          setEstadoPost(2);
          setTimeout(() => {
            setEstadoPost(0);
          }, 5000);
        });
    } catch (error) {
      console.error(error.response);
    }
  };

  const enviarRxEvalRiesgos_Put = (
    data,
    datosRiesgosCargados,
    idEvaluacion,
    estado_asociacion,
    tipoPeticionPut,
    fuente,
    today
  ) => {
    if (tipoPeticionPut === "general") {
      let datosRiesgos = [];
      datosRiesgosCargados.map((e) => {
        if (e.idrx_evaluacion_riesgo) {
          datosRiesgos.push({
            idrx_evaluacion_riesgo: e.idrx_evaluacion_riesgo,
            idevaluacion: idEvaluacion,
            idriesgo: e.idriesgo,
            estado_asociacion: estado_asociacion,
            fecha_asociacion: estado_asociacion === "Activo" ? today : null,
            fecha_inactivacion: estado_asociacion === "Inactivo" ? today : null,
            motivo_inactivacion: e.motivo_inactivacion,
            usuario_asociador:
              estado_asociacion === "Activo" ? correoAnalistaLog : null,
            usuario_inactivador:
              estado_asociacion === "Inactivo" ? correoAnalistaLog : null,
            Responsable:
              selectedValueResponsable != undefined &&
              selectedValueResponsable.value != undefined
                ? selectedValueResponsable.value.toString()
                : null,
          });
        }
      });

      datosRiesgos = JSON.stringify(datosRiesgos);

      putData(datosRiesgos, fuente);
    } else if (tipoPeticionPut === "opc4-riesgosInactivos") {
      let datosRiesgos = [];

      datosRiesgosCargados.map((e) => {
        if (e.idrx_evaluacion_riesgo && data.includes(e.idriesgo)) {
          datosRiesgos.push({
            idrx_evaluacion_riesgo: e.idrx_evaluacion_riesgo,
            idevaluacion: idEvaluacion,
            idriesgo: e.idriesgo,
            estado_asociacion: estado_asociacion,
            fecha_asociacion: e.fecha_asociacion ? e.fecha_asociacion : null,
            fecha_inactivacion: today,
            motivo_inactivacion: e.motivo_inactivacion
              ? e.motivo_inactivacion
              : null,
            usuario_asociador: e.usuario_asociador ? e.usuario_asociador : null,
            usuario_inactivador: correoAnalistaLog,
          });
        }
      });

      datosRiesgos = JSON.stringify(datosRiesgos);

      putData(datosRiesgos, fuente);
    } else if (tipoPeticionPut === "opc4-riesgosActivos") {
      let datosRiesgos = [];

      datosRiesgosCargados.map((e) => {
        if (e.idrx_evaluacion_riesgo && data.includes(e.idriesgo)) {
          datosRiesgos.push({
            idrx_evaluacion_riesgo: e.idrx_evaluacion_riesgo,
            idevaluacion: idEvaluacion,
            idriesgo: e.idriesgo,
            estado_asociacion: estado_asociacion,
            fecha_asociacion: estado_asociacion === "Activo" ? today : null,
            fecha_inactivacion: null,
            motivo_inactivacion: null,
            usuario_asociador: correoAnalistaLog,
            usuario_inactivador: null,
          });
        }
      });

      datosRiesgos = JSON.stringify(datosRiesgos);
      putData(datosRiesgos, fuente);
    }
  };
  const enviarRxEvalRiesgos_Post = (
    data,
    idEvaluacion,
    estado_asociacion,
    fuente,
    today
  ) => {
    let datosRiesgos = [];

    data.map((e) => {
      datosRiesgos.push({
        idevaluacion: idEvaluacion,
        idriesgo: e,
        estado_asociacion: estado_asociacion,
        fecha_asociacion: today,
        fecha_inactivacion: null,
        motivo_inactivacion: null,
        usuario_asociador: null,
        usuario_inactivador: null,
      });
    });

    postData(datosRiesgos, fuente);
  };

  const sendData = (estado_evaluacion, band) => {
    let tempDatEval = datEvaluacion;
    if (!flagEstado) {
      if (!band) {
        if (estado_evaluacion === "Creada") {
          estado_evaluacion = datEvaluacion.estado;
          setEstadoEval(datEvaluacion.estado);
        }
      }
    } else {
      setEstadoEval(estado_evaluacion);
    }
    tempDatEval.estado = estado_evaluacion;
    let year = new Date();
    let month = new Date();
    let day = new Date();

    let today =
      String(year.getFullYear()) +
      "-" +
      String(("0" + (month.getMonth() + 1)).slice(-2)) +
      "-" +
      String(("0" + day.getDate()).slice(-2));

    if (checkValidez() === false) {
      setEstadoPost(7);
      setTimeout(() => {
        setEstadoPost(0);
      }, 5000);
    } else if (checkValidez() === true) {
      let canales = [];
      let productos = [];
      if (canal !== null) {
        canal.map((e) => {
          canales.push(Object.values(e)[0]);
        });
      }
      if (producto !== null) {
        producto.map((e) => {
          productos.push(Object.values(e)[0]);
        });
      }
      let elemento_ppal_evaluado;
      if (Object.values(tipoElemento)[1] === "Otras iniciativas") {
        elemento_ppal_evaluado = elemento ? elemento : null;
      } else if (tipoElemento.label === "Proveedor") {
        elemento_ppal_evaluado =
          typeof elemento === "object" ? Object.values(elemento)[0] : elemento;
      } else {
        elemento_ppal_evaluado = elemento ? Object.values(elemento)[0] : null;
      }
      var datosEvaluacion;
      if (estadoEval === "Enviada" && rolValidador === true) {
        datosEvaluacion = {
          idevaluacion: datEvaluacion.idevaluacion,
          pos_vali_otras_iniciativas: selectedValueResponsable
            ? selectedValueResponsable.value
            : null,
          nombre_evaluacion: datEvaluacion.nombre_evaluacion,
          correo_validador: datEvaluacion.correo_validador,
          tipo_elemento_evaluado: datEvaluacion.tipo_elemento_evaluado,
          elemento_ppal_evaluado: elemento_ppal_evaluado,
          estado:
            datEvaluacion.tipo_elemento_evaluado !== tipoElemento.label
              ? "Creada "
              : estado_evaluacion,
          /* idproceso: datEvaluacion.,
          idcanal: datEvaluacion.,
          idproducto: datEvaluacion., */
          tipo_de_evento: 1,
          idcompania: datEvaluacion.idcompania,
          fecha_creada: datEvaluacion.fecha_creacion,
          fecha_enviada:
            estado_evaluacion === "Enviada"
              ? today
              : datEvaluacion.fecha_enviada
              ? datEvaluacion.fecha_enviada
              : null,
          fecha_validada:
            estado_evaluacion === "Validada"
              ? today
              : datEvaluacion.fecha_validada
              ? datEvaluacion.fecha_validada
              : null,
          fecha_inactivada:
            estado_evaluacion === "Inactiva"
              ? today
              : datEvaluacion.fecha_inactivada
              ? datEvaluacion.fecha_inactivada
              : null,
        };
      } else {
        datosEvaluacion = {
          idevaluacion: idEvaluacion,
          nombre_evaluacion: nombreEvaluacion,
          pos_vali_otras_iniciativas: selectedValueResponsable.value
            ? selectedValueResponsable.value
            : null,
          correo_validador: correoValidador,
          tipo_elemento_evaluado: tipoElemento
            ? Object.values(tipoElemento)[1]
            : null,
          elemento_ppal_evaluado: elemento_ppal_evaluado,
          estado: estado_evaluacion,
          idproceso: proceso ? Object.values(proceso)[0] : null,
          idcanal: canales,
          idproducto: productos,
          tipo_de_evento: 1,
          idcompania: Object.values(compania)[0],
          fecha_creada: datEvaluacion.fecha_creacion,
          fecha_enviada: estado_evaluacion === "Enviada" ? today : null,
          fecha_validada: estado_evaluacion === "Validada" ? today : null,
          fecha_inactivada: estado_evaluacion === "Inactiva" ? today : null,
          idproveedor: Proveedor ? Proveedor.ID_SAP : null,
          Id_contrato: contratoOtros,
          Id_contrato_prin: contratoSelec,
        };
      }

      JSON.stringify(datosEvaluacion);
      //Guarda
      if (tipoElemento.label === "Proveedor" && contratoSelec.length === 0) {
        //window.alert("No se han seleccionado contratos")
        setTextAlerta("No se han seleccionado contratos para el proveedor.");
        setShowAlerta(true);
      } else {
        axios
          .put(
            process.env.REACT_APP_API_URL + "/evaluacion/" + idEvaluacion + "/",
            datosEvaluacion,
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + serviceAAD.getToken(),
              },
            }
          )
          .then(function (response) {
            if (response.status >= 200 && response.status < 300) {
              let edoInicialRiesgos = dataRiesgos_Eval;
              let edoFinalRiesgos = selected;

              //* 1. No hay riesgos seleccionados ni cargados*/
              if (
                edoInicialRiesgos.length == 0 &&
                edoFinalRiesgos.length == 0
              ) {
                setEstadoPost(2);
                setTimeout(() => {
                  setEstadoPost(0);
                }, 5000);
              }

              //* 2. Inicialmente no habían riesgos pero se agregaron */
              else if (
                edoInicialRiesgos.length == 0 &&
                edoFinalRiesgos.length !== 0
              ) {
                enviarRxEvalRiesgos_Post(
                  edoFinalRiesgos,
                  response.data.idevaluacion,
                  "Activo",
                  "Opc 2 -Sin riesgos iniciales--> Sea gragaron nuevos POST",
                  today
                );
                setEstadoPost(2);
                setTimeout(() => {
                  setEstadoPost(0);
                }, 5000);

                //* 3. Los riesgos iniciales de la Evaluacion son los mismos que al final*/
              } else if (
                JSON.stringify(edoInicialRiesgos) ===
                JSON.stringify(edoFinalRiesgos)
              ) {
                enviarRxEvalRiesgos_Put(
                  edoFinalRiesgos,
                  consolidadoRiesgos,
                  response.data.idevaluacion,
                  "Activo",
                  "general",

                  "Opc 3 - Riesgos siguen iguales PUT" //*(Para actualizar fecha de asociacion) */
                );
                //* 4. Los riesgos iniciales de la Evaluacion han sido modificados y/o han sido adicionados otros nuevos*/
              } else if (
                JSON.stringify(edoInicialRiesgos) !==
                JSON.stringify(edoFinalRiesgos)
              ) {
                let riesgosInicialesInactivados = edoInicialRiesgos.filter(
                  (x) => !edoFinalRiesgos.includes(x)
                );

                if (riesgosInicialesInactivados.length !== 0) {
                  enviarRxEvalRiesgos_Put(
                    riesgosInicialesInactivados,
                    consolidadoRiesgos,
                    response.data.idevaluacion,
                    "Inactivo",
                    "opc4-riesgosInactivos",
                    "Riesgos iniciales Inactivos PUT"
                  );
                }

                let riesgosInicialesActivos = edoInicialRiesgos.filter((x) =>
                  edoFinalRiesgos.includes(x)
                );

                if (riesgosInicialesActivos.length !== 0) {
                  enviarRxEvalRiesgos_Put(
                    riesgosInicialesActivos,
                    consolidadoRiesgos,
                    response.data.idevaluacion,
                    "Activo",
                    "opc4-riesgosActivos",
                    "Riesgos iniciales Activos PUT"
                  );
                }

                let riesgosAdicionados = edoFinalRiesgos.filter(
                  (x) => !edoInicialRiesgos.includes(x)
                );

                if (riesgosAdicionados.length !== 0) {
                  enviarRxEvalRiesgos_Post(
                    riesgosAdicionados,
                    response.data.idevaluacion,
                    "Activo",
                    "Riesgos adicionales POST",
                    today
                  );
                }
              }
            } else if (response.status >= 500) {
              setShowingAlert(true);
              setEstadoPost(5);
              setTimeout(() => {
                setEstadoPost(0);
              }, 5000);
            }
          })
          .catch(function (error) {
            setEstadoPost(4);
            setTimeout(() => {
              setEstadoPost(0);
            }, 5000);
            setShowingAlert(true);
          });
      }

      setValidated(true);
      setFlagEstado(false);
    }
  };

  //**Trae los riesgos asociados a los elementos seleccionados por el usuario en los camnpos de elemento ppal, proceso, canales y productos */

  const scanRiesgos = (event) => {
    if (checkValidez() === false) {
      setEstadoPost(7);
      setTimeout(() => {
        setEstadoPost(0);
      }, 5000);
    } else if (checkValidez() === true) {
      let proceso = [];
      let canales = [];
      let productos = [];
      proceso.push(Object.values(proceso)[0]);
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
      var datosEscaner = {
        elemento_ppal: tipoElemento ? Object.values(tipoElemento)[1] : null,
        idelemento:
          typeof elemento === "object" ? Object.values(elemento)[0] : elemento,
        Proceso: proceso !== null ? proceso : null,
        Canal: canales,
        Producto: productos,
      };
      JSON.stringify(datosEscaner);
      //Guarda

      axios
        .post(process.env.REACT_APP_API_URL + "/riesgo_valoracion", datosEscaner, {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + serviceAAD.getToken(),
          },
        })
        .then(function (response) {
          if (response.status >= 200 && response.status < 300) {
            let riesgos_escaneados = response.data;

            riesgos_escaneados.map(
              (riesgo) => (riesgo.estado_enVista = "Sugerido")
            );

            let riesgos_filtrados;

            if (listaGeneralRiesgos.length !== 0) {
              riesgos_filtrados = filtraRiesgos(
                listaGeneralRiesgos,
                riesgos_escaneados,
                "Riesgos_escaneados"
              );
            } else if (listaGeneralRiesgos.length === 0) {
              riesgos_filtrados = riesgos_escaneados;
            }

            setListaGeneralRiesgos(riesgos_filtrados);
          } else if (response.status >= 500) {
          }
        })
        .catch(function (error) {
          if (error.response.data) {
            let riesgos_filtrados = filtraRiesgos(
              listaGeneralRiesgos,
              [],
              "Riesgos_escaneados"
            );

            setListaGeneralRiesgos(riesgos_filtrados);
          } else {
            console.error(error);
          }
        });
    }
  };
  //** Busca riesgos que no se encuentren en en la lista ppal */

  const buscarRiesgos = (event) => {
    async function getRiesgos() {
      try {
        const response = await axios.get(
          process.env.REACT_APP_API_URL + "/riesgo_valoracion",
          {
            headers: {
              Authorization: "Bearer " + serviceAAD.getToken(),
            },
          }
        );
        let riesgos = response.data;

        riesgos.map((riesgo) => (riesgo.estado_enVista = "Buscado"));

        let riesgos_filtrados = filtraRiesgos(listaGeneralRiesgos, riesgos);

        setListaGeneralRiesgos(riesgos_filtrados);
      } catch (error) {
        console.error(error);
      }
    }
    getRiesgos();
  };

  const detalle = (event, idRiesgo) => {
    localStorage.setItem("idRiesgo", idRiesgo);
  };

  const FiltrarProveedor = (e) => {
    let elemento = e.value;
    setShowProveedor(true);
    /*if(tipoElemento.value == 332 && e.idcompania == 1){
      
      setShowContrato(true);
      
    }
    else{ 
      setShowContrato(false);

    }*/
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
        identificacionModal={"Evaluacion"}
        setElementoEv={setElementoEv}
        tipoProveedor={tipoProveedor}
        setShowProveedor={setShowProveedor}
        setShowContratos={setShowContratos}
        setNombreElemento={setNombreElemento}
        setnombreElementoOtros={setnombreElementoOtros}
      ></ModalProveedor>
      <AlertDismissibleExample alerta={estadoPost} estado={estadoEval} />
      <ModalBuscarRiesgos
        modalShow={modalShow}
        setModalShow={setModalShow}
        listaGeneralRiesgos={listaGeneralRiesgos}
        setListaGeneralRiesgos={setListaGeneralRiesgos}
        selected={selected}
        setFlagEstado={setFlagEstado}
        setSelected={setSelected}
      />

      <ModalMotivoInactiva
        modalShow={modalShowMotivo}
        setModalShow={setModalShowMotivo}
        listaGeneralRiesgos={listaGeneralRiesgos}
        setListaGeneralRiesgos={setListaGeneralRiesgos}
        riesgoInactivado={riesgoInactivado}
        usuarioLog={correoAnalistaLog}
      />

      <ModalAlerta
        showAlerta={showAlerta}
        setShowAlerta={setShowAlerta}
        text={textAlerta}
      />

      {/* <ModalGuardar
        showModalAlertaGuardar={showModalAlertaGuardar}
        setShowModalAlertaGuardar={setShowModalAlertaGuardar}
      /> */}

      <ModalEstadoCrear
        show={showModalEstadoCrear}
        onHide={() => {
          setShowModalEstadoCrear(false);
        }}
        sendData={sendData}
      />

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
        <Form>
          {/* ///////////////////////////// Acciones ////////////////////////////// */}
          <Container>
            <Row className="mb-5 mt-5 pr-3 justify-content-end">
              {(() => {
                if (estadoEval === "Creada") {
                  return (
                    <>
                      <Col xs={12} sm={12} md={3} className="text-center">
                        <button
                          type="button"
                          className="btn botonNegativo"
                          onClick={() => {
                            setTimeout(() => {
                              history.push("/evaluaciones");
                            }, 1000);
                          }}
                        >
                          Regresar
                        </button>
                      </Col>
                      {!props.idrol.includes(3) ? (
                        <>
                          <Col xs={12} sm={12} md={3} className="text-center">
                            {props.permisos.inactivar ? (
                              <button
                                type="button"
                                className="btn botonNegativo3"
                                onClick={() => {
                                  setEstadoEval("Inactiva");
                                  sendData("Inactiva");
                                  setTimeout(() => {
                                    history.push("/evaluaciones");
                                  }, 1000);
                                }}
                              >
                                Inactivar
                              </button>
                            ) : null}
                          </Col>
                          <Col xs={12} sm={12} md={3} className="text-center">
                            {props.permisos.editar ? (
                              <button
                                type="button"
                                className="btn botonPositivo"
                                onClick={() => {
                                  if (!!flagEstado) {
                                    setShowModalEstadoCrear(true);
                                  } else {
                                    sendData("Creada");
                                    setRerender(rerender + 1);
                                  }
                                }}
                              >
                                Guardar
                              </button>
                            ) : null}
                          </Col>
                          <Col xs={12} sm={12} md={3} className="text-center">
                            <button
                              type="button"
                              className="btn botonIngreso"
                              id="send"
                              onClick={() => {
                                setEstadoEval("Enviada");
                                sendData("Enviada");
                                setRerender(rerender + 1);
                                /* setTimeout(() => {
                            history.push("/evaluaciones");
                          }, 1000); */
                              }}
                            >
                              Enviar a validar
                            </button>
                          </Col>
                        </>
                      ) : null}
                    </>
                  );
                } else if (estadoEval === "Enviada" && rolValidador === true) {
                  return (
                    <>
                      <Col xs={12} sm={12} md={3} className="text-center">
                        <button
                          type="button"
                          className="btn botonNegativo"
                          onClick={() => {
                            setTimeout(() => {
                              history.push("/evaluaciones");
                            }, 1000);
                          }}
                        >
                          Regresar
                        </button>
                      </Col>

                      <Col xs={12} sm={12} className="text-right">
                        <button
                          type="button"
                          className="btn botonIngreso"
                          id="send"
                          onClick={() => {
                            setEstadoEval("Validada");
                            sendData("Validada");
                            setTimeout(() => {
                              history.push("/evaluaciones");
                            }, 1000);
                          }}
                        >
                          Validar
                        </button>
                      </Col>
                    </>
                  );
                } else if (estadoEval === "Enviada" && rolValidador === false) {
                  return (
                    <>
                      <Col xs={4} sm={12} md={3} className="text-center">
                        <button
                          type="button"
                          className="btn botonNegativo"
                          onClick={() => {
                            setTimeout(() => {
                              history.push("/evaluaciones");
                            }, 1000);
                          }}
                        >
                          Regresar
                        </button>
                      </Col>

                      {!props.idrol.includes(3) ? (
                        <>
                          <Col xs={12} sm={12} md={3} className="text-right">
                            <button
                              type="button"
                              className="btn botonNegativo"
                              onClick={() => {
                                setEstadoEval("Inactiva");
                                sendData("Inactiva");
                                setTimeout(() => {
                                  history.push("/evaluaciones");
                                }, 1000);
                              }}
                            >
                              Inactivar
                            </button>
                          </Col>

                          <Col xs={12} sm={12} md={3} className="text-right">
                            <button
                              type="button"
                              className="btn botonPositivo"
                              id="send"
                              onClick={() => {
                                if (!!flagEstado) {
                                  setShowModalEstadoCrear(true);
                                } else {
                                  sendData("Creada");
                                  setRerender(rerender + 1);
                                }
                              }}
                            >
                              Guardar
                            </button>
                          </Col>
                        </>
                      ) : null}
                    </>
                  );
                } else if (estadoEval === "Validada") {
                  return (
                    <>
                      <Col xs={12} sm={12} md={3} className="text-center">
                        <button
                          type="button"
                          className="btn botonNegativo"
                          onClick={() => {
                            setTimeout(() => {
                              history.push("/evaluaciones");
                            }, 1000);
                          }}
                        >
                          Regresar
                        </button>
                      </Col>
                      {!props.idrol.includes(3) ? (
                        <>
                          <Col xs={12} sm={12} md={3} className="text-right">
                            <button
                              type="button"
                              className="btn botonNegativo"
                              onClick={() => {
                                setEstadoEval("Inactiva");

                                sendData("Inactiva");
                                setTimeout(() => {
                                  history.push("/evaluaciones");
                                }, 1000);
                              }}
                            >
                              Inactivar
                            </button>
                          </Col>
                          <Col xs={12} sm={12} md={3} className="text-right">
                            <button
                              type="button"
                              className="btn botonPositivo"
                              id="send"
                              onClick={() => {
                                if (!!flagEstado) {
                                  setShowModalEstadoCrear(true);
                                } else {
                                  sendData("Creada");
                                  setRerender(rerender + 1);
                                }
                              }}
                            >
                              Guardar
                            </button>
                          </Col>
                        </>
                      ) : null}
                    </>
                  );
                } else if (
                  estadoEval === "Inactiva" &&
                  !props.idrol.includes(3)
                ) {
                  return (
                    <>
                      <Col xs={12} sm={12} md={3} className="text-right">
                        <button
                          type="button"
                          className="btn botonPositivo"
                          id="send"
                          onClick={() => {
                            setEstadoEval("Creada");
                            sendData("Creada", true);
                          }}
                        >
                          Activar
                        </button>
                      </Col>
                    </>
                  );
                } else {
                  return <></>;
                }
              })()}
            </Row>

            {/*  <Row className="mb-5 mt-5 justify-content-start">
            <Col sm={4}>
              <h1 className="titulo text-start">Evaluacion # {idEvaluacion}</h1>
            </Col>
          </Row> */}
            <Row className="mb-3 justify-content-start">
              <Col sm={4} xs={0}></Col>
              <Col>
                <div className="form-text">* Campos obligatorios</div>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col sm={4} xs={4}>
                <label className="forn-label label">Estado</label>
              </Col>
              <Col sm={4} xs={12}>
                <input
                  value={estadoEval}
                  type="text"
                  disabled
                  className="form-control text-center texto"
                  id="Estado"
                ></input>
              </Col>
              <Col sm={2} xs={12} className="text-center">
                <label className="label ">Id Evaluación</label>
              </Col>
              <Col sm={2} xs={12}>
                <input
                  value={idEvaluacion}
                  type="text"
                  disabled
                  className="form-control text-center texto"
                  id="IDevaluacion"
                ></input>
              </Col>
            </Row>
            {/* ID evaluación */}
            <Row className="mb-3">
              <Col sm={4} xs={12} className="label">
                <label className="form-label">Compañía*</label>
              </Col>
              <Col sm={8} xs={12}>
                <Select
                  isDisabled={disableAll}
                  components={animatedComponents}
                  options={companias}
                  value={compania}
                  //hideSelectedOptions={true}
                  placeholder={"Seleccione la compañia"}
                  onChange={FiltrarMaestros}
                />
              </Col>
            </Row>
            {/* Nombre Evaluación */}
            <Row className="mb-3">
              <Col sm={4} xs={12}>
                <label className="form-label label">
                  Nombre de evaluacion*
                </label>
              </Col>
              <Col sm={8} xs={12}>
                <input
                  disabled={disableAll}
                  type="text"
                  className="form-control text-center texto"
                  placeholder="Nuevo"
                  required
                  value={nombreEvaluacion}
                  id="NombreEval"
                  onChange={(e) => {
                    setNombreEvaluacion(e.target.value);
                  }}
                ></input>
              </Col>
            </Row>

            {/* Elemento principal */}
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
                    if (tipoElemento.label !== e.label) {
                      setFlagEstado(true);
                    }
                    setStateBussiness(true);
                    setElementos(e);
                    if (e.label === "Otras iniciativas") {
                      setShowValidadorOtrasIniciativas(true);
                    } else {
                      setShowValidadorOtrasIniciativas(false);
                    }
                    if (e.label === "Proveedor") {
                      setShowModalProveedor(true);
                      setContratoSelec([]);
                      setTipoComponente("Input");
                      setTipoProveedor("Principal");
                      setNombreElemento(null);
                      getValidador(e.value);
                      setElementoEv(null);
                      setTipoElemento(e);
                    } else {
                      setShowProveedor(false);
                      //setEstadoEval("Creada");
                      showValidadorOtrasIniciativas(true);
                    }
                  }}
                />
              </Col>

              <Col sm={4} xs={12}>
                {/* controla el comportamiento de Select o Input Elemento PPal/*/}
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
                          setFlagEstado(true);
                        }}
                      />
                    );
                  } else if (tipoCompo === "Input") {
                    return (
                      <input
                        type="text"
                        disabled={
                          tipoElemento.label === "Proveedor" ? true : false
                        }
                        className="form-control text-left texto"
                        placeholder={
                          tipoElemento.label !== "Proveedor"
                            ? "Escriba la iniciativa"
                            : "Seleccione Proveedor"
                        }
                        defaultValue={
                          tipoElemento.label === "Proveedor"
                            ? nombreElemento
                            : elemento
                        }
                        onChange={(e) => {
                          setFlagEstado(true);
                          setElementoEv(e.target.value);
                          getValidador(e.value);
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
                    isRequired
                    value={contratoSelec}
                    options={listaContratosPrin}
                    components={animatedComponents}
                    isMulti
                    placeholder={"Seleccione el contrato"}
                    onChange={(e) => {
                      setFlagEstado(true);
                      getValidador(elemento);
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
                  isDisabled={disableAll}
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
                  isDisabled={disableAll}
                  disabled={tipoElemento !== "Otras Iniciativas" ? false : true}
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
            <Row className="mb-3">
              <Col sm={4} xs={12}>
                <label className="form-label label">Canal</label>
              </Col>
              <Col sm={8} xs={12}>
                <Select
                  id={"Canal"}
                  isDisabled={disableAll}
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
                <label className="form-label label">Proveedor​</label>
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
                    setnombreElementoOtros(null);
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
                <label className="form-label label">Validador</label>
              </Col>
              <Col sm={8} xs={12}>
                <input
                  disabled={disableValidador}
                  isDisabled={
                    tipoElemento === "Otras iniciativas" ? false : true
                  }
                  type="text"
                  value={validador}
                  className="form-control text-left texto"
                  placeholder="Validador automático "
                  required
                  id="validador"
                  onChange={(e) => setValidador(e.target.value)}
                ></input>
              </Col>
            </Row>

            {showValidadorOtrasIniciativas ? (
              <Row className="mb-3">
                <Col sm={4} xs={12}>
                  <label className="form-label label">
                    Validador Otras Iniciativas​*
                  </label>
                </Col>
                <Col sm={8} xs={12}>
                  <MySelect
                    className="texto"
                    options={responsable}
                    onChange={handleChangeResp}
                  />
                </Col>
              </Row>
            ) : (
              <></>
            )}

            <Row className="mb-3">
              <Col sm={4} xs={12}>
                <label className="form-label label">Analista</label>
              </Col>
              <Col sm={8} xs={12}>
                <input
                  disabled={disableAll}
                  type="text"
                  value={analista}
                  className="form-control text-left texto"
                  placeholder="Analista automático"
                  id="analista"
                  onChange={(e) => {
                    if (e.label === "Otras Iniciativas")
                      setAnalista(e.target.value);
                  }}
                ></input>
              </Col>
            </Row>

            {/* /////////////////////////////////////// Fechas //////////////////////////////////////////////// */}

            <Row className="mb-3 mt-4">
              <Col sm={4} xs={12}>
                <label className="form-label label">Fecha creación​</label>
              </Col>
              <Col sm={3} xs={12}>
                <input
                  type="date"
                  value={fechaCreacion}
                  className="form-control text-left texto"
                  placeholder="dd/mm/yyyy"
                  id="analista"
                  disabled
                ></input>
              </Col>

              <Col sm={2} xs={12}>
                <label className="form-label label">Fecha validación</label>
              </Col>
              <Col sm={3} xs={12}>
                <input
                  type="date"
                  value={fechaValidacion}
                  className="form-control text-left texto"
                  placeholder="dd/mm/yyyy"
                  id="analista"
                  disabled
                  onChange={(e) => {
                    setFechaValidac(e.target.value);
                  }}
                ></input>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col sm={4} xs={12}>
                <label className="form-label label">Fecha inactivación​​</label>
              </Col>
              <Col sm={3} xs={12}>
                <input
                  type="date"
                  value={fechaInactivacion}
                  className="form-control text-left texto"
                  placeholder="dd/mm/yyyy"
                  disabled
                  onChange={(e) => {
                    setfechaInactivac(e.target.value);
                  }}
                ></input>
              </Col>
            </Row>

            <ResumenEvaluacion selected={selected} serviceAAD={serviceAAD} />

            {/* //////////////////////////////////// Tablas ////////////////////////////////////////////////// */}
            <Row className="mb-4 mt-4">
              <Col md={12}>
                <hr></hr>
                <h1 className="subtitulo text-left">Riesgos Activos</h1>
              </Col>
            </Row>
            {/* botones */}
            <Row className="mb-3 justify-content-end">
              <Col sm={2} xs={6} className="text-center">
                <Button
                  className="botonPositivo2"
                  onClick={() => {
                    if (!elemento) {
                      setTextAlerta(
                        "Recuerda que antes de escanear los riesgos debes seleccionar como mínimo un Elemento de negocio principal."
                      );
                      setShowAlerta(true);
                    } else {
                      scanRiesgos();
                    }
                  }}
                >
                  Escanear riesgo
                </Button>
              </Col>
              <Col sm={2} xs={6} className="text-right">
                <Button
                  disabled={disableAll}
                  className="botonPositivo2"
                  onClick={() => {
                    setModalShow(true);
                    buscarRiesgos();
                  }}
                >
                  Buscar riesgo
                </Button>
              </Col>
              <Col sm={2} xs={6} className="text-right">
                <Button
                  className="botonPositivo2"
                  onClick={() => {
                    history.push("/crearRiesgo");
                  }}
                >
                  Crear riesgo​
                </Button>
              </Col>
            </Row>
            <br />
            <Paper className={classes.root}>
              <EnhancedTableToolbar numSelected={selected.length} />
              <TableContainer component={Paper} className={classes.container}>
                <Table
                  className={"text"}
                  stickyHeader
                  aria-label="sticky table"
                >
                  <EnhancedTableHead
                    numSelected={selected.length}
                    order={order}
                    orderBy={orderBy}
                    onRequestSort={handleRequestSort}
                    rowCount={
                      muestraRiesgosXTabla(listaGeneralRiesgos, "Tabla_Activos")
                        .length
                    }
                  />
                  {/* Fin de encabezado */}
                  {/* Inicio de cuerpo de la tabla */}
                  <TableBody>
                    {stableSort(
                      muestraRiesgosXTabla(
                        listaGeneralRiesgos,
                        "Tabla_Activos"
                      ),
                      getComparator(order, orderBy)
                    )
                      .slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage
                      )
                      .map((row, index) => {
                        const isItemSelected = isSelected(row.idriesgo);
                        const labelId = `enhanced-table-checkbox-${index}`;
                        return (
                          <TableRow
                            hover
                            role="checkbox"
                            tabIndex={-1}
                            key={row.idriesgo}
                          >
                            <TableCell align="center">
                              {row.idriesgo ? (
                                <Link
                                  hidden
                                  onClick={(event) =>
                                    detalle(event, row.idriesgo)
                                  }
                                  to="detalleRiesgo"
                                ></Link>
                              ) : null}
                            </TableCell>
                            <TableCell
                              component="th"
                              id={labelId}
                              scope="row"
                              align="center"
                            >
                              {row.idriesgo}
                            </TableCell>
                            <TableCell align="right">
                              {row.categoria_corporativa
                                ? row.categoria_corporativa
                                : null}
                            </TableCell>
                            <TableCell align="right">
                              {row.sub_categoria_riesgo
                                ? row.sub_categoria_riesgo
                                : null}
                            </TableCell>

                            <TableCell align="right">
                              {row.nombre_riesgo ? row.nombre_riesgo : null}
                            </TableCell>
                            <TableCell align="center">
                              {row.descripcion_riesgo
                                ? row.descripcion_riesgo
                                : null}
                            </TableCell>
                            <TableCell align="right">
                              {row.p50
                                ? parseFloat(row.p50).toLocaleString()
                                : null}
                            </TableCell>
                            <TableCell align="right">
                              {row.p95
                                ? parseFloat(row.p95).toLocaleString()
                                : null}
                            </TableCell>
                            <TableCell align="center">
                              {row.nivel_riesgo_inherente
                                ? row.nivel_riesgo_inherente
                                : null}
                            </TableCell>
                            <TableCell align="center">
                              {row.nivel_riesgo_residual
                                ? row.nivel_riesgo_residual
                                : null}
                            </TableCell>
                            <TableCell align="right">
                              {row.exposicion_inherente
                                ? parseFloat(row.exposicion_inherente).toLocaleString()
                                : null}
                            </TableCell>
                            <TableCell align="right">
                              {row.exposicion_residual
                                ? parseFloat(row.exposicion_residual).toLocaleString()
                                : null}
                            </TableCell>                      
                            {/*  <TableCell align="right">{null}</TableCell>
                            <TableCell align="right">{null}</TableCell> */}

                            <TableCell align="left">
                              {row.estado_enVista ? row.estado_enVista : " "}
                            </TableCell>
                            <TableCell align="right">
                              {row.usuario_asociador
                                ? row.usuario_asociador
                                : " "}
                            </TableCell>
                            <TableCell align="right">
                              <Switch
                                onClick={(event) =>
                                  handleClick(event, row.idriesgo)
                                }
                                checked={isItemSelected}
                              />
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    {emptyRows > 0 && (
                      <TableRow
                        style={{
                          height: 53 * emptyRows,
                        }}
                      >
                        <TableCell colSpan={6} />
                      </TableRow>
                    )}
                  </TableBody>
                  {/* Fin de cuerpo de la tabla */}
                </Table>
              </TableContainer>
              {/* Inicio de paginación */}
              <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={
                  muestraRiesgosXTabla(listaGeneralRiesgos, "Tabla_Activos")
                    .length
                }
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
              {/* Fin de paginación */}
            </Paper>
            <p></p>

            <Row className="mb-4 mt-4">
              <Col md={12}>
                <hr />
                <h1 className="subtitulo text-left">Riesgos Inactivos</h1>
              </Col>
            </Row>
            <Row>
              <Col sm={8}></Col>
              <Col sm={2} xs={12} className="text-right">
                <button
                  data-toggle="modal"
                  data-target="#exampleModal"
                  type="button"
                  className="btn botonNegativo2"
                  id="efecto_propio"
                  onClick={(event) => {
                    setFlagEstado(true);
                    AsociarRiesgo(event);
                    setSelectedInactivos([]);
                  }}
                >
                  Activar Riesgo
                </button>
              </Col>
            </Row>
            <p></p>
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
                    <TableRow
                      style={{ backgroundColor: "#2c2a29", color: "#ffffff" }}
                    >
                      <StyledTableCell
                        padding="checkbox"
                        style={{ backgroundColor: "#2c2a29", color: "#ffffff" }}
                      ></StyledTableCell>
                      <StyledTableCell
                        align="left"
                        style={{ backgroundColor: "#2c2a29", color: "#ffffff" }}
                      ></StyledTableCell>
                      <StyledTableCell
                        align="left"
                        style={{ backgroundColor: "#2c2a29", color: "#ffffff" }}
                      >
                        Id Riesgo
                      </StyledTableCell>
                      <StyledTableCell
                        align="left"
                        style={{ backgroundColor: "#2c2a29", color: "#ffffff" }}
                      >
                        Categoría
                      </StyledTableCell>
                      <StyledTableCell
                        align="left"
                        style={{ backgroundColor: "#2c2a29", color: "#ffffff" }}
                      >
                        Riesgo
                      </StyledTableCell>
                      <StyledTableCell
                        align="left"
                        style={{ backgroundColor: "#2c2a29", color: "#ffffff" }}
                      >
                        Descripción
                      </StyledTableCell>
                      <StyledTableCell
                        align="left"
                        style={{ backgroundColor: "#2c2a29", color: "#ffffff" }}
                      >
                        P50
                      </StyledTableCell>
                      <StyledTableCell
                        align="left"
                        style={{ backgroundColor: "#2c2a29", color: "#ffffff" }}
                      >
                        P95
                      </StyledTableCell>
                       <StyledTableCell
                        align="left"
                        style={{ backgroundColor: "#2c2a29", color: "#ffffff" }}
                      >
                        Riesgo Inherente
                      </StyledTableCell>
                      <StyledTableCell
                        align="left"
                        style={{ backgroundColor: "#2c2a29", color: "#ffffff" }}
                      >
                        Riesgo Residual
                      </StyledTableCell>
                      <StyledTableCell
                        align="left"
                        style={{ backgroundColor: "#2c2a29", color: "#ffffff" }}
                      >
                        Exposición Inherente
                      </StyledTableCell>
                      <StyledTableCell
                        align="left"
                        style={{ backgroundColor: "#2c2a29", color: "#ffffff" }}
                      >
                        Exposición Residual
                      </StyledTableCell>
                      <StyledTableCell
                        align="left"
                        style={{ backgroundColor: "#2c2a29", color: "#ffffff" }}
                      >
                        Estado
                      </StyledTableCell>
                      <StyledTableCell
                        align="left"
                        style={{ backgroundColor: "#2c2a29", color: "#ffffff" }}
                      >
                        Fecha inactivo
                      </StyledTableCell>
                      <StyledTableCell
                        align="left"
                        style={{ backgroundColor: "#2c2a29", color: "#ffffff" }}
                      >
                        Motivo inactivo
                      </StyledTableCell>
                      <StyledTableCell
                        align="left"
                        style={{ backgroundColor: "#2c2a29", color: "#ffffff" }}
                      >
                        Usuario que inactivó
                      </StyledTableCell>
                    </TableRow>
                  </TableHead>
                  {/* Fin de encabezado */}
                  {/* Inicio de cuerpo de la tabla */}
                  <TableBody>
                    {stableSort(
                      muestraRiesgosXTabla(
                        listaGeneralRiesgos,
                        "Tabla_Inactivos"
                      ),
                      getComparator(order, orderBy)
                    )
                      .slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage
                      )
                      .map((row, index) => {
                        const isItemSelected = isSelectedInactivos(
                          row.idriesgo
                        );
                        return (
                          <TableRow
                            key={row.idriesgo}
                            hover
                            onClick={(event) =>
                              handleClickInactivos(event, row.idriesgo)
                            }
                            selected={isItemSelected}
                            role="checkbox"
                            tabIndex={-1}
                          >
                            <TableCell component="th" scope="row">
                              <Checkbox checked={isItemSelected} />
                            </TableCell>
                            <TableCell align="center">
                              {row.idriesgo ? (
                                <Link
                                  hidden
                                  onClick={(event) =>
                                    detalle(event, row.idriesgo)
                                  }
                                  to="detalleRiesgo"
                                  target="_blank"
                                ></Link>
                              ) : null}
                            </TableCell>
                            <StyledTableCell
                              component="th"
                              scope="row"
                              align="center"
                            >
                              {row.idriesgo ? row.idriesgo : null}
                            </StyledTableCell>
                            <StyledTableCell align="left">
                              {row.categoria_corporativa
                                ? row.categoria_corporativa
                                : null}
                            </StyledTableCell>
                            <StyledTableCell align="left">
                              {row.nombre_riesgo ? row.nombre_riesgo : null}
                            </StyledTableCell>
                            <StyledTableCell align="left">
                              {row.descripcion_riesgo
                                ? row.descripcion_riesgo
                                : null}
                            </StyledTableCell>
                            <StyledTableCell align="left">
                              {row.p50
                                ? parseFloat(row.p50).toLocaleString()
                                : null}
                            </StyledTableCell>
                            <StyledTableCell align="left">
                              {row.p95
                                ? parseFloat(row.p95).toLocaleString()
                                : null}
                            </StyledTableCell>
                            <StyledTableCell align="left">
                              {row.nivel_riesgo_inherente ? row.nivel_riesgo_inherente : null}
                            </StyledTableCell>
                            <StyledTableCell align="left">
                              {row.nivel_riesgo_residual
                                ? row.nivel_riesgo_residual
                                : null}
                            </StyledTableCell>
                            <StyledTableCell align="left">
                              {row.exposicion_inherente
                                ? parseFloat(row.exposicion_inherente).toLocaleString()
                                : null}
                            </StyledTableCell>
                            <StyledTableCell align="left">
                              {row.exposicion_residual
                                ? parseFloat(row.exposicion_residual).toLocaleString()
                                : null}
                            </StyledTableCell>
                            <StyledTableCell align="left">
                              {row.estado_enVista ? row.estado_enVista : " "}
                            </StyledTableCell>
                            <StyledTableCell align="left">
                              {row.fecha_inactivacion
                                ? row.fecha_inactivacion
                                : null}
                            </StyledTableCell>
                            <StyledTableCell align="left">
                              {row.motivo_inactivacion
                                ? row.motivo_inactivacion
                                : null}
                            </StyledTableCell>
                            <StyledTableCell align="left">
                              {row.usuario_inactivador
                                ? row.usuario_inactivador
                                : null}
                            </StyledTableCell>
                          </TableRow>
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
                  muestraRiesgosXTabla(listaGeneralRiesgos, "Tabla_Inactivos")
                    .length
                }
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
              {/* Fin de paginación */}
            </Paper>
          </Container>
        </Form>
      )}
    </>
  );
}
