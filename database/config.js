const mongoose = require('mongoose');

const dbConnection = async () => {

    try {
        mongoose.set('strictQuery',false);
        await mongoose.connect(process.env.DB_CNN);
        console.log('DB online')
    } catch (e) {
        console.error(e);
        throw new Error('Error a la hora de inicializar la base de datos')
    }
}

module.exports = {
    dbConnection
}