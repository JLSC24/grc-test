import React, { useState, useEffect } from "react";
import { Row, Col, Form, Alert } from "react-bootstrap";
import Switch from "@material-ui/core/Switch";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import { Link, useHistory } from "react-router-dom";
import { Treebeard } from "react-treebeard";

import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";

import MaterialTable from "material-table";
import { forwardRef } from "react";
import Check from "@material-ui/icons/Check";
import Clear from "@material-ui/icons/Clear";
import Edit from "@material-ui/icons/Edit";
import Loader from "react-loader-spinner";

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

export default function NuevaCategoriaRO(props) {
  const serviceAAD = new AADService();
  const [state, setState] = useState("Activo");
  const [idState, setIdState] = useState(true);
  const [datArbol, setDatArbol] = useState([]);
  const [cursor, setCursor] = useState(false);
  const [paises, setPaises] = useState();
  const [supervisores, setSupervisores] = useState();
  const [atributo, setAtributo] = useState(null);
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
    { title: "Nivel 1", field: "nivel1" },
    { title: "Nivel 2", field: "nivel2" },
    {
      title: "Nombre Local Normativo",
      field: "NombreNormativo" /* 
      initialEditValue: "Nombre", */,
    },
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
            id: dat.idcategoria_riesgo,
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
              id: dat.idcategoria_riesgo,
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
        process.env.REACT_APP_API_URL + "/maestros_ro/ArbolCategoriaR/",
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
      const result = await fetch(
        process.env.REACT_APP_API_URL + "/generales/causa/pais/",
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            Authorization: "Bearer " + serviceAAD.getToken(),
          },
        }
      );
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
        { title: "Nivel 1", field: "nivel1" },
        { title: "Nivel 2", field: "nivel2" },
        {
          title: "Nombre Local Normativo",
          field: "NombreNormativo" /* 
          initialEditValue: "Nombre", */,
        },
      ]);
      setPaises(temp);
      setSupervisores(tempUser);
    };
    const datosAtributo = async () => {
      const result = await fetch(
        process.env.REACT_APP_API_URL + "/generales/Categoria_Riesgos/Atributo/",
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            Authorization: "Bearer " + serviceAAD.getToken(),
          },
        }
      );
      let data = await result.json();
      setAtributo(data);
    };
    datosAtributo();
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

    function redirigir(_callback) {
      _callback();
      setTimeout(() => {
        history.push("/EditarCategoriaRO");
      }, 2500);
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
    const data = {
      nombre: document.getElementById("NombreCategoriaRO").value,
      descripcion_categoria_riesgo:
        document.getElementById("Descripcion").value,
      nivel: temp.nivel > 3 ? 3 : temp.nivel,
      atributo: document.getElementById("Atributo").value,
      categoria_riesgos_n1: area(1),
      categoria_riegos_n2: area(2),
      categoria_riesgos_n3: area(3) > 0 ? 0 : area(3),
      estado_riesgo: idState,
      padre: temp.arbol !== null ? temp.arbol[temp.nivel - 2].id : 0,
    };
    /* TODO: enviar supervisor y niveles */
    function sendData2(id_cat_ro) {
      dataGrid.map((dat) => {
        const data2 = {
          id_cat_ro: id_cat_ro,
          pais: paises[dat.pais],
          supervisor: dat.supervisor,
          nivel1: dat.nivel1,
          nivel2: dat.nivel2,
          id_local_normativo: dat.IdLocal,
          nombre_local_normativo: dat.NombreNormativo,
          estado: true,
        };

        fetch(process.env.REACT_APP_API_URL + "/maestros_ro/cat_pais/", {
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
    }
    fetch(process.env.REACT_APP_API_URL + "/maestros_ro/categoria_riesgo/", {
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
            sendData2(response.idcategoria_riesgo);
            limpiar();
            localStorage.setItem("idCategoriaRO", response.idcategoria_riesgo);
            redirigir();
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
          <h1 className="titulo">Creación de una nueva Categoría RO</h1>
        </Col>
      </Row>
      <Form id="formData" onSubmit={(e) => sendData(e)}>
        <Row className="mb-3">
          <Col sm={4} xs={12}>
            <label className="label forn-label">Id Categoría RO</label>
          </Col>
          <Col sm={8} xs={12}>
            <input
              type="text"
              disabled
              className="form-control text-center texto"
              placeholder="ID Automático"
              id="IDcategoriaRO"
            ></input>
          </Col>
        </Row>
        <Row className="mb-3">
          <Col sm={4} xs={12}>
            <label className="form-label label">Nombre Categoría RO*</label>
          </Col>
          <Col sm={8} xs={12}>
            <input
              type="text"
              className="form-control text-center texto"
              placeholder="Nombre de la Categoría"
              required
              id="NombreCategoriaRO"
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
              className="form-control"
              placeholder="Descripción de la Categoría RO"
              rows="3"
              id="Descripcion"
            ></textarea>
          </Col>
        </Row>
        <Row className="mb-3">
          <Col sm={4} xs={12}>
            <label className="form-label label">Nivel de la Categoría*</label>
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
            <label className="forn-label label">Atributo*</label>
          </Col>
          <Col sm={8} xs={10}>
            <select className="form-control texto" required id="Atributo">
              <option value="">Seleccione atributo</option>
              {atributo !== null
                ? atributo.map((atributo) => {
                    return (
                      <option className="texto" value={atributo.valor}>
                        {atributo.valor}
                      </option>
                    );
                  })
                : null}
            </select>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col sm={12} xs={12}>
            <label className="form-label label">
              Homologación de categorías por países*
            </label>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col sm={0} xs={2}></Col>
          <Col sm={12} xs={12} className="contenedorArbol">
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
            <Link to="CategoriasRO">
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
