import React, { useState, useEffect } from "react";
import { Row, Col, Form, Alert } from "react-bootstrap";
import { Link, useHistory } from "react-router-dom";
import { Treebeard } from "react-treebeard";
import Select from "react-select";
import Loader from "react-loader-spinner";
import Queries from "../Components/QueriesAxios";
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
  const [datEntorno, setDatEntorno] = useState([]);
  const [datEVC, setDatEVC] = useState([]);
  const [datEVCSelect, setDatEVCSelect] = useState([]);
  const [cursor, setCursor] = useState(false);
  const [ast, setAst] = useState("");
  const [requiredC, setRequiredC] = useState(false);
  const [datUnidadRO, setDatUnidadRO] = useState(null);
  const [datProcComp, setDatProcComp] = useState(null);
  const [datAnalistas, setDatAnalistas] = useState(null);
  const [datResponsables, setDatResponsables] = useState(null);
  const [datCompañia, setDatCompañia] = useState([]);
  const [datAreaO, setDatAreaO] = useState(null);
  const [datAreaOT, setDatAreaOT] = useState(null);

  const [dataBanca, setDataBanca] = useState([]);
  const [dataCategoria, setDataCategoria] = useState([]);
  const [dataCicloCliente, setDataCicloCliente] = useState([]);
  const [dataModelOperacion, setDataModelOperacion] = useState([]);
  const [dataCompaniasAlc, setDataCompaniasAlc] = useState([]);
  //Listas
  const [dataListBanca, setDataListBanca] = useState([]);
  const [dataListCategoria, setDataListCategoria] = useState([]);
  const [dataListCicloCliente, setDataListCicloCliente] = useState([]);
  const [dataListModelOperacion, setDataListModelOperacion] = useState([]);
  const [dataListCompaniasAlc, setDataListCompaniasAlc] = useState([]);
  const [dataTipoProc, setDataTipoProc] = useState(null);
  const [datProcesoHomologo, setDatProcesoHomologo] = useState([]);
  const [dataClasificacion, setDataClasificacion] = useState(null);
  const [dataCiclos, setDataCiclos] = useState(null);
  const [dataCiclosnvl2, setDataCiclosnvl2] = useState([]);
  const [Ciclos1, setCiclos1] = useState(null);
  const [dataTercerizacion, setDataTercerizacion] = useState(null);
  const [datEstado, setDatEstado] = useState(null);
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
            id: dat.id,
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
              id: dat.id,
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

    setDataArbol(dataTree);
  };

  useEffect(() => {
    const datosListas = async () => {
      let requestListas = await Queries(null, "/generales/Procesos/", "GET");
      console.log({ requestListas });
      let tempListBanca = requestListas.filter(
        (obj) => obj.parametro === "Banca"
      );
      let tempListCategoria = requestListas.filter(
        (obj) => obj.parametro === "Categoria"
      );
      let tempListCicloExperianciaCliente = requestListas.filter(
        (obj) => obj.parametro === "Ciclo_experiancia_cliente"
      );
      let tempListModeloOperacion = requestListas.filter(
        (obj) => obj.parametro === "Modelo_operacion"
      );
      let tempListCompaniasAlcaneProceso = requestListas.filter(
        (obj) => obj.parametro === "Companias_alcane_proceso"
      );
      let tempListTipoProc = requestListas.filter(
        (obj) => obj.parametro === "Tipo_Proceso"
      );
      let tempListNivTerc = requestListas.filter(
        (obj) => obj.parametro === "Nivel_Tercerizacion"
      );

      setDataListBanca(
        tempListBanca.map(({ valor }) => ({ value: valor, label: valor }))
      );
      setDataListCategoria(
        tempListCategoria.map(({ valor }) => ({ value: valor, label: valor }))
      );
      setDataListCicloCliente(
        tempListCicloExperianciaCliente.map(({ valor }) => ({
          value: valor,
          label: valor,
        }))
      );
      setDataListModelOperacion(
        tempListModeloOperacion.map(({ valor }) => ({
          value: valor,
          label: valor,
        }))
      );
      setDataListCompaniasAlc(
        tempListCompaniasAlcaneProceso.map(({ valor }) => ({
          value: valor,
          label: valor,
        }))
      );
      setDataTipoProc(tempListTipoProc);
      setDataTercerizacion(tempListNivTerc);
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
      setCiclos1([...ciclosSet]);
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
      setDatAreaO(data);
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
      setDatAnalistas(
        data3.sort(function (a, b) {
          if (a.nombre > b.nombre) {
            return 1;
          }
          if (a.nombre < b.nombre) {
            return -1;
          }
          // a must be equal to b
          return 0;
        })
      );
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
    datosListas();
    GetEntornos();
    GetEVC();
    datosCompañia();
    datosEstado();
    datosAreasO();
    datosClasificacion();
    datosArbol();
    unidadesRO();
    analistasRO();
    ResponsablesNeg();
    procesoHomologo();
    datosCiclos();
  }, []);

  const filtroCiclos = (e) => {
    let data = dataCiclos;
    console.log(e.target.value);
    let newArray = data.filter((item) => item.parametro === e.target.value);
    setDataCiclosnvl2(newArray);
  };

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
    setDataArbol(Object.assign({}, dataArbol));
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
        temp.unshift(retornarPadre(dataArbol.children, idPadre));
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
    crearData(temp);
  };

  const handleChange = (e) => {
    setSelectedValueResponsable(e.value);
  };

  const handleChangeEstado = (e) => {
    let estado = document.getElementById("estadoProc").value;
    if (estado === "Inactivo") {
      setAst("*");
      setRequiredC(true);
    } else {
      setAst("");
      setRequiredC(false);
    }
  };

  const sendData = (e) => {
    e.preventDefault();

    setHabilitarBoton(false);

    const temp = datosNivel();

    async function limpiar(state) {
      setTimeout(() => {
        // if (state === 2) {
        //   history.push("/"");
        // }
        setHabilitarBoton(true);
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
    let cicloTemp = document.getElementById("ciclo_nvl2").value;
    let companiasTemp = dataCompaniasAlc
      ? dataCompaniasAlc.map((dat) => dat.value).join(",")
      : null;

    const data = {
      idproceso: document.getElementById("IDprocesoInput").value,
      nombre: document.getElementById("NombreProceso").value,
      objetivo: document.getElementById("Objetivo").value,
      idcompania: parseInt(document.getElementById("Compania").value),
      nivel: temp.nivel,
      proseso_n1: area(1),
      proseso_n2: area(2),
      proseso_n3: area(3),
      proseso_n4: area(4),
      //responsable_negocio: 99999999,
      responsable_negocio: selectedValueResponsable,
      area_organizacional: parseInt(document.getElementById("AreaO").value),
      estado_proceso: document.getElementById("estadoProc").value,
      tipo_proceso: document.getElementById("TipoProceso").value,
      id_unidad_riesgo: parseInt(document.getElementById("UnidadRO").value),
      id_analista_riesgo: parseInt(document.getElementById("AnalistaRO").value),
      padre: temp.arbol !== null ? temp.arbol[temp.nivel - 2].id : 0,
      bia: document.getElementById("BIA").checked ? 1 : 0,
      sox: document.getElementById("SOX").checked ? 1 : 0,
      laft: document.getElementById("LAFT").checked ? 1 : 0,
      clasificacion_ro: document.getElementById("ClasificacionRO").value,
      nivel_tercerizacion: document.getElementById("NivelTercerizacion").value,
      documentacion_proceso: null,
      unidad_ro: parseInt(document.getElementById("UnidadRO").value),
      //analista_ro: 99999999,
      analista_ro: parseInt(document.getElementById("AnalistaRO").value),
      analista_sox: parseInt(document.getElementById("AnalistaSOX").value),
      motivo_estado_inactivo: document.getElementById("MotivoInac").value,
      entorno: entornoTemp ? entornoTemp : null,
      evc: evcTemp ? evcTemp : null,
      proceso_homologo_norma_guatemala:
        document.getElementById("proceso_homologo").value,
      ciclo: cicloTemp ? cicloTemp : null,
      orden_ciclo: document.getElementById("orden_ciclo").value
        ? document.getElementById("orden_ciclo").value
        : null,
      fecha_inicio_proceso: document.getElementById("fechaInicio").value
        ? document.getElementById("fechaInicio").value
        : null,
      banca: dataBanca ? dataBanca.value : null,
      categoria: dataCategoria ? dataCategoria.value : null,
      ciclo_experiancia_cliente: dataCicloCliente
        ? dataCicloCliente.value
        : null,
      modelo_operacion: dataModelOperacion ? dataModelOperacion.value : null,
      companias_alcane_proceso: companiasTemp,
      impacto_sucursales: null,
      reutilizable: null,
      reportar_circular_005: null,
      donde_migragron_actividades: null,
      responsable_funcional: null,
    };

    console.log({ data });

    fetch(process.env.REACT_APP_API_URL + "/maestros_ro/proceso/", {
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
            localStorage.setItem("idProceso", response.id);
            setTimeout(() => {
              history.push("/EditarProceso");
              limpiar();
            }, 4000);
          } else if (data.status >= 500) {
            setEstadoPost({ id: 5, data: response });
            limpiar();
          } else if (data.status >= 400 && data.status < 500) {
            setEstadoPost({ id: 4, data: response });
            limpiar();
          }
        })
      )
      .catch(function (err) {
        console.error(err);
        setHabilitarBoton(false);
      });
  };
  return (
    <>
      <AlertDismissibleExample alerta={estadoPost} />
      <Row className="mb-3">
        <Col md={12}>
          <h1 className="titulo">Creación de un nuevo Proceso</h1>
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
              id="IDproceso"
            ></input>
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
            <label className="forn-label label">Tipo de Proceso*</label>
          </Col>
          <Col sm={8} xs={10}>
            <select className="form-control texto" id="TipoProceso" required>
              <option value="">Seleccione tipo de proceso</option>
              {dataTipoProc !== null
                ? dataTipoProc.map((tipoProceso) => {
                    return (
                      <option className="texto" value={tipoProceso.valor}>
                        {tipoProceso.valor}
                      </option>
                    );
                  })
                : null}
            </select>
          </Col>
        </Row>
        <Row className="mb-3">
          <Col sm={4} xs={12}>
            <label className="forn-label label">Banca*</label>
          </Col>
          <Col sm={8} xs={10}>
            <Select
              options={dataListBanca}
              onChange={(e) => setDataBanca(e)}
              isClearable={true}
            ></Select>
          </Col>
        </Row>
        <Row className="mb-3">
          <Col sm={4} xs={12}>
            <label className="forn-label label">Categoría*</label>
          </Col>
          <Col sm={8} xs={10}>
            <Select
              options={dataListCategoria}
              onChange={(e) => setDataCategoria(e)}
              isClearable={true}
            ></Select>
          </Col>
        </Row>
        <Row className="mb-3">
          <Col sm={4} xs={12}>
            <label className="forn-label label">
              Ciclo de Experiencia del Cliente*
            </label>
          </Col>
          <Col sm={8} xs={10}>
            <Select
              option={dataListCicloCliente}
              onChange={(e) => setDataCicloCliente(e)}
              isClearable={true}
            ></Select>
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
          <Col sm={4} xs={4}>
            <label className="forn-label label">Estado*</label>
          </Col>
          <Col>
            <select
              className="form-control texto"
              required
              id="estadoProc"
              onChange={(e) => handleChangeEstado(e)}
            >
              <option value="">Seleccione estado</option>
              {datEstado !== null
                ? datEstado.map((estado) => {
                    return (
                      <option className="texto" value={estado.valor}>
                        {estado.valor}
                      </option>
                    );
                  })
                : null}
            </select>
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
              isClearable={true}
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
          <Col sm={4} xs={12}>
            <label className="form-label label">
              Selección Nivel de proceso*
            </label>
          </Col>
          <Col sm={8} xs={12} className="contenedorArbol">
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
            <label className="forn-label label">Modelo de Operación*</label>
          </Col>
          <Col sm={8} xs={10}>
            <Select
              options={dataListModelOperacion}
              onChange={(e) => setDataModelOperacion(e)}
              isClearable={true}
            ></Select>
          </Col>
        </Row>
        <Row className="mb-3">
          <Col sm={4} xs={12}>
            <label className="forn-label label">
              Compañías alcance del proceso*
            </label>
          </Col>
          <Col sm={8} xs={10}>
            <Select
              options={dataListCompaniasAlc}
              onChange={(e) => {
                console.log(e);
                setDataCompaniasAlc(e);
              }}
              isMulti
              isClearable={true}
            ></Select>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col sm={4} xs={12}>
            <label className="forn-label label">Riesgos relacionados*</label>
          </Col>
          <Col sm={1} xs={6}>
            <label className="forn-label label">SOX</label>
          </Col>
          <Col sm={1} xs={6}>
            <input
              className="form-check-input"
              type="checkbox"
              id="SOX"
            ></input>
          </Col>
          <Col sm={1} xs={6}>
            <label className="forn-label label">BIA</label>
          </Col>
          <Col sm={1} xs={6}>
            <input
              className="form-check-input"
              type="checkbox"
              id="BIA"
            ></input>
          </Col>
          <Col sm={1} xs={6}>
            <label className="forn-label label">¿Crítico NO BIA?</label>
          </Col>
          <Col sm={1} xs={6}>
            <input
              className="form-check-input"
              type="checkbox"
              id="NoBia"
            ></input>
          </Col>
          <Col sm={1} xs={6}>
            <label className="forn-label label">LAFT</label>
          </Col>
          <Col sm={1} xs={6}>
            <input
              className="form-check-input"
              type="checkbox"
              id="LAFT"
            ></input>
          </Col>
        </Row>
        <Row className="mb-3">
          <Col sm={2} xs={12}></Col>
          <Col sm={1} xs={6}>
            <label className="forn-label label">SAC</label>
          </Col>
          <Col sm={1} xs={6}>
            <input
              className="form-check-input"
              type="checkbox"
              id="SAC"
            ></input>
          </Col>
          <Col sm={1} xs={6}>
            <label className="forn-label label">PDP</label>
          </Col>
          <Col sm={1} xs={6}>
            <input
              className="form-check-input"
              type="checkbox"
              id="PDP"
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
            ></input>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col sm={4} xs={12}>
            <label className="form-label label">Ciclo</label>
          </Col>
          <Col sm={4} xs={10}>
            <select
              className="form-control texto"
              id="ciclo_nvl1"
              onChange={(e) => {
                filtroCiclos(e);
              }}
            >
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
              <option value="">Seleccione el Ciclo de nivel 2</option>
              {dataCiclosnvl2 !== null
                ? dataCiclosnvl2.map((ciclos2) => {
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
              id="orden_ciclo"
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
            >
              <option value="">Seleccione clasificación</option>
              {dataClasificacion !== null
                ? dataClasificacion.map((tipoProceso) => {
                    return (
                      <option className="texto" value={tipoProceso.valor}>
                        {tipoProceso.valor}
                      </option>
                    );
                  })
                : null}
            </select>
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
              disabled
              id="nivel"
            ></input>
          </Col>
        </Row>
        <Row className="mb-3">
          <Col sm={4} xs={12}>
            <label className="form-label label">Criticidad del proceso</label>
          </Col>
          <Col sm={8} xs={12}>
            <input
              type="text"
              className="form-control text-center texto"
              placeholder="Criticidad del Proceso (Calculado)"
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
              disabled
              id="nivel"
            ></input>
          </Col>
        </Row>
        <Row className="mb-3">
          <Col sm={4} xs={12}>
            <label className="forn-label label">
              Tiene impacto en las Sucurslaes*
            </label>
          </Col>
          <Col sm={8} xs={10}>
            <Select></Select>
          </Col>
        </Row>
        <Row className="mb-3">
          <Col sm={4} xs={12}>
            <label className="forn-label label">
              ¿Es un Proceso Componente/Reutilizable?*
            </label>
          </Col>
          <Col sm={8} xs={10}>
            <Select></Select>
          </Col>
        </Row>
        <Row className="mb-3">
          <Col sm={4} xs={12}>
            <label className="forn-label label">
              Procesos a reportar en Circular 005*
            </label>
          </Col>
          <Col sm={8} xs={10}>
            <Select></Select>
          </Col>
        </Row>
        <Row className="mb-3">
          <Col sm={4} xs={12}>
            <label className="forn-label label">
              Procesos a los que aplica el componente*
            </label>
          </Col>
          <Col sm={8} xs={10}>
            <Select></Select>
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
              id="Objetivo"
            ></textarea>
          </Col>
        </Row>
        <Row className="mb-3">
          <Col sm={4} xs={12}>
            <label className="forn-label label">Estado GRC*</label>
          </Col>
          <Col sm={8} xs={10}>
            <Select></Select>
          </Col>
        </Row>
        <Row className="mb-3">
          <Col sm={4} xs={12}>
            <label className="forn-label label">
              Motivo de estado inactivo{ast}
            </label>
          </Col>
          <Col sm={8} xs={10}>
            <select
              className="form-control texto"
              id="MotivoInac"
              required={requiredC}
            >
              <option value="">Seleccione Motivo de estado inactivo</option>
              <option
                className="texto"
                value="Las actividades migraron a otro proceso"
              >
                Las actividades migraron a otro proceso
              </option>
              <option className="texto" value="Se eliminaron las actividades">
                Se eliminaron las actividades
              </option>
            </select>
          </Col>
        </Row>
        <Row className="mb-3">
          <Col sm={4} xs={12}>
            <label className="forn-label label">
              Procesos a los que migraron las actividades - Usuario*
            </label>
          </Col>
          <Col sm={8} xs={10}>
            <Select></Select>
          </Col>
        </Row>
        <Row className="mb-3">
          <Col sm={4} xs={12}>
            <label className="forn-label label">
              Información adicional motivo de inactivación - Usuario*
            </label>
          </Col>
          <Col sm={8} xs={10}>
            <Select></Select>
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
            <label className="forn-label label">Nivel de tercerización</label>
          </Col>
          <Col sm={8} xs={10}>
            <select
              className="form-control texto"
              id="NivelTercerizacion"
              required
            >
              <option value="">Seleccione nivel de tercerización</option>
              {dataTercerizacion !== null
                ? dataTercerizacion.map((tipoProceso) => {
                    return (
                      <option className="texto" value={tipoProceso.valor}>
                        {tipoProceso.valor}
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
              <option value="">Seleccione unidad RO</option>
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

        <Row className="mb-3">
          <Col sm={4} xs={12}>
            <label className="forn-label label">Proceso homólogo</label>
          </Col>
          <Col sm={8} xs={10}>
            <select className="form-control texto" id="proceso_homologo">
              <option value="">Seleccione el proceso homólogo</option>
              {datProcesoHomologo !== null
                ? datProcesoHomologo.map((procesoHomologo) => {
                    return (
                      <option value={procesoHomologo.valor}>
                        {procesoHomologo.valor}
                      </option>
                    );
                  })
                : null}
            </select>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col sm={4} xs={12}>
            <label className="forn-label label">Analista SOX</label>
          </Col>
          <Col sm={8} xs={10}>
            <select className="form-control texto" id="AnalistaSOX">
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

        <Row className="mb-3">
          <Col sm={4} xs={12}>
            <label className="forn-label label">Fecha inicial:</label>
          </Col>

          <Col sm={8} xs={10}>
            <input
              type="date"
              id="fechaInicio"
              placeholder="dd/mm/yyyy"
              className="form-control text-center texto"
            ></input>
          </Col>
        </Row>

        <hr />

        {/* Campos para todas las vistas de los maestros */}
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
            <Link to="Procesos">
              <button type="button" className="btn botonNegativo">
                Descartar
              </button>
            </Link>
          </Col>
        </Row>
        <Row className="mb-5 mt-5">
          <br></br>
        </Row>
      </Form>
    </>
  );
}
