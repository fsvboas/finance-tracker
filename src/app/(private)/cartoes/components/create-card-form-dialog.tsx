"use client";

import { Dialog, DialogContent, DialogTrigger } from "@/src/components/dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

interface CreateCardFormDialogProps {
  trigger: React.ReactNode;
}

export const cardFormSchema = z.object({});

export type CardFormSchemaType = z.infer<typeof cardFormSchema>;

const CreateCardFormDialog = ({ trigger }: CreateCardFormDialogProps) => {
  //   const { credentials } = useUserSecrets();
  //   const { user } = useAuth();

  const [isOpen, setIsOpen] = useState<boolean>(false);

  const { control, handleSubmit, reset, watch, setValue } =
    useForm<CardFormSchemaType>({
      resolver: zodResolver(cardFormSchema),
    });

  //   const { mutate: post, isPending: pendingPostTransaction } = useMutation({
  //     mutationFn: postTransaction,
  //     onSuccess: async (_, variables) => {
  //       toast.success(successMessage, {
  //         className: "!bg-green-600/80 !text-white",
  //       });
  //       setIsOpen(false);
  //     },
  //     onError: (error) => {
  //       toast.error(error.message, {
  //         className: "!bg-red-600/80 !text-white",
  //       });
  //     },
  //   });

  const handleCreateNewCard = (card: CardFormSchemaType) => {};

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>Card Form</DialogContent>
      {/* <DialogContent>
        <form
          id="transaction-form"
          onSubmit={handleSubmit(handleCreateNewCard)}
          className="space-y-4 my-4"
        >
          <DialogHeader>
            <DialogTitle />
            <Controller
              name="type"
              control={control}
              render={({ field }) => (
                <Tabs
                  value={field.value}
                  onValueChange={field.onChange}
                  className="items-center"
                >
                  <TabsList className="w-full">
                    <TabsTrigger
                      className="!text-green-600 hover:cursor-pointer"
                      value="income"
                    >
                      Entrada
                    </TabsTrigger>
                    <TabsTrigger
                      className="!text-red-600 hover:cursor-pointer"
                      value="expense"
                    >
                      Saída
                    </TabsTrigger>
                    <TabsTrigger
                      className="!text-yellow-600 hover:cursor-pointer"
                      value="investment"
                    >
                      Investimento
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              )}
            />
          </DialogHeader>
          <Column>
            <Flex className="flex-col sm:flex-row max-sm:space-y-4 sm:space-x-2">
              <Column className="space-y-2 w-full">
                <Label htmlFor="description">
                  Transação<span className="text-red-500">*</span>
                </Label>
                <Controller
                  name="description"
                  control={control}
                  render={({
                    field: { onChange, value },
                    fieldState: { error },
                  }) => (
                    <Column>
                      <Input
                        id="description"
                        placeholder="Salário"
                        value={value}
                        onChange={onChange}
                        className={`min-w-[180px] w-full ${
                          error && "border-red-600"
                        }`}
                      />
                      <div className="h-2 -mt-1">
                        <Show when={error}>
                          <span className="text-xs text-red-600">
                            {error?.message}
                          </span>
                        </Show>
                      </div>
                    </Column>
                  )}
                />
              </Column>
              <Column className="space-y-2">
                <Label htmlFor="value">
                  Valor<span className="text-red-500">*</span>
                </Label>
                <Controller
                  name="value"
                  control={control}
                  render={({
                    field: { onChange, value },
                    fieldState: { error },
                  }) => (
                    <Column>
                      <Input
                        id="value"
                        inputMode="numeric"
                        placeholder="R$ 2.000,00"
                        value={currencyFormatter(Number(value))}
                        onChange={(event) => {
                          const rawValue = event.target.value.replace(
                            /\D/g,
                            ""
                          );
                          onChange(rawValue);
                        }}
                        className={`w-full sm:w-[150px] ${
                          error ? "border-red-600" : ""
                        }`}
                      />
                      <div className="h-2 -mt-1">
                        <Show when={error}>
                          <span className="text-xs text-red-600">
                            {error?.message}
                          </span>
                        </Show>
                      </div>
                    </Column>
                  )}
                />
              </Column>
            </Flex>
            <Show when={isExpenseTransaction}>
              <Flex className="flex-col sm:flex-row max-sm:space-y-4 sm:space-x-2 mt-4">
                <Column className="space-y-2 w-full">
                  <Label htmlFor="payment_method">Método de pagamento</Label>
                  <Controller
                    name="payment_method"
                    control={control}
                    render={({ field: { value, onChange } }) => (
                      <Column className="w-full">
                        <PaymentMethodSelectInput
                          value={value ?? ""}
                          onChange={onChange}
                        />
                        <div className="h-2 -mt-1" />
                      </Column>
                    )}
                  />
                </Column>
                <Column className="space-y-2 w-full">
                  <Label htmlFor="card">Cartão</Label>
                  <Controller
                    name="card"
                    control={control}
                    render={({
                      field: { onChange, value },
                      fieldState: { error },
                    }) => (
                      <Column>
                        <CardSelectInput
                          value={value ?? ""}
                          onChange={onChange}
                          disabled={isNotCreditOrDebitCard}
                          error={Boolean(error)}
                        />
                        <div className="h-2 -mt-1">
                          <Show when={error}>
                            <span className="text-xs text-red-600">
                              {error?.message}
                            </span>
                          </Show>
                        </div>
                      </Column>
                    )}
                  />
                </Column>
              </Flex>
            </Show>
            <Flex className="flex-col sm:flex-row max-sm:space-y-4 sm:space-x-2 mt-4">
              <Column className="space-y-2 sm:w-[150px]">
                <Label htmlFor="created_at">Data</Label>
                <Controller
                  name="created_at"
                  control={control}
                  render={({ field: { value, onChange } }) => (
                    <Column className="w-full">
                      <DatePicker
                        value={value}
                        onValueChange={(date) => onChange(date)}
                      />
                      <div className="h-2 -mt-1" />
                    </Column>
                  )}
                />
              </Column>
              <Column className="space-y-2 w-full sm:max-w-[146px]">
                <Label htmlFor="repeat_months">Repetir por</Label>
                <Controller
                  name="repeat_months"
                  control={control}
                  render={({ field: { value, onChange } }) => (
                    <Column className="w-full">
                      <RepeatTransactionSelectInput
                        value={value ?? ""}
                        onChange={onChange}
                      />
                      <div className="h-2 -mt-1" />
                    </Column>
                  )}
                />
              </Column>
            </Flex>
          </Column>
          <DialogFooter>
            <DialogClose asChild>
              <Button
                className="hover:cursor-pointer"
                variant="secondary"
                disabled={pendingPostTransaction}
              >
                <XIcon />
                Cancelar
              </Button>
            </DialogClose>
            <Button
              className="hover:cursor-pointer"
              type="submit"
              disabled={pendingPostTransaction}
            >
              <Show when={pendingPostTransaction} fallback={<PlusIcon />}>
                <Loader2Icon className="animate-spin" />
              </Show>
              Adicionar
            </Button>
          </DialogFooter>
        </form>
      </DialogContent> */}
    </Dialog>
  );
};

export default CreateCardFormDialog;
