const mysql = require("../../mysql");

exports.create = async (req, res, next) => {
    try {
        const query = `
            INSERT INTO categorias (
                id_agrupamento,
                id_conta,
                nome
            ) VALUES (?,?,?);
        `;
        const result = await mysql.execute(query, [
            req.body.id_agrupamento,
            req.body.id_conta,
            req.body.nome
        ]);
        return res.status(201).send({
            categoria: {
                id_categoria: result.insertId,
                id_agrupamento: req.body.id_agrupamento,
                id_conta: req.body.id_conta,
                nome: req.body.nome
            }
        })
    } catch (error) {
        return res.status(500).send({ error: error });
    }
};