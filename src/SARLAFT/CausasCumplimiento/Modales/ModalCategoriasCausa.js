import axios from "axios";
import AADService from "../../../auth/authFunctions";
import React, { useState, useEffect } from "react";
import { useForm, Controller, FormProvider } from "react-hook-form";
import { Row, Col, Button, Container, Modal } from "react-bootstrap";

import Select from "react-select";
import makeAnimated from "react-select/animated";
import { Description } from "@mui/icons-material";

const animatedComponents = makeAnimated();

export default function ModalCategoriasCausa(props) {
  const serviceAAD = new AADService();
  const [isEditing, setIsEditing] = useState(false);
  const [listaConsecuencias, setListaConsecuencias] = useState([]);
  const [listaCategorias, setListaCategorias] = useState([]);
  const [flagListaCategorias, setFlagListaCategorias] = useState(false);

  const defaultValues = {
    id: null,
    estado: null,
    nombre: null,
    nivel: null,
    categoria: null,
    consecuencias: null,
    descripcion:
      "Con la posible materialización del riesgo LA/FT/FPADM se podrían generar, ",
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
    reset,
    formState: { errors },
  } = methods;

  const onSubmit = async (data) => {
    console.log(data);
    let config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + serviceAAD.getToken(),
      },
    };

    let consecuencias = data.consecuencias.map(({ label }) => label);
    consecuencias = consecuencias.toString();

    let dataEnviar = {
      estado: 1,
      nombre_categoria: data.nombre ? data.nombre : null,
      nivel: data.nivel ? data.nivel.label : null,
      categoria_n1: data.categoria ? data.categoria.label : null,
      consecuencias: data.consecuencias ? consecuencias : null,
    };

    console.log("Datos a enviar al back", dataEnviar);

    let response;

    try {
      if (!!isEditing) {
        dataEnviar.idcategoria_causas = data.id;
        dataEnviar.estado = data.estado.value;
        response = await axios.put(
          process.env.REACT_APP_API_URL + "/categoriacausas/" + data.id,
          dataEnviar,
          config
        );

        let index = props.dataCategorias.findIndex(
          (obj) => obj.idcategoria_causas === data.id
        );
        props.dataCategorias.splice(index, 1, dataEnviar);
      } else {
        response = await axios.post(
          process.env.REACT_APP_API_URL + "/categoriacausas",
          dataEnviar,
          config
        );
      }
    } catch (error) {
      console.error(error);
    }

    if (response.status >= 200 && response.status < 300) {
      alert("Guardado con éxito");

      reset();
      props.onHide();
    } else if (response.status >= 300 && response.status < 400) {
    } else if (response.status >= 400 && response.status < 512) {
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

    let APIS = [
      fetch(process.env.REACT_APP_API_URL + "/categoriacausas", config),
      fetch(process.env.REACT_APP_API_URL + "/generales/Consecuencias", config),
    ];

    Promise.all(APIS)
      .then(async ([categorias, consecuencias]) => {
        const listCategorias = await categorias.json();

        let listaCategorias = listCategorias.map(
          ({ idcategoria_causas: value, nombre_categoria: label, nivel }) => ({
            value,
            label,
            nivel,
          })
        );

        let listaCategoriasN1 = listaCategorias.filter(
          (item) => item.nivel === 1
        );
        setListaCategorias(listaCategoriasN1);

        const listConsecuencias = await consecuencias.json();

        let listaConsecuencias = listConsecuencias.map(
          ({ idm_parametrosgenerales: value, parametro: label, valor }) => ({
            value,
            label,
            valor,
          })
        );

        setListaConsecuencias(listaConsecuencias);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    if (Array.isArray(props.dataCategorias)) {
      if (props.selected[0]) {
        setIsEditing(true);
        props.dataCategorias.forEach((obj) => {
          if (obj.idcategoria_causas === props.selected[0]) {
            setValue("id", obj.idcategoria_causas);
            setValue("nombre", obj.nombre_categoria);

            if (obj.nivel === 2) {
              setFlagListaCategorias(true);
            }

            setValue("nivel", { value: obj.nivel, label: obj.nivel });
            setValue("categoria", {
              value: obj.categoria_n1,
              label: obj.categoria_n1,
            });

            let stringArray = obj.consecuencias.split(",");
            let objArray = [];
            stringArray.forEach((item) => {
              objArray.push({ value: item, label: item });
            });

            setValue("consecuencias", objArray);

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

  const FilterConsecuencias = (e) => {
    let intro =
      "Con la posible materialización del riesgo LA/FT/FPADM se podrían generar, ";

    let textArray = e.map((obj) => obj.valor);

    console.log(textArray);

    setValue("descripcion", intro + textArray.toString());
  };

  const FiltrarNivel = (e) => {
    if (e.value == 1) {
      setFlagListaCategorias(false);
      setValue("categoria", null);
    } else {
      setFlagListaCategorias(true);
    }
  };

  return (
    <Modal
      {...props}
      aria-labelledby="contained-modal-title-vcenter"
      centered
      backdrop="static"
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Categoria de la Causa
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="show-grid">
        <Container>
          {!!isEditing ? (
            <Row className="mb-4">
              <Col sm={2} xs={12}>
                <label className="forn-label label">ID Categoría</label>
              </Col>
              <Col sm={4} xs={12}>
                <input
                  {...register("id")}
                  disabled
                  type="text"
                  className="form-control text-center texto"
                  placeholder="ID"
                />
              </Col>

              <Col sm={2} xs={12}>
                <label className="forn-label label">Estado</label>
              </Col>
              <Col sm={4} xs={12}>
                <Controller
                  control={control}
                  name="estado"
                  render={({ field }) => (
                    <Select
                      components={animatedComponents}
                      placeholder="Estado"
                      options={[
                        { value: 1, label: "Activo" },
                        { value: 0, label: "Inactivo" },
                      ]}
                      value={field.value}
                      onChange={(e) => field.onChange(e)}
                    />
                  )}
                />
              </Col>
            </Row>
          ) : (
            <></>
          )}

          <Row className="mb-4">
            <Col sm={2} xs={12}>
              <label className="forn-label label">Nombre Categoría*</label>
            </Col>
            <Col sm={10} xs={12}>
              <input
                {...register("nombre", {
                  required: "Te faltó completar este campo",
                })}
                type="text"
                className="form-control text-center texto"
                placeholder="Nombre Categoría"
              />
              <p className="text-center">{errors.nombre?.message}</p>
            </Col>
          </Row>

          <Row className="mb-4">
            <Col sm={2} xs={12}>
              <label className="forn-label label">Nivel*</label>
            </Col>
            <Col sm={4} xs={12}>
              <Controller
                control={control}
                name="nivel"
                rules={{ required: "Te faltó completar este campo" }}
                render={({ field }) => (
                  <Select
                    components={animatedComponents}
                    placeholder="Nivel"
                    options={[
                      { value: 1, label: 1 },
                      { value: 2, label: 2 },
                    ]}
                    value={field.value}
                    onChange={(e) => {
                      field.onChange(e);
                      FiltrarNivel(e);
                    }}
                  />
                )}
              />
              <p className="text-center">{errors.nivel?.message}</p>
            </Col>

            {!!flagListaCategorias ? (
              <>
                <Col sm={2} xs={12}>
                  <label className="forn-label label">Categoría N1</label>
                </Col>
                <Col sm={4} xs={12}>
                  <Controller
                    control={control}
                    name="categoria"
                    rules={{
                      required: flagListaCategorias
                        ? "Te faltó completar este campo"
                        : false,
                    }}
                    render={({ field }) => (
                      <Select
                        components={animatedComponents}
                        placeholder="Categoría N1"
                        options={listaCategorias}
                        value={field.value}
                        onChange={(e) => {
                          field.onChange(e);
                        }}
                      />
                    )}
                  />
                  <p className="text-center">{errors.categoria?.message}</p>
                </Col>
              </>
            ) : (
              <></>
            )}
          </Row>

          <Row className="mb-4">
            <Col sm={2} xs={12}>
              <label className="forn-label label">Consecuencias*</label>
            </Col>
            <Col sm={10} xs={12}>
              <Controller
                control={control}
                name="consecuencias"
                rules={{ required: "Te faltó completar este campo" }}
                render={({ field }) => (
                  <Select
                    isMulti
                    components={animatedComponents}
                    placeholder="Consecuencias"
                    options={listaConsecuencias}
                    value={field.value}
                    onChange={(e) => {
                      FilterConsecuencias(e);

                      const unique = new Set();

                      const filteredList = e.filter((element) => {
                        const isDuplicate = unique.has(element.label);

                        unique.add(element.label);

                        if (!isDuplicate) {
                          return true;
                        } else {
                          return false;
                        }
                      });

                      field.onChange(filteredList);
                    }}
                  />
                )}
              />
              <p className="text-center">{errors.consecuencias?.message}</p>
            </Col>
          </Row>

          <Row className="mb-4">
            <Col sm={2} xs={12}>
              <label className="forn-label label">
                Descripción Consecuencias
              </label>
            </Col>
            <Col sm={10} xs={12}>
              <textarea
                {...register("descripcion")}
                rows={"4"}
                className="form-control text-center texto"
                placeholder="Descripción"
              />
            </Col>
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
  );
}
