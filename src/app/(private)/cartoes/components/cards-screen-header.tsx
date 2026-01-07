import CreateCardFormDialog from "@/src/app/(private)/cartoes/components/create-card-form-dialog";
import { Button } from "@/src/components/core/button";
import Flex from "@/src/components/core/flex";
import { ListPlus } from "lucide-react";

const CardsScreenHeader = () => {
  return (
    <Flex as="header" className="items-center justify-between w-full">
      <h1 className="text-lg font-bold">Meus Cartões</h1>
      <CreateCardFormDialog
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
