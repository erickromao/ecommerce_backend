const knex = require('../database/knex')
const { AppError } = require('../utils/AppError')

class CarrinhoController{
    async addCarrinho(request, response){
        const {nome} = request.body
        const user = request.user.userInfo

        if(!nome){
            throw new AppError('Necessário informar o nome do produto.')
        }

        const [checkProduto] = await knex('produtos').where({nome})
        if(!checkProduto){
            throw new AppError('Produto não encontrado.')
        }

        const [checkNewProduto] = await knex('carrinhos').where({id_user:user.id}).where({id_produto: checkProduto.id})
        if(checkNewProduto){
            throw new AppError('Esse produto já está adicionado ao seu carrinho.')
        }

        await knex('carrinhos').insert({
            id_produto: checkProduto.id,
            id_user: user.id
        })

        const carrinhoUser = await knex('carrinhos').where({id_user: user.id})

        const idsProdutos = carrinhoUser.map(item=> item.id_produto)

        const produtosCarrinho = await knex('produtos').whereIn('id', idsProdutos)

        const produtosCarrinhoCurrent = produtosCarrinho.map(({id, quantidade, created_at, updated_at, ...rest})=> rest)

        const somaPrecos = produtosCarrinhoCurrent.reduce((total, produto)=> total + produto.preco, 0)
        
        response.json({
            message:`Produto ${nome}, adicionado com sucesso ao carrinho.`,
            carrinho:produtosCarrinhoCurrent,
            valorTotal: parseFloat(somaPrecos.toFixed(2))
        })
        
    }

    async readCarrinho(request, response){
        const user = request.user.userInfo

        const carrinhoUser = await knex('carrinhos').where({id_user: user.id})

        const idsProdutos = carrinhoUser.map(item=> item.id_produto)

        const produtosCarrinho = await knex('produtos').whereIn('id', idsProdutos)

        const produtosCarrinhoCurrent = produtosCarrinho.map(({id, quantidade, created_at, updated_at, ...rest})=> rest)

        const somaPrecos = produtosCarrinhoCurrent.reduce((total, produto)=> total + produto.preco, 0)

        response.json({
            message:`Seu carrinho, ${user.nome}:`,
            carrinho: produtosCarrinhoCurrent,
            ValorTotal: parseFloat(somaPrecos.toFixed(2))
        })
    }

    async removeCarrinho(request, response){
        const user = request.user.userInfo
        const {nome} = request.body

        if(!nome){
            throw new AppError('Informe o nome do produto que deseja remover.')
        }

        const [checkNome] = await knex('produtos').where({nome})
        if(!checkNome){
            throw new AppError('Produto não encontrado.')
        } 

        const [userCarrinho] = await knex('carrinhos').where({id_user: user.id})
        .where({id_produto: checkNome.id})
        if(!userCarrinho){
            throw new AppError(`Produto (${nome}) não foi adicionado ao seu carrinho.`)
        }else{
            await knex('carrinhos').where({id_user: user.id})
        .where({id_produto: checkNome.id}).delete()
        }

        const carrinhoUser = await knex('carrinhos').where({id_user: user.id})

        const idsProdutos = carrinhoUser.map(item=> item.id_produto)

        const produtosCarrinho = await knex('produtos').whereIn('id', idsProdutos)

        const produtosCarrinhoCurrent = produtosCarrinho.map(({id, quantidade, created_at, updated_at, ...rest})=> rest)

        const somaPrecos = produtosCarrinhoCurrent.reduce((total, produto)=> total + produto.preco, 0)

        response.json({
            message:`Produto (${nome}) removido com sucesso, seu carrinho:`,
            carrinho: produtosCarrinhoCurrent,
            ValorTotal: parseFloat(somaPrecos.toFixed(2))
        })

    }
}

module.exports = CarrinhoController