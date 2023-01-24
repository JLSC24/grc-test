import React, { useState, useEffect } from "react";
import axios from "axios";
import AADService from "../auth/authFunctions";

import Select from "react-select";
import makeAnimated from "react-select/animated";

import { Controller } from "react-hook-form";

const animatedComponents = makeAnimated();

export const FormSearchListCategoriaRiesgo = ({ name, control, label }) => {
  const serviceAAD = new AADService();

  const [options, setOptions] = useState([]);

  useEffect(() => {
    async function getCategoriasRiesgo() {
      try {
        const response = await axios.get(
          process.env.REACT_APP_API_URL + "/maestros_ro/categoria_riesgo/",
          {
            headers: {
              Authorization: "Bearer " + serviceAAD.getToken(),
            },
          }
        );
        let procesos = response.data.map(
          ({
            idcategoria_riesgo: value,
            nombre: label,
            nivel,
            padre,
            categoria_riesgos_n1,
            categoria_riesgos_n2,
            categoria_riesgos_n3,
            estado,
            atributo,
          }) => ({
            value,
            label,
            nivel,
            padre,
            categoria_riesgos_n1,
            categoria_riesgos_n2,
            categoria_riesgos_n3,
            estado,
            atributo,
          })
        );
        setOptions(procesos);
      } catch (error) {
        console.error(error);
      }
    }
    getCategoriasRiesgo();
  }, []);

  return (
    <Controller
      //is a prop that we get back from the useForm Hook and pass into the input.
      control={control}
      //is how React Hook Form tracks the value of an input internally.
      name={name}
      //render is the most important prop; we pass a render function here.
      render={({
        //The function has three keys: field , fieldState, and formState.
        field: { onChange, value }, // The field object exports two things (among others): value and onChange
        fieldState: { invalid, isTouched, isDirty, error },
        formState,
      }) => (
        <Select
          components={animatedComponents}
          options={options}
          onChange={onChange}
          value={value}
          placeholder="Seleccione la compañia"
        />
      )}
      rules={{
        required: "Te faltó completar este campo",
      }}
      defaultValue=""
    />
  );
};
