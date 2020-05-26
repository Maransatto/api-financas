const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');

const usuarioRoute = require('./routes/usuario/usuario-route');
const contextoRoute = require('./routes/contexto/contexto-route');
const tipoContaRoute = require('./routes/tipo-conta/tipo-conta-route');
const contaRoute = require('./routes/conta/conta-route');
const transacaoRoute = require('./routes/transacao/transacao-route');

app.use(morgan('dev'));

// app.use('/images', express.static('images'));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*'); // allow access from everywhere
    res.header(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    );

    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET'); // Quais os métodos possíveis
        return res.status(200).json({});
    }

    next();
});

app.use('/usuarios', usuarioRoute);
app.use('/contextos', contextoRoute);
app.use('/tipos-contas', tipoContaRoute);
app.use('/contas', contaRoute);
app.use('/transacoes', transacaoRoute);

app.use((req, res, next) => {
    const error = new Error('Not found...');
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
});

module.exports = app;