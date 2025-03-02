import { create } from "zustand";
import Option from "../types/Option";

type InputStore = {
  values: (string | Option)[];
  setValues: (v: (string | Option)[]) => void;
};

const storedValues = localStorage.getItem("values");

const useInputStore = create<InputStore>((set) => ({
  values: (storedValues ? JSON.parse(storedValues) : [""]) as InputStore["values"],
  setValues: (v: InputStore["values"]) => {
    const formatedValues = [...v.filter(Boolean), ""];
    set({ values: formatedValues });
    localStorage.setItem("values", JSON.stringify(formatedValues));
  },
}));

export default useInputStore;
