const knex = require('../database/knex')
const { AppError } = require('../utils/AppError')


class CheckoutController{

    async boleto(request, response){
        const user = request.user.userInfo
        const {
                client: {
                name,
                document,
                phoneNumber,
                email
            }
        } = request.body
        
        const [enderecoUser] = await knex('enderecos').where({id_user:user.id})
        if(!enderecoUser){
            throw new AppError('Necessário adicionar seu endereço, atualize seu usuário.')
        }

        //Informaçoes do carrinho
        const carrinhoUser = await knex('carrinhos').where({id_user: user.id})

        const idsProdutos = carrinhoUser.map(item=> item.id_produto)

        const produtosCarrinho = await knex('produtos').whereIn('id', idsProdutos)

        const produtosCarrinhoCurrent = produtosCarrinho.map(({id, quantidade, created_at, updated_at, ...rest})=> rest)

        const somaPrecos = produtosCarrinhoCurrent.reduce((total, produto)=> total + produto.preco, 0)


        //Objeto com as informacoes 
        const data = {
            requestNumber,
            dueDate,
            amount: parseFloat(somaPrecos.toFixed(2)),
            shippingAmount: 0,
            usernameCheckout: "checkout",
                client: {
                name,
                document,
                phoneNumber,
                email,
                address: {
                    codIbge:"360000",
                    street: enderecoUser.rua,
                    number: enderecoUser.numero,
                    complement: "",
                    zipCode:"74663-520",
                    neighborhood:enderecoUser.bairro,
                    city:"itaperuna",
                    state: enderecoUser.uf
                }
            },
            products:
            produtosCarrinhoCurrent
        } 

    }
}

        

// {
//     "requestNumber": "12345",
//     "dueDate":"2022-10-30",
//     "amount": 300.00,
//     "shippingAmount": 10.0,
//     "usernameCheckout": "checkout",
//     "client": {
//         "name":"José da Silva",
//         "document":"927.300.300-18",
//         "phoneNumber": "62999815500",
//         "email": "josesilva@gmail.com",
//           "address": {
//               "codIbge":"5208707",
//               "street":"Rua Paraíba",
//               "number":"150",
//               "complement":"",
//               "zipCode":"74663-520",
//               "neighborhood":"Goiânia 2",
//               "city":"Goiânia",
//               "state":"GO"
//           }
//     },
//     "products": [
//       {
//         "description": "Tênis",
//         "quantity": 1,
//         "value": 200.0
//       },
//       {
//         "description": "Camiseta M",
//         "quantity": 2,
//         "value": 75.0
//       }
//     ]
//   }