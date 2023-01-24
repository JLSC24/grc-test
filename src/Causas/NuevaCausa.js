import React, { useState, useEffect, forwardRef } from "react";
import {
  Row,
  Col,
  Form,
  Alert,
  Button,
  Container,
  Modal,
} from "react-bootstrap";

import axios from "axios";
import AADService from "../auth/authFunctions";
import { adalApiFetch } from "../auth/adalConfig";

import Switch from "@material-ui/core/Switch";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import { Link, useHistory } from "react-router-dom";
import { Treebeard } from "react-treebeard";

import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";

import MaterialTable from "material-table";

import Check from "@material-ui/icons/Check";
import Clear from "@material-ui/icons/Clear";
import Edit from "@material-ui/icons/Edit";
import Loader from "react-loader-spinner";

import Select from "react-select";
import makeAnimated from "react-select/animated";
const animatedComponents = makeAnimated();

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

export default function NuevaCausa(props) {
  const serviceAAD = new AADService();
  const [state, setState] = useState("Activo");
  const [idState, setIdState] = useState(true);
  const [datArbol, setDatArbol] = useState([]);
  const [cursor, setCursor] = useState(false);
  const [supervisores, setSupervisores] = useState(null);
  const [paises, setPaises] = useState();
  const [clasificacionCausa, setClasificacionCausa] = useState([]);

  const [categoriaCausa, setCategoriaCausa] = useState(null);
  const [nivel, setNivel] = useState(null);
  const [dependencia, setDependencia] = useState(null);
  const [consecuencia, setConsecuencia] = useState(null);

  const [factor, setFactor] = useState(null);
  const [tipo, setTipo] = useState(null);
  const [delitosFuente, setDelitosFuente] = useState(null);
  const [resumen, setResumen] = useState(null);
  const [categoriaCausa2, setCategoriaCausa2] = useState(null);

  const [aristas, setAristas] = useState(null);

  const [isSelectedRO, setIsSelectedRO] = useState(false);

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

  const [estadoPost, setEstadoPost] = useState({
    alerta: { id: 0, data: null },
  });
  const [habilitarBoton, setHabilitarBoton] = React.useState(true);

  let history = useHistory();

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

  const [listaRiesgos, setListaRiesgos] = useState([
    {
      label:
        "Uso indebido de la entidad financiera para el LA con recursos proveniente de delitos relacionados con el comercio exterior",
      value: "Riesgo_001",
    },
    {
      label:
        "Uso indebido de la entidad financiera para el LA con recursos proveniente de delitos fuente u otros delitos",
      value: "Riesgo_002",
    },
    {
      label:
        "Uso indebido de la entidad financiera para el LA/FT con recursos y/o bienes provenientes de delitos contra la administración pública (Corrupción)",
      value: "Riesgo_003",
    },
    {
      label:
        "Uso indebido de la entidad financiera para el LA/FT con recursos proveniente de delitos fuente u otros delitos",
      value: "Riesgo_004",
    },
    {
      label:
        "Uso indebido de la entidad financiera para el LA/FT con recursos y/bienes proveniente de delitos contra el sistema financiero (Captación masiva y habitual entre otros)",
      value: "Riesgo_005",
    },
    {
      label: "Uso indebido de la entidad financiera para el LA",
      value: "Riesgo_006",
    },
    {
      label: "Uso indebido de la entidad financiera para el FT",
      value: "Riesgo_007",
    },
    {
      label: "Uso indebido de la entidad financiera para el FPADM",
      value: "Riesgo_008",
    },
    {
      label:
        "Uso indebido de la entidad financiera para el LA con recursos proveniente del narcotráfico",
      value: "Riesgo_009",
    },
    {
      label:
        "Uso indebido de la entidad financiera para el LA con recursos proveniente de delitos relacionados con el desvío de recursos públicos",
      value: "Riesgo_010",
    },
  ]);

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
            id: dat.idcausa,
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
              id: dat.idcausa,
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
      crearData(data);
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
    const datosCausa = async () => {
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
      setClasificacionCausa(data);
    };

    datosCausa();
    datosPaises();
    datosArbol();
  }, []);

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

  const sendData = (e) => {
    e.preventDefault();
    setHabilitarBoton(false);
    const temp = datosNivel();

    async function limpiar(state) {
      setTimeout(() => {
        // if (state === 2) {
        //   history.push("/EditarAreaOrganizacional");
        // }
        setHabilitarBoton(true);
        setEstadoPost({ id: 0, data: null });
      }, 3000);
    }
    // function redirigir(_callback) {
    //   _callback();
    //   setTimeout(() => {
    //     history.push("/EditarCausa");
    //   }, 2500);
    // }

    const area = (nvArea) => {
      if (temp.arbol !== null && temp.arbol[nvArea - 1] !== undefined) {
        return temp.arbol[nvArea - 1].id;
      } else if (nvArea === temp.nivel) {
        return 0;
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
      estado: idState /* TODO: falta campo en la API */,
      padre: temp.arbol !== null ? temp.arbol[temp.nivel - 2].id : 0,
      clasificacion: document.getElementById("clasificacionCausa").value,
    };

    function sendData2(id_causa) {
      dataGrid.map((dat) => {
        const data2 = {
          id_causa: id_causa,
          pais_causa: paises[dat.pais],
          supervisor: dat.supervisor,
          idcausa_local_normativo: dat.IdLocal,
          nombre_causa_local_normativo: dat.NombreNormativo,
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
          .catch(function (err) {
            console.error(err);
          });
      });
    }
    fetch(process.env.REACT_APP_API_URL + "/maestros_ro/causa/", {
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
            sendData2(response.idcausa);
            localStorage.setItem("idCausa", response.idcausa);
            history.push("/EditarCausa");
            limpiar();
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

  return (
    <>
      <AlertDismissibleExample alerta={estadoPost} />

      <Form id="formData" onSubmit={(e) => sendData(e)}>
        <Row className="mb-3">
          <Col sm={4} xs={12}>
            <h1 className="titulo">Crear causa</h1>
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
              id="IDcausa"
            ></input>
          </Col>

          <Col sm={2} xs={12}>
            <Link to="Causas">
              <button type="button" className="btn botonNegativo">
                Cancelar
              </button>
            </Link>
          </Col>

          {habilitarBoton ? (
            <>
              <Col sm={2} xs={12}>
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
        </Row>

        <hr />
        <br />

        <Row className="mb-3">
          <Col sm={col1} xs={12}>
            <label className="form-label label">Nombre Causa*</label>
          </Col>
          <Col sm={col2} xs={12}>
            <input
              type="text"
              className="form-control text-center texto"
              placeholder="Nombre de la Causa"
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
            <label className="form-label label">Descripción</label>
          </Col>
          <Col sm={col2} xs={12}>
            <textarea
              className="form-control"
              placeholder="Descripción de la Causa"
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
            <select className="form-control texto" id="clasificacionCausa">
              <option value="">Seleccione clasificación</option>
              {clasificacionCausa !== null
                ? clasificacionCausa.map((clasificacion) => {
                    return (
                      <option className="texto" value={clasificacion.valor}>
                        {clasificacion.valor}
                      </option>
                    );
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
            <Select
              isMulti
              components={animatedComponents}
              options={listaAristas}
              value={aristas}
              onChange={(e) => {
                var aristas = [];

                e.map((a) => aristas.push(a));

                FiltrarAristas(aristas);
              }}
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
      </Form>
    </>
  );
}
