const mysql = require('../../mysql');

exports.create = async (req, res, next) => {
    try {
        const query = `
            INSERT INTO transacoes (
                id_conta,
                id_contato,
                data,
                aprovada,
                conciliada,
                nota,
                valor
            ) VALUES (?,?,?,?,?,?,?);
        `;
        const result = await mysql.execute(query, [
            req.body.id_conta,
            req.body.id_contato,
            req.body.data,
            req.body.aprovada,
            req.body.conciliada,
            req.body.nota,
            req.body.valor
        ]);
        res.locals.transacao = {
            id_transacao: result.insertId,
            id_conta : req.body.id_conta,
            id_contato : req.body.id_contato,
            nome_contato: req.body.nome_contato,
            data : req.body.data,
            aprovada : req.body.aprovada,
            conciliada : req.body.conciliada,
            nota : req.body.nota,
            valor : req.body.valor
        };
        next();
    } catch (error) {
        console.error(error);
        return res.status(500).send({ error: error });
    }
};

exports.update = async (req, res, next) => {
    try {
        const query = `
            UPDATE transacoes
               SET id_conta         = ?,
                   id_contato       = ?,
                   data             = ?,
                   aprovada         = ?,
                   conciliada       = ?,
                   nota             = ?,
                   valor            = ?
             WHERE id_transacao     = ?;
        `;
        await mysql.execute(query, [
            req.body.id_conta,
            req.body.id_contato,
            req.body.data,
            req.body.aprovada,
            req.body.conciliada,
            req.body.nota,
            req.body.valor,
            req.params.id_transacao
        ]);
        res.locals.transacao = {
            id_transacao: parseInt(req.params.id_transacao, 0),
            id_conta : req.body.id_conta,
            id_contato : req.body.id_contato,
            nome_contato: req.body.nome_contato,
            data : req.body.data,
            aprovada : req.body.aprovada,
            conciliada : req.body.conciliada,
            nota : req.body.nota,
            valor : req.body.valor
        };
        next();
    } catch (error) {
        console.error(error);
        return res.status(500).send({ error: error });
    }
}

exports.removeCategories = async (req, res, next) => {
    try {
        const query = `DELETE FROM transacoes_categorias WHERE id_transacao = ?`;
        await mysql.execute(query, [res.locals.transacao.id_transacao]);
        next();
    } catch (error) {
        return res.status(500).send({ error: error });
    }
};

exports.setCategories = async (req, res, next) => {
    try {
        const query = `
            INSERT INTO transacoes_categorias (
                id_transacao,
                id_categoria,
                valor
            ) VALUES ?;`;
        const categorias = req.body.categorias.map(c => [
            res.locals.transacao.id_transacao,
            c.id_categoria,
            c.valor
        ]);
        mysql.execute(query, [categorias]);
        res.locals.transacao.categorias = req.body.categorias;
        next();
    } catch (error) {
        return res.status(500).send({ error: error });
    }
};

exports.returnCreatedTransaction = async(req, res, next) => {
    try {
        return res.status(201).send({
            transacao: res.locals.transacao,
            message: 'Transação incluída com sucesso'
        })
    } catch (error) {
        return res.status(500).send({ error: error });
    }
};

exports.getTransactions = async (req, res, next) => {
    try {
        let query = `
            SELECT transacoes.id_transacao,
                   transacoes.id_conta,
                   contatos.id_contato,
                   contatos.nome            AS nome_contato,
                   transacoes.data,
                   transacoes.aprovada,
                   transacoes.conciliada,
                   transacoes.nota,
                   CASE WHEN transacoes.valor < 0
                        THEN ROUND(ABS(transacoes.valor), 2)
                        ELSE 0
                   END as valor_saida,
                   CASE WHEN transacoes.valor > 0
                        THEN ROUND(transacoes.valor, 2)
                        ELSE 0
                   END as valor_entrada

              FROM transacoes
        INNER JOIN contas
                ON contas.id_conta          = transacoes.id_conta
         LEFT JOIN contatos
                ON contatos.id_contato      = transacoes.id_contato
             WHERE 
        `;

        if (req.params.id_contexto) {
            query += ` contas.id_contexto   = ?`
        } else {
            query += ` contas.id_conta      = ?`
        }

        const result = await mysql.execute(query, [
            req.params.id_contexto ? req.params.id_contexto : req.params.id_conta
        ]);

        res.locals.transacoes = result.map(transacao => {
            return {
                id_transacao: transacao.id_transacao,
                id_conta: transacao.id_conta,
                id_contato: transacao.id_contato,
                nome_contato: transacao.nome_contato,
                data: transacao.data,
                aprovada: transacao.aprovada,
                conciliada: transacao.conciliada,
                nota: transacao.nota,
                valor_saida: transacao.valor_saida,
                varor_entrada: transacao.valor_entrada
            }
        });
        next();
    } catch (error) {
        console.error(error);
        return res.status(500).send({ error: error });
    }
};

exports.returnTransactions = async (req, res, next) => {
    return res.status(200).send({
        transacoes: res.locals.transacoes
    });
};

exports.getTransactionCategories = async(req, res, next) => {
    try {
        let query = `
            SELECT transacoes_categorias.id_transacao,
                   categorias.id_categoria,
                   categorias.nome
              FROM transacoes_categorias
        INNER JOIN categorias
                ON categorias.id_categoria              = transacoes_categorias.id_categoria
        INNER JOIN transacoes
                ON transacoes.id_transacao              = transacoes_categorias.id_transacao
        INNER JOIN contas
                ON contas.id_conta                      = transacoes.id_conta
             WHERE
        `;

        if (req.params.id_contexto) {
            query += ` contas.id_contexto   = ?`
        } else {
            query += ` contas.id_conta      = ?`
        }

        const result = await mysql.execute(query, [
            req.params.id_contexto ? req.params.id_contexto : req.params.id_conta
        ]);

        res.locals.transacoes = res.locals.transacoes.map(transacao => {
            return {
                ...transacao,
                categorias: result.filter(c => c.id_transacao === transacao.id_transacao)
                                .map(c => {
                                    return {
                                        id_categoria: c.id_categoria,
                                        nome: c.nome
                                    }
                                })
            }
        });
        next()
    } catch (error) {
        return res.status(500).send({ error: error });
    }
}