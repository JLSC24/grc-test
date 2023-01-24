import React, { useEffect } from "react";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import TablePagination from "@material-ui/core/TablePagination";
import Checkbox from "@material-ui/core/Checkbox";
import Toolbar from "@material-ui/core/Toolbar";
import { Button, Row, Col, Form, Alert } from "react-bootstrap";
import { Link } from "react-router-dom";
import { AiOutlineSave } from "react-icons/ai";
import Select from "react-select";
import axios from "axios";
import Loader from "react-loader-spinner";

import { adalApiFetch } from "../auth/adalConfig";
import AADService from "../auth/authFunctions";

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

const useStyles = makeStyles({
  root: {
    width: "100%",
  },
  container: {
    maxHeight: "57vh",
    minHeight: "57vh",
  },
});
export default function UnidadesAnalistas_sin() {
  const serviceAAD = new AADService();
  const classes = useStyles();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [selected, setSelected] = React.useState([]);
  const [ButtonEdit, SetButtonEdit] = React.useState(false);
  const [data, setData] = React.useState([]);
  const [dataAlert, setDataAlert] = React.useState(null);
  const [dataUnidad, setDataUnidad] = React.useState([]);
  const [dataAnalista, setDataAnalista] = React.useState(null);
  const [dataResponsable, setDataResponsable] = React.useState([]);
  const [datResponsables, setDatResponsables] = React.useState(null);
  const [datUnidad, setDatUnidad] = React.useState(null);
  const [datAnalista, setDatAnalista] = React.useState(null);
  const [selectedValueResponsable, setSelectedValueResponsable] =
    React.useState(null);
  const [loadingData, setLoadingData] = React.useState(false);
  const [buscando, setBuscando] = React.useState(null);
  const [dataBusqueda, setDataBusqueda] = React.useState([]);
  const [companias, setCompanias] = React.useState(null);
  const [unidadRO, setNombreUnidadRO] = React.useState(null);
  const [companiaAnalista, setCompaniaAnalista] = React.useState([]);

  useEffect(() => {
    //TODO - ESTA VISTA SE CARGARÁ A AMBOS ROLES ANALISTA DE RIESGO Y GERENTE DE RIESGOS
    //localStorage.getItem("correo_usuario")
    const correoAnalistaLog = serviceAAD.getUser().userName;
    var unidadRO_AnalistaLog = 0;
    /* const correoAnalistaLog = "vmoncada@bancolombia.com.co"; */
    setLoadingData(true);
    async function getData() {
      const result_unidadRO_analista = await axios
        .get(process.env.REACT_APP_API_URL + "/rxunidad_analista/", {
          headers: {
            Authorization: "Bearer " + serviceAAD.getToken(),
          },
        })
        .catch(function (error) {
          if (error.response) {
            // Request made and server responded
            console.error(error.response.data);
            console.error(error.response.status);
            console.error(error.response.headers);
          } else if (error.request) {
            // The request was made but no response was received
            console.error(error.request);
          } else {
            // Something happened in setting up the request that triggered an Error
            console.error("Error", error.message);
          }
        });
      let unidad_Analista = result_unidadRO_analista.data;

      unidad_Analista.map((registro) => {
        if (registro.idusuario.idusuario.email === correoAnalistaLog) {
          unidadRO_AnalistaLog = registro.idunidad_riesgo.idunidad_riesgo;
          setNombreUnidadRO(registro.idunidad_riesgo.nombre);
        }
      });

      const response_compania = await axios
        .get(process.env.REACT_APP_API_URL + "/maestros_ro/compania/", {
          headers: {
            Authorization: "Bearer " + serviceAAD.getToken(),
          },
        })
        .catch(function (error) {
          console.error(error);
        });
      let data_companias = response_compania.data;
      setCompanias(data_companias);

      const result_unidadRO_companias = await axios.get(
        process.env.REACT_APP_API_URL + "/maestros_ro/rx_unidad_compania/" +
          unidadRO_AnalistaLog +
          "/",
        {
          headers: {
            Authorization: "Bearer " + serviceAAD.getToken(),
          },
        }
      );
      let unidad_Companias = result_unidadRO_companias.data;

      let companiaAnalista = [];

      unidad_Companias.map((unidadCOmp) => {
        companiaAnalista.push(unidadCOmp.idcompania);
      });

      const result = await axios.get(
        process.env.REACT_APP_API_URL + "/admin_riesgos/unidad",
        {
          headers: {
            Authorization: "Bearer " + serviceAAD.getToken(),
          },
        }
      );
      let data = result.data;
      let temp = [];

      companiaAnalista.map((compani) => {
        data.OC.map((dat) => {
          if (dat.idcompania === compani && dat.nombre !== undefined) {
            temp.push({
              id: dat.idoc,
              idoc: dat.idoc,
              tipo: "Objeto de costo",
              nombre: dat.nombre,
              tipo_oc: dat.tipo_oc,
              descripcion_oc: dat.descripcion_oc,
              nivel: dat.nivel,
              padre: dat.padre,
              oc_n1: dat.oc_n1,
              oc_n2: dat.oc_n2,
              estado_oc: dat.estado_oc,
              fecha_lanzamiento: dat.fecha_lanzamiento,
              codigo_vp: dat.codigo_vp,
              driver_disribucion: dat.driver_disribucion,
              unidad_aplicacion: dat.unidad_aplicacion,
              proinformgfinanciera: dat.proinformgfinanciera,
              justificacion_distribucion: dat.justificacion_distribucion,
              homologacion_oc: dat.homologacion_oc,
              idcompania: dat.idcompania,
              responsable_negocio: dat.responsable_negocio,
              area_organizacional: dat.area_organizacional,
              unidad_ro: dat.unidad_ro,
              analista_ro: dat.analista_ro,
            });
          }
        });
      });
      companiaAnalista.map((compani) => {
        data.cuenta_contable.map((dat) => {
          if (dat.idcompania === compani && dat.nombre !== undefined) {
            temp.push({
              id: dat.idcuenta_contable,
              tipo: "Cuenta Contable",
              idcuenta_contable: dat.idcuenta_contable,
              nombre: dat.nombre,
              descripcion: dat.descripcion,
              nivel: dat.nivel,
              padre: dat.padre,
              cuenta_n1: dat.cuenta_n1,
              numero_cuenta: dat.numero_cuenta,
              estado: dat.estado,
              idcompania: dat.idcompania,
              responsable_negocio: dat.responsable_negocio,
              area_organizacional: dat.area_organizacional,
              unidad_ro: dat.unidad_ro,
              analista_ro: dat.analista_ro,
            });
          }
        });
      });
      companiaAnalista.map((compani) => {
        data.Producto.map((dat) => {
          if (dat.idcompania === compani && dat.nombre !== undefined) {
            temp.push({
              id: dat.idprod,
              tipo: "Producto",
              idprod: dat.idprod,
              nombre: dat.nombre,
              descripcion_prod: dat.descripcion_prod,
              nivel: dat.nivel,
              padre: dat.padre,
              producto_n1: dat.producto_n1,
              producto_n2: dat.producto_n2,
              estado_prod: dat.estado_prod,
              fecha_lanzamiento: dat.fecha_lanzamiento,
              homologacion_prod: dat.homologacion_prod,
              idcompania: dat.idcompania,
              responsable_negocio: dat.responsable_negocio,
              area_organizacional: dat.area_organizacional,
              unidad_ro: dat.unidad_ro,
              analista_ro: dat.analista_ro,
            });
          }
        });
      });
      companiaAnalista.map((compani) => {
        data.Canal.map((dat) => {
          if (dat.idcompania === compani && dat.nombre !== undefined) {
            temp.push({
              id: dat.idcanal,
              tipo: "Canal",
              idcanal: dat.idcanal,
              nombre: dat.nombre,
              descripcion_canal: dat.descripcion_canal,
              nivel: dat.nivel,
              padre: dat.padre,
              canal_n1: dat.canal_n1,
              canal_n2: dat.canal_n2,
              estado_canal: dat.estado_canal,
              fecha_lanzamiento: dat.fecha_lanzamiento,
              homologacion_canal: dat.homologacion_canal,
              idcompania: dat.idcompania,
              responsable_negocio: dat.responsable_negocio,
              area_organizacional: dat.area_organizacional,
              unidad_ro: dat.unidad_ro,
              analista_ro: dat.analista_ro,
            });
          }
        });
      });
      companiaAnalista.map((compani) => {
        data.Proceso.map((dat) => {
          if (dat.idcompania === compani && dat.nombre !== undefined) {
            temp.push({
              tipo: "Proceso",
              id: dat.id,
              idproceso: dat.idproceso,
              nombre: dat.nombre,
              objetivo: dat.objetivo,
              idcompania: dat.idcompania,
              nivel: dat.nivel,
              padre: dat.padre,
              proseso_n1: dat.proseso_n1,
              proseso_n2: dat.proseso_n2,
              proseso_n3: dat.proseso_n3,
              responsable_negocio: dat.responsable_negocio,
              area_organizacional: dat.area_organizacional,
              estado_proceso: dat.estado_proceso,
              tipo_proceso: dat.tipo_proceso,
              bia: dat.bia,
              sox: dat.sox,
              laft: dat.laft,
              clasificacion_ro: dat.clasificacion_ro,
              nivel_tercerizacion: dat.nivel_tercerizacion,
              documentacion_proceso: dat.documentacion_proceso,
              motivo_estado_inactivo: dat.motivo_estado_inactivo,
              unidad_ro: dat.unidad_ro,
              analista_ro: dat.analista_ro,
              criticidad_proceso: dat.criticidad_proceso,
              idevaluacion: dat.idevaluacion,
              estado_validacion: dat.estado_validacion,
              fecha_ult_validacion_eva: dat.fecha_ult_validacion_eva,
              fecha_prog_actualizacion: dat.fecha_prog_actualizacion,
              motivo_actualizacion: dat.motivo_actualizacion,
              estado_actualizacion: dat.estado_actualizacion,
            });
          }
        });
      });

      const resultAnalista = await fetch(
        process.env.REACT_APP_API_URL + "/admin_riesgos/analista",
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            Authorization: "Bearer " + serviceAAD.getToken(),
          },
        }
      ).catch(function (error) {
        console.error(error);
      });
      let dataAnalista = await resultAnalista.json();

      companiaAnalista.map((compani) => {
        dataAnalista.OC.map((dat) => {
          if (dat.idcompania === compani && dat.nombre !== undefined) {
            temp.push({
              id: dat.idoc,
              idoc: dat.idoc,
              tipo: "Objeto de costo",
              nombre: dat.nombre,
              tipo_oc: dat.tipo_oc,
              descripcion_oc: dat.descripcion_oc,
              nivel: dat.nivel,
              padre: dat.padre,
              oc_n1: dat.oc_n1,
              oc_n2: dat.oc_n2,
              estado_oc: dat.estado_oc,
              fecha_lanzamiento: dat.fecha_lanzamiento,
              codigo_vp: dat.codigo_vp,
              driver_disribucion: dat.driver_disribucion,
              unidad_aplicacion: dat.unidad_aplicacion,
              proinformgfinanciera: dat.proinformgfinanciera,
              justificacion_distribucion: dat.justificacion_distribucion,
              homologacion_oc: dat.homologacion_oc,
              idcompania: dat.idcompania,
              responsable_negocio: dat.responsable_negocio,
              area_organizacional: dat.area_organizacional,
              unidad_ro: dat.unidad_ro,
              analista_ro: dat.analista_ro,
            });
          }
        });
      });
      companiaAnalista.map((compani) => {
        dataAnalista.cuenta_contable.map((dat) => {
          if (dat.idcompania === compani && dat.nombre !== undefined) {
            temp.push({
              id: dat.idcuenta_contable,
              tipo: "Cuenta Contable",
              idcuenta_contable: dat.idcuenta_contable,
              nombre: dat.nombre,
              descripcion: dat.descripcion,
              nivel: dat.nivel,
              padre: dat.padre,
              cuenta_n1: dat.cuenta_n1,
              numero_cuenta: dat.numero_cuenta,
              estado: dat.estado,
              idcompania: dat.idcompania,
              responsable_negocio: dat.responsable_negocio,
              area_organizacional: dat.area_organizacional,
              unidad_ro: dat.unidad_ro,
              analista_ro: dat.analista_ro,
            });
          }
        });
      });
      companiaAnalista.map((compani) => {
        dataAnalista.Producto.map((dat) => {
          if (dat.idcompania === compani && dat.nombre !== undefined) {
            temp.push({
              id: dat.idprod,
              tipo: "Producto",
              idprod: dat.idprod,
              nombre: dat.nombre,
              descripcion_prod: dat.descripcion_prod,
              nivel: dat.nivel,
              padre: dat.padre,
              producto_n1: dat.producto_n1,
              producto_n2: dat.producto_n2,
              estado_prod: dat.estado_prod,
              fecha_lanzamiento: dat.fecha_lanzamiento,
              homologacion_prod: dat.homologacion_prod,
              idcompania: dat.idcompania,
              responsable_negocio: dat.responsable_negocio,
              area_organizacional: dat.area_organizacional,
              unidad_ro: dat.unidad_ro,
              analista_ro: dat.analista_ro,
            });
          }
        });
      });
      companiaAnalista.map((compani) => {
        dataAnalista.Canal.map((dat) => {
          if (dat.idcompania === compani && dat.nombre !== undefined) {
            temp.push({
              id: dat.idcanal,
              tipo: "Canal",
              idcanal: dat.idcanal,
              nombre: dat.nombre,
              descripcion_canal: dat.descripcion_canal,
              nivel: dat.nivel,
              padre: dat.padre,
              canal_n1: dat.canal_n1,
              canal_n2: dat.canal_n2,
              estado_canal: dat.estado_canal,
              fecha_lanzamiento: dat.fecha_lanzamiento,
              homologacion_canal: dat.homologacion_canal,
              idcompania: dat.idcompania,
              responsable_negocio: dat.responsable_negocio,
              area_organizacional: dat.area_organizacional,
              unidad_ro: dat.unidad_ro,
              analista_ro: dat.analista_ro,
            });
          }
        });
      });
      companiaAnalista.map((compani) => {
        dataAnalista.Proceso.map((dat) => {
          if (dat.idcompania === compani && dat.nombre !== undefined) {
            temp.push({
              tipo: "Proceso",
              id: dat.id,
              idproceso: dat.idproceso,
              nombre: dat.nombre,
              objetivo: dat.objetivo,
              idcompania: dat.idcompania,
              nivel: dat.nivel,
              padre: dat.padre,
              proseso_n1: dat.proseso_n1,
              proseso_n2: dat.proseso_n2,
              proseso_n3: dat.proseso_n3,
              responsable_negocio: dat.responsable_negocio,
              area_organizacional: dat.area_organizacional,
              estado_proceso: dat.estado_proceso,
              tipo_proceso: dat.tipo_proceso,
              bia: dat.bia,
              sox: dat.sox,
              laft: dat.laft,
              clasificacion_ro: dat.clasificacion_ro,
              nivel_tercerizacion: dat.nivel_tercerizacion,
              documentacion_proceso: dat.documentacion_proceso,
              motivo_estado_inactivo: dat.motivo_estado_inactivo,
              unidad_ro: dat.unidad_ro,
              analista_ro: dat.analista_ro,
              criticidad_proceso: dat.criticidad_proceso,
              idevaluacion: dat.idevaluacion,
              estado_validacion: dat.estado_validacion,
              fecha_ult_validacion_eva: dat.fecha_ult_validacion_eva,
              fecha_prog_actualizacion: dat.fecha_prog_actualizacion,
              motivo_actualizacion: dat.motivo_actualizacion,
              estado_actualizacion: dat.estado_actualizacion,
            });
          }
        });
      });

      temp = temp.filter((maestro) => maestro.id !== undefined);
      setDataUnidad(temp);
      setDataBusqueda(temp);

      const result_usuarios = await fetch(
        process.env.REACT_APP_API_URL + "/usuariosrol/0/3/",
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            Authorization: "Bearer " + serviceAAD.getToken(),
          },
        }
      );
      let data_usuarios = await result_usuarios.json();
      let aux = [];
      data_usuarios.map((dat) => {
        aux.push({ value: dat.idposicion, label: dat.nombre });
        return null;
      });
      setDatResponsables(aux);

      const result_unidadRiesgo = await fetch(
        process.env.REACT_APP_API_URL + "/maestros_ro/unidad_riesgo/",
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            Authorization: "Bearer " + serviceAAD.getToken(),
          },
        }
      );

      let data_unidadRiesgo = await result_unidadRiesgo.json();

      setDatUnidad(data_unidadRiesgo);

      const result2 = await fetch(process.env.REACT_APP_API_URL + "/usuariosrol/0/4/", {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: "Bearer " + serviceAAD.getToken(),
        },
      }).catch(function (error) {
        console.error(error);
      });
      let data2 = await result2.json();
      const result3 = await fetch(process.env.REACT_APP_API_URL + "/usuariosrol/0/11/", {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: "Bearer " + serviceAAD.getToken(),
        },
      });
      let data3 = await result3.json();
      let data4 = data2.concat(data3);
      setDatAnalista(data4.sort(function (a, b) {
        if (a.nombre > b.nombre) {
          return 1;
        }
        if (a.nombre < b.nombre) {
          return -1;
        }
        // a must be equal to b
        return 0;
      }));
    }
    setLoadingData(false);
    getData();
  }, []);

  /* Funciones para paginación */
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };
  /* Fin de funciones para paginación */

  /* const handleChange = (e, data) => {
    setSelectedValueResponsable(e.value);

    dataResponsable.map((dat) => {
      if (dat.id === data.id && dat.tipo === data.tipo) {
        dat.responsable_negocio = e.value;
      }
    });
  }; */

  const cambiarUnidad = (data) => {
    let unidad = document.getElementById("UnidadRO" + data.id).value
      ? parseInt(document.getElementById("UnidadRO" + data.id).value)
      : null;
    data.unidad_ro = unidad;
  };

  const cambiarAnalista = (data) => {
    let analista = document.getElementById("AnalistaRO" + data.id).value
      ? parseInt(document.getElementById("AnalistaRO" + data.id).value)
      : null;
    data.analista_ro = analista;
  };

  const guardarMaestro = (data) => {
    if (data.tipo === "Objeto de costo") {
      fetch(process.env.REACT_APP_API_URL + "/maestros_ro/oc/" + data.id + "/", {
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
              setDataAlert({ msg: "Actualizado correctamente" });
              setTimeout(function () {
                setDataAlert(null);
              }, 4000);
            } else if (data.status >= 500) {
              console.error(data.status);
            } else if (data.status >= 400 && data.status < 500) {
              console.error(data.status);
            }
          })
        )
        .catch(function (error) {
          console.error(error);
        });
    } else if (data.tipo === "Cuenta Contable") {
      fetch(
        process.env.REACT_APP_API_URL + "/maestros_ro/cuenta_contable/" + data.id + "/",
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
              setDataAlert({ msg: "Actualizado correctamente" });
              setTimeout(function () {
                setDataAlert(null);
              }, 4000);
            } else if (data.status >= 500) {
            } else if (data.status >= 400 && data.status < 500) {
            }
          })
        )
        .catch(function (error) {
          console.error(error);
        });
    } else if (data.tipo === "Producto") {
      fetch(process.env.REACT_APP_API_URL + "/maestros_ro/producto/" + data.id + "/", {
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
              setDataAlert({ msg: "Actualizado correctamente" });
              setTimeout(function () {
                setDataAlert(null);
              }, 4000);
            } else if (data.status >= 500) {
            } else if (data.status >= 400 && data.status < 500) {
            }
          })
        )
        .catch(function (error) {
          console.error(error);
        });
    } else if (data.tipo === "Canal") {
      fetch(process.env.REACT_APP_API_URL + "/maestros_ro/canal/" + data.id + "/", {
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
              setDataAlert({ msg: "Actualizado correctamente" });
              setTimeout(function () {
                setDataAlert(null);
              }, 4000);
            } else if (data.status >= 500) {
            } else if (data.status >= 400 && data.status < 500) {
            }
          })
        )
        .catch(function (error) {
          console.error(error);
        });
    } else if (data.tipo === "Producto") {
      fetch(process.env.REACT_APP_API_URL + "/maestros_ro/proceso/" + data.id + "/", {
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
              setDataAlert({ msg: "Actualizado correctamente" });
              setTimeout(function () {
                setDataAlert(null);
              }, 4000);
            } else if (data.status >= 500) {
            } else if (data.status >= 400 && data.status < 500) {
            }
          })
        )
        .catch(function (error) {
          console.error(error);
        });
    }
  };

  function asignaNombreCompanias(idCompania, companias) {
    return companias.map((compania) => {
      if (idCompania === compania.idcompania) {
        return compania.compania;
      }
    });
  }

  async function buscar(e) {
    e.preventDefault();
    //await setBuscando(e.target.value);
    var search = dataUnidad.filter((item) => {
      if (
        String(item.id).toLowerCase().includes(e.target.value.toLowerCase()) ||
        item.nombre.toLowerCase().includes(e.target.value.toLowerCase()) ||
        item.tipo.toLowerCase().includes(e.target.value.toLowerCase()) /* ||
        asignaNombreCompanias(item.idcompania, companias)
          .toLowerCase()
          .includes(e.target.value.toLowerCase()) */
      ) {
        return item;
      }
    });
    await setBuscando(e.target.value);
    await setDataBusqueda(search);
  }

  return (
    <>
      {" "}
      <Row className="mb-3 mt-3">
        <Col md={12}>
          <h1 className="titulo">Maestros sin Analista RO</h1>
        </Col>
      </Row>
      <Row
        style={{ marginTop: "1%", marginBottom: "0.5%" }}
        className="mb-3 mt-3"
      >
        <Col sm={4} xs={12}>
          <Form className="buscar">
            <Form.Control
              value={buscando}
              onChange={(e) => buscar(e)}
              type="text"
              placeholder="Buscar"
            />
          </Form>
        </Col>
      </Row>
      {loadingData ? (
        <Row className="mb-3 mt-5">
          <Col>
            <Loader
              type="Oval"
              color="#FFBF00"
              style={{ textAlign: "center", position: "static" }}
            />
          </Col>
        </Row>
      ) : (
        <>
          {dataAlert ? <Alert variant="success">{dataAlert.msg}</Alert> : null}

          <Paper className={classes.root}>
            <TableContainer component={Paper} className={classes.container}>
              <Table className={"text"} stickyHeader aria-label="sticky table">
                {/* Inicio de encabezado */}
                <TableHead className="titulo">
                  <TableRow>
                    {/* <StyledTableCell padding="checkbox"></StyledTableCell> */}
                    <StyledTableCell align="left">Id</StyledTableCell>
                    <StyledTableCell align="left">Nombre</StyledTableCell>
                    <StyledTableCell align="left">Tipo Maestro</StyledTableCell>
                    <StyledTableCell align="left">Compañia</StyledTableCell>
                    <StyledTableCell align="left">
                      Seleccionar Unidad
                    </StyledTableCell>
                    <StyledTableCell align="left">
                      Seleccionar Analista
                    </StyledTableCell>

                    <StyledTableCell align="left">Guardar</StyledTableCell>
                  </TableRow>
                </TableHead>
                {/* Fin de encabezado */}
                {/* Inicio de cuerpo de la tabla */}
                <TableBody>
                  {dataBusqueda
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row, index) => {
                      return (
                        <StyledTableRow key={row.id} hover tabIndex={-1}>
                          {/* <StyledTableCell component="th" scope="row">
                        <Checkbox checked={isItemSelected} />
                      </StyledTableCell> */}
                          <StyledTableCell component="th" scope="row">
                            {row.id !== null ? row.id : null}
                          </StyledTableCell>
                          <StyledTableCell align="left">
                            {row.nombre !== null ? row.nombre : null}
                          </StyledTableCell>
                          <StyledTableCell align="left">
                            {row.tipo !== null ? row.tipo : null}
                          </StyledTableCell>
                          <StyledTableCell align="left">
                            {row.idcompania !== null
                              ? asignaNombreCompanias(row.idcompania, companias)
                              : null}
                          </StyledTableCell>
                          <StyledTableCell align="left">
                            <select
                              onChange={() => cambiarUnidad(row)}
                              className="form-control texto"
                              id={"UnidadRO" + row.id}
                            >
                              <option value="">Seleccione unidad RO</option>
                              {datUnidad !== null
                                ? datUnidad.map((unidadRO) => {
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
                          </StyledTableCell>
                          <StyledTableCell align="left">
                            <select
                              onChange={() => cambiarAnalista(row)}
                              className="form-control texto"
                              id={"AnalistaRO" + row.id}
                            >
                              <option value="">Seleccione analista RO</option>
                              {datAnalista !== null
                                ? datAnalista.map((analista) => {
                                    return (
                                      <option
                                        className="texto"
                                        value={analista.idposicion}
                                      >
                                        {analista.nombre}
                                      </option>
                                    );
                                  })
                                : null}
                            </select>
                          </StyledTableCell>
                          <StyledTableCell align="left">
                            <Button
                              className="botonPositivo2"
                              onClick={() => guardarMaestro(row)}
                            >
                              <AiOutlineSave />
                            </Button>
                          </StyledTableCell>
                        </StyledTableRow>
                      );
                    })}
                </TableBody>
                {/* Fin de cuerpo de la tabla */}
              </Table>
            </TableContainer>
            {/* Inicio de paginación */}
            <TablePagination
              rowsPerPageOptions={[10, 25, 100]}
              component="div"
              count={dataBusqueda.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
            {/* Fin de paginación */}
          </Paper>
        </>
      )}
    </>
  );
}
