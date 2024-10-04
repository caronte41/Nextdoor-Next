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
import { Label } from "@/components/ui/label";

// Define the prop type for options
interface Option {
  label: string;
  value: string;
}

interface MultiSelectCustomProps {
  options: Option[]; // Expecting options as a prop
  // value: string[]; // Expecting value from react-hook-form
  label?: string;
  onChange: (value: string[]) => void;
}

const MultiSelect_Custom: React.FC<MultiSelectCustomProps> = ({
  options,
  label,
  onChange,
}) => {
  const [value, setValue] = useState<string[]>([]);

  return (
    <div className="flex  flex-col space-y-1">
      <Label htmlFor="multi">{label}</Label>
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
    </div>
  );
};

export default MultiSelect_Custom;
