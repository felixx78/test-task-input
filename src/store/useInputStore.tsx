import { create } from "zustand";

type InputStore = {
  values: string[];
  setValues: (v: string[]) => void;
};

const useInputStore = create<InputStore>((set) => ({
  values: (localStorage.getItem("values") || []) as string[],
  setValues: (v: string[]) => {
    set({ values: v });
    localStorage.setItem("values", JSON.stringify(v));
  },
}));

export default useInputStore;
