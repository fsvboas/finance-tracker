"use client";

import DateFormatter from "@/app/helpers/date-formatter";
import { ChevronDownIcon } from "lucide-react";
import { useState } from "react";
import { pt } from "react-day-picker/locale";
import Column from "../utils/column";
import Flex from "../utils/flex";
import Show from "../utils/show";
import { Button } from "./button";
import { Calendar } from "./calendar";
import { Input } from "./input";
import { Label } from "./label";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";

function DateTimePicker() {
  const [open, setOpen] = useState<boolean>(false);
  const [date, setDate] = useState<Date | undefined>(undefined);

  const transactionDateFormatted = date?.toISOString();

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
              <Show when={date} fallback={"Selecione a data"}>
                <DateFormatter>{transactionDateFormatted}</DateFormatter>
              </Show>
              <ChevronDownIcon />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="overflow-hidden p-0" align="start">
            <Calendar
              locale={pt}
              mode="single"
              selected={date}
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

export { DateTimePicker };
