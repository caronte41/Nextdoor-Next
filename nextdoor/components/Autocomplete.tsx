import { useState, useRef, useCallback, useEffect } from "react";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Command, CommandItem, CommandList } from "@/components/ui/command";

interface AutocompleteCustomProps {
  placeholder?: string;
  value: string; // Controlled value from react-hook-form
  onChange: (value: string) => void; // onChange handler from react-hook-form
  onInputChange: (value: string) => void; // Custom handler to fetch predictions
  predictions: string[];
}

const debounce = (func: (...args: any[]) => void, delay: number) => {
  let timeoutId: ReturnType<typeof setTimeout>;
  return (...args: any[]) => {
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func(...args);
    }, delay);
  };
};

const Autocomplete_Custom: React.FC<AutocompleteCustomProps> = ({
  placeholder = "Search...",
  value,
  onChange,
  onInputChange,
  predictions,
}) => {
  const [inputValue, setInputValue] = useState(value); // Track the input field value
  const [isPopoverOpen, setPopoverOpen] = useState(false); // Control popover visibility
  const inputRef = useRef<HTMLInputElement>(null); // Ref to keep input focused
  const popoverRef = useRef<HTMLDivElement>(null); // Ref for the popover to check for outside clicks

  // Debounced input change handler
  const debouncedInputChange = useCallback(
    debounce((newValue: string) => {
      onInputChange(newValue); // Fetch predictions after a delay
    }, 300),
    []
  );

  // Handle input change and trigger custom handler for predictions
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    setInputValue(newValue);
    setPopoverOpen(!!newValue); // Open popover only when there's input
    debouncedInputChange(newValue); // Fetch predictions with debounce
  };

  // Handle click outside input or popover
  const handleClickOutside = (event: MouseEvent) => {
    if (
      inputRef.current &&
      !inputRef.current.contains(event.target as Node) &&
      popoverRef.current &&
      !popoverRef.current.contains(event.target as Node)
    ) {
      setPopoverOpen(false); // Close popover when clicking outside
    }
  };

  // Attach event listener to handle clicks outside
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Keep the input field focused when predictions change
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus(); // Manually ensure input remains focused
    }
  }, [predictions]);

  // Handle selecting a prediction
  const handleSelect = (prediction: string) => {
    setInputValue(prediction); // Update local input
    onChange(prediction); // Update react-hook-form with selected value
    setPopoverOpen(false); // Close the popover on selection
    if (inputRef.current) {
      inputRef.current.focus(); // Refocus the input field after selection
    }
  };

  return (
    <Popover open={isPopoverOpen} onOpenChange={setPopoverOpen}>
      <PopoverTrigger>
        <Input
          ref={inputRef}
          value={inputValue}
          onChange={handleInputChange}
          placeholder={placeholder}
          aria-label={placeholder}
          onFocus={() => {
            //setPopoverOpen(!!inputValue);
          }}
        />
      </PopoverTrigger>
      {predictions.length > 0 && isPopoverOpen && (
        <PopoverContent ref={popoverRef} className="w-full">
          <Command>
            <CommandList>
              {predictions.map((prediction, index) => (
                <CommandItem
                  key={index}
                  onMouseDown={(e) => e.preventDefault()}
                  onSelect={() => handleSelect(prediction)}
                >
                  {prediction}
                </CommandItem>
              ))}
            </CommandList>
          </Command>
        </PopoverContent>
      )}
    </Popover>
  );
};

export default Autocomplete_Custom;
