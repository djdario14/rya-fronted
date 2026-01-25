import React from "react";
import "./SummaryCard.css";

export default function SummaryCard({
  title,
  value,
  accentColor,
  icon,
  onClick,
}: {
  title: string;
  value: string;
  accentColor: string;
  icon?: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <div
      className="summary-card"
      style={{ borderLeft: `4px solid ${accentColor}` }}
      onClick={onClick}
    >
      <div className="sc-label">{icon} {title}</div>
      <div className="sc-value" style={{ color: accentColor }}>{value}</div>
    </div>
  );
}
