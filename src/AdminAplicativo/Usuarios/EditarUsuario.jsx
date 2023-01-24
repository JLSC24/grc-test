import React, { useState, useEffect, useContext } from "react";
import AADService from "../../auth/authFunctions";
import axios from "axios";
import { Link, useHistory, useLocation } from "react-router-dom";
import DateObject from "react-date-object";

import MaterialTable from "material-table";
import { forwardRef } from "react";
import Check from "@material-ui/icons/Check";
import Clear from "@material-ui/icons/Clear";
import Edit from "@material-ui/icons/Edit";
import Loader from "react-loader-spinner";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";

import { Row, Col, Form, Alert, Button, Container } from "react-bootstrap";

import { useForm, Controller, useWatch, FormProvider } from "react-hook-form";

import { FormInputDate } from "../../form-components/FormInputDate";
import { FormSearchListFuenteRecuperacion } from "../../form-components/FormSearchListFuenteRecuperacion";

import { FormSearchListCompania } from "../../form-components/FormSearchListCompania";
import { FormSearchListAreaUsua } from "../../form-components/FormSearchListAreaUsua";

import Select from "react-select";
import makeAnimated from "react-select/animated";
import { withStyles, makeStyles } from "@material-ui/core/styles";

import { UsuarioContext } from "../../Context/UsuarioContext";

import ModalRoles from "./Modales/ModalRoles";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";

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
      return <Alert variant="success">Editado con éxito</Alert>;

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

export default function EditarUsuario() {
  const classes = useStyles();
  const serviceAAD = new AADService();

  const [estadoPost, setEstadoPost] = useState({
    alerta: { id: 0, data: null },
  });

  const history = useHistory();

  const location = useLocation();

  const [Activo, setActivo] = useState(true);
  const [Inactivar, setInactivar] = useState(false);
  const [motivoInactivacion, setMotivoInactivacion] = useState(null);

  const [idUsuario, setIdUsuario] = useState(null);
  const [idEfectoFinanciero, setIdEfectoFinanciero] = useState(null);

  const [estadoRecuperacion, setEstadoRecuperacion] = useState(null);

  const [ListaCompaniasInicial, setListaCompaniasInicial] = useState([]);

  const [listaDivisas, setListaDivisas] = useState([]);

  const [monedaCOP, setMonedaCOP] = useState(null);
  const [monedaUSD, setMonedaUSD] = useState(null);
  const [showDisplayR, setShowDisplayR] = useState(false);
  const [dataInfoPosition, setDataInfoPosition] = useState();
  const [selected, setSelected] = useState([]);
  const [dataR, setDataR] = useState([]);
  const [dataUser, setDataUser] = React.useState([]);
  //roles
  const [userRols, setUserRoles] = useState();
  const [state, setState] = React.useState({ status: true });
  const [stateLogin, setStateLogin] = React.useState({ status: true });

  //modal roles
  const [showModal, setShowModal] = useState(false);

  const [cuentasContables, setCuentasContable] = useState(null);
  const [listaCuentasContables, setListaCuentasContables] = useState(null);

  const [loadingData, setLoadingData] = React.useState(false);

  const defaultValues = {
    email: null,
    idPosicion: null,
    idusuario: null,
    nombre: null,
    posicion: null,
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
    var editerUser = {
      idusuario: data.idusuario,
      email: data.email,
      nombre: data.nombre,
      idrol: 5,
      roles: userRols.map((rol) => {
        let tempdata = [];
        tempdata.push(rol.idrol);
        return tempdata[0];
      }),
      idcompania: data.compania.value,
      estado_usuario: 1,
      estado_login: 1,
      numero_persona: 123,
    };

    try {
      fetch(`http://127.0.0.1:8000/usuario/${data.email}/`, {
        method: "PUT",
        headers: {
          Authorization: "Bearer " + serviceAAD.getToken(),
          Accept: "application/json",
          "Content-Type": "application/json; charset=UTF-8",
        },
        body: JSON.stringify(editerUser),
      }).then((response) =>
        response.json().then((result) => {
          if (response.status >= 200 && response.status < 300) {
            setEstadoPost({ id: 2, response: response });
          } else if (response.status >= 500) {
            setEstadoPost({ id: 5, response: response });
          } else if (response.status >= 400 && response.status < 500) {
            setEstadoPost({ id: 4, response: response });
          }
          console.log("result", result);
          const insertPosition = {
            idusuario: result.idusuario,
            idposicion: data.idPosicion,
            idarea_organizacional: data.area_organizacional.value,
            area_organizacional: data.area_organizacional.label,
            nombreposicion: data.posicion,
            estadoposicion: 1,
          };
          console.log("insertPosition", insertPosition);
          fetch(`http://127.0.0.1:8000/posicion/${data.idPosicion}`, {
            method: "PUT",
            headers: {
              Authorization: "Bearer " + serviceAAD.getToken(),
              Accept: "application/json",
              "Content-Type": "application/json; charset=UTF-8",
            },
            body: JSON.stringify(insertPosition),
          });
        })
      );
    } catch (error) {
      console.error(error);
    }
  };
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
    const llenarFormulario = async () => {
      try {
        //---------------------------------------------------------Manejo de ids...
        // console.log("Ubicación de donde provengo : ", location);

        let tempEmail = "";

        if (typeof location.state != "undefined") {
          if (location.state.email && location.state.email.length > 0) {
            tempEmail = location.state.email;

            setIdUsuario(tempEmail);
          }
          //setValue({});
        }

        //-----------------------------------------------LLamar a las APIs para traer listas

        const response = await axios.get(
          process.env.REACT_APP_API_URL + "/admin_usuario/" + tempEmail + "/",
          {
            headers: {
              Authorization: "Bearer " + serviceAAD.getToken(),
            },
          }
        );

        let data = response.data;

        // console.log("datos del back : ", data);

        setUserRoles(data.roles);

        setDataUser(data);

        setValue("email", data.email);
        setValue("nombre", data.nombre);
        setValue("idPosicion", data.idposicion);
        setValue("posicion", data.nombreposicion);
        setValue("idusuario", data.idusuario);
        setLoadingData(true);

        setValue("compania", {
          value: data.idcompania,
          label: data.compania,
        });
        setValue("area_organizacional", {
          value: data.idarea_organizacional,
          label: data.area_organizacional,
        });
      } catch (error) {
        console.error(error);
      }
    };

    llenarFormulario();
  }, []);

  // Change State Function
  const handleChange = (event) => {
    setState({ ...state, [event.target.name]: event.target.checked });
    setStateLogin({ ...stateLogin, [event.target.name]: event.target.checked });
  };

  const onError = (errors, e) => console.log(errors);
  const EliminarRiesgo = () => {
    if (selected.length > 0) {
      setDataR([]);

      setValue("idRiesgo", "");

      setShowDisplayR(false);
    }
  };

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
              <h1 className="titulo">Editar usuario</h1>
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
                value={dataUser.idusuario}
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
                // value={dataUser.email}
                // onChange={(e)=>{
                //   setEmail(e.target.value)
                // }}
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
                name="compania"
                label="Compañia"
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
                // value={dataUser.idposicion}
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
                name="area_organizacional"
                label="Area organizacional"
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
