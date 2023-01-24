import React, { useState, useEffect } from "react";
import { Row, Col, Form, Alert } from "react-bootstrap";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import TablePagination from "@material-ui/core/TablePagination";
import Switch from "@material-ui/core/Switch";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import { Link, useHistory } from "react-router-dom";
import { Treebeard } from "react-treebeard";
import Loader from "react-loader-spinner";
import Select from "react-select";
import axios from "axios";

import AADService from "../../auth/authFunctions";
import ModalCertificaciones from "./ModalCertificaciones";
import ModalContratos from "./ModalContratos";

const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: "#2c2a29",
    color: theme.palette.common.white,
  },
}))(TableCell);
const StyledTableRow = withStyles((theme) => ({
  root: {
    backgroundColor: "#f4f4f4",
  },
}))(TableRow);
const useStyles = makeStyles({
  root: {
    width: "100%",
  },
  container: {
    maxHeight: "60vh",
    minHeight: "20vh",
  },
});

function AlertDismissibleExample(data) {
  let temp = [];
  let errors = "";
  let temp2 = [];
  if (data.alerta.data !== null && data.alerta.data !== undefined) {
    temp = JSON.stringify(data.alerta.data).split('"');
    temp.map((dat, index) => {
      if (index % 2 !== 0) {
        temp2.push(dat);
      }
    });
    for (let index = 0; index < temp2.length; index += 2) {
      errors = errors + temp2[index] + ": " + temp2[index + 1] + "\n";
    }
  }
  switch (data.alerta.id) {
    case 1:
      return (
        <Alert className="alerta" variant="warning">
          Alerta
        </Alert>
      );
      break;
    case 2:
      return <Alert variant="success">Guardó exitosamente</Alert>;
      break;
    case 3:
      return <Alert variant="danger"></Alert>;
      break;
    case 4:
      return <Alert variant="warning">{errors}</Alert>;
      break;
    case 5:
      return <Alert variant="danger">Error en el servidor</Alert>;
      break;
    case 6:
      return (
        <Alert variant="warning">
          Ya existe una evaluación para el activo seleccionado
        </Alert>
      );
      break;
    default:
      return <p></p>;
      break;
  }
}

const sector = [
  { value: "Agricultura", label: "Agricultura" },
  { value: "Alimentación", label: "Alimentación" },
  { value: "Comercio", label: "Comercio" },
  { value: "Construcción", label: "Construcción" },
  { value: "Educación", label: "Educación" },
  {
    value: "Fabricación de material de transporte",
    label: "Fabricación de material de transporte",
  },
  { value: "Función pública", label: "Función pública" },
  { value: "Hotelería y turismo", label: "Hotelería y turismo" },
  { value: "Industrias químicas", label: "Industrias químicas" },
  {
    value: "Ingeniería mecánica y eléctrica",
    label: "Ingeniería mecánica y eléctrica",
  },
  { value: "Medios de comunicación", label: "Medios de comunicación" },
  { value: "Minería", label: "Minería" },
  {
    value: "Petróleo y producción de gas",
    label: "Petróleo y producción de gas",
  },
  {
    value: "Producción de metales básicos",
    label: "Producción de metales básicos",
  },
  { value: "Salud", label: "Salud" },
  { value: "Servicios financieros", label: "Servicios financieros" },
  { value: "Servicios públicos", label: "Servicios públicos" },
  { value: "Silvicultura", label: "Silvicultura" },
  { value: "Telecomunicaciones", label: "Telecomunicaciones" },
  { value: "Textiles", label: "Textiles" },
  { value: "Transporte", label: "Transporte" },
  { value: "Transporte marítimo", label: "Transporte marítimo" },
];

