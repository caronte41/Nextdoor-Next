import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "@/components/ui/label";

interface DatePicker_CustomProps {
  label?: string;
  value?: Date;
  onChange: (value: Date) => void;
}

export function DatePicker_Custom({
  label,
  onChange,
  value,
}: DatePicker_CustomProps) {
  const [internalDate, setInternalDate] = React.useState<Date | undefined>(
    value
  );

  const handleDateSelect = (date: Date) => {
    setInternalDate(date);
    onChange(date); // Pass the date back to react-hook-form
  };

  return (
    <div className="flex flex-col space-y-1">
      <Label htmlFor="combo">{label}</Label>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={"outline"}
            className={cn(
              "w-[280px] justify-start text-left font-normal",
              !internalDate && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {internalDate ? (
              format(internalDate, "PPP")
            ) : (
              <span>Pick a date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar
            mode="single"
            selected={internalDate}
            onSelect={handleDateSelect}
            initialFocus
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
