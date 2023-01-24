import axios from "axios";
import Select from "react-select";
import AADService from "../auth/authFunctions";
import makeAnimated from "react-select/animated";
import React, { useState, useEffect, useContext } from "react";

import { useForm, Controller, useWatch, FormProvider } from "react-hook-form";

import { Row, Col, Form, Alert, Button, Container } from "react-bootstrap";

const animatedComponents = makeAnimated();

export const FormSearchListDivisaOrigen = ({ name, control, label }) => {
  const serviceAAD = new AADService();

  const [options, setOptions] = useState([]);

  useEffect(() => {
    async function getData() {
      try {
        const response = await axios.get(
          process.env.REACT_APP_API_URL + "/generales/Recuperaciones/divisa_origen",
          {
            headers: {
              Authorization: "Bearer " + serviceAAD.getToken(),
            },
          }
        );
        let data = response.data.map(
          ({ idm_parametrosgenerales: value, valor: label }) => ({
            value,
            label,
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
        field: { onChange, value }, // The field object exports two things (among others): value and onChange
        fieldState: { invalid, isTouched, isDirty, error },
        formState,
      }) => (
        <Select
          components={animatedComponents}
          options={options}
          onChange={onChange}
          value={value}
          placeholder="Seleccione la divisa"
        />
      )}
      rules={{
        required: "Te faltó completar este campo",
      }}
    />
  );
};
