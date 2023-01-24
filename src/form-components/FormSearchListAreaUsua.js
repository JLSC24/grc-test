import React, { useState, useEffect } from "react";
import axios from "axios";
import AADService from "../auth/authFunctions";

import Select from "react-select";
import makeAnimated from "react-select/animated";

import { Controller } from "react-hook-form";

const animatedComponents = makeAnimated();

export const FormSearchListAreaUsua = ({ name, control, label }) => {
  const serviceAAD = new AADService();

  const [options, setOptions] = useState([]);

  useEffect(() => {
    async function getAreas() {
      try {
        const response = await axios.get(
          process.env.REACT_APP_API_URL + "/maestros_ro/area_o/",
          {
            headers: {
              Authorization: "Bearer " + serviceAAD.getToken(),
            },
          }
        );
        let areas = response.data.map(
          ({
            idarea_organizacional: value,
            nombre: label,
            nivel,
            area_n1,
            area_n2,
            area_n3,
            area_n4,
            area_n5,
          }) => ({
            value,
            label,
            nivel,
            area_n1,
            area_n2,
            area_n3,
            area_n4,
            area_n5,
          })
        );
        setOptions(areas);
      } catch (error) {
        console.error(error);
      }
    }
    getAreas();
  }, []);

  const onChange = (event) => {
    console.warn(event);
  };
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
        />
      )}
      defaultValue=""
    />
  );
};
