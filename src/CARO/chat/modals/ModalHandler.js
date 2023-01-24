import React from "react";
import Modal from "@mui/material/Modal";
import RiskModal from "./modals_types/RiskModal";
import ControllersModal from "./modals_types/ControllersModal";
import CausesModal from "./modals_types/CausesModal";
import CausesControllersModal from "./modals_types/CausesControllersModal";
import ConsecuencesModal from "./modals_types/ConsecuencesModal";
import DelegatesModal from "./modals_types/DelegatesModal";

function ModalHandler(props) {
  const { modal_type, modal_data } = props;
  const [open, setOpen] = React.useState(true);
  var inner_modal = <></>;
  const handleClose = () => setOpen(false);
  switch (modal_type) {
    case "risk_modal":
      inner_modal = <RiskModal modal_data={modal_data} />;
      break;
    case "controllers_modal":
      inner_modal = <ControllersModal modal_data={modal_data} />;
      break;
    case "causes_modal":
      inner_modal = <CausesModal modal_data={modal_data} />;
      break;
    case "causes_controllers_modal":
      inner_modal = <CausesControllersModal modal_data={modal_data} />;
      break;
    case "consecuences_modal":
      inner_modal = <ConsecuencesModal modal_data={modal_data} />;
      break;
    case "delegates_modal":
      inner_modal = <DelegatesModal modal_data={modal_data} />;
      break;
    default:
      break;
  }

  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        {inner_modal}
      </Modal>
    </div>
  );
}

export default ModalHandler;
