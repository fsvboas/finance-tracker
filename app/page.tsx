import Card from "./components/financial-summary-card";
import Column from "./components/utils/column";
import Flex from "./components/utils/flex";

export default function Home() {
  const incomings = 100000;
  const outcomings = 50000;
  const total = incomings - outcomings;

  return (
    <div className="min-h-screen w-full flex items-center bg-black/95 justify-center">
      <Column className="items-center space-y-4 w-full">
        <h1 className="text-2xl text-white">Finance Tracker</h1>
        <Flex className="sm:space-x-2 max-sm:space-y-2 flex-col sm:flex-row w-full justify-center items-center px-2">
          <Card title="Entradas" value={incomings} />
          <Card title="Saídas" value={outcomings} />
          <Card title="Total" value={total} />
        </Flex>
      </Column>
    </div>
  );
}
