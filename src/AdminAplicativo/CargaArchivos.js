import React, { Component } from "react";
import axios from "axios";

class App extends Component {
  state = {
    tabla: "",
    id_elemento: "",
    archivo: null,
  };

  handleChange = (e) => {
    this.setState({
      [e.target.id]: e.target.value,
    });
  };

  handleImageChange = (e) => {
    this.setState({
      archivo: e.target.files[0],
    });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    let form_data = new FormData();
    form_data.append("archivo", this.state.archivo, this.state.archivo.name);
    form_data.append("tabla", this.state.tabla);
    form_data.append("id_elemento", this.state.id_elemento);
    let url = process.env.REACT_APP_API_URL + "/adjuntos/";
    axios
      .post(url, form_data, {
        headers: {
          "content-type": "multipart/form-data",
        },
      })
      .then((res) => {
        console.warn(res.data);
      })
      .catch((err) => console.warn(err));
  };

  render() {
    return (
      <div className="App">
        <form onSubmit={this.handleSubmit}>
          <p>
            <input
              type="text"
              placeholder="tabla"
              id="tabla"
              value={this.state.tabla}
              onChange={this.handleChange}
              required
            />
          </p>
          <p>
            <input
              type="text"
              placeholder="id_elemento"
              id="id_elemento"
              value={this.state.id_elemento}
              onChange={this.handleChange}
              required
            />
          </p>
          <p>
            <input
              type="file"
              id="archivo"
              accept="*"
              onChange={this.handleImageChange}
              required
            />
          </p>
          <input type="submit" />
        </form>
      </div>
    );
  }
}

export default App;
