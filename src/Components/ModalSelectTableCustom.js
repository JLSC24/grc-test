import React, { useState, useEffect } from "react";
import { Button, Modal } from "react-bootstrap";

import TableCustom from "./TableCustom";

export default function ModalSelectTableCustom({
  showMod,
  setShowMod,
  data,
  setData,
  dataTable,
  multi,
}) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (showMod === true) {
      setShow(true);
    }
  }, [showMod, setShow]);

  const handleClose = () => {
    setData(null)
    setShow(false);
    setShowMod(false);
  };

  const retornarSelected = (dataSelected) => {
    let tempSelected = [];
    dataTable.dataTable.map((usrMod) => {
      dataSelected.map((usrSelected) => {
        if (usrSelected === usrMod[dataTable.nameId]) {
          tempSelected.push(usrMod);
        }
      });
    });
    if (multi) {
      setData(tempSelected);
    } else {
      setData(tempSelected[0]);
    }
  };

  return (
    <>
      <Modal
        size="sm"
        show={show}
        onHide={handleClose}
        aria-labelledby="contained-modal-title-vcenter"
        centered
        dialogClassName="my-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title id="example-modal-sizes-title-sm">
            Seleccionar elemento
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {dataTable ? (
            <TableCustom
              data={dataTable.dataTable}
              nameCol={dataTable.nameCol}
              nameRow={dataTable.nameRow}
              nameId={dataTable.nameId}
              multi={multi}
              busqueda={dataTable.busqueda}
              nameBusqueda={dataTable.nameBusqueda}
              selectedData={data}
              setSelectedData={setData}
            />
          ) : (
            <p> Debe de incluir los datos para mostrar en la tabla </p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button
            className="botonPositivo"
            onClick={() => {
              handleClose();
              retornarSelected(data);
            }}
          >
            Aceptar
          </Button>
          <Button variant="secondary" onClick={handleClose}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
      <span></span>
    </>
  );
}