const paises = [
  {
    label: "Afghanistan",
    value: "AF",
    country_phone_code: 93,
  },
  {
    label: "Albania",
    value: "AL",
    country_phone_code: 355,
  },
  {
    label: "Algeria",
    value: "DZ",
    country_phone_code: 213,
  },
  {
    label: "American Samoa",
    value: "AS",
    country_phone_code: 1684,
  },
  {
    label: "Andorra",
    value: "AD",
    country_phone_code: 376,
  },
  {
    label: "Angola",
    value: "AO",
    country_phone_code: 244,
  },
  {
    label: "Anguilla",
    value: "AI",
    country_phone_code: 1264,
  },
  {
    label: "Antarctica",
    value: "AQ",
    country_phone_code: 0,
  },
  {
    label: "Antigua And Barbuda",
    value: "AG",
    country_phone_code: 1268,
  },
  {
    label: "Argentina",
    value: "AR",
    country_phone_code: 54,
  },
  {
    label: "Armenia",
    value: "AM",
    country_phone_code: 374,
  },
  {
    label: "Aruba",
    value: "AW",
    country_phone_code: 297,
  },
  {
    label: "Australia",
    value: "AU",
    country_phone_code: 61,
  },
  {
    label: "Austria",
    value: "AT",
    country_phone_code: 43,
  },
  {
    label: "Azerbaijan",
    value: "AZ",
    country_phone_code: 994,
  },
  {
    label: "Bahamas The",
    value: "BS",
    country_phone_code: 1242,
  },
  {
    label: "Bahrain",
    value: "BH",
    country_phone_code: 973,
  },
  {
    label: "Bangladesh",
    value: "BD",
    country_phone_code: 880,
  },
  {
    label: "Barbados",
    value: "BB",
    country_phone_code: 1246,
  },
  {
    label: "Belarus",
    value: "BY",
    country_phone_code: 375,
  },
  {
    label: "Belgium",
    value: "BE",
    country_phone_code: 32,
  },
  {
    label: "Belize",
    value: "BZ",
    country_phone_code: 501,
  },
  {
    label: "Benin",
    value: "BJ",
    country_phone_code: 229,
  },
  {
    label: "Bermuda",
    value: "BM",
    country_phone_code: 1441,
  },
  {
    label: "Bhutan",
    value: "BT",
    country_phone_code: 975,
  },
  {
    label: "Bolivia",
    value: "BO",
    country_phone_code: 591,
  },
  {
    label: "Bosnia and Herzegovina",
    value: "BA",
    country_phone_code: 387,
  },
  {
    label: "Botswana",
    value: "BW",
    country_phone_code: 267,
  },
  {
    label: "Bouvet Island",
    value: "BV",
    country_phone_code: 0,
  },
  {
    label: "Brazil",
    value: "BR",
    country_phone_code: 55,
  },
  {
    label: "British Indian Ocean Territory",
    value: "IO",
    country_phone_code: 246,
  },
  {
    label: "Brunei",
    value: "BN",
    country_phone_code: 673,
  },
  {
    label: "Bulgaria",
    value: "BG",
    country_phone_code: 359,
  },
  {
    label: "Burkina Faso",
    value: "BF",
    country_phone_code: 226,
  },
  {
    label: "Burundi",
    value: "BI",
    country_phone_code: 257,
  },
  {
    label: "Cambodia",
    value: "KH",
    country_phone_code: 855,
  },
  {
    label: "Cameroon",
    value: "CM",
    country_phone_code: 237,
  },
  {
    label: "Canada",
    value: "CA",
    country_phone_code: 1,
  },
  {
    label: "Cape Verde",
    value: "CV",
    country_phone_code: 238,
  },
  {
    label: "Cayman Islands",
    value: "KY",
    country_phone_code: 1345,
  },
  {
    label: "Central African Republic",
    value: "CF",
    country_phone_code: 236,
  },
  {
    label: "Chad",
    value: "TD",
    country_phone_code: 235,
  },
  {
    label: "Chile",
    value: "CL",
    country_phone_code: 56,
  },
  {
    label: "China",
    value: "CN",
    country_phone_code: 86,
  },
  {
    label: "Christmas Island",
    value: "CX",
    country_phone_code: 61,
  },
  {
    label: "Cocos (Keeling) Islands",
    value: "CC",
    country_phone_code: 672,
  },
  {
    label: "Colombia",
    value: "CO",
    country_phone_code: 57,
  },
  {
    label: "Comoros",
    value: "KM",
    country_phone_code: 269,
  },
  {
    label: "Cook Islands",
    value: "CK",
    country_phone_code: 682,
  },
  {
    label: "Costa Rica",
    value: "CR",
    country_phone_code: 506,
  },
  {
    label: "Cote D'Ivoire (Ivory Coast)",
    value: "CI",
    country_phone_code: 225,
  },
  {
    label: "Croatia (Hrvatska)",
    value: "HR",
    country_phone_code: 385,
  },
  {
    label: "Cuba",
    value: "CU",
    country_phone_code: 53,
  },
  {
    label: "Cyprus",
    value: "CY",
    country_phone_code: 357,
  },
  {
    label: "Czech Republic",
    value: "CZ",
    country_phone_code: 420,
  },
  {
    label: "Democratic Republic Of The Congo",
    value: "CD",
    country_phone_code: 243,
  },
  {
    label: "Denmark",
    value: "DK",
    country_phone_code: 45,
  },
  {
    label: "Djibouti",
    value: "DJ",
    country_phone_code: 253,
  },
  {
    label: "Dominica",
    value: "DM",
    country_phone_code: 1767,
  },
  {
    label: "Dominican Republic",
    value: "DO",
    country_phone_code: 1809,
  },
  {
    label: "East Timor",
    value: "TP",
    country_phone_code: 670,
  },
  {
    label: "Ecuador",
    value: "EC",
    country_phone_code: 593,
  },
  {
    label: "Egypt",
    value: "EG",
    country_phone_code: 20,
  },
  {
    label: "El Salvador",
    value: "SV",
    country_phone_code: 503,
  },
  {
    label: "Equatorial Guinea",
    value: "GQ",
    country_phone_code: 240,
  },
  {
    label: "Eritrea",
    value: "ER",
    country_phone_code: 291,
  },
  {
    label: "Estonia",
    value: "EE",
    country_phone_code: 372,
  },
  {
    label: "Ethiopia",
    value: "ET",
    country_phone_code: 251,
  },
  {
    label: "Falkland Islands",
    value: "FK",
    country_phone_code: 500,
  },
  {
    label: "Faroe Islands",
    value: "FO",
    country_phone_code: 298,
  },
  {
    label: "Fiji Islands",
    value: "FJ",
    country_phone_code: 679,
  },
  {
    label: "Finland",
    value: "FI",
    country_phone_code: 358,
  },
  {
    label: "France",
    value: "FR",
    country_phone_code: 33,
  },
  {
    label: "French Guiana",
    value: "GF",
    country_phone_code: 594,
  },
  {
    label: "French Polynesia",
    value: "PF",
    country_phone_code: 689,
  },
  {
    label: "French Southern Territories",
    value: "TF",
    country_phone_code: 0,
  },
  {
    label: "Gabon",
    value: "GA",
    country_phone_code: 241,
  },
  {
    label: "Gambia The",
    value: "GM",
    country_phone_code: 220,
  },
  {
    label: "Georgia",
    value: "GE",
    country_phone_code: 995,
  },
  {
    label: "Germany",
    value: "DE",
    country_phone_code: 49,
  },
  {
    label: "Ghana",
    value: "GH",
    country_phone_code: 233,
  },
  {
    label: "Gibraltar",
    value: "GI",
    country_phone_code: 350,
  },
  {
    label: "Greece",
    value: "GR",
    country_phone_code: 30,
  },
  {
    label: "Greenland",
    value: "GL",
    country_phone_code: 299,
  },
  {
    label: "Grenada",
    value: "GD",
    country_phone_code: 1473,
  },
  {
    label: "Guadeloupe",
    value: "GP",
    country_phone_code: 590,
  },
  {
    label: "Guam",
    value: "GU",
    country_phone_code: 1671,
  },
  {
    label: "Guatemala",
    value: "GT",
    country_phone_code: 502,
  },
  {
    label: "Guernsey and Alderney",
    value: "XU",
    country_phone_code: 44,
  },
  {
    label: "Guinea",
    value: "GN",
    country_phone_code: 224,
  },
  {
    label: "Guinea-Bissau",
    value: "GW",
    country_phone_code: 245,
  },
  {
    label: "Guyana",
    value: "GY",
    country_phone_code: 592,
  },
  {
    label: "Haiti",
    value: "HT",
    country_phone_code: 509,
  },
  {
    label: "Heard and McDonald Islands",
    value: "HM",
    country_phone_code: 0,
  },
  {
    label: "Honduras",
    value: "HN",
    country_phone_code: 504,
  },
  {
    label: "Hong Kong S.A.R.",
    value: "HK",
    country_phone_code: 852,
  },
  {
    label: "Hungary",
    value: "HU",
    country_phone_code: 36,
  },
  {
    label: "Iceland",
    value: "IS",
    country_phone_code: 354,
  },
  {
    label: "India",
    value: "IN",
    country_phone_code: 91,
  },
  {
    label: "Indonesia",
    value: "ID",
    country_phone_code: 62,
  },
  {
    label: "Iran",
    value: "IR",
    country_phone_code: 98,
  },
  {
    label: "Iraq",
    value: "IQ",
    country_phone_code: 964,
  },
  {
    label: "Ireland",
    value: "IE",
    country_phone_code: 353,
  },
  {
    label: "Israel",
    value: "IL",
    country_phone_code: 972,
  },
  {
    label: "Italy",
    value: "IT",
    country_phone_code: 39,
  },
  {
    label: "Jamaica",
    value: "JM",
    country_phone_code: 1876,
  },
  {
    label: "Japan",
    value: "JP",
    country_phone_code: 81,
  },
  {
    label: "Jersey",
    value: "XJ",
    country_phone_code: 44,
  },
  {
    label: "Jordan",
    value: "JO",
    country_phone_code: 962,
  },
  {
    label: "Kazakhstan",
    value: "KZ",
    country_phone_code: 7,
  },
  {
    label: "Kenya",
    value: "KE",
    country_phone_code: 254,
  },
  {
    label: "Kiribati",
    value: "KI",
    country_phone_code: 686,
  },
  {
    label: "Korea North",
    value: "KP",
    country_phone_code: 850,
  },
  {
    label: "Korea South",
    value: "KR",
    country_phone_code: 82,
  },
  {
    label: "Kuwait",
    value: "KW",
    country_phone_code: 965,
  },
  {
    label: "Kyrgyzstan",
    value: "KG",
    country_phone_code: 996,
  },
  {
    label: "Laos",
    value: "LA",
    country_phone_code: 856,
  },
  {
    label: "Latvia",
    value: "LV",
    country_phone_code: 371,
  },
  {
    label: "Lebanon",
    value: "LB",
    country_phone_code: 961,
  },
  {
    label: "Lesotho",
    value: "LS",
    country_phone_code: 266,
  },
  {
    label: "Liberia",
    value: "LR",
    country_phone_code: 231,
  },
  {
    label: "Libya",
    value: "LY",
    country_phone_code: 218,
  },
  {
    label: "Liechtenstein",
    value: "LI",
    country_phone_code: 423,
  },
  {
    label: "Lithuania",
    value: "LT",
    country_phone_code: 370,
  },
  {
    label: "Luxembourg",
    value: "LU",
    country_phone_code: 352,
  },
  {
    label: "Macau S.A.R.",
    value: "MO",
    country_phone_code: 853,
  },
  {
    label: "Macedonia",
    value: "MK",
    country_phone_code: 389,
  },
  {
    label: "Madagascar",
    value: "MG",
    country_phone_code: 261,
  },
  {
    label: "Malawi",
    value: "MW",
    country_phone_code: 265,
  },
  {
    label: "Malaysia",
    value: "MY",
    country_phone_code: 60,
  },
  {
    label: "Maldives",
    value: "MV",
    country_phone_code: 960,
  },
  {
    label: "Mali",
    value: "ML",
    country_phone_code: 223,
  },
  {
    label: "Malta",
    value: "MT",
    country_phone_code: 356,
  },
  {
    label: "Man (Isle of)",
    value: "XM",
    country_phone_code: 44,
  },
  {
    label: "Marshall Islands",
    value: "MH",
    country_phone_code: 692,
  },
  {
    label: "Martinique",
    value: "MQ",
    country_phone_code: 596,
  },
  {
    label: "Mauritania",
    value: "MR",
    country_phone_code: 222,
  },
  {
    label: "Mauritius",
    value: "MU",
    country_phone_code: 230,
  },
  {
    label: "Mayotte",
    value: "YT",
    country_phone_code: 269,
  },
  {
    label: "Mexico",
    value: "MX",
    country_phone_code: 52,
  },
  {
    label: "Micronesia",
    value: "FM",
    country_phone_code: 691,
  },
  {
    label: "Moldova",
    value: "MD",
    country_phone_code: 373,
  },
  {
    label: "Monaco",
    value: "MC",
    country_phone_code: 377,
  },
  {
    label: "Mongolia",
    value: "MN",
    country_phone_code: 976,
  },
  {
    label: "Montserrat",
    value: "MS",
    country_phone_code: 1664,
  },
  {
    label: "Morocco",
    value: "MA",
    country_phone_code: 212,
  },
  {
    label: "Mozambique",
    value: "MZ",
    country_phone_code: 258,
  },
  {
    label: "Myanmar",
    value: "MM",
    country_phone_code: 95,
  },
  {
    label: "Namibia",
    value: "NA",
    country_phone_code: 264,
  },
  {
    label: "Nauru",
    value: "NR",
    country_phone_code: 674,
  },
  {
    label: "Nepal",
    value: "NP",
    country_phone_code: 977,
  },
  {
    label: "Netherlands Antilles",
    value: "AN",
    country_phone_code: 599,
  },
  {
    label: "Netherlands The",
    value: "NL",
    country_phone_code: 31,
  },
  {
    label: "New Caledonia",
    value: "NC",
    country_phone_code: 687,
  },
  {
    label: "New Zealand",
    value: "NZ",
    country_phone_code: 64,
  },
  {
    label: "Nicaragua",
    value: "NI",
    country_phone_code: 505,
  },
  {
    label: "Niger",
    value: "NE",
    country_phone_code: 227,
  },
  {
    label: "Nigeria",
    value: "NG",
    country_phone_code: 234,
  },
  {
    label: "Niue",
    value: "NU",
    country_phone_code: 683,
  },
  {
    label: "Norfolk Island",
    value: "NF",
    country_phone_code: 672,
  },
  {
    label: "Northern Mariana Islands",
    value: "MP",
    country_phone_code: 1670,
  },
  {
    label: "Norway",
    value: "NO",
    country_phone_code: 47,
  },
  {
    label: "Oman",
    value: "OM",
    country_phone_code: 968,
  },
  {
    label: "Pakistan",
    value: "PK",
    country_phone_code: 92,
  },
  {
    label: "Palau",
    value: "PW",
    country_phone_code: 680,
  },
  {
    label: "Palestinian Territory Occupied",
    value: "PS",
    country_phone_code: 970,
  },
  {
    label: "Panama",
    value: "PA",
    country_phone_code: 507,
  },
  {
    label: "Papua new Guinea",
    value: "PG",
    country_phone_code: 675,
  },
  {
    label: "Paraguay",
    value: "PY",
    country_phone_code: 595,
  },
  {
    label: "Peru",
    value: "PE",
    country_phone_code: 51,
  },
  {
    label: "Philippines",
    value: "PH",
    country_phone_code: 63,
  },
  {
    label: "Pitcairn Island",
    value: "PN",
    country_phone_code: 0,
  },
  {
    label: "Poland",
    value: "PL",
    country_phone_code: 48,
  },
  {
    label: "Portugal",
    value: "PT",
    country_phone_code: 351,
  },
  {
    label: "Puerto Rico",
    value: "PR",
    country_phone_code: 1787,
  },
  {
    label: "Qatar",
    value: "QA",
    country_phone_code: 974,
  },
  {
    label: "Republic Of The Congo",
    value: "CG",
    country_phone_code: 242,
  },
  {
    label: "Reunion",
    value: "RE",
    country_phone_code: 262,
  },
  {
    label: "Romania",
    value: "RO",
    country_phone_code: 40,
  },
  {
    label: "Russia",
    value: "RU",
    country_phone_code: 70,
  },
  {
    label: "Rwanda",
    value: "RW",
    country_phone_code: 250,
  },
  {
    label: "Saint Helena",
    value: "SH",
    country_phone_code: 290,
  },
  {
    label: "Saint Kitts And Nevis",
    value: "KN",
    country_phone_code: 1869,
  },
  {
    label: "Saint Lucia",
    value: "LC",
    country_phone_code: 1758,
  },
  {
    label: "Saint Pierre and Miquelon",
    value: "PM",
    country_phone_code: 508,
  },
  {
    label: "Saint Vincent And The Grenadines",
    value: "VC",
    country_phone_code: 1784,
  },
  {
    label: "Samoa",
    value: "WS",
    country_phone_code: 684,
  },
  {
    label: "San Marino",
    value: "SM",
    country_phone_code: 378,
  },
  {
    label: "Sao Tome and Principe",
    value: "ST",
    country_phone_code: 239,
  },
  {
    label: "Saudi Arabia",
    value: "SA",
    country_phone_code: 966,
  },
  {
    label: "Senegal",
    value: "SN",
    country_phone_code: 221,
  },
  {
    label: "Serbia",
    value: "RS",
    country_phone_code: 381,
  },
  {
    label: "Seychelles",
    value: "SC",
    country_phone_code: 248,
  },
  {
    label: "Sierra Leone",
    value: "SL",
    country_phone_code: 232,
  },
  {
    label: "Singapore",
    value: "SG",
    country_phone_code: 65,
  },
  {
    label: "Slovakia",
    value: "SK",
    country_phone_code: 421,
  },
  {
    label: "Slovenia",
    value: "SI",
    country_phone_code: 386,
  },
  {
    label: "Smaller Territories of the UK",
    value: "XG",
    country_phone_code: 44,
  },
  {
    label: "Solomon Islands",
    value: "SB",
    country_phone_code: 677,
  },
  {
    label: "Somalia",
    value: "SO",
    country_phone_code: 252,
  },
  {
    label: "South Africa",
    value: "ZA",
    country_phone_code: 27,
  },
  {
    label: "South Georgia",
    value: "GS",
    country_phone_code: 0,
  },
  {
    label: "South Sudan",
    value: "SS",
    country_phone_code: 211,
  },
  {
    label: "Spain",
    value: "ES",
    country_phone_code: 34,
  },
  {
    label: "Sri Lanka",
    value: "LK",
    country_phone_code: 94,
  },
  {
    label: "Sudan",
    value: "SD",
    country_phone_code: 249,
  },
  {
    label: "Suriname",
    value: "SR",
    country_phone_code: 597,
  },
  {
    label: "Svalbard And Jan Mayen Islands",
    value: "SJ",
    country_phone_code: 47,
  },
  {
    label: "Swaziland",
    value: "SZ",
    country_phone_code: 268,
  },
  {
    label: "Sweden",
    value: "SE",
    country_phone_code: 46,
  },
  {
    label: "Switzerland",
    value: "CH",
    country_phone_code: 41,
  },
  {
    label: "Syria",
    value: "SY",
    country_phone_code: 963,
  },
  {
    label: "Taiwan",
    value: "TW",
    country_phone_code: 886,
  },
  {
    label: "Tajikistan",
    value: "TJ",
    country_phone_code: 992,
  },
  {
    label: "Tanzania",
    value: "TZ",
    country_phone_code: 255,
  },
  {
    label: "Thailand",
    value: "TH",
    country_phone_code: 66,
  },
  {
    label: "Togo",
    value: "TG",
    country_phone_code: 228,
  },
  {
    label: "Tokelau",
    value: "TK",
    country_phone_code: 690,
  },
  {
    label: "Tonga",
    value: "TO",
    country_phone_code: 676,
  },
  {
    label: "Trinidad And Tobago",
    value: "TT",
    country_phone_code: 1868,
  },
  {
    label: "Tunisia",
    value: "TN",
    country_phone_code: 216,
  },
  {
    label: "Turkey",
    value: "TR",
    country_phone_code: 90,
  },
  {
    label: "Turkmenistan",
    value: "TM",
    country_phone_code: 7370,
  },
  {
    label: "Turks And Caicos Islands",
    value: "TC",
    country_phone_code: 1649,
  },
  {
    label: "Tuvalu",
    value: "TV",
    country_phone_code: 688,
  },
  {
    label: "Uganda",
    value: "UG",
    country_phone_code: 256,
  },
  {
    label: "Ukraine",
    value: "UA",
    country_phone_code: 380,
  },
  {
    label: "United Arab Emirates",
    value: "AE",
    country_phone_code: 971,
  },
  {
    label: "United Kingdom",
    value: "GB",
    country_phone_code: 44,
  },
  {
    label: "United States",
    value: "US",
    country_phone_code: 1,
  },
  {
    label: "United States Minor Outlying Islands",
    value: "UM",
    country_phone_code: 1,
  },
  {
    label: "Uruguay",
    value: "UY",
    country_phone_code: 598,
  },
  {
    label: "Uzbekistan",
    value: "UZ",
    country_phone_code: 998,
  },
  {
    label: "Vanuatu",
    value: "VU",
    country_phone_code: 678,
  },
  {
    label: "Vatican City State (Holy See)",
    value: "VA",
    country_phone_code: 39,
  },
  {
    label: "Venezuela",
    value: "VE",
    country_phone_code: 58,
  },
  {
    label: "Vietnam",
    value: "VN",
    country_phone_code: 84,
  },
  {
    label: "Virgin Islands (British)",
    value: "VG",
    country_phone_code: 1284,
  },
  {
    label: "Virgin Islands (US)",
    value: "VI",
    country_phone_code: 1340,
  },
  {
    label: "Wallis And Futuna Islands",
    value: "WF",
    country_phone_code: 681,
  },
  {
    label: "Western Sahara",
    value: "EH",
    country_phone_code: 212,
  },
  {
    label: "Yemen",
    value: "YE",
    country_phone_code: 967,
  },
  {
    label: "Yugoslavia",
    value: "YU",
    country_phone_code: 38,
  },
  {
    label: "Zambia",
    value: "ZM",
    country_phone_code: 260,
  },
  {
    label: "Zimbabwe",
    value: "ZW",
    country_phone_code: 263,
  },
];

