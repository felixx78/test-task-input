import { create } from "zustand";
import Option from "../types/Option";

type InputStore = {
  values: (string | Option)[];
  setValues: (v: (string | Option)[]) => void;
};

const storedValues = localStorage.getItem("values");

const formatValues = (values: InputStore["values"]) => {
  const filtered = values.filter(Boolean);
  if (typeof filtered[filtered.length - 1] === "object") filtered.push("");
  return filtered;
};

const useInputStore = create<InputStore>((set) => ({
  values: (storedValues ? JSON.parse(storedValues) : [""]) as InputStore["values"],
  setValues: (v: InputStore["values"]) => {
    const formatedValues = formatValues(v);
    set({ values: formatedValues });
    localStorage.setItem("values", JSON.stringify(formatedValues));
  },
}));

export default useInputStore;
