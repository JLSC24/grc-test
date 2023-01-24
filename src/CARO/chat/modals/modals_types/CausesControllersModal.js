import React from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Grid,
} from "@mui/material";
import Select from "react-select";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 800,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

export default function CausesControllersModal(props) {
  const [modal_data, setModalData] = React.useState([]);
  const [causes_data, setCausesData] = React.useState(props.modal_data.causes);
  const [controllers_data, setControllersData] = React.useState(
    props.modal_data.controllers
  );

  const [selectedCause, setSelectedCause] = React.useState();
  const [selectedControl, setSelectedControl] = React.useState();
  const causes = causes_data.map((c) => {
    return { value: c.idcausa, label: c.nombre_causa };
  });
  const controllers = controllers_data.map((c) => {
    return { value: c.id_control, label: c.nombre };
  });

  const handleDelete = (index) => {
    const rows = [...modal_data];
    rows.splice(index, 1);
    setModalData(rows);
  };
  const handleAdd = (e) => {
    var rows = [...modal_data];
    rows.push({
      idCausaControl: 0,
      idControl: selectedControl.value,
      idCausa: selectedCause.value,
      nombre_control: selectedControl.label,
      nombre_causa: selectedCause.label,
    });
    setModalData(rows);
  };
  const handleChangeCause = (e) => {
    setSelectedCause({ value: e.value, label: e.label });
  };
  const handleChangeController = (e) => {
    setSelectedControl({ value: e.value, label: e.label });
  };
  const MySelectCauses = (props) => (
    <Select
      {...props}
      className="texto"
      options={props.options}
      placeholder={props.placeholder}
    />
  );
  const MySelectController = (props) => {
    return (
      <Select
        {...props}
        className="texto"
        options={props.options}
        placeholder={props.placeholder}
      />
    );
  };
  return (
    <Box sx={style}>
      <Typography id="modal-modal-title" variant="h6" component="h2">
        Asociación Causas y Controles
      </Typography>
      <Grid container spacing={1}>
        <Grid item xs={5.5}>
          <MySelectCauses
            onChange={handleChangeCause}
            options={causes}
            placeholder="Seleccionar Causas"
            defaultValue={selectedCause}
          />
        </Grid>
        <Grid item xs={5}>
          <MySelectController
            onChange={handleChangeController}
            options={controllers}
            placeholder="Seleccionar Consecuencias"
            defaultValue={selectedControl}
          />
        </Grid>
        <Grid item xs={1}>
          <Button onClick={handleAdd} variant="outlined" color="success">
            Añadir
          </Button>
        </Grid>
        <Grid item xs={0.5}></Grid>
      </Grid>
      <Grid container spacing={1}>
        <Grid item xs={12}>
          <TableContainer>
            <Table aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>Nombre Causa</TableCell>
                  <TableCell>Nombre Control</TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {modal_data.map((row, index) => (
                  <TableRow
                    key={index}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      {row.nombre_causa}
                    </TableCell>
                    <TableCell align="left">{row.nombre_control}</TableCell>
                    <TableCell>
                      <Button
                        onClick={() => handleDelete(index)}
                        variant="outlined"
                        color="error"
                      >
                        Eliminar
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
    </Box>
  );
}
