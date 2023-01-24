//Espacio para realizar las importaciones
import AADService from "../auth/authFunctions";
import axios from "axios";

export default async function Queries(data, url, method) {
  const serviceAAD = new AADService();
  let dataReturn;

  if (method === "GET") {
    const response = await axios.get(process.env.REACT_APP_API_URL + "" + url, {
      headers: {
        Authorization: "Bearer " + serviceAAD.getToken(),
      },
    });
    dataReturn = response.data;
  } else if (method === "POST") {
    const response = await axios
      .post(process.env.REACT_APP_API_URL + "" + url, data, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + serviceAAD.getToken(),
        },
      })
      .catch(function (error) {
        console.error(error.toJSON());
        return error.toJSON();
      });

    dataReturn = response;

    return dataReturn;
  } else if (method === "PUT") {
    const response = await axios.put(process.env.REACT_APP_API_URL + "" + url, data, {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + serviceAAD.getToken(),
      },
    });
    dataReturn = response;
  }

  return dataReturn;
}
