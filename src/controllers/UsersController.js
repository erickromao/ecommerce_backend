const {AppError} = require('../utils/AppError')
const knex = require('../database/knex')
const validator  = require('validator')
const {hash} = require('bcryptjs')
require('dotenv').config()

class UsersController{

    async create(request, response){
        const {
                nome,
                email, 
                password,
                UF,
                bairro,
                rua, 
                numero,
                telefone
            } = request.body

        if(!nome || !email || !password || !telefone){
            throw new AppError('Preencha todos os campos obrigátorios: (nome, email, password, telefone)')
        }

        if(!validator.isEmail(email)){
            throw new AppError('Insira um email válido.')
        }

        const [checkEmail] = await knex('users').where({email})
        if(checkEmail){
            throw new AppError('Esse email já está sendo usado.')
        }

        const locale = 'pt-BR'

        if(!validator.isMobilePhone(telefone, locale)){
            throw new AppError('Insira um número de telefone válido.')
        }

        const hashedPassword = await hash(password, 8)

        const [new_user] = await knex('users').insert({
            nome,
            email,
            password: hashedPassword,
            telefone
        }).returning('*')
        const [new_userCurrent] = [new_user].map(({id, pedidos, isADM, endereco_id, pedidos_id, password, updated_at, ...rest })=> rest)
       
        //Endereço
        let correntEndereco

        if(UF || bairro || rua || numero){
            if(!UF || !bairro || !rua || !numero){
                throw new AppError('Para o endereço, necessário preencher todos campos: (UF, bairro, rua, numer)')
            }
            const UFvalida = [
                'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG', 
                'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
            ]

            if(!UFvalida.includes(UF)){
                throw new AppError('UF não válida.')
            }
            
            const [enderecoUser] = await knex('enderecos').insert({
                UF,
                bairro,
                rua,
                numero,
                user_id: new_user.id
            }).returning('*')


            const [endereco] = [enderecoUser].map(({id, user_id, updated_at, ...rest}) => rest)
            correntEndereco = endereco
        }   


        if(!correntEndereco){
            correntEndereco = "Endereço não informado."
        }
        return response.json({
            message:"Conta criada com sucesso.",
            informacoes: new_userCurrent,
            endereco: correntEndereco
        })
        
    }
}

module.exports = UsersController