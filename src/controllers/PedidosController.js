const knex = require('../database/knex')
const { AppError } = require('../utils/AppError')

class PedidosController{
    async read(request, response){
        const user = request.user.userInfo

        const pedidosUser = await knex('pedidos').where({id_user:user.id})
        if(!pedidosUser.length){
            throw new AppError('O usuário não possui nenhum pedido feito.')
        }

        const pedidos = []

        for (const pedido of pedidosUser) {
    
            const idsProdutos = pedido.id_produtos

            const produtosPedidos = await knex('produtos').whereIn('id', idsProdutos)

            const pedidoFormatado = {
                numero: pedido.numero,
                status: pedido.status,
                total: pedido.total,
                produtos: produtosPedidos.map(produto => ({
                    id: produto.id,
                    nome: produto.nome,
                    preco: produto.preco,
                    quantidade: produto.quantidade,
                    categoria: produto.categoria,
                    status_produto: produto.status,
                    created_at: produto.created_at,
                    updated_at: produto.updated_at
                })).filter(produto => idsProdutos.includes(produto.id)) // Filtra apenas os produtos do pedido
            }

            pedidos.push(pedidoFormatado)
            
        }
    
        response.json({
            message: `Seus pedidos ${user.nome}`,
            pedidos
        })
    }
}

module.exports = PedidosController