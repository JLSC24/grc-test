import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import AADService from "../auth/authFunctions";

import Select from "react-select";
import makeAnimated from "react-select/animated";

import { Controller } from "react-hook-form";

const animatedComponents = makeAnimated();

export const FormInputGeografia = ({ name, control, label }) => {
  const serviceAAD = new AADService();

  const [options, setOptions] = useState([]);

  useEffect(() => {
    async function getData() {
      try {
        const response = await axios.get(
          process.env.REACT_APP_API_URL + "/maestros_ro/geografia/",
          {
            headers: {
              Authorization: "Bearer " + serviceAAD.getToken(),
            },
          }
        );

        let data = response.data.map(
          ({
            idgeografia: value,
            nombre: label,
            nivel,
            padre,
            estado,
            geografia_n1,
            geografia_n2,
          }) => ({
            value,
            label,
            nivel,
            padre,
            estado,
            geografia_n1,
            geografia_n2,
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
          placeholder="Seleccione la compa??ia"
        />
      )}
      rules={{
        required: "Te falt?? completar este campo",
      }}
      defaultValue=""
    />
  );
};
