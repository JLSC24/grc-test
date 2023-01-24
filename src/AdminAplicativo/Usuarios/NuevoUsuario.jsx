import React, { useState, useEffect, useContext } from "react";

import AADService from "../../auth/authFunctions";

import axios from "axios";

import { Link, Routes, Route, useHistory } from "react-router-dom";

import { Row, Col, Form, Alert, Button, Container } from "react-bootstrap";

import { useForm, Controller, useWatch, FormProvider } from "react-hook-form";

import { forwardRef } from "react";
import Check from "@material-ui/icons/Check";
import Clear from "@material-ui/icons/Clear";
import Edit from "@material-ui/icons/Edit";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import Switch from "@material-ui/core/Switch";
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";

//import ModalRoles from "./Modales/ModalRoles";

import { withStyles, makeStyles } from "@material-ui/core/styles";
import makeAnimated from "react-select/animated";
import Select from "react-select";

import { UsuarioContext } from "../../Context/UsuarioContext";
import { FormSearchListCompania } from "../../form-components/FormSearchListCompania";
import { FormSearchListAreaUsua } from "../../form-components/FormSearchListAreaUsua";

import ModalRoles from "./Modales/ModalRoles";

const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: "#2c2a29",
    color: theme.palette.common.white,
  },
}))(TableCell);
const StyledTableRow = withStyles((theme) => ({
  root: {
    backgroundColor: "#f4f4f4",
    heigth: "10px",
  },
}))(TableRow);

const useStyles = makeStyles({
  root: {
    width: "100%",
  },
  container: {
    /* maxHeight: "60vh", */
    minHeight: "20vh",
  },

  MuiTableRow: {
    root: {
      //This can be referred from Material UI API documentation.
      heigth: "10px",
    },
  },
});

