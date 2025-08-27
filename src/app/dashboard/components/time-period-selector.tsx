import { Button } from "@/src/components/button";
import { ScrollArea, ScrollBar } from "@/src/components/scroll-area";
import { Skeleton } from "@/src/components/skeleton";
import Column from "@/src/components/utils/column";
import Row from "@/src/components/utils/row";
import Show from "@/src/components/utils/show";
import { useMediaQuery } from "@/src/hooks/use-media-query";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Dispatch, SetStateAction, useEffect, useRef } from "react";

interface TimePeriodSelectorProps {
  selectedYear: number;
  setSelectedYear: Dispatch<SetStateAction<number>>;
  selectedMonth: number;
  setSelectedMonth: Dispatch<SetStateAction<number>>;
  pending: boolean;
}

const TimePeriodSelector = ({
  selectedYear,
  setSelectedYear,
  selectedMonth,
  setSelectedMonth,
  pending,
}: TimePeriodSelectorProps) => {
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const isDesktop = useMediaQuery("(min-width: 768px)");

  const currentYear = new Date().getFullYear();
  const minYear = currentYear - 2;
  const maxYear = currentYear + 2;

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const selectedButtonRef = buttonRefs.current[selectedMonth - 1];

      const findScrollAreaElement = (): HTMLElement | null => {
        if (!scrollAreaRef.current) return null;

        return (scrollAreaRef.current.querySelector(
          "[data-radix-scroll-area-viewport]"
        ) ||
          scrollAreaRef.current.querySelector(".scroll-area-viewport") ||
          scrollAreaRef.current) as HTMLElement;
      };

      const scrollAreaElement = findScrollAreaElement();

      if (selectedButtonRef && scrollAreaElement) {
        requestAnimationFrame(() => {
          const buttonRect = selectedButtonRef.getBoundingClientRect();
          const scrollRect = scrollAreaElement.getBoundingClientRect();
          const isButtonVisible =
            buttonRect.left >= scrollRect.left &&
            buttonRect.right <= scrollRect.right;

          if (!isButtonVisible) {
            const buttonCenter =
              selectedButtonRef.offsetLeft + selectedButtonRef.offsetWidth / 2;
            const scrollPosition =
              buttonCenter - scrollAreaElement.clientWidth / 2;
            const finalScrollPosition = Math.max(0, scrollPosition);

            scrollAreaElement.scrollTo({
              left: finalScrollPosition,
              behavior: "smooth",
            });

            scrollAreaElement.scrollLeft = finalScrollPosition;
          }
        });
      }
    }, 500);

    return () => clearTimeout(timeoutId);
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
    <Column className={`w-full space-y-2 mt-2 ${isDesktop && "mb-2"}`}>
      <Row className="items-center justify-between md:justify-end space-x-2 max-[780px]:px-2">
        <Show
          when={!pending}
          fallback={
            <>
              <Skeleton className="w-9 h-9 rounded" />
              <Skeleton className="w-13 h-9 rounded" />
              <Skeleton className="w-9 h-9 rounded" />
            </>
          }
        >
          <Button
            size="icon"
            variant="outline"
            className="cursor-pointer bg-neutral-100 hover:bg-neutral-200"
            onClick={handlePreviousYear}
            disabled={selectedYear <= minYear}
          >
            <ArrowLeft />
          </Button>
          <span className="min-w-[50px] text-center">{selectedYear}</span>
          <Button
            size="icon"
            variant="outline"
            className="cursor-pointer bg-neutral-100 hover:bg-neutral-200"
            onClick={handleNextYear}
            disabled={selectedYear >= maxYear}
          >
            <ArrowRight />
          </Button>
        </Show>
      </Row>
      <ScrollArea
        className={`w-full ${!isDesktop && "pb-2.5"}`}
        ref={scrollAreaRef}
      >
        <Show
          when={!pending}
          fallback={<Skeleton className="w-full h-9 rounded" />}
        >
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
                    ? "bg-black text-white hover:!bg-[#101010]"
                    : "bg-neutral-100 dark:bg-[#202020] text-black dark:text-white hover:bg-neutral-200 dark:hover:bg-[#101010]"
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
        </Show>
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
