
const mongoose = require('mongoose')

const dbState = [
    {
        value: 0,
        label: "Disconnected"
    },
    {
        value: 1,
        label: "Connected"
    },
    {
        value: 2,
        label: "Connecting"
    },
    {
        value: 3,
        label: "Disconnecting"
    }
];

const connection = async () => {
    const options = {
        user: 'giathuan',
        pass: '08022003',
        dbName: 'seeds'
    }
    await mongoose.connect('mongodb+srv://trangiathuan08022003.9zwyq.mongodb.net//', options);
    const state = Number(mongoose.connection.readyState);
    console.log(dbState.find(f => f.value === state).label, "to database");
}
module.exports = connection;