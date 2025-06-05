Feature: Sistema de Pedidos de Pastéis
    Como garçom autenticado
    Quero cadastrar usuários, listar pastéis, criar pedidos e fechar contas
    Para gerenciar o fluxo de atendimento no restaurante de pastéis

  Background:
    Given o sistema está configurado com dados iniciais

  @cadastro-usuario
  Scenario Outline: Cadastro de usuário válido
    Given que estou na página de cadastro
    When preencho o campo "nome completo" com "<nome>"
    And preencho o campo "senha" com "<senha>"
    And preencho o campo "matrícula" com "<matricula>"
    And submeto o formulário de cadastro
    Then o sistema deve registrar o usuário com sucesso
    And deve exibir mensagem de confirmação "Cadastro realizado com sucesso"
    And deve redirecionar para a página de login

    Examples:
      | nome           | senha           | matricula |
      | João Silva     | SenhaForte123   | 20250001  |
      | Maria Oliveira | Pa$$w0rdSegura  | 20250002  |

  @cadastro-usuario-invalido
  Scenario Outline: Cadastro com dados inválidos
    Given que estou na página de cadastro
    When preencho o campo "nome completo" com "<nome>"
    And preencho o campo "senha" com "<senha>"
    And preencho o campo "matrícula" com "<matricula>"
    And submeto o formulário de cadastro
    Then o sistema deve rejeitar o cadastro
    And deve exibir erro "<erro_esperado>"
    And deve permanecer na página de cadastro

    Examples:
      | nome       | senha         | matricula | erro_esperado        |
      |            | SenhaForte123 | 20250001  | Nome obrigatório     |
      | João Silva |               | 20250001  | Senha obrigatória    |
      | João Silva | SenhaForte123 |           | Matrícula obrigatória|

  @autenticacao
  Scenario Outline: Login com credenciais válidas
    Given que existe um usuário cadastrado com nome "<nome>" e senha "<senha>"
    When faço login com nome "<nome>" e senha "<senha>"
    Then devo ser autenticado com sucesso
    And devo ser redirecionado para o dashboard
    And o token JWT deve ser salvo no localStorage

    Examples:
      | nome       | senha           |
      | João Silva | SenhaForte123   |
      | Maria Silva| Pa$$w0rdSegura  |

  @login-invalido
  Scenario Outline: Login com credenciais incorretas
    When tento fazer login com nome "<nome>" e senha "<senha>"
    Then devo receber erro "Credenciais inválidas"
    And devo permanecer na página de login
    And o sistema deve retornar status 401

    Examples:
      | nome        | senha    |
      | inexistente | xxx      |
      | João Silva  | senhaerr |

  @listagem-pasteis
  Scenario: Listar pastéis ativos
    Given que existem pastéis cadastrados no sistema:
      | nome   | preço | ativo |
      | Queijo | 5.00  | sim   |
      | Carne  | 6.50  | sim   |
      | Frango | 4.50  | sim   |
      | Pizza  | 7.00  | não   |
    When acesso a lista de pastéis
    Then devo ver apenas os pastéis ativos:
      | nome   | preço |
      | Queijo | 5.00  |
      | Carne  | 6.50  |
      | Frango | 4.50  |
    And não devo ver pastéis inativos

  @ingrediente-indisponivel
  Scenario: Ingrediente esgotado remove pastel da lista
    Given que existe um pastel "Queijo" ativo no sistema
    And o ingrediente "Queijo" está disponível
    When a cozinha marca o ingrediente "Queijo" como esgotado
    Then o "Pastel de Queijo" não deve aparecer na lista de pastéis
    And a API deve retornar status 200 para a atualização

  @pedido-autorizado
  Scenario: Criar pedido com usuário autorizado
    Given que estou autenticado como garçom "João Silva"
    And a mesa "5" está disponível
    And existem pastéis disponíveis no sistema
    When crio um pedido para mesa "5" com os itens:
      | pastel | quantidade | observacao |
      | Queijo | 1          | sem cebola |
      | Carne  | 2          |            |
    Then o sistema deve registrar o pedido com sucesso
    And deve exibir mensagem "Pedido realizado com sucesso"
    And o pedido deve ser salvo no banco de dados

  @pedido-nao-autorizado
  Scenario Outline: Tentativa de pedido sem autorização
    Given que estou como "<tipo_usuario>"
    When tento criar um pedido para mesa "5"
    Then o sistema deve bloquear a operação
    And deve exibir mensagem "<mensagem_erro>"
    And deve retornar status "<status_code>"

    Examples:
      | tipo_usuario     | mensagem_erro             | status_code |
      | usuário anônimo  | Autentique-se primeiro    | 401         |
      | cliente comum    | Usuário não autorizado    | 403         |

  @multiplos-itens
  Scenario: Pedido com múltiplos itens e observações
    Given que estou autenticado como garçom
    And a mesa "3" está disponível
    When crio um pedido com múltiplos itens:
      | pastel | quantidade | observacao       |
      | Queijo | 2          | sem cebola       |
      | Carne  | 1          | com extra queijo |
      | Frango | 3          | bem passado      |
    Then o pedido deve ser registrado com sucesso
    And cada item deve conter sua observação correta
    And o total de itens deve ser 6

  @notificacao
  Scenario: Notificação de pedido pronto
    Given que um garçom fez um pedido para mesa "4"
    And o pedido está sendo preparado na cozinha
    When a cozinha marca o pedido como pronto
    Then o garçom deve receber notificação "Pedido pronto para mesa 4"
    And a notificação deve aparecer na interface
    And deve ser registrada no histórico de notificações

  @fechamento-conta
  Scenario: Fechar conta com múltiplos pedidos
    Given que a mesa "2" possui os seguintes pedidos:
      | pastel | quantidade | preço_unitario |
      | Queijo | 2          | 5.00           |
      | Carne  | 1          | 6.50           |
      | Frango | 2          | 4.50           |
    When solicito o fechamento da conta
    Then o sistema deve calcular o total "R$ 25,50"
    And deve exibir o detalhamento dos itens
    And deve permitir finalizar a conta

  @calculo-total
  Scenario: Validação de cálculo de total
    Given que a mesa "10" possui pedidos com valores:
      | item_descricao | valor |
      | 3x Queijo      | 15.00 |
      | 2x Carne       | 13.00 |
      | 1x Frango      | 4.50  |
    When calculo o total da conta
    Then o valor total deve ser "R$ 32,50"
    And a formatação deve estar correta