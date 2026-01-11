import React from "react";

interface SuccessModalProps {
  message: string;
  onClose: () => void;
}

const SuccessModal: React.FC<SuccessModalProps> = ({ message, onClose }) => (
  <div style={{
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    background: "#0008",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 2000
  }}>
    <div style={{
      background: "#fff",
      borderRadius: 16,
      boxShadow: "0 8px 32px #0004",
      padding: 36,
      minWidth: 320,
      textAlign: "center",
      position: "relative"
    }}>
      <h3 style={{ margin: 0, marginBottom: 18, fontWeight: 700, fontSize: 22, color: "#219653" }}>¡Éxito!</h3>
      <div style={{ fontSize: 18, marginBottom: 24 }}>{message}</div>
      <button
        style={{
          background: "#219653",
          color: "#fff",
          border: "none",
          borderRadius: 10,
          padding: "10px 32px",
          fontWeight: 600,
          fontSize: 17,
          cursor: "pointer",
          boxShadow: "0 2px 12px #21965322",
          transition: "background 0.2s, box-shadow 0.2s"
        }}
        onClick={onClose}
      >
        Continuar
      </button>
    </div>
  </div>
);

export default SuccessModal;
