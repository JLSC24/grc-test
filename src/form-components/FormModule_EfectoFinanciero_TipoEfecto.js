import React, { useState, useEffect, useContext } from "react";
import AADService from "../auth/authFunctions";

import makeAnimated from "react-select/animated";
import Select from "react-select";
import axios from "axios";

import { Controller } from "react-hook-form";

const animatedComponents = makeAnimated();

export const FormSearchListCompania = ({ name, control, label }) => {
  const serviceAAD = new AADService();

  const [options1, setOptions1] = useState([]);
  const [options2, setOptions2] = useState([]);

  useEffect(() => {
    getData = async () => {
      try {
        const data1 = await axios.get(
          process.env.REACT_APP_API_URL + "/generales/Efecto_financiero/efecto_financiero",
          {
            headers: {
              Authorization: "Bearer " + serviceAAD.getToken(),
            },
          }
        );
        const data2 = await axios.get(
          process.env.REACT_APP_API_URL + "/generales/Efecto_financiero/tipo_de_efecto/",
          {
            headers: {
              Authorization: "Bearer " + serviceAAD.getToken(),
            },
          }
        );

        let efectoFinanciero = await response.data1.map(
          ({ idcompania: value, compania: label, pais }) => ({
            value,
            label,
            pais,
          })
        );

        let tipoEfecto = await response.data2.map(
          ({ idcompania: value, compania: label, pais }) => ({
            value,
            label,
            pais,
          })
        );

        setOptions1(efectoFinanciero);
      } catch (error) {
        console.error(error);
      }
    };
    getData();
  }, []);

  const FiltrarOpcion = () => {};
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
