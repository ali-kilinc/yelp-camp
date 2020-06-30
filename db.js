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

let seedDb = function()
{
    Campground.deleteMany({}).then(err => 
    {
        if(err)
        {
            console.log(err);
        }
        else
        {
            console.log("Deleted many from campgrounds");
        }
    });

    let c1 = new Campground({
        name : "Akdeniz Camping",
        description :  "Sultaniye Köyü’nde, Köyceğiz Gölü kenarında yerlilerin işlettiği bizce harika, dingin, salaş bir yer bulduk. Adı Cemil’in Yeri / Akdeniz Camping.",
        imageUrl : "https://www.bizevdeyokuz.com/wp-content/uploads/akdeniz-kamping-cemilin-yeri.jpg"
    });

    c1.save().then(c => console.log(c.name + " saved to db"));

    let c2 = new Campground({
        name : "Hızır Camp",
        description :  "Hızır Kamp, kitlesi, tesisi, işletmecileri, doğası, her şeyi ile Türkiye’de EN sevdiğimiz kamp alanı.",
        imageUrl : "https://www.bizevdeyokuz.com/wp-content/uploads/kazdaglari-kamp.jpg"
    });

    c2.save().then(c => console.log(c.name + " saved to db"));

    let c3 = new Campground({
        name : "Sugar Beach",
        description :  "Sugar Beach, bungalow tarzı ağaç evlerin bulunduğu bir glamping. Fiyatlara açık büfe sabah kahvaltısı, klima, plajdaki şezlong ve şemsiye kullanımı, internet gibi hizmetler dahil.",
        imageUrl : "https://www.bizevdeyokuz.com/wp-content/uploads/sugar-beach-%C3%B6l%C3%BCdeniz.jpg"
    });
    c3.save().then(c => console.log(c.name + " saved to db"));
};

let exportObject = {};
exportObject.connect = connect;
exportObject.seedDb = seedDb;

module.exports = exportObject;