import React, { useState, useEffect, forwardRef } from "react";
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
  Navbar,
  Nav,
} from "react-bootstrap";
import { withStyles, makeStyles } from "@material-ui/core/styles";

import axios from "axios";
import AADService from "../auth/authFunctions";

import Switch from "@material-ui/core/Switch";
import FormControlLabel from "@material-ui/core/FormControlLabel";

import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";

import MaterialTable from "material-table";

import Check from "@material-ui/icons/Check";
import Clear from "@material-ui/icons/Clear";
import Edit from "@material-ui/icons/Edit";
import Loader from "react-loader-spinner";

import Checkbox from "@material-ui/core/Checkbox";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableRow from "@material-ui/core/TableRow";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TextField from "@material-ui/core/TextField";
import TableContainer from "@material-ui/core/TableContainer";

import Select from "react-select";
import makeAnimated from "react-select/animated";

import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";

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

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

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

const animatedComponents = makeAnimated();

export default function EditarCausa(props) {
  let history = useHistory();
  const classes = useStyles();
  const serviceAAD = new AADService();
  const location = useLocation();

  const [state, setState] = useState("Activo");
  const [idState, setIdState] = useState(true);
  const [datArbol, setDatArbol] = useState([]);
  const [datCausa, setDatCausa] = useState(null);
  const [cursor, setCursor] = useState(false);
  const [supervisores, setSupervisores] = useState(null);
  const [paises, setPaises] = useState();
  const [clasificacion, setClasificacion] = useState(null);

  const [categoriaCausa, setCategoriaCausa] = useState(null);
  const [nivel, setNivel] = useState(null);
  const [dependencia, setDependencia] = useState(null);
  const [consecuencia, setConsecuencia] = useState(null);

  const [factor, setFactor] = useState(null);
  const [tipo, setTipo] = useState(null);
  const [delitosFuente, setDelitosFuente] = useState(null);
  const [resumen, setResumen] = useState(null);
  const [categoriaCausa2, setCategoriaCausa2] = useState(null);

  const [dataMacroriesgos, setDataMacroriesgos] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [selected, setSelected] = useState([]);

  const [isSelectedRO, setIsSelectedRO] = useState(false);

  const isSelected = (name) => selected.indexOf(name) !== -1;

  const handleClick = (event, name) => {
    console.log(selected);
    console.log(selected.indexOf(name));
    const selectedIndex = selected.indexOf(name);

    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat([], name);
      //SetButtonEdit(true);
    } else {
      //SetButtonEdit(false);
    }
    console.log("Selected:", newSelected);
    setSelected(newSelected);
  };

  const [estadoPost, setEstadoPost] = useState({
    alerta: { id: 0, data: null },
  });

  const [columns, setColumns] = useState([
    {
      title: "País",
      field: "pais",
      lookup: paises,
    },
    {
      title: "Supervisor",
      field: "supervisor",
      lookup: supervisores,
    },
    { title: "ID Local Normativo", field: "IdLocal" },

    {
      title: "Nombre Local Normativo",
      field: "NombreNormativo" /* 
      initialEditValue: "Nombre", */,
    },
  ]);

  const [dataGrid, setDataGrid] = useState([]);
  const [dataGridTemp, setDataGridTemp] = useState([]);
  const [dataGridUpdate, setDataGridUpdate] = useState([]);
  const [dataGridDelete, setDataGridDelete] = useState([]);

  const [causaN1, setCausaN1] = useState(null);
  const [causaN2, setCausaN2] = useState(null);
  const [listaCausasN1, setListaCausasN1] = useState([
    { value: 1, label: "Frutas" },
    { value: 2, label: "Verduras" },
    { value: 3, label: "Tuberculos" },
  ]);
  const [listaCausasN2, setListaCausasN2] = useState([
    { value: 1, label: "Manzana" },
    { value: 2, label: "Brocoli" },
    { value: 3, label: "Papa" },
  ]);
  const [listaCausasN2Filtered, setListaCausasN2Filtered] = useState([]);

  const [valor, setValor] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValor(newValue);
  };

  const defaultValues = {
    nombre: null,
    descripcion: null,
    classificacion: null,
    aristas: [],
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
            id: dat.idcausa,
            active: selectedData.padres[0] === dat.idcausa ? false : false,
            toggled: selectedData.padres[0] === dat.idcausa ? true : false,
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
              id: dat.idcausa,
              active:
                selectedData.padres[0] === dat.idcausa ||
                selectedData.padres[1] === dat.idcausa ||
                selectedData.padres[2] === dat.idcausa
                  ? false
                  : false,
              toggled:
                selectedData.padres[0] === dat.idcausa ||
                selectedData.padres[1] === dat.idcausa ||
                selectedData.padres[2] === dat.idcausa
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
    let temp;
    if (!cursor) {
      temp = [bChildren(datCausa.idcausa, datArbol.children)];
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

  const listaAristas = [
    {
      label: "RO",
      value: "RO",
    },
    {
      label: "SOX",
      value: "SOX",
    },
    {
      label: "LAFT",
      value: "LAFT",
    },
    {
      label: "PDP",
      value: "PDP",
    },
    {
      label: "SAC",
      value: "SAC",
    },
    {
      label: "Corrupción",
      value: "Corrupción",
    },

    {
      label: "Reputacional",
      value: "Reputacional",
    },
    {
      label: "Legal",
      value: "Legal",
    },
    {
      label: "ESG",
      value: "ESG",
    },
    {
      label: "FATCA - CRS",
      value: "FATCA - CRS",
    },
    {
      label: "Cumplimiento Normativo",
      value: "Cumplimiento Normativo",
    },
  ];

  const [aristas, setAristas] = useState(null);

  useEffect(() => {
    let paisesAll = [];
    let selectedData;
    const datosCausa = async () => {
      const result = await fetch(
        process.env.REACT_APP_API_URL + "/maestros_ro/causa/" +
          localStorage.getItem("idCausa") +
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
      if (data && !data.estado) {
        setIdState(data.estado);
        setState("Inactivo");
      }
      selectedData = {
        padres: [data.causa_n1, data.causa_n2, data.causa_n3],
        nivel: data.nivel,
        id: data.idcausa,
      };
      setDatCausa(data);
    };
    const datosArbol = async () => {
      await datosCausa();
      const result = await fetch(
        process.env.REACT_APP_API_URL + "/maestros_ro/ArbolCausa/",
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
          if (dat.nivel === 1) {
            temp.push(dat);
          }
          return null;
        });
      }
      crearData(data, selectedData);
    };
    const datosPaises = async () => {
      const result = await fetch(process.env.REACT_APP_API_URL + "/generales/causa/pais", {
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
          paisesAll.push(dat);
          temp[dat.idm_parametrosgenerales] = dat.valor;
          return null;
        });
      }
      const resultUser = await fetch(
        process.env.REACT_APP_API_URL + "/generales/homologacion/supervisor",
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            Authorization: "Bearer " + serviceAAD.getToken(),
          },
        }
      );
      let dataUser = await resultUser.json();
      let tempUser = {};
      if (dataUser) {
        dataUser.map((dat) => {
          tempUser[dat.valor] = dat.valor;
          return null;
        });
      }
      setColumns([
        {
          title: "País",
          field: "pais",
          lookup: temp,
        },
        {
          title: "Supervisor",
          field: "supervisor",
          lookup: tempUser,
        },
        { title: "ID Local Normativo", field: "IdLocal" },

        {
          title: "Nombre Local Normativo",
          field: "NombreNormativo" /* 
          initialEditValue: "Nombre", */,
        },
      ]);
      setPaises(temp);
      setSupervisores(tempUser);
    };
    const datosGrid = async () => {
      await datosPaises();
      const result = await fetch(
        process.env.REACT_APP_API_URL + "/maestros_ro/causa_pais/" +
          localStorage.getItem("idCausa") +
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
      const buscarPais = (data) => {
        let temp;
        for (var i = 0; paisesAll.length > i; i++) {
          if (paisesAll[i].valor == data.pais_causa) {
            temp = paisesAll[i].idm_parametrosgenerales;
          }
        }

        return temp;
      };
      let temp = [];
      let tempC = localStorage.getItem("idCausa");
      if (data !== null) {
        data.map((dat) => {
          if (
            dat.id_causa !== null &&
            dat.id_causa.idcausa == tempC &&
            dat.estado === true
          ) {
            temp.push({
              id: dat.idcausa_pais,
              supervisor: dat.supervisor,
              pais: buscarPais(dat),
              IdLocal: dat.idcausa_local_normativo,
              NombreNormativo: dat.nombre_causa_local_normativo,
            });
          }
        });
      }
      setDataGrid(temp);
      setDataGridTemp(temp);
    };
    const datosClasificacion = async () => {
      const result = await fetch(
        process.env.REACT_APP_API_URL + "/generales/causa/Clasificacion",
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            Authorization: "Bearer " + serviceAAD.getToken(),
          },
        }
      );
      let data = await result.json();
      setClasificacion(data);
    };

    datosClasificacion();
    datosGrid();
    datosPaises();
    datosArbol();
  }, []);

  const handleChangeState = (event) => {
    if (state === "Activo") {
      setState("Inactivo");
      setIdState(false);
    } else {
      setState("Activo");
      setIdState(true);
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

  const actualizarEstadoHom = (data, estado) => {
    let pertenece = perteneceDist(dataGridTemp, data);
    if (estado && pertenece) {
      let temp = dataGridUpdate;
      temp.push({
        id: data.id,
        estado: estado,
        pais_causa: paises[data.pais],
        idcausa_local_normativo: data.IdLocal,
        nombre_causa_local_normativo: data.NombreNormativo,
      });
      setDataGridUpdate(temp);
    } else if (pertenece) {
      let temp = dataGridDelete;
      temp.push({
        id: data.id,
        estado: estado,
        pais_causa: paises[data.pais],
        idcausa_local_normativo: data.IdLocal,
        nombre_causa_local_normativo: data.NombreNormativo,
      });
      setDataGridDelete(temp);
    }
  };

  const sendData = (e) => {
    e.preventDefault();
    let tempDataGridNew = [];
    let pertenece;
    dataGrid.map((data) => {
      pertenece = perteneceDist(dataGridTemp, data);
      if (!pertenece) {
        tempDataGridNew.push(data);
      }
    });
    const temp = datosNivel();

    function limpiar(_callback) {
      _callback();
      setTimeout(() => {
        setEstadoPost({ id: 0, data: null });
      }, 2000);
    }
    function redirigir(_callback) {
      _callback();
      setTimeout(() => {
        history.push("/EditarCausa");
      }, 2500);
    }

    const area = (nvArea) => {
      if (temp.arbol !== null && temp.arbol[nvArea - 1] !== undefined) {
        return temp.arbol[nvArea - 1].id;
      } else if (nvArea === temp.nivel) {
        return datCausa.idcausa;
      } else {
        return null;
      }
    };
    const data = {
      nombre: document.getElementById("NombreCausa").value,
      descripcion_causa: document.getElementById("Descripcion").value,
      nivel: temp.nivel,
      causa_n1: area(1),
      causa_n2: area(2) > 0 ? 0 : area(2),
      estado: idState,
      padre:
        temp.arbol !== null
          ? temp.arbol[temp.nivel - 2]
            ? temp.arbol[temp.nivel - 2].id
            : temp.arbol[temp.arbol.length - 1].padre
          : 0,
      clasificacion: document.getElementById("clasificacionCausa").value,
    };
    function sendData2(id_causa) {
      tempDataGridNew.map((data) => {
        const data2 = {
          id_causa: id_causa,
          pais_causa: paises[data.pais],
          supervisor: data.supervisor,
          idcausa_local_normativo: data.IdLocal,
          nombre_causa_local_normativo: data.NombreNormativo,
          estado: true,
        };
        fetch(process.env.REACT_APP_API_URL + "/maestros_ro/causa_pais/", {
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
          .catch(function (error) {
            console.error(error);
          });
      });
      dataGridDelete.map((data) => {
        const data2 = {
          pais_causa: paises[data.pais],
          supervisor: data.supervisor,
          idcausa_local_normativo: data.IdLocal,
          nombre_causa_local_normativo: data.NombreNormativo,
          estado: data.estado,
        };
        fetch(process.env.REACT_APP_API_URL + "/maestros_ro/causa_pais/" + data.id + "/", {
          method: "PUT",
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
          .catch(function (error) {
            console.error(error);
          });
      });
      dataGridUpdate.map((data) => {
        const data2 = {
          pais_causa: paises[data.pais],
          supervisor: data.supervisor,
          idcausa_local_normativo: data.IdLocal,
          nombre_causa_local_normativo: data.NombreNormativo,
          estado: data.estado,
        };
        fetch(process.env.REACT_APP_API_URL + "/maestros_ro/causa_pais/" + data.id + "/", {
          method: "PUT",
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
          .catch(function (error) {
            console.error(error);
          });
      });
    }
    fetch(process.env.REACT_APP_API_URL + "/maestros_ro/causa/" + datCausa.idcausa + "/", {
      method: "PUT",
      body: JSON.stringify(data),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
        Authorization: "Bearer " + serviceAAD.getToken(),
      },
    })
      .then((data) =>
        data.json().then((response) => {
          if (data.status >= 200 && data.status < 300) {
            setEstadoPost({ id: 2, data: data });
            sendData2(response.idcausa);
            localStorage.setItem("idCausa", response.idcausa);
            limpiar(() => {});
            redirigir(() => {});
          } else if (data.status >= 500) {
            setEstadoPost({ id: 5, data: response });
            limpiar(() => {});
          } else if (data.status >= 400 && data.status < 500) {
            setEstadoPost({ id: 4, data: response });
            limpiar(() => {});
          }
        })
      )
      .catch(function (error) {
        console.error(error);
      });
  };

  const onSubmit = (data) => {
    console.log("datos recopilados", data);
  };

  const onError = (data) => {
    console.log("error ", data);
  };

  const FiltrarCausa = (e) => {
    setCausaN1(e);
    setCausaN2(null);

    let filteredList = listaCausasN2.filter((item) => item.value === e.value);

    setListaCausasN2Filtered(filteredList);
  };

  const FiltrarAristas = (aristasSelected) => {
    setAristas(aristasSelected);

    if (aristasSelected.some((obj) => obj.label === "RO")) {
      setIsSelectedRO(true);
    } else {
      setIsSelectedRO(false);
    }
  };

  const col1 = 2;
  const col2 = 10;
  const col3 = 10;

  return (
    <>
      <AlertDismissibleExample alerta={estadoPost} />

      <FormProvider {...methods}>
        <Container>
          <Row className="mb-3">
            <Col sm={4} xs={12}>
              <h1 className="titulo">Editar causa</h1>
            </Col>

            {props.permisos.inactivar ? (
              <Col sm={2} xs={12}>
                <FormControlLabel
                  id="switch"
                  className="texto"
                  control={<Switch checked={idState} />}
                  label={state}
                  onChange={handleChangeState}
                  name="Estado"
                />
              </Col>
            ) : null}

            <Col sm={2} xs={12}>
              <input
                type="text"
                disabled
                className="form-control text-center texto"
                placeholder="ID Automático"
                defaultValue={datCausa !== null ? datCausa.idcausa : null}
                id="IDcategoriaRO"
              ></input>
            </Col>

            <Col sm={2} xs={12}>
              <Link to="Causas">
                <button type="button" className="btn botonNegativo">
                  Cancelar
                </button>
              </Link>
            </Col>

            <Col sm={2} xs={12}>
              {props.permisos.editar ? (
                <button
                  className="btn botonPositivo"
                  id="send"
                  onClick={handleSubmit(onSubmit, onError)}
                >
                  Guardar
                </button>
              ) : null}
            </Col>
          </Row>

          <hr />
          <br />

          <Row className="mb-3">
            <Col sm={col1} xs={12}>
              <label className="form-label label">Nombre Causa*</label>
            </Col>
            <Col sm={col2} xs={12}>
              <input
                {...register("nombre")}
                type="text"
                className="form-control text-left texto"
                placeholder="Nombre de la Causa"
                defaultValue={datCausa !== null ? datCausa.nombre : null}
                required
                id="NombreCausa"
              ></input>
              <Form.Control.Feedback type="invalid">
                Por favor introduzca un nombre.
              </Form.Control.Feedback>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col sm={col1} xs={12}>
              <label className="form-label label">Descripción*</label>
            </Col>
            <Col sm={col3} xs={12}>
              <textarea
                {...register("descripcion")}
                className="form-control text-center"
                placeholder="Descripción de la causa"
                defaultValue={
                  datCausa !== null ? datCausa.descripcion_causa : null
                }
                rows="3"
                id="Descripcion"
              ></textarea>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col sm={col1} xs={12}>
              <label className="forn-label label">Clasificación*</label>
            </Col>
            <Col sm={col2} xs={10}>
              <select
                {...register("clasificación")}
                className="form-control texto"
                id="clasificacionCausa"
              >
                <option
                  value={
                    datCausa !== null && datCausa.clasificacion !== null
                      ? datCausa.clasificacion
                      : ""
                  }
                >
                  {datCausa !== null && datCausa.clasificacion !== null
                    ? datCausa.clasificacion
                    : "Seleccione clasificación"}
                </option>
                {clasificacion !== null
                  ? clasificacion.map((clasificacion) => {
                      return datCausa !== null &&
                        datCausa.clasificacion !== null &&
                        datCausa.clasificacion !== clasificacion.valor ? (
                        <option className="texto" value={clasificacion.valor}>
                          {clasificacion.valor}
                        </option>
                      ) : null;
                    })
                  : null}
              </select>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col sm={col1} xs={12}>
              <label className="form-label label">Aristas de la Causa*</label>
            </Col>
            <Col sm={col2} xs={10}>
              <Controller
                control={control}
                name="aristas"
                rules={{ required: "Te falto completar este campo" }}
                render={({ field }) => (
                  <Select
                    isMulti
                    components={animatedComponents}
                    options={listaAristas}
                    value={aristas}
                    onChange={(e) => {
                      var aristas = [];

                      e.map((a) => aristas.push(a));

                      FiltrarAristas(aristas);

                      field.onChange(aristas);
                    }}
                  />
                )}
              />
            </Col>
          </Row>

          <br />

          <Row className="mb-3">
            <Col sm={12} xs={12}>
              <label className="form-label label">
                Homologación de causas por países*
              </label>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col sm={2} xs={2}></Col>
            <Col sm={10} xs={12}>
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
                    zIndex: 0,
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
                        actualizarEstadoHom(newData, true);
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
                        actualizarEstadoHom(oldData, false);
                        resolve();
                      }, 1000);
                    }),
                }}
              />
            </Col>
          </Row>

          {isSelectedRO ? (
            <>
              <Row className="mb-3 mt-3">
                <Col sm={12} xs={12}>
                  <h1 className="titulo">Detalle RO</h1>
                </Col>
              </Row>

              <Row className="mb-3">
                <Col sm={col1} xs={12}>
                  <label className="form-label label">Causa de nivel 1*</label>
                </Col>
                <Col sm={col2} xs={12}>
                  <Select
                    components={animatedComponents}
                    placeholder="Seleccione la causa de nivel 1"
                    options={listaCausasN1}
                    value={causaN1}
                    onChange={(e) => {
                      FiltrarCausa(e);
                    }}
                  />
                </Col>
              </Row>

              <Row className="mb-3">
                <Col sm={col1} xs={12}>
                  <label className="form-label label">Causa de nivel 2*</label>
                </Col>
                <Col sm={col2} xs={12}>
                  <Select
                    components={animatedComponents}
                    placeholder="Seleccione la causa de nivel 2"
                    options={listaCausasN2Filtered}
                    value={causaN2}
                    onChange={setCausaN2}
                  />
                </Col>
              </Row>
            </>
          ) : (
            <></>
          )}
        </Container>

        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
      </FormProvider>
    </>
  );
}
