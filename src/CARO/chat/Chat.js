import React, { useState, useContext, createContext } from "react";
import ModalHandler from "./modals/ModalHandler";
import Message from "./estructure/Message";
import Header from "./estructure/Header";
import UserInput from "./estructure/UserInput";
import Report from "./reports/Report";
import ReportDelegates from "./reports/ReportDelegates";
import Collapse from "react-bootstrap/Collapse";
import { Button } from "react-bootstrap";
import AADService from "../../auth/authFunctions";

const URL = process.env.REACT_APP_API_URL + "/";

//localStorage.setItem("idPosicion", ); //PARA PRUEBAS SE PUEDE IR CAMBIANDO ESTE ID
class Chat extends React.Component {
  constructor() {
    super();
    this.state = {
      user: {},
      open: false,
      response: 0,
      activity: 0,
      messages: [],
      last_message: {},
    };
    this.serviceAAD = new AADService();
    this.sendMessage = this.sendMessage.bind(this);
  }

  componentDidMount = () => {
    let idPosicion;
    const GetUser = async () => {
      const result = await fetch(
        process.env.REACT_APP_API_URL + "/usuario/" +
          this.serviceAAD.getUser().userName +
          "/",
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            Authorization: "Bearer " + this.serviceAAD.getToken(),
          },
        }
      );
      let data = await result.json();
      this.setState({ user: data });
      idPosicion = data.idposicion;
      localStorage.setItem("idposicion", idPosicion);
    };

    const initial_conversation = async () => {
      await GetUser();
      var data = {
        response: this.state.response,
        current_activity: this.state.activity,
        user: idPosicion,
      };

      var msg = JSON.stringify(data);
      try {
        fetch(URL + "conversation", {
          method: "PUT",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
            //Authorization: "Bearer " + token,
          },
          body: msg,
        }).then((data) =>
          data.json().then((response) => {
            if (data.status >= 200 && data.status < 300) {
              this.setState({
                messages: [...this.state.messages, response],
                last_message: response,
              });
            } else if (data.status >= 300 && data.status <= 404) {
              console.error("ERROR DE BUSQUEDA: ", data);
            } else {
              console.error("ERROR DE SERVIDOR: ", data);
            }
          })
        );
      } catch (error) {
        console.error(error);
      }
    };
    initial_conversation();
  };

  sendMessage(message) {
    this.setState({
      messages: [...this.state.messages, message],
    });
    const conversation = () => {
      var data = {
        response: message.msg,
        current_activity: this.state.activity,
        user: this.state.user.idposicion,
      };
      var msg = JSON.stringify(data);
      if (data.response.length > 1) {
        let proceso = data.response;
        sessionStorage.setItem("myProceso", JSON.stringify(data.response));
      }
      try {
        fetch(URL + "conversation", {
          method: "PUT",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
            //Authorization: "Bearer " + token,
          },
          body: msg,
        }).then((data) =>
          data.json().then((response) => {
            if (data.status >= 200 && data.status < 300) {
              this.setState({
                messages: [...this.state.messages, response],
                activity: response.activity,
                last_message: response,
              });

              const el = document.getElementById("chats-id");
              if (el) {
                el.scrollTop = el.scrollHeight;
              }
            } else if (data.status >= 300 && data.status <= 404) {
              console.error("ERROR DE BUSQUEDA: ", data);
            } else {
              console.error("ERROR DE SERVIDOR: ", data);
            }
          })
        );
      } catch (error) {
        console.error(error);
      }
    };
    conversation();
  }
  render() {
    return (
      <div className="container_caro">
        <Collapse in={this.state.open}>
          <div className="chat-box">
            {this.state.last_message.modal !== undefined ? (
              <ModalHandler
                modal_type={this.state.last_message.modal}
                modal_data={this.state.last_message.data}
              />
            ) : (
              <></>
            )}
            {this.state.last_message.ero_data !== undefined ? (
              <Report eroData={this.state.last_message.ero_data} />
            ) : (
              <></>
            )}
            {this.state.last_message.delegates_data !== undefined ? (
              <ReportDelegates
                delegatesData={this.state.last_message.delegates_data}
              />
            ) : (
              <></>
            )}
            <Header />
            <Message messages={this.state.messages} />
            <UserInput
              sendMessage={this.sendMessage}
              activity={this.state.activity}
            />
          </div>
        </Collapse>
        <Button
          className="chat-btn"
          variant="link"
          onClick={() => this.setState({ open: !this.state.open })}
          aria-controls="example-collapse-text"
          aria-expanded={this.state.open}
        >
          <img src="CARO_INICIO.png" alt="BOTON" />
        </Button>
      </div>
    );
  }
}

export default Chat;
