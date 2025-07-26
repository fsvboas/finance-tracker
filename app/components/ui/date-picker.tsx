"use client";

import { TransactionType } from "@/app/types/transaction-type";
import { ChevronDownIcon } from "lucide-react";
import { useState } from "react";
import Column from "../utils/column";
import Flex from "../utils/flex";
import { Button } from "./button";
import { Calendar } from "./calendar";
import { Input } from "./input";
import { Label } from "./label";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";

interface DatePickerProps {
  transactionDate?: TransactionType["date"];
}

function DatePicker({ transactionDate }: DatePickerProps) {
  const [open, setOpen] = useState<boolean>(false);
  const [date, setDate] = useState<Date | undefined>(undefined);

  return (
    <Flex className="space-x-2 max-[425px]:flex-col max-[425px]:space-y-4">
      <Column className="flex flex-col space-y-2 w-full">
        <Label htmlFor="date-picker">Data</Label>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              id="date-picker"
              className="w-full min-w-[150px] justify-between font-normal"
            >
              {(date ?? transactionDate)?.toLocaleDateString() ||
                "Selecione a data"}
              <ChevronDownIcon />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="overflow-hidden p-0" align="start">
            <Calendar
              mode="single"
              selected={date}
              captionLayout="dropdown"
              onSelect={(date) => {
                setDate(date);
                setOpen(false);
              }}
            />
          </PopoverContent>
        </Popover>
      </Column>
      <Column className="space-y-2">
        <Label htmlFor="time-picker">Horário</Label>
        <Input
          type="time"
          id="time-picker"
          step="1"
          defaultValue="10:30:00"
          className="bg-background w-full appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
        />
      </Column>
    </Flex>
  );
}

export { DatePicker };
