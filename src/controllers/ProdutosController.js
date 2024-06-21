const knex = require('../database/knex')
const {AppError} = require('../utils/AppError')

class ProdutosController{

    async create(request, response){
        const {nome, preco, quantidade, categoria } = request.body

        if(!nome || !preco  || !categoria){
            throw new AppError('Campos obrigatórios: (nome, preco, categoria)')
        }

        const [checkNome] = await knex('produtos').where({nome})
        if(checkNome){
            throw new AppError('Esse nome de produto já está cadastrado.')
        }

        const qtd = quantidade ?? 0

        const [produto] = await knex('produtos').insert({
            nome,
            preco,
            quantidade: qtd,
            categoria
        }).returning('*')


        response.json({
            message: `Produto (${produto.nome}) adicionado com sucesso.`,
            infos: produto
        })

    }   

    async delete(request, response){
        const {nome} = request.body

        if(!nome){
            throw new AppError('Informe o nome do produto que deseja remover.')
        }

        const [checkProduto] = await knex('produtos').where({nome})
        if(!checkProduto){
            throw new AppError('Produto não encontrado.')
        }

        const infosProduto = checkProduto

        response.json({
            message:`Produto (${infosProduto.nome}) removido com sucesso.`,
            oldInfos: infosProduto
        })
    }

    async addEstoque(request, response){
        const {nome, adicionar, remover} = request.body

        if(!nome || !adicionar){
            throw new AppError('Campos obrigatórios: (nome, adicionar)')
        }

        const [checkProduto] = await knex('produtos').where({nome})
        if(!checkProduto){
            throw new AppError('Produto não encontrado.')
        }

        const[produto] = await knex('produtos')
            .where({nome})
            .increment('quantidade', adicionar)
            .update({
                updated_at: knex.raw('now()')
            })
            .returning('*')

        response.json({
            message: `Modificações feitas com sucesso no estoque do produto [${nome}]`,
            adicionado: `[+${adicionar}]`, 
            infos: produto
        })
    }

    async rmvEstoque(request, response){
        const {nome, remover} = request.body

        if(!nome || !remover){
            throw new AppError('Campos obrigatórios: (nome, remover)')
        }

        const [checkProduto] = await knex('produtos').where({nome})
        if(!checkProduto){
            throw new AppError('Produto não encontrado.')
        }
       
        if(checkProduto.quantidade < remover){
            throw new AppError(`Valor inválido, estoque atual [${checkProduto.quantidade}].`)
        }

        const [produto] = await knex('produtos')
        .where({nome})
        .decrement('quantidade', remover)
        .update({
            updated_at: knex.raw('now()')
        })
        .returning('*')
        

        response.json({
            message: `Modificações feitas com sucesso no estoque do produto [${nome}]`,
            removido: `[-${remover}]`,
            infos: produto
        })
    }
    
    async read(request, response){
        const {categoria, nome} = request.body
        
        if(!categoria && !nome){
            const produto = await knex('produtos').orderBy("created_at")

            const produtoCurrent = produto.map(({id, updated_at, ...rest}) => rest)

           return response.json({
                message:"Todos os produtos cadastrados:",
                produtos:produtoCurrent
            })
        }

        let resultado
        if(categoria){
            resultado = await knex('produtos').where({categoria})
            .orderBy('created_at')
        }

        if(nome){
            resultado = await knex('produtos').whereLike("nome",`%${nome}%`)
            .orderBy('created_at')
        }
        
        const resultadoCurrent = resultado.map(({id, updated_at, ...rest})=> rest)
        response.json({
            message:"Produtos encontrados:",
            resultado: resultadoCurrent
        })
    }
}



module.exports = ProdutosController