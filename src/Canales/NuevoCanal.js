import React, { useState, useEffect } from "react";
import { Row, Col, Form, Alert } from "react-bootstrap";
import Switch from "@material-ui/core/Switch";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import { Link, useHistory } from "react-router-dom";
import { Treebeard } from "react-treebeard";
import Select from "react-select";
import Loader from "react-loader-spinner";
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

export default function NuevoCanal(props) {
  const serviceAAD = new AADService();
  const [state, setState] = useState("Activo");
  const [idState, setIdState] = useState(true);
  const [datEntorno, setDatEntorno] = useState([]);
  const [datEVC, setDatEVC] = useState([]);
  const [datEVCSelect, setDatEVCSelect] = useState([]);
  const [datArbol, setDatArbol] = useState([]);
  const [datCanComp, setCanProdComp] = useState(null);
  const [cursor, setCursor] = useState(false);
  const [datUnidadRO, setDatUnidadRO] = useState(null);
  const [datAnalistas, setDatAnalistas] = useState(null);
  const [datResponsables, setDatResponsables] = useState(null);
  const [datCompañia, setDatCompañia] = useState([]);
  const [datAreaO, setDatAreaO] = useState(null);
  const [datAreaOT, setDatAreaOT] = useState(null);
  const [datHomologacion, setDatHomologacion] = useState(null);
  const [startDate, setStartDate] = useState(new Date());
  const [selectedValueResponsable, setSelectedValueResponsable] =
    useState(null);
  const [estadoPost, setEstadoPost] = useState({
    alerta: { id: 0, data: null },
  });
  const [habilitarBoton, setHabilitarBoton] = React.useState(true);
  let history = useHistory();

  const crearData = (data) => {
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
            id: dat.idarea_organizacional,
            toggled: false,
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
              id: dat.idarea_organizacional,
              toggled: false,
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
    const datosArbol = async () => {
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
      setCanProdComp(data);
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
        process.env.REACT_APP_API_URL + "/generales/Homologacion/Canal/",
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
      setDatEVC(data);
    };
    GetEntornos();
    GetEVC();
    datosAreasO();
    listHomologacion();
    datosCompañia();
    datosArbol();
    unidadesRO();
    analistasRO();
    ResponsablesNeg();
    setStartDate(null);
  }, []);

  const CambiarEVC = async () => {
    let entorno = document
      .getElementById("entorno")
      .value.replace(/ /g, "_")
      .split(",")
      .join("");
    let temp = [];
    if (datEVC) {
      datEVC.map((data) => {
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

  const cambiarComp = async () => {
    let comp = document.getElementById("Compania").value;
    let temp = [];
    let tempC = [];
    if (datCanComp !== null) {
      datCanComp.map((data) => {
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
    crearData(temp);
  };

  const handleChange = (e) => {
    setSelectedValueResponsable(e.value);
  };

  const sendData = (e) => {
    e.preventDefault();
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

    const temp = datosNivel();

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
      nombre: document.getElementById("NombreCanal").value,
      descripcion_canal: document.getElementById("Descripcion").value,
      idcompania: parseInt(document.getElementById("Compania").value),
      nivel: temp.nivel,
      canal_n1: area(1),
      canal_n2: area(2),
      //responsable_negocio: 99999999,
      responsable_negocio: selectedValueResponsable,
      area_organizacional: parseInt(document.getElementById("AreaO").value),
      fecha_lanzamiento:
        startDate !== null ? startDate.toISOString().split("T")[0] : null,
      estado_canal: idState,
      unidad_ro: parseInt(document.getElementById("UnidadRO").value),
      //analista_ro: 99999999,
      analista_ro: parseInt(document.getElementById("AnalistaRO").value),
      padre: temp.arbol !== null ? temp.arbol[temp.nivel - 2].id : 0,
      homologacion_canal: document.getElementById("homologacionOC").value,
      entorno: entornoTemp ? entornoTemp : null,
      evc: evcTemp ? evcTemp : null,
    };
    fetch(process.env.REACT_APP_API_URL + "/maestros_ro/canal/", {
      method: "POST",
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
            limpiar();
            history.push("/EditarCanal");
          } else if (data.status >= 500) {
            setEstadoPost({ id: 5, data: response });
            limpiar();
          } else if (data.status >= 400 && data.status < 500) {
            setEstadoPost({ id: 4, data: response });
            limpiar();
          }
        })
      )
      .catch(function (error) {
        console.error(error);
        setHabilitarBoton(false);
      });
  };
  return (
    <>
      <AlertDismissibleExample alerta={estadoPost} />
      <Row className="mb-3">
        <Col md={12}>
          <h1 className="titulo">Creación de un nuevo Canal</h1>
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
              placeholder="Nombre del Canal"
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
              placeholder="Descripción del canal"
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
              <option value="">Seleccione compañia</option>
              {datCompañia !== null
                ? datCompañia.map((compañia) => {
                    return (
                      <option className="texto" value={compañia.idcompania}>
                        {compañia.compania}
                      </option>
                    );
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
              onChange={CambiarEVC}
            >
              <option value="">Seleccione entorno</option>
              {datEntorno !== null
                ? datEntorno.map((entorno) => {
                    return (
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
              <option value="">Seleccione EVC</option>
              {datEVCSelect
                ? datEVCSelect.map((evc) => {
                    return (
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
            {/* TODO: Insertar treeView */}
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
            <Select
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
              <option value="">Seleccione área organizacional</option>
              {datAreaOT !== null
                ? datAreaOT.map((areaO) => {
                    return (
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
              <option value="">Seleccione unidad de RO</option>
              {datUnidadRO !== null
                ? datUnidadRO.map((unidadRO) => {
                    return (
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
              <option value="">Seleccione analista RO</option>
              {datAnalistas !== null
                ? datAnalistas.map((analista) => {
                    return (
                      <option className="texto" value={analista.idposicion}>
                        {analista.nombre}
                      </option>
                    );
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
              <option value="">Seleccione Tipo Homologación Canal</option>
              {datHomologacion
                ? datHomologacion.map((dat) => {
                    return (
                      <option
                        className="texto"
                        key={dat.idm_parametrosgenerales}
                        value={dat.valor}
                      >
                        {dat.valor}
                      </option>
                    );
                  })
                : null}
              {/* <option className="texto" value="1">
                Lista
              </option>
              <option className="texto" value="2">
                Selección única
              </option> */}
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
          {habilitarBoton ? (
            <>
              <Col sm={3} xs={3}>
                {props.permisos.crear ? (
                  <button type="submit" className="btn botonPositivo" id="send">
                    Guardar
                  </button>
                ) : null}
              </Col>
            </>
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
