import React, { useState, useEffect } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { TextField } from "@material-ui/core";

export const FormInputTexto = ({ name, control, label }) => {
  return (
    <Controller
      //is a prop that we get back from the useForm Hook and pass into the input.
      control={control}
      //is how React Hook Form tracks the value of an input internally.
      name={name}
      //render is the most important prop; we pass a render function here.
      render={({
        //The function has three keys: field , fieldState, and formState.
        field: { onChange, onBlur, value, ref }, // The field object exports two things (among others): value and onChange
        fieldState: { invalid, isTouched, isDirty, error },
        formState,
      }) => (
        <>
          <TextField
            type="text"
            error={!!error}
            onChange={onChange}
            value={value}
            label={label}
            variant="outlined"
            fullWidth
            size="small"
            helperText={error ? error.message : null}
          />
        </>
      )}
      rules={{
        required: "Te faltó completar este campo",
      }}
      defaultValue=""
    />
  );
};
