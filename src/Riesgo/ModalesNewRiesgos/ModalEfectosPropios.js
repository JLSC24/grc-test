import React, { useEffect } from "react";
import { Row, Col, Form, Button, Modal } from "react-bootstrap";
import Table from "@material-ui/core/Table";
import Paper from "@material-ui/core/Paper";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableBody from "@material-ui/core/TableBody";
import TablePagination from "@material-ui/core/TablePagination";
import TableCell from "@material-ui/core/TableCell";
import Checkbox from "@material-ui/core/Checkbox";
import TableRow from "@material-ui/core/TableRow";
import { withStyles, makeStyles } from "@material-ui/core/styles";
const _ = require("lodash");

const useStylesModal = makeStyles({
  root: {
    width: "100%",
  },
  container: {
    maxHeight: "55vh",
    //minHeight: "57vh",
  },
  containerModal: {
    maxHeight: "55vh",
    //minHeight: "50vh",
  },
});

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

export default function ModalEfectosPropios({
  listaGeneralEfectos,
  setListaGeneralEfectos,
  modalEfectosPropiosShow,
  setModalEfectosPropiosShow,
}) {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [dataBusqueda, setDataBusqueda] = React.useState([]);
  const [buscando, setBuscando] = React.useState(null);
  const [efecto, setEfecto] = React.useState(null);
  /* Variables para riesgos */
  const [selectedEfectos, setSelectedEfectos] = React.useState([]);
  const classes = useStylesModal();

  useEffect(() => {
    const muestraEfectosXTabla = (consolidadoEfectos, tabla) => {
      let efectosXmostrar = [];

      consolidadoEfectos.map((efecto) => {
        if (
          (efecto.estado_enVista === "Activo" ||
            efecto.estado_enVista === "Agregado") &&
          efecto.tipoEfecto === "Propio" &&
          tabla === "Tabla_Propios"
        ) {
          efectosXmostrar.push(efecto);
        } else if (
          (efecto.estado_enVista === "Activo" ||
            efecto.estado_enVista === "Agregado") &&
          efecto.tipoEfecto === "Desencadenado" &&
          tabla === "Tabla_Desencadenados"
        ) {
          efectosXmostrar.push(efecto);
        } else if (
          (efecto.estado_enVista === "Activo" ||
            efecto.estado_enVista === "Agregado") &&
          efecto.tipoEfecto === "Recibido" &&
          tabla === "Tabla_Recibidos"
        ) {
          efectosXmostrar.push(efecto);
        } else if (
          (efecto.estado_enVista === "Buscado" ||
            efecto.estado_enVista === "Inactivo") &&
          tabla === "Modal"
        ) {
          efectosXmostrar.push(efecto);
        } else if (
          efecto.estado_enVista === "Inactivo" &&
          tabla === "Inactivos"
        ) {
          efectosXmostrar.push(efecto);
        }
      });
      return efectosXmostrar;
    };
    let efectosModal_propios = muestraEfectosXTabla(
      listaGeneralEfectos,
      "Modal"
    );
    setDataBusqueda(efectosModal_propios);
  }, [listaGeneralEfectos]);

  /* Funciones para paginación */
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };
  /* Fin de funciones para paginación */

  const handleClick = (event, name) => {
    const selectedIndex = selectedEfectos.indexOf(name);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selectedEfectos, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selectedEfectos.slice(1));
    } else if (selectedIndex === selectedEfectos.length - 1) {
      newSelected = newSelected.concat(selectedEfectos.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selectedEfectos.slice(0, selectedIndex),
        selectedEfectos.slice(selectedIndex + 1)
      );
    }
    setSelectedEfectos(newSelected);

    /*  if (newSelected.length === 0) {
        setEfecto(false);
      } else {
        setEfecto(true);
      } */
  };
  const isSelected = (name) => selectedEfectos.indexOf(name) !== -1;

  async function buscarEfecto(e) {
    e.persist();
    //await setBuscando(e.target.value);
    var search = muestraEfectosXTabla(listaGeneralEfectos, "Modal").filter(
      (item) => {
        if (
          String(item.idefecto)
            .toLowerCase()
            .includes(e.target.value.toLowerCase()) ||
          item.nombreefecto
            .toLowerCase()
            .includes(e.target.value.toLowerCase()) ||
          item.tipoefecto
            .toLowerCase()
            .includes(e.target.value.toLowerCase()) ||
          /* item.otroriesgo
            .toLowerCase()
            .includes(e.target.value.toLowerCase()) || */
          item.metodovaloracion
            .toLowerCase()
            .includes(e.target.value.toLowerCase()) ||
          item.analista.toLowerCase().includes(e.target.value.toLowerCase()) ||
          item.var.toLowerCase().includes(e.target.value.toLowerCase()) ||
          item.idefecto.toString().includes(e.target.value)
        ) {
          return item;
        }
      }
    );
    await setBuscando(e.target.value);
    await setDataBusqueda(search);
  }
  const muestraEfectosXTabla = (consolidadoEfectos, tabla) => {
    let efectosXmostrar = [];

    consolidadoEfectos.map((efecto) => {
      if (
        (efecto.estado_enVista === "Activo" ||
          efecto.estado_enVista === "Agregado") &&
        efecto.tipoEfecto === "Propio" &&
        tabla === "Tabla_Propios"
      ) {
        efectosXmostrar.push(efecto);
      } else if (
        (efecto.estado_enVista === "Activo" ||
          efecto.estado_enVista === "Agregado") &&
        efecto.tipoEfecto === "Desencadenado" &&
        tabla === "Tabla_Desencadenados"
      ) {
        efectosXmostrar.push(efecto);
      } else if (
        (efecto.estado_enVista === "Activo" ||
          efecto.estado_enVista === "Agregado") &&
        efecto.tipoEfecto === "Recibido" &&
        tabla === "Tabla_Recibidos"
      ) {
        efectosXmostrar.push(efecto);
      } else if (
        (efecto.estado_enVista === "Buscado" ||
          efecto.estado_enVista === "Inactivo") &&
        tabla === "Modal"
      ) {
        efectosXmostrar.push(efecto);
      } else if (
        efecto.estado_enVista === "Inactivo" &&
        tabla === "Inactivos"
      ) {
        efectosXmostrar.push(efecto);
      }
    });
    return efectosXmostrar;
  };
  const filtraEfectos = (listaGeneral, nuevaLista) => {
    //** Toma como propiedades 1. la lista general o consolidada de todos los efectos: Activos + Inactivos +Agregados + Buscados 2.La nueva lista de efectos que se agregará: efectos Activos, efectos Escaneados, efectos Buscados

    //* Devuelve el efecto de mayor prelación Activo||Inactivo > Sugerido > Buscado --- Es invocado mas adelante
    const comparaefectos = (efectoAntiguo, efectoNuevo) => {
      if (
        efectoAntiguo.estado_enVista === "Activo" ||
        efectoAntiguo.estado_enVista === "Inactivo"
      ) {
        return efectoAntiguo;
      } else if (
        efectoNuevo.estado_enVista === "Activo" ||
        efectoNuevo.estado_enVista === "Inactivo"
      ) {
        return efectoNuevo;
      } else if (efectoAntiguo.estado_enVista === "Agregado") {
        return efectoAntiguo;
      } else if (efectoNuevo.estado_enVista === "Agregado") {
        return efectoNuevo;
      } else if (efectoAntiguo.estado_enVista === "Buscado") {
        return efectoAntiguo;
      } else if (efectoNuevo.estado_enVista === "Buscado") {
        return efectoNuevo;
      }
    };

    let consolidadoEfectos;

    if (listaGeneral.length !== 0) {
      //* funcion principal: Compara la listaGeneral de efectos y la NuevaLista de efectos, obtiene los repetidos y prevalece el mas importante (ver función comparaefectos)...
      //* ... Luego obtiene los efectos que no se repiten de cada lista, y une todos los efectos en Consolidado Efectos
      //* ... consolidado efectos se mostrará en cada tabla respectivamente según su propiedad "estado_enVista"
      let arr = [];
      let res;
      nuevaLista.map((efectoNuevo) => {
        //* devuelve el indice del riesgo repetido, de lo contrario devuelve -1
        res = _.findIndex(
          listaGeneral,
          (e) => {
            return e.idefecto == efectoNuevo.idefecto;
          },
          0
        );

        //*
        if (res !== -1) {
          var efectoAntiguo = listaGeneral.filter(
            (e) => e.idefecto === efectoNuevo.idefecto
          )[0];
          let aux = comparaefectos(efectoAntiguo, efectoNuevo);
          arr.push(aux);
        }
      });

      //* Obtienen los efectos únicos de cada array de efectos
      let dif1 = _.differenceBy(nuevaLista, listaGeneral, "idefecto");
      let dif2 = _.differenceBy(listaGeneral, nuevaLista, "idefecto");

      let efectosUnicos = _.concat(dif1, dif2);

      consolidadoEfectos = _.concat(efectosUnicos, arr);

      consolidadoEfectos.sort(function (a, b) {
        if (a.idefecto > b.idefecto) {
          return 1;
        }
        if (a.idefecto < b.idefecto) {
          return -1;
        }
        // a must be equal to b
        return 0;
      });
    } else if (listaGeneral.length === 0) {
      consolidadoEfectos = nuevaLista;
    }

    return consolidadoEfectos;
  };

  //**Agrega los efectos seleccionados al consolidado de efectos */

  const completarTabla = (efectos) => {
    //* Agrega las propiedades de los efectos seleccionados y actualiza su estado en vista a "Agregado"

    let nuevaLista = [];

    efectos.map((a) => {
      let efectoCompleto = listaGeneralEfectos.filter(
        (e) => e.idefecto === a
      )[0];

      efectoCompleto.estado_enVista = "Agregado";
      efectoCompleto.tipoEfecto = "Propio";
      nuevaLista.push(efectoCompleto);
    });

    let efectos_filtrados = filtraEfectos(listaGeneralEfectos, nuevaLista);

    setListaGeneralEfectos(efectos_filtrados);
    setModalEfectosPropiosShow(false);
  };

  return (
    <Modal
      show={modalEfectosPropiosShow}
      onHide={() => {
        setModalEfectosPropiosShow(false);
      }}
      aria-labelledby="contained-modal-title-vcenter"
      centered
      className="modalCustom"
      size="xl"
    >
      <Modal.Header closeButton>
        <Modal.Title className="subtitulo" id="contained-modal-title-vcenter">
          Agregar Efecto Propio
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Control
            value={buscando}
            onChange={(e) => buscarEfecto(e)}
            type="text"
            placeholder="Buscar"
          />
        </Form>
        <Row className="mb-2">
          <Col sm={4} xs={12}>
            {/* <Form>
                <Form.Control type="text" placeholder="Buscar" />
              </Form> */}
          </Col>
        </Row>
        <Paper className={classes.root}>
          <TableContainer component={Paper} className={classes.containerModal}>
            <Table className={"text"} stickyHeader aria-label="sticky table">
              {/* Inicio de encabezado */}
              <TableHead className="titulo">
                <TableRow>
                  <StyledTableCell padding="checkbox"></StyledTableCell>
                  <StyledTableCell align="left">Id efecto*</StyledTableCell>
                  <StyledTableCell align="left">Nombre</StyledTableCell>
                  <StyledTableCell align="left">Descripción</StyledTableCell>
                  <StyledTableCell align="left">Tipo Impacto</StyledTableCell>
                  <StyledTableCell align="left">
                    Materializado en
                  </StyledTableCell>
                  {/* <StyledTableCell align="left">
                      ¿Incluir en el VaR?
                    </StyledTableCell> */}
                  <StyledTableCell align="left">
                    Método valoración
                  </StyledTableCell>
                  <StyledTableCell align="left">P50</StyledTableCell>
                  <StyledTableCell align="left">P95</StyledTableCell>
                  <StyledTableCell align="left">P99</StyledTableCell>
                  <StyledTableCell align="left">Analista</StyledTableCell>
                </TableRow>
              </TableHead>
              {/* Fin de encabezado */}
              {/* Inicio de cuerpo de la tabla */}
              <TableBody>
                {dataBusqueda
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => {
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
                          {row.idefecto !== null ? row.idefecto : null}
                        </StyledTableCell>
                        <StyledTableCell component="th" scope="row">
                          {row.nombreefecto !== null ? row.nombreefecto : null}
                        </StyledTableCell>
                        <StyledTableCell component="th" scope="row">
                          {row.descripcionefecto !== null
                            ? row.descripcionefecto
                            : null}
                        </StyledTableCell>
                        <StyledTableCell component="th" scope="row">
                          {row.tipoefecto !== null ? row.tipoefecto : null}
                        </StyledTableCell>
                        <StyledTableCell component="th" scope="row">
                          {row.otroriesgo !== null ? row.otroriesgo : null}
                        </StyledTableCell>
                        {/* <StyledTableCell component="th" scope="row">
                            {row.var !== null ? row.var : null}
                          </StyledTableCell> */}
                        <StyledTableCell align="left">
                          {row.metodovaloracion !== null
                            ? row.metodovaloracion
                            : null}
                        </StyledTableCell>
                        <StyledTableCell align="left">
                          {row.resultado_p50 !== null
                            ? parseFloat(row.resultado_p50).toLocaleString()
                            : null}
                        </StyledTableCell>
                        <StyledTableCell align="left">
                          {row.resultado_p95 !== null
                            ? parseFloat(row.resultado_p95).toLocaleString()
                            : null}
                        </StyledTableCell>
                        <StyledTableCell align="left">
                          {row.resultado_p99 !== null
                            ? parseFloat(row.resultado_p99).toLocaleString()
                            : null}
                        </StyledTableCell>
                        <StyledTableCell align="left">
                          {row.analista !== null ? row.analista : null}
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
      </Modal.Body>
      <Modal.Footer>
        <Button
          className="botonPositivo"
          onClick={() => {
            completarTabla(selectedEfectos);
            setModalEfectosPropiosShow(false);
            setSelectedEfectos([]);
          }}
        >
          Añadir
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
