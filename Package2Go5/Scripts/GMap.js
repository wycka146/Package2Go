﻿jQuery(document).ready(function ($) {
    var oTable;

    Initialize();

    sort();

    $('#waypoints').disableSelection();

    //Fill values
    $('#from').focusout(function () {
        $(this).attr("value", $(this).val());
        calcRoute();
    });

    $('#waypoints').on('focusout', '.waypoint', function (e) {
        $(this).attr("value", $(this).val());
        calcRoute();
    });

    //WayPoints();

    if ($('#Items').length != 0)
        Datatable();

    $("form").submit(function (e) {
        e.preventDefault();
        $('fieldset input[name=Items]').each(function (index) {
            $(this).attr("name", "Items[" + index + "].id");
        });

        $('#waypoints li').each(function () {
            var input = $(this).children('input');
            if (typeof input.attr('id') != "undefined" && input.attr('id') != "from") {
                input.val(input.attr('id').split('_')[0] + ":" + input.val());
            }
            else
                input.val(0 + ":" + input.val());
        });
        this.submit();
    });

    //Calculate travel price
    $('#oilPrice').focusout(function () {
        if ($('#oilperKm').val() != "") {
            var cost = $(this).val() * $('#oilperKm').val() * $('#distance').text() / 100;
            $('#totalCost').text("Estimated price: " + Math.ceil(cost) + " " + $('#currency').val());
            $('#travelCost').text("Travel Cost: " + (Math.ceil(cost)-parseInt($('#payments').text()))+" "+$('#currency').val());
        }
    });
    $('#oilperKm').focusout(function () {
        if ($('#oilPrice').val() != "") {
            var cost = $(this).val() * $('#oilPrice').val() * $('#distance').text() / 100;
            $('#totalCost').text("Estimated price: " + Math.ceil(cost) + " " + $('#currency').val());
            $('#travelCost').text("Travel Cost: " + (Math.ceil(cost) - parseInt($('#payments').text())) + " " + $('#currency').val());
        }
    });

});

function sort() {

    $.fn.isAfter = function (sel) {
        return this.prevAll(sel).length !== 0;
    }
    $.fn.isBefore = function (sel) {
        return this.nextAll(sel).length !== 0;
    }

    $('#waypoints').sortable({
        items: "li:not(:first)",
        update: function (event, ui) {
            var id = ui.item.find('input').attr("id");
            var start = 0;
            var end = 0;

            if (typeof id !== "undefined" && id != 0) {
                if (id.split('_').length == 1) {
                    end = $(document.getElementById(id).parentElement).index();
                    id += "_1";
                    start = $(document.getElementById(id).parentElement).index();
                } else {
                    start = $(document.getElementById(id).parentElement).index();
                    end = $(document.getElementById(id.split('_')[0]).parentElement).index();
                }

                if (typeof id !== "undefined" && id != 0
                    && start > end) {
                    alert("Item start point should be first!");
                    event.preventDefault();
                } else {
                    calcRoute();
                }
            } else {
                calcRoute();
            }
        }
    });
}

function reSort()
{
    $('#waypoints').sortable('destroy');
    $('#waypoints').unbind();
    sort();
}

function calculatePaymentsForService()
{
    var currencies = {};
    var paymentsForService = 0;
    var rows = $("#Items").dataTable().fnGetNodes();
    for (var i = 0; i < rows.length; i++) {
        if ($(rows[i]).find("td:eq(8)").children().html() == "Remove") {
            if (currencies[$(rows[i]).find("td:eq(6)").text()] == null) {
                currencies[$(rows[i]).find("td:eq(6)").text()] = parseInt($(rows[i]).find("td:eq(5)").text());
            }
            else {
                currencies[$(rows[i]).find("td:eq(6)").text()] += parseInt($(rows[i]).find("td:eq(5)").text());
            }
            paymentsForService += parseInt($(rows[i]).find("td:eq(7)").text());
        }
    }
    $('#paymentsforservice').html("Total Payments For Services: <span id='payments'>" + paymentsForService + " " + $('#currency').val() + "</span>");

    //Payments For Service By Curencies
    $('#paymentsByCurrencies').html("");
    for (var key in currencies) {
        if (currencies.hasOwnProperty(key)) {
            $('#paymentsByCurrencies').append("<li>" + key + ": " + currencies[key] + "</li>");
        }
    }
}

