var map;
var marker;
var ib;
var markerArr = [];
var infoArr = [];
var mapdata = [];
$(document).ready(function() {
    /*
    - create a menu with 4 rows on the left
    - create a container for the subsections
    - onClick change content
    */
    $mainmenu = $("#main-menu");
    var mapmenu = $("#map-menu");
    var submenu = $("#map-content");

    function getData(data, callback) {
        $.ajax({
            url: data,
            dataType: 'json',
            success: function(js) {
                callback(js);
            },
            error: function(j, e) {
                
            }
        });
    };

    getData("data.js", function(data) {
        mapdata = data;
        //set nr in menu
        var i = 0;
        $(".btn a").each(function() {
            $(this).attr('data-nr', i);
            i = i+1;
        })
        setup();
    });

    function setup() {
        viewSubMenu(0, function(res) {
           log(res);
        });
        $("#map-menu a").on("click", function(e) {
            e.preventDefault();
            openAll($(this).data("id"));
            viewSubMenu($(this).data("id"), function(res) {
                $("#map-content a").on("click", function(e) {
                    e.preventDefault();
                    goto($(this).data("ref"));
                })
            })
        });

        $("#map-content a").on("click", function(e) {
            e.preventDefault(); 
            goto($(this).data("ref"));
        });    
    }

    function viewSubMenu(id, callback) {
        log("children "+submenu.children().length);
        var count = 0;
        if (submenu.children().length > 0) {
            submenu.children().each(function() {
                $(this).animate({
                    opacity: 0
                }, 500+(count+1), function() {
                    count++;
                    if (count == submenu.children().length) {
                        submenu.html('');
                        drawSubMenu(id, callback);
                    }
                });
            })
        } else {
            drawSubMenu(id, callback);
        }
    }

    /* new Buttons */
    $(".btn a").on("click", function(e) {
        //$("#log").html("> "+$(this).data("nr"));
        drawSubMenu($(this).data("nr"));
    })


    //less
    function getColor(str, type) {
        var c = "";
        switch(str.toLowerCase()) {
            case "konsern":
                c = "konsern-blue";
                break;
            case "timber":
                c = "timber-green";
                break;
            case "wood":
                c = "wood-brown";    
                break;
            case "byggsystemer":
                c = "bygg-red";
                break;

        }
        if (type == "sub") c = c+"-light";
        if (type == "light") c = c+"-light-text";
        if (type == "color") c = c+"-text";
        return c;
    }

    function randomNumber(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function drawSubMenu(id, callback) {
        if (submenu.children().length > 0) {
            submenu.html('');
        }
        for (var i in mapdata[id].data) {
            var ref = id+","+i;
            var str = '<a href="#" data-ref="'+ref+'"><div class="btn-box sub">';
                //str += '<div style="line-height: 40px;">';
                var len = mapdata[id].data[i].name.length;
                if (len > 28 && len < 40 ) {
                    str += '<span style="line-height: 28px; background-color: #ccc">'+mapdata[id].data[i].name+'</span>';
                    log("> "+mapdata[id].data[i].name+": "+mapdata[id].data[i].name.length);
                } else if (len > 40) {
                    str += '<span style="line-height: 18px; background-color: #ededed">'+mapdata[id].data[i].name+'</span>';  
                } else { 
                    str += '<span style="line-height: 59px;">'+mapdata[id].data[i].name+'</span>';
                }
                
                str += '</div></a>';//</div>';
            submenu.append(str);
        }
        callback("drawing the submenu");
    }
    

    //open all 
    function openAll(id) {
        console.log("open all > "+mapdata[id].data.length);
        clearMarkers();
        var img = {
            url: "img/arrow_"+mapdata[id].title.toLowerCase()+".png",
            size: new google.maps.Size(18, 32),
            orgin: new google.maps.Point(0,0),
            anchor: new google.maps.Point(9, 32)
        }

        for (var i = 0; i < mapdata[id].data.length; i++) {
            var m = new google.maps.Marker({
                position: new google.maps.LatLng(mapdata[id].data[i].lat, mapdata[id].data[i].lng),
                map: map,
                title: mapdata[id].data[i].name,
                icon: img,
                zIndex: 0
            })
            markerArr.push(m);
        }
    }

    function clearMarkers() {
        if (markerArr.length > 0) {
            console.log("----> remove markers > "+markerArr.length);
            for (var i = 0; i < markerArr.length; i++) {
                markerArr[i].setMap(null);
            }
        }
    }
    
    function goto(d) {
        var arr = d.split(",");
        var dest = new google.maps.LatLng(mapdata[arr[0]].data[arr[1]].lat, mapdata[arr[0]].data[arr[1]].lng);
        map.setCenter(dest);
        var t = " > "+ mapdata[arr[0]].data[arr[1]].name;
        //18x32
        var image = {
            url: "img/arrow_"+mapdata[arr[0]].title.toLowerCase()+".png",
            size: new google.maps.Size(18, 32),
            orgin: new google.maps.Point(0,0),
            anchor: new google.maps.Point(9, 32)
        }
        var marker = new google.maps.Marker({
              position: dest, 
              map: map, 
              title: t,
              icon: image,
              zIndex: 0
        });

        //marker check
        if (markerArr.length > 0) {
            console.log("----> remove markers > "+markerArr.length);
        }
        
        markerArr.push(marker);

        //infobox
        var info =  "<div><span style='font-weight: bold;'>"+mapdata[arr[0]].data[arr[1]].name+"</span>";
        info += "<br>"+ mapdata[arr[0]].data[arr[1]].address;
        info += "<br>"+  mapdata[arr[0]].data[arr[1]].postalnr+"</div>";
        //var col = getColor(mapdata[arr[0]].name, "sub");
        var opt = {
            content: info,
            disableAutoPan: false,
            maxWidth: 0,
            pixelOffset: new google.maps.Size(-140, -100),
            zIndex: null,
            boxStyle: {
                padding: "5px",
                background: "#fff",
                opacity: 0.9,
                width: "280px"
            },
            closeBoxMargin: "2px 2px 2px 2px",
            closeBoxURL: "http://www.google.com/intl/en_us/mapfiles/close.gif",
            infoBoxClearance: new google.maps.Size(1, 1),
            isHidden: false,
            pane: "floatPane",
            enableEventPropagation: false
        }
        if (ib) ib.close();
        ib = new InfoBox();
        google.maps.event.addListener(marker, "click", function (e) {
            ib.setOptions(opt);
            ib.open(map, this);
        });
    }
    //create map
    initialize();
}); //end jquery

function initialize() {
    var styles = [
            {
                stylers: [
                    { saturation: -100},
                    { gamma: 2}
                ]
            },
            {
                featureType: 'all'
            }
        ];

    var styledMap = new google.maps.StyledMapType(styles, {name: "Grayscaled"});

    var mapOptions = {
        center: new google.maps.LatLng(59.91294, 10.75125),
        zoom: 6,
        disableDefaultUI: true,
        scrollwheel: false,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    map = new google.maps.Map(document.getElementById("map_canvas"),
        mapOptions);
    map.mapTypes.set("map_style", styledMap);
    map.setMapTypeId("map_style");
}

function log(str, type) {
    if (type) {
        $("#log").html("> "+str);
    } else {
        $("#log").append("> "+str+"<br>");
    }
}