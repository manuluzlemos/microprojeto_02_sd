# Microprojeto 02 - Sistemas Distribuídos 2021.2

***Emanuelle da Luz Lemos***


### **Descrição:**

Implementação de um serviço de supermercado delivery com a API de *websockets* do Node.js para fins de comunicação entre um cliente e o servidor.


### **Funcionalidades obrigatórias:**

* Listar os produtos disponíveis (LISTAR):
    - listar o código, a descrição e o preço os produtos cadastrados no arquivo 'db.json'.
* Adicionar produto ao carrinho (ADICIONAR):
    - adicionar o código e a quantidade de itens do produto.
* Remover produto do carrinho (REMOVER):
    - remover com base no código do produto.
* Pagar o pedido (PAGAR):
    - insere o código, o valor total do pedido e quantidade de produtos em uma lista para posterior solicitação de entrega;
    - seta o status de entrega como ***false***;
    - remove os produtos do carrinho;
    - fornece o total pago.
* Solicitar entrega (ENTREGA):
    - solicitar a entrega de pedido existente na lista de pedidos.


### **Funcionalidades extras:**

* Listar os produtos adicionados ao carrinho (CARRINHO):
    - listar o código, a descrição, a quantidade e o preço dos produtos do carrinho;
    - apresentar o preço total dos produtos do carrinho.
* Listar os pedidos realizados (PEDIDO):
    - listar o código do pedido, o preço total, a quantidade de produtos e o status de entrega dos pedidos efetuados.
* Limpar todas as respostas (LIMPAR).


***Observações:*** Os comandos devem ser adicionados na caixa de texto da página do cliente (http://localhost:3002).