var startstop = false;

function clearStatusClasses(){
    $('#streamstate').removeClass("btn-outline-success");
    $('#streamstate').removeClass("btn-outline-info");
    $('#streamstate').removeClass("btn-outline-danger");
    $('#streamstate').removeClass("btn-outline-warning");

}

function getStatus(){
    if(startstop == true){
        return;
    }
    $.get(ip + "/api/v1/getStreamService.lua?Stream=main", function(data){
        clearStatusClasses();

        let datum = data.Data.ServiceStatus.find(el => el.ID ==="Dynamic_services[0]");
        console.log(datum);

        //console.log(data.Data.ServiceStatus.indexOf());
        if(datum.Enable == 0){
            $('#streamstate').addClass("btn-outline-info");
            $('#streamstate').html("Ready to Stream");
        }
        else if(datum.Enable == 1){
            $('#streamstate').addClass("btn-outline-success");
            $('#streamstate').html("Streaming");
            $('#startbutton').prop('disabled', true);
            $('#stopbutton').prop('disabled', false);
        }
        else{
            $('#streamstate').addClass("btn-outline-danger");
            $('#streamstate').html("Error!");
        }
    });
}

var statusTimer =  setInterval(getStatus, 1500);

function startStream(){
    startstop = true;
    $('#startbutton').prop('disabled', true);
    $('#stopbutton').prop('disabled', true);
    clearStatusClasses();
    $('#streamstate').addClass("btn-outline-danger");
    $('#streamstate').html("Starting Stream");
    $.post(ip + "/api/v1/setStreamService.lua?Stream=main&ID=Dynamic_services[0]&Rtmp_push.enabled=1", function(data){
        //console.log(data);
        if(data.Result == "200"){
            $('#startbutton').prop('disabled', true);
            $('#stopbutton').prop('disabled', false);
        }
    });
    startstop = false;
}

function stopStream(){
    startstop = true;
    $('#startbutton').prop('disabled', true);
    $('#stopbutton').prop('disabled', true);
    clearStatusClasses();
    $('#streamstate').addClass("btn-outline-danger");
    $('#streamstate').html("Stopping Stream");
    $.post(ip + "/api/v1/setStreamService.lua?Stream=main&ID=Dynamic_services[0]&Rtmp_push.enabled=0", function(data){
        if(data.Result =="200"){
            $('#startbutton').prop('disabled', false);
            $('#stopbutton').prop('disabled', true);
        }
    });
    startstop = false;
}

function getPreview(){
    d = new Date();
    $("#preview").attr("src", ip + "/actions/snap.lua?time="+d.getTime());
}

getPreview();
var previewTimer =  setInterval(getPreview, 15000);