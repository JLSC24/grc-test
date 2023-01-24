import axios from "axios";
import AADService from "../auth/authFunctions";

export default function ModCargaArchivo(
  modelo,
  id_elemento,
  id_elemento_sec,
  nombre_archivo,
  file,
  method,
  id_adjunto
) {
  let form_file = new FormData();
  let name_file;

  let extension = nombre_archivo.split(".");

  extension = extension[extension.length - 1];
  const serviceAAD = new AADService();

  if (id_elemento_sec) {
    name_file =
      modelo + "-" + id_elemento + "-" + id_elemento_sec + "." + extension;
  } else {
    name_file = modelo + "-" + id_elemento + "." + extension;
  }

  form_file.append("archivo", file, name_file);
  form_file.append("tabla", modelo);
  form_file.append("id_elemento", id_elemento);
  form_file.append("id_elemento_sec", id_elemento_sec);
  form_file.append("id_adjunto", id_adjunto);

  form_file.append("nombre_archivo", nombre_archivo);

  for (var pair of form_file.entries()) {
    console.warn(pair[0] + ", " + pair[1]);
  }

  if (method === "POST") {
    return axios
      .post(process.env.REACT_APP_API_URL + "/adjuntos/", form_file, {
        headers: {
          "content-type": "multipart/form-data",
          Authorization: "Bearer " + serviceAAD.getToken(),
        },
      })
      .then((res) => {
        console.log("Aqui va la respuesta1!!!!!!1", res);
        return res.data;
      })
      .catch((err) => {
        return err;
      });
  } else if (method === "PUT") {
    return axios
      .put(process.env.REACT_APP_API_URL + "/adjuntos/", form_file, {
        headers: {
          "content-type": "multipart/form-data",
        },
      })
      .then((res) => {
        return res.data;
      })
      .catch((err) => {
        return err;
      });
  }
}

/* 

form_file = ModCargaArchivo(
    "modelo",
    "id_elemento",
    form_file,
    archivoCert
); 
    
*/
