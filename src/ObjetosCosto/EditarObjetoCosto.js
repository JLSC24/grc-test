import React, { useState, useEffect } from "react";
import { Row, Col, Form, Alert } from "react-bootstrap";
import Switch from "@material-ui/core/Switch";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import { Link, useHistory } from "react-router-dom";
import { Treebeard } from "react-treebeard";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import MaterialTable from "material-table";

import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";

import { forwardRef } from "react";
import Check from "@material-ui/icons/Check";
import Clear from "@material-ui/icons/Clear";
import Edit from "@material-ui/icons/Edit";

import { adalApiFetch } from "../auth/adalConfig";
import AADService from "../auth/authFunctions";
import { set } from "lodash";

const style = {
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
};

function AlertDismissibleExample(data) {
  let temp = [];
  let errors = "";
  let temp2 = [];
  if (data.alerta.data !== null && data.alerta.data !== undefined) {
    temp = JSON.stringify(data.alerta.data).split('"');
    temp.map((dat, index) => {
      if (index % 2 !== 0) {
        temp2.push(dat);
      }
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
      break;
    case 2:
      return <Alert variant="success">Guardó exitosamente</Alert>;
      break;
    case 3:
      return <Alert variant="danger"></Alert>;
      break;
    case 4:
      return <Alert variant="warning">{errors}</Alert>;
      break;
    case 5:
      return <Alert variant="danger">Error en el servidor</Alert>;
      break;
    case 6:
      return (
        <Alert variant="warning">
          Ya existe una evaluación para el activo seleccionado
        </Alert>
      );
      break;
    default:
      return <p></p>;
      break;
  }
}
const animatedComponents = makeAnimated();

export default function EditarObjetoCosto(props) {
  const serviceAAD = new AADService();
  const [state, setState] = useState("Activo");
  const [idState, setIdState] = useState(true);
  const [datArbol, setDatArbol] = useState([]);
  const [datEntorno, setDatEntorno] = useState([]);
  const [datEVC, setDatEVC] = useState([]);
  const [datPDC, setDatPDC] = useState([]);
  const [selectedPDC, setSelectedPDC] = useState(null);
  const [datEVCSelect, setDatEVCSelect] = useState([]);
  const [datOCComp, setDatOCComp] = useState(null);
  const [selectedData, setSelectedData] = useState(null);
  const [required, setRequired] = useState(false);
  const [ast, setAst] = useState("");
  const [datOCDist, setDatOCDist] = useState();
  const [porcAsig, setPorcAsig] = useState(0);
  const [cursor, setCursor] = useState(false);
  const [datUnidadRO, setDatUnidadRO] = useState(null);
  const [datAnalistas, setDatAnalistas] = useState(null);
  const [datResponsables, setDatResponsables] = useState(null);
  const [datCompañia, setDatCompañia] = useState([]);
  const [datAreaO, setDatAreaO] = useState(null);
  const [datAreaOT, setDatAreaOT] = useState(null);
  const [startDate, setStartDate] = useState(new Date());
  const [datObjetoCosto, setDatObjetoCosto] = useState(null);
  const [datTipoCO, setDatTipoCO] = useState(null);
  const [datHomologacionOC, setDatHomologacionOC] = useState(null);
  const [selectedValueResponsable, setSelectedValueResponsable] =
    useState(null);

  const [productoGF, setProductoGF] = useState(null);

  const [estadoPost, setEstadoPost] = useState({
    alerta: { id: 0, data: null },
  });
  let history = useHistory();

  const [columns, setColumns] = useState([
    {
      title: "ID",
      field: "id",
      type: "text",
    },
    { title: "Descripción", field: "descripcion", type: "text" },
  ]);

  const [dataGrid, setDataGrid] = useState([]);
  const [tempDataGrid, setTempDataGrid] = useState([]);
  const [dataGridUpdate, setDataGridUpdate] = useState([]);
  const [dataGridDelete, setDataGridDelete] = useState([]);
  const [dataGridNew, setDataGridNew] = useState([]);

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

  const crearData = (data, selectedData) => {
    let temp = [];
    let padre = [];
    let dataTree = {
      name: "Seleccionar",
      toggled: true,
      id: 0,
      children: [],
    };
    data.map((dat) => {
      padre.push(dat.padre);
      return null;
    });
    padre = padre.filter((item, index) => {
      return padre.indexOf(item) === index && padre.indexOf(item) !== 0;
    });

    const insertar = (children, datChildren) => {
      if (datChildren !== undefined && datChildren.length !== 0) {
        if (children.id === datChildren[0].padre) {
          children.children = datChildren;
          if (children.id === selectedData.id) {
            children.active = true;
            setCursor(children);
          } else {
            datChildren.map((datHijos) => {
              if (datHijos.id === selectedData.id) {
                datHijos.active = true;
                setCursor(datHijos);
              }
            });
          }
        } else {
          if (children.children.length !== 0) {
            children.children.map((child) => {
              insertar(child, datChildren);
              return null;
            });
          }
        }
      }

      return children;
    };

    if (data !== null) {
      data.map((dat) => {
        if (dat.nivel === 1 && dat.padre === 0) {
          temp.push({
            padre: 0,
            name: dat.nombre,
            id: dat.idoc,
            active: selectedData.padres[0] === dat.idoc ? false : false,
            toggled: selectedData.padres[0] === dat.idoc ? true : false,
            children: [],
          });
        }
        return null;
      });
      if (temp !== null) {
        dataTree = insertar(dataTree, temp);
      }
      temp = [];
      padre.map((padre) => {
        data.map((dat) => {
          if (dat.padre === padre) {
            temp.push({
              padre: dat.padre,
              name: dat.nombre,
              id: dat.idoc,
              active:
                selectedData.padres[0] === dat.idoc ||
                selectedData.padres[1] === dat.idoc
                  ? false
                  : false,
              toggled:
                selectedData.padres[0] === dat.idoc ||
                selectedData.padres[1] === dat.idoc
                  ? true
                  : false,
              children: [],
            });
          }
          return null;
        });
        if (temp.length !== 0) {
          dataTree = insertar(dataTree, temp);
        }
        temp = [];
        return null;
      });
    }

    setDatArbol(dataTree);
  };

  useEffect(() => {
    let selectedDataTemp;
    let idComp;
    let datosArea;
    let tempEvc;
    const datosGrid = async (idOc) => {
      const result = await fetch(
        process.env.REACT_APP_API_URL + "/maestros_ro/rx_oc_distribucion_principal/" +
          idOc +
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
      let temp = [];
      if (data) {
        data.map((data) => {
          if (data.estado) {
            temp.push({
              id: data.idrx_oc_distribucion,
              idOCDist: data.idoc_distribucion,
              porcAsig: parseFloat(data.porcentage_asignado),
            });
          }
        });
      }
      setPorcAsig(0);
      setDataGrid(temp);
      setTempDataGrid(temp);
    };
    const datosArbol = async () => {
      await datosObjetoCosto();
      const result = await fetch(process.env.REACT_APP_API_URL + "/maestros_ro/ArbolOC/", {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: "Bearer " + serviceAAD.getToken(),
        },
      });
      let data = await result.json();
      setDatOCComp(data);
      cambiarComp(idComp, datosArea, selectedDataTemp, data);
    };

    const datosAreasO = async () => {
      const result = await fetch(process.env.REACT_APP_API_URL + "/maestros_ro/area_o/", {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: "Bearer " + serviceAAD.getToken(),
        },
      });
      let data = await result.json();
      datosArea = data;
      setDatAreaO(data);
    };
    const datosObjetoCosto = async () => {
      await datosAreasO();
      await GetEntornos();
      await GetEVC();
      const result = await fetch(
        process.env.REACT_APP_API_URL + "/maestros_ro/oc/" +
          localStorage.getItem("idObjetoCosto") +
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
      if (data && !data.estado_oc) {
        setIdState(data.estado_oc);
        setState("Inactivo");
      }
      let temp = new Date();
      selectedDataTemp = {
        padres: [data.oc_n1, data.oc_n2],
        nivel: data.nivel,
        id: data.idoc,
      };
      setSelectedData({
        padres: [data.oc_n1, data.oc_n2],
        nivel: data.nivel,
      });
      temp.setTime(Date.parse(data.fecha_lanzamiento));
      if (data !== null && data.responsable_negocio !== null) {
        setSelectedValueResponsable({
          value: data.responsable_negocio.idposicion,
          label: data.responsable_negocio.idusuario.nombre,
        });
      }
      datosGrid(data.idoc);
      setStartDate(temp);
      setDatObjetoCosto(data);
      idComp = data.idcompania.idcompania;
      if (data.entorno) {
        CambiarEVC(data.entorno, tempEvc);
      }
      let datProductosGF = {
        label: data.proinformgfinanciera,
        value: data.proinformgfinanciera,
      };
      setProductoGF(datProductosGF);
    };
    const datosCompañia = async () => {
      const result = await fetch(
        process.env.REACT_APP_API_URL + "/maestros_ro/compania/",
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            Authorization: "Bearer " + serviceAAD.getToken(),
          },
        }
      );
      let data = await result.json();
      let temp = [];
      if (data) {
        data.map((dat) => {
          if (dat.estado) {
            temp.push(dat);
          }
          return null;
        });
      }
      setDatCompañia(temp);
    };
    const unidadesRO = async () => {
      const result = await fetch(
        process.env.REACT_APP_API_URL + "/maestros_ro/unidad_riesgo/",
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            Authorization: "Bearer " + serviceAAD.getToken(),
          },
        }
      );
      let data = await result.json();
      setDatUnidadRO(data);
    };
    const analistasRO = async () => {
      const result = await fetch(process.env.REACT_APP_API_URL + "/usuariosrol/0/4/", {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: "Bearer " + serviceAAD.getToken(),
        },
      });
      let data = await result.json();
      const result2 = await fetch(process.env.REACT_APP_API_URL + "/usuariosrol/0/11/", {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: "Bearer " + serviceAAD.getToken(),
        },
      });
      let data2 = await result2.json();
      let data3 = data.concat(data2);
      setDatAnalistas(data3.sort(function (a, b) {
        if (a.nombre > b.nombre) {
          return 1;
        }
        if (a.nombre < b.nombre) {
          return -1;
        }
        // a must be equal to b
        return 0;
      }));
    };
    const ResponsablesNeg = async () => {
      const result = await fetch(process.env.REACT_APP_API_URL + "/usuariosrol/0/3/", {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: "Bearer " + serviceAAD.getToken(),
        },
      });
      let data = await result.json();
      let temp = [];
      data.map((dat) => {
        temp.push({ value: dat.idposicion, label: dat.nombre });
        return null;
      });
      setDatResponsables(temp);
    };
    const datosTipoOC = async () => {
      const result = await fetch(
        process.env.REACT_APP_API_URL + "/generales/OC/Tipo_OC/",
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            Authorization: "Bearer " + serviceAAD.getToken(),
          },
        }
      );
      let data = await result.json();
      setDatTipoCO(data);
    };
    const datosDistOC = async () => {
      const result = await fetch(process.env.REACT_APP_API_URL + "/maestros_ro/oc/", {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: "Bearer " + serviceAAD.getToken(),
        },
      });
      let data = await result.json();
      let temp = {};
      if (data) {
        data.map((dat) => {
          temp[dat.idoc] = dat.nombre;
          return null;
        });
      }
      setColumns([
        {
          title: "OC que recibe distribución",
          field: "idOCDist",
          lookup: temp,
        },
        { title: "Porcentaje asignado", field: "porcAsig", type: "numeric" },
      ]);
      setDatOCDist(temp);
    };

    const listHomologacion = async () => {
      const result = await fetch(
        process.env.REACT_APP_API_URL + "/generales/Homologacion/OC",
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            Authorization: "Bearer " + serviceAAD.getToken(),
          },
        }
      );
      let data = await result.json();
      setDatHomologacionOC(data);
    };
    const GetEntornos = async () => {
      const result = await fetch(process.env.REACT_APP_API_URL + "/generales/entornos/", {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: "Bearer " + serviceAAD.getToken(),
        },
      });
      let data = await result.json();
      setDatEntorno(data);
    };
    const GetEVC = async () => {
      const result = await fetch(process.env.REACT_APP_API_URL + "/generales/EVC/", {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: "Bearer " + serviceAAD.getToken(),
        },
      });
      let data = await result.json();
      tempEvc = data;
      setDatEVC(data);
    };
    const GetPDC = async () => {
      const result = await fetch(process.env.REACT_APP_API_URL + "/generales/pdc", {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: "Bearer " + serviceAAD.getToken(),
        },
      });
      let data = await result.json();
      let tempListPDC = [];
      if (data) {
        data.map((item) => {
          tempListPDC.push({ label: item.valor, value: item.valor });
        });
      }
      setDatPDC(tempListPDC);
    };
    GetPDC();
    listHomologacion();
    datosDistOC();
    datosTipoOC();
    datosCompañia();
    datosArbol();
    unidadesRO();
    analistasRO();
    ResponsablesNeg();
  }, []);

  const CambiarEVC = async (ent, evc) => {
    let entorno;
    let tempEvc = evc ? evc : datEVC;
    if (ent) {
      entorno = ent.replace(/ /g, "_").split(",").join("");
    } else {
      entorno = document
        .getElementById("entorno")
        .value.replace(/ /g, "_")
        .split(",")
        .join("");
    }
    let temp = [];
    if (tempEvc) {
      tempEvc.map((data) => {
        if (data.parametro === entorno) {
          temp.push(data);
        }
      });
    }
    await asignarEVCSelect(temp);
  };

  const asignarEVCSelect = async (dataEVC) => {
    setDatEVCSelect(dataEVC);
  };

  const onToggle = (node, toggled) => {
    if (cursor) {
      cursor.active = false;
    }
    node.active = true;
    if (node.children) {
      node.toggled = toggled;
    }
    setCursor(node);
    setDatArbol(Object.assign({}, datArbol));
  };

  const handleChangeState = (event) => {
    if (state === "Activo") {
      setState("Inactivo");
      setIdState(false);
    } else {
      setState("Activo");
      setIdState(true);
    }
  };
  const handleChange = (e) => {
    setSelectedValueResponsable({ value: e.value, label: e.label });
  };

  const cambiarComp = async (company, dataArea, selectedDat, dataArbol) => {
    let comp;
    if (company) {
      comp = company;
    } else {
      comp = document.getElementById("Compania").value;
    }
    let temp = [];
    let tempC = [];
    let selectedOC = selectedDat ? selectedDat : selectedData;
    let datOCArbol = dataArbol ? dataArbol : datOCComp;
    if (datOCArbol !== null) {
      datOCArbol.map((data) => {
        if (data.idcompania == comp) {
          temp.push(data);
        }
        return null;
      });
    }
    let datosArea;
    if (dataArea) {
      datosArea = dataArea;
    } else {
      datosArea = datAreaO;
    }
    if (datosArea) {
      datosArea.map((dat) => {
        if (dat.idcompania == comp) {
          tempC.push(dat);
        }
      });
    }
    await setDatAreaOT(tempC);

    crearData(temp, selectedOC);
  };

  let temp;
  const bChildren = (id, data) => {
    if (data) {
      for (let index = 0; index < data.length; index++) {
        const element = data[index];
        if (element.id === id) {
          temp = element;
          break;
        } else {
          bChildren(id, element.children);
        }
      }
    }
    return temp;
  };

  const datosNivel = () => {
    let temp = [cursor];
    if (!cursor) {
      temp = [bChildren(datObjetoCosto.idoc, datArbol.children)];
    } else {
      temp = [cursor];
    }
    let condition = 0;
    let padreTemp;
    function retornarPadre(datosArbol, id) {
      if (datosArbol.length !== 0) {
        datosArbol.map((dat) => {
          if (dat.id === id) {
            padreTemp = dat;
          } else if (dat.children.length !== 0) {
            retornarPadre(dat.children, id);
          }
          return null;
        });
      }
      return padreTemp;
    }
    function llenarVector(idPadre) {
      if (temp[0].padre !== 0 && temp[0].padre !== undefined) {
        temp.unshift(retornarPadre(datArbol.children, idPadre));
        llenarVector(temp[0].padre);
      } else if (temp[0].padre === undefined) {
        condition = 1;
      } else if (!cursor) {
        condition = 2;
      }
    }
    llenarVector(temp[0].padre);
    if (condition === 1) {
      return {
        nivel: 1,
        arbol: null,
      };
    } else if (condition === 0) {
      return {
        nivel: temp.length,
        arbol: temp,
      };
    } else {
      return {
        nivel: temp.length,
        arbol: temp,
      };
    }
  };

  const perteneceDist = (data, unknown) => {
    let temp = false;
    data.map((dat) => {
      if (dat.id === unknown.id) {
        temp = true;
      }
      return null;
    });
    return temp;
  };

  const actualizarEstadoDistr = (data, estado) => {
    let pertenece = perteneceDist(tempDataGrid, data);
    if (estado && pertenece) {
      let temp = dataGridUpdate;
      temp.push({
        id: data.id,
        porcentage_asignado: data.porcAsig,
        estado: estado,
        idoc_distribucion: data.idOCDist,
      });
      setDataGridUpdate(temp);
    } else if (pertenece) {
      let temp = dataGridDelete;
      temp.push({
        id: data.id,
        porcentage_asignado: data.porcAsig,
        estado: estado,
        idoc_distribucion: data.idOCDist,
      });
      setDataGridDelete(temp);
    }
  };

  const changeRequired = () => {
    let data = document.getElementById("tipoOC").value;
    if (data === "Producto") {
      setRequired(true);
      setAst("*");
      setPorcAsig(100);
    } else {
      let temp = 0;
      setRequired(false);
      setAst("");
      tempDataGrid.map((data) => {
        temp = temp + data.porcAsig;
      });
      setPorcAsig(temp);
      setDataGrid(tempDataGrid);
    }
  };

  const sendData = (e) => {
    e.preventDefault();
    //if (porcAsig) {
    if (false) {
      window.alert(
        "El porcentaje asignado debe ser el 100%, verifique que tenga los datos correctamente."
      );
    } else {
      let tempDataGridNew = [];
      let pertenece;
      dataGrid.map((data) => {
        pertenece = perteneceDist(tempDataGrid, data);
        if (!pertenece) {
          tempDataGridNew.push(data);
        }
      });
      const temp = datosNivel();

      function limpiar(_callback) {
        _callback();
        setTimeout(() => {
          setEstadoPost({ id: 0, data: null });
        }, 3000);
      }

      function sendData2(idOc) {
        tempDataGridNew.map((data) => {
          const data2 = {
            porcentage_asignado: data.porcAsig,
            estado: true,
            idoc_principal: idOc,
            idoc_distribucion: parseInt(data.idOCDist),
          };
          fetch(process.env.REACT_APP_API_URL + "/maestros_ro/rx_oc_distribucion/", {
            method: "POST",
            body: JSON.stringify(data2),
            headers: {
              "Content-type": "application/json; charset=UTF-8",
              Authorization: "Bearer " + serviceAAD.getToken(),
            },
          })
            .then((data) =>
              data.json().then((response) => {
                if (data.status >= 200 && data.status < 300) {
                } else if (data.status >= 500) {
                } else if (data.status >= 400 && data.status < 500) {
                }
              })
            )
            .catch(function (err) {
              console.error(err);
            });
        });
        dataGridDelete.map((data) => {
          const data2 = {
            idrx_oc_distribucion: data.id,
            porcentage_asignado: data.porcentage_asignado,
            estado: data.estado,
            idoc_distribucion: parseInt(data.idoc_distribucion),
          };
          fetch(
            process.env.REACT_APP_API_URL + "/maestros_ro/rx_oc_distribucion/" +
              data.id +
              "/",
            {
              method: "PUT",
              body: JSON.stringify(data2),
              headers: {
                "Content-type": "application/json; charset=UTF-8",
                Authorization: "Bearer " + serviceAAD.getToken(),
              },
            }
          )
            .then((data) =>
              data.json().then((response) => {
                if (data.status >= 200 && data.status < 300) {
                } else if (data.status >= 500) {
                } else if (data.status >= 400 && data.status < 500) {
                }
              })
            )
            .catch(function (err) {
              console.error(err);
            });
        });

        dataGridUpdate.map((data) => {
          const data2 = {
            idrx_oc_distribucion: data.id,
            porcentage_asignado: data.porcentage_asignado,
            estado: data.estado,
            idoc_distribucion: parseInt(data.idoc_distribucion),
          };
          fetch(
            process.env.REACT_APP_API_URL + "/maestros_ro/rx_oc_distribucion/" +
              data.id +
              "/",
            {
              method: "PUT",
              body: JSON.stringify(data2),
              headers: {
                "Content-type": "application/json; charset=UTF-8",
                Authorization: "Bearer " + serviceAAD.getToken(),
              },
            }
          )
            .then((data) =>
              data.json().then((response) => {
                if (data.status >= 200 && data.status < 300) {
                } else if (data.status >= 500) {
                } else if (data.status >= 400 && data.status < 500) {
                }
              })
            )
            .catch(function (err) {
              console.error(err);
            });
        });
      }

      const area = (nvArea) => {
        if (temp.arbol !== null && temp.arbol[nvArea - 1] !== undefined) {
          return temp.arbol[nvArea - 1].id;
        } else if (nvArea === temp.nivel) {
          return datObjetoCosto.idoc;
        } else {
          return null;
        }
      };

      let entornoTemp = document.getElementById("entorno").value;
      let evcTemp = document.getElementById("evc").value;
      const data = {
        nombre: document.getElementById("NombreObjetoCosto").value,
        descripcion_oc: document.getElementById("Descripcion").value,
        idcompania: parseInt(document.getElementById("Compania").value),
        nivel: temp.nivel,
        oc_n1: area(1),
        oc_n2: area(2),
        responsable_negocio: selectedValueResponsable
          ? selectedValueResponsable.value
          : null,
        area_organizacional: parseInt(document.getElementById("AreaO").value),
        fecha_lanzamiento:
          startDate !== null ? startDate.toISOString().split("T")[0] : null,
        estado_oc: idState,
        unidad_ro: parseInt(document.getElementById("UnidadRO").value),
        analista_ro: parseInt(document.getElementById("AnalistaRO").value),
        padre:
          temp.arbol !== null
            ? temp.arbol[temp.nivel - 2]
              ? temp.arbol[temp.nivel - 2].id
              : temp.arbol[temp.arbol.length - 1].padre
            : 0,
        codigo_vp: document.getElementById("CodigoObjetoCosto").value,
        tipo_oc: document.getElementById("tipoOC").value,
        driver_disribucion: document.getElementById("DiverObjetoCosto").value,
        unidad_aplicacion: document.getElementById("UnidadAplObjetoCosto")
          .value,
        proinformgfinanciera: productoGF ? productoGF.value : null,
        justificacion_distribucion: document.getElementById("justificacion")
          .value
          ? document.getElementById("justificacion").value
          : null,
        homologacion_oc: document.getElementById("homologacionOC").value,
        entorno: entornoTemp ? entornoTemp : null,
        evc: evcTemp ? evcTemp : null,
      };

      fetch(
        process.env.REACT_APP_API_URL + "/maestros_ro/oc/" + datObjetoCosto.idoc + "/",
        {
          method: "PUT",
          body: JSON.stringify(data),
          headers: {
            "Content-type": "application/json; charset=UTF-8",
            Authorization: "Bearer " + serviceAAD.getToken(),
          },
        }
      )
        .then((data) =>
          data.json().then((response) => {
            if (data.status >= 200 && data.status < 300) {
              setEstadoPost({ id: 2, data: data });
              localStorage.setItem("idObjetoCosto", response.idoc);
              limpiar(() => {});
              sendData2(response.idoc);
            } else if (data.status >= 500) {
              setEstadoPost({ id: 5, data: response });
              limpiar(() => {});
            } else if (data.status >= 400 && data.status < 500) {
              setEstadoPost({ id: 4, data: response });
              limpiar(() => {});
            }
          })
        )
        .catch(function (err) {
          console.error(err);
        });
    }
  };

  const handleChangePDC = (e) => {
    setSelectedPDC(e.value);
    setProductoGF(e);
  };
  const MySelect = (props) => (
    <Select
      {...props}
      className="texto"
      defaultValue={selectedValueResponsable}
      options={props.options}
      placeholder={props.placeholder}
    />
  );

  return (
    <>
      <AlertDismissibleExample alerta={estadoPost} />
      <Row className="mb-3">
        <Col md={12}>
          <h1 className="titulo">Edición del Objeto de costo</h1>
        </Col>
      </Row>
      <Form id="formData" onSubmit={(e) => sendData(e)}>
        <Row className="mb-3">
          <Col sm={4} xs={12}>
            <label className="label forn-label">Id Objeto de Costo</label>
          </Col>
          <Col sm={8} xs={12}>
            <input
              type="text"
              disabled
              className="form-control text-center texto"
              placeholder="ID Automático"
              defaultValue={
                datObjetoCosto !== null ? datObjetoCosto.idoc : null
              }
              id="IDobjetoCosto"
            ></input>
          </Col>
        </Row>
        <Row className="mb-3">
          <Col sm={4} xs={12}>
            <label className="form-label label">Nombre Objeto de Costo*</label>
          </Col>
          <Col sm={8} xs={12}>
            <input
              type="text"
              className="form-control text-center texto"
              placeholder="Nombre del oc"
              defaultValue={
                datObjetoCosto !== null ? datObjetoCosto.nombre : null
              }
              required
              id="NombreObjetoCosto"
            ></input>
            <Form.Control.Feedback type="invalid">
              Por favor introduzca un nombre.
            </Form.Control.Feedback>
          </Col>
        </Row>
        <Row className="mb-3">
          <Col sm={4} xs={12}>
            <label className="form-label label">Descripción</label>
          </Col>
          <Col sm={8} xs={12}>
            <textarea
              className="form-control text-center"
              placeholder="Descripción del Objeto de costo"
              defaultValue={
                datObjetoCosto !== null ? datObjetoCosto.descripcion_oc : null
              }
              rows="3"
              id="Descripcion"
            ></textarea>
          </Col>
        </Row>
        <Row className="mb-3">
          <Col sm={4} xs={12}>
            <label className="forn-label label">Compañia*</label>
          </Col>
          <Col sm={8} xs={10}>
            <select
              className="form-control texto"
              required
              id="Compania"
              onChange={() => cambiarComp()}
            >
              <option
                value={
                  datObjetoCosto !== null
                    ? datObjetoCosto.idcompania.idcompania
                    : null
                }
              >
                {datObjetoCosto !== null &&
                datObjetoCosto.idcompania.compania !== null
                  ? datObjetoCosto.idcompania.compania
                  : "Seleccione compañia"}
              </option>
              {datCompañia !== null
                ? datCompañia.map((compañia) => {
                    return datObjetoCosto !== null &&
                      datObjetoCosto.idcompania.compania !==
                        compañia.compania ? (
                      <option className="texto" value={compañia.idcompania}>
                        {compañia.compania}
                      </option>
                    ) : null;
                  })
                : null}
            </select>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col sm={4} xs={12}>
            <label className="form-label label">Entorno</label>
          </Col>
          <Col sm={8} xs={10}>
            <select
              className="form-control texto"
              id="entorno"
              onChange={() => CambiarEVC()}
            >
              <option
                value={
                  datObjetoCosto && datObjetoCosto.entorno
                    ? datObjetoCosto.entorno
                    : null
                }
              >
                {datObjetoCosto && datObjetoCosto.entorno
                  ? datObjetoCosto.entorno
                  : "Seleccione Entorno"}
              </option>
              {datEntorno
                ? datEntorno.map((entorno) => {
                    return datObjetoCosto &&
                      datObjetoCosto.entorno &&
                      datObjetoCosto.entorno !== entorno.valor ? (
                      <option className="texto" value={entorno.valor}>
                        {entorno.valor}
                      </option>
                    ) : (
                      <option className="texto" value={entorno.valor}>
                        {entorno.valor}
                      </option>
                    );
                  })
                : null}
            </select>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col sm={4} xs={12}>
            <label className="form-label label">EVC</label>
          </Col>
          <Col sm={8} xs={10}>
            <select className="form-control texto" id="evc">
              <option
                value={
                  datObjetoCosto && datObjetoCosto.evc
                    ? datObjetoCosto.evc
                    : null
                }
              >
                {datObjetoCosto && datObjetoCosto.evc
                  ? datObjetoCosto.evc
                  : "Seleccione EVC"}
              </option>
              {datEVCSelect
                ? datEVCSelect.map((evc) => {
                    return datObjetoCosto &&
                      datObjetoCosto.evc &&
                      datObjetoCosto.evc !== evc.valor ? (
                      <option className="texto" value={evc.valor}>
                        {evc.valor}
                      </option>
                    ) : (
                      <option className="texto" value={evc.valor}>
                        {evc.valor}
                      </option>
                    );
                  })
                : null}
            </select>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col sm={4} xs={12}>
            <label className="form-label label">Selección de nivel*</label>
          </Col>
          <Col sm={8} xs={12} className="contenedorArbol">
            <Treebeard
              data={datArbol}
              onToggle={onToggle}
              id="selectedItem"
              style={style}
            />
          </Col>
        </Row>

        <Row className="mb-3">
          <Col sm={4} xs={12}>
            <label className="forn-label label">Responsable del negocio</label>
          </Col>
          <Col sm={8} xs={10}>
            <MySelect
              className="texto"
              onChange={handleChange}
              options={datResponsables}
            />
          </Col>
        </Row>
        <Row className="mb-3">
          <Col sm={4} xs={12}>
            <label className="forn-label label">Área organizacional</label>
          </Col>
          <Col sm={8} xs={10}>
            <select className="form-control texto" id="AreaO">
              <option
                value={
                  datObjetoCosto && datObjetoCosto.area_organizacional
                    ? datObjetoCosto.area_organizacional.idarea_organizacional
                    : null
                }
              >
                {datObjetoCosto !== null &&
                datObjetoCosto.area_organizacional !== null
                  ? datObjetoCosto.area_organizacional.nombre
                  : "Seleccione área organizacional"}
              </option>
              {datAreaOT !== null
                ? datAreaOT.map((areaO) => {
                    return datObjetoCosto &&
                      datObjetoCosto.area_organizacional &&
                      datObjetoCosto.area_organizacional.nombre !==
                        areaO.nombre ? (
                      <option
                        className="texto"
                        value={areaO.idarea_organizacional}
                      >
                        {areaO.nombre}
                      </option>
                    ) : (
                      <option
                        className="texto"
                        value={areaO.idarea_organizacional}
                      >
                        {areaO.nombre}
                      </option>
                    );
                  })
                : null}
            </select>
          </Col>
        </Row>
        <Row className="mb-3">
          <Col sm={4} xs={5}>
            <label className="forn-label label">Fecha de lanzamiento*</label>
          </Col>
          <Col sm={4} xs={5}>
            <DatePicker
              className="form-control"
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              id="fechaIni"
              required
            ></DatePicker>
            <Form.Control.Feedback type="invalid">
              Por favor introduzca la fecha de inicio.
            </Form.Control.Feedback>
          </Col>
        </Row>
        <Row className="mb-3">
          <Col sm={4} xs={12}>
            <label className="forn-label label">Unidad de RO</label>
          </Col>
          <Col sm={8} xs={10}>
            <select className="form-control texto" id="UnidadRO">
              <option
                value={
                  datObjetoCosto !== null && datObjetoCosto.unidad_ro !== null
                    ? datObjetoCosto.unidad_ro.idunidad_riesgo
                    : null
                }
              >
                {datObjetoCosto !== null && datObjetoCosto.unidad_ro !== null
                  ? datObjetoCosto.unidad_ro.nombre
                  : "Seleccione unidad de RO"}
              </option>
              {datUnidadRO !== null
                ? datUnidadRO.map((unidadRO) => {
                    return datObjetoCosto !== null &&
                      datObjetoCosto.unidad_ro &&
                      datObjetoCosto.unidad_ro.nombre !== unidadRO.nombre ? (
                      <option
                        className="texto"
                        value={unidadRO.idunidad_riesgo}
                      >
                        {unidadRO.nombre}
                      </option>
                    ) : (
                      <option
                        className="texto"
                        value={unidadRO.idunidad_riesgo}
                      >
                        {unidadRO.nombre}
                      </option>
                    );
                  })
                : null}
            </select>
          </Col>
        </Row>
        <Row className="mb-3">
          <Col sm={4} xs={12}>
            <label className="forn-label label">Analista RO</label>
          </Col>
          <Col sm={8} xs={10}>
            <select className="form-control texto" id="AnalistaRO">
              <option
                value={
                  datObjetoCosto !== null && datObjetoCosto.analista_ro !== null
                    ? datObjetoCosto.analista_ro.idposicion
                    : null
                }
              >
                {datObjetoCosto !== null && datObjetoCosto.analista_ro !== null
                  ? datObjetoCosto.analista_ro.idusuario.nombre
                  : "Seleccione analista RO"}
              </option>
              {datAnalistas !== null
                ? datAnalistas.map((analista) => {
                    return datObjetoCosto !== null &&
                      datObjetoCosto.analista_ro !== null &&
                      datObjetoCosto.analista_ro.idusuario.nombre !==
                        analista.nombre ? (
                      <option className="texto" value={analista.id}>
                        {analista.nombre}
                      </option>
                    ) : (
                      <option className="texto" value={analista.id}>
                        {analista.nombre}
                      </option>
                    );
                  })
                : null}
            </select>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col sm={4} xs={12}>
            <label className="forn-label label">Homologación OC</label>
          </Col>
          <Col sm={8} xs={10}>
            <select className="form-control texto" id="homologacionOC">
              <option value="">
                {datObjetoCosto !== null &&
                datObjetoCosto.homologacion_oc !== null
                  ? datObjetoCosto.homologacion_oc
                  : "Seleccione Tipo Homologación OC"}
              </option>
              {datHomologacionOC !== null
                ? datHomologacionOC.map((dat) => {
                    return datObjetoCosto &&
                      datObjetoCosto.homologacion_oc &&
                      datObjetoCosto.homologacion_oc !== dat.valor ? (
                      <option
                        className="texto"
                        key={dat.idm_parametrosgenerales}
                        value={dat.valor}
                      >
                        {dat.valor}
                      </option>
                    ) : null;
                  })
                : null}
            </select>
          </Col>
        </Row>
        <hr />
        <Row className="mb-3">
          <Col sm={4} xs={12}>
            <label className="form-label label">Código en VP Financiera</label>
          </Col>
          <Col sm={8} xs={12}>
            <input
              type="text"
              className="form-control text-center texto"
              placeholder="Código de objeto de costo"
              id="CodigoObjetoCosto"
              defaultValue={
                datObjetoCosto !== null ? datObjetoCosto.codigo_vp : null
              }
            ></input>
          </Col>
        </Row>
        <Row className="mb-3">
          <Col sm={4} xs={12}>
            <label className="forn-label label">Tipo OC*</label>
          </Col>
          <Col sm={8} xs={10}>
            <select
              className="form-control texto"
              required
              id="tipoOC"
              onChange={() => changeRequired()}
            >
              <option
                value={
                  datObjetoCosto && datObjetoCosto.tipo_oc
                    ? datObjetoCosto.tipo_oc
                    : ""
                }
              >
                {datObjetoCosto && datObjetoCosto.tipo_oc
                  ? datObjetoCosto.tipo_oc
                  : "Seleccione Tipo OC"}
              </option>
              {datTipoCO !== null
                ? datTipoCO.map((tipo_oc) => {
                    return datObjetoCosto &&
                      datObjetoCosto.tipo_oc &&
                      datObjetoCosto.tipo_oc !== tipo_oc.valor ? (
                      <option className="texto" value={tipo_oc.valor}>
                        {tipo_oc.valor}
                      </option>
                    ) : null;
                  })
                : null}
            </select>
          </Col>
        </Row>
        <Row className="mb-3">
          <Col sm={4} xs={12}>
            <label className="form-label label">
              Driver de distribución{ast}
            </label>
          </Col>
          <Col sm={8} xs={12}>
            <input
              type="text"
              className="form-control text-center texto"
              placeholder="Driver de distribución"
              required={required}
              id="DiverObjetoCosto"
              defaultValue={
                datObjetoCosto !== null
                  ? datObjetoCosto.driver_disribucion
                  : null
              }
            ></input>
          </Col>
        </Row>
        <Row className="mb-3">
          <Col sm={4} xs={12}>
            <label className="form-label label">
              Unidad de aplicación{ast}
            </label>
          </Col>
          <Col sm={8} xs={12}>
            <input
              type="text"
              className="form-control text-center texto"
              placeholder="Unidad de aplicación"
              required={required}
              id="UnidadAplObjetoCosto"
              defaultValue={
                datObjetoCosto !== null
                  ? datObjetoCosto.unidad_aplicacion
                  : null
              }
            ></input>
          </Col>
        </Row>
        <Row className="mb-3">
          <Col sm={4} xs={12}>
            <label className="forn-label label">
              Producto en informe de gestión financiera
              {ast}
            </label>
          </Col>
          <Col sm={8} xs={10} style={{ zIndex: 1000 }}>
            <Select
              className="texto"
              components={animatedComponents}
              options={datPDC}
              onChange={handleChangePDC}
              value={productoGF}
              required={required}
            ></Select>
          </Col>
        </Row>
        {!required ? (
          <>
            <Row className="mb-3">
              <Col sm={4} xs={2}>
                <label className="form-label label">
                  Asignar la distribución
                </label>
              </Col>
              <Col sm={8} xs={12}>
                <MaterialTable
                  options={{
                    actionsColumnIndex: -1,
                    search: false,
                    paging: false,
                    sorting: false,
                    draggable: false,
                    headerStyle: {
                      backgroundColor: "#2c2a29",
                      color: "#FFF",
                    },
                    rowStyle: {
                      backgroundColor: "#f4f4f4",
                    },
                  }}
                  localization={{
                    body: {
                      emptyDataSourceMessage: "No hay datos por mostrar",
                      addTooltip: "Añadir",
                      deleteTooltip: "Eliminar",
                      editTooltip: "Editar",
                      filterRow: {
                        filterTooltip: "Filtrar",
                      },
                      editRow: {
                        deleteText: "¿Segura(o) que quiere eliminar?",
                        cancelTooltip: "Cancelar",
                        saveTooltip: "Guardar",
                      },
                    },
                  }}
                  icons={tableIcons}
                  title=""
                  columns={columns}
                  data={dataGrid}
                  editable={{
                    onRowAdd: (newData) =>
                      new Promise((resolve, reject) => {
                        setTimeout(() => {
                          setDataGrid([...dataGrid, newData]);
                          setPorcAsig(porcAsig + newData.porcAsig);
                          resolve();
                        }, 1000);
                      }),
                    onRowUpdate: (newData, oldData) =>
                      new Promise((resolve, reject) => {
                        setTimeout(() => {
                          const dataUpdate = [...dataGrid];
                          const index = oldData.tableData.id;
                          dataUpdate[index] = newData;
                          setDataGrid([...dataUpdate]);
                          actualizarEstadoDistr(newData, true);
                          setPorcAsig(
                            porcAsig + (newData.porcAsig - oldData.porcAsig)
                          );
                          resolve();
                        }, 1000);
                      }),
                    onRowDelete: (oldData) =>
                      new Promise((resolve, reject) => {
                        setTimeout(() => {
                          const dataDelete = [...dataGrid];
                          const index = oldData.tableData.id;
                          dataDelete.splice(index, 1);
                          setDataGrid([...dataDelete]);
                          actualizarEstadoDistr(oldData, false);
                          setPorcAsig(porcAsig - oldData.porcAsig);
                          resolve();
                        }, 1000);
                      }),
                  }}
                />
              </Col>
            </Row>
            <Row className="mb-3">
              <Col sm={6} xs={12}></Col>
              <Col sm={4} xs={12} className=" text-right">
                <label className="form-label label">Porcentaje Asignado</label>
              </Col>
              <Col sm={2} xs={12}>
                <input
                  type="text"
                  className="form-control text-center texto"
                  value={porcAsig + "%"}
                  disabled
                  id="porcAsig"
                ></input>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col sm={4} xs={12}>
                <label className="form-label label">
                  Justificación de la distribución
                </label>
              </Col>
              <Col sm={8} xs={12}>
                <textarea
                  className="form-control"
                  placeholder="Justificación"
                  rows="5"
                  id="justificacion"
                  defaultValue={
                    datObjetoCosto !== null
                      ? datObjetoCosto.justificacion_distribucion
                      : null
                  }
                ></textarea>
              </Col>
            </Row>
          </>
        ) : null}

        {/* Campos para todas las vistas de los maestros */}
        {props.permisos.inactivar ? (
          <Row className="mb-3">
            <Col sm={4} xs={4}>
              <label className="forn-label label">Estado</label>
            </Col>
            <Col>
              <FormControlLabel
                id="switch"
                className="texto"
                control={<Switch checked={idState} />}
                label={state}
                onChange={handleChangeState}
                name="Estado"
              />
            </Col>
          </Row>
        ) : null}

        <Row className="mb-3">
          <Col sm={4} xs={0}></Col>
          <Col>
            <div className="form-text">* Campos obligatorios</div>
          </Col>
        </Row>
        <Row className="mb-3">
          <Col sm={4} xs={1}></Col>
          <Col sm={3} xs={3}>
            {props.permisos.editar ? (
              <button type="submit" className="btn botonPositivo" id="send">
                Guardar
              </button>
            ) : null}
          </Col>
          <Col sm={3} xs={3}>
            <Link to="ObjetosCosto">
              <button type="button" className="btn botonNegativo">
                Descartar
              </button>
            </Link>
          </Col>
        </Row>
      </Form>
    </>
  );
}
