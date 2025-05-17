
# Gerenciador de Clientes

Frontend para gerenciar clientes, que permite criar, editar, visualizar e deletar clientes, e gerar lista de clientes em PDF.

---

## 📝 Regras de Negócio

- [x] Usuários podem criar, editar, visualizar e deletar clientes.
- [x] Cada cliente tem dados pessoais e endereço.
- [x] Validação dos dados é feita no frontend com **Zod** para garantir integridade.
- [x] Dados são carregados e sincronizados via **React Query** para melhor performance e cache.
- [x] Geração de relatórios em PDF usando **jsPDF**.
- [x] Navegação entre páginas com **React Router DOM**.
- [x] Interface estilizada com **Material UI** e customizada via **Tailwind CSS**.
- [x] Proteção de rotas com **React Router DOM**.


---

## 🚀 Tecnologias Utilizadas

- **Vite** — bundler e ambiente de desenvolvimento rápido.
- **React** + **TypeScript** — construção da interface e tipagem segura.
- **Material UI** — componentes prontos e estilizados.
- **Tailwind CSS** — estilização utilitária para customização fácil.
- **React Query** — gerenciamento e cache das chamadas API.
- **Zod** — validação e esquema dos dados.
- **jsPDF** — geração de PDFs no frontend.
- **React Router DOM** — controle de rotas e navegação.

---

## 📥 Como Instalar

1. Clone o repositório:
   ```bash
   git clone https://github.com/seu-usuario/seu-repositorio.git
   ```

2. Entre na pasta do projeto:
   ```bash
   cd seu-repositorio
   ```

3. Instale as dependências:
   ```bash
   npm install
   # ou
   yarn install
   ```

---

## ▶️ Como Usar

1. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   # ou
   yarn dev
   ```

2. Abra o navegador em:
   ```
   http://localhost:5173
   ```

3. Navegue entre as páginas para criar, editar e visualizar clientes.

---

- O projeto usa **Vitest** e **Testing Library** para testes.
- Para rodar os testes:
  ```bash
  npm run test
  # ou
  yarn test
  ```

---

## 📄 Licença

Este projeto está licenciado sob a licença MIT.
