import React, { useState, useEffect } from "react";
import { Row, Col, Form, Alert } from "react-bootstrap";
import Switch from "@material-ui/core/Switch";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import { Link, useHistory } from "react-router-dom";
import Select from "react-select";

import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";

import MaterialTable from "material-table";
import { forwardRef } from "react";
import Check from "@material-ui/icons/Check";
import Clear from "@material-ui/icons/Clear";
import Edit from "@material-ui/icons/Edit";
import makeAnimated from "react-select/animated";
import Loader from "react-loader-spinner";

import { adalApiFetch } from "../auth/adalConfig";
import AADService from "../auth/authFunctions";

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
const animatedComponents = makeAnimated();

export default function NuevaUnidadRO(props) {
  const serviceAAD = new AADService();
  const [state, setState] = useState("Activo");
  const [idState, setIdState] = useState(true);
  const [datEntorno, setDatEntorno] = useState([]);
  const [datEVC, setDatEVC] = useState([]);
  const [datEVCSelect, setDatEVCSelect] = useState([]);
  const [datCompañia, setDatCompañia] = useState([]);
  const [compania, setCompania] = useState([]);
  const [datGerentes, setDatGerentes] = useState(null);
  const [datAnalistas, setDatAnalistas] = useState(null);
  const [aristas, setAristas] = useState([]);
  const [selectedValueGerente, setSelectedValueGerente] = useState(null);
  const [estadoPost, setEstadoPost] = useState({
    alerta: { id: 0, data: null },
  });
  const [habilitarBoton, setHabilitarBoton] = React.useState(true);
  let history = useHistory();

  const [columns, setColumns] = useState([
    {
      title: "Analista de Riesgos",
      field: "pais",
      lookup: datAnalistas,
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

      let companias = data.map(
        ({ idcompania: value, compania: label, pais }) => ({
          value,
          label,
          pais,
        })
      );
      setDatCompañia(companias);
    };
    const datosGerentes = async () => {
      const result = await fetch(process.env.REACT_APP_API_URL + "/usuariosrol/0/2/", {
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
      setDatGerentes(temp);
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
      let temp = {};
      if (data3) {
        data3.map((dat) => {
          temp[dat.idposicion] = dat.nombre;
          return null;
        });
      }
      setColumns([
        {
          title: "Analista de Riesgos",
          field: "analistaRO",
          lookup: temp,
        },
      ]);
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
    const aristas = async () => {
      const result = await fetch(
        process.env.REACT_APP_API_URL + "/maestros_ro/aristas",
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
      data.map((dat) => {
        temp.push({ value: dat.nombre, label: dat.nombre });
        return null;
      });
      setAristas(temp);
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
    aristas();
    analistasRO();
    datosCompañia();
    datosGerentes();
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
    setSelectedValueGerente(e.value);
  };
  const sendData = (e) => {
    e.preventDefault();
    setHabilitarBoton(false);
    let tempRG = [];
    let companias = [];
    let temp = document.getElementsByName("riesgosGest");
    let temp2 = document.getElementsByName("Compania");
    for (let i = 0; i < aristas.length; i++) {
      if (temp[i]) {
        tempRG.push(temp[i].value);
      }
    }
    for (let i = 0; i < datCompañia.length; i++) {
      if (temp2[i]) {
        companias.push(parseInt(temp2[i].value));
      }
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

    function redirigir(_callback) {
      _callback();
      setTimeout(() => {
        history.push("/EditarUnidadRO");
      }, 2500);
    }

    let entornoTemp = document.getElementById("entorno").value;
    let evcTemp = document.getElementById("evc").value;
    const data = {
      nombre: document.getElementById("NombreUnidadRO").value,
      //compañia: parseInt(document.getElementById("Compania").value),
      //gerente_riesgo: 99999999,
      idcompania: companias,
      gerente_riesgo: selectedValueGerente,
      estado_riesgo: idState,
      riesgos_gestionados: tempRG.toString(),
      entorno: entornoTemp ? entornoTemp : null,
      evc: evcTemp ? evcTemp : null,
    };

    function sendData2(idunidad_riesgo) {
      dataGrid.map((dat) => {
        const data2 = {
          idunidad_riesgo: idunidad_riesgo,
          idusuario: parseInt(dat.analistaRO),
        };
        fetch(process.env.REACT_APP_API_URL + "/rxunidad_analista/", {
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
    fetch(process.env.REACT_APP_API_URL + "/maestros_ro/unidad_riesgo/", {
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
            sendData2(response.idunidad_riesgo);
            localStorage.setItem("idUnidad", response.idunidad_riesgo);
            history.push("/EditarUnidadRO");
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
  return (
    <>
      <AlertDismissibleExample alerta={estadoPost} />
      <Row className="mb-3">
        <Col md={12}>
          <h1 className="titulo">Creación de una nueva Unidad de Riesgo</h1>
        </Col>
      </Row>
      <Form id="formData" onSubmit={(e) => sendData(e)}>
        <Row className="mb-3">
          <Col sm={4} xs={12}>
            <label className="label forn-label">Id Unidad de Riesgo</label>
          </Col>
          <Col sm={8} xs={12}>
            <input
              type="text"
              disabled
              className="form-control text-center texto"
              placeholder="ID Automático"
              id="IDunidadRO"
            ></input>
          </Col>
        </Row>
        <Row className="mb-3">
          <Col sm={4} xs={12}>
            <label className="form-label label">Nombre Unidad de Riesgo*</label>
          </Col>
          <Col sm={8} xs={12}>
            <input
              type="text"
              className="form-control text-center texto"
              placeholder="Nombre de Unidad de Riesgo"
              required
              id="NombreUnidadRO"
            ></input>
            <Form.Control.Feedback type="invalid">
              Por favor introduzca un nombre.
            </Form.Control.Feedback>
          </Col>
        </Row>
        <Row className="mb-3">
          <Col sm={4} xs={12}>
            <label className="forn-label label">Compañía*</label>
          </Col>
          <Col sm={8} xs={10}>
            <Select
              /* id={"Compañia"}
              components={animatedComponents}
              isMulti
              value={compania}
              options={datCompañia}
              placeholder={"Seleccione compañia"}
              onChange={(e) => {
                var companias = [];
                e.map((a) => companias.push(a));
                setCompania(companias); 
              }}
              */
              isMulti
              className="texto"
              options={datCompañia}
              name="Compania"
              required
            />
          </Col>
        </Row>

        <Row className="mb-3">
          <Col sm={4} xs={12}>
            <label className="forn-label label">Gerente Riesgos*</label>
          </Col>
          <Col sm={8} xs={10}>
            <Select
              className="texto"
              onChange={handleChange}
              options={datGerentes}
              required
            />
          </Col>
        </Row>
        <Row className="mb-3">
          <Col sm={4} xs={12}>
            <label className="forn-label label">Riesgos gestionados*</label>
          </Col>
          <Col sm={8} xs={10}>
            <Select
              isMulti
              className="texto"
              options={aristas}
              name="riesgosGest"
              required
            />
            {/* <select className="form-control texto" required id="AnalistaRO">
              <option value="">Seleccione riesgo gestionado</option>
              {datRiesgosGestionados !== null
                ? datRiesgosGestionados.map((riesgo) => {
                    return (
                      <option
                        className="texto"
                        value={riesgo.idm_parametrosgenerales}
                      >
                        {riesgo.valor}
                      </option>
                    );
                  })
                : null}
            </select> */}
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
          <Col sm={12} xs={12}>
            <label className="form-label label">Detalles</label>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col sm={2} xs={2}></Col>
          <Col sm={10} xs={12}>
            <MaterialTable
              options={{
                tableLayout: null,
                actionsColumnIndex: -1,
                search: false,
                paging: false,
                sorting: false,
                draggable: false,
                headerStyle: {
                  zIndex: 0,
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
            <Link to="UnidadesRO">
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
