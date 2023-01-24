import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import AADService from "../auth/authFunctions";

import Select from "react-select";
import makeAnimated from "react-select/animated";

import { Controller } from "react-hook-form";
import { Row, Col } from "react-bootstrap";

const animatedComponents = makeAnimated();

export const FormComponentInfoContable = ({ name, control, label }) => {
  const serviceAAD = new AADService();

  const [listaCompanias, setListaCompanias] = useState(null);
  const [listaCuentasContables, setListaCuentasContables] = useState(null);

  const [compania, setCompania] = useState(null);
  const [cuentaContable, setCuentaContable] = useState(null);
  const [cuentasContables, setCuentasContable] = useState(null);

  useEffect(() => {
    async function getCuentas() {
      try {
        const responseCuentaContable = await axios.get(
          process.env.REACT_APP_API_URL + "/maestros_ro/cuenta_contable/",
          {
            headers: {
              Authorization: "Bearer " + serviceAAD.getToken(),
            },
          }
        );

        const responseCompanias = await axios.get(
          process.env.REACT_APP_API_URL + "/maestros_ro/compania/",
          {
            headers: {
              Authorization: "Bearer " + serviceAAD.getToken(),
            },
          }
        );

        let companias = responseCompanias.data.map(
          ({ idcompania: value, compania: label, pais }) => ({
            value,
            label,
            pais,
          })
        );

        let cuentasContables = responseCuentaContable.data.map(
          ({
            idcompania: value,
            numero_cuenta: label,
            nombre,
            idcuenta_contable,
            estado,
          }) => ({
            value,
            label,
            nombre,
            idcuenta_contable,
            estado,
          })
        );

        setListaCuentasContables(cuentasContables);
        setListaCompanias(companias);
      } catch (error) {
        console.error(error);
      }
    }
    getCuentas();
  }, []);

  const FiltrarCuentas = (e) => {
    setCompania(e);
    setCuentaContable(null);

    let cuentasFiltradas = listaCuentasContables.filter(
      (cuenta) => cuenta.value === e.value
    );

    setCuentasContable(cuentasFiltradas);
  };

  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <>
          <Row className="mb-3 mt-3">
            <Col sm={2} xs={12}>
              <label className="forn-label label">Compañia contable</label>
            </Col>

            <Col sm={4} xs={12}>
              <Select
                components={animatedComponents}
                options={listaCompanias}
                placeholder="Seleccione la compañia"
                onChange={FiltrarCuentas}
                value={compania}
              />
            </Col>

            <Col sm={2} xs={12}>
              <label className="forn-label label">Cuenta contable</label>
            </Col>

            <Col sm={4} xs={12}>
              <Select
                components={animatedComponents}
                options={cuentasContables}
                placeholder="Seleccione la compañia"
                onChange={(e) => {
                  setCuentaContable(e);
                  field.onChange({ value: compania.label, label: e.label });
                }}
                value={cuentaContable}
              />
            </Col>
          </Row>
        </>
      )}
      // rules={{
      //   required: "Te faltó completar este campo",
      // }}
    />
  );
};
