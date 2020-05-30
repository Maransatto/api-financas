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