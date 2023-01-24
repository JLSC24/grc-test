import React, { useState, useEffect } from "react";
import { Row, Col, Form, Alert } from "react-bootstrap";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import TablePagination from "@material-ui/core/TablePagination";
import Switch from "@material-ui/core/Switch";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import { Link, useHistory } from "react-router-dom";
import { Treebeard } from "react-treebeard";
import Loader from "react-loader-spinner";
import Select from "react-select";
import axios from "axios";
import ModCargaArchivo from "../../AdminAplicativo/ModCargaArchivo";

import AADService from "../../auth/authFunctions";
import ModalCertificaciones from "./ModalCertificaciones";
import ModalContratos from "./ModalContratos";

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
    maxHeight: "60vh",
    minHeight: "20vh",
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

const sector = [
  { value: "Agricultura", label: "Agricultura" },
  { value: "Alimentación", label: "Alimentación" },
  { value: "Comercio", label: "Comercio" },
  { value: "Construcción", label: "Construcción" },
  { value: "Educación", label: "Educación" },
  {
    value: "Fabricación de material de transporte",
    label: "Fabricación de material de transporte",
  },
  { value: "Función pública", label: "Función pública" },
  { value: "Hotelería y turismo", label: "Hotelería y turismo" },
  { value: "Industrias químicas", label: "Industrias químicas" },
  {
    value: "Ingeniería mecánica y eléctrica",
    label: "Ingeniería mecánica y eléctrica",
  },
  { value: "Medios de comunicación", label: "Medios de comunicación" },
  { value: "Minería", label: "Minería" },
  {
    value: "Petróleo y producción de gas",
    label: "Petróleo y producción de gas",
  },
  {
    value: "Producción de metales básicos",
    label: "Producción de metales básicos",
  },
  { value: "Salud", label: "Salud" },
  { value: "Servicios financieros", label: "Servicios financieros" },
  { value: "Servicios públicos", label: "Servicios públicos" },
  { value: "Silvicultura", label: "Silvicultura" },
  { value: "Telecomunicaciones", label: "Telecomunicaciones" },
  { value: "Textiles", label: "Textiles" },
  { value: "Transporte", label: "Transporte" },
  { value: "Transporte marítimo", label: "Transporte marítimo" },
];

