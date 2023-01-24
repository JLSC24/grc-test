import React, { useState, useEffect } from "react";
import {
    Row,
    Col,
    Form,
    Alert,
    Button,
    Container,
    Modal,
  } from "react-bootstrap";
  

import AADService from "../../auth/authFunctions";
import axios from "axios";

export default function ModalEstadoCrear(props){   
  
    return (
        <>
          <Modal
            {...props}
            size="sm"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            dialogClassName="my-modal"
          >
            <Modal.Header closeButton>
              <Modal.Title id="example-modal-sizes-title-sm">
                Se hicieron cambios en elemento principal o en Riesgos. El estado de su evaluacón pasará a creada
              </Modal.Title>
            </Modal.Header>
            <Modal.Footer>
              <Button variant="secondary" onClick={props.onHide}>
                Cerrar
              </Button>
              <Button
                className="botonPositivo"
                onClick={() => {
                    props.sendData("Creada");
                    props.onHide();
                }}
                >
                Aceptar
              </Button>
            </Modal.Footer>
          </Modal>
          <span></span>
        </>
    );
}



