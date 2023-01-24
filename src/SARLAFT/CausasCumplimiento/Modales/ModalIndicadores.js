import axios from "axios";
import AADService from "../../../auth/authFunctions";
import React, { useState, useEffect } from "react";
import { useForm, Controller, FormProvider } from "react-hook-form";
import { Row, Col, Button, Container, Modal } from "react-bootstrap";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableRow from "@material-ui/core/TableRow";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableContainer from "@material-ui/core/TableContainer";

import Select from "react-select";
import makeAnimated from "react-select/animated";

import { forwardRef } from "react";
import MaterialTable from "material-table";
import Check from "@material-ui/icons/Check";
import Clear from "@material-ui/icons/Clear";
import Edit from "@material-ui/icons/Edit";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";

const animatedComponents = makeAnimated();

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

export default function ModalIndicadores(props) {
  const serviceAAD = new AADService();
  const classes = useStyles();
  const [estadoPost, setEstadoPost] = useState({
    alerta: { id: 0, data: null },
  });
  const [ID, setID] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const [flagListaTipologias, setFlagListaTipologias] = useState(false);
  const [listaTipologias, setListaTipologias] = useState([]);
  const [causasAsociadas, setCausasAsociadas] = useState([]);

  const [dataGrid, setDataGrid] = useState([]);

  const [flagUmbral, setFlagUmbral] = useState(false);

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

  const defaultValues = {
    id: null,
    formula: null,
    umbral: null,
    descripcion: null,
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
    reset,
    formState: { errors },
  } = methods;

  const onSubmit = async (data) => {
    let config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + serviceAAD.getToken(),
      },
    };
    let dataEnviar = {
      estado: 1,
      origen: data.origen ? data.origen.label : null,
      id_equivalente_informe: data.idEquivalente ? data.idEquivalente : null,
      version_informe: data.version ? data.version : null,
      tipologia: data.tipologia ? data.tipologia : null,
      descripcion: data.descripcion ? data.descripcion : null,
      nivel: data.nivel ? data.nivel.label : null,
      tipologia_n1: data.tipologiaN1 ? data.tipologiaN1.label : null,
    };

    console.log("Datos a enviar al back", dataEnviar);

    let response;

    try {
      if (!!isEditing) {
        dataEnviar.idtipologias = data.id;
        dataEnviar.estado = data.estado.value;
        response = await axios.put(
          process.env.REACT_APP_API_URL + "/tipologias/" + data.id,
          dataEnviar,
          config
        );
      } else {
        response = await axios.post(
          process.env.REACT_APP_API_URL + "/tipologias",
          dataEnviar,
          config
        );
      }
    } catch (error) {
      console.error(error);
    }
    if (response.status >= 200 && response.status < 300) {
      alert("Guardado con éxito");

      let index = props.dataTipologias.findIndex(
        (obj) => obj.idtipologias === data.id
      );
      props.dataTipologias.splice(index, 1, dataEnviar);
      reset();

      props.onHide();
    } else if (response.status >= 300 && response.status < 400) {
      setEstadoPost(4);
    } else if (response.status >= 400 && response.status < 512) {
      setEstadoPost(5);
    }
  };

  const onError = (errors) => {
    console.log(errors);
  };

  useEffect(() => {
    //---------------------- Listas  ---------------------
    let config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + serviceAAD.getToken(),
      },
    };

    let APIS = [fetch(process.env.REACT_APP_API_URL + "/tipologias", config)];

    Promise.all(APIS)
      .then(async ([tipologias, causas]) => {
        const list = await tipologias.json();

        let lista = list.map(
          ({ idtipologias: value, tipologia: label, nivel }) => ({
            value,
            label,
            nivel,
          })
        );

        let listaN1 = lista.filter((item) => item.nivel === 1);
        setListaTipologias(listaN1);

        const listcausas = await causas.json();

        let listaCausas = listcausas.map(
          ({ idtipologias: value, idcausa: label, nivel }) => ({
            value,
            label,
          })
        );

        let filteredList = listaCausas.filter(
          (item) => item.idtipologias == ID
        );

        console.log(filteredList);

        setCausasAsociadas(filteredList);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    if (Array.isArray(props.dataIndicadores)) {
      if (props.selected[0]) {
        axios
          .get(process.env.REACT_APP_API_URL + "/rxcausatipologias/" + props.selected[0], {
            headers: {
              Authorization: "Bearer " + serviceAAD.getToken(),
            },
          })
          .then((response) => {
            setCausasAsociadas(response.data);
          });

        props.dataIndicadores.forEach((obj) => {
          setIsEditing(true);

          if (obj.idtipologias === props.selected[0]) {
            setValue("id", obj.idtipologias);

            setID(obj.idtipologias);

            setValue("descripcion", obj.descripcion);

            if (obj.estado == 1) {
              setValue("estado", { value: obj.estado, label: "Activo" });
            } else {
              setValue("estado", { value: obj.estado, label: "Inactivo" });
            }
          }
        });
      } else {
        reset();
      }
    }
  }, [props.selected]);

  return (
    <FormProvider {...methods}>
      <Modal
        {...props}
        aria-labelledby="contained-modal-title-vcenter"
        centered
        backdrop="static"
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Indicadores de probabilidad
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="show-grid">
          <Container>
            {!!isEditing ? (
              <Row className="mb-4">
                <Col sm={2} xs={12}>
                  <label className="forn-label label">ID Indicador</label>
                </Col>
                <Col sm={4} xs={12}>
                  <input
                    {...register("id")}
                    disabled
                    type="text"
                    className="form-control text-center texto"
                    placeholder="ID"
                    //value={id}
                  />
                </Col>
              </Row>
            ) : (
              <></>
            )}
            <Row className="mb-4">
              <Col sm={12} xs={12}>
                <MaterialTable
                  options={{
                    actionsColumnIndex: -1,
                    search: false,
                    paging: false,
                    sorting: false,
                    draggable: false,
                    headerStyle: {
                      backgroundColor: "#2c2a29",
                      color: "#FFF",
                    },
                    rowStyle: {
                      backgroundColor: "#f4f4f4",
                    },
                  }}
                  localization={{
                    body: {
                      emptyDataSourceMessage: "No hay datos por mostrar",
                      addTooltip: "Añadir",
                      deleteTooltip: "Eliminar",
                      editTooltip: "Editar",
                      filterRow: {
                        filterTooltip: "Filtrar",
                      },
                      editRow: {
                        deleteText: "¿Segura(o) que quiere eliminar?",
                        cancelTooltip: "Cancelar",
                        saveTooltip: "Guardar",
                      },
                    },
                  }}
                  icons={tableIcons}
                  title=""
                  columns={[
                    {
                      title: "ID",
                      render: (rowData) => rowData.tableData.id,
                    },
                    { title: "Descripción", field: "descripcion" },
                  ]}
                  Descripción
                  data={dataGrid}
                  editable={{
                    onRowAdd: (newData) =>
                      new Promise((resolve, reject) => {
                        setTimeout(() => {
                          setDataGrid([...dataGrid, newData]);

                          resolve();
                        }, 1000);
                      }),
                    onRowUpdate: (newData, oldData) =>
                      new Promise((resolve, reject) => {
                        setTimeout(() => {
                          const dataUpdate = [...dataGrid];
                          const index = oldData.tableData.id;
                          dataUpdate[index] = newData;
                          setDataGrid([...dataUpdate]);
                          resolve();
                        }, 1000);
                      }),
                    onRowDelete: (oldData) =>
                      new Promise((resolve, reject) => {
                        setTimeout(() => {
                          const dataDelete = [...dataGrid];
                          const index = oldData.tableData.id;
                          dataDelete.splice(index, 1);
                          setDataGrid([...dataDelete]);
                          resolve();
                        }, 1000);
                      }),
                  }}
                />
              </Col>
            </Row>

            <Row className="mb-4">
              <Col sm={2} xs={12}>
                <label className="forn-label label">Fórmula</label>
              </Col>
              <Col sm={4} xs={12}>
                <input
                  {...register("formula", {
                    required: "Te faltó completar este campo",
                  })}
                  type="text"
                  className="form-control text-center texto"
                  placeholder="Fórmula"
                />
              </Col>
            </Row>

            <Row className="mb-4">
              <Col sm={2} xs={12}>
                <label className="forn-label label">Umbral</label>
              </Col>
              <Col sm={2} xs={12}>
                <Controller
                  control={control}
                  name="umbral"
                  rules={{ required: "Te faltó completar este campo" }}
                  render={({ field }) => (
                    <Select
                      components={animatedComponents}
                      placeholder="Umbral"
                      options={[
                        { value: 1, label: "Si" },
                        { value: 2, label: "No" },
                      ]}
                      value={field.value}
                      onChange={(e) => {
                        field.onChange(e);
                        if (e.label === "No") {
                          setFlagUmbral(true);
                        } else {
                          setFlagUmbral(false);
                        }
                      }}
                    />
                  )}
                />
                <p className="text-center">{errors.umbral?.message}</p>
              </Col>

              {!flagUmbral ? (
                <>
                  <Col sm={2} xs={12}>
                    <label className="forn-label label">Descripción</label>
                  </Col>
                  <Col sm={6} xs={12}>
                    <textarea
                      {...register("descripcion")}
                      rows={"3"}
                      className="form-control text-center texto"
                      placeholder="Descripción"
                    />
                  </Col>
                </>
              ) : null}
            </Row>

            <label className="forn-label label">
              Asociación Causa detallada​
            </label>
            <Row className="mb-4">
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
                        <StyledTableCell align="left">ID Causa</StyledTableCell>
                        <StyledTableCell align="left">Causa</StyledTableCell>
                        <StyledTableCell align="left">
                          Categoría Causa
                        </StyledTableCell>
                        <StyledTableCell align="left">Estado</StyledTableCell>
                      </TableRow>
                    </TableHead>
                    {/* Fin de encabezado */}
                    {/* Inicio de cuerpo de la tabla */}
                    <TableBody>
                      {causasAsociadas.map((row, index) => {
                        return (
                          <StyledTableRow
                            key={row.idcausa}
                            hover
                            role="checkbox"
                            tabIndex={-1}
                          >
                            <StyledTableCell component="th" scope="row">
                              {row.idcausa ? row.idcausa : null}
                            </StyledTableCell>

                            <StyledTableCell align="left">
                              {row.nombre ? row.nombre : null}
                            </StyledTableCell>

                            <StyledTableCell align="left">
                              {row.categoria_causa ? row.categoria_causa : null}
                            </StyledTableCell>

                            <StyledTableCell align="left">
                              {row.estado == 1 ? "Activo" : "Inactivo"}
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
          </Container>
        </Modal.Body>
        <Modal.Footer>
          <Button
            className="botonPositivo"
            onClick={handleSubmit(onSubmit, onError)}
          >
            Guardar
          </Button>
          <Button className="botonNegativo" onClick={props.onHide}>
            Cancelar
          </Button>
        </Modal.Footer>
      </Modal>
    </FormProvider>
  );
}
