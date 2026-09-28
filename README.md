# Cadastro e autenticação

Projeto didático com cadastro, login e área de usuário autenticado para atividade de Backend do professor Vinícius Siqueira - Semana 08

## Requisitos

- Node.js 20.19.0 ou superior (requisito do Prisma 7)
- Docker Desktop com Docker Compose

## Configuração

1. Copie `.env.example` para `.env` na raiz do projeto. Esse arquivo configura o PostgreSQL usado pelo Docker Compose.
2. Inicie o PostgreSQL:

   ```powershell
   docker compose up -d
   ```

3. Copie `backend/.env.example` para `backend/.env` e ajuste `DATABASE_URL` para corresponder às configurações do `.env` raiz. Defina também um `JWT_SECRET` com pelo menos 32 caracteres.
4. Copie `frontend/.env.example` para `frontend/.env`.
5. Em um terminal, instale e prepare o backend:

   ```powershell
   cd backend
   npm install
   npm run db:migrate
   npm run dev
   ```

6. Em outro terminal, inicie o frontend:

   ```powershell
   cd frontend
   npm install
   npm run dev
   ```

7. Acesse <http://localhost:5173>.

O backend roda em `http://localhost:3000`; o Vite roda em `http://localhost:5173`.
O frontend envia cookies nas chamadas para a API. Para outra origem, ajuste `FRONTEND_ORIGIN` no backend e `VITE_API_URL` no frontend.

## Demonstração manual

- Cadastre nome, e-mail e senha com pelo menos 8 caracteres.
- Tente cadastrar o mesmo e-mail novamente.
- Faça login com credenciais válidas e inválidas.
- Abra `dashboard.html` sem login e confirme o redirecionamento.
- Após login, confirme nome e e-mail na área do usuário.

## Rotas

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/me`

Senhas são armazenadas com Argon2id. JWT fica em cookie `HttpOnly` por uma hora.
