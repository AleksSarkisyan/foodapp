import React, { createContext } from "react";
import useModal from "../hooks/useModal";
import { Modal } from "../components/shared/modal";

let ModalContext: any;

let { Provider } = (ModalContext = createContext(ModalContext));

let ModalProvider = ({ children }: any) => {
    let { modal, handleModal, modalContent } = useModal();
    return (
        <Provider value={{ modal, handleModal, modalContent } as any}>
            <Modal />
            {children}
        </Provider>
    );
};

export { ModalContext, ModalProvider };
