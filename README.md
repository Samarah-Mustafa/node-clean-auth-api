node-clean-auth-api
🔐 API de Autenticação robusta desenvolvida com Node.js, TypeScript e SQLite. Aplicando Clean Architecture, princípios SOLID e as melhores práticas de segurança (JWT & Bcrypt).

💻 Sobre o Projeto
Esta é uma estrutura de API de Autenticação projetada para alta manutenibilidade, testabilidade e segurança. O projeto foca em isolar as regras de negócio de frameworks e bancos de dados, garantindo que a aplicação seja resiliente a mudanças.

🛠️ Estrutura do Projeto (Clean Architecture)
A organização separa o código em camadas, seguindo o fluxo da Arquitetura Limpa:

domain: Contém as entidades de negócio e as interfaces (contratos) dos repositórios. É o coração do sistema.

use-cases: Implementa a lógica das funcionalidades (ex: CreateUser, LoginUser).

infrastructure: Detalhes técnicos como conexão com SQLite, adapters de criptografia e bibliotecas.

presentation: Controladores de entrada (Express) que lidam com requisições e respostas.

🧩 Princípios SOLID Aplicados
Single Responsibility: Cada classe tem uma única responsabilidade (ex: CreateUserUseCase apenas registra, AuthMiddleware apenas valida).

Open/Closed: Novas formas de autenticação podem ser adicionadas sem alterar a lógica existente.

Liskov Substitution: Repositórios de usuários podem ser trocados sem quebrar o sistema.

Interface Segregation: Uso de interfaces específicas e enxutas para os repositórios.

Dependency Inversion: Casos de uso dependem de abstrações (interfaces), não da implementação direta (SQLite/Bcrypt).

🚀 Exemplo de Fluxo (Login)
Request chega no AuthController (Camada de Interface).

Controller valida dados e chama o LoginUseCase (Camada de Aplicação).

UseCase usa a interface de UserRepository (Domain) para encontrar o usuário.

UseCase compara a senha usando BcryptAdapter (Infra).

UseCase gera token com JwtAdapter (Infra).

Response retorna o token JWT ao cliente.

🔐 Melhores Práticas de Segurança
Hash de Senha (Bcrypt): Nenhuma senha é armazenada em texto plano. O Bcrypt gera hashes com salt seguro.

Autenticação JWT: Uso de JSON Web Tokens para stateless authentication.

Proteção de Rotas: Middlewares que interceptam rotas sensíveis e validam tokens.

Variáveis de Ambiente: Uso de .env para proteger segredos e chaves mestras.

Prevenção contra SQL Injection: Uso de Query Builder com prepared statements via Knex/SQLite.

🗄️ Stack Tecnológico
Node.js & TypeScript: Alta performance e tipagem forte.

SQLite: Banco de dados leve, ideal para aplicações embutidas.

JWT & Bcrypt: Padrões da indústria para autenticação e hash.

⚙️ Como Executar
Instalação: npm install

Configuração: Renomeie .env.example para .env e preencha as chaves.

Desenvolvimento: npm run dev

## 🧪 Testando com Thunder Client

### 1️⃣ Registrar um Novo Usuário

**Método:** `POST`  
**URL:** `http://localhost:3333/users`

**Headers:**
```
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "name": "João Silva",
  "email": "joao@example.com",
  "password": "Senha@123"
}
```

**Resposta Esperada (201):**
```json
{
  "message": "Usuário criado com sucesso!"
}
```

---

### 2️⃣ Fazer Login

**Método:** `POST`  
**URL:** `http://localhost:3333/login`

**Headers:**
```
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "email": "joao@example.com",
  "password": "Senha@123"
}
```

**Resposta Esperada (200):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "email": "joao@example.com",
  "name": "João Silva"
}
```

⚠️ **Guarde o token!** Você vai precisar dele para acessar rotas protegidas.

---

### 3️⃣ Acessar Rota Protegida

**Método:** `GET`  
**URL:** `http://localhost:3333/me`

**Headers:**
```
Content-Type: application/json
Authorization: Bearer <seu_token_jwt_aqui>
```

**Exemplo com token real:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Resposta Esperada (200):**
```json
{
  "message": "Dados do usuário autenticado",
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "joao@example.com",
    "iat": 1707228800,
    "exp": 1707315200
  }
}
```

---

### ⚠️ Erros Comuns

| Erro | Causa | Solução |
|------|-------|--------|
| `Connection was refused` | Servidor não está rodando | Execute `npm run dev` |
| `Usuário não encontrado` | Email não registrado | Registre um novo usuário primeiro |
| `Senha incorreta` | Senha errada | Verifique a senha digitada |
| `Token não fornecido` | Header `Authorization` ausente | Adicione o header com o token |
| `Token inválido ou expirado` | Token incorreto ou expirado | Faça login novamente |

---

Desenvolvido por Samarah mustafá.