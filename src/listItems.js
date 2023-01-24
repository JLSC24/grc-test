import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";

import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";
import Collapse from "@material-ui/core/Collapse";
import List from "@material-ui/core/List";

import AADService from "./auth/authFunctions";

const colorItem = "#fff";

export function listaMenu(data) {
  try {
    let menu = [];
    data.map((opcion) => {
      if (opcion.padre === 0) {
        menu.push({
          opcion: opcion.opcion,
          orden: opcion.orden,
          permisos: opcion.permisos,
          idopcion: opcion.idopcion,
          url_opcion: opcion.url_opcion.slice(1),
          hijos: data.filter((hijo) => hijo.padre === opcion.idopcion),
        });
      }
      return null;
    });
    menu = menu.filter((opcion) => opcion.orden !== 0);
    menu.sort((a, b) => a.orden - b.orden);
    return menu;
  } catch (error) {
    console.error("No se puede cargar el menú para el usuario logueado ");
  }
}

export function Items() {
  const serviceAAD = new AADService();
  const [openMa, setOpenMa] = React.useState(false);
  const [openEM, setOpenEM] = React.useState(false);
  const [openRC, setOpenRC] = React.useState(false);
  const [openAR, setOpenAR] = React.useState(false);
  const [openAA, setOpenAA] = React.useState(false);
  const [openVC, setOpenVC] = React.useState(false);
  const [openOE, setOpenOE] = React.useState(false);

  const [opcionesMenuRender, setOpcionesMenuRender] = React.useState(null);

  useEffect(() => {
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
      setOpcionesMenuRender(listaMenu(data));
    };
    fetchdata();
  }, []);

  const openList = (option) => {
    switch (option) {
      case "Riesgos_y_Controles":
        setOpenRC(!openRC);
        break;
      case "Maestros":
        setOpenMa(!openMa);
        break;
      case "Eventos_materializados":
        setOpenEM(!openEM);
        break;
      case "AdminRiesgos":
        setOpenAR(!openAR);
        break;
      case "Administración":
        setOpenAA(!openAA);
        break;
      case "Validacion_contable":
        setOpenVC(!openVC);
        break;
      case "OtrosElementosRiesgo":
        setOpenOE(!openOE);
        break;
      default:
        break;
    }
  };

  const isOpen = (option) => {
    switch (option) {
      case "Riesgos_y_Controles":
        return openRC;
      case "Maestros":
        return openMa;
      case "Eventos_materializados":
        return openEM;
      case "AdminRiesgos":
        return openAR;
      case "Administración":
        return openAA;
      case "Validacion_contable":
        return openVC;
      case "OtrosElementosRiesgo":
        return openOE;
      default:
        break;
    }
  };

  const renderPrincipales = (item) => {
    try {
      return (
        <>
          <ListItem
            button
            onClick={() => openList(item.url_opcion)}
            key={"li" + item.idopcion}
            id={"li" + item.url_opcion}
          >
            <ListItemText
              key={"lit" + item.idopcion}
              id={"lit" + item.url_opcion}
              primary={item.opcion}
              style={{ color: "#fdda24", padding: "0px" }}
            />
            {isOpen(item.url_opcion) ? <ExpandLess /> : <ExpandMore />}
          </ListItem>
          <Collapse
            in={isOpen(item.url_opcion)}
            timeout="auto"
            key={"colapse" + item.idopcion}
            id={"colapse" + item.url_opcion}
            unmountOnExit
          >
            <List
              component="div"
              key={"list" + item.idopcion}
              id={"list" + item.url_opcion}
              disablePadding
            >
              {item.hijos ? renderHijos(item.hijos) : null}
            </List>
          </Collapse>
        </>
      );
    } catch (error) {
      console.error("Error renderizando las opciones principales", error);
    }
  };

  const renderHijos = (data) => {
    try {
      return data.map((hijoOpcion) => {
        return (
          <Link
            to={hijoOpcion.url_opcion}
            style={{ color: colorItem }}
            key={"link" + hijoOpcion.idopcion}
            id={"link" + hijoOpcion.url_opcion}
          >
            <ListItem
              key={"liB" + hijoOpcion.idopcion}
              id={"liB" + hijoOpcion.url_opcion}
              button
            >
              <ListItemText
                key={"liBT" + hijoOpcion.idopcion}
                id={"liBT" + hijoOpcion.url_opcion}
                primary={hijoOpcion.opcion}
              />
            </ListItem>
          </Link>
        );
      });
    } catch (error) {
      console.error(
        "Error renderizando los hijos de las opciones principales",
        error
      );
    }
  };

  const mainListItems = (
    <div>
      {opcionesMenuRender
        ? opcionesMenuRender.map((item) => {
            return renderPrincipales(item);
          })
        : null}
    </div>
  );
  return mainListItems;
}
