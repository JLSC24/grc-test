import React, { useEffect, useContext } from "react";
import clsx from "clsx";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import Drawer from "@material-ui/core/Drawer";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import List from "@material-ui/core/List";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import { Row, Col, Badge } from "react-bootstrap";
import Loader from "react-loader-spinner";
import LogoutIcon from "@mui/icons-material/Logout";
import { Items, listaMenu } from "./listItems";
import Inicio from "./inicio";
import NuevaArea from "./AreasOrganizacionales/NuevaAreaO";
import AreasOrganizacionales from "./AreasOrganizacionales/AreasOrganizacionales";
import EditarArea from "./AreasOrganizacionales/EditarAreaO";
import UnidadesRiesgo from "./UnidadesRiesgo/UnidadesRiesgo";
import EditarUnidadRO from "./UnidadesRiesgo/EditarUnidad";
import NuevaUnidadRO from "./UnidadesRiesgo/NuevaUnidad";
import Procesos from "./Procesos/Procesos";
import NuevoProceso from "./Procesos/NuevoProceso";
import EditarProceso from "./Procesos/EditarProceso";
import Productos from "./Productos/Productos";
import NuevoProducto from "./Productos/NuevoProducto";
import EditarProducto from "./Productos/EditarProducto";
import Canales from "./Canales/Canales";
import NuevoCanal from "./Canales/NuevoCanal";
import EditarCanal from "./Canales/EditarCanal";
import ObjetosCosto from "./ObjetosCosto/ObjetosCosto";
import NuevoObjetoCosto from "./ObjetosCosto/NuevoObjetoCosto";
import EditarObjetoCosto from "./ObjetosCosto/EditarObjetoCosto";
import CategoriasRO from "./CategoriasRO/CategoriasRO";
import NuevaCategoriaRO from "./CategoriasRO/NuevaCategoriaRO";
import EditarCategoriaRO from "./CategoriasRO/EditarCategoriaRO";
import LineasNegocio from "./LineaNegocio/LineasNegocio";
import NuevaLineaNegocio from "./LineaNegocio/NuevaLineaNegocio";
import EditarLineaNegocio from "./LineaNegocio/EditarLineaNegocio";
import Causas from "./Causas/Causas";
import NuevaCausa from "./Causas/NuevaCausa";
import EditarCausa from "./Causas/EditarCausa";
import TiposFallas from "./TipoFallas/TiposFallas";
import NuevoTipoFalla from "./TipoFallas/NuevoTipoFalla";
import EditarTipoFalla from "./TipoFallas/EditarTipoFalla";
import Geografias from "./Geografias/Geografias";
import NuevaGeografia from "./Geografias/NuevaGeografia";
import EditarGeografia from "./Geografias/EditarGeografia";
import CuentasContables from "./CuentasContables/CuentasContables";
import NuevaCuentaContable from "./CuentasContables/NuevaCuentaContable";
import EditarCuentaContable from "./CuentasContables/EditarCuentaContable";
import EventosMaterialzados from "./EventosMaterializados/EventosMaterializados";
import Descarga_eventos from "./EventosMaterializados/Descarga_eventos";
import ServiciosValoracion from "./ServiciosValoracion/ServiciosValoracion";
import CrearEfecto from "./ServiciosValoracion/CrearEfecto";
import AgregarEfecto from "./ServiciosValoracion/AgregarEfecto";
import Responsables_sin from "./AdminRiesgos/responsables_sin";
import UnidadesAnalistas_sin from "./AdminRiesgos/unidadesAnalistas_sin";
import Evaluaciones from "./Evaluaciones/Evaluaciones";
import CrearEvaluacion from "./Evaluaciones/NuevaEvaluacion";
import EditarEvaluacion from "./Evaluaciones/EditarEvaluacion";
import CrearRiesgo from "./Riesgo/NuevoRiesgo";
import EditarRiesgo from "./Riesgo/EditarRiesgo";
import CausasControles from "./Riesgo/CausasControles";
import ValoracionRiesgo from "./Riesgo/ValoracionRiesgo";
import ValoracionSOX from "./Riesgo/ValoracionSOX";

import Riesgos from "./Riesgo/Riesgos";
import DetalleRiesgo from "./Riesgo/DetalleRiesgo";

import Controles from "./Controles/Controles";
import EditarCrearEfecto from "./ServiciosValoracion/EditarCrearEfecto";
import EditarAgregarEfecto from "./ServiciosValoracion/EditarAgregarEfecto";
import CrearControl from "./Controles/NuevoControl";
// import CrearIpe from "./Controles/NuevoIpe";
import EditarControl from "./Controles/EditarControles";
import Descargas from "./AdminAplicativo/Descargas";
import EditarRegistro from "./ValidacionContable/EditarRegistro";
import NuevoRegistro from "./ValidacionContable/NuevoRegistro";
import InformeContable from "./ValidacionContable/InformeContable";
import RegistrosPendientes from "./ValidacionContable/RegistrosPendientes";

import Generales from "./AdminAplicativo/Generales";
import CargaArchivos from "./AdminAplicativo/CargaArchivos";

import CargarControles from "./Controles/CargarControles";
import AADService from "./auth/authFunctions";
import Decisiones from "./Decisiones/Decisiones";
import TomarDecision from "./Decisiones/TomarDecision";
import PlanesAccion from "./PlanesAccion/PlanesAccion";
import CrearPlanAccion from "./PlanesAccion/NuevoPlan";
import EditarPlanAccion from "./PlanesAccion/EditarPlan";
import Proveedores from "./Maestros/Proveedores/Proveedores";
import NuevoProveedor from "./Maestros/Proveedores/NuevoProveedor";
import EditarProveedor from "./Maestros/Proveedores/EditarProveedor";
import Certificacion from "./Maestros/Certificacion/Certificacion";
import NuevaCertificacion from "./Maestros/Certificacion/NuevaCertificacion";
import EditarCertificacion from "./Maestros/Certificacion/EditarCertificacion";
import Chat from "./CARO/chat/Chat";
import OpcionesCriticas from "./OtrosElementosRiesgo/OpcionesCriticas/OpcionesCriticas";
import Macroeventos from "./EventosMaterializados/Macroeventos/Macroeventos";
import NuevoMacroevento from "./EventosMaterializados/Macroeventos/NuevoMacroEvento";
import EditarMacroevento from "./EventosMaterializados/Macroeventos/EditarMacroevento";

