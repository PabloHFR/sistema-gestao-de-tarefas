# 📋 Sistema de Gestão de Tarefas Colaborativo

Sistema full-stack de gestão de tarefas colaborativas, desenvolvido com **arquitetura de microserviços**, **mensageria assíncrona** e **notificações em tempo real**.

O projeto simula um cenário próximo ao de produção, com foco em **escalabilidade**, **separação de responsabilidades** e **decisões arquiteturais conscientes**.
Foi iniciado como um desafio técnico e posteriormente expandido como projeto de estudo e consolidação de conceitos avançados de backend e full-stack.

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
- **JWT + Passport** - Autenticação
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
- Refresh automático de token
- Proteção de rotas (Guards)
- Rate limiting (10 req/seg)

### **Gestão de Tarefas**

- CRUD completo de tarefas
- Campos: título, descrição, prazo, prioridade, status
- Atribuição de múltiplos usuários
- Filtros por status e prioridade
- Busca por título/descrição
- Paginação
- Indicador visual de prazos (vencido, hoje, amanhã)

### **Comentários**

- Comentários em tarefas
- Listagem com paginação
- Timestamps relativos ("há 5 minutos")

### **Histórico de Alterações**

- Audit log automático de todas as mudanças
- Timeline de eventos
- Registro de criação, edição, mudança de status, comentários

### **Notificações em Tempo Real**

- WebSocket com Socket.IO
- Notificações instantâneas (para os usuários atribuídos à tarefa):
  - Tarefa atribuída
  - Status alterado
  - Novo comentário
- Lista de notificações recentes
- Reconexão automática
- Notificações offline (enviadas ao reconectar)

### **UI/UX**

- Design responsivo (mobile, tablet, desktop)
- Skeleton loaders (shimmer effect)
- Estados de loading e erro
- Validação client-side (Zod)

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

## 🧩 Observações

Este projeto foi fundamental para aprofundar meu entendimento em:

- arquitetura de microsserviços
- comunicação assíncrona
- design de APIs
- sistemas distribuídos

Utilizei ferramentas de IA como apoio ao aprendizado e entendimento de conceitos, sempre priorizando compreensão técnica e tomada de decisão consciente.
