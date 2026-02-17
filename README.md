# SyncOdonto - Sistema de Gestão Odontológica

Aplicativo mobile completo de gestão para clínicas odontológicas, desenvolvido com React Native, Expo Router e Supabase.

## Funcionalidades

### Dashboard
- Visão geral da clínica com estatísticas em tempo real
- Pacientes ativos
- Consultas do dia
- Tratamentos pendentes
- Análises com IA
- Próximos atendimentos
- Alertas da IA
- Impacto sustentável (economia de papel)

### Lista de Pacientes
- Cadastro completo de pacientes
- Busca e filtros
- Informações de contato
- Status ativo/inativo

### Agenda Inteligente
- Calendário de consultas
- Visualização por dia, semana ou mês
- Agendamento de consultas
- Estatísticas do dia
- Taxa de ocupação

### Gestão Paperless
- Sistema digital de documentos
- Prontuários eletrônicos
- Impacto ambiental

### Gestão da Clínica
- Gerenciamento de equipe
- Informações financeiras
- Taxa de ocupação
- Tempo médio de consulta
- Receita mensal

### Relatórios
- Relatórios semanais
- Total de consultas
- Consultas concluídas e canceladas
- Novos pacientes
- Gráficos e estatísticas

## Tecnologias Utilizadas

- **React Native** - Framework para desenvolvimento mobile
- **Expo Router** - Sistema de navegação baseado em arquivos
- **TypeScript** - Tipagem estática
- **Supabase** - Backend as a Service (PostgreSQL)
- **Lucide React Native** - Biblioteca de ícones

## Configuração

### 1. Instalar Dependências

```bash
npm install
```

### 2. Configurar Supabase

1. Acesse o [Supabase](https://supabase.com) e crie um novo projeto
2. Copie a URL do projeto e a chave anônima (anon key)
3. Configure as variáveis de ambiente no arquivo `.env`:

```env
EXPO_PUBLIC_SUPABASE_URL=sua_url_do_supabase
EXPO_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anonima_do_supabase
```

### 3. Banco de Dados

O banco de dados já foi configurado automaticamente com:
- 7 tabelas principais (profiles, patients, team_members, appointments, treatments, ai_analyses, financial_records)
- Políticas de segurança RLS
- Dados de exemplo para teste

### 4. Executar o Aplicativo

```bash
npm run dev
```

Escaneie o QR code com o aplicativo Expo Go no seu dispositivo móvel.

## Estrutura do Projeto

```
├── app/
│   ├── (tabs)/              # Telas com navegação por tabs
│   │   ├── _layout.tsx      # Layout dos tabs
│   │   ├── index.tsx        # Dashboard
│   │   ├── patients.tsx     # Lista de Pacientes
│   │   ├── schedule.tsx     # Agenda Inteligente
│   │   ├── paperless.tsx    # Gestão Paperless
│   │   ├── clinic.tsx       # Gestão da Clínica
│   │   └── reports.tsx      # Relatórios
│   └── _layout.tsx          # Layout principal
├── components/              # Componentes reutilizáveis
│   ├── Header.tsx
│   └── StatCard.tsx
├── lib/
│   └── supabase.ts          # Cliente Supabase
└── types/
    └── database.ts          # Tipos TypeScript

```

## Esquema do Banco de Dados

### Tabelas

1. **profiles** - Perfis de usuários
2. **patients** - Pacientes cadastrados
3. **team_members** - Membros da equipe
4. **appointments** - Agendamentos e consultas
5. **treatments** - Tratamentos
6. **ai_analyses** - Análises com IA
7. **financial_records** - Registros financeiros

## Design

O aplicativo segue um design moderno e profissional com:
- Cores principais: Ciano/Turquesa (#17a2b8)
- Layout responsivo
- Componentes bem estruturados
- Navegação intuitiva
- Estatísticas visuais

## Desenvolvimento Futuro

Funcionalidades planejadas:
- Autenticação de usuários
- Upload de imagens e documentos
- Integração com IA para análise de imagens odontológicas
- Sistema de notificações push
- Exportação de relatórios em PDF
- Integração com sistemas de pagamento

## Licença

Este projeto é de código aberto para fins educacionais.
