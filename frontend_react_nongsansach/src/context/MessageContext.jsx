import { createContext, useContext } from "react";
import Swal from "sweetalert2";

const MessageContext = createContext();

export function MessageProvider({ children }) {
  // Hàm show message giống Django messages
  const showMessage = (type, text) => {
    Swal.fire({
      icon: type, // "success", "error", "warning", "info"
      title: text,
      timer: 2000,
      showConfirmButton: false,
    });
  };

  return (
    <MessageContext.Provider value={{ showMessage }}>
      {children}
    </MessageContext.Provider>
  );
}

export function useMessage() {
  return useContext(MessageContext);
}
