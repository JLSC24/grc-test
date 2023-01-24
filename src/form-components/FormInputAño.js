import React, { useState, useEffect } from "react";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import { Controller } from "react-hook-form";

export const FormInputAño = ({ name, control, label }) => {
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
          selected={value}
          onChange={onChange}
          className="form-control"
          dateFormat="yyyy"
          showYearPicker
        />
      )}
      rules={{
        required: "Te faltó completar este campo",
      }}
    />
  );
};
