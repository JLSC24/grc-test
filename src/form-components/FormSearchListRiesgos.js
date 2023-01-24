import React, { useState, useEffect } from "react";
import axios from "axios";
import AADService from "../auth/authFunctions";

import Select from "react-select";
import makeAnimated from "react-select/animated";

import { Controller } from "react-hook-form";

const animatedComponents = makeAnimated();

export const FormSearchListRiesgos = ({ name, control, label }) => {
  const serviceAAD = new AADService();

  const [options, setOptions] = useState([]);

  useEffect(() => {
    async function getRiesgos() {
      try {
        const response = await axios.get(process.env.REACT_APP_API_URL + "/riesgos/", {
          headers: {
            Authorization: "Bearer " + serviceAAD.getToken(),
          },
        });
        let riesgos = response.data.map(
          ({
            idriesgo: value,
            nombre_riesgo: label,
            estado,
            tipo_de_evento,
            id_elemento_ppal,
            compania,
            id_responsable,
            decision,
            nivel_riesgo_residual,
          }) => ({
            value,
            label,
            estado,
            tipo_de_evento,
            id_elemento_ppal,
            compania,
            id_responsable,
            decision,
            nivel_riesgo_residual,
          })
        );
        setOptions(riesgos);
      } catch (error) {
        console.error(error);
      }
    }
    getRiesgos();
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
          placeholder="Seleccione el nombre del riesgo"
        />
      )}
      rules={{
        required: "Te faltó completar este campo",
      }}
      defaultValue=""
    />
  );
};
