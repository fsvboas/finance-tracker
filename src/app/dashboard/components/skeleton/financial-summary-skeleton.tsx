import { Skeleton } from "@/src/components/skeleton";
import Flex from "@/src/components/utils/flex";

export default function FinancialSummarySkeleton() {
  return (
    <Flex className="sm:space-x-2 max-sm:space-y-2 flex-col sm:flex-row w-full justify-center items-center">
      <Skeleton className="w-full h-[88px]" />
      <Skeleton className="w-full h-[88px]" />
      <Skeleton className="w-full h-[88px]" />
    </Flex>
  );
}
