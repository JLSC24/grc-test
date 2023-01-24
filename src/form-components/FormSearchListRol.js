import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import AADService from "../auth/authFunctions";

import Select from "react-select";
import makeAnimated from "react-select/animated";

import { Controller } from "react-hook-form";

const animatedComponents = makeAnimated();

export const FormSearchListRol = ({ name, control, label, SetRolSelected }) => {
  const serviceAAD = new AADService();

  const [options, setOptions] = useState([]);

  useEffect(() => {
    async function getRol() {
      try {
        const response = await axios.get(
          process.env.REACT_APP_API_URL + "/rol/",
          {
            headers: {
              Authorization: "Bearer " + serviceAAD.getToken(),
            },
          }
        );
        let roles = response.data.map(
          ({ idrol: value, nombre_rol: label, poblacion }) => ({
            value,
            label,
            poblacion,
          })
        );

        setOptions(roles);
      } catch (error) {
        console.error(error);
      }
    }
    getRol();
    console.log({options});
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
          onClick={SetRolSelected(value)}
          value={value}
          placeholder="Seleccione el rol"
        />
      )}
      defaultValue=""
    />
  );
};
