# Configuração do Supabase - Guia Completo

Este guia irá ajudá-lo a configurar o Supabase para o aplicativo SyncOdonto.

## Passo 1: Criar Conta no Supabase

1. Acesse [https://supabase.com](https://supabase.com)
2. Clique em "Start your project"
3. Crie uma conta usando GitHub, Google ou email

## Passo 2: Criar um Novo Projeto

1. No dashboard do Supabase, clique em "New Project"
2. Preencha os seguintes campos:
   - **Name**: SyncOdonto (ou o nome que preferir)
   - **Database Password**: Crie uma senha forte (você não precisará dela no app)
   - **Region**: Escolha a região mais próxima de você
   - **Pricing Plan**: Free (gratuito)
3. Clique em "Create new project"
4. Aguarde alguns minutos enquanto o projeto é criado

## Passo 3: Obter as Credenciais

1. No menu lateral, clique em "Project Settings" (ícone de engrenagem)
2. Clique em "API"
3. Na seção "Project API keys", você verá:
   - **Project URL**: Esta é sua `EXPO_PUBLIC_SUPABASE_URL`
   - **anon public**: Esta é sua `EXPO_PUBLIC_SUPABASE_ANON_KEY`

## Passo 4: Configurar as Variáveis de Ambiente

1. Abra o arquivo `.env` na raiz do projeto
2. Substitua os valores pelas credenciais obtidas no passo anterior:

```env
EXPO_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anonima_aqui
```

## Passo 5: Criar as Tabelas do Banco de Dados

Para que o aplicativo funcione, você precisa criar as tabelas no Supabase.

1. No dashboard do Supabase, clique em "SQL Editor" no menu lateral
2. Clique em "New query"
3. Copie todo o conteúdo do arquivo `supabase/migrations/20260217191857_create_initial_schema.sql` deste projeto
4. Cole no editor SQL do Supabase
5. Clique em "Run" (botão verde)

## Passo 6: Verificar o Banco de Dados

Após executar o SQL, o banco de dados estará configurado. Para verificar:

1. No dashboard do Supabase, clique em "Table Editor" no menu lateral
2. Você deverá ver as seguintes tabelas:
   - `profiles`
   - `patients`
   - `team_members`
   - `appointments`
   - `treatments`
   - `ai_analyses`
   - `financial_records`

## Passo 5.1: Habilitar Acesso Público (Importante!)

Como o aplicativo ainda não tem tela de login, precisamos liberar o acesso para usuários não autenticados funcionarem.

1. Ainda no "SQL Editor" do Supabase
2. Clique em "New query" novamente
3. Copie o conteúdo do arquivo `supabase/migrations/20260217200000_enable_public_access.sql`
4. Cole no editor e clique em "Run"

## Passo 7: Verificar os Dados de Exemplo

O sistema já inseriu dados de exemplo para teste. Para visualizar:

1. Clique em "Table Editor"
2. Clique na tabela `patients` - você verá 4 pacientes cadastrados
3. Clique na tabela `team_members` - você verá 3 membros da equipe
4. Clique na tabela `appointments` - você verá algumas consultas agendadas

## Passo 8: Executar o Aplicativo

Agora você pode executar o aplicativo:

```bash
npm run dev
```

O aplicativo irá se conectar ao Supabase e carregar todos os dados.

## Políticas de Segurança (RLS)

O Row Level Security (RLS) já está configurado em todas as tabelas. Por padrão:

- Usuários autenticados podem ler, criar, atualizar e deletar registros
- As políticas podem ser personalizadas no dashboard do Supabase em "Authentication" > "Policies"

## Solução de Problemas

### Erro: "Invalid API key"
- Verifique se você copiou corretamente a `anon public` key
- Certifique-se de que não há espaços extras no início ou fim da chave

### Erro: "Project URL not found"
- Verifique se a URL está correta e inclui `https://`
- Certifique-se de que o projeto está ativo no Supabase

### Dados não aparecem no app
- Verifique se as tabelas foram criadas corretamente no Table Editor
- Execute as queries SQL novamente para inserir dados de exemplo
- Verifique as políticas RLS em "Authentication" > "Policies"

## Próximos Passos

Após configurar o Supabase, você pode:

1. Adicionar autenticação de usuários
2. Personalizar os dados de exemplo
3. Criar novos pacientes, consultas e relatórios
4. Configurar backup automático dos dados

## Suporte

Para mais informações sobre o Supabase:
- [Documentação oficial](https://supabase.com/docs)
- [Guia de início rápido](https://supabase.com/docs/guides/getting-started)
- [API Reference](https://supabase.com/docs/reference/javascript/introduction)
