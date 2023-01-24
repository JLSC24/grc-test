import React, { useState, useEffect, Children } from "react";
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
import TableCustom from "../Components/TableCustom";
import ModalSelectTableCustom from "../Components/ModalSelectTableCustom";
import Queries from "../Components/QueriesAxios";

const _ = require("lodash");

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
let controlesInicial = {};
let dic_causa_controles = {};

let causasRow = [];
let causasRowN2 = [];
let controlesDesaociados = [];
let dataControles = [];

function RowCausa({
  onChange,
  onRemove,
  id,
  descripcion,
  porcentaje,
  causaN1,
  causaN2,
  causaN1data,
  causaN2data,
  estado,
  controlesData,
}) {
  const [mostrarControles, setMostrarControles] = React.useState(false);
  const serviceAAD = new AADService();
  const [stateCausa, setStateCausa] = useState("Activa");
  const [state, setIdState] = useState("Activa");
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  //const [dataControles, setDataControles] = React.useState([]);

  const [dataControlesActivos, setDataControlesActivos] = React.useState(
    controlesData ? controlesData : []
  );

  const [selected, setSelected] = React.useState([]);
  const [modalShow, setModalShow] = React.useState(false);
  const [selectedCausaN1, setSelectedCausaN1] = React.useState(false);
  const classes = useStyles();

  useEffect(() => {}, []);

  const desasociar = (idCausaN2) => {
    let temp = dataControlesActivos;
    let temp2 = [];
    let tempcont1 = [];
    selected.map((dataSelected) => {
      temp.map((tempControl) => {
        if (tempControl.idcontrol === dataSelected) {
          temp2.push(tempControl);
        }
      });
      temp = temp.filter(function (element) {
        return element.idcontrol !== dataSelected;
      });
    });
    controlesDesaociados = controlesDesaociados.concat(temp2);
    const indexControles = parseInt(localStorage.getItem("indexControles"));
    if (controles[indexControles]) {
      controles[indexControles] = temp;
    }
    dic_causa_controles[idCausaN2] = temp;
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
    const handleClickControles = (event, name) => {
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

    const retornarSelected = (dataSelected, idCausaN2) => {
      let temp = dataControlesActivos;

      if (dataControles) {
        dataControles.map((dat) => {
          dataSelected.map((dataS) => {
            if (dat.idcontrol === dataS) {
              temp.push(dat);
            }
          });
        });
      }

      dic_causa_controles[idCausaN2] = temp;

      const indexControles = parseInt(localStorage.getItem("indexControles"));
      if (controles[indexControles]) {
        controles[indexControles] = temp;
      }

      setDataControlesActivos(temp);
    };

    async function buscar(e) {
      e.persist();
      //await setBuscando(e.target.value);
      var search = dataControles.filter((item) => {
        if (
          item.nombre.toLowerCase().includes(e.target.value.toLowerCase()) ||
          /* item.descripcion
            .toLowerCase()
            .includes(e.target.value.toLowerCase()) || */
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
            Agregar Controles
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
                    <StyledTableCell align="left">Proceso</StyledTableCell>
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
                          onClick={(event) =>
                            handleClickControles(event, row.idcontrol)
                          }
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
                            {row.proceso !== null ? row.proceso : null}
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
                  retornarSelected(selected, causaN2);
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
        <Col sm={2} xs={12}>
          <Select
            onChange={(e) => {
              onChange("causaN1", e.value);
            }}
            components={animatedComponents}
            options={causasRow}
            placeholder={"Seleccione"}
            defaultValue={causaN1data}
            menuPortalTarget={document.body}
            styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
          />
        </Col>
        <Col sm={2} xs={12}>
          <Select
            onChange={(e) => onChange("causaN2", e.value)}
            components={animatedComponents}
            options={causasRowN2}
            placeholder={"Seleccione"}
            defaultValue={causaN2data}
            menuPortalTarget={document.body}
            styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
          />
        </Col>
        <Col sm={2} xs={12}>
          <textarea
            defaultValue={descripcion}
            onChange={(e) => onChange("descripcion", e.target.value)}
            className="form-control text-center texto"
            placeholder="Descripción de causa"
            required
            rows="1"
            id="Descripcion"
          ></textarea>
        </Col>
        <Col sm={2} xs={12}>
          <input
            defaultValue={porcentaje}
            onChange={(e) => onChange("porcentaje", e.target.value)}
            type="number"
            className="form-control text-left texto"
            placeholder="Porcentaje"
            required
            id="analista"
          ></input>
        </Col>
        <Col sm={1} xs={12}>
          <FormControlLabel
            id="switch"
            className="texto"
            control={<Switch checked={estado} />}
            //label={stateCausa}
            onChange={(e) => {
              handleChangeState(e);
              onChange("estado", !estado);
              //todo Esta función no genera nigún cambio?
            }}
            name="Estado"
          />
        </Col>
        <Col sm={2} xs={12}>
          <Button
            onClick={() => {
              if (causaN2) {
                setMostrarControles(!mostrarControles);
              } else {
                window.alert('No ha seleccionado aún "Nombre Estándar Causa"');
              }
            }}
            variant={mostrarControles ? "secondary" : "outline-secondary"}
          >
            {" "}
            Controles <AiFillCaretDown />
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
            <Button
              className="botonNegativo2"
              onClick={() => {
                desasociar(causaN2);
              }}
            >
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
                    <StyledTableCell width="6%" align="left">
                      Id Control
                    </StyledTableCell>
                    <StyledTableCell width="20%" align="left">
                      Nombre Control
                    </StyledTableCell>
                    {/* <StyledTableCell width="25%" align="left">
                      Descripción Control
                    </StyledTableCell> */}
                    <StyledTableCell width="25%" align="left">
                      Cobertura (0-100)
                    </StyledTableCell>
                    <StyledTableCell width="6%" align="left">
                      Cubrimiento
                    </StyledTableCell>
                    <StyledTableCell width="6%" align="left">
                      Prevaloración
                    </StyledTableCell>
                    <StyledTableCell width="6%" align="left">
                      Automatización
                    </StyledTableCell>
                    <StyledTableCell width="6%" align="left">
                      Naturaleza
                    </StyledTableCell>
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
                            {row.idcontrol ? row.idcontrol : null}
                          </StyledTableCell>
                          <StyledTableCell align="left">
                            {row.nombre !== null ? row.nombre : null}
                          </StyledTableCell>
                          {/* <StyledTableCell align="left">
                            {row.descripcion !== null ? row.descripcion : null}
                          </StyledTableCell> */}
                          <StyledTableCell align="left">
                            <input
                              required
                              defaultValue={
                                row.cobertura_ctrol_causa
                                  ? row.cobertura_ctrol_causa
                                  : null
                              }
                              id={
                                "porcentajeControl" +
                                row.idcontrol +
                                "_" +
                                causaN2
                              }
                              type="number"
                              className="form-control text-center texto"
                              placeholder="Porcentaje de cubrimiento"
                            ></input>
                          </StyledTableCell>
                          <StyledTableCell align="left">
                            {row.cubrimiento !== null ? row.cubrimiento : null}
                          </StyledTableCell>
                          <StyledTableCell align="left">
                            {row.cubrimiento !== null
                              ? row.prevaloracion
                              : null}
                          </StyledTableCell>
                          <StyledTableCell align="left">
                            {row.cubrimiento !== null
                              ? row.automatizacion
                              : null}
                          </StyledTableCell>
                          <StyledTableCell align="left">
                            {row.cubrimiento !== null ? row.naturaleza : null}
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

export default function EditarRiesgo(props) {
  const serviceAAD = new AADService();
  const [actualizar, setActualizar] = useState(false);

  /* Datos para el grid */
  const [causas, setCausas] = useState(null);
  const [causasN2, setCausasN2] = useState(null);
  const [enableButton, setEnableButton] = React.useState(true);

  const [estados, setEstados] = useState([]);

  //* Reciben los datos ingresados/elegidos por el usuario
  const [rows, setRows] = useState([defaultState]);
  const [rowsAll, setRowsAll] = useState();

  const [idRiesgo, setIdRiesgo] = useState(null);
  const [idcompania, setIdCompania] = useState(null);
  const [compania, setCompania] = useState(null);
  const [metEfectividadCtrl, setMetEfectividadCtrl] = useState(null);
  const [efectividadCtrl, setEfectividadCtrl] = useState(null);

  const [justificacionCausas, setJustificacionCausas] = useState(null);

  const [loadingDataCausas, setLoadingDataCausas] = React.useState(true);

  const history = useHistory();

  const [validated, setValidated] = useState(false);
  const [estadoPost, setEstadoPost] = useState({
    alerta: { id: 0, data: null },
  });
  const [showAlerta, setShowAlerta] = useState(false);
  const [textAlerta, setTextAlerta] = useState(null);

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
      name: "Ambiental",
      value: "Ambiental",
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

  //* Variables involucradas en el modal de confimación de desasociar efectos
  const [openModal, setOpenModal] = React.useState(false);
  const [tipoDeEfecto, setTipoDeEfecto] = React.useState(null);

  const [showModControlesSox, setShowModControlesSox] = React.useState(null);
  const [controlesSOX, setControlesSOX] = React.useState([]);
  const [dataControlesSox, setDataControlesSox] = React.useState(null);

  useEffect(() => {
    let riesgo;

    let causasRiesgo;

    const listadoEstados = [
      { value: 1, label: "Activo" },
      { value: 0, label: "Inactivo" },
    ];

    setEstados(listadoEstados);

    async function getControles() {
      try {
        setLoadingDataCausas(true);
        const result = await fetch(process.env.REACT_APP_API_URL + "/controles/", {
          method: "GET",
          headers: {
            Accept: "application/json",
            Authorization: "Bearer " + serviceAAD.getToken(),
          },
        });
        let controles = await result.json();
        dataControles = controles;
        setLoadingDataCausas(false);
      } catch (error) {
        console.error(error);
      }
    }
    if (!actualizar) {
      getControles();
    }
    async function getCausas() {
      setLoadingDataCausas(true);

      try {
        const result = await fetch(process.env.REACT_APP_API_URL + "/maestros_ro/causa/", {
          method: "GET",
          headers: {
            Accept: "application/json",
            Authorization: "Bearer " + serviceAAD.getToken(),
          },
        });
        let causasN1 = await result.json();
        const filteredN1 = causasN1.filter(function (element) {
          return element.nivel !== 2;
        });
        let filteredN1_temp = filteredN1.filter((obj) => obj.estado === true);
        causasN1 = filteredN1_temp.map(({ idcausa: value, nombre: label }) => ({
          value,
          label,
        }));

        setCausas(causasN1);
        causasRow = causasN1;

        const result2 = await fetch(
          process.env.REACT_APP_API_URL + "/ultimonivel/Causa/",
          {
            method: "GET",
            headers: {
              Accept: "application/json",
              Authorization: "Bearer " + serviceAAD.getToken(),
            },
          }
        );
        let causasN2 = await result2.json();
        causasN2 = causasN2.filter((obj) => obj.estado === true);
        causasN2 = causasN2.map(
          ({ id: value, nombre: label, padre: padre }) => ({
            value,
            label,
            padre,
          })
        );

        causasRowN2 = causasN2;
        setCausasN2(causasN2);
        setLoadingDataCausas(false);
      } catch (error) {
        console.error(error);
      }
    }

    getCausas();

    const getRiesgo = async () => {
      setLoadingDataCausas(true);
      try {
        const response_riesgo = await axios.get(
          process.env.REACT_APP_API_URL + "/GuardarEfectividad/" +
            localStorage.getItem("idRiesgo") +
            "/",
          {
            headers: {
              Authorization: "Bearer " + serviceAAD.getToken(),
            },
          }
        );
        riesgo = await response_riesgo.data;
        setIdRiesgo(riesgo.idriesgo);
        setCompania(riesgo.compania);
        setIdCompania(riesgo.idcompania);
        setLoadingDataCausas(false);
      } catch (error) {
        console.error(error);
      }
    };

    let tempControlesCausa = [];

    const getControlesCausas = async (causa) => {
      setLoadingDataCausas(true);
      try {
        const responseCausas = await axios.get(
          process.env.REACT_APP_API_URL + "/rx_riesgo_causa_control/" +
            localStorage.getItem("idRiesgo") +
            "/" +
            causa.idcausa +
            "/",
          {
            headers: {
              Authorization: "Bearer " + serviceAAD.getToken(),
            },
          }
        );
        tempControlesCausa = null;
        tempControlesCausa = responseCausas.data;
        let tempObjControles = {};
        tempObjControles[causa.idcausa] = tempControlesCausa;
        controles.push(tempControlesCausa);
        controlesInicial[causa.idcausa] = tempControlesCausa;
        dic_causa_controles[causa.idcausa] = tempControlesCausa;
        setLoadingDataCausas(false);
      } catch (error) {
        console.error(error);
        controles.push([]);
      }
    };
    const getCausasRiesgo = async () => {
      setLoadingDataCausas(true);
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
        let tempCausasActivas = rows;

        if (causasRiesgo) {
          causasRiesgo.map(async (causa) => {
            tempControlesCausa = null;
            await getControlesCausas(causa);

            tempCausasActivas.push({
              causaN1: buscarCausaNombre(causasRow, causa.causa_n1).value,
              causaN1data: buscarCausaNombre(causasRow, causa.causa_n1),
              causaN2: causa.idcausa,
              causaN2data: buscarCausaNombre(
                causasRowN2,
                causa.nombre_estandar_causa
              ),
              descripcion: causa.descripcion_especifica,
              estado: causa.estado === 1 ? true : false,
              id: causa.idcausa,
              porcentaje: parseFloat(causa.participacion_riesgo),
              controlesData:
                (tempControlesCausa && tempControlesCausa[0].idcausa) ===
                causa.idcausa
                  ? tempControlesCausa
                  : [],
            });
          });

          setRowsAll(tempCausasActivas);
          setLoadingDataCausas(false);
        }
      } catch (error) {
        console.error(error);
      }
    };

    const getControlesSOX = async () => {
      try {
        let responseControlesSox = await Queries(
          null,
          "/rx_riesgo_causa_control/" +
            localStorage.getItem("idRiesgo") +
            "/145/",
          "GET"
        );

        console.log(responseControlesSox);
        setControlesSOX(responseControlesSox);
      } catch (error) {}
    };

    getControlesSOX();

    const cargaRiesgo = async () => {
      setLoadingDataCausas(true);
      await getRiesgo();
      if (!actualizar) {
        await getCausasRiesgo();
      }
      try {
        setIdRiesgo(riesgo.idriesgo);
        setEfectividadCtrl(riesgo.efectividad_control);
        setJustificacionCausas(riesgo.justificacion_participacion_causa);
        setMetEfectividadCtrl(riesgo.metodo_efectividad_ctrol);

        if (!actualizar) {
          setActualizar([true]);
        }
        return null;
      } catch (error) {
        console.error(error);
      }
      setLoadingDataCausas(false);
    };

    cargaRiesgo();
  }, [actualizar]);

  const buscarCausaNombre = (causas, nombre) => {
    let jsonCausa;
    causas.map((causa) => {
      if (causa.label === nombre) {
        jsonCausa = causa;
      }
    });
    return jsonCausa;
  };

  //*Funciones para tablas /////////////////// */

  const handleOnChange = (index, name, value) => {
    if (name === "causaN1") {
      const filtered = causasN2.filter(function (element) {
        return element.padre === value;
      });
      causasRowN2 = filtered;
    }
    if (name === "causaN2") {
      let tempExisteCausa = false;
      controles.map((controlCausa) => {
        if (controlCausa[value]) {
          tempExisteCausa = true;
        }
      });
      if (!tempExisteCausa) {
        let temp = {};
        temp[value] = [];
        controles.push(temp);
      }
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
  const filtraCategoria_XPais = (categorias, compania) => {
    let categoriasFiltradas = [];
    if (compania.pais === "Colombia") {
      categorias.map((categoria) => {
        if (categoria.atributo === "Local - COL") {
          categoriasFiltradas.push(categoria);
        }
        return null;
      });
    } else if (compania.pais === "Panamá") {
      categorias.map((categoria) => {
        if (categoria.atributo === "Local -PAN") {
          categoriasFiltradas.push(categoria);
        }
        return null;
      });
    } else if (compania.pais === "Guatemala") {
      categorias.map((categoria) => {
        if (categoria.atributo === "Local - GTM") {
          categoriasFiltradas.push(categoria);
        }
        return null;
      });
    } else if (compania.pais === "General") {
      categorias.map((categoria) => {
        categoriasFiltradas.push(categoria);
        return null;
      });
    }
    return categoriasFiltradas;
  };

  const filtraEfectos = (listaGeneral, nuevaLista, tipoNuevaLista) => {
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

  const perteneceDist = (data, unknown) => {
    let temp = false;
    data.map((dat) => {
      if (dat.idcontrol === unknown.idcontrol) {
        temp = true;
      }
      return null;
    });
    return temp;
  };
  const sendControles = (
    controlesCausaSend,
    idRiesgoCausaRX,
    idCausaOrigen
  ) => {
    let inactivarControl = [];
    let controlesCausaInicial;
    let controlesCausaFinal = [];
    controlesCausaFinal = controlesCausaSend;

    controlesCausaInicial = controlesInicial[idCausaOrigen];

    var causa_control = [];
    if (controlesCausaInicial) {
      controlesCausaInicial.map((control_Inicial) => {
        let pertenece = false;
        if (controlesCausaFinal) {
          controlesCausaFinal.map((control_Final) => {
            if (control_Inicial.idcontrol === control_Final.idcontrol)
              pertenece = true;
          });
        }
        if (!pertenece) {
          inactivarControl.push({
            idrx_riesgo_causa: idRiesgoCausaRX,
            idcontrol: control_Inicial.idcontrol,
            /* TODO: Preguntar si se puede asociar un porcentaje con decimales */
            cobertura_ctrol_causa: parseFloat(
              control_Inicial.cobertura_ctrol_causa
            ),
            estado_asociacion: 0,
            idriesgo: idRiesgo,
          });
        }
      });
    }

    try {
      controlesCausaFinal.map((control) => {
        if (
          document.getElementById(
            "porcentajeControl" + control.idcontrol + "_" + idCausaOrigen
          )
        ) {
          causa_control.push({
            idrx_riesgo_causa: idRiesgoCausaRX,
            idcontrol: control.idcontrol,
            /* TODO: Preguntar si se puede asociar un porcentaje con decimales */
            cobertura_ctrol_causa: parseFloat(
              document.getElementById(
                "porcentajeControl" + control.idcontrol + "_" + idCausaOrigen
              ).value
            ),
            estado_asociacion: 1,
            idriesgo: idRiesgo,
          });
        }
        return null;
      });

      if (controlesDesaociados) {
        controlesDesaociados.map((cont_desaociado) => {
          if (cont_desaociado.idrx_riesgo_causa === idRiesgoCausaRX) {
            inactivarControl.push({
              idrx_riesgo_causa: cont_desaociado.idrx_riesgo_causa,
              idcontrol: cont_desaociado.idcontrol,
              /* TODO: Preguntar si se puede asociar un porcentaje con decimales */
              cobertura_ctrol_causa: parseFloat(
                cont_desaociado.cobertura_ctrol_causa
              ),
              estado_asociacion: 0,
              idriesgo: idRiesgo,
            });
          }
        });
      }
      causa_control = causa_control.concat(inactivarControl);
      axios
        .put(
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
              setTimeout(() => {
                setEstadoPost(0);
              }, 4000);
            }
          } else if (
            riesgoCausaControl.status >= 400 &&
            riesgoCausaControl.status < 500
          ) {
            setEstadoPost(4);
            setTimeout(() => {
              setEstadoPost(0);
            }, 4000);
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
  const perteneceCausa = (data, unknown) => {
    let temp = false;
    if (data) {
      data.map((dat) => {
        if (dat.causaN2 === unknown.causaN2) {
          temp = true;
        }
        return null;
      });
    }
    return temp;
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
      /* getCausasRiesgo */
      let causasNew = [];
      let causasUpdate = [];
      let pertenece;
      rows.map((data) => {
        pertenece = perteneceCausa(rowsAll, data);
        if (!pertenece) {
          causasNew.push(data);
        }
      });
      rows.map((data) => {
        pertenece = perteneceCausa(causasNew, data);
        if (!pertenece) {
          causasUpdate.push(data);
        }
      });

      causasUpdate.map((data, index) => {
        if (data.causaN2 !== "" && data.causaN2) {
          riesgo_causa = {
            //idrx_riesgo_causa: data.id,
            causa_n1: buscarCausa(causas, data.causaN1),
            nombre_estandar_causa: buscarCausa(causasN2, data.causaN2),
            descripcion_especifica: data.descripcion,
            participacion_riesgo: parseFloat(data.porcentaje),
            estado: data.estado ? 1 : 0,
            idriesgo: idRiesgo,
            idcausa: data.causaN2,
          };

          axios
            .put(
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
                  dic_causa_controles[data.causaN2],
                  responseRiesgtoCausa.data.idrx_riesgo_causa,
                  data.causaN2
                );
                setEstadoPost(2);
              } else if (responseRiesgtoCausa.status >= 500) {
                setEstadoPost(5);
                if (
                  responseRiesgtoCausa.data.non_field_errors[0] ===
                  "The fields idactivo must make a unique set."
                ) {
                  setEstadoPost(6);
                  setTimeout(() => {
                    setEstadoPost(0);
                  }, 4000);
                }
              } else if (
                responseRiesgtoCausa.status >= 400 &&
                responseRiesgtoCausa.status < 500
              ) {
                setEstadoPost(4);
                setTimeout(() => {
                  setEstadoPost(0);
                }, 4000);
              }
            })
            .catch((errors) => {
              // react on errors.
              console.error(errors);
            });
        }

        return null;
      });

      causasNew.map((data, index) => {
        if (data.causaN2 !== "" && data.causaN2) {
          riesgo_causa = {
            causa_n1: buscarCausa(causas, data.causaN1),
            nombre_estandar_causa: buscarCausa(causasN2, data.causaN2),
            descripcion_especifica: data.descripcion,
            participacion_riesgo: parseFloat(data.porcentaje),
            estado: data.estado ? 1 : 0,
            idriesgo: idRiesgo,
            idcausa: data.causaN2,
          };
          axios
            .put(
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
                  dic_causa_controles[data.causaN2],
                  responseRiesgtoCausa.data.idrx_riesgo_causa,
                  data.causaN2
                );
                setEstadoPost(2);
              } else if (responseRiesgtoCausa.status >= 500) {
                setEstadoPost(5);
                if (
                  responseRiesgtoCausa.data.non_field_errors[0] ===
                  "The fields idactivo must make a unique set."
                ) {
                  setEstadoPost(6);
                  setTimeout(() => {
                    setEstadoPost(0);
                  }, 4000);
                }
              } else if (
                responseRiesgtoCausa.status >= 400 &&
                responseRiesgtoCausa.status < 500
              ) {
                setEstadoPost(4);
                setTimeout(() => {
                  setEstadoPost(0);
                }, 4000);
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

  const sendData = async (event) => {
    event.preventDefault();
    console.log("antes de calcular efectividad", efectividadCtrl);
    let efectividad = await calculaEfectividad();
    console.log(
      "despues de calcular efectividad",
      efectividad,
      efectividadCtrl
    );

    var datosRiesgo = {
      idriesgo: idRiesgo,
      compania: compania,
      idcompania: idcompania,
      efectividad_control: efectividadCtrl,
      metodo_efectividad_ctrol: metEfectividadCtrl,
      justificacion_participacion_causa: justificacionCausas,
    };
    JSON.stringify(datosRiesgo);
    //Guarda
    axios
      .put(
        process.env.REACT_APP_API_URL + "/GuardarEfectividad/" + idRiesgo + "/",
        datosRiesgo,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + serviceAAD.getToken(),
          },
        }
      )
      .then(function (response) {
        if (
          response.status >= 200 &&
          response.status < 300
          // && isCheckedRO === true
        ) {
          sendCausas(idRiesgo);
          localStorage.setItem("idRiesgo", response.data.idriesgo);
          setEstadoPost(2);
          setTimeout(() => {
            history.push("/causaControles");
            setEstadoPost(0);
          }, 2000);
        } else if (response.status >= 500) {
          setEstadoPost(5);
          if (
            response.data.non_field_errors[0] ===
            "The fields idactivo must make a unique set."
          ) {
            setEstadoPost(6);
            setTimeout(() => {
              setEstadoPost(0);
            }, 4000);
          }
        } else if (response.status >= 400 && response.status < 500) {
          setEstadoPost(4);
          setTimeout(() => {
            setEstadoPost(0);
          }, 4000);
        }
      })
      .catch((error) => {
        console.error(error);
      });

    if (controlesSOX.length > 0) {
      let causaTemp = {
        causa_n1: "Causa Genérica Migración (no usar) N1",
        nombre_estandar_causa: "Causa relación riesgo control (no usar)",
        descripcion_especifica: "N/A",
        participacion_riesgo: 0,
        estado: 1,
        idriesgo: idRiesgo,
        idcausa: 145,
      };

      const requestRiesgoCausa = await Queries(
        causaTemp,
        "/rx_riesgo_causa/",
        "PUT"
      );

      let causaControl = [];
      controlesSOX.map(async (control) => {
        causaControl.push({
          cobertura_ctrol_causa: 0,
          estado_asociacion: 1,
          idcontrol: control.idcontrol,
          idriesgo: idRiesgo,
          idrx_riesgo_causa: requestRiesgoCausa.data.idrx_riesgo_causa,
        });
      });

      let requestCausaControl = await Queries(
        causaControl,
        "/rx_riesgo_causa_control/",
        "PUT"
      );

      if (requestCausaControl.status === 202) {
        setEstadoPost(2);
        setTimeout(() => {
          setEstadoPost(0);
        }, 4000);
      } else {
        setEstadoPost(4);
        setTimeout(() => {
          setEstadoPost(0);
        }, 4000);
      }
    }

    setValidated(true);
  };
  const postData = async (data, url, fuente) => {
    try {
      const resp = await axios.post(process.env.REACT_APP_API_URL + "/" + url, data, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + serviceAAD.getToken(),
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
            Authorization: "Bearer " + serviceAAD.getToken(),
          },
        })
        .then(function (response_rx_efecto) {
          console.warn("Envío exitoso desde " + fuente);
        });
    } catch (error) {
      console.error(error.response);
    }
  };

  const calculaEfectividad = async () => {
    setEnableButton(false);
    let Efectividad = null;
    const getControl = (controles_temp, idCausaOrigen) => {
      var causa_control = [];
      controles_temp.map((control) => {
        if (control.length != undefined) {
          control.map((cont) => {
            causa_control.push({
              idcontrol: cont.idcontrol,
              /* TODO: Preguntar si se puede asociar un porcentaje con decimales */
              cobertura_ctrol_causa: parseFloat(
                document.getElementById(
                  "porcentajeControl" + cont.idcontrol + "_" + idCausaOrigen
                ).value
              ),
            });
            return null;
          });
        } else {
          if (
            document.getElementById(
              "porcentajeControl" + control.idcontrol + "_" + idCausaOrigen
            )
          ) {
            causa_control.push({
              idcontrol: control.idcontrol,
              /* TODO: Preguntar si se puede asociar un porcentaje con decimales */
              cobertura_ctrol_causa: parseFloat(
                document.getElementById(
                  "porcentajeControl" + control.idcontrol + "_" + idCausaOrigen
                ).value
              ),
            });
          } else {
          }

          return null;
        }
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
            data.estado === true &&
            dic_causa_controles[data.causaN2]
          ) {
            dataCausasControles.push({
              idcausa: data.causaN2,
              participacion_riesgo: parseFloat(data.porcentaje),
              estado: 1,
              controles: getControl(
                dic_causa_controles[data.causaN2],
                data.causaN2
              ),
            });
            //}
          }
          return null;
        });
      }
      await axios
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
            console.log(
              "RETORNAR LA EFECTIVIDAD",
              CausaControl.data.efectividad_controles
            );
            Efectividad = CausaControl.data.efectividad_controles;
          } else if (CausaControl.status >= 500) {
            setEstadoPost(5);
            setTimeout(() => {
              setEstadoPost(0);
            }, 4000);
            if (
              CausaControl.data.non_field_errors[0] ===
              "The fields idactivo must make a unique set."
            ) {
              setEstadoPost(6);
              setTimeout(() => {
                setEstadoPost(0);
              }, 4000);
            }
          } else if (CausaControl.status >= 400 && CausaControl.status < 500) {
            setEstadoPost(4);
            setTimeout(() => {
              setEstadoPost(0);
            }, 4000);
          }
        });
      setEnableButton(true);
    } catch (error) {
      setEnableButton(true);
      console.error(error);
    }
    return Efectividad;
  };

  const cargarControlesSOX = async () => {
    if (!dataControlesSox || !dataControlesSox.dataTable) {
      let ControlesSOXQuerie = await Queries(null, "/controles/", "GET");
      let tempJsonOpciones = {
        dataTable: ControlesSOXQuerie,
        nameCol: [
          "ID Control",
          "Nombre Control",
          "Descripción Control",
          "Proceso",
          "Aseveraciones",
        ],
        nameRow: [
          "idcontrol",
          "nombre",
          "descripcion",
          "proceso",
          "aseveraciones",
        ],
        nameId: "idcontrol",
        busqueda: true,
        nameBusqueda: ["idcontrol", "nombre"],
      };

      setDataControlesSox(tempJsonOpciones);
    }
  };

  return (
    <>
      <>
        <ModalSelectTableCustom
          id="ModalControles"
          showMod={showModControlesSox}
          setShowMod={setShowModControlesSox}
          data={controlesSOX}
          setData={setControlesSOX}
          dataTable={dataControlesSox}
          multi={true}
        />
        <Row>
          <Col>
            <div
              style={{ position: "fixed", zIndex: 10, minWidth: "80vw" }}
              className={classes.content}
            >
              <div className={classes.appBarSpacer}>
                <Navbar bg="dark" variant="dark" expand="xl">
                  <Container>
                    <Navbar id="justify-content-center">
                      <Nav className="ml-auto">
                        <Nav.Link>
                          <Link to="editarRiesgo" className="link2">
                            Información General
                          </Link>
                        </Nav.Link>
                        <Nav.Link>
                          <Link to="causaControles" className="link2">
                            Causas y controles
                          </Link>
                        </Nav.Link>
                        <Nav.Link>
                          <Link to="valoracionRiesgo" className="link2">
                            Valoración RO
                          </Link>
                        </Nav.Link>
                        <Nav.Link>
                          <Link to="valoracionSOX" className="link2">
                            Valoración SOX
                          </Link>
                        </Nav.Link>
                        <Nav.Link href="#resumenPorEfecto">
                          <Link to="riesgos">
                            <button
                              type="button"
                              className="btn botonNegativo2"
                            >
                              Cancelar
                            </button>
                          </Link>
                        </Nav.Link>
                        <Nav.Link href="#resumenPorEfecto">
                          {props.permisos.editar ? (
                            <button
                              type="button"
                              className="btn botonPositivo2"
                              id="send"
                              onClick={sendData}
                            >
                              Guardar
                            </button>
                          ) : null}
                        </Nav.Link>
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
            <ModalAlerta
              showAlerta={showAlerta}
              setShowAlerta={setShowAlerta}
              text={textAlerta}
            />
            <Row className="mt-5 mb-3">
              <Col md={12}>
                {" "}
                <AlertDismissibleExample
                  alerta={estadoPost}
                  className="mb-3 mt-5"
                />{" "}
              </Col>
            </Row>
            {/* ///////////////////////////// Acciones ////////////////////////////// */}
            <Row className="mb-3 mt-5">
              <Col md={12}>
                <h1 className="titulo">Riesgo # {idRiesgo} </h1>
              </Col>
            </Row>

            {/* /////////////////////////////////////// Asociación de causas //////////////////////////////////////////////// */}
            <Row className="mb-3 mt-4">
              <Col md={12}>
                <h1 className="subtitulo text-center">Asociación de causas</h1>
              </Col>
            </Row>
            {loadingDataCausas ? (
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
                    Descripción especifica causa*
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
            )}
            <Row className="mb-0">
              <Col sm={12} xs={12}>
                <hr />
              </Col>
            </Row>
            <div className="App">
              {rows.map((row, index) => (
                <RowCausa
                  {...row}
                  onChange={(name, value) => handleOnChange(index, name, value)}
                  onRemove={() => handleOnRemove(index)}
                  key={index}
                />
              ))}
            </div>

            {/* //////////////////////////////////////// Tabla para controles SOX /////////////////////////////////////////////// */}
            <hr />
            <Row className="mb-3">
              <Col sm={8} xs={12} className="text-left">
                <label className="form-label label">Controles SOX</label>
              </Col>
              <Col sm={2} xs={12} className="text-left">
                <Button
                  onClick={async () => {
                    cargarControlesSOX();
                    setShowModControlesSox(true);
                  }}
                  className="botonPositivo2"
                >
                  Asociar controles
                </Button>
              </Col>
              <Col sm={2} xs={12} className="text-left">
                <Button className="botonNegativo2">Desasociar</Button>
              </Col>
            </Row>

            <TableCustom
              data={controlesSOX}
              nameCol={[
                "ID Control",
                "Nombre Control",
                "Automatización",
                "Naturaleza",
              ]}
              nameRow={["idcontrol", "nombre", "automatizacion", "naturaleza"]}
              nameId={"idcontrol"}
            ></TableCustom>

            <hr />
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
                      value: "Método basado en cobertura a la causa",
                      label: "Método basado en cobertura a la causa",
                    },
                    /*   { value: 1, label: "Método basado en cadenas de transición" }, */
                  ]}
                  value={[
                    {
                      value: "Método basado en cobertura a la causa",
                      label: "Método basado en cobertura a la causa",
                    },
                  ]}
                  onChange={(e) => {
                    setMetEfectividadCtrl(e.value);
                  }}
                />
              </Col>
            </Row>
            <Row className="mb-3">
              <Col sm={4} xs={12}>
                <label className="form-label label">
                  Justificación de participación de causas
                </label>
              </Col>
              <Col sm={8} xs={12}>
                <input
                  type="text"
                  className="form-control text-center texto"
                  placeholder="Justificación de participación de causas"
                  defaultValue={justificacionCausas}
                  id="justificacionCausas"
                  onChange={(e) => setJustificacionCausas(e.target.value)}
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
            {loadingDataCausas ? (
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
              <Row className="mb-3 mt-4 justify-content-center">
                <Col sm={12} xs={12} className="text-center">
                  {enableButton ? (
                    <button
                      type="button"
                      className="btn botonPositivo2"
                      id=""
                      onClick={() => {
                        calculaEfectividad();
                        //getPar();
                      }}
                    >
                      Calcular Efectividad
                    </button>
                  ) : (
                    <Col className="col-auto" sm={12} xs={12}>
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
                </Col>
              </Row>
            )}
            {/* //////////////////////////////////////// Tablas para efectos ////////////////////////////////////////////// */}

            <Row className="mb-5 mt-5"></Row>
          </Form>
        </Container>
      </>
      {/* )} */}
    </>
  );
}
