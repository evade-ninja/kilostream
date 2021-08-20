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
        //console.log(datum);

        //console.log(data.Data.ServiceStatus.indexOf());
        if(datum.Enable == 0){
            $('#startbutton').prop('disabled', false);
            $('#stopbutton').prop('disabled', false);
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
    })
        .fail(function(){
            clearStatusClasses();
            $('#streamstate').addClass("btn-outline-danger");
            $('#streamstate').html("Error!");
        });

    $.get(ip + "/api/v1/setOSDEnable.lua?Stream=main", function(data){
        //console.log(data);
        if(data.Data.Enable == 0){
            $("#sacrament").hide();
            $("#preview").show();
            //console.log("not sacrament!");
        }
        if(data.Data.Enable == 1){
            $("#sacrament").show();
            $("#preview").hide();
            //console.log("sacrament!");
        }
        
    });

    $.get(ip + "/api/v1/getAudioSource.lua", function(data){
        //console.log(data);
        if(data.Data.CurrentSource == "LINE"){
            $("#muted").hide();
            //console.log("not mute!");
        }
        if(data.Data.CurrentSource == "DIGITAL"){
            $("#muted").show();
            //console.log("mute!");
        }
        
    });


}

var statusTimer =  setInterval(getStatus, 3000);

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

function sacramentTime(){
    $.post(ip + "/api/v1/setOSDEnable.lua?Stream=main&Enable=1", function(data){
        if(data.Result == "200"){
            $("#sacrament").show();
            $("#preview").hide();
        }
    });
    $.post(ip + "/api/v1/selectAudioSource.lua?Source=HDMI", function(data){
        if(data.Result == "200"){
            $("#muted").show();
        }
    });

}

function speakerTime(){
    $.post(ip + "/api/v1/setOSDEnable.lua?Stream=main&Enable=0", function(data){
        if(data.Result == "200"){
            $("#sacrament").hide();
            $("#preview").show();
        }
    });
    $.post(ip + "/api/v1/selectAudioSource.lua?Source=LINE", function(data){
        if(data.Result == "200"){
            $("#muted").hide();
        }
    });
}

function PTZ(pos){
    $post(ip + "/api/v1/ptzControl.lua?Action=load-preset&Id=" + pos, function(data){

    });
}


getStatus();
getPreview();
var previewTimer =  setInterval(getPreview, 15000);