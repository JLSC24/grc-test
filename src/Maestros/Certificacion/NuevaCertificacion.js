import React, { useState, useEffect } from "react";
import { Row, Col, Form, Alert } from "react-bootstrap";
import Switch from "@material-ui/core/Switch";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import { Link, useHistory } from "react-router-dom";
import { Treebeard } from "react-treebeard";
import Loader from "react-loader-spinner";
import Select from "react-select";
import axios from "axios";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import AADService from "../../auth/authFunctions";

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

const sector = [
  { value: "Agricultura", label: "Agricultura" },
  { value: "Alimentación", label: "Alimentación" },
  { value: "Comercio", label: "Comercio" },
  { value: "Construcción", label: "Construcción" },
  { value: "Educación", label: "Educación" },
  {
    value: "Fabricación de material de transporte",
    label: "Fabricación de material de transporte",
  },
  { value: "Función pública", label: "Función pública" },
  { value: "Hotelería y turismo", label: "Hotelería y turismo" },
  { value: "Industrias químicas", label: "Industrias químicas" },
  {
    value: "Ingeniería mecánica y eléctrica",
    label: "Ingeniería mecánica y eléctrica",
  },
  { value: "Medios de comunicación", label: "Medios de comunicación" },
  { value: "Minería", label: "Minería" },
  {
    value: "Petróleo y producción de gas",
    label: "Petróleo y producción de gas",
  },
  {
    value: "Producción de metales básicos",
    label: "Producción de metales básicos",
  },
  { value: "Salud", label: "Salud" },
  { value: "Servicios financieros", label: "Servicios financieros" },
  { value: "Servicios públicos", label: "Servicios públicos" },
  { value: "Silvicultura", label: "Silvicultura" },
  { value: "Telecomunicaciones", label: "Telecomunicaciones" },
  { value: "Textiles", label: "Textiles" },
  { value: "Transporte", label: "Transporte" },
  { value: "Transporte marítimo", label: "Transporte marítimo" },
];

