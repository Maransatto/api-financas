exports.getApiConfig = () => {
    return {
        api_url: process.env.API_URL_DOMINIO || 'http://localhost:3000/',
        port: process.env.API_PORT || 3000,
        mysql_host: process.env.MYSQL_HOST,
        mysql_user: process.env.MYSQL_USER,
        mysql_password: process.env.MYSQL_PASSWORD,
        mysql_database: process.env.MYSQL_DATABASE,
        mysql_port: process.env.MYSQL_PORT,
        ambiente: process.env.AMBIENTE || 'D',
        jwt_key: process.env.JWT_KEY
    };
};

exports.getError = (error) => {
    if (error) {
        console.error(error);
        return true;
    }
};
