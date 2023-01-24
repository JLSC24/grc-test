import React, { useState, useEffect } from "react";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  FormHelperText,
} from "@material-ui/core";
import axios from "axios";
import AADService from "../../auth/authFunctions";

import { useFormContext, Controller } from "react-hook-form";

export const FormInputDropdown = ({ name, control, label }) => {
  const serviceAAD = new AADService();

  const [options, setOptions] = useState([]);

  useEffect(() => {
    async function getCompanias() {
      try {
        const response = await axios.get(
          process.env.REACT_APP_API_URL + "/maestros_ro/compania/",
          {
            headers: {
              Authorization: "Bearer " + serviceAAD.getToken(),
            },
          }
        );
        let companias = response.data.map(
          ({ idcompania: value, compania: label, pais }) => ({
            value,
            label,
            pais,
          })
        );
        setOptions(companias);
      } catch (error) {
        console.error(error);
      }
    }
    getCompanias();
  }, []);

  const generateSelectOptions = () => {
    return options.map((option) => {
      return (
        <MenuItem key={option.value} value={option.value}>
          {option.label}
        </MenuItem>
      );
    });
  };

  return (
    <Controller
      control={control}
      name={name}
      rules={{
        required: "Se requiere el campo de  ",
      }}
      render={({ field: { onChange, value } }) => (
        <FormControl fullWidth>
          <InputLabel id="demo-simple-select-helper-label">Compañia</InputLabel>
          <Select required id="Companias" onChange={onChange} value={value}>
            {generateSelectOptions()}
          </Select>
          {/* <FormHelperText>With label + helper text</FormHelperText> */}
        </FormControl>
      )}
    />
  );
};
