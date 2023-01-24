import React, { useState, useEffect } from "react";
import { Button, Form, Row, Col, Modal } from "react-bootstrap";
import AADService from "../../auth/authFunctions";
import ModCargaArchivo from "../../AdminAplicativo/ModCargaArchivo";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Select from "react-select";

import makeAnimated from "react-select/animated";

const animatedComponents = makeAnimated();

const optionsInforme = [
  { value: "Avance", label: "Avance" },
  { value: "Definitivo", label: "Definitivo" },
];

export default function ModalCertificaciones({
  crearAnexoBool,
  proveedor,
  selected,
  setSelected,
  showModal,
  setShowModal,
  certificacionesProv,
  setCertificacionesProv,
}) {
  const [show, setShow] = useState(false);
  const serviceAAD = new AADService();
  const [fechaVigencia, setFechaVigencia] = useState(null);
  const [fechaFinCobertura, setFechaFinCobertura] = useState(null);
  const [fechaEnvioCuestionario, setFechaEnvioCuestionario] = useState(null);
  const [fechaRecepcionCuestionario, setFechaRecepcionCuestionario] =
    useState(null);
  const [fechaAnalisis, setFechaAnalisis] = useState(null);
  const [errores, setErrores] = useState(null);
  const [tipoAnexo, setTipoAnexo] = useState(null);
  const [loadingData, setLoadingData] = React.useState(true);
  const [data, setData] = React.useState([]);
  const [dataCertificacion, setDataCertificacion] = useState(null);
  const [archivoCert, setArchivoCert] = useState(null);
  const [dataTipoAnexo, setDataTipoAnexo] = useState([]);
  const [dataInformeAvance, setDataInformeAvance] = useState(null);

  useEffect(() => {
    if (!crearAnexoBool) {
      setTipoAnexo(
        certificacionesProv &&
          certificacionesProv[selected[0]] &&
          certificacionesProv[selected[0]].Tipo_Certificacion
          ? certificacionesProv[selected[0]].Tipo_Certificacion
          : null
      );

      let temp = new Date();
      if (
        certificacionesProv &&
        certificacionesProv[selected[0]] &&
        certificacionesProv[selected[0]].Fecha_Vigencia
      ) {
        temp.setTime(
          Date.parse(certificacionesProv[selected[0]].Fecha_Vigencia)
        );
        setFechaVigencia(temp);
      }

      let temp_fechaFinCobertura = new Date();
      if (
        certificacionesProv &&
        certificacionesProv[selected[0]] &&
        certificacionesProv[selected[0]].fecha_fin_cobertura
      ) {
        temp_fechaFinCobertura.setTime(
          Date.parse(certificacionesProv[selected[0]].fecha_fin_cobertura)
        );
        setFechaFinCobertura(temp_fechaFinCobertura);
      }
      if (
        certificacionesProv &&
        certificacionesProv[selected[0]] &&
        certificacionesProv[selected[0]].informe_avance
      ) {
        setDataInformeAvance({
          label: certificacionesProv[selected[0]].informe_avance,
          value: certificacionesProv[selected[0]].informe_avance,
        });
      }
      let temp_fechaEnvioCuestionario = new Date();
      if (
        certificacionesProv &&
        certificacionesProv[selected[0]] &&
        certificacionesProv[selected[0]].fecha_inicio_cuestionario
      ) {
        temp_fechaEnvioCuestionario.setTime(
          Date.parse(certificacionesProv[selected[0]].fecha_inicio_cuestionario)
        );
        setFechaEnvioCuestionario(temp_fechaEnvioCuestionario);
      }

      let temp_fechaRecepcionCuestionario = new Date();
      if (
        certificacionesProv &&
        certificacionesProv[selected[0]] &&
        certificacionesProv[selected[0]].fecha_recepcion_cuestionario
      ) {
        temp_fechaRecepcionCuestionario.setTime(
          Date.parse(
            certificacionesProv[selected[0]].fecha_recepcion_cuestionario
          )
        );
        setFechaRecepcionCuestionario(temp_fechaRecepcionCuestionario);
      }

      let temp_fechaAnalisis = new Date();
      if (
        certificacionesProv &&
        certificacionesProv[selected[0]] &&
        certificacionesProv[selected[0]].fecha_analisis
      ) {
        temp_fechaAnalisis.setTime(
          Date.parse(certificacionesProv[selected[0]].fecha_analisis)
        );
        setFechaAnalisis(temp_fechaAnalisis);
      }
      // if (certificacionesProv[selected[0]].Fecha_Vigencia !== null
      //   || certificacionesProv[selected[0]].Fecha_Vigencia !== undefined
      //   || certificacionesProv[selected[0]].Fecha_Vigencia !== ""
      //   ) {
      //   let tempFecha =
      //     certificacionesProv[selected[0]]?.Fecha_Vigencia.split("-");
      //   let fechaLoad = new Date(
      //     tempFecha[0],
      //     parseInt(tempFecha[1]) - 1,
      //     tempFecha[2]
      //   );
      //   setFechaVigencia(fechaLoad);
      //   setFechaFinCobertura(fechaLoad);
      // }
    } else {
      setFechaVigencia(null);
      setFechaFinCobertura(null);
      setFechaEnvioCuestionario(null);
      setFechaRecepcionCuestionario(null);
      setFechaAnalisis(null);
      setTipoAnexo(null);
      setArchivoCert(null);
      setDataInformeAvance(null);
      setErrores(null);
    }

    if (showModal === true) {
      setShow(true);
    }

    const GetTipoAnexo = async () => {
      const result = await fetch(
        process.env.REACT_APP_API_URL + "/generales/Certificaciones/Tipo_Anexo",
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            Authorization: "Bearer " + serviceAAD.getToken(),
          },
        }
      );

      let data = await result.json();

      let temp = data.map(({ valor: label }) => ({
        label,
      }));
      setDataTipoAnexo(temp);
    };
    GetTipoAnexo();
  }, [showModal, setShow]);

  //   datosCertificacion();

  //  const datosCertificacion = async () => {
  //   const result = await fetch(
  //     process.env.REACT_APP_API_URL + "/generales/certificacion/tipo_certificacion/",
  //     {
  //       method: "GET",
  //       headers: {
  //         Accept: "application/json",
  //         Authorization: "Bearer " + serviceAAD.getToken(),
  //       },
  //     }
  //   );
  //   let data = await result.json();
  //   setDataCertificacion(data);
  // };

  const handleClose = () => {
    setShow(false);
    setShowModal(false);
  };

  const verificarData = () => {
    function formatoFecha(fecha) {
      return fecha.split("T")[0];
    }
    let validacion = false;
    const timeElapsed = Date.now();
    const today = new Date(timeElapsed);
    today.setHours(0);
    today.setMinutes(0);
    today.setSeconds(0);
    today.setMilliseconds(0);

    let fechaISOinicial = formatoFecha(today.toISOString());

    let tipoCertificacion = document.getElementById("tipoCertificacion")?.value;

    let entidadAval = document.getElementById("EntidadAval")?.value;

    let estado;
    if (tipoCertificacion) {
      if (
        tipoCertificacion === "SSAE 18 SOC1 Tipo 1" ||
        tipoCertificacion === "SSAE 18 SOC1 Tipo 2" ||
        tipoCertificacion === "SSAE 18 SOC2 Tipo 1" ||
        tipoCertificacion === "SSAE 18 SOC2 Tipo 2" ||
        tipoCertificacion === "ISAE 3402" ||
        tipoCertificacion === "SSAE 18 SOC1 Tipo 2 + SSAE 18 SOC2 Tipo 2" ||
        tipoCertificacion === "SSAE 18 SOC1 Tipo 2 + Controles Ciber" ||
        tipoCertificacion === "SSAE 18 SOC3" ||
        tipoCertificacion === "ISAE 3402 + Controles Ciber" ||
        tipoCertificacion === "ISAE 3402 + SSAE 18 SOC2 Tipo 2" ||
        tipoCertificacion === "Bridge Letter"
      ) {
        if (
          fechaVigencia &&
          fechaFinCobertura &&
          dataInformeAvance &&
          entidadAval &&
          (archivoCert ||
          (!crearAnexoBool &&
            certificacionesProv &&
            certificacionesProv[selected[0]] &&
            certificacionesProv[selected[0]].adjunto &&
            certificacionesProv[selected[0]].adjunto.nombre_archivo)
            ? true
            : false)
        ) {
          validacion = true;
        }
      } else if (
        tipoCertificacion === "Informe ejecutivo CSySI" ||
        tipoCertificacion === "Informe conglomerado detallado CSySI" ||
        tipoCertificacion === "Documento de Socialización con de la ERO" ||
        tipoCertificacion === "SCORING CSySI" ||
        tipoCertificacion === "WAS CSySI" 
      ) {
        if (
          archivoCert ||
          (!crearAnexoBool &&
            certificacionesProv &&
            certificacionesProv[selected[0]] &&
            certificacionesProv[selected[0]].adjunto &&
            certificacionesProv[selected[0]].adjunto.nombre_archivo)
            ? true
            : false
        ) {
          validacion = true;
        }
      } else if (tipoCertificacion === "Cuestionario de Proveedor") {
        if (
          fechaEnvioCuestionario &&
          (archivoCert ||
          (!crearAnexoBool &&
            certificacionesProv &&
            certificacionesProv[selected[0]] &&
            certificacionesProv[selected[0]].adjunto &&
            certificacionesProv[selected[0]].adjunto.nombre_archivo)
            ? true
            : false) &&
          fechaRecepcionCuestionario
        ) {
          validacion = true;
        }
      } else if (
        tipoCertificacion === "Caracterización por Valoración" ||
        tipoCertificacion === "Caracterización por Anexo" ||
        tipoCertificacion === "Análisis SOC 2 Tipo 2 (Ciber)" ||
        tipoCertificacion === "Análisis SOC 1 Tipo 2  + Ciber" ||
        tipoCertificacion === "Análisis Informe de Avance SSAE Ciber"
      ) {
        if (
          fechaAnalisis &&
          (archivoCert ||
          (!crearAnexoBool &&
            certificacionesProv &&
            certificacionesProv[selected[0]] &&
            certificacionesProv[selected[0]].adjunto &&
            certificacionesProv[selected[0]].adjunto.nombre_archivo)
            ? true
            : false)
        ) {
          validacion = true;
        }
      }
    }

    if (validacion) {
      if (fechaVigencia >= today) {
        estado = "Vigente";
      } else if (fechaVigencia <= today) {
        estado = "Vencida";
      } else {
        estado = "Este tipo de anexo no posee una fecha";
      }

      return {
        Tipo_Certificacion: tipoCertificacion,
        Fecha_Vigencia: fechaVigencia
          ? formatoFecha(fechaVigencia.toISOString())
          : null,
        fecha_fin_cobertura: fechaFinCobertura
          ? formatoFecha(fechaFinCobertura.toISOString())
          : null,
        informe_avance: dataInformeAvance ? dataInformeAvance.value : null,
        fecha_inicio_cuestionario: fechaEnvioCuestionario
          ? formatoFecha(fechaEnvioCuestionario.toISOString())
          : null,
        fecha_recepcion_cuestionario: fechaRecepcionCuestionario
          ? formatoFecha(fechaRecepcionCuestionario.toISOString())
          : null,
        fecha_analisis: fechaAnalisis
          ? formatoFecha(fechaAnalisis.toISOString())
          : null,
        Entidad_Aval: entidadAval ? entidadAval : null,
        Estado: estado,
        usuario_creador: serviceAAD.getUser().userName,
        usuario_modificador: serviceAAD.getUser().userName,
        fecha_creacion: fechaISOinicial,
        fecha_modificacion: fechaISOinicial,
        fileCert: archivoCert,
        method: "POST",
        id_adjunto: null,
      };
    } else {
      return { error: "Faltan campos obligatorios" };
    }
  };

  const handleFileChange = (e) => {
    setArchivoCert(e.target.files[0]);
  };

  const retornarCertificacion = () => {
    let temp = certificacionesProv;
    const data = verificarData();
    if (data.error) {
      setErrores(data.error);
    } else {
      if (temp[selected[0]]) {
        temp[selected[0]].Tipo_Certificacion = data.Tipo_Certificacion;
        temp[selected[0]].Fecha_Vigencia = data.Fecha_Vigencia;
        temp[selected[0]].fecha_fin_cobertura = data.fecha_fin_cobertura;
        temp[selected[0]].informe_avance = data.informe_avance;
        temp[selected[0]].fecha_inicio_cuestionario =
          data.fecha_inicio_cuestionario;
        temp[selected[0]].fecha_recepcion_cuestionario =
          data.fecha_recepcion_cuestionario;
        temp[selected[0]].fecha_analisis = data.fecha_analisis;
        temp[selected[0]].Entidad_Aval = data.Entidad_Aval;
        temp[selected[0]].Estado = data.Estado;
        temp[selected[0]].usuario_modificador = data.usuario_modificador;
        temp[selected[0]].fecha_modificacion = data.fecha_modificacion;
        temp[selected[0]].fileCert = data.fileCert;
        temp[selected[0]].method = "PUT";
        temp[selected[0]].id_adjunto = temp[selected[0]].id_adjunto;

        setCertificacionesProv(temp);
        setSelected([]);
      } else {
        temp.push(data);
        setCertificacionesProv(temp);
      }

      handleClose();
    }
  };

  return (
    <>
      <Modal
        size="sm"
        show={show}
        onHide={handleClose}
        aria-labelledby="contained-modal-title-vcenter"
        centered
        dialogClassName="my-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title id="example-modal-sizes-title-sm">
            Adjuntar nuevo anexo
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/*           <Row className="mb-3">
            <Col sm={4} xs={12}>
              <label className="label forn-label">ID certificación</label>
            </Col>
            <Col sm={8} xs={12}>
              <input
                type="text"
                disabled
                className="form-control text-center texto"
                placeholder="ID Automático"
                id="IDcertificacion"
              ></input>
            </Col>
          </Row> */}
          <h6 className="error">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{errores}</h6>
          <Row className="mb-3 mt-3">
            <Col sm={4} xs={12}>
              <label className="form-label label">Tipo de anexo*</label>
            </Col>
            <Col sm={8} xs={10}>
              <select
                className="form-control texto"
                id="tipoCertificacion"
                onChange={(e) => {
                  setTipoAnexo(e.target.value);
                }}
              >
                <option
                  value={
                    !crearAnexoBool && certificacionesProv[selected[0]]
                      ? certificacionesProv[selected[0]]?.Tipo_Certificacion
                      : ""
                  }
                >
                  {!crearAnexoBool && certificacionesProv[selected[0]]
                    ? certificacionesProv[selected[0]].Tipo_Certificacion
                    : "Seleccione tipo de anexo"}
                </option>
                {dataTipoAnexo.map((item) => (
                  <option value={item.label}>{item.label}</option>
                ))}
              </select>
            </Col>
          </Row>
          {tipoAnexo == "SSAE 18 SOC1 Tipo 1" ||
          tipoAnexo == "SSAE 18 SOC1 Tipo 2" ||
          tipoAnexo == "SSAE 18 SOC2 Tipo 1" ||
          tipoAnexo == "SSAE 18 SOC2 Tipo 2" ||
          tipoAnexo == "ISAE 3402" ||
          tipoAnexo == "SSAE 18 SOC1 Tipo 2 + SSAE 18 SOC2 Tipo 2" ||
          tipoAnexo == "SSAE 18 SOC1 Tipo 2 + Controles Ciber" ||
          tipoAnexo == "SSAE 18 SOC3" ||
          tipoAnexo == "ISAE 3402 + Controles Ciber" ||
          tipoAnexo == "ISAE 3402 + SSAE 18 SOC2 Tipo 2" ||
          tipoAnexo == "Bridge Letter" ? (
            <>
              <Row className="mb-3">
                <Col sm={4} xs={12}>
                  <label className="form-label label">
                    Fecha inicio de cobertura*
                  </label>
                </Col>
                <Col sm={8} xs={12}>
                  <DatePicker
                    className="form-control"
                    selected={fechaVigencia}
                    onChange={(date) => setFechaVigencia(date)}
                    id="fechaVigencia"
                    required
                  ></DatePicker>
                  <Form.Control.Feedback type="invalid">
                    Por favor introduzca un nombre.
                  </Form.Control.Feedback>
                </Col>
              </Row>

              <Row className="mb-3">
                <Col sm={4} xs={12}>
                  <label className="form-label label">
                    Fecha fin de cobertura*
                  </label>
                </Col>
                <Col sm={8} xs={12}>
                  <DatePicker
                    className="form-control"
                    selected={fechaFinCobertura}
                    onChange={(date) => setFechaFinCobertura(date)}
                    id="fechaFinCobertura"
                    required
                  ></DatePicker>
                  <Form.Control.Feedback type="invalid">
                    Por favor introduzca un nombre.
                  </Form.Control.Feedback>
                </Col>
              </Row>

              <Row className="mb-3">
                <Col sm={4} xs={12}>
                  <label className="form-label label">
                    Informe de avance o definitivo*
                  </label>
                </Col>
                <Col sm={4} xs={12}>
                  <Select
                    components={animatedComponents}
                    required
                    options={[
                      { value: "Avance", label: "Avance" },
                      { value: "Definitivo", label: "Definitivo" },
                    ]}
                    value={dataInformeAvance}
                    onChange={(e) => setDataInformeAvance(e)}
                    placeholder="Informe de avance o definitivo"
                    id="informeDeAvanceoDefinitivo"
                  />
                </Col>
              </Row>

              <Row className="mb-3">
                <Col sm={4} xs={12}>
                  <label className="form-label label">Auditor emisor*</label>
                </Col>
                <Col sm={8} xs={12}>
                  <input
                    type="text"
                    className="form-control text-center texto"
                    placeholder="Auditor emisor"
                    defaultValue={
                      !crearAnexoBool &&
                      certificacionesProv[selected[0]] &&
                      certificacionesProv[selected[0]].Entidad_Aval
                        ? certificacionesProv[selected[0]].Entidad_Aval
                        : null
                    }
                    id="EntidadAval"
                    required
                  ></input>
                </Col>
              </Row>
            </>
          ) : null}

          {tipoAnexo == "Cuestionario de Proveedor" ? (
            <>
              <Row className="mb-3">
                <Col sm={4} xs={12}>
                  <label className="form-label label">
                    Fecha de envío del cuestionario*
                  </label>
                </Col>
                <Col sm={8} xs={12}>
                  <DatePicker
                    className="form-control"
                    selected={fechaEnvioCuestionario}
                    onChange={(date) => setFechaEnvioCuestionario(date)}
                    required
                    id="fechaEnvioCuestionario"
                  ></DatePicker>
                  <Form.Control.Feedback type="invalid">
                    Por favor introduzca un nombre.
                  </Form.Control.Feedback>
                </Col>
              </Row>
              <Row className="mb-3">
                <Col sm={4} xs={12}>
                  <label className="form-label label">
                    Fecha de recepción del cuestionario*
                  </label>
                </Col>
                <Col sm={8} xs={12}>
                  <DatePicker
                    className="form-control"
                    selected={fechaRecepcionCuestionario}
                    onChange={(date) => setFechaRecepcionCuestionario(date)}
                    required
                    id="fechaRecepcionCuestionario"
                  ></DatePicker>
                  <Form.Control.Feedback type="invalid">
                    Por favor introduzca un nombre.
                  </Form.Control.Feedback>
                </Col>
              </Row>
            </>
          ) : null}

          {tipoAnexo == "Caracterización por Valoración" ||
          tipoAnexo == "Caracterización por Anexo" ||
          tipoAnexo == "Análisis SOC 2 Tipo 2 (Ciber)" ||
          tipoAnexo == "Análisis SOC 1 Tipo 2  + Ciber" ||
          tipoAnexo == "Análisis Informe de Avance SSAE Ciber" ? (
            <Row className="mb-3">
              <Col sm={4} xs={12}>
                <label className="form-label label">Fecha de análisis*</label>
              </Col>
              <Col sm={8} xs={12}>
                <DatePicker
                  className="form-control"
                  selected={fechaAnalisis}
                  onChange={(date) => setFechaAnalisis(date)}
                  required
                  id="fechaAnalisis"
                ></DatePicker>
                <Form.Control.Feedback type="invalid">
                  Por favor introduzca un nombre.
                </Form.Control.Feedback>
              </Col>
            </Row>
          ) : null}

          <Row className="mb-3">
            <Col sm={4} xs={12}>
              <label className="form-label label">Adjunto*</label>
            </Col>
            <Col sm={5} xs={12}>
              <input
                id="adjunto"
                type="file"
                name="files"
                accept="*"
                onChange={(e) => handleFileChange(e)}
                required
              ></input>
            </Col>
            <Col sm={3} xs={12}>
              <a
                href={
                  !crearAnexoBool &&
                  certificacionesProv &&
                  certificacionesProv[selected[0]] &&
                  certificacionesProv[selected[0]].adjunto &&
                  certificacionesProv[selected[0]].adjunto.url
                    ? certificacionesProv[selected[0]].adjunto.url
                    : null
                }
              >
                {!crearAnexoBool &&
                certificacionesProv &&
                certificacionesProv[selected[0]] &&
                certificacionesProv[selected[0]].adjunto &&
                certificacionesProv[selected[0]].adjunto.nombre_archivo
                  ? certificacionesProv[selected[0]].adjunto.nombre_archivo
                  : null}
              </a>
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button
            className="botonPositivo"
            onClick={() => {
              verificarData();
              retornarCertificacion();
            }}
            id="aceptarAnexo"
          >
            Aceptar
          </Button>
          <Button variant="secondary" onClick={handleClose}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
      <span></span>
    </>
  );
}
