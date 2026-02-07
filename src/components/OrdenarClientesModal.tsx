import React from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import type { DropResult, DraggableProvided, DraggableStateSnapshot, DroppableProvided } from "../types/dnd-fix";

interface OrdenarClientesModalProps {
  open: boolean;
  clientes: { id: number; nombre: string }[];
  onClose: () => void;
  onSave: (orden: { id: number; nombre: string }[]) => void;
}

const OrdenarClientesModal: React.FC<OrdenarClientesModalProps> = ({ open, clientes, onClose, onSave }) => {
  const [orden, setOrden] = React.useState(clientes);

  React.useEffect(() => {
    setOrden(clientes);
  }, [clientes, open]);

  const move = (from: number, to: number) => {
    if (to < 0 || to >= orden.length) return;
    const arr = [...orden];
    const [item] = arr.splice(from, 1);
    arr.splice(to, 0, item);
    setOrden(arr);
  };

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    move(result.source.index, result.destination.index);
  };

  if (!open) return null;

  return (
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
      zIndex: 3000
    }}>
      <div style={{
        background: "#fff",
        borderRadius: 16,
        boxShadow: "0 8px 32px #0004",
        padding: 36,
        minWidth: 260,
        width: 300,
        maxHeight: 420,
        overflowY: "auto",
        position: "relative"
      }}>
        <h3 style={{ margin: 0, marginBottom: 18, fontWeight: 700, fontSize: 22, color: "#6c63ff" }}>Ordenar Clientes</h3>
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="clientes-list">
            {(provided: DroppableProvided) => (
              <ul
                {...provided.droppableProps}
                ref={provided.innerRef}
                style={{ listStyle: "none", padding: 0, margin: 0 }}
              >
                {orden.map((c, i) => (
                  <Draggable key={c.id} draggableId={c.id.toString()} index={i}>
                    {(provided: DraggableProvided, snapshot: DraggableStateSnapshot) => (
                      <li
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 10,
                          marginBottom: 8,
                          background: snapshot.isDragging ? "#e0e7ff" : "#f7f7fa",
                          borderRadius: 8,
                          padding: "8px 12px",
                          boxShadow: snapshot.isDragging ? "0 2px 8px #6c63ff33" : undefined,
                          ...provided.draggableProps.style
                        }}
                      >
                        <span style={{ flex: 1, cursor: "grab" }}>{c.nombre}</span>
                        <button onClick={() => move(i, i - 1)} disabled={i === 0} style={{ background: "none", border: "none", color: i === 0 ? "#ccc" : "#219653", fontSize: 18, cursor: i === 0 ? "not-allowed" : "pointer" }}>▲</button>
                        <button onClick={() => move(i, i + 1)} disabled={i === orden.length - 1} style={{ background: "none", border: "none", color: i === orden.length - 1 ? "#ccc" : "#219653", fontSize: 18, cursor: i === orden.length - 1 ? "not-allowed" : "pointer" }}>▼</button>
                      </li>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </ul>
            )}
          </Droppable>
        </DragDropContext>
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 12, marginTop: 24 }}>
          <button onClick={onClose} style={{ background: "#eee", color: "#444", border: "none", borderRadius: 8, padding: "10px 24px", fontWeight: 600, fontSize: 16 }}>Cancelar</button>
          <button onClick={() => onSave(orden)} style={{ background: "#219653", color: "#fff", border: "none", borderRadius: 8, padding: "10px 24px", fontWeight: 600, fontSize: 16 }}>Guardar</button>
        </div>
      </div>
    </div>
  );
};

export default OrdenarClientesModal;
