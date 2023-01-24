import React, { useState, useEffect } from "react";
import { Row, Col, Form, Alert } from "react-bootstrap";
import { Link, useHistory } from "react-router-dom";
import { Treebeard } from "react-treebeard";
import Select from "react-select";

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

export default function NuevoProceso(props) {
  const serviceAAD = new AADService();
  const [dataArbol, setDataArbol] = useState([]);
  const [cursor, setCursor] = useState(false);
  const [datUnidadRO, setDatUnidadRO] = useState(null);
  const [datAnalistas, setDatAnalistas] = useState(null);
  const [datAnalistasT, setDatAnalistasT] = useState(null);
  const [datResponsables, setDatResponsables] = useState(null);
  const [datAreaO, setDatAreaO] = useState(null);
  const [datEntorno, setDatEntorno] = useState([]);
  const [datEVC, setDatEVC] = useState([]);
  const [datEVCSelect, setDatEVCSelect] = useState([]);
  const [selectedData, setSelectedData] = useState(null);
  const [datProcComp, setDatProcComp] = useState(null);
  const [datCompañia, setDatCompañia] = useState([]);
  const [datProceso, setDatProceso] = useState(null);
  const [datAreaOT, setDatAreaOT] = useState(null);
  const [dataTipoProc, setDataTipoProc] = useState(null);
  const [disabledRO, setDisabledRO] = useState(false);
  const [datTercerizacion, setDatTercerizacion] = useState(null);
  const [dataCiclos, setDataCiclos] = useState(null);
  const [Ciclos1, setCiclos1] = useState(null);
  const [fechaInicio, setFechaInicio] = useState(null);
  const [datProcesoHomologo, setDatProcesoHomologo] = useState([]);
  const [dataClasificacion, setDataClasificacion] = useState(null);
  const [dataTercerizacion, setDataTercerizacion] = useState(null);
  const [datEstado, setDatEstado] = useState(null);
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
    setDataArbol(dataTree);
  };

  useEffect(() => {
    let selectedDataTemp;
    let tempEvc;

    const datosProceso = async () => {
      await datosAreasO();
      await GetEntornos();
      await GetEVC();
      const result = await fetch(
        process.env.REACT_APP_API_URL + "/maestros_ro/proceso/" +
          localStorage.getItem("idProceso") +
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
      if (typeof data.idrol != "undefined" && data.idrol != null) {
        if (data.idrol === 1) {
          setDisabledRO(false);
        } else {
          setDisabledRO(true);
        }
      }
      selectedDataTemp = {
        padres: [data.proseso_n1, data.proseso_n2, data.proseso_n3],
        nivel: data.nivel,
        id: data.id,
      };
      setSelectedData({
        padres: [data.proseso_n1, data.proseso_n2, data.proseso_n3],
        nivel: data.nivel,
      });
      if (data !== null && data.responsable_negocio !== null) {
        setSelectedValueResponsable({
          value: data.responsable_negocio.idposicion,
          label: data.responsable_negocio.idusuario.nombre,
        });
      }
      cambiarComp(data.idcompania.idcompania);
      setDatProceso(data);
      setFechaInicio(data.fecha_inicio_proceso);
      if (data.entorno) {
        CambiarEVC(data.entorno, tempEvc);
      }
      setDatTercerizacion(data.nivel_tercerizacion);
    };
    const datosTipoProceso = async () => {
      const result = await fetch(
        process.env.REACT_APP_API_URL + "/generales/procesos/Tipo_Proceso/",
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            Authorization: "Bearer " + serviceAAD.getToken(),
          },
        }
      );
      let data = await result.json();
      setDataTipoProc(data);
    };
    const datosTercerizacion = async () => {
      const result = await fetch(
        process.env.REACT_APP_API_URL + "/generales/procesos/Nivel_Tercerizacion/",
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            Authorization: "Bearer " + serviceAAD.getToken(),
          },
        }
      );
      let data = await result.json();
      setDataTercerizacion(data);
    };
    const datosClasificacion = async () => {
      const result = await fetch(
        process.env.REACT_APP_API_URL + "/generales/procesos/Clasificacion_RO/",
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            Authorization: "Bearer " + serviceAAD.getToken(),
          },
        }
      );
      let data = await result.json();
      setDataClasificacion(data);
    };
    const datosEstado = async () => {
      const result = await fetch(
        process.env.REACT_APP_API_URL + "/generales/procesos/Estado_Proceso/",
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            Authorization: "Bearer " + serviceAAD.getToken(),
          },
        }
      );
      let data = await result.json();
      setDatEstado(data);
    };
    const datosCiclos = async () => {
      const result = await fetch(process.env.REACT_APP_API_URL + "/generales/Ciclos", {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: "Bearer " + serviceAAD.getToken(),
        },
      });
      let data = await result.json();
      setDataCiclos(data);
      const ciclosSet = new Set(data.map(({ parametro }) => parametro));
      console.log({ ciclosSet });
      setCiclos1([...ciclosSet]);
    };
    const datosAreasO = async () => {
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
      let temp = [];
      if (data) {
        data.map((dat) => {
          if (dat.nivel === 1) {
            temp.push(dat);
          }
          return null;
        });
      }
      await setDatAreaO(data);
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
    const datosArbol = async () => {
      await datosProceso();
      const result = await fetch(
        process.env.REACT_APP_API_URL + "/maestros_ro/ArbolProceso/",
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            Authorization: "Bearer " + serviceAAD.getToken(),
          },
        }
      );
      let data = await result.json();
      setDatProcComp(data);
      crearData(data, selectedDataTemp);
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
      let data3 = data?.concat(data2);
      setDatAnalistas(data3?.sort(function (a, b) {
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

      const result2 = await fetch(process.env.REACT_APP_API_URL + "/usuariosrol/0/2/", {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: "Bearer " + serviceAAD.getToken(),
        },
      });

      let data = await result.json();
      let data2 = await result2.json();

      let temp = [];

      data.map((dat) => {
        temp.push({ value: dat.idposicion, label: dat.nombre });
        return null;
      });

      data2.map((dat) => {
        temp.push({ value: dat.idposicion, label: dat.nombre });
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
    const procesoHomologo = async () => {
      const result = await fetch(
        process.env.REACT_APP_API_URL + "/generales/Procesos/Proceso_homologo_Norma_Guatemala",
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            Authorization: "Bearer " + serviceAAD.getToken(),
          },
        }
      );
      let data = await result.json();
      setDatProcesoHomologo(data);
    };

    datosCompañia();
    datosEstado();
    datosTercerizacion();
    datosClasificacion();
    datosTipoProceso();
    datosArbol();
    unidadesRO();
    analistasRO();
    ResponsablesNeg();
    procesoHomologo();
    datosCiclos();
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
        temp.unshift(retornarPadre(dataArbol.children, idPadre));
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
    setDataArbol(Object.assign({}, dataArbol));
  };

  const cambiarComp = async (company) => {
    let comp;
    if (company) {
      comp = company;
    } else {
      comp = document.getElementById("Compania").value;
    }

    let temp = [];
    let tempC = [];
    if (datProcComp !== null) {
      datProcComp.map((data) => {
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
    /* tempC = [];
    if (datAnalistas) {
      datAnalistas.map((dat) => {
        if (dat.idcompania == comp) {
          tempC.push(dat);
        }
      });
    }

    await setDatAnalistasT(tempC); */
    crearData(temp, selectedData);
  };

  const changeNivelTercerizacion = (e) => {
    setDatTercerizacion(e.target.value);
  };

  const sendData = (e) => {
    e.preventDefault();
    const temp = datosNivel();

    function limpiar(_callback) {
      _callback();
      setTimeout(() => {
        setEstadoPost({ id: 0, data: null });
      }, 3000);
    }
    const area = (nvArea) => {
      if (temp.arbol && temp.arbol[nvArea - 1]) {
        return temp.arbol[nvArea - 1].id;
      } else if (nvArea === temp.nivel) {
        return datProceso.id;
      } else {
        return null;
      }
    };

    let entornoTemp = document.getElementById("entorno").value;
    let evcTemp = document.getElementById("evc").value;

    let cicloTemp = document.getElementById("ciclo_nvl2").value;
    const data = {
      idproceso: document.getElementById("IDprocesoInput").value,
      nombre: document.getElementById("NombreProceso").value,
      objetivo: document.getElementById("Objetivo").value,
      idcompania: parseInt(document.getElementById("Compania").value),
      nivel: temp.nivel,
      proseso_n1: area(1),
      proseso_n2: area(2),
      proseso_n3: area(3),
      proseso_n4: area(4) > 0 ? 0 : area(4),
      responsable_negocio: selectedValueResponsable
        ? selectedValueResponsable.value
        : null,
      area_organizacional: parseInt(document.getElementById("AreaO").value),
      estado_proceso: document.getElementById("estadoProc").value,
      tipo_proceso: document.getElementById("TipoProceso").value,
      id_unidad_riesgo: parseInt(document.getElementById("UnidadRO").value),
      id_analista_riesgo: parseInt(document.getElementById("AnalistaRO").value),
      padre: temp.arbol
        ? temp.arbol[temp.nivel - 2]
          ? temp.arbol[temp.nivel - 2].id
          : temp.arbol[temp.arbol.length - 1].padre
        : 0,
      bia: document.getElementById("BIA").checked,
      sox: document.getElementById("SOX").checked,
      laft: document.getElementById("LAFT").checked,
      clasificacion_ro: document.getElementById("ClasificacionRO").value,
      nivel_tercerizacion: datTercerizacion ? datTercerizacion : null,
      documentacion_proceso: null,
      unidad_ro: parseInt(document.getElementById("UnidadRO").value),
      analista_sox: parseInt(document.getElementById("AnalistaSOX").value),
      analista_ro: parseInt(document.getElementById("AnalistaRO").value),
      entorno: entornoTemp ? entornoTemp : null,
      evc: evcTemp ? evcTemp : null,
      proceso_homologo_norma_guatemala:
        document.getElementById("proceso_homologo").value,
      ciclo: cicloTemp ? cicloTemp : null,
      orden_ciclo: document.getElementById("orden_ciclo").value ? document.getElementById("orden_ciclo").value : null,      
      fecha_inicio_proceso: document.getElementById("fechaInicio").value ? document.getElementById("fechaInicio").value : null,
    };

    fetch(process.env.REACT_APP_API_URL + "/maestros_ro/proceso/" + datProceso.id + "/", {
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
            localStorage.setItem("idProceso", response.id);
            history.push("/EditarProceso");
            limpiar(() => {});
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
  return (
    <>
      <AlertDismissibleExample alerta={estadoPost} />
      <Row className="mb-3">
        <Col md={12}>
          <h1 className="titulo">Edición del Proceso</h1>
        </Col>
      </Row>
      <Form id="formData" onSubmit={(e) => sendData(e)}>
        <Row className="mb-3">
          <Col sm={4} xs={12}>
            <label className="label forn-label">Id Proceso (Automatico)</label>
          </Col>
          <Col sm={8} xs={12}>
            <input
              type="text"
              disabled
              className="form-control text-center texto"
              placeholder="ID Automático"
              defaultValue={datProceso !== null ? datProceso.id : null}
              id="IDproceso"
            ></input>
          </Col>
        </Row>
        <Row className="mb-3">
          <Col sm={4} xs={12}>
            <label className="label forn-label">Id Proceso*</label>
          </Col>
          <Col sm={8} xs={12}>
            <input
              required
              type="text"
              className="form-control text-center texto"
              placeholder="ID Proceso (Debe ser único)"
              defaultValue={datProceso !== null ? datProceso.idproceso : null}
              id="IDprocesoInput"
            ></input>
          </Col>
        </Row>
        <Row className="mb-3">
          <Col sm={4} xs={12}>
            <label className="form-label label">Nombre Proceso*</label>
          </Col>
          <Col sm={8} xs={12}>
            <input
              type="text"
              className="form-control text-center texto"
              placeholder="Nombre del Proceso"
              defaultValue={datProceso !== null ? datProceso.nombre : null}
              required
              id="NombreProceso"
            ></input>
            <Form.Control.Feedback type="invalid">
              Por favor introduzca un nombre.
            </Form.Control.Feedback>
          </Col>
        </Row>
        <Row className="mb-3">
          <Col sm={4} xs={12}>
            <label className="form-label label">Objetivo</label>
          </Col>
          <Col sm={8} xs={12}>
            <textarea
              className="form-control text-center"
              placeholder="Objetivo del proceso"
              rows="3"
              defaultValue={datProceso !== null ? datProceso.objetivo : null}
              id="Objetivo"
            ></textarea>
          </Col>
        </Row>
        <Row className="mb-3">
          <Col sm={4} xs={12}>
            <label className="forn-label label">Compañía*</label>
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
                  datProceso && datProceso.idcompania
                    ? datProceso.idcompania.idcompania
                    : ""
                }
              >
                {datProceso && datProceso.idcompania.compania
                  ? datProceso.idcompania.compania
                  : "Seleccione compañía"}
              </option>
              {datCompañia
                ? datCompañia.map((compañia) => {
                    return datProceso &&
                      datProceso.idcompania.compania !== compañia.compania ? (
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
                  datProceso && datProceso.entorno ? datProceso.entorno : null
                }
              >
                {datProceso && datProceso.entorno
                  ? datProceso.entorno
                  : "Seleccione Entorno"}
              </option>
              {datEntorno
                ? datEntorno.map((entorno) => {
                    return datProceso &&
                      datProceso.entorno &&
                      datProceso.entorno !== entorno.valor ? (
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
                value={datProceso && datProceso.evc ? datProceso.evc : null}
              >
                {datProceso && datProceso.evc
                  ? datProceso.evc
                  : "Seleccione EVC"}
              </option>
              {datEVCSelect
                ? datEVCSelect.map((evc) => {
                    return datProceso &&
                      datProceso.evc &&
                      datProceso.evc !== evc.valor ? (
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
            <label className="form-label label">
              Selección Nivel de proceso*
            </label>
          </Col>
          <Col sm={8} xs={12} className="contenedorArbol">
            {/* TODO: Insertar treeView */}
            <Treebeard
              data={dataArbol}
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
              options={datResponsables}
              onChange={handleChange}
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
                  datProceso && datProceso.area_organizacional
                    ? datProceso.area_organizacional.idarea_organizacional
                    : ""
                }
              >
                {datProceso && datProceso.area_organizacional
                  ? datProceso.area_organizacional.nombre
                  : "Seleccione área organizacional"}
              </option>
              {datAreaO
                ? datAreaO.map((areaO) => {
                    return datProceso &&
                      datProceso.area_organizacional &&
                      datProceso.area_organizacional.nombre !== areaO.nombre ? (
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
            <label className="forn-label label">Tipo de Proceso*</label>
          </Col>
          <Col sm={8} xs={10}>
            <select className="form-control texto" id="TipoProceso" required>
              <option
                value={
                  datProceso !== null && datProceso.tipo_proceso !== null
                    ? datProceso.tipo_proceso
                    : ""
                }
              >
                {datProceso !== null && datProceso.tipo_proceso !== null
                  ? datProceso.tipo_proceso
                  : "Seleccione tipo de proceso"}
              </option>
              {dataTipoProc !== null
                ? dataTipoProc.map((tipoProceso) => {
                    return datProceso !== null &&
                      datProceso.tipo_proceso !== tipoProceso.valor ? (
                      <option className="texto" value={tipoProceso.valor}>
                        {tipoProceso.valor}
                      </option>
                    ) : null;
                  })
                : null}
            </select>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col sm={4} xs={12}>
            <label className="forn-label label">Riesgos relacionados*</label>
          </Col>
          <Col sm={1} xs={6}>
            <label className="forn-label label">BIA</label>
          </Col>
          <Col sm={1} xs={6}>
            <input
              className="form-check-input"
              type="checkbox"
              defaultChecked={datProceso !== null ? datProceso.bia : null}
              id="BIA"
            ></input>
          </Col>
          <Col sm={1} xs={6}>
            <label className="forn-label label">SOX</label>
          </Col>
          <Col sm={1} xs={6}>
            <input
              className="form-check-input"
              type="checkbox"
              defaultChecked={datProceso !== null ? datProceso.sox : null}
              id="SOX"
            ></input>
          </Col>

          <Col sm={1} xs={6}>
            <label className="forn-label label">LAFT</label>
          </Col>
          <Col sm={1} xs={6}>
            <input
              className="form-check-input"
              type="checkbox"
              defaultChecked={datProceso !== null ? datProceso.laft : null}
              id="LAFT"
            ></input>
          </Col>

          <Col sm={1} xs={6}>
            <label className="forn-label label">SAC</label>
          </Col>
          <Col sm={1} xs={6}>
            <input
              className="form-check-input"
              type="checkbox"
              // defaultChecked={datProceso !== null ? datProceso.sac : null}
              id="SAC"
            ></input>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col sm={4} xs={12}></Col>

          <Col sm={1} xs={6}>
            <label className="forn-label label">PDP</label>
          </Col>
          <Col sm={1} xs={6}>
            <input
              className="form-check-input"
              type="checkbox"
              id="PDP"
              // defaultChecked={datProceso !== null ? datProceso.sac : null}
            ></input>
          </Col>

          <Col sm={2} xs={6}>
            <label className="forn-label label">Corrupción interna</label>
          </Col>
          <Col sm={1} xs={6}>
            <input
              className="form-check-input"
              type="checkbox"
              id="corrupcionInterna"
              // defaultChecked={datProceso !== null ? datProceso.sac : null}
            ></input>
          </Col>

          <Col sm={2} xs={6}>
            <label className="forn-label label">Corrupción externa</label>
          </Col>
          <Col sm={1} xs={6}>
            <input
              className="form-check-input"
              type="checkbox"
              id="corrupcionExterna"
              // defaultChecked={datProceso !== null ? datProceso.sac : null}
            ></input>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col sm={4} xs={12}>
            <label className="forn-label label">Clasificación RO*</label>
          </Col>
          <Col sm={8} xs={10}>
            <select
              className="form-control texto"
              id="ClasificacionRO"
              required
              disabled={disabledRO}
            >
              <option
                value={
                  datProceso !== null && datProceso.clasificacion_ro !== null
                    ? datProceso.clasificacion_ro
                    : ""
                }
              >
                {datProceso !== null && datProceso.clasificacion_ro !== null
                  ? datProceso.clasificacion_ro
                  : "Seleccione clasificación"}
              </option>
              {dataClasificacion !== null
                ? dataClasificacion.map((tipoProceso) => {
                    return datProceso !== null &&
                      datProceso.clasificacion_ro !== tipoProceso.valor ? (
                      <option className="texto" value={tipoProceso.valor}>
                        {tipoProceso.valor}
                      </option>
                    ) : null;
                  })
                : null}
            </select>
          </Col>
        </Row>
        <Row className="mb-3">
          <Col sm={4} xs={4}>
            <label className="forn-label label">Estado*</label>
          </Col>
          <Col>
            <select className="form-control texto" required id="estadoProc">
              <option
                value={
                  datProceso !== null && datProceso.estado_proceso !== null
                    ? datProceso.estado_proceso
                    : ""
                }
              >
                {datProceso !== null && datProceso.estado_proceso !== null
                  ? datProceso.estado_proceso
                  : "Seleccione estado"}
              </option>
              {datEstado !== null
                ? datEstado.map((estado) => {
                    return datProceso !== null &&
                      datProceso.estado_proceso !== estado.valor ? (
                      <option className="texto" value={estado.valor}>
                        {estado.valor}
                      </option>
                    ) : null;
                  })
                : null}
            </select>
          </Col>
        </Row>
        <Row className="mb-3">
          <Col sm={4} xs={12}>
            <label className="forn-label label">Nivel de tercerización</label>
          </Col>
          <Col sm={8} xs={10}>
            <select
              className="form-control texto"
              id="NivelTercerizacion"
              value={datTercerizacion !== null ? datTercerizacion : null}
              onChange={(e) => changeNivelTercerizacion(e)}
            >
              <option hidden disabled selected value={null}>
                {datProceso !== null && datTercerizacion !== null
                  ? datTercerizacion
                  : "Seleccione nivel de tercerización"}
              </option>
              {dataTercerizacion !== null
                ? dataTercerizacion.map((tercerizacion) => {
                    return datProceso !== null &&
                      datProceso.nivel_tercerizacion !== tercerizacion.valor ? (
                      <option className="texto" value={tercerizacion.valor}>
                        {tercerizacion.valor}
                      </option>
                    ) : null;
                  })
                : null}
            </select>
          </Col>
        </Row>
        <Row className="mb-3">
          <Col sm={4} xs={12}>
            <label className="forn-label label">
              Documentación del proceso
            </label>
          </Col>
          <Col sm={8} xs={10}>
            <label className="forn-label texto">
              Texto (hipervinculo) a un archivo en S3 o un sitio externo (por
              definir)
            </label>
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
                  datProceso !== null && datProceso.unidad_ro !== null
                    ? datProceso.unidad_ro.idunidad_riesgo
                    : ""
                }
              >
                {datProceso !== null && datProceso.unidad_ro !== null
                  ? datProceso.unidad_ro.nombre
                  : "Seleccione unidad RO"}
              </option>
              {datUnidadRO !== null
                ? datUnidadRO.map((unidadRO) => {
                    return datProceso &&
                      datProceso.unidad_ro &&
                      datProceso.unidad_ro.nombre_riesgo !== unidadRO.nombre ? (
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
                  datProceso !== null && datProceso.analista_ro !== null
                    ? datProceso.analista_ro.idposicion
                    : ""
                }
              >
                {datProceso && datProceso.analista_ro
                  ? datProceso.analista_ro.idusuario.nombre
                  : "Seleccione analista RO"}
              </option>
              {datAnalistas
                ? datAnalistas.map((analista) => {
                    return datProceso &&
                      datProceso.analista_ro &&
                      datProceso.analista_ro.idusuario.nombre !==
                        analista.nombre ? (
                      <option className="texto" value={analista.idposicion}>
                        {analista.nombre}
                      </option>
                    ) : (
                      <option className="texto" value={analista.idposicion}>
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
            <label className="forn-label label">Proceso homólogo</label>
          </Col>
          {/* /--------------------------------------------------------------------------/ */}
          <Col sm={8} xs={10}>
            <select
              className="form-control texto"
              id="proceso_homologo"
              onChange={handleChange}
            >
              <option
                value={
                  datProceso && datProceso.proceso_homologo_norma_guatemala
                    ? datProceso.proceso_homologo_norma_guatemala
                    : null
                }
              >
                {datProceso && datProceso.proceso_homologo_norma_guatemala
                  ? datProceso.proceso_homologo_norma_guatemala
                  : "Seleccione el proceso homologo"}
              </option>
              {datProcesoHomologo
                ? datProcesoHomologo.map((procesoHomologo) => {
                    return datProceso &&
                      datProceso.proceso_homologo_norma_guatemala &&
                      datProceso.proceso_homologo_norma_guatemala !==
                        procesoHomologo.valor ? (
                      <option className="texto" value={procesoHomologo.valor}>
                        {procesoHomologo.valor}
                      </option>
                    ) : (
                      <option className="texto" value={procesoHomologo.valor}>
                        {procesoHomologo.valor}
                      </option>
                    );
                  })
                : null}
            </select>
          </Col>
          {/* /--------------------------------------------------------------------------/ */}
        </Row>
        <Row className="mb-3">
          <Col sm={4} xs={12}>
            <label className="form-label label">Ciclo</label>
          </Col>
          <Col sm={4} xs={10}>
            <select className="form-control texto" id="ciclo_nvl1">
              <option value="">Seleccione el Ciclo de nivel 1</option>
              {Ciclos1 !== null
                ? Ciclos1.map((ciclos_nvl1) => {
                    return <option value={ciclos_nvl1}>{ciclos_nvl1}</option>;
                  })
                : null}
            </select>
          </Col>
          <Col sm={4} xs={10}>
            <select className="form-control texto" id="ciclo_nvl2">
            <option
            // aqui iria vble del ciclo 2
                value={
                  datProceso && datProceso.ciclo
                    ? datProceso.ciclo
                    : null
                }
              >
                {datProceso && datProceso.ciclo
                  ? datProceso.ciclo
                  : "Seleccione ciclo"}
              </option>
              {dataCiclos !== null
                ? dataCiclos.map((ciclos2) => {
                    return (
                      <option value={ciclos2.valor}>{ciclos2.valor}</option>
                    );
                  })
                : null}
            </select>
          </Col>
        </Row>
        <Row className="mb-3">
          <Col sm={4} xs={12}>
            <label className="form-label label">Orden del ciclo</label>
          </Col>
          <Col sm={8} xs={10}>
            <input
              type="number"
              className="form-control text-center number"
              placeholder="Orden del ciclo"
              defaultValue={datProceso !== null ? datProceso.orden_ciclo : null}
              id="orden_ciclo"
            ></input>
          </Col>
        </Row>
        <Row className="mb-3">
          <Col sm={4} xs={12}>
            <label className="forn-label label">Analista SOX</label>
          </Col>
          <Col sm={8} xs={10}>
          <select className="form-control texto" id="AnalistaSOX">
              <option
                value={
                  datProceso !== null && datProceso.analista_sox !== null
                    ? datProceso.analista_sox.idposicion
                    : ""
                }
              >
                {datProceso && datProceso.analista_sox
                  ? datProceso.analista_sox.idusuario.nombre
                  : "Seleccione analista RO"}
              </option>
              {datAnalistas
                ? datAnalistas.map((analista) => {
                    return datProceso &&
                      datProceso.analista_sox &&
                      datProceso.analista_sox.idusuario.nombre !==
                        analista.nombre ? (
                      <option className="texto" value={analista.idposicion}>
                        {analista.nombre}
                      </option>
                    ) : (
                      <option className="texto" value={analista.idposicion}>
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
            <label className="forn-label label">Fecha inicial:</label>
          </Col>

          <Col sm={8} xs={10}>
            <input
              type="date"
              value={fechaInicio}
              id="fechaInicio"
              placeholder="dd/mm/yyyy"
              className="form-control text-center texto"
            ></input>
          </Col>
        </Row>
        <hr />
        <Row className="mb-3">
          <Col sm={4} xs={12}>
            <label className="form-label label">Criticidad del proceso</label>
          </Col>
          <Col sm={8} xs={12}>
            <input
              type="text"
              className="form-control text-center texto"
              placeholder="Criticidad del Proceso (Calculado)"
              defaultValue={
                datProceso !== null ? datProceso.criticidad_proceso : null
              }
              disabled
              id="nivel"
            ></input>
          </Col>
        </Row>
        <Row className="mb-3">
          <Col sm={4} xs={12}>
            <label className="form-label label">ID Evaluación</label>
          </Col>
          <Col sm={8} xs={12}>
            <input
              type="text"
              className="form-control text-center texto"
              placeholder="ID Evaluación (Calculado)"
              defaultValue={
                datProceso !== null ? datProceso.idevaluacion : null
              }
              disabled
              id="nivel"
            ></input>
          </Col>
        </Row>
        <Row className="mb-3">
          <Col sm={4} xs={12}>
            <label className="form-label label">Estado Validación</label>
          </Col>
          <Col sm={8} xs={12}>
            <input
              type="text"
              className="form-control text-center texto"
              placeholder="Estado Validación (Calculado)"
              defaultValue={
                datProceso !== null ? datProceso.estado_validacion : null
              }
              disabled
              id="nivel"
            ></input>
          </Col>
        </Row>
        <Row className="mb-3">
          <Col sm={4} xs={12}>
            <label className="form-label label">
              Fecha Última Validación Evaluación
            </label>
          </Col>
          <Col sm={8} xs={12}>
            <input
              type="text"
              className="form-control text-center texto"
              placeholder="Fecha Última Validación Evaluación (Calculado)"
              defaultValue={
                datProceso !== null ? datProceso.fecha_ult_validacion_eva : null
              }
              disabled
              id="nivel"
            ></input>
          </Col>
        </Row>
        <Row className="mb-3">
          <Col sm={4} xs={12}>
            <label className="form-label label">
              Fecha Programada de Actualización
            </label>
          </Col>
          <Col sm={8} xs={12}>
            <input
              type="text"
              className="form-control text-center texto"
              placeholder="Fecha Programada de Actualización (Calculado)"
              defaultValue={
                datProceso !== null ? datProceso.fecha_prog_actualizacion : null
              }
              disabled
              id="nivel"
            ></input>
          </Col>
        </Row>
        <Row className="mb-3">
          <Col sm={4} xs={12}>
            <label className="form-label label">Motivo de Actualización</label>
          </Col>
          <Col sm={8} xs={12}>
            <input
              type="text"
              className="form-control text-center texto"
              placeholder="Motivo de Actualización (Calculado)"
              defaultValue={
                datProceso !== null ? datProceso.motivo_actualizacion : null
              }
              disabled
              id="nivel"
            ></input>
          </Col>
        </Row>
        <Row className="mb-3">
          <Col sm={4} xs={12}>
            <label className="form-label label">Estado de Actualización</label>
          </Col>
          <Col sm={8} xs={12}>
            <input
              type="text"
              className="form-control text-center texto"
              placeholder="Estado de Actualización (Calculado)"
              defaultValue={
                datProceso !== null ? datProceso.estado_actualizacion : null
              }
              disabled
              id="nivel"
            ></input>
          </Col>
        </Row>

        {/* Campos para todas las vistas de los maestros */}
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
