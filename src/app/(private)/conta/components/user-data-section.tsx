"use client";

import { Button } from "@/src/components/core/button";
import Column from "@/src/components/core/column";
import Row from "@/src/components/core/row";
import Show from "@/src/components/core/show";
import { Database, Loader2Icon, UserRoundX } from "lucide-react";
import DeleteAccountDialogDrawer from "./delete-account-dialog-drawer";

const UserDataSection = () => {
  return (
    <Column className="lg:rounded-lg px-2 py-4 lg:p-6 border shadow-sm w-full space-y-6">
      <Row className="items-center space-x-2">
        <Database size={20} />
        <h3 className="font-bold">Meus Dados</h3>
      </Row>
      <dl className="space-y-2">
        {/* <Row className="space-x-2 items-center justify-between">
          <dt className="text-sm hidden sm:block">Exportar Dados</dt>
          <dd className="w-full sm:w-[150px]">
            <Button
              disabled
              className="cursor-pointer bg-green-600 hover:bg-green-500 duration-300 text-white w-full"
            >
              <Show when={false} fallback={<Download />}>
                <Loader2Icon className="animate-spin" />
              </Show>
              Baixar Planilha
            </Button>
          </dd>
        </Row> */}
        <Row className="space-x-2 items-center justify-between">
          <dt className="text-sm hidden sm:block">
            Não quer mais utilizar o Finance Tracker?
          </dt>
          <dd className="w-full sm:w-[150px]">
            <DeleteAccountDialogDrawer
              trigger={
                <Button className="cursor-pointer bg-red-500 hover:bg-red-400 duration-300 text-white w-full">
                  <Show when={false} fallback={<UserRoundX />}>
                    <Loader2Icon className="animate-spin" />
                  </Show>
                  Excluir Conta
                </Button>
              }
            />
          </dd>
        </Row>
      </dl>
    </Column>
  );
};

export default UserDataSection;
