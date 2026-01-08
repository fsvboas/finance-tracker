import { Container } from "@/src/components/core/container";

export default function NextStepsScreen() {
  return (
    <Container variant="page">
      <h1 className="text-xl font-bold self-start">Próximos Passos</h1>
      <ol className="list-decimal list-inside w-full">
        {nextSteps.map((step, index) => (
          <li key={index} className="mb-4 text-muted-foreground">
            {step}
          </li>
        ))}
      </ol>
    </Container>
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
