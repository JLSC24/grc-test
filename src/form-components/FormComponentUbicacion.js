import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import AADService from "../auth/authFunctions";

import Select from "react-select";
import makeAnimated from "react-select/animated";

import { Controller } from "react-hook-form";
import { Row, Col } from "react-bootstrap";

const animatedComponents = makeAnimated();

export const FormComponentUbicacion = ({
  name,
  control,
  label,
  ubicacion,
  setUbicacion,
}) => {
  const serviceAAD = new AADService();

  const [listaUbicacion1, setListaUbicacion1] = useState([
    { value: 1, label: "País" },
    { value: 2, label: "Compañia" },
  ]);
  const [listaUbicacion2, setListaUbicacion2] = useState([]);

  const [listaCompanias, setListaCompanias] = useState([]);
  const [listaPaises, setListaPaises] = useState([]);

  const [ubicacion1, setUbicacion1] = useState(null);

  useEffect(() => {
    async function getData() {
      try {
        const response1 = await axios.get(
          process.env.REACT_APP_API_URL + "/maestros_ro/compania/",
          {
            headers: {
              Authorization: "Bearer " + serviceAAD.getToken(),
            },
          }
        );

        const response2 = await axios.get(
          process.env.REACT_APP_API_URL + "/generales/Causa/Pais",
          {
            headers: {
              Authorization: "Bearer " + serviceAAD.getToken(),
            },
          }
        );

        let data1 = response1.data.map(
          ({ idcompania: value, compania: label, pais }) => ({
            value,
            label,
            pais,
          })
        );

        setListaCompanias(data1);

        let data2 = response2.data.map(
          ({ parametro: value, valor: label }) => ({
            value,
            label,
          })
        );
        setListaPaises(data2);
      } catch (error) {
        console.error(error);
      }
    }
    getData();

    setUbicacion1({ value: ubicacion.value, label: ubicacion.label });
  }, []);

  const Filtrar = (e) => {
    setUbicacion1(e);

    setUbicacion(null);

    console.log(e.label);

    switch (e.label) {
      case "País":
        setListaUbicacion2(listaPaises);
        break;
      case "Compañia":
        setListaUbicacion2(listaCompanias);
        console.log(listaCompanias);
        break;

      default:
        setUbicacion(null);
        break;
    }

    console.log(listaCompanias);
  };

  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <>
          <Row className="mb-3 mt-3">
            <Col sm={3} xs={12}>
              <label className="forn-label label">Ubicación*</label>
            </Col>

            <Col sm={3} xs={12}>
              <Select
                components={animatedComponents}
                options={listaUbicacion1}
                placeholder="País/Compañía"
                onChange={Filtrar}
                value={ubicacion1}
              />
            </Col>

            <Col sm={3} xs={12}>
              <Select
                components={animatedComponents}
                options={listaUbicacion2}
                placeholder="País/Compañia"
                onChange={(e) => {
                  field.onChange({ value: ubicacion1.label, label: e.label });
                  setUbicacion({ value: ubicacion1.label, label: e.label });
                }}
                value={ubicacion}
              />
            </Col>
          </Row>
        </>
      )}
      // rules={{
      //   required: "Te faltó completar este campo",
      // }}
    />
  );
};
