import React, { useState, useEffect, useContext, forwardRef } from "react";
import { useForm, Controller, useWatch, FormProvider } from "react-hook-form";
import {
  Row,
  Col,
  Form,
  Alert,
  Button,
  Container,
  Modal,
} from "react-bootstrap";

import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import Checkbox from "@material-ui/core/Checkbox";
import { withStyles, makeStyles } from "@material-ui/core/styles";

import { Link, Routes, Route, useHistory, useLocation } from "react-router-dom";
import AADService from "../../auth/authFunctions";

import makeAnimated from "react-select/animated";
import Loader from "react-loader-spinner";
import Select from "react-select";
import axios from "axios";

import { UsuarioContext } from "../../Context/UsuarioContext";

import { FormInputGeografia } from "../../form-components/FormInputGeografia";
import { FormInputLineasNegocio } from "../../form-components/FormInputLineasNegocio";
import { FormInputProducto } from "../../form-components/FormInputProducto";
import { FormInputCanal } from "../../form-components/FormInputCanal";
import { FormInputObjetoCosto } from "../../form-components/FormInputObjetoCosto";
import { FormInputCasosEspeciales } from "../../form-components/FomrInputCasosEspeciales";
import { FormInputOtrosEfectosRelacionados } from "../../form-components/FormInputOtrosEfectosRelacionados";
import { FormInputClasificacionDemanda } from "../../form-components/FormInputClasificacionDemanda";

import { FormInputDate } from "../../form-components/FormInputDate";

import ModalInactivar from "./Modales/ModalInactivar";

import ModalEfectosValoracion from "./Modales/ModalEfectosValoracion";
import { FormSearchListDivisaOrigen } from "../../form-components/FormSearchListDivisaOrigen";

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
  efectoFinanciero: null,
  tipoEfecto: null,
  descripcionEfecto: null,
  geografia: null,
  lineaNegocio: null,
  producto: null,
  canal: null,
  objetoCosto: null,
  casosEspeciales: null,
  otrosEfectos: null,
  divisaOrigen: null,
  valorDivisaOrigen: null,
  infoContable: null,
  fechaContable: null,
  valorFrecuencia: null,
  clasificacionDemanda: null,
  idEfectoValoracion: null,
};

