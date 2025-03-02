import { useEffect, useRef, useState } from "react";
import useInputStore from "../store/useInputStore";
import Option from "../types/Option";

function Input({ options }: { options: Option[] }) {
  const { values, setValues } = useInputStore();

  const handleDeleteTag = (indexToRemove: number) => {
    return () => {
      setValues(values.filter((_, index) => index !== indexToRemove));
    };
  };

  return (
    <div className="flex justify-center">
      <div className="flex h-10 w-[80vw] rounded-md border border-gray-600 py-1.5 pr-9 pl-3 text-black outline-none">
        {values.map((i, index) =>
          typeof i === "object" ? (
            <OptionTag key={i.id} onDelete={handleDeleteTag(index)} {...i} />
          ) : (
            <ChildInput key={index} index={index} options={options} fullWidth={index === values.length - 1} />
          ),
        )}
      </div>
    </div>
  );
}

type OptionTagProps = {
  name: string;
  onDelete: () => void;
};

const OptionTag = ({ name, onDelete }: OptionTagProps) => {
  return (
    <div className="mx-2 flex divide-x-2 divide-gray-400 bg-gray-300 px-2 py-0.5 text-sm">
      <p className="pr-2">{name}</p>
      <button onClick={onDelete} className="cursor-pointer pl-2">
        [X]
      </button>
    </div>
  );
};

type ChildInputProps = {
  index: number;
  options: Option[];
  fullWidth?: boolean;
};

function ChildInput({ index, options, fullWidth }: ChildInputProps) {
  const { values, setValues } = useInputStore();
  const value = (values?.[index] as string) || "";

  const wordsRef = useRef<HTMLDivElement>(null);
  const lastWordRef = useRef<HTMLSpanElement | null>(null);
  const [inputWidth, setInputWidth] = useState(100);
  const [isOpen, setIsOpen] = useState(false);
  const [lastWordRect, setLastWordRect] = useState<DOMRect | null>(null);

  useEffect(() => {
    if (wordsRef.current) setInputWidth(wordsRef.current.offsetWidth + 10);
  }, [value]);

  useEffect(() => {
    if (lastWordRef.current) setLastWordRect(lastWordRef.current.getBoundingClientRect());
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const valuesCopy = [...values];
    valuesCopy[index] = e.target.value;
    setValues(valuesCopy);

    requestAnimationFrame(() => {
      if (wordsRef.current) setInputWidth(wordsRef.current.offsetWidth + 10);
    });
  };

  const handleSelectOption = (v: Option) => {
    const valuesCopy = [...values];
    valuesCopy[index] = (valuesCopy[index] as string).split(" ").slice(0, -1).join(" ");
    valuesCopy.push(v);
    setValues(valuesCopy);
  };

  const words = value.split(" ");
  const lastWord = words[words.length - 1].toLowerCase();
  const filteredOptions = options.filter((i) => i.name.toLowerCase().startsWith(lastWord));

  return (
    <div className={`relative ${fullWidth ? "flex-1" : ""}`}>
      <div ref={wordsRef} className="invisible absolute left-0 whitespace-pre">
        {words.map((word, index) => (
          <span key={index} ref={index === words.length - 1 ? lastWordRef : null}>
            {word}
          </span>
        ))}
      </div>

      <input
        className="text-black outline-none"
        value={value}
        onChange={handleChange}
        style={{ width: !fullWidth ? `${inputWidth}px` : "100%" }}
        onFocus={() => setIsOpen(true)}
      />

      {isOpen && lastWord && lastWordRect && filteredOptions.length > 0 && (
        <div
          style={{
            left: lastWordRect.left - wordsRef.current!.getBoundingClientRect().left,
          }}
          className="absolute top-[110%] max-h-[300px] w-[300px] overflow-y-auto border bg-white shadow-md"
        >
          {filteredOptions.map((i) => (
            <button
              key={i.id}
              onClick={() => handleSelectOption(i)}
              className="block w-full cursor-pointer px-2 py-1 text-left hover:bg-gray-300"
            >
              {i.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default Input;
