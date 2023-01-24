import React, { useState, useEffect } from "react";
import { Row, Col } from "react-bootstrap";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import Loader from "react-loader-spinner";

export default function ResumenDeEfectos({ resumenValoracion }) {
  const [exposicionInherente, SetExpoInherente] = useState(null);

  /* useEffect(() => {

    let expoInherente = getValorResumen(resumenValoracion, "total", "p95");

    setExposicionIn(expoInherente);
  }, [resumenValoracion]); */

  const lista_tipos_de_efectos = [
    { label: "Pérdida de activos físicos:", value: "perdidaactivos" },
    { label: "Demandas y costos legales:​", value: "demandas" },
    { label: "Pérdida del recurso:​", value: "perdidarecurso" },
    { label: "Multas y sanciones:​", value: "multas" },
    { label: "Restitución a terceros:​", value: "restitucion" },
    { label: "Sobrecostos:​", value: "sobrecostos" },
    { label: "Ingresos dejados de percibir:​", value: "ingresos" },
    { label: "Reproceso:​", value: "reproceso" },
  ];
  const lista_resumen_de_efectos = [
    { label: "Efectos propios:", value: "propios" },
    { label: "Efectos desencadenados:​", value: "desencadenados" },
    { label: "Efectos recibidos:​", value: "recibidos" },
  ];

  const getValorResumen = (data, tipoEfecto, tipo_P) => {
    if (data) {
      data = Object.entries(data); //*Transforma el elemento en un array de arrays */
      let valor = "";
      let result = 0;
      data.map((e) => {
        let tipoDeEfecto = e[0].slice(4); //* obtiene el tipo de Efecto de cada fila (propio,desencadenado,recibido)
        let P = e[0].slice(0, 3); //* obtiene el tipo de P de cada fila (P50,P95,P99)
        if (tipoDeEfecto == tipoEfecto && tipo_P == P) {
          valor = Number(e[1]);
          result = parseFloat(valor).toLocaleString(); //* convierte el numero con separador de miles
        }
      });
      return result;
    }
  };

  return (
    <>
      <Row className="mb-3 mt-5">
        <Col sm={12} xs={12}>
          <h1 className="subtitulo text-center">Resumen de efectos</h1>
        </Col>
      </Row>

      <Table>
        <TableHead className="titulo">
          <TableRow className="form-lable label">
            <TableCell align="left">
              <h4 className="form-label titulo_resumen">
                Resumen por tipo de efecto
              </h4>
            </TableCell>
            <TableCell align="center">
              {" "}
              <label className="form-label titulo_resumen">P50 inherente</label>
            </TableCell>
            <TableCell align="center">
              {" "}
              <label className="form-label titulo_resumen">P95 inherente</label>
            </TableCell>
            <TableCell align="center">
              {" "}
              <label className="form-label titulo_resumen">P99 inherente</label>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {lista_tipos_de_efectos.map((row) => {
            return (
              <TableRow>
                <TableCell variant="head">{row.label}</TableCell>
                <TableCell align="center">
                  {getValorResumen(resumenValoracion, row.value, "p50")}
                </TableCell>
                <TableCell align="center">
                  {getValorResumen(resumenValoracion, row.value, "p95")}
                </TableCell>
                <TableCell align="center">
                  {getValorResumen(resumenValoracion, row.value, "p99")}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
      <Table className="mt-5">
        <TableHead className="titulo">
          <TableRow className="form-lable label">
            <TableCell align="left" style={{ width: "36%" }}>
              <h4 className="form-label titulo_resumen">Resumen general </h4>
            </TableCell>
            <TableCell align="center">
              {" "}
              <label className="form-label titulo_resumen">P50 inherente</label>
            </TableCell>
            <TableCell align="center">
              {" "}
              <label className="form-label titulo_resumen">P95 inherente</label>
            </TableCell>
            <TableCell align="center">
              {" "}
              <label className="form-label titulo_resumen">P99 inherente</label>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {lista_resumen_de_efectos.map((row) => {
            return (
              <TableRow>
                <TableCell variant="head">{row.label}</TableCell>
                <TableCell align="center">
                  {getValorResumen(resumenValoracion, row.value, "p50")}
                </TableCell>
                <TableCell align="center">
                  {getValorResumen(resumenValoracion, row.value, "p95")}
                </TableCell>
                <TableCell align="center">
                  {getValorResumen(resumenValoracion, row.value, "p99")}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
      <Table className="mt-5">
        <TableHead className="titulo">
          <TableRow>
            <TableCell align="left" style={{ width: "36%" }}></TableCell>
            <TableCell align="center">
              {" "}
              <label className="form-label subtitulo">P50</label>
            </TableCell>
            <TableCell align="center">
              {" "}
              <label className="form-label subtitulo">P95</label>
            </TableCell>
            <TableCell align="center">
              {" "}
              <label className="form-label subtitulo">P99</label>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell variant="head">
              <h4 className="form-label subtitulo">Total </h4>
            </TableCell>
            <TableCell align="center">
              <h4 className="form-label titulo_resumen">
                {getValorResumen(resumenValoracion, "total", "p50")}
              </h4>
            </TableCell>
            <TableCell align="center">
              <h4 className="form-label titulo_resumen">
                {getValorResumen(resumenValoracion, "total", "p95")}
              </h4>
            </TableCell>
            <TableCell align="center">
              <h4 className="form-label titulo_resumen">
                {getValorResumen(resumenValoracion, "total", "p99")}
              </h4>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </>
  );
}
