const mysql = require("../../mysql");

exports.findByName = async (req, res, next) => {
    try {
        const query = `
            SELECT *
              FROM contatos
             WHERE nome = ?
        `;
        const result = await mysql.execute(query, [req.body.nome_contato]);
        if (result.length) {
            req.body.id_contato = result[0].id_contato;
        }
        next();
    } catch (error) {
        return res.status(500).send({ error: error });
    }
};

exports.create = async (req, res, next) => {
    try {
        if (req.body.nome_contato && !req.body.id_contato) {
            const query = `
                INSERT INTO contatos (
                    id_contexto,
                    nome
                ) VALUES (?,?);
            `;
            const result = await mysql.execute(query, [
                req.body.id_contexto,
                req.body.nome_contato
            ]);
            req.body.id_contato = result.insertId;
        }
        next();
    } catch (error) {
        return res.status(500).send({ error: error });
    }
}