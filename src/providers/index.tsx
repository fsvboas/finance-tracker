import { TanstackQueryProvider } from "./tanstack-query-provider";
import { ThemeProvider } from "./theme-provider";
import { UserSecretsProvider } from "./user-secrets-provider";

interface ProvidersProps {
  children: React.ReactNode;
}

const Providers = ({ children }: ProvidersProps) => {
  return (
    <TanstackQueryProvider>
      <UserSecretsProvider>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </UserSecretsProvider>
    </TanstackQueryProvider>
  );
};

export default Providers;
