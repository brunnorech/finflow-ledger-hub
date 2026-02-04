"use client";

import * as React from "react";
import { ptBR } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { formatDateToBR } from "@/utils/format";

/** Converte string dd/mm/yyyy para Date (ou undefined se inválida) */
function parseBRToDateSafe(value: string): Date | undefined {
  const match = value.trim().match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (!match) return undefined;
  const [, d, m, y] = match;
  const month = parseInt(m, 10) - 1;
  const day = parseInt(d, 10);
  const year = parseInt(y, 10);
  const date = new Date(year, month, day);
  if (isNaN(date.getTime())) return undefined;
  if (
    date.getDate() !== day ||
    date.getMonth() !== month ||
    date.getFullYear() !== year
  )
    return undefined;
  return date;
}

export interface DatePickerPtBrProps {
  /** Valor no formato dd/mm/yyyy */
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  id?: string;
}

export function DatePickerPtBr({
  value = "",
  onChange,
  placeholder = "dd/mm/aaaa",
  className,
  disabled,
  id,
}: DatePickerPtBrProps) {
  const [open, setOpen] = React.useState(false);
  const date = value ? parseBRToDateSafe(value) : undefined;

  const handleSelect = (selected: Date | undefined) => {
    if (!selected) return;
    onChange?.(formatDateToBR(selected));
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          id={id}
          variant="outline"
          disabled={disabled}
          className={cn(
            "hover:bg-transparent min-h-11 w-full justify-start text-left font-normal",
            !value && "text-muted-foreground",
            className
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {value || placeholder}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={handleSelect}
          locale={ptBR}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}
