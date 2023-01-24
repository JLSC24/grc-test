import React, { useState, useEffect, useContext } from "react";
import { Row, Col, Form, Alert, Button, Container } from "react-bootstrap";
import { Link, useHistory } from "react-router-dom";

import axios from "axios";
import AADService from "../auth/authFunctions";

import { UsuarioContext } from "../Context/UsuarioContext";

import { withStyles, makeStyles } from "@material-ui/core/styles";

import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import Checkbox from "@material-ui/core/Checkbox";

import Loader from "react-loader-spinner";
import Select from "react-select";
import makeAnimated from "react-select/animated";

import DateObject from "react-date-object";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import ModalRiesgo from "./ModalRiesgos";
import ModalOrigen from "./Modales/ModalOrigen";
import ModalAsociarOrigen from "./Modales/ModalAsociarOrigen";

const animatedComponents = makeAnimated();
const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: "#2c2a29",
    color: theme.palette.common.white,
  },
}))(TableCell);
const StyledTableRow = withStyles((theme) => ({
  root: {
    backgroundColor: "#f4f4f4",
    heigth: "10px",
  },
}))(TableRow);

const useStyles = makeStyles({
  root: {
    width: "100%",
  },
  container: {
    /* maxHeight: "60vh", */
    minHeight: "20vh",
  },

  MuiTableRow: {
    root: {
      //This can be referred from Material UI API documentation.
      heigth: "10px",
    },
  },
});

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

