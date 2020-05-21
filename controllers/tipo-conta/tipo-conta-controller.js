const mysql = require("../../mysql");

exports.findAll = async (req, res, next) => {
    try {
        const result = await mysql.execute(`SELECT * FROM tipos_contas;`);
        return res.status(200).send({
            tipos_contas: result.map(conta => {
                return {
                    id_tipo_conta: conta.id_tipo_conta,
                    nome: conta.nome,
                    credito: conta.credito
                }
            })
        });
    } catch (error) {
        console.error(error);
        return res.status(500).send({error: error});
    }
}