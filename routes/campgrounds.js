let express             = require("express"),
    Campground          = require("../models/campground.js");

let router  = express.Router();

const amenityTypes = {
    
    WIFI : "Wi-fi",
    FISHING : "Fishing",
    BIKE_RENTALS : "Bike Rentals",
    FIREWOOD : "Firewood",
    DRINKING_WATER: "Drinking Water",
    TOILET: "Toilet",
    SHOWERS: "Showers",
    BEACH: "Beach",
    LAKE_RIVER_ACCESS: "Lake/River Access",
    PLAYGROUND_AREA: "Playground Area",
    SEWAGE_DUMP_STATION: "Sewage Dump",
    PETS_ALLOWED: "Pets Allowed",
    FIREPITS_OR_GRILLS: "Firepits or Grills",
    MARKET : "Market ",
    COFFEE: "Coffee",
    PICNIC_TABLES: "Picnic Tables",
    LAUNDRY_FACILITY: "Laundry facility",
    POOL: "Pool",
    MINI_GOLF: "Mini Golf",
    ICE_CREAM: "Ice Cream"
}

let amenities = [
    { amenity: amenityTypes.WIFI, icon: `<i class="fas fa-wifi"></i>` },
    { amenity: amenityTypes.FISHING, icon: `<i class="fas fa-fish"></i>` },
    { amenity: amenityTypes.BIKE_RENTALS, icon: `<i class="fas fa-bicycle"></i>` },
    { amenity: amenityTypes.FIREWOOD, icon: `<i class="fas fa-fire"></i>` },
    { amenity: amenityTypes.DRINKING_WATER, icon: `<i class="fas fa-glass-whiskey"></i>` },
    { amenity: amenityTypes.TOILET, icon: `<i class="fas fa-toilet"></i>` },
    { amenity: amenityTypes.SHOWERS, icon: `<i class="fas fa-shower"></i>` },
    { amenity: amenityTypes.BEACH, icon: `<i class="fas fa-umbrella-beach"></i>` },
    { amenity: amenityTypes.LAKE_RIVER_ACCESS, icon: `<i class="fas fa-water"></i>` },
    { amenity: amenityTypes.PLAYGROUND_AREA, icon: `<i class="fas fa-child"></i>` },
    { amenity: amenityTypes.SEWAGE_DUMP_STATION, icon: `<i class="fas fa-poo"></i>` },
    { amenity: amenityTypes.PETS_ALLOWED, icon: `<i class="fas fa-dog"></i>` },
    { amenity: amenityTypes.FIREPITS_OR_GRILLS, icon: `<i class="fas fa-drumstick-bite"></i>` },
    { amenity: amenityTypes.MARKET, icon: `<i class="fas fa-shopping-cart"></i>` },
    { amenity: amenityTypes.COFFEE, icon: `<i class="fas fa-coffee"></i>` },
    { amenity: amenityTypes.PICNIC_TABLES, icon: `<i class="fas fa-shopping-basket"></i>` },
    { amenity: amenityTypes.LAUNDRY_FACILITY, icon: `<i class="fas fa-tshirt"></i>` },
    { amenity: amenityTypes.POOL, icon: `<i class="fas fa-swimmer"></i>` },
    { amenity: amenityTypes.MINI_GOLF, icon: `<i class="fas fa-golf-ball"></i>` },
    { amenity: amenityTypes.ICE_CREAM, icon: `<i class="fas fa-ice-cream"></i>` }
];

// INDEX ROUTE
router.get("/", function(req, res)
{
    let getAllCamps = Campground.find().exec();
    getAllCamps.then(allCamps => res.render("campgrounds", {allCamps : allCamps})).catch(err => {
        console.log("Error occured finding campground:" + err);
        req.flash("errorMessage", `An error occured during the process. We're working on it. Please try again later`);
        res.redirect("/campgrounds");
    });
});

// NEW ROUTE
router.get("/new", function(req, res){
    
    if(!req.user)
    {
        req.flash("errorMessage", `You need to <a href="#" id="login-anchor">login</a> to add a campground.`);
        res.redirect("/campgrounds");
    }
    else
    {
        res.render("campgrounds/new", { amenities : amenities });
    }
});

// CREATE ROUTE
router.post("/", function(req, res)
{
    if(!req.user)
    {
        req.flash("errorMessage", `You need to <a href="#" id="login-anchor">login</a> to add a campground.`);
        res.redirect("/campgrounds");
    }
    else
    {
        req.body.campground.author = req.user._id;
        req.body.campground.location = JSON.parse(req.body.campground.location);
        req.body.campground.amenities = JSON.parse(req.body.campground.amenities);

        Campground.create(req.body.campground).then(c => {
            req.flash("successMessage", "Campground " + c.name + " has been added successfully.");
            res.redirect("/campgrounds");
        }).catch(err => {
            console.log("Error occured adding a new campground:" + err);
            req.flash("errorMessage", "An error occuered adding the new campground. We're working on it. Please try again later.");
            res.redirect("/campgrounds");
        });
    }
});

// EDIT ROUTE
router.get("/:id/edit" , function(req, res){

    if(!req.user)
    {
        req.flash("errorMessage", `You need to <a href="#" id="login-anchor">login</a> to edit a campground.`);
        res.redirect("/campgrounds");
    }
    else 
    {
        let getCamp = Campground.findById(req.params.id).populate("author").exec();
        getCamp.then(campground => {

            if(!req.user._id.equals(campground.author._id))
            {
                req.flash("errorMessage", `You don't have permission to edit this campground.`);
                res.redirect("/campgrounds");
            }
            else
            {
                res.render("campgrounds/edit", {amenities : amenities, campground: campground});
            }           
        }).catch(err => {
            console.log("Error occured finding campground:" + err);
            req.flash("errorMessage", `An error occured during the process. We're working on it. Please try again later`);
            res.redirect("/campgrounds");
        });
    }
});