import Eventos from "./EventosMaterializados/Eventos/";
import NuevoEvento from "./EventosMaterializados/Eventos/NuevoEvento";
import NuevoEfecto from "./EventosMaterializados/Efectos/NuevoEfecto";
import Efectos from "./EventosMaterializados/Efectos";
import EditarEvento from "./EventosMaterializados/Eventos/EditarEvento";
import EditarEfecto from "./EventosMaterializados/Efectos/EditarEfecto";
import Recuperaciones from "./EventosMaterializados/Recuperaciones";
import NuevaRecuperacion from "./EventosMaterializados/Recuperaciones/NuevaRecuperacion";
import EditarRecuperacion from "./EventosMaterializados/Recuperaciones/EditarRecuperacion";
import DescargaMaestros from "./Maestros/DescargaMaestros/Descarga_maestros";
import { UsuarioContext } from "./Context/UsuarioContext";
import Usuarios from "./AdminAplicativo/Usuarios/Usuarios";
import OpcionRol from "./AdminAplicativo/OpcionRol";
import Roles from "./AdminAplicativo/Roles/Roles";
import Listas from "./AdminAplicativo/Listas/Listas";
import NuevaLista from "./AdminAplicativo/Listas/NuevaLista";
import EditarLista from "./AdminAplicativo/Listas/EditarLista";
import NuevoRol from "./AdminAplicativo/Roles/NuevoRol";
import EditarRol from "./AdminAplicativo/Roles/EditarRol";
import NuevoUsuario from "./AdminAplicativo/Usuarios/NuevoUsuario";
import EditarUsuario from "./AdminAplicativo/Usuarios/EditarUsuario";
import NuevaOpcionCritica from "./OtrosElementosRiesgo/OpcionesCriticas/CrearOpcionCritica";
import EditarOpcionCritica from "./OtrosElementosRiesgo/OpcionesCriticas/EditarOpcionCritica";
import NuevaSoD from "./OtrosElementosRiesgo/SoD/NuevaSoD";
import EditarSoD from "./OtrosElementosRiesgo/SoD/EditarSoD";
import SoD from "./OtrosElementosRiesgo/SoD/SoD";
import VerAplicacion from "./OtrosElementosRiesgo/Aplicaciones/VerAplicacion";
import Aplicaciones from "./OtrosElementosRiesgo/Aplicaciones/Aplicaciones";

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  toolbar: {
    paddingRight: 24, // keep right padding when drawer closed
    color: "#ffffff",
    backgroundColor: "#2c2a29",
    borderBottom: "solid",
    borderBottomColor: "#fdda24",
    borderBottomWidth: "0.5vw",
  },
  toolbarIcon: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: "0 8px",
    ...theme.mixins.toolbar,
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: 36,
  },
  menuButtonHidden: {
    display: "none",
  },
  title: {
    flexGrow: 1,
  },
  drawerPaper: {
    color: "#ffffff",
    backgroundColor: "#2c2a29",
    position: "relative",
    whiteSpace: "nowrap",
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerPaperClose: {
    overflowX: "hidden",
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    width: theme.spacing(7),
    [theme.breakpoints.up("sm")]: {
      width: theme.spacing(0),
    },
  },
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    height: "100vh",
    overflow: "auto",
  },
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  paper: {
    padding: theme.spacing(2),
    display: "flex",
    overflow: "auto",
    flexDirection: "column",
  },
  fixedHeight: {
    height: 240,
  },
}));

