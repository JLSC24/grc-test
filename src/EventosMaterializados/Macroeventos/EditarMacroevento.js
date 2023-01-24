import React, { useState, useEffect, useContext } from "react";

import { Link, Routes, Route, useHistory, useLocation } from "react-router-dom";
import { UsuarioContext } from "../../Context/UsuarioContext";

import AADService from "../../auth/authFunctions";
import axios from "axios";

import MaterialTable from "material-table";
import { forwardRef } from "react";
import Check from "@material-ui/icons/Check";
import Clear from "@material-ui/icons/Clear";
import Edit from "@material-ui/icons/Edit";
import Loader from "react-loader-spinner";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";

import { withStyles, makeStyles } from "@material-ui/core/styles";

import Checkbox from "@mui/material/Checkbox";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import TablePagination from "@material-ui/core/TablePagination";

import { Row, Col, Form, Alert, Button, Container } from "react-bootstrap";

import { useForm, Controller, useWatch, FormProvider } from "react-hook-form";

import { FormSearchListCompania } from "../../form-components/FormSearchListCompania";

import { FormInputDate } from "../../form-components/FormInputDate";
import { FormSearchListSiNo } from "../../form-components/FormSearchListSiNo";
import { FormSearchListRiesgos } from "../../form-components/FormSearchListRiesgos";
import { FormSearchListTiposFalla } from "../../form-components/FormSearchListTiposFalla";
import { FormSearchListPlanesAccion } from "../../form-components/FormSearchListPlanesAccion";

// import { ModalEfectosFinancieros } from "./ModalesEventos/ModalEfectosFinancieros";

import Select from "react-select";
import makeAnimated from "react-select/animated";
import ModalAsociarEvento from "./ModalesMacroeventos/ModalAsociarEvento";

const animatedComponents = makeAnimated();

function AlertDismissibleExample({ alerta }) {
  switch (alerta.id) {
    case 1:
      return <Alert variant="warning">Alerta</Alert>;

    case 2:
      return <Alert variant="success">Guardado exitosamente!</Alert>;

    case 3:
      return <Alert variant="danger">{alerta.data}</Alert>;

    case 4:
      return <Alert variant="warning">Error al enviar la información</Alert>;

    case 5:
      return <Alert variant="danger">Error en el servidor</Alert>;

    case 7:
      return (
        <Alert variant="warning">
          Corrige los siguientes errores:
          <br></br>• Debe completar los campos obligatorios
        </Alert>
      );
    default:
      return <p></p>;
  }
}

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
    zIndex: 0,
    width: "100%",
  },
  container: {
    maxHeight: "35vh",
    minHeight: "35vh",
    zIndex: 0,
  },
  cabecera: {
    zIndex: -1,
  },
});

const defaultValues = {
  riesgo: null,
  compania: null,
  areaReporta: null,
  areaOcurrencia: null,
  proceso: null,
  fechaInicial: null,
  fechaFinal: null,
  fechaDescubrimiento: null,
  asociadoCambio: null,
  categoriaCorp1: null,
  categoriaCorp3: null,
  descCategoriaCorp: null,
  categoriaLocal1: null,
  categoriaLocal3: null,
  descCategoriaLocal: null,
  tipoFalla: null,
  afectoConsumidor: null,
  otrosRiesgosImpact: null,
  idMacroevento: null,
  planesAccion: null,
  infoAdicional: null,
};

