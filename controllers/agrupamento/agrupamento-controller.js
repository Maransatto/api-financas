const mysql = require("../../mysql");

exports.create = async (req, res, next) => {
    try {
        const query = `
            INSERT INTO agrupamentos (id_contexo, nome) VALUES (?,?);
        `;
        const result = mysql.execute(query, [req.body.id_contexto, req.body.nome]);
        return res.status(201).send({
            agrupamento: {
               id_agrupamento: result.insertId,
               id_contexto: req.body.id_contexto,
               nome: req.body.nome
            }
        });
    } catch (error) {
        return res.status(500).send({ error: error });
    }
};