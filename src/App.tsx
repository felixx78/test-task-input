import { useQuery } from "react-query";
import Input from "./components/Input";
import useInputStore from "./store/useInputStore";
import Option from "./types/Option";
import { useEffect, useState } from "react";

const fetchOptions = async () => {
  const response = await fetch("https://652f91320b8d8ddac0b2b62b.mockapi.io/autocomplete");
  const data = await response.json();
  return data as Option[];
};

function App() {
  const { data: options, isLoading } = useQuery({
    queryKey: ["options"],
    queryFn: fetchOptions,
  });

  if (!options && isLoading) return <p>Loading...</p>;
  else if (!options && !isLoading) return <p>API Error</p>;

  return (
    <div className="pt-12">
      <Result options={options} />
      <Input options={options} />
      <OptionList options={options} />
    </div>
  );
}

const operators = new Set(["+", "-", "*", "/", "(", ")"]);

const Result = ({ options }: { options: Option[] }) => {
  const { values } = useInputStore();
  const [result, setResult] = useState<string | number>();

  useEffect(() => {
    try {
      const formatedValues: (string | number)[] = [];

      values
        .filter((i) => i !== "")
        .forEach((i) => {
          const prev = formatedValues[formatedValues.length - 1];

          if (prev && !operators.has(i.toString()) && !operators.has(prev.toString())) {
            formatedValues.push("*");
          }

          if (typeof i === "object") {
            const find = options.find((option) => option.id === i.id);
            if (find) formatedValues.push(find.value);
          } else formatedValues.push(i);
        });

      setResult(eval(formatedValues.join(" ")));
    } catch (_) {
      setResult("Error");
    }
  }, [values]);

  return <div className="mb-28 pl-8">{result}</div>;
};

const OptionList = ({ options }: { options: Option[] }) => {
  return (
    <div className="mt-36 mb-6 space-y-2">
      {options.map((i) => (
        <div key={i.id} className="mx-auto flex max-w-[50vw] justify-between">
          <p>{i.name}</p>
          <p>{typeof i.value === "string" ? eval(i.value) : i.value}</p>
        </div>
      ))}
    </div>
  );
};

export default App;
