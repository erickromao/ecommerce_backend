const {AppError} = require('../utils/AppError')
const knex = require('../database/knex')
const validator  = require('validator')
const {hash, compare} = require('bcryptjs')
const jwt = require('jsonwebtoken')
require('dotenv').config()

class UsersController{

    async create(request, response){
        const {
                nome,
                email, 
                password,
                uf,
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

        if(uf || bairro || rua || numero){
            if(!uf || !bairro || !rua || !numero){
                throw new AppError('Para o endereço, necessário preencher todos campos: (uf, bairro, rua, numer)')
            }
            const UFvalida = [
                'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG', 
                'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
            ]

            if(!UFvalida.includes(uf)){
                throw new AppError('uf não válida.')
            }
            
            const [enderecoUser] = await knex('enderecos').insert({
                uf,
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

    async login(request, response){
        const {email, password} = request.body
        const KEY = process.env.USER_TOKEN
        
        if(!email || !password){
            throw new AppError('Necessário preencher os campos: (email, password)')
        }

        const [checkUser] = await knex('users').where({email})
        if(!checkUser){
            throw new AppError('Usuário não encontrado.')
        }

        const checkPassword = await compare(password, checkUser.password)
        if(!checkPassword){
            throw new AppError('Senha incorreta.')
        }

        const [CurrentUser] = [checkUser].map(({password, ...rest})=> rest)
        
        const token = jwt.sign({userInfo: CurrentUser}, KEY, {expiresIn:"20m"})
        
        return response.json({
            message:`Bem-vindo, ${CurrentUser.nome}! Login feito com sucesso `,
            token
        })
    }
    
    async read(request, response){
        const user = request.user.userInfo
        const userCurrent = [user].map(({isADM, id, ...rest})=>rest)
        //Falta adicionar os pedidos
        response.json({Infos: userCurrent})
    }

    async delete(request, response){
        const user = request.user.userInfo

        const [userInfos] = [user].map(({id, isADM, ...rest})=> rest)

        await knex('users').where({id: user.id}).delete()

        response.json({
            message:`Usuário ${userInfos.nome} deletado com sucesso!`,
            oldInfos: userInfos
        })
    }
}

module.exports = UsersController