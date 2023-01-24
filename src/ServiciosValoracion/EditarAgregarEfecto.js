import React, { useEffect } from "react";
import { Button, Row, Col, Form, Modal, Alert } from "react-bootstrap";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import TablePagination from "@material-ui/core/TablePagination";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import { Link } from "react-router-dom";
import Checkbox from "@material-ui/core/Checkbox";

import { HotTable, HotColumn } from "@handsontable/react";
import Handsontable from "handsontable";
import "handsontable/dist/handsontable.full.css";
import $, { data } from "jquery";
import Plot from "react-plotly.js";
import ReactLoading from "react-loading";

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
    //minHeight: "57vh",
  },
  containerModal: {
    maxHeight: "50vh",
    //minHeight: "50vh",
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
export default function EditarAgregarEfecto(props) {
  const serviceAAD = new AADService();
  const classes = useStyles();
  const [data, setData] = React.useState([]);
  const [dataEfecto, setDataEfecto] = React.useState(null);
  const [dataAgre, setDataAgre] = React.useState([]);
  const [dataEnviada, setDataEnviada] = React.useState([]);
  const [dataCalculada, setDataCalculada] = React.useState(null);
  const [modalShow, setModalShow] = React.useState(false);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [selected, setSelected] = React.useState([]);
  const [alertShow, setAlertShow] = React.useState(null);
  const [estadoPost, setEstadoPost] = React.useState({
    alerta: { id: 0, data: null },
  });
  const [loading, setLoading] = React.useState(null);
  const [loadingSave, setLoadingSave] = React.useState(false);
  const [buttonC, setButtonC] = React.useState(false);

  useEffect(() => {
    let dataModal;
    const fetchdata = async () => {
      const result = await fetch(process.env.REACT_APP_API_URL + "/efectos/", {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: "Bearer " + serviceAAD.getToken(),
        },
      });
      let data = await result.json();
      setData(data);
      dataModal = data;
    };
    const getEfectoAgregado = async () => {
      await fetchdata();
      const result = await fetch(
        process.env.REACT_APP_API_URL + "/modificar/efecto_agregado/" +
          localStorage.getItem("idEfecto") +
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

      setDataEfecto(data);
      console.log(data.efecto_lista.analista);
      if (data && data.efectos) {
        let temp = [];
        if (dataModal) {
          dataModal.map((dat) => {
            data.efectos.map((dataS) => {
              if (dat.idefecto == dataS) {
                temp.push(dat);
              }
            });
          });
        }

        setDataAgre(temp);
        setButtonC(true);
      }
    };
    getEfectoAgregado();
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
  /* Función para seleccionar un Área para Editar */
  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat([], name);
      //SetButtonEdit(true);
    } else {
      //SetButtonEdit(false);
    }
    setSelected(newSelected);
  };

  const isSelected = (name) => selected.indexOf(name) !== -1;

  const retornarSelected = (dataSelected) => {
    let temp = [];
    if (data) {
      data.map((dat) => {
        dataSelected.map((dataS) => {
          if (dat.idefecto == dataS) {
            temp.push(dat);
          }
        });
      });
    }

    setDataAgre(temp);
  };

  //Grupo de riesgos
  function ModalGrupoRiesgos(props) {
    const [selected, setSelected] = React.useState([]);
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [dataBusqueda, setDataBusqueda] = React.useState(data);
    const [buscando, setBuscando] = React.useState([]);

    useEffect(() => {
      setSelected(dataAgre.map(({ idefecto }) => idefecto));
    }, []);

    const handleChangePage = (event, newPage) => {
      setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
      setRowsPerPage(+event.target.value);
      setPage(0);
    };

    /* Fin de funciones para paginación */
    /* Función para seleccionar un Área para Editar */
    const handleClick = (event, name) => {
      const selectedIndex = selected.indexOf(name);

      let newSelected = [];

      if (selectedIndex === -1) {
        newSelected = newSelected.concat(selected, name);
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
      setSelected(newSelected);
    };
    const isSelected = (name) => selected.indexOf(name) !== -1;

    async function buscar(e) {
      e.persist();
      //await setBuscando(e.target.value);
      try {
        var search = data.filter((item) => {
          if (
            String(item.idefecto)
              .toLowerCase()
              .includes(e.target.value.toLowerCase()) ||
            item.nombreefecto
              .toLowerCase()
              .includes(e.target.value.toLowerCase()) ||
            item.tipo_moneda
              .toLowerCase()
              .includes(e.target.value.toLowerCase())
          ) {
            return item;
          }
        });
        await setBuscando(e.target.value);
        await setDataBusqueda(search);
      } catch (error) {
        console.error("No se encuentra el riesgo");
      }
    }

    return (
      <Modal
        {...props}
        aria-labelledby="contained-modal-title-vcenter"
        centered
        className="modalCustom"
      >
        <Modal.Header closeButton>
          <Modal.Title className="subtitulo" id="contained-modal-title-vcenter">
            Agregar Efecto
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row className="mb-2">
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
          <Paper className={classes.root}>
            <TableContainer
              component={Paper}
              className={classes.containerModal}
            >
              <Table className={"text"} stickyHeader aria-label="sticky table">
                {/* Inicio de encabezado */}
                <TableHead className="titulo">
                  <TableRow>
                    <StyledTableCell padding="checkbox"></StyledTableCell>
                    <StyledTableCell align="left">Id Efecto</StyledTableCell>
                    <StyledTableCell align="left">Nombre</StyledTableCell>
                    <StyledTableCell align="left">Tipo</StyledTableCell>
                    <StyledTableCell align="left">Promedio</StyledTableCell>
                    <StyledTableCell align="left">P50</StyledTableCell>
                    <StyledTableCell align="left">P95</StyledTableCell>
                    <StyledTableCell align="left">P99</StyledTableCell>
                  </TableRow>
                </TableHead>
                {/* Fin de encabezado */}
                {/* Inicio de cuerpo de la tabla */}
                <TableBody>
                  {dataBusqueda
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row, index) => {
                      const isItemSelected = isSelected(row.idefecto);
                      return (
                        <StyledTableRow
                          key={row.idefecto}
                          hover
                          onClick={(event) => handleClick(event, row.idefecto)}
                          selected={isItemSelected}
                          role="checkbox"
                          tabIndex={-1}
                        >
                          <StyledTableCell component="th" scope="row">
                            <Checkbox checked={isItemSelected} />
                          </StyledTableCell>
                          <StyledTableCell component="th" scope="row">
                            {row.idefecto ? row.idefecto : null}
                          </StyledTableCell>
                          <StyledTableCell align="left">
                            {row.nombreefecto ? row.nombreefecto : null}
                          </StyledTableCell>
                          <StyledTableCell align="left">
                            {row.tipoefecto ? row.tipoefecto : null}
                          </StyledTableCell>
                          <StyledTableCell align="left">
                            {row.media ? row.media : null}
                          </StyledTableCell>
                          <StyledTableCell align="left">
                            {row.resultado_p50 ? row.resultado_p50 : null}
                          </StyledTableCell>
                          <StyledTableCell align="left">
                            {row.resultado_p95 ? row.resultado_p95 : null}
                          </StyledTableCell>
                          <StyledTableCell align="left">
                            {row.resultado_p99 ? row.resultado_p99 : null}
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
              count={data.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
            {/* Fin de paginación */}
          </Paper>
          <Row className="mt-2">
            <Col sm={8} xs={0}></Col>
            <Col sm={4} xs={12}>
              <Button
                className="botonPositivo"
                onClick={() => {
                  retornarSelected(selected);
                  setModalShow(false);
                }}
              >
                Añadir
              </Button>
            </Col>
          </Row>
        </Modal.Body>
      </Modal>
    );
  }

  const changeAgre = () => {
    let tipoAgregacion = document.getElementById("tipoAgregacion").value;
    if (tipoAgregacion) {
      setButtonC(true);
    } else {
      setButtonC(false);
    }
  };

  const sendData = () => {
    if (dataAgre && dataAgre.length >= 2) {
      const dataSend = [];
      if (dataAgre) {
        dataAgre.map((dat) => {
          dataSend.push({
            idefecto: dat.idefecto,
            media: dat.media,
            nombreefecto: dat.nombreefecto,
            resultado_p50: dat.resultado_p50,
            resultado_p95: dat.resultado_p95,
            resultado_p99: dat.resultado_p99,
            analista: serviceAAD.getUser().userName,
            metodovaloracion: dat.metodovaloracion,
          });
        });
      }

      setDataEnviada(data);
      setLoading(true);
      fetch(process.env.REACT_APP_API_URL + "/getS3/", {
        method: "POST",
        body: JSON.stringify({ datos: dataSend }),
        headers: {
          "Content-type": "application/json; charset=UTF-8",
          Authorization: "Bearer " + serviceAAD.getToken(),
        },
      }).then((response) =>
        response.json().then((json) => {
          setLoading(false);

          setDataCalculada(json);
        })
      );
    } else {
      setAlertShow("Debe seleccionar mínimo dos efectos");
      setTimeout(function () {
        setAlertShow(null);
      }, 5000);
    }
  };

  const saveData = (e) => {
    e.preventDefault();
    setLoadingSave(true);
    function limpiar(_callback) {
      _callback();
      setTimeout(() => {
        setEstadoPost({ id: 0, data: null });
      }, 3000);
    }
    let vec_general = {};
    vec_general.idefecto = dataEfecto.efecto_lista.idefecto;
    vec_general.tipoefecto = "";
    vec_general.nombreefecto = document.getElementById("nombreEfecto").value;
    vec_general.descripcionefecto =
      document.getElementById("descripcionEfecto").value;
    vec_general.metodovaloracion = "Mezcla independientes";
    vec_general.resultado_p50 = dataCalculada.ResultadoAg.P50.toString();
    vec_general.resultado_p95 = dataCalculada.ResultadoAg.P95.toString();
    vec_general.resultado_p99 = dataCalculada.ResultadoAg.P99.toString();
    vec_general.resultado_impactos_hora = "0";
    vec_general.media = dataCalculada.ResultadoAg.Promedio.toString();
    vec_general.fuente = "SIN";
    vec_general.descripcionfuente = "";
    vec_general.limite_inf_impactovar = "0";
    vec_general.limite_sup_impactovar = "0";
    vec_general.probabilidad_impactovar = "0";
    vec_general.otroriesgo = document.getElementById("materializado").value;
    const timeElapsed = Date.now();
    const today = new Date(timeElapsed);
    vec_general.fechaejecucion = today;
    vec_general.duraciontotalejecucion = "01:00";
    vec_general.tiempomezcla1 = "00:30";
    vec_general.tiempomezcla2 = "00:30";
    vec_general.tiempomezcla3 = "00:30";
    vec_general.ttagregacion = "00:30";
    vec_general.frecuenciaanualmaxima = 0;
    vec_general.frecuencia2maxima = 0;
    vec_general.duracionmaxima = 0;
    vec_general.combfqhoraxduracionmaxima = 0;
    vec_general.frecuenciaanual_esperanza = 0;
    vec_general.frecuenciaanual_p50 = 0;
    vec_general.impacto_p50 = 0;
    vec_general.ma_agregada = dataCalculada.matrizAgregada;
    vec_general.ma_concatenado = dataCalculada.ma_acoplado;
    vec_general.analista = serviceAAD.getUser().userName;
    //vec_general.analista = document.getElementById("analista").innerText;
    //vec_general.analista = vec_general.analista.split("@")[0];
    vec_general.var = "Si";
    vec_general.MotivoExclusion = "";
    vec_general.Min_impacto_vector = 0;
    vec_general.Max_impacto_vector = 0;
    vec_general.idgrupo_riesgos = "";
    let efectos_seleccionados = [];
    dataAgre.map((dat) => {
      efectos_seleccionados.push(dat.idefecto);
    });
    vec_general.id_efectos = efectos_seleccionados;
    vec_general.nombre_fuente = "";
    vec_general.tipo_moneda = "";
    vec_general.filtros_fuente = "";

    let json_envio = JSON.stringify({ efecto: vec_general });
    fetch(process.env.REACT_APP_API_URL + "/guardar_agregacion/", {
      method: "PUT",
      body: json_envio,
      headers: {
        "Content-type": "application/json; charset=UTF-8",
        Authorization: "Bearer " + serviceAAD.getToken(),
      },
    })
      .then((data) =>
        data.json().then((response) => {
          if (data.status >= 200 && data.status < 300) {
            setEstadoPost({ id: 2, data: response });
            limpiar(() => {});
            setLoadingSave(false);
          } else if (data.status >= 500) {
            setEstadoPost({ id: 5, data: response });
            limpiar(() => {});
            setLoadingSave(false);
          } else if (data.status >= 400 && data.status < 500) {
            setEstadoPost({ id: 4, data: response });
            limpiar(() => {});
            setLoadingSave(false);
          }
        })
      )
      .catch(function (error) {
        console.error(error);
        setLoadingSave(false);
      });
  };

  return (
    <>
      <AlertDismissibleExample alerta={estadoPost} />
      <ModalGrupoRiesgos
        show={modalShow}
        onHide={() => {
          setModalShow(false);
        }}
      />
      {/*  {erroresModal ? (
        <ModalErrores
          show
          onHide={() => {
            setErroresModal(false);
          }}
        />
      ) : null} */}
      <Form id="formData" onSubmit={(e) => saveData(e)}>
        {alertShow ? <Alert variant="danger">{alertShow}</Alert> : null}
        <Row className="mb-3">
          <Col md={12}>
            <h1 className="titulo">Información general del efecto</h1>
          </Col>
        </Row>
        <Row className="mb-3">
          <Col md={3}>
            <label className="label form-label">Id del Efecto</label>
          </Col>
          <Col md={3}>
            {/* <label className="texto form-label">Automatico</label> */}
            <input
              defaultValue={
                dataEfecto && dataEfecto.efecto_lista
                  ? dataEfecto.efecto_lista.idefecto
                  : null
              }
              type="text"
              disabled
              className="form-control text-center texto"
              placeholder="ID Automático"
              id="IDactivo"
            ></input>
          </Col>
          <Col md={3}>
            <label className="label form-label">Analista RO</label>
          </Col>
          <Col md={3}>
            {/* <label className="texto form-label">Automatico</label> */}
            <input
              type="text"
              disabled
              className="form-control text-center texto"
              placeholder="Usuario"
              id="analista"
              defaultValue={
                dataEfecto &&
                dataEfecto.efecto_lista &&
                dataEfecto.efecto_lista.analista
                  ? dataEfecto.efecto_lista.analista
                  : null
              }
            ></input>
          </Col>
        </Row>
        <Row className="mb-3">
          <Col md={3}>
            <label className="label form-label">Materializado en:</label>
          </Col>
          <Col md={9}>
            {/* <label className="texto form-label">Automatico</label> */}
            <select className="form-control texto" id="materializado">
              <option
                value={
                  dataEfecto &&
                  dataEfecto.efecto_lista &&
                  dataEfecto.efecto_lista.otroriesgo
                    ? dataEfecto.efecto_lista.otroriesgo
                    : ""
                }
              >
                {dataEfecto &&
                dataEfecto.efecto_lista &&
                dataEfecto.efecto_lista.otroriesgo
                  ? dataEfecto.efecto_lista.otroriesgo
                  : "-- Seleccione --"}
              </option>
              <option value={"Riesgo mercado"} key={1}>
                Riesgo mercado
              </option>
              <option value={"Riesgo crédito"} key={2}>
                Riesgo crédito
              </option>
            </select>
          </Col>
        </Row>
        <Row className="mb-3">
          <Col md={3}>
            <label className="label form-label">Nombre del efecto*</label>
          </Col>
          <Col md={9}>
            <input
              defaultValue={
                dataEfecto && dataEfecto.efecto_lista
                  ? dataEfecto.efecto_lista.nombreefecto
                  : null
              }
              required
              type="text"
              className="form-control text-center texto"
              placeholder="Ingrese nombre del efecto"
              id="nombreEfecto"
            ></input>
          </Col>
        </Row>
        <Row className="mb-3">
          <Col md={3}>
            <label className="label form-label">Descripción del efecto</label>
          </Col>
          <Col md={9}>
            <textarea
              defaultValue={
                dataEfecto && dataEfecto.efecto_lista
                  ? dataEfecto.efecto_lista.descripcionefecto
                  : null
              }
              className="form-control text-center"
              placeholder="Ingrese la descripción del efecto"
              rows="3"
              id="descripcionEfecto"
            ></textarea>
          </Col>
        </Row>
        <hr />

        <Row>
          <Col sm={8} xs={12}></Col>
          <Col sm={4} xs={6}>
            <Button
              className="botonPositivo"
              onClick={() => {
                setModalShow(true);
              }}
            >
              Añadir Efecto
            </Button>
          </Col>
        </Row>
        <br />
        <Paper className={classes.root}>
          <TableContainer component={Paper} className={classes.container}>
            <Table className={"text"} stickyHeader aria-label="sticky table">
              {/* Inicio de encabezado */}
              <TableHead className="titulo">
                <TableRow>
                  {/* <StyledTableCell padding="checkbox"></StyledTableCell> */}
                  <StyledTableCell align="left">Id Efecto</StyledTableCell>
                  <StyledTableCell align="left">Nombre</StyledTableCell>
                  <StyledTableCell align="left">Tipo</StyledTableCell>
                  <StyledTableCell align="left">Promedio</StyledTableCell>
                  <StyledTableCell align="left">P50</StyledTableCell>
                  <StyledTableCell align="left">P95</StyledTableCell>
                  <StyledTableCell align="left">P99</StyledTableCell>
                </TableRow>
              </TableHead>
              {/* Fin de encabezado */}
              {/* Inicio de cuerpo de la tabla */}
              <TableBody>
                {dataAgre
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, index) => {
                    const isItemSelected = isSelected(row.idefecto);
                    return (
                      <StyledTableRow
                        key={row.idefecto}
                        hover
                        onClick={(event) => handleClick(event, row.idefecto)}
                        selected={isItemSelected}
                        role="checkbox"
                        tabIndex={-1}
                      >
                        {/* <StyledTableCell component="th" scope="row">
                        <Checkbox checked={isItemSelected} />
                      </StyledTableCell> */}
                        <StyledTableCell component="th" scope="row">
                          {row.idefecto ? row.idefecto : null}
                        </StyledTableCell>
                        <StyledTableCell align="left">
                          {row.nombreefecto ? row.nombreefecto : null}
                        </StyledTableCell>
                        <StyledTableCell align="left">
                          {row.tipoefecto
                            ? row.tipoefecto
                            : row.metodovaloracion}
                        </StyledTableCell>
                        <StyledTableCell align="left">
                          {row.media ? row.media : null}
                        </StyledTableCell>
                        <StyledTableCell align="left">
                          {row.resultado_p50 ? row.resultado_p50 : null}
                        </StyledTableCell>
                        <StyledTableCell align="left">
                          {row.resultado_p95 ? row.resultado_p95 : null}
                        </StyledTableCell>
                        <StyledTableCell align="left">
                          {row.resultado_p99 ? row.resultado_p99 : null}
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
            count={data.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
          {/* Fin de paginación */}
        </Paper>
        <p></p>

        <Row className="mb-3">
          <Col md={3}>
            <label className="label form-label">Método de agregación:</label>
          </Col>
          <Col md={9}>
            {/* <label className="texto form-label">Automatico</label> */}
            <select
              className="form-control texto"
              id="tipoAgregacion"
              onChange={() => changeAgre()}
            >
              {dataEfecto && dataEfecto.efecto_lista ? (
                <option value={dataEfecto.efecto_lista.metodovaloracion}>
                  {dataEfecto.efecto_lista.metodovaloracion}
                </option>
              ) : (
                <option value="">-- Selecciona un tipo de agregación --</option>
              )}
              <option value={"Mezcla independientes"} key={1}>
                Mezcla independientes
              </option>
              <option value="">-- Selecciona un tipo de agregación --</option>
            </select>
          </Col>
        </Row>

        <Row className="mb-3 justify-content-center">
          {/* <Col md={1}></Col> */}

          {buttonC ? (
            <>
              {/* <Col md={2}>
                    <Button type="submit" className="botonPositivo2">
                      Guardar
                    </Button>
                  </Col> */}
              <Col md={8}></Col>
              <Col md={4}>
                <Button className="botonPositivo2" onClick={() => sendData()}>
                  Calcular exposición agregada
                </Button>
              </Col>
            </>
          ) : (
            <Col md={12}></Col>
          )}

          {/* <Row className="mb-3 justify-content-center">
              <Col className="col-auto text-center">
                <ReactLoading
                  type={"spin"}
                  color={"#FDDA24"}
                  height={80}
                  width={80}
                />
              </Col>
            </Row> */}
        </Row>
        <hr />

        <Row className="mb-3 justify-content-center">
          {loading ? (
            <>
              <Row className="mb-3 justify-content-center">
                <Col className="col-auto text-center">
                  <ReactLoading
                    type={"spin"}
                    color={"#FDDA24"}
                    height={80}
                    width={80}
                  />
                </Col>
              </Row>
            </>
          ) : dataCalculada ? (
            <>
              <Row className="mb-3">
                {dataCalculada.ma_dist ? (
                  <>
                    <Col>
                      <Plot
                        responsive
                        data={[
                          {
                            mode: "lines",
                            type: "scatter",
                            x: dataCalculada.ma_dist.x,
                            y: dataCalculada.ma_dist.y,
                            xaxis: "x1",
                            yaxis: "y1",
                            marker: { color: "rgb(255,215,0)" },
                            showlegend: false,
                          },
                        ]}
                        layout={{
                          width: 300,
                          height: 350,
                          title: {
                            text: "Matriz Agregada de Pérdidas",
                            font: { family: "Nunito, sans-serif" },
                          },
                          xaxis: {
                            range: [
                              0,
                              Math.max.apply(null, dataCalculada.ma_dist.x),
                            ],
                          },
                        }}
                      />
                    </Col>
                    <Col md={1}></Col>
                  </>
                ) : null}
              </Row>

              <Row className="mb-3 justify-content-center">
                <Col className="col-auto text-center">
                  <Paper className={classes.root}>
                    <TableContainer
                      component={Paper}
                      className={classes.container}
                    >
                      <Table
                        className={"text"}
                        stickyHeader
                        sx={{ minWidth: 650 }}
                        aria-label="sticky table"
                      >
                        <TableHead className="titulo">
                          <TableRow>
                            <StyledTableCell align="center">
                              Promedio
                            </StyledTableCell>
                            <StyledTableCell align="center">
                              P50
                            </StyledTableCell>
                            <StyledTableCell align="center">
                              P95
                            </StyledTableCell>
                            <StyledTableCell align="center">
                              P99
                            </StyledTableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          <TableRow
                            key={1}
                            sx={{
                              "&:last-child td, &:last-child th": { border: 0 },
                            }}
                          >
                            <TableCell component="th" scope="row">
                              {dataCalculada.ResultadoAg.Promedio}
                            </TableCell>
                            <TableCell align="center">
                              {dataCalculada.ResultadoAg.P50}
                            </TableCell>
                            <TableCell align="center">
                              {dataCalculada.ResultadoAg.P95}
                            </TableCell>
                            <TableCell align="center">
                              {dataCalculada.ResultadoAg.P99}
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Paper>
                </Col>
              </Row>
            </>
          ) : null}
        </Row>

        <Row className="mb-3">
          <Col md={7}></Col>
          <Col md={2}>
            {dataCalculada && props.permisos.editar ? (
              <Button
                className="botonPositivo2"
                type="submit"
                style={{ minWidth: "100%" }}
              >
                Guardar
              </Button>
            ) : null}
          </Col>
          <Col md={2}>
            <Link to="Valoraciones">
              <Button className="botonNegativo2" style={{ minWidth: "100%" }}>
                Cancelar
              </Button>
            </Link>
          </Col>
        </Row>
      </Form>
    </>
  );
}
