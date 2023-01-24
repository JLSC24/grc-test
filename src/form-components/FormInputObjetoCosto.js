import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import AADService from "../auth/authFunctions";

import Select from "react-select";
import makeAnimated from "react-select/animated";

import { Controller } from "react-hook-form";

const animatedComponents = makeAnimated();

export const FormInputObjetoCosto = ({ name, control, label }) => {
  const serviceAAD = new AADService();

  const [options, setOptions] = useState([]);

  useEffect(() => {
    async function getData() {
      try {
        const response = await axios.get(
          process.env.REACT_APP_API_URL + "/ultimonivel/OCexclude",
          {
            headers: {
              Authorization: "Bearer " + serviceAAD.getToken(),
            },
          }
        );

        let data = response.data.map(
          ({
            id: value,
            nombre: label,
            tipo_oc,
            nivel,
            padre,
            estado_oc,
            oc_n1,
            oc_n2,
          }) => ({
            value,
            label,
            tipo_oc,
            nivel,
            padre,
            estado_oc,
            oc_n1,
            oc_n2,
          })
        );
        setOptions(data);
      } catch (error) {
        console.error(error);
      }
    }
    getData();
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
        field: { onChange, onBlur, value, name, ref }, // The field object exports two things (among others): value and onChange
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
