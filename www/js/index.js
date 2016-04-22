/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var toast = function (msg) {
    $("<div class='ui-loader ui-overlay-shadow ui-body-e ui-corner-all'><h3>" + msg + "</h3></div>")
            .css({display: "block",
                opacity: 0.90,
                position: "fixed",
                padding: "7px",
                "text-align": "center",
                width: "270px",
                left: ($(window).width() - 284) / 2,
                top: $(window).height() / 2,
                "-webkit-box-shadow": "10px 10px 5px 0px rgba(102,102,102,0.65)",
                "-moz-box-shadow": "10px 10px 5px 0px rgba(102,102,102,0.65)",
                "-ms-box-shadow": "10px 10px 5px 0px rgba(102,102,102,0.65)",
                "box-shadow": "10px 10px 5px 0px rgba(102,102,102,0.65)",
            })

            .appendTo("body").delay(4000)
            .fadeOut(400, function () {
                $(this).remove();
            });
};


//***************************************





var app = {
    deviceName: "",
    hora:"",
    minu:"",
    // Application Constructor
    initialize: function () {
        this.bindEvents();
        setInterval('app.reloj()',1000);
        console.log("initialize: ");
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function () {
        document.addEventListener('deviceready', this.onDeviceReady, false);
        $(document).on('pageshow', '#main', this.onPageShow);
        refreshButton.ontouchstart = app.list;
        descButton.ontouchstart = app.disconnect;
        deviceList.ontouchstart = app.connect;
        setHora.ontouchstart=app.ponHora; 
        cerrar.onclick=app.cerrar;
        console.log("bindEvents:");
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicity call 'app.receivedEvent(...);'
    onDeviceReady: function () {
        app.receivedEvent('deviceready');
        console.log("onDeviceReady");
    },
    // Update DOM on a Received Event
    receivedEvent: function (id) {
        toast("Iniciando...");
        console.log('Received Event: ' + id);
    },
    onPageShow: function () {

        $("#divDesc").hide();
               
    },
    //***********parte bluetooth **********************
    list: function (event) {
        bluetoothSerial.list(app.ondevicelist, app.generateFailureFunction("List Failed"));
        console.log("debug:list");
    },
    ondevicelist: function (devices) {
        var deviceId;
        var innerHTML = "";

        // remove existing devices
        $("#deviceList").show();
        $('#deviceList').html("");


        devices.forEach(function (device) {

            if (device.hasOwnProperty("uuid")) { // TODO https://github.com/don/BluetoothSerial/issues/5
                deviceId = device.uuid;
            } else if (device.hasOwnProperty("address")) {
                deviceId = device.address;
            } else if (device.hasOwnProperty("name")) {
                deviceId = device.name;
            } else {
                deviceId = "ERROR " + JSON.stringify(device);
            }
            //<button id="descButton" data-theme='b'>Desconecta Nodos</button>
            
            innerHTML += "<button  deviceId=" + deviceId + " data-theme=b>" + device.name + "</button><br/>";

            console.log("debug:dispositivos: " + device.uuid + "," + device.address);
            console.log(innerHTML);

        });


        $('#deviceList').html(innerHTML);

        if (devices.length === 0) {

            if (cordova.platformId === "ios") { // BLE
                toast("No Bluetooth Peripherals Discovered.");

            } else { // Android
                toast("Empareja Dispositivo Bluetooth.");

            }

        } else {
            //app.setStatus("Found " + devices.length + " device" + (devices.length === 1 ? "." : "s."));
            toast("Encontrado " + devices.length + " dispositivo" + (devices.length === 1 ? "." : "s."));
        }

        console.log("debug:ondevicelist");
    },
    generateFailureFunction: function (message) {
        var func = function (reason) {
            var details = "";
            if (reason) {
                details += ": " + JSON.stringify(reason);
            }

            toast(message + details);
        };
        console.log("debug:generateFailureFunction");
        return func;
    },
    disconnect: function (event) {
        if (event) {
            event.preventDefault();
        }
        
        //app.setStatus("Desconectando...");
        bluetoothSerial.disconnect(app.ondisconnect);

    },
    ondisconnect: function () {
        $("#divDesc").hide('slow');
        $("#divConectar").show('slow');
        $("#deviceList").hide('slow');
        toast("Desconectado...");
        console.log("Desconectando");
        
    },
    connect: function (e) {

        this.deviceName = e.target.getAttribute('deviceId');

        toast("Conectando a..." + this.deviceName);
        console.log("Conectando a..." + this.deviceName);
        bluetoothSerial.connect(this.deviceName, app.onconnect, app.ondisconnect);
    },
    onconnect: function () {

        $("#divDesc").show('slow');
        $("#divConectar").hide('slow');
        $("#deviceList").hide('slow');

        //  toast("Conectado a..." + this.deviceName);
        
        console.log("Conectado a...");//+ this.deviceName);
    },
    enviaHora: function () {

        bluetoothSerial.write(hora+minu);
        console.log("Envia dato hora");

    },
    reloj:function () {
        var hora= new Date();
        app.hora=hora.getHours();
        app.minu=hora.getMinutes();
        app.minu = app.minu > 9 ? app.minu : '0' + app.minu;
        var strHora = hora.getHours()+'.'+app.minu;
       // console.log("reloj: "+strHora);
         $("#idHora").html(strHora);
      
    }
    ,
    ponHora:function () {
        
        if(app.deviceName === "")
            toast("No seleccionado ningun reloj");
        app.enviaHora();
        console.log("SetHor: "+app.deviceName);
    }
    ,
    cerrar:function () {
        console.log("Cerrar");
        navigator.app.exitApp();
    }



};//fin app
