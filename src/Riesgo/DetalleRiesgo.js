import React, { useState, useEffect } from "react";
import ModalEfectosPropios from "./ModalesNewRiesgos/ModalEfectosPropios";
import ModalEfectosDesencadenados from "./ModalesNewRiesgos/ModalEfectosDesencadenados";
import ModalEfectosRecibidos from "./ModalesNewRiesgos/ModalEfectosRecibidos";
import ResumenDeEfectos from "./ResumenValoracion.js";
import ResumenCalculo from "./ResumenCalculo";
import ModalAlerta from "../Globales/ModalAlerta";
import {
  Row,
  Col,
  Form,
  Alert,
  Navbar,
  Container,
  Nav,
  Button,
  Modal,
} from "react-bootstrap";
import Switch from "@material-ui/core/Switch";
import { Link, useHistory } from "react-router-dom";
import Select from "react-select";
import makeAnimated from "react-select/animated";

import Table from "@material-ui/core/Table";
import Paper from "@material-ui/core/Paper";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableBody from "@material-ui/core/TableBody";
import TablePagination from "@material-ui/core/TablePagination";
import FormControlLabel from "@material-ui/core/FormControlLabel";

import TableCell from "@material-ui/core/TableCell";
import Checkbox from "@material-ui/core/Checkbox";
import TableRow from "@material-ui/core/TableRow";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import { Box } from "@material-ui/core";
import Loader from "react-loader-spinner";
import PropTypes from "prop-types";
import { AiFillDelete, AiFillCaretDown } from "react-icons/ai";
import { MdAddCircleOutline } from "react-icons/md";
import axios from "axios";
import AADService from "../auth/authFunctions";

import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControl from "@mui/material/FormControl";

const AlertDismissibleExample = ({ alerta }) => {
  switch (alerta) {
    case 1:
      return <Alert variant="warning">Alerta</Alert>;

    case 2:
      return <Alert variant="success">Guardó exitosamente</Alert>;

    case 3:
      return <Alert variant="danger"></Alert>;

    case 4:
      return <Alert variant="warning">Error al enviar la información</Alert>;

    case 5:
      return <Alert variant="danger">Error en el servidor</Alert>;

    case 6:
      return (
        <Alert variant="warning">
          Ya existe una evaluación para el activo seleccionado
        </Alert>
      );
    case 7:
      return (
        <Alert variant="warning">
          Corrige los siguientes errores: • Debe completar los campos
          obligatorios
        </Alert>
      );
    case 8:
      return (
        <Alert variant="warning">
          No se permite crear un riesgo con el mismo nombre
        </Alert>
      );
    default:
      return <p></p>;
  }
};

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

const useStylesModal = makeStyles({
  root: {
    width: "100%",
  },
  container: {
    maxHeight: "30vh",
    //minHeight: "57vh",
  },
  containerModal: {
    maxHeight: "30vh",
    //minHeight: "50vh",
  },
});
const animatedComponents = makeAnimated();
const defaultState = {
  id: "",
  descripcion: "",
  causaN1: "",
  causaN2: "",
  estado: true,
  porcentaje: "",
};
let defaultControles = { id: "" };
let controles = [defaultControles];
let causasRow = [];
let causasRowN2 = [];

