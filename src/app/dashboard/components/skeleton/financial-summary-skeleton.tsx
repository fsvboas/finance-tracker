import { Skeleton } from "@/src/components/skeleton";
import Flex from "@/src/components/utils/flex";

export default function FinancialSummarySkeleton() {
  return (
    <Flex className="gap-2 w-full justify-center items-center grid grid-cols-2 md:grid-cols-4">
      <Skeleton className="w-full h-22 rounded" />
      <Skeleton className="w-full h-22 rounded" />
      <Skeleton className="w-full h-22 rounded" />
      <Skeleton className="w-full h-22 rounded" />
    </Flex>
  );
}
