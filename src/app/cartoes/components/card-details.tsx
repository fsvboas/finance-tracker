import Column from "@/src/components/utils/column";
import Row from "@/src/components/utils/row";

// NOME DO CARTÃO (NUBANK)
// TIPO DE CARTÃO (CRÉDITO/DÉBITO)
// DATA DE VENCIMENTO
// LIMITE DO CARTÃO (VALOR TOTAL)
// TOTAL GASTO NO CARTÃO
// LIMITE DISPONÍVEL (VALOR DO LIMITE DO CARTÃO - TOTAL GASTO NO CARTÃO)

const CardDetails = () => {
  return (
    <Row className="dark:bg-[#202020] w-full h-fit p-4 rounded justify-between">
      <Column>
        <h3 className="text-xl">Nubank - Crédito</h3>
        {/* <h4 className="text-base"></h4> */}
        <h5 className="text-sm mt-2">Venc.: 18/2032</h5>
      </Column>
      <Column className="text-end">
        <p className="text-xl">Limite do Cartão: R$ 4.500,00</p>
        <p className="text-base">Total Gasto: R$ 2.500,00</p>
        <p className="text-base">Limite Disponível: R$ 2.000,00</p>
      </Column>
    </Row>
  );
};

export default CardDetails;
