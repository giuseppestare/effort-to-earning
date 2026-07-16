import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { fmtNum, parseNum } from "@/lib/calc";

type Props = {
  value: number;
  onChange: (n: number) => void;
  digits?: number;
  placeholder?: string;
  id?: string;
  min?: number;
};

// Accepts both "10,12" and "10.12" — displays with comma while editing is free-form.
export function NumberField({ value, onChange, digits = 2, placeholder, id, min = 0 }: Props) {
  const [text, setText] = useState<string>(() =>
    value === 0 ? "" : fmtNum(value, digits).replace(/\./g, ""),
  );
  const [focused, setFocused] = useState(false);

  useEffect(() => {
    if (!focused) {
      setText(value === 0 ? "" : fmtNum(value, digits).replace(/\./g, ""));
    }
  }, [value, digits, focused]);

  return (
    <Input
      id={id}
      inputMode="decimal"
      placeholder={placeholder ?? "0,00"}
      value={text}
      onFocus={() => setFocused(true)}
      onBlur={() => {
        setFocused(false);
        const n = parseNum(text);
        const clamped = n < min ? min : n;
        onChange(clamped);
        setText(clamped === 0 ? "" : fmtNum(clamped, digits).replace(/\./g, ""));
      }}
      onChange={(e) => {
        const raw = e.target.value.replace(/[^0-9.,]/g, "");
        setText(raw);
        onChange(parseNum(raw));
      }}
    />
  );
}
