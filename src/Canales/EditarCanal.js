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

export default function EditarCanal(props) {
  const serviceAAD = new AADService();
  const [state, setState] = useState("Activo");
  const [idState, setIdState] = useState(true);
  const [datArbol, setDatArbol] = useState([]);
  const [datEntorno, setDatEntorno] = useState([]);
  const [datEVC, setDatEVC] = useState([]);
  const [datEVCSelect, setDatEVCSelect] = useState([]);
  const [datCanComp, setDatCanComp] = useState(null);
  const [selectedData, setSelectedData] = useState(null);
  const [cursor, setCursor] = useState(false);
  const [datUnidadRO, setDatUnidadRO] = useState(null);
  const [datAnalistas, setDatAnalistas] = useState(null);
  const [datResponsables, setDatResponsables] = useState(null);
  const [datCompañia, setDatCompañia] = useState([]);
  const [datAreaO, setDatAreaO] = useState(null);
  const [datAreaOT, setDatAreaOT] = useState(null);
  const [startDate, setStartDate] = useState(new Date());
  const [datCanal, setDatCanal] = useState(null);
  const [datHomologacion, setDatHomologacion] = useState(null);
  const [selectedValueResponsable, setSelectedValueResponsable] =
    useState(null);
  const [estadoPost, setEstadoPost] = useState({
    alerta: { id: 0, data: null },
  });
  let history = useHistory();

  const crearData = (data, selectedData) => {
    let padres = data.filter((o) => o.padre === 0);
    function llenarRecursivo(dataRecibir) {
      let tempHijos = [];
      data.map((proc) => {
        if (dataRecibir.id === proc.padre) {
          tempHijos.push(proc);
          llenarRecursivo(proc);
        }
      });
      dataRecibir["children"] = tempHijos;
      dataRecibir["name"] = dataRecibir.nombre;
      dataRecibir["active"] = false;
      dataRecibir["toggled"] = false;
    }

    function activarRecursivo(dataRecibir) {
      selectedData.padres.map((idPadre) => {
        dataRecibir.map((proc) => {
          if (idPadre === proc.id) {
            proc.toggled = true;
            if (proc.nivel === selectedData.nivel - 1) {
              proc.active = true;
              setCursor(proc);
            }
            activarRecursivo(proc.children);
          }
        });
      });
    }

    padres.map((obj) => {
      llenarRecursivo(obj);
    });

    activarRecursivo(padres);

    /* padres.map((padre) => {
      selectedData.padres.map((idPadre) => {
        if (idPadre === padre.id) {
          padre.toggled = true;
          padre.children.map((obj) => {
            selectedData.padres.map((idPadre) => {
              if (idPadre === obj.id) {
                obj.toggled = true;
              }
            });
          });
        }
      });
    }); */

    let dataTree = {
      name: "Seleccionar",
      toggled: true,
      id: 0,
      children: padres,
    };
    setDatArbol(dataTree);
  };

  useEffect(() => {
    let selectedDataTemp;
    let idComp;
    let tempEvc;
    const datosArbol = async () => {
      await datosCanal();
      const result = await fetch(
        process.env.REACT_APP_API_URL + "/maestros_ro/ArbolCanal/",
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            Authorization: "Bearer " + serviceAAD.getToken(),
          },
        }
      );
      let data = await result.json();
      setDatCanComp(data);
      cambiarComp(idComp, selectedDataTemp, data);
    };
    const datosCanal = async () => {
      await datosAreasO();
      await GetEntornos();
      await GetEVC();
      const result = await fetch(
        process.env.REACT_APP_API_URL + "/maestros_ro/canal/" +
          localStorage.getItem("idCanal") +
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
      let temp = new Date();
      if (data && !data.estado_canal) {
        setIdState(data.estado_canal);
        setState("Inactivo");
      }
      selectedDataTemp = {
        padres: [data.canal_n1, data.canal_n2],
        nivel: data.nivel,
        id: data.idcanal,
      };
      setSelectedData({
        padres: [data.canal_n1, data.canal_n2],
        nivel: data.nivel,
      });
      temp.setTime(Date.parse(data.fecha_lanzamiento));
      if (data !== null && data.responsable_negocio !== null) {
        setSelectedValueResponsable({
          value: data.responsable_negocio.idposicion,
          label: data.responsable_negocio.idusuario.nombre,
        });
      }
      idComp = data.idcompania.idcompania;
      setStartDate(temp);
      setDatCanal(data);
      if (data.entorno) {
        CambiarEVC(data.entorno, tempEvc);
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
    const listHomologacion = async () => {
      const result = await fetch(
        process.env.REACT_APP_API_URL + "/generales/Homologacion/Canal",
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            Authorization: "Bearer " + serviceAAD.getToken(),
          },
        }
      );
      let data = await result.json();
      setDatHomologacion(data);
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

    listHomologacion();
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

  const cambiarComp = async (company, selectedDat, dataArbol) => {
    let comp;
    let dataSelected = selectedDat ? selectedDat : selectedData;
    let dataArbolCan = dataArbol ? dataArbol : datCanComp;
    if (company) {
      comp = company;
    } else {
      comp = document.getElementById("Compania").value;
    }
    let temp = [];
    let tempC = [];
    if (dataArbolCan !== null) {
      dataArbolCan.map((data) => {
        if (data.idcompania == comp) {
          temp.push(data);
        }
        return null;
      });
    }

    if (datAreaO) {
      datAreaO.map((dat) => {
        if (dat.idcompania == comp) {
          tempC.push(dat);
        }
      });
    }
    await setDatAreaOT(tempC);

    crearData(temp, dataSelected);
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
  const MySelect = (props) => (
    <Select
      {...props}
      className="texto"
      defaultValue={selectedValueResponsable}
      options={props.options}
      placeholder={props.placeholder}
    />
  );

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
    if (cursor) {
      temp = [cursor];
    }
    console.log(cursor);
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
      if (temp && temp[0] && temp[0].padre) {
        temp.unshift(retornarPadre(datArbol.children, idPadre));
        llenarVector(temp[0].padre);
      } else if (temp[0].padre === undefined) {
        condition = 1;
      } else if (!cursor) {
        condition = 2;
      }
    }

    if (
      temp &&
      temp[0] &&
      temp[0].padre !== undefined &&
      temp[0].padre !== null
    ) {
      llenarVector(temp[0].padre);
    } else {
      condition = 1;
    }

    if (condition === 1) {
      return {
        nivel: 1,
        arbol: null,
      };
    } else if (condition === 0) {
      return {
        nivel: temp.length + 1,
        arbol: temp,
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

    function limpiar(_callback) {
      _callback();
      setTimeout(() => {
        setEstadoPost({ id: 0, data: null });
      }, 2500);
    }

    const temp = datosNivel();

    const area = (nvArea) => {
      if (temp.arbol !== null && temp.arbol[nvArea - 1] !== undefined) {
        return temp.arbol[nvArea - 1].id;
      } else if (nvArea === temp.nivel) {
        return datCanal.idcanal;
      } else {
        return null;
      }
    };
    let entornoTemp = document.getElementById("entorno").value;
    let evcTemp = document.getElementById("evc").value;
    const data = {
      nombre: document.getElementById("NombreCanal").value,
      descripcion_canal: document.getElementById("Descripcion").value,
      idcompania: parseInt(document.getElementById("Compania").value),
      nivel: temp.nivel,
      canal_n1: area(1),
      canal_n2: area(2),
      responsable_negocio: selectedValueResponsable
        ? selectedValueResponsable.value
        : null,
      //responsable_negocio: selectedValueResponsable.value,
      area_organizacional:
        document.getElementById("AreaO").value !== ""
          ? parseInt(document.getElementById("AreaO").value)
          : null,
      fecha_lanzamiento:
        startDate !== null ? startDate.toISOString().split("T")[0] : null,
      estado_canal: idState,
      unidad_ro:
        document.getElementById("UnidadRO").value !== ""
          ? parseInt(document.getElementById("UnidadRO").value)
          : null,
      analista_ro:
        document.getElementById("AnalistaRO").value !== ""
          ? parseInt(document.getElementById("AnalistaRO").value)
          : null,
      //analista_ro: parseInt(document.getElementById("AnalistaRO").value),
      padre:
        temp.arbol !== null
          ? temp.arbol[temp.nivel - 2]
            ? temp.arbol[temp.nivel - 2].id
            : temp.arbol[temp.arbol.length - 1].padre
          : 0,
      homologacion_canal: document.getElementById("homologacionOC").value,
      entorno: entornoTemp ? entornoTemp : null,
      evc: evcTemp ? evcTemp : null,
    };

    fetch(process.env.REACT_APP_API_URL + "/maestros_ro/canal/" + datCanal.idcanal + "/", {
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
            localStorage.setItem("idCanal", response.idcanal);
            limpiar(() => {});
            /* setTimeout(() => {
              window.location.reload();
            }, 3000); */
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
          <h1 className="titulo">Edición del Canal</h1>
        </Col>
      </Row>
      <Form id="formData" onSubmit={(e) => sendData(e)}>
        <Row className="mb-3">
          <Col sm={4} xs={12}>
            <label className="label forn-label">Id Canal</label>
          </Col>
          <Col sm={8} xs={12}>
            <input
              type="text"
              disabled
              className="form-control text-center texto"
              placeholder="ID Automático"
              defaultValue={datCanal !== null ? datCanal.idcanal : null}
              id="IDcanal"
            ></input>
          </Col>
        </Row>
        <Row className="mb-3">
          <Col sm={4} xs={12}>
            <label className="form-label label">Nombre Canal*</label>
          </Col>
          <Col sm={8} xs={12}>
            <input
              type="text"
              className="form-control text-center texto"
              placeholder="Nombre del Producto"
              defaultValue={datCanal !== null ? datCanal.nombre : null}
              required
              id="NombreCanal"
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
              placeholder="Descripción del producto"
              defaultValue={
                datCanal !== null ? datCanal.descripcion_canal : null
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
                  datCanal !== null ? datCanal.idcompania.idcompania : null
                }
              >
                {datCanal !== null && datCanal.idcompania.compania !== null
                  ? datCanal.idcompania.compania
                  : "Seleccione compañia"}
              </option>
              {datCompañia !== null
                ? datCompañia.map((compañia) => {
                    return datCanal !== null &&
                      datCanal.idcompania.compania !== compañia.compania ? (
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
                value={datCanal && datCanal.entorno ? datCanal.entorno : null}
              >
                {datCanal && datCanal.entorno
                  ? datCanal.entorno
                  : "Seleccione Entorno"}
              </option>
              {datEntorno
                ? datEntorno.map((entorno) => {
                    return datCanal &&
                      datCanal.entorno &&
                      datCanal.entorno !== entorno.valor ? (
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
              <option value={datCanal && datCanal.evc ? datCanal.evc : null}>
                {datCanal && datCanal.evc ? datCanal.evc : "Seleccione EVC"}
              </option>
              {datEVCSelect
                ? datEVCSelect.map((evc) => {
                    return datCanal &&
                      datCanal.evc &&
                      datCanal.evc !== evc.valor ? (
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
                  datCanal && datCanal.area_organizacional
                    ? datCanal.area_organizacional.idarea_organizacional
                    : ""
                }
              >
                {datCanal && datCanal.area_organizacional
                  ? datCanal.area_organizacional.nombre
                  : "Seleccione área organizacional"}
              </option>
              {datAreaOT
                ? datAreaOT.map((areaO) => {
                    return datCanal &&
                      datCanal.area_organizacional &&
                      datCanal.area_organizacional.nombre !== areaO.nombre ? (
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
                  datCanal && datCanal.unidad_ro
                    ? datCanal.unidad_ro.idunidad_riesgo
                    : ""
                }
              >
                {datCanal && datCanal.unidad_ro
                  ? datCanal.unidad_ro.nombre
                  : "Seleccione unidad de RO"}
              </option>
              {datUnidadRO && datCanal && datCanal.unidad_ro
                ? datUnidadRO.map((unidadRO) => {
                    return datCanal.unidad_ro.nombre !== unidadRO.nombre ? (
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
            <select className="form-control texto" id="AnalistaRO">
              <option
                value={
                  datCanal && datCanal.analista_ro
                    ? datCanal.analista_ro.idposicion
                    : ""
                }
              >
                {datCanal && datCanal.analista_ro
                  ? datCanal.analista_ro.idusuario.nombre
                  : "Seleccione analista RO"}
              </option>
              {datAnalistas
                ? datAnalistas.map((analista) => {
                    return datCanal &&
                      datCanal.analista_ro &&
                      datCanal.analista_ro.idusuario.nombre !==
                        analista.nombre ? (
                      <option className="texto" value={analista.idposicion}>
                        {analista.nombre}
                      </option>
                    ) : null;
                  })
                : null}
            </select>
          </Col>
        </Row>
        {/* TODO: pedir parámetros generales para la lista */}
        <Row className="mb-3">
          <Col sm={4} xs={12}>
            <label className="forn-label label">Homologación Canal*</label>
          </Col>
          <Col sm={8} xs={10}>
            <select className="form-control texto" required id="homologacionOC">
              <option
                value={
                  datCanal && datCanal.homologacion_canal
                    ? datCanal.homologacion_canal
                    : ""
                }
              >
                {datCanal && datCanal.homologacion_canal
                  ? datCanal.homologacion_canal
                  : "Seleccione Tipo Homologación OC"}
              </option>
              {datHomologacion
                ? datHomologacion.map((dat) => {
                    return datCanal &&
                      datCanal.homologacion_canal !== dat.valor ? (
                      <option className="texto" value={dat.valor}>
                        {dat.valor}
                      </option>
                    ) : null;
                  })
                : null}
            </select>
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
            <Link to="Canales">
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
