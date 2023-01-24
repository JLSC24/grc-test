import React, { useState, useEffect } from "react";
import { Row, Col } from "react-bootstrap";
import ModalAlerta from "../Globales/ModalAlerta";
import Loader from "react-loader-spinner";
import axios from "axios";
const _ = require("lodash");
const resumenEvaluacionNull = {
  p95_recibidos: null,
  p95_propios: null,
  p95_desencadenados: null,
  p95_total: null,
};

export default function ResumenEvaluacion({ selected, serviceAAD }) {
  const [resumenEvaluacion, setResumenEvaluacion] = useState(
    resumenEvaluacionNull
  );
  const [rxRiesgosEfectos, setRxRiesgosEfectos] = useState([]);
  const [loadingData, setLoadingData] = React.useState(false);
  const [showAlerta, setShowAlerta] = useState(false);
  const [textAlerta, setTextAlerta] = useState(false);

  useEffect(() => {
    async function getRx_riesgo_efecto() {
      try {
        const response = await axios.get(
          process.env.REACT_APP_API_URL + "/rx_riesgo_efecto",
          {
            headers: {
              Authorization: "Bearer " + serviceAAD.getToken(),
            },
          }
        );
        let datos = response.data;
        setRxRiesgosEfectos(datos);
      } catch (error) {
        console.error(error);
      }
    }
    getRx_riesgo_efecto();
  }, []);

  //** Trae el resumen de la evaluacion */
  const getResumenEvaluacion = async (idRiesgos) => {
    //** verifica si alguno de los riesgos tiene efectos */
    let existenEfectos = [];
    idRiesgos.map((riesgo) => {
      existenEfectos.push(_.some(rxRiesgosEfectos, ["idriesgo", riesgo]));
    });

    //** Si existen efectos asociados a alguno de los riesgos seleccionados hace el llamado a la API */
    if (existenEfectos.includes(true)) {
      let listaEfectos = [];

      idRiesgos.map((idriesgo) => {
        rxRiesgosEfectos.map((efecto) => {
          if (idriesgo === efecto.idriesgo && efecto.estado === 1) {
            let efecto_aux = {
              idefecto: efecto.idefecto,
              idriesgo: efecto.idriesgo,
              relacion: efecto.tipo_relacion,
              media: efecto.media,
              nombreefecto: efecto.nombreefecto,
              tipoimpacto: efecto.tipoimpacto,
              resultado_p95: efecto.resultado_p95,
              estado: efecto.estado,
            };
            listaEfectos.push(efecto_aux);
          }
        });
      });

      let data = {
        datos: listaEfectos,
      };

      try {
        setLoadingData(true);
        const response = await axios.post(
          process.env.REACT_APP_API_URL + "/resumen_evaluacion/",
          data,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + serviceAAD.getToken(),
            },
          }
        );
        let resumen = response.data;

        //* convierte el numero con separador de miles
        if (resumen.p95_propios) {
          resumen.p95_propios = resumen.p95_propios.toLocaleString("en-US", {
            maximumFractionDigits: 2,
          });
        }
        if (resumen.p95_desencadenados) {
          resumen.p95_desencadenados =
            resumen.p95_desencadenados.toLocaleString("de-DE", {
              maximumFractionDigits: 2,
            });
        }
        if (resumen.p95_recibidos) {
          resumen.p95_recibidos = resumen.p95_recibidos.toLocaleString(
            "de-DE",
            {
              maximumFractionDigits: 2,
            }
          );
        }

        if (resumen.p95_total) {
          resumen.p95_total = resumen.p95_total.toLocaleString("de-DE", {
            maximumFractionDigits: 2,
          });
        }

        setResumenEvaluacion(resumen);
        setLoadingData(false);
      } catch (error) {
        console.error(error);
      }
    } else {
      setTextAlerta(
        "No se encontraron efectos relacionados con los riesgos seleccionados"
      );
      setShowAlerta(true);
    }
  };

  const calculaResumen = () => {
    if (selected.length !== 0) {
      getResumenEvaluacion(selected);
    } else {
      setTextAlerta(
        "¡El riesgo seleccionado no tiene efectos o no está activo en la evaluación!"
      );
      setShowAlerta(true);
    }
  };

  return (
    <>
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
          <ModalAlerta
            showAlerta={showAlerta}
            setShowAlerta={setShowAlerta}
            text={textAlerta}
          />

          {/* ///////////////////////////////////// Resumen de la evaluación /////////////////////////////// */}
          <hr />
          <Row className="mb-4 mt-4">
            <Col md={12}>
              <h1 className="subtitulo text-left">Resumen de la evaluación</h1>
            </Col>
          </Row>

          <Row className="mb-3 mt-4">
            <Col sm={2} xs={12}>
              <label className="form-label label ">Riesgos</label>
            </Col>
            <Col sm={2} xs={12}>
              <input
                type="text"
                className="form-control text-center texto"
                value={selected.length}
                required
                disabled
                id="analista"
              ></input>
            </Col>

            <Col sm={2} xs={12}>
              <label className="form-label label">Exposición total</label>
            </Col>
            <Col sm={2} xs={12}>
              <input
                type="text"
                className="form-control text-center texto"
                value={
                  resumenEvaluacion.p95_total !== null
                    ? resumenEvaluacion.p95_total
                    : null
                }
                placeholder="---"
                required
                disabled
                id="analista"
              ></input>
            </Col>

            <Col sm={2} xs={12}>
              <label className="form-label label">Exposición Propia​</label>
            </Col>
            <Col sm={2} xs={12}>
              <input
                type="text"
                className="form-control text-center texto"
                value={
                  resumenEvaluacion.p95_propios !== null
                    ? resumenEvaluacion.p95_propios
                    : null
                }
                placeholder="---"
                required
                disabled
                id="analista"
              ></input>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col sm={2} xs={12}>
              <label className="form-label label">Exposición Recibida</label>
            </Col>
            <Col sm={2} xs={12}>
              <input
                type="text"
                className="form-control text-center texto"
                value={
                  resumenEvaluacion.p95_recibidos !== null
                    ? resumenEvaluacion.p95_recibidos
                    : null
                }
                placeholder="---"
                disabled
                id="analista"
              ></input>
            </Col>

            <Col sm={2} xs={12}>
              <label className="form-label label">
                Exposición Desencadenada
              </label>
            </Col>
            <Col sm={2} xs={12}>
              <input
                type="text"
                className="form-control text-center texto"
                value={
                  resumenEvaluacion.p95_desencadenados !== null
                    ? resumenEvaluacion.p95_desencadenados
                    : null
                }
                placeholder="---"
                disabled
                id="analista"
              ></input>
            </Col>

            <Col sm={4} xs={12} className="text-right">
              <button
                type="button"
                className="btn botonPositivo2"
                id=""
                onClick={() => {
                  calculaResumen();
                }}
              >
                Calcular
              </button>
            </Col>
          </Row>
        </>
      )}
    </>
  );
}
