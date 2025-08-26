"use client";

import { Button } from "@/src/components/button";
import { Input } from "@/src/components/input";
import { Label } from "@/src/components/label";
import Column from "@/src/components/utils/column";
import Row from "@/src/components/utils/row";
import Show from "@/src/components/utils/show";
import { useAuth } from "@/src/hooks/use-auth";
import {
  Database,
  Download,
  Loader2Icon,
  LockKeyhole,
  User,
  UserRoundX,
} from "lucide-react";
import { Controller, useForm } from "react-hook-form";

// type RegisterFormSchemaType = z.infer<typeof RegisterFormSchema>;

const UpdateUserForm = () => {
  const { user } = useAuth();

  const { handleSubmit, control } = useForm({
    // resolver: zodResolver(RegisterFormSchema),
    defaultValues: {
      oldPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    },
  });

  // const { mutate: signUp, isPending: pendingSignUp } = useMutation({
  //   mutationFn: doSignUp,
  //   onSuccess: () => {
  //     toast.success("Cadastro realizado com sucesso!", {
  //       className: "!bg-green-600/80 !text-white",
  //     });
  //     // TO-DO: Replace when create the e-mail validation
  //     router.push("/dashboard");
  //     // router.push("/entrar");
  //   },
  //   onError: (error) => {
  //     const message = translateSupabaseErrorMessages(error.message);
  //     toast.error(message, {
  //       className: "!bg-red-600/80 !text-white",
  //     });
  //   },
  // });

  // const handleSignUp = ({ name, email, password }: RegisterFormSchemaType) => {
  //   signUp({ name, email, password });
  // };

  return (
    <Column className="items-center h-fit w-full space-y-2 sm:max-w-5xl mx-auto mt-16 lg:py-4">
      <Column className="lg:rounded-lg px-2 py-4 lg:p-6 border shadow-sm w-full space-y-6">
        <Row className="items-center space-x-2">
          <User size={20} />
          <h3 className="font-bold">Minhas Informações</h3>
        </Row>
        <form id="user-info-form" className="space-y-4">
          <Column className="space-y-2">
            <Label htmlFor="name">Nome</Label>
            <Column>
              <Input
                id="name"
                value={user?.user_metadata?.display_name}
                disabled
              />
              <div className="h-2 -mt-1" />
            </Column>
          </Column>
          <Column className="space-y-2">
            <Label htmlFor="email">E-mail</Label>
            <Column>
              <Input id="email" value={user?.email} disabled />
              <div className="h-2 -mt-1" />
            </Column>
          </Column>
        </form>
      </Column>
      <Column className="lg:rounded-lg px-2 py-4 lg:p-6 border shadow-sm w-full space-y-6">
        <Row className="items-center space-x-2">
          <LockKeyhole size={20} />
          <h3 className="font-bold">Trocar Senha</h3>
        </Row>
        <form id="user-credentials-form" className="space-y-4">
          <Column className="space-y-2">
            <Label htmlFor="password">Senha Atual</Label>
            <Controller
              name="oldPassword"
              control={control}
              render={({
                field: { onChange, value },
                fieldState: { error },
              }) => (
                <Column>
                  <Input
                    id="oldPassword"
                    type="password"
                    placeholder="••••••••"
                    value={value}
                    onChange={onChange}
                    className={`${error && "border-red-600"}`}
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
            <Label htmlFor="password">Nova Senha</Label>
            <Controller
              name="newPassword"
              control={control}
              render={({
                field: { onChange, value },
                fieldState: { error },
              }) => (
                <Column>
                  <Input
                    id="newPassword"
                    type="password"
                    placeholder="••••••••"
                    value={value}
                    onChange={onChange}
                    className={`${error && "border-red-600"}`}
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
            <Label htmlFor="confirmNewPassword">Confirmar Nova Senha</Label>
            <Controller
              name="confirmNewPassword"
              control={control}
              render={({
                field: { onChange, value },
                fieldState: { error },
              }) => (
                <Column>
                  <Input
                    id="confirmNewPassword"
                    type="password"
                    placeholder="••••••••"
                    value={value}
                    onChange={onChange}
                    className={`${error && "border-red-600"}`}
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
          <Column className="mt-5">
            <Button
              className="hover:cursor-pointer self-end"
              type="submit"
              // disabled={pendingSignUp}
            >
              {/* <Show when={pendingSignUp}> */}
              {/* <Loader2Icon className="animate-spin" /> */}
              {/* </Show> */}
              Trocar Senha
            </Button>
          </Column>
        </form>
      </Column>
      <Column className="lg:rounded-lg px-2 py-4 lg:p-6 border shadow-sm w-full space-y-6">
        <Row className="items-center space-x-2">
          <Database size={20} />
          <h3 className="font-bold">Meus Dados</h3>
        </Row>
        <dl className="space-y-2">
          <Row className="space-x-2 items-center justify-between">
            <dt className="text-sm hidden sm:block">Exportar Dados</dt>
            <dd className="w-full sm:w-[150px]">
              <Button className="cursor-pointer bg-green-600 hover:bg-green-500 duration-300 text-white w-full">
                <Show when={false} fallback={<Download />}>
                  <Loader2Icon className="animate-spin" />
                </Show>
                Baixar Planilha
              </Button>
            </dd>
          </Row>
          <Row className="space-x-2 items-center justify-between">
            <dt className="text-sm hidden sm:block">
              Não quer mais utilizar o Finance Tracker?
            </dt>
            <dd className="w-full sm:w-[150px]">
              <Button className="cursor-pointer bg-red-500 hover:bg-red-400 duration-300 text-white w-full">
                <Show when={false} fallback={<UserRoundX />}>
                  <Loader2Icon className="animate-spin" />
                </Show>
                Excluir Conta
              </Button>
            </dd>
          </Row>
        </dl>
      </Column>
    </Column>
  );
};

export default UpdateUserForm;
