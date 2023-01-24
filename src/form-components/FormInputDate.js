import React, { useState, useEffect } from "react";
import axios from "axios";
import AADService from "../auth/authFunctions";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import { Controller } from "react-hook-form";

export const FormInputDate = ({ name, control, label }) => {
  const serviceAAD = new AADService();

  const [options, setOptions] = useState([]);

  useEffect(() => {}, []);

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
        <DatePicker
          fullsize
          selected={value}
          onChange={onChange}
          className="form-control"
        />
      )}
      // rules={{
      //   required: "¡Chispas!, Te faltó seleccionar este campo",
      // }}
    />
  );
};
