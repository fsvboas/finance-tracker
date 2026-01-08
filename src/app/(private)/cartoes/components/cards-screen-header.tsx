import CardFormDialog from "@/src/app/(private)/cartoes/components/card-form-dialog";
import Badge from "@/src/components/badge";
import { Button } from "@/src/components/core/button";
import Flex from "@/src/components/core/flex";
import Row from "@/src/components/core/row";
import { Plus } from "lucide-react";

const CardsScreenHeader = () => {
  return (
    <Flex as="header" className="items-center justify-between w-full">
      <Row className="items-center gap-2">
        <h1 className="text-xl font-bold">Cartões</h1>
        <Badge text="Em desenvolvimento" />
      </Row>
      <CardFormDialog
        trigger={
          <Button className="cursor-pointer">
            <Plus className="w-5 h-5" />
            Novo Cartão
          </Button>
        }
      />
    </Flex>
  );
};

export default CardsScreenHeader;
