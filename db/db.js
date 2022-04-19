require('dotenv').config()
const mongoose = require('mongoose');

const options = {
    autoIndex: false, // Don't build indexes
    maxPoolSize: 10, // Maintain up to 10 socket connections
    serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
    socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
    family: 4 // Use IPv4, skip trying IPv6
}

const dbConn = async () => {
    try {
        await mongoose.connect(process.env.MONGO_CONN, options)
        console.log('Conexion MongoDb realizada.')
    } catch (error) {
        console.log(error)
    }
}

const closeConn = async () => {
    try {
        await mongoose.connection.close(false, () => {
            console.log('Conexión a MongoDb cerrada.');
        });
    } catch (error) {
        console.log(error);
    }
}

module.exports = { dbConn, closeConn }