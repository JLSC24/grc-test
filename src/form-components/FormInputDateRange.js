import React, { useState, useEffect } from "react";
import axios from "axios";
import AADService from "../auth/authFunctions";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import { Controller } from "react-hook-form";

export const FormInputDateRange = ({ name, control, label }) => {
  const [dateRange, setDateRange] = useState([null, null]);
  const [startDate, endDate] = dateRange;

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
        field, // The field object exports two things (among others): value and onChange
      }) => (
        <>
          <DatePicker
            selectsRange={true}
            startDate={startDate}
            endDate={endDate}
            onChange={(e) => {
              setDateRange(e);
              field.onChange(e);
            }}
            isClearable={true}
            className="form-control"
          />
        </>
      )}
      rules={{
        required: "Te faltó completar este campo",
      }}
    />
  );
};