function RowCausa({
  onChange,
  onRemove,
  id,
  descripcion,
  porcentaje,
  causaN1,
  causaN2,
}) {
  const [mostrarControles, setMostrarControles] = React.useState(false);
  const serviceAAD = new AADService();
  const [stateCausa, setStateCausa] = useState("Activa");
  const [state, setIdState] = useState("Activa");
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [dataControles, setDataControles] = React.useState([]);
  const [dataControlesActivos, setDataControlesActivos] = React.useState([]);
  const [selected, setSelected] = React.useState([]);
  const [modalShow, setModalShow] = React.useState(false);
  const [selectedCausaN1, setSelectedCausaN1] = React.useState(false);
  const classes = useStyles();

  useEffect(() => {
    async function getControles() {
      try {
        const result = await fetch(process.env.REACT_APP_API_URL + "/controles/", {
          method: "GET",
          headers: {
            Accept: "application/json",
            Authorization: "Bearer " + serviceAAD.getToken(),
          },
        });
        let controles = await result.json();
        setDataControles(controles);
      } catch (error) {
        console.error(error);
      }
    }
    getControles();
  }, []);

  const desasociar = () => {
    let temp = dataControlesActivos;
    selected.map((dataSelected) => {
      temp = temp.filter(function (element) {
        return element.idcontrol !== dataSelected;
      });
    });
    const indexControles = parseInt(localStorage.getItem("indexControles"));
    controles[indexControles] = temp;
    setDataControlesActivos(temp);
  };
  const handleChangeState = (event) => {
    if (stateCausa === "Activa") {
      setStateCausa("Inactiva");
      setIdState(false);
      onChange("estado", false);
    } else {
      setStateCausa("Activa");
      setIdState(true);
      onChange("estado", true);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const isSelected = (name) => selected.indexOf(name) !== -1;
  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
      //SetButtonEdit(true);
    } else {
      //SetButtonEdit(false);
    }
    setSelected(newSelected);
  };

  const habilitarN2 = () => {
    setSelectedCausaN1(false);
    setTimeout(() => {
      setSelectedCausaN1(true);
      onChange("id", "");
    }, 20);
  };

  function ModalGrupoRiesgos(props) {
    const [selected, setSelected] = React.useState([]);
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [dataBusqueda, setDataBusqueda] = React.useState(dataControles);
    const [buscando, setBuscando] = React.useState(null);
    /* Funciones para paginación */

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
        newSelected = newSelected.concat(selected, name);
        //SetButtonEdit(true);
      } else {
        //SetButtonEdit(false);
      }
      setSelected(newSelected);
    };
    const isSelected = (name) => selected.indexOf(name) !== -1;
    const retornarSelected = (dataSelected) => {
      let temp = [];
      if (dataControles) {
        dataControles.map((dat) => {
          dataSelected.map((dataS) => {
            if (dat.idcontrol === dataS) {
              temp.push(dat);
            }
          });
        });
      }
      const indexControles = parseInt(localStorage.getItem("indexControles"));
      controles[indexControles] = temp;
      setDataControlesActivos(temp);
    };

    async function buscar(e) {
      e.persist();
      //await setBuscando(e.target.value);
      var search = dataControles.filter((item) => {
        if (
          item.nombre.toLowerCase().includes(e.target.value.toLowerCase()) ||
          item.descripcion
            .toLowerCase()
            .includes(e.target.value.toLowerCase()) ||
          item.idcontrol.toString().includes(e.target.value)
        ) {
          return item;
        }
      });
      await setBuscando(e.target.value);
      await setDataBusqueda(search);
    }

    return (
      <Modal
        {...props}
        aria-labelledby="contained-modal-title-vcenter"
        centered
        className="modalCustom"
      >
        <Modal.Header closeButton>
          <Modal.Title
            className="subtitulo text-center"
            id="contained-modal-title-vcenter"
          >
            Agregar Objetos de costo
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Control
              value={buscando}
              onChange={(e) => buscar(e)}
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
            <TableContainer
              component={Paper}
              className={classes.containerModal}
            >
              <Table className={"text"} stickyHeader aria-label="sticky table">
                {/* Inicio de encabezado */}
                <TableHead className="titulo">
                  <TableRow>
                    <StyledTableCell padding="checkbox"></StyledTableCell>
                    <StyledTableCell align="left">Id Control*</StyledTableCell>
                    <StyledTableCell align="left">
                      Nombre Control
                    </StyledTableCell>
                    <StyledTableCell align="left">
                      Descripción Control
                    </StyledTableCell>
                    <StyledTableCell align="left">Ubicación</StyledTableCell>
                  </TableRow>
                </TableHead>
                {/* Fin de encabezado */}
                {/* Inicio de cuerpo de la tabla */}
                <TableBody>
                  {dataBusqueda
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row) => {
                      const isItemSelected = isSelected(row.idcontrol);

                      return (
                        <StyledTableRow
                          key={row.idcontrol}
                          hover
                          onClick={(event) => handleClick(event, row.idcontrol)}
                          selected={isItemSelected}
                          role="checkbox"
                          tabIndex={-1}
                        >
                          <StyledTableCell component="th" scope="row">
                            <Checkbox checked={isItemSelected} />
                          </StyledTableCell>
                          <StyledTableCell component="th" scope="row">
                            {row.idcontrol !== null ? row.idcontrol : null}
                          </StyledTableCell>
                          <StyledTableCell align="left">
                            {row.nombre !== null ? row.nombre : null}
                          </StyledTableCell>
                          <StyledTableCell align="left">
                            {row.descripcion !== null ? row.descripcion : null}
                          </StyledTableCell>
                          <StyledTableCell align="left">
                            {row.id_ubicacion !== null
                              ? row.id_ubicacion
                              : null}
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

  return (
    <>
      <ModalGrupoRiesgos
        show={modalShow}
        onHide={() => {
          setModalShow(false);
        }}
      />
      <Row className="mb-3">
        <Col sm={1} xs={12}>
          <input
            value={id}
            type="text"
            className="form-control text-left texto"
            placeholder="ID Automático"
            required
            disabled
            id="analista"
          ></input>
        </Col>
        <Col sm={2} xs={12} style={{ zIndex: 3 }}>
          <Select
            onChange={(e) => {
              onChange("causaN1", e.value);
            }}
            components={animatedComponents}
            options={causasRow}
            placeholder={"Seleccione"}
          />
        </Col>
        <Col sm={2} xs={12} style={{ zIndex: 3 }}>
          <Select
            onChange={(e) => onChange("causaN2", e.value)}
            components={animatedComponents}
            options={causasRowN2}
            placeholder={"Seleccione"}
          />
        </Col>
        <Col sm={2} xs={12}>
          <textarea
            value={descripcion}
            onChange={(e) => onChange("descripcion", e.target.value)}
            className="form-control text-center texto"
            placeholder="Descripción de causa"
            rows="1"
            id="Descripcion"
          ></textarea>
        </Col>
        <Col sm={2} xs={12}>
          <input
            value={porcentaje}
            onChange={(e) => onChange("porcentaje", e.target.value)}
            type="number"
            className="form-control text-left texto"
            placeholder="Porcentaje"
            required
            id="analista"
          ></input>
        </Col>
        <Col sm={1} xs={12}>
          {/* <select
            className="form-control texto"
            id="clasificacionCausa"
            onChange={(e) => onChange("estado", e.target.value)}
          >
            <option value="">-- Seleccione --</option>
            <option value="1">Activa</option>
            <option value="0">Inactiva</option>
          </select> */}
          <FormControlLabel
            id="switch"
            className="texto"
            control={<Switch checked={/* state */ true} />}
            label={stateCausa}
            onChange={(e) => {
              /* handleChangeState(e) */
              onChange("estado", true);
              //todo Esta función no genera nigún cambio?
            }}
            name="Estado"
          />
        </Col>
        <Col sm={1} xs={12}>
          <Button
            onClick={() => setMostrarControles(!mostrarControles)}
            variant={mostrarControles ? "secondary" : "outline-secondary"}
          >
            {" "}
            Controles <AiFillCaretDown />
          </Button>
        </Col>
        <Col sm={1} xs={12}>
          <Button onClick={onRemove} variant="danger">
            <AiFillDelete />
          </Button>
        </Col>
      </Row>

      <div className={mostrarControles ? "" : "divOculto"}>
        <Row className="mb-3">
          <Col sm={8} xs={12} className="text-left">
            <label className="form-label label">Controles activos</label>
          </Col>
          <Col sm={2} xs={12} className="text-left">
            <Button
              onClick={(e) => {
                onChange("controles", e);
                setModalShow(true);
              }}
              className="botonPositivo2"
            >
              Asociar controles
            </Button>
          </Col>
          <Col sm={2} xs={12} className="text-left">
            <Button className="botonNegativo2" onClick={() => desasociar()}>
              Desasociar
            </Button>
          </Col>
        </Row>

        <Row className="mb-3">
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
                    <StyledTableCell align="left">Id Control*</StyledTableCell>
                    <StyledTableCell align="left">
                      Nombre Control
                    </StyledTableCell>
                    <StyledTableCell align="left">
                      Descripción Control
                    </StyledTableCell>
                    <StyledTableCell align="left">Cubrimiento</StyledTableCell>
                    <StyledTableCell align="left">Ubicación</StyledTableCell>
                  </TableRow>
                </TableHead>
                {/* Fin de encabezado */}
                {/* Inicio de cuerpo de la tabla */}
                <TableBody>
                  {dataControlesActivos
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row, index) => {
                      const isItemSelected = isSelected(row.idcontrol);

                      return (
                        <StyledTableRow
                          key={row.idcontrol}
                          hover
                          onClick={(event) => handleClick(event, row.idcontrol)}
                          selected={isItemSelected}
                          role="checkbox"
                          tabIndex={-1}
                        >
                          <StyledTableCell component="th" scope="row">
                            <Checkbox checked={isItemSelected} />
                          </StyledTableCell>
                          <StyledTableCell component="th" scope="row">
                            {row.idcontrol !== null ? row.idcontrol : null}
                          </StyledTableCell>
                          <StyledTableCell align="left">
                            {row.nombre !== null ? row.nombre : null}
                          </StyledTableCell>
                          <StyledTableCell align="left">
                            {row.descripcion !== null ? row.descripcion : null}
                          </StyledTableCell>
                          <StyledTableCell align="left">
                            <input
                              required
                              id={"porcentajeControl" + row.idcontrol}
                              type="number"
                              className="form-control text-center texto"
                              placeholder="Porcentaje de cubrimiento"
                            ></input>
                          </StyledTableCell>
                          <StyledTableCell align="left">
                            {row.id_ubicacion !== null
                              ? row.id_ubicacion
                              : null}
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
              count={dataControles.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
            {/* Fin de paginación */}
          </Paper>
        </Row>
      </div>
      <Row className="mb-0">
        <Col>
          <hr />
        </Col>
      </Row>
    </>
  );
}

export default function DetalleRiesgo(props) {
  const serviceAAD = new AADService();

  /* Datos para el grid */
  const [causas, setCausas] = useState(null);
  const [causasN2, setCausasN2] = useState(null);

  const [efectosPropios, setEfectosPropios] = useState([]);
  const [efectosDesencadenados, setEfectosDesencadenados] = useState([]);
  const [efectosRecibidos, setEfectosRecibidos] = useState([]);
  const [efectosInactivos, setEfectosInactivos] = useState([]);

  /* Datos para los modales */

  const [editarAsociacion_propios, setEditarAsociacion_propios] =
    useState(false);
  const [editarAsociacion_desencadenados, setEditarAsociacion_desencadenados] =
    useState(false);
  const [editarAsociacion_recibidos, setEditarAsociacion_recibidos] =
    useState(false);
  const [dataEfectos, setDataEfectos] = useState([]);
  const [dataRiesgos, setDataRiesgos] = useState([]);
  const [rxRiesgosEfectos, setRxRiesgosEfectos] = useState([]);
  const [modalEfectosPropiosShow, setModalEfectosPropiosShow] = useState(false);

  const [modalEfectosDesencadenadosShow, setModalEfectosDesencadenadosShow] =
    useState(false);

  const [modalEfectosRecibidosShow, setModalEfectosRecibidosShow] =
    useState(false);
  const [modalEditarEfectosPropiosShow, setModalEditarEfectosPropiosShow] =
    useState(false);
  const [
    modalEditarEfectosDesencadenadosShow,
    setModalEditarEfectosDesencadenadosShow,
  ] = useState(false);

  const [modalEditarEfectosRecibidosShow, setModalEditarEfectosREcibidosShow] =
    useState(false);
  /* Datos para editar efectos propios */
  const [selected_propios, setSelected_propios] = React.useState([]);
  const [selectedRiesgosEfecto_propios, setSelectedRiesgosEfecto_propios] =
    useState([]);

  /* Datos para editar efectos desencadenados */
  const [selected_desencadenados, setSelected_desencadenados] = React.useState(
    []
  );
  const [
    selectedRiesgosEfecto_desencadenados,
    setSelectedRiesgosEfecto_desencadenados,
  ] = useState([]);

  /* Datos para editar efectos recibidos */
  const [selected_recibidos, setSelected_recibidos] = React.useState([]);
  const [selectedRiesgosEfecto_recibidos, setSelectedRiesgosEfecto_recibidos] =
    useState([]);
  //* Reciben los datos para llenar cada uno de los Select

  const [elementoNegPal, setElementoNegPal] = useState([]);
  const [companias, setCompanias] = useState([]);
  const [listaElementos, setTipoElementoSelect] = useState([]);
  const [listaProceso, setListaProceso] = useState([]);
  //const [listaProveedor, setListaProveedor] = useState(["sin informacion"]);
  //const [listaProyecto, setListaProyecto] = useState(["sin informacion"]);
  const [listaProducto, setListaProducto] = useState([]);
  const [listaCanal, setListaCanal] = useState([]);
  const [catRiesgos, setCatRiesgos] = useState([]);
  const [subCatRiesgo, setSubCatRiesgo] = useState([]);
  const [catRiesgos_local, setCatRiesgos_Local] = useState([]);
  const [estados, setEstados] = useState([]);

  //* Reciben los datos filtrados
  const [listaGeneral, setListaGeneral] = useState([]);
  const [listaProceso_filtered, setListaProcesoFiltered] = useState([]);
  const [listaProveedor_filtered, setListaProveedorFiltered] = useState([]);
  const [listaProyecto_filtered, setListaProyectoFiltered] = useState([]);
  const [listaProducto_filtered, setListaProductoFiltered] = useState([]);
  const [listaCanal_filtered, setListaCanalFiltered] = useState([]);
  const [subCatRiesgo_filtered, setsubCatRiesgoFiltered] = useState([]);
  const [catRiesgosRO_filtered, setCat_RO_localFiltered] = useState([]);

  //* Reciben los datos ingresados/elegidos por el usuario
  const [idRiesgo, setIdRiesgo] = useState(null);
  const [estadoRiesgo, setEstadoRiesgo] = useState(null);
  const [compania, setCompania] = useState(null);
  const [nombre_riesgo, setNombre_riesgo] = useState(null);
  const [descripcion, setDescripcion] = useState(null);
  const [aristas, setAristas] = useState(null);
  const [tipoElemento, setTipoElemento] = useState(null);
  const [elemento, setElementoEv] = useState(null);
  const [proceso, setProceso] = useState(null);
  const [canal, setCanal] = useState(null);
  const [producto, setProducto] = useState(null);

  const [riesgoRO, setRiesgoRo] = useState(null);
  const [subRiesgoRO, setSubRiesgoRo] = useState(null);
  const [riesgoLocal, setRiesgoLocal] = useState(null);
  const [descripComplementaria, setDescComplementaria] = useState(null);
  const [riesgoCont, setRiesgoCont] = useState(null);

  //* Recibe el Riesgo a Editar
  const [riesgoEditar, SetRiesgoEditar] = useState(null);
  const [dataGrid, setDataGrid] = useState([]);

  //* Variables relacionadas con el resumen del calculo (DetalleRO)
  const [exposicionIn, setExposicionIn] = useState(null);
  const [efectividadCtrl, setEfectividadCtrl] = useState(null);
  const [exposicionResidual, setExposicionResidual] = useState(null);
  const [nivelRiesgoInherente, setNivelRiesgoInherente] = useState(null);
  const [nivelRiesgoResidual, setNivelRiesgoResidual] = useState(null);
  const [par, setPar] = useState(null);

  //* Variables relacionadas con el resumen de la valoracion (Efectos)
  const [muestraResumen, setMuestraResumen] = useState(false);
  const [resumenValoracion, setResumenValoracion] = useState(null);
  const [loadingData, setLoadingData] = React.useState(false);
  const history = useHistory();

  //* Controla comportamiento de la vista

  const [tipoCompo, setTipoComponente] = useState("Select");
  const [isCheckedRO, setIsCheckedRO] = useState(false);
  const [visibilidad, setVisible] = useState(false);
  const [checkedStateImpacto, setCheckedStateImpacto] = useState(false);
  const [validated, setValidated] = useState(false);
  const [estadoPost, setEstadoPost] = useState({
    alerta: { id: 0, data: null },
  });
  const [showAlertaCompania, setShowAlertaCompania] = useState(false);
  const listaAristas = [
    {
      name: "RO",
      value: "RO",
    },
    {
      name: "SOX",
      value: "SOX",
    },
    {
      name: "LAFT",
      value: "LAFT",
    },
    {
      name: "PDP",
      value: "PDP",
    },
    {
      name: "SAC",
      value: "SAC",
    },
    {
      name: "Corrupción int.",
      value: "Corrupción interna",
    },
    {
      name: "Corrupción ext.",
      value: "Corrupción externa",
    },
    {
      name: "Reputacional",
      value: "Reputacional",
    },
    {
      name: "Legal",
      value: "Legal",
    },
    {
      name: "ESG",
      value: "ESG",
    },
  ];
  const [checkedState, setCheckedState] = useState(
    new Array(listaAristas.length).fill(false)
  );

  //* Variables para el resumen de efectos */

  const [dataResumenEfecto, setDataResumenEfecto] = useState([]);

  const classes = useStylesModal();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [dataCausaIn, setDataCausaIn] = React.useState([]);

  useEffect(() => {
    setLoadingData(true);

    let companias;
    let elementosNegPpal;
    let listaProcesos;
    let listaProductos;
    let listaCanales;
    let catRiesgo_Corp;
    let subCatRiesgo_Corp;
    let catRiesgoRO_Local;
    let riesgo;
    let detalleRO;
    let ubicacion_elementoPpal;
    let ubicacion_Proceso;
    let productosRiesgo;
    let canalesRiesgo;
    let causasRiesgo;

    //* configura estado /////////////////////

    const listadoEstados = [
      { value: 1, label: "Activo" },
      { value: 0, label: "Inactivo" },
    ];

    setEstados(listadoEstados);

    //*Recibe los datos de la compania ////////////////////////
    const getCompanias = async () => {
      try {
        const response_compania = await axios.get(
          process.env.REACT_APP_API_URL + "/maestros_ro/compania/",
          {
            headers: {
              Authorization: "Bearer " + serviceAAD.getToken(),
            },
          }
        );
        companias = await response_compania.data.map(
          ({ idcompania: value, compania: label, pais }) => ({
            value,
            label,
            pais,
          })
        );
        setCompanias(companias);
      } catch (error) {
        console.error(error);
      }
    };

    //* Recibe los datos de los elementos de negocio prinicpales ///////
    const getElementosNegPpal = async () => {
      try {
        const response_elemNegPpal = await axios.get(
          process.env.REACT_APP_API_URL + "/generales/Evaluaciones/Tipo_elemento_negocio_principal",
          {
            headers: {
              Authorization: "Bearer " + serviceAAD.getToken(),
            },
          }
        );
        elementosNegPpal = await response_elemNegPpal.data.map(
          ({ idm_parametrosgenerales: value, valor: label }) => ({
            value,
            label,
          })
        );
        setElementoNegPal(elementosNegPpal);
      } catch (error) {
        console.error(error);
      }
    };

    //* Recibe los datos de los procesos ///////////////////////
    const getListaProcesos = async () => {
      try {
        const response_procesos = await axios.get(
          process.env.REACT_APP_API_URL + "/ultimonivel/Proceso",
          {
            headers: {
              Authorization: "Bearer " + serviceAAD.getToken(),
            },
          }
        );
        listaProcesos = await response_procesos.data.map(
          ({ id: value, nombre: label, idcompania }) => ({
            value,
            label,
            idcompania,
          })
        );
        setListaProceso(listaProcesos);
      } catch (error) {
        console.error(error);
      }
    };

    //* Recibe los datos de los productos ///////////////////////
    const getProductos = async () => {
      try {
        const response_productos = await axios.get(
          process.env.REACT_APP_API_URL + "/ultimonivel/Producto",
          {
            headers: {
              Authorization: "Bearer " + serviceAAD.getToken(),
            },
          }
        );
        listaProductos = await response_productos.data.map(
          ({ id: value, nombre: label, idcompania }) => ({
            value,
            label,
            idcompania,
          })
        );
        setListaProducto(listaProductos);
      } catch (error) {
        console.error(error);
      }
    };

    //* Recibe los datos de los canales ///////////////////////
    const getCanales = async () => {
      try {
        const response_canales = await axios.get(
          process.env.REACT_APP_API_URL + "/ultimonivel/Canal",
          {
            headers: {
              Authorization: "Bearer " + serviceAAD.getToken(),
            },
          }
        );
        listaCanales = response_canales.data.map(
          ({ id: value, nombre: label, idcompania }) => ({
            value,
            label,
            idcompania,
          })
        );
        setListaCanal(listaCanales);
      } catch (error) {
        console.error(error);
      }
    };

    //*Recibe y transforma los datos de las categorias de riesgo RO y local //////
    const getCategoriasRiesgos = async () => {
      try {
        const response = await axios.get(
          process.env.REACT_APP_API_URL + "/maestros_ro/categoria_riesgo/",
          {
            headers: {
              Authorization: "Bearer " + serviceAAD.getToken(),
            },
          }
        );
        let datos = await response.data.map(
          ({
            idcategoria_riesgo: value,
            nombre: label,
            atributo,
            nivel,
            categoria_riesgos_n1,
          }) => ({
            value,
            label,
            atributo,
            nivel,
            categoria_riesgos_n1,
          })
        );
        catRiesgo_Corp = [];
        subCatRiesgo_Corp = [];
        catRiesgoRO_Local = [];
        datos.map((riesgo) => {
          if (
            riesgo.atributo !== "Corporativa" &&
            riesgo.atributo !== "Oculta" &&
            riesgo.nivel === 3
          ) {
            catRiesgoRO_Local.push(riesgo);
          } else if (riesgo.nivel === 1) {
            catRiesgo_Corp.push(riesgo);
          } else if (riesgo.nivel === 3) {
            subCatRiesgo_Corp.push(riesgo);
          }
          return null;
        });

        setCatRiesgos(catRiesgo_Corp);
        setSubCatRiesgo(subCatRiesgo_Corp);
        setCatRiesgos_Local(catRiesgoRO_Local);
      } catch (error) {
        console.error(error);
      }
    };

    //*Recibe los datos del riesgo a editar  ///////////////
    const getRiesgo = async () => {
      try {
        const response_riesgo = await axios.get(
          process.env.REACT_APP_API_URL + "/riesgos/" +
            localStorage.getItem("idRiesgo") +
            "/",
          {
            headers: {
              Authorization: "Bearer " + serviceAAD.getToken(),
            },
          }
        );
        riesgo = await response_riesgo.data;
      } catch (error) {
        console.error(error);
      }
    };

    const getDetalleRO = async () => {
      const verificaDetalleRO = (aristasDelRiesgo) => {
        if (aristas) {
          let aristas = aristasDelRiesgo.split(", ");
          let isRO;
          aristas.map((e) => {
            if (e === "RO") {
              isRO = true;
            }
          });
          return isRO;
        }
      };

      let existeDetalleRO = verificaDetalleRO(riesgo.arista_del_riesgo);

      try {
        if (existeDetalleRO === true) {
          const response_DetalleRO = await axios.get(
            process.env.REACT_APP_API_URL + "/rx_detalle_ro/" + riesgo.idriesgo + "/",
            {
              headers: {
                Authorization: "Bearer " + serviceAAD.getToken(),
              },
            }
          );
          detalleRO = await response_DetalleRO.data;
        }
      } catch (error) {
        console.error(error);
      }
    };

    const getUbicacion_elementoPpal = async () => {
      try {
        const response_UElementoPpal = await axios.get(
          process.env.REACT_APP_API_URL + "/ubicacion/" + riesgo.id_elemento_ppal + "/",
          {
            headers: {
              Authorization: "Bearer " + serviceAAD.getToken(),
            },
          }
        );

        ubicacion_elementoPpal = await response_UElementoPpal.data;
      } catch (error) {
        console.error(error);
      }
    };

    const getUbicacion_procesoRiesgo = async () => {
      try {
        const response_UProceso = await axios.get(
          process.env.REACT_APP_API_URL + "/ubicacion/" + riesgo.idubicacion + "/",
          {
            headers: {
              Authorization: "Bearer " + serviceAAD.getToken(),
            },
          }
        );

        ubicacion_Proceso = await response_UProceso.data;
      } catch (error) {
        console.error(error);
      }
    };

    const getProductosRiesgo = async () => {
      try {
        const responseProductos = await axios.get(
          process.env.REACT_APP_API_URL + "/rx_riesgo_producto/" + riesgo.idriesgo + "/",
          {
            headers: {
              Authorization: "Bearer " + serviceAAD.getToken(),
            },
          }
        );

        let aux = responseProductos.data.map((e) => e.idproducto);
        productosRiesgo = aux.map(({ idprod: value, nombre: label }) => ({
          value,
          label,
        }));
      } catch (error) {
        console.error(error);
      }
    };

    const getCanalesRiesgo = async () => {
      try {
        const responseCanales = await axios.get(
          process.env.REACT_APP_API_URL + "/rx_riesgo_canal/" + riesgo.idriesgo + "/",
          {
            headers: {
              Authorization: "Bearer " + serviceAAD.getToken(),
            },
          }
        );

        let aux = responseCanales.data.map((e) => e.idcanal);
        canalesRiesgo = aux.map(({ idcanal: value, nombre: label }) => ({
          value,
          label,
        }));
      } catch (error) {
        console.error(error);
      }
    };

    const getCausasRiesgo = async () => {
      try {
        const responseCausas = await axios.get(
          process.env.REACT_APP_API_URL + "/rx_riesgo_causa/" + riesgo.idriesgo + "/",
          {
            headers: {
              Authorization: "Bearer " + serviceAAD.getToken(),
            },
          }
        );

        causasRiesgo = responseCausas.data;
      } catch (error) {
        console.error(error);
      }
    };

    const cargaRiesgo = async () => {
      await getCompanias();
      await getElementosNegPpal();
      await getListaProcesos();
      await getProductos();
      await getCanales();
      await getCategoriasRiesgos();
      await getRiesgo();
      await getDetalleRO();
      await getUbicacion_elementoPpal();
      await getUbicacion_procesoRiesgo();
      await getProductosRiesgo();
      await getCanalesRiesgo();

      try {
        //* Filtra maestros según la compañía del riesgo a Editar ////////

        const checkCompania = (compania) => {
          return compania.label === riesgo.compania;
        };

        const compRiesgoEditar = companias.filter(checkCompania);
        const valueCompania = compRiesgoEditar[0].value;
        let procesosFiltrados = [];
        let canalesFiltrados = [];
        let productosFiltrados = [];
        await listaProcesos.map((dato) => {
          if (dato.idcompania === valueCompania) {
            procesosFiltrados.push(dato);
          }
          return null;
        });
        await listaCanales.map((dato) => {
          if (dato.idcompania === valueCompania) {
            canalesFiltrados.push(dato);
          }
          return null;
        });
        await listaProductos.map((dato) => {
          if (dato.idcompania === valueCompania) {
            productosFiltrados.push(dato);
          }
          return null;
        });

        setListaCanalFiltered(canalesFiltrados);
        setListaProcesoFiltered(procesosFiltrados);
        setListaProductoFiltered(productosFiltrados);

        //* Filtra categorias de RO Local según territorio ///////////////

        const filtraXPais_ROLocal = (paisCompania, categoriaRiesgoLocal) => {
          let categoriasFiltradas = [];
          if (paisCompania === "Colombia") {
            categoriaRiesgoLocal.map((categoria) => {
              if (categoria.atributo === "Local - COL") {
                categoriasFiltradas.push(categoria);
              }
              return null;
            });
          } else if (paisCompania === "Panamá") {
            categoriaRiesgoLocal.map((categoria) => {
              if (categoria.atributo === "Local -PAN") {
                categoriasFiltradas.push(categoria);
              }
              return null;
            });
          } else if (paisCompania === "Guatemala") {
            categoriaRiesgoLocal.map((categoria) => {
              if (categoria.atributo === "Local - GTM") {
                categoriasFiltradas.push(categoria);
              }
              return null;
            });
          } else if (paisCompania === "General") {
            categoriaRiesgoLocal.map((categoria) => {
              categoriasFiltradas.push(categoria);
              return null;
            });
          }
          return categoriasFiltradas;
        };

        let categorias_ROFIltradas = filtraXPais_ROLocal(
          compRiesgoEditar[0].pais,
          catRiesgoRO_Local
        );

        //* Carga la lista de elementos correspondientes según la selección de Elemento de NEgocio PPal

        function controlaElementoPpal(tipoElemento) {
          if (tipoElemento === "Proceso") {
            setTipoComponente("Select");
            setTipoElementoSelect(procesosFiltrados);
          } else if (tipoElemento === "Proveedor") {
            setTipoComponente("Select");
            setTipoElementoSelect(null);
          } else if (tipoElemento === "Producto") {
            setTipoComponente("Select");
            setTipoElementoSelect(productosFiltrados);
          } else if (tipoElemento === "Canal") {
            setTipoComponente("Select");
            setTipoElementoSelect(canalesFiltrados);
          } else if (tipoElemento === "Proyecto") {
            setTipoComponente("Select");
            setTipoElementoSelect(null);
          } else if (tipoElemento === "Otras iniciativas") {
            setTipoComponente("Input");
          }
        }

        controlaElementoPpal(riesgo.tipo_elemento_evaluado);

        //* Asignar valores predeterminados del Riesgo a editar

        function convierteCompania(companiaRiesgo, listadoCompanias) {
          return listadoCompanias.map((compania) => {
            if (compania.label === companiaRiesgo) {
              return {
                value: compania.value,
                label: compania.label,
              };
            }
          });
        }

        function convierteTipoElemento(tipoRiesgo, TiposDeELementoPpal) {
          return TiposDeELementoPpal.filter(
            (elemento) => elemento.label === tipoRiesgo
          );
        }

        function convierteElementoPpal(tipoElemento) {
          if (
            tipoElemento === "E_ElementoPpal_Producto" ||
            tipoElemento === "R_ElementoPpal_Producto"
          ) {
            return {
              value: ubicacion_elementoPpal.idproducto,
              label: ubicacion_elementoPpal.nombre_prod,
            };
          } else if (
            tipoElemento === "E_ElementoPpal_Proceso" ||
            tipoElemento === "R_ElementoPpal_Proceso"
          ) {
            return {
              value: ubicacion_elementoPpal.idproceso,
              label: ubicacion_elementoPpal.nombre_proceso,
            };
          } else if (
            tipoElemento === "E_ElementoPpal_Canal" ||
            tipoElemento === "R_ElementoPpal_Canal"
          ) {
            return {
              value: ubicacion_elementoPpal.idcanal,
              label: ubicacion_elementoPpal.nombre_canal,
            };
          }
        }

        function convierteProceso(proceso) {
          if (proceso) {
            return {
              value: proceso.idproceso,
              label: proceso.nombre_proceso,
            };
          } else {
            return null;
          }
        }

        function convierteAristas(aristasDelRiesgo) {
          const listaDeAristas = new Array(listaAristas.length).fill(false);
          let aristas = aristasDelRiesgo.split(", ");
          if (aristas) {
            aristas.map((e) => {
              if (e === "RO") {
                listaDeAristas[0] = true;
                setIsCheckedRO(true);
              } else if (e === "SOX") {
                listaDeAristas[1] = true;
              } else if (e === "LAFT") {
                listaDeAristas[2] = true;
              } else if (e === "PDP") {
                listaDeAristas[3] = true;
              } else if (e === "SAC") {
                listaDeAristas[4] = true;
              } else if (e === "Corrupción interna") {
                listaDeAristas[5] = true;
              } else if (e === "Corrupción externa") {
                listaDeAristas[6] = true;
              } else if (e === "ESG") {
                listaDeAristas[7] = true;
              }
            });
            return listaDeAristas;
          }
        }

        function convierteCatROCorp(idCategoria, categoriasCorp) {
          return categoriasCorp.filter((e) => e.value === idCategoria);
        }

        function convierteCatROLocal(categoriasRO_Local) {
          return categoriasRO_Local.map((elemento) => {
            if (elemento.value === detalleRO.idcatro_local) {
              return {
                value: elemento.value,
                label: elemento.label,
              };
            }
          });
        }

        function calculoRC(riesgoContingencia) {
          if (riesgoContingencia === 1) {
            return {
              value: 1,
              label: "Si",
            };
          } else if (riesgoContingencia === 0) {
            return {
              value: 0,
              label: "No",
            };
          }
        }

        function convierteEstado(estadoRiesgo) {
          if (estadoRiesgo === 1) {
            return {
              value: true,
              label: "Activo",
            };
          } else if (estadoRiesgo === 0) {
            return {
              value: false,
              label: "Inactivo",
            };
          }
        }

        setEstadoRiesgo(convierteEstado(riesgo.estado));
        setCompania(convierteCompania(riesgo.compania, companias));
        setIdRiesgo(riesgo.idriesgo);
        setNombre_riesgo(riesgo.nombre_riesgo);
        setDescripcion(riesgo.descripcion_general);
        setTipoElemento(
          convierteTipoElemento(
            riesgo.tipo_elemento_evaluado,
            elementosNegPpal
          )[0]
        );
        setElementoEv(
          convierteElementoPpal(ubicacion_elementoPpal.tipo_objeto)
        );
        if (ubicacion_Proceso) {
          setProceso(convierteProceso(ubicacion_Proceso));
        }
        if (productosRiesgo) {
          setProducto(productosRiesgo);
        }
        if (canalesRiesgo) {
          setCanal(canalesRiesgo);
        }

        setAristas(riesgo.arista_del_riesgo);

        setCheckedState(convierteAristas(riesgo.arista_del_riesgo));
        setCat_RO_localFiltered(categorias_ROFIltradas);

        if (detalleRO) {
          setRiesgoRo(
            convierteCatROCorp(detalleRO.idcatro_corporativa, catRiesgo_Corp)[0]
          );
          setSubRiesgoRo(
            convierteCatROCorp(detalleRO.idsubcategoriaro, catRiesgo_Corp)[0]
          );
          setRiesgoLocal(convierteCatROLocal(categorias_ROFIltradas)[0]);
          setRiesgoCont(calculoRC(detalleRO.riesgo_contingencia));
          setDescComplementaria(detalleRO.descripcion_complementaria);
        }

        setLoadingData(false);
        return null;
      } catch (error) {
        console.error(error);
      }
    };

    cargaRiesgo();

    const cargaCausas = async () => {
      await getRiesgo();
      await getCausasRiesgo();
    };
    cargaCausas();
  }, []);

  //*Funciones para tablas /////////////////// */

  const [rows, setRows] = useState([defaultState]);

  const handleOnChange = (index, name, value) => {
    if (name === "causaN1") {
      const filtered = causasN2.filter(function (element) {
        return element.padre === value;
      });
      causasRowN2 = filtered;
    }
    if (name === "controles") {
      localStorage.setItem("indexControles", index);
    } else {
      const copyRows = [...rows];
      copyRows[index] = {
        ...copyRows[index],
        [name]: value,
      };
      setRows(copyRows);
    }
  };

  const handleOnAdd = () => {
    controles = controles.concat(defaultControles);
    setRows(rows.concat(defaultState));
  };

  const handleOnRemove = (index) => {
    const copyRows = [...rows];
    copyRows.splice(index, 1);
    setRows(copyRows);
    const copyControles = [...controles];
    copyControles.splice(index, 1);
    controles = copyControles;
  };

  //*Encabezados de tablas //

  const headCells_AsociaActivas = [
    {
      id: "ID_Causa_N2",
      num: "0",
      align: "left",
      disablePadding: false,
      label: "ID Causa N2",
    },
    {
      id: "causa_N1",
      num: "1",
      align: "center",
      col: 3,
      disablePadding: false,
      label: "Causa N1",
    },
    {
      id: "nombre_Causa",
      num: "2",
      align: "center",
      disablePadding: true,
      label: "Nombre Estandar Causa",
    },
    {
      id: "descripcion_causa",
      num: "3",
      align: "center",
      disablePadding: true,
      label: "Descripción específica causa",
    },
    {
      id: "participacion_causa",
      num: "3",
      align: "center",
      disablePadding: true,
      label: "Participación en el riesgo",
    },
    {
      id: "participacion_causa",
      num: "3",
      align: "center",
      disablePadding: true,
      label: "Participación en el riesgo",
    },
    {
      id: "estado_causa",
      num: "3",
      align: "center",
      disablePadding: true,
      label: "Estado",
    },
  ];

  function EnhancedTableHead(props) {
    const { classes } = props;
    return (
      <TableHead>
        <TableRow>
          <TableCell style={{ backgroundColor: "#2c2a29", color: "#ffffff" }} />
          {headCells_AsociaActivas.map((headCell) => (
            <TableCell
              key={headCell.id}
              align={headCell.align}
              padding={headCell.disablePadding ? "none" : "default"}
              style={{ backgroundColor: "#2c2a29", color: "#ffffff" }}
              colSpan={headCell.col ? headCell.col : 1}
            >
              <label className="label" style={{ marginRight: "20%" }}>
                {headCell.label}
              </label>
            </TableCell>
          ))}
        </TableRow>
      </TableHead>
    );
  }
  function Item(props) {
    const { sx, ...other } = props;
    return (
      <Box
        sx={{
          textAlign: "center",
          m: 2,
          ...sx,
        }}
        {...other}
      />
    );
  }

  Item.propTypes = {
    sx: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
  };
  EnhancedTableHead.propTypes = {
    classes: PropTypes.object.isRequired,
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
      return -1;
    }
    if (b[orderBy] > a[orderBy]) {
      return 1;
    }
    return 0;
  }

  function getComparator(order, orderBy) {
    return order === "desc"
      ? (a, b) => descendingComparator(a, b, orderBy)
      : (a, b) => -descendingComparator(a, b, orderBy);
  }

  //* Filtra segun la compañia seleccionada  y renderiza nuevamente la lista de Componentes Ppales///////////////////

  const FiltrarMaestros = (compania) => {
    if (compania !== null) {
      setCompania({ value: compania.value, label: compania.label });
      setTipoElemento(null);
      setCanal(null);
      setProceso(null);
      setProducto(null);
      setRiesgoRo(null);
      setSubRiesgoRo(null);
      setRiesgoLocal(null);
      setElementoEv(null);

      //* Filtra maestros según la compañía seleccionada ////////
      let procesosFiltrados = [];
      let canalesFiltrados = [];
      let productosFiltrados = [];
      listaProceso.map((dato) => {
        if (dato.idcompania === compania.value) {
          procesosFiltrados.push(dato);
        }
        return null;
      });
      listaCanal.map((dato) => {
        if (dato.idcompania === compania.value) {
          canalesFiltrados.push(dato);
        }
        return null;
      });
      listaProducto.map((dato) => {
        if (dato.idcompania === compania.value) {
          productosFiltrados.push(dato);
        }
        return null;
      });
      setListaCanalFiltered(canalesFiltrados);
      setListaProcesoFiltered(procesosFiltrados);
      setListaProductoFiltered(productosFiltrados);

      //* Filtra categorias de RO según territorio ///////////////

      let categoriasFiltradas = [];
      if (compania.pais === "Colombia") {
        catRiesgos_local.map((categoria) => {
          if (categoria.atributo === "Local - COL") {
            categoriasFiltradas.push(categoria);
          }
          return null;
        });
      } else if (compania.pais === "Panamá") {
        catRiesgos_local.map((categoria) => {
          if (categoria.atributo === "Local -PAN") {
            categoriasFiltradas.push(categoria);
          }
          return null;
        });
      } else if (compania.pais === "Guatemala") {
        catRiesgos_local.map((categoria) => {
          if (categoria.atributo === "Local - GTM") {
            categoriasFiltradas.push(categoria);
          }
          return null;
        });
      } else if (compania.pais === "General") {
        catRiesgos_local.map((categoria) => {
          categoriasFiltradas.push(categoria);
          return null;
        });
      }
      setCat_RO_localFiltered(categoriasFiltradas);
    }
  };

  //* Carga la lista de elementos correspondientes según la selección de Elemento de NEgocio PPal

  const setElementos = (event) => {
    setTipoElemento(event);
    if (event !== null) {
      if (event.label === "Proceso") {
        setTipoComponente("Select");
        setTipoElementoSelect(listaProceso_filtered);
        setElementoEv(null);
      } else if (event.label === "Proveedor") {
        setTipoComponente("Select");
        setTipoElementoSelect(listaProveedor_filtered);
        setElementoEv(null);
      } else if (event.label === "Producto") {
        setTipoComponente("Select");
        setTipoElementoSelect(listaProducto_filtered);
        setElementoEv(null);
      } else if (event.label === "Canal") {
        setTipoComponente("Select");
        setTipoElementoSelect(listaCanal_filtered);
        setElementoEv(null);
      } else if (event.label === "Proyecto") {
        setTipoComponente("Select");
        setTipoElementoSelect(listaProyecto_filtered);
        setElementoEv(null);
      } else if (event.label === "Otras iniciativas") {
        setTipoComponente("Input");
        setElementoEv(null);
      }
    }
  };

  //* Controla los checkboxes, recibe su valor y lo guarda en un string ///////////////////////

  const handleOnChangePosition = (position) => {
    const updatedCheckedState = checkedState.map((item, index) =>
      index === position ? !item : item
    );
    setCheckedState(updatedCheckedState);

    const arrayAristas = updatedCheckedState.reduce(
      (arista, currentState, index) => {
        if (currentState === true) {
          arista.push(listaAristas[index].value);
          return arista;
        }
        return arista;
      },
      []
    );

    setIsCheckedRO(
      arrayAristas.some(function (element) {
        return element == "RO";
      })
    );

    var stringAristas = arrayAristas.join(", ");
    setAristas(stringAristas);
  };

  //* Filtra segun la categoria Nivel 1 y las subcategorías de riesgo correspondientes*/

  const getSubCatRiesgo = (catNivel1) => {
    if (catNivel1) {
      let categoriasNivel3 = subCatRiesgo.filter(
        (e) => e.categoria_riesgos_n1 === catNivel1
      );
      setsubCatRiesgoFiltered(categoriasNivel3);
    }
  };

  const isSelected_propios = (name) => selected_propios.indexOf(name) !== -1;
  const isSelected_desencadenados = (name) =>
    selected_desencadenados.indexOf(name) !== -1;
  const isSelected_recibidos = (name) =>
    selected_recibidos.indexOf(name) !== -1;

  const handleClick = (event, name, efecto, tipo_efecto) => {
    if (tipo_efecto === "propio") {
      const selectedIndex = selected_propios.indexOf(name);
      let newSelected = [];
      setSelectedRiesgosEfecto_propios(efecto.id_riesgos_asociados);
      if (selectedIndex === -1) {
        setEditarAsociacion_propios(true);
        newSelected = newSelected.concat([], name);
      } else {
        setEditarAsociacion_propios(false);
      }
      setSelected_propios(newSelected);
    } else if (tipo_efecto === "desencadenado") {
      const selectedIndex = selected_desencadenados.indexOf(name);
      let newSelected = [];
      setSelectedRiesgosEfecto_desencadenados(efecto.id_riesgos_asociados);
      if (selectedIndex === -1) {
        setEditarAsociacion_desencadenados(true);
        newSelected = newSelected.concat([], name);
      } else {
        setEditarAsociacion_desencadenados(false);
      }
      setSelected_desencadenados(newSelected);
    } else if (tipo_efecto === "recibido") {
      const selectedIndex = selected_recibidos.indexOf(name);
      let newSelected = [];
      setSelectedRiesgosEfecto_recibidos(efecto.id_riesgos_asociados);
      if (selectedIndex === -1) {
        setEditarAsociacion_recibidos(true);
        newSelected = newSelected.concat([], name);
      } else {
        setEditarAsociacion_recibidos(false);
      }
      setSelected_recibidos(newSelected);
    }
  };

  const quitarAsociacion = () => {
    var search = efectosDesencadenados.filter((item) => {
      if (item.idefecto !== selected_desencadenados[0]) {
        return item;
      }
    });

    setEfectosDesencadenados(search);
  };

  const checkValidez = () => {
    if (nombre_riesgo !== null && nombre_riesgo !== "") {
      if (tipoElemento !== null) {
        if (elemento !== null) {
          if (isCheckedRO) {
            if (riesgoRO !== null) {
              /*  if (subRiesgoRO !== null) { */
              if (riesgoCont !== null) {
                return true;
              } else {
                return false;
              }
              /*  } else {
                return false;
              } */
            } else {
              return false;
            }
          } else if (aristas !== null) {
            return true;
          } else {
            return false;
          }
        } else {
          return false;
        }
      } else {
        return false;
      }
    } else {
      return false;
    }
  };
  //** Envía los datos al back */

  const sendControles = (controles, idRiesgoCausaRX) => {
    var causa_control = [];
    try {
      controles.map((control) => {
        causa_control.push({
          id_rx_riesgo_causa: idRiesgoCausaRX,
          idcontrol: control.idcontrol,
          /* TODO: Preguntar si se puede asociar un porcentaje con decimales */
          cobertura_ctrol_causa: parseFloat(
            document.getElementById("porcentajeControl" + control.idcontrol)
              .value
          ),
          estado_asociacion: 1,
        });
        return null;
      });
      axios
        .post(
          process.env.REACT_APP_API_URL + "/rx_riesgo_causa_control",
          JSON.stringify(causa_control),
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + serviceAAD.getToken(),
            },
          }
        )
        .then(function (riesgoCausaControl) {
          if (
            riesgoCausaControl.status >= 200 &&
            riesgoCausaControl.status < 300
          ) {
            setEstadoPost(2);
          } else if (riesgoCausaControl.status >= 500) {
            setEstadoPost(5);
            if (
              riesgoCausaControl.data.non_field_errors[0] ===
              "The fields idactivo must make a unique set."
            ) {
              setEstadoPost(6);
            }
          } else if (
            riesgoCausaControl.status >= 400 &&
            riesgoCausaControl.status < 500
          ) {
            setEstadoPost(4);
          }
        })
        .catch((errors) => {
          // react on errors.
          console.error(errors);
        });
    } catch (error) {
      console.error(error);
    }
  };

  const sendCausas = (idRiesgo) => {
    const buscarCausa = (data, idCausa) => {
      let temp;
      if (data) {
        data.map((causa) => {
          if (causa.value === idCausa) {
            temp = causa.label;
          }
          return null;
        });
        return temp;
      }
      return null;
    };
    var riesgo_causa;

    if (rows) {
      rows.map((data, index) => {
        if (data.causaN2 !== "" && data.causaN2) {
          riesgo_causa = {
            causa_n1: buscarCausa(causas, data.causaN1),
            nombre_estandar_causa: buscarCausa(causasN2, data.causaN2),
            descripcion_especifica: data.descripcion,
            participacion_riesgo: parseFloat(data.porcentaje),
            estado: data.estado,
            idriesgo: idRiesgo,
            idcausa: data.causaN2,
          };
          axios
            .post(
              process.env.REACT_APP_API_URL + "/rx_riesgo_causa",
              JSON.stringify(riesgo_causa),
              {
                headers: {
                  "Content-Type": "application/json",
                  Authorization: "Bearer " + serviceAAD.getToken(),
                },
              }
            )
            .then(function (responseRiesgtoCausa) {
              if (
                responseRiesgtoCausa.status >= 200 &&
                responseRiesgtoCausa.status < 300
              ) {
                sendControles(
                  controles[index],
                  responseRiesgtoCausa.id_rx_riesgo_causa
                );
                setEstadoPost(2);
              } else if (responseRiesgtoCausa.status >= 500) {
                setEstadoPost(5);
                if (
                  responseRiesgtoCausa.data.non_field_errors[0] ===
                  "The fields idactivo must make a unique set."
                ) {
                  setEstadoPost(6);
                }
              } else if (
                responseRiesgtoCausa.status >= 400 &&
                responseRiesgtoCausa.status < 500
              ) {
                setEstadoPost(4);
              }
            })
            .catch((errors) => {
              // react on errors.
              console.error(errors);
            });
        }

        return null;
      });
    }
  };

  const sendData = (event) => {
    event.preventDefault();
    if (checkValidez() === false) {
      setEstadoPost(7);
    } else if (checkValidez() === true) {
      let productos = [];
      let canales = [];
      let procesoData;

      if (producto !== null) {
        producto.map((e) => {
          productos.push(Object.values(e)[0]);
        });
      }
      if (canal !== null) {
        canal.map((e) => {
          canales.push(Object.values(e)[0]);
        });
      }
      if (proceso) {
        procesoData = Object.values(proceso)[0];
      } else {
        procesoData = null;
      }

      function convierteEstadoRiesgo(estadoRiesgo) {
        if (estadoRiesgo.value === true) {
          return 1;
        } else {
          return 0;
        }
      }

      var datosRiesgo = {
        idriesgo: idRiesgo,
        nombre_riesgo: nombre_riesgo,
        descripcion_general: descripcion,
        arista_del_riesgo: aristas,
        tipo_de_evento: 1,
        estado: convierteEstadoRiesgo(estadoRiesgo),
        tipo_elemento_evaluado: Object.values(tipoElemento)[1],
        elemento_ppal_evaluado: elemento ? Object.values(elemento)[0] : null,
        idproceso: proceso ? proceso.value : null,
        idcanal: canales,
        idproducto: productos,
      };

      JSON.stringify(datosRiesgo);

      //Guarda

      axios
        .put(process.env.REACT_APP_API_URL + "/riesgos/" + idRiesgo + "/", datosRiesgo, {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + serviceAAD.getToken(),
          },
        })
        .then(function (response) {
          if (
            response.status >= 200 &&
            response.status < 300 &&
            isCheckedRO === true
          ) {
            let detalleRiesgo = {
              id_riesgo: response.data.idriesgo,
              idcatro_corporativa: riesgoRO ? Object.values(riesgoRO)[0] : null,
              /* idsub_catro_corporativa: subRiesgoRO
                ? Object.values(riesgoRO)[0]
                : null, */
              idcatro_local: riesgoLocal ? Object.values(riesgoLocal)[0] : null,
              riesgo_contingencia: riesgoCont.value,
              descripcion_complementaria: descripComplementaria,
            };
            JSON.stringify(detalleRiesgo);
            axios
              .put(
                process.env.REACT_APP_API_URL + "/rx_detalle_ro/" + idRiesgo,
                detalleRiesgo,
                {
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + serviceAAD.getToken(),
                  },
                }
              )
              .then(function (responseDetalleRO) {
                sendEfectos(response.data.idriesgo);
                sendCausas(response.data.idriesgo);
                localStorage.setItem("idRiesgo", response.data.idriesgo);
                setEstadoPost(2);
                setTimeout(() => {
                  history.push("/editarRiesgo");
                }, 2000);
              })
              .catch((errors) => {
                // react on errors.
              });
          } else if (response.status >= 200 && response.status < 300) {
            sendEfectos(response.data.idriesgo);
            sendCausas(response.data.idriesgo);
            localStorage.setItem("idRiesgo", response.data.idriesgo);
            setEstadoPost(2);
            setTimeout(() => {
              history.push("/editarRiesgo");
            }, 2000);
          } else if (response.status >= 500) {
            setEstadoPost(5);
            if (
              response.data.non_field_errors[0] ===
              "The fields idactivo must make a unique set."
            ) {
              setEstadoPost(6);
            }
          } else if (response.status >= 400 && response.status < 500) {
            setEstadoPost(4);
          }
        })
        .catch((error) => {
          // react on errors.
          console.error(error);
        });

      setValidated(true);
    }
  };
  const postData = async (data, url, fuente) => {
    try {
      const resp = await axios.post(process.env.REACT_APP_API_URL + "/" + url, data, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      return resp;
    } catch (error) {
      console.error(error.response);
    }
  };

  const putData = async (data, url, fuente) => {
    try {
      axios
        .put(process.env.REACT_APP_API_URL + "/" + url, data, {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then(function (response_rx_efecto) {
          console.warn("Envío exitoso desde " + fuente);
        });
    } catch (error) {
      console.error(error.response);
    }
  };

  const sendEfectos = (idRiesgo) => {
    let lista_efectosPropios = [];
    let lista_efectosDesencadenados = [];
    let lista_efectosRecibidos = [];
    let resEfectosPropios = [];
    let resEfectosDesencadenados = [];
    let resEfectosRecibidos = [];

    if (efectosPropios) {
      efectosPropios.map((data) => {
        lista_efectosPropios.push({
          idriesgo: idRiesgo,
          idefecto: data.idefecto,
          tipo_relacion: "Propio",
          estado: 1,
        });

        return null;
      });

      lista_efectosPropios.forEach((element) => {
        (async () => {
          var respuesta = await postData(
            element,
            "rx_riesgo_efecto",
            "efectos propios"
          );

          if (respuesta) {
            resEfectosPropios.push({
              efecto: respuesta.data.idefecto,
              Estado: respuesta.status,
            });
          } else {
            resEfectosPropios.push({
              efecto: element.idefecto,
              Estado: "Error",
            });
          }
        })();
      });
    }

    if (efectosDesencadenados) {
      efectosDesencadenados.map((data) => {
        lista_efectosPropios.push({
          idriesgo: idRiesgo,
          idefecto: data.idefecto,
          desencadenado_en: "33 - Riesgo033, 34 Riesgo034",
          id_desencadenado_en: [33, 34],
          tipo_relacion: "Desencadenado",
          estado: 1,
        });

        return null;
      });

      lista_efectosDesencadenados.forEach((element) => {
        (async () => {
          var respuesta = await postData(
            element,
            "rx_riesgo_efecto",
            "efectos propios"
          );

          if (respuesta) {
            resEfectosDesencadenados.push({
              efecto: respuesta.data.idefecto,
              Estado: respuesta.status,
            });
          } else {
            resEfectosDesencadenados.push({
              efecto: element.idefecto,
              Estado: "Error",
            });
          }
        })();
      });
    }

    if (efectosRecibidos) {
      efectosRecibidos.map((data) => {
        lista_efectosDesencadenados.push({
          idriesgo: idRiesgo,
          idefecto: data.idefecto,
          desencadenado_en: data.riesgos_asociados,
          id_desencadenados: data.id_riesgos_asociados.join(),
          relacion: "recibido",
        });

        return null;
      });

      lista_efectosRecibidos.forEach((element) => {
        (async () => {
          var respuesta = await postData(
            element,
            "rx_riesgo_efecto",
            "efectos recibidos"
          );

          if (respuesta) {
            resEfectosRecibidos.push({
              efecto: respuesta.data.idefecto,
              Estado: respuesta.status,
            });
          } else {
            resEfectosRecibidos.push({
              efecto: element.idefecto,
              Estado: "Error",
            });
          }
        })();
      });
    }
  };

  const calculaEfectividad = () => {
    const getControl = (controles) => {
      var causa_control = [];
      controles.map((control) => {
        causa_control.push({
          idcontrol: control.idcontrol,
          /* TODO: Preguntar si se puede asociar un porcentaje con decimales */
          cobertura_ctrol_causa: parseFloat(
            document.getElementById("porcentajeControl" + control.idcontrol)
              .value
          ),
        });
        return null;
      });
      return causa_control;
    };
    try {
      let dataCausasControles = [];
      if (rows) {
        rows.map((data, index) => {
          if (
            data.causaN2 !== "" &&
            data.causaN2 &&
            data.porcentaje &&
            controles[index]
          ) {
            dataCausasControles.push({
              idcausa: data.causaN2,
              participacion_riesgo: parseFloat(data.porcentaje),
              estado: 1,
              controles: getControl(controles[index]),
            });
          }
          return null;
        });
      }

      axios
        .post(
          process.env.REACT_APP_API_URL + "/efectividad",
          JSON.stringify(dataCausasControles),
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + serviceAAD.getToken(),
            },
          }
        )
        .then(function (CausaControl) {
          if (CausaControl.status >= 200 && CausaControl.status < 300) {
            setEfectividadCtrl(CausaControl.data.efectividad_controles);
          } else if (CausaControl.status >= 500) {
            setEstadoPost(5);
            if (
              CausaControl.data.non_field_errors[0] ===
              "The fields idactivo must make a unique set."
            ) {
              setEstadoPost(6);
            }
          } else if (CausaControl.status >= 400 && CausaControl.status < 500) {
            setEstadoPost(4);
          }
        });
    } catch (error) {
      console.error(error);
    }
  };

  const calculaResumenValoracion = async (
    idRiesgo,
    consolidadosEfectos,
    compania,
    guardar
  ) => {
    let data = {
      datos: consolidadosEfectos,
      idriesgo: idRiesgo,
      estado: "Vigente",
      guardar: guardar,
      compania: compania,
    };

    const setIneherentes = async (valoracion) => {
      let aux = valoracion.p95_total;
      let aux_2 = valoracion.nivel_riesgo_inherente;
      setExposicionIn(aux);
      setNivelRiesgoInherente(aux_2);
    };

    await (async () => {
      let result = await postData(
        JSON.stringify(data),
        "resumen_valoracion/",
        "Resumen valoracion"
      );
      setResumenValoracion(result.data);
      setIneherentes(result.data);
      setLoadingData(false);
    })();
  };
  const getPar = async () => {
    try {
      const response = await axios.get(
        process.env.REACT_APP_API_URL + "/par/" + compania.value,
        {
          headers: {
            Authorization: "Bearer " + serviceAAD.getToken(),
          },
        }
      );
      let aux = await response.data;

      setPar(aux);
    } catch (error) {
      console.error(error);
    }
  };

  if (muestraResumen === true) {
    setLoadingData(true);
    const enlazaEfectos = async () => {
      let aux = [];

      if (efectosPropios) {
        efectosPropios.map((data) => {
          aux.push({
            idefecto: data.idefecto,
            media: data.media,
            nombreefecto: data.nombreefecto,
            tipoimpacto: data.tipoefecto,
            relacion: "propio",
            resultado_p50: data.resultado_p50,
            resultado_p95: data.resultado_p95,
            resultado_p99: data.resultado_p99,
          });

          return null;
        });
      }

      if (efectosDesencadenados) {
        efectosDesencadenados.map((data) => {
          aux.push({
            idefecto: data.idefecto,
            media: data.media,
            nombreefecto: data.nombreefecto,
            tipoimpacto: data.tipoefecto,
            relacion: "desencadenado",
            resultado_p50: data.resultado_p50,
            resultado_p95: data.resultado_p95,
            resultado_p99: data.resultado_p99,
          });

          return null;
        });
      }

      if (efectosRecibidos) {
        efectosRecibidos.map((data) => {
          aux.push({
            idefecto: data.idefecto,
            media: data.media,
            nombreefecto: data.nombreefecto,
            tipoimpacto: data.tipoefecto,
            relacion: "recibido",
            resultado_p50: data.resultado_p50,
            resultado_p95: data.resultado_p95,
            resultado_p99: data.resultado_p99,
          });

          return null;
        });
      }
      setMuestraResumen(false);
      await calculaResumenValoracion(0, aux, compania.value, 0);
    };
    enlazaEfectos();
  }

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
          <Row>
            <Col>
              <div
                style={{ position: "fixed", zIndex: 10, minWidth: "80vw" }}
                className={classes.content}
              >
                <div className={classes.appBarSpacer}>
                  <Navbar bg="dark" variant="dark" expand="xl">
                    <Container>
                      <Navbar id="basic-navbar-nav">
                        <Nav className="ml-auto">
                          <Nav.Link href="#infoGeneral">Info General</Nav.Link>
                          <Nav.Link href="#detalleRO">Detalle RO</Nav.Link>
                          <Nav.Link href="#causasControles">
                            Causas y controles
                          </Nav.Link>
                          <Nav.Link href="#efectividadControles">
                            Efectividad controles
                          </Nav.Link>
                          <Nav.Link href="#valoracionPerdidas">
                            Valoración
                          </Nav.Link>
                          <Nav.Link href="#resumenPorEfecto">Resumen</Nav.Link>
                        </Nav>
                      </Navbar>
                    </Container>
                  </Navbar>
                </div>
              </div>
            </Col>
          </Row>
          <Container className="mb-5 ">
            <Form
              id="formData"
              noValidate
              validated={validated}
              onSubmit={sendData}
              className="mb-5"
            >
              {/* ///////////////////// ventanas modales //////////////////// */}
              <Row className="mt-5 mb-3">
                <Col md={12}>
                  {" "}
                  <AlertDismissibleExample
                    alerta={estadoPost}
                    className="mb-3 mt-5"
                  />{" "}
                </Col>
              </Row>
              <ModalEfectosPropios
                dataEfectos={dataEfectos}
                efectosPropios={efectosPropios}
                setEfectosPropios={setEfectosPropios}
                modalEfectosPropiosShow={modalEfectosPropiosShow}
                setModalEfectosPropiosShow={setModalEfectosPropiosShow}
                setMuestraResumen={setMuestraResumen}
              />

              <ModalEfectosDesencadenados
                dataEfectos={dataEfectos}
                dataRiesgos={dataRiesgos}
                efectosDesencadenados={efectosDesencadenados}
                setEfectosDesencadenados={setEfectosDesencadenados}
                modalEfectosDesencadenadosShow={modalEfectosDesencadenadosShow}
                setModalEfectosDesencadenadosShow={
                  setModalEfectosDesencadenadosShow
                }
                setMuestraResumen={setMuestraResumen}
              />

              <ModalEfectosRecibidos
                dataEfectos={dataEfectos}
                dataRiesgos={dataRiesgos}
                rxRiesgosEfectos={rxRiesgosEfectos}
                efectosRecibidos={efectosRecibidos}
                setEfectosRecibidos={setEfectosRecibidos}
                modalEfectosRecibidosShow={modalEfectosRecibidosShow}
                setModalEfectosRecibidosShow={setModalEfectosRecibidosShow}
                setMuestraResumen={setMuestraResumen}
              />
              {/* 
          <ModalEditarEfectosPropios
            show={modalEditarEfectosPropiosShow}
            onHide={() => {
              setModalEditarEfectosPropiosShow(false);
            }}
          />

          <ModalEditarEfectosDesencadenados
            show={modalEditarEfectosDesencadenadosShow}
            onHide={() => {
              setModalEditarEfectosDesencadenadosShow(false);
            }}
          />

          <ModalEditarEfectosRecibidos
            show={modalEditarEfectosRecibidosShow}
            onHide={() => {
              setModalEditarEfectosPropiosShow(false);
            }}
          /> */}
              {/* ///////////////////////////// Acciones ////////////////////////////// */}

              <Row className="mb-3 mt-5">
                <Col md={12}>
                  <h1 className="titulo">Riesgo # {idRiesgo} </h1>
                </Col>
              </Row>
              <Row className="mb-3 mt-3">
                <Col md={12}>
                  <h1 className="subtitulo text-center">Información General</h1>
                </Col>
              </Row>
              <Row className="mb-3">
                <Col sm={4} xs={0}></Col>
                <Col>
                  <div className="form-text">* Campos obligatorios</div>
                </Col>
              </Row>
              <Row className="mb-3">
                <Col sm={4} xs={4}>
                  <label className="form-label label">Estado*</label>
                </Col>
                <Col sm={4} xs={12}>
                  {props.permisos.inactivar ? (
                    <>
                      <Switch
                        checked={estadoRiesgo ? estadoRiesgo.value : null}
                        disabled
                        onChange={(e) => {
                          let label =
                            e.target.checked === true ? "Activo" : "Inactivo";
                          setEstadoRiesgo({
                            value: e.target.checked,
                            label: label,
                          });
                        }}
                      ></Switch>
                      <label className="form-label text">
                        {estadoRiesgo ? estadoRiesgo.label : null}
                      </label>
                    </>
                  ) : null}
                </Col>
              </Row>
              {/* ID evaluación */}
              <Row className="mb-3">
                <Col sm={4} xs={12} className="label">
                  <label className="form-label">Compañía*</label>
                </Col>
                <Col sm={4} xs={12}>
                  <Select
                    isDisabled
                    components={animatedComponents}
                    options={companias}
                    value={compania}
                    //hideSelectedOptions={true}
                    placeholder={"Seleccione la compañia"}
                    onChange={FiltrarMaestros}
                  />
                </Col>
                <Col sm={2} xs={12} className="text-center">
                  <label className="label ">Id Riesgo</label>
                </Col>
                <Col sm={2} xs={12}>
                  <input
                    value={idRiesgo}
                    type="text"
                    disabled
                    className="form-control text-center texto"
                    id="IDevaluacion"
                  ></input>
                </Col>
              </Row>

              {/* Nombre Evaluación */}
              <Row className="mb-3">
                <Col sm={4} xs={12}>
                  <label className="form-label label">Nombre de Riesgo*</label>
                </Col>
                <Col sm={8} xs={12}>
                  <input
                    disabled
                    type="text"
                    className="form-control text-center texto"
                    placeholder="Nuevo"
                    required
                    value={nombre_riesgo}
                    id="NombreEval"
                    onChange={(e) => {
                      setNombre_riesgo(e.target.value);
                    }}
                  ></input>
                </Col>
              </Row>

              <Row className="mb-3">
                <Col sm={4} xs={12}>
                  <label className="form-label label">
                    Descripción del riesgo
                  </label>
                </Col>
                <Col sm={8} xs={12}>
                  <textarea
                    disabled
                    value={descripcion}
                    className="form-control text-center"
                    placeholder="Descripción del Riesgo"
                    rows="3"
                    id="Descripcion"
                    onChange={(e) => {
                      setDescripcion(e.target.value);
                    }}
                  ></textarea>
                </Col>
              </Row>
              {/* Elemento principal */}
              <Row className="mb-3">
                <Col sm={4} xs={12}>
                  <label className="form-label label">
                    Elemento de negocio principal​*
                  </label>
                </Col>
                <Col sm={4} xs={12}>
                  <Select
                    isDisabled={true}
                    value={tipoElemento}
                    options={elementoNegPal}
                    components={animatedComponents}
                    placeholder={"Seleccione Tipo de Elemento"}
                    onChange={setElementos}
                  />
                </Col>

                <Col sm={4} xs={12}>
                  {(() => {
                    if (tipoCompo === "Select") {
                      return (
                        <Select
                          isDisabled={true}
                          key={listaElementos}
                          options={listaElementos}
                          value={elemento}
                          components={animatedComponents}
                          placeholder={"Seleccione Elemento"}
                          onChange={(e) => {
                            setElementoEv(e);
                          }}
                        />
                      );
                    } else if (tipoCompo === "Input") {
                      return (
                        <input
                          disabled
                          type="text"
                          className="form-control text-left texto"
                          placeholder="Escriba la iniciativa"
                          onChange={(e) => {
                            setElementoEv(e.target.value);
                          }}
                        ></input>
                      );
                    }
                  })()}
                </Col>
              </Row>

              {/*/////////////////////Otros Elementos*/}

              <Row className="mb-3">
                <Col md={12}>
                  <hr />
                  <label className="form-label label">
                    Otros elementos de negocio relacionados
                  </label>
                </Col>
              </Row>
              <Row className="mb-3">
                <Col sm={4} xs={12}>
                  <label className="form-label label">Proceso</label>
                </Col>
                <Col sm={8} xs={12}>
                  <Select
                    isDisabled={true}
                    isClearable
                    components={animatedComponents}
                    options={listaProceso_filtered}
                    value={proceso}
                    placeholder={"Seleccione los procesos  asociados"}
                    onChange={(e) => {
                      setProceso(e);
                    }}
                  />
                </Col>
              </Row>
              <Row className="mb-3">
                <Col sm={4} xs={12}>
                  <label className="form-label label">Producto</label>
                </Col>
                <Col sm={8} xs={12}>
                  <Select
                    isDisabled={true}
                    components={animatedComponents}
                    isMulti
                    options={listaProducto_filtered}
                    value={producto}
                    placeholder={"Seleccione el producto"}
                    onChange={(e) => {
                      var productos = [];
                      e.map((a) => productos.push(a));
                      setProducto(productos);
                    }}
                  />
                </Col>
              </Row>
              <Row className="mb-3">
                <Col sm={4} xs={12}>
                  <label className="form-label label">Canal</label>
                </Col>
                <Col sm={8} xs={12}>
                  <Select
                    isDisabled={true}
                    id={"Canal"}
                    components={animatedComponents}
                    isMulti
                    value={canal}
                    options={listaCanal_filtered}
                    placeholder={"Seleccione el canal"}
                    onChange={(e) => {
                      var canales = [];
                      e.map((a) => canales.push(a));
                      setCanal(canales);
                    }}
                  />
                </Col>
              </Row>

              {/* ///////////////////////////////////////////  Usuarios //////////////////////////////////////// */}
              <Row className="mb-3">
                <Col sm={4} xs={12}>
                  <label className="form-label label">Validador</label>
                </Col>
                <Col sm={8} xs={12}>
                  <input
                    disabled
                    type="text"
                    className="form-control text-left texto"
                    placeholder="Validador automático "
                    required
                    id="validador"
                  ></input>
                </Col>
              </Row>
              <Row className="mb-3">
                <Col sm={4} xs={12}>
                  <label className="form-label label">
                    Aristas del riesgo​
                  </label>
                </Col>
              </Row>
              {/* /////////////////////////////////////// Checkbox list ///////////////////////////////////////// */}
              <Row className="mb-3 mt-3">
                {listaAristas.map(({ name, value }, index) => {
                  return (
                    <Col sm={2}>
                      <div>
                        <input
                          disabled
                          type="checkbox"
                          id={`custom-checkbox-${index}`}
                          value={value}
                          checked={checkedState[index]}
                          onChange={() => handleOnChangePosition(index)}
                        />
                        <label
                          className="form-label texto ml-2"
                          htmlFor={`custom-checkbox-${index}`}
                        >
                          {name}
                        </label>
                      </div>
                    </Col>
                  );
                })}
              </Row>
              {/* Riesgo operacional
        
        <RiesgoOperacional />*/}
              {(() => {
                if (isCheckedRO === true) {
                  return (
                    <Box>
                      <hr />
                      <Row className="mb-3 mt-4">
                        <Col md={12}>
                          <h1 className="subtitulo text-center">Detalle RO</h1>
                        </Col>
                      </Row>
                      <Row className="mb-3 mt-4">
                        <Col sm={4} xs={12}>
                          <label className="form-label label">
                            Categoria del Riesgo Corporativo*
                          </label>
                        </Col>
                        <Col sm={8} xs={12}>
                          <Select
                            components={animatedComponents}
                            options={catRiesgos}
                            required={true}
                            value={riesgoRO}
                            placeholder={"Categrorias"}
                            onChange={(e) => {
                              setRiesgoRo(e);
                              getSubCatRiesgo(e.value);
                            }}
                          />
                        </Col>
                      </Row>
                      <Row className="mb-3 mt-4">
                        <Col sm={4} xs={12}>
                          <label className="form-label label">
                            Subcategoria del Riesgo Corporativo*
                          </label>
                        </Col>
                        <Col sm={8} xs={12}>
                          <Select
                            components={animatedComponents}
                            options={subCatRiesgo_filtered}
                            required={true}
                            value={subRiesgoRO}
                            placeholder={"Subcategrorias"}
                            onChange={(e) => setSubRiesgoRo(e)}
                          />
                        </Col>
                      </Row>
                      <Row className="mb-3">
                        <Col sm={4} xs={12}>
                          <label className="form-label label">
                            Categoria del riesgo RO Local
                          </label>
                        </Col>
                        <Col sm={4} xs={12}>
                          <Select
                            components={animatedComponents}
                            options={catRiesgosRO_filtered}
                            required={true}
                            value={riesgoLocal}
                            placeholder={"Categrorias RO local"}
                            onChange={(e) => {
                              setRiesgoLocal(e);
                            }}
                          />
                        </Col>
                        <Col sm={2} xs={12}>
                          <label className="form-label label">
                            Riesgo de la contingencia*
                          </label>
                        </Col>
                        <Col sm={2} xs={12}>
                          <Select
                            isClearable
                            components={animatedComponents}
                            value={riesgoCont}
                            options={[
                              { value: 0, label: "No" },
                              { value: 1, label: "Si" },
                            ]}
                            required={true}
                            placeholder={""}
                            onChange={(e) => {
                              setRiesgoCont(e);
                            }}
                          />
                        </Col>
                      </Row>
                      <Row className="mb-4">
                        <Col sm={4} xs={12}>
                          <label className="form-label label">
                            Descripción complementaria del evento
                          </label>
                        </Col>
                        <Col sm={8} xs={12}>
                          <textarea
                            className="form-control text-center"
                            value={descripComplementaria}
                            placeholder="Descripción complementaria del evento"
                            rows="3"
                            id="Descripcion"
                            onChange={(e) => {
                              setDescComplementaria(e.target.value);
                            }}
                          ></textarea>
                        </Col>
                      </Row>
                    </Box>
                  );
                } else if (isCheckedRO === false) {
                  return null;
                }
              })()}
              <hr className="separador mb-5 mt-5" />
              <Row className="mb-3 ">
                <Col md={12}>
                  <h1 className="subtitulo text-center">Resumen del riesgo</h1>
                </Col>
              </Row>

              <ResumenCalculo
                resumenValoracion={resumenValoracion}
                exposicionIn={exposicionIn}
                efectividadCtrl={efectividadCtrl}
                exposicionResidual={exposicionResidual}
                nivelRiesgoInherente={nivelRiesgoInherente}
                nivelRiesgoResidual={nivelRiesgoResidual}
                setExposicionResidual={setExposicionResidual}
                setNivelRiesgoResidual={setNivelRiesgoResidual}
                par={par}
                isHiddenDecision={true}
              />

              {/* /////////////////////////////////////// Asociación de causas //////////////////////////////////////////////// */}

              <hr className="separador mb-5 mt-5" />

              <Row className="mb-3 mt-4">
                <Col md={12}>
                  <h1 className="subtitulo text-center">
                    Asociación de causas
                  </h1>
                </Col>
              </Row>
              <Row className="mb-0 text-center">
                <Col sm={1} xs={12}>
                  <label className="form-label texto">ID Causa*</label>
                </Col>
                <Col sm={2} xs={12}>
                  <label className="form-label texto">Causa N1</label>
                </Col>
                <Col sm={2} xs={12}>
                  <label className="form-label texto">
                    Nombre Estándar Causa
                  </label>
                </Col>
                <Col sm={2} xs={12}>
                  <label className="form-label texto">
                    Descripción especifica causa
                  </label>
                </Col>
                <Col sm={2} xs={12}>
                  <label className="form-label texto">
                    Participación en el riesgo
                  </label>
                </Col>
                <Col sm={1} xs={12}>
                  <label className="form-label texto">Estado</label>
                </Col>
                <Col sm={1} xs={12}></Col>
                <Col sm={1} xs={12}>
                  <Button className="botonPositivo2" onClick={handleOnAdd}>
                    <MdAddCircleOutline />
                  </Button>
                </Col>
              </Row>
              <Row className="mb-0">
                <Col sm={12} xs={12}>
                  <hr />
                </Col>
              </Row>

              <div className="App">
                {rows.map((row, index) => (
                  <RowCausa
                    {...row}
                    onChange={(name, value) =>
                      handleOnChange(index, name, value)
                    }
                    onRemove={() => handleOnRemove(index)}
                    key={index}
                  />
                ))}
              </div>
              {/*  
        <Row className="mb-3 text-center">
          <Col sm={11}></Col>
          <Col>
            <Button
              className="botonPositivo2"
              onClick={() => {
                handleOnAdd();
              }}
            >
              <MdAddCircleOutline />
            </Button>
          </Col>
        </Row> */}

              {/* /////////////////////////////////////// Grid causas Inactivas //////////////////////////////////////////////// */}
              <Row className="mb-3">
                <Col sm={12} xs={12}>
                  <label className="form-label label">Causas Inactivas</label>
                </Col>
              </Row>
              <p></p>
              {/* Tabla riesgos inactivos */}
              <Paper className={classes.root}>
                <TableContainer component={Paper} className={classes.container}>
                  <Table
                    className={"text"}
                    stickyHeader
                    aria-label="sticky table"
                  >
                    {/* Inicio de encabezado */}
                    <TableHead className="titulo">
                      <TableRow>
                        {/* <StyledTableCell padding="checkbox"></StyledTableCell> */}
                        <StyledTableCell align="left">
                          Id Causa*
                        </StyledTableCell>
                        <StyledTableCell align="left">Causa N1</StyledTableCell>
                        <StyledTableCell align="left">
                          Nombre Estándar Causa
                        </StyledTableCell>
                        <StyledTableCell align="left">
                          Descripción especifica causa
                        </StyledTableCell>
                        <StyledTableCell align="left">Estado</StyledTableCell>
                        <StyledTableCell align="left">
                          Justificación Inactividad​
                        </StyledTableCell>
                        <StyledTableCell align="left">
                          Fecha inactivación​
                        </StyledTableCell>
                      </TableRow>
                    </TableHead>
                    {/* Fin de encabezado */}
                    {/* Inicio de cuerpo de la tabla */}
                    <TableBody>
                      {dataCausaIn
                        .slice(
                          page * rowsPerPage,
                          page * rowsPerPage + rowsPerPage
                        )
                        .map((row, index) => {
                          return (
                            <StyledTableRow
                              key={row.idefecto}
                              hover
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
                  count={dataCausaIn.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                />
                {/* Fin de paginación */}
              </Paper>

              {/* /////////////////////////////////////// Efectividad de Controles //////////////////////////////////////////////// */}

              <Row className="mb-3 mt-4">
                <Col md={12}>
                  <h1 className="subtitulo text-center">
                    Efectividad de controles
                  </h1>
                </Col>
              </Row>
              <Row className="mb-3 mt-3">
                <Col sm={4} xs={12}>
                  <label className="form-label label">
                    Método de Efectividad de Controles​
                  </label>
                </Col>
                <Col sm={8} xs={12}>
                  <Select
                    components={animatedComponents}
                    options={[
                      {
                        value: 0,
                        label: "Método basado en cobertura a la causa",
                      },
                      /*   { value: 1, label: "Método basado en cadenas de transición" }, */
                    ]}
                    value={[
                      {
                        value: 0,
                        label: "Método basado en cobertura a la causa",
                      },
                    ]}
                    onChange={(e) => {
                      setProceso(e);
                    }}
                  />
                </Col>
              </Row>
              <Row className="mb-3">
                <Col sm={4} xs={12}>
                  <label className="form-label label">
                    Justificación de participación de causas ​
                  </label>
                </Col>
                <Col sm={8} xs={12}>
                  <input
                    type="text"
                    className="form-control text-center texto"
                    placeholder=""
                    required
                    id="NombreEval"
                    onChange={(e) => {}}
                  ></input>
                </Col>
              </Row>
              <Row className="mb-3 mt-4">
                <Col sm={4} xs={12}>
                  <label className="form-label label">
                    Efectividad de Controles​
                  </label>
                </Col>
                <Col sm={4} xs={12}>
                  <input
                    type="text"
                    className="form-control text-center texto"
                    value={efectividadCtrl}
                    readOnly
                  ></input>
                </Col>
              </Row>

              <hr className="separador mb-5 mt-5" />

              <Row className="mb-3 mt-4">
                <Col sm={12} xs={12}>
                  <h1 className="subtitulo text-center">
                    Valoración de impactos financieros (pérdidas)
                  </h1>
                </Col>
              </Row>

              <Row className="mb-3">
                <Col sm={4}>
                  <FormControlLabel
                    isDisabled
                    control={
                      <Checkbox
                        onChange={(event) => {
                          setCheckedStateImpacto(event.target.checked);
                        }}
                        name=""
                      />
                    }
                    label="Riesgo completamente mitigado"
                  />
                </Col>
              </Row>

              {(() => {
                if (checkedStateImpacto === false) {
                  return (
                    <>
                      <Box>
                        <Row className="mb-3">
                          <Col sm={12} xs={12}>
                            <hr />
                            <label className="form-label label">
                              Efectos propios
                            </label>
                          </Col>
                        </Row>
                        <p></p>

                        {/* Tabla riesgos inactivos */}
                        <Paper className={classes.root}>
                          <TableContainer
                            component={Paper}
                            className={classes.container}
                          >
                            <Table
                              className={"text"}
                              stickyHeader
                              aria-label="sticky table"
                            >
                              {/* Inicio de encabezado */}
                              <TableHead className="titulo">
                                <TableRow>
                                  <StyledTableCell padding="checkbox"></StyledTableCell>
                                  <StyledTableCell align="left">
                                    Id efecto*
                                  </StyledTableCell>
                                  <StyledTableCell align="left">
                                    Nombre
                                  </StyledTableCell>
                                  <StyledTableCell align="left">
                                    Descripción
                                  </StyledTableCell>
                                  <StyledTableCell align="left">
                                    Tipo Impacto
                                  </StyledTableCell>
                                  <StyledTableCell align="left">
                                    Materializado en
                                  </StyledTableCell>
                                  <StyledTableCell align="left">
                                    ¿Incluir en el VaR?
                                  </StyledTableCell>
                                  <StyledTableCell align="left">
                                    Método valoración
                                  </StyledTableCell>
                                  <StyledTableCell align="left">
                                    P50
                                  </StyledTableCell>
                                  <StyledTableCell align="left">
                                    P95
                                  </StyledTableCell>
                                  <StyledTableCell align="left">
                                    P99
                                  </StyledTableCell>
                                  <StyledTableCell align="left">
                                    Analista
                                  </StyledTableCell>
                                </TableRow>
                              </TableHead>
                              {/* Fin de encabezado */}
                              {/* Inicio de cuerpo de la tabla */}
                              <TableBody>
                                {efectosPropios
                                  .slice(
                                    page * rowsPerPage,
                                    page * rowsPerPage + rowsPerPage
                                  )
                                  .map((row, index) => {
                                    const isItemSelected = isSelected_propios(
                                      row.idefecto
                                    );
                                    return (
                                      <StyledTableRow
                                        key={row.idefecto}
                                        hover
                                        onClick={(event) =>
                                          handleClick(
                                            event,
                                            row.idefecto,
                                            row,
                                            "propio"
                                          )
                                        }
                                        role="checkbox"
                                        tabIndex={-1}
                                      >
                                        <StyledTableCell
                                          component="th"
                                          scope="row"
                                        >
                                          <Checkbox checked={isItemSelected} />
                                        </StyledTableCell>
                                        <StyledTableCell
                                          component="th"
                                          scope="row"
                                        >
                                          {row.idefecto ? row.idefecto : null}
                                        </StyledTableCell>
                                        <StyledTableCell align="left">
                                          {row.nombreefecto
                                            ? row.nombreefecto
                                            : null}
                                        </StyledTableCell>
                                        <StyledTableCell align="left">
                                          {row.descripcionefecto
                                            ? row.descripcionefecto
                                            : null}
                                        </StyledTableCell>
                                        <StyledTableCell align="left">
                                          {row.tipoefecto
                                            ? row.tipoefecto
                                            : null}
                                        </StyledTableCell>
                                        <StyledTableCell align="left">
                                          {row.var ? row.var : null}
                                        </StyledTableCell>
                                        <StyledTableCell align="left">
                                          {row.metodovaloracion
                                            ? row.metodovaloracion
                                            : null}
                                        </StyledTableCell>
                                        <StyledTableCell align="left">
                                          {row.resultado_p50
                                            ? row.resultado_p50
                                            : null}
                                        </StyledTableCell>
                                        <StyledTableCell align="left">
                                          {row.resultado_p95
                                            ? row.resultado_p95
                                            : null}
                                        </StyledTableCell>
                                        <StyledTableCell align="left">
                                          {row.resultado_p99
                                            ? row.resultado_p99
                                            : null}
                                        </StyledTableCell>
                                        <StyledTableCell align="left">
                                          {row.analista ? row.analista : null}
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
                            count={efectosPropios.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                          />
                          {/* Fin de paginación */}
                        </Paper>

                        <hr />
                        <Row className="mb-3">
                          <Col sm={12} xs={12}>
                            <label className="form-label label">
                              Efectos Desencadenados
                            </label>
                          </Col>
                        </Row>
                        <p></p>

                        {/* Tabla riesgos inactivos */}
                        <Paper className={classes.root}>
                          <TableContainer
                            component={Paper}
                            className={classes.container}
                          >
                            <Table
                              className={"text"}
                              stickyHeader
                              aria-label="sticky table"
                            >
                              {/* Inicio de encabezado */}
                              <TableHead className="titulo">
                                <TableRow>
                                  <StyledTableCell padding="checkbox"></StyledTableCell>
                                  <StyledTableCell align="left">
                                    Id efecto*
                                  </StyledTableCell>
                                  <StyledTableCell align="left">
                                    Nombre
                                  </StyledTableCell>
                                  <StyledTableCell align="left">
                                    Descripción
                                  </StyledTableCell>
                                  <StyledTableCell align="left">
                                    Tipo Impacto
                                  </StyledTableCell>
                                  <StyledTableCell align="left">
                                    Materializado en
                                  </StyledTableCell>
                                  <StyledTableCell align="left">
                                    Desencadenado en
                                  </StyledTableCell>
                                  <StyledTableCell align="left">
                                    ¿Incluir en el VaR?
                                  </StyledTableCell>
                                  <StyledTableCell align="left">
                                    Método valoración
                                  </StyledTableCell>
                                  <StyledTableCell align="left">
                                    P50
                                  </StyledTableCell>
                                  <StyledTableCell align="left">
                                    P95
                                  </StyledTableCell>
                                  <StyledTableCell align="left">
                                    P99
                                  </StyledTableCell>
                                  <StyledTableCell align="left">
                                    Analista
                                  </StyledTableCell>
                                </TableRow>
                              </TableHead>
                              {/* Fin de encabezado */}
                              {/* Inicio de cuerpo de la tabla */}
                              <TableBody>
                                {efectosDesencadenados
                                  .slice(
                                    page * rowsPerPage,
                                    page * rowsPerPage + rowsPerPage
                                  )
                                  .map((row, index) => {
                                    const isItemSelected =
                                      isSelected_desencadenados(row.idefecto);
                                    return (
                                      <StyledTableRow
                                        key={row.idefecto}
                                        hover
                                        onClick={(event) =>
                                          handleClick(
                                            event,
                                            row.idefecto,
                                            row,
                                            "desencadenado"
                                          )
                                        }
                                        role="checkbox"
                                        tabIndex={-1}
                                      >
                                        <StyledTableCell
                                          component="th"
                                          scope="row"
                                        >
                                          <Checkbox checked={isItemSelected} />
                                        </StyledTableCell>
                                        <StyledTableCell
                                          component="th"
                                          scope="row"
                                        >
                                          {row.idefecto ? row.idefecto : null}
                                        </StyledTableCell>
                                        <StyledTableCell align="left">
                                          {row.nombreefecto
                                            ? row.nombreefecto
                                            : null}
                                        </StyledTableCell>
                                        <StyledTableCell align="left">
                                          {row.descripcionefecto
                                            ? row.descripcionefecto
                                            : null}
                                        </StyledTableCell>
                                        <StyledTableCell align="left">
                                          {row.tipoefecto
                                            ? row.tipoefecto
                                            : null}
                                        </StyledTableCell>
                                        <StyledTableCell align="left">
                                          {row.otroriesgo
                                            ? row.otroriesgo
                                            : null}
                                        </StyledTableCell>
                                        <StyledTableCell align="left">
                                          {row.riesgos_asociados
                                            ? row.riesgos_asociados
                                            : null}
                                        </StyledTableCell>
                                        <StyledTableCell align="left">
                                          {row.var ? row.var : null}
                                        </StyledTableCell>
                                        <StyledTableCell align="left">
                                          {row.metodovaloracion
                                            ? row.metodovaloracion
                                            : null}
                                        </StyledTableCell>
                                        <StyledTableCell align="left">
                                          {row.resultado_p50
                                            ? row.resultado_p50
                                            : null}
                                        </StyledTableCell>
                                        <StyledTableCell align="left">
                                          {row.resultado_p95
                                            ? row.resultado_p95
                                            : null}
                                        </StyledTableCell>
                                        <StyledTableCell align="left">
                                          {row.resultado_p99
                                            ? row.resultado_p99
                                            : null}
                                        </StyledTableCell>
                                        <StyledTableCell align="left">
                                          {row.analista ? row.analista : null}
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
                            count={efectosDesencadenados.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                          />
                          {/* Fin de paginación */}
                        </Paper>

                        <hr />
                        <Row className="mb-3">
                          <Col sm={12} xs={12}>
                            <label className="form-label label">
                              Efectos Recibidos
                            </label>
                          </Col>
                        </Row>
                        <p></p>

                        {/* Tabla riesgos inactivos */}
                        <Paper className={classes.root}>
                          <TableContainer
                            component={Paper}
                            className={classes.container}
                          >
                            <Table
                              className={"text"}
                              stickyHeader
                              aria-label="sticky table"
                            >
                              {/* Inicio de encabezado */}
                              <TableHead className="titulo">
                                <TableRow>
                                  <StyledTableCell padding="checkbox"></StyledTableCell>
                                  <StyledTableCell align="left">
                                    Id efecto*
                                  </StyledTableCell>
                                  <StyledTableCell align="left">
                                    Nombre
                                  </StyledTableCell>
                                  <StyledTableCell align="left">
                                    Descripción
                                  </StyledTableCell>
                                  <StyledTableCell align="left">
                                    Tipo Impacto
                                  </StyledTableCell>
                                  <StyledTableCell align="left">
                                    Materializado en
                                  </StyledTableCell>
                                  <StyledTableCell align="left">
                                    Recibido de
                                  </StyledTableCell>
                                  <StyledTableCell align="left">
                                    Método valoración
                                  </StyledTableCell>
                                  <StyledTableCell align="left">
                                    P50
                                  </StyledTableCell>
                                  <StyledTableCell align="left">
                                    P95
                                  </StyledTableCell>
                                  <StyledTableCell align="left">
                                    P99
                                  </StyledTableCell>
                                  <StyledTableCell align="left">
                                    Analista
                                  </StyledTableCell>
                                </TableRow>
                              </TableHead>
                              {/* Fin de encabezado */}
                              {/* Inicio de cuerpo de la tabla */}
                              <TableBody>
                                {efectosRecibidos
                                  .slice(
                                    page * rowsPerPage,
                                    page * rowsPerPage + rowsPerPage
                                  )
                                  .map((row, index) => {
                                    const isItemSelected = isSelected_recibidos(
                                      row.idefecto
                                    );
                                    return (
                                      <StyledTableRow
                                        key={row.idefecto}
                                        hover
                                        onClick={(event) =>
                                          handleClick(
                                            event,
                                            row.idefecto,
                                            row,
                                            "recibido"
                                          )
                                        }
                                        role="checkbox"
                                        tabIndex={-1}
                                      >
                                        <StyledTableCell
                                          component="th"
                                          scope="row"
                                        >
                                          <Checkbox checked={isItemSelected} />
                                        </StyledTableCell>
                                        <StyledTableCell
                                          component="th"
                                          scope="row"
                                        >
                                          {row.idefecto ? row.idefecto : null}
                                        </StyledTableCell>
                                        <StyledTableCell align="left">
                                          {row.nombreefecto
                                            ? row.nombreefecto
                                            : null}
                                        </StyledTableCell>
                                        <StyledTableCell align="left">
                                          {row.descripcionefecto
                                            ? row.descripcionefecto
                                            : null}
                                        </StyledTableCell>
                                        <StyledTableCell align="left">
                                          {row.tipoefecto
                                            ? row.tipoefecto
                                            : null}
                                        </StyledTableCell>
                                        <StyledTableCell align="left">
                                          {row.otroriesgo
                                            ? row.otroriesgo
                                            : null}
                                        </StyledTableCell>
                                        <StyledTableCell align="left">
                                          {row.recibido_de !== null
                                            ? row.recibido_de
                                            : null}
                                        </StyledTableCell>
                                        <StyledTableCell align="left">
                                          {row.metodovaloracion
                                            ? row.metodovaloracion
                                            : null}
                                        </StyledTableCell>

                                        <StyledTableCell align="left">
                                          {row.resultado_p50
                                            ? row.resultado_p50
                                            : null}
                                        </StyledTableCell>
                                        <StyledTableCell align="left">
                                          {row.resultado_p95
                                            ? row.resultado_p95
                                            : null}
                                        </StyledTableCell>
                                        <StyledTableCell align="left">
                                          {row.resultado_p99
                                            ? row.resultado_p99
                                            : null}
                                        </StyledTableCell>
                                        <StyledTableCell align="left">
                                          {row.analista ? row.analista : null}
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
                            count={efectosRecibidos.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                          />
                          {/* Fin de paginación */}
                        </Paper>

                        <Row className="mb-3">
                          <Col sm={12} xs={12}>
                            <hr />
                            <label className="form-label label">
                              Efectos Inactivos
                            </label>
                          </Col>
                        </Row>
                        <p></p>

                        {/* Tabla riesgos inactivos */}
                        <Paper className={classes.root}>
                          <TableContainer
                            component={Paper}
                            className={classes.container}
                          >
                            <Table
                              className={"text"}
                              stickyHeader
                              aria-label="sticky table"
                            >
                              {/* Inicio de encabezado */}
                              <TableHead className="titulo">
                                <TableRow>
                                  <StyledTableCell padding="checkbox"></StyledTableCell>
                                  <StyledTableCell align="left">
                                    Id efecto*
                                  </StyledTableCell>
                                  <StyledTableCell align="left">
                                    Nombre
                                  </StyledTableCell>
                                  <StyledTableCell align="left">
                                    Descripción
                                  </StyledTableCell>
                                  <StyledTableCell align="left">
                                    Tipo Impacto
                                  </StyledTableCell>
                                  <StyledTableCell align="left">
                                    Materializado en
                                  </StyledTableCell>
                                  <StyledTableCell align="left">
                                    ¿Incluir en el VaR?
                                  </StyledTableCell>
                                  <StyledTableCell align="left">
                                    Método valoración
                                  </StyledTableCell>
                                  <StyledTableCell align="left">
                                    P50
                                  </StyledTableCell>
                                  <StyledTableCell align="left">
                                    P95
                                  </StyledTableCell>
                                  <StyledTableCell align="left">
                                    P99
                                  </StyledTableCell>
                                  <StyledTableCell align="left">
                                    Analista
                                  </StyledTableCell>
                                </TableRow>
                              </TableHead>
                              {/* Fin de encabezado */}
                              {/* Inicio de cuerpo de la tabla */}
                              <TableBody>
                                {efectosInactivos
                                  .slice(
                                    page * rowsPerPage,
                                    page * rowsPerPage + rowsPerPage
                                  )
                                  .map((row, index) => {
                                    const isItemSelected = null;
                                    return (
                                      <StyledTableRow
                                        key={row.idefecto}
                                        hover
                                        onClick={(event) =>
                                          handleClick(
                                            event,
                                            row.idefecto,
                                            row,
                                            "inactivo"
                                          )
                                        }
                                        role="checkbox"
                                        tabIndex={-1}
                                      >
                                        <StyledTableCell
                                          component="th"
                                          scope="row"
                                        >
                                          <Checkbox checked={isItemSelected} />
                                        </StyledTableCell>
                                        <StyledTableCell
                                          component="th"
                                          scope="row"
                                        >
                                          {row.idefecto ? row.idefecto : null}
                                        </StyledTableCell>
                                        <StyledTableCell align="left">
                                          {row.nombreefecto
                                            ? row.nombreefecto
                                            : null}
                                        </StyledTableCell>
                                        <StyledTableCell align="left">
                                          {row.descripcionefecto
                                            ? row.descripcionefecto
                                            : null}
                                        </StyledTableCell>
                                        <StyledTableCell align="left">
                                          {row.tipoefecto
                                            ? row.tipoefecto
                                            : null}
                                        </StyledTableCell>
                                        <StyledTableCell align="left">
                                          {row.var ? row.var : null}
                                        </StyledTableCell>
                                        <StyledTableCell align="left">
                                          {row.metodovaloracion
                                            ? row.metodovaloracion
                                            : null}
                                        </StyledTableCell>
                                        <StyledTableCell align="left">
                                          {row.resultado_p50
                                            ? row.resultado_p50
                                            : null}
                                        </StyledTableCell>
                                        <StyledTableCell align="left">
                                          {row.resultado_p95
                                            ? row.resultado_p95
                                            : null}
                                        </StyledTableCell>
                                        <StyledTableCell align="left">
                                          {row.resultado_p99
                                            ? row.resultado_p99
                                            : null}
                                        </StyledTableCell>
                                        <StyledTableCell align="left">
                                          {row.analista ? row.analista : null}
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
                            count={efectosInactivos.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                          />
                          {/* Fin de paginación */}
                        </Paper>
                        <hr className="separador mb-5 mt-5" />
                        <ResumenDeEfectos
                          resumenValoracion={resumenValoracion}
                          loadingData={loadingData}
                        />
                      </Box>
                    </>
                  );
                } else if (checkedStateImpacto === true) {
                  return null;
                }
              })()}
            </Form>
          </Container>
        </>
      )}
    </>
  );
}
