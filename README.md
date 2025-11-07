# 📋 Sistema de Gestão de Tarefas Colaborativo

Sistema full-stack de gerenciamento de tarefas com notificações em tempo real, desenvolvido como teste técnico para a vaga de **Full-stack Developer**.

---

## 🚀 Como rodar

```bash
# Clone o repositório
git clone
cd task-manager

# Inicie com Docker
docker-compose build
docker-compose up -d

# Acesse
🌐 Frontend: http://localhost:5173
📚 API Docs: http://localhost:3001/api/docs
🐇 RabbitMQ Management: http://localhost:15672 (admin/admin)
```

---

## 🛠️ Tecnologias

### **Frontend**

- **React 19** - UI Library
- **TanStack Router** - Roteamento type-safe
- **Tailwind CSS** - Estilização utility-first
- **shadcn/ui** - Componentes acessíveis
- **TanStack Query** - Cache e state management assíncrono
- **Axios** - Para requisições API
- **Zustand** - State management (auth)
- **Socket.IO Client** - WebSocket real-time
- **Zod + React Hook Form** - Validação de formulários

### **Backend**

- **NestJS** - Framework Node.js
- **TypeORM** - ORM para PostgreSQL
- **RabbitMQ** - Message broker (microservices)
- **Passport JWT** - Autenticação
- **Socket.IO** - WebSocket server
- **PostgreSQL 17** - Banco de dados relacional
- **Swagger** - Documentação automática

### **DevOps**

- **Docker & Docker Compose** - Containerização
- **Turborepo** - Monorepo build system
- **pnpm** - Package manager

---

## 🏛️ Arquitetura

```
        ┌──────────────┐
        │    Frontend   │
        │  (React + WS) │
        └──────┬────────┘
               │ HTTP + WS
               ▼
         ┌─────────────┐
         │ API Gateway │
         └──────┬──────┘
                │ RPC / Mensageria (RabbitMQ)
 ┌──────────────┴──────────────┐
 │                             │
 ▼                             ▼
Auth Service            Tasks Service
 (JWT, Users)           (Tasks, Comments)
 │                             │
 └──────────────┬──────────────┘
                │ Eventos (task.created, task.updated, comment.new)
                ▼
        Notifications Service
         (WebSocket + persistência)
```

---

## ✨ Funcionalidades

### **Autenticação & Autorização**

- Cadastro de usuários com validação
- Login com email ou username
- JWT com access token (15 min) e refresh token (7 dias)
- Refresh automático de token (Rota implementada, mas falhando no frontend)
- Proteção de rotas (Guards)
- Rate limiting (10 req/seg)

### **Gestão de Tarefas**

- CRUD completo de tarefas
- Campos: título, descrição, prazo, prioridade, status
- Atribuição de múltiplos usuários (Implementada no backend e acessível via Swagger, mas faltando no front)
- Filtros por status e prioridade
- Busca por título/descrição
- Paginação (load more)
- Badges coloridas (status, prioridade)
- Indicador de prazos (vencida, hoje, amanhã)

### **Comentários**

- Adicionar comentários em tarefas
- Listagem com paginação
- Avatar com iniciais do autor
- Timestamps relativos ("há 5 minutos")

### **Histórico de Alterações**

- Audit log automático de todas as mudanças
- Timeline de eventos
- Registro de criação, edição, mudança de status, comentários

### **Notificações em Tempo Real** 🔥

- WebSocket com Socket.IO
- Notificações instantâneas (para os usuários atribuídos à tarefa):
  - Tarefa atribuída
  - Status alterado
  - Novo comentário
- Toast notifications com ações (Ver Tarefa)
- Badge de contador de notificações no sino
- Lista de notificações recentes
- Reconexão automática
- Notificações offline (enviadas ao reconectar)

### **UI/UX**

- Design responsivo (mobile, tablet, desktop)
- Skeleton loaders (shimmer effect)
- Estados de loading e erro
- Validação client-side (Zod)
- Confirmações de ações destrutivas

---

## 🧠 Decisões Técnicas

### **1. Notificações não persistem na UI**

**Por quê?**

- ✅ Simplicidade (requisito: apenas real-time)
- ✅ Não foi pedido histórico de notificações

**Trade-off:**

- ❌ Usuário offline perde notificações antigas
- ❌ Só vê últimas 24h ao reconectar

### **2. Desnormalização de Dados (authorName em Comments)**

**Por quê?**

- ✅ Evita JOINs desnecessários
- ✅ Performance (lista de comentários é rápida)
- ✅ Microservices pattern (sem JOIN entre serviços)

**Trade-off:**

- ❌ Duplicação de dados
- ❌ Inconsistência se username mudar

### **3. Assigned Users simplificado**

**Por quê?**

- ✅ Prazo curto
- ✅ Uso de simple-array para relação de usuários atribuídos

**Trade-off:**

- ❌ Menos flexível, mas atende o requisito funcional

### **4. Migrations no Docker**

**Por quê?**

- ✅ CLI do TypeORM falhou no container, então usei synchronize: true temporário

**Trade-off:**

- ❌ Viável localmente, inadequado para produção

---

## 🧩 Problemas Conhecidos

❌ Dono da tarefa não recebe notificações (não está como assignedTo)

❌ Responsividade com falhas em alguns breakpoints

❌ Falta de suporte a múltiplos filtros (priority=MEDIUM&HIGH)

❌ Configuração do tsconfig/eslint inconsistente entre packages

❌ refreshToken funcionando via backend, mas falhando no frontend

❌ Migrations automáticas via synchronize (melhorar para produção)

---

## ⏱️ Tempo Gasto

| Etapa                     | Tempo        |
| :------------------------ | :----------- |
| **Setup**                 | 4 horas      |
| **Auth Service**          | 8 horas      |
| **Tasks Service**         | 8 horas      |
| **Notifications Service** | 7 horas      |
| **Web (Frontend)**        | 12 horas     |
| **Docker + Documentação** | 4 horas      |
| **Total**                 | **44 horas** |

---

## 🧩 Observações Gerais

- **Tempo**: Acredito que levei mais tempo em algumas partes simples porque foi meu primeiro contato com muitas das tecnologias do desafio.
- **Uso da IA**: Utilizei o ChatGPT e o Claude para tirar dúvidas e agilizar o processo como um todo, mas também aprender conceitos ainda desconhecidos. Pedi explicações sobre linhas do código e conceitos utilizados para entender o porquê de cada escolha.
- **Aprendizado**: Aprendi demais com esse projeto. Me senti muito desafiado em várias partes, mas ao mesmo tempo fiquei maravilhado e instigado a aprender mais e saí dele com uma visão muito mais ampla sobre arquitetura de microsserviços, mensageria e desenvolvimento full-stack moderno. Pretendo revisitar o projeto para implementar melhorias, novas features e otimizá-lo para consolidar os conhecimentos.
