// Patch para tipos rotos de @hello-pangea/dnd con TypeScript 5+
// Coloca este archivo en src/types/dnd-fix.d.ts y agrega "types": ["src/types/dnd-fix.d.ts"] en tu tsconfig.json si es necesario

import type {
  DropResult as OrigDropResult,
  DraggableProvided as OrigDraggableProvided,
  DraggableStateSnapshot as OrigDraggableStateSnapshot,
  DroppableProvided as OrigDroppableProvided
} from '@hello-pangea/dnd';

export type DropResult = OrigDropResult;
export type DraggableProvided = OrigDraggableProvided;
export type DraggableStateSnapshot = OrigDraggableStateSnapshot;
export type DroppableProvided = OrigDroppableProvided;
