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

exports.findByContext = async (req, res, next) => {
    try {
        const query = `
            SELECT categorias.id_agrupamento,
                   categorias.id_categoria,
                   categorias.nome
              FROM categorias
        INNER JOIN agrupamentos
                ON agrupamentos.id_agrupamento = categorias.id_agrupamento
             WHERE agrupamentos.id_contexto    = ?;
        `;
        const categorias = await mysql.execute(query, [req.params.id_contexto]);
        return res.status(200).send({
            agrupamentos: res.locals.agrupamentos.map(a => {
                return {
                    ...a,
                    categorias: categorias.filter(c => c.id_agrupamento == a.id_agrupamento)
                }
            })
        });
    } catch (error) {
        console.error(error);
        return res.status(500).send({ error: error });
    }
};