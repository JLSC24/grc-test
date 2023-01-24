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
import { FormSearchListArea } from "../../form-components/FormSearchListArea";

import Select from "react-select";
import makeAnimated from "react-select/animated";
import { withStyles, makeStyles } from "@material-ui/core/styles";

import { UsuarioContext } from "../../Context/UsuarioContext";



import FormControlLabel from '@material-ui/core/FormControlLabel';
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
      return <Alert variant="success">{alerta.data}</Alert>;

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
  descripcion_rol: null,
  nombre_rol: null,
  poblacion: null,
};

export default function NuevoRol() {
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
  //roles
  const [userRols, setUserRoles] = useState();
  const [state, setState] = React.useState({ status: true });
  const [stateLogin, setStateLogin] = React.useState({ status: true });
  

  

  const [cuentasContables, setCuentasContable] = useState(null);
  const [listaCuentasContables, setListaCuentasContables] = useState(null);

  const [loadingData, setLoadingData] = React.useState(false);

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
    const newRol = {
      descripcion_rol: data.descripcion_rol,
      nombre_rol: data.nombre_rol,
      poblacion: data.poblacion,
    };
    try {
      fetch(`http://127.0.0.1:8000/rol/`, {
        method: "POST",
        headers: {
          Authorization: "Bearer " + serviceAAD.getToken(),
          Accept: "application/json",
          "Content-Type": "application/json; charset=UTF-8"
        },
        body: JSON.stringify(newRol),
      })
        .then((response) => {response.json()
          if(response.status >= 200 && response.status < 300){
            setEstadoPost({id:2, response:response});
          }else if(response.status >= 500){
            setEstadoPost({id:5, response:response});
          }
          else if(response.status >= 400 && response.status < 500){
            setEstadoPost({id:4, response:response});
          }
        }
        )
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const llenarFormulario = async () => {
      try {
        
        setLoadingData(true);
      } catch (error) {
        console.error(error);
      }
    };

    llenarFormulario();
  }, []);

  
  const onError = (errors, e) => console.log(errors);
  

  return (
    <>

      <AlertDismissibleExample alerta={estadoPost} />

      <Container>
        <FormProvider {...methods}>
          {/* <-------------------------------------Titulo-------------------------------------> */}
          <Row className="mb-3 mt-3">
            <Col md={8}>
              <h1 className="titulo">Nuevo Rol</h1>
            </Col>
            <Col sm={2} xs={12}>
              <Link to="./Roles">
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
              <label className="forn-label label">Nombre<sup>*</sup></label>
            </Col>
            <Col sm={4} xs={12}>
              <input
                type="text"
                className="form-control text-center texto"
                placeholder="Nombre"
                {...register("nombre_rol")}
              />
            </Col>
            <Col sm={2} xs={12}>
              <label className="forn-label label">Población<sup>*</sup></label>
            </Col>
            <Col sm={4} xs={12}>
              <input
                type="text"
                className="form-control text-center texto"
                placeholder="Población"
                {...register("poblacion")}
              ></input>
            </Col>
          </Row>
          <Row className="mb-3">
            <Col sm={2} xs={12}>
              <label className="forn-label label">Descripción<sup>*</sup></label>
            </Col>
            <Col sm={10} xs={12}>
            <textarea
                type="text"
                className="form-control text-center texto"
                placeholder="Descripción"
                {...register("descripcion_rol")}
              ></textarea>              
            </Col>
          </Row>
        </FormProvider>
      </Container>
    </>
  );
}
