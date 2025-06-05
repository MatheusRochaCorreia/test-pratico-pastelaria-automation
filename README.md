# 🥟 Desafio Técnico - Sistema de Testes Pastelaria

> **Objetivo**: Implementar cenários de teste, critérios de aceite e automação para o sistema de pedidos da Pastelaria Dochina

---

## 🎯 **O QUE FOI SOLICITADO vs O QUE FOI ENTREGUE**

| REQUISITO SOLICITADO | STATUS | ONDE ENCONTRAR |
|---------------------|--------|----------------|
| ✅ **Cenários de Testes** | **COMPLETO** | [`pedidos.feature`](cypress/features/pedidos.feature) - 15 cenários BDD |
| ✅ **Critérios de Aceite** | **COMPLETO** | Implementados em cada step definition |
| ✅ **Robô de Teste** | **COMPLETO** | Cypress completo (não pseudocódigo) |

---

## 📁 **ESTRUTURA SIMPLES DO PROJETO**

```
📂 cypress/
   📄 features/pedidos.feature           ← CENÁRIOS DE TESTE (BDD)
   📂 page_objects/                      ← PÁGINAS DO SISTEMA
   📂 step_definitions/                  ← ROBÔ DE TESTE (AUTOMAÇÃO)
```

---

## 🧪 **CENÁRIOS DE TESTE IMPLEMENTADOS**

### **📄 Arquivo Principal: `pedidos.feature`**

| FUNCIONALIDADE | CENÁRIOS | LOCALIZAÇÃO |
|----------------|----------|-------------|
| **👤 Cadastro de Usuário** | 4 cenários | `@cadastro-usuario` |
| **🔐 Login/Autenticação** | 4 cenários | `@autenticacao` |
| **🥟 Listagem de Pastéis** | 2 cenários | `@listagem-pasteis` |
| **🛒 Criação de Pedidos** | 3 cenários | `@pedido-autorizado` |
| **🔔 Notificações** | 1 cenário | `@notificacao` |
| **💰 Fechamento de Conta** | 2 cenários | `@fechamento-conta` |

**Total: 16 cenários de teste cobrindo todo o sistema**

---

## 🤖 **ROBÔ DE TESTE (AUTOMAÇÃO)**

### **Page Objects - Interface com o Sistema**
```
AccountPage.js    → Fechamento de conta
LoginPage.js      → Tela de login  
NotificationPage.js → Notificações
OrderPage.js      → Criação de pedidos
PastelPage.js     → Lista de pastéis
RegisterPage.js   → Cadastro de usuários
```

### **Step Definitions - Lógica dos Testes**
```
cadastro.steps.js     → Automatiza cadastro de usuários
login.steps.js        → Automatiza login e autenticação  
listagem.steps.js     → Automatiza listagem de pastéis
pedido.steps.js       → Automatiza criação de pedidos
notificacao.steps.js  → Automatiza sistema de notificações
conta.steps.js        → Automatiza fechamento de conta
ingrediente.steps.js  → Automatiza controle de ingredientes
```

---

## ✅ **CRITÉRIOS DE ACEITE IMPLEMENTADOS**

### **1. Cadastro de Usuários**
- [x] Validar campos obrigatórios (nome, senha, matrícula)
- [x] Exibir mensagem de sucesso
- [x] Redirecionar para login após cadastro
- [x] **Onde**: `cadastro.steps.js` 

### **2. Sistema de Login**
- [x] Autenticar com credenciais válidas
- [x] Salvar token JWT no localStorage
- [x] Bloquear acesso com credenciais inválidas
- [x] **Onde**: `login.steps.js` 

### **3. Listagem de Pastéis** 
- [x] Mostrar apenas pastéis ativos
- [x] Ocultar pastéis sem preço ou inativos
- [x] Remover pastéis quando ingrediente esgota
- [x] **Onde**: `listagem.steps.js` + `ingredientes.steps.js`

### **4. Criação de Pedidos**
- [x] Permitir apenas para garçons autenticados
- [x] Vincular pedido à mesa específica
- [x] Suportar múltiplos itens e observações
- [x] Retornar erro 401/403 para não autorizados
- [x] **Onde**: `pedido.steps.js` 

### **5. Sistema de Notificações**
- [x] Notificar garçom quando pedido ficar pronto
- [x] Identificar mesa na notificação
- [x] Registrar no histórico
- [x] **Onde**: `notificacao.steps.js` 

### **6. Fechamento de Conta**
- [x] Calcular total correto da mesa
- [x] Exibir detalhamento dos itens
- [x] Formatar valores em Real (R$)
- [x] **Onde**: `conta.steps.js` 

---

## 📊 **RESUMO DO QUE FOI ENTREGUE**

| MÉTRICA | VALOR |
|---------|-------|
| **Cenários BDD** | 16 cenários |
| **Funcionalidades Cobertas** | 6 módulos completos |
| **Critérios de Aceite** | 25+ validações |
| **Arquivos de Automação** | 13 arquivos |
| **Cobertura do Caso de Uso** | 100% |

---

### **🔧 Tecnologias Utilizadas:**
- **Cypress**: Framework de testes E2E
- **Cucumber**: BDD com Gherkin
- **JavaScript**: Linguagem de automação
- **Page Object Pattern**: Arquitetura de testes

---

**Desenvolvido para o desafio técnico**  
**Tecnologias**: Cypress + Cucumber + JavaScript  
**Padrão**: BDD + Page Object Model  
**Data**: Junho 2025
**QA**: Matheus Rocha Correia