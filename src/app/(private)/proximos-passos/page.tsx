import Column from "@/src/components/core/column";

export default function NextStepsScreen() {
  return (
    <Column className="space-y-4 items-center w-full justify-center h-fit sm:max-w-5xl mx-auto mt-16 lg:py-4">
      <h1 className="text-3xl font-bold w-full">Próximos Passos</h1>
      <ol className="list-decimal list-inside my-4 w-full">
        {nextSteps.map((step, index) => (
          <li key={index} className="mb-4 text-muted-foreground">
            {step}
          </li>
        ))}
      </ol>
    </Column>
  );
}

const nextSteps = [
  "Criação de Cartões (sem dados sensíveis) para melhor organização, podendo adicionar o limite, a data de vencimento e outras informações relevantes. Suas transações serão associadas aos cartões criados, centralizando o controle financeiro;",
  'Implementação de Categorias de Despesas e Receitas para melhor organização das transações. Você poderá criar categorias personalizadas, como "Alimentação", "Transporte", "Lazer", entre outras, facilitando a análise dos seus gastos;',
  "Criação de uma Dashboard personalizada que fornecerá uma visão geral das suas finanças, incluindo gráficos de despesas, receitas e metas financeiras. Também será possível acompanhar o crescimento de seu capital ao longo do tempo;",
  "Implementação de Metas Financeiras, permitindo que você defina objetivos específicos, como economizar para uma viagem ou pagar dívidas. A aplicação ajudará a monitorar seu progresso em direção a essas metas;",
  "Notificações e Lembretes para pagamentos de contas, vencimentos de cartões e outras atividades financeiras importantes, garantindo que você nunca perca um prazo;",
  "Calculadora de Juros Compostos integrada para ajudar no planejamento de seus investimentos e crescimento do capital ao longo do tempo;",
  "Exportação de transações em formatos CSV, XLSX ou XLS, facilitando a análise externa;",
  "Melhoria na identidade visual e interface da aplicação, melhorando a experiência geral do usuário;",
  "Melhoria no sistema de PIN, transformando-o em uma funcionalidade opcional e adicionando métodos de recuperação do mesmo.",
];
