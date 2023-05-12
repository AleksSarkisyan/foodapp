import React, { useContext } from "react";
import ReactDOM from "react-dom";
import { ModalContext } from "../../context/modalConext";

export const Modal = () => {
    let { modalContent, handleModal, modal }: any = useContext(ModalContext);
    if (!modal) {
        return null
    }

    return ReactDOM.createPortal(
        <div
            style={{ background: "rgba(0,0,0,0.8)", height: '100%' }}
        >
            <div>
                <button
                    onClick={() => handleModal()}
                >
                    &times;
                </button>
                <div>{modalContent}</div>
            </div>
        </div>,
        document.querySelector("#modal-root") as any
    );
};