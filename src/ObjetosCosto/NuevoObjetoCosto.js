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
import MaterialTable from "material-table";

import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";

import { forwardRef } from "react";
import Check from "@material-ui/icons/Check";
import Clear from "@material-ui/icons/Clear";
import Edit from "@material-ui/icons/Edit";

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

export default function NuevoObjetoCosto(props) {
  const serviceAAD = new AADService();
  const [state, setState] = useState("Activo");
  const [required, setRequired] = useState(false);
  const [datEntorno, setDatEntorno] = useState([]);
  const [datEVC, setDatEVC] = useState([]);
  const [datPDC, setDatPDC] = useState([]);
  const [selectedPDC, setSelectedPDC] = useState(null);
  const [datEVCSelect, setDatEVCSelect] = useState([]);
  const [ast, setAst] = useState("");
  const [idState, setIdState] = useState(true);
  const [datArbol, setDatArbol] = useState([]);
  const [datOCComp, setDatOCComp] = useState(null);
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
  const [datTipoCO, setDatTipoCO] = useState(null);
  const [datHomologacionOC, setDatHomologacionOC] = useState(null);
  const [datHomologacion, setDatHomologacion] = useState(null);
  const [selectedValueResponsable, setSelectedValueResponsable] =
    useState(null);
  const [estadoPost, setEstadoPost] = useState({
    alerta: { id: 0, data: null },
  });
  const [habilitarBoton, setHabilitarBoton] = React.useState(true);
  let history = useHistory();

  const [columns, setColumns] = useState([
    {
      title: "OC que recibe distribución",
      field: "idOCDist",
      lookup: datOCDist,
    },
    { title: "Porcentaje asignado", field: "porcAsig", type: "numeric" },
  ]);

  const [dataGrid, setDataGrid] = useState([]);

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
            id: dat.idoc,
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
              id: dat.idoc,
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
    const datosArbol = async () => {
      const result = await fetch(process.env.REACT_APP_API_URL + "/maestros_ro/ArbolOC/", {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: "Bearer " + serviceAAD.getToken(),
        },
      });
      let data = await result.json();

      setDatOCComp(data);
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
      setDatHomologacion(data);
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
    GetEntornos();
    GetEVC();
    listHomologacion();
    datosAreasO();
    datosDistOC();
    datosTipoOC();
    datosArbol();
    datosCompañia();
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
    if (datOCComp !== null) {
      datOCComp.map((data) => {
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

  const changeRequired = () => {
    let data = document.getElementById("tipoOC").value;
    if (data === "Producto") {
      setRequired(true);
      setAst("*");
      setPorcAsig(100);
    } else {
      setRequired(false);
      setAst("");
      setPorcAsig(0);
      setDataGrid([]);
    }
  };

  const handleChangePDC = (e) => {
    setSelectedPDC(e.value);
  };

  const sendData = (e) => {
    e.preventDefault();
    setHabilitarBoton(false);
    //if (porcAsig) {
    if (false) {
      window.alert(
        "El porcentaje asignado debe ser el 100%, verifique que tenga los datos correctamente."
      );
    } else {
      const temp = datosNivel();

      function sendData2(idOc) {
        dataGrid.map((dat) => {
          const data2 = {
            porcentage_asignado: dat.porcAsig,
            estado: true,
            idoc_principal: idOc,
            idoc_distribucion: parseInt(dat.idOCDist),
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
      }

      async function limpiar(state) {
        setTimeout(() => {
          // if (state === 2) {
          //   history.push("/EditarAreaOrganizacional");
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
      const data = {
        nombre: document.getElementById("NombreObjetoCosto").value,
        descripcion_oc: document.getElementById("Descripcion").value,
        idcompania: parseInt(document.getElementById("Compania").value),
        nivel: temp.nivel,
        oc_n1: area(1),
        oc_n2: area(2),
        //responsable_negocio: 99999999,
        responsable_negocio: selectedValueResponsable
          ? selectedValueResponsable
          : null,
        area_organizacional: parseInt(document.getElementById("AreaO").value),
        fecha_lanzamiento:
          startDate !== null ? startDate.toISOString().split("T")[0] : null,
        estado_oc: idState,
        unidad_ro: parseInt(document.getElementById("UnidadRO").value),
        //analista_ro: 99999999,
        analista_ro: parseInt(document.getElementById("AnalistaRO").value),
        padre: temp.arbol !== null ? temp.arbol[temp.nivel - 2].id : 0,
        codigo_vp: document.getElementById("CodigoObjetoCosto").value,
        tipo_oc: document.getElementById("tipoOC").value,
        driver_disribucion: document.getElementById("DiverObjetoCosto").value,
        unidad_aplicacion: document.getElementById("UnidadAplObjetoCosto")
          .value,
        proinformgfinanciera: selectedPDC ? selectedPDC : null,
        justificacion_distribucion:
          document.getElementById("justificacion") != null
            ? document.getElementById("justificacion").value
            : null,
        homologacion_oc: document.getElementById("homologacionOC").value,
        entorno: entornoTemp ? entornoTemp : null,
        evc: evcTemp ? evcTemp : null,
      };

      fetch(process.env.REACT_APP_API_URL + "/maestros_ro/oc/", {
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
              localStorage.setItem("idObjetoCosto", response.idoc);
              limpiar();
              sendData2(response.idoc);
              history.push("/EditarObjetoCosto");
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
    }
  };
  return (
    <>
      <AlertDismissibleExample alerta={estadoPost} />
      <Row className="mb-3">
        <Col md={12}>
          <h1 className="titulo">Creación de un nuevo Objeto de Costo</h1>
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
              placeholder="Nombre del Objeto de Costo"
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
              placeholder="Descripción del Objeto de Costo"
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
            <label className="forn-label label">Homologación OC</label>
          </Col>
          <Col sm={8} xs={10}>
            <select className="form-control texto" id="homologacionOC">
              <option value="">Seleccione Tipo Homologación OC</option>
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
              <option value="">Seleccione Tipo OC</option>
              {datTipoCO !== null
                ? datTipoCO.map((compañia) => {
                    return (
                      <option className="texto" value={compañia.valor}>
                        {compañia.valor}
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
            ></input>
          </Col>
        </Row>
        <Row className="mb-3">
          <Col sm={4} xs={12}>
            <label className="forn-label label">
              Producto en informe de gestión financiera{ast}
            </label>
          </Col>
          <Col sm={8} xs={10} style={{ zIndex: 1000 }}>
            <Select
              className="texto"
              required={required}
              onChange={handleChangePDC}
              options={datPDC}
            />
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
            <Link to="ObjetosCosto">
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
