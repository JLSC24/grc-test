import React, { useState, useEffect, useContext } from "react";
import AADService from "../../auth/authFunctions";
import axios from "axios";

import Select from "react-select";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import Link from "@material-ui/core/Link";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";

import {
  Row,
  Col,
  Form,
  Alert,
  Button,
  Container,
  Modal,
} from "react-bootstrap";

import makeAnimated from "react-select/animated";

import ModCargaArchivo from "../../AdminAplicativo/ModCargaArchivo";

import { UsuarioContext } from "../../Context/UsuarioContext";
import { useCallback } from "react";
import { AlternateEmail } from "@mui/icons-material";

const animatedComponents = makeAnimated();

const options = [
  { value: 1, label: "Activo" },
  { value: 0, label: "Inactivo" },
];

export default function ModalOrigen(props) {
  const serviceAAD = new AADService();

  const { dataUsuario } = useContext(UsuarioContext);

  const [listaOrigen, setListaOrigen] = useState([]);

  const [id, setID] = useState(null);

  const [creador, setCreador] = useState([]);

  const [origen, setOrigen] = useState(null);

  const [fecha, setFecha] = useState(null);

  const [descripcion, setDescripcion] = useState(null);

  const [adjunto, setAdjunto] = useState({ value: "", label: "" });

  const [estado, setEstado] = useState({ value: 1, label: "Activo" });

  const [justificacion, setJustificacion] = useState(null);

  const [showJustificacion, setShowJustificacion] = useState(false);

  const [idInforme, setIdInforme] = useState(null);

  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await axios.get(
          process.env.REACT_APP_API_URL + "/generales/Origen/Nombre_Origen",
          {
            headers: {
              Authorization: "Bearer " + serviceAAD.getToken(),
            },
          }
        );

        let data = response.data.map(
          ({
            idm_parametrosgenerales: value,
            valor: label,
            grupo,
            parametro,
          }) => ({
            value,
            label,
            grupo,
            parametro,
          })
        );

        setListaOrigen(data);
      } catch (error) {
        console.error(error);
      }
    };

    setCreador(dataUsuario.nombre);

    getData();
  }, []);

  useEffect(() => {
    if (Array.isArray(props.origenSelected)) {
      if (props.origenSelected[0]) {
        setIsEditing(true);

        props.dataOrigen.forEach((objOrigen) => {
          if (objOrigen.idorigen === props.origenSelected[0]) {
            setID(objOrigen.idorigen);

            setOrigen({ value: objOrigen.origen, label: objOrigen.origen });

            setCreador(objOrigen.creador);

            let fecha = new Date(objOrigen.fecha);

            let day = fecha.getUTCDate();
            let month = fecha.getUTCMonth();
            let year = fecha.getUTCFullYear();

            let date = new Date(year, month, day);

            setFecha(date);

            setDescripcion(objOrigen.descripcion);

            setIdInforme(objOrigen.id_informe);

            setAdjunto({ value: objOrigen.link, label: objOrigen.adjunto });

            setEstado({
              value: objOrigen.estado,
              label: objOrigen.estado === 1 ? "Activo" : "Inactivo",
            });
          }
        });
      } else {
        setIsEditing(false);
        setCreador(dataUsuario.nombre);
        setID(null);
        setIdInforme(null);
        setOrigen(null);
        setFecha(null);
        setDescripcion(null);
        setAdjunto({ value: "", label: "" });
        setEstado({ value: 1, label: "Activo" });
        setJustificacion(null);
      }
    }
  }, [props.origenSelected]);

  const HandleSubmit = async (estaEditando) => {
    let datosEnviar = {
      idorigen: 0,
      estado: estado ? estado.value : null,
      justificacion: justificacion ? justificacion : null,
      creador: dataUsuario ? dataUsuario.nombre : null,
      origen: origen ? origen.label : null,
      fecha: fecha ? fecha.toLocaleDateString() : null,
      descripcion: descripcion ? descripcion : null,
      id_informe: idInforme ? idInforme : null,
    };

    try {
      if (estaEditando) {
        datosEnviar.idorigen = id;

        if (adjunto) {
          if (adjunto.name) {
            let responseMod = await ModCargaArchivo(
              "origen",
              id,
              null,
              adjunto.name,
              adjunto,
              "POST",
              null
            );

            datosEnviar.link = responseMod.URL;
            datosEnviar.adjunto = adjunto.name;
          } else {
            datosEnviar.link = adjunto.value;
            datosEnviar.adjunto = adjunto.label;
          }

          console.log(datosEnviar);

          axios
            .put(process.env.REACT_APP_API_URL + "/plandeAccion/origen/", datosEnviar, {
              headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + serviceAAD.getToken(),
              },
            })
            .then((response) => {
              if (response.status >= 200 && response.status < 300) {
                alert("Editado con éxito");
                //Se ingresa la fecha en formato string para ser leida
                datosEnviar.fecha = response.data.fecha;

                let index = props.dataOrigen.findIndex(
                  (obj) => obj.idorigen === id
                );
                props.dataOrigen.splice(index, 1, datosEnviar);

                props.onHide();
              }
            });
        } else {
          axios
            .put(process.env.REACT_APP_API_URL + "/plandeAccion/origen/", datosEnviar, {
              headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + serviceAAD.getToken(),
              },
            })
            .then((response) => {
              if (response.status >= 200 && response.status < 300) {
                alert("Editado con éxito");
              }
            });
        }
      } else {
        const response = await axios.post(
          process.env.REACT_APP_API_URL + "/plandeAccion/origen/",
          datosEnviar,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + serviceAAD.getToken(),
            },
          }
        );

        if (response.status >= 200 && response.status < 300) {
          if (Object.keys(adjunto).length === 0) {
            const responseMod = await ModCargaArchivo(
              "origen",
              response.data.idorigen,
              null,
              adjunto.name,
              adjunto,
              "POST",
              null
            );

            datosEnviar.idorigen = response.data.idorigen;
            datosEnviar.adjunto = adjunto.name;
            datosEnviar.link = responseMod.URL;

            axios
              .put(process.env.REACT_APP_API_URL + "/plandeAccion/origen/", datosEnviar, {
                headers: {
                  "Content-Type": "application/json",
                  Authorization: "Bearer " + serviceAAD.getToken(),
                },
              })
              .then((response) => {
                if (response.status >= 200 && response.status < 300) {
                  alert("Creado con éxito");
                  props.onHide();
                }
              });
          } else {
            alert("Creado con exito");
          }
        } else if (response.status >= 300 && response.status < 400) {
          alert("Error en el servidor");
        } else if (response.status >= 400 && response.status < 512) {
          alert("Error en el servidor");
        }
      }
    } catch (error) {
      console.error(error);
    }

    props.setOrigenSelected([]);
    setIsEditing(false);
    setCreador(null);
    setID(null);
    setIdInforme(null);
    setOrigen(null);
    setFecha(null);
    setDescripcion(null);
    setAdjunto({ value: "", label: "" });
    setEstado({ value: 1, label: "Activo" });
    setJustificacion(null);
    props.onHide();
  };

  return (
    <Modal
      {...props}
      aria-labelledby="contained-modal-title-vcenter"
      centered
      backdrop="static"
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">Origen</Modal.Title>
      </Modal.Header>
      <Modal.Body className="show-grid">
        <Container>
          {isEditing ? (
            <Row className="mb-4">
              <Col sm={2} xs={12}>
                <label className="forn-label label">Estado</label>
              </Col>
              <Col sm={4} xs={12}>
                <Select
                  components={animatedComponents}
                  placeholder="Estado"
                  options={options}
                  onChange={(e) => {
                    if (e.value == 1) {
                      setShowJustificacion(true);
                    } else {
                      setShowJustificacion(false);
                      setJustificacion(null);
                    }
                    setEstado(e);
                  }}
                  value={estado}
                />
              </Col>

              {estado.value == 0 ? (
                <>
                  <Col sm={2} xs={12}>
                    <label className="forn-label label">
                      Motivo inactivación
                    </label>
                  </Col>
                  <Col sm={4} xs={12}>
                    <textarea
                      className="form-control text-center"
                      placeholder="Motivo de inactivación"
                      rows="3"
                      onChange={(e) => setJustificacion(e.target.value)}
                      value={justificacion}
                    />
                  </Col>
                </>
              ) : (
                <></>
              )}
            </Row>
          ) : (
            <></>
          )}

          <Row className="mb-4">
            {isEditing ? (
              <>
                <Col sm={2} xs={12}>
                  <label className="forn-label label">ID Origen</label>
                </Col>
                <Col sm={4} xs={12}>
                  <input
                    disabled
                    type="text"
                    className="form-control text-center texto"
                    placeholder="ID Origen"
                    value={id}
                  />
                </Col>
              </>
            ) : (
              <></>
            )}

            <Col sm={2} xs={12}>
              <label className="forn-label label">Creador</label>
            </Col>
            <Col sm={4} xs={12}>
              <input
                disabled
                type="text"
                className="form-control text-center texto"
                placeholder="Usuario creador"
                value={creador}
              />
            </Col>
          </Row>

          <Row className="mb-4">
            <Col sm={2} xs={12}>
              <label className="forn-label label">Origen*</label>
            </Col>
            <Col sm={4} xs={12}>
              <Select
                components={animatedComponents}
                options={listaOrigen}
                placeholder="Seleccione el origen"
                onChange={setOrigen}
                value={origen}
              />
            </Col>
            <Col sm={2} xs={12}>
              <label className="forn-label label">Fecha Origen*</label>
            </Col>
            <Col sm={4} xs={12}>
              <DatePicker
                className="form-control"
                fullsize
                selected={fecha}
                onChange={(date) => setFecha(date)}
              />
            </Col>
          </Row>

          <Row className="mb-4">
            <Col sm={2} xs={12}>
              <label className="forn-label label">Descripción*</label>
            </Col>
            <Col sm={10} xs={12}>
              <textarea
                className="form-control text-center"
                placeholder="Descripción"
                rows="2"
                onChange={(e) => setDescripcion(e.target.value)}
                value={descripcion}
              />
            </Col>
          </Row>

          <Row className="mb-4">
            <Col sm={2} xs={12}>
              <label className="forn-label label">ID Informe</label>
            </Col>
            <Col sm={10} xs={12}>
              <input
                type="text"
                className="form-control text-center"
                placeholder="ID Informe"
                onChange={(e) => {
                  setIdInforme(e.target.value);
                  console.log(Object.keys(adjunto).length);
                  console.log(adjunto);
                }}
                value={idInforme}
              />
            </Col>
          </Row>

          <Row className="mb-3">
            <Col sm={2} xs={12}>
              <label className="forn-label label">Archivo adjunto</label>
            </Col>
            <Col sm={4} xs={12}>
              <input
                type="file"
                onChange={(e) => {
                  setAdjunto(e.target.files[0]);
                  console.log(Object.keys(adjunto).length);
                }}
              />
            </Col>

            <Col sm={4} xs={12}>
              {adjunto.value ? (
                <a href={adjunto.value} target="_blank">
                  <FileDownloadOutlinedIcon fontSize="small" />
                  {adjunto.label}
                </a>
              ) : null}
            </Col>
          </Row>
        </Container>
      </Modal.Body>
      <Modal.Footer>
        <Button
          className="botonPositivo"
          onClick={() => HandleSubmit(isEditing)}
        >
          {isEditing ? <>Editar</> : <>Crear</>}
        </Button>

        <Button
          className="botonNegativo"
          onClick={() => props.setShowModalOrigen(false)}
        >
          Cancelar
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