export default function EditarMacroevento() {
  const serviceAAD = new AADService();
  const classes = useStyles();
  const history = useHistory();

  const location = useLocation();

  const [data, setData] = React.useState([]);
  const [showBotonEditar, setShowBotonEditar] = useState(false);
  const [idSearch, setIDSearch] = useState(null);
  const [dataBusqueda, setDataBusqueda] = React.useState([]);
  
  const [idEventoMaterializado, setIdEventoMaterializado] = useState(null);

  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const [estadoPost, setEstadoPost] = useState({
    alerta: { id: 0, data: null },
  });
  const { dataUsuario } = useContext(UsuarioContext);
  const [ID, setID] = useState(null);
  const [idEventoRelacionado, setIdEventoRelacionado] = useState("1");

  const [showModalAsociarEvento, setShowModalAsociarEvento] = useState(false);
  const [eventosAsociados, setEventosAsociados] = useState([]);

  const [ListaCompaniasInicial, setListaCompaniasInicial] = useState([]);

  const [monedaCOP, setMonedaCOP] = useState(null);
  const [monedaUSD, setMonedaUSD] = useState(null);
  const [perdidas, setPerdidas] = useState(null);

  const [selectMoneda, setSelectMoneda] = useState(null);

  const [dataGrid, setDataGrid] = useState([]);

  const [columns, setColumns] = useState([
    // {
    //   title: "Nombre de la causa de nivel 1",
    //   field: "CausaNivel1",
    //   lookup: ListaCausasN1,
    // },
    // {
    //   title: "Nombre de la causa de nivel 2",
    //   field: "CausaNivel2",
    //   lookup: ListaCausasN2,
    // },
    // {
    //   title: "Relevancia de la causa",
    //   field: "RelevanciaCausa",
    //   type: "textfield",
    // },
    // {
    //   title: "Peso de la causa",
    //   field: "PesoCausa",
    //   type: "numeric",
    // },
  ]);

  const tableIcons = {
    Add: forwardRef((props, ref) => (
      <button type="button" className="btn botonPositivo2">
        <AddCircleOutlineIcon {...props} ref={ref} />
      </button>
    )),
    Check: forwardRef((props, ref) => (
      <button type="button" className="btn botonPositivo2">
        <Check {...props} ref={ref} />
      </button>
    )),
    Clear: forwardRef((props, ref) => (
      <button type="button" className="btn botonNegativo2">
        <Clear {...props} ref={ref} />
      </button>
    )),
    Delete: forwardRef((props, ref) => (
      <button type="button" className="btn botonNegativo2">
        <DeleteForeverIcon {...props} ref={ref} />
      </button>
    )),
    Edit: forwardRef((props, ref) => (
      <button type="button" className="btn botonGeneral2">
        <Edit {...props} ref={ref} />
      </button>
    )),
  };

  /* Funciones para paginación */
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat([], name);
      setShowBotonEditar(true);
    } else {
      setShowBotonEditar(false);
    }
    setSelected(newSelected);

    // console.log("id del evento seleccionado : ", name);

    setIDSearch(name);
  };

  const isSelected = (name) => selected.indexOf(name) !== -1;
  /* Fin de funciones para paginación */

  useEffect(() => {
    const llenarFormulario = async () => {
      let tempIDmacroevento = "";
      let ultimaBusqueda = "";
      if (typeof location.state != "undefined") {
        if (
          location.state.idmacro &&
          location.state.idmacro.length > 0
        ) {
          tempIDmacroevento = location.state.idmacro;
          setIdEventoMaterializado(tempIDmacroevento);
          localStorage.setItem("idmacro", tempIDmacroevento);
        }
      } else {
        ultimaBusqueda = localStorage.getItem("idEventoMaterializado");
        if (ultimaBusqueda && ultimaBusqueda.length > 0) {
          tempIDmacroevento = ultimaBusqueda;
          setIdEventoMaterializado(tempIDmacroevento);
        } else {
          alert("Ups, ocurrió un error, trata de recargar la página");
        }
      }
      const response = await axios.get(
        process.env.REACT_APP_API_URL + "/macroevento/" + tempIDmacroevento,
        {
          headers: {
            Authorization: "Bearer " + serviceAAD.getToken(),
          },
        }
      );
      let dataR = response.data;
      
      
        setMonedaCOP(dataR[0].moneda_COP)
        setMonedaUSD(dataR[0].moneda_USD)
        setID(dataR[0].idmacroevento)
        
        
      setValue("descipcionMacroevento", dataR[0].descripcion);
      setEventosAsociados(dataR[0].eventos);
      setValue("macroeventoAsociado", {
        label: dataR[0].cambio_transformacion,
      });
      setValue("companiaMacroevento", {
        value: dataR[0].idcompania,
        label: dataR[0].compania,
      });
        
    };
    if(!ID){llenarFormulario()};
    const getEventosRelacionados = async () => {
      try {
        const response = await axios.get(
          process.env.REACT_APP_API_URL + "/buscar_evento/" + idEventoRelacionado,
          {
            headers: {
              Authorization: "Bearer " + serviceAAD.getToken(),
            },
          }
        );

        let data = response.data.map(
          ({ idcompania: value, compania: label, pais }) => ({
            value,
            label,
            pais,
          })
        );
      } catch (error) {
        console.error(error);
      }

      setColumns([
        {
          title: "ID Evento",
          field: "idEvento",
          lookup: ["lol", "lolol"],
        },
        {
          title: "Compañia",
          field: "compania",
          lookup: ["lol", "lolol"],
        },

        {
          title: "Categoria corporativa N1",
          field: "peso_de_la_causa",
          type: "numeric",
        },
        {
          title: "Tipo de falla",
          field: "tipoFalla",
        },
        { title: "Divisa origen", field: "divisaOrigen" },
        {
          title: "Pérdida neta",
          field: "perdidaNeta",
        },
        {
          title: "Estado evento",
          field: "estadoEvento",
        },
      ]);
    };

    const getCompanias = async () => {
      try {
        const response = await axios.get(
          process.env.REACT_APP_API_URL + "/maestros_ro/compania/",
          {
            headers: {
              Authorization: "Bearer " + serviceAAD.getToken(),
            },
          }
        );

        let companias = response.data.map(
          ({ idcompania: value, compania: label, pais }) => ({
            value,
            label,
            pais,
          })
        );

        setListaCompaniasInicial(companias);

        let nombreCompañia = companias.filter(
          (compania) => compania.value == dataUsuario.idcompania
        );

        // setID(
        //   "ME-" +
        //     nombreCompañia[0].label +
        //     "-" +
        //     dataUsuario.email.split("@")[0] +
        //     "-" +
        //     Date.now()
        // );
      } catch (error) {
        console.error(error);
      }
    };
    getEventosRelacionados();
    getCompanias();
  }, [setEventosAsociados,eventosAsociados]);

  const methods = useForm({
    defaultValues,
    mode: "onChange",
  });

  const { register, handleSubmit, control, setValue } = methods;

  const onSubmit = (data) => {
    let idArray =[];
    eventosAsociados.forEach((evento)=>{
      idArray.push(evento.idevento_materializado)
    })

    const dataEnviar = {
      idcompania: data.companiaMacroevento.value,
      descripcion: data.descipcionMacroevento,
      eventos: idArray,
      macroeventoAsociado: data.macroeventoAsociado.label,
      id_macroevento: ID,
    };

    try {
      axios
        .put(process.env.REACT_APP_API_URL + "/macroevento/", dataEnviar, {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + serviceAAD.getToken(),
          },
        })
        .then(function (response) {
          if(response.status >= 200 && response.status < 300){
            setEstadoPost({id:2, response:response});
          }else if(response.status >= 500){
            setEstadoPost({id:5, response:response});
          }
          else if(response.status >= 400 && response.status < 500){
            setEstadoPost({id:4, response:response});
          }
        });
    } catch (error) {
      console.error(error);
    }
  };

  const onError = (errors, e) => console.log(errors, e);

  const goBack = () => {
    history.goBack();
  };

  const Asociar = () => {
    setShowModalAsociarEvento(true);
  };

  const Desasociar = () => {
    let objArray = eventosAsociados.filter((obj)=>obj.idevento_materializado !== selected[0]);

    // objArray.splice(
    //   objArray.findIndex((item) => item.idevento_materializado === selected[0]),
    //   1
    // );

    setEventosAsociados(objArray);
  };

  return (
    <>
      <Container>
        <FormProvider {...methods}>
          <AlertDismissibleExample alerta={estadoPost} />

          <ModalAsociarEvento
            showModalAsociarEvento={showModalAsociarEvento}
            setShowModalAsociarEvento={setShowModalAsociarEvento}
            eventosAsociados={eventosAsociados}
          />

          {/* <-------------------------------------Titulo-------------------------------------> */}
          <Row className="mb-3 mt-3">
            <Col md={8}>
              <h1 className="titulo">Macroevento: {ID}</h1>
            </Col>

            <Col sm={2} xs={12}>
              <Button type="button" className="botonNegativo" onClick={goBack}>
                Cancelar
              </Button>
            </Col>
            <Col sm={2} xs={12}>
              <Button
                type="submit"
                onClick={handleSubmit(onSubmit, onError)}
                variant={"contained"}
                className="btn botonPositivo"
              >
                Crear
              </Button>
            </Col>
          </Row>

          {/* <----------------------------------------Formulario----------------------------------------> */}
          <hr />
          <br />
          {/* <-------------Información general-------------------> */}

          <Row className="mb-4">
            <Col sm={2} xs={12}>
              <label className="forn-label label">Compañía: </label>
            </Col>
            <Col sm={4} xs={12}>
              <FormSearchListCompania
                control={control}
                name="compania"
                label="Compañia"
                {...register("companiaMacroevento")}
              />
            </Col>
            <Col sm={3} xs={12}>
              <label className="forn-label label">
                Macroevento asociado a transformación:
              </label>
            </Col>

            <Col sm={3} xs={12}>
              <FormSearchListSiNo
                control={control}
                name="asociadoCambio"
                label="AsociadoCambio"
                {...register("macroeventoAsociado")}
              />
            </Col>
          </Row>

          <Row className="mb-4">
            <Col sm={2} xs={12}>
              <label className="forn-label label">
                Descripción del macroevento:
              </label>
            </Col>

            <Col sm={10} xs={12}>
              <textarea
                className="form-control text-center"
                placeholder="Descripción del macroevento"
                rows="3"
                {...register("descipcionMacroevento")}
              />
            </Col>
          </Row>

          <Row className="mb-4"></Row>

          {/* <--------------------------------- fin : Información general---------------------------------> */}

          <hr />
          <br />

          {/* <-------------------------------------inicio: Eventos relacionados​-------------------------------------> */}

          <Row className="mb-4">
            <Col sm={8} xs={12}></Col>

            {selected.length > 0 ? (
              <Col sm={2} xs={12}>
                <Button
                  type="button"
                  className="botonNegativo"
                  onClick={() => Desasociar()}
                >
                  Inactivar
                </Button>
              </Col>
            ) : (
              <Col sm={2} xs={12}>
                <Button
                  type="button"
                  className="botonPositivo"
                  onClick={Asociar}
                >
                  Asociar
                </Button>
              </Col>
            )}
          </Row>

          <Row className="mb-4">
            <Paper className={classes.root}>
              <TableContainer component={Paper} className={classes.container}>
                <Table className={classes.cabecera}>
                  {/* Inicio de encabezado */}
                  <TableHead>
                    <TableRow>
                      <StyledTableCell padding="checkbox"></StyledTableCell>
                      <StyledTableCell>ID</StyledTableCell>
                      <StyledTableCell align="left">
                        Compañía que reporta
                      </StyledTableCell>
                      <StyledTableCell align="left">
                        Categoría corporativa N1
                      </StyledTableCell>
                      <StyledTableCell align="left">
                        Tipo de falla
                      </StyledTableCell>
                      <StyledTableCell align="left">
                        Pérdida Neta COP
                      </StyledTableCell>
                      <StyledTableCell align="left">
                        Pérdida Neta USD
                      </StyledTableCell>
                      <StyledTableCell align="left">
                        Estado del evento
                      </StyledTableCell>
                    </TableRow>
                  </TableHead>
                  {/* Fin de encabezado */}
                  {/* Inicio de cuerpo de la tabla */}
                  <TableBody>
                    {eventosAsociados
                      .slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage
                      )
                      .map((row, index) => {
                        const isItemSelected = isSelected(
                          row.idevento_materializado
                        );
                        return (
                          <StyledTableRow
                            key={row.idevento_materializado}
                            hover
                            onClick={(event) =>
                              handleClick(event, row.idevento_materializado)
                            }
                            selected={isItemSelected}
                            role="checkbox"
                            tabIndex={-1}
                          >
                            <StyledTableCell component="th" scope="row">
                              <Checkbox checked={isItemSelected} />
                            </StyledTableCell>
                            <StyledTableCell component="th" scope="row">
                              {row.idevento_materializado}
                            </StyledTableCell>
                            <StyledTableCell align="left">
                              {row.compania_que_reporta}
                            </StyledTableCell>
                            <StyledTableCell align="left">
                              {row.categoria_riesgos_corporativa_n1}
                            </StyledTableCell>
                            <StyledTableCell align="left">
                              {row.tipo_de_falla}
                            </StyledTableCell>
                            <StyledTableCell align="left">
                              Pérdida Neta COP
                            </StyledTableCell>
                            <StyledTableCell align="left">
                              Pérdida Neta USD
                            </StyledTableCell>
                            <StyledTableCell align="left">
                              {row.evento_anulado == 1 ? "Anulado" : "Activo"}
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
          </Row>

          {/* <-------------------------------------fin: Efectos reputacionales:​-------------------------------------> */}
<Row className="mb-1">
                <Col sm={2} xs={12}>
                <label>Elija moneda</label>
                </Col>
                <Col sm={4} xs={12}>
                <Select components={animatedComponents}
                    options={[{value:1, label: "COP"},{value:2, label: "USD"}]}
                    value = {selectMoneda}
                    onChange={
                      (e)=>{
                        switch (e.label) {
                          case "COP":
                            setPerdidas(monedaCOP)
                            break;
                          case "USD":
                            setPerdidas(monedaUSD)
                            break;
                        
                          default:
                            break;
                        }
                        setSelectMoneda(e)
                      }
                    }
                    />                
                </Col>
  
              
              </Row>
              <Row className="mb-3">
                <Col sm={3} xs={12}></Col>

                <Col sm={3} xs={12}>
                  <label>Total pérdidas</label>
                </Col>
                <Col sm={3} xs={12}>
                  <label>Total recuperaciones</label>
                </Col>
                  
                <Col sm={3} xs={12}>
                  <label>Total pérdida neta</label>
                </Col>
              </Row>
              <Row className="mb-3">
                <Col sm={3} xs={12}>
                  <label className="forn-label label">
                    Contabilizado en RO
                  </label>
                </Col>

                <Col sm={3} xs={12}>
                <input type="number" className="form-control text-center texto" disabled defaultValue={perdidas?.perdidas?.contable_cuentas_RO} />
                </Col>
                <Col sm={3} xs={12}>
                <input type="number" className="form-control text-center texto" disabled defaultValue={perdidas?.recuperaciones?.contable_cuentas_RO} />
                </Col>
                  
                <Col sm={3} xs={12}>
                  <input type="number" className="form-control text-center texto" disabled defaultValue={perdidas?.perdida_neta?.contable_cuentas_RO} />
                </Col>
              </Row>
              <Row className="mb-3">
                <Col sm={3} xs={12}>
                  <label className="forn-label label">
                    Contabilizado otras cuentas
                  </label>
                </Col>

                <Col sm={3} xs={12}>
                <input type="number" className="form-control text-center texto" disabled  defaultValue={perdidas?.perdidas?.contabilizado_otras_cuentas} />
                </Col>
                <Col sm={3} xs={12}>
                <input type="number" className="form-control text-center texto" disabled defaultValue={perdidas?.recuperaciones?.contabilizado_otras_cuentas} />
                </Col>
                  
                <Col sm={3} xs={12}>
                  <input type="number" className="form-control text-center texto" disabled defaultValue={perdidas?.perdida_neta?.contabilizado_otras_cuentas} />
                </Col>
              </Row>
              <Row className="mb-3">
                <Col sm={3} xs={12}>
                  <label className="forn-label label">
                    Provisionado
                  </label>
                </Col>

                <Col sm={3} xs={12}>
                <input type="number" className="form-control text-center texto" disabled defaultValue={perdidas?.perdidas?.provisionado} />
                </Col>
                <Col sm={3} xs={12}>
                <input type="number" className="form-control text-center texto" disabled defaultValue={perdidas?.recuperaciones?.provisionado} />
                </Col>
                  
                <Col sm={3} xs={12}>
                  <input type="number" className="form-control text-center texto" disabled defaultValue={perdidas?.perdida_neta?.provisionado} />
                </Col>
              </Row>
              <Row className="mb-3">
                <Col sm={3} xs={12}>
                  <label className="forn-label label">
                    Sin contabilización
                  </label>
                </Col>

                <Col sm={3} xs={12}>
                <input type="number" className="form-control text-center texto" disabled defaultValue={perdidas?.perdidas?.sin_asiento_contable} />
                </Col>
                <Col sm={3} xs={12}>
                <input type="number" className="form-control text-center texto" disabled defaultValue={perdidas?.recuperaciones?.sin_asiento_contable} />
                </Col>
                  
                <Col sm={3} xs={12}>
                  <input type="number" className="form-control text-center texto" disabled defaultValue={perdidas?.perdida_neta?.sin_asiento_contable} />
                </Col>
              </Row>
              <Row className="mb-3">
                <Col sm={3} xs={12}>
                  <label className="forn-label label">
                    Ingresos
                  </label>
                </Col>

                <Col sm={3} xs={12}>
                <input type="number" className="form-control text-center texto" disabled defaultValue={perdidas?.perdidas?.ingresos} />
                </Col>
                <Col sm={3} xs={12}>
                <input type="number" className="form-control text-center texto" disabled defaultValue={perdidas?.recuperaciones?.ingresos} />
                </Col>
                  
                <Col sm={3} xs={12}>
                  <input type="number" className="form-control text-center texto" disabled defaultValue={perdidas?.perdida_neta?.ingresos} />
                </Col>
              </Row>
              <Row className="mb-3">
                <Col sm={3} xs={12}>
                  <label className="forn-label label">
                    Total
                  </label>
                </Col>

                <Col sm={3} xs={12}>
                <input type="number" className="form-control text-center texto" disabled defaultValue={perdidas?.perdidas?.total} />
                </Col>
                <Col sm={3} xs={12}>
                <input type="number" className="form-control text-center texto" disabled defaultValue={perdidas?.recuperaciones?.total} />
                </Col>
                  
                <Col sm={3} xs={12}>
                  <input type="number" className="form-control text-center texto" disabled defaultValue={perdidas?.perdida_neta?.total} />
                </Col>
              </Row>
              
            
          {/* <---------------------------------------- NAVEGACIÓN----------------------------------------> */}
          <hr />

          <Row className="mb-3 mt-3">
            <Col md={8}>
              <h1 className="titulo">Macroevento: {ID}</h1>
            </Col>

            <Col sm={2} xs={12}>
              <Button type="button" className="botonNegativo">
                Cancelar
              </Button>
            </Col>
            <Col sm={2} xs={12}>
              <Button
                type="submit"
                onClick={handleSubmit(onSubmit, onError)}
                variant={"contained"}
                className="btn botonPositivo"
              >
                Crear
              </Button>
            </Col>
          </Row>
        </FormProvider>
      </Container>
    </>
  );
}
