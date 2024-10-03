"use client";
import { useState } from "react";
import {
  MultiSelector,
  MultiSelectorTrigger,
  MultiSelectorInput,
  MultiSelectorContent,
  MultiSelectorList,
  MultiSelectorItem,
} from "@/components/ui/multi-select";

// Define the prop type for options
interface Option {
  label: string;
  value: string;
}

interface MultiSelectCustomProps {
  options: Option[]; // Expecting options as a prop
  // value: string[]; // Expecting value from react-hook-form
  onChange: (value: string[]) => void;
}

const MultiSelect_Custom: React.FC<MultiSelectCustomProps> = ({
  options,

  onChange,
}) => {
  const [value, setValue] = useState<string[]>([]);

  return (
    <MultiSelector
      values={value}
      onValuesChange={(e) => {
        setValue(e);
        onChange(e);
      }}
      loop={false}
    >
      <MultiSelectorTrigger>
        <MultiSelectorInput placeholder="Select your framework" />
      </MultiSelectorTrigger>
      <MultiSelectorContent>
        <MultiSelectorList>
          {options.map((option, i) => (
            <MultiSelectorItem key={i} value={option.label}>
              {option.label}
            </MultiSelectorItem>
          ))}
        </MultiSelectorList>
      </MultiSelectorContent>
    </MultiSelector>
  );
};

export default MultiSelect_Custom;
