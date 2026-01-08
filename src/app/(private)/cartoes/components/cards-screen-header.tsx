import CardFormDialog from "@/src/app/(private)/cartoes/components/card-form-dialog";
import { Button } from "@/src/components/core/button";
import Flex from "@/src/components/core/flex";
import { ListPlus } from "lucide-react";

const CardsScreenHeader = () => {
  return (
    <Flex as="header" className="items-center justify-between w-full">
      <h1 className="text-xl font-bold">Cartões</h1>
      <CardFormDialog
        trigger={
          <Button className="cursor-pointer">
            <ListPlus className="w-5 h-5" />
            Novo Cartão
          </Button>
        }
      />
    </Flex>
  );
};

export default CardsScreenHeader;
