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
    // Application Constructor
    initialize: function () {
        this.bindEvents();
        console.log("initialize: ");
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function () {
        document.addEventListener('deviceready', this.onDeviceReady, false);
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
        toast("Iniciando a..." + this.deviceName);

        console.log('Received Event: ' + id);
    }
};