export default function NuevoProveedor(props) {
  const serviceAAD = new AADService();
  const [state, setState] = useState("Activo");
  const [idState, setIdState] = useState(true);
  const [dataCiiu, setDataCiiu] = useState(null);
  const [ciiuSelected, setCiiuSelected] = useState(null);
  const [certificacionesProv, setCertificacionesProv] = useState([]);
  const [contratosProv, setContratosProv] = useState([]);
  const [responsable, setResponsable] = useState([]);
  const [responsableSelected, setResponsableSelected] = useState(null);
  const [sectorSelected, setSectorSelected] = useState(null);
  const [estadoPost, setEstadoPost] = useState({
    alerta: { id: 0, data: null },
  });
  const [habilitarBoton, setHabilitarBoton] = React.useState(true);
  let history = useHistory();

  const classes = useStyles();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [selected, setSelected] = React.useState([]);

  const [showModal, setShowModal] = React.useState(false);
  const [showModalContratos, setShowModalContratos] = React.useState(false);
  const [habilitarBotonesCerti, setHabilitarBotonesCerti] = useState(false);

  const [selectedPais, setSelectedPais] = useState(null);
  const [selectedEstado, setSelectedEstado] = useState(null);
  const [selectedCiudad, setSelectedCiudad] = useState(null);
  const [habilitarEstado, setHabilitarEstado] = useState(false);
  const [habilitarCiudad, setHabilitarCiudad] = useState(false);

  useEffect(() => {
    paises.map((dat) => {
      dat["value"] = dat["label"];
    });
    async function getUsuarios() {
      const response_BO = await axios.get(
        process.env.REACT_APP_API_URL + "/usuariosrol/0/3",
        {
          headers: {
            Authorization: "Bearer " + serviceAAD.getToken(),
          },
        }
      );
      let dataBO = response_BO.data;

      const response_RM = await axios.get(
        process.env.REACT_APP_API_URL + "/usuariosrol/0/2",
        {
          headers: {
            Authorization: "Bearer " + serviceAAD.getToken(),
          },
        }
      );
      let dataRM = response_RM.data;

      let data_concat = dataBO.concat(dataRM);
      let temp = [];
      data_concat.map((dat) => {
        temp.push({
          value: dat.idposicion,
          label: dat.nombre,
          rol: dat.perfil,
        });
        return null;
      });
      setResponsable(temp);
    }
    async function getCIIU() {
      const response = await axios.get(
        process.env.REACT_APP_API_URL + "/parametros/ciiu/",
        {
          headers: {
            Authorization: "Bearer " + serviceAAD.getToken(),
          },
        }
      );
      let data = response.data;

      let temp = [];
      data.map((dat) => {
        temp.push({
          value: dat.cod,
          label: dat.nombre,
          idparametros_ciiu: dat.idparametros_ciiu,
        });
        return null;
      });
      setDataCiiu(temp);
    }
    getCIIU();
    getUsuarios();
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleChangeState = (event) => {
    if (state === "Activo") {
      setState("Inactivo");
      setIdState(false);
    } else {
      setState("Activo");
      setIdState(true);
    }
  };

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }
    if (newSelected.length !== 0) {
      setHabilitarBotonesCerti(true);
    } else {
      setHabilitarBotonesCerti(false);
    }
    setSelected(newSelected);
  };

  const isSelected = (name) => selected.indexOf(name) !== -1;

  const sendData = (e) => {
    e.preventDefault();
    //setHabilitarBoton(false);

    async function limpiar(state) {
      setTimeout(() => {
        // if (state === 2) {
        //   history.push("/EditarAreaOrganizacional");
        // }
        setHabilitarBoton(true);
        setEstadoPost({ id: 0, data: null });
      }, 3000);
    }
    function redirigir(_callback) {
      _callback();
      setTimeout(() => {
        history.push("/EditarProveedor");
      }, 2500);
    }

    const timeElapsed = Date.now();
    const today = new Date(timeElapsed);

    let fechaISOinicial = formatoFecha(today.toISOString());

    function formatoFecha(fecha) {
      return fecha.split("T")[0];
    }

    const data = {
      NIT: document.getElementById("NitProveedor").value,
      ID_SAP: document.getElementById("IDSAPProveedor").value,
      Nombre_Proveedor: document.getElementById("NombreProveedor").value,
      Alcance_Proveedor: document.getElementById("tipoProveedor").value,
      CIIU: ciiuSelected ? ciiuSelected.label : null,
      Actividad_Economica: null,
      Clasificacion_CDA: document.getElementById("clasificacion").value,
      Responsable: responsableSelected
        ? responsableSelected.value.toString()
        : null,
      Ubicacion: selectedPais
        ? selectedPais.value + " - " + selectedEstado + " - " + selectedCiudad
        : null,
      Trayectoria:
        document.getElementById("TrayectoriaMercado").value !== ""
          ? document.getElementById("TrayectoriaMercado").value
          : null,
      Tipo_Empresa: document.getElementById("tipoEmpresa").value,
      Sector: sectorSelected ? sectorSelected.value : null,
      Tipo_Entidad: document.getElementById("tipoEntidad").value,
      usuario_creador: serviceAAD.getUser().userName,
      usuario_modificador: serviceAAD.getUser().userName,
      fecha_creacion: fechaISOinicial,
      fecha_modificacion: fechaISOinicial,
      certificaciones: certificacionesProv,
      contratos: contratosProv,
    };

    fetch(process.env.REACT_APP_API_URL + "/maestros_ro/proveedor/", {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
        Authorization: "Bearer " + serviceAAD.getToken(),
      },
    })
      .then((data) =>
        data.json().then((response) => {
          if (data.status >= 200 && data.status < 300) {
            setEstadoPost({ id: 2, data: data });
            localStorage.setItem("idProveedor", response.ID_SAP);
            limpiar();
            redirigir(() => {});
          } else if (data.status >= 500) {
            setEstadoPost({ id: 5, data: response });
            limpiar();
          } else if (data.status >= 400 && data.status < 500) {
            setEstadoPost({ id: 4, data: response });
            limpiar();
          }
        })
      )
      .catch(function (err) {
        console.error(err);
      });
  };
  return (
    <>
      <AlertDismissibleExample alerta={estadoPost} />
      {/* <ModalCertificaciones
        selected={selected}
        setSelected={setSelected}
        showModal={showModal}
        setShowModal={setShowModal}
        certificacionesProv={certificacionesProv}
        setCertificacionesProv={setCertificacionesProv}
      ></ModalCertificaciones> */}
      <ModalContratos
        showModalContratos={showModalContratos}
        setShowModalContratos={setShowModalContratos}
        contratosProv={contratosProv}
        setContratosProv={setContratosProv}
      ></ModalContratos>
      <Row className="mb-3">
        <Col md={12}>
          <h1 className="titulo">Creación de un nuevo Proveedor</h1>
        </Col>
      </Row>
      <Form id="formData" onSubmit={(e) => sendData(e)}>
        <Row className="mb-3">
          <Col sm={4} xs={12}>
            <label className="form-label label">NIT*</label>
          </Col>
          <Col sm={8} xs={12}>
            <input
              type="text"
              className="form-control text-center texto"
              placeholder="NIT"
              required
              id="NitProveedor"
            ></input>
            <Form.Control.Feedback type="invalid">
              Por favor introduzca un nombre.
            </Form.Control.Feedback>
          </Col>
        </Row>
        <Row className="mb-3">
          <Col sm={4} xs={12}>
            <label className="form-label label">ID SAP*</label>
          </Col>
          <Col sm={8} xs={12}>
            <input
              type="text"
              className="form-control text-center texto"
              placeholder="ID SAP"
              required
              id="IDSAPProveedor"
            ></input>
            <Form.Control.Feedback type="invalid">
              Por favor introduzca un nombre.
            </Form.Control.Feedback>
          </Col>
        </Row>
        <Row className="mb-3">
          <Col sm={4} xs={12}>
            <label className="form-label label">Nombre de Proveedor*</label>
          </Col>
          <Col sm={8} xs={12}>
            <input
              type="text"
              className="form-control text-center texto"
              placeholder="Nombre de Proveedor"
              required
              id="NombreProveedor"
            ></input>
            <Form.Control.Feedback type="invalid">
              Por favor introduzca un nombre.
            </Form.Control.Feedback>
          </Col>
        </Row>
        <Row className="mb-3">
          <Col sm={4} xs={12}>
            <label className="form-label label">Alcance del Proveedor*</label>
          </Col>
          <Col sm={8} xs={10}>
            <select className="form-control texto" id="tipoProveedor">
              <option value="">Seleccione tipo proveedor</option>
              <option value="Nacional">Nacional</option>
              <option value="Internacional">Internacional</option>
            </select>
          </Col>
        </Row>
        <Row className="mb-3">
          <Col sm={4} xs={12}>
            <label className="form-label label">
              Responsable del proveedor
            </label>
          </Col>
          <Col sm={8} xs={10}>
            <Select
              id="valueoptionresponsable"
              placeholder={"Seleccione un Responsable del proveedor..."}
              options={responsable}
              onChange={(option) => {
                setResponsableSelected(option);
              }}
            />
          </Col>
        </Row>
        {/* TODO: buscar API para ubicacion */}
        <Row className="mb-3">
          <Col sm={4} xs={12}>
            <label className="form-label label">Ubicación del Proveedor</label>
          </Col>
          <Col sm={2} xs={10}>
            <Select
              id="ubicacion"
              placeholder={"Seleccione un país..."}
              options={paises}
              onChange={(option) => {
                setSelectedPais(option);
                setHabilitarEstado(true);
              }}
            />
          </Col>
          <Col sm={3} xs={10}>
            {/* <Select
              id="ubicacionCiudad"
              placeholder={"Seleccione un estado..."}
              options={responsable}
              onChange={(option) => {
              }}
            /> */}
            <input
              type="text"
              className="form-control text-center texto"
              placeholder="Digite un Estado/Departamento"
              required
              id="UbicacionEstado"
              disabled={!habilitarEstado}
              onChange={(estado) => {
                setSelectedEstado(estado.target.value);
                if (estado.target.value.length == 0) {
                  setHabilitarCiudad(false);
                } else {
                  setHabilitarCiudad(true);
                }
              }}
            ></input>
          </Col>
          <Col sm={3} xs={10}>
            {/* <Select
              id="ubicacionCiudad"
              placeholder={"Seleccione una ciudad..."}
              options={responsable}
              onChange={(option) => {
              }}
            /> */}
            <input
              type="text"
              className="form-control text-center texto"
              placeholder="Digite una Ciudad"
              required
              id="UbicacionCiudad"
              disabled={!habilitarCiudad}
              onChange={(ciudad) => {
                setSelectedCiudad(ciudad.target.value);
              }}
            ></input>
          </Col>
        </Row>
        <Row className="mb-3">
          <Col sm={4} xs={12}>
            <label className="form-label label">
              Trayectoria en el mercado
            </label>
          </Col>
          <Col sm={8} xs={12}>
            <input
              type="number"
              className="form-control text-center texto"
              placeholder="Trayectoria en el mercado (años)"
              id="TrayectoriaMercado"
              min="1"
            ></input>
            <Form.Control.Feedback type="invalid">
              Por favor introduzca un nombre.
            </Form.Control.Feedback>
          </Col>
        </Row>
        <Row className="mb-3">
          <Col sm={4} xs={12}>
            <label className="form-label label">Tipo de empresa</label>
          </Col>
          <Col sm={8} xs={10}>
            <select className="form-control texto" id="tipoEmpresa">
              <option value="">Seleccione tipo Empresa</option>
              <option value="Microempresa">Microempresa</option>
              <option value="Pequeña empresa">Pequeña empresa</option>
              <option value="Mediana empresa">Mediana empresa</option>
              <option value="Gran empresa">Gran empresa</option>
            </select>
          </Col>
        </Row>
        <Row className="mb-3">
          <Col sm={4} xs={12}>
            <label className="form-label label">Sector</label>
          </Col>
          <Col sm={8} xs={10}>
            <Select
              id="Sector"
              placeholder={"Seleccione un Sector..."}
              options={sector}
              onChange={(option) => {
                setSectorSelected(option);
              }}
            />
          </Col>
        </Row>
        <Row className="mb-3">
          <Col sm={4} xs={12}>
            <label className="form-label label">
              Proveedor entidad publica o privada
            </label>
          </Col>
          <Col sm={8} xs={10}>
            <select className="form-control texto" id="tipoEntidad">
              <option value="">Seleccione...</option>
              <option value="Publico">Publico</option>
              <option value="Privado">Privado</option>
            </select>
          </Col>
        </Row>

        {/* <Row className="mb-3">
          <Col sm={4} xs={12}>
            <label className="form-label label">CIIU</label>
          </Col>
          <Col sm={8} xs={12}>
            <input
              type="text"
              className="form-control text-center texto"
              placeholder="CIIU"
              required
              disabled
              id="ciuu"
            ></input>
            <Form.Control.Feedback type="invalid">
              Por favor introduzca un nombre.
            </Form.Control.Feedback>
          </Col>
        </Row> */}
        <Row className="mb-3">
          <Col sm={4} xs={12}>
            <label className="form-label label">
              CIIU - Actividad Económica
            </label>
          </Col>
          <Col sm={8} xs={12}>
            <Select
              id="ubicacionCiudad"
              placeholder={"Seleccione una actividad económica"}
              options={dataCiiu}
              onChange={(option) => {
                setCiiuSelected(option);
              }}
            />
            <Form.Control.Feedback type="invalid">
              Por favor introduzca un nombre.
            </Form.Control.Feedback>
          </Col>
        </Row>
        <Row className="mb-3">
          <Col sm={4} xs={12}>
            <label className="form-label label">Clasificación CDA</label>
          </Col>
          <Col sm={8} xs={12}>
            <input
              type="text"
              className="form-control text-center texto"
              placeholder="Campo calulado del maximo de la clasificación de los servicios relacionados"
              required
              disabled
              id="clasificacion"
            ></input>
            <Form.Control.Feedback type="invalid">
              Por favor introduzca un nombre.
            </Form.Control.Feedback>
          </Col>
        </Row>

        {/* <Row className="mb-3">
          <Col sm={12} xs={12}>
            <hr />
            <label className="form-label label">Certificaciones</label>
          </Col>
        </Row>
        <p></p>
        <Row className="mb-3 justify-content-end">
          <Col sm={4} xs={12} className="text-right"></Col>
          <Col sm={2} xs={12} className="text-right">
            {habilitarBotonesCerti ? (
              <button
                type="button"
                className="btn botonNegativo2"
                id="efecto_propio"
                onClick={() => {
                  setCertificacionesProv(
                    certificacionesProv.filter(
                      (o, index) => index !== selected[0]
                    )
                  );
                  setSelected([]);
                  setHabilitarBotonesCerti([]);
                }}
              >
                Quitar Certificación
              </button>
            ) : null}
          </Col>
          <Col sm={2} xs={12} className="text-right">
            {habilitarBotonesCerti ? (
              <button
                type="button"
                className="btn botonNegativo3"
                id="efecto_propio"
                onClick={() => {
                  setShowModal(true);
                }}
              >
                Editar Certificación
              </button>
            ) : null}
          </Col>
          <Col sm={2} xs={12} className="text-right">
            <button
              type="button"
              className="btn botonPositivo2"
              id="efecto_propio"
              onClick={() => {
                setShowModal(true);
              }}
            >
              Crear Certificación
            </button>
          </Col>
        </Row>
        <Paper className={classes.root}>
          <TableContainer component={Paper} className={classes.container}>
            <Table className={"text"} stickyHeader aria-label="sticky table">
              <TableHead className="titulo">
                <TableRow>
                  <StyledTableCell padding="checkbox"></StyledTableCell>

                  <StyledTableCell align="left">
                    Tipo Certificación
                  </StyledTableCell>
                  <StyledTableCell align="left">Vigente Hasta</StyledTableCell>
                  <StyledTableCell align="left">
                    Entidad que da el Aval
                  </StyledTableCell>
                  <StyledTableCell align="left">Estado</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {certificacionesProv
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, index) => {
                    const isItemSelected = isSelected(index);
                    return (
                      <StyledTableRow
                        key={index}
                        hover
                        onClick={(event) => handleClick(event, index)}
                        selected={isItemSelected}
                        role="checkbox"
                        tabIndex={-1}
                      >
                        <StyledTableCell component="th" scope="row">
                        </StyledTableCell>

                        <StyledTableCell align="left">
                          {row.Tipo_Certificacion
                            ? row.Tipo_Certificacion
                            : null}
                        </StyledTableCell>
                        <StyledTableCell align="left">
                          {row.Fecha_Vigencia ? row.Fecha_Vigencia : null}
                        </StyledTableCell>
                        <StyledTableCell align="left">
                          {row.Entidad_Aval ? row.Entidad_Aval : null}
                        </StyledTableCell>
                        <StyledTableCell align="left">
                          {row.Estado ? row.Estado : null}
                        </StyledTableCell>
                      </StyledTableRow>
                    );
                  })}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[10, 25, 100]}
            component="div"
            count={certificacionesProv.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper> */}

        <Row className="mb-3">
          <Col sm={12} xs={12}>
            <hr />
            <label className="form-label label">Contratos</label>
          </Col>
        </Row>
        <p></p>
        <Row className="mb-3 justify-content-end">
          <Col sm={8} xs={12} className="text-right"></Col>
          <Col sm={2} xs={12} className="text-right">
            {props.idrol.includes(1) ? (
              <button
                type="button"
                className="btn botonPositivo2"
                id="efecto_propio"
                onClick={() => {
                  setShowModalContratos(true);
                }}
              >
                Agregar/Quitar Contrato
              </button>
            ) : null}
          </Col>
        </Row>
        {/* Tabla riesgos inactivos */}
        <Paper className={classes.root}>
          <TableContainer component={Paper} className={classes.container}>
            <Table className={"text"} stickyHeader aria-label="sticky table">
              {/* Inicio de encabezado */}
              <TableHead className="titulo">
                <TableRow>
                  <StyledTableCell padding="checkbox"></StyledTableCell>
                  <StyledTableCell align="left">ID Contrato</StyledTableCell>
                  <StyledTableCell align="left">
                    Nombre del servicio
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    Responsable del contrato
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    Fecha inicio del contrato
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    Fecha fin del contrato
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    Tipo de contrato
                  </StyledTableCell>
                </TableRow>
              </TableHead>
              {/* Fin de encabezado */}
              {/* Inicio de cuerpo de la tabla */}
              <TableBody>
                {contratosProv
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, index) => {
                    return (
                      <StyledTableRow
                        key={row.Id_contrato}
                        hover
                        role="checkbox"
                        tabIndex={-1}
                      >
                        <StyledTableCell component="th" scope="row">
                          {/* <Checkbox /> */}
                        </StyledTableCell>
                        <StyledTableCell component="th" scope="row">
                          {row.Id_contrato_ariba ? row.Id_contrato_ariba : null}
                        </StyledTableCell>
                        <StyledTableCell align="left">
                          {row.Nombre ? row.Nombre : null}
                        </StyledTableCell>
                        <StyledTableCell align="left">
                          {row.Responsable ? row.Responsable : null}
                        </StyledTableCell>
                        <StyledTableCell align="left">
                          {row.Fecha_inicio ? row.Fecha_inicio : null}
                        </StyledTableCell>
                        <StyledTableCell align="left">
                          {row.Fecha_fin ? row.Fecha_fin : null}
                        </StyledTableCell>
                        <StyledTableCell align="left">
                          {row.Tipo_contrato ? row.Tipo_contrato : null}
                        </StyledTableCell>
                      </StyledTableRow>
                    );
                  })}
              </TableBody>
              {/* Fin de cuerpo de la tabla */}
            </Table>
          </TableContainer>
          {/* Inicio de paginación */}
          <TablePagination
            rowsPerPageOptions={[10, 25, 100]}
            component="div"
            count={certificacionesProv.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
          {/* Fin de paginación */}
        </Paper>

        {/* Campos para todas las vistas de los maestros */}
        {props.permisos.inactivar ? (
          <Row className="mb-3 mt-3">
            <Col sm={4} xs={4}>
              <label className="forn-label label">Estado</label>
            </Col>
            <Col>
              <FormControlLabel
                id="switch"
                className="texto"
                control={<Switch checked={idState} />}
                label={state}
                onChange={handleChangeState}
                name="Estado"
              />
            </Col>
          </Row>
        ) : null}

        <Row className="mb-3">
          <Col sm={4} xs={0}></Col>
          <Col>
            <div className="form-text">* Campos obligatorios</div>
          </Col>
        </Row>
        <Row className="mb-3">
          <Col sm={4} xs={1}></Col>
          {habilitarBoton ? (
            <>
              <Col sm={3} xs={3}>
                {props.permisos.crear ? (
                  <button type="submit" className="btn botonPositivo" id="send">
                    Guardar
                  </button>
                ) : null}
              </Col>
            </>
          ) : (
            <Col className="col-auto" sm={3} xs={3}>
              <Loader
                type="Oval"
                color="#FFBF00"
                height={30}
                width={30}
                style={{
                  textAlign: "center",
                  position: "static",
                }}
              />
            </Col>
          )}

          <Col sm={3} xs={3}>
            <Link to="Geografias">
              <button type="button" className="btn botonNegativo">
                Descartar
              </button>
            </Link>
          </Col>
        </Row>
        <Row className="mb-5 mt-5">
          <br></br>
        </Row>
      </Form>
    </>
  );
}
