const mysql = require("../../mysql");

exports.mustNotExists = async (req, res, next) => {
    try {
        const query = `
            SELECT *
              FROM contas
             WHERE id_contexto  = ?
               AND nome         = ?;`;
        const result = await mysql.execute(query, [
            req.body.id_contexto,
            req.body.nome
        ]);  
        if (result.length) { return res.status(403).send({ message: 'Já existe conta com este nome' }); }
        next();
    } catch (error) {
        console.error(error);
        return res.status(500).send({ error: error })
    }
};


exports.create = async (req, res, next) => {
    try {
        const query = `
            INSERT INTO contas (
                id_contexto,
                id_tipo_conta,
                nome
            ) VALUES (?,?,?);`;
        const result = await mysql.execute(query, [
            req.body.id_contexto,
            req.body.id_tipo_conta,
            req.body.nome
        ]);
        return res.status(201).send({
            conta: {
                id_conta: result.insertId,
                nome: req.body.nome
            }
        });
    } catch (error) {
        console.error(error);
        return res.status(500).send({ error: error }) 
    }
};

exports.getTypes = async (req, res, next) => {
    try {
        const query = `SELECT * FROM tipos_contas;`;
        const result = await mysql.execute(query);
        return res.status(200).send({
            tipos_contas: result.map(tipo_conta => {
                return {
                    id_tipo_conta: tipo_conta.id_tipo_conta,
                    nome: tipo_conta.nome
                }
                
            })
        })
    } catch (error) {
        console.error(error);
        return res.status(500).send({ error: error });
    }
}