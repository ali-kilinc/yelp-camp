let mongoose = require("mongoose");

let campgroundSchema = new mongoose.Schema(
    {
        name: String,
        description : String,
        imageUrl : String,
        author : { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        reviews: [
            {
                postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
                rating: Number,
                comment: String
            }
        ],
        price : Number,
        location : {
            lng : Number,
            lat : Number
        },
        amenities : [String]
    });
    
let Campground = mongoose.model("Campground", campgroundSchema);

module.exports = Campground;