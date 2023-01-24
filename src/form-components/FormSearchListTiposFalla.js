import React, { useState, useEffect } from "react";
import axios from "axios";
import AADService from "../auth/authFunctions";

import Select from "react-select";
import makeAnimated from "react-select/animated";

import { Controller } from "react-hook-form";

const animatedComponents = makeAnimated();

export const FormSearchListTiposFalla = ({ name, control, label }) => {
  const serviceAAD = new AADService();

  const [options, setOptions] = useState([]);

  useEffect(() => {
    async function getProcesos() {
      try {
        const response = await axios.get(
          process.env.REACT_APP_API_URL + "/maestros_ro/tipo_falla/",
          {
            headers: {
              Authorization: "Bearer " + serviceAAD.getToken(),
            },
          }
        );
        let procesos = response.data.map(
          ({
            idtipo_falla: value,
            nombre: label,
            nivel,
            padre,
            tipo_falla_n1,
            tipo_falla_n2,
            estado,
          }) => ({
            value,
            label,
            nivel,
            padre,
            tipo_falla_n1,
            tipo_falla_n2,
            estado,
          })
        );
        setOptions(procesos);
      } catch (error) {
        console.error(error);
      }
    }
    getProcesos();
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
          placeholder="Seleccione el tipo de falla"
        />
      )}
      rules={{
        required: "¡Chispas!, Te faltó seleccionar este campo",
      }}
      defaultValue=""
    />
  );
};
