const knex = require('../database/knex')
const { AppError } = require('../utils/AppError')
const axios = require('axios')
require('dotenv').config()



class CheckoutController{

    async boleto(request, response){
        const user = request.user.userInfo
        const {
                name,
                document,
                phoneNumber,
                email
            
        } = request.body
       
        if(!name || !document || !phoneNumber || !email){
            throw new AppError('Campos obrigatórios: client:{ name, document, phoneNumber, email}')
        }
        
        const [enderecoUser] = await knex('enderecos').where({user_id:user.id})
        if(!enderecoUser){
            throw new AppError('Necessário adicionar seu endereço, atualize seu usuário.')
        }

        //Informaçoes do carrinho
        const carrinhoUser = await knex('carrinhos').where({id_user: user.id})

        if(carrinhoUser.length === 0){
            throw new AppError('Carrinho do usuário está vazio.')
        }

        const idsProdutos = carrinhoUser.map(item=> item.id_produto)

        const produtosCarrinho = await knex('produtos').whereIn('id', idsProdutos)

        const produtosCarrinhoCurrent = produtosCarrinho.map(({id, quantidade, created_at, updated_at, ...rest})=> rest)

        const somaPrecos = produtosCarrinhoCurrent.reduce((total, produto)=> total + produto.preco, 0)

        function geradorRequestNumber(){
            const numero = Math.floor(10000000 + Math.random() * 90000000)
            return numero.toString()
        }
        const validadeBOleto = "2024-10-30"
        //Objeto com as informacoes 

        const numeroRandom = geradorRequestNumber()

        const CarrinhoCheckout = produtosCarrinho.map(produto => ({
            description: produto.nome,
            quantity: 1,
            value: parseFloat(produto.preco.toFixed(2))
        }))

        const data = {
            requestNumber : numeroRandom.toString(),
            dueDate: validadeBOleto,
            amount: parseFloat(somaPrecos.toFixed(2)),
            shippingAmount: 0,
            usernameCheckout: "checkout",
                client: {
                name,
                document,
                phoneNumber,
                email,
                address: {
                    codIbge:"3302205",
                    street: enderecoUser.rua,
                    number: enderecoUser.numero.toString(),
                    complement: "",
                    zipCode:"74663-520",
                    neighborhood:enderecoUser.bairro,
                    city:"itaperuna",
                    state: enderecoUser.uf
                }
            },
            products: CarrinhoCheckout
            }

        const config = {
            method: 'post',
            url: process.env.URL_BOLETO,
            headers:{
                'ci': process.env.SUITPAY_CI,
                'cs': process.env.SUITPAY_CS,
                'content-Type': 'application/json'
            },
            data: JSON.stringify(data),
            maxBodyLength: Infinity
        }
        axios(config)
            .then(async resp=>{
           
            try{
                await knex('produtos')
                .whereIn('id', idsProdutos)
                .decrement('quantidade', 1)
               
                await knex('pedidos').insert({
                    id_user: user.id,
                    numero: numeroRandom.toString(),
                    id_produtos: JSON.stringify(idsProdutos),
                    total: parseFloat(somaPrecos.toFixed(2))
                })
            }catch(err){
                console.error(err)
                return response.send('Houve um erro no pedido.')
            }

            await knex('carrinhos').where({id_user:user.id}).delete()

                response.json({
                    message: "Boleto gerado com sucesso.",
                    pedido: CarrinhoCheckout,
                    boleto: resp.data
                })


            }).catch(err=>{
                response.status(500).json({err: err.message})
            })

    }
}

module.exports = CheckoutController
        