export default function EditarEfecto() {
  const serviceAAD = new AADService();

  const classes = useStyles();

  const history = useHistory();

  const location = useLocation();

  const { dataUsuario } = useContext(UsuarioContext);

  const [idEfectoFinanciero, setIdEfectoFinanciero] = useState(null);
  const [idEventoMaterializado, setIdEventoMaterializado] = useState(null);

  const [estadoPost, setEstadoPost] = useState({
    alerta: { id: 0, data: null },
  });

  const [ListaCompaniasInicial, setListaCompaniasInicial] = useState([]);

  const [listaTipoEfecto, setListaTipoEfecto] = useState([]);
  const [listaTipoEfectoFiltrada, setListaTipoEfectoFiltrada] = useState([]);
  const [listaEfectosFinancieros, setListaEfectoFinancieros] = useState([]);

  const [listaDivisas, setListaDivisas] = useState([]);
  const [monedaCOP, setMonedaCOP] = useState(null);
  const [monedaUSD, setMonedaUSD] = useState(null);

  const [Activo, setActivo] = useState(true);
  const [Inactivar, setInactivar] = useState(false);
  const [motivoInactivacion, setMotivoInactivacion] = useState(null);

  const [dataEfectosValoracion, setDataEfectosValoracion] = useState([]);
  const [showEfectosValoracion, setShowEfectosValoracion] = useState(false);
  const [showInfoContable, setShowInfoContable] = useState(true);
  const [cuentasContables, setCuentasContable] = useState(null);
  const [listaCuentasContables, setListaCuentasContables] = useState(null);

  const [page, setPage] = useState(0);
  const [selected, setSelected] = useState([]);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [ButtonEdit, SetButtonEdit] = useState(false);
  const [dataRecuperacion, setDataRecuperacion] = useState([]);

  const [loadingData, setLoadingData] = React.useState(false);

  const getConversion = () => {
    let dataConversion = {
      divisa_origen: getValues("divisaOrigen").label,
      valor_divisa_origen: parseFloat(getValues("valorDivisaOrigen")),
      fecha_trm: getValues("fechaContable"),
    };

    axios
      .post(process.env.REACT_APP_API_URL + "/convertir_divisa", dataConversion)
      .then((response) => {
        setMonedaCOP(response.data.valor_COP);
        setMonedaUSD(response.data.valor_USD);
      })
      .catch((errors) => {
        console.log(errors.response);
        let msg_error = errors.response.data.message;
        console.log("MENSAJE DE ERROR", msg_error);
        setEstadoPost({
          id: 3,
          data: msg_error,
        });
        setTimeout(() => {
          // if (state === 2) {
          //   history.push("/EditarAreaOrganizacional");
          // }
          setEstadoPost({ id: 0, data: null });
        }, 10000);
      });
  };

  useEffect(() => {
    const llenarFormulario = async () => {
      try {
        //---------------------------------------------------------Manejo de ids...
        console.log("Ubicación de donde provengo : ", location);

        let tempIDefecto = "";

        if (typeof location.state != "undefined") {
          if (
            location.state.idEfectoFinanciero &&
            location.state.idEfectoFinanciero.length > 0
          ) {
            tempIDefecto = location.state.idEfectoFinanciero;

            console.log("ID Efecto Financiero : ", tempIDefecto);

            setIdEfectoFinanciero(tempIDefecto);
          }
        }

        //-----------------------------------------------LLamar a las APIs para traer listas
        const response = await axios.get(
          process.env.REACT_APP_API_URL + "/efecto_financiero/" + tempIDefecto,
          {
            headers: {
              Authorization: "Bearer " + serviceAAD.getToken(),
            },
          }
        );
        const responseCuentaContable = await axios.get(
          process.env.REACT_APP_API_URL + "/maestros_ro/cuenta_contable/",
          {
            headers: {
              Authorization: "Bearer " + serviceAAD.getToken(),
            },
          }
        );
        const responseCompanias = await axios.get(
          process.env.REACT_APP_API_URL + "/maestros_ro/compania/",
          {
            headers: {
              Authorization: "Bearer " + serviceAAD.getToken(),
            },
          }
        );
        const responseTipoEfecto = await axios.get(
          process.env.REACT_APP_API_URL + "/generales/tipo_de_efecto/",
          {
            headers: {
              Authorization: "Bearer " + serviceAAD.getToken(),
            },
          }
        );
        const responseEfectoFinanciero = await axios.get(
          process.env.REACT_APP_API_URL + "/generales/Efecto_financiero/efecto_financiero",
          {
            headers: {
              Authorization: "Bearer " + serviceAAD.getToken(),
            },
          }
        );

        //----------------------------------Llenar los datos del formulario...

        let data = response.data;

        console.log("datos del back : ", data);

        if (
          data.divisa_origen &&
          data.valor_divisa_origen &&
          data.fecha_contable
        ) {
          let convertValue = {
            divisa_origen: data.divisa_origen,
            valor_divisa_origen: parseFloat(data.valor_divisa_origen),
            fecha_trm: new Date(data.fecha_contable),
          };

          try {
            const conversionDivisa = await axios.post(
              process.env.REACT_APP_API_URL + "/convertir_divisa",
              convertValue,
              {
                headers: {
                  Authorization: "Bearer " + serviceAAD.getToken(),
                },
              }
            );

            let dataConversion = conversionDivisa.data;

            setMonedaCOP(dataConversion.valor_COP);
            setMonedaUSD(dataConversion.valor_USD);

            console.log("dataConversion", dataConversion);
          } catch (error) {
            console.log("Error al convertir valor : ", error);
          }
        }

        setIdEventoMaterializado(data.idevento_materializado);

        setValue("efectoFinanciero", {
          value: data.efecto_financiero,
          label: data.efecto_financiero,
        });
        setValue("tipoEfecto", {
          value: data.tipo_efecto,
          label: data.tipo_efecto,
        });

        setValue("descripcionEfecto", data.descripcion_efecto);

        setValue("geografia", {
          value: data.geografia,
          label: data.geografia,
        });
        setValue("lineaNegocio", {
          value: data.linea_negocio,
          label: data.linea_negocio,
        });
        setValue("producto", {
          value: data.nombre_prod,
          label: data.nombre_prod,
        });
        setValue("canal", {
          value: data.nombre_canal,
          label: data.nombre_canal,
        });
        setValue("objetoCosto", {
          value: data.oc_n2,
          label: data.oc_n2,
        });
        setValue("casosEspeciales", {
          value: data.casos_especiales_efectos,
          label: data.casos_especiales_efectos,
        });
        setValue("otrosEfectos", {
          value: data.otros_efectos_relacionados,
          label: data.otros_efectos_relacionados,
        });
        setValue("divisaOrigen", {
          value: data.divisa_origen,
          label: data.divisa_origen,
        });
        setValue("valorDivisaOrigen", data.valor_divisa_origen);

        setValue("companiaContable", {
          value: data.compania_contable,
          label: data.compania_contable,
        });
        setValue("cuentaContable", {
          value: data.num_cuenta_contable,
          label: data.num_cuenta_contable,
        });

        setValue("valorFrecuencia", data.valor_frecuencia);

        setValue("clasificacionDemanda", {
          value: data.clasificacion_demanda,
          label: data.clasificacion_demanda,
        });

        setValue("idEfectoValoracion", data.efecto_valoracion);

        setValue("idEfectoValoracion", data.efecto_valoracion);

        setValue("documentoContable", data.num_documento_contable);

        setValue("fechaContable", new Date(data.fecha_contable));

        // {
        //   riesgo: data.nombre_riesgo,
        //   compania: data.compania_que_reporta,
        //   areaReporta: data.area_que_reporta_n4,
        //   areaOcurrencia: data.area_de_ocurrecnia_n4,
        //   proceso: data.proceso_n4,
        //   fechaInicial: data.primera_fecha_evento,
        //   fechaFinal: data.ultima_fecha_evento,
        //   fechaDescubrimiento: data.fecha_descubrimiento,
        //   asociadoCambio: data.cambio_transformacion,
        //   categoriaCorp1: data.categoria_riesgos_corporativa_n1,
        //   categoriaCorp3: data.categoria_riesgos_corporativa_n3,
        //   categoriaLocal1: data.categoria_riesgos_local_n1,
        //   categoriaLocal3: data.categoria_riesgos_local_n3,
        //   DescCategoriaCorp: data.descripcion_evento,
        //   tipoFalla: data.tipo_de_falla,
        //   afectoConsumidor: data.afecto_consumidor,
        //   otrosRiesgosImpact: data.otros_riesgos_impactados,
        //   idMacroevento: data.idmacroevento,
        //   planesAccion: data.id_plan_accion,
        //   infoAdicional: data.informacion_adicional,
        // }
        //---------------------------------------------Filtrar las opciones de listas según lo que llegó del back

        let efectoFinanciero = responseEfectoFinanciero.data.map(
          ({ idm_parametrosgenerales: value, valor: label }) => ({
            value,
            label,
          })
        );
        let tipoEfecto = responseTipoEfecto.data.map(
          ({ idm_parametrosgenerales: value, valor: label, parametro }) => ({
            value,
            label,
            parametro,
          })
        );

        setListaEfectoFinancieros(efectoFinanciero);

        setListaTipoEfecto(tipoEfecto);

        let companias = responseCompanias.data.map(
          ({ idcompania: value, compania: label, pais }) => ({
            value,
            label,
            pais,
          })
        );
        let cuentasContables = responseCuentaContable.data.map(
          ({
            idcompania: value,
            numero_cuenta: label,
            nombre,
            idcuenta_contable,
            estado,
          }) => ({
            value,
            label,
            nombre,
            idcuenta_contable,
            estado,
          })
        );

        setListaCompaniasInicial(companias);

        setListaCuentasContables(cuentasContables);

        let tempListaTipoEfecto = tipoEfecto.map((tipoEfecto) => {
          let newParametro = tipoEfecto.parametro.replace(/_/g, " ");
          return { ...tipoEfecto, parametro: newParametro };
        });

        let tempListaTipoEfectoFiltrado = tempListaTipoEfecto.filter(
          (tipoEfecto) => {
            return tipoEfecto.parametro === data.efecto_financiero;
          }
        );

        if (data.efectoFinanciero === "Sin asiento contable") {
          setShowInfoContable(false);
        } else {
          setShowInfoContable(true);
        }

        setListaTipoEfectoFiltrada(tempListaTipoEfectoFiltrado);

        let objCompania = companias.filter(
          (compania) => compania.label === data.compania_contable
        );
        console.log("------------------", objCompania);
        let value_compania;
        if (objCompania.length == 0) {
          value_compania = null;
        } else {
          value_compania = objCompania[0].value;
        }

        let cuentasFiltradas = cuentasContables.filter(
          (cuenta) => cuenta.value === value_compania
        );

        setCuentasContable(cuentasFiltradas);

        setDataRecuperacion(data.recuperaciones);

        setLoadingData(true);
      } catch (error) {
        console.error(error);
      }
    };

    const getDivisas = async () => {
      try {
        const response = await axios.get(
          process.env.REACT_APP_API_URL + "/generales/Recuperaciones/divisa_origen",
          {
            headers: {
              Authorization: "Bearer " + serviceAAD.getToken(),
            },
          }
        );
        let data = response.data.map(
          ({ idm_parametrosgenerales: value, valor: label }) => ({
            value,
            label,
          })
        );

        setListaDivisas(data);
      } catch (error) {
        console.error(error);
      }
    };

    getDivisas();
    llenarFormulario();
  }, []);

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

  const onSubmitRecuperacion = (data) => {
    const dataEnviar = {
      id_efecto_financiero: idEfectoFinanciero,

      id_evento_materializado: idEventoMaterializado,

      efecto_financiero: data.efectoFinanciero
        ? data.efectoFinanciero.label
        : null,

      tipo_de_efecto: data.tipoEfecto ? data.tipoEfecto.label : null,

      descripcion_del_efecto: data.descripcionEfecto
        ? data.descripcionEfecto
        : null,

      perdida_en_divisa_origen: data.valorDivisaOrigen
        ? parseInt(data.valorDivisaOrigen)
        : null,

      divisa_origen: data.divisaOrigen ? data.divisaOrigen.label : null,

      fecha_contable: data.fechaContable ? data.fechaContable : null,

      casos_especiales: data.casosEspeciales
        ? data.casosEspeciales.label
        : null,

      otros_efectos_relacionados: data.otrosEfectos
        ? data.otrosEfectos.label
        : null,

      efecto_anulado: Activo ? 0 : 1,

      justificacion_anulacion_efecto: null,

      id_efecto_valoracion: data.idEfectoValoracion
        ? data.idEfectoValoracion
        : null,

      valor_de_la_frecuencia: data.valorFrecuencia,

      clasificacion_de_la_demanda: data.clasificacionDemanda
        ? data.clasificacionDemanda.label
        : null,

      numero_documento_contable: data.documentoContable
        ? data.documentoContable
        : null,

      geografia: data.geografia ? data.geografia.label : null,

      linea_de_negocio: data.lineaNegocio ? data.lineaNegocio.label : null,

      producto: data.producto ? data.producto.label : null,

      canal: data.canal ? data.canal.label : null,

      objeto_de_costo: data.objetoCosto ? data.objetoCosto.label : null,

      compañia_contable: data.companiaContable
        ? data.companiaContable.label
        : null,

      cuenta_contable: data.cuentaContable ? data.cuentaContable.label : null,

      recuperaciones: [
        {
          id_recuperacion: "POST-RE" + idEfectoFinanciero,
          fuente_de_recuperacion: "Diferente de Seguros",
          recuperacion_en_divisa_origen: 100000,
          divisa_origen: "COP",
          fecha_contable: "2020-03-12T00:00:16-05:00",
          informacion_adicional: null,
          recuperacion_anulada: null,
          justificacion_anulacion_recuperacion: null,
          compañia_contable: "Bancolombia",
          cuenta_contable: "2814951011",
        },
      ],
    };

    console.log("Datos prepreocesados: ", data);
    console.log("Datos listos para enviar: ", dataEnviar);

    try {
      axios
        .put(
          process.env.REACT_APP_API_URL + "/efecto_financiero/" + idEfectoFinanciero,
          dataEnviar,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + serviceAAD.getToken(),
            },
          }
        )
        .then(function (response) {
          if (response.status >= 200 && response.status < 300) {
            alert("Guardado con éxito");
            console.log(response.data);
            history.push({
              pathname: "/NuevaRecuperacion",
              state: {
                idEfectoFinanciero: idEfectoFinanciero,
              },
            });
            //setEstadoPost(2);
          } else if (response.status >= 300 && response.status < 400) {
            setEstadoPost(4);
            alert("Error en el servidor");
            console.log(response.data);
          } else if (response.status >= 400 && response.status < 512) {
            setEstadoPost(5);
            alert("Error en el servidor");
            console.log(response);
          }
        })
        .catch((errors) => {
          console.log("CHATCH", errors.response.data);
          let result = JSON.stringify(errors.response.data).split(",");
          let msg = [];
          console.log("RESUTL", result);

          result.map((dato) => {
            msg.push(
              "\n ■" +
                dato
                  .replace("[", "")
                  .replace("]", "")
                  .replace("{", "")
                  .replace("}", "")
                  .replace(".", "")
            );
            return null;
          });
          msg = msg.toString().replace(",", "");
          console.log("MENSAJE", msg);

          setEstadoPost({
            id: 3,
            data: msg,
          });
          setTimeout(() => {
            setEstadoPost({ id: 0, data: null });
          }, 10000);
        });
    } catch (error) {
      console.error(error);
    }
  };

  const onSubmit = (data) => {
    const dataEnviar = {
      id_efecto_financiero: idEfectoFinanciero,

      id_evento_materializado: idEventoMaterializado,

      efecto_financiero: data.efectoFinanciero
        ? data.efectoFinanciero.label
        : null,

      tipo_de_efecto: data.tipoEfecto ? data.tipoEfecto.label : null,

      descripcion_del_efecto: data.descripcionEfecto
        ? data.descripcionEfecto
        : null,

      perdida_en_divisa_origen: data.valorDivisaOrigen
        ? parseInt(data.valorDivisaOrigen)
        : null,

      divisa_origen: data.divisaOrigen ? data.divisaOrigen.label : null,

      fecha_contable: data.fechaContable ? data.fechaContable : null,

      casos_especiales: data.casosEspeciales
        ? data.casosEspeciales.label
        : null,

      otros_efectos_relacionados: data.otrosEfectos
        ? data.otrosEfectos.label
        : null,

      efecto_anulado: Activo ? 0 : 1,

      justificacion_anulacion_efecto: null,

      id_efecto_valoracion: data.idEfectoValoracion
        ? data.idEfectoValoracion
        : null,

      valor_de_la_frecuencia: data.valorFrecuencia,

      clasificacion_de_la_demanda: data.clasificacionDemanda
        ? data.clasificacionDemanda.label
        : null,

      numero_documento_contable: data.documentoContable
        ? data.documentoContable
        : null,

      geografia: data.geografia ? data.geografia.label : null,

      linea_de_negocio: data.lineaNegocio ? data.lineaNegocio.label : null,

      producto: data.producto ? data.producto.label : null,

      canal: data.canal ? data.canal.label : null,

      objeto_de_costo: data.objetoCosto ? data.objetoCosto.label : null,

      compañia_contable: data.companiaContable
        ? data.companiaContable.label
        : null,

      cuenta_contable: data.cuentaContable ? data.cuentaContable.label : null,

      recuperaciones: [
        {
          id_recuperacion: "POST-RE" + idEfectoFinanciero,
          fuente_de_recuperacion: "Diferente de Seguros",
          recuperacion_en_divisa_origen: 100000,
          divisa_origen: "COP",
          fecha_contable: "2020-03-12T00:00:16-05:00",
          informacion_adicional: null,
          recuperacion_anulada: null,
          justificacion_anulacion_recuperacion: null,
          compañia_contable: "Bancolombia",
          cuenta_contable: "2814951011",
        },
      ],
    };

    console.log("Datos prepreocesados: ", data);
    console.log("Datos listos para enviar: ", dataEnviar);

    try {
      axios
        .put(
          process.env.REACT_APP_API_URL + "/efecto_financiero/" + idEfectoFinanciero,
          dataEnviar,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + serviceAAD.getToken(),
            },
          }
        )
        .then(function (response) {
          if (response.status >= 200 && response.status < 300) {
            alert("Guardado con éxito");
            console.log(response.data);
            history.push({
              pathname: "/EditarEfecto",
              state: {
                idEfectoFinanciero: idEfectoFinanciero[0],
              },
            });
            //setEstadoPost(2);
          } else if (response.status >= 300 && response.status < 400) {
            setEstadoPost(4);
            alert("Error en el servidor");
            console.log(response.data);
          } else if (response.status >= 400 && response.status < 512) {
            setEstadoPost(5);
            alert("Error en el servidor");
            console.log(response);
          }
        })
        .catch((errors) => {
          console.log("CHATCH", errors.response.data);
          let result = JSON.stringify(errors.response.data).split(",");
          let msg = [];
          console.log("RESUTL", result);

          result.map((dato) => {
            msg.push(
              "\n ■" +
                dato
                  .replace("[", "")
                  .replace("]", "")
                  .replace("{", "")
                  .replace("}", "")
                  .replace(".", "")
            );
            return null;
          });
          msg = msg.toString().replace(",", "");
          console.log("MENSAJE", msg);

          setEstadoPost({
            id: 3,
            data: msg,
          });
          setTimeout(() => {
            setEstadoPost({ id: 0, data: null });
          }, 10000);
        });
    } catch (error) {
      console.error(error);
    }
  };
  const onError = (errors, e) => console.log(errors, e);

  const InactivarEvento = () => {
    setInactivar((prev) => !prev);
  };

  const ActivarEvento = () => {
    setActivo((prev) => !prev);
  };

  const FiltrarTipoDeEfecto = (objTipoEfecto) => {
    setValue("tipoEfecto", null);

    let tempListaTipoEfecto = listaTipoEfecto.map((tipoEfecto) => {
      let newParametro = tipoEfecto.parametro.replace(/_/g, " ");

      return { ...tipoEfecto, parametro: newParametro };
    });

    let tempListaTipoEfectoFiltrado = [];

    switch (objTipoEfecto.label) {
      case "Contable en cuentas RO":
        tempListaTipoEfectoFiltrado = tempListaTipoEfecto.filter(
          (tipoEfecto) => {
            return tipoEfecto.parametro === "Contable en cuentas RO";
          }
        );
        setShowInfoContable(true);
        break;

      case "Provisionado":
        tempListaTipoEfectoFiltrado = tempListaTipoEfecto.filter(
          (tipoEfecto) => {
            return tipoEfecto.parametro === "Provisionado";
          }
        );
        setShowInfoContable(true);
        break;

      case "Sin asiento contable":
        tempListaTipoEfectoFiltrado = tempListaTipoEfecto.filter(
          (tipoEfecto) => {
            return tipoEfecto.parametro === "Sin asiento contable";
          }
        );
        setShowInfoContable(false);
        setValue("companiaContable", null);
        setValue("cuentaContable", null);
        setValue("documentoContable", null);
        setValue("fechaContable", null);
        break;

      case "Contable en otras cuentas":
        tempListaTipoEfectoFiltrado = tempListaTipoEfecto.filter(
          (tipoEfecto) => {
            return tipoEfecto.parametro === "Contable en otras cuentas";
          }
        );
        setShowInfoContable(true);
        break;

      case "Ingresos":
        tempListaTipoEfectoFiltrado = tempListaTipoEfecto.filter(
          (tipoEfecto) => {
            return tipoEfecto.parametro === "Ingresos";
          }
        );
        setShowInfoContable(true);
        break;

      default:
        break;
    }

    setListaTipoEfectoFiltrada(tempListaTipoEfectoFiltrado);
  };

  const FiltrarCuentas = (e) => {
    setValue("cuentaContable", null);

    let cuentasFiltradas = listaCuentasContables.filter(
      (cuenta) => cuenta.value === e.value
    );

    setCuentasContable(cuentasFiltradas);
  };

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);

    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat([], name);
      SetButtonEdit(true);
    } else {
      SetButtonEdit(false);
    }
    setSelected(newSelected);
    console.log("slected : --->", newSelected);
  };

  const isSelected = (name) => selected.indexOf(name) !== -1;

  return (
    <>
      <Container>
        <FormProvider {...methods}>
          <AlertDismissibleExample alerta={estadoPost} />

          {/* <-------------------------------------Titulo-------------------------------------> */}

          <Row className="mb-3 mt-3">
            <Col md={12}>
              <h1 className="titulo">Efecto: {idEfectoFinanciero}</h1>
            </Col>
          </Row>

          {!loadingData ? (
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
              <Row className="mb-3 mt-3">
                {!!Activo == true ? (
                  <Col sm={2} xs={12}>
                    <Button
                      type="button"
                      className="botonGeneral2"
                      onClick={InactivarEvento}
                    >
                      Inactivar
                    </Button>
                  </Col>
                ) : (
                  <Col sm={2} xs={12}>
                    <Button
                      type="button"
                      className="botonGeneral2"
                      onClick={ActivarEvento}
                    >
                      Activar
                    </Button>
                  </Col>
                )}

                <Col sm={2} xs={12}>
                  <Link to={"/Efectos"}>
                    <Button type="button" className="botonNegativo">
                      Cancelar
                    </Button>
                  </Link>
                </Col>

                <Col sm={2} xs={12}>
                  <Link
                    to={{
                      pathname: "/EditarEvento",
                      state: {
                        idEventoMaterializado: idEventoMaterializado,
                      },
                    }}
                  >
                    <Button type="button" className="botonNegativo3">
                      Regresar
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

                <Col sm={4} xs={12}>
                  <input
                    type="text"
                    className="form-control text-center texto"
                    placeholder="Nuevo Estado del evento"
                    value={!!Activo ? "Activo" : "Inactivo"}
                    disabled
                  />
                </Col>
              </Row>

              <hr />
              <br />

              <Row className="mb-4">
                {!Activo ? (
                  <>
                    <Col sm={2} xs={12}>
                      <label className="forn-label label">
                        Motivo de inactivación
                      </label>
                    </Col>
                    <Col sm={10} xs={12}>
                      <textarea
                        className="form-control text-center"
                        placeholder="Motivo de inactivación"
                        rows="3"
                        value={motivoInactivacion}
                        disabled
                      />
                    </Col>
                  </>
                ) : (
                  <></>
                )}
              </Row>

              {/* <----------------------------------------Formulario----------------------------------------> */}
              <ModalInactivar
                setActivo={setActivo}
                Inactivar={Inactivar}
                setInactivar={setInactivar}
                setMotivoInactivacion={setMotivoInactivacion}
              ></ModalInactivar>

              <ModalEfectosValoracion
                setValue={setValue}
                getValues={getValues}
                dataEfectosValoracion={dataEfectosValoracion}
                setDataEfectosValoracion={setDataEfectosValoracion}
                showEfectosValoracion={showEfectosValoracion}
                setShowEfectosValoracion={setShowEfectosValoracion}
              ></ModalEfectosValoracion>

              {/* <-------------Modal efecto de servicios de valoración-------------------> */}

              <Row className="mb-4">
                <Col sm={2} xs={12}>
                  <label className="forn-label label">ID Evento</label>
                </Col>

                <Col sm={4} xs={12}>
                  <input
                    disabled
                    type="text"
                    value={idEventoMaterializado}
                    className="form-control text-left texto"
                    placeholder="Aqui va el id del evento"
                    {...register("idEvento")}
                  />
                </Col>
              </Row>

              <Row className="mb-4">
                <Col sm={2} xs={12}>
                  <label className="forn-label label">Efecto financiero*</label>
                </Col>
                <Col sm={4} xs={12}>
                  <Controller
                    control={control}
                    name="efectoFinanciero"
                    render={({ field }) => (
                      <Select
                        components={animatedComponents}
                        options={listaEfectosFinancieros}
                        onChange={(e) => {
                          FiltrarTipoDeEfecto(e);
                          field.onChange(e);
                        }}
                        value={field.value}
                        placeholder="Seleccione el efecto financiero"
                      />
                    )}
                    rules={{
                      required: "Te faltó completar este campo",
                    }}
                  />
                </Col>

                <Col sm={2} xs={12}>
                  <label className="forn-label label">Tipo de efecto*</label>
                </Col>

                <Col sm={4} xs={12}>
                  <Controller
                    control={control}
                    name="tipoEfecto"
                    render={({ field }) => (
                      <Select
                        components={animatedComponents}
                        options={listaTipoEfectoFiltrada}
                        onChange={(e) => {
                          field.onChange(e);
                        }}
                        value={field.value}
                        placeholder="Seleccione el tipo de efecto"
                      />
                    )}
                    rules={{
                      required: "Te faltó completar este campo",
                    }}
                  />
                </Col>
              </Row>

              <Row className="mb-4">
                <Col sm={2} xs={12}>
                  <label className="forn-label label">Geografía*</label>
                </Col>
                <Col sm={4} xs={12}>
                  <FormInputGeografia
                    control={control}
                    name="geografia"
                    label="Geografía"
                  />
                </Col>

                <Col sm={2} xs={12}>
                  <label className="forn-label label">Lineas de negocio*</label>
                </Col>

                <Col sm={4} xs={12}>
                  <FormInputLineasNegocio
                    control={control}
                    name="lineaNegocio"
                    label="Lineas de negocio"
                  />
                </Col>
              </Row>

              <Row className="mb-4">
                <Col sm={2} xs={12}>
                  <label className="forn-label label">Producto*</label>
                </Col>

                <Col sm={4} xs={12}>
                  <FormInputProducto
                    control={control}
                    name="producto"
                    label="Producto"
                  />
                </Col>

                <Col sm={2} xs={12}>
                  <label className="forn-label label">Canal*</label>
                </Col>

                <Col sm={4} xs={12}>
                  <FormInputCanal
                    control={control}
                    name="canal"
                    label="Canal"
                  />
                </Col>
              </Row>

              <Row className="mb-4">
                <Col sm={2} xs={12}>
                  <label className="forn-label label">Objeto de costo*</label>
                </Col>

                <Col sm={4} xs={12}>
                  <FormInputObjetoCosto
                    control={control}
                    name="objetoCosto"
                    label="Objeto de costo"
                  />
                </Col>

                <Col sm={2} xs={12}>
                  <label className="forn-label label">Casos especiales</label>
                </Col>

                <Col sm={4} xs={12}>
                  <FormInputCasosEspeciales
                    control={control}
                    name="casosEspeciales"
                    label="Casos especiales"
                  />
                </Col>
              </Row>

              <Row className="mb-4">
                <Col sm={2} xs={12}>
                  <label className="forn-label label">
                    Otros efectos relacionados
                  </label>
                </Col>

                <Col sm={4} xs={12}>
                  <FormInputOtrosEfectosRelacionados
                    control={control}
                    name="otrosEfectos"
                    label="Otros efectos relacionados"
                  />
                </Col>

                <Col sm={3} xs={4}>
                  <label className="forn-label label">
                    ID Efecto de valoración
                  </label>
                </Col>

                <Col sm={2} xs={12}>
                  <input
                    type="text"
                    className="form-control text-center texto"
                    placeholder="ID del riesgo"
                    {...register("idEfectoValoracion")}
                  />
                </Col>
                <Col sm={1} xs={12}>
                  <button
                    type="button"
                    class="btn btn-primary btn-md"
                    onClick={() => setShowEfectosValoracion(true)}
                  >
                    Asociar
                  </button>
                </Col>
              </Row>

              <Row className="mb-4">
                <Col sm={2} xs={12}>
                  <label className="forn-label label">
                    Descripción del efecto
                  </label>
                </Col>
                <Col sm={10} xs={12}>
                  <textarea
                    className="form-control text-center"
                    placeholder="Descripción del efecto"
                    rows="3"
                    {...register("descripcionEfecto")}
                  />
                </Col>
              </Row>

              {/* <------------------------------------- Información financiera y contable -------------------------------------> */}

              <Row className="mb-3 mt-3">
                <Col sm={6} xs={12}>
                  <h2 className="subtitulo">
                    Información financiera y contable
                  </h2>
                  <hr />
                </Col>
              </Row>

              <Row className="mb-4">
                <Col sm={2} xs={12}>
                  <label className="forn-label label">Moneda origen*</label>
                </Col>

                <Col sm={4} xs={12}>
                  <FormSearchListDivisaOrigen
                    name="divisaOrigen"
                    control={control}
                    label="Ingrese el divisa"
                  />

                  <p>{errors.proceso?.message}</p>
                </Col>

                <Col sm={2} xs={12}>
                  <label className="forn-label label">
                    Valor en moneda origen*​
                  </label>
                </Col>
                <Col sm={4} xs={12}>
                  <Controller
                    control={control}
                    name="valorDivisaOrigen"
                    render={({ field: { onChange, value } }) => (
                      <input
                        type="number"
                        className="form-control text-center texto"
                        placeholder="Valor de la frecuencia"
                        onChange={onChange}
                        value={value}
                      />
                    )}
                    rules={{
                      required: "Te faltó completar este campo",
                    }}
                  />
                </Col>
              </Row>

              <Row className="mb-4">
                <Col sm={2} xs={12}>
                  <label className="forn-label label">Valor en COP:​</label>
                </Col>
                <Col sm={4} xs={12}>
                  <input
                    type="number"
                    className="form-control text-center texto"
                    placeholder="COP"
                    value={monedaCOP}
                    disabled
                  />
                </Col>

                <Col sm={2} xs={12}>
                  <label className="forn-label label">Valor en USD:​</label>
                </Col>
                <Col sm={4} xs={12}>
                  <input
                    type="number"
                    className="form-control text-center texto"
                    placeholder="USD"
                    value={monedaUSD}
                    disabled
                  />
                </Col>
              </Row>

              {/* <------------------------------------- Información contable-------------------------------------> */}

              {!!showInfoContable ? (
                <>
                  <Row className="mb-3 mt-3">
                    <Col sm={2} xs={12}>
                      <label className="forn-label label">
                        Compañia contable
                      </label>
                    </Col>
                    <Col sm={4} xs={12}>
                      <Controller
                        control={control}
                        name={"companiaContable"}
                        render={({ field }) => (
                          <Select
                            components={animatedComponents}
                            options={ListaCompaniasInicial}
                            placeholder="Seleccione la compañia"
                            onChange={(e) => {
                              FiltrarCuentas(e);
                              field.onChange(e);
                            }}
                            value={field.value}
                          />
                        )}
                        rules={{
                          required: "Te faltó completar este campo",
                        }}
                      />
                    </Col>

                    <Col sm={2} xs={12}>
                      <label className="forn-label label">
                        Cuenta contable
                      </label>
                    </Col>

                    <Col sm={4} xs={12}>
                      <Controller
                        control={control}
                        name={"cuentaContable"}
                        render={({ field }) => (
                          <Select
                            components={animatedComponents}
                            options={cuentasContables}
                            placeholder="Seleccione la compañia"
                            onChange={(e) => {
                              field.onChange(e);
                            }}
                            value={field.value}
                          />
                        )}
                        rules={{
                          required: "Te faltó completar este campo",
                        }}
                      />
                    </Col>
                  </Row>

                  <Row className="mb-4">
                    <Col sm={2} xs={12}>
                      <label className="forn-label label">
                        Documento contable
                      </label>
                    </Col>

                    <Col sm={4} xs={12}>
                      <input
                        type="text"
                        className="form-control text-center texto"
                        placeholder=""
                        {...register("documentoContable")}
                      />
                    </Col>

                    <Col sm={2} xs={12}>
                      <label className="forn-label label">
                        Fecha contable:
                      </label>
                    </Col>

                    <Col sm={2} xs={12}>
                      <FormInputDate
                        control={control}
                        name="fechaContable"
                        label="Fecha contable"
                      />
                    </Col>

                    <Col sm={2} xs={12}>
                      <button
                        type="button"
                        class="btn btn-primary btn-md"
                        onClick={getConversion}
                      >
                        Convertir divisa
                      </button>
                    </Col>
                  </Row>
                </>
              ) : (
                <></>
              )}

              <br />

              {/* <------------------------------------- Campos de uso para Panamá:​-------------------------------------> */}

              <Row className="mb-3 mt-3">
                <Col sm={4} xs={12}>
                  <h2 className="subtitulo">Campos de uso para Panamá​</h2>
                  <hr />
                </Col>
              </Row>

              <Row className="mb-4">
                <Col sm={2} xs={12}>
                  <label className="forn-label label">
                    Valor de la frecuencia
                  </label>
                </Col>
                <Col sm={4} xs={12}>
                  <input
                    type="number"
                    className="form-control text-center texto"
                    placeholder="Valor de la frecuencia"
                    {...register("valorFrecuencia")}
                  />
                </Col>

                <Col sm={2} xs={12}>
                  <label className="forn-label label">
                    Clasificación de la demanda
                  </label>
                </Col>

                <Col sm={4} xs={12}>
                  <FormInputClasificacionDemanda
                    control={control}
                    name="clasificacionDemanda"
                    label="Clasificación de la demanda"
                    {...register("clasificacionDemanda")}
                  />
                </Col>
              </Row>

              <br />

              {/* <-------------------------------------RECUPERACIONES-------------------------------------> */}

              {/* <-------------------------------------Botones-------------------------------------> */}

              <Row className="mb-3 mt-3">
                <Col sm={7} xs={12}></Col>
                <Col sm={3} xs={12}>
                  <Button
                    type="submit"
                    onClick={handleSubmit(onSubmitRecuperacion, onError)}
                    variant={"contained"}
                    className="btn botonPositivo"
                  >
                    Nueva recuperación
                  </Button>
                </Col>

                {!!ButtonEdit ? (
                  <Col sm={2} xs={12}>
                    <Link
                      to={{
                        pathname: "/EditarRecuperacion",
                        state: {
                          idRecuperacion: selected[0],
                        },
                      }}
                    >
                      <Button
                        type="submit"
                        variant={"contained"}
                        className="btn botonNegativo"
                      >
                        Editar
                      </Button>
                    </Link>
                  </Col>
                ) : (
                  <></>
                )}
              </Row>

              {/* <----------------------------------------------------------------------> */}

              <Row className="mb-4">
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
                          <StyledTableCell>ID recuperación</StyledTableCell>
                          <StyledTableCell align="left">
                            Fuente de recuperación
                          </StyledTableCell>
                          <StyledTableCell align="left">
                            Moneda origen
                          </StyledTableCell>
                          <StyledTableCell align="left">
                            Recuperación divisa origen
                          </StyledTableCell>
                          <StyledTableCell align="left">
                            Compañía contable
                          </StyledTableCell>
                          <StyledTableCell align="left">
                            Cuenta contable
                          </StyledTableCell>
                          <StyledTableCell align="left">
                            Fecha contable
                          </StyledTableCell>
                          <StyledTableCell align="left">
                            Información adicional
                          </StyledTableCell>
                          <StyledTableCell align="left">Estado</StyledTableCell>
                          <StyledTableCell align="left">
                            Justificación anulación
                          </StyledTableCell>
                        </TableRow>
                      </TableHead>
                      {/* Fin de encabezado */}
                      {/* Inicio de cuerpo de la tabla */}
                      <TableBody>
                        {dataRecuperacion
                          .slice(
                            page * rowsPerPage,
                            page * rowsPerPage + rowsPerPage
                          )
                          .map((row, index) => {
                            const isItemSelected = isSelected(
                              row.idrecuperacion
                            );
                            return (
                              <StyledTableRow
                                key={row.idrecuperacion}
                                hover
                                onClick={(event) =>
                                  handleClick(event, row.idrecuperacion)
                                }
                                selected={isItemSelected}
                                role="checkbox"
                                tabIndex={-1}
                              >
                                <StyledTableCell component="th" scope="row">
                                  <Checkbox checked={isItemSelected} />
                                </StyledTableCell>
                                <StyledTableCell component="th" scope="row">
                                  {row.idrecuperacion}
                                </StyledTableCell>
                                <StyledTableCell align="left">
                                  {row.fuente_recuperacion}
                                </StyledTableCell>
                                <StyledTableCell align="left">
                                  {row.divisa_origen_recuperacion}
                                </StyledTableCell>
                                <StyledTableCell align="left">
                                  {row.recuperacion_divisa_origen}
                                </StyledTableCell>
                                <StyledTableCell align="left">
                                  {row.compania_contable_recuperacion}
                                </StyledTableCell>
                                <StyledTableCell align="left">
                                  {row.cuenta_contable_recuperacion}
                                </StyledTableCell>
                                <StyledTableCell align="left">
                                  {new Date(
                                    row.fecha_contable_recuperacion
                                  ).toLocaleDateString()}
                                </StyledTableCell>
                                <StyledTableCell align="left">
                                  {row.informacion_adicional}
                                </StyledTableCell>
                                <StyledTableCell align="left">
                                  {row.recuperacion_anulada == 1
                                    ? "Inactiva"
                                    : "Activa"}
                                </StyledTableCell>
                                <StyledTableCell align="left">
                                  {row.justificacion_anulacion_recuperacion}
                                </StyledTableCell>
                              </StyledTableRow>
                            );
                          })}
                      </TableBody>
                      {/* Fin de cuerpo de la tabla */}
                    </Table>
                  </TableContainer>
                </Paper>
              </Row>

              {/* <-------------------------------------  Encabezado ​-------------------------------------> */}

              <br />
              <hr />

              <Row className="mb-3 mt-3">
                {!!Activo == true ? (
                  <Col sm={2} xs={12}>
                    <Button
                      type="button"
                      className="botonGeneral2"
                      onClick={InactivarEvento}
                    >
                      Inactivar
                    </Button>
                  </Col>
                ) : (
                  <Col sm={2} xs={12}>
                    <Button
                      type="button"
                      className="botonGeneral2"
                      onClick={ActivarEvento}
                    >
                      Activar
                    </Button>
                  </Col>
                )}

                <Col sm={2} xs={12}>
                  <Link to={"/Efectos"}>
                    <Button type="button" className="botonNegativo">
                      Cancelar
                    </Button>
                  </Link>
                </Col>

                <Col sm={2} xs={12}>
                  <Link
                    to={{
                      pathname: "/EditarEvento",
                      state: {
                        idEventoMaterializado: idEventoMaterializado,
                      },
                    }}
                  >
                    <Button type="button" className="botonNegativo3">
                      Regresar
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
              <br />

              <Row className="mb-3 mt-3">
                <Col sm={12} xs={12}>
                  <h1 className="titulo">Efecto: {idEfectoFinanciero}</h1>
                </Col>
              </Row>

              <Row className="mb-4">
                <br />
              </Row>
              <Row className="mb-4">
                <br />
              </Row>
              <Row className="mb-4">
                <br />
              </Row>
            </>
          )}
        </FormProvider>
      </Container>
    </>
  );
}
