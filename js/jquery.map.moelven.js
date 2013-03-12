(function($){
    if(!$.fn){
        $.fn = new Object();
    };
    
    $.fn.MoelvenMap = function(el, options){
        var base = this;
        base.$el = $(el);
        base.el = el;
        base.ib = "";
        base.activeSubId = 0;
        base.activeMenuId = 0;
        base.markerArr = [];
        
        base.init = function(){
            base.options = $.extend({},
            	$.fn.MoelvenMap.defaultOptions, 
            	options
            );
            
            $(base.options.menu + " a").on("click", function(e) {
		        base.drawSubMenu($(this).data("nr"));
	      		$(base.options.menu).each(function() {
			        $(this).find(".right-btn").removeClass('btn-active');
			    });
	            $(this).find(".right-btn").addClass("btn-active");	
		    });

	     	//first run
	        base.drawSubMenu(0);
	        $(base.options.menu).find(".right-btn:first").addClass("btn-active");
        };
        
        base.log = function(str) {
        	if (base.options.log)
        		$(base.options.log).append("> "+str+"<br>");
        }

        base.drawSubMenu = function(id) {
	        if ($(base.options.sub).children().length > 0) {
	            $(base.options.sub).html('');
	        }
	        for (var i in base.options.mapdata[id].data) {
	            var ref = id+","+i;
	            var str = '<a href="#" data-ref="'+ref+'"><div class="btn-box">';
	                var len = base.options.mapdata[id].data[i].name.length;
	                if (len > 28 && len < 40 ) {
	                    str += '<span style="line-height: 28px;">'+base.options.mapdata[id].data[i].name+'</span>';
	                } else if (len > 40) {
	                    str += '<span style="line-height: 18px;">'+base.options.mapdata[id].data[i].name+'</span>';  
	                } else { 
	                    str += '<span style="line-height: 58px;">'+base.options.mapdata[id].data[i].name+'</span>';
	                }
	                
	                str += '</div></a>';
	            $(base.options.sub).append(str);
	        }
	        base.activateSubmenu();
	        base.showAll(id);
        }

        base.activateSubmenu = function() {
        	$(base.options.sub +" a").on("click", function(e) {
	            e.preventDefault(); 
	            base.log($(base.options.sub).children().length);
	      		$(base.options.sub+" div").each(function(){
			        $(this).removeClass('btn-box-active');
			    });
		        $(this).find('div').addClass("btn-box-active");
		        base.show($(this).data("ref"));
	        });
        }

        base.showAll = function(groupID) {
        	base.clearmarkers();
        	for (var i = 0; i < base.options.mapdata[groupID].data.length; i++) {
	            base.createMarker(groupID, i);
	        }
        }

        base.show = function(d) {
        	base.clearmarkers();
        	var arr = d.split(",");	
     		base.createMarker(arr[0], arr[1]);
        }
        
        base.clearmarkers = function() {
        	if (base.markerArr.length > 0) {
            	for (var i = 0; i < base.markerArr.length; i++) {
                	base.markerArr[i].setMap(null);
            	}
        	}
        	base.markerArr = [];
        }

        base.createMarker = function(groupID, item) {
        	if (base.markerArr.length > 0) {
        		
        	}
        	var dest = new google.maps.LatLng(base.options.mapdata[groupID].data[item].lat, base.options.mapdata[groupID].data[item].lng);
    		var image = {
	            url: base.options.imgurl+"/arrow_"+ base.options.mapdata[groupID].title.toLowerCase()+".png",
	            size: new google.maps.Size(32, 32),
	            orgin: new google.maps.Point(0,0),
	            anchor: new google.maps.Point(18, 32)
	        };
	        var marker = new google.maps.Marker({
				position: dest, 
				map: base.options.map, 
				title: base.options.mapdata[groupID].data[item].name,
				icon: image,
				zIndex: 0
	        });
	        base.markerArr.push(marker);
	        if (base.ib) base.ib.close();
	        base.createInfobox(base.options.mapdata[groupID].data[item].name, base.options.mapdata[groupID].data[item].address, base.options.mapdata[groupID].data[item].postalnr, marker);
	        base.options.map.setCenter(dest);
        }

        base.createInfobox = function(name, address, postalnr, marker) {
        	var info =  "<div class='infobox'><span style='font-weight: bold;'>"+name+"</span>";
	        info += "<br>"+address;
	        info += "<br>"+postalnr+"</div>";
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
	        
	        base.ib = new InfoBox();
	        //open info 
	        base.ib.setOptions(opt);
	        //base.ib.open(base.options.map, marker);
	        google.maps.event.addListener(marker, "click", function (e) {
	            base.ib.setOptions(opt);
	            base.ib.open(base.options.map, this);
	        });
        }
        base.init();
    };
    
    $.fn.MoelvenMap.defaultOptions = {
        version: 1,
        log: "",
        map: "",
        menu: "",
        mapdata: ""
    };
    
    $.fn.fn_MoelvenMap = function(options){
        return this.each(function(){
            (new $.fn.MoelvenMap(this, options));
        });
    };
    
})(jQuery);