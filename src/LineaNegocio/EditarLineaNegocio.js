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
      return <Alert variant="success">Guard?? exitosamente</Alert>;
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
          Ya existe una evaluaci??n para el activo seleccionado
        </Alert>
      );
      break;
    default:
      return <p></p>;
      break;
  }
}

export default function EditarLineaNegocio(props) {
  const serviceAAD = new AADService();
  const [state, setState] = useState("Activo");
  const [idState, setIdState] = useState(true);
  const [datArbol, setDatArbol] = useState([]);
  const [cursor, setCursor] = useState(false);
  const [supervisores, setSupervisores] = useState(null);
  const [paises, setPaises] = useState();
  const [estadoPost, setEstadoPost] = useState({
    alerta: { id: 0, data: null },
  });
  const [datLineaNegocio, setDatLineaNegocio] = useState(null);
  let history = useHistory();

  const [columns, setColumns] = useState([
    {
      title: "Pa??s",
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
  const [dataGridTemp, setDataGridTemp] = useState([]);
  const [dataGridUpdate, setDataGridUpdate] = useState([]);
  const [dataGridDelete, setDataGridDelete] = useState([]);

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
            id: dat.idln,
            active: selectedData.padres[0] === dat.idln ? false : false,
            toggled: selectedData.padres[0] === dat.idln ? true : false,
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
              id: dat.idln,
              active:
                selectedData.padres[0] === dat.idln ||
                selectedData.padres[1] === dat.idln ||
                selectedData.padres[2] === dat.idln
                  ? false
                  : false,
              toggled:
                selectedData.padres[0] === dat.idln ||
                selectedData.padres[1] === dat.idln ||
                selectedData.padres[2] === dat.idln
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

  useEffect(() => {
    let paisesAll = [];
    let selectedData;
    const datosLineaNegocio = async () => {
      const result = await fetch(
        process.env.REACT_APP_API_URL + "/maestros_ro/ln/" +
          localStorage.getItem("idLineaNegocio") +
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
        padres: [data.ln_n1, data.ln_n2, data.ln_n3],
        nivel: data.nivel,
        id: data.idln,
      };
      setDatLineaNegocio(data);
    };
    const datosArbol = async () => {
      await datosLineaNegocio();
      const result = await fetch(process.env.REACT_APP_API_URL + "/maestros_ro/ArbolLN/", {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: "Bearer " + serviceAAD.getToken(),
        },
      });
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
          title: "Pa??s",
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
    const datosGrid = async () => {
      await datosPaises();
      const result = await fetch(
        process.env.REACT_APP_API_URL + "/maestros_ro/ln_pais/" +
          localStorage.getItem("idLineaNegocio") +
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
          if (paisesAll[i].valor == data.pais_ln) {
            temp = paisesAll[i].idm_parametrosgenerales;
          }
        }

        return temp;
      };
      let temp = [];
      if (data !== null) {
        data.map((dat) => {
          if (dat.estado === true) {
            temp.push({
              id: dat.idln_pais,
              supervisor: dat.supervisor,
              pais: buscarPais(dat),
              IdLocal: dat.idln_local_normativo,
              nivel1: dat.nivel1,
              nivel2: dat.nivel2,
              NombreNormativo: dat.nombreln_local_normativo,
            });
          }
        });
      }
      setDataGrid(temp);
      setDataGridTemp(temp);
    };
    datosGrid();
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
      temp = [bChildren(datLineaNegocio.idln, datArbol.children)];
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
      if (temp[0].padre !== 0 && temp[0].padre) {
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
        pais_ln: paises[data.pais],
        supervisor: data.supervisor,
        nivel1: data.nivel1,
        nivel2: data.nivel2,
        idln_local_normativo: data.IdLocal,
        nombreln_local_normativo: data.NombreNormativo,
      });
      setDataGridUpdate(temp);
    } else if (pertenece) {
      let temp = dataGridDelete;
      temp.push({
        id: data.id,
        estado: estado,
        pais_ln: paises[data.pais],
        idln_local_normativo: data.IdLocal,
        supervisor: data.supervisor,
        nivel1: data.nivel1,
        nivel2: data.nivel2,
        nombreln_local_normativo: data.NombreNormativo,
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
    function redirigir(_callback) {
      _callback();
      setTimeout(() => {
        history.push("/EditarLineaNegocio");
      }, 2500);
    }
    function limpiar(_callback) {
      _callback();
      setTimeout(() => {
        setEstadoPost({ id: 0, data: null });
      }, 2000);
    }

    const area = (nvArea) => {
      if (temp.arbol !== null && temp.arbol[nvArea - 1] !== undefined) {
        return temp.arbol[nvArea - 1].id;
      } else if (nvArea === temp.nivel) {
        return datLineaNegocio.idln;
      } else {
        return null;
      }
    };
    const data = {
      nombre: document.getElementById("NombreLN").value,
      descripcion_ln: document.getElementById("Descripcion").value,
      nivel: temp.nivel,
      ln_n1: area(1),
      ln_n2: area(2),
      ln_n3: area(3) > 0 ? 0 : area(3),
      estado: idState,
      padre:
        temp.arbol !== null
          ? temp.arbol[temp.nivel - 2]
            ? temp.arbol[temp.nivel - 2].id
            : temp.arbol[temp.arbol.length - 1].padre
          : 0,
    };

    function sendData2(idln) {
      tempDataGridNew.map((data) => {
        const data2 = {
          id_ln: idln,
          estado: true,
          pais_ln: paises[data.pais_ln],
          supervisor: data.supervisor,
          nivel1: data.nivel1,
          nivel2: data.nivel2,
          idln_local_normativo: data.idln_local_normativo,
          nombreln_local_normativo: data.nombreln_local_normativo,
        };
        fetch(process.env.REACT_APP_API_URL + "/maestros_ro/ln_pais/" + idln + "/", {
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
      dataGridDelete.map((data) => {
        const data2 = {
          id_ln: idln,
          pais_ln: data.pais_ln,
          supervisor: data.supervisor,
          nivel1: data.nivel1,
          nivel2: data.nivel2,
          idln_local_normativo: data.idln_local_normativo,
          nombreln_local_normativo: data.nombreln_local_normativo,
          estado: data.estado,
        };
        fetch(process.env.REACT_APP_API_URL + "/maestros_ro/ln_pais/" + data.id + "/", {
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
          .catch(function (err) {
            console.error(err);
          });
      });
      dataGridUpdate.map((data) => {
        const data2 = {
          id_ln: idln,
          pais_ln: data.pais_ln,
          supervisor: data.supervisor,
          nivel1: data.nivel1,
          nivel2: data.nivel2,
          idln_local_normativo: data.idln_local_normativo,
          nombreln_local_normativo: data.nombreln_local_normativo,
          estado: data.estado,
        };
        fetch(process.env.REACT_APP_API_URL + "/maestros_ro/ln_pais/" + data.id + "/", {
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
          .catch(function (err) {
            console.error("actualizando", err);
          });
      });
    }
    fetch(
      process.env.REACT_APP_API_URL + "/maestros_ro/ln/" + datLineaNegocio.idln + "/",
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
            sendData2(response.idln);
            localStorage.setItem("idLineaNegocio", response.idln);
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
      .catch(function (err) {
        console.error(err);
      });
  };
  return (
    <>
      <AlertDismissibleExample alerta={estadoPost} />
      <Row className="mb-3">
        <Col md={12}>
          <h1 className="titulo">Edici??n de una L??nea de Negocio</h1>
        </Col>
      </Row>
      <Form id="formData" onSubmit={(e) => sendData(e)}>
        <Row className="mb-3">
          <Col sm={4} xs={12}>
            <label className="label forn-label">Id L??nea de Negocio</label>
          </Col>
          <Col sm={8} xs={12}>
            <input
              type="text"
              disabled
              className="form-control text-center texto"
              placeholder="ID Autom??tico"
              defaultValue={
                datLineaNegocio !== null ? datLineaNegocio.idln : null
              }
              id="IDcategoriaRO"
            ></input>
          </Col>
        </Row>
        <Row className="mb-3">
          <Col sm={4} xs={12}>
            <label className="form-label label">Nombre L??nea de Negocio*</label>
          </Col>
          <Col sm={8} xs={12}>
            <input
              type="text"
              className="form-control text-center texto"
              placeholder="Nombre de la Categor??a"
              defaultValue={
                datLineaNegocio !== null ? datLineaNegocio.nombre : null
              }
              required
              id="NombreLN"
            ></input>
            <Form.Control.Feedback type="invalid">
              Por favor introduzca un nombre.
            </Form.Control.Feedback>
          </Col>
        </Row>
        <Row className="mb-3">
          <Col sm={4} xs={12}>
            <label className="form-label label">Descripci??n</label>
          </Col>
          <Col sm={8} xs={12}>
            <textarea
              className="form-control text-center"
              placeholder="Descripci??n de la Categor??a RO"
              defaultValue={
                datLineaNegocio !== null ? datLineaNegocio.descripcion_ln : null
              }
              rows="3"
              id="Descripcion"
            ></textarea>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col sm={4} xs={12}>
            <label className="form-label label">Selecci??n de nivel*</label>
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
          <Col sm={12} xs={12}>
            <label className="form-label label">
              Homologaci??n de LN por pa??ses*
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
                },
                rowStyle: {
                  backgroundColor: "#f4f4f4",
                },
              }}
              localization={{
                body: {
                  emptyDataSourceMessage: "No hay datos por mostrar",
                  addTooltip: "A??adir",
                  deleteTooltip: "Eliminar",
                  editTooltip: "Editar",
                  filterRow: {
                    filterTooltip: "Filtrar",
                  },
                  editRow: {
                    deleteText: "??Segura(o) que quiere eliminar?",
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
          <Col sm={3} xs={3}>
            {props.permisos.editar ? (
              <button type="submit" className="btn botonPositivo" id="send">
                Guardar
              </button>
            ) : null}
          </Col>
          <Col sm={3} xs={3}>
            <Link to="LineasNegocio">
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
