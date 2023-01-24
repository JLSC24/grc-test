import React, { useState, useEffect } from "react";
import { Row, Col, Form, Alert } from "react-bootstrap";
import Switch from "@material-ui/core/Switch";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import { Link, useHistory } from "react-router-dom";
import { Treebeard } from "react-treebeard";
import Select from "react-select";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { adalApiFetch } from "../auth/adalConfig";
import AADService from "../auth/authFunctions";

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

export default function EditarCuentaContable(props) {
  const serviceAAD = new AADService();
  const [state, setState] = useState("Activo");
  const [idState, setIdState] = useState(true);
  const [datEntorno, setDatEntorno] = useState([]);
  const [datEVC, setDatEVC] = useState([]);
  const [datEVCSelect, setDatEVCSelect] = useState([]);
  const [datArbol, setDatArbol] = useState([]);
  const [cursor, setCursor] = useState(false);
  const [datUnidadRO, setDatUnidadRO] = useState(null);
  const [datAnalistas, setDatAnalistas] = useState([]);
  const [analistaRO, setAnalistaRO] = useState(null);
  const [datResponsables, setDatResponsables] = useState(null);
  const [datSelected, setDatSelected] = useState(null);
  const [datCompañia, setDatCompañia] = useState([]);
  const [datCuentaContableComp, setDatCuentaContableComp] = useState(null);
  const [datAreaO, setDatAreaO] = useState(null);
  const [datAreaOT, setDatAreaOT] = useState(null);
  const [datCuentaContable, setDatCuentaContable] = useState(null);
  const [datExclusionesContables, setDatExclusionesContables] = useState([]);
  const [selectedExclusionesContables, setSelectedExclusionesContables] =
    useState(null);
  const [selectedValueResponsable, setSelectedValueResponsable] =
    useState(null);
  const [estadoPost, setEstadoPost] = useState({
    alerta: { id: 0, data: null },
  });
  let history = useHistory();

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
            id: dat.idcuenta_contable,
            active:
              selectedData.padres[0] === dat.idcuenta_contable ? false : false,
            toggled:
              selectedData.padres[0] === dat.idcuenta_contable ? true : false,
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
              id: dat.idcuenta_contable,
              active:
                selectedData.padres[0] === dat.idcuenta_contable
                  ? false
                  : false,
              toggled:
                selectedData.padres[0] === dat.idcuenta_contable ? true : false,
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
    let selectedData;
    let datosArea;
    let tempEvc;
    const datosArbol = async () => {
      await datosCuentaContable();
      const result = await fetch(
        process.env.REACT_APP_API_URL + "/maestros_ro/ArbolCuentaC/",
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            Authorization: "Bearer " + serviceAAD.getToken(),
          },
        }
      );
      let data = await result.json();
      setDatCuentaContableComp(data);
      crearData(data, selectedData);
    };
    const datosCuentaContable = async () => {
      await datosAreasO();
      await GetEntornos();
      await GetEVC();
      const result = await fetch(
        process.env.REACT_APP_API_URL + "/maestros_ro/cuenta_contable/" +
          localStorage.getItem("idCuentaContable") +
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
        padres: [data.cuenta_n1],
        nivel: data.nivel,
        id: data.idcuenta_contable,
      };
      setDatSelected({
        padres: [data.cuenta_n1],
        nivel: data.nivel,
      });
      if (data && data.responsable_negocio !== null) {
        setSelectedValueResponsable({
          value: data.responsable_negocio.idposicion,
          label: data.responsable_negocio.idusuario.nombre,
        });
      }
      cambiarComp(data.idcompania.idcompania, null, datosArea);
      setDatCuentaContable(data);
      if (data.entorno) {
        CambiarEVC(data.entorno, tempEvc);
      }
      if (data.exclusiones_contables != null) {
        let temp = data.exclusiones_contables.split(",");
        let temp2 = [];
        temp.map((dat) => {
          temp2.push({
            value: dat,
            label: dat,
          });
        });
        setSelectedExclusionesContables(temp2);
      }
      console.log(data && data.analista_ro ? true : null);
      if (data && data.analista_ro) {
        console.log("cargando analista");
        setAnalistaRO({ label: data.idusuario.nombre, value: data.idposicion });
      }
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
      let data3;
      try {
        let data2 = await result2.json();
        data3 = data.concat(data2);
      } catch (error) {
        data3 = data;
      }
      data3 = data3.map(({ idposicion, nombre }) => ({
        label: nombre,
        value: idposicion,
      }));
      setDatAnalistas(
        data3.sort(function (a, b) {
          if (a.label > b.label) {
            return 1;
          }
          if (a.label < b.label) {
            return -1;
          }
          // a must be equal to b
          return 0;
        })
      );
      console.log(data3);
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
    const datosExclusionesContables = async () => {
      const result = await fetch(
        process.env.REACT_APP_API_URL + "/generales/Cuentas_Contables/Exclusiones_contables/",
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
      data.map((dato) => {
        temp.push({ value: dato.valor, label: dato.valor });
        return null;
      });
      setDatExclusionesContables(temp);
    };

    datosExclusionesContables();
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

  const cambiarComp = async (dat, dataArbol, dataArea) => {
    let comp;
    let datosArbol;
    if (dat === undefined) {
      comp = document.getElementById("Compania").value;
      datosArbol = datCuentaContableComp;
    } else {
      comp = dat;
      datosArbol = dataArbol;
    }

    let temp = [];
    let tempC = [];
    if (datosArbol !== null) {
      datosArbol.map((data) => {
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
    crearData(temp, datSelected);
  };

  const handleChange = (e) => {
    setSelectedValueResponsable({ value: e.value, label: e.label });
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
  const handleExclusionesContables = async (e) => {
    setSelectedExclusionesContables(e);
  };

  const datosNivel = () => {
    let temp = [cursor];
    let condition = false;
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
        condition = true;
      }
    }
    llenarVector(temp[0].padre);
    if (condition) {
      return {
        nivel: 1,
        arbol: null,
      };
    } else {
      return {
        nivel: temp.length + 1,
        arbol: temp,
      };
    }
  };

  const sendData = (e) => {
    e.preventDefault();
    const temp = datosNivel();
    const tempExclusionesContables = [];
    const tempExCo = document.getElementsByName("ExclusionesContables");
    for (let i = 0; i < datExclusionesContables.length; i++) {
      if (tempExCo[i]) {
        tempExclusionesContables.push(tempExCo[i].value);
      }
    }

    function limpiar(_callback) {
      _callback();
      setTimeout(() => {
        setEstadoPost({ id: 0, data: null });
      }, 3000);
    }

    const area = (nvArea) => {
      if (temp.arbol !== null && temp.arbol[nvArea - 1] !== undefined) {
        return temp.arbol[nvArea - 1].id;
      } else if (nvArea === temp.nivel) {
        return 0;
      } else {
        return null;
      }
    };
    let entornoTemp = document.getElementById("entorno").value;
    let evcTemp = document.getElementById("evc").value;
    const data = {
      nombre: document.getElementById("NombreCuentaContable").value,
      descripcion: document.getElementById("Descripcion").value,
      idcompania: parseInt(document.getElementById("Compania").value),
      nivel: temp.nivel,
      cuenta_n1: area(1),
      cuenta_n2: area(2),
      responsable_negocio: selectedValueResponsable
        ? selectedValueResponsable.value.toString()
        : null,
      area_organizacional: parseInt(document.getElementById("AreaO").value),
      estado: idState,
      unidad_ro: parseInt(document.getElementById("UnidadRO").value),
      analista_ro: analistaRO? analistaRO.value:null,
      padre: temp.arbol !== null ? temp.arbol[temp.nivel - 2].id : 0,
      numero_cuenta: document.getElementById("NumeroCuentaContable").value,
      entorno: entornoTemp ? entornoTemp : null,
      evc: evcTemp ? evcTemp : null,
      exclusiones_contables: tempExclusionesContables.toString(),
    };
    fetch(
      process.env.REACT_APP_API_URL + "/maestros_ro/cuenta_contable/" +
        datCuentaContable.idcuenta_contable +
        "/",
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
            localStorage.setItem(
              "idCuentaContable",
              response.idcuenta_contable
            );
            limpiar(() => {});
            window.location.reload();
            history.push("/EditarCuentaContable");
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
  };

  return (
    <>
      <AlertDismissibleExample alerta={estadoPost} />
      <Row className="mb-3">
        <Col md={12}>
          <h1 className="titulo">Edición de la Cuenta Contable</h1>
        </Col>
      </Row>
      <Form id="formData" onSubmit={(e) => sendData(e)}>
        <Row className="mb-3">
          <Col sm={4} xs={12}>
            <label className="label forn-label">Id Cuenta Contable</label>
          </Col>
          <Col sm={8} xs={12}>
            <input
              type="text"
              disabled
              className="form-control text-center texto"
              placeholder="ID Automático"
              defaultValue={
                datCuentaContable !== null
                  ? datCuentaContable.idcuenta_contable
                  : null
              }
              id="IDCuentaContable"
            ></input>
          </Col>
        </Row>
        <Row className="mb-3">
          <Col sm={4} xs={12}>
            <label className="form-label label">Nombre Cuenta Contable*</label>
          </Col>
          <Col sm={8} xs={12}>
            <input
              type="text"
              className="form-control text-center texto"
              placeholder="Nombre de la cuenta contable"
              defaultValue={
                datCuentaContable !== null ? datCuentaContable.nombre : null
              }
              required
              id="NombreCuentaContable"
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
              placeholder="Descripción de la cuenta contable"
              defaultValue={
                datCuentaContable !== null
                  ? datCuentaContable.descripcion
                  : null
              }
              rows="3"
              id="Descripcion"
            ></textarea>
          </Col>
        </Row>
        <Row className="mb-3">
          <Col sm={4} xs={12}>
            <label className="form-label label">
              Número de Cuenta Contable*
            </label>
          </Col>
          <Col sm={8} xs={12}>
            <input
              type="text"
              className="form-control text-center texto"
              placeholder="Número de la cuenta contable"
              defaultValue={
                datCuentaContable !== null
                  ? datCuentaContable.numero_cuenta
                  : null
              }
              required
              id="NumeroCuentaContable"
            ></input>
            <Form.Control.Feedback type="invalid">
              Por favor introduzca un nombre.
            </Form.Control.Feedback>
          </Col>
        </Row>
        <Row className="mb-3">
          <Col sm={4} xs={12}>
            <label className="forn-label label">Compañia*</label>
          </Col>
          <Col sm={8} xs={10}>
            <select
              className="form-control texto"
              onChange={() => cambiarComp()}
              required
              id="Compania"
            >
              <option
                value={
                  datCuentaContable !== null
                    ? datCuentaContable.idcompania.idcompania
                    : null
                }
              >
                {datCuentaContable !== null &&
                datCuentaContable.idcompania.compania !== null
                  ? datCuentaContable.idcompania.compania
                  : "Seleccione compañia"}
              </option>
              {datCompañia !== null
                ? datCompañia.map((compañia) => {
                    return datCuentaContable !== null &&
                      datCuentaContable.idcompania.compania !==
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
                  datCuentaContable && datCuentaContable.entorno
                    ? datCuentaContable.entorno
                    : null
                }
              >
                {datCuentaContable && datCuentaContable.entorno
                  ? datCuentaContable.entorno
                  : "Seleccione Entorno"}
              </option>
              {datEntorno
                ? datEntorno.map((entorno) => {
                    return datCuentaContable &&
                      datCuentaContable.entorno &&
                      datCuentaContable.entorno !== entorno.valor ? (
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
                  datCuentaContable && datCuentaContable.evc
                    ? datCuentaContable.evc
                    : null
                }
              >
                {datCuentaContable && datCuentaContable.evc
                  ? datCuentaContable.evc
                  : "Seleccione EVC"}
              </option>
              {datEVCSelect
                ? datEVCSelect.map((evc) => {
                    return datCuentaContable &&
                      datCuentaContable.evc &&
                      datCuentaContable.evc !== evc.valor ? (
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
                  datCuentaContable !== null &&
                  datCuentaContable.area_organizacional !== null
                    ? datCuentaContable.area_organizacional
                        .idarea_organizacional
                    : null
                }
              >
                {datCuentaContable !== null &&
                datCuentaContable.area_organizacional !== null
                  ? datCuentaContable.area_organizacional.nombre
                  : "Seleccione área organizacional"}
              </option>
              {datAreaOT !== null
                ? datAreaOT.map((areaO) => {
                    return datCuentaContable !== null &&
                      datCuentaContable.area_organizacional !== null &&
                      datCuentaContable.area_organizacional.nombre !==
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
          <Col sm={4} xs={12}>
            <label className="forn-label label">Unidad de RO</label>
          </Col>
          <Col sm={8} xs={10}>
            <select className="form-control texto" id="UnidadRO">
              <option
                value={
                  datCuentaContable && datCuentaContable.unidad_ro
                    ? datCuentaContable.unidad_ro.idunidad_riesgo
                    : null
                }
              >
                {datCuentaContable && datCuentaContable.unidad_ro
                  ? datCuentaContable.unidad_ro.nombre
                  : "Seleccione unidad de RO"}
              </option>
              {datUnidadRO && datCuentaContable && datCuentaContable.unidad_ro
                ? datUnidadRO.map((unidadRO) => {
                    return datCuentaContable.unidad_ro.nombre !==
                      unidadRO.nombre ? (
                      <option
                        className="texto"
                        value={unidadRO.idunidad_riesgo}
                      >
                        {unidadRO.nombre}
                      </option>
                    ) : null;
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
            <Select
              options={datAnalistas}
              value={analistaRO}
              placeholder={"Seleccione un analista"}
              onChange={(e) => setAnalistaRO(e)}
            ></Select>
          </Col>
        </Row>
        <Row className="mb-3">
          <Col sm={4} xs={12}>
            <label className="forn-label label">Exclusiones contables</label>
          </Col>
          <Col sm={8} xs={10}>
            <Select
              isMulti
              className="basic-multi-select"
              classNamePrefix="select"
              value={selectedExclusionesContables}
              onChange={handleExclusionesContables}
              options={datExclusionesContables}
              name="ExclusionesContables"
              required
            />
          </Col>
        </Row>

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
            <Link to="CuentasContables">
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
