import React, { useContext, useState } from "react";
import { AccountCircle } from "@mui/icons-material";
import Alert from "../modal_alerts/AlertModal";
import {
  Grid,
  InputLabel,
  Input,
  InputAdornment,
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
} from "@mui/material";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 850,
  bgcolor: "background.paper",
  border: "2px solid ",
  boxShadow: 24,
  p: 4,
  overflow: "hidden",
  overflowY: "scroll",
};

const URL = process.env.REACT_APP_API_URL + "/";
export default function DelegatesModal(props) {
  const [modal_data, setModalData] = React.useState(props.modal_data);
  const [searchedUser, setSearchedUser] = React.useState("");
  const [delegate, setDelegate] = React.useState([]);
  const [isDelegated, setIsDelegated] = React.useState(false);
  const [alert, setAlert] = React.useState(0);
  const [alertMsg, setAlertMsg] = React.useState("");

  const handleDelete = (index) => {
    try {
      const rowsData = [...modal_data];
      rowsData.splice(index, 1);
      setModalData(rowsData);
    } catch (error) {
      console.error(error);
    }

    try {
      const rowsDelegate = [...delegate];
      rowsDelegate.splice(index, 1);
      setDelegate(rowsDelegate);
      setIsDelegated(true);
    } catch (error) {
      console.error(error);
    }
  };
  const handleDelegate = () => {
    if (modal_data.length > 0) {
      let modal_data_temp = modal_data;
      modal_data_temp.push(delegate[0]);
      setModalData(modal_data_temp);
      setDelegate([]);
      setIsDelegated(true);
    } else {
      setModalData(delegate);
      setIsDelegated(true);
    }
  };
  const searchUser = async () => {
    const result = await fetch(URL + "delegados/" + searchedUser + "/", {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    });
    var searched_delegate = await result.json();
    setDelegate(searched_delegate);
    const el = document.getElementById('delegates-id');
    if (el) {
      el.scrollTop = el.scrollHeight;
    }
  };
  const sendDelegate = () => {
    try {
      var today = new Date();
      var date =
        today.getFullYear() +
        "-" +
        (today.getMonth() + 1) +
        "-" +
        today.getDate();
      var time =
        today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
      var dateTime = date + " " + time;
      const delegate_data = JSON.stringify({
        delegate: modal_data,
        user: localStorage.getItem("idposicion"),
        date_delegation: dateTime,
      });
      fetch(URL + "delegados/", {
        method: "PUT",
        headers: {
          "Content-type": "application/json; charset=UTF-8",
          //Authorization: "Bearer " + token,
        },
        body: delegate_data,
      }).then((data) =>
        data.json().then((response) => {
          if (data.status >= 200 && data.status < 300) {
            setAlert(1);
            setAlertMsg(response);
          } else if (data.status >= 300 && data.status <= 404) {
            setAlert(3);
            setAlertMsg(response);
          } else {
            setAlert(4);
            setAlertMsg(response);
          }
        })
      );
    } catch (error) {
      console.error(error);
    }
  };
  try {
    return (
      <Box sx={style}>
        <Alert msg={alertMsg} alert={alert}></Alert>
        <Typography id="modal-modal-title" variant="h6" component="h2">
          Asignación de delegados
        </Typography>
        <InputLabel>
          Solo puedes Delegar o Eliminar una persona a la vez😅.
        </InputLabel>
        <InputLabel>
          Si quieres Delegar o Elimimar más personas debes ingresar nuevamente a
          esta ventana.
        </InputLabel>
        <Grid container component="form" spacing={1}>
          <Grid item xs={10}>
            <InputLabel htmlFor="input-with-icon-adornment">
            Digita el <strong>correo electrónico</strong> completo del usuario a delegar y da clic en Buscar.
            </InputLabel>
            <InputLabel>
              Una vez aparezca la persona correcta, da clic en el botón Delegar
              y Guardar.
            </InputLabel>
            <Input
              id="input-with-icon-adornment"
              fullWidth
              startAdornment={
                <InputAdornment position="start">
                  <AccountCircle />
                </InputAdornment>
              }
              onChange={(e) => {
                setSearchedUser(e.target.value);
              }}
            />
          </Grid>
          <Grid item xs={2}>
            <Button
              variant="outlined"
              color="success"
              onClick={() => searchUser()}
            >
              Buscar
            </Button>
          </Grid>
        </Grid>
        <Grid container mb={4} spacing={1}>
          <Grid item xs={12}>
            <TableContainer sx={{maxHeight: "40vh",
                                 overflow: "auto"}}
                                 id = 'delegates-id'>
              <Table sx={{ minWidth: 850 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>Acción</TableCell>
                    <TableCell>Nombre</TableCell>
                    <TableCell align="left">Email</TableCell>
                  </TableRow>
                </TableHead>
                {modal_data.length > 0 ? (
                  <TableBody>
                    {modal_data.map((row, index) => (
                      <TableRow
                        key={index}
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
                        <TableCell>
                          <Button
                            onClick={() => handleDelete(index)}
                            variant="outlined"
                            color="error"
                          >
                            Eliminar
                          </Button>
                        </TableCell>
                        <TableCell component="th" scope="row">
                          {row.nombre}
                        </TableCell>
                        <TableCell align="left">{row.email}</TableCell>
                      </TableRow>
                    ))}
                    {delegate.map((row, index) => (
                      <TableRow
                        key={index}
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
                        <TableCell>
                          <Button
                            onClick={() => handleDelegate(index)}
                            variant="outlined"
                            color="primary"
                          >
                            Delegar
                          </Button>
                        </TableCell>
                        <TableCell component="th" scope="row">
                          {row.nombre}
                        </TableCell>
                        <TableCell align="left">{row.email}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                ) : (
                  <TableBody>
                    {delegate.map((row, index) => (
                      <TableRow
                        key={index}
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
                        <TableCell>
                          <Button
                            onClick={() => handleDelegate(index)}
                            variant="outlined"
                            color="primary"
                          >
                            Delegar
                          </Button>
                        </TableCell>
                        <TableCell component="th" scope="row">
                          {row.nombre}
                        </TableCell>
                        <TableCell align="left">{row.email}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                )}
              </Table>
            </TableContainer>
          </Grid>
        </Grid>
        {isDelegated ? (
          <Grid container spacing={1}>
            <Grid item xs={10} />
            <Grid item xs={2}>
              <Button
                variant="outlined"
                color="success"
                onClick={(e) => sendDelegate(e)}
              >
                Guardar
              </Button>
            </Grid>
          </Grid>
        ) : (
          <></>
        )}
      </Box>
    );
  } catch (error) {
    console.error(error);
  }
}
