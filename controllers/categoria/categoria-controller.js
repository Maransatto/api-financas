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
            },
            message: 'Categoria criada com sucesso.'
        })
    } catch (error) {
        return res.status(500).send({ error: error });
    }
};

exports.getCategories = async (req, res, next) => {
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
        const result = await mysql.execute(query, [req.params.id_contexto]);
        res.locals.agrupamentos = res.locals.agrupamentos.map(a => {
            return {
                ...a,
                categorias: result
                                .filter(c => c.id_agrupamento == a.id_agrupamento)
                                .map(c => {
                                    return {
                                        id_categoria: c.id_categoria,
                                        nome: c.nome
                                    }
                                })
            }
        });
        next();
    } catch (error) {
        console.error(error);
        return res.status(500).send({ error: error });
    }
};