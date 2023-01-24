import React, { useState, useEffect } from "react";
import { Row, Col, Form, Alert } from "react-bootstrap";
import Switch from "@material-ui/core/Switch";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import { Link, useHistory } from "react-router-dom";
import { Treebeard } from "react-treebeard";
import Select from "react-select";
import context from "react-bootstrap/esm/AccordionContext";

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
export default function EditarArea(props) {
  const serviceAAD = new AADService();
  const [state, setState] = useState("Activo");
  const [idState, setIdState] = useState(true);
  let history = useHistory();
  const [data, setData] = useState([]);
  const [datEntorno, setDatEntorno] = useState([]);
  const [datEVC, setDatEVC] = useState([]);
  const [datEVCSelect, setDatEVCSelect] = useState([]);
  const [cursor, setCursor] = useState(false);
  const [dataArea, setDataArea] = useState(null);
  const [datCompañia, setDatCompañia] = useState([]);
  const [datAreasComp, setDatAreasComp] = useState(null);
  const [selectedData, setSelectedData] = useState(null);
  /*   const [datUnidadRO, setDatUnidadRO] = useState(null);
  const [datAnalistas, setDatAnalistas] = useState(null);*/
  const [datResponsables, setDatResponsables] = useState(null);
  const [estadoPost, setEstadoPost] = useState({
    alerta: { id: 0, data: null },
  });

  const [selectedValueResponsable, setSelectedValueResponsable] =
    useState(null);

    const crearData = (data, selectedData) => {
      let padres = data.filter((o) => o.padre === 0);
      function llenarRecursivo(dataRecibir) {
        let tempHijos = [];
        data.map((proc) => {
          if (dataRecibir.idarea_organizacional === proc.padre) {
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
            if (idPadre === proc.idarea_organizacional) {
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
      setData(dataTree);
    };

  useEffect(() => {
    let selectedDataTemp;
    let tempComp;
    let tempEvc;
    const fetchdata = async () => {
      await GetEntornos();
      await GetEVC();
      const result = await fetch(
        process.env.REACT_APP_API_URL + "/maestros_ro/area_o/" +
          localStorage.getItem("idArea") +
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
      if (data && data.responsable) {
        setSelectedValueResponsable({
          value: data.responsable.idusuario,
          label: data.responsable.nombre,
        });
      }
      if (data && !data.estado) {
        setIdState(data.estado);
        setState("Inactivo");
      }
      if (data && data.idcompania && data.idcompania.idcompania) {
        tempComp = data.idcompania.idcompania;
      }
      selectedDataTemp = {
        padres: [
          data.area_n1,
          data.area_n2,
          data.area_n3,
          data.area_n4,
          data.area_n5,
          data.area_n6,
          data.area_n7,
        ],
        nivel: data.nivel,
        id: data.idarea_organizacional,
      };
      setSelectedData({
        padres: [
          data.area_n1,
          data.area_n7,
          data.area_n2,
          data.area_n3,
          data.area_n4,
          data.area_n5,
          data.area_n6,
        ],
        nivel: data.nivel,
      });
      setDataArea(data);
      if (data.entorno) {
        CambiarEVC(data.entorno, tempEvc);
      }
    };
    const datosArbol = async (_callback) => {
      await fetchdata();
      const result = await fetch(
        process.env.REACT_APP_API_URL + "/maestros_ro/ArbolAreasO/",
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            Authorization: "Bearer " + serviceAAD.getToken(),
          },
        }
      );
      let data = await result.json();
      setDatAreasComp(data);
      crearData(data, selectedDataTemp);
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
    /* 
    const unidadesRO = async () => {
      const result = await fetch(
        process.env.REACT_APP_API_URL + "/maestros_ro/unidad_riesgo/",
        {
          method: "GET",
          headers: {
            Accept: "application/json",
          },
        }
      );
      let data = await result.json();
      setDatUnidadRO(data);
    };
    const analistasRO = async () => {
      const result = await fetch(process.env.REACT_APP_API_URL + "/usuariosrol/4/ro", {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      });
      let data = await result.json();
      setDatAnalistas(data);
    }; */
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
        temp.push({ value: dat.idusuario, label: dat.nombre });
        return null;
      });
      setDatResponsables(temp);
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

    datosCompañia();
    datosArbol();
    /*   unidadesRO();
    analistasRO(); */
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
        temp.unshift(retornarPadre(data.children, idPadre));
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

  const onToggle = (node, toggled) => {
    if (cursor) {
      cursor.active = false;
    }
    node.active = true;
    if (node.children) {
      node.toggled = toggled;
    }
    setCursor(node);
    setData(Object.assign({}, data));
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

  const cambiarComp = (dat, dataArbol) => {
    let comp;
    let datosArbol;
    if (dat === undefined) {
      comp = document.getElementById("Compania").value;
      datosArbol = datAreasComp;
    } else {
      comp = dat;
      datosArbol = dataArbol;
    }

    let temp = [];
    if (datosArbol !== null) {
      datosArbol.map((data) => {
        if (data.idcompania == comp) {
          temp.push(data);
        }
        return null;
      });
    }
    crearData(temp, selectedData);
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

  const sendData = (e) => {
    e.preventDefault();

    const temp = datosNivel();
    console.log(temp)

    function limpiar(_callback) {
      _callback();
      setTimeout(() => {
        setEstadoPost({ id: 0, data: null });
      }, 3000);
    }

    const area = (nvArea) => {
      if (temp.arbol && temp.arbol[nvArea - 1] ) {
        return temp.arbol[nvArea - 1].idarea_organizacional;
      } else if (nvArea === temp.nivel) {
        return dataArea.idarea_organizacional;
      } else {
        return null;
      }
    };
    let entornoTemp = document.getElementById("entorno").value;
    let evcTemp = document.getElementById("evc").value;
    const data = {
      idarea_organizacional: dataArea.idarea_organizacional,
      idestructura: document.getElementById("IDestructura").value,
      nombre: document.getElementById("NombreAreaO").value,
      nivel: temp.nivel,
      area_n1: area(1),
      area_n2: area(2),
      area_n3: area(3),
      area_n4: area(4),
      area_n5: area(5),
      area_n6: area(6),
      area_n7: area(7) > 0 ? 0 : area(7),
      estado: idState,
      responsable: selectedValueResponsable
        ? selectedValueResponsable.value
        : null,
      idcompania: document.getElementById("Compania").value,
      //idresponsable: selectedValueResponsable.value,
      /* id_unidad_riesgo: parseInt(document.getElementById("UnidadRO").value),
      id_analista_riesgo: parseInt(document.getElementById("AnalistaRO").value), */
      padre:
        temp.arbol
          ? temp.arbol[temp.nivel - 2]
            ? temp.arbol[temp.nivel - 2].idarea_organizacional
            : temp.arbol[temp.arbol.length - 1].padre
          : 0,
      entorno: entornoTemp ? entornoTemp : null,
      evc: evcTemp ? evcTemp : null,
    };

    console.log(data)
    fetch(
      process.env.REACT_APP_API_URL + "/maestros_ro/area_o/" +
        data.idarea_organizacional +
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
            localStorage.setItem("idArea", response.idarea_organizacional);
            limpiar(() => {});

            history.push("/EditarAreaOrganizacional");
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
          <h1 className="titulo">Edición del Área Organizacional</h1>
        </Col>
      </Row>
      <Form id="formData" onSubmit={(e) => sendData(e)}>
        <Row className="mb-3">
          <Col sm={4} xs={12}>
            <label className="label forn-label">Id Área Organizacional</label>
          </Col>
          <Col sm={8} xs={12}>
            <input
              type="text"
              disabled
              className="form-control text-center texto"
              placeholder="ID Automático"
              defaultValue={
                dataArea != null ? dataArea.idarea_organizacional : null
              }
              id="IDactivo"
            ></input>
          </Col>
        </Row>
        <Row className="mb-3">
          <Col sm={4} xs={12}>
            <label className="label forn-label">Id Estructura*</label>
          </Col>
          <Col sm={8} xs={12}>
            <input
              /* required */
              type="text"
              className="form-control text-center texto"
              placeholder="ID Estructura (Debe ser único)"
              defaultValue={dataArea != null ? dataArea.idestructura : null}
              id="IDestructura"
            ></input>
          </Col>
        </Row>
        <Row className="mb-3">
          <Col sm={4} xs={12}>
            <label className="form-label label">
              Nombre Área Organizacional*
            </label>
          </Col>
          <Col sm={8} xs={12}>
            <input
              type="text"
              className="form-control text-center texto"
              placeholder="Nombre del Área Organizacional"
              defaultValue={dataArea != null ? dataArea.nombre : null}
              /* required */
              id="NombreAreaO"
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
                  dataArea &&
                  dataArea.idcompania &&
                  dataArea.idcompania.idcompania
                    ? dataArea.idcompania.idcompania
                    : null
                }
              >
                {dataArea && dataArea.idcompania && dataArea.idcompania.compania
                  ? dataArea.idcompania.compania
                  : "Seleccione compañia"}
              </option>
              {datCompañia
                ? datCompañia.map((compañia) => {
                    return dataArea &&
                      dataArea.idcompania &&
                      dataArea.idcompania.compania !== compañia.compania ? (
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
            <label className="form-label label">Selección de área*</label>
          </Col>
          <Col sm={8} xs={12} className="contenedorArbol">
            <Treebeard
              data={data}
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
              onChange={handleChange}
              className="texto"
              options={datResponsables}
            />
          </Col>
        </Row>
        {/* <Row className="mb-3">
          <Col sm={4} xs={12}>
            <label className="forn-label label">Unidad de RO</label>
          </Col>
          <Col sm={8} xs={10}>
            <select className="form-control texto" id="UnidadRO">
              <option
                value={
                  dataArea !== null && dataArea.id_unidad_riesgo
                    ? dataArea.id_unidad_riesgo.idunidad_riesgo
                    : null
                }
              >
                {dataArea !== null && dataArea.id_unidad_riesgo !== null
                  ? dataArea.id_unidad_riesgo.nombre
                  : "Seleccione unidad de RO"}
              </option>
              {datUnidadRO !== null
                ? datUnidadRO.map((unidadRO) => {
                    return dataArea !== null &&
                      dataArea.id_unidad_riesgo !== null &&
                      dataArea.id_unidad_riesgo.nombre !== unidadRO.nombre ? (
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
                  dataArea !== null && dataArea.id_analista_riesgo !== null
                    ? dataArea.id_analista_riesgo.idusuario
                    : ""
                }
              >
                {dataArea !== null && dataArea.id_analista_riesgo !== null
                  ? dataArea.id_analista_riesgo.nombre_usuario
                  : "Seleccione analista RO"}
              </option>
              {datAnalistas !== null
                ? datAnalistas.map((analista) => {
                    return dataArea !== null &&
                      dataArea.id_analista_riesgo !== null &&
                      dataArea.id_analista_riesgo.nombre_usuario !==
                        analista.nombre ? (
                      <option className="texto" value={analista.idusuario}>
                        {analista.nombre}
                      </option>
                    ) : null;
                  })
                : null}
            </select>
          </Col>
        </Row> */}
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
                value={dataArea && dataArea.entorno ? dataArea.entorno : null}
              >
                {dataArea && dataArea.entorno
                  ? dataArea.entorno
                  : "Seleccione Entorno"}
              </option>
              {datEntorno
                ? datEntorno.map((entorno) => {
                    return dataArea &&
                      dataArea.entorno &&
                      dataArea.entorno !== entorno.valor ? (
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
              <option value={dataArea && dataArea.evc ? dataArea.evc : null}>
                {dataArea && dataArea.evc ? dataArea.evc : "Seleccione EVC"}
              </option>
              {datEVCSelect
                ? datEVCSelect.map((evc) => {
                    return dataArea &&
                      dataArea.evc &&
                      dataArea.evc !== evc.valor ? (
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
            <Link to="AreasOrganizacionales">
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
