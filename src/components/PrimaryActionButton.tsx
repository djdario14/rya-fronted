import React from "react";
import "./PrimaryActionButton.css";

export default function PrimaryActionButton({ label, color, icon, onPress }: {
  label: string;
  color: string;
  icon?: React.ReactNode;
  onPress?: () => void;
}) {
  return (
    <button className="primary-action-btn" style={{ background: color }} onClick={onPress}>
      {icon && <span className="btn-icon">{icon}</span>}
      {label}
    </button>
  );
}
