const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mysql = require("../../mysql");
const utils = require('../../utils');
const api_config = utils.getApiConfig();

exports.mustNotExists = async (req, res, next) => {
    try {
        let query = `SELECT * FROM usuarios WHERE email = ?`;
        const result = await mysql.execute(query, [req.body.email]);
        if (result.length) { return res.status(403).send({ message: 'E-mail já cadastrado'}); }
        next();
    } catch (error) {
        return res.status(500).send({ error: error })
    }

};

exports.mustExists = async (req, res, next) => {
    try {
        let query = `SELECT * FROM usuarios WHERE email = ?`;
        const results = await mysql.execute(query, [req.body.email]);
        if (!results.length) { return res.status(401).send({ message: 'Falha na Autenticação'}); }
        res.locals.usuario = {
            id_usuario: results[0].id_usuario,
            nome: results[0].nome,
            email: results[0].email,
            password: results[0].password
        }
        next();
    } catch (error) {
        return res.status(500).send({ error: error })
    }
};

exports.create = async (req, res, next) => {
    try {
        bcrypt.hash(req.body.password, 10, async (err, hash) => {
            if (utils.getError(err)) { return res.status(500).send({ error: err }); }
            let query = `
                INSERT INTO usuarios (
                    nome,
                    email,
                    password
                ) VALUES (?,?,?);
            `;
            await mysql.execute(query, [
                req.body.nome,
                req.body.email,
                hash
            ]);
            return res.status(201).send({ message: 'Usuário cadastrado com sucesso.' })
        });
    } catch (error) {
       return res.status(500).send({ error: error }) 
    }
};

exports.findAll = async (req, res, next) => {
    try {
        const query = `SELECT * FROM usuarios`;
        const result = await mysql.execute(query, [req.body.email]);
        return res.status(200).send({
            usuarios: result.map(usuario => {
                return {
                    id_usuario: usuario.id_usuario,
                    nome: usuario.nome,
                    email: usuario.email                    
                }
            })
        })
    } catch (error) {
       return res.status(500).send({ error: error }) 
    }
};

exports.login = async (req, res, next) => {
    try {
        bcrypt.compare(req.body.password, res.locals.usuario.password, (err, result) => {
            if (!result || utils.getError(err)) {
                return res.status(401).json({ message: "Falha na autenticação" });
            }

            const token = jwt.sign(
                res.locals.usuario,
                api_config.jwt_key,
                {}
            );

            return res.status(200).send({
                message: 'Autenticado com sucesso',
                token: token,
                id_usuario: res.locals.usuario.id_usuario,
                nome: res.locals.usuario.nome,
                email: res.locals.usuario.email
            })
        });
    } catch (error) {
        return res.status(500).send({ error: error })
    }
};