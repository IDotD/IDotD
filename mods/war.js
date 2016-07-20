idrinth.war = {
    from: null,
    to: null,
    element: null,
    getData: function () {
        var raids2Join= function () {
            var list = [ ];
            for (var input in idrinth.war.element.getElementsByTagName ( 'input' )) {
                if ( idrinth.war.element.getElementsByTagName ( 'input' )[input].checked ) {
                    list.push ( idrinth.war.element.getElementsByTagName ( 'input' )[input].getAttribute ( 'data-id' ) );
                }
            }
            if ( list.length > 0 ) {
                return list.join ( ',' );
            }
            return '_';
        };
        idrinth.runAjax (
                "https://dotd.idrinth.de/" + ( idrinth.settings.isWorldServer ? "world-" : "" ) + idrinth.platform + "/war-service/" + raids2Join () + "/" + Date.now () + "/",
                idrinth.war.updateData,
                function () {
                    window.setTimeout ( idrinth.war.getData, 1000 );
                },
                function () {
                    window.setTimeout ( idrinth.war.getData, 2000 );
                },
                idrinth.raids.knowRaids ()
                );
    },
    updateData: function ( data ) {
        var process=function ( data ) {
            var toggleGUI = function(onOff){
                var toggle = onOff || false;
                if(toggle === true){
                    idrinth.war.element.setAttribute ( 'style', '' );
                    var classes = idrinth.war.element.getAttribute ( 'class' );
                    idrinth.war.element.setAttribute ( 'class', idrinth.settings.warBottom ? classes + ' bottom' : classes.replace ( / bottom/g, '' ) );
                } else {
                    idrinth.war.element.setAttribute ( 'style', 'display:none' );
                    while ( idrinth.war.element.childNodes[1].childNodes[1].firstChild ) {
                        idrinth.war.element.childNodes[1].childNodes[1].removeChild ( idrinth.war.element.childNodes[1].firstChild.firstChild );
                    }
                }
            };
            var processJson = function ( data ) {
                var magicIgmSrv = 'https://dotd.idrinth.de/static/magic-image-service/';
                var getMagic = function (data) {
                    var magics = [],
                        tmp;
                    if (!data || (data.magics === null || data.magics === '')) {
                        return [];
                    }
                    tmp = data.magics.split(',');
                    for (var key = 0; key < tmp.length; key++) {
                        var magic = tmp[key];
                        var magicObj = {
                            type: 'img',
                            attributes: [
                                {name: 'src', value: magicIgmSrv + magic + '/'},
                                {name: 'width', value: '20'}]
                        };
                        magics.push(magicObj);
                    }
                    return magics;
                };
                function addRaids ( raids ) {
                    for (var key in raids) {
                        if ( idrinth.raids.joined[key] === undefined && idrinth.raids.list[key] === undefined ) {
                            idrinth.raids.list[key] = raids[key];
                        }
                    }
                }
                function updateBoss ( data, element ) {
                    //TODO: Dummy function, should be removed
                    function cleanUp() {
                        while (element.getElementsByTagName('td')[3].firstChild) {
                            element.getElementsByTagName('td')[3].removeChild(element.getElementsByTagName('td')[3].firstChild);
                        }
                    }

                    cleanUp();
                    var tmpMagics = getMagic(data);
                    for (var m = 0; m < tmpMagics.length; m++) {
                        element.getElementsByTagName('td')[3].appendChild(idrinth.ui.buildElement(tmpMagics[m]));
                    }
                    element.getElementsByTagName('td')[0].setAttribute("class", 'traffic ' + ( data.amount < 90 ? 'yes' : ( data.amount > 110 ? 'no' : 'maybe' ) ));
                    element.getElementsByTagName('td')[0].setAttribute("title", data.amount + '/100');
                    element.getElementsByTagName('td')[0].firstChild.innerHTML = ( data.amount < 90 ? 'yes' : ( data.amount > 110 ? 'no' : 'maybe' ) );
                }
                function newBoss ( data, boss ) {
                    idrinth.war.element.childNodes[1].appendChild ( idrinth.ui.buildElement (
                            {
                                type: 'tr',
                                id: 'idrinth-war-' + boss,
                                children: [
                                    {
                                        type: 'td',
                                        css: 'traffic ' + ( data.amount < 90 ? 'yes' : ( data.amount > 110 ? 'no' : 'maybe' ) ),
                                        children: [ { type: 'span', content: ( data.amount < 90 ? 'yes' : ( data.amount > 110 ? 'no' : 'maybe' ) ) } ],
                                        attributes: [
                                            { name: 'title', value: data.amount + '/100' }
                                        ]
                                    },
                                    {
                                        type: 'td',
                                        content: data.name
                                    },
                                    {
                                        type: 'td',
                                        children: [
                                            {
                                                type: 'input',
                                                attributes: [
                                                    { name: 'type', value: 'checkbox' },
                                                    { name: 'data-id', value: boss },
                                                    { name: 'title', value: 'join ' + data.name }
                                                ]
                                            }
                                        ]
                                    },
                                    {
                                        type: 'td',
                                        children: getMagic ( data )
                                    }
                                ]
                            }
                    ) );
                }
                if ( data.raids !== undefined ) {
                    addRaids ( data.raids );
                }
                for (var boss in data.stats) {
                    if ( document.getElementById ( 'idrinth-war-' + boss ) ) {
                        updateBoss ( data.stats[boss], document.getElementById ( 'idrinth-war-' + boss ) );
                    } else {
                        newBoss ( data.stats[boss], boss );
                    }
                }
            };
            if ( data === "" || data === "null" ) {
                return;
            }
            if ( data === "{}" ) {
                toggleGUI(false);
                return;
            }
            toggleGUI(true);
            try {
                processJson ( JSON.parse ( data ) );
            } catch ( e ) {
                idrinth.log ( e );
            }
        };
        process ( data );
        window.setTimeout ( idrinth.war.getData, 50000 + Math.random () % 20000 );
    },
    start: function () {
        window.setTimeout ( idrinth.war.getData, 5000 );
    }
};