function Datatable()
{
    oTable = $('#Items').dataTable({
        "aaSorting": [[4, "desc"]],
        "sDom": '<"top"l>rt<"bottom"ip>',
        "iDisplayLength": 5,
        "oLanguage": {
            "sLengthMenu": 'Display <select>' +
              '<option value="5">5</option>' +
              '<option value="10">10</option>' +
              '<option value="20">20</option>' +
              '<option value="-1">All</option>' +
              '</select> records'
        },
        "aoColumns": [null, null, null, null, null, null, null, null, null]
    });

    //Offer filter
    var sPageURL = window.location.search.substring(1);
    var sURLVariables = sPageURL.split('&');

    if (sURLVariables != "") {
        oTable.fnFilter("^\\s*" + sURLVariables[0].split('=')[1] + "\\s*$", 0, true);
        $('#over_map').show();
        $('#showItems').text("Hide Items");
    }

    $('#action').change(function () {
        oTable.fnFilter($(this).val());
    });

    //filter
    $("tfoot input:not([id])").keyup(function () {
        oTable.fnFilter(this.value, $(this).attr("name"));
    });

    //User Price
    MinMax('userPriceMin', 'userPriceMax', 7, oTable);

    //Price
    MinMax('min', 'max', 5, oTable);

    //Add Remove Items Address
    $("tbody").on("click", "#Add", function (e) {
        e.preventDefault();
        AddItemToRoute(this);
        //if ($(this).attr("title") != "") {
        //    generateWaypoints($(this).attr("title") + ":" + $(this).parent().parent().children(':nth-child(3)').html());
        //    generateWaypoints($(this).attr("title") + ":" + $(this).parent().parent().children(':nth-child(4)').html());
            
        //    $(this).attr("id", "Remove");
        //    $(this).text("Remove");
        //    RedrawTable();
        //    calcRoute();
        //}
    });

    $("tbody").on("click", "#Remove", function (e) {
        e.preventDefault();
        //Should be at least one waypointa
        RemoveItemFromRoute(this);
    });
}

function AddItemToRoute(item)
{
    if ($(item).attr("title") != "") {
        var id = $(item).attr("title");
        generateWaypoints(id + ":" + $(item).parent().parent().children(':nth-child(3)').html(), true);
        generateWaypoints(id + ":" + $(item).parent().parent().children(':nth-child(4)').html(), false);

        $(item).attr("id", "Remove");
        $(item).text("Remove");
        RedrawTable();
        calcRoute();
    }
}

function RemoveItemFromRoute(item)
{
    var id = $(item).attr("title");
    if ((id != 0 && $('#waypoints li').size() > 3) || (id == 0 && $('#waypoints li').size() > 2)){

        if ($(item).prev().attr("id") != 0) {
            $('input[name=Items][value=' + id + ']').remove();
        }

        $('#itemList').find('a[title=item' + id + ']').remove();

        $('#' + id).parent().remove();

        if (id.split('_').length > 1)
            $('#' + id.split('_')[0]).parent().remove();
        else
            $('#' + id + '_1').parent().remove();

        $('#' + id).parent().remove();

        if (typeof input != "undefined")
        {
            input = $('.infoWindow').find('input');
            input.val("Add");
            input.attr("onclick", "AddItem" + input.attr("onclick").substring(input.attr("onclick").indexOf("("), input.attr("onclick").length));
        }

        $(item).attr("id", "Add");
        $(item).text("Add");
        RedrawTable();
        calcRoute();
    }else
        alert("Should be at least one end point.");
}

function MinMax(class1, class2, index, oTable)
{
    $.fn.dataTableExt.afnFiltering.push(
        function (oSettings, aData, iDataIndex) {
            var iMin = document.getElementById(class1).value * 1;
            var iMax = document.getElementById(class2).value * 1;
            var iVersion = aData[index] == "-" ? 0 : aData[index] * 1;
            if (iMin == "" && iMax == "") {
                return true;
            }
            else if (iMin == "" && iVersion <= iMax) {
                return true;
            }
            else if (iMin <= iVersion && "" == iMax) {
                return true;
            }
            else if (iMin <= iVersion && iVersion <= iMax) {
                return true;
            }
            return false;
        }
    );

    $('#'+class1).keyup(function () { oTable.fnDraw(); });
    $('#'+class2).keyup(function () { oTable.fnDraw(); });
}

