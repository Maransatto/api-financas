const mysql = require('../../mysql');
const moment = require('moment');

exports.createBudgetForCurrentAndNextMonth = async(req, res, next) => {
    try {
        // REGRA: Se não existe orçamento para o mês seguinte, criar, para o atual e o próximo
        const firstDayOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
        const firstDayOfNextMonth = new Date(moment(firstDayOfMonth).add(1, 'M'));

        const query = `
            INSERT IGNORE INTO orcamentos (
                id_contexto,
                data,
                nota
            ) VALUES
            (?,?, ''),
            (?,?, '');`;
        await mysql.execute(query, [
            req.params.id_contexto, firstDayOfMonth,
            req.params.id_contexto, firstDayOfNextMonth
        ]);
        next();
    } catch (error) {
        console.error(error);
        return res.status(500).send({ error: error });
    }
}

exports.getBudgets = async(req, res, next) => {
    try {
        const query = `SELECT * FROM orcamentos WHERE id_contexto = ?`;
        const result = await mysql.execute(query, [req.params.id_contexto]);
        res.locals.orcamentos = result.map(o => {
            return {
                id_contexto: o.id_contexto,
                id_orcamento: o.id_orcamento,
                data: o.data,
                nota: o.nota
            }
        });
        next();
    } catch (error) {
        console.error(error);
        return res.status(500).send({ error: error });
    }
};

exports.createBudgetCategories = async (req, res, next) => {
    try {
        const query = `
            INSERT IGNORE INTO orcamentos_categorias (
                id_orcamento,
                id_categoria
            )
            SELECT orcamentos.id_orcamento,
                   categorias.id_categoria
              FROM orcamentos
        INNER JOIN agrupamentos
                ON agrupamentos.id_contexto         = ?
        INNER JOIN categorias
                ON categorias.id_agrupamento        = agrupamentos.id_agrupamento
             WHERE orcamentos.id_contexto           = ?
          ORDER BY orcamentos.id_orcamento,
                   categorias.id_categoria;;`;
        await mysql.execute(query, [
            req.params.id_contexto,
            req.params.id_contexto
        ]);
        next();
    } catch (error) {
        console.error(error);
        return res.status(500).send({ error: error });
    }
};


exports.returnBudgets = async(req, res, next) => {
    return res.status(200).send({
        orcamentos: res.locals.orcamentos
    })
};

exports.pushGroupsIntoBudgets = async (req, res, next) => {
    const orcamentos = res.locals.orcamentos;
    const agrupamentos = res.locals.agrupamentos;

    res.locals.orcamentos = orcamentos.map(o => {
        return {
            ...o,
            agrupamentos: agrupamentos
        }
    });

    next();
};

exports.getBudgetValues = async (req, res, next) => {
    try {
        const query = `
                SELECT orcamentos_categorias.id_orcamento,
                       orcamentos_categorias.id_categoria,
                       orcamentos_categorias.valor,
                       orcamentos.data
                  FROM orcamentos_categorias
            INNER JOIN orcamentos
                    ON orcamentos.id_orcamento  = orcamentos_categorias.id_orcamento
                 WHERE orcamentos.id_contexto   = ?;`;
        const results = await mysql.execute(query, [req.params.id_contexto]);
        res.locals.orcamentos = res.locals.orcamentos.map(orcamento => {
            return {
                ...orcamento,
                agrupamentos: orcamento.agrupamentos.map(agrupamento => {
                    return {
                        ...agrupamento,
                        categorias: agrupamento.categorias.map(categoria => {
                            const orcado = results.filter(r => 
                                r.id_categoria   === categoria.id_categoria &&
                                r.data.getTime() === orcamento.data.getTime()
                            );
                            const valor = orcado.length ? orcado[0].valor : 0;
                            return {
                                ...categoria,
                                valor: valor
                            }
                        })
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