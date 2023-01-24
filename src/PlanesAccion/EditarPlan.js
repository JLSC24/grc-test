import React, { useState, useEffect } from "react";
import { useForm, Controller, useWatch, FormProvider } from "react-hook-form";
import { Row, Col, Form, Alert, Button, Container } from "react-bootstrap";
import { Link, useHistory } from "react-router-dom";

import axios from "axios";
import AADService from "../auth/authFunctions";

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
import ModalSeguimiento from "./ModalSeguimiento";
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

export default function EditarPlanAccion(props) {
  const serviceAAD = new AADService();
  const classes = useStyles();

  const [dataSeguimiento, setDataSeguimiento] = React.useState([]);
  const [usuario, setUsuario] = React.useState(null);
  const [dataAnalista, setDataAnalista] = React.useState(null);
  const [dataResponsable, setDataResponsable] = React.useState(null);
  const [dataAnalistaSelected, setDataAnalistaSelected] = React.useState(null);
  const [dataResponsableSelected, setDataResponsableSelected] =
    React.useState(null);

  const [showModalR, setShowModalR] = React.useState(false);
  const [dataR, setDataR] = React.useState([]);
  const [dataRinicial, setDataRinicial] = React.useState([]);
  const [showModalS, setShowModalS] = React.useState(false);
  const [dataS, setDataS] = React.useState([]);
  const [dataPA, setDataPA] = React.useState(null);

  const [fechaFinalizacion, setFechaFinalizacion] = useState(null);
  const [compromisoActual, setCompromisoActual] = useState(new Date());

  const [estadoPost, setEstadoPost] = useState({
    alerta: { id: 0, data: null },
  });
  const [habilitarBoton, setHabilitarBoton] = React.useState(true);

  const [riesgosGestionados, setDatRiesgosGestionados] = useState([]);

  const [programa, setPrograma] = useState([]);

  const [dataOrigen, setDataOrigen] = useState([]);
  const [showModalOrigen, setShowModalOrigen] = useState(false);
  const [showModalAsociarOrigen, setShowModalAsociarOrigen] = useState(false);
  const [origenSelected, setOrigenSelected] = useState([]);
  const [showDesasociarOrigen, setShowDesasociarOrigen] = useState(false);
  const [showEditarOrigen, setShowEditarOrigen] = useState(false);

  const [listaAnalistas, setListaAnalistas] = useState([]);
  const [listaAnalistasFiltrados, setListaAnalistasFiltrados] = useState([]);

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
  const [listaProgramas, setListaProgramas] = useState([]);

  const [flagFechaFinalizacion, setFlagFechaFinalizacion] = useState(true);

  useEffect(() => {
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
    };

    const obtenerSeguimiento = async () => {
      const result = await fetch(
        process.env.REACT_APP_API_URL + "/plandeAccion/seguimiento/" +
          localStorage.getItem("idPlanAccion") +
          "/",
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            Authorization: "Bearer " + serviceAAD.getToken(),
          },
        }
      );
      try {
        let data = await result.json();
        setDataSeguimiento(data);
      } catch (error) {
        console.error(error);
      }
    };

    const GetDataPlan = async () => {
      //---------------------- Listas de Paises y compañias ----------------------

      const listCompanias = await axios.get(
        process.env.REACT_APP_API_URL + "/maestros_ro/compania/",
        {
          headers: {
            Authorization: "Bearer " + serviceAAD.getToken(),
          },
        }
      );

      const listPaises = await axios.get(
        process.env.REACT_APP_API_URL + "/generales/Causa/Pais",
        {
          headers: {
            Authorization: "Bearer " + serviceAAD.getToken(),
          },
        }
      );

      let companias = listCompanias.data.map(
        ({ idcompania: value, compania: label, pais }) => ({
          value,
          label,
          pais,
        })
      );

      setListaCompanias(companias);

      let paises = listPaises.data.map(
        ({ parametro: value, valor: label }) => ({
          value,
          label,
        })
      );

      setListaPaises(paises);

      //---------------------------------Datos generales plan de acción---------------------------------------------------

      const result = await fetch(
        process.env.REACT_APP_API_URL + "/plandeAccion/" +
          localStorage.getItem("idPlanAccion") +
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

      console.log("Datos del plan de acción fresquitos del back", data);

      //-------------------------------Datos de la tabla de seguimiento---------------------------------------------------

      const result2 = await fetch(process.env.REACT_APP_API_URL + "/usuariosrol/0/3", {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: "Bearer " + serviceAAD.getToken(),
        },
      });

      let data2 = await result2.json();

      let listaResponsables = data2.map(
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

      setDataResponsable(listaResponsables);

      if (data.Planaccionporriesgo) {
        setDataR(data.Planaccionporriesgo);

        setDataRinicial(data.Planaccionporriesgo);
      }

      if (data.idposicionresponsablepa) {
        let responsable = listaResponsables.filter(
          (item) => item.value === data.idposicionresponsablepa
        );

        setDataResponsableSelected(responsable[0]);
      }

      if (data.idanalistariesgos) {
        setDataAnalistaSelected({
          value: data.idanalistariesgos,
          label: data.nombreAnalistaRiesgos,
        });
      }

      setDataPA(data);

      setDataOrigen(data.Origen);

      let objArrayPrograma = [];

      let tempArrayPrograma = [];

      //-------------------------------Programas/Aristas---------------------------------------------------

      const programasList = await fetch(
        process.env.REACT_APP_API_URL + "/maestros_ro/aristas/",
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            Authorization: "Bearer " + serviceAAD.getToken(),
          },
        }
      );

      let dataProgramas = await programasList.json();

      let programas = dataProgramas.map(
        ({ idaristas: value, nombre: label, erm, it, estado }) => ({
          value,
          label,
          erm,
          it,
          estado,
        })
      );

      setListaProgramas(programas);

      if (data.programa !== null && data.programa.length > 0) {
        setStringPrograma(data.programa);

        objArrayPrograma = data.programa.split(",");

        objArrayPrograma.map((dat) => {
          tempArrayPrograma.push({ value: dat, label: dat });
        });

        setPrograma(tempArrayPrograma);
      } else {
        setStringPrograma(null);
        setPrograma(null);
      }

      setDatRiesgosGestionados(programas);

      //---------------------- Analistas con  riesgos gestionados ----------------------

      const listAnalistas = await fetch(
        process.env.REACT_APP_API_URL + "/riesgosgestionados/",
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            Authorization: "Bearer " + serviceAAD.getToken(),
          },
        }
      );

      let analistas = await listAnalistas.json();

      let RG = analistas.map(
        ({ idusuario: value, nombre: label, riesgos_gestionados }) => ({
          value,
          label,
          riesgos_gestionados,
        })
      );

      setListaAnalistas(RG);

      //Función para convertir la propiedad de ".riesgos_gestionados" en un arreglo de objetos

      let analistasFormatoObjArray = [];
      var rg = [];

      RG.forEach((analista) => {
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

      tempArrayPrograma.forEach((programa) => {
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

      if (data.lugar) {
        switch (data.tipo_lugar) {
          case "País":
            setListaUbicacion(paises);
            break;
          case "Compañia":
            setListaUbicacion(companias);

            break;

          default:
            setUbicacion(null);
            break;
        }

        setTipoUbicacion({ value: data.tipo_lugar, label: data.tipo_lugar });

        setUbicacion({ value: data.tipo_lugar, label: data.lugar });
      } else {
        setTipoUbicacion(null);

        setUbicacion(null);
      }

      if (data.estadopa === "Ejecutado") {
        setFechaFinalizacion(
          Date.parse(data.fechafinalizacion.replace(/-/g, "/"))
        );
      }

      setCompromisoActual(
        Date.parse(data.fechacompromisoactual.replace(/-/g, "/"))
      );

      //setFechaFinalizacion(data.fechafinalizacion);
      //setCompromisoActual(data.fechacompromisoactual);
    };

    GetUsuariosAnalista();

    obtenerSeguimiento();

    GetUser();

    GetDataPlan();
  }, []);

  const sendData = (e) => {
    e.preventDefault();
    setHabilitarBoton(false);

    const timeElapsed = Date.now();
    const today = new Date(timeElapsed);

    async function limpiar(state) {
      setTimeout(() => {
        setHabilitarBoton(true);
        setEstadoPost({ id: 0, data: null });
      }, 3000);
    }

    function formatoFecha(fecha) {
      return fecha.split("T")[0];
    }

    let fechaISOinicial = today.toISOString();
    let riesgosPATemp = [];
    let inactivarRiesgo = [];

    dataRinicial.map((Rinicial) => {
      if (Rinicial) {
        let pertenece = false;
        if (dataR) {
          dataR.map((Rfinal) => {
            if (Rinicial.idriesgo === Rfinal.idriesgo) {
              pertenece = true;
            }
          });
        }
        if (!pertenece) {
          inactivarRiesgo.push({
            idplanaccionporriesgo: 0,
            idplanaccion: dataPA.idplanaccion,
            idriesgo: Rinicial.idriesgo,
            fechacreacion: fechaISOinicial,
            idusuariocreacion: usuario.idusuario,
            fechamodificacion: fechaISOinicial,
            idusuariomodificacion: usuario.idusuario,
            estadoasociacion: 0,
          });
        }
      }
    });

    dataR.map((dat) => {
      riesgosPATemp.push({
        idplanaccionporriesgo: 0,
        idplanaccion: dataPA.idplanaccion,
        idriesgo: dat.idriesgo,
        fechacreacion: fechaISOinicial,
        idusuariocreacion: usuario.idusuario,
        fechamodificacion: fechaISOinicial,
        idusuariomodificacion: usuario.idusuario,
        estadoasociacion: 1,
      });
    });

    riesgosPATemp = riesgosPATemp.concat(inactivarRiesgo);

    let estadoSeguimiento;

    if (dataS) {
      if (dataS.texto === "Finalizar plan") {
        estadoSeguimiento = "Ejecutado";
      } else if (dataS.texto === "Suspender plan") {
        estadoSeguimiento = "Suspendido";
      } else if (dataS.texto === "Cancelar plan") {
        estadoSeguimiento = "Cancelado";
      } else if (dataS == []) {
        estadoSeguimiento = "Creado";
      } else {
        if (dataS.porcentajeavance !== 0 && dataPA.estadopa !== "Ejecutado") {
          estadoSeguimiento = "Ejecución";
        }
      }
    }

    let sendCompromisoActual = new DateObject(compromisoActual).format(
      "YYYY-MM-DD"
    );
    let sendFechaFinal = new DateObject(fechaFinalizacion).format("YYYY-MM-DD");

    var data = {
      idplanaccion: dataPA.idplanaccion,
      nombre: document.getElementById("NombrePlanAcción").value,
      descripcion: document.getElementById("DescripcionPlan").value,
      fechainicio: dataPA.fechainicio,
      fechacompromisoinicial: dataPA.fechacompromisoinicial,
      fechacompromisoactual: sendCompromisoActual,
      fechafinalizacion: sendFechaFinal,
      estadopa: estadoSeguimiento,
      porcentajeavance: dataS.porcentajeavance
        ? dataS.porcentajeavance / 100
        : dataPA.porcentajeavance,
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
      programa: stringPrograma,
    };

    console.log("datos a enviar al back : ", data);

    fetch(process.env.REACT_APP_API_URL + "/plandeAccion/" + dataPA.idplanaccion + "/", {
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
            limpiar();
            window.location.reload();
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

  const FilterProgramaSelected = (objArrayPrograma) => {
    //Borrar el analista seleccionado anteriormente
    setStringPrograma(null);
    setDataAnalistaSelected([]);

    //Funcion para eliminar los duplicados en el array de programas

    const uniquePorgramas = new Set();

    const unique = objArrayPrograma.filter((element) => {
      const isDuplicate = uniquePorgramas.has(element.label);

      uniquePorgramas.add(element.label);

      if (!isDuplicate) {
        return true;
      } else {
        return false;
      }
    });

    //Función para sobreescribir los objetos existentes del multiselect en la variable de estado
    let programas = [];

    objArrayPrograma.map((a) => programas.push(a));

    setPrograma(unique);

    //Obtener la lista en formato string de los programas para enviar al back
    let string = objArrayPrograma.map((obj) => obj.label).join(",");

    setStringPrograma(string);

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

  const FiltrarUbicacion = (e) => {
    setTipoUbicacion(e);

    setUbicacion(null);

    switch (e.label) {
      case "País":
        setListaUbicacion(listaPaises);
        break;
      case "Compañia":
        setListaUbicacion(listaCompanias);

        break;

      default:
        setUbicacion(null);
        break;
    }
  };

  const isSelectedOrigen = (name) => origenSelected.indexOf(name) !== -1;

  const DesasociarOrigen = () => {
    let newObjArray = dataOrigen.filter((e) => e.idorigen != origenSelected);
    setDataOrigen(newObjArray);
    setOrigenSelected([]);
    setShowEditarOrigen(false);
    setShowDesasociarOrigen(false);
  };

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

  const EditarOrigen = () => {
    setShowModalOrigen(true);
  };

  return (
    <>
      <AlertDismissibleExample alerta={estadoPost} />
      <Container fluid>
        <Form id="formData" onSubmit={(e) => sendData(e)}>
          {/* <---------------------------------------------------------------Modales---------------------------------------------------------------------> */}
          <ModalOrigen
            show={showModalOrigen}
            setShowModalOrigen={setShowModalOrigen}
            setDataOrigen={setDataOrigen}
            dataOrigen={dataOrigen}
            origenSelected={origenSelected}
            onHide={() => setShowModalOrigen(false)}
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

          <ModalSeguimiento
            showModalS={showModalS}
            setShowModalS={setShowModalS}
            dataS={dataS}
            setDataS={setDataS}
            dataSeguimiento={dataSeguimiento}
            setDataSeguimiento={setDataSeguimiento}
            dataPA={dataPA}
            usuario={usuario}
            setEstadoPost={setEstadoPost}
            sendData={sendData}
            fechaFinalizacion={fechaFinalizacion}
            setFechaFinalizacion={setFechaFinalizacion}
          ></ModalSeguimiento>

          {/* <---------------------------------------------------------------Titulo---------------------------------------------------------------------> */}

          <Row className="mb-3">
            <Col sm={8} xs={12}>
              <h1 className="titulo">Editar Plan de Acción</h1>
            </Col>

            {/* <----------------------------------------------------------------Botones---------------------------------------------------------------------> */}

            {habilitarBoton ? (
              <>
                <Col sm={2} xs={12}>
                  {props.permisos.crear ? (
                    <button
                      type="submit"
                      className="btn botonPositivo"
                      id="send"
                    >
                      Guardar
                    </button>
                  ) : null}
                </Col>
              </>
            ) : (
              <>
                <Col sm={2} xs={12}>
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
              </>
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

          <Row className="mb-3" s>
            <Col sm={4} xs={12}>
              <Button
                onClick={() => {
                  setShowModalS(true);
                  setDataS({
                    texto: "Finalizar plan",
                    usuario: usuario.idposicion,
                    nombre: usuario.nombre,
                  });
                }}
                className="botonPositivo2"
                style={{ height: "100%", width: "100%", margin: "0" }}
              >
                Finalizar Plan de Acción
              </Button>
            </Col>

            <Col sm={4} xs={12}>
              <Button
                onClick={() => {
                  setShowModalS(true);
                  setDataS({
                    texto: "Suspender plan",
                    usuario: usuario.idposicion,
                    nombre: usuario.nombre,
                  });
                }}
                className="botonGeneral2"
                style={{ height: "100%", width: "100%", margin: "0" }}
              >
                Suspender Plan de Acción
              </Button>
            </Col>

            <Col sm={4} xs={12}>
              <Button
                onClick={() => {
                  setShowModalS(true);
                  setDataS({
                    texto: "Cancelar plan",
                    usuario: usuario.idposicion,
                    nombre: usuario.nombre,
                  });
                }}
                className="botonNegativo2"
                style={{ height: "100%", width: "100%", margin: "0" }}
              >
                Cancelar Plan de Acción
              </Button>
            </Col>
          </Row>

          <hr />
          <br />

          {/* <---------------------------------------------------------------Formulario---------------------------------------------------------------------> */}

          <Row className="mb-3">
            <Col sm={3} xs={12}>
              <label className="label forn-label">ID Plan de Acción</label>
            </Col>
            <Col sm={3} xs={12}>
              <input
                type="text"
                disabled
                className="form-control text-center texto"
                placeholder="ID Plan de Acción"
                id="IDPlanAccion"
                defaultValue={dataPA ? dataPA.idplanaccion : null}
              ></input>
            </Col>
          </Row>

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
                defaultValue={dataPA ? dataPA.nombre : null}
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
                defaultValue={dataPA ? dataPA.descripcion : null}
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
                defaultValue={dataPA ? dataPA.estadopa : null}
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
                defaultValue={
                  dataS && dataS.porcentajeavance
                    ? dataS.porcentajeavance
                    : dataPA && dataPA.porcentajeavance
                    ? dataPA.porcentajeavance * 100
                    : null
                }
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
                onChange={FiltrarUbicacion}
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
              <MySelect
                placeholder={"Seleccione"}
                onChange={(e) => {
                  setDataResponsableSelected(e);
                }}
                defaultValue={dataResponsableSelected}
                components={animatedComponents}
                className="texto"
                options={dataResponsable}
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
              <input
                type="text"
                className="form-control text-center texto"
                placeholder="Fecha Inicio"
                id="FechaInicio"
                disabled
                defaultValue={dataPA ? dataPA.fechainicio : null}
              ></input>
            </Col>
            <Col sm={3} xs={12}>
              <label className="label forn-label">Compromiso Inicial*</label>
            </Col>
            <Col sm={3} xs={12}>
              <input
                type="text"
                className="form-control text-center texto"
                placeholder="Compromiso Inicial"
                id="CompromisoInicial"
                disabled
                defaultValue={dataPA ? dataPA.fechacompromisoinicial : null}
              ></input>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col sm={3} xs={12}>
              <label className="label forn-label">Fecha Finalización*</label>
            </Col>
            <Col sm={3} xs={12}>
              <DatePicker
                className="form-control"
                selected={fechaFinalizacion}
                onChange={(date) => {
                  setFechaFinalizacion(date);
                }}
                id="fechaFinali"
                disabled
                required
              ></DatePicker>
              <Form.Control.Feedback type="invalid">
                Por favor introduzca la fecha de inicio.
              </Form.Control.Feedback>
            </Col>
            <Col sm={3} xs={12}>
              <label className="label forn-label">Compromiso Actual*</label>
            </Col>
            <Col sm={3} xs={12}>
              <DatePicker
                className="form-control"
                selected={compromisoActual}
                onChange={(date) => setCompromisoActual(date)}
                id="compromisoActual"
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
                        key={row.idorigen}
                        hover
                        onClick={(event) =>
                          handleClickOrigen(event, row.idorigen)
                        }
                        selected={isItemSelectedOrigen}
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

          <Row className="mb-3 mt-3">
            <Col sm={8} xs={2}>
              <label className="form-label label">
                Riesgos asociados al Plan de Acción
              </label>
            </Col>
            <Col sm={2} xs={4}></Col>
            <Col sm={2} xs={4}>
              <button
                type="button"
                className="btn botonPositivo"
                onClick={() => {
                  setShowModalR(true);
                }}
              >
                Asociar riesgo
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
                    <StyledTableCell align="left">Estado</StyledTableCell>
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
                          {row.estadoasociacion ? "Activo" : "Inactivo"}
                        </StyledTableCell>
                      </StyledTableRow>
                    );
                  })}
                </TableBody>
                {/* Fin de cuerpo de la tabla */}
              </Table>
            </TableContainer>
          </Paper>

          <Row className="mb-3 mt-3">
            <Col sm={4} xs={2}>
              <label className="form-label label">
                Seguimiento del Plan de Acción
              </label>
            </Col>
            <Col sm={5} xs={12}></Col>

            <Col sm={3} xs={12}>
              <Button
                onClick={() => {
                  setShowModalS(true);
                  setDataS({
                    texto: "Seguimiento",
                    usuario: usuario.idposicion,
                    nombre: usuario.nombre,
                  });
                }}
                className="botonPositivo"
                style={{ height: "100%", width: "100%", margin: "0" }}
              >
                Crear Seguimiento
              </Button>
            </Col>
          </Row>

          <Paper className={classes.root}>
            <TableContainer component={Paper} className={classes.container}>
              <Table className={"text"} stickyHeader aria-label="sticky table">
                {/* Inicio de encabezado */}
                <TableHead className="titulo">
                  <TableRow>
                    <StyledTableCell padding="checkbox"></StyledTableCell>
                    <StyledTableCell>Responsable Seguimiento</StyledTableCell>
                    <StyledTableCell align="left">Descripción</StyledTableCell>
                    <StyledTableCell align="left">
                      Fecha Seguimiento
                    </StyledTableCell>
                    <StyledTableCell align="left">Porcentaje</StyledTableCell>
                  </TableRow>
                </TableHead>
                {/* Fin de encabezado */}
                {/* Inicio de cuerpo de la tabla */}
                <TableBody>
                  {dataSeguimiento.map((row, index) => {
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
                          {row.nombreUsuariocreacion
                            ? row.nombreUsuariocreacion
                            : null}
                        </StyledTableCell>
                        <StyledTableCell align="left">
                          {row.descripcion ? row.descripcion : null}
                        </StyledTableCell>
                        <StyledTableCell component="th" scope="row">
                          {row.fechaseguimiento ? row.fechaseguimiento : null}
                        </StyledTableCell>
                        <StyledTableCell component="th" scope="row">
                          {row.porcentajeavance
                            ? parseFloat(row.porcentajeavance) <= 1
                              ? parseFloat(row.porcentajeavance) * 100 + "%"
                              : parseFloat(row.porcentajeavance)
                            : null}
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
              <h1 className="titulo">Editar Plan de Acción</h1>
            </Col>

            {habilitarBoton ? (
              <>
                <Col sm={2} xs={12}>
                  {props.permisos.crear ? (
                    <button
                      type="submit"
                      className="btn botonPositivo"
                      id="send"
                    >
                      Guardar
                    </button>
                  ) : null}
                </Col>
              </>
            ) : (
              <>
                <Col sm={2} xs={12}>
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
              </>
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
