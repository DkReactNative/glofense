var Session = (function () {
  var getSession = function (key) {
    return JSON.parse(localStorage.getItem(key));
  };

  var setSession = function (key, data) {
    localStorage.setItem(key, JSON.stringify(data));
  };

  var clearSession = function (key) {
    return localStorage.clear();
  };

  var clearItem = function (key) {
    return localStorage.removeItem(key);
  };

  return {
    getSession: getSession,
    setSession: setSession,
    clearItem: clearItem,
    clearSession: clearSession,
  };
})();

export default Session;
