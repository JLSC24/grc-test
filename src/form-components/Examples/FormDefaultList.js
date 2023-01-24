import React, { useState, useEffect } from "react";

import axios from "axios";
import AADService from "../../auth/authFunctions";

import { Controller } from "react-hook-form";

export const FormDefaultList = ({ name, control, label }) => {
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
        <option key={option.value} value={option.label}>
          {option.label}
        </option>
      );
    });
  };

  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, value } }) => (
        <select
          className="form-control texto"
          onChange={onChange}
          value={value}
        >
          <option value="" disabled="disabled">
            Seleccione compañia
          </option>
          {generateSelectOptions()}
        </select>
      )}
      rules={{
        required: `Se requiere el campo de  ${label}`,
      }}
      defaultValue=""
    />
  );
};
