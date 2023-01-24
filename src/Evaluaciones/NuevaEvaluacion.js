import React, { useState, useEffect } from "react";

import ResumenEvaluacion from "./ResumenEvaluacion";
import ModalBuscarRiesgos from "./ModalBuscarRiesgos";
import ModalAlerta from "../Globales/ModalAlerta";
import Loader from "react-loader-spinner";
import { Row, Col, Form, Alert, Button, Container } from "react-bootstrap";
import { Link, useHistory } from "react-router-dom";
import makeAnimated from "react-select/animated";
import PropTypes from "prop-types";
import Select from "react-select";
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
import ModalProveedor from "../Maestros/Proveedores/ModalProveedor";

import axios from "axios";

import AADService from "../auth/authFunctions";
const _ = require("lodash");
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

export default function CrearEvaluacion(props) {
  const serviceAAD = new AADService();
  //* Reciben los datos para llenar cada uno de los Select

  const [elementoNegPal, setElementoNegPal] = useState([]);
  const [companias, setCompanias] = useState([]);
  const [listaElementos, setTipoElementoSelect] = useState([]);
  const [listaProceso, setListaProceso] = useState([]);
  //const [listaProveedor, setListaProveedor] = useState(["sin informacion"]);
  const [listaProducto, setListaProducto] = useState([]);
  const [listaCanal, setListaCanal] = useState([]);
  const [Proveedor, setProveedor] = useState([]);
  const [contratoSelec, setContratoSelec] = useState([]);
  const [contratoOtros, setContratoOtros] = useState([]);
  const [showValidadorOtrasIniciativas, setShowValidadorOtrasIniciativas] =
    useState(false);
  //*para trabajar contratos
  const [listaContratos, setListaContratos] = useState([]);
  const [showProveedor, setShowProveedor] = useState(false);
  const [showContratos, setShowContratos] = useState(false);
  const [showModalProveedor, setShowModalProveedor] = React.useState(false);
  const [disableValidador, setDisableValidador] = useState(true);
  //* REciben los datos filtrados

  const [listaProceso_filtered, setListaProcesoFiltered] = useState([]);
  const [listaProveedor_filtered, setListaProveedorFiltered] = useState([]);
  const [listaProyecto_filtered, setListaProyectoFiltered] = useState([]);
  const [listaProducto_filtered, setListaProductoFiltered] = useState([]);
  const [listaCanal_filtered, setListaCanalFiltered] = useState([]);
  const [listaProveedores, setListaProveedores] = useState([]);
  const [listaContratosPrin, setListaContratosPrin] = useState([]);
  //* Reciben los datos ingresados/elegidos por el usuario

  const [compania, setCompania] = useState(null);
  const [nombre_eval, setNombre_eval] = useState(null);
  const [tipoElemento, setTipoElemento] = useState(null);
  const [elemento, setElementoEv] = useState(null);
  const [proceso, setProceso] = useState(null);
  const [canal, setCanal] = useState(null);
  const [producto, setProducto] = useState(null);
  const [validador, setValidador] = useState(null);
  const [contrato, setContrato] = useState([]);
  const [tipoProveedor, setTipoProveedor] = useState([]);
  //* controla el comportamiento de los componentes
  const [responsable, setResponsable] = useState([]);
  const [tipoCompo, setTipoComponente] = useState("Select");
  const [validated, setValidated] = useState(false);
  const history = useHistory();
  const [showAlerta, setShowAlerta] = useState(false);
  const [textAlerta, setTextAlerta] = useState(false);
  const [modalShow, setModalShow] = React.useState(false);
  const [dataGrid, setDataGrid] = useState([]);
  const [estadoPost, setEstadoPost] = useState([]);
  const [loadingData, setLoadingData] = React.useState(false);
  const [selectedValueResponsable, setSelectedValueResponsable] =
    useState(null);

  //* variables para modal buscar riesgos
  const [listaGeneralRiesgos, setListaGeneralRiesgos] = useState([]);

  //* Variables para tabla de Riesgos Activos

  const [dataScanRiesgos, setDataScanRiesgos] = useState([]);
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("idriesgo");
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const correoAnalistaLog = serviceAAD.getUser().userName;
  //*variable para inhabilitar el boton de guardar e insertar el spiner
  const [habilitarBoton, setHabilitarBoton] = React.useState(true);
  const [nombreElemento, setNombreElemento] = React.useState(null);
  const [nombreElementoOtros, setNombreElementoOtros] = React.useState(null);

  const classes = { root: "", container: "" };
  //const classes = useStyles();

  useEffect(() => {
    setLoadingData(true);

    let listaProveedor;

    const getData = async (url) => {
      return await axios.get(process.env.REACT_APP_API_URL + "/" + url, {
        headers: {
          Authorization: "Bearer " + serviceAAD.getToken(),
        },
      });
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
    // método proveedores

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

    async function getCompania() {
      try {
        const response = await getData("maestros_ro/compania/");
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
    async function getElementoNegPal() {
      try {
        const response = await getData(
          "generales/Evaluaciones/Tipo_elemento_negocio_principal"
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
    async function getProceso() {
      try {
        const response = await getData("ultimonivel/Proceso");
        let datos = response.data.map(
          ({ id: value, nombre: label, idcompania }) => ({
            value,
            label,
            idcompania,
          })
        );
        setListaProceso(datos);
      } catch (error) {
        console.error(error);
      }
    }
    async function getProductos() {
      try {
        const response = await getData("ultimonivel/Producto");
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
    async function getCanal() {
      try {
        const response = await getData("ultimonivel/Canal");
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
    getCompania();
    getElementoNegPal();
    getProceso();
    getProductos();
    getCanal();
    setLoadingData(false);
  }, []);

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
              align="center"
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
            {numSelected} riesgos asociados
          </Typography>
        ) : (
          <></>
        )}

        {/* {numSelected > 0 ? (
          <Button
            className="botonIngreso"
            onClick={() => {
              asociarRiesgos();
            }}
          >
            Asociar​
          </Button>
        ) : (
          <></>
        )} */}
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

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = dataScanRiesgos.map((n) => n.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

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
        riesgo.estado_enVista === "Inactivos" &&
        tabla === "Inactivos"
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

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }
    setSelected(newSelected);
  };

  const isSelected = (name) => selected.indexOf(name) !== -1;

  const emptyRows =
    page > 0
      ? Math.max(0, (1 + page) * rowsPerPage - dataScanRiesgos.length)
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
    if (nombre_eval !== null && nombre_eval !== "") {
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
  };

  //** filtra riesgos para evitar registros repetidos */

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

  //**Trae los riesgos asociados a los elementos seleccionados por el usuario en los camnpos de elemento ppal, proceso, canales y productos */

  const scanRiesgos = (event) => {
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
          console.error(response);
        }
      })
      .catch(function (error) {
        console.error(error.response.data);
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
  };

  //** Trae los riesgos para que el usuario busque aquel que no encontró en ScanRiesgos */

  const buscarRiesgos = (event) => {
    async function getRiesgos() {
      try {
        const response = await axios.get(
          process.env.REACT_APP_API_URL + "/riesgo_valoracion",
          {
            headers: {
              // Authorization: "Bearer " + token
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

  //** Envía los datos de toda la evalauciona al back */

  const sendData = () => {
    setHabilitarBoton(false);
    async function limpiar(state) {
      setTimeout(() => {
        // if (state === 2) {
        //   history.push("/EditarAreaOrganizacional");
        // }
        setHabilitarBoton(true);
        setEstadoPost({ id: 0, data: null });
      }, 3000);
    }

    let year = new Date();
    let month = new Date();
    let day = new Date();
    const today =
      year.getFullYear() + "-" + month.getMonth() + "-" + day.getDate();
    if (checkValidez() === false) {
      setEstadoPost(7);
    } else if (checkValidez() === true) {
      let canales = [];
      let productos = [];
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
      } else {
        elemento_ppal_evaluado = elemento ? Object.values(elemento)[0] : null;
      }
      var datosEvaluacion = {
        nombre_evaluacion: nombre_eval,
        tipo_elemento_evaluado: tipoElemento
          ? Object.values(tipoElemento)[1]
          : null,
        elemento_ppal_evaluado:
          typeof elemento === "object" ? Object.values(elemento)[0] : elemento,
        estado: "Creada",
        idproceso: proceso ? Object.values(proceso)[0] : null,
        idcanal: canales,
        idproducto: productos,
        tipo_de_evento: 1,
        idcompania: compania ? Object.values(compania)[0] : null,
        idproveedor: Proveedor ? Proveedor.ID_SAP : null,
        Id_contrato: contratoOtros,
        Id_contrato_prin: contratoSelec,
        Responsable: selectedValueResponsable
          ? selectedValueResponsable.value.toString()
          : null,
        pos_vali_otras_iniciativas: selectedValueResponsable
          ? selectedValueResponsable.value
          : null,
        /* fecha_enviada: today, */
        /* fecha_validada: today,
        fecha_inactivada: "2000-00-00",  */
      };

      JSON.stringify(datosEvaluacion);
      //Guarda
      axios
        .post(process.env.REACT_APP_API_URL + "/evaluacion", datosEvaluacion, {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + serviceAAD.getToken(),
          },
        })
        .then(function (response) {
          if (response.status >= 200 && response.status < 300) {
            setEstadoPost(2);
            if (selected !== []) {
              var datosRiesgos = [];
              selected.map((e) => {
                datosRiesgos.push({
                  idevaluacion: response.data.idevaluacion,
                  idriesgo: e,
                  estado_asociacion: "Activo",
                  fecha_asociacion: today,
                  fecha_inactivacion: null,
                  motivo_inactivacion: null,
                  usuario_asociador: correoAnalistaLog,
                  usuario_inactivador: null,
                });
              });
              JSON.stringify(datosRiesgos);
              axios
                .post(
                  process.env.REACT_APP_API_URL + "/rx_evaluacion_riesgo/",
                  datosRiesgos,
                  {
                    headers: {
                      "Content-Type": "application/json",
                      Authorization: "Bearer " + serviceAAD.getToken(),
                    },
                  }
                )
                .then(function (response_rx_eval) {
                  if (
                    response_rx_eval.status >= 200 &&
                    response_rx_eval.status < 300
                  ) {
                    localStorage.setItem(
                      "idEvaluacion",
                      response.data.idevaluacion
                    );
                    setTimeout(() => {
                      history.push("/editarEvaluacion");
                    }, 2000);
                    setEstadoPost(2);
                  } else if (
                    response_rx_eval.status >= 300 &&
                    response_rx_eval.status < 400
                  ) {
                    setEstadoPost(4);
                  } else if (
                    response_rx_eval.status >= 400 &&
                    response_rx_eval.status < 512
                  ) {
                    setEstadoPost(5);
                  }
                })
                .catch((errors) => {
                  // react on errors.
                  console.error(errors);
                });
            }
          } else if (response.status >= 300 && response.status < 400) {
            setEstadoPost(4);
          } else if (
            response.status.status >= 400 &&
            response.status.status < 512
          ) {
            setEstadoPost(5);
          }
        });
      let evaluacion;
      setValidated(true);
      setSelectedValueResponsable({
        value: evaluacion.idposicion,
        label: evaluacion.validador,
      });
      if (evaluacion.tipo_elemento_evaluado === "Otras iniciativas") {
        setShowValidadorOtrasIniciativas(true);
      } else {
        setShowValidadorOtrasIniciativas(false);
      }
    }
    limpiar();
  };

  const detalle = (event, idRiesgo) => {
    localStorage.setItem("idRiesgo", idRiesgo);
  };

  const mostrarContratos = (e) => {
    let proveedor = e.value;
    setShowProveedor(false);
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
          <AlertDismissibleExample alerta={estadoPost} />

          <ModalBuscarRiesgos
            modalShow={modalShow}
            setModalShow={setModalShow}
            listaGeneralRiesgos={listaGeneralRiesgos}
            setListaGeneralRiesgos={setListaGeneralRiesgos}
            selected={selected}
            setSelected={setSelected}
          />

          <ModalAlerta
            showAlerta={showAlerta}
            setShowAlerta={setShowAlerta}
            text={textAlerta}
          />
          <Container>
            <Row className="mb-3 mt-3">
              <Col md={12}>
                <h1 className="titulo">Crear evaluacion</h1>
              </Col>
            </Row>
            <Form>
              {/* ///////////////////////////// Acciones ////////////////////////////// */}
              <Row className="mb-5">
                <Col sm={6} xs={1}></Col>
                <Col sm={3} xs={3}>
                  <Link to="evaluaciones">
                    <button type="button" className="btn botonNegativo">
                      Cancelar
                    </button>
                  </Link>
                </Col>
                {habilitarBoton ? (
                  <Col sm={3} xs={3}>
                    <button
                      type="button"
                      className="btn botonPositivo"
                      id="send"
                      onClick={() => {
                        sendData();
                      }}
                    >
                      Guardar
                    </button>
                  </Col>
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
              </Row>
              <Row className="mb-3">
                <Col sm={4} xs={0}></Col>
                <Col>
                  <div className="form-text">* Campos obligatorios</div>
                </Col>
              </Row>
              {/* 
        <Row className="mb-3">
          <Col sm={4} xs={12}>
            <label className="label forn-label">Id Evaluacion</label>
          </Col>
          <Col sm={4} xs={12}>
            <input
              type="text"
              disabled
              className="form-control text-center texto"
              placeholder="ID Automático"
              id="IDevaluacion"
            ></input>
          </Col>
        </Row> */}
              {/* Nombre Evaluación */}
              <Row className="mb-3">
                <Col sm={4} xs={12}>
                  <label className="form-label label">
                    Nombre de evaluacion*
                  </label>
                </Col>
                <Col sm={8} xs={12}>
                  <input
                    type="text"
                    className="form-control text-center texto"
                    placeholder="Nuevo"
                    required
                    id="NombreEval"
                    onChange={(e) => {
                      setNombre_eval(e.target.value);
                    }}
                  ></input>
                  <Form.Control.Feedback type="invalid">
                    Por favor introduzca un nombre.
                  </Form.Control.Feedback>
                </Col>
              </Row>
              {/* Selección de compañía */}
              <Row className="mb-3">
                <Col sm={4} xs={12} className="text-left">
                  <label className="label form-label">Compañía*</label>
                </Col>
                <Col sm={8} xs={12}>
                  <Select
                    components={animatedComponents}
                    options={companias}
                    placeholder={"Seleccione la compañia"}
                    onChange={FiltrarMaestros}
                  />
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
                      if (e.label === "Otras iniciativas") {
                        setShowValidadorOtrasIniciativas(true);
                      } else {
                        setShowValidadorOtrasIniciativas(false);
                      }
                      if (e.label === "Proveedor") {
                        setShowModalProveedor(true);
                        //FiltrarProveedor(e);
                        setContratoSelec([]);
                        //setListaContratosPrin([]);
                        setTipoComponente("Input");
                        setTipoProveedor("Principal");
                        setNombreElemento(null);
                      } else {
                        setShowProveedor(false);
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
                          }}
                        />
                      );
                    } else if (tipoCompo === "Input") {
                      return (
                        <input
                          type="text"
                          disabled={tipoElemento !== "Proveedor" ? false : true}
                          className="form-control text-left texto"
                          placeholder={
                            tipoElemento !== "Proveedor"
                              ? "Escriba la iniciativa"
                              : "Proveedor"
                          }
                          defaultValue={nombreElemento}
                          onChange={(e) => {                            
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
                      Contratos Asociados​*
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
                    components={animatedComponents}
                    options={listaProceso_filtered}
                    isClearable
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

              {/* <Row className="mb-3">
          <Col sm={4} xs={12}>
            <label className="form-label label">Analista</label>
          </Col>
          <Col sm={8} xs={12}>
            <input
              type="text"
              className="form-control text-left texto"
              placeholder="Analista automático"
              required
              disabled
              id="analista"
            ></input>
          </Col>
        </Row> */}

              {/* /////////////////////////////////////// Fechas //////////////////////////////////////////////// */}

              <Row className="mb-3 mt-4">
                <Col sm={2} xs={12}>
                  <label className="form-label label">Fecha creación​</label>
                </Col>
                <Col sm={2} xs={12}>
                  <input
                    type="text"
                    className="form-control text-left texto"
                    placeholder="Automatica"
                    required
                    disabled
                  ></input>
                </Col>

                <Col sm={2} xs={12}>
                  <label className="form-label label">Fecha validación</label>
                </Col>
                <Col sm={2} xs={12}>
                  <input
                    type="text"
                    className="form-control text-left texto"
                    placeholder="dd/mm/yyyy"
                    required
                    disabled
                  ></input>
                </Col>

                <Col sm={2} xs={12}>
                  <label className="form-label label">
                    Fecha inactivación​​
                  </label>
                </Col>
                <Col sm={2} xs={12}>
                  <input
                    type="text"
                    className="form-control text-left texto"
                    placeholder="dd/mm/yyyy"
                    required
                    disabled
                    id="analista"
                  ></input>
                </Col>
              </Row>

              <ResumenEvaluacion
                selected={selected}
                serviceAAD={serviceAAD}
                setTextAlerta={setTextAlerta}
                setShowAlerta={setShowAlerta}
              />

              {/* //////////////////////////////////// Tablas ////////////////////////////////////////////////// */}
              <hr />

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
              <Row className="mb-2 mt-4">
                <Col md={12}>
                  <h1 className="subtitulo text-left">Riesgos activos</h1>
                </Col>
              </Row>

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
                      onSelectAllClick={handleSelectAllClick}
                      onRequestSort={handleRequestSort}
                      rowCount={
                        muestraRiesgosXTabla(
                          listaGeneralRiesgos,
                          "Tabla_Activos"
                        ).length
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
                              onClick={(event) =>
                                handleClick(event, row.idriesgo)
                              }
                              role="checkbox"
                              aria-checked={isItemSelected}
                              tabIndex={-1}
                              key={row.idriesgo}
                              selected={isItemSelected}
                            >
                              <TableCell align="center">
                                {row.idriesgo ? (
                                  <Link
                                    onClick={(event) =>
                                      detalle(event, row.idriesgo)
                                    }
                                    to="detalleRiesgo"
                                    target="_blank"
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
                              <TableCell align="right">
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
                            <TableCell align="center">
                              {row.estado_enVista ? row.estado_enVista : " "}
                            </TableCell>
                            <TableCell align="right">
                              <Switch checked={isItemSelected} />
                            </TableCell>
                            </TableRow>
                          );
                        })}
                      {emptyRows > 0 && (
                        <TableRow
                          style={{
                            height: (dense ? 33 : 53) * emptyRows,
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
            </Form>
          </Container>
        </>
      )}
    </>
  );
}
