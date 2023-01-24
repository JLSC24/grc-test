import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Button from "@mui/material/Button";

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

export default function RiskModal(props) {
  const [modal_data, setModalData] = React.useState(props.modal_data);
  const handleDelete = (index) => {
    const rows = [...modal_data];
    rows.splice(index, 1);
    setModalData(rows);
  };
  return (
    <Box sx={style}>
      <Typography id="modal-modal-title" variant="h6" component="h2">
        Riesgos
      </Typography>
      <Typography id="modal-modal-description" sx={{ mt: 2 }}>
        En el siguiente cuadro solamente deje los riesgos que hacen parte del
        proceso, los demás por favor elimínelos.
      </Typography>
      <TableContainer>
        <Table sx={{ minWidth: 850 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Nombre Riesgo</TableCell>
              <TableCell align="left">Descripción</TableCell>
              <TableCell align="left">Categoria</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {modal_data.map((row, index) => (
              <TableRow
                key={row.riesgo}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {row.nombre_riesgo}
                </TableCell>
                <TableCell align="left">{row.descripcion_general}</TableCell>
                <TableCell align="left">
                  {row.sub_categoria_corporativa}
                </TableCell>
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
