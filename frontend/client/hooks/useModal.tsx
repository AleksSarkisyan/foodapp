import { useState } from "react";

export default () => {
  let [modal, setModal] = useState(false);
  let [modalContent, setModalContent] = useState('');

  let handleModal = (content = '') => {
    if (!modal) {
      setModal(true);
    }

    if (content) {
      setModalContent(content);
    } else {
      setModal(false);
    }
  };

  return {
    modal,
    handleModal,
    modalContent
  };
};
