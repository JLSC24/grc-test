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
  TextField,
  MenuItem,
  Select,
} from "@mui/material";
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 600,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

export default function ControllersModal(props) {
  const [modal_data, setModalData] = React.useState(props.modal_data);
  const [tipo, setTipo] = React.useState("");

  const handleDelete = (index) => {
    const rows = [...modal_data];
    rows.splice(index, 1);
    setModalData(rows);
  };
  const handleAdd = () => {
    var rows = [...modal_data];
    var name = document.getElementById("control-name").value;
    var description = document.getElementById("control-description").value;
    var type = document.getElementById("control-type").textContent;
    var context = {
      nombre: name,
      descripcion: description,
      tipo_control_ro_n2: type,
    };
    rows.push(context);
    setModalData(rows);
    document.getElementById("control-name").value = "";
    document.getElementById("control-description").value = "";
    document.getElementById("control-type").textContent = "";
  };
  const handleChange = (event) => {
    setTipo(event.target.value);
  };
  return (
    <Box sx={style}>
      <Typography id="modal-modal-title" variant="h6" component="h2">
        Controles
      </Typography>
      <Typography id="modal-modal-description" sx={{ mt: 2 }}>
        En el siguiente cuadro solamente deje los controles que desea asociar o
        agregue nuevos.
      </Typography>
      <Grid container spacing={1}>
        <Grid item xs={3}>
          <TextField id="control-name" label="Nombre" variant="outlined" />
        </Grid>
        <Grid item xs={4}>
          <TextField
            id="control-description"
            label="Descripcion"
            variant="outlined"
          />
        </Grid>
        <Grid item xs={3}>
          <Select
            id="control-type"
            value={tipo}
            label="Tipo"
            onChange={handleChange}
          >
            <MenuItem value={"infraestructura"}>infraestructura</MenuItem>
            <MenuItem value={"personas"}>personas</MenuItem>
            <MenuItem value={"tecnologia"}>tecnología</MenuItem>
            <MenuItem value={"otros_mecanismos"}>Otros mecanismos</MenuItem>
          </Select>
        </Grid>
        <Grid item xs={2}>
          <Button
            onClick={() => handleAdd()}
            variant="outlined"
            color="success"
          >
            Añadir
          </Button>
        </Grid>
      </Grid>
      <TableContainer>
        <Table sx={{ minWidth: 850 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Nombre</TableCell>
              <TableCell align="left">Descripción</TableCell>
              <TableCell align="left">Tipo</TableCell>
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
                  {row.nombre}
                </TableCell>
                <TableCell align="left">{row.descripcion}</TableCell>
                <TableCell align="left">{row.tipo_control_ro_n2}</TableCell>
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
    </Box>
  );
}
