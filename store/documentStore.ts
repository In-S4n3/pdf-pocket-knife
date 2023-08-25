import { create } from "zustand";

interface documentState {
  file: undefined;
  setFile: (by: undefined) => void;
  buffer: undefined;
  setBuffer: (by: undefined) => void;
}

export const useDocumentStore = create<documentState>()((set) => ({
  file: undefined,
  setFile: (by) => set(() => ({ file: by })),
  buffer: undefined,
  setBuffer: (by) => set(() => ({ buffer: by })),
}));