export default function EditarProveedor(props) {
  const [actualizar, setActualizar] = useState(null);
  const serviceAAD = new AADService();
  const [dataProveedor, setDataProveedor] = useState(null);
  const [state, setState] = useState("Activo");
  const [idState, setIdState] = useState(true);
  const [dataCiiu, setDataCiiu] = useState(null);
  const [ciiuSelected, setCiiuSelected] = useState(null);
  const [certificacionesProv, setCertificacionesProv] = useState([]);
  const [certificacionesProvDEL, setCertificacionesProvDEL] = useState([]);
  const [contratosProv, setContratosProv] = useState([]);
  const [responsable, setResponsable] = useState([]);
  const [responsableSelected, setResponsableSelected] = useState(null);
  const [selectedValueResponsable, setSelectedValueResponsable] =
    useState(null);
  const [sectorSelected, setSectorSelected] = useState(null);
  const [estadoPost, setEstadoPost] = useState({
    alerta: { id: 0, data: null },
  });
  const [habilitarBoton, setHabilitarBoton] = React.useState(true);
  let history = useHistory();

  const classes = useStyles();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [selected, setSelected] = React.useState([]);

  const [showModal, setShowModal] = React.useState(false);
  const [showModalContratos, setShowModalContratos] = React.useState(false);
  const [habilitarBotonesCerti, setHabilitarBotonesCerti] = useState(false);
  const [disableAll, setDisableAll] = useState(false);
  const [selectedPais, setSelectedPais] = useState(null);
  const [selectedEstado, setSelectedEstado] = useState(null);
  const [selectedCiudad, setSelectedCiudad] = useState(null);
  const [habilitarEstado, setHabilitarEstado] = useState(false);
  const [habilitarCiudad, setHabilitarCiudad] = useState(false);
  const [crearAnexoBool, setCrearAnexoBool] = useState(false);

  const [habilitarIdRol, setHabilitarIdRol] = useState(false);

  useEffect(() => {
    /* paises.map((dat) => {
      dat["value"] = dat["label"];
    }); */
    try {
      if (habilitarIdRol) {
        setHabilitarIdRol(true);
      } else {
        if (props.idrol === 1) {
          setHabilitarIdRol(true);
        } else if (props.idrol.includes(1)) {
          setHabilitarIdRol(true);
        } else {
          setHabilitarIdRol(false);
        }
      }
    } catch (error) {
      if (props.idrol === 1) {
        setHabilitarIdRol(true);
      } else if (props.idrol.includes(1)) {
        setHabilitarIdRol(true);
      } else {
        setHabilitarIdRol(false);
      }
    }
    let ciiu_temp;
    let responsable_temp;
    let idProveedorTemp;
    let proveedorTemp;
    async function getUsuarios() {
      const response_BO = await axios.get(
        process.env.REACT_APP_API_URL + "/usuariosrol/0/3",
        {
          headers: {
            Authorization: "Bearer " + serviceAAD.getToken(),
          },
        }
      );
      let dataBO = response_BO.data;

      const response_RM = await axios.get(
        process.env.REACT_APP_API_URL + "/usuariosrol/0/2",
        {
          headers: {
            Authorization: "Bearer " + serviceAAD.getToken(),
          },
        }
      );
      let dataRM = response_RM.data;

      let data_concat = dataBO.concat(dataRM);
      let temp = [];
      data_concat.map((dat) => {
        temp.push({
          value: dat.idposicion,
          label: dat.nombre,
          rol: dat.perfil,
        });
        return null;
      });
      responsable_temp = temp;
      setResponsable(temp);
    }
    async function getCIIU() {
      const response = await axios.get(
        process.env.REACT_APP_API_URL + "/parametros/ciiu/",
        {
          headers: {
            Authorization: "Bearer " + serviceAAD.getToken(),
          },
        }
      );
      let data = response.data;

      let temp = [];
      data.map((dat) => {
        temp.push({
          value: dat.cod,
          label: dat.nombre,
          idparametros_ciiu: dat.idparametros_ciiu,
        });
        return null;
      });
      ciiu_temp = temp;
      setDataCiiu(temp);
    }
    async function getDataProveedor() {
      await getCIIU();
      await getUsuarios();
      const response = await axios.get(
        process.env.REACT_APP_API_URL +
          "/maestros_ro/proveedor/" +
          localStorage.getItem("idProveedor") +
          "/",
        {
          headers: {
            Authorization: "Bearer " + serviceAAD.getToken(),
          },
        }
      );

      let data = response.data;
      console.log(data)
      if (data) {
        idProveedorTemp = data.ID_SAP;
        setResponsableSelected(data.Responsable);
        setCiiuSelected({ value: data.CIIU, label: data.CIIU });
        setSectorSelected({ value: data.Sector, label: data.Sector });
        let ubicacion_temp = [];
        if (data.Ubicacion) {
          ubicacion_temp = data.Ubicacion.split("-");
        }
        if (ubicacion_temp.length > 0) {
          setHabilitarEstado(true);
          setHabilitarCiudad(true);
          setSelectedPais(ubicacion_temp[0]);
          setSelectedEstado(ubicacion_temp[1]);
          setSelectedCiudad(ubicacion_temp[2]);
        }
      }
      if (data !== null && data.Responsable !== null) {
        setSelectedValueResponsable({
          value: data.Responsable,
          label: data.Nombre_responsable,
        });
      }
      if (data.Certificaciones) {
        setCertificacionesProv(
          data.Certificaciones.filter((obj) => obj.estado_rx !== 0)
        );
      }
      if (data.Contratos) {
        setContratosProv(data.Contratos);
      }

      try {
        const responseAdj = await axios.get(
          process.env.REACT_APP_API_URL +
            "/adjuntos/proveedor/" +
            idProveedorTemp +
            "/",
          {
            headers: {
              Authorization: "Bearer " + serviceAAD.getToken(),
            },
          }
        );
        let dataAdj = responseAdj.data;
        if (data) {
          data.Certificaciones.map((cert) => {
            if (dataAdj) {
              dataAdj.map((adj) => {
                if (cert.ID_certificacion === parseInt(adj.id_elemento_sec)) {
                  cert["adjunto"] = adj;
                }
              });
            }
          });
        }
      } catch (error) {
        console.error(error);
      }
      console.log(data);
      setDataProveedor(data);
    }
    getDataProveedor();
    /* if (!actualizar) {
      setActualizar([true]);
    } */
  }, [actualizar]);

  const handleChangeResp = (e) => {
    setSelectedValueResponsable({ value: e.value, label: e.label });
  };
  const MySelect = (props) => (
    <Select
      {...props}
      className="texto"
      defaultValue={selectedValueResponsable}
      options={props.options}
      placeholder={props.placeholder}
    />
  );
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };
  const handleChangeSector = (e) => {
    setSectorSelected({ value: e.value, label: e.label });
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

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }
    if (newSelected.length !== 0) {
      setHabilitarBotonesCerti(true);
    } else {
      setHabilitarBotonesCerti(false);
    }
    setSelected(newSelected);
  };
  const isSelected = (name) => selected.indexOf(name) !== -1;

  const sendData = async (e) => {
    e.preventDefault();
    //setHabilitarBoton(false);

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
        history.push("/EditarProveedor");
      }, 2500);
    }

    const timeElapsed = Date.now();

    const today = new Date(timeElapsed);

    let fechaISOinicial = formatoFecha(today.toISOString());

    function formatoFecha(fecha) {
      return fecha.split("T")[0];
    }

    let temp_certificaciones = [];

    certificacionesProv.map((cert) => {
      cert["estado_rx"] = 1;
      if (cert.method) {
        temp_certificaciones.push(cert);
      }
    });
    certificacionesProvDEL.map((cert) => {
      cert["estado_rx"] = 0;
      temp_certificaciones.push(cert);
    });

    const data = {
      NIT: document.getElementById("NitProveedor").value,
      ID_SAP: document.getElementById("IDSAPProveedor").value,
      Nombre_Proveedor: document.getElementById("NombreProveedor").value,
      Alcance_Proveedor: document.getElementById("tipoProveedor").value,
      CIIU: ciiuSelected ? ciiuSelected.label : null,
      Actividad_Economica: null,
      Clasificacion_CDA: document.getElementById("clasificacion").value,
      Responsable: selectedValueResponsable
        ? selectedValueResponsable.value.toString()
        : null,
      Ubicacion: selectedPais
        ? selectedPais + " - " + selectedEstado + " - " + selectedCiudad
        : null,
      Trayectoria:
        document.getElementById("TrayectoriaMercado").value !== ""
          ? document.getElementById("TrayectoriaMercado").value
          : null,
      Tipo_Empresa: document.getElementById("tipoEmpresa").value,
      Sector: sectorSelected ? sectorSelected.value : null,
      Tipo_Entidad: document.getElementById("tipoEntidad").value,
      usuario_creador: dataProveedor.usuario_creador,
      //usuario_modificador: serviceAAD.getUser().userName,
      fecha_creacion: dataProveedor.fecha_creacion,
      //fecha_modificacion: fechaISOinicial,
      certificaciones: temp_certificaciones,
      contratos: contratosProv,
    };
    fetch(process.env.REACT_APP_API_URL + "/maestros_ro/proveedor/", {
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
            let stadoArch = true;
            localStorage.setItem("idProveedor", response.ID_SAP);
            limpiar();
            response.certificaciones.map(async (cert, index) => {
              let info_Archivo = {
                Id_elemento: null,
                Id_elemento_sec: null,
                nombre_archivo: null,
                Archivo: null,
                Metodo: null,
                Id_adjunto: null,
              };

              let response_file = await ModCargaArchivo(
                "proveedor", //Nombre modelo
                response.ID_SAP, //Id_elemento
                cert.ID_certificacion, //Id_elemento_sec
                temp_certificaciones[index].fileCert.name, //Nombre archivo
                temp_certificaciones[index].fileCert, //Archivo
                temp_certificaciones[index].method, //Metodo para petición
                temp_certificaciones[index].adjunto
                  ? temp_certificaciones[index].adjunto.id_adjunto
                  : null //Id adjunto en la tabla
              );
              console.warn(await response_file);
              stadoArch = false;
              setEstadoPost({ id: 2, data: data });
              limpiar();
            });
            if (stadoArch) {
              setEstadoPost({ id: 2, data: data });
              limpiar();
            }
            /* redirigir(() => {}); */
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
  return (
    <>
      <AlertDismissibleExample alerta={estadoPost} />
      <ModalCertificaciones
        crearAnexoBool={crearAnexoBool}
        proveedor={dataProveedor}
        selected={selected}
        setSelected={setSelected}
        showModal={showModal}
        setShowModal={setShowModal}
        certificacionesProv={certificacionesProv}
        setCertificacionesProv={setCertificacionesProv}
      ></ModalCertificaciones>
      <ModalContratos
        showModalContratos={showModalContratos}
        setShowModalContratos={setShowModalContratos}
        contratosProv={contratosProv}
        setContratosProv={setContratosProv}
      ></ModalContratos>
      <Row className="mb-3">
        <Col md={12}>
          <h1 className="titulo">Editar Proveedor</h1>
        </Col>
      </Row>
      <Form id="formData" onSubmit={(e) => sendData(e)}>
        <Row className="mb-3">
          <Col sm={4} xs={12}>
            <label className="form-label label">NIT*</label>
          </Col>
          <Col sm={8} xs={12}>
            <input
              type="text"
              className="form-control text-center texto"
              placeholder="NIT"
              required
              disabled={!habilitarIdRol}
              defaultValue={
                dataProveedor && dataProveedor.NIT ? dataProveedor.NIT : null
              }
              id="NitProveedor"
            ></input>
            <Form.Control.Feedback type="invalid">
              Por favor introduzca un nombre.
            </Form.Control.Feedback>
          </Col>
        </Row>
        <Row className="mb-3">
          <Col sm={4} xs={12}>
            <label className="form-label label">ID SAP*</label>
          </Col>
          <Col sm={8} xs={12}>
            <input
              type="text"
              className="form-control text-center texto"
              placeholder="ID SAP"
              required
              disabled={!habilitarIdRol}
              defaultValue={
                dataProveedor && dataProveedor.ID_SAP
                  ? dataProveedor.ID_SAP
                  : null
              }
              id="IDSAPProveedor"
            ></input>
            <Form.Control.Feedback type="invalid">
              Por favor introduzca un nombre.
            </Form.Control.Feedback>
          </Col>
        </Row>
        <Row className="mb-3">
          <Col sm={4} xs={12}>
            <label className="form-label label">Nombre de Proveedor*</label>
          </Col>
          <Col sm={8} xs={12}>
            <input
              type="text"
              className="form-control text-center texto"
              placeholder="Nombre de Proveedor"
              required
              disabled={!habilitarIdRol}
              defaultValue={
                dataProveedor && dataProveedor.Nombre_Proveedor
                  ? dataProveedor.Nombre_Proveedor
                  : null
              }
              id="NombreProveedor"
            ></input>
            <Form.Control.Feedback type="invalid">
              Por favor introduzca un nombre.
            </Form.Control.Feedback>
          </Col>
        </Row>
        <Row className="mb-3">
          <Col sm={4} xs={12}>
            <label className="form-label label">Alcance del Proveedor*</label>
          </Col>
          <Col sm={8} xs={10}>
            <select
              className="form-control texto"
              id="tipoProveedor"
              disabled={!habilitarIdRol}
            >
              <option
                value={
                  dataProveedor && dataProveedor.Alcance_Proveedor
                    ? dataProveedor.Alcance_Proveedor
                    : null
                }
              >
                {dataProveedor && dataProveedor.Alcance_Proveedor
                  ? dataProveedor.Alcance_Proveedor
                  : null}
              </option>
              <option value="">Seleccione tipo proveedor</option>
              <option value="Nacional">Nacional</option>
              <option value="Internacional">Internacional</option>
            </select>
          </Col>
        </Row>
        <Row className="mb-3">
          <Col sm={4} xs={12}>
            <label className="form-label label">
              Responsable del proveedor
            </label>
          </Col>
          <Col sm={8} xs={10}>
            <MySelect
              className="texto"
              onChange={handleChangeResp}
              options={responsable}
            />
          </Col>
        </Row>
        {/* TODO: buscar API para ubicacion */}
        <Row className="mb-3">
          <Col sm={4} xs={12}>
            <label className="form-label label">Ubicación del Proveedor</label>
          </Col>
          <Col sm={2} xs={10}>
            <input
              disabled={!habilitarIdRol}
              type="text"
              className="form-control text-center texto"
              placeholder="Digite un País"
              id="UbicacionPais"
              defaultValue={selectedPais}
              onChange={(estado) => {
                setSelectedPais(estado.target.value);
                if (estado.target.value.length == 0) {
                  setHabilitarEstado(false);
                } else {
                  setHabilitarEstado(true);
                }
              }}
            ></input>
          </Col>
          <Col sm={3} xs={10}>
            {/* <Select
              id="ubicacionCiudad"
              placeholder={"Seleccione un estado..."}
              options={responsable}
              onChange={(option) => {
              }}
            /> */}
            <input
              type="text"
              className="form-control text-center texto"
              placeholder="Digite un Estado/Departamento"
              id="UbicacionEstado"
              disabled={!habilitarIdRol}
              defaultValue={selectedEstado}
              onChange={(estado) => {
                setSelectedEstado(estado.target.value);
                if (estado.target.value.length == 0) {
                  setHabilitarCiudad(false);
                } else {
                  setHabilitarCiudad(true);
                }
              }}
            ></input>
          </Col>
          <Col sm={3} xs={10}>
            {/* <Select
              id="ubicacionCiudad"
              placeholder={"Seleccione una ciudad..."}
              options={responsable}
              onChange={(option) => {
              }}
            /> */}
            <input
              type="text"
              className="form-control text-center texto"
              placeholder="Digite una Ciudad"
              id="UbicacionCiudad"
              disabled={!habilitarIdRol}
              defaultValue={selectedCiudad}
              onChange={(ciudad) => {
                setSelectedCiudad(ciudad.target.value);
              }}
            ></input>
          </Col>
        </Row>
        <Row className="mb-3">
          <Col sm={4} xs={12}>
            <label className="form-label label">
              Trayectoria en el mercado
            </label>
          </Col>
          <Col sm={8} xs={12}>
            <input
              type="number"
              className="form-control text-center texto"
              placeholder="Trayectoria en el mercado (años)"
              disabled={!habilitarIdRol}
              id="TrayectoriaMercado"
              min="1"
              defaultValue={
                dataProveedor && dataProveedor.Trayectoria
                  ? dataProveedor.Trayectoria
                  : null
              }
            ></input>
            <Form.Control.Feedback type="invalid">
              Por favor introduzca un nombre.
            </Form.Control.Feedback>
          </Col>
        </Row>
        <Row className="mb-3">
          <Col sm={4} xs={12}>
            <label className="form-label label">Tipo de empresa</label>
          </Col>
          <Col sm={8} xs={10}>
            <select
              className="form-control texto"
              id="tipoEmpresa"
              disabled={!habilitarIdRol}
            >
              <option
                value={
                  dataProveedor && dataProveedor.Tipo_Empresa !== ""
                    ? dataProveedor.Tipo_Empresa
                    : null
                }
              >
                {dataProveedor && dataProveedor.Tipo_Empresa !== ""
                  ? dataProveedor.Tipo_Empresa
                  : "Seleccione tipo Empresa"}
              </option>
              <option value="Microempresa">Microempresa</option>
              <option value="Pequeña empresa">Pequeña empresa</option>
              <option value="Mediana empresa">Mediana empresa</option>
              <option value="Gran empresa">Gran empresa</option>
            </select>
          </Col>
        </Row>
        <Row className="mb-3">
          <Col sm={4} xs={12}>
            <label className="form-label label">Sector</label>
          </Col>
          <Col sm={8} xs={10}>
            <Select
              isDisabled={!habilitarIdRol}
              id="Sector"
              placeholder={"Seleccione un Sector..."}
              options={sector}
              value={sectorSelected}
              onChange={(e) => handleChangeSector(e)}
            />
          </Col>
        </Row>
        <Row className="mb-3">
          <Col sm={4} xs={12}>
            <label className="form-label label">
              Proveedor entidad publica o privada
            </label>
          </Col>
          <Col sm={8} xs={10}>
            <select
              className="form-control texto"
              id="tipoEntidad"
              disabled={!habilitarIdRol}
            >
              <option
                value={
                  dataProveedor && dataProveedor.Tipo_Entidad !== ""
                    ? dataProveedor.Tipo_Entidad
                    : null
                }
              >
                {dataProveedor && dataProveedor.Tipo_Entidad !== ""
                  ? dataProveedor.Tipo_Entidad
                  : "Seleccione..."}
              </option>
              <option value="Publico">Publico</option>
              <option value="Privado">Privado</option>
            </select>
          </Col>
        </Row>

        {/* <Row className="mb-3">
          <Col sm={4} xs={12}>
            <label className="form-label label">CIIU</label>
          </Col>
          <Col sm={8} xs={12}>
            <input
              type="text"
              className="form-control text-center texto"
              placeholder="CIIU"
              required
              disabled
              id="ciuu"
            ></input>
            <Form.Control.Feedback type="invalid">
              Por favor introduzca un nombre.
            </Form.Control.Feedback>
          </Col>
        </Row> */}
        <Row className="mb-3">
          <Col sm={4} xs={12}>
            <label className="form-label label">
              CIIU - Actividad Económica
            </label>
          </Col>
          <Col sm={8} xs={12}>
            <Select
              isDisabled={!habilitarIdRol}
              id="ubicacionCiudad"
              placeholder={"Seleccione una actividad económica"}
              options={dataCiiu}
              value={ciiuSelected}
              onChange={(option) => {
                setCiiuSelected(option);
              }}
            />
            <Form.Control.Feedback type="invalid">
              Por favor introduzca un nombre.
            </Form.Control.Feedback>
          </Col>
        </Row>
        <Row className="mb-3">
          <Col sm={4} xs={12}>
            <label className="form-label label">Clasificación CDA</label>
          </Col>
          <Col sm={8} xs={12}>
            <input
              type="text"
              className="form-control text-center texto"
              placeholder="Campo calulado del maximo de la clasificación de los servicios relacionados"
              required
              disabled
              defaultValue={
                dataProveedor && dataProveedor.Clasificacion_CDA
                  ? dataProveedor.Clasificacion_CDA
                  : null
              }
              id="clasificacion"
            ></input>
            <Form.Control.Feedback type="invalid">
              Por favor introduzca un nombre.
            </Form.Control.Feedback>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col sm={12} xs={12}>
            <hr />
            <label className="form-label label">Anexos</label>
          </Col>
        </Row>
        <p></p>
        <Row className="mb-3 justify-content-end">
          <Col sm={4} xs={12} className="text-right"></Col>
          <Col sm={2} xs={12} className="text-right">
            {habilitarBotonesCerti ? (
              <button
                type="button"
                className="btn botonNegativo2"
                id="efecto_propio"
                onClick={() => {
                  let temp_cert_prov = certificacionesProvDEL;
                  temp_cert_prov.push(certificacionesProv[selected[0]]);
                  setCertificacionesProvDEL(temp_cert_prov);
                  setCertificacionesProv(
                    certificacionesProv.filter(
                      (o, index) => index !== selected[0]
                    )
                  );
                  setSelected([]);
                  setHabilitarBotonesCerti(false);
                }}
              >
                Quitar anexos
              </button>
            ) : null}
          </Col>
          <Col sm={2} xs={12} className="text-right">
            {habilitarBotonesCerti ? (
              <button
                type="button"
                className="btn botonNegativo3"
                id="efecto_propio"
                onClick={() => {
                  setHabilitarBotonesCerti(false);
                  setCrearAnexoBool(false);
                  setShowModal(true);
                }}
              >
                Editar Anexos
              </button>
            ) : null}
          </Col>
          <Col sm={2} xs={12} className="text-right">
            <button
              type="button"
              className="btn botonPositivo2"
              id="efecto_propio"
              onClick={() => {
                setSelected([]);
                setHabilitarBotonesCerti(false);
                setCrearAnexoBool(true);
                setShowModal(true);
              }}
            >
              Crear Anexos
            </button>
          </Col>
        </Row>
        {/* Tabla certificaciones */}
        <Paper className={classes.root}>
          <TableContainer component={Paper} className={classes.container}>
            <Table className={"text"} stickyHeader aria-label="sticky table">
              {/* Inicio de encabezado */}
              <TableHead className="titulo">
                <TableRow>
                  <StyledTableCell padding="checkbox"></StyledTableCell>

                  <StyledTableCell align="left">Tipo de Anexo</StyledTableCell>
                  {/* <StyledTableCell align="left">Vigente Hasta</StyledTableCell>
                  <StyledTableCell align="left">
                    Entidad que da el Aval
                  </StyledTableCell> */}
                  {/* <StyledTableCell align="left">Estado</StyledTableCell> */}
                  <StyledTableCell align="left">Archivo</StyledTableCell>
                </TableRow>
              </TableHead>
              {/* Fin de encabezado */}
              {/* Inicio de cuerpo de la tabla */}
              <TableBody>
                {certificacionesProv
                  //.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, index) => {
                    const isItemSelected = isSelected(index);

                    if (row.estado_rx !== "0" || row.estado_rx !== 0) {
                      return (
                        <StyledTableRow
                          key={index}
                          hover
                          onClick={(event) => handleClick(event, index)}
                          selected={isItemSelected}
                          role="checkbox"
                          tabIndex={-1}
                        >
                          <StyledTableCell component="th" scope="row">
                            {/* <Checkbox /> */}
                          </StyledTableCell>

                          <StyledTableCell align="left">
                            {row.Tipo_Certificacion
                              ? row.Tipo_Certificacion
                              : null}
                          </StyledTableCell>
                          {/* <StyledTableCell align="left">
                            {row.Fecha_Vigencia ? row.Fecha_Vigencia : null}
                          </StyledTableCell>
                          <StyledTableCell align="left">
                            {row.Entidad_Aval ? row.Entidad_Aval : null}
                          </StyledTableCell> */}
                          {/* <StyledTableCell align="left">
                            {row.Estado ? row.Estado : null}
                          </StyledTableCell> */}
                          <StyledTableCell align="left">
                            {row.fileCert ? (
                              row.fileCert.name
                            ) : row.adjunto ? (
                              <a href={row.adjunto.url}>
                                {row.adjunto.nombre_archivo}
                              </a>
                            ) : null}
                          </StyledTableCell>
                        </StyledTableRow>
                      );
                    }
                  })}
              </TableBody>
              {/* Fin de cuerpo de la tabla */}
            </Table>
          </TableContainer>
          {/* Inicio de paginación */}
          {/*  <TablePagination
            rowsPerPageOptions={[10, 25, 100]}
            component="div"
            count={certificacionesProv.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          /> */}
          {/* Fin de paginación */}
        </Paper>

        <Row className="mb-3">
          <Col sm={12} xs={12}>
            <hr />
            <label className="form-label label">Contratos</label>
          </Col>
        </Row>
        <p></p>
        <Row className="mb-3 justify-content-end">
          <Col sm={8} xs={12} className="text-right"></Col>
          <Col sm={2} xs={12} className="text-right">
            {habilitarIdRol ? (
              <button
                type="button"
                className="btn botonPositivo2"
                id="efecto_propio"
                onClick={() => {
                  setShowModalContratos(true);
                }}
              >
                Agregar/Quitar Contrato
              </button>
            ) : null}
          </Col>
        </Row>
        {/* Tabla riesgos inactivos */}
        <Paper className={classes.root}>
          <TableContainer component={Paper} className={classes.container}>
            <Table className={"text"} stickyHeader aria-label="sticky table">
              {/* Inicio de encabezado */}
              <TableHead className="titulo">
                <TableRow>
                  <StyledTableCell padding="checkbox"></StyledTableCell>
                  <StyledTableCell align="left">ID Contrato</StyledTableCell>
                  <StyledTableCell align="left">
                    Nombre del servicio
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    Responsable del contrato
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    Fecha inicio del contrato
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    Fecha fin del contrato
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    Tipo de contrato
                  </StyledTableCell>
                </TableRow>
              </TableHead>
              {/* Fin de encabezado */}
              {/* Inicio de cuerpo de la tabla */}
              <TableBody>
                {contratosProv
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, index) => {
                    return (
                      <StyledTableRow
                        key={row.Id_contrato}
                        hover
                        role="checkbox"
                        tabIndex={-1}
                      >
                        <StyledTableCell component="th" scope="row">
                          {/* <Checkbox /> */}
                        </StyledTableCell>
                        <StyledTableCell component="th" scope="row">
                          {row.Id_contrato_ariba ? row.Id_contrato_ariba : null}
                        </StyledTableCell>
                        <StyledTableCell align="left">
                          {row.Nombre ? row.Nombre : null}
                        </StyledTableCell>
                        <StyledTableCell align="left">
                          {row.Responsable ? row.Responsable : null}
                        </StyledTableCell>
                        <StyledTableCell align="left">
                          {row.Fecha_inicio ? row.Fecha_inicio : null}
                        </StyledTableCell>
                        <StyledTableCell align="left">
                          {row.Fecha_fin ? row.Fecha_fin : null}
                        </StyledTableCell>
                        <StyledTableCell align="left">
                          {row.Tipo_contrato ? row.Tipo_contrato : null}
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
            count={certificacionesProv.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
          {/* Fin de paginación */}
        </Paper>

        {/* Campos para todas las vistas de los maestros */}
        {props.permisos.inactivar ? (
          <Row className="mb-3 mt-3">
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
                {props.permisos.editar ? (
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
            <Link to="Geografias">
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
