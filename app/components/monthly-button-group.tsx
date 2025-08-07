import { Dispatch, SetStateAction, useEffect, useRef } from "react";
import { Button } from "./ui/button";
import { ScrollArea, ScrollBar } from "./ui/scroll-area";
import Row from "./utils/row";

interface MonthlyButtonGroupProps {
  selectedMonth: number;
  setSelectedMonth: Dispatch<SetStateAction<number>>;
}

const MonthlyButtonGroup = ({
  selectedMonth,
  setSelectedMonth,
}: MonthlyButtonGroupProps) => {
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    const selectedButtonRef = buttonRefs.current[selectedMonth - 1];
    const scrollAreaElement = scrollAreaRef.current?.querySelector(
      "[data-radix-scroll-area-viewport]"
    ) as HTMLElement;

    if (selectedButtonRef && scrollAreaElement) {
      const buttonLeft = selectedButtonRef.offsetLeft;
      const buttonRight = buttonLeft + selectedButtonRef.offsetWidth;
      const scrollLeft = scrollAreaElement.scrollLeft;
      const scrollRight = scrollLeft + scrollAreaElement.clientWidth;

      const isButtonVisible =
        buttonLeft >= scrollLeft && buttonRight <= scrollRight;

      if (!isButtonVisible) {
        const buttonCenter = buttonLeft + selectedButtonRef.offsetWidth / 2;
        const scrollPosition = buttonCenter - scrollAreaElement.clientWidth / 2;

        scrollAreaElement.scrollTo({
          left: Math.max(0, scrollPosition),
          behavior: "smooth",
        });
      }
    }
  }, [selectedMonth]);

  return (
    <ScrollArea className="w-full" ref={scrollAreaRef}>
      <Row className="rounded overflow-hidden">
        {monthNamesMap.map((month, index) => {
          const shortMonthName = month.name.slice(0, 3);
          return (
            <Button
              key={month.number}
              ref={(el) => {
                buttonRefs.current[index] = el;
              }}
              onClick={() => setSelectedMonth(month.number)}
              className={`cursor-pointer
                flex-1 text-sm font-medium transition-all duration-200 rounded-none
                ${
                  selectedMonth === month.number
                    ? "bg-black text-white"
                    : "bg-white text-black hover:bg-black/10"
                }
              `}
              aria-pressed={selectedMonth === month.number}
              title={month.name}
            >
              {shortMonthName}
            </Button>
          );
        })}
      </Row>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
};

export default MonthlyButtonGroup;

const monthNamesMap = [
  { number: 1, name: "Janeiro" },
  { number: 2, name: "Fevereiro" },
  { number: 3, name: "Março" },
  { number: 4, name: "Abril" },
  { number: 5, name: "Maio" },
  { number: 6, name: "Junho" },
  { number: 7, name: "Julho" },
  { number: 8, name: "Agosto" },
  { number: 9, name: "Setembro" },
  { number: 10, name: "Outubro" },
  { number: 11, name: "Novembro" },
  { number: 12, name: "Dezembro" },
];
