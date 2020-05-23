const mysql = require("../../mysql");

exports.mustNotExists = async (req, res, next) => {
    try {
        let query = `
            SELECT *
              FROM contextos
        INNER JOIN usuarios_contextos
                ON usuarios_contextos.id_contexto = contextos.id_contexto
             WHERE contextos.nome                 = ?
               AND usuarios_contextos.id_usuario  = ?;`;
        const result = await mysql.execute(query, [
            req.body.nome,
            res.locals.usuario.id_usuario
        ]);  
        if (result.length) { return res.status(403).send({ message: 'Contexto já existe'}); }
        next();
    } catch (error) {
        console.error(error);
        return res.status(500).send({ error: error })
    }
};

exports.create = async (req, res, next) => {
    try {
        let query = `INSERT INTO contextos (nome) VALUES (?);`;
        const result = await mysql.execute(query, [req.body.nome]);
        res.locals.contexto = {
            id_contexto: result.insertId,
            nome: req.body.nome
        }
        next();
    } catch (error) {
       return res.status(500).send({ error: error }) 
    }
};

exports.setUserId = async(req, res, next) => {
    try {
        let query = `
            INSERT INTO usuarios_contextos (
                id_usuario,
                id_contexto
            ) VALUES (?,?);
        `
        await mysql.execute(query, [res.locals.usuario.id_usuario, res.locals.contexto.id_contexto]);
        next();
    } catch (error) {
        console.error(error);
        return res.status(500).send({ error: error }) 
    }
}

exports.returnCreatedContext = async (req, res, next) => {
    return res.status(201).send({
        contexto: res.locals.contexto,
        message: 'Contexto criado com sucesso'
    });
}

exports.findAllUserContexts = async (req, res, next) => {
    try {
        const query = `
            SELECT contextos.id_contexto,
                   contextos.nome
              FROM contextos
        INNER JOIN usuarios_contextos
                ON usuarios_contextos.id_contexto   = contextos.id_contexto
             WHERE usuarios_contextos.id_usuario    = ?`;
        const result = await mysql.execute(query, [res.locals.usuario.id_usuario]);
        return res.status(200).send({
            contextos: result.map(contexto => {
                return {
                    id_contexto: contexto.id_contexto,
                    nome: contexto.nome
                }
            })
        });
    } catch (error) {
        console.error(error);
       return res.status(500).send({ error: error }) 
    }
};

exports.mustBeFromLoggedUser = async (req, res, next) => {
    try {
        const id_contexto = req.params.id_contexto ? req.params.id_contexto : req.body.id_contexto;
        const query = `
            SELECT *
              FROM usuarios_contextos
             WHERE id_usuario = ? 
               AND id_contexto = ?
        `;
        const result = await mysql.execute(query, [res.locals.usuario.id_usuario, id_contexto]);
        if (!result.length) { return res.status(403).send({ message: 'Ação não permitida para este usuário'}); }
        next();
    } catch (error) {
        console.error(error);
        return res.status(500).send({ error: error })
    }
};

exports.delete = async (req, res, next) => {
    try {
        await mysql.execute(`DELETE FROM usuarios_contextos WHERE id_contexto = ?`, [req.params.id_contexto]);
        await mysql.execute(`DELETE FROM contextos          WHERE id_contexto = ?;`, [req.params.id_contexto]);
        return res.status(202).send( { message: 'Contexto removido com sucesso.' });
    } catch (error) {
        console.error(error);
        return res.status(500).send({ error: error }) 
    }
};

exports.getAccounts = async (req, res, next) => {
    try {
        const query = `
            SELECT *
              FROM contas
             WHERE id_contexto = ?
        `;
        const result = await mysql.execute(query, [req.params.id_contexto]);
        return res.status(200).send({
            contas: result.map(conta => {
                return {
                    id_conta: conta.id_conta,
                    nome: conta.nome,
                    encerrada: conta.encerrada
                }
            })
        });
    } catch (error) {
        console.error.error(error);
        return res.status(500).send({error: error});
    }
}