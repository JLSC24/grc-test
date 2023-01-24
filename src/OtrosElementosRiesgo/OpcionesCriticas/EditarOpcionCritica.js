import React, { useState, useEffect } from "react";
import { Row, Col, Form } from "react-bootstrap";
import Tooltip from "@mui/material/Tooltip";
import { Link, useHistory } from "react-router-dom";
import Select from "react-select";
import Loader from "react-loader-spinner";

import Queries from "../../Components/QueriesAxios";
import ModalProcesos from "./Modales/ModalProcesos";
import ModalUsuarios from "../../Components/ModalUsuarios";
import ModalSelectTableCustom from "../../Components/ModalSelectTableCustom";
import AlertDismissible from "../../Components/AlertDismissible";
import TableCustom from "../../Components/TableCustom";
import AADService from "../../auth/authFunctions";
import axios from "axios";
import ModCargaArchivo from "../../AdminAplicativo/ModCargaArchivo";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import ModalInactivar from "../../Components/ModalInactivar";

const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: "#2c2a29",
    color: theme.palette.common.white,
  },
}))(TableCell);
const StyledTableRow = withStyles((theme) => ({
  root: {
    backgroundColor: "#f4f4f4",
  },
}))(TableRow);



export default function EditarOpcionCritica(props) {
  const serviceAAD = new AADService();
  const [user, setUser] = useState(null);
  const [userCampo, setUserCampo] = useState(true);
  const [campoIni, setCampoIni] = useState(true);
  const [rolCampo, setRolCampo] = useState(true);
  const [acceptOT, setAcceptOT] = useState(true);
  const [listOpcionesTec, setListOpcionesTec] = useState([]);
  const [selectedCert, setSelectedCert] = useState(null);
  const [showDetCert, setShowDetCert] = useState(false);
  const [showDetContr, setShowDetContr] = useState(false);

  const [dataTablaCertificaciones, setDataTablaCertificaciones] =
    useState(null);
  const [dataTablaCertificacionesAll, setDataTablaCertificacionesAll] =
    useState(null);
  const [dataTablaControlesAll, setDataTablaControlesAll] = useState(null);
  const [dataTablaControlesFilter, setDataTablaControlesFilter] = useState([]);
  const [dataControlSelected, setDataControlSelected] = useState([]);

  const [aplicaciones, setAplicaciones] = useState([]);
  const [dataOpcionC, setDataOpcionC] = useState(null);
  const [aplicativo, setAplicativo] = useState(null);
  const [usrFuncResponsable, setUsrFuncResponsable] = useState(null);
  const [usrDocumentacion, setUsrDocumentacion] = useState(null);
  const [usrContacto, setUsrContacto] = useState(null);
  const [nombreActividad, setNombreActividad] = useState(null);
  const [descripcionActividad, setDescripcionActividad] = useState(null);
  const [proceso, setProceso] = useState([]);
  const [nombreOpcion, setNombreOpcion] = useState(null);
  const [descOpcionFunc, setDescOpcionFunc] = useState(null);
  const [adjunto, setAdjunto] = useState(null);
  const [listaSemestres, setListaSemestres] = useState([]);
  const [alcSox, setAlcSox] = useState(null);
  const [codOpcTecnica, setCodOpcTecnica] = useState(null);
  const [codOpcTecnicaNew, setCodOpcTecnicaNew] = useState(null);
  const [codOpcTecnicaAccesos, setCodOpcTecnicaAccesos] = useState(null);
  const [nombOpcTecnica, setNombOpcTecnica] = useState(null);
  const [descOpcTecnica, setDescOpcTecnica] = useState(null);
  const [alcAccesos, setAlcAccesos] = useState(null);
  const [listControles, setListControles] = useState(null);
  const [listControlesSelected, setListControlesSelected] = useState(null);
  const [otrosControles, setOtrosControles] = useState(null);
  const [dataInactivar, setDataInactivar] = useState(false);

  //Variables para los modales
  const [showModInactivar, setShowModInactivar] = useState(false);
  const [showModProcesos, setShowModProcesos] = useState(false);
  const [showModApps, setShowModApps] = useState(false);
  const [showModOT, setShowModOT] = useState(false);
  const [showModOTNew, setShowModOTNew] = useState(false);
  const [showModContr, setShowModContr] = useState(false);
  const [showModUsuarios, setShowModUsuarios] = useState(false);
  const [selectVarModUsr, setSelectVarModUsr] = useState(null);
  const [archivo, setArchivo] = useState(null);

  const [estadoPost, setEstadoPost] = useState(null);
  const [habilitarBoton, setHabilitarBoton] = React.useState(true);
  let history = useHistory();

  useEffect(() => {
    let usuarioLog = serviceAAD.getUser().userName;
    setUser(usuarioLog);
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
    const peticiones = async function () {
      let OpcionCriQuerie = await Queries(
        null,
        "/opciones_criticas/" + localStorage.getItem("id_opcion_critica") + "/",
        "GET"
      );
      setDataOpcionC(OpcionCriQuerie);
      cargar_info(OpcionCriQuerie);
    };
    const peticionResumen = async function () {
      try {
        let OpcionCertQuerie = await Queries(
          null,
          "/certificacion_opcion/resumen/" +
            localStorage.getItem("id_opcion_critica") +
            "/",
          "GET"
        );
        const opcCertQuerieTemp = OpcionCertQuerie.resumen.map((dat) => {
          dat["requiere_control"] = dat.requiere_control ? "SI" : "NO";
          return dat;
        });
        OpcionCertQuerie.resumen = opcCertQuerieTemp;
        setDataTablaCertificacionesAll(OpcionCertQuerie);
      } catch (error) {
        console.log("No tiene resumen");
      }
    };
    const peticionControles = async function () {
      try {
        let OpcionContrQuerie = await Queries(
          null,
          "/rx_opcioncritica_controles/" +
            localStorage.getItem("id_opcion_critica") +
            "/",
          "GET"
        );

        setDataTablaControlesAll(OpcionContrQuerie);
      } catch (error) {
        console.log("No tiene resumen");
      }
    };
    const peticionAdjunto = async function () {
      try {
        let adjuntoQuerie = await Queries(
          null,
          "/adjuntos/opciones_criticas/" +
            localStorage.getItem("id_opcion_critica") +
            "/",
          "GET"
        );
        setArchivo(adjuntoQuerie);
        console.log(adjuntoQuerie);
      } catch (error) {
        console.log("No tiene adjuntos");
      }
    };
    const cargar_info = async function (dataOpcion) {
      console.log(dataOpcion);
      if (dataOpcion) {
        setUsrFuncResponsable([
          {
            idposicion: dataOpcion.usuario_funcional_resp,
            nombre: dataOpcion.nomb_usr_funcional,
          },
        ]);
        setUsrDocumentacion([
          {
            idposicion: dataOpcion.usuario_documentacion,
            nombre: dataOpcion.nomb_usr_documentacion,
          },
        ]);
        setUsrContacto([
          {
            idposicion: dataOpcion.usuario_contacto_duda,
            nombre: dataOpcion.nomb_usr_duda,
          },
        ]);
        setNombreActividad(dataOpcion.nombre_actividad);
        setDescripcionActividad(dataOpcion.descripcion_actividad);
        setNombreOpcion(dataOpcion.opcion_menu_utilizado);
        setDescOpcionFunc(dataOpcion.descripcion_opcion_funcional);
        setCodOpcTecnica({
          codigo_opcion_tecninca: dataOpcion.codigo_opcion_tecninca_us,
          nombre_opcion_tecnica: dataOpcion.nombre_opcion_tecnica_us,
          id_infotecnica: dataOpcion.id_infotecnica_usuario,
          descripcion_opcion_tecnica_us:
            dataOpcion.descripcion_opcion_tecnica_us,
          alcance_certificacion_accesos_us:
            dataOpcion.alcance_certificacion_accesos_us,
        });
        setCodOpcTecnicaNew({
          codigo_opcion_tecninca: dataOpcion.codigo_opcion_tecninca,
          nombre_opcion_tecnica: dataOpcion.nombre_opcion_tecnica,
          id_infotecnica: dataOpcion.id_infotecnica,
        });
        setCodOpcTecnicaAccesos(dataOpcion.codigo_opcion_tecninca);
        setNombOpcTecnica(dataOpcion.nombre_opcion_tecnica);
        setDescOpcTecnica(dataOpcion.descripcion_opcion_tecnica);
        setAlcSox({
          value: dataOpcion.alcance_sox,
          label: dataOpcion.alcance_sox,
        });

        if (dataOpcion.procesos) {
          setProceso(dataOpcion.procesos);
        }

        if (dataOpcion.id_aplicacion) {
          try {
            const response = await axios.get(
              "https://grc-rotic-alb-qa.apps.ambientesbc.com/aplicativos/0/" +
                dataOpcion.id_aplicacion +
                "/",
              {
                headers: {},
              }
            );

            let dataPrin = response.data;

            setAplicativo(dataPrin[0]);
          } catch (error) {
            console.log("no se puede consultar app");
          }
        }
        if (
          dataOpcion.email_usr_funcional.toLowerCase() ===
            usuarioLog.toLowerCase() ||
          dataOpcion.email_usr_documentacion.toLowerCase() ===
            usuarioLog.toLowerCase()
        ) {
          setUserCampo(false);
          setCampoIni(false);
        }
        console.log(props.idrol);
        if (props.idrol.includes(12)) {
          setRolCampo(false);
          setCampoIni(false);
        }
      }
    };

    if (codOpcTecnicaNew) {
      setCodOpcTecnicaAccesos(codOpcTecnicaNew.codigo_opcion_tecninca);
      setNombOpcTecnica(codOpcTecnicaNew.nombre_opcion_tecnica);
      setDescOpcTecnica(codOpcTecnicaNew.descripcion_opcion_tecnica);
    } else {
    }

    if (
      listControlesSelected &&
      listControlesSelected[0] &&
      listControlesSelected[0].idcontrol
    ) {
      let tempControlesAll = dataTablaControlesAll;
      let tempControlesAnti = tempControlesAll.compensatorios.filter(
        (obj) => obj.id_certificacion !== selectedCert[0]
      );
      let tempControlesSelected = listControlesSelected.map((dat) => {
        dat["id_control_send"] = dat.idcontrol;
        dat.idcontrol = dat.idcontrol + "-" + selectedCert[0];
        dat["estado"] = "Activo";
        dat["id_certificacion"] = selectedCert[0];
        dataTablaControlesAll.compensatorios.map((datAll) => {
          if (datAll.idcontrol === dat.id_control_send) {
            //dat["estado"] = datAll.estado ? "Activo" : "Inactivo";
            dat["idrx_opciones_controles"] = datAll.idrx_opciones_controles;
          }
        });
        return dat;
      });

      let temp = listControlesSelected.concat(tempControlesAnti);
      setDataTablaControlesAll({
        otros_controles: dataTablaControlesAll.otros_controles,
        compensatorios: temp,
      });
      setListControlesSelected(null);
      setDataTablaControlesFilter(listControlesSelected);
    }

    if (!dataOpcionC) {
      llenarSemestres();

      peticiones();
      peticionResumen();
      peticionControles();
      peticionAdjunto();
    } else {
    }

    if (!selectedCert || selectedCert.length === 0) {
      setShowDetCert(false);
      setShowDetContr(false);
    }
  }, [
    usrFuncResponsable,
    proceso,
    setProceso,
    codOpcTecnicaNew,
    selectedCert,
    listControlesSelected,
    dataControlSelected,
  ]);

  const cargarApps = async () => {
    if (!aplicaciones || !aplicaciones.dataTable) {
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

  const cargarOpcionesTec = async () => {
    if (!listOpcionesTec || !listOpcionesTec.dataTable) {
      let OpcionCriQuerie = await Queries(null, "/info_tecnica/", "GET");

      let tempJsonOpciones = {
        dataTable: OpcionCriQuerie,
        nameCol: [
          "ID Opcion Tecnica",
          "Código Opción Técninca",
          "Nombre",
          "Descripción",
        ],
        nameRow: [
          "id_infotecnica",
          "codigo_opcion_tecninca",
          "nombre_opcion_tecnica",
          "descripcion_opcion_tecnica",
        ],
        nameId: "id_infotecnica",
        busqueda: true,
        nameBusqueda: [
          "id_infotecnica",
          "codigo_opcion_tecninca",
          "nombre_opcion_tecnica",
        ],
      };

      setListOpcionesTec(tempJsonOpciones);
    }
  };

  const cargarControles = async () => {
    console.log(listControles);
    //if (!listControles || !listControles.dataTable) {
    let ControlesQuerie = await Queries(null, "/controles/", "GET");

    let tempJsonControles = {
      dataTable: ControlesQuerie,
      nameCol: [
        "ID Control",
        "Nombre control",
        "Responsable ejecución",
        "Automatización",
        "Naturaleza",
        "Cubrimiento",
        "Prevaloración",
      ],
      nameRow: [
        "idcontrol",
        "nombre",
        "responsable_ejecucion",
        "automatizacion",
        "naturaleza",
        "cubrimiento",
        "prevaloracion",
      ],
      nameId: "idcontrol",
      busqueda: true,
      nameBusqueda: [
        "idcontrol",
        "nombre",
        "responsable_ejecucion",
        "automatizacion",
        "naturaleza",
      ],
    };

    setListControles(tempJsonControles);
    //}

    if (dataTablaControlesFilter) {
      console.log({ dataTablaControlesFilter });
    }
  };

  const handleChange = (e) => {
    console.warn(e.value);
  };

  const encontrarMayor = (data) => {
    let tamano = data.map((dat) => dat.list_resultado.length);
    return tamano.reduce((a, b) => a + b, 0) + 4;
  };

  const detalleCert = () => {
    if (selectedCert && selectedCert.length === 1) {
      let tempDataTableCert = dataTablaCertificacionesAll.detalle.filter(
        (cert) => cert.id_certificacion === selectedCert[0]
      );

      setDataTablaCertificaciones(tempDataTableCert);
      setShowDetCert(true);
    } else {
      setShowDetCert(false);
    }
  };
  const detalleControles = () => {
    if (
      selectedCert &&
      selectedCert.length === 1 &&
      dataTablaControlesAll.compensatorios
    ) {
      let tempDataTableContr = dataTablaControlesAll.compensatorios.filter(
        (obj) => obj.id_certificacion === selectedCert[0]
      );
      tempDataTableContr = tempDataTableContr.map((dat) => {
        dat.estado =
          dat.estado === 1 || dat.estado === "Activo" ? "Activo" : "Inactivo";
        return dat;
      });
      if (
        dataTablaControlesAll.otros_controles.id_certificacion ===
        selectedCert[0]
      ) {
        setOtrosControles(dataTablaControlesAll.otros_controles.control);
      } else {
        setOtrosControles(null);
      }
      setDataTablaControlesFilter(tempDataTableContr);
      setShowDetContr(true);
    } else {
      setShowDetContr(false);
    }
  };
  const inactivarControl = () => {
    let tempInactivarControl = dataTablaControlesAll.compensatorios.filter(
      (obj) => obj.idcontrol == dataControlSelected
    )[0];

    if (tempInactivarControl && tempInactivarControl.idrx_opciones_controles) {
      setDataInactivar(tempInactivarControl);
      setShowModInactivar(true);
    } else {
      let temp = dataTablaControlesAll;
      temp.compensatorios = dataTablaControlesAll.compensatorios.filter(
        (obj) => obj.idcontrol != dataControlSelected
      );
      setDataTablaControlesAll(temp);
      setDataTablaControlesFilter(
        temp.compensatorios.filter(
          (obj) => obj.id_certificacion == selectedCert[0]
        )
      );
    }
  };
  const activarControl = () => {
    let tempActivarControl = dataTablaControlesAll.compensatorios.filter(
      (obj) => obj.idcontrol == dataControlSelected
    )[0];

    tempActivarControl["estado"] = "Activo";
    setDataControlSelected(null);
  };

  const sendData = async (e) => {
    e.preventDefault();
    //setHabilitarBoton(false);
    if (
      //!aplicativo || TODO: Habilitar de nuevo
      !usrFuncResponsable ||
      !usrDocumentacion ||
      !usrContacto
    ) {
      window.alert("Faltan campos por llenar");
    } else {
      let tempProceso = proceso.map((proc) =>
        proc.id ? proc.id : proc.idprco
      );
      let tempEstado = "Pendiente Info 1L";
      if (
        nombreOpcion &&
        descOpcionFunc &&
        adjunto &&
        codOpcTecnica &&
        !codOpcTecnicaAccesos
      ) {
        tempEstado = "Pendiente Info Tecnica";
      } else if (codOpcTecnicaAccesos && acceptOT) {
        tempEstado = "Completada";
      } else if (!acceptOT) {
        tempEstado = "Rechazada por Accesos";
      }

      const data = {
        id_aplicacion:
          aplicativo && aplicativo.idactivo ? aplicativo.idactivo : 1,
        usuario_funcional_resp: usrFuncResponsable
          ? usrFuncResponsable[0].idposicion
          : null,
        usuario_documentacion: usrDocumentacion
          ? usrDocumentacion[0].idposicion
          : null,
        usuario_contacto_duda: usrContacto ? usrContacto[0].idposicion : null,
        nombre_actividad: nombreActividad,
        descripcion_actividad: descripcionActividad,
        idproceso: tempProceso,
        opcion_menu_utilizado: nombreOpcion ? nombreOpcion : "N/A",
        descripcion_opcion_funcional: descOpcionFunc ? descOpcionFunc : "N/A",
        estado: tempEstado,
        alcance_sox: alcSox.value,
        codigo_opcion_tecninca_us:
          codOpcTecnica && codOpcTecnica.codigo_opcion_tecninca
            ? codOpcTecnica.codigo_opcion_tecninca
            : null,
        codigo_opcion_tecninca: codOpcTecnicaAccesos
          ? codOpcTecnicaAccesos
          : null,
        nombre_opcion_tecnica_us:
          codOpcTecnica && codOpcTecnica.nombre_opcion_tecnica
            ? codOpcTecnica.nombre_opcion_tecnica
            : null,
        nombre_opcion_tecnica: nombOpcTecnica ? nombOpcTecnica : null,
        descripcion_opcion_tecnica: descOpcTecnica ? descOpcTecnica : null,
        id_infotecnica_usuario: codOpcTecnica
          ? codOpcTecnica.id_infotecnica
          : null,
        id_infotecnica: codOpcTecnicaNew
          ? codOpcTecnicaNew.id_infotecnica
          : null,
      };

      console.log(data);

      let queriePutOpcionesC = await Queries(
        data,
        "/opciones_criticas/" + dataOpcionC.id_opcion_critica + "/",
        "PUT"
      );

      let infoArchivo = {
        metodo: "POST",
        id_adjunto: null,
      };
      if (archivo) {
        infoArchivo.metodo = "PUT";
        infoArchivo.id_adjunto = archivo[0].id_adjunto;
      }
      if (adjunto) {
        let response_file = ModCargaArchivo(
          "opciones_criticas",
          dataOpcionC.id_opcion_critica,
          null,
          adjunto.name,
          adjunto,
          infoArchivo.metodo,
          infoArchivo.id_adjunto
        );
        console.warn(response_file);
      }

      if (dataTablaControlesAll) {
        let dataControlesSend = {};
        dataControlesSend["compensatorios"] =
          dataTablaControlesAll.compensatorios.map(
            ({
              idrx_opciones_controles,
              estado,
              id_control_send,
              id_certificacion,
              motivo_inactivacion,
              usuario_inactivacion,
              fecha_inactivacion,
            }) => ({
              idrx_opciones_controles,
              estado: estado === "Activo" ? 1 : 0,
              idcontrol: id_control_send,
              id_certificacion,
              id_opcion_critica: dataOpcionC.id_opcion_critica,
              motivo_inactivacion,
              usuario_inactivacion,
              fecha_inactivacion,
            })
          );

        if (otrosControles) {
          dataControlesSend["otros_controles"] = {
            control: otrosControles,
            id_certificacion: "CERT2",
            id_opcion_critica: dataOpcionC.id_opcion_critica,
            id_otros_controles_opcion_sod: dataTablaControlesAll.otros_controles
              .id_otros_controles_opcion_sod
              ? dataTablaControlesAll.otros_controles
                  .id_otros_controles_opcion_sod
              : null,
            id_sod: null,
            relacionado_con: "opcion_critica",
          };
        } else {
          dataControlesSend["otros_controles"] =
            dataTablaControlesAll.otros_controles;
        }

        let QuerieControlesCert = await Queries(
          dataControlesSend,
          "/rx_opcioncritica_controles/" + dataOpcionC.id_opcion_critica + "/",
          "PUT"
        );
        console.log(QuerieControlesCert);
      }

      console.log("data controles", dataTablaControlesAll);
      setEstadoPost(queriePutOpcionesC);
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
          selectVarModUsr === "UsrFunc"
            ? usrFuncResponsable
            : selectVarModUsr === "UsrDoc"
            ? usrDocumentacion
            : selectVarModUsr === "UsrCont"
            ? usrContacto
            : null
        }
        setData={
          selectVarModUsr === "UsrFunc"
            ? setUsrFuncResponsable
            : selectVarModUsr === "UsrDoc"
            ? setUsrDocumentacion
            : selectVarModUsr === "UsrCont"
            ? setUsrContacto
            : null
        }
        rolUsr={"all"}
        multi={false}
      ></ModalUsuarios>
      <ModalSelectTableCustom
        id="ModalAplicaciones"
        showMod={showModApps}
        setShowMod={setShowModApps}
        data={aplicativo}
        setData={setAplicativo}
        dataTable={aplicaciones}
        multi={false}
      />
      <ModalSelectTableCustom
        id="ModalOpciones"
        showMod={showModOT}
        setShowMod={setShowModOT}
        data={codOpcTecnica}
        setData={setCodOpcTecnica}
        dataTable={listOpcionesTec}
        multi={false}
      />
      <ModalSelectTableCustom
        id="ModalOpcionesAccesos"
        showMod={showModOTNew}
        setShowMod={setShowModOTNew}
        data={codOpcTecnicaNew}
        setData={setCodOpcTecnicaNew}
        dataTable={listOpcionesTec}
        multi={false}
      />
      <ModalSelectTableCustom
        id="ModalControles"
        showMod={showModContr}
        setShowMod={setShowModContr}
        data={listControlesSelected}
        setData={setListControlesSelected}
        dataTable={listControles}
        multi={true}
      />
      <ModalInactivar
        showMod={showModInactivar}
        setShowMod={setShowModInactivar}
        data={dataInactivar}
      ></ModalInactivar>
      <Row className="mb-3">
        <Col md={12}>
          <h1 className="titulo">Edición Opción Crítica</h1>
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
              defaultValue={dataOpcionC ? dataOpcionC.id_opcion_critica : null}
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
              defaultValue={dataOpcionC ? dataOpcionC.estado : null}
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
              disabled={!campoIni}
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
                setSelectVarModUsr("UsrFunc");
              }}
              disabled={!campoIni}
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
                setSelectVarModUsr("UsrDoc");
              }}
              disabled={!campoIni}
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
                setSelectVarModUsr("UsrCont");
              }}
              disabled={!campoIni}
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
              placeholder="Nombre del Proceso"
              
              id="NombreProceso"
              defaultValue={nombreActividad ? nombreActividad : null}
              onChange={(e) => setNombreActividad(e.target.value)}
              disabled={!campoIni}
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
              defaultValue={descripcionActividad ? descripcionActividad : null}
              onChange={(e) => setDescripcionActividad(e.target.value)}
              
              disabled={!campoIni}
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
              disabled={!rolCampo}
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
              isDisabled={!rolCampo}
            />
          </Col>
        </Row>

        {/* Segunda parte */}
        <hr />
        <Row className="mb-3">
          <Col md={12}>
            <h3 className="subtitulo">Información funcional de la opción</h3>
          </Col>
        </Row>
        <Row className="mb-3">
          <Col sm={4} xs={12}>
            <label className="form-label label">
              Indique el nombre opción / menú utilizado *
            </label>
          </Col>
          <Col sm={8} xs={12}>
            <input
              type="text"
              className="form-control text-center texto"
              placeholder="Nombre opción/menú utilizado"
              required
              disabled={userCampo}
              id="NombreProceso"
              defaultValue={nombreOpcion ? nombreOpcion : null}
              onChange={(e) => setNombreOpcion(e.target.value)}
            ></input>
            <Form.Control.Feedback type="invalid">
              Por favor introduzca un nombre.
            </Form.Control.Feedback>
          </Col>
        </Row>
        <Row className="mb-3">
          <Col sm={4} xs={12}>
            <label className="form-label label">
              Descripción de opción funcional *
            </label>
          </Col>
          <Col sm={8} xs={12}>
            <textarea
              required
              className="form-control text-center"
              placeholder="Descripción de opción funcional"
              rows="3"
              disabled={userCampo}
              id="Objetivo"
              defaultValue={descOpcionFunc ? descOpcionFunc : null}
              onChange={(e) => setDescOpcionFunc(e.target.value)}
            ></textarea>
          </Col>
        </Row>
        <Row className="mb-3">
          <Col sm={4} xs={12}>
            <label className="form-label label">
              Adjunto soporte de la opción / menú *
            </label>
          </Col>
          <Col sm={5} xs={12}>
            <input
              required={archivo ? false : true}
              type="file"
              name="files"
              accept="*"
              disabled={userCampo}
              onChange={(e) => setAdjunto(e.target.files[0])}
            ></input>
          </Col>
          <Col sm={3} xs={12}>
            <a
              href={archivo && archivo[0].url ? archivo[0].url : null}
              class={userCampo ? false : "disabled_link"}
            >
              {archivo && archivo[0].nombre_archivo
                ? archivo[0].nombre_archivo
                : null}
            </a>
          </Col>
        </Row>
        <Row className="mb-3">
          <Col sm={4} xs={12}>
            <label className="forn-label label">
              Código Opción Técnica Usuario*
            </label>
          </Col>
          {/* <Col sm={3} xs={10}>
            <Select
              className="texto"
              onChange={(e) => setCodOpcTecnica(e)}
              options={listOpcionesTec}
              isDisabled={userCampo}
            />
          </Col> */}
          <Col sm={6} xs={10}>
            <input
              type="text"
              disabled
              defaultValue={
                codOpcTecnica && codOpcTecnica.codigo_opcion_tecninca
                  ? codOpcTecnica.codigo_opcion_tecninca
                  : null
              }
              className="form-control text-center texto"
              placeholder="Código Opción Técnica Usr"
              id="OT"
            ></input>
          </Col>
          <Col sm={2} xs={10}>
            <button
              type="button"
              disabled={userCampo}
              className="btn botonPositivo"
              onClick={async () => {
                await cargarOpcionesTec();
                setShowModOT(true);
              }}
            >
              Seleccionar
            </button>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col sm={4} xs={10}>
            <label className="forn-label label">Nombre Opción Técnica</label>
          </Col>
          <Col sm={8} xs={10}>
            <input
              type="text"
              className="form-control text-center texto"
              placeholder="Nombre Opción Técnica"
              required
              disabled={true}
              id="NombreOT"
              defaultValue={
                codOpcTecnica ? codOpcTecnica.nombre_opcion_tecnica : null
              }
            ></input>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col sm={5} xs={12}></Col>
          <Col sm={3} xs={10}>
            <button
              type="button"
              className="btn botonNegativo2"
              disabled={rolCampo}
              onClick={(e) => {
                setAcceptOT(true);
                setCodOpcTecnicaNew({
                  codigo_opcion_tecninca:
                    codOpcTecnica.codigo_opcion_tecninca_us,
                  nombre_opcion_tecnica: codOpcTecnica.nombre_opcion_tecnica_us,
                  id_infotecnica: codOpcTecnica.id_infotecnica_usuario,
                  descripcion_opcion_tecnica:
                    codOpcTecnica.descripcion_opcion_tecnica_us,
                });
                setAlcAccesos({
                  label: codOpcTecnica.alcance_certificacion_accesos_us
                    ? "SI"
                    : "NO",
                  value: codOpcTecnica.alcance_certificacion_accesos_us,
                });
                setCodOpcTecnicaAccesos(codOpcTecnica.codigo_opcion_tecninca);
                setNombOpcTecnica(codOpcTecnica.nombre_opcion_tecnica);
                setDescOpcTecnica(codOpcTecnica.descripcion_opcion_tecnica_us);
              }}
            >
              Confirmar código opción técnica
            </button>
          </Col>

          <Col sm={3} xs={10}>
            <button
              type="button"
              className="btn botonNegativo3"
              disabled={rolCampo}
              onClick={(e) => {
                setAcceptOT(false);
                setCodOpcTecnicaNew(null);
                setNombOpcTecnica(null);
                setDescOpcTecnica(null);
                setCodOpcTecnicaNew(null);
              }}
            >
              Rechazar código opción técnica
            </button>
          </Col>
          <Col sm={1} xs={10}></Col>
        </Row>
        {/* Tercera parte */}
        <p />
        <hr />
        <Row className="mb-3">
          <Col md={12}>
            <h3 className="subtitulo">Información técnica de la opción</h3>
          </Col>
        </Row>
        <Row className="mb-3">
          <Col sm={4} xs={12}>
            <label className="form-label label">
              Código Opción Técnica Accesos*
            </label>
          </Col>
          {/* <Col sm={8} xs={12}>
            <Select
              className="texto"
              onChange={(e) => setCodOpcTecnicaNew(e)}
              options={listOpcionesTec}
              isDisabled={rolCampo}
            />
            <Form.Control.Feedback type="invalid">
              Por favor introduzca un nombre.
            </Form.Control.Feedback>
          </Col> */}
          <Col sm={6} xs={10}>
            <input
              type="text"
              disabled
              defaultValue={codOpcTecnicaAccesos ? codOpcTecnicaAccesos : null}
              className="form-control text-center texto"
              placeholder="Código Opción Técnica Accesos"
              id="OT"
            ></input>
          </Col>
          <Col sm={2} xs={10}>
            <button
              type="button"
              className="btn botonPositivo"
              disabled={acceptOT}
              onClick={async () => {
                await cargarOpcionesTec();
                setShowModOTNew(true);
                setCodOpcTecnicaNew(null);
              }}
            >
              Seleccionar
            </button>
          </Col>
        </Row>
        <Row className="mb-3">
          <Col sm={4} xs={12}>
            <label className="form-label label">
              Aplicativo administrado por GAIA
            </label>
          </Col>
          <Col sm={8} xs={12}>
            <input
              type="text"
              disabled
              defaultValue={
                aplicativo ? (aplicativo.administrado_gaia ? "SI" : "NO") : null
              }
              className="form-control text-center texto"
              placeholder="SI/NO"
            ></input>
            <Form.Control.Feedback type="invalid">
              Por favor introduzca un nombre.
            </Form.Control.Feedback>
          </Col>
        </Row>
        <Row className="mb-3">
          <Col sm={4} xs={12}>
            <label className="form-label label">Código Opción Técnica</label>
          </Col>
          <Col sm={8} xs={12}>
            <input
              type="text"
              className="form-control text-center texto"
              placeholder="Código Opción Técnica"
              required
              value={codOpcTecnicaAccesos ? codOpcTecnicaAccesos : null}
              disabled={rolCampo || acceptOT || codOpcTecnicaNew}
              id="codOT"
            ></input>
            <Form.Control.Feedback type="invalid">
              Por favor introduzca un nombre.
            </Form.Control.Feedback>
          </Col>
        </Row>
        <Row className="mb-3">
          <Col sm={4} xs={12}>
            <label className="form-label label">Nombre opción Técnica</label>
          </Col>
          <Col sm={8} xs={12}>
            <input
              type="text"
              className="form-control text-center texto"
              placeholder="Nombre opción Técnica"
              required
              value={nombOpcTecnica ? nombOpcTecnica : null}
              disabled={rolCampo || acceptOT || codOpcTecnicaNew}
              id="NombreProceso"
              onChange={(e) => setNombOpcTecnica(e.target.value)}
            ></input>
            <Form.Control.Feedback type="invalid">
              Por favor introduzca un nombre.
            </Form.Control.Feedback>
          </Col>
        </Row>
        <Row className="mb-3">
          <Col sm={4} xs={12}>
            <label className="form-label label">
              Comentario opción técnica
            </label>
          </Col>
          <Col sm={8} xs={12}>
            <input
              className="form-control text-center"
              placeholder="Descripción opción técnica"
              rows="3"
              value={descOpcTecnica ? descOpcTecnica : null}
              disabled={rolCampo || acceptOT || codOpcTecnicaNew}
              id="Objetivo"
              onChange={(e) => setDescOpcTecnica(e.target.value)}
            ></input>
          </Col>
        </Row>
        <Row className="mb-3">
          <Col sm={4} xs={12}>
            <label className="form-label label">
              ¿Opción en alcance de certificación de accesos?
            </label>
          </Col>
          <Col sm={8} xs={12}>
            <Select
              isDisabled={rolCampo}
              options={[
                { label: "SI", value: 1 },
                { label: "NO", value: 0 },
              ]}
              value={alcAccesos}
              placeholder={"SI/NO"}
              onChange={(e) => {
                setAlcAccesos(e);
              }}
            />
            <Form.Control.Feedback type="invalid">
              Por favor introduzca un nombre.
            </Form.Control.Feedback>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col sm={7} xs={12}></Col>
          <Col sm={3} xs={12}>
            <button
              type="button"
              className="btn botonPositivo"
              onClick={() => detalleCert()}
            >
              Detalle de la certificación
            </button>
          </Col>
          <Col sm={2} xs={12}>
            <button
              type="button"
              className="btn botonNegativo3"
              onClick={() => detalleControles()}
            >
              Controles
            </button>
          </Col>
        </Row>

        <TableCustom
          data={
            dataTablaCertificacionesAll && dataTablaCertificacionesAll.resumen
              ? dataTablaCertificacionesAll.resumen
              : []
          }
          nameCol={[
            "Id Certificación",
            "Resultado",
            "Fecha de  certificación",
            "Cantidad de usuarios con la opción",
            "% de materializados",
            "% de remediadas",
            "Requiere control compensatorio",
          ]}
          nameRow={[
            "id_certificacion",
            "Resultado",
            "Fecha_certificacion",
            "Num_usuarios_opcion",
            "Porcentage_meterializado",
            "porcentage_remediado",
            "requiere_control",
          ]}
          nameId={"id_certificacion"}
          selectedData={selectedCert}
          setSelectedData={setSelectedCert}
        ></TableCustom>
        <p />

        {showDetCert ? (
          <>
            <TableContainer component={Paper}>
              <Table className={"text"} stickyHeader aria-label="sticky table">
                <TableHead>
                  <TableRow>
                    <StyledTableCell>ID Certificacion</StyledTableCell>
                    <StyledTableCell align="center">Opcion</StyledTableCell>
                    <StyledTableCell align="center">Resultado</StyledTableCell>
                    <StyledTableCell align="center">
                      Usuario que tiene la opción
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      Jefe de quien tiene la opción
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      Tipo de log validado
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      Resultado log
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      Fecha de último ingreso de acuerdo al log
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      ¿Requiere control compensatorio?
                    </StyledTableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {dataTablaCertificaciones.map((cert) => (
                    <>
                      <StyledTableRow>
                        <StyledTableCell
                          align="center"
                          rowSpan={encontrarMayor(cert.opcion)}
                        >
                          {cert.id_certificacion}
                        </StyledTableCell>
                      </StyledTableRow>

                      {cert.opcion.map((opc) => (
                        <>
                          <StyledTableRow>
                            <StyledTableCell
                              align="center"
                              rowSpan={opc.list_resultado.length + 1}
                            >
                              {opc.id_opcion}
                            </StyledTableCell>
                          </StyledTableRow>

                          {opc.list_resultado.map((result) => (
                            <>
                              <StyledTableRow>
                                <StyledTableCell align="center">
                                  {result.resultado_opcion}
                                </StyledTableCell>
                                <StyledTableCell align="center">
                                  {result.usuario_opcion}
                                </StyledTableCell>
                                <StyledTableCell align="center">
                                  {result.jefe_usuario_opcion}
                                </StyledTableCell>
                                <StyledTableCell align="center">
                                  {result.tipo_log_validado_opc}
                                </StyledTableCell>
                                <StyledTableCell align="center">
                                  {result.resultado_log_opc}
                                </StyledTableCell>
                                <StyledTableCell align="center">
                                  {result.fecha_ultimo_ingreso_opc}
                                </StyledTableCell>
                                <StyledTableCell align="center">
                                  {result.requiere_control_compensatorio === 0
                                    ? "NO"
                                    : "SI"}
                                </StyledTableCell>
                              </StyledTableRow>
                            </>
                          ))}
                        </>
                      ))}
                    </>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <p />
          </>
        ) : null}

        {showDetContr ? (
          <>
            <Row className="mb-3">
              <Col sm={6} xs={12}></Col>
              <Col sm={2} xs={12}>
                <button
                  type="button"
                  className="btn botonIngreso"
                  onClick={() => activarControl()}
                  disabled={rolCampo}
                >
                  Activar control
                </button>
              </Col>
              <Col sm={2} xs={12}>
                <button
                  type="button"
                  className="btn botonPositivo"
                  onClick={async () => {
                    await cargarControles();
                    setShowModContr(true);
                  }}
                  disabled={rolCampo}
                >
                  Asociar control
                </button>
              </Col>
              <Col sm={2} xs={12}>
                <button
                  type="button"
                  className="btn botonNegativo"
                  onClick={() => inactivarControl()}
                  disabled={rolCampo}
                >
                  Desasociar control
                </button>
              </Col>
            </Row>
            <p />
            <TableCustom
              data={dataTablaControlesFilter}
              nameCol={[
                "Id control",
                "Nombre control",
                "Estado relación",
                "Fecha inactivación",
                "Justificación inactivación",
              ]}
              nameRow={[
                "idcontrol",
                "nombre",
                "estado",
                "fecha_inactivacion",
                "motivo_inactivacion",
              ]}
              nameId={"idcontrol"}
              selectedData={dataControlSelected}
              setSelectedData={setDataControlSelected}
            />
            <p />
            <Row className="mb-3">
              <Col sm={4} xs={12}>
                <label className="form-label label">Otros Controles</label>
              </Col>
              <Col sm={8} xs={12}>
                <textarea
                  className="form-control text-center"
                  placeholder="Otros controles"
                  rows="3"
                  id="Objetivo"
                  defaultValue={otrosControles}
                  onChange={(e) => setOtrosControles(e.target.value)}
                ></textarea>
              </Col>
            </Row>
          </>
        ) : null}

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
                {props.permisos.crear ? (
                  <button
                    type="button"
                    className="btn botonNegativo3"
                    id="send"
                    disabled={rolCampo}
                  >
                    Alerta por información deficiente
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
            <Link to="OpcionesCriticas">
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
