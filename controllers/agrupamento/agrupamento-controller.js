const mysql = require("../../mysql");

exports.create = async (req, res, next) => {
    try {
        const query = `
            INSERT INTO agrupamentos (id_contexto, nome) VALUES (?,?);
        `;
        const result = await mysql.execute(query, [req.body.id_contexto, req.body.nome]);
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

exports.findByContext = async (req, res, next) => {
    try {
        const query = `
            SELECT agrupamentos.id_agrupamento,
                   agrupamentos.nome
              FROM agrupamentos
             WHERE id_contexto = ?;
        `;
        const result = await mysql.execute(query, [req.params.id_contexto]);
        res.locals.agrupamentos = result.map(a => {
            return {
                id_agrupamento: a.id_agrupamento,
                nome: a.nome
            }
        });
        next();
    } catch (error) {
        console.error(error);
        return res.status(500).send({ error: error });
    }
};