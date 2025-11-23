# 🎓 Sistema de Reservas de Salas - Fametro (Front-end)

Interface moderna e responsiva para o sistema de reservas de salas da Fametro, desenvolvida com React e Vite.

## 🎨 Design

- **Paleta de cores**: Azul claro, branco e tons de cinza
- **Layout**: Totalmente responsivo (mobile, tablet e desktop)
- **Ícones**: Lucide React
- **Tipografia**: Inter / Roboto

## 🚀 Tecnologias

- **React 18** - Biblioteca JavaScript para UI
- **Vite** - Build tool ultra-rápida
- **React Router 6** - Roteamento
- **Axios** - Cliente HTTP
- **Lucide React** - Ícones modernos
- **Date-fns** - Manipulação de datas

## 📋 Funcionalidades

### 🔐 Autenticação
- Login com e-mail e senha
- Login como visitante (alunos)
- Recuperação de senha
- Proteção de rotas por perfil

### 👥 Perfis de Usuário

#### 📊 Coordenação
- Dashboard com estatísticas gerais
- Gerenciamento de salas e equipamentos
- Gerenciamento de usuários
- Visualização de todos os agendamentos
- Definição de regras de agendamento

#### 👨‍🏫 Professor
- Dashboard personalizado
- Criar/editar/cancelar agendamentos
- Visualizar agenda completa
- Buscar salas disponíveis
- Receber notificações

#### 👨‍🎓 Aluno/Visitante
- Consultar horários de aulas
- Buscar por sala, professor ou disciplina
- Ver agenda de professores
- Receber notificações de alterações

## 📁 Estrutura do Projeto

```
src/
├── components/
│   ├── Layout/
│   │   ├── Layout.jsx
│   │   └── Layout.css
│   └── PrivateRoute.jsx
├── contexts/
│   └── AuthContext.jsx
├── pages/
│   ├── Login.jsx
│   ├── Login.css
│   ├── Dashboard.jsx
│   ├── Dashboard.css
│   ├── Rooms.jsx
│   ├── Rooms.css
│   ├── Notifications.jsx
│   └── Notifications.css
├── services/
│   └── api.js
├── App.jsx
├── main.jsx
└── index.css
```

## ⚙️ Instalação

### Pré-requisitos
- Node.js 18+ instalado
- NPM ou Yarn

### Passo a passo

1. **Instale as dependências:**
```bash
npm install
```

2. **Configure o backend:**
Certifique-se de que o backend Express está rodando na porta 5000.
O proxy já está configurado no `vite.config.js`.

3. **Inicie o servidor de desenvolvimento:**
```bash
npm run dev
```

4. **Acesse a aplicação:**
Abra o navegador em `http://localhost:3000`

## 🔧 Scripts Disponíveis

```bash
npm run dev      # Inicia o servidor de desenvolvimento
npm run build    # Cria build de produção
npm run preview  # Preview da build de produção
npm run lint     # Executa o linter
```

## 🎯 Rotas da Aplicação

| Rota | Acesso | Descrição |
|------|--------|-----------|
| `/login` | Público | Tela de login |
| `/dashboard` | Todos | Dashboard personalizado por perfil |
| `/rooms` | Coordenação | Gerenciar salas e equipamentos |
| `/users` | Coordenação | Gerenciar usuários |
| `/reservations` | Coordenação/Professor | Agendamentos |
| `/schedule` | Todos | Visualizar agenda |
| `/notifications` | Todos | Notificações |
| `/settings` | Todos | Configurações do usuário |

## 🔐 Credenciais de Teste

### Coordenação
- **E-mail**: coordenacao@fametro.edu.br
- **Senha**: admin123

### Professor
- **E-mail**: professor@fametro.edu.br
- **Senha**: prof123

### Aluno
- **E-mail**: aluno@fametro.edu.br
- **Senha**: aluno123

Ou use o botão **"Entrar como visitante"** para acesso de visualização.

## 📱 Responsividade

A aplicação é totalmente responsiva e adapta-se a diferentes tamanhos de tela:

- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

### Recursos mobile:
- Menu lateral retrátil
- Layout otimizado para touch
- Cards empilhados verticalmente
- Formulários adaptáveis

## 🎨 Componentes Principais

### Layout
- Sidebar com navegação
- Header com notificações e perfil de usuário
- Menu responsivo para mobile

### Dashboard
- Cards de estatísticas
- Ações rápidas
- Listas de agendamentos
- Personalizado por perfil

### Modals
- Formulários de criação/edição
- Confirmações de ação
- Overlay com backdrop

## 🔄 Integração com Backend

A aplicação está configurada para se comunicar com o backend Express através do axios:

```javascript
// Configuração em src/services/api.js
const api = axios.create({
  baseURL: '/api',  // Proxy configurado no vite.config.js
});
```

O token JWT é automaticamente incluído em todas as requisições autenticadas.

## 🚧 Próximas Funcionalidades

- [ ] Página de Usuários (Coordenação)
- [ ] Página de Agendamentos completa
- [ ] Calendário interativo
- [ ] Busca avançada
- [ ] Exportação de relatórios
- [ ] Modo escuro
- [ ] Notificações em tempo real (WebSocket)
- [ ] PWA (Progressive Web App)

## 📝 Licença

Este projeto é parte do sistema acadêmico da Fametro.

## 👨‍💻 Desenvolvimento

Desenvolvido para a Fametro - Faculdade Metropolitana.