const animatedComponents = makeAnimated();
function AlertDismissibleExample({ alerta }) {
  switch (alerta.id) {
    case 1:
      return <Alert variant="warning">Alerta</Alert>;

    case 2:
      return <Alert variant="success">Guardado con éxito</Alert>;

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

const defaultValues = {
  idUsuario: null,
  nombre: null,
  compania: null,
  email: null,
  rol: null,
  roles: [],
  posicion: null,
  idPosicion: null,
  area_organizacional: null,
  estado: null,
  estadoLogin: null,
  estadoPosicion: null,
};

export default function NuevoEvento() {
  let history = useHistory();
  const classes = useStyles();
  const serviceAAD = new AADService();
  const { dataUsuario } = useContext(UsuarioContext);

  const [idEventoMaterializado, setIdEventoMaterializado] = useState(null);

  const [estadoPost, setEstadoPost] = useState({
    alerta: { id: 0, data: null },
  });

  const [dataInfoPosition, setDataInfoPosition] = useState();
  const [userRols, setUserRoles] = useState();
  const [selected, setSelected] = useState([]);

  const [dataR, setDataR] = useState([]);
  const [showDisplayR, setShowDisplayR] = useState(false);

  const [showModal, setShowModal] = useState(false);

  const [ListaCompaniasInicial, setListaCompaniasInicial] = useState([]);
  const [ListaAreasInicial, setListaAreasInicial] = useState([]);
  const [rolesSeleccionados, setRolesSeleccionados] = useState([]);

  const [causaSelected, setCausaSelected] = useState([]);
  // States for toggle switch
  const [state, setState] = React.useState({ status: true });
  const [stateLogin, setStateLogin] = React.useState({ status: true });

  useEffect(() => {
  }, [userRols]);

  const searchPosition = () => {
    const IDposition = document.querySelector("#id_posicion_usuario").value;
    if (IDposition) {
      fetch(`http://127.0.0.1:8000/posicion/${IDposition}`, {
        method: "GET",
      })
        .then((dataResponse) => dataResponse.json())
        .then((result) => {
          document.querySelector("#posicion_usuario").value =
            result[0]?.nombreposicion;
          methods.setValue(`posicion`, result[0]?.nombreposicion.trim());
          setDataInfoPosition(result);
        });
    } else {
      alert("Debes ingresar un ID de posición para realizar la búsqueda");
    }
  };

  useEffect(() => {
    async function getCompanias() {
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

        let idEvento =
          "EM-" +
          nombreCompañia[0].label +
          "-" +
          dataUsuario.email.split("@")[0] +
          "-" +
          Date.now().toString().slice(-7);

        setIdEventoMaterializado(idEvento);
      } catch (error) {
        console.error(error);
      }
    }
    async function getAreas() {
      try {
        const response = await axios.get(
          process.env.REACT_APP_API_URL + "/maestros_ro/area_o/",
          {
            headers: {
              Authorization: "Bearer " + serviceAAD.getToken(),
            },
          }
        );
        let areas = response.data.map(
          ({
            idarea_oraganizacional: value,
            nombre: label,
            idcompania,
            nivel,
            area_n1,
            area_n2,
            area_n3,
            area_n4,
            area_n5,
          }) => ({
            value,
            label,
            idcompania,
            nivel,
            area_n1,
            area_n2,
            area_n3,
            area_n4,
            area_n5,
          })
        );
        setListaAreasInicial(areas);
      } catch (error) {
        console.error(error);
      }
    }

    getCompanias();
    getAreas();
  }, []);

  // Change State Function
  const handleChange = (event) => {
    setState({ ...state, [event.target.name]: event.target.checked });
    setStateLogin({ ...stateLogin, [event.target.name]: event.target.checked });
  };

  const methods = useForm({
    defaultValues,
    mode: "onChange",
  });

  const {
    register,
    handleSubmit,
    control,
    setValue,
    getValues,
    formState: { errors },
  } = methods;
  const onSubmit = (data) => {
    const insertUser = {
      email: data.email,
      nombre: data.nombre,
      idrol: 5,
      roles: userRols.map((rol) => {
        let tempdata = [];
        tempdata.push(rol.idrol);
        return tempdata[0];
      }),
      idcompania: data.compañia.value,
      estado_usuario: 1,
      estado_login:1,
      numero_persona: 123,
    };
    try {
      fetch(`http://127.0.0.1:8000/admin_usuario/${data.email}/`, {
        method: "POST",
        headers: {
          Authorization: "Bearer " + serviceAAD.getToken(),
          Accept: "application/json",
          "Content-Type": "application/json; charset=UTF-8"
        },
        body: JSON.stringify(insertUser),
      })
        .then((response) => response.json()
        .then((result) => {
          if(response.status >= 200 && response.status < 300){
            setEstadoPost({id:2, response:response});
          }else if(response.status >= 500){
            setEstadoPost({id:5, response:response});
          }
          else if(response.status >= 400 && response.status < 500){
            setEstadoPost({id:4, response:response});
          }
          const insertPosition = {
            idusuario: result.idusuario,
            idposicion: data.idPosicion,
            idarea_organizacional: data.area_organizacional.value,
            area_organizacional: data.area_organizacional.label,
            nombreposicion: data.posicion,
            estadoposicion: 1,
          };
          fetch(`http://127.0.0.1:8000/posicion/${data.posicion}`, {
            method: "PUT",
            headers: {
              Authorization: "Bearer " + serviceAAD.getToken(),
              Accept: "application/json",
              "Content-Type": "application/json; charset=UTF-8"
            },
            body: JSON.stringify(insertPosition),
          });
        }));
    } catch (error) {
      console.error(error);
    }
  };

  const onError = (errors, e) => console.log(errors);

  const isSelected = (name) => selected.indexOf(name) !== -1;

  const EliminarRiesgo = () => {
    if (selected.length > 0) {
      setDataR([]);

      setValue("idRiesgo", "");

      setShowDisplayR(false);
    }
  };

  const isSelectedCausas = (name) => causaSelected.indexOf(name) !== -1;

  return (
    <>
      <ModalRoles
        showModal={showModal}
        setShowModal={setShowModal}
        userRols={userRols}
        setUserRoles={setUserRoles}
      ></ModalRoles>
      <AlertDismissibleExample alerta={estadoPost} />

      <Container>
        <FormProvider {...methods}>
          {/* <-------------------------------------Titulo-------------------------------------> */}
          <Row className="mb-3 mt-3">
            <Col md={8}>
              <h1 className="titulo">Nuevo usuario</h1>
            </Col>
            <Col sm={2} xs={12}>
              <Link to="./Usuarios">
                <Button type="button" className="botonNegativo">
                  Cancelar
                </Button>
              </Link>
            </Col>
            <Col sm={2} xs={12}>
              <Button
                type="submit"
                onClick={handleSubmit(onSubmit, onError)}
                variant={"contained"}
                className="btn botonPositivo"
              >
                Guardar
              </Button>
            </Col>
          </Row>

          {/* <-----------------------------------------------------------------------------------------------------------> */}
          <hr />
          <br />
          {/* <--------------------------------------------------Información general---------------------------------------> */}

          <Row className="mb-3">
            <Col sm={2} xs={12}>
              <label className="forn-label label">ID del usuario</label>
            </Col>
            <Col sm={2} xs={12}>
              <input
                type="text"
                className="form-control text-center texto"
                placeholder="ID del Usuario"
                {...register("idUsuario")}
                readOnly
                onMouseDown="return false;"
              />
            </Col>
            <Col sm={2} xs={12}>
              <label className="forn-label label">Email</label>
            </Col>
            <Col sm={6} xs={12}>
              <input
                type="text"
                className="form-control text-center texto"
                placeholder="Email del usuario"
                {...register("email")}
              ></input>
            </Col>
            
          </Row>
          <Row className="mb-3">
            <Col sm={2} xs={12}>
              <label className="forn-label label">Compañia</label>
            </Col>
            <Col sm={2} xs={12}>
              <FormSearchListCompania
                control={control}
                name="compañia"
                label="Compañia"
                {...register("compañia")}
              />
            </Col>

            <Col sm={2} xs={12}>
              <label className="forn-label label">Nombre</label>
            </Col>

            <Col sm={6} xs={12}>
              <input
                type="text"
                className="form-control text-center texto"
                placeholder="Nombre del usuario"
                {...register("nombre")}
              ></input>
            </Col>
            
          </Row>
          <Row className="mb-3">
          <Col sm={2} xs={12}>
              <label className="forn-label label">Estado</label>
            </Col>

            <Col sm={2} xs={12}>
              <div
                style={{
                  margin: "auto",
                  display: "block",
                  width: "fit-content",
                }}
              >
                <FormControlLabel
                  control={
                    <Switch
                      checked={state.status}
                      onChange={handleChange}
                      color="primary"
                      name="status"
                    />
                  }                  
                />
              </div>
            </Col>
          </Row>
          
          <Row className="mb-3">
            <Col sm={9} xs={12}>
              <label className="label forn-label">Roles</label>
            </Col>
            <Col sm={2} xs={12}>
              <Button
                type="button"
                onClick={() => {
                  setUserRoles();
                  setShowModal(true);
                }}
                variant={"contained"}
                className="btn botonPositivo"
              >
                Asociar/Desasociar
              </Button>
            </Col>
          </Row>

          <Paper className={classes.root}>
            <TableContainer component={Paper} className={classes.container}>
              <Table className={"text"} aria-label="sticky table">
                {/* Inicio de encabezado */}
                <TableHead className="titulo">
                  <TableRow>
                    <StyledTableCell padding="checkbox"></StyledTableCell>
                    <StyledTableCell>ID Rol</StyledTableCell>
                    <StyledTableCell align="left">
                      Nombre del rol
                    </StyledTableCell>
                    <StyledTableCell align="left">
                      Descripción del rol
                    </StyledTableCell>
                    <StyledTableCell align="left">
                      Población del rol
                    </StyledTableCell>
                  </TableRow>
                </TableHead>
                {/* Fin de encabezado */}
                {/* Inicio de cuerpo de la tabla */}
                <TableBody>
                  {userRols &&
                    userRols.map((row, index) => {
                      return (
                        <StyledTableRow
                          key={row.idrol}
                          hover
                          role="checkbox"
                          tabIndex={-1}
                        >
                          <StyledTableCell
                            component="th"
                            scope="row"
                          ></StyledTableCell>
                          <StyledTableCell component="th" scope="row">
                            {row.idrol !== null ? row.idrol : null}
                          </StyledTableCell>
                          <StyledTableCell align="left">
                            {row.nombre_rol ? row.nombre_rol : null}
                          </StyledTableCell>
                          <StyledTableCell align="left">
                            {row.descripcion_rol ? row.descripcion_rol : null}
                          </StyledTableCell>
                          <StyledTableCell align="left">
                            {row.poblacion ? row.poblacion : null}
                          </StyledTableCell>
                        </StyledTableRow>
                      );
                    })}
                </TableBody>
                {/* Fin de cuerpo de la tabla */}
              </Table>
            </TableContainer>
          </Paper>

          <hr />
          <br />

          {/* <---------------------------------------------- Información Posición-----------------------------------------------> */}

          <Row className="mb-3 mt-3">
            <Col sm={6} xs={12}>
              <h2 className="subtitulo">Información posición</h2>
              <hr />
            </Col>
          </Row>

          <br />
          <Row className="mb-3">
            <Col sm={2} xs={12}>
              <label className="forn-label label">ID posición</label>
            </Col>

            <Col sm={2} xs={12}>
              <input
                type="text"
                id="id_posicion_usuario"
                className="form-control text-center texto"
                placeholder="ID posición"
                {...register("idPosicion")}
              ></input>
            </Col>
            <Col sm={2} xs={8}>
              <button className="btn btn-primary" onClick={searchPosition}>
                Buscar
              </button>
            </Col>

            <Col sm={2} xs={12}>
              <label className="forn-label label">Posición</label>
            </Col>

            <Col sm={2} xs={12}>
              <input
                type="text"
                id="posicion_usuario"
                className="form-control text-center texto"
                defaultValue=""
                placeholder="Posición del usuario"
                {...register("posicion")}
              ></input>
            </Col>
            {!showDisplayR ? (
              <Col sm={1} xs={4}></Col>
            ) : (
              <Col sm={1} xs={4}>
                <button
                  type="button"
                  className="btn botonNegativo"
                  onClick={EliminarRiesgo}
                >
                  Eliminar
                </button>
              </Col>
            )}
          </Row>
          <Row className="mb-3">
            <Col sm={2} xs={12}>
              <label className="forn-label label">Área organizacional</label>
            </Col>
            <Col sm={8} xs={12}>
              <FormSearchListAreaUsua
                control={control}
                id="area_organizacional_usuario"
                defaultValues=""
                name="area_organizacional"
                label="Area organizacional"
                {...register("area_organizacional")}
              />
            </Col>
          </Row>

          <br />
          <hr />
        </FormProvider>
      </Container>
    </>
  );
}
