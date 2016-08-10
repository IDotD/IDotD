idrinth.settings = {
    raids: false,
    favs: '',
    factor: true,
    moveLeft: false,
    minimalist: false,
    chatHiddenOnStart: true,
    names: true,
    timeout: 5000,
    loadtime: 5000,
    windows: 3,
    warBottom: false,
    landMax: true,
    chatting: true,
    chatuser: '',
    newgroundLoad: 30,
    chatpass: '',
    isWorldServer: false,
    alarmTime: '8:0',
    alarmActive: false,
    land: {
        cornfield: 0,
        stable: 0,
        barn: 0,
        store: 0,
        pub: 0,
        inn: 0,
        tower: 0,
        fort: 0,
        castle: 0,
        gold: 0
    },
    settingsAction: function ( action ) {
        var innerObj,
                innerVal,
                outerVal,
                handleItem,
                saveItem,
                processInner,
                settings = idrinth.settings,
                prefix = 'idrinth-dotd-',
                actions = {
                    'save': 'save',
                    'start': 'start'
                };

        if ( !window.localStorage && !actions.hasOwnProperty ( action ) ) {
            return;
        }

        handleItem = function ( action, name, item ) {
            var tmp;
            if ( action === 'save' ) {
                window.localStorage.setItem ( name, item );
            } else if ( action === 'start' ) {
                tmp = window.localStorage.getItem ( name );
                if ( tmp && tmp !== undefined && tmp !== null && tmp.indexOf(":") === -1 ) {
                    tmp = JSON.parse ( tmp );
                }
            }
            return tmp;
        };

        saveItem = function ( key, key2, val ) {
            if ( !val && key ) {
                return;
            }
            if ( key2 ) {
                idrinth.settings[ key ][ key2 ] = val;
            } else {
                idrinth.settings[ key ] = val;
            }
        };

        processInner = function ( action, name, innerObj ){
            for ( var key2 in innerObj ) {
                if ( innerObj.hasOwnProperty ( key2 ) ) {
                    innerVal = handleItem ( action, name + "-" + key2, innerObj[ key2 ] );
                    saveItem ( key, key2, innerVal );
                }
            }
        };

        for ( var key in settings ) {
            if ( settings.hasOwnProperty ( key ) && typeof settings[ key ] !== 'function' ) {
                var setting = settings[ key ],
                        prefixAndName = prefix + key;
                if ( typeof setting === 'object' ) {
                    innerObj = setting;
                    processInner( action, prefixAndName, innerObj );
                } else {
                    outerVal = handleItem ( action, prefixAndName, setting );
                    saveItem ( key, null, outerVal );
                }
            }
        }
    },
    save: function ( ) {
        'use strict';
        this.settingsAction ( 'save' );
    },
    change: function ( field, value ) {
        'use strict';
        idrinth.settings[field] = value;
        idrinth.settings.save ( );
    },
    start: function ( ) {
        'use strict';
        this.settingsAction( 'start' );
    }
};