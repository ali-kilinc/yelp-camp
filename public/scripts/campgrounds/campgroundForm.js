let amenities = [];
let campLocation;

$(document).ready(function () {

    if ($("#amenities-input").val()) {
        amenities = JSON.parse($("#amenities-input").val());
    }

    if ($("#location-input").val()) {
        campLocation = JSON.parse($("#location-input").val());
    }

    let mapboxPublicToken = 'pk.eyJ1IjoiYWtpbGluYyIsImEiOiJja2JxcnMxM3EwYWRxMnZudGw1bzlwcW0xIn0.VJg6gJT9Jov9kBVI0qdCVg';

    let marker = new mapboxgl.Marker();

    mapboxgl.accessToken = mapboxPublicToken;

    var map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/streets-v11', // stylesheet location
        center: (campLocation) ? [campLocation.lng, campLocation.lat] : [33, 40], // starting position [lng, lat]
        zoom: 4 // starting zoom
    });

    if (campLocation) {
        setMarkerPoint(campLocation);
    }

    map.on('click', function (e) {
        $("#location-search-results button.active").removeClass("active");
        setMarkerPoint({ lng: e.lngLat.lng, lat: e.lngLat.lat });
    });

    $("#location-search-text").keypress(function (e) {
        if (e.keyCode == 13) {
            searchLocation();
        }
    });

    $('#btn-search').on("click", searchLocation);

    function searchLocation() {

        let searchText = $("#location-search-text").val();

        if (searchText) {
            const options = {
                method: "GET",
                url: "https://api.mapbox.com/geocoding/v5/mapbox.places/" + searchText + ".json?access_token=" + mapboxPublicToken,
                cache: false
            };

            $.ajax(options).then(function(res) {

                if ($("#location-search-results").is(":visible")) {
                    $("#location-search-results").slideUp(function () {
                        requestAndLoadSearchResults(res)
                    });
                }
                else {
                    requestAndLoadSearchResults(res);
                }
            });
        }
        else {
            $("#location-search-results").slideUp();
        }
    }

    function requestAndLoadSearchResults(res) {
        let firstResultButton;

        if (!res || !res.features || res.features.length == 0) {
            $("#location-search-results").html("No results found.");
            $("#location-search-results").slideDown();
        }
        else {
            $("#location-search-results").html("");

            let $okSpan = $('<span>');
            $okSpan.attr("id", "ok-span");
            $okSpan.attr("class", "badge badge-success");
            $okSpan.text("OK");
            $okSpan.click(function () {
                $("#location-search-results").slideUp();
                $("#location-search-text").text("");
            });

            res.features.forEach(function(place, index) {

                var $button = $("<button>");
                $button.attr("type", "button");
                $button.attr("class", "list-group-item list-group-item-action");

                if (index === 0) {
                    $button.addClass("list-group-item-success");
                }

                $button.text(place.place_name);

                if (index === 0) {
                    $button.append($okSpan);
                }
                $button.click(function () {

                    var lngLat = {
                        lng: place.geometry.coordinates[0],
                        lat: place.geometry.coordinates[1]
                    };

                    setMarkerPoint(lngLat);

                    $("#location-search-results button.list-group-item-success").removeClass("list-group-item-success");
                    $(this).addClass("list-group-item-success");
                    $(this).append($okSpan);
                });

                if (index === 0) {
                    firstResultButton = $button;
                }

                $("#location-search-results").append($button);
            });

            $("#location-search-results").slideDown();
            firstResultButton.trigger("click");
        }
    }

    function setMarkerPoint(lngLat) {

        marker.remove();
        marker.setLngLat(lngLat).addTo(map);

        map.flyTo({ center: lngLat, zoom: 9 });
        $("#location-input").val(JSON.stringify(lngLat));
        $("#missing-location-warning").slideUp();
    }
});


$("#add-form").submit(function (e) {
    campgroundFormSubmit(e);
});

$("#edit-form").submit(function (e) {
    campgroundFormSubmit(e);
});

function campgroundFormSubmit(e) {
    if (!$("#location-input").val()) {
        e.preventDefault();
        $("#missing-location-warning").slideDown();
    }
    else {
        $("#amenities-input").val(JSON.stringify(amenities));
    }
}

$(document).on("click", function (event) {

    if (!$(event.target).closest('#location-search-results').length) {
        $("#location-search-results").slideUp();
        $("#location-search-text").text("");
    }
});

$("#amenities-sec").on("click", ".amenity-span", function () {
    $(this).toggleClass("active");

    var amenity = $.trim($(this).text());

    if ($(this).hasClass("active")) {
        amenities.push(amenity);
    }
    else {
        const index = amenities.indexOf(amenity);
        amenities.splice(index, 1);
    }
});