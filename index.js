const ws = require('ws');
const express = require('express');

const PORT = process.env.PORT || 3002;
const INDEX = '/index.html';

const database = {"P01": {"descript": "Arroz", "price": 4.50}, "P02": {"descript": "Feijao", "price": 5.70}, "P03": {"descript": "Macarrao", "price": 4.25}, "P04": {"descript": "Oleo", "price": 4.20}, "P05": {"descript": "Leite", "price": 6.20}, "P06": {"descript": "Sabao", "price": 5.75}, "P07": {"descript": "Detergente", "price": 5.70}, "P08": {"descript": "Biscoito", "price": 2.70}, "P09": {"descript": "Vinagre", "price": 3.39}, "P10": {"descript": "Queijo", "price": 24.19}};
const carrinho = [];
const pedidos = [];

const server = express()
  .use((req, res) => res.sendFile(INDEX, { root: __dirname }))
  .listen(PORT, () => console.log(`Escutando na porta ${PORT}`));

const wss = new ws.Server({ server });

wss.on("connection", (socket) => {
    console.log("Conexão estabelecida...");

    socket.on("list", () => {
        let result = "<h3>Produtos Disponíveis</h3>";
            result += "<ul>";
            for (const key in database) {
                result += "<li>"+ key + ' - ' + database[key].descript + ' - R$ ' + database[key].price.toFixed(2) + '</li>';
            }
            result += "<ul>";
            socket.send(result);
    });

    socket.on("message", (message) => {
        const params = message.toString().split(" ");
        switch(params[0]){
            case "LISTAR": //Listar produtos disponíveis
                let result = "1**";
                for (const key in database) {
                    result += key + ' - ' + database[key].descript + ' - ' + database[key].price + '**';
                }
                socket.send(result);
                break;

            case "CARRINHO": //Listar produtos do carrinho
                let result2 = "2**";       

                carrinho.forEach((item) => {
                    let produto = database[item.codigo];
                    result2 += item.codigo + " - " + produto.descript + " - " + produto.price + " - " + item.quantidade + "**";
                });

                socket.send(result2);
                break;
            
            case "ADICIONAR": //Adicionar produtos ao carrinho
                if(params[1] in database){
                    carrinho.push({
                        codigo: params[1],
                        quantidade: params[2]
                    });
                    socket.send("3**O produto " + params[1] + " foi adiconado!\n");
                }else{
                    socket.send("3**O produto " + params[1] + " não existe!\n");
                }
                break;
            
            case "REMOVER": //Remover produtos do carrinho
                for(let i = 0; i < carrinho.length; i++){
                    if(carrinho[i].codigo === params[1]){
                        carrinho.splice(i, 1);
                    }
                }   
                
                socket.send("4**Produto " + params[1] + " removido\n");
                break;
            
            case "PAGAR": //Pagar pedido
                let preco_total2 = 0;    
                carrinho.forEach((item) => {
                    let produto = database[item.codigo];
                    preco_total2 += (parseFloat(item.quantidade) * parseFloat(produto.price));
                });

                pedidos.push({
                    codigo: "C"+(pedidos.length+1),
                    valor: preco_total2,
                    status_entrega: false,
                    produtos: carrinho.length
                });

                carrinho.length = 0;     

                socket.send("5**Pagamento de R$ " + preco_total2.toFixed(2) +" efetuado para o pedido "+ pedidos[pedidos.length-1].codigo +"!\n");
                break;

            case "PEDIDO": //Listar os pedidos realizados pelo cliente                
                let result3 = "6**";  

                pedidos.forEach((pedido) => {
                    let status = pedido.status_entrega === true ? 'Solicitada' : 'Não Solicitada';
                    result3 += pedido.codigo + " - " + pedido.valor + " - " + pedido.produtos + " - " + status + "**";
                });
                socket.send(result3);
                break;
            
            case "ENTREGA": //Remover produtos do carrinho
                for(let i = 0; i < pedidos.length; i++){
                    if(pedidos[i].codigo === params[1]){
                        pedidos[i].status_entrega = true;
                    }
                }
                    
                socket.send("7**Solicitação de entrega para o pedido " + params[1] + " confirmada!\n");
                break;
            
            default:
                socket.send("0**-ERRO Comando não reconhecido!");
        }
    });
});