// UPDATE ROUTE
router.put("/:id" , function(req, res){
    
    if(!req.user)
    {
        req.flash("errorMessage", `You need to <a href="#" id="login-anchor">login</a> to edit a campground.`);
        res.redirect("/campgrounds");
    }
    else
    {
        let getCamp = Campground.findById(req.params.id).populate("author").exec();
        getCamp.then(campground => {

            if(!campground.author._id.equals(req.user._id))
            {
                req.flash("errorMessage", "You don't have permission to update this campground");
                res.redirect("/campgrounds");
            }
            else
            {
                req.body.campground.location = JSON.parse(req.body.campground.location);
                req.body.campground.amenities = JSON.parse(req.body.campground.amenities);
                Campground.findByIdAndUpdate({_id : req.params.id}, req.body.campground, {new: true}).then(c => {
                    req.flash("successMessage", "Campground " + c.name + " has been updated successfully.");
                    res.redirect("/campgrounds");
                }).catch(err => console.log(err));
            }
        }).catch(err => {
            console.log("Error occured updating the campground:" + err);
            req.flash("errorMessage", "An error occuered updating the campground. We're working on it. Please try again later.");
            res.redirect("/campgrounds");
        });        
    }
}); 

// DELETE ROUTE
router.delete("/:id", function(req, res){
    
    if(!req.user)
    {
        req.flash("errorMessage", `You need to <a href="#" id="login-anchor">login</a> to delete a campground.`);
        res.redirect("/campgrounds");
    }
    else
    {
        let getCamp = Campground.findById(req.params.id).populate("author").exec();
        getCamp.then(campground => {

            if(!campground.author._id.equals(req.user._id))
            {
                req.flash("errorMessage", "You don't have permission to delete this campground");
                res.redirect("/campgrounds");
            }
            else
            {
                Campground.findByIdAndDelete({_id : req.params.id}).then(c => {
                    req.flash("successMessage", "Campground " + c.name + " has been deleted successfully.");
                    res.redirect("/campgrounds");
                }).catch(err => {
                    console.log("Error occured finding and deleting campground:" + err);
                    req.flash("errorMessage", `An error occured during the process. We're working on it. Please try again later`);
                    res.redirect("/campgrounds");
                });
            }
        }).catch(err => {
            console.log("Error occured deleting the campground:" + err);
            req.flash("errorMessage", "An error occuered deleting the campground. We're working on it. Please try again later.");
            res.redirect("/campgrounds");   
        });        
    }
});

// POST REVIEW ROUTE
router.post("/:id/review", function(req, res)
{
    let getCamp = Campground.findById(req.params.id).exec();
    
    getCamp.then(campground => {
        if(req.user)
        {
            req.body.review.postedBy = req.user._id;
            var index = campground.reviews.findIndex(r => r.postedBy._id.equals(req.user._id));

            if(index >= 0)
            {
                campground.reviews[index] = req.body.review;
            }
            else
            {
                campground.reviews.push(req.body.review);
            }

            campground.save().then(savedCampground => {
                res.redirect("/campgrounds/" + campground._id);
            }).catch(err => {
                {
                    console.log("Error occured saving campground:" + err);
                    req.flash("errorMessage", `An error occured during the process. We're working on it. Please try again later`);
                    res.redirect("/campgrounds/" + campground._id);
                }
            });
        }
        else
        {
            req.flash("errorMessage", `You should log in to write reviews`);
            res.redirect("/campgrounds/" + campground._id);
        }
        
    }).catch(err => {
        req.flash("errorMessage", `Error occured during this process. We're working on it. Please try again later`);
        res.redirect("/campgrounds/" + campground._id);
    });
});

// DELETE COMMENT
router.delete("/:id/review/:review_id", function(req, res)
{
    if (req.user) {

        let getCamp = Campground.findById(req.params.id).exec();

        getCamp.then(campground => {

            let found = false;
            for (var i = 0; i < campground.reviews.length; i++) {
                if (campground.reviews[i]._id.equals(req.params.review_id)) {
                    campground.reviews.splice(i, 1);
                    found = true;
                    break;
                }
            }
            if (found) {
                campground.save().then(c => {
                    req.flash("successMessage", "Your review deleted successfully.");
                    res.redirect("/campgrounds/" + req.params.id);
                }).catch(err => {
                    console.log("Error occured deleting comment:" + err);
                    req.flash("errorMessage", `An error occured during the process. We're working on it. Please try again later`);
                    res.redirect("/campgrounds/" + req.params.id);
                });
            }
            else {
                console.log("Review not found.");
                req.flash("errorMessage", `An error occured during the process. We're working on it. Please try again later`);
                res.redirect("/campgrounds/" + req.params.id);
            }
        }).catch(err => {
            console.log("Error occured deleting comment:" + err);
            req.flash("errorMessage", `An error occured during the process. We're working on it. Please try again later` + err);
            res.redirect("/campgrounds/" + req.params.id);
        });
    }
    else {
        req.flash("errorMessage", `You should log in to delete reviews`);
        res.redirect("/campgrounds/" + req.params.id);
    }
});

// SHOW ROUTE
router.get("/:id", function(req, res){
    let getCamp = Campground.findById(req.params.id).populate("author").populate("reviews.postedBy").exec();
    getCamp.then(campground => {
        res.render("campgrounds/show", {amenities : amenities, campground:campground});
    }).catch(err => {
        console.log(err);
        req.flash("errorMessage", `An error occured during the process. We're working on it. Please try again later`);
        res.redirect("/campgrounds");
    });
});

module.exports = router;