export default function Home() {
  const serviceAAD = new AADService();
  const classes = useStyles();
  let token = serviceAAD.getToken();

  const mainListItems = token ? Items() : null;
  const [open, setOpen] = React.useState(true);
  const [user, setUser] = React.useState(null);
  const [userId, setUserId] = React.useState(null);

  const [dataRouter, setDataRouter] = React.useState(null);

  const { dataUsuario, setDataUsuario } = useContext(UsuarioContext);

  useEffect(() => {
    if (token == null) {
      /* setTimeout(function () {
        window.location.reload();
      }, 30); */
    } else {
      setUser(serviceAAD.getUser().profile.name);
      if (
        serviceAAD.getUser().userName === "jsoriano@bancolombia.com.co" ||
        serviceAAD.getUser().userName === "eiosorio@bancolombia.com.co"
      ) {
        console.warn(serviceAAD.getToken());
      }
      const fetchdata = async () => {
        const result = await fetch(
          process.env.REACT_APP_API_URL + "/usuarios/menu/" +
            serviceAAD.getUser().userName +
            "/",
          {
            method: "GET",
            headers: {
              Accept: "application/json",
              Authorization: "Bearer " + serviceAAD.getToken(),
            },
          }
        );
        let data = await result.json();

        const rolUser = await fetch(
          process.env.REACT_APP_API_URL + "/usuario/" +
            serviceAAD.getUser().userName +
            "/",
          {
            method: "GET",
            headers: {
              Accept: "application/json",
              Authorization: "Bearer " + serviceAAD.getToken(),
            },
          }
        );
        let dataUser = await rolUser.json();

        setDataUsuario(data[0]);

        data = data.filter((option) => option.orden != 0 && option.padre != 0);
        data = data.map((opcion2) => {
          return {
            idopcion: opcion2.idopcion,
            opcion: opcion2.opcion,
            url_opcion: opcion2.url_opcion,
            permisos: opcion2.permisos,
            idRol: dataUser.idrol,
            idposicion: dataUser.idposicion,
          };
        });
        setDataRouter(ItemsRouter(data));
      };
      fetchdata();
    }
  }, []);

  const handleDrawerOpen = () => {
    setOpen(true);
  };
  const handleDrawerClose = () => {
    setOpen(false);
  };

  const searchComponent = (code, permisos, idrol, idposicion) => {
    let componentes = [];
    switch (code) {
      case "Riesgos":
        componentes.push(
          <Route
            path="/riesgos"
            render={() => (
              <Riesgos
                permisos={permisos}
                idrol={idrol}
                idposicion={idposicion}
              />
            )}
            key={code}
            id={code}
            exact
          />
        );

        if (permisos.ver || permisos.editar) {
          componentes.push(
            <Route
              path="/editarRiesgo"
              render={() => (
                <EditarRiesgo
                  permisos={permisos}
                  idrol={idrol}
                  idposicion={idposicion}
                />
              )}
              key={"editar" + code}
              exact
            />
          );
          componentes.push(
            <Route
              path="/causaControles"
              render={() => (
                <CausasControles
                  permisos={permisos}
                  idrol={idrol}
                  idposicion={idposicion}
                />
              )}
              key={"editar" + code}
              exact
            />
          );
          componentes.push(
            <Route
              path="/valoracionRiesgo"
              render={() => (
                <ValoracionRiesgo
                  permisos={permisos}
                  idrol={idrol}
                  idposicion={idposicion}
                />
              )}
              key={"editar" + code}
              exact
            />
          );
          componentes.push(
            <Route
              path="/valoracionSOX"
              render={() => (
                <ValoracionSOX
                  permisos={permisos}
                  idrol={idrol}
                  idposicion={idposicion}
                />
              )}
              key={"editar" + code}
              exact
            />
          );
          componentes.push(
            <Route
              path="/detalleRiesgo"
              render={() => (
                <DetalleRiesgo
                  permisos={permisos}
                  idrol={idrol}
                  idposicion={idposicion}
                />
              )}
              key={"detalle" + code}
              exact
            />
          );
        }
        if (permisos.ver || permisos.editar) {
          componentes.push(
            <Route
              path="/detalleRiesgo"
              render={() => (
                <DetalleRiesgo
                  permisos={permisos}
                  idrol={idrol}
                  idposicion={idposicion}
                />
              )}
              key={"detalle" + code}
              exact
            />
          );
        }
        if (permisos.crear) {
          componentes.push(
            <Route
              path="/crearRiesgo"
              render={() => (
                <CrearRiesgo
                  permisos={permisos}
                  idrol={idrol}
                  idposicion={idposicion}
                />
              )}
              key={"crear" + code}
              exact
            />
          );
        }
        break;
      case "Valoraciones":
        componentes.push(
          <Route
            path="/Valoraciones"
            render={() => (
              <ServiciosValoracion
                permisos={permisos}
                idrol={idrol}
                idposicion={idposicion}
              />
            )}
            key={code}
            id={code}
            exact
          />
        );
        if (permisos.ver || permisos.editar) {
          componentes.push(
            <Route
              path="/editarCrearEfecto"
              render={() => (
                <EditarCrearEfecto
                  permisos={permisos}
                  idrol={idrol}
                  idposicion={idposicion}
                />
              )}
              key={"editar" + code}
              exact
            />
          );
          componentes.push(
            <Route
              path="/editarAgregarEfecto"
              render={() => (
                <EditarAgregarEfecto
                  permisos={permisos}
                  idrol={idrol}
                  idposicion={idposicion}
                />
              )}
              key={"editar2" + code}
              exact
            />
          );
        }
        if (permisos.crear) {
          componentes.push(
            <Route
              path="/crearEfecto"
              render={() => (
                <CrearEfecto
                  permisos={permisos}
                  idrol={idrol}
                  idposicion={idposicion}
                />
              )}
              key={"crear" + code}
              exact
            />
          );
          componentes.push(
            <Route
              path="/agregarEfecto"
              render={() => (
                <AgregarEfecto
                  permisos={permisos}
                  idrol={idrol}
                  idposicion={idposicion}
                />
              )}
              key={"crear2" + code}
              exact
            />
          );
        }
        break;
      case "Controles":
        componentes.push(
          <Route
            path="/controles"
            render={() => (
              <Controles
                permisos={permisos}
                idrol={idrol}
                idposicion={idposicion}
              />
            )}
            key={code}
            id={code}
            exact
          />
        );
        if (permisos.ver || permisos.editar) {
          componentes.push(
            <Route
              path="/editarControl"
              render={() => (
                <EditarControl
                  permisos={permisos}
                  idrol={idrol}
                  idposicion={idposicion}
                />
              )}
              key={"editar" + code}
              exact
            />
          );
        }
        if (permisos.crear) {
          componentes.push(
            <Route
              path="/nuevoControl"
              render={() => (
                <CrearControl
                  permisos={permisos}
                  idrol={idrol}
                  idposicion={idposicion}
                />
              )}
              key={"crear" + code}
              exact
            />
          );
        }
        // if (permisos.crear) {
        //   componentes.push(
        //     <Route
        //       path="/nuevoIpe"
        //       render={() => <CrearIpe permisos={permisos} idrol={idrol} idposicion={idposicion} />}
        //       key={"crear" + code}
        //       exact
        //     />
        //   );
        // }
        break;
      case "Evaluaciones":
        componentes.push(
          <Route
            path="/evaluaciones"
            render={() => (
              <Evaluaciones
                permisos={permisos}
                idrol={idrol}
                idposicion={idposicion}
              />
            )}
            key={code}
            id={code}
            exact
          />
        );
        if (permisos.ver || permisos.editar) {
          componentes.push(
            <Route
              path="/editarEvaluacion"
              render={() => (
                <EditarEvaluacion
                  permisos={permisos}
                  idrol={idrol}
                  idposicion={idposicion}
                />
              )}
              key={"editar" + code}
              exact
            />
          );
        }
        if (permisos.crear) {
          componentes.push(
            <Route
              path="/nuevaEvaluacion"
              render={() => (
                <CrearEvaluacion
                  permisos={permisos}
                  idrol={idrol}
                  idposicion={idposicion}
                />
              )}
              key={"crear" + code}
              exact
            />
          );
        }
        break;
      case "Procesos":
        componentes.push(
          <Route
            path="/Procesos"
            render={() => (
              <Procesos
                permisos={permisos}
                idrol={idrol}
                idposicion={idposicion}
              />
            )}
            key={code}
            id={code}
            exact
          />
        );
        if (permisos.ver || permisos.editar) {
          componentes.push(
            <Route
              path="/EditarProceso"
              render={() => (
                <EditarProceso
                  permisos={permisos}
                  idrol={idrol}
                  idposicion={idposicion}
                />
              )}
              key={"editar" + code}
              exact
            />
          );
        }
        if (permisos.crear) {
          componentes.push(
            <Route
              path="/NuevoProceso"
              render={() => (
                <NuevoProceso
                  permisos={permisos}
                  idrol={idrol}
                  idposicion={idposicion}
                />
              )}
              key={"crear" + code}
              exact
            />
          );
        }
        break;
      case "AreasOrganizacionales":
        componentes.push(
          <Route
            path="/AreasOrganizacionales"
            render={() => (
              <AreasOrganizacionales
                permisos={permisos}
                idrol={idrol}
                idposicion={idposicion}
              />
            )}
            key={code}
            id={code}
            exact
          />
        );
        if (permisos.ver || permisos.editar) {
          componentes.push(
            <Route
              path="/EditarAreaOrganizacional"
              render={() => (
                <EditarArea
                  permisos={permisos}
                  idrol={idrol}
                  idposicion={idposicion}
                />
              )}
              key={"editar" + code}
              exact
            />
          );
        }
        if (permisos.crear) {
          componentes.push(
            <Route
              path="/NuevaAreaOrganizacional"
              render={() => (
                <NuevaArea
                  permisos={permisos}
                  idrol={idrol}
                  idposicion={idposicion}
                />
              )}
              key={"crear" + code}
              exact
            />
          );
        }
        break;
      case "UnidadesRO":
        componentes.push(
          <Route
            path="/UnidadesRO"
            render={() => (
              <UnidadesRiesgo
                permisos={permisos}
                idrol={idrol}
                idposicion={idposicion}
              />
            )}
            key={code}
            id={code}
            exact
          />
        );
        if (permisos.ver || permisos.editar) {
          componentes.push(
            <Route
              path="/EditarUnidadRO"
              render={() => (
                <EditarUnidadRO
                  permisos={permisos}
                  idrol={idrol}
                  idposicion={idposicion}
                />
              )}
              key={"editar" + code}
              exact
            />
          );
        }
        if (permisos.crear) {
          componentes.push(
            <Route
              path="/NuevaUnidadRO"
              render={() => (
                <NuevaUnidadRO
                  permisos={permisos}
                  idrol={idrol}
                  idposicion={idposicion}
                />
              )}
              key={"crear" + code}
              exact
            />
          );
        }
        break;
      case "Productos":
        componentes.push(
          <Route
            path="/Productos"
            render={() => (
              <Productos
                permisos={permisos}
                idrol={idrol}
                idposicion={idposicion}
              />
            )}
            key={code}
            id={code}
            exact
          />
        );
        if (permisos.ver || permisos.editar) {
          componentes.push(
            <Route
              path="/EditarProducto"
              render={() => (
                <EditarProducto
                  permisos={permisos}
                  idrol={idrol}
                  idposicion={idposicion}
                />
              )}
              key={"editar" + code}
              exact
            />
          );
        }
        if (permisos.crear) {
          componentes.push(
            <Route
              path="/NuevoProducto"
              render={() => (
                <NuevoProducto
                  permisos={permisos}
                  idrol={idrol}
                  idposicion={idposicion}
                />
              )}
              key={"crear" + code}
              exact
            />
          );
        }
        break;
      case "Canales":
        componentes.push(
          <Route
            path="/Canales"
            render={() => (
              <Canales
                permisos={permisos}
                idrol={idrol}
                idposicion={idposicion}
              />
            )}
            key={code}
            id={code}
            exact
          />
        );
        if (permisos.ver || permisos.editar) {
          componentes.push(
            <Route
              path="/EditarCanal"
              render={() => (
                <EditarCanal
                  permisos={permisos}
                  idrol={idrol}
                  idposicion={idposicion}
                />
              )}
              key={"editar" + code}
              exact
            />
          );
        }
        if (permisos.crear) {
          componentes.push(
            <Route
              path="/NuevoCanal"
              render={() => (
                <NuevoCanal
                  permisos={permisos}
                  idrol={idrol}
                  idposicion={idposicion}
                />
              )}
              key={"crear" + code}
              exact
            />
          );
        }
        break;
      case "ObjetosCosto":
        componentes.push(
          <Route
            path="/ObjetosCosto"
            render={() => (
              <ObjetosCosto
                permisos={permisos}
                idrol={idrol}
                idposicion={idposicion}
              />
            )}
            key={code}
            id={code}
            exact
          />
        );
        if (permisos.ver || permisos.editar) {
          componentes.push(
            <Route
              path="/EditarObjetoCosto"
              render={() => (
                <EditarObjetoCosto
                  permisos={permisos}
                  idrol={idrol}
                  idposicion={idposicion}
                />
              )}
              key={"editar" + code}
              exact
            />
          );
        }
        if (permisos.crear) {
          componentes.push(
            <Route
              path="/NuevoObjetoCosto"
              render={() => (
                <NuevoObjetoCosto
                  permisos={permisos}
                  idrol={idrol}
                  idposicion={idposicion}
                />
              )}
              key={"crear" + code}
              exact
            />
          );
        }
        break;
      case "CategoriasRO":
        componentes.push(
          <Route
            path="/CategoriasRO"
            render={() => (
              <CategoriasRO
                permisos={permisos}
                idrol={idrol}
                idposicion={idposicion}
              />
            )}
            key={code}
            id={code}
            exact
          />
        );
        if (permisos.ver || permisos.editar) {
          componentes.push(
            <Route
              path="/EditarCategoriaRO"
              render={() => (
                <EditarCategoriaRO
                  permisos={permisos}
                  idrol={idrol}
                  idposicion={idposicion}
                />
              )}
              key={"editar" + code}
              exact
            />
          );
        }
        if (permisos.crear) {
          componentes.push(
            <Route
              path="/NuevaCategoriaRO"
              render={() => (
                <NuevaCategoriaRO
                  permisos={permisos}
                  idrol={idrol}
                  idposicion={idposicion}
                />
              )}
              key={"crear" + code}
              exact
            />
          );
        }
        break;
      case "LineasNegocio":
        componentes.push(
          <Route
            path="/LineasNegocio"
            render={() => (
              <LineasNegocio
                permisos={permisos}
                idrol={idrol}
                idposicion={idposicion}
              />
            )}
            key={code}
            id={code}
            exact
          />
        );
        if (permisos.ver || permisos.editar) {
          componentes.push(
            <Route
              path="/EditarLineaNegocio"
              render={() => (
                <EditarLineaNegocio
                  permisos={permisos}
                  idrol={idrol}
                  idposicion={idposicion}
                />
              )}
              key={"editar" + code}
              exact
            />
          );
        }
        if (permisos.crear) {
          componentes.push(
            <Route
              path="/NuevaLineaNegocio"
              render={() => (
                <NuevaLineaNegocio
                  permisos={permisos}
                  idrol={idrol}
                  idposicion={idposicion}
                />
              )}
              key={"crear" + code}
              exact
            />
          );
        }
        break;
      case "Causas":
        componentes.push(
          <Route
            path="/Causas"
            render={() => (
              <Causas
                permisos={permisos}
                idrol={idrol}
                idposicion={idposicion}
              />
            )}
            key={code}
            id={code}
            exact
          />
        );
        if (permisos.ver || permisos.editar) {
          componentes.push(
            <Route
              path="/EditarCausa"
              render={() => (
                <EditarCausa
                  permisos={permisos}
                  idrol={idrol}
                  idposicion={idposicion}
                />
              )}
              key={"editar" + code}
              exact
            />
          );
        }

        if (permisos.crear) {
          componentes.push(
            <Route
              path="/NuevaCausa"
              render={() => (
                <NuevaCausa
                  permisos={permisos}
                  idrol={idrol}
                  idposicion={idposicion}
                />
              )}
              key={"crear" + code}
              exact
            />
          );
        }
        break;
      case "TiposFalla":
        componentes.push(
          <Route
            path="/TiposFalla"
            render={() => (
              <TiposFallas
                permisos={permisos}
                idrol={idrol}
                idposicion={idposicion}
              />
            )}
            key={code}
            id={code}
            exact
          />
        );
        if (permisos.ver || permisos.editar) {
          componentes.push(
            <Route
              path="/EditarTipoFalla"
              render={() => (
                <EditarTipoFalla
                  permisos={permisos}
                  idrol={idrol}
                  idposicion={idposicion}
                />
              )}
              key={"editar" + code}
              exact
            />
          );
        }
        if (permisos.crear) {
          componentes.push(
            <Route
              path="/NuevoTipoFalla"
              render={() => (
                <NuevoTipoFalla
                  permisos={permisos}
                  idrol={idrol}
                  idposicion={idposicion}
                />
              )}
              key={"crear" + code}
              exact
            />
          );
        }
        break;
      case "Geografias":
        componentes.push(
          <Route
            path="/Geografias"
            render={() => (
              <Geografias
                permisos={permisos}
                idrol={idrol}
                idposicion={idposicion}
              />
            )}
            key={code}
            id={code}
            exact
          />
        );
        if (permisos.ver || permisos.editar) {
          componentes.push(
            <Route
              path="/EditarGeografia"
              render={() => (
                <EditarGeografia
                  permisos={permisos}
                  idrol={idrol}
                  idposicion={idposicion}
                />
              )}
              key={"editar" + code}
              exact
            />
          );
        }
        if (permisos.crear) {
          componentes.push(
            <Route
              path="/NuevaGeografia"
              render={() => (
                <NuevaGeografia
                  permisos={permisos}
                  idrol={idrol}
                  idposicion={idposicion}
                />
              )}
              key={"crear" + code}
              exact
            />
          );
        }
        break;
      case "CuentasContables":
        componentes.push(
          <Route
            path="/CuentasContables"
            render={() => (
              <CuentasContables
                permisos={permisos}
                idrol={idrol}
                idposicion={idposicion}
              />
            )}
            key={code}
            id={code}
            exact
          />
        );
        if (permisos.ver || permisos.editar) {
          componentes.push(
            <Route
              path="/EditarCuentaContable"
              render={() => (
                <EditarCuentaContable
                  permisos={permisos}
                  idrol={idrol}
                  idposicion={idposicion}
                />
              )}
              key={"editar" + code}
              exact
            />
          );
        }
        if (permisos.crear) {
          componentes.push(
            <Route
              path="/NuevaCuentaContable"
              render={() => (
                <NuevaCuentaContable
                  permisos={permisos}
                  idrol={idrol}
                  idposicion={idposicion}
                />
              )}
              key={"crear" + code}
              exact
            />
          );
        }
        break;
      case "CargueRegistros":
        componentes.push(
          <Route
            path="/cargueRegistros"
            render={() => (
              <EventosMaterialzados
                permisos={permisos}
                idrol={idrol}
                idposicion={idposicion}
              />
            )}
            key={"editar" + code}
            exact
          />
        );
        break;
      case "DescargaEventos":
        componentes.push(
          <Route
            path="/DescargaEventos"
            render={() => (
              <Descarga_eventos
                permisos={permisos}
                idrol={idrol}
                idposicion={idposicion}
              />
            )}
            key={"editar" + code}
            exact
          />
        );
        break;
      case "MonitoreoEventos":
        break;
      case "ResponsableSinAsignar":
        componentes.push(
          <Route
            path="/ResponsableSinAsignar"
            render={() => (
              <Responsables_sin
                permisos={permisos}
                idrol={idrol}
                idposicion={idposicion}
              />
            )}
            key={code}
            id={code}
            exact
          />
        );

        break;
      case "AnalistaSinAsignar":
        componentes.push(
          <Route
            path="/AnalistaSinAsignar"
            render={() => (
              <UnidadesAnalistas_sin
                permisos={permisos}
                idrol={idrol}
                idposicion={idposicion}
              />
            )}
            key={code}
            id={code}
            exact
          />
        );

        break;
      case "Descargas":
        componentes.push(
          <Route
            path="/Descargas"
            render={() => (
              <Descargas
                permisos={permisos}
                idrol={idrol}
                idposicion={idposicion}
              />
            )}
            key={code}
            id={code}
            exact
          />
        );

        break;
      case "InformeContable":
        componentes.push(
          <Route
            path="/InformeContable"
            render={() => (
              <InformeContable
                permisos={permisos}
                idrol={idrol}
                idposicion={idposicion}
              />
            )}
            key={code}
            id={code}
            exact
          />
        );
        break;
      case "RegistrosPendientes":
        componentes.push(
          <Route
            path="/RegistrosPendientes"
            render={() => (
              <RegistrosPendientes
                permisos={permisos}
                idrol={idrol}
                idposicion={idposicion}
              />
            )}
            key={code}
            id={code}
            exact
          />
        );
        componentes.push(
          <Route
            path="/NuevoRegistro"
            render={() => (
              <NuevoRegistro
                permisos={permisos}
                idrol={idrol}
                idposicion={idposicion}
              />
            )}
            key={code}
            id={code}
            exact
          />
        );

        componentes.push(
          <Route
            path="/EditarRegistro"
            render={() => (
              <EditarRegistro
                permisos={permisos}
                idrol={idrol}
                idposicion={idposicion}
              />
            )}
            key={code}
            id={code}
            exact
          />
        );
        break;
      case "Generales":
        componentes.push(
          <Route
            path="/Generales"
            render={() => (
              <Generales
                permisos={permisos}
                idrol={idrol}
                idposicion={idposicion}
              />
            )}
            key={code}
            id={code}
            exact
          />
        );

        break;
      case "CargaArchivos":
        componentes.push(
          <Route
            path="/CargaArchivos"
            render={() => (
              <CargaArchivos
                permisos={permisos}
                idrol={idrol}
                idposicion={idposicion}
              />
            )}
            key={code}
            id={code}
            exact
          />
        );

        break;
      case "CargarControles":
        componentes.push(
          <Route
            path="/CargarControles"
            render={() => (
              <CargarControles
                permisos={permisos}
                idrol={idrol}
                idposicion={idposicion}
              />
            )}
            key={code}
            id={code}
            exact
          />
        );

        break;
      case "Planes_de_Accion":
        componentes.push(
          <Route
            path="/Planes_de_Accion"
            render={() => (
              <PlanesAccion
                permisos={permisos}
                idrol={idrol}
                idposicion={idposicion}
              />
            )}
            key={code}
            id={code}
            exact
          />
        );
        componentes.push(
          <Route
            path="/crearPlanAccion"
            render={() => (
              <CrearPlanAccion
                permisos={permisos}
                idrol={idrol}
                idposicion={idposicion}
              />
            )}
            key={"crear" + code}
            exact
          />
        );
        componentes.push(
          <Route
            path="/editarPlanAccion"
            render={() => (
              <EditarPlanAccion
                permisos={permisos}
                idrol={idrol}
                idposicion={idposicion}
              />
            )}
            key={"editar" + code}
            exact
          />
        );
        break;
      case "Decisiones":
        componentes.push(
          <Route
            path="/Decisiones"
            render={() => (
              <Decisiones
                permisos={permisos}
                idrol={idrol}
                idposicion={idposicion}
              />
            )}
            key={code}
            id={code}
            exact
          />
        );

        componentes.push(
          <Route
            path="/TomarDecision"
            render={() => (
              <TomarDecision
                permisos={permisos}
                idrol={idrol}
                idposicion={idposicion}
              />
            )}
            key={"tomar" + code}
            exact
          />
        );

        break;

      case "Certificacion":
        componentes.push(
          <Route
            path="/Certificacion"
            render={() => (
              <Certificacion
                permisos={permisos}
                idrol={idrol}
                idposicion={idposicion}
              />
            )}
            key={code}
            id={code}
            exact
          />
        );
        componentes.push(
          <Route
            path="/NuevaCertificacion"
            render={() => (
              <NuevaCertificacion
                permisos={permisos}
                idrol={idrol}
                idposicion={idposicion}
              />
            )}
            key={code}
            id={code}
            exact
          />
        );

        componentes.push(
          <Route
            path="/EditarCertificacion"
            render={() => (
              <EditarCertificacion
                permisos={permisos}
                idrol={idrol}
                idposicion={idposicion}
              />
            )}
            key={code}
            id={code}
            exact
          />
        );
        break;

      case "Proveedores":
        componentes.push(
          <Route
            path="/Proveedores"
            render={() => (
              <Proveedores
                permisos={permisos}
                idrol={idrol}
                idposicion={idposicion}
              />
            )}
            exact
          />
        );

        componentes.push(
          <Route
            path="/NuevoProveedor"
            key={code}
            id={code}
            render={() => (
              <NuevoProveedor
                permisos={permisos}
                idrol={idrol}
                idposicion={idposicion}
              />
            )}
            exact
          />
        );

        componentes.push(
          <Route
            path="/EditarProveedor"
            render={() => (
              <EditarProveedor
                permisos={permisos}
                idrol={idrol}
                idposicion={idposicion}
              />
            )}
            exact
          />
        );
        break;

      case "Eventos":
        componentes.push(
          <Route
            path="/Eventos"
            render={() => (
              <Eventos
                permisos={permisos}
                idrol={idrol}
                idposicion={idposicion}
              />
            )}
            key={code}
            id={code}
            exact
          />
        );

        componentes.push(
          <Route
            path="/NuevoEvento"
            render={() => <NuevoEvento permisos={permisos} />}
            key={code}
            id={code}
            exact
          />
        );

        componentes.push(
          <Route
            path="/EditarEvento"
            render={() => <EditarEvento permisos={permisos} />}
            key={code}
            id={code}
            exact
          />
        );
        break;
      case "Efectos":
        componentes.push(
          <Route
            path="/Efectos"
            render={() => (
              <Efectos
                permisos={permisos}
                idrol={idrol}
                idposicion={idposicion}
              />
            )}
            key={code}
            id={code}
            exact
          />
        );

        componentes.push(
          <Route
            path="/NuevoEfecto"
            render={() => <NuevoEfecto permisos={permisos} />}
            key={code}
            id={code}
            exact
          />
        );

        componentes.push(
          <Route
            path="/EditarEfecto"
            render={() => <EditarEfecto permisos={permisos} />}
            key={code}
            id={code}
            exact
          />
        );

        break;
      case "Recuperaciones":
        componentes.push(
          <Route
            path="/Recuperaciones"
            render={() => (
              <Recuperaciones
                permisos={permisos}
                idrol={idrol}
                idposicion={idposicion}
              />
            )}
            key={code}
            id={code}
            exact
          />
        );
        componentes.push(
          <Route
            path="/NuevaRecuperacion"
            render={() => <NuevaRecuperacion permisos={permisos} />}
            key={code}
            id={code}
            exact
          />
        );
        componentes.push(
          <Route
            path="/EditarRecuperacion"
            render={() => <EditarRecuperacion permisos={permisos} />}
            key={code}
            id={code}
            exact
          />
        );

        break;
      case "DescargaMaestros":
        componentes.push(
          <Route
            path="/DescargaMaestros"
            render={() => (
              <DescargaMaestros
                permisos={permisos}
                idrol={idrol}
                idposicion={idposicion}
              />
            )}
            key={code}
            id={code}
            exact
          />
        );
        break;
      case "Usuarios":
        componentes.push(
          <Route
            path="/Usuarios"
            render={() => <Usuarios permisos={permisos} />}
            key={code}
            id={code}
            exact
          />
        );

        componentes.push(
          <Route
            path="/NuevoUsuario"
            render={() => <NuevoUsuario permisos={permisos} />}
            key={code}
            id={code}
            exact
          />
        );
        componentes.push(
          <Route
            path="/EditarUsuario"
            render={() => <EditarUsuario permisos={permisos} />}
            key={code}
            id={code}
            exact
          />
        );
        break;

      case "Macroeventos":
        componentes.push(
          <Route
            path="/Macroeventos"
            render={() => <Macroeventos permisos={permisos} />}
            key={code}
            id={code}
            exact
          />
        );

        componentes.push(
          <Route
            path="/NuevoMacroevento"
            render={() => <NuevoMacroevento permisos={permisos} />}
            key={code}
            id={code}
            exact
          />
        );
        componentes.push(
          <Route
            path="/EditarMacroevento"
            render={() => <EditarMacroevento permisos={permisos} />}
            key={code}
            id={code}
            exact
          />
        );
        break;

      case "Roles":
        componentes.push(
          <Route
            path="/Roles"
            render={() => <Roles permisos={permisos} />}
            key={code}
            id={code}
            exact
          />
        );

        componentes.push(
          <Route
            path="/NuevoRol"
            render={() => <NuevoRol permisos={permisos} />}
            key={code}
            id={code}
            exact
          />
        );
        componentes.push(
          <Route
            path="/EditarRol"
            render={() => <EditarRol permisos={permisos} />}
            key={code}
            id={code}
            exact
          />
        );
        break;
      case "Listas":
        componentes.push(
          <Route
            path="/Listas"
            render={() => <Listas permisos={permisos} />}
            key={code}
            id={code}
            exact
          />
        );

        componentes.push(
          <Route
            path="/NuevaLista"
            render={() => <NuevaLista permisos={permisos} />}
            key={code}
            id={code}
            exact
          />
        );
        componentes.push(
          <Route
            path="/EditarLista"
            render={() => <EditarLista permisos={permisos} />}
            key={code}
            id={code}
            exact
          />
        );
        break;
      case "OpcionRol":
        componentes.push(
          <Route
            path="/OpcionRol"
            render={() => <OpcionRol permisos={permisos} />}
            key={code}
            id={code}
            exact
          />
        );
        break;
      case "OpcionesCriticas":
        componentes.push(
          <Route
            path="/OpcionesCriticas"
            render={() => (
              <OpcionesCriticas
                permisos={permisos}
                idrol={idrol}
                idposicion={idposicion}
              />
            )}
            key={code}
            id={code}
            exact
          />
        );
        if (permisos.ver || permisos.editar) {
          componentes.push(
            <Route
              path="/EditarOpcionCritica"
              render={() => (
                <EditarOpcionCritica
                  permisos={permisos}
                  idrol={idrol}
                  idposicion={idposicion}
                />
              )}
              key={"editar" + code}
              exact
            />
          );
        }
        if (permisos.crear) {
          componentes.push(
            <Route
              path="/NuevaOpcionCritica"
              render={() => (
                <NuevaOpcionCritica
                  permisos={permisos}
                  idrol={idrol}
                  idposicion={idposicion}
                />
              )}
              key={"crear" + code}
              exact
            />
          );
        }
        break;

      case "SoD":
        componentes.push(
          <Route
            path="/SoD"
            render={() => (
              <SoD permisos={permisos} idrol={idrol} idposicion={idposicion} />
            )}
            key={code}
            id={code}
            exact
          />
        );
        if (permisos.ver || permisos.editar) {
          componentes.push(
            <Route
              path="/EditarSoD"
              render={() => (
                <EditarSoD
                  permisos={permisos}
                  idrol={idrol}
                  idposicion={idposicion}
                />
              )}
              key={"editar" + code}
              exact
            />
          );
        }
        if (permisos.crear) {
          componentes.push(
            <Route
              path="/NuevaSoD"
              render={() => (
                <NuevaSoD
                  permisos={permisos}
                  idrol={idrol}
                  idposicion={idposicion}
                />
              )}
              key={"crear" + code}
              exact
            />
          );
        }
        break;

      case "Aplicaciones":
        componentes.push(
          <Route
            path="/Aplicaciones"
            render={() => (
              <Aplicaciones
                permisos={permisos}
                idrol={idrol}
                idposicion={idposicion}
              />
            )}
            key={code}
            id={code}
            exact
          />
        );
        if (permisos.ver || permisos.editar) {
          componentes.push(
            <Route
              path="/VerAplicacion"
              render={() => (
                <VerAplicacion
                  permisos={permisos}
                  idrol={idrol}
                  idposicion={idposicion}
                />
              )}
              key={"editar" + code}
              exact
            />
          );
        }

        break;

      default:
        break;
    }

    return componentes;
  };

  const ItemsRouter = (dataRouter) => {
    try {
      let tempPermisos = {
        ver: false,
        crear: false,
        editar: false,
        inactivar: false,
        aprobar: false,
        descargar: false,
      };
      let vectorPermisos;
      let routerList;
      let routerListComplete = [];
      routerList = dataRouter.map((item) => {
        tempPermisos = {
          ver: false,
          crear: false,
          editar: false,
          inactivar: false,
          aprobar: false,
          descargar: false,
        };
        vectorPermisos = item.permisos.split(";");
        tempPermisos.ver = vectorPermisos.includes("V");
        tempPermisos.crear = vectorPermisos.includes("C");
        tempPermisos.editar = vectorPermisos.includes("E");
        tempPermisos.inactivar = vectorPermisos.includes("I");
        tempPermisos.aprobar = vectorPermisos.includes("A");
        tempPermisos.descargar = vectorPermisos.includes("D");

        item.permisos = tempPermisos;
        return searchComponent(
          item.url_opcion.slice(1),
          tempPermisos,
          item.idRol,
          item.idposicion
        );
      });

      routerList.map((data) => {
        data.map((route) => {
          routerListComplete.push(route);
        });
      });
      return routerListComplete;
    } catch (error) {
      console.error("No se puede cargar el router para la aplicación", error);
    }
  };
  //const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);
  if (token) {
    return (
      <>
        <div className={classes.root}>
          <CssBaseline />
          <Router>
            {/* Inicio para barra superior (NavBar) */}
            <AppBar
              position="absolute"
              className={clsx(classes.appBar, open && classes.appBarShift)}
            >
              <Toolbar className={classes.toolbar}>
                <IconButton
                  edge="start"
                  color="inherit"
                  aria-label="open drawer"
                  onClick={handleDrawerOpen}
                  className={clsx(
                    classes.menuButton,
                    open && classes.menuButtonHidden
                  )}
                >
                  <MenuIcon />
                </IconButton>
                <IconButton>
                  <Link
                    to="/"
                    style={{ color: "#FFF", textDecoration: "none" }}
                  >
                    <Typography
                      component="h1"
                      variant="h6"
                      color="inherit"
                      noWrap
                      className={classes.title}
                    >
                      <img
                        src="getsitelogoWhite.png"
                        width="40vw"
                        alt="No hay imagen"
                      />{" "}
                      GRC RO
                    </Typography>
                  </Link>
                </IconButton>
                <h5>| &nbsp; {user}&nbsp;&nbsp; |</h5>

                <IconButton color="inherit" onClick={() => serviceAAD.logout()}>
                  <Badge badgeContent={4} color="secondary">
                    <LogoutIcon />
                    &nbsp; Salir
                  </Badge>
                </IconButton>
              </Toolbar>
            </AppBar>
            {/* Fin Barra Superior (NavBar) */}
            {/* Barra lateral */}
            <Drawer
              variant="permanent"
              classes={{
                paper: clsx(
                  classes.drawerPaper,
                  !open && classes.drawerPaperClose
                ),
              }}
              open={open}
            >
              <div className={classes.toolbarIcon}>
                <IconButton onClick={handleDrawerClose}>
                  <ChevronLeftIcon style={{ color: "#fff" }} />
                </IconButton>
              </div>
              <Divider />
              <List>{mainListItems}</List>
              <Divider />
            </Drawer>
            {/* Fin barra lateral */}
            <main className={classes.content}>
              <div className={classes.appBarSpacer} />
              <div id="contenedor_paginas">
                {dataRouter ? (
                  dataRouter.map((route) => {
                    return route;
                  })
                ) : (
                  <>
                    <Loader
                      type="Oval"
                      color="#FFBF00"
                      style={{ textAlign: "center", position: "static" }}
                    />
                    <Row>
                      <Col className="text-center">
                        <h2>Verificando permisos</h2>
                      </Col>
                    </Row>
                  </>
                )}
                {dataRouter ? (
                  <Route path="/" render={() => <Inicio />} exact />
                ) : null}
              </div>
            </main>
          </Router>
          <div className="caro-chat">
            <Chat />
          </div>
        </div>
      </>
    );
  } else {
    return (
      <>
        <Row className="mb-3 mt-5">
          <Col>
            <Loader
              type="Oval"
              color="#FFBF00"
              style={{ textAlign: "center", position: "static" }}
            />
          </Col>
        </Row>
      </>
    );
  }
}