export default function CrearPlanAccion(props) {
  const { dataUsuario } = useContext(UsuarioContext);
  const serviceAAD = new AADService();

  const classes = useStyles();
  let history = useHistory();

  const [ID, setID] = useState(null);

  const [dataSeguimiento, setDataSeguimiento] = useState([]);

  const [usuario, setUsuario] = useState(null);
  const [dataAnalista, setDataAnalista] = useState(null);
  const [dataResponsable, setDataResponsable] = useState(null);
  const [dataAnalistaSelected, setDataAnalistaSelected] = useState(null);
  const [dataResponsableSelected, setDataResponsableSelected] = useState(null);

  const [showModalR, setShowModalR] = useState(false);
  const [dataR, setDataR] = useState([]);
  const [startDate, setStartDate] = useState(new Date());
  const [compromisoDate, setCompromisoDate] = useState(new Date());

  const [estadoPost, setEstadoPost] = useState({
    alerta: { id: 0, data: null },
  });

  const [habilitarBoton, setHabilitarBoton] = useState(true);

  const [riesgosGestionados, setDatRiesgosGestionados] = useState([]);

  const [programa, setPrograma] = useState(null);

  const [dataOrigen, setDataOrigen] = useState([]);
  const [showModalOrigen, setShowModalOrigen] = useState(false);
  const [dataOrigenSelected, setDataOrigenSelected] = useState(null);
  const [showModalAsociarOrigen, setShowModalAsociarOrigen] = useState(false);

  const [listaAnalistas, setListaAnalistas] = useState([]);
  const [listaAnalistasFiltrados, setListaAnalistasFiltrados] = useState([]);

  const [origenSelected, setOrigenSelected] = useState([]);
  const [showDesasociarOrigen, setShowDesasociarOrigen] = useState(false);
  const [showEditarOrigen, setShowEditarOrigen] = useState(false);

  const [ubicacion, setUbicacion] = useState(null);
  const [stringPrograma, setStringPrograma] = useState(null);

  const [listaTipoUbicacion, setListaTipoUbicacion] = useState([
    { value: 1, label: "País" },
    { value: 2, label: "Compañia" },
  ]);
  const [listaUbicacion, setListaUbicacion] = useState([]);

  const [listaCompanias, setListaCompanias] = useState([]);
  const [listaPaises, setListaPaises] = useState([]);

  const [tipoUbicacion, setTipoUbicacion] = useState([]);

  useEffect(() => {
    async function getCompanias() {
      try {
        const response = await axios.get(
          process.env.REACT_APP_API_URL + "/maestros_ro/compania/",
          {
            headers: {
              Authorization: "Bearer " + serviceAAD.getToken(),
            },
          }
        );

        let companias = response.data.map(
          ({ idcompania: value, compania: label, pais }) => ({
            value,
            label,
            pais,
          })
        );

        let nombreCompañia = companias.filter(
          (compania) => compania.value == dataUsuario.idcompania
        );

        let id =
          "PA-" +
          dataUsuario.email.split("@")[0] +
          "-" +
          Date.now().toString().slice(-7);

        setID(id);
      } catch (error) {
        console.error(error);
      }
    }
    const GetUser = async () => {
      const result = await fetch(
        process.env.REACT_APP_API_URL + "/usuario/" + serviceAAD.getUser().userName + "/",
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            Authorization: "Bearer " + serviceAAD.getToken(),
          },
        }
      );
      let data = await result.json();
      setUsuario(data);
    };
    const GetUsuariosAnalista = async () => {
      let tempUsers = [];
      const result = await fetch(process.env.REACT_APP_API_URL + "/usuariosrol/0/4", {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: "Bearer " + serviceAAD.getToken(),
        },
      });
      let data = await result.json();

      const result2 = await fetch(process.env.REACT_APP_API_URL + "/usuariosrol/0/12", {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: "Bearer " + serviceAAD.getToken(),
        },
      });
      let data2 = await result2.json();

      data = data.concat(data2);
      data.map((datUser) => {
        tempUsers.push({ value: datUser.idusuario, label: datUser.nombre });
      });
      setDataAnalista(tempUsers);

      //---------------------- Analistas con  riesgos gestionados

      const result3 = await fetch(process.env.REACT_APP_API_URL + "/riesgosgestionados/", {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: "Bearer " + serviceAAD.getToken(),
        },
      });

      let data3 = await result3.json();

      let RG = data3.map(
        ({ idusuario: value, nombre: label, riesgos_gestionados }) => ({
          value,
          label,
          riesgos_gestionados,
        })
      );
      setListaAnalistas(RG);

      //----------------------
    };
    const GetUsuariosResponsable = async () => {
      const result = await fetch(process.env.REACT_APP_API_URL + "/usuariosrol/0/3", {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: "Bearer " + serviceAAD.getToken(),
        },
      });

      let data = await result.json();

      console.log(data);

      let temp = data.map(
        ({
          idposicion: value,
          nombre: label,
          area_organizacional,
          n1_vicepresidencia_corporativa,
        }) => ({
          value,
          label,
          area_organizacional,
          n1_vicepresidencia_corporativa,
        })
      );

      setDataResponsable(temp);
    };
    const riesgosGestionados = async () => {
      const result = await fetch(process.env.REACT_APP_API_URL + "/maestros_ro/aristas/", {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: "Bearer " + serviceAAD.getToken(),
        },
      });
      let data = await result.json();
      let temp = [];
      data.map((dat) => {
        temp.push({ value: dat.idaristas, label: dat.nombre });
        return null;
      });
      setDatRiesgosGestionados(temp);
    };
    async function getData() {
      try {
        const response1 = await axios.get(
          process.env.REACT_APP_API_URL + "/maestros_ro/compania/",
          {
            headers: {
              Authorization: "Bearer " + serviceAAD.getToken(),
            },
          }
        );

        const response2 = await axios.get(
          process.env.REACT_APP_API_URL + "/generales/Causa/Pais",
          {
            headers: {
              Authorization: "Bearer " + serviceAAD.getToken(),
            },
          }
        );

        let data1 = response1.data.map(
          ({ idcompania: value, compania: label, pais }) => ({
            value,
            label,
            pais,
          })
        );

        setListaCompanias(data1);

        let data2 = response2.data.map(
          ({ parametro: value, valor: label }) => ({
            value,
            label,
          })
        );
        setListaPaises(data2);
      } catch (error) {
        console.error(error);
      }
    }

    getData();
    GetUser();
    getCompanias();
    riesgosGestionados();
    GetUsuariosAnalista();
    GetUsuariosResponsable();

    getData();
  }, []);

  const sendData = (e) => {
    e.preventDefault();
    setHabilitarBoton(false);

    async function limpiar(state) {
      setTimeout(() => {
        setHabilitarBoton(true);
        setEstadoPost({ id: 0, data: null });
      }, 3000);
    }
    const timeElapsed = Date.now();
    const today = new Date(timeElapsed);

    let fechaISOinicial = today.toISOString();

    function formatoFecha(fecha) {
      return fecha.split("T")[0];
    }

    let riesgosPATemp = [];

    dataR.map((dat) => {
      riesgosPATemp.push({
        idplanaccionporriesgo: 0,
        idplanaccion: 0,
        idriesgo: dat.idriesgo,
        fechacreacion: fechaISOinicial,
        idusuariocreacion: usuario.idusuario,
        fechamodificacion: fechaISOinicial,
        idusuariomodificacion: usuario.idusuario,
        estadoasociacion: 1,
      });
    });

    var data = {
      idplanaccion: 0,
      nombre: document.getElementById("NombrePlanAcción").value,
      descripcion: document.getElementById("DescripcionPlan").value,
      fechainicio: formatoFecha(startDate.toISOString()),
      fechacompromisoinicial: formatoFecha(compromisoDate.toISOString()),
      fechacompromisoactual: formatoFecha(compromisoDate.toISOString()),
      //Hay que revisar en la base de datos que este campo pueda ser null
      fechafinalizacion: formatoFecha(compromisoDate.toISOString()),
      estadopa: "Creado",
      porcentajeavance: 0.0,
      idposicionresponsablepa: dataResponsableSelected.value,
      idanalistariesgos: dataAnalistaSelected.value,
      fechacreacion: fechaISOinicial,
      idusuariocreacion: usuario.idusuario,
      fechamodificacion: fechaISOinicial,
      idusuariomodificacion: usuario.idusuario,
      Planaccionporriesgo: riesgosPATemp,
      Planaccionporvulnenotecnica: null,
      Planaccionporvulnetecnica: null,
      programa: programa ? programa.label : null,
      Origen: dataOrigen ? dataOrigen : null,

      tipo_lugar: ubicacion ? ubicacion.value : null,
      lugar: ubicacion ? ubicacion.label : null,
      programa: stringPrograma ? stringPrograma : null,
    };

    console.log("datos a enviar al back : ", data);

    fetch(process.env.REACT_APP_API_URL + "/plandeAccion/0/", {
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
            localStorage.setItem("idPlanAccion", response.idplanaccion);

            console.log("idPlanAccion", response.idplanaccion);
            setEstadoPost({ id: 2, data: data });
            limpiar();
            localStorage.setItem("idPlanAccion", response.idplanaccion);
            history.push("/editarPlanAccion");
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
      });
  };

  const MySelect = (props) => (
    <Select
      {...props}
      className="texto"
      defaultValue={props.defaultValue}
      options={props.options}
      placeholder={props.placeholder}
    />
  );

  const Filtrar = (e) => {
    setTipoUbicacion(e);

    setUbicacion(null);

    console.log(e.label);

    switch (e.label) {
      case "País":
        setListaUbicacion(listaPaises);
        break;
      case "Compañia":
        setListaUbicacion(listaCompanias);
        console.log(listaCompanias);
        break;

      default:
        setUbicacion(null);
        break;
    }

    console.log(listaCompanias);
  };

  const FilterProgramaSelected = (objArrayPrograma) => {
    //Borrar el analista seleccionado anteriormente

    setDataAnalistaSelected([]);
    //Obtener la lista en formato string de los programas para enviar al back
    let string = objArrayPrograma.map((obj) => obj.label).join(",");
    setStringPrograma(string);
    //Función para sobreescribir los objetos existentes del multiselect en la variable de estado
    let programas = [];
    objArrayPrograma.map((a) => programas.push(a));
    setPrograma(programas);
    //Función para convertir la propiedad de ".riesgos_gestionados" en un arreglo de objetos
    let analistas = listaAnalistas;
    let analistasFormatoObjArray = [];
    var rg = [];

    analistas.forEach((analista) => {
      //Verificar que la propiedad ".riesgos_gestionados" sea diferente de null
      if (analista.riesgos_gestionados !== null) {
        //Convertir el string en un array de strings
        var stringArray = analista.riesgos_gestionados.split(",");
        //Generar el array de objetos
        stringArray.forEach((string) => {
          rg.push({ value: string });
        });
        //Crear el nuevo vector con el formato deseado
        analistasFormatoObjArray.push({
          value: analista.value,
          label: analista.label,
          riesgos_gestionados: rg,
        });

        rg = [];
      }
    });
    //Función para filtrar la lista de analistas dependiendo del programa
    let filteredListAnalistas = [];
    programas.forEach((programa) => {
      analistasFormatoObjArray.forEach((analista) => {
        if (
          analista.riesgos_gestionados.some(
            (riesgoGest) => riesgoGest.value === programa.label
          )
        ) {
          filteredListAnalistas.push(analista);
        }
      });
    });

    setListaAnalistasFiltrados(filteredListAnalistas);
  };

  const isSelectedOrigen = (name) => origenSelected.indexOf(name) !== -1;

  const handleClickOrigen = (event, name) => {
    const selectedIndex = origenSelected.indexOf(name);

    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat([], name);
      setShowDesasociarOrigen(true);
      setShowEditarOrigen(true);
    } else {
      setShowDesasociarOrigen(false);
      setShowEditarOrigen(false);
    }

    setOrigenSelected(newSelected);
  };

  const DesasociarOrigen = () => {
    let newObjArray = dataOrigen.filter((e) => e.idorigen != origenSelected);
    setDataOrigen(newObjArray);
    setOrigenSelected([]);
    setShowEditarOrigen(false);
    setShowDesasociarOrigen(false);
  };

  const EditarOrigen = () => {
    setShowModalOrigen(true);
  };

  return (
    <>
      <AlertDismissibleExample alerta={estadoPost} />

      <Container fluid>
        <Form id="formData" onSubmit={(e) => sendData(e)}>
          <ModalOrigen
            show={showModalOrigen}
            setShowModalOrigen={setShowModalOrigen}
            setDataOrigen={setDataOrigen}
            dataOrigen={dataOrigen}
            origenSelected={origenSelected}
            setOrigenSelected={setOrigenSelected}
            onHide={() => {
              setShowModalOrigen(false);
            }}
          />

          <ModalAsociarOrigen
            show={showModalAsociarOrigen}
            onHide={() => setShowModalAsociarOrigen(false)}
            dataOrigen={dataOrigen}
            setDataOrigen={setDataOrigen}
          />

          <ModalRiesgo
            showModalR={showModalR}
            setShowModalR={setShowModalR}
            dataR={dataR}
            setDataR={setDataR}
          ></ModalRiesgo>

          <Row className="mb-3">
            <Col sm={8} xs={12}>
              <h1 className="titulo">Nuevo Plan de Acción </h1>
            </Col>

            {habilitarBoton ? (
              <Col sm={2} xs={12}>
                {props.permisos.crear ? (
                  <button type="submit" className="btn botonPositivo" id="send">
                    Guardar
                  </button>
                ) : null}
              </Col>
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

            <Col sm={2} xs={12}>
              <Link to="Planes_de_Accion">
                <button type="button" className="btn botonNegativo">
                  Cancelar
                </button>
              </Link>
            </Col>
          </Row>

          <hr />
          <br />

          <Row className="mb-3">
            <Col sm={3} xs={12}>
              <label className="form-label label">Nombre Plan de Acción*</label>
            </Col>
            <Col sm={9} xs={10}>
              <input
                type="text"
                className="form-control text-center texto"
                placeholder="Nombre Plan de Acción"
                id="NombrePlanAcción"
              ></input>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col sm={3} xs={12}>
              <label className="label forn-label">Descripción*</label>
            </Col>
            <Col sm={9} xs={12}>
              <textarea
                className="form-control text-center"
                placeholder="Descripción del Plan de Acción"
                rows="3"
                id="DescripcionPlan"
              ></textarea>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col sm={3} xs={12}>
              <label className="label forn-label">Programa*</label>
            </Col>
            <Col sm={9} xs={12}>
              <Select
                isMulti
                components={animatedComponents}
                options={riesgosGestionados}
                onChange={(e) => {
                  FilterProgramaSelected(e);
                }}
                value={programa}
                placeholder="Seleccione el programa"
              />
            </Col>
          </Row>

          <Row className="mb-3">
            <Col sm={3} xs={12}>
              <label className="label forn-label">Estado</label>
            </Col>

            <Col sm={3} xs={12}>
              <input
                type="text"
                disabled
                className="form-control text-center texto"
                placeholder="Estado"
                id="estado"
              ></input>
            </Col>

            <Col sm={3} xs={12}>
              <label className="label forn-label">Porcentaje de Avance</label>
            </Col>

            <Col sm={3} xs={12}>
              <input
                type="text"
                disabled
                className="form-control text-center texto"
                placeholder="%"
                id="porcentaje"
              ></input>
            </Col>
          </Row>

          <Row className="mb-3 mt-3">
            <Col sm={3} xs={12}>
              <label className="forn-label label">Tipo Ubicación*</label>
            </Col>

            <Col sm={3} xs={12}>
              <Select
                components={animatedComponents}
                options={listaTipoUbicacion}
                placeholder="País/Compañía"
                onChange={Filtrar}
                value={tipoUbicacion}
              />
            </Col>

            <Col sm={3} xs={12}>
              <label className="forn-label label">Ubicación*</label>
            </Col>

            <Col sm={3} xs={12}>
              <Select
                components={animatedComponents}
                options={listaUbicacion}
                placeholder="Ubicación"
                onChange={(e) => {
                  setUbicacion({ value: tipoUbicacion.label, label: e.label });
                }}
                value={ubicacion}
              />
            </Col>
          </Row>

          <Row className="mb-3">
            <Col sm={3} xs={12}>
              <label className="label forn-label">
                Responsable del Plan de Acción*
              </label>
            </Col>
            <Col sm={3} xs={12}>
              <Select
                onChange={(e) => {
                  setDataResponsableSelected(e);
                }}
                components={animatedComponents}
                options={dataResponsable}
                placeholder={"Seleccione"}
              />
            </Col>
            <Col sm={3} xs={12}>
              <label className="label forn-label">Analista de Riesgo*</label>
            </Col>
            <Col sm={3} xs={12}>
              <MySelect
                placeholder={"Seleccione"}
                onChange={(e) => {
                  setDataAnalistaSelected(e);
                }}
                defaultValue={dataAnalistaSelected}
                components={animatedComponents}
                className="texto"
                options={listaAnalistasFiltrados}
              />
            </Col>
          </Row>

          <Row className="mb-3">
            <Col sm={3} xs={12}>
              <label className="label forn-label">
                Vicepresidencia responsable
              </label>
            </Col>
            <Col sm={3} xs={12}>
              <input
                disabled
                type="text"
                className="form-control text-center texto"
                placeholder="Vicepresidencia Responsable"
                value={
                  dataResponsableSelected
                    ? dataResponsableSelected.n1_vicepresidencia_corporativa
                    : null
                }
              />
            </Col>

            <Col sm={3} xs={12}>
              <label className="label forn-label">Área Responsable</label>
            </Col>
            <Col sm={3} xs={12}>
              <input
                disabled
                type="text"
                className="form-control text-center texto"
                placeholder="Área Responsable"
                value={
                  dataResponsableSelected
                    ? dataResponsableSelected.area_organizacional
                    : null
                }
              />
            </Col>
          </Row>

          <Row className="mb-3">
            <Col sm={3} xs={12}>
              <label className="label forn-label">Fecha Inicio*</label>
            </Col>
            <Col sm={3} xs={12}>
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
            <Col sm={3} xs={12}>
              <label className="label forn-label">Compromiso Inicial*</label>
            </Col>
            <Col sm={3} xs={12}>
              <DatePicker
                className="form-control"
                selected={compromisoDate}
                onChange={(date) => setCompromisoDate(date)}
                id="fechaIni"
                required
              ></DatePicker>
              <Form.Control.Feedback type="invalid">
                Por favor introduzca la fecha de inicio.
              </Form.Control.Feedback>
            </Col>
          </Row>

          <br />
          <hr />

          <Row className="mb-3">
            <Col sm={6} xs={12}>
              <label className="form-label label">
                Origen del plan de acción
              </label>
            </Col>

            <Col sm={2} xs={12}>
              {showEditarOrigen ? (
                <button
                  type="button"
                  className="btn botonNegativo"
                  onClick={EditarOrigen}
                >
                  Editar origen
                </button>
              ) : (
                <button
                  type="button"
                  className="btn botonPositivo"
                  onClick={setShowModalOrigen}
                >
                  Crear origen
                </button>
              )}
            </Col>

            <Col sm={2} xs={12}>
              <button
                type="button"
                className="btn botonPositivo"
                onClick={setShowModalAsociarOrigen}
              >
                Asociar origen
              </button>
            </Col>

            <Col sm={2} xs={12}>
              {showDesasociarOrigen ? (
                <button
                  type="button"
                  className="btn botonNegativo"
                  onClick={DesasociarOrigen}
                >
                  Desasociar origen
                </button>
              ) : null}
            </Col>
          </Row>

          <Paper className={classes.root}>
            <TableContainer component={Paper} className={classes.container}>
              <Table>
                {/* Inicio de encabezado */}
                <TableHead className="titulo">
                  <TableRow>
                    <StyledTableCell padding="checkbox"></StyledTableCell>
                    <StyledTableCell align="left">ID Origen</StyledTableCell>
                    <StyledTableCell align="left">Origen</StyledTableCell>
                    <StyledTableCell align="left">Descripción</StyledTableCell>
                    <StyledTableCell align="left">ID Informe</StyledTableCell>
                    <StyledTableCell align="left">Fecha</StyledTableCell>
                    <StyledTableCell align="left">Creador</StyledTableCell>
                    <StyledTableCell align="left">Adjunto</StyledTableCell>
                    <StyledTableCell align="left">Estado</StyledTableCell>
                  </TableRow>
                </TableHead>
                {/* Fin de encabezado */}
                {/* Inicio de cuerpo de la tabla */}
                <TableBody>
                  {dataOrigen.map((row, index) => {
                    const isItemSelectedOrigen = isSelectedOrigen(row.idorigen);
                    return (
                      <StyledTableRow
                        key={row.idOrigen}
                        hover
                        onClick={(event) =>
                          handleClickOrigen(event, row.idorigen)
                        }
                        role="checkbox"
                        tabIndex={-1}
                      >
                        <StyledTableCell component="th" scope="row">
                          <Checkbox checked={isItemSelectedOrigen} />
                        </StyledTableCell>

                        <StyledTableCell component="th" scope="row">
                          {row.idorigen ? row.idorigen : null}
                        </StyledTableCell>
                        <StyledTableCell align="left">
                          {row.origen ? row.origen : null}
                        </StyledTableCell>

                        <StyledTableCell component="th" scope="row">
                          {row.descripcion ? row.descripcion : null}
                        </StyledTableCell>

                        <StyledTableCell component="th" scope="row">
                          {row.id_informe ? row.id_informe : null}
                        </StyledTableCell>

                        <StyledTableCell component="th" scope="row">
                          {row.fecha ? row.fecha : null}
                        </StyledTableCell>

                        <StyledTableCell component="th" scope="row">
                          {row.creador ? row.creador : null}
                        </StyledTableCell>

                        <StyledTableCell align="left">
                          {row.link ? (
                            <a href={row.link}>{row.adjunto}</a>
                          ) : null}
                        </StyledTableCell>
                        <StyledTableCell align="left">
                          {row.estado === 1 ? "Activo" : "Inactivo"}
                        </StyledTableCell>
                      </StyledTableRow>
                    );
                  })}
                </TableBody>
                {/* Fin de cuerpo de la tabla */}
              </Table>
            </TableContainer>
          </Paper>

          <br />
          <hr />

          <Row className="mb-3">
            <Col sm={8} xs={2}>
              <label className="form-label label">
                Riesgos asociados al Plan de Acción
              </label>
            </Col>
            <Col sm={2} xs={4}></Col>
            <Col sm={2} xs={4}>
              <button
                type="button"
                className="btn botonNegativo3"
                onClick={() => setShowModalR(true)}
              >
                Añadir
              </button>
            </Col>
          </Row>
          <Paper className={classes.root}>
            <TableContainer component={Paper} className={classes.container}>
              <Table className={"text"} stickyHeader aria-label="sticky table">
                {/* Inicio de encabezado */}
                <TableHead className="titulo">
                  <TableRow>
                    <StyledTableCell padding="checkbox"></StyledTableCell>
                    <StyledTableCell align="left">ID Riesgo</StyledTableCell>
                    <StyledTableCell align="left">Riesgo</StyledTableCell>
                    <StyledTableCell align="left">ID Decisión</StyledTableCell>
                    <StyledTableCell align="left">Decisión</StyledTableCell>
                    <StyledTableCell align="left">
                      Tipo de Elemento
                    </StyledTableCell>
                    <StyledTableCell align="left">
                      Elemento Principal
                    </StyledTableCell>
                    <StyledTableCell align="left">Responsable</StyledTableCell>
                  </TableRow>
                </TableHead>
                {/* Fin de encabezado */}
                {/* Inicio de cuerpo de la tabla */}
                <TableBody>
                  {dataR.map((row, index) => {
                    return (
                      <StyledTableRow
                        key={row.idriesgo}
                        hover
                        role="checkbox"
                        tabIndex={-1}
                      >
                        <StyledTableCell
                          component="th"
                          scope="row"
                        ></StyledTableCell>
                        <StyledTableCell component="th" scope="row">
                          {row.idriesgo ? row.idriesgo : null}
                        </StyledTableCell>
                        <StyledTableCell align="left">
                          {row.nombre_riesgo ? row.nombre_riesgo : null}
                        </StyledTableCell>
                        <StyledTableCell component="th" scope="row">
                          {row.iddecision ? row.iddecision : null}
                        </StyledTableCell>
                        <StyledTableCell component="th" scope="row">
                          {row.decision ? row.decision : null}
                        </StyledTableCell>
                        <StyledTableCell align="left">
                          {row.tipo_elemento_evaluado
                            ? row.tipo_elemento_evaluado
                            : null}
                        </StyledTableCell>
                        <StyledTableCell align="left">
                          {row.elemento_ppal_evaluado
                            ? row.elemento_ppal_evaluado
                            : null}
                        </StyledTableCell>
                        <StyledTableCell align="left">
                          {row.nombre ? row.nombre : null}
                        </StyledTableCell>
                      </StyledTableRow>
                    );
                  })}
                </TableBody>
                {/* Fin de cuerpo de la tabla */}
              </Table>
            </TableContainer>
          </Paper>

          <br />
          <hr />

          <Row className="mb-3">
            <Col sm={8} xs={12}>
              <h1 className="titulo">Nuevo Plan de Acción</h1>
            </Col>

            {habilitarBoton ? (
              <Col sm={2} xs={12}>
                {props.permisos.crear ? (
                  <button type="submit" className="btn botonPositivo">
                    Guardar
                  </button>
                ) : null}
              </Col>
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

            <Col sm={2} xs={12}>
              <Link to="Planes_de_Accion">
                <button type="button" className="btn botonNegativo">
                  Cancelar
                </button>
              </Link>
            </Col>
          </Row>
        </Form>
      </Container>
    </>
  );
}
