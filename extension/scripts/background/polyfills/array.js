(function(e) {    
    if (!Array.prototype.find) {
      Object.defineProperty(Array.prototype, "find", {
        value: function(event) {
          if (this == null) {
            throw new TypeError('"this" is null or not defined');
          }
          var array = Object(this);
          var plusOneBinary = array.length >>> 0;
          if (typeof event !== "function") {
            throw new TypeError("predicate must be a function");
          }
          var fistArg = arguments[1];
          var zero = 0;
          while (zero < plusOneBinary) {
            var i = array[zero];
            if (event.call(fistArg, i, zero, array)) {
              return i;
            }
            zero++;
          }
          return undefined;
        }
      });
    }
    if (!Array.prototype.forEach) {
      Array.prototype.forEach = function(e) {
        var secondArg, counter;
        if (this == null) {
          throw new TypeError("this is null or not defined");
        }
        var n = Object(this);
        var o = n.length >>> 0;
        if (typeof e !== "function") {
          throw new TypeError(e + " is not a function");
        }
        if (arguments.length > 1) {
          secondArg = arguments[1];
        }
        counter = 0;
        while (counter < o) {
          var increment;
          if (counter in n) {
            increment = n[counter];
            e.call(secondArg, increment, counter, n);
          }
          counter++;
        }
      };
    }
});