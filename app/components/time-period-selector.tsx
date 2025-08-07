import { ArrowLeft, ArrowRight } from "lucide-react";
import { Dispatch, SetStateAction, useEffect, useRef } from "react";
import { Button } from "./ui/button";
import { ScrollArea, ScrollBar } from "./ui/scroll-area";
import Column from "./utils/column";
import Row from "./utils/row";

interface TimePeriodSelectorProps {
  selectedYear: number;
  setSelectedYear: Dispatch<SetStateAction<number>>;
  selectedMonth: number;
  setSelectedMonth: Dispatch<SetStateAction<number>>;
}

const TimePeriodSelector = ({
  selectedYear,
  setSelectedYear,
  selectedMonth,
  setSelectedMonth,
}: TimePeriodSelectorProps) => {
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const currentYear = new Date().getFullYear();
  const minYear = currentYear - 2;
  const maxYear = currentYear + 2;

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

  const handlePreviousYear = () => {
    if (selectedYear > minYear) {
      setSelectedYear(selectedYear - 1);
    }
  };

  const handleNextYear = () => {
    if (selectedYear < maxYear) {
      setSelectedYear(selectedYear + 1);
    }
  };

  return (
    <Column className="w-full space-y-2 py-2">
      <Row className="items-center justify-end space-x-2 max-[780px]:px-2">
        <Button
          size="icon"
          variant="outline"
          className="cursor-pointer"
          onClick={handlePreviousYear}
          disabled={selectedYear <= minYear}
        >
          <ArrowLeft />
        </Button>
        <span>{selectedYear}</span>
        <Button
          size="icon"
          variant="outline"
          className="cursor-pointer"
          onClick={handleNextYear}
          disabled={selectedYear >= maxYear}
        >
          <ArrowRight />
        </Button>
      </Row>
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
                flex-1 text-sm font-medium transition-all duration-200 rounded-none border-r last:border-0
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
    </Column>
  );
};

export default TimePeriodSelector;

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
