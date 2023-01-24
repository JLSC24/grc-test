import React, { useState, useEffect } from "react";
import { Row, Col, Form, Alert, Button, Container } from "react-bootstrap";
import Switch from "@material-ui/core/Switch";
import { Link, useHistory } from "react-router-dom";
import { Treebeard } from "react-treebeard";
import Select from "react-select";
import makeAnimated from "react-select/animated";

import Table from "@material-ui/core/Table";
import Paper from "@material-ui/core/Paper";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableBody from "@material-ui/core/TableBody";
import TablePagination from "@material-ui/core/TablePagination";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import Check from "@material-ui/icons/Check";
import Clear from "@material-ui/icons/Clear";
import Edit from "@material-ui/icons/Edit";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import { Box } from "@material-ui/core";
import PropTypes from "prop-types";

import Collapse from "@mui/material/Collapse";
import TextField from "@material-ui/core/TextField";
import IconButton from "@mui/material/IconButton";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import Divider from "@mui/material/Divider";
import RemoveIcon from "@material-ui/icons/Remove";
import AddIcon from "@material-ui/icons/Add";
import { v4 as uuidv4 } from "uuid";

import MaterialTable from "material-table";
import axios from "axios";
import { forwardRef } from "react";

import { adalApiFetch } from "../auth/adalConfig";
import AADService from "../auth/authFunctions";

export default function AsociaControlesCausas() {
  const serviceAAD = new AADService();
  const [causas, setCausas] = useState(null);

  useEffect(() => {
    async function getCausas() {
      try {
        const response = await axios.get(
          process.env.REACT_APP_API_URL + "/rx_riesgo_causa/",
          {
            headers: {
              Authorization: "Bearer " + serviceAAD.getToken(),
            },
          }
        );

        setCausas(response);
      } catch (error) {
        console.error(error);
      }
    }
    getCausas();
  }, []);
}
