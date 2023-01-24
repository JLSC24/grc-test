import React, { useState, useEffect } from "react";
import { Row, Col, Form, Alert } from "react-bootstrap";
import { Link, useHistory } from "react-router-dom";
import Select from "react-select";
import Loader from "react-loader-spinner";
import Queries from "../../Components/QueriesAxios";
import ModalProcesos from "./Modales/ModalProcesos";
import ModalUsuarios from "../../Components/ModalUsuarios";
import ModalSelectTableCustom from "../../Components/ModalSelectTableCustom";
import AlertDismissible from "../../Components/AlertDismissible";
import TableCustom from "../../Components/TableCustom";
import axios from "axios";
import Tooltip from "@mui/material/Tooltip";



export default function NuevaOpcionCritica(props) {
  const [aplicativo, setAplicativo] = useState(null);
  const [usrFuncResponsable, setUsrFuncResponsable] = useState(null);
  const [usrDocumentacion, setUsrDocumentacion] = useState(null);
  const [usrContacto, setUsrContacto] = useState(null);
  const [nombreActividad, setNombreActividad] = useState(null);
  const [descripcionActividad, setDescripcionActividad] = useState(null);
  const [proceso, setProceso] = useState([]);
  const [aplicaciones, setAplicaciones] = useState([]);
  const [listaSemestres, setListaSemestres] = useState([]);
  const [alcSox, setAlcSox] = useState(null);
  //Variables para los modales
  const [showModProcesos, setShowModProcesos] = useState(false);
  const [showModApps, setShowModApps] = useState(false);
  const [showModUsuarios, setShowModUsuarios] = useState(false);
  const [selectVarMod, setSelectVarMod] = useState(null);

  const [estadoPost, setEstadoPost] = useState(null);
  const [habilitarBoton, setHabilitarBoton] = React.useState(true);
  let history = useHistory();

  useEffect(() => {
    const llenarSemestres = () => {
      let fecha = new Date();
      let fechaAnt = new Date("Jan 01 2017");
      let monthTemp;
      let yearTemp;
      let tempListaSemestres = [];

      while (fechaAnt <= fecha) {
        monthTemp = fechaAnt.getMonth();
        yearTemp = fechaAnt.getFullYear();

        if (fechaAnt.getMonth() >= 5) {
          yearTemp += 1;
          monthTemp = 0;

          tempListaSemestres.push({
            value: String(fechaAnt.getFullYear()) + " Semestre " + 2,
            label: String(fechaAnt.getFullYear()) + " Semestre " + 2,
          });
        } else {
          tempListaSemestres.push({
            value: String(fechaAnt.getFullYear()) + " Semestre " + 1,
            label: String(fechaAnt.getFullYear()) + " Semestre " + 1,
          });
          monthTemp += 6;
        }

        fechaAnt.setMonth(monthTemp);
        fechaAnt.setFullYear(yearTemp);
      }
      setListaSemestres(tempListaSemestres);
    };

    llenarSemestres();
  }, []);

  const cargarApps = async () => {
    if (!aplicaciones.dataTable) {
      const response = await axios.get(
        "https://grc-rotic-alb-qa.apps.ambientesbc.com/aplicativos/",
        {
          headers: {},
        }
      );

      let dataPrin = response.data.filter((o) => o.componente_principal);

      let tempJsonOpciones = {
        dataTable: dataPrin,
        nameCol: ["ID Activo", "Nombre", "Descripción"],
        nameRow: ["idactivo", "nombre", "descripcion"],
        nameId: "idactivo",
        busqueda: true,
        nameBusqueda: ["idactivo", "nombre", "descripcion"],
      };

      setAplicaciones(tempJsonOpciones);
    }
  };

  const handleChange = (e) => {
    console.warn(e.value);
  };

  const sendData = async (e) => {
    e.preventDefault();
    setHabilitarBoton(false);
    if (
      !aplicativo ||
      !usrFuncResponsable ||
      !usrDocumentacion ||
      !usrContacto
    ) {
      window.alert("Faltan campos por llenar");
    } else {
      let tempProceso = proceso.map((proc) => proc.id);

      const data = {
        id_aplicacion:1,
        // id_aplicacion:
        //   aplicativo && aplicativo.idactivo ? aplicativo.idactivo : 1,
        usuario_funcional_resp: usrFuncResponsable
          ? usrFuncResponsable[0].idposicion
          : null,
        usuario_documentacion: usrDocumentacion
          ? usrDocumentacion[0].idposicion
          : null,
        usuario_contacto_duda: usrContacto ? usrContacto[0].idposicion : null,
        nombre_actividad: nombreActividad ? nombreActividad : null,
        descripcion_actividad: descripcionActividad
          ? descripcionActividad
          : null,
        idproceso: tempProceso,
        opcion_menu_utilizado: "N/A",
        descripcion_opcion_funcional: "N/A",
        estado: "Pendiente Info 1L",
        alcance_sox: alcSox ? alcSox.value : null,
      };

      try {
        let queriePostOpcionesC = await Queries(
          data,
          "/opciones_criticas/",
          "POST"
        );
        console.log('queriepost', queriePostOpcionesC);
        setEstadoPost(queriePostOpcionesC);
        localStorage.setItem("id_opcion_critica", queriePostOpcionesC.data.id_opcion_critica);
        setTimeout(() => {
          history.push("/EditarOpcionCritica");
        }, 1000);
      } catch (error) {
        setEstadoPost(error);
      }
    }

    setHabilitarBoton(true);
  };
  return (
    <>
      <AlertDismissible data={estadoPost} />


      <ModalProcesos
        showModProcesos={showModProcesos}
        setShowModProcesos={setShowModProcesos}
        proceso={proceso}
        setProceso={setProceso}
      ></ModalProcesos>

      <ModalUsuarios
        showModUsuarios={showModUsuarios}
        setShowModUsuarios={setShowModUsuarios}
        data={
          selectVarMod === "UsrFunc"
            ? usrFuncResponsable
            : selectVarMod === "UsrDoc"
            ? usrDocumentacion
            : selectVarMod === "UsrCont"
            ? usrContacto
            : null
        }
        setData={
          selectVarMod === "UsrFunc"
            ? setUsrFuncResponsable
            : selectVarMod === "UsrDoc"
            ? setUsrDocumentacion
            : selectVarMod === "UsrCont"
            ? setUsrContacto
            : null
        }
        rolUsr={"all"}
        multi={false}
      ></ModalUsuarios>

      <ModalSelectTableCustom
        showMod={showModApps}
        setShowMod={setShowModApps}
        data={aplicativo}
        setData={setAplicativo}
        dataTable={aplicaciones}
        multi={false}
      />
      <Row className="mb-3">
        <Col md={12}>
          <h1 className="titulo">Creación de una nueva Opción Crítica</h1>
        </Col>
      </Row>
      <Form id="formData" onSubmit={(e) => sendData(e)}>
        <Row className="mb-3">
          <Col md={12}>
            <h3 className="subtitulo">Información funcional de la opción</h3>
          </Col>
        </Row>
        <hr></hr>
        <Row className="mb-3">
          <Col sm={4} xs={12}>
            <label className="label forn-label">
              Id Opción Crítica (Automatico)
            </label>
          </Col>
          <Col sm={3} xs={12}>
            <input
              type="text"
              disabled
              className="form-control text-center texto"
              placeholder="ID Automático"
              id="IdOpcion"
            ></input>
          </Col>
          <Col sm={2} xs={12}>
            <label className="label forn-label">Estado</label>
          </Col>
          <Col sm={3} xs={12}>
            <input
              type="text"
              disabled
              className="form-control text-center texto"
              placeholder="Automático"
              id="estadoOC"
            ></input>
          </Col>
        </Row>
        <Row className="mb-3">
          <Col sm={4} xs={12}>
            <label className="forn-label label">Aplicativo*</label>
          </Col>
          <Col sm={6} xs={10}>
            <input
              type="text"
              disabled
              defaultValue={
                aplicativo && aplicativo.nombre ? aplicativo.nombre : null
              }
              className="form-control text-center texto"
              placeholder="Seleccione Aplicativo"
              id="App"
              
            ></input>
          </Col>
          <Col sm={2} xs={10}>
            <button
              type="button"
              className="btn botonPositivo"
              onClick={async () => {
                await cargarApps();
                setShowModApps(true);
              }}
            >
              Seleccionar
            </button>
          </Col>
        </Row>
        <Row className="mb-3">
          <Col sm={4} xs={12}>
            <label className="forn-label label">
              Usuario funcional responsable*
            </label>
          </Col>
          <Col sm={6} xs={10}>
            <input
              type="text"
              disabled
              defaultValue={
                usrFuncResponsable && usrFuncResponsable[0].nombre
                  ? usrFuncResponsable[0].nombre
                  : null
              }
              className="form-control text-center texto"
              placeholder="Seleccione usuario funcional responsable"
              id="UsrFuncResp"
            ></input>
          </Col>
          <Col sm={2} xs={10}>
            <button
              type="button"
              className="btn botonPositivo"
              onClick={() => {
                setShowModUsuarios(true);
                setSelectVarMod("UsrFunc");
              }}
            >
              Seleccionar
            </button>
          </Col>
        </Row>
        <Row className="mb-3">
          <Col sm={4} xs={12}>
            <label className="forn-label label">
              Usuario encargado de realizar la documentación de la opción*
            </label>
          </Col>
          <Col sm={6} xs={10}>
            <input
              type="text"
              disabled
              defaultValue={
                usrDocumentacion && usrDocumentacion[0].nombre
                  ? usrDocumentacion[0].nombre
                  : null
              }
              className="form-control text-center texto"
              placeholder="Seleccione usuario encargado de realizar la documentación de la opción"
              id="UsrDocumentacion"
            ></input>
          </Col>
          <Col sm={2} xs={10}>
            <button
              type="button"
              className="btn botonPositivo"
              onClick={() => {
                setShowModUsuarios(true);
                setSelectVarMod("UsrDoc");
              }}
            >
              Seleccionar
            </button>
          </Col>
        </Row>
        <Row className="mb-3">
          <Col sm={4} xs={12}>
            <label className="forn-label label">
              Usuario contacto en caso de dudas*
            </label>
          </Col>
          <Col sm={6} xs={10}>
            <input
              type="text"
              disabled
              defaultValue={
                usrContacto && usrContacto[0].nombre
                  ? usrContacto[0].nombre
                  : null
              }
              className="form-control text-center texto"
              placeholder="Seleccione usuario contacto en caso de dudas"
              id="UsrContacto"
            ></input>
          </Col>
          <Col sm={2} xs={10}>
            <button
              type="button"
              className="btn botonPositivo"
              onClick={() => {
                setShowModUsuarios(true);
                setSelectVarMod("UsrCont");
              }}
            >
              Seleccionar
            </button>
          </Col>
        </Row>
        <Row className="mb-3">
          <Col sm={4} xs={12}>
            <label className="form-label label">Nombre actividad</label>
          </Col>
          <Col sm={8} xs={12}>
            <input
              type="text"
              className="form-control text-center texto"
              placeholder="Nombre de la actividad"
              onChange={(e) => setNombreActividad(e.target.value)}
              id="NombreProceso"
              
            ></input>
            <Form.Control.Feedback type="invalid">
              Por favor introduzca un nombre.
            </Form.Control.Feedback>
          </Col>
        </Row>
        <Row className="mb-3">
          <Col sm={4} xs={12}>
            <label className="form-label label">Descripción actividad</label>
          </Col>
          <Col sm={8} xs={12}>
            <textarea
              className="form-control text-center"
              placeholder="Objetivo del proceso"
              rows="3"
              id="Objetivo"
              onChange={(e) => setDescripcionActividad(e.target.value)}
              
            ></textarea>
          </Col>
        </Row>
        <Row className="mb-3">
          <Col sm={4} xs={12}>
            <label className="forn-label label">Proceso</label>
          </Col>
          <Col sm={6} xs={12}></Col>
          <Col sm={2} xs={10}>
            <button
              type="button"
              className="btn botonPositivo"
              onClick={() => {
                setShowModProcesos(true);
              }}
            >
              Añadir
            </button>
          </Col>
        </Row>

        <TableCustom
          data={proceso}
          nameCol={["ID Proceso", "Nombre", "Compañia", "Ciclo"]}
          nameRow={["idproceso", "nombre", "compania", "ciclo"]}
          nameId={"idproceso"}
        ></TableCustom>

        <p></p>

        <Row className="mb-3">
          <Col sm={4} xs={12}>
            <Tooltip
              title="Lista que inicia en 2017-I y se van agregando semestres de acuerdo a la fecha actual"
              arrow
            >
              <label className="forn-label label">
                Alcance SOX a partir del periodo
              </label>
            </Tooltip>
          </Col>
          <Col sm={8} xs={10}>
            <Select
              className="texto"
              onChange={(e) => setAlcSox(e)}
              options={listaSemestres}
              value={alcSox}
            />
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
          <Col sm={2} xs={1}></Col>
          {habilitarBoton ? (
            <>
              <Col sm={3} xs={3}>
                {props.permisos.crear ? (
                  <button type="submit" className="btn botonPositivo" id="send">
                    Guardar
                  </button>
                ) : null}
              </Col>
              <Col sm={3} xs={3}>
                {/* {props.permisos.crear ? (
                  <button
                    type="button"
                    className="btn botonNegativo3"
                    id="send"
                  >
                    Alerta por información deficiente
                  </button>
                ) : null} */}
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
