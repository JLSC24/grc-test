import React from "react";
import { Controller } from "react-hook-form";
import AADService from "../auth/authFunctions";

import Select from "react-select";
import makeAnimated from "react-select/animated";

const animatedComponents = makeAnimated();

const options = [
  { value: "Avance", label: "Avance" },
  { value: "Definitivo", label: "Definitivo" },
];

export const FormSearchListAvanceDefinitivo = ({ name, control, label }) => {
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
        fieldState: { errors },
        formState,
      }) => (
        <>
          <Select
            components={animatedComponents}
            options={options}
            onChange={onChange}
            value={value}
          />
        </>
      )}
      // rules={{
      //   required: Te faltó completar este campo,
      // }}
      // defaultValue=""
    />
  );
};
