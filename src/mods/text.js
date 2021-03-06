idrinth.text = {
  /**
     * if the language files have been applied correctly, this is true
     * @type Boolean
     */
  initialized: false,
  /**
     * Loads language specific code and signals it's readyness by setting
     * idrinth.text.initialized to true
     * @returns {undefined}
     */
  start: function() {
    let language =
      idrinth.settings.get("lang") ||
      window.navigator.userLanguage ||
      window.navigator.language ||
      "en";
    idrinth.settings.change("lang", language);
    if (language === "en") {
      idrinth.text.initialized = true;
      return;
    }
    idrinth.core.ajax.runHome(
      "userscript-translation/" + language + "/###RELOAD-VERSION###/",
      function(file) {
        /**
             *
             * @param {object} to
             * @param {object} from
             * @param {function} func
             * @returns {undefined}
             */
        let applyRecursive = function(to, from, func) {
          for (var prop in from) {
            if (from.hasOwnProperty(prop)) {
              if (
                typeof to[prop] === "string" &&
                typeof from[prop] === "string"
              ) {
                to[prop] = from[prop];
              } else if (
                typeof to[prop] === "object" &&
                typeof from[prop] === "object"
              ) {
                func(to[prop], from[prop], func);
              }
            }
          }
        };
        try {
          applyRecursive(idrinth.text.data, JSON.parse(file), applyRecursive);
          idrinth.text.initialized = true;
        } catch (e) {
          idrinth.core.log(e.message ? e.message : e.getMessage());
          return idrinth.text.start();
        }
      },
      idrinth.text.start,
      idrinth.text.start,
      null,
      true
    );
  },
  // prettier-ignore
  /**
     * See languages/en.json for an example
     * @type {object}
     */
  data: JSON.parse('###LANG###'),
  /**
     * returns the translation of a provided key or an error-message if no
     * matching translation is found
     * @param {string} key
     * @returns {string}
     */
  get: function(key) {
    /**
         *
         * @param {object} obj
         * @param {Array} keys
         * @param {function} func
         * @returns {string}
         */
    let getSub = function(obj, keys, func) {
      let key = keys.shift();
      if (obj.hasOwnProperty(key)) {
        if (keys.length > 0) {
          return func(obj[key], keys, func);
        }
        return obj[key];
      }
      return idrinth.text.data.default;
    };
    return getSub(idrinth.text.data, key.split("."), getSub);
  }
};