export default function NuevaCertificacion(props) {
  const serviceAAD = new AADService();
  const [state, setState] = useState("Activo");
  const [idState, setIdState] = useState(true);
  const [responsable, setResponsable] = useState([]);
  const [responsableSelected, setResponsableSelected] = useState([]);
  const [fechaVigencia, setFechaVigencia] = useState(null);
  const [estadoPost, setEstadoPost] = useState({
    alerta: { id: 0, data: null },
  });
  const [habilitarBoton, setHabilitarBoton] = React.useState(true);
  let history = useHistory();

  useEffect(() => {
    async function getUsuarios() {
      const response_BO = await axios.get(
        process.env.REACT_APP_API_URL + "/usuariosrol/0/2",
        {
          headers: {
            Authorization: "Bearer " + serviceAAD.getToken(),
          },
        }
      );
      let dataBO = response_BO.data;

      let temp = [];
      dataBO.map((dat) => {
        temp.push({
          value: dat.idposicion,
          label: dat.nombre,
          rol: dat.perfil,
        });
        return null;
      });
      setResponsable(temp);
    }

    getUsuarios();
  }, []);

  const handleChangeState = (event) => {
    if (state === "Activo") {
      setState("Inactivo");
      setIdState(false);
    } else {
      setState("Activo");
      setIdState(true);
    }
  };

  const sendData = (e) => {
    e.preventDefault();
    setHabilitarBoton(false);

    async function limpiar(state) {
      setTimeout(() => {
        // if (state === 2) {
        //   history.push("/EditarAreaOrganizacional");
        // }
        setHabilitarBoton(true);
        setEstadoPost({ id: 0, data: null });
      }, 3000);
    }

    function redirigir(_callback) {
      _callback();
      setTimeout(() => {
        history.push("/EditarGeografia");
      }, 2500);
    }

    const data = null;

    fetch(process.env.REACT_APP_API_URL + "/maestros_ro/geografia/", {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
        Authorization: "Bearer " + serviceAAD.getToken(),
      },
    })
      .then((data) =>
        data.json().then((response) => {
          if (data.status >= 200 && data.status < 300) {
            setEstadoPost({ id: 2, data: data });
            localStorage.setItem("idGeografia", response.idgeografia);
            limpiar();
            redirigir(() => {});
          } else if (data.status >= 500) {
            setEstadoPost({ id: 5, data: response });
            limpiar();
          } else if (data.status >= 400 && data.status < 500) {
            setEstadoPost({ id: 4, data: response });
            limpiar();
          }
        })
      )
      .catch(function (err) {
        console.error(err);
      });
  };
  return (
    <>
      <AlertDismissibleExample alerta={estadoPost} />
      <Row className="mb-3">
        <Col md={12}>
          <h1 className="titulo">Creación de una nueva Certificación</h1>
        </Col>
      </Row>
      <Form id="formData" onSubmit={(e) => sendData(e)}>
        <Row className="mb-3">
          <Col sm={4} xs={12}>
            <label className="label forn-label">ID certificación</label>
          </Col>
          <Col sm={8} xs={12}>
            <input
              type="text"
              disabled
              className="form-control text-center texto"
              placeholder="ID Automático"
              id="IDcertificacion"
            ></input>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col sm={4} xs={12}>
            <label className="form-label label">Tipo certificación*</label>
          </Col>
          <Col sm={8} xs={10}>
            <select className="form-control texto" id="tipoCertificacion">
              <option value="">Seleccione tipo certificación</option>
              <option value="SSAE-18">SSAE-18</option>
            </select>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col sm={4} xs={12}>
            <label className="form-label label">Fecha de vigencia*</label>
          </Col>
          <Col sm={8} xs={12}>
            <DatePicker
              className="form-control"
              selected={fechaVigencia}
              onChange={(date) => setFechaVigencia(date)}
              id="fechaVigencia"
              required
            ></DatePicker>
            <Form.Control.Feedback type="invalid">
              Por favor introduzca un nombre.
            </Form.Control.Feedback>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col sm={4} xs={12}>
            <label className="form-label label">Entidad que da el aval*</label>
          </Col>
          <Col sm={8} xs={12}>
            <input
              type="text"
              className="form-control text-center texto"
              placeholder="Entidad que da el aval"
              required
              id="EntidadAval"
            ></input>
            <Form.Control.Feedback type="invalid">
              Por favor introduzca un nombre.
            </Form.Control.Feedback>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col sm={4} xs={12}>
            <label className="form-label label">Adjunto</label>
          </Col>
          <Col sm={8} xs={12}>
            <input type="file" name="files" accept=".xlsx,.csv"></input>
            <Form.Control.Feedback type="invalid">
              Por favor introduzca un nombre.
            </Form.Control.Feedback>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col sm={4} xs={12}>
            <label className="form-label label">Estado</label>
          </Col>
          <Col sm={8} xs={12}>
            <input
              type="text"
              className="form-control text-center texto"
              placeholder="Automático"
              required
              disabled
              id="Estado"
            ></input>
            <Form.Control.Feedback type="invalid">
              Por favor introduzca un nombre.
            </Form.Control.Feedback>
          </Col>
        </Row>

        {/* Campos para todas las vistas de los maestros */}
        {props.permisos.inactivar ? (
          <Row className="mb-3">
            <Col sm={4} xs={4}>
              <label className="forn-label label">Estado</label>
            </Col>
            <Col>
              <FormControlLabel
                id="switch"
                className="texto"
                control={<Switch checked={idState} />}
                label={state}
                onChange={handleChangeState}
                name="Estado"
              />
            </Col>
          </Row>
        ) : null}

        <Row className="mb-3">
          <Col sm={4} xs={0}></Col>
          <Col>
            <div className="form-text">* Campos obligatorios</div>
          </Col>
        </Row>
        <Row className="mb-3">
          <Col sm={4} xs={1}></Col>
          {habilitarBoton ? (
            <>
              <Col sm={3} xs={3}>
                {props.permisos.crear ? (
                  <button type="submit" className="btn botonPositivo" id="send">
                    Guardar
                  </button>
                ) : null}
              </Col>
            </>
          ) : (
            <Col className="col-auto" sm={3} xs={3}>
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

          <Col sm={3} xs={3}>
            <Link to="Certificacion">
              <button type="button" className="btn botonNegativo">
                Descartar
              </button>
            </Link>
          </Col>
        </Row>
        <Row className="mb-5 mt-5">
          <br></br>
        </Row>
      </Form>
    </>
  );
}
