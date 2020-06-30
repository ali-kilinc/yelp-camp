let mongoose            = require('mongoose'),
    config              = require("./config.js"),
    Campground          = require("./models/campground.js");

mongoose.set('useFindAndModify', false);

let connect = function()
{
    const connectionString = `mongodb://${config.db.host}:${config.db.port}/${config.db.name}`;
    
    mongoose.connection.on('open', function(){
        console.log("Mongoose default connection is open to " + connectionString);
    });

    mongoose.connection.on('error', function(err){
        console.log("Mongoose default connection has occured "+err+" error");
    });

    mongoose.connection.on('disconnected', function(){
        console.log("Mongoose default connection is disconnected");
    });

    process.on('SIGINT', function(){
        mongoose.connection.close(function(){
            console.log("Mongoose default connection is disconnected due to application termination");
            process.exit(0)
        });
    });

    mongoose.connect(connectionString, {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true}).catch(err => console.log("mongoose connect error:" + err));   
};

let exportObject = {};
exportObject.connect = connect;

module.exports = exportObject;