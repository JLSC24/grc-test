import React, { useEffect, useState } from "react";
import { Row, Col, Form, Button, Modal } from "react-bootstrap";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import Paper from "@mui/material/Paper";
import Checkbox from "@mui/material/Checkbox";
import { visuallyHidden } from "@mui/utils";

const _ = require("lodash");

const useStylesModal = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  paper: {
    width: "100%",
    //marginBottom: theme.spacing(2),
  },
  table: {
    minWidth: 750,
  },
  head: {
    backgroundColor: "#2c2a29",
    color: "#ffffff",
  },
  visuallyHidden: {
    border: 0,
    clip: "rect(0 0 0 0)",
    height: 1,
    margin: -1,
    overflow: "hidden",
    padding: 0,
    position: "absolute",
    top: 20,
    width: 1,
  },
  container: {
    maxHeight: "55vh",
    minHeight: "55vh",
  },
}));

export default function ModalMotivoInactiva({
  modalShow,
  setModalShow,
  listaGeneralRiesgos,
  setListaGeneralRiesgos,
  riesgoInactivado,
  usuarioLog,
}) {
  const classes = useStylesModal();
  const [motivo, setMotivo] = useState(null);

  useEffect(() => {}, [listaGeneralRiesgos]);

  //** filtra riesgos para evitar registros repetidos */

  const filtraRiesgos = (listaGeneral, nuevaLista, tipoNuevaLista) => {
    //** Toma como propiedades 1. la lista general o consolidada de todos los riesgos: Activos + Inactivos + Sugeridos + Buscados 2.La nueva lista de Riesgos que se agregará: Riesgos Activos, Riesgos Escaneados, Riesgos Buscados

    //* Devuelve el riesgo de mayor prelación Activo||Inactivo > Sugerido > Buscado --- Es invocado mas adelante
    const comparaRiesgos = (riesgoAntiguo, riesgoNuevo) => {
      if (
        riesgoAntiguo.estado_enVista === "Activo" ||
        riesgoAntiguo.estado_enVista === "Inactivo"
      ) {
        return riesgoAntiguo;
      } else if (
        riesgoNuevo.estado_enVista === "Activo" ||
        riesgoNuevo.estado_enVista === "Inactivo"
      ) {
        return riesgoNuevo;
      } else if (riesgoAntiguo.estado_enVista === "Agregado") {
        return riesgoAntiguo;
      } else if (riesgoNuevo.estado_enVista === "Agregado") {
        return riesgoNuevo;
      } else if (riesgoAntiguo.estado_enVista === "Sugerido") {
        return riesgoAntiguo;
      } else if (riesgoNuevo.estado_enVista === "Sugerido") {
        return riesgoNuevo;
      } else if (riesgoAntiguo.estado_enVista === "Buscado") {
        return riesgoAntiguo;
      } else if (riesgoNuevo.estado_enVista === "Buscado") {
        return riesgoNuevo;
      }
    };

    let consolidadoRiesgos;
    if (nuevaLista.length === 0) {
      //* Solamente existe un caso cuando la nueva lista está vacía, sucede cuando hace una consulta en "ScanRiesgos" y no hay ninguno asociado

      consolidadoRiesgos = listaGeneral.filter(
        (riesgoConsolidado) => riesgoConsolidado.estado_enVista !== "Sugerido"
      );
    } else if (nuevaLista.length !== 0) {
      if (listaGeneral.length !== 0) {
        //** Elimina los riesgos Anteriormente escaneados si el filtro se hace desde Escanear Riesgos*/

        if (tipoNuevaLista === "Riesgos_escaneados") {
          listaGeneral = listaGeneral.filter(
            (riesgo) => riesgo.estado_enVista !== "Sugerido"
          );
        }

        //* funcion principal: Compara la listaGeneral de Riesgos y la NuevaLista de Riesgos, obtiene los repetidos y prevalece el mas importante (ver función comparaRiesgos)...
        //* ... Luego obtiene los riesgos que no se repiten de cada lista, y une todos los riesgos en Consolidado Riesgo
        //* ... consolidado riesgos se mostrará en cada tabla respectivamente según su propiedad "estado_enVista"
        let arr = [];
        let res;
        nuevaLista.map((riesgoNuevo) => {
          //* devuelve el indice del riesgo repetido, de lo contrario devuelve -1
          res = _.findIndex(
            listaGeneral,
            (e) => {
              return e.idriesgo == riesgoNuevo.idriesgo;
            },
            0
          );

          //*
          if (res !== -1) {
            var riesgoAntiguo = listaGeneral.filter(
              (e) => e.idriesgo === riesgoNuevo.idriesgo
            )[0];
            let aux = comparaRiesgos(riesgoAntiguo, riesgoNuevo);
            arr.push(aux);
          }
        });

        //* Obtienen los riesgos únicos de cada array de riesgos
        let dif1 = _.differenceBy(nuevaLista, listaGeneral, "idriesgo");
        let dif2 = _.differenceBy(listaGeneral, nuevaLista, "idriesgo");

        let riesgosUnicos = _.concat(dif1, dif2);
        consolidadoRiesgos = _.concat(riesgosUnicos, arr);

        consolidadoRiesgos.sort(function (a, b) {
          if (a.idriesgo > b.idriesgo) {
            return 1;
          }
          if (a.idriesgo < b.idriesgo) {
            return -1;
          }
          // a must be equal to b
          return 0;
        });
      } else if (listaGeneral.length === 0) {
        consolidadoRiesgos = nuevaLista;
      }
    }

    return consolidadoRiesgos;
  };

  //**Agrega los riesgos seleccionados al consolidado de riesgos */

  const completarTabla = (riesgo) => {
    if (motivo) {
      let year = new Date();
      let month = new Date();
      let day = new Date();
      let today =
        String(year.getFullYear()) +
        "-" +
        String(("0" + (month.getMonth() + 1)).slice(-2)) +
        "-" +
        String(("0" + day.getDate()).slice(-2));
      //* Agrega las propiedades de los riesgos seleccionados y actualiza su estado en vista a "Agregado"

      let nuevaLista = [];

      let riesgoCompleto = listaGeneralRiesgos.filter(
        (e) => e.idriesgo === riesgo
      )[0];
      riesgoCompleto.estado_enVista = "Inactivo";
      riesgoCompleto.motivo_inactivacion = motivo;
      riesgoCompleto.fecha_inactivacion = today;
      riesgoCompleto.usuario_inactivador = usuarioLog;
      nuevaLista.push(riesgoCompleto);

      let riesgos_filtrados = filtraRiesgos(listaGeneralRiesgos, nuevaLista);

      setListaGeneralRiesgos(riesgos_filtrados);
      setModalShow(false);
    }
  };

  return (
    <Modal
      show={modalShow}
      onHide={() => {
        setModalShow(false);
      }}
      size="xl"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      backdrop="static"
    >
      <Modal.Header closeButton>
        <Modal.Title className="subtitulo" id="contained-modal-title-vcenter">
          Motivo inactivación​​
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className={classes.root}>
          <Row className="mb-3">
            <Col sm={4} xs={12}>
              <label className="form-label label">
                Por favor ingrese un motivo de inactivación:
              </label>
            </Col>
          </Row>
          <Row className="mb-3">
            <Col sm={8} xs={12}>
              <textarea
                className="form-control text-center"
                placeholder="Motivo inactivación"
                rows="3"
                id="Descripcion"
                onChange={(e) => {
                  setMotivo(e.target.value);
                }}
              ></textarea>
            </Col>
          </Row>
          <Row>
            <Col sm={3} xs={12}>
              <Button
                className="botonPositivo"
                style={{ marginTop: "1%", width: "100%" }}
                onClick={() => {
                  completarTabla(riesgoInactivado);
                  setModalShow(false);
                }}
              >
                Guardar
              </Button>
            </Col>
          </Row>
        </div>
      </Modal.Body>
      <Modal.Footer></Modal.Footer>
    </Modal>
  );
}