function RedrawTable() {
    if ($('#Items').length != 0) {
        $('#Items').dataTable().fnDestroy();
        oTable = $('#Items').dataTable({
            "aaSorting": [[4, "desc"]],
            "sDom": '<"top"l>rt<"bottom"ip>',
            "iDisplayLength": 5,
            "oLanguage": {
                "sLengthMenu": 'Display <select>'+
                  '<option value="5">5</option>'+
                  '<option value="10">10</option>'+
                  '<option value="20">20</option>'+
                  '<option value="-1">All</option>'+
                  '</select> records'
            },
            "aoColumns": [null, null, null, null, null, null, null, null, null]
        });
    }
}

function WayPoints() {

    var addresses = $('input[name=waypoints]').val();
    if (typeof addresses != "undefined") {

        var array = addresses.split(';');

        if ($('input[name=from]').val().split(':')[0] != 0)
            $('input[name=from]').attr("id", $('input[name=from]').val().split(':')[0]);
        $('input[name=from]').val($('input[name=from]').val().split(':')[1]);

        var addedItems = new Array();

        //var first = true;
        for (var i = 0; i < array.length; i++) {
            var id = array[i].split(':')[0];

            if (id != 0 && $.inArray(id, addedItems) == -1) {
                generateWaypoints(array[i], true);
                addedItems.push(id);
                RedrawTable();
            } else {
                generateWaypoints(array[i], false);
            }
        }

        calcRoute();
        $('input[name=waypoints]').val("");
    }

    $('#addWaypoint').click(function (e) {
        generateWaypoints();

        e.preventDefault();
    });

    $('#waypoints').on('click', '.remWaypoint', function (e) {
        var id = $(this).prev().attr("id");

        if ((id != 0 && $('#waypoints li').size() > 3) || (id == 0 && $('#waypoints li').size() > 2)){

            if (typeof input != "undefined") {
                input = $('.infoWindow').find('input');
                input.val("Add");
                if (typeof input.attr("onclick") != "undefined")
                    input.attr("onclick", "AddItem" + input.attr("onclick").substring(input.attr("onclick").indexOf("("), input.attr("onclick").length));
            }

            if (id != 0) {
                $('input[name=Items][value=' + id + ']').remove();
                $('input[name=Items][value=' + id + ']').remove();
                
                $('a[title='+ id +']').text("Add");
                $('a[title=' + id + ']').attr("id", "Add");
            }

            $(this).parents('li').remove();
            if (id != 0) {
                if (id.split("_").length > 1)
                    $('#' + id.split("_")[0]).parent('li').remove();
                else
                    $('#' + id+'_1').parent('li').remove();
            }

            $('#itemList').find('a[title=item' + id + ']').remove();

            RedrawTable();
            calcRoute();
        }
        else
            alert("Should be at least one end point.");
    });
}

function generateWaypoints(value, start)
{
    var last = $('#waypoints li').last();
    var newLast = $(last).clone();

    if(typeof value === "undefined")
        newLast.find('input').attr("id", "0");
    newLast.find('.dragImage').text("");

    if (newLast.find('input').hasClass("start")) {
        newLast.find('input').removeClass("start");
        newLast.find('.dragImage').text("");
    }

    var name = "waypoint_" + (last.index() + 1);
    var array;

    if (newLast.find('input').attr('id') == "from") {
        newLast.find('span').remove();
        newLast.find('input').addClass("waypoint");
    }

    $(newLast).find('input').attr("name", name);

    if (typeof value != "undefined") {
        array = value.split(':');
        if (array[0] != 0) {
            $(newLast).find('input').attr("id", array[0]);
            $(newLast).find('.dragImage').html("<span>" + array[0] + "</span>")
            

            //Change buttons in ItemsList
            $('a[title=' + array[0] + ']').text("Remove");
            $('a[title='+ array[0] +']').attr("id", "Remove");
        }
        $(newLast).find('input').val(array[1]);

        if (id == array[0]) {
            $(newLast).find('input').attr("value", "");
        }
        else {
            $(newLast).find('input').attr("value", value);
            $(newLast).find('input').attr("id", array[0]);
        }
        if (start == true) {
            $(newLast).find('input').addClass("start");
            $(newLast).find('input').attr("id", array[0]+"_1");
            addedItems.push(array[0]);
            $('fieldset').append('<input type=hidden name=Items value="' + array[0] + '"/>');
            $('#itemList').append("<a title='item" + array[0] + "' href='/Items/Details/" + array[0] + "'> | " + Items[array[0]].title + "</a>");
        }
    }
    else
        $(newLast).find('input').val("");

    if (last.index() == 0)
        newLast.append('<a class="remWaypoint"><img src="/Images/erase.png" alt="erase"/></a>');

    $('#waypoints').append(newLast);

    new google.maps.places.Autocomplete(document.getElementsByName(name)[0]);
    
    //Bugina
    //reSort();
}

//Google Maps
var directionsDisplay;
var directionsService = new google.maps.DirectionsService();
var map;
var geocoder = new google.maps.Geocoder();
var RouteWaypoints;

function Initialize() {
    
    google.maps.visualRefresh = true;

    directionsDisplay = new google.maps.DirectionsRenderer();

    var Lithuania = new google.maps.LatLng(55.00, 25.15);

    var mapOptions = {
        zoom: 8,
        center: Lithuania,
        mapTypeId: google.maps.MapTypeId.G_NORMAL_MAP
    };
    
    map = new google.maps.Map(document.getElementById("map_canvas"), mapOptions);

    $('#waypoints > li').each(function () {
        new google.maps.places.Autocomplete(
            document.getElementsByName(
                $(this).children('input').attr('name'))[0]);
    });

    directionsDisplay.setMap(map);
}

function calcRoute() {

    var start = $('#from').val();

    var waypts = [];

    var array = [];
    $(".waypoint").each(function () {
        array.push($(this).val());
    });

    if(array.length > 1)
    {
        for (var i = 0; i < array.length - 1; i++) {
            waypts.push({
                location: array[i],
                stopover: true
            });
        }
    }

    var optimized = false;

    if ($('input[name=optimized]').is(':checked'))
    {
        optimized = true;
    }
    var request = {
        origin: start,
        destination: array[array.length - 1],
        waypoints: waypts,
        optimizeWaypoints: optimized,
        travelMode: google.maps.TravelMode.DRIVING
    };
    directionsService.route(request, function (response, status) {
        if (status == google.maps.DirectionsStatus.OK) {
            directionsDisplay.setDirections(response);
            var route = response.routes[0];

            var totalDistance = 0;
            var totalDuraction = 0;
            var summaryPanel = document.getElementById('directions_panel');
            summaryPanel.innerHTML = '';

            // For each route, display summary information.
            var ind = 0

            $('#waypoints li').each(function () {
                if (ind == 0) {
                    $(this).find('input').val(route.legs[ind].start_address);
                }
                else {
                    $(this).find('input').val(route.legs[ind - 1].end_address);
                }
                ind++;
            });

            for (var i = 0; i < route.legs.length; i++) {

                var routeSegment = i + 1 + ", " + route.legs[i].distance.text + ", " + route.legs[i].duration.text;
                summaryPanel.innerHTML += '<b>Route Segment: ' + routeSegment + '</b><p style="margin-left:20px;">'
                + route.legs[i].start_address + '<br><img style="margin-left:20px;" src="/Images/arrow-down.png" alt=""/><br>'
                + route.legs[i].end_address + '</p>';
                totalDistance += route.legs[i].distance.value;
                totalDuraction += route.legs[i].duration.value;
            }

            maxDistance = totalDistance/1000;

            $('#totalDirection_panel').html('<h5>Payments By Currencies</h5><ul id="paymentsByCurrencies"></ul>');
            document.getElementById('totalDirection_panel').innerHTML += "<span>Total distance: </span><span id='distance'>" + Math.round(totalDistance / 1000) + '</span> KM<br><br>'
            + "<span>Total duration: </span>" + Math.floor(totalDuraction / 60 / 60) % 60 + ' hours ' + Math.round(totalDuraction / 60) % 60 + ' mins<br><br>';
            
            if ($('#Items').length != 0)
                calculatePaymentsForService();

            if ($('#oilperKm').val() != "" && $('#oilPrice').val() != "") {
                var cost = $('#oilPrice').val() * $('#oilperKm').val() * Math.round(totalDistance / 1000) / 100;
                $('#totalCost').text("Estimated price: " + Math.ceil(cost) + " " + $('#currency').val());
                $('#travelCost').text("Travel Cost: " + (Math.ceil(cost) - parseInt($('#payments').text())) + " " + $('#currency').val());
            }

            RouteWaypoints = new Array();
            maxDistance = $('#ItemRange').val();
            var iteration = route.overview_path.length / (Math.round(route.legs[0].distance.value / 1000 / maxDistance) + 1);
            var length = route.overview_path.length;
            for (var i = 0; i < length; i += iteration) {
                console.log(route.overview_path[Math.round(i)]);
                RouteWaypoints.push(route.overview_path[Math.round(i)]);
            }
            markItems();
        }
    });


}