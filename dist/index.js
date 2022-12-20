(() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
    isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
    mod
  ));

  // node_modules/blissfuljs/bliss.js
  var require_bliss = __commonJS({
    "node_modules/blissfuljs/bliss.js"() {
      (function() {
        "use strict";
        function overload(callback, start, end) {
          start = start === void 0 ? 1 : start;
          end = end || start + 1;
          if (end - start <= 1) {
            return function() {
              if (arguments.length <= start || $2.type(arguments[start]) === "string") {
                return callback.apply(this, arguments);
              }
              var obj = arguments[start];
              var ret;
              for (var key in obj) {
                var args = Array.prototype.slice.call(arguments);
                args.splice(start, 1, key, obj[key]);
                ret = callback.apply(this, args);
              }
              return ret;
            };
          }
          return overload(overload(callback, start + 1, end), start, end - 1);
        }
        function extend(to, from, whitelist) {
          var whitelistType = type(whitelist);
          if (whitelistType === "string") {
            var descriptor = Object.getOwnPropertyDescriptor(from, whitelist);
            if (descriptor && (!descriptor.writable || !descriptor.configurable || !descriptor.enumerable || descriptor.get || descriptor.set)) {
              delete to[whitelist];
              Object.defineProperty(to, whitelist, descriptor);
            } else {
              to[whitelist] = from[whitelist];
            }
          } else if (whitelistType === "array") {
            whitelist.forEach(function(property2) {
              if (property2 in from) {
                extend(to, from, property2);
              }
            });
          } else {
            for (var property in from) {
              if (whitelist) {
                if (whitelistType === "regexp" && !whitelist.test(property) || whitelistType === "function" && !whitelist.call(from, property)) {
                  continue;
                }
              }
              extend(to, from, property);
            }
          }
          return to;
        }
        function type(obj) {
          if (obj === null) {
            return "null";
          }
          if (obj === void 0) {
            return "undefined";
          }
          var ret = (Object.prototype.toString.call(obj).match(/^\[object\s+(.*?)\]$/)[1] || "").toLowerCase();
          if (ret == "number" && isNaN(obj)) {
            return "nan";
          }
          return ret;
        }
        var $2 = self.Bliss = extend(function(expr, context) {
          if (arguments.length == 2 && !context || !expr) {
            return null;
          }
          return $2.type(expr) === "string" ? (context || document).querySelector(expr) : expr || null;
        }, self.Bliss);
        extend($2, {
          extend,
          overload,
          type,
          property: $2.property || "_",
          listeners: self.WeakMap ? /* @__PURE__ */ new WeakMap() : /* @__PURE__ */ new Map(),
          original: {
            addEventListener: (self.EventTarget || Node).prototype.addEventListener,
            removeEventListener: (self.EventTarget || Node).prototype.removeEventListener
          },
          sources: {},
          noop: function() {
          },
          $: function(expr, context) {
            if (expr instanceof Node || expr instanceof Window) {
              return [expr];
            }
            if (arguments.length == 2 && !context) {
              return [];
            }
            return Array.prototype.slice.call(typeof expr == "string" ? (context || document).querySelectorAll(expr) : expr || []);
          },
          defined: function() {
            for (var i = 0; i < arguments.length; i++) {
              if (arguments[i] !== void 0) {
                return arguments[i];
              }
            }
          },
          create: function(tag, o) {
            if (tag instanceof Node) {
              return $2.set(tag, o);
            }
            if (arguments.length === 1) {
              if ($2.type(tag) === "string") {
                o = {};
              } else {
                o = tag;
                tag = o.tag;
                o = $2.extend({}, o, function(property) {
                  return property !== "tag";
                });
              }
            }
            return $2.set(document.createElement(tag || "div"), o);
          },
          each: function(obj, callback, ret) {
            ret = ret || {};
            for (var property in obj) {
              ret[property] = callback.call(obj, property, obj[property]);
            }
            return ret;
          },
          ready: function(context, callback, isVoid) {
            if (typeof context === "function" && !callback) {
              callback = context;
              context = void 0;
            }
            context = context || document;
            if (callback) {
              if (context.readyState !== "loading") {
                callback();
              } else {
                $2.once(context, "DOMContentLoaded", function() {
                  callback();
                });
              }
            }
            if (!isVoid) {
              return new Promise(function(resolve) {
                $2.ready(context, resolve, true);
              });
            }
          },
          Class: function(o) {
            var special = ["constructor", "extends", "abstract", "static"].concat(Object.keys($2.classProps));
            var init = o.hasOwnProperty("constructor") ? o.constructor : $2.noop;
            var Class;
            if (arguments.length == 2) {
              Class = arguments[0];
              o = arguments[1];
            } else {
              Class = function() {
                if (this.constructor.__abstract && this.constructor === Class) {
                  throw new Error("Abstract classes cannot be directly instantiated.");
                }
                Class.super && Class.super.apply(this, arguments);
                init.apply(this, arguments);
              };
              Class.super = o.extends || null;
              Class.prototype = $2.extend(Object.create(Class.super ? Class.super.prototype : Object), {
                constructor: Class
              });
              Class.prototype.super = Class.super ? Class.super.prototype : null;
              Class.__abstract = !!o.abstract;
            }
            var specialFilter = function(property2) {
              return this.hasOwnProperty(property2) && special.indexOf(property2) === -1;
            };
            if (o.static) {
              $2.extend(Class, o.static, specialFilter);
              for (var property in $2.classProps) {
                if (property in o.static) {
                  $2.classProps[property](Class, o.static[property]);
                }
              }
            }
            $2.extend(Class.prototype, o, specialFilter);
            for (var property in $2.classProps) {
              if (property in o) {
                $2.classProps[property](Class.prototype, o[property]);
              }
            }
            return Class;
          },
          classProps: {
            lazy: overload(function(obj, property, getter) {
              Object.defineProperty(obj, property, {
                get: function() {
                  var value = getter.call(this);
                  Object.defineProperty(this, property, {
                    value,
                    configurable: true,
                    enumerable: true,
                    writable: true
                  });
                  return value;
                },
                set: function(value) {
                  Object.defineProperty(this, property, {
                    value,
                    configurable: true,
                    enumerable: true,
                    writable: true
                  });
                },
                configurable: true,
                enumerable: true
              });
              return obj;
            }),
            live: overload(function(obj, property, descriptor) {
              if ($2.type(descriptor) === "function") {
                descriptor = { set: descriptor };
              }
              Object.defineProperty(obj, property, {
                get: function() {
                  var value = this["_" + property];
                  var ret = descriptor.get && descriptor.get.call(this, value);
                  return ret !== void 0 ? ret : value;
                },
                set: function(v) {
                  var value = this["_" + property];
                  var ret = descriptor.set && descriptor.set.call(this, v, value);
                  this["_" + property] = ret !== void 0 ? ret : v;
                },
                configurable: descriptor.configurable,
                enumerable: descriptor.enumerable
              });
              return obj;
            })
          },
          include: function() {
            var url = arguments[arguments.length - 1];
            var loaded = arguments.length === 2 ? arguments[0] : false;
            var script = document.createElement("script");
            return loaded ? Promise.resolve() : new Promise(function(resolve, reject) {
              $2.set(script, {
                async: true,
                onload: function() {
                  resolve(script);
                  script.parentNode && script.parentNode.removeChild(script);
                },
                onerror: function() {
                  reject(script);
                },
                src: url,
                inside: document.head
              });
            });
          },
          load: function load(url, base) {
            base = base ? new URL(base, location.href) : location.href;
            url = new URL(url, base);
            var loading = load.loading = load.loading || {};
            if (loading[url + ""]) {
              return loading[url + ""];
            }
            if (/\.css$/.test(url.pathname)) {
              return loading[url + ""] = new Promise(function(resolve, reject) {
                var link = $2.create("link", {
                  "href": url,
                  "rel": "stylesheet",
                  "inside": document.head,
                  onload: function() {
                    resolve(link);
                  },
                  onerror: function() {
                    reject(link);
                  }
                });
              });
            }
            return loading[url + ""] = $2.include(url);
          },
          fetch: function(url, o) {
            if (!url) {
              throw new TypeError("URL parameter is mandatory and cannot be " + url);
            }
            var env = extend({
              url: new URL(url, location),
              data: "",
              method: "GET",
              headers: {},
              xhr: new XMLHttpRequest()
            }, o);
            env.method = env.method.toUpperCase();
            $2.hooks.run("fetch-args", env);
            if (env.method === "GET" && env.data) {
              env.url.search += env.data;
            }
            document.body.setAttribute("data-loading", env.url);
            env.xhr.open(env.method, env.url.href, env.async !== false, env.user, env.password);
            for (var property in o) {
              if (property === "upload") {
                if (env.xhr.upload && typeof o[property] === "object") {
                  $2.extend(env.xhr.upload, o[property]);
                }
              } else if (property in env.xhr) {
                try {
                  env.xhr[property] = o[property];
                } catch (e) {
                  self.console && console.error(e);
                }
              }
            }
            var headerKeys = Object.keys(env.headers).map(function(key) {
              return key.toLowerCase();
            });
            if (env.method !== "GET" && headerKeys.indexOf("content-type") === -1) {
              env.xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            }
            for (var header in env.headers) {
              if (env.headers[header] !== void 0) {
                env.xhr.setRequestHeader(header, env.headers[header]);
              }
            }
            var promise = new Promise(function(resolve, reject) {
              env.xhr.onload = function() {
                document.body.removeAttribute("data-loading");
                if (env.xhr.status === 0 || env.xhr.status >= 200 && env.xhr.status < 300 || env.xhr.status === 304) {
                  resolve(env.xhr);
                } else {
                  reject($2.extend(Error(env.xhr.statusText), {
                    xhr: env.xhr,
                    get status() {
                      return this.xhr.status;
                    }
                  }));
                }
              };
              env.xhr.onerror = function() {
                document.body.removeAttribute("data-loading");
                reject($2.extend(Error("Network Error"), { xhr: env.xhr }));
              };
              env.xhr.ontimeout = function() {
                document.body.removeAttribute("data-loading");
                reject($2.extend(Error("Network Timeout"), { xhr: env.xhr }));
              };
              env.xhr.send(env.method === "GET" ? null : env.data);
            });
            promise.xhr = env.xhr;
            return promise;
          },
          value: function(obj) {
            var hasRoot = typeof obj !== "string";
            return $2.$(arguments).slice(+hasRoot).reduce(function(obj2, property) {
              return obj2 && obj2[property];
            }, hasRoot ? obj : self);
          }
        });
        $2.Hooks = new $2.Class({
          add: function(name, callback, first) {
            if (typeof arguments[0] != "string") {
              for (var name in arguments[0]) {
                this.add(name, arguments[0][name], arguments[1]);
              }
              return;
            }
            (Array.isArray(name) ? name : [name]).forEach(function(name2) {
              this[name2] = this[name2] || [];
              if (callback) {
                this[name2][first ? "unshift" : "push"](callback);
              }
            }, this);
          },
          run: function(name, env) {
            this[name] = this[name] || [];
            this[name].forEach(function(callback) {
              callback.call(env && env.context ? env.context : env, env);
            });
          }
        });
        $2.hooks = new $2.Hooks();
        var _ = $2.property;
        $2.Element = function(subject) {
          this.subject = subject;
          this.data = {};
          this.bliss = {};
        };
        $2.Element.prototype = {
          set: overload(function(property, value) {
            if (property in $2.setProps) {
              $2.setProps[property].call(this, value);
            } else if (property in this) {
              this[property] = value;
            } else {
              this.setAttribute(property, value);
            }
          }, 0),
          transition: function(props, duration) {
            return new Promise(function(resolve, reject) {
              if ("transition" in this.style && duration !== 0) {
                var previous = $2.extend({}, this.style, /^transition(Duration|Property)$/);
                $2.style(this, {
                  transitionDuration: (duration || 400) + "ms",
                  transitionProperty: Object.keys(props).join(", ")
                });
                $2.once(this, "transitionend", function() {
                  clearTimeout(i);
                  $2.style(this, previous);
                  resolve(this);
                });
                var i = setTimeout(resolve, duration + 50, this);
                $2.style(this, props);
              } else {
                $2.style(this, props);
                resolve(this);
              }
            }.bind(this));
          },
          fire: function(type2, properties) {
            var evt = document.createEvent("HTMLEvents");
            evt.initEvent(type2, true, true);
            return this.dispatchEvent($2.extend(evt, properties));
          },
          bind: overload(function(types, options) {
            if (arguments.length > 1 && ($2.type(options) === "function" || options.handleEvent)) {
              var callback = options;
              options = $2.type(arguments[2]) === "object" ? arguments[2] : {
                capture: !!arguments[2]
              };
              options.callback = callback;
            }
            var listeners = $2.listeners.get(this) || {};
            types.trim().split(/\s+/).forEach(function(type2) {
              if (type2.indexOf(".") > -1) {
                type2 = type2.split(".");
                var className = type2[1];
                type2 = type2[0];
              }
              listeners[type2] = listeners[type2] || [];
              if (listeners[type2].filter(function(l) {
                return l.callback === options.callback && l.capture == options.capture;
              }).length === 0) {
                listeners[type2].push($2.extend({ className }, options));
              }
              $2.original.addEventListener.call(this, type2, options.callback, options);
            }, this);
            $2.listeners.set(this, listeners);
          }, 0),
          unbind: overload(function(types, options) {
            if (options && ($2.type(options) === "function" || options.handleEvent)) {
              var callback = options;
              options = arguments[2];
            }
            if ($2.type(options) == "boolean") {
              options = { capture: options };
            }
            options = options || {};
            options.callback = options.callback || callback;
            var listeners = $2.listeners.get(this);
            (types || "").trim().split(/\s+/).forEach(function(type2) {
              if (type2.indexOf(".") > -1) {
                type2 = type2.split(".");
                var className = type2[1];
                type2 = type2[0];
              }
              if (!listeners) {
                if (type2 && options.callback) {
                  return $2.original.removeEventListener.call(this, type2, options.callback, options.capture);
                }
                return;
              }
              for (var ltype in listeners) {
                if (!type2 || ltype === type2) {
                  for (var i = 0, l; l = listeners[ltype][i]; i++) {
                    if ((!className || className === l.className) && (!options.callback || options.callback === l.callback) && (!!options.capture == !!l.capture || !type2 && !options.callback && void 0 === options.capture)) {
                      listeners[ltype].splice(i, 1);
                      $2.original.removeEventListener.call(this, ltype, l.callback, l.capture);
                      i--;
                    }
                  }
                }
              }
            }, this);
          }, 0),
          when: function(type2, test) {
            var me = this;
            return new Promise(function(resolve) {
              me.addEventListener(type2, function callee(evt) {
                if (!test || test.call(this, evt)) {
                  this.removeEventListener(type2, callee);
                  resolve(evt);
                }
              });
            });
          },
          toggleAttribute: function(name, value, test) {
            if (arguments.length < 3) {
              test = value !== null;
            }
            if (test) {
              this.setAttribute(name, value);
            } else {
              this.removeAttribute(name);
            }
          }
        };
        $2.setProps = {
          style: function(val) {
            for (var property in val) {
              if (property in this.style) {
                this.style[property] = val[property];
              } else {
                this.style.setProperty(property, val[property]);
              }
            }
          },
          attributes: function(o) {
            for (var attribute in o) {
              this.setAttribute(attribute, o[attribute]);
            }
          },
          properties: function(val) {
            $2.extend(this, val);
          },
          events: function(val) {
            if (arguments.length == 1 && val && val.addEventListener) {
              var me = this;
              if ($2.listeners) {
                var listeners = $2.listeners.get(val);
                for (var type2 in listeners) {
                  listeners[type2].forEach(function(l) {
                    $2.bind(me, type2, l.callback, l.capture);
                  });
                }
              }
              for (var onevent in val) {
                if (onevent.indexOf("on") === 0) {
                  this[onevent] = val[onevent];
                }
              }
            } else {
              return $2.bind.apply(this, [this].concat($2.$(arguments)));
            }
          },
          once: overload(function(types, callback) {
            var me = this;
            var once = function() {
              $2.unbind(me, types, once);
              return callback.apply(me, arguments);
            };
            $2.bind(this, types, once, { once: true });
          }, 0),
          delegate: overload(function(type2, selector, callback) {
            $2.bind(this, type2, function(evt) {
              if (evt.target.closest(selector)) {
                callback.call(this, evt);
              }
            });
          }, 0, 2),
          contents: function(val) {
            if (val || val === 0) {
              (Array.isArray(val) ? val : [val]).forEach(function(child) {
                var type2 = $2.type(child);
                if (/^(string|number)$/.test(type2)) {
                  child = document.createTextNode(child + "");
                } else if (type2 === "object") {
                  child = $2.create(child);
                }
                if (child instanceof Node) {
                  this.appendChild(child);
                }
              }, this);
            }
          },
          inside: function(element) {
            element && element.appendChild(this);
          },
          before: function(element) {
            element && element.parentNode.insertBefore(this, element);
          },
          after: function(element) {
            element && element.parentNode.insertBefore(this, element.nextSibling);
          },
          start: function(element) {
            element && element.insertBefore(this, element.firstChild);
          },
          around: function(element) {
            if (element && element.parentNode) {
              $2.before(this, element);
            }
            this.appendChild(element);
          }
        };
        $2.Array = function(subject) {
          this.subject = subject;
        };
        $2.Array.prototype = {
          all: function(method) {
            var args = $2.$(arguments).slice(1);
            return this[method].apply(this, args);
          }
        };
        $2.add = overload(function(method, callback, on, noOverwrite) {
          on = $2.extend({ $: true, element: true, array: true }, on);
          if ($2.type(callback) == "function") {
            if (on.element && (!(method in $2.Element.prototype) || !noOverwrite)) {
              $2.Element.prototype[method] = function() {
                return this.subject && $2.defined(callback.apply(this.subject, arguments), this.subject);
              };
            }
            if (on.array && (!(method in $2.Array.prototype) || !noOverwrite)) {
              $2.Array.prototype[method] = function() {
                var args = arguments;
                return this.subject.map(function(element) {
                  return element && $2.defined(callback.apply(element, args), element);
                });
              };
            }
            if (on.$) {
              $2.sources[method] = $2[method] = callback;
              if (on.array || on.element) {
                $2[method] = function() {
                  var args = [].slice.apply(arguments);
                  var subject = args.shift();
                  var Type = on.array && Array.isArray(subject) ? "Array" : "Element";
                  return $2[Type].prototype[method].apply({ subject }, args);
                };
              }
            }
          }
        }, 0);
        $2.add($2.Array.prototype, { element: false });
        $2.add($2.Element.prototype);
        $2.add($2.setProps);
        $2.add($2.classProps, { element: false, array: false });
        var dummy = document.createElement("_");
        $2.add($2.extend({}, HTMLElement.prototype, function(method) {
          return $2.type(dummy[method]) === "function";
        }), null, true);
      })();
      (function($2) {
        "use strict";
        if (!Bliss || Bliss.shy) {
          return;
        }
        var _ = Bliss.property;
        $2.add({
          clone: function() {
            console.warn("$.clone() is deprecated and will be removed in a future version of Bliss.");
            var clone = this.cloneNode(true);
            var descendants = $2.$("*", clone).concat(clone);
            $2.$("*", this).concat(this).forEach(function(element, i, arr) {
              $2.events(descendants[i], element);
              descendants[i]._.data = $2.extend({}, element._.data);
            });
            return clone;
          }
        }, { array: false });
        Object.defineProperty(Node.prototype, _, {
          get: function getter() {
            Object.defineProperty(Node.prototype, _, {
              get: void 0
            });
            Object.defineProperty(this, _, {
              value: new $2.Element(this)
            });
            Object.defineProperty(Node.prototype, _, {
              get: getter
            });
            return this[_];
          },
          configurable: true
        });
        Object.defineProperty(Array.prototype, _, {
          get: function() {
            Object.defineProperty(this, _, {
              value: new $2.Array(this)
            });
            return this[_];
          },
          configurable: true
        });
        if (self.EventTarget && "addEventListener" in EventTarget.prototype) {
          EventTarget.prototype.addEventListener = function(type, callback, options) {
            return $2.bind(this, type, callback, options);
          };
          EventTarget.prototype.removeEventListener = function(type, callback, options) {
            return $2.unbind(this, type, callback, options);
          };
        }
        self.$ = self.$ || $2;
        self.$$ = self.$$ || $2.$;
      })(Bliss);
    }
  });

  // node_modules/lodash/lodash.js
  var require_lodash = __commonJS({
    "node_modules/lodash/lodash.js"(exports, module) {
      (function() {
        var undefined2;
        var VERSION = "4.17.21";
        var LARGE_ARRAY_SIZE = 200;
        var CORE_ERROR_TEXT = "Unsupported core-js use. Try https://npms.io/search?q=ponyfill.", FUNC_ERROR_TEXT = "Expected a function", INVALID_TEMPL_VAR_ERROR_TEXT = "Invalid `variable` option passed into `_.template`";
        var HASH_UNDEFINED = "__lodash_hash_undefined__";
        var MAX_MEMOIZE_SIZE = 500;
        var PLACEHOLDER = "__lodash_placeholder__";
        var CLONE_DEEP_FLAG = 1, CLONE_FLAT_FLAG = 2, CLONE_SYMBOLS_FLAG = 4;
        var COMPARE_PARTIAL_FLAG = 1, COMPARE_UNORDERED_FLAG = 2;
        var WRAP_BIND_FLAG = 1, WRAP_BIND_KEY_FLAG = 2, WRAP_CURRY_BOUND_FLAG = 4, WRAP_CURRY_FLAG = 8, WRAP_CURRY_RIGHT_FLAG = 16, WRAP_PARTIAL_FLAG = 32, WRAP_PARTIAL_RIGHT_FLAG = 64, WRAP_ARY_FLAG = 128, WRAP_REARG_FLAG = 256, WRAP_FLIP_FLAG = 512;
        var DEFAULT_TRUNC_LENGTH = 30, DEFAULT_TRUNC_OMISSION = "...";
        var HOT_COUNT = 800, HOT_SPAN = 16;
        var LAZY_FILTER_FLAG = 1, LAZY_MAP_FLAG = 2, LAZY_WHILE_FLAG = 3;
        var INFINITY = 1 / 0, MAX_SAFE_INTEGER = 9007199254740991, MAX_INTEGER = 17976931348623157e292, NAN = 0 / 0;
        var MAX_ARRAY_LENGTH = 4294967295, MAX_ARRAY_INDEX = MAX_ARRAY_LENGTH - 1, HALF_MAX_ARRAY_LENGTH = MAX_ARRAY_LENGTH >>> 1;
        var wrapFlags = [
          ["ary", WRAP_ARY_FLAG],
          ["bind", WRAP_BIND_FLAG],
          ["bindKey", WRAP_BIND_KEY_FLAG],
          ["curry", WRAP_CURRY_FLAG],
          ["curryRight", WRAP_CURRY_RIGHT_FLAG],
          ["flip", WRAP_FLIP_FLAG],
          ["partial", WRAP_PARTIAL_FLAG],
          ["partialRight", WRAP_PARTIAL_RIGHT_FLAG],
          ["rearg", WRAP_REARG_FLAG]
        ];
        var argsTag = "[object Arguments]", arrayTag = "[object Array]", asyncTag = "[object AsyncFunction]", boolTag = "[object Boolean]", dateTag = "[object Date]", domExcTag = "[object DOMException]", errorTag = "[object Error]", funcTag = "[object Function]", genTag = "[object GeneratorFunction]", mapTag = "[object Map]", numberTag = "[object Number]", nullTag = "[object Null]", objectTag = "[object Object]", promiseTag = "[object Promise]", proxyTag = "[object Proxy]", regexpTag = "[object RegExp]", setTag = "[object Set]", stringTag = "[object String]", symbolTag = "[object Symbol]", undefinedTag = "[object Undefined]", weakMapTag = "[object WeakMap]", weakSetTag = "[object WeakSet]";
        var arrayBufferTag = "[object ArrayBuffer]", dataViewTag = "[object DataView]", float32Tag = "[object Float32Array]", float64Tag = "[object Float64Array]", int8Tag = "[object Int8Array]", int16Tag = "[object Int16Array]", int32Tag = "[object Int32Array]", uint8Tag = "[object Uint8Array]", uint8ClampedTag = "[object Uint8ClampedArray]", uint16Tag = "[object Uint16Array]", uint32Tag = "[object Uint32Array]";
        var reEmptyStringLeading = /\b__p \+= '';/g, reEmptyStringMiddle = /\b(__p \+=) '' \+/g, reEmptyStringTrailing = /(__e\(.*?\)|\b__t\)) \+\n'';/g;
        var reEscapedHtml = /&(?:amp|lt|gt|quot|#39);/g, reUnescapedHtml = /[&<>"']/g, reHasEscapedHtml = RegExp(reEscapedHtml.source), reHasUnescapedHtml = RegExp(reUnescapedHtml.source);
        var reEscape = /<%-([\s\S]+?)%>/g, reEvaluate = /<%([\s\S]+?)%>/g, reInterpolate = /<%=([\s\S]+?)%>/g;
        var reIsDeepProp = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/, reIsPlainProp = /^\w*$/, rePropName = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g;
        var reRegExpChar = /[\\^$.*+?()[\]{}|]/g, reHasRegExpChar = RegExp(reRegExpChar.source);
        var reTrimStart = /^\s+/;
        var reWhitespace = /\s/;
        var reWrapComment = /\{(?:\n\/\* \[wrapped with .+\] \*\/)?\n?/, reWrapDetails = /\{\n\/\* \[wrapped with (.+)\] \*/, reSplitDetails = /,? & /;
        var reAsciiWord = /[^\x00-\x2f\x3a-\x40\x5b-\x60\x7b-\x7f]+/g;
        var reForbiddenIdentifierChars = /[()=,{}\[\]\/\s]/;
        var reEscapeChar = /\\(\\)?/g;
        var reEsTemplate = /\$\{([^\\}]*(?:\\.[^\\}]*)*)\}/g;
        var reFlags = /\w*$/;
        var reIsBadHex = /^[-+]0x[0-9a-f]+$/i;
        var reIsBinary = /^0b[01]+$/i;
        var reIsHostCtor = /^\[object .+?Constructor\]$/;
        var reIsOctal = /^0o[0-7]+$/i;
        var reIsUint = /^(?:0|[1-9]\d*)$/;
        var reLatin = /[\xc0-\xd6\xd8-\xf6\xf8-\xff\u0100-\u017f]/g;
        var reNoMatch = /($^)/;
        var reUnescapedString = /['\n\r\u2028\u2029\\]/g;
        var rsAstralRange = "\\ud800-\\udfff", rsComboMarksRange = "\\u0300-\\u036f", reComboHalfMarksRange = "\\ufe20-\\ufe2f", rsComboSymbolsRange = "\\u20d0-\\u20ff", rsComboRange = rsComboMarksRange + reComboHalfMarksRange + rsComboSymbolsRange, rsDingbatRange = "\\u2700-\\u27bf", rsLowerRange = "a-z\\xdf-\\xf6\\xf8-\\xff", rsMathOpRange = "\\xac\\xb1\\xd7\\xf7", rsNonCharRange = "\\x00-\\x2f\\x3a-\\x40\\x5b-\\x60\\x7b-\\xbf", rsPunctuationRange = "\\u2000-\\u206f", rsSpaceRange = " \\t\\x0b\\f\\xa0\\ufeff\\n\\r\\u2028\\u2029\\u1680\\u180e\\u2000\\u2001\\u2002\\u2003\\u2004\\u2005\\u2006\\u2007\\u2008\\u2009\\u200a\\u202f\\u205f\\u3000", rsUpperRange = "A-Z\\xc0-\\xd6\\xd8-\\xde", rsVarRange = "\\ufe0e\\ufe0f", rsBreakRange = rsMathOpRange + rsNonCharRange + rsPunctuationRange + rsSpaceRange;
        var rsApos = "['\u2019]", rsAstral = "[" + rsAstralRange + "]", rsBreak = "[" + rsBreakRange + "]", rsCombo = "[" + rsComboRange + "]", rsDigits = "\\d+", rsDingbat = "[" + rsDingbatRange + "]", rsLower = "[" + rsLowerRange + "]", rsMisc = "[^" + rsAstralRange + rsBreakRange + rsDigits + rsDingbatRange + rsLowerRange + rsUpperRange + "]", rsFitz = "\\ud83c[\\udffb-\\udfff]", rsModifier = "(?:" + rsCombo + "|" + rsFitz + ")", rsNonAstral = "[^" + rsAstralRange + "]", rsRegional = "(?:\\ud83c[\\udde6-\\uddff]){2}", rsSurrPair = "[\\ud800-\\udbff][\\udc00-\\udfff]", rsUpper = "[" + rsUpperRange + "]", rsZWJ = "\\u200d";
        var rsMiscLower = "(?:" + rsLower + "|" + rsMisc + ")", rsMiscUpper = "(?:" + rsUpper + "|" + rsMisc + ")", rsOptContrLower = "(?:" + rsApos + "(?:d|ll|m|re|s|t|ve))?", rsOptContrUpper = "(?:" + rsApos + "(?:D|LL|M|RE|S|T|VE))?", reOptMod = rsModifier + "?", rsOptVar = "[" + rsVarRange + "]?", rsOptJoin = "(?:" + rsZWJ + "(?:" + [rsNonAstral, rsRegional, rsSurrPair].join("|") + ")" + rsOptVar + reOptMod + ")*", rsOrdLower = "\\d*(?:1st|2nd|3rd|(?![123])\\dth)(?=\\b|[A-Z_])", rsOrdUpper = "\\d*(?:1ST|2ND|3RD|(?![123])\\dTH)(?=\\b|[a-z_])", rsSeq = rsOptVar + reOptMod + rsOptJoin, rsEmoji = "(?:" + [rsDingbat, rsRegional, rsSurrPair].join("|") + ")" + rsSeq, rsSymbol = "(?:" + [rsNonAstral + rsCombo + "?", rsCombo, rsRegional, rsSurrPair, rsAstral].join("|") + ")";
        var reApos = RegExp(rsApos, "g");
        var reComboMark = RegExp(rsCombo, "g");
        var reUnicode = RegExp(rsFitz + "(?=" + rsFitz + ")|" + rsSymbol + rsSeq, "g");
        var reUnicodeWord = RegExp([
          rsUpper + "?" + rsLower + "+" + rsOptContrLower + "(?=" + [rsBreak, rsUpper, "$"].join("|") + ")",
          rsMiscUpper + "+" + rsOptContrUpper + "(?=" + [rsBreak, rsUpper + rsMiscLower, "$"].join("|") + ")",
          rsUpper + "?" + rsMiscLower + "+" + rsOptContrLower,
          rsUpper + "+" + rsOptContrUpper,
          rsOrdUpper,
          rsOrdLower,
          rsDigits,
          rsEmoji
        ].join("|"), "g");
        var reHasUnicode = RegExp("[" + rsZWJ + rsAstralRange + rsComboRange + rsVarRange + "]");
        var reHasUnicodeWord = /[a-z][A-Z]|[A-Z]{2}[a-z]|[0-9][a-zA-Z]|[a-zA-Z][0-9]|[^a-zA-Z0-9 ]/;
        var contextProps = [
          "Array",
          "Buffer",
          "DataView",
          "Date",
          "Error",
          "Float32Array",
          "Float64Array",
          "Function",
          "Int8Array",
          "Int16Array",
          "Int32Array",
          "Map",
          "Math",
          "Object",
          "Promise",
          "RegExp",
          "Set",
          "String",
          "Symbol",
          "TypeError",
          "Uint8Array",
          "Uint8ClampedArray",
          "Uint16Array",
          "Uint32Array",
          "WeakMap",
          "_",
          "clearTimeout",
          "isFinite",
          "parseInt",
          "setTimeout"
        ];
        var templateCounter = -1;
        var typedArrayTags = {};
        typedArrayTags[float32Tag] = typedArrayTags[float64Tag] = typedArrayTags[int8Tag] = typedArrayTags[int16Tag] = typedArrayTags[int32Tag] = typedArrayTags[uint8Tag] = typedArrayTags[uint8ClampedTag] = typedArrayTags[uint16Tag] = typedArrayTags[uint32Tag] = true;
        typedArrayTags[argsTag] = typedArrayTags[arrayTag] = typedArrayTags[arrayBufferTag] = typedArrayTags[boolTag] = typedArrayTags[dataViewTag] = typedArrayTags[dateTag] = typedArrayTags[errorTag] = typedArrayTags[funcTag] = typedArrayTags[mapTag] = typedArrayTags[numberTag] = typedArrayTags[objectTag] = typedArrayTags[regexpTag] = typedArrayTags[setTag] = typedArrayTags[stringTag] = typedArrayTags[weakMapTag] = false;
        var cloneableTags = {};
        cloneableTags[argsTag] = cloneableTags[arrayTag] = cloneableTags[arrayBufferTag] = cloneableTags[dataViewTag] = cloneableTags[boolTag] = cloneableTags[dateTag] = cloneableTags[float32Tag] = cloneableTags[float64Tag] = cloneableTags[int8Tag] = cloneableTags[int16Tag] = cloneableTags[int32Tag] = cloneableTags[mapTag] = cloneableTags[numberTag] = cloneableTags[objectTag] = cloneableTags[regexpTag] = cloneableTags[setTag] = cloneableTags[stringTag] = cloneableTags[symbolTag] = cloneableTags[uint8Tag] = cloneableTags[uint8ClampedTag] = cloneableTags[uint16Tag] = cloneableTags[uint32Tag] = true;
        cloneableTags[errorTag] = cloneableTags[funcTag] = cloneableTags[weakMapTag] = false;
        var deburredLetters = {
          "\xC0": "A",
          "\xC1": "A",
          "\xC2": "A",
          "\xC3": "A",
          "\xC4": "A",
          "\xC5": "A",
          "\xE0": "a",
          "\xE1": "a",
          "\xE2": "a",
          "\xE3": "a",
          "\xE4": "a",
          "\xE5": "a",
          "\xC7": "C",
          "\xE7": "c",
          "\xD0": "D",
          "\xF0": "d",
          "\xC8": "E",
          "\xC9": "E",
          "\xCA": "E",
          "\xCB": "E",
          "\xE8": "e",
          "\xE9": "e",
          "\xEA": "e",
          "\xEB": "e",
          "\xCC": "I",
          "\xCD": "I",
          "\xCE": "I",
          "\xCF": "I",
          "\xEC": "i",
          "\xED": "i",
          "\xEE": "i",
          "\xEF": "i",
          "\xD1": "N",
          "\xF1": "n",
          "\xD2": "O",
          "\xD3": "O",
          "\xD4": "O",
          "\xD5": "O",
          "\xD6": "O",
          "\xD8": "O",
          "\xF2": "o",
          "\xF3": "o",
          "\xF4": "o",
          "\xF5": "o",
          "\xF6": "o",
          "\xF8": "o",
          "\xD9": "U",
          "\xDA": "U",
          "\xDB": "U",
          "\xDC": "U",
          "\xF9": "u",
          "\xFA": "u",
          "\xFB": "u",
          "\xFC": "u",
          "\xDD": "Y",
          "\xFD": "y",
          "\xFF": "y",
          "\xC6": "Ae",
          "\xE6": "ae",
          "\xDE": "Th",
          "\xFE": "th",
          "\xDF": "ss",
          "\u0100": "A",
          "\u0102": "A",
          "\u0104": "A",
          "\u0101": "a",
          "\u0103": "a",
          "\u0105": "a",
          "\u0106": "C",
          "\u0108": "C",
          "\u010A": "C",
          "\u010C": "C",
          "\u0107": "c",
          "\u0109": "c",
          "\u010B": "c",
          "\u010D": "c",
          "\u010E": "D",
          "\u0110": "D",
          "\u010F": "d",
          "\u0111": "d",
          "\u0112": "E",
          "\u0114": "E",
          "\u0116": "E",
          "\u0118": "E",
          "\u011A": "E",
          "\u0113": "e",
          "\u0115": "e",
          "\u0117": "e",
          "\u0119": "e",
          "\u011B": "e",
          "\u011C": "G",
          "\u011E": "G",
          "\u0120": "G",
          "\u0122": "G",
          "\u011D": "g",
          "\u011F": "g",
          "\u0121": "g",
          "\u0123": "g",
          "\u0124": "H",
          "\u0126": "H",
          "\u0125": "h",
          "\u0127": "h",
          "\u0128": "I",
          "\u012A": "I",
          "\u012C": "I",
          "\u012E": "I",
          "\u0130": "I",
          "\u0129": "i",
          "\u012B": "i",
          "\u012D": "i",
          "\u012F": "i",
          "\u0131": "i",
          "\u0134": "J",
          "\u0135": "j",
          "\u0136": "K",
          "\u0137": "k",
          "\u0138": "k",
          "\u0139": "L",
          "\u013B": "L",
          "\u013D": "L",
          "\u013F": "L",
          "\u0141": "L",
          "\u013A": "l",
          "\u013C": "l",
          "\u013E": "l",
          "\u0140": "l",
          "\u0142": "l",
          "\u0143": "N",
          "\u0145": "N",
          "\u0147": "N",
          "\u014A": "N",
          "\u0144": "n",
          "\u0146": "n",
          "\u0148": "n",
          "\u014B": "n",
          "\u014C": "O",
          "\u014E": "O",
          "\u0150": "O",
          "\u014D": "o",
          "\u014F": "o",
          "\u0151": "o",
          "\u0154": "R",
          "\u0156": "R",
          "\u0158": "R",
          "\u0155": "r",
          "\u0157": "r",
          "\u0159": "r",
          "\u015A": "S",
          "\u015C": "S",
          "\u015E": "S",
          "\u0160": "S",
          "\u015B": "s",
          "\u015D": "s",
          "\u015F": "s",
          "\u0161": "s",
          "\u0162": "T",
          "\u0164": "T",
          "\u0166": "T",
          "\u0163": "t",
          "\u0165": "t",
          "\u0167": "t",
          "\u0168": "U",
          "\u016A": "U",
          "\u016C": "U",
          "\u016E": "U",
          "\u0170": "U",
          "\u0172": "U",
          "\u0169": "u",
          "\u016B": "u",
          "\u016D": "u",
          "\u016F": "u",
          "\u0171": "u",
          "\u0173": "u",
          "\u0174": "W",
          "\u0175": "w",
          "\u0176": "Y",
          "\u0177": "y",
          "\u0178": "Y",
          "\u0179": "Z",
          "\u017B": "Z",
          "\u017D": "Z",
          "\u017A": "z",
          "\u017C": "z",
          "\u017E": "z",
          "\u0132": "IJ",
          "\u0133": "ij",
          "\u0152": "Oe",
          "\u0153": "oe",
          "\u0149": "'n",
          "\u017F": "s"
        };
        var htmlEscapes = {
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;"
        };
        var htmlUnescapes = {
          "&amp;": "&",
          "&lt;": "<",
          "&gt;": ">",
          "&quot;": '"',
          "&#39;": "'"
        };
        var stringEscapes = {
          "\\": "\\",
          "'": "'",
          "\n": "n",
          "\r": "r",
          "\u2028": "u2028",
          "\u2029": "u2029"
        };
        var freeParseFloat = parseFloat, freeParseInt = parseInt;
        var freeGlobal = typeof global == "object" && global && global.Object === Object && global;
        var freeSelf = typeof self == "object" && self && self.Object === Object && self;
        var root = freeGlobal || freeSelf || Function("return this")();
        var freeExports = typeof exports == "object" && exports && !exports.nodeType && exports;
        var freeModule = freeExports && typeof module == "object" && module && !module.nodeType && module;
        var moduleExports = freeModule && freeModule.exports === freeExports;
        var freeProcess = moduleExports && freeGlobal.process;
        var nodeUtil = function() {
          try {
            var types = freeModule && freeModule.require && freeModule.require("util").types;
            if (types) {
              return types;
            }
            return freeProcess && freeProcess.binding && freeProcess.binding("util");
          } catch (e) {
          }
        }();
        var nodeIsArrayBuffer = nodeUtil && nodeUtil.isArrayBuffer, nodeIsDate = nodeUtil && nodeUtil.isDate, nodeIsMap = nodeUtil && nodeUtil.isMap, nodeIsRegExp = nodeUtil && nodeUtil.isRegExp, nodeIsSet = nodeUtil && nodeUtil.isSet, nodeIsTypedArray = nodeUtil && nodeUtil.isTypedArray;
        function apply(func, thisArg, args) {
          switch (args.length) {
            case 0:
              return func.call(thisArg);
            case 1:
              return func.call(thisArg, args[0]);
            case 2:
              return func.call(thisArg, args[0], args[1]);
            case 3:
              return func.call(thisArg, args[0], args[1], args[2]);
          }
          return func.apply(thisArg, args);
        }
        function arrayAggregator(array, setter, iteratee, accumulator) {
          var index = -1, length = array == null ? 0 : array.length;
          while (++index < length) {
            var value = array[index];
            setter(accumulator, value, iteratee(value), array);
          }
          return accumulator;
        }
        function arrayEach(array, iteratee) {
          var index = -1, length = array == null ? 0 : array.length;
          while (++index < length) {
            if (iteratee(array[index], index, array) === false) {
              break;
            }
          }
          return array;
        }
        function arrayEachRight(array, iteratee) {
          var length = array == null ? 0 : array.length;
          while (length--) {
            if (iteratee(array[length], length, array) === false) {
              break;
            }
          }
          return array;
        }
        function arrayEvery(array, predicate) {
          var index = -1, length = array == null ? 0 : array.length;
          while (++index < length) {
            if (!predicate(array[index], index, array)) {
              return false;
            }
          }
          return true;
        }
        function arrayFilter(array, predicate) {
          var index = -1, length = array == null ? 0 : array.length, resIndex = 0, result = [];
          while (++index < length) {
            var value = array[index];
            if (predicate(value, index, array)) {
              result[resIndex++] = value;
            }
          }
          return result;
        }
        function arrayIncludes(array, value) {
          var length = array == null ? 0 : array.length;
          return !!length && baseIndexOf(array, value, 0) > -1;
        }
        function arrayIncludesWith(array, value, comparator) {
          var index = -1, length = array == null ? 0 : array.length;
          while (++index < length) {
            if (comparator(value, array[index])) {
              return true;
            }
          }
          return false;
        }
        function arrayMap(array, iteratee) {
          var index = -1, length = array == null ? 0 : array.length, result = Array(length);
          while (++index < length) {
            result[index] = iteratee(array[index], index, array);
          }
          return result;
        }
        function arrayPush(array, values) {
          var index = -1, length = values.length, offset = array.length;
          while (++index < length) {
            array[offset + index] = values[index];
          }
          return array;
        }
        function arrayReduce(array, iteratee, accumulator, initAccum) {
          var index = -1, length = array == null ? 0 : array.length;
          if (initAccum && length) {
            accumulator = array[++index];
          }
          while (++index < length) {
            accumulator = iteratee(accumulator, array[index], index, array);
          }
          return accumulator;
        }
        function arrayReduceRight(array, iteratee, accumulator, initAccum) {
          var length = array == null ? 0 : array.length;
          if (initAccum && length) {
            accumulator = array[--length];
          }
          while (length--) {
            accumulator = iteratee(accumulator, array[length], length, array);
          }
          return accumulator;
        }
        function arraySome(array, predicate) {
          var index = -1, length = array == null ? 0 : array.length;
          while (++index < length) {
            if (predicate(array[index], index, array)) {
              return true;
            }
          }
          return false;
        }
        var asciiSize = baseProperty("length");
        function asciiToArray(string) {
          return string.split("");
        }
        function asciiWords(string) {
          return string.match(reAsciiWord) || [];
        }
        function baseFindKey(collection, predicate, eachFunc) {
          var result;
          eachFunc(collection, function(value, key, collection2) {
            if (predicate(value, key, collection2)) {
              result = key;
              return false;
            }
          });
          return result;
        }
        function baseFindIndex(array, predicate, fromIndex, fromRight) {
          var length = array.length, index = fromIndex + (fromRight ? 1 : -1);
          while (fromRight ? index-- : ++index < length) {
            if (predicate(array[index], index, array)) {
              return index;
            }
          }
          return -1;
        }
        function baseIndexOf(array, value, fromIndex) {
          return value === value ? strictIndexOf(array, value, fromIndex) : baseFindIndex(array, baseIsNaN, fromIndex);
        }
        function baseIndexOfWith(array, value, fromIndex, comparator) {
          var index = fromIndex - 1, length = array.length;
          while (++index < length) {
            if (comparator(array[index], value)) {
              return index;
            }
          }
          return -1;
        }
        function baseIsNaN(value) {
          return value !== value;
        }
        function baseMean(array, iteratee) {
          var length = array == null ? 0 : array.length;
          return length ? baseSum(array, iteratee) / length : NAN;
        }
        function baseProperty(key) {
          return function(object) {
            return object == null ? undefined2 : object[key];
          };
        }
        function basePropertyOf(object) {
          return function(key) {
            return object == null ? undefined2 : object[key];
          };
        }
        function baseReduce(collection, iteratee, accumulator, initAccum, eachFunc) {
          eachFunc(collection, function(value, index, collection2) {
            accumulator = initAccum ? (initAccum = false, value) : iteratee(accumulator, value, index, collection2);
          });
          return accumulator;
        }
        function baseSortBy(array, comparer) {
          var length = array.length;
          array.sort(comparer);
          while (length--) {
            array[length] = array[length].value;
          }
          return array;
        }
        function baseSum(array, iteratee) {
          var result, index = -1, length = array.length;
          while (++index < length) {
            var current = iteratee(array[index]);
            if (current !== undefined2) {
              result = result === undefined2 ? current : result + current;
            }
          }
          return result;
        }
        function baseTimes(n, iteratee) {
          var index = -1, result = Array(n);
          while (++index < n) {
            result[index] = iteratee(index);
          }
          return result;
        }
        function baseToPairs(object, props) {
          return arrayMap(props, function(key) {
            return [key, object[key]];
          });
        }
        function baseTrim(string) {
          return string ? string.slice(0, trimmedEndIndex(string) + 1).replace(reTrimStart, "") : string;
        }
        function baseUnary(func) {
          return function(value) {
            return func(value);
          };
        }
        function baseValues(object, props) {
          return arrayMap(props, function(key) {
            return object[key];
          });
        }
        function cacheHas(cache, key) {
          return cache.has(key);
        }
        function charsStartIndex(strSymbols, chrSymbols) {
          var index = -1, length = strSymbols.length;
          while (++index < length && baseIndexOf(chrSymbols, strSymbols[index], 0) > -1) {
          }
          return index;
        }
        function charsEndIndex(strSymbols, chrSymbols) {
          var index = strSymbols.length;
          while (index-- && baseIndexOf(chrSymbols, strSymbols[index], 0) > -1) {
          }
          return index;
        }
        function countHolders(array, placeholder) {
          var length = array.length, result = 0;
          while (length--) {
            if (array[length] === placeholder) {
              ++result;
            }
          }
          return result;
        }
        var deburrLetter = basePropertyOf(deburredLetters);
        var escapeHtmlChar = basePropertyOf(htmlEscapes);
        function escapeStringChar(chr) {
          return "\\" + stringEscapes[chr];
        }
        function getValue(object, key) {
          return object == null ? undefined2 : object[key];
        }
        function hasUnicode(string) {
          return reHasUnicode.test(string);
        }
        function hasUnicodeWord(string) {
          return reHasUnicodeWord.test(string);
        }
        function iteratorToArray(iterator) {
          var data, result = [];
          while (!(data = iterator.next()).done) {
            result.push(data.value);
          }
          return result;
        }
        function mapToArray(map) {
          var index = -1, result = Array(map.size);
          map.forEach(function(value, key) {
            result[++index] = [key, value];
          });
          return result;
        }
        function overArg(func, transform) {
          return function(arg) {
            return func(transform(arg));
          };
        }
        function replaceHolders(array, placeholder) {
          var index = -1, length = array.length, resIndex = 0, result = [];
          while (++index < length) {
            var value = array[index];
            if (value === placeholder || value === PLACEHOLDER) {
              array[index] = PLACEHOLDER;
              result[resIndex++] = index;
            }
          }
          return result;
        }
        function setToArray(set) {
          var index = -1, result = Array(set.size);
          set.forEach(function(value) {
            result[++index] = value;
          });
          return result;
        }
        function setToPairs(set) {
          var index = -1, result = Array(set.size);
          set.forEach(function(value) {
            result[++index] = [value, value];
          });
          return result;
        }
        function strictIndexOf(array, value, fromIndex) {
          var index = fromIndex - 1, length = array.length;
          while (++index < length) {
            if (array[index] === value) {
              return index;
            }
          }
          return -1;
        }
        function strictLastIndexOf(array, value, fromIndex) {
          var index = fromIndex + 1;
          while (index--) {
            if (array[index] === value) {
              return index;
            }
          }
          return index;
        }
        function stringSize(string) {
          return hasUnicode(string) ? unicodeSize(string) : asciiSize(string);
        }
        function stringToArray(string) {
          return hasUnicode(string) ? unicodeToArray(string) : asciiToArray(string);
        }
        function trimmedEndIndex(string) {
          var index = string.length;
          while (index-- && reWhitespace.test(string.charAt(index))) {
          }
          return index;
        }
        var unescapeHtmlChar = basePropertyOf(htmlUnescapes);
        function unicodeSize(string) {
          var result = reUnicode.lastIndex = 0;
          while (reUnicode.test(string)) {
            ++result;
          }
          return result;
        }
        function unicodeToArray(string) {
          return string.match(reUnicode) || [];
        }
        function unicodeWords(string) {
          return string.match(reUnicodeWord) || [];
        }
        var runInContext = function runInContext2(context) {
          context = context == null ? root : _.defaults(root.Object(), context, _.pick(root, contextProps));
          var Array2 = context.Array, Date2 = context.Date, Error2 = context.Error, Function2 = context.Function, Math2 = context.Math, Object2 = context.Object, RegExp2 = context.RegExp, String2 = context.String, TypeError2 = context.TypeError;
          var arrayProto = Array2.prototype, funcProto = Function2.prototype, objectProto = Object2.prototype;
          var coreJsData = context["__core-js_shared__"];
          var funcToString = funcProto.toString;
          var hasOwnProperty = objectProto.hasOwnProperty;
          var idCounter = 0;
          var maskSrcKey = function() {
            var uid = /[^.]+$/.exec(coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO || "");
            return uid ? "Symbol(src)_1." + uid : "";
          }();
          var nativeObjectToString = objectProto.toString;
          var objectCtorString = funcToString.call(Object2);
          var oldDash = root._;
          var reIsNative = RegExp2(
            "^" + funcToString.call(hasOwnProperty).replace(reRegExpChar, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"
          );
          var Buffer2 = moduleExports ? context.Buffer : undefined2, Symbol2 = context.Symbol, Uint8Array2 = context.Uint8Array, allocUnsafe = Buffer2 ? Buffer2.allocUnsafe : undefined2, getPrototype = overArg(Object2.getPrototypeOf, Object2), objectCreate = Object2.create, propertyIsEnumerable = objectProto.propertyIsEnumerable, splice = arrayProto.splice, spreadableSymbol = Symbol2 ? Symbol2.isConcatSpreadable : undefined2, symIterator = Symbol2 ? Symbol2.iterator : undefined2, symToStringTag = Symbol2 ? Symbol2.toStringTag : undefined2;
          var defineProperty = function() {
            try {
              var func = getNative(Object2, "defineProperty");
              func({}, "", {});
              return func;
            } catch (e) {
            }
          }();
          var ctxClearTimeout = context.clearTimeout !== root.clearTimeout && context.clearTimeout, ctxNow = Date2 && Date2.now !== root.Date.now && Date2.now, ctxSetTimeout = context.setTimeout !== root.setTimeout && context.setTimeout;
          var nativeCeil = Math2.ceil, nativeFloor = Math2.floor, nativeGetSymbols = Object2.getOwnPropertySymbols, nativeIsBuffer = Buffer2 ? Buffer2.isBuffer : undefined2, nativeIsFinite = context.isFinite, nativeJoin = arrayProto.join, nativeKeys = overArg(Object2.keys, Object2), nativeMax = Math2.max, nativeMin = Math2.min, nativeNow = Date2.now, nativeParseInt = context.parseInt, nativeRandom = Math2.random, nativeReverse = arrayProto.reverse;
          var DataView = getNative(context, "DataView"), Map2 = getNative(context, "Map"), Promise2 = getNative(context, "Promise"), Set2 = getNative(context, "Set"), WeakMap2 = getNative(context, "WeakMap"), nativeCreate = getNative(Object2, "create");
          var metaMap = WeakMap2 && new WeakMap2();
          var realNames = {};
          var dataViewCtorString = toSource(DataView), mapCtorString = toSource(Map2), promiseCtorString = toSource(Promise2), setCtorString = toSource(Set2), weakMapCtorString = toSource(WeakMap2);
          var symbolProto = Symbol2 ? Symbol2.prototype : undefined2, symbolValueOf = symbolProto ? symbolProto.valueOf : undefined2, symbolToString = symbolProto ? symbolProto.toString : undefined2;
          function lodash(value) {
            if (isObjectLike(value) && !isArray(value) && !(value instanceof LazyWrapper)) {
              if (value instanceof LodashWrapper) {
                return value;
              }
              if (hasOwnProperty.call(value, "__wrapped__")) {
                return wrapperClone(value);
              }
            }
            return new LodashWrapper(value);
          }
          var baseCreate = function() {
            function object() {
            }
            return function(proto) {
              if (!isObject(proto)) {
                return {};
              }
              if (objectCreate) {
                return objectCreate(proto);
              }
              object.prototype = proto;
              var result2 = new object();
              object.prototype = undefined2;
              return result2;
            };
          }();
          function baseLodash() {
          }
          function LodashWrapper(value, chainAll) {
            this.__wrapped__ = value;
            this.__actions__ = [];
            this.__chain__ = !!chainAll;
            this.__index__ = 0;
            this.__values__ = undefined2;
          }
          lodash.templateSettings = {
            "escape": reEscape,
            "evaluate": reEvaluate,
            "interpolate": reInterpolate,
            "variable": "",
            "imports": {
              "_": lodash
            }
          };
          lodash.prototype = baseLodash.prototype;
          lodash.prototype.constructor = lodash;
          LodashWrapper.prototype = baseCreate(baseLodash.prototype);
          LodashWrapper.prototype.constructor = LodashWrapper;
          function LazyWrapper(value) {
            this.__wrapped__ = value;
            this.__actions__ = [];
            this.__dir__ = 1;
            this.__filtered__ = false;
            this.__iteratees__ = [];
            this.__takeCount__ = MAX_ARRAY_LENGTH;
            this.__views__ = [];
          }
          function lazyClone() {
            var result2 = new LazyWrapper(this.__wrapped__);
            result2.__actions__ = copyArray(this.__actions__);
            result2.__dir__ = this.__dir__;
            result2.__filtered__ = this.__filtered__;
            result2.__iteratees__ = copyArray(this.__iteratees__);
            result2.__takeCount__ = this.__takeCount__;
            result2.__views__ = copyArray(this.__views__);
            return result2;
          }
          function lazyReverse() {
            if (this.__filtered__) {
              var result2 = new LazyWrapper(this);
              result2.__dir__ = -1;
              result2.__filtered__ = true;
            } else {
              result2 = this.clone();
              result2.__dir__ *= -1;
            }
            return result2;
          }
          function lazyValue() {
            var array = this.__wrapped__.value(), dir = this.__dir__, isArr = isArray(array), isRight = dir < 0, arrLength = isArr ? array.length : 0, view = getView(0, arrLength, this.__views__), start = view.start, end = view.end, length = end - start, index = isRight ? end : start - 1, iteratees = this.__iteratees__, iterLength = iteratees.length, resIndex = 0, takeCount = nativeMin(length, this.__takeCount__);
            if (!isArr || !isRight && arrLength == length && takeCount == length) {
              return baseWrapperValue(array, this.__actions__);
            }
            var result2 = [];
            outer:
              while (length-- && resIndex < takeCount) {
                index += dir;
                var iterIndex = -1, value = array[index];
                while (++iterIndex < iterLength) {
                  var data = iteratees[iterIndex], iteratee2 = data.iteratee, type = data.type, computed = iteratee2(value);
                  if (type == LAZY_MAP_FLAG) {
                    value = computed;
                  } else if (!computed) {
                    if (type == LAZY_FILTER_FLAG) {
                      continue outer;
                    } else {
                      break outer;
                    }
                  }
                }
                result2[resIndex++] = value;
              }
            return result2;
          }
          LazyWrapper.prototype = baseCreate(baseLodash.prototype);
          LazyWrapper.prototype.constructor = LazyWrapper;
          function Hash(entries) {
            var index = -1, length = entries == null ? 0 : entries.length;
            this.clear();
            while (++index < length) {
              var entry = entries[index];
              this.set(entry[0], entry[1]);
            }
          }
          function hashClear() {
            this.__data__ = nativeCreate ? nativeCreate(null) : {};
            this.size = 0;
          }
          function hashDelete(key) {
            var result2 = this.has(key) && delete this.__data__[key];
            this.size -= result2 ? 1 : 0;
            return result2;
          }
          function hashGet(key) {
            var data = this.__data__;
            if (nativeCreate) {
              var result2 = data[key];
              return result2 === HASH_UNDEFINED ? undefined2 : result2;
            }
            return hasOwnProperty.call(data, key) ? data[key] : undefined2;
          }
          function hashHas(key) {
            var data = this.__data__;
            return nativeCreate ? data[key] !== undefined2 : hasOwnProperty.call(data, key);
          }
          function hashSet(key, value) {
            var data = this.__data__;
            this.size += this.has(key) ? 0 : 1;
            data[key] = nativeCreate && value === undefined2 ? HASH_UNDEFINED : value;
            return this;
          }
          Hash.prototype.clear = hashClear;
          Hash.prototype["delete"] = hashDelete;
          Hash.prototype.get = hashGet;
          Hash.prototype.has = hashHas;
          Hash.prototype.set = hashSet;
          function ListCache(entries) {
            var index = -1, length = entries == null ? 0 : entries.length;
            this.clear();
            while (++index < length) {
              var entry = entries[index];
              this.set(entry[0], entry[1]);
            }
          }
          function listCacheClear() {
            this.__data__ = [];
            this.size = 0;
          }
          function listCacheDelete(key) {
            var data = this.__data__, index = assocIndexOf(data, key);
            if (index < 0) {
              return false;
            }
            var lastIndex = data.length - 1;
            if (index == lastIndex) {
              data.pop();
            } else {
              splice.call(data, index, 1);
            }
            --this.size;
            return true;
          }
          function listCacheGet(key) {
            var data = this.__data__, index = assocIndexOf(data, key);
            return index < 0 ? undefined2 : data[index][1];
          }
          function listCacheHas(key) {
            return assocIndexOf(this.__data__, key) > -1;
          }
          function listCacheSet(key, value) {
            var data = this.__data__, index = assocIndexOf(data, key);
            if (index < 0) {
              ++this.size;
              data.push([key, value]);
            } else {
              data[index][1] = value;
            }
            return this;
          }
          ListCache.prototype.clear = listCacheClear;
          ListCache.prototype["delete"] = listCacheDelete;
          ListCache.prototype.get = listCacheGet;
          ListCache.prototype.has = listCacheHas;
          ListCache.prototype.set = listCacheSet;
          function MapCache(entries) {
            var index = -1, length = entries == null ? 0 : entries.length;
            this.clear();
            while (++index < length) {
              var entry = entries[index];
              this.set(entry[0], entry[1]);
            }
          }
          function mapCacheClear() {
            this.size = 0;
            this.__data__ = {
              "hash": new Hash(),
              "map": new (Map2 || ListCache)(),
              "string": new Hash()
            };
          }
          function mapCacheDelete(key) {
            var result2 = getMapData(this, key)["delete"](key);
            this.size -= result2 ? 1 : 0;
            return result2;
          }
          function mapCacheGet(key) {
            return getMapData(this, key).get(key);
          }
          function mapCacheHas(key) {
            return getMapData(this, key).has(key);
          }
          function mapCacheSet(key, value) {
            var data = getMapData(this, key), size2 = data.size;
            data.set(key, value);
            this.size += data.size == size2 ? 0 : 1;
            return this;
          }
          MapCache.prototype.clear = mapCacheClear;
          MapCache.prototype["delete"] = mapCacheDelete;
          MapCache.prototype.get = mapCacheGet;
          MapCache.prototype.has = mapCacheHas;
          MapCache.prototype.set = mapCacheSet;
          function SetCache(values2) {
            var index = -1, length = values2 == null ? 0 : values2.length;
            this.__data__ = new MapCache();
            while (++index < length) {
              this.add(values2[index]);
            }
          }
          function setCacheAdd(value) {
            this.__data__.set(value, HASH_UNDEFINED);
            return this;
          }
          function setCacheHas(value) {
            return this.__data__.has(value);
          }
          SetCache.prototype.add = SetCache.prototype.push = setCacheAdd;
          SetCache.prototype.has = setCacheHas;
          function Stack(entries) {
            var data = this.__data__ = new ListCache(entries);
            this.size = data.size;
          }
          function stackClear() {
            this.__data__ = new ListCache();
            this.size = 0;
          }
          function stackDelete(key) {
            var data = this.__data__, result2 = data["delete"](key);
            this.size = data.size;
            return result2;
          }
          function stackGet(key) {
            return this.__data__.get(key);
          }
          function stackHas(key) {
            return this.__data__.has(key);
          }
          function stackSet(key, value) {
            var data = this.__data__;
            if (data instanceof ListCache) {
              var pairs = data.__data__;
              if (!Map2 || pairs.length < LARGE_ARRAY_SIZE - 1) {
                pairs.push([key, value]);
                this.size = ++data.size;
                return this;
              }
              data = this.__data__ = new MapCache(pairs);
            }
            data.set(key, value);
            this.size = data.size;
            return this;
          }
          Stack.prototype.clear = stackClear;
          Stack.prototype["delete"] = stackDelete;
          Stack.prototype.get = stackGet;
          Stack.prototype.has = stackHas;
          Stack.prototype.set = stackSet;
          function arrayLikeKeys(value, inherited) {
            var isArr = isArray(value), isArg = !isArr && isArguments(value), isBuff = !isArr && !isArg && isBuffer(value), isType = !isArr && !isArg && !isBuff && isTypedArray(value), skipIndexes = isArr || isArg || isBuff || isType, result2 = skipIndexes ? baseTimes(value.length, String2) : [], length = result2.length;
            for (var key in value) {
              if ((inherited || hasOwnProperty.call(value, key)) && !(skipIndexes && (key == "length" || isBuff && (key == "offset" || key == "parent") || isType && (key == "buffer" || key == "byteLength" || key == "byteOffset") || isIndex(key, length)))) {
                result2.push(key);
              }
            }
            return result2;
          }
          function arraySample(array) {
            var length = array.length;
            return length ? array[baseRandom(0, length - 1)] : undefined2;
          }
          function arraySampleSize(array, n) {
            return shuffleSelf(copyArray(array), baseClamp(n, 0, array.length));
          }
          function arrayShuffle(array) {
            return shuffleSelf(copyArray(array));
          }
          function assignMergeValue(object, key, value) {
            if (value !== undefined2 && !eq(object[key], value) || value === undefined2 && !(key in object)) {
              baseAssignValue(object, key, value);
            }
          }
          function assignValue(object, key, value) {
            var objValue = object[key];
            if (!(hasOwnProperty.call(object, key) && eq(objValue, value)) || value === undefined2 && !(key in object)) {
              baseAssignValue(object, key, value);
            }
          }
          function assocIndexOf(array, key) {
            var length = array.length;
            while (length--) {
              if (eq(array[length][0], key)) {
                return length;
              }
            }
            return -1;
          }
          function baseAggregator(collection, setter, iteratee2, accumulator) {
            baseEach(collection, function(value, key, collection2) {
              setter(accumulator, value, iteratee2(value), collection2);
            });
            return accumulator;
          }
          function baseAssign(object, source) {
            return object && copyObject(source, keys(source), object);
          }
          function baseAssignIn(object, source) {
            return object && copyObject(source, keysIn(source), object);
          }
          function baseAssignValue(object, key, value) {
            if (key == "__proto__" && defineProperty) {
              defineProperty(object, key, {
                "configurable": true,
                "enumerable": true,
                "value": value,
                "writable": true
              });
            } else {
              object[key] = value;
            }
          }
          function baseAt(object, paths) {
            var index = -1, length = paths.length, result2 = Array2(length), skip = object == null;
            while (++index < length) {
              result2[index] = skip ? undefined2 : get(object, paths[index]);
            }
            return result2;
          }
          function baseClamp(number, lower, upper) {
            if (number === number) {
              if (upper !== undefined2) {
                number = number <= upper ? number : upper;
              }
              if (lower !== undefined2) {
                number = number >= lower ? number : lower;
              }
            }
            return number;
          }
          function baseClone(value, bitmask, customizer, key, object, stack) {
            var result2, isDeep = bitmask & CLONE_DEEP_FLAG, isFlat = bitmask & CLONE_FLAT_FLAG, isFull = bitmask & CLONE_SYMBOLS_FLAG;
            if (customizer) {
              result2 = object ? customizer(value, key, object, stack) : customizer(value);
            }
            if (result2 !== undefined2) {
              return result2;
            }
            if (!isObject(value)) {
              return value;
            }
            var isArr = isArray(value);
            if (isArr) {
              result2 = initCloneArray(value);
              if (!isDeep) {
                return copyArray(value, result2);
              }
            } else {
              var tag = getTag(value), isFunc = tag == funcTag || tag == genTag;
              if (isBuffer(value)) {
                return cloneBuffer(value, isDeep);
              }
              if (tag == objectTag || tag == argsTag || isFunc && !object) {
                result2 = isFlat || isFunc ? {} : initCloneObject(value);
                if (!isDeep) {
                  return isFlat ? copySymbolsIn(value, baseAssignIn(result2, value)) : copySymbols(value, baseAssign(result2, value));
                }
              } else {
                if (!cloneableTags[tag]) {
                  return object ? value : {};
                }
                result2 = initCloneByTag(value, tag, isDeep);
              }
            }
            stack || (stack = new Stack());
            var stacked = stack.get(value);
            if (stacked) {
              return stacked;
            }
            stack.set(value, result2);
            if (isSet(value)) {
              value.forEach(function(subValue) {
                result2.add(baseClone(subValue, bitmask, customizer, subValue, value, stack));
              });
            } else if (isMap(value)) {
              value.forEach(function(subValue, key2) {
                result2.set(key2, baseClone(subValue, bitmask, customizer, key2, value, stack));
              });
            }
            var keysFunc = isFull ? isFlat ? getAllKeysIn : getAllKeys : isFlat ? keysIn : keys;
            var props = isArr ? undefined2 : keysFunc(value);
            arrayEach(props || value, function(subValue, key2) {
              if (props) {
                key2 = subValue;
                subValue = value[key2];
              }
              assignValue(result2, key2, baseClone(subValue, bitmask, customizer, key2, value, stack));
            });
            return result2;
          }
          function baseConforms(source) {
            var props = keys(source);
            return function(object) {
              return baseConformsTo(object, source, props);
            };
          }
          function baseConformsTo(object, source, props) {
            var length = props.length;
            if (object == null) {
              return !length;
            }
            object = Object2(object);
            while (length--) {
              var key = props[length], predicate = source[key], value = object[key];
              if (value === undefined2 && !(key in object) || !predicate(value)) {
                return false;
              }
            }
            return true;
          }
          function baseDelay(func, wait, args) {
            if (typeof func != "function") {
              throw new TypeError2(FUNC_ERROR_TEXT);
            }
            return setTimeout2(function() {
              func.apply(undefined2, args);
            }, wait);
          }
          function baseDifference(array, values2, iteratee2, comparator) {
            var index = -1, includes2 = arrayIncludes, isCommon = true, length = array.length, result2 = [], valuesLength = values2.length;
            if (!length) {
              return result2;
            }
            if (iteratee2) {
              values2 = arrayMap(values2, baseUnary(iteratee2));
            }
            if (comparator) {
              includes2 = arrayIncludesWith;
              isCommon = false;
            } else if (values2.length >= LARGE_ARRAY_SIZE) {
              includes2 = cacheHas;
              isCommon = false;
              values2 = new SetCache(values2);
            }
            outer:
              while (++index < length) {
                var value = array[index], computed = iteratee2 == null ? value : iteratee2(value);
                value = comparator || value !== 0 ? value : 0;
                if (isCommon && computed === computed) {
                  var valuesIndex = valuesLength;
                  while (valuesIndex--) {
                    if (values2[valuesIndex] === computed) {
                      continue outer;
                    }
                  }
                  result2.push(value);
                } else if (!includes2(values2, computed, comparator)) {
                  result2.push(value);
                }
              }
            return result2;
          }
          var baseEach = createBaseEach(baseForOwn);
          var baseEachRight = createBaseEach(baseForOwnRight, true);
          function baseEvery(collection, predicate) {
            var result2 = true;
            baseEach(collection, function(value, index, collection2) {
              result2 = !!predicate(value, index, collection2);
              return result2;
            });
            return result2;
          }
          function baseExtremum(array, iteratee2, comparator) {
            var index = -1, length = array.length;
            while (++index < length) {
              var value = array[index], current = iteratee2(value);
              if (current != null && (computed === undefined2 ? current === current && !isSymbol(current) : comparator(current, computed))) {
                var computed = current, result2 = value;
              }
            }
            return result2;
          }
          function baseFill(array, value, start, end) {
            var length = array.length;
            start = toInteger(start);
            if (start < 0) {
              start = -start > length ? 0 : length + start;
            }
            end = end === undefined2 || end > length ? length : toInteger(end);
            if (end < 0) {
              end += length;
            }
            end = start > end ? 0 : toLength(end);
            while (start < end) {
              array[start++] = value;
            }
            return array;
          }
          function baseFilter(collection, predicate) {
            var result2 = [];
            baseEach(collection, function(value, index, collection2) {
              if (predicate(value, index, collection2)) {
                result2.push(value);
              }
            });
            return result2;
          }
          function baseFlatten(array, depth, predicate, isStrict, result2) {
            var index = -1, length = array.length;
            predicate || (predicate = isFlattenable);
            result2 || (result2 = []);
            while (++index < length) {
              var value = array[index];
              if (depth > 0 && predicate(value)) {
                if (depth > 1) {
                  baseFlatten(value, depth - 1, predicate, isStrict, result2);
                } else {
                  arrayPush(result2, value);
                }
              } else if (!isStrict) {
                result2[result2.length] = value;
              }
            }
            return result2;
          }
          var baseFor = createBaseFor();
          var baseForRight = createBaseFor(true);
          function baseForOwn(object, iteratee2) {
            return object && baseFor(object, iteratee2, keys);
          }
          function baseForOwnRight(object, iteratee2) {
            return object && baseForRight(object, iteratee2, keys);
          }
          function baseFunctions(object, props) {
            return arrayFilter(props, function(key) {
              return isFunction(object[key]);
            });
          }
          function baseGet(object, path) {
            path = castPath(path, object);
            var index = 0, length = path.length;
            while (object != null && index < length) {
              object = object[toKey(path[index++])];
            }
            return index && index == length ? object : undefined2;
          }
          function baseGetAllKeys(object, keysFunc, symbolsFunc) {
            var result2 = keysFunc(object);
            return isArray(object) ? result2 : arrayPush(result2, symbolsFunc(object));
          }
          function baseGetTag(value) {
            if (value == null) {
              return value === undefined2 ? undefinedTag : nullTag;
            }
            return symToStringTag && symToStringTag in Object2(value) ? getRawTag(value) : objectToString(value);
          }
          function baseGt(value, other) {
            return value > other;
          }
          function baseHas(object, key) {
            return object != null && hasOwnProperty.call(object, key);
          }
          function baseHasIn(object, key) {
            return object != null && key in Object2(object);
          }
          function baseInRange(number, start, end) {
            return number >= nativeMin(start, end) && number < nativeMax(start, end);
          }
          function baseIntersection(arrays, iteratee2, comparator) {
            var includes2 = comparator ? arrayIncludesWith : arrayIncludes, length = arrays[0].length, othLength = arrays.length, othIndex = othLength, caches = Array2(othLength), maxLength = Infinity, result2 = [];
            while (othIndex--) {
              var array = arrays[othIndex];
              if (othIndex && iteratee2) {
                array = arrayMap(array, baseUnary(iteratee2));
              }
              maxLength = nativeMin(array.length, maxLength);
              caches[othIndex] = !comparator && (iteratee2 || length >= 120 && array.length >= 120) ? new SetCache(othIndex && array) : undefined2;
            }
            array = arrays[0];
            var index = -1, seen = caches[0];
            outer:
              while (++index < length && result2.length < maxLength) {
                var value = array[index], computed = iteratee2 ? iteratee2(value) : value;
                value = comparator || value !== 0 ? value : 0;
                if (!(seen ? cacheHas(seen, computed) : includes2(result2, computed, comparator))) {
                  othIndex = othLength;
                  while (--othIndex) {
                    var cache = caches[othIndex];
                    if (!(cache ? cacheHas(cache, computed) : includes2(arrays[othIndex], computed, comparator))) {
                      continue outer;
                    }
                  }
                  if (seen) {
                    seen.push(computed);
                  }
                  result2.push(value);
                }
              }
            return result2;
          }
          function baseInverter(object, setter, iteratee2, accumulator) {
            baseForOwn(object, function(value, key, object2) {
              setter(accumulator, iteratee2(value), key, object2);
            });
            return accumulator;
          }
          function baseInvoke(object, path, args) {
            path = castPath(path, object);
            object = parent(object, path);
            var func = object == null ? object : object[toKey(last(path))];
            return func == null ? undefined2 : apply(func, object, args);
          }
          function baseIsArguments(value) {
            return isObjectLike(value) && baseGetTag(value) == argsTag;
          }
          function baseIsArrayBuffer(value) {
            return isObjectLike(value) && baseGetTag(value) == arrayBufferTag;
          }
          function baseIsDate(value) {
            return isObjectLike(value) && baseGetTag(value) == dateTag;
          }
          function baseIsEqual(value, other, bitmask, customizer, stack) {
            if (value === other) {
              return true;
            }
            if (value == null || other == null || !isObjectLike(value) && !isObjectLike(other)) {
              return value !== value && other !== other;
            }
            return baseIsEqualDeep(value, other, bitmask, customizer, baseIsEqual, stack);
          }
          function baseIsEqualDeep(object, other, bitmask, customizer, equalFunc, stack) {
            var objIsArr = isArray(object), othIsArr = isArray(other), objTag = objIsArr ? arrayTag : getTag(object), othTag = othIsArr ? arrayTag : getTag(other);
            objTag = objTag == argsTag ? objectTag : objTag;
            othTag = othTag == argsTag ? objectTag : othTag;
            var objIsObj = objTag == objectTag, othIsObj = othTag == objectTag, isSameTag = objTag == othTag;
            if (isSameTag && isBuffer(object)) {
              if (!isBuffer(other)) {
                return false;
              }
              objIsArr = true;
              objIsObj = false;
            }
            if (isSameTag && !objIsObj) {
              stack || (stack = new Stack());
              return objIsArr || isTypedArray(object) ? equalArrays(object, other, bitmask, customizer, equalFunc, stack) : equalByTag(object, other, objTag, bitmask, customizer, equalFunc, stack);
            }
            if (!(bitmask & COMPARE_PARTIAL_FLAG)) {
              var objIsWrapped = objIsObj && hasOwnProperty.call(object, "__wrapped__"), othIsWrapped = othIsObj && hasOwnProperty.call(other, "__wrapped__");
              if (objIsWrapped || othIsWrapped) {
                var objUnwrapped = objIsWrapped ? object.value() : object, othUnwrapped = othIsWrapped ? other.value() : other;
                stack || (stack = new Stack());
                return equalFunc(objUnwrapped, othUnwrapped, bitmask, customizer, stack);
              }
            }
            if (!isSameTag) {
              return false;
            }
            stack || (stack = new Stack());
            return equalObjects(object, other, bitmask, customizer, equalFunc, stack);
          }
          function baseIsMap(value) {
            return isObjectLike(value) && getTag(value) == mapTag;
          }
          function baseIsMatch(object, source, matchData, customizer) {
            var index = matchData.length, length = index, noCustomizer = !customizer;
            if (object == null) {
              return !length;
            }
            object = Object2(object);
            while (index--) {
              var data = matchData[index];
              if (noCustomizer && data[2] ? data[1] !== object[data[0]] : !(data[0] in object)) {
                return false;
              }
            }
            while (++index < length) {
              data = matchData[index];
              var key = data[0], objValue = object[key], srcValue = data[1];
              if (noCustomizer && data[2]) {
                if (objValue === undefined2 && !(key in object)) {
                  return false;
                }
              } else {
                var stack = new Stack();
                if (customizer) {
                  var result2 = customizer(objValue, srcValue, key, object, source, stack);
                }
                if (!(result2 === undefined2 ? baseIsEqual(srcValue, objValue, COMPARE_PARTIAL_FLAG | COMPARE_UNORDERED_FLAG, customizer, stack) : result2)) {
                  return false;
                }
              }
            }
            return true;
          }
          function baseIsNative(value) {
            if (!isObject(value) || isMasked(value)) {
              return false;
            }
            var pattern = isFunction(value) ? reIsNative : reIsHostCtor;
            return pattern.test(toSource(value));
          }
          function baseIsRegExp(value) {
            return isObjectLike(value) && baseGetTag(value) == regexpTag;
          }
          function baseIsSet(value) {
            return isObjectLike(value) && getTag(value) == setTag;
          }
          function baseIsTypedArray(value) {
            return isObjectLike(value) && isLength(value.length) && !!typedArrayTags[baseGetTag(value)];
          }
          function baseIteratee(value) {
            if (typeof value == "function") {
              return value;
            }
            if (value == null) {
              return identity;
            }
            if (typeof value == "object") {
              return isArray(value) ? baseMatchesProperty(value[0], value[1]) : baseMatches(value);
            }
            return property(value);
          }
          function baseKeys(object) {
            if (!isPrototype(object)) {
              return nativeKeys(object);
            }
            var result2 = [];
            for (var key in Object2(object)) {
              if (hasOwnProperty.call(object, key) && key != "constructor") {
                result2.push(key);
              }
            }
            return result2;
          }
          function baseKeysIn(object) {
            if (!isObject(object)) {
              return nativeKeysIn(object);
            }
            var isProto = isPrototype(object), result2 = [];
            for (var key in object) {
              if (!(key == "constructor" && (isProto || !hasOwnProperty.call(object, key)))) {
                result2.push(key);
              }
            }
            return result2;
          }
          function baseLt(value, other) {
            return value < other;
          }
          function baseMap(collection, iteratee2) {
            var index = -1, result2 = isArrayLike(collection) ? Array2(collection.length) : [];
            baseEach(collection, function(value, key, collection2) {
              result2[++index] = iteratee2(value, key, collection2);
            });
            return result2;
          }
          function baseMatches(source) {
            var matchData = getMatchData(source);
            if (matchData.length == 1 && matchData[0][2]) {
              return matchesStrictComparable(matchData[0][0], matchData[0][1]);
            }
            return function(object) {
              return object === source || baseIsMatch(object, source, matchData);
            };
          }
          function baseMatchesProperty(path, srcValue) {
            if (isKey(path) && isStrictComparable(srcValue)) {
              return matchesStrictComparable(toKey(path), srcValue);
            }
            return function(object) {
              var objValue = get(object, path);
              return objValue === undefined2 && objValue === srcValue ? hasIn(object, path) : baseIsEqual(srcValue, objValue, COMPARE_PARTIAL_FLAG | COMPARE_UNORDERED_FLAG);
            };
          }
          function baseMerge(object, source, srcIndex, customizer, stack) {
            if (object === source) {
              return;
            }
            baseFor(source, function(srcValue, key) {
              stack || (stack = new Stack());
              if (isObject(srcValue)) {
                baseMergeDeep(object, source, key, srcIndex, baseMerge, customizer, stack);
              } else {
                var newValue = customizer ? customizer(safeGet(object, key), srcValue, key + "", object, source, stack) : undefined2;
                if (newValue === undefined2) {
                  newValue = srcValue;
                }
                assignMergeValue(object, key, newValue);
              }
            }, keysIn);
          }
          function baseMergeDeep(object, source, key, srcIndex, mergeFunc, customizer, stack) {
            var objValue = safeGet(object, key), srcValue = safeGet(source, key), stacked = stack.get(srcValue);
            if (stacked) {
              assignMergeValue(object, key, stacked);
              return;
            }
            var newValue = customizer ? customizer(objValue, srcValue, key + "", object, source, stack) : undefined2;
            var isCommon = newValue === undefined2;
            if (isCommon) {
              var isArr = isArray(srcValue), isBuff = !isArr && isBuffer(srcValue), isTyped = !isArr && !isBuff && isTypedArray(srcValue);
              newValue = srcValue;
              if (isArr || isBuff || isTyped) {
                if (isArray(objValue)) {
                  newValue = objValue;
                } else if (isArrayLikeObject(objValue)) {
                  newValue = copyArray(objValue);
                } else if (isBuff) {
                  isCommon = false;
                  newValue = cloneBuffer(srcValue, true);
                } else if (isTyped) {
                  isCommon = false;
                  newValue = cloneTypedArray(srcValue, true);
                } else {
                  newValue = [];
                }
              } else if (isPlainObject(srcValue) || isArguments(srcValue)) {
                newValue = objValue;
                if (isArguments(objValue)) {
                  newValue = toPlainObject(objValue);
                } else if (!isObject(objValue) || isFunction(objValue)) {
                  newValue = initCloneObject(srcValue);
                }
              } else {
                isCommon = false;
              }
            }
            if (isCommon) {
              stack.set(srcValue, newValue);
              mergeFunc(newValue, srcValue, srcIndex, customizer, stack);
              stack["delete"](srcValue);
            }
            assignMergeValue(object, key, newValue);
          }
          function baseNth(array, n) {
            var length = array.length;
            if (!length) {
              return;
            }
            n += n < 0 ? length : 0;
            return isIndex(n, length) ? array[n] : undefined2;
          }
          function baseOrderBy(collection, iteratees, orders) {
            if (iteratees.length) {
              iteratees = arrayMap(iteratees, function(iteratee2) {
                if (isArray(iteratee2)) {
                  return function(value) {
                    return baseGet(value, iteratee2.length === 1 ? iteratee2[0] : iteratee2);
                  };
                }
                return iteratee2;
              });
            } else {
              iteratees = [identity];
            }
            var index = -1;
            iteratees = arrayMap(iteratees, baseUnary(getIteratee()));
            var result2 = baseMap(collection, function(value, key, collection2) {
              var criteria = arrayMap(iteratees, function(iteratee2) {
                return iteratee2(value);
              });
              return { "criteria": criteria, "index": ++index, "value": value };
            });
            return baseSortBy(result2, function(object, other) {
              return compareMultiple(object, other, orders);
            });
          }
          function basePick(object, paths) {
            return basePickBy(object, paths, function(value, path) {
              return hasIn(object, path);
            });
          }
          function basePickBy(object, paths, predicate) {
            var index = -1, length = paths.length, result2 = {};
            while (++index < length) {
              var path = paths[index], value = baseGet(object, path);
              if (predicate(value, path)) {
                baseSet(result2, castPath(path, object), value);
              }
            }
            return result2;
          }
          function basePropertyDeep(path) {
            return function(object) {
              return baseGet(object, path);
            };
          }
          function basePullAll(array, values2, iteratee2, comparator) {
            var indexOf2 = comparator ? baseIndexOfWith : baseIndexOf, index = -1, length = values2.length, seen = array;
            if (array === values2) {
              values2 = copyArray(values2);
            }
            if (iteratee2) {
              seen = arrayMap(array, baseUnary(iteratee2));
            }
            while (++index < length) {
              var fromIndex = 0, value = values2[index], computed = iteratee2 ? iteratee2(value) : value;
              while ((fromIndex = indexOf2(seen, computed, fromIndex, comparator)) > -1) {
                if (seen !== array) {
                  splice.call(seen, fromIndex, 1);
                }
                splice.call(array, fromIndex, 1);
              }
            }
            return array;
          }
          function basePullAt(array, indexes) {
            var length = array ? indexes.length : 0, lastIndex = length - 1;
            while (length--) {
              var index = indexes[length];
              if (length == lastIndex || index !== previous) {
                var previous = index;
                if (isIndex(index)) {
                  splice.call(array, index, 1);
                } else {
                  baseUnset(array, index);
                }
              }
            }
            return array;
          }
          function baseRandom(lower, upper) {
            return lower + nativeFloor(nativeRandom() * (upper - lower + 1));
          }
          function baseRange(start, end, step, fromRight) {
            var index = -1, length = nativeMax(nativeCeil((end - start) / (step || 1)), 0), result2 = Array2(length);
            while (length--) {
              result2[fromRight ? length : ++index] = start;
              start += step;
            }
            return result2;
          }
          function baseRepeat(string, n) {
            var result2 = "";
            if (!string || n < 1 || n > MAX_SAFE_INTEGER) {
              return result2;
            }
            do {
              if (n % 2) {
                result2 += string;
              }
              n = nativeFloor(n / 2);
              if (n) {
                string += string;
              }
            } while (n);
            return result2;
          }
          function baseRest(func, start) {
            return setToString(overRest(func, start, identity), func + "");
          }
          function baseSample(collection) {
            return arraySample(values(collection));
          }
          function baseSampleSize(collection, n) {
            var array = values(collection);
            return shuffleSelf(array, baseClamp(n, 0, array.length));
          }
          function baseSet(object, path, value, customizer) {
            if (!isObject(object)) {
              return object;
            }
            path = castPath(path, object);
            var index = -1, length = path.length, lastIndex = length - 1, nested = object;
            while (nested != null && ++index < length) {
              var key = toKey(path[index]), newValue = value;
              if (key === "__proto__" || key === "constructor" || key === "prototype") {
                return object;
              }
              if (index != lastIndex) {
                var objValue = nested[key];
                newValue = customizer ? customizer(objValue, key, nested) : undefined2;
                if (newValue === undefined2) {
                  newValue = isObject(objValue) ? objValue : isIndex(path[index + 1]) ? [] : {};
                }
              }
              assignValue(nested, key, newValue);
              nested = nested[key];
            }
            return object;
          }
          var baseSetData = !metaMap ? identity : function(func, data) {
            metaMap.set(func, data);
            return func;
          };
          var baseSetToString = !defineProperty ? identity : function(func, string) {
            return defineProperty(func, "toString", {
              "configurable": true,
              "enumerable": false,
              "value": constant(string),
              "writable": true
            });
          };
          function baseShuffle(collection) {
            return shuffleSelf(values(collection));
          }
          function baseSlice(array, start, end) {
            var index = -1, length = array.length;
            if (start < 0) {
              start = -start > length ? 0 : length + start;
            }
            end = end > length ? length : end;
            if (end < 0) {
              end += length;
            }
            length = start > end ? 0 : end - start >>> 0;
            start >>>= 0;
            var result2 = Array2(length);
            while (++index < length) {
              result2[index] = array[index + start];
            }
            return result2;
          }
          function baseSome(collection, predicate) {
            var result2;
            baseEach(collection, function(value, index, collection2) {
              result2 = predicate(value, index, collection2);
              return !result2;
            });
            return !!result2;
          }
          function baseSortedIndex(array, value, retHighest) {
            var low = 0, high = array == null ? low : array.length;
            if (typeof value == "number" && value === value && high <= HALF_MAX_ARRAY_LENGTH) {
              while (low < high) {
                var mid = low + high >>> 1, computed = array[mid];
                if (computed !== null && !isSymbol(computed) && (retHighest ? computed <= value : computed < value)) {
                  low = mid + 1;
                } else {
                  high = mid;
                }
              }
              return high;
            }
            return baseSortedIndexBy(array, value, identity, retHighest);
          }
          function baseSortedIndexBy(array, value, iteratee2, retHighest) {
            var low = 0, high = array == null ? 0 : array.length;
            if (high === 0) {
              return 0;
            }
            value = iteratee2(value);
            var valIsNaN = value !== value, valIsNull = value === null, valIsSymbol = isSymbol(value), valIsUndefined = value === undefined2;
            while (low < high) {
              var mid = nativeFloor((low + high) / 2), computed = iteratee2(array[mid]), othIsDefined = computed !== undefined2, othIsNull = computed === null, othIsReflexive = computed === computed, othIsSymbol = isSymbol(computed);
              if (valIsNaN) {
                var setLow = retHighest || othIsReflexive;
              } else if (valIsUndefined) {
                setLow = othIsReflexive && (retHighest || othIsDefined);
              } else if (valIsNull) {
                setLow = othIsReflexive && othIsDefined && (retHighest || !othIsNull);
              } else if (valIsSymbol) {
                setLow = othIsReflexive && othIsDefined && !othIsNull && (retHighest || !othIsSymbol);
              } else if (othIsNull || othIsSymbol) {
                setLow = false;
              } else {
                setLow = retHighest ? computed <= value : computed < value;
              }
              if (setLow) {
                low = mid + 1;
              } else {
                high = mid;
              }
            }
            return nativeMin(high, MAX_ARRAY_INDEX);
          }
          function baseSortedUniq(array, iteratee2) {
            var index = -1, length = array.length, resIndex = 0, result2 = [];
            while (++index < length) {
              var value = array[index], computed = iteratee2 ? iteratee2(value) : value;
              if (!index || !eq(computed, seen)) {
                var seen = computed;
                result2[resIndex++] = value === 0 ? 0 : value;
              }
            }
            return result2;
          }
          function baseToNumber(value) {
            if (typeof value == "number") {
              return value;
            }
            if (isSymbol(value)) {
              return NAN;
            }
            return +value;
          }
          function baseToString(value) {
            if (typeof value == "string") {
              return value;
            }
            if (isArray(value)) {
              return arrayMap(value, baseToString) + "";
            }
            if (isSymbol(value)) {
              return symbolToString ? symbolToString.call(value) : "";
            }
            var result2 = value + "";
            return result2 == "0" && 1 / value == -INFINITY ? "-0" : result2;
          }
          function baseUniq(array, iteratee2, comparator) {
            var index = -1, includes2 = arrayIncludes, length = array.length, isCommon = true, result2 = [], seen = result2;
            if (comparator) {
              isCommon = false;
              includes2 = arrayIncludesWith;
            } else if (length >= LARGE_ARRAY_SIZE) {
              var set2 = iteratee2 ? null : createSet(array);
              if (set2) {
                return setToArray(set2);
              }
              isCommon = false;
              includes2 = cacheHas;
              seen = new SetCache();
            } else {
              seen = iteratee2 ? [] : result2;
            }
            outer:
              while (++index < length) {
                var value = array[index], computed = iteratee2 ? iteratee2(value) : value;
                value = comparator || value !== 0 ? value : 0;
                if (isCommon && computed === computed) {
                  var seenIndex = seen.length;
                  while (seenIndex--) {
                    if (seen[seenIndex] === computed) {
                      continue outer;
                    }
                  }
                  if (iteratee2) {
                    seen.push(computed);
                  }
                  result2.push(value);
                } else if (!includes2(seen, computed, comparator)) {
                  if (seen !== result2) {
                    seen.push(computed);
                  }
                  result2.push(value);
                }
              }
            return result2;
          }
          function baseUnset(object, path) {
            path = castPath(path, object);
            object = parent(object, path);
            return object == null || delete object[toKey(last(path))];
          }
          function baseUpdate(object, path, updater, customizer) {
            return baseSet(object, path, updater(baseGet(object, path)), customizer);
          }
          function baseWhile(array, predicate, isDrop, fromRight) {
            var length = array.length, index = fromRight ? length : -1;
            while ((fromRight ? index-- : ++index < length) && predicate(array[index], index, array)) {
            }
            return isDrop ? baseSlice(array, fromRight ? 0 : index, fromRight ? index + 1 : length) : baseSlice(array, fromRight ? index + 1 : 0, fromRight ? length : index);
          }
          function baseWrapperValue(value, actions) {
            var result2 = value;
            if (result2 instanceof LazyWrapper) {
              result2 = result2.value();
            }
            return arrayReduce(actions, function(result3, action) {
              return action.func.apply(action.thisArg, arrayPush([result3], action.args));
            }, result2);
          }
          function baseXor(arrays, iteratee2, comparator) {
            var length = arrays.length;
            if (length < 2) {
              return length ? baseUniq(arrays[0]) : [];
            }
            var index = -1, result2 = Array2(length);
            while (++index < length) {
              var array = arrays[index], othIndex = -1;
              while (++othIndex < length) {
                if (othIndex != index) {
                  result2[index] = baseDifference(result2[index] || array, arrays[othIndex], iteratee2, comparator);
                }
              }
            }
            return baseUniq(baseFlatten(result2, 1), iteratee2, comparator);
          }
          function baseZipObject(props, values2, assignFunc) {
            var index = -1, length = props.length, valsLength = values2.length, result2 = {};
            while (++index < length) {
              var value = index < valsLength ? values2[index] : undefined2;
              assignFunc(result2, props[index], value);
            }
            return result2;
          }
          function castArrayLikeObject(value) {
            return isArrayLikeObject(value) ? value : [];
          }
          function castFunction(value) {
            return typeof value == "function" ? value : identity;
          }
          function castPath(value, object) {
            if (isArray(value)) {
              return value;
            }
            return isKey(value, object) ? [value] : stringToPath(toString(value));
          }
          var castRest = baseRest;
          function castSlice(array, start, end) {
            var length = array.length;
            end = end === undefined2 ? length : end;
            return !start && end >= length ? array : baseSlice(array, start, end);
          }
          var clearTimeout2 = ctxClearTimeout || function(id) {
            return root.clearTimeout(id);
          };
          function cloneBuffer(buffer, isDeep) {
            if (isDeep) {
              return buffer.slice();
            }
            var length = buffer.length, result2 = allocUnsafe ? allocUnsafe(length) : new buffer.constructor(length);
            buffer.copy(result2);
            return result2;
          }
          function cloneArrayBuffer(arrayBuffer) {
            var result2 = new arrayBuffer.constructor(arrayBuffer.byteLength);
            new Uint8Array2(result2).set(new Uint8Array2(arrayBuffer));
            return result2;
          }
          function cloneDataView(dataView, isDeep) {
            var buffer = isDeep ? cloneArrayBuffer(dataView.buffer) : dataView.buffer;
            return new dataView.constructor(buffer, dataView.byteOffset, dataView.byteLength);
          }
          function cloneRegExp(regexp) {
            var result2 = new regexp.constructor(regexp.source, reFlags.exec(regexp));
            result2.lastIndex = regexp.lastIndex;
            return result2;
          }
          function cloneSymbol(symbol) {
            return symbolValueOf ? Object2(symbolValueOf.call(symbol)) : {};
          }
          function cloneTypedArray(typedArray, isDeep) {
            var buffer = isDeep ? cloneArrayBuffer(typedArray.buffer) : typedArray.buffer;
            return new typedArray.constructor(buffer, typedArray.byteOffset, typedArray.length);
          }
          function compareAscending(value, other) {
            if (value !== other) {
              var valIsDefined = value !== undefined2, valIsNull = value === null, valIsReflexive = value === value, valIsSymbol = isSymbol(value);
              var othIsDefined = other !== undefined2, othIsNull = other === null, othIsReflexive = other === other, othIsSymbol = isSymbol(other);
              if (!othIsNull && !othIsSymbol && !valIsSymbol && value > other || valIsSymbol && othIsDefined && othIsReflexive && !othIsNull && !othIsSymbol || valIsNull && othIsDefined && othIsReflexive || !valIsDefined && othIsReflexive || !valIsReflexive) {
                return 1;
              }
              if (!valIsNull && !valIsSymbol && !othIsSymbol && value < other || othIsSymbol && valIsDefined && valIsReflexive && !valIsNull && !valIsSymbol || othIsNull && valIsDefined && valIsReflexive || !othIsDefined && valIsReflexive || !othIsReflexive) {
                return -1;
              }
            }
            return 0;
          }
          function compareMultiple(object, other, orders) {
            var index = -1, objCriteria = object.criteria, othCriteria = other.criteria, length = objCriteria.length, ordersLength = orders.length;
            while (++index < length) {
              var result2 = compareAscending(objCriteria[index], othCriteria[index]);
              if (result2) {
                if (index >= ordersLength) {
                  return result2;
                }
                var order = orders[index];
                return result2 * (order == "desc" ? -1 : 1);
              }
            }
            return object.index - other.index;
          }
          function composeArgs(args, partials, holders, isCurried) {
            var argsIndex = -1, argsLength = args.length, holdersLength = holders.length, leftIndex = -1, leftLength = partials.length, rangeLength = nativeMax(argsLength - holdersLength, 0), result2 = Array2(leftLength + rangeLength), isUncurried = !isCurried;
            while (++leftIndex < leftLength) {
              result2[leftIndex] = partials[leftIndex];
            }
            while (++argsIndex < holdersLength) {
              if (isUncurried || argsIndex < argsLength) {
                result2[holders[argsIndex]] = args[argsIndex];
              }
            }
            while (rangeLength--) {
              result2[leftIndex++] = args[argsIndex++];
            }
            return result2;
          }
          function composeArgsRight(args, partials, holders, isCurried) {
            var argsIndex = -1, argsLength = args.length, holdersIndex = -1, holdersLength = holders.length, rightIndex = -1, rightLength = partials.length, rangeLength = nativeMax(argsLength - holdersLength, 0), result2 = Array2(rangeLength + rightLength), isUncurried = !isCurried;
            while (++argsIndex < rangeLength) {
              result2[argsIndex] = args[argsIndex];
            }
            var offset = argsIndex;
            while (++rightIndex < rightLength) {
              result2[offset + rightIndex] = partials[rightIndex];
            }
            while (++holdersIndex < holdersLength) {
              if (isUncurried || argsIndex < argsLength) {
                result2[offset + holders[holdersIndex]] = args[argsIndex++];
              }
            }
            return result2;
          }
          function copyArray(source, array) {
            var index = -1, length = source.length;
            array || (array = Array2(length));
            while (++index < length) {
              array[index] = source[index];
            }
            return array;
          }
          function copyObject(source, props, object, customizer) {
            var isNew = !object;
            object || (object = {});
            var index = -1, length = props.length;
            while (++index < length) {
              var key = props[index];
              var newValue = customizer ? customizer(object[key], source[key], key, object, source) : undefined2;
              if (newValue === undefined2) {
                newValue = source[key];
              }
              if (isNew) {
                baseAssignValue(object, key, newValue);
              } else {
                assignValue(object, key, newValue);
              }
            }
            return object;
          }
          function copySymbols(source, object) {
            return copyObject(source, getSymbols(source), object);
          }
          function copySymbolsIn(source, object) {
            return copyObject(source, getSymbolsIn(source), object);
          }
          function createAggregator(setter, initializer) {
            return function(collection, iteratee2) {
              var func = isArray(collection) ? arrayAggregator : baseAggregator, accumulator = initializer ? initializer() : {};
              return func(collection, setter, getIteratee(iteratee2, 2), accumulator);
            };
          }
          function createAssigner(assigner) {
            return baseRest(function(object, sources) {
              var index = -1, length = sources.length, customizer = length > 1 ? sources[length - 1] : undefined2, guard = length > 2 ? sources[2] : undefined2;
              customizer = assigner.length > 3 && typeof customizer == "function" ? (length--, customizer) : undefined2;
              if (guard && isIterateeCall(sources[0], sources[1], guard)) {
                customizer = length < 3 ? undefined2 : customizer;
                length = 1;
              }
              object = Object2(object);
              while (++index < length) {
                var source = sources[index];
                if (source) {
                  assigner(object, source, index, customizer);
                }
              }
              return object;
            });
          }
          function createBaseEach(eachFunc, fromRight) {
            return function(collection, iteratee2) {
              if (collection == null) {
                return collection;
              }
              if (!isArrayLike(collection)) {
                return eachFunc(collection, iteratee2);
              }
              var length = collection.length, index = fromRight ? length : -1, iterable = Object2(collection);
              while (fromRight ? index-- : ++index < length) {
                if (iteratee2(iterable[index], index, iterable) === false) {
                  break;
                }
              }
              return collection;
            };
          }
          function createBaseFor(fromRight) {
            return function(object, iteratee2, keysFunc) {
              var index = -1, iterable = Object2(object), props = keysFunc(object), length = props.length;
              while (length--) {
                var key = props[fromRight ? length : ++index];
                if (iteratee2(iterable[key], key, iterable) === false) {
                  break;
                }
              }
              return object;
            };
          }
          function createBind(func, bitmask, thisArg) {
            var isBind = bitmask & WRAP_BIND_FLAG, Ctor = createCtor(func);
            function wrapper() {
              var fn = this && this !== root && this instanceof wrapper ? Ctor : func;
              return fn.apply(isBind ? thisArg : this, arguments);
            }
            return wrapper;
          }
          function createCaseFirst(methodName) {
            return function(string) {
              string = toString(string);
              var strSymbols = hasUnicode(string) ? stringToArray(string) : undefined2;
              var chr = strSymbols ? strSymbols[0] : string.charAt(0);
              var trailing = strSymbols ? castSlice(strSymbols, 1).join("") : string.slice(1);
              return chr[methodName]() + trailing;
            };
          }
          function createCompounder(callback) {
            return function(string) {
              return arrayReduce(words(deburr(string).replace(reApos, "")), callback, "");
            };
          }
          function createCtor(Ctor) {
            return function() {
              var args = arguments;
              switch (args.length) {
                case 0:
                  return new Ctor();
                case 1:
                  return new Ctor(args[0]);
                case 2:
                  return new Ctor(args[0], args[1]);
                case 3:
                  return new Ctor(args[0], args[1], args[2]);
                case 4:
                  return new Ctor(args[0], args[1], args[2], args[3]);
                case 5:
                  return new Ctor(args[0], args[1], args[2], args[3], args[4]);
                case 6:
                  return new Ctor(args[0], args[1], args[2], args[3], args[4], args[5]);
                case 7:
                  return new Ctor(args[0], args[1], args[2], args[3], args[4], args[5], args[6]);
              }
              var thisBinding = baseCreate(Ctor.prototype), result2 = Ctor.apply(thisBinding, args);
              return isObject(result2) ? result2 : thisBinding;
            };
          }
          function createCurry(func, bitmask, arity) {
            var Ctor = createCtor(func);
            function wrapper() {
              var length = arguments.length, args = Array2(length), index = length, placeholder = getHolder(wrapper);
              while (index--) {
                args[index] = arguments[index];
              }
              var holders = length < 3 && args[0] !== placeholder && args[length - 1] !== placeholder ? [] : replaceHolders(args, placeholder);
              length -= holders.length;
              if (length < arity) {
                return createRecurry(
                  func,
                  bitmask,
                  createHybrid,
                  wrapper.placeholder,
                  undefined2,
                  args,
                  holders,
                  undefined2,
                  undefined2,
                  arity - length
                );
              }
              var fn = this && this !== root && this instanceof wrapper ? Ctor : func;
              return apply(fn, this, args);
            }
            return wrapper;
          }
          function createFind(findIndexFunc) {
            return function(collection, predicate, fromIndex) {
              var iterable = Object2(collection);
              if (!isArrayLike(collection)) {
                var iteratee2 = getIteratee(predicate, 3);
                collection = keys(collection);
                predicate = function(key) {
                  return iteratee2(iterable[key], key, iterable);
                };
              }
              var index = findIndexFunc(collection, predicate, fromIndex);
              return index > -1 ? iterable[iteratee2 ? collection[index] : index] : undefined2;
            };
          }
          function createFlow(fromRight) {
            return flatRest(function(funcs) {
              var length = funcs.length, index = length, prereq = LodashWrapper.prototype.thru;
              if (fromRight) {
                funcs.reverse();
              }
              while (index--) {
                var func = funcs[index];
                if (typeof func != "function") {
                  throw new TypeError2(FUNC_ERROR_TEXT);
                }
                if (prereq && !wrapper && getFuncName(func) == "wrapper") {
                  var wrapper = new LodashWrapper([], true);
                }
              }
              index = wrapper ? index : length;
              while (++index < length) {
                func = funcs[index];
                var funcName = getFuncName(func), data = funcName == "wrapper" ? getData(func) : undefined2;
                if (data && isLaziable(data[0]) && data[1] == (WRAP_ARY_FLAG | WRAP_CURRY_FLAG | WRAP_PARTIAL_FLAG | WRAP_REARG_FLAG) && !data[4].length && data[9] == 1) {
                  wrapper = wrapper[getFuncName(data[0])].apply(wrapper, data[3]);
                } else {
                  wrapper = func.length == 1 && isLaziable(func) ? wrapper[funcName]() : wrapper.thru(func);
                }
              }
              return function() {
                var args = arguments, value = args[0];
                if (wrapper && args.length == 1 && isArray(value)) {
                  return wrapper.plant(value).value();
                }
                var index2 = 0, result2 = length ? funcs[index2].apply(this, args) : value;
                while (++index2 < length) {
                  result2 = funcs[index2].call(this, result2);
                }
                return result2;
              };
            });
          }
          function createHybrid(func, bitmask, thisArg, partials, holders, partialsRight, holdersRight, argPos, ary2, arity) {
            var isAry = bitmask & WRAP_ARY_FLAG, isBind = bitmask & WRAP_BIND_FLAG, isBindKey = bitmask & WRAP_BIND_KEY_FLAG, isCurried = bitmask & (WRAP_CURRY_FLAG | WRAP_CURRY_RIGHT_FLAG), isFlip = bitmask & WRAP_FLIP_FLAG, Ctor = isBindKey ? undefined2 : createCtor(func);
            function wrapper() {
              var length = arguments.length, args = Array2(length), index = length;
              while (index--) {
                args[index] = arguments[index];
              }
              if (isCurried) {
                var placeholder = getHolder(wrapper), holdersCount = countHolders(args, placeholder);
              }
              if (partials) {
                args = composeArgs(args, partials, holders, isCurried);
              }
              if (partialsRight) {
                args = composeArgsRight(args, partialsRight, holdersRight, isCurried);
              }
              length -= holdersCount;
              if (isCurried && length < arity) {
                var newHolders = replaceHolders(args, placeholder);
                return createRecurry(
                  func,
                  bitmask,
                  createHybrid,
                  wrapper.placeholder,
                  thisArg,
                  args,
                  newHolders,
                  argPos,
                  ary2,
                  arity - length
                );
              }
              var thisBinding = isBind ? thisArg : this, fn = isBindKey ? thisBinding[func] : func;
              length = args.length;
              if (argPos) {
                args = reorder(args, argPos);
              } else if (isFlip && length > 1) {
                args.reverse();
              }
              if (isAry && ary2 < length) {
                args.length = ary2;
              }
              if (this && this !== root && this instanceof wrapper) {
                fn = Ctor || createCtor(fn);
              }
              return fn.apply(thisBinding, args);
            }
            return wrapper;
          }
          function createInverter(setter, toIteratee) {
            return function(object, iteratee2) {
              return baseInverter(object, setter, toIteratee(iteratee2), {});
            };
          }
          function createMathOperation(operator, defaultValue) {
            return function(value, other) {
              var result2;
              if (value === undefined2 && other === undefined2) {
                return defaultValue;
              }
              if (value !== undefined2) {
                result2 = value;
              }
              if (other !== undefined2) {
                if (result2 === undefined2) {
                  return other;
                }
                if (typeof value == "string" || typeof other == "string") {
                  value = baseToString(value);
                  other = baseToString(other);
                } else {
                  value = baseToNumber(value);
                  other = baseToNumber(other);
                }
                result2 = operator(value, other);
              }
              return result2;
            };
          }
          function createOver(arrayFunc) {
            return flatRest(function(iteratees) {
              iteratees = arrayMap(iteratees, baseUnary(getIteratee()));
              return baseRest(function(args) {
                var thisArg = this;
                return arrayFunc(iteratees, function(iteratee2) {
                  return apply(iteratee2, thisArg, args);
                });
              });
            });
          }
          function createPadding(length, chars) {
            chars = chars === undefined2 ? " " : baseToString(chars);
            var charsLength = chars.length;
            if (charsLength < 2) {
              return charsLength ? baseRepeat(chars, length) : chars;
            }
            var result2 = baseRepeat(chars, nativeCeil(length / stringSize(chars)));
            return hasUnicode(chars) ? castSlice(stringToArray(result2), 0, length).join("") : result2.slice(0, length);
          }
          function createPartial(func, bitmask, thisArg, partials) {
            var isBind = bitmask & WRAP_BIND_FLAG, Ctor = createCtor(func);
            function wrapper() {
              var argsIndex = -1, argsLength = arguments.length, leftIndex = -1, leftLength = partials.length, args = Array2(leftLength + argsLength), fn = this && this !== root && this instanceof wrapper ? Ctor : func;
              while (++leftIndex < leftLength) {
                args[leftIndex] = partials[leftIndex];
              }
              while (argsLength--) {
                args[leftIndex++] = arguments[++argsIndex];
              }
              return apply(fn, isBind ? thisArg : this, args);
            }
            return wrapper;
          }
          function createRange(fromRight) {
            return function(start, end, step) {
              if (step && typeof step != "number" && isIterateeCall(start, end, step)) {
                end = step = undefined2;
              }
              start = toFinite(start);
              if (end === undefined2) {
                end = start;
                start = 0;
              } else {
                end = toFinite(end);
              }
              step = step === undefined2 ? start < end ? 1 : -1 : toFinite(step);
              return baseRange(start, end, step, fromRight);
            };
          }
          function createRelationalOperation(operator) {
            return function(value, other) {
              if (!(typeof value == "string" && typeof other == "string")) {
                value = toNumber(value);
                other = toNumber(other);
              }
              return operator(value, other);
            };
          }
          function createRecurry(func, bitmask, wrapFunc, placeholder, thisArg, partials, holders, argPos, ary2, arity) {
            var isCurry = bitmask & WRAP_CURRY_FLAG, newHolders = isCurry ? holders : undefined2, newHoldersRight = isCurry ? undefined2 : holders, newPartials = isCurry ? partials : undefined2, newPartialsRight = isCurry ? undefined2 : partials;
            bitmask |= isCurry ? WRAP_PARTIAL_FLAG : WRAP_PARTIAL_RIGHT_FLAG;
            bitmask &= ~(isCurry ? WRAP_PARTIAL_RIGHT_FLAG : WRAP_PARTIAL_FLAG);
            if (!(bitmask & WRAP_CURRY_BOUND_FLAG)) {
              bitmask &= ~(WRAP_BIND_FLAG | WRAP_BIND_KEY_FLAG);
            }
            var newData = [
              func,
              bitmask,
              thisArg,
              newPartials,
              newHolders,
              newPartialsRight,
              newHoldersRight,
              argPos,
              ary2,
              arity
            ];
            var result2 = wrapFunc.apply(undefined2, newData);
            if (isLaziable(func)) {
              setData(result2, newData);
            }
            result2.placeholder = placeholder;
            return setWrapToString(result2, func, bitmask);
          }
          function createRound(methodName) {
            var func = Math2[methodName];
            return function(number, precision) {
              number = toNumber(number);
              precision = precision == null ? 0 : nativeMin(toInteger(precision), 292);
              if (precision && nativeIsFinite(number)) {
                var pair = (toString(number) + "e").split("e"), value = func(pair[0] + "e" + (+pair[1] + precision));
                pair = (toString(value) + "e").split("e");
                return +(pair[0] + "e" + (+pair[1] - precision));
              }
              return func(number);
            };
          }
          var createSet = !(Set2 && 1 / setToArray(new Set2([, -0]))[1] == INFINITY) ? noop : function(values2) {
            return new Set2(values2);
          };
          function createToPairs(keysFunc) {
            return function(object) {
              var tag = getTag(object);
              if (tag == mapTag) {
                return mapToArray(object);
              }
              if (tag == setTag) {
                return setToPairs(object);
              }
              return baseToPairs(object, keysFunc(object));
            };
          }
          function createWrap(func, bitmask, thisArg, partials, holders, argPos, ary2, arity) {
            var isBindKey = bitmask & WRAP_BIND_KEY_FLAG;
            if (!isBindKey && typeof func != "function") {
              throw new TypeError2(FUNC_ERROR_TEXT);
            }
            var length = partials ? partials.length : 0;
            if (!length) {
              bitmask &= ~(WRAP_PARTIAL_FLAG | WRAP_PARTIAL_RIGHT_FLAG);
              partials = holders = undefined2;
            }
            ary2 = ary2 === undefined2 ? ary2 : nativeMax(toInteger(ary2), 0);
            arity = arity === undefined2 ? arity : toInteger(arity);
            length -= holders ? holders.length : 0;
            if (bitmask & WRAP_PARTIAL_RIGHT_FLAG) {
              var partialsRight = partials, holdersRight = holders;
              partials = holders = undefined2;
            }
            var data = isBindKey ? undefined2 : getData(func);
            var newData = [
              func,
              bitmask,
              thisArg,
              partials,
              holders,
              partialsRight,
              holdersRight,
              argPos,
              ary2,
              arity
            ];
            if (data) {
              mergeData(newData, data);
            }
            func = newData[0];
            bitmask = newData[1];
            thisArg = newData[2];
            partials = newData[3];
            holders = newData[4];
            arity = newData[9] = newData[9] === undefined2 ? isBindKey ? 0 : func.length : nativeMax(newData[9] - length, 0);
            if (!arity && bitmask & (WRAP_CURRY_FLAG | WRAP_CURRY_RIGHT_FLAG)) {
              bitmask &= ~(WRAP_CURRY_FLAG | WRAP_CURRY_RIGHT_FLAG);
            }
            if (!bitmask || bitmask == WRAP_BIND_FLAG) {
              var result2 = createBind(func, bitmask, thisArg);
            } else if (bitmask == WRAP_CURRY_FLAG || bitmask == WRAP_CURRY_RIGHT_FLAG) {
              result2 = createCurry(func, bitmask, arity);
            } else if ((bitmask == WRAP_PARTIAL_FLAG || bitmask == (WRAP_BIND_FLAG | WRAP_PARTIAL_FLAG)) && !holders.length) {
              result2 = createPartial(func, bitmask, thisArg, partials);
            } else {
              result2 = createHybrid.apply(undefined2, newData);
            }
            var setter = data ? baseSetData : setData;
            return setWrapToString(setter(result2, newData), func, bitmask);
          }
          function customDefaultsAssignIn(objValue, srcValue, key, object) {
            if (objValue === undefined2 || eq(objValue, objectProto[key]) && !hasOwnProperty.call(object, key)) {
              return srcValue;
            }
            return objValue;
          }
          function customDefaultsMerge(objValue, srcValue, key, object, source, stack) {
            if (isObject(objValue) && isObject(srcValue)) {
              stack.set(srcValue, objValue);
              baseMerge(objValue, srcValue, undefined2, customDefaultsMerge, stack);
              stack["delete"](srcValue);
            }
            return objValue;
          }
          function customOmitClone(value) {
            return isPlainObject(value) ? undefined2 : value;
          }
          function equalArrays(array, other, bitmask, customizer, equalFunc, stack) {
            var isPartial = bitmask & COMPARE_PARTIAL_FLAG, arrLength = array.length, othLength = other.length;
            if (arrLength != othLength && !(isPartial && othLength > arrLength)) {
              return false;
            }
            var arrStacked = stack.get(array);
            var othStacked = stack.get(other);
            if (arrStacked && othStacked) {
              return arrStacked == other && othStacked == array;
            }
            var index = -1, result2 = true, seen = bitmask & COMPARE_UNORDERED_FLAG ? new SetCache() : undefined2;
            stack.set(array, other);
            stack.set(other, array);
            while (++index < arrLength) {
              var arrValue = array[index], othValue = other[index];
              if (customizer) {
                var compared = isPartial ? customizer(othValue, arrValue, index, other, array, stack) : customizer(arrValue, othValue, index, array, other, stack);
              }
              if (compared !== undefined2) {
                if (compared) {
                  continue;
                }
                result2 = false;
                break;
              }
              if (seen) {
                if (!arraySome(other, function(othValue2, othIndex) {
                  if (!cacheHas(seen, othIndex) && (arrValue === othValue2 || equalFunc(arrValue, othValue2, bitmask, customizer, stack))) {
                    return seen.push(othIndex);
                  }
                })) {
                  result2 = false;
                  break;
                }
              } else if (!(arrValue === othValue || equalFunc(arrValue, othValue, bitmask, customizer, stack))) {
                result2 = false;
                break;
              }
            }
            stack["delete"](array);
            stack["delete"](other);
            return result2;
          }
          function equalByTag(object, other, tag, bitmask, customizer, equalFunc, stack) {
            switch (tag) {
              case dataViewTag:
                if (object.byteLength != other.byteLength || object.byteOffset != other.byteOffset) {
                  return false;
                }
                object = object.buffer;
                other = other.buffer;
              case arrayBufferTag:
                if (object.byteLength != other.byteLength || !equalFunc(new Uint8Array2(object), new Uint8Array2(other))) {
                  return false;
                }
                return true;
              case boolTag:
              case dateTag:
              case numberTag:
                return eq(+object, +other);
              case errorTag:
                return object.name == other.name && object.message == other.message;
              case regexpTag:
              case stringTag:
                return object == other + "";
              case mapTag:
                var convert = mapToArray;
              case setTag:
                var isPartial = bitmask & COMPARE_PARTIAL_FLAG;
                convert || (convert = setToArray);
                if (object.size != other.size && !isPartial) {
                  return false;
                }
                var stacked = stack.get(object);
                if (stacked) {
                  return stacked == other;
                }
                bitmask |= COMPARE_UNORDERED_FLAG;
                stack.set(object, other);
                var result2 = equalArrays(convert(object), convert(other), bitmask, customizer, equalFunc, stack);
                stack["delete"](object);
                return result2;
              case symbolTag:
                if (symbolValueOf) {
                  return symbolValueOf.call(object) == symbolValueOf.call(other);
                }
            }
            return false;
          }
          function equalObjects(object, other, bitmask, customizer, equalFunc, stack) {
            var isPartial = bitmask & COMPARE_PARTIAL_FLAG, objProps = getAllKeys(object), objLength = objProps.length, othProps = getAllKeys(other), othLength = othProps.length;
            if (objLength != othLength && !isPartial) {
              return false;
            }
            var index = objLength;
            while (index--) {
              var key = objProps[index];
              if (!(isPartial ? key in other : hasOwnProperty.call(other, key))) {
                return false;
              }
            }
            var objStacked = stack.get(object);
            var othStacked = stack.get(other);
            if (objStacked && othStacked) {
              return objStacked == other && othStacked == object;
            }
            var result2 = true;
            stack.set(object, other);
            stack.set(other, object);
            var skipCtor = isPartial;
            while (++index < objLength) {
              key = objProps[index];
              var objValue = object[key], othValue = other[key];
              if (customizer) {
                var compared = isPartial ? customizer(othValue, objValue, key, other, object, stack) : customizer(objValue, othValue, key, object, other, stack);
              }
              if (!(compared === undefined2 ? objValue === othValue || equalFunc(objValue, othValue, bitmask, customizer, stack) : compared)) {
                result2 = false;
                break;
              }
              skipCtor || (skipCtor = key == "constructor");
            }
            if (result2 && !skipCtor) {
              var objCtor = object.constructor, othCtor = other.constructor;
              if (objCtor != othCtor && ("constructor" in object && "constructor" in other) && !(typeof objCtor == "function" && objCtor instanceof objCtor && typeof othCtor == "function" && othCtor instanceof othCtor)) {
                result2 = false;
              }
            }
            stack["delete"](object);
            stack["delete"](other);
            return result2;
          }
          function flatRest(func) {
            return setToString(overRest(func, undefined2, flatten), func + "");
          }
          function getAllKeys(object) {
            return baseGetAllKeys(object, keys, getSymbols);
          }
          function getAllKeysIn(object) {
            return baseGetAllKeys(object, keysIn, getSymbolsIn);
          }
          var getData = !metaMap ? noop : function(func) {
            return metaMap.get(func);
          };
          function getFuncName(func) {
            var result2 = func.name + "", array = realNames[result2], length = hasOwnProperty.call(realNames, result2) ? array.length : 0;
            while (length--) {
              var data = array[length], otherFunc = data.func;
              if (otherFunc == null || otherFunc == func) {
                return data.name;
              }
            }
            return result2;
          }
          function getHolder(func) {
            var object = hasOwnProperty.call(lodash, "placeholder") ? lodash : func;
            return object.placeholder;
          }
          function getIteratee() {
            var result2 = lodash.iteratee || iteratee;
            result2 = result2 === iteratee ? baseIteratee : result2;
            return arguments.length ? result2(arguments[0], arguments[1]) : result2;
          }
          function getMapData(map2, key) {
            var data = map2.__data__;
            return isKeyable(key) ? data[typeof key == "string" ? "string" : "hash"] : data.map;
          }
          function getMatchData(object) {
            var result2 = keys(object), length = result2.length;
            while (length--) {
              var key = result2[length], value = object[key];
              result2[length] = [key, value, isStrictComparable(value)];
            }
            return result2;
          }
          function getNative(object, key) {
            var value = getValue(object, key);
            return baseIsNative(value) ? value : undefined2;
          }
          function getRawTag(value) {
            var isOwn = hasOwnProperty.call(value, symToStringTag), tag = value[symToStringTag];
            try {
              value[symToStringTag] = undefined2;
              var unmasked = true;
            } catch (e) {
            }
            var result2 = nativeObjectToString.call(value);
            if (unmasked) {
              if (isOwn) {
                value[symToStringTag] = tag;
              } else {
                delete value[symToStringTag];
              }
            }
            return result2;
          }
          var getSymbols = !nativeGetSymbols ? stubArray : function(object) {
            if (object == null) {
              return [];
            }
            object = Object2(object);
            return arrayFilter(nativeGetSymbols(object), function(symbol) {
              return propertyIsEnumerable.call(object, symbol);
            });
          };
          var getSymbolsIn = !nativeGetSymbols ? stubArray : function(object) {
            var result2 = [];
            while (object) {
              arrayPush(result2, getSymbols(object));
              object = getPrototype(object);
            }
            return result2;
          };
          var getTag = baseGetTag;
          if (DataView && getTag(new DataView(new ArrayBuffer(1))) != dataViewTag || Map2 && getTag(new Map2()) != mapTag || Promise2 && getTag(Promise2.resolve()) != promiseTag || Set2 && getTag(new Set2()) != setTag || WeakMap2 && getTag(new WeakMap2()) != weakMapTag) {
            getTag = function(value) {
              var result2 = baseGetTag(value), Ctor = result2 == objectTag ? value.constructor : undefined2, ctorString = Ctor ? toSource(Ctor) : "";
              if (ctorString) {
                switch (ctorString) {
                  case dataViewCtorString:
                    return dataViewTag;
                  case mapCtorString:
                    return mapTag;
                  case promiseCtorString:
                    return promiseTag;
                  case setCtorString:
                    return setTag;
                  case weakMapCtorString:
                    return weakMapTag;
                }
              }
              return result2;
            };
          }
          function getView(start, end, transforms) {
            var index = -1, length = transforms.length;
            while (++index < length) {
              var data = transforms[index], size2 = data.size;
              switch (data.type) {
                case "drop":
                  start += size2;
                  break;
                case "dropRight":
                  end -= size2;
                  break;
                case "take":
                  end = nativeMin(end, start + size2);
                  break;
                case "takeRight":
                  start = nativeMax(start, end - size2);
                  break;
              }
            }
            return { "start": start, "end": end };
          }
          function getWrapDetails(source) {
            var match = source.match(reWrapDetails);
            return match ? match[1].split(reSplitDetails) : [];
          }
          function hasPath(object, path, hasFunc) {
            path = castPath(path, object);
            var index = -1, length = path.length, result2 = false;
            while (++index < length) {
              var key = toKey(path[index]);
              if (!(result2 = object != null && hasFunc(object, key))) {
                break;
              }
              object = object[key];
            }
            if (result2 || ++index != length) {
              return result2;
            }
            length = object == null ? 0 : object.length;
            return !!length && isLength(length) && isIndex(key, length) && (isArray(object) || isArguments(object));
          }
          function initCloneArray(array) {
            var length = array.length, result2 = new array.constructor(length);
            if (length && typeof array[0] == "string" && hasOwnProperty.call(array, "index")) {
              result2.index = array.index;
              result2.input = array.input;
            }
            return result2;
          }
          function initCloneObject(object) {
            return typeof object.constructor == "function" && !isPrototype(object) ? baseCreate(getPrototype(object)) : {};
          }
          function initCloneByTag(object, tag, isDeep) {
            var Ctor = object.constructor;
            switch (tag) {
              case arrayBufferTag:
                return cloneArrayBuffer(object);
              case boolTag:
              case dateTag:
                return new Ctor(+object);
              case dataViewTag:
                return cloneDataView(object, isDeep);
              case float32Tag:
              case float64Tag:
              case int8Tag:
              case int16Tag:
              case int32Tag:
              case uint8Tag:
              case uint8ClampedTag:
              case uint16Tag:
              case uint32Tag:
                return cloneTypedArray(object, isDeep);
              case mapTag:
                return new Ctor();
              case numberTag:
              case stringTag:
                return new Ctor(object);
              case regexpTag:
                return cloneRegExp(object);
              case setTag:
                return new Ctor();
              case symbolTag:
                return cloneSymbol(object);
            }
          }
          function insertWrapDetails(source, details) {
            var length = details.length;
            if (!length) {
              return source;
            }
            var lastIndex = length - 1;
            details[lastIndex] = (length > 1 ? "& " : "") + details[lastIndex];
            details = details.join(length > 2 ? ", " : " ");
            return source.replace(reWrapComment, "{\n/* [wrapped with " + details + "] */\n");
          }
          function isFlattenable(value) {
            return isArray(value) || isArguments(value) || !!(spreadableSymbol && value && value[spreadableSymbol]);
          }
          function isIndex(value, length) {
            var type = typeof value;
            length = length == null ? MAX_SAFE_INTEGER : length;
            return !!length && (type == "number" || type != "symbol" && reIsUint.test(value)) && (value > -1 && value % 1 == 0 && value < length);
          }
          function isIterateeCall(value, index, object) {
            if (!isObject(object)) {
              return false;
            }
            var type = typeof index;
            if (type == "number" ? isArrayLike(object) && isIndex(index, object.length) : type == "string" && index in object) {
              return eq(object[index], value);
            }
            return false;
          }
          function isKey(value, object) {
            if (isArray(value)) {
              return false;
            }
            var type = typeof value;
            if (type == "number" || type == "symbol" || type == "boolean" || value == null || isSymbol(value)) {
              return true;
            }
            return reIsPlainProp.test(value) || !reIsDeepProp.test(value) || object != null && value in Object2(object);
          }
          function isKeyable(value) {
            var type = typeof value;
            return type == "string" || type == "number" || type == "symbol" || type == "boolean" ? value !== "__proto__" : value === null;
          }
          function isLaziable(func) {
            var funcName = getFuncName(func), other = lodash[funcName];
            if (typeof other != "function" || !(funcName in LazyWrapper.prototype)) {
              return false;
            }
            if (func === other) {
              return true;
            }
            var data = getData(other);
            return !!data && func === data[0];
          }
          function isMasked(func) {
            return !!maskSrcKey && maskSrcKey in func;
          }
          var isMaskable = coreJsData ? isFunction : stubFalse;
          function isPrototype(value) {
            var Ctor = value && value.constructor, proto = typeof Ctor == "function" && Ctor.prototype || objectProto;
            return value === proto;
          }
          function isStrictComparable(value) {
            return value === value && !isObject(value);
          }
          function matchesStrictComparable(key, srcValue) {
            return function(object) {
              if (object == null) {
                return false;
              }
              return object[key] === srcValue && (srcValue !== undefined2 || key in Object2(object));
            };
          }
          function memoizeCapped(func) {
            var result2 = memoize(func, function(key) {
              if (cache.size === MAX_MEMOIZE_SIZE) {
                cache.clear();
              }
              return key;
            });
            var cache = result2.cache;
            return result2;
          }
          function mergeData(data, source) {
            var bitmask = data[1], srcBitmask = source[1], newBitmask = bitmask | srcBitmask, isCommon = newBitmask < (WRAP_BIND_FLAG | WRAP_BIND_KEY_FLAG | WRAP_ARY_FLAG);
            var isCombo = srcBitmask == WRAP_ARY_FLAG && bitmask == WRAP_CURRY_FLAG || srcBitmask == WRAP_ARY_FLAG && bitmask == WRAP_REARG_FLAG && data[7].length <= source[8] || srcBitmask == (WRAP_ARY_FLAG | WRAP_REARG_FLAG) && source[7].length <= source[8] && bitmask == WRAP_CURRY_FLAG;
            if (!(isCommon || isCombo)) {
              return data;
            }
            if (srcBitmask & WRAP_BIND_FLAG) {
              data[2] = source[2];
              newBitmask |= bitmask & WRAP_BIND_FLAG ? 0 : WRAP_CURRY_BOUND_FLAG;
            }
            var value = source[3];
            if (value) {
              var partials = data[3];
              data[3] = partials ? composeArgs(partials, value, source[4]) : value;
              data[4] = partials ? replaceHolders(data[3], PLACEHOLDER) : source[4];
            }
            value = source[5];
            if (value) {
              partials = data[5];
              data[5] = partials ? composeArgsRight(partials, value, source[6]) : value;
              data[6] = partials ? replaceHolders(data[5], PLACEHOLDER) : source[6];
            }
            value = source[7];
            if (value) {
              data[7] = value;
            }
            if (srcBitmask & WRAP_ARY_FLAG) {
              data[8] = data[8] == null ? source[8] : nativeMin(data[8], source[8]);
            }
            if (data[9] == null) {
              data[9] = source[9];
            }
            data[0] = source[0];
            data[1] = newBitmask;
            return data;
          }
          function nativeKeysIn(object) {
            var result2 = [];
            if (object != null) {
              for (var key in Object2(object)) {
                result2.push(key);
              }
            }
            return result2;
          }
          function objectToString(value) {
            return nativeObjectToString.call(value);
          }
          function overRest(func, start, transform2) {
            start = nativeMax(start === undefined2 ? func.length - 1 : start, 0);
            return function() {
              var args = arguments, index = -1, length = nativeMax(args.length - start, 0), array = Array2(length);
              while (++index < length) {
                array[index] = args[start + index];
              }
              index = -1;
              var otherArgs = Array2(start + 1);
              while (++index < start) {
                otherArgs[index] = args[index];
              }
              otherArgs[start] = transform2(array);
              return apply(func, this, otherArgs);
            };
          }
          function parent(object, path) {
            return path.length < 2 ? object : baseGet(object, baseSlice(path, 0, -1));
          }
          function reorder(array, indexes) {
            var arrLength = array.length, length = nativeMin(indexes.length, arrLength), oldArray = copyArray(array);
            while (length--) {
              var index = indexes[length];
              array[length] = isIndex(index, arrLength) ? oldArray[index] : undefined2;
            }
            return array;
          }
          function safeGet(object, key) {
            if (key === "constructor" && typeof object[key] === "function") {
              return;
            }
            if (key == "__proto__") {
              return;
            }
            return object[key];
          }
          var setData = shortOut(baseSetData);
          var setTimeout2 = ctxSetTimeout || function(func, wait) {
            return root.setTimeout(func, wait);
          };
          var setToString = shortOut(baseSetToString);
          function setWrapToString(wrapper, reference, bitmask) {
            var source = reference + "";
            return setToString(wrapper, insertWrapDetails(source, updateWrapDetails(getWrapDetails(source), bitmask)));
          }
          function shortOut(func) {
            var count = 0, lastCalled = 0;
            return function() {
              var stamp = nativeNow(), remaining = HOT_SPAN - (stamp - lastCalled);
              lastCalled = stamp;
              if (remaining > 0) {
                if (++count >= HOT_COUNT) {
                  return arguments[0];
                }
              } else {
                count = 0;
              }
              return func.apply(undefined2, arguments);
            };
          }
          function shuffleSelf(array, size2) {
            var index = -1, length = array.length, lastIndex = length - 1;
            size2 = size2 === undefined2 ? length : size2;
            while (++index < size2) {
              var rand = baseRandom(index, lastIndex), value = array[rand];
              array[rand] = array[index];
              array[index] = value;
            }
            array.length = size2;
            return array;
          }
          var stringToPath = memoizeCapped(function(string) {
            var result2 = [];
            if (string.charCodeAt(0) === 46) {
              result2.push("");
            }
            string.replace(rePropName, function(match, number, quote, subString) {
              result2.push(quote ? subString.replace(reEscapeChar, "$1") : number || match);
            });
            return result2;
          });
          function toKey(value) {
            if (typeof value == "string" || isSymbol(value)) {
              return value;
            }
            var result2 = value + "";
            return result2 == "0" && 1 / value == -INFINITY ? "-0" : result2;
          }
          function toSource(func) {
            if (func != null) {
              try {
                return funcToString.call(func);
              } catch (e) {
              }
              try {
                return func + "";
              } catch (e) {
              }
            }
            return "";
          }
          function updateWrapDetails(details, bitmask) {
            arrayEach(wrapFlags, function(pair) {
              var value = "_." + pair[0];
              if (bitmask & pair[1] && !arrayIncludes(details, value)) {
                details.push(value);
              }
            });
            return details.sort();
          }
          function wrapperClone(wrapper) {
            if (wrapper instanceof LazyWrapper) {
              return wrapper.clone();
            }
            var result2 = new LodashWrapper(wrapper.__wrapped__, wrapper.__chain__);
            result2.__actions__ = copyArray(wrapper.__actions__);
            result2.__index__ = wrapper.__index__;
            result2.__values__ = wrapper.__values__;
            return result2;
          }
          function chunk(array, size2, guard) {
            if (guard ? isIterateeCall(array, size2, guard) : size2 === undefined2) {
              size2 = 1;
            } else {
              size2 = nativeMax(toInteger(size2), 0);
            }
            var length = array == null ? 0 : array.length;
            if (!length || size2 < 1) {
              return [];
            }
            var index = 0, resIndex = 0, result2 = Array2(nativeCeil(length / size2));
            while (index < length) {
              result2[resIndex++] = baseSlice(array, index, index += size2);
            }
            return result2;
          }
          function compact(array) {
            var index = -1, length = array == null ? 0 : array.length, resIndex = 0, result2 = [];
            while (++index < length) {
              var value = array[index];
              if (value) {
                result2[resIndex++] = value;
              }
            }
            return result2;
          }
          function concat() {
            var length = arguments.length;
            if (!length) {
              return [];
            }
            var args = Array2(length - 1), array = arguments[0], index = length;
            while (index--) {
              args[index - 1] = arguments[index];
            }
            return arrayPush(isArray(array) ? copyArray(array) : [array], baseFlatten(args, 1));
          }
          var difference = baseRest(function(array, values2) {
            return isArrayLikeObject(array) ? baseDifference(array, baseFlatten(values2, 1, isArrayLikeObject, true)) : [];
          });
          var differenceBy = baseRest(function(array, values2) {
            var iteratee2 = last(values2);
            if (isArrayLikeObject(iteratee2)) {
              iteratee2 = undefined2;
            }
            return isArrayLikeObject(array) ? baseDifference(array, baseFlatten(values2, 1, isArrayLikeObject, true), getIteratee(iteratee2, 2)) : [];
          });
          var differenceWith = baseRest(function(array, values2) {
            var comparator = last(values2);
            if (isArrayLikeObject(comparator)) {
              comparator = undefined2;
            }
            return isArrayLikeObject(array) ? baseDifference(array, baseFlatten(values2, 1, isArrayLikeObject, true), undefined2, comparator) : [];
          });
          function drop(array, n, guard) {
            var length = array == null ? 0 : array.length;
            if (!length) {
              return [];
            }
            n = guard || n === undefined2 ? 1 : toInteger(n);
            return baseSlice(array, n < 0 ? 0 : n, length);
          }
          function dropRight(array, n, guard) {
            var length = array == null ? 0 : array.length;
            if (!length) {
              return [];
            }
            n = guard || n === undefined2 ? 1 : toInteger(n);
            n = length - n;
            return baseSlice(array, 0, n < 0 ? 0 : n);
          }
          function dropRightWhile(array, predicate) {
            return array && array.length ? baseWhile(array, getIteratee(predicate, 3), true, true) : [];
          }
          function dropWhile(array, predicate) {
            return array && array.length ? baseWhile(array, getIteratee(predicate, 3), true) : [];
          }
          function fill(array, value, start, end) {
            var length = array == null ? 0 : array.length;
            if (!length) {
              return [];
            }
            if (start && typeof start != "number" && isIterateeCall(array, value, start)) {
              start = 0;
              end = length;
            }
            return baseFill(array, value, start, end);
          }
          function findIndex(array, predicate, fromIndex) {
            var length = array == null ? 0 : array.length;
            if (!length) {
              return -1;
            }
            var index = fromIndex == null ? 0 : toInteger(fromIndex);
            if (index < 0) {
              index = nativeMax(length + index, 0);
            }
            return baseFindIndex(array, getIteratee(predicate, 3), index);
          }
          function findLastIndex(array, predicate, fromIndex) {
            var length = array == null ? 0 : array.length;
            if (!length) {
              return -1;
            }
            var index = length - 1;
            if (fromIndex !== undefined2) {
              index = toInteger(fromIndex);
              index = fromIndex < 0 ? nativeMax(length + index, 0) : nativeMin(index, length - 1);
            }
            return baseFindIndex(array, getIteratee(predicate, 3), index, true);
          }
          function flatten(array) {
            var length = array == null ? 0 : array.length;
            return length ? baseFlatten(array, 1) : [];
          }
          function flattenDeep(array) {
            var length = array == null ? 0 : array.length;
            return length ? baseFlatten(array, INFINITY) : [];
          }
          function flattenDepth(array, depth) {
            var length = array == null ? 0 : array.length;
            if (!length) {
              return [];
            }
            depth = depth === undefined2 ? 1 : toInteger(depth);
            return baseFlatten(array, depth);
          }
          function fromPairs(pairs) {
            var index = -1, length = pairs == null ? 0 : pairs.length, result2 = {};
            while (++index < length) {
              var pair = pairs[index];
              result2[pair[0]] = pair[1];
            }
            return result2;
          }
          function head(array) {
            return array && array.length ? array[0] : undefined2;
          }
          function indexOf(array, value, fromIndex) {
            var length = array == null ? 0 : array.length;
            if (!length) {
              return -1;
            }
            var index = fromIndex == null ? 0 : toInteger(fromIndex);
            if (index < 0) {
              index = nativeMax(length + index, 0);
            }
            return baseIndexOf(array, value, index);
          }
          function initial(array) {
            var length = array == null ? 0 : array.length;
            return length ? baseSlice(array, 0, -1) : [];
          }
          var intersection = baseRest(function(arrays) {
            var mapped = arrayMap(arrays, castArrayLikeObject);
            return mapped.length && mapped[0] === arrays[0] ? baseIntersection(mapped) : [];
          });
          var intersectionBy = baseRest(function(arrays) {
            var iteratee2 = last(arrays), mapped = arrayMap(arrays, castArrayLikeObject);
            if (iteratee2 === last(mapped)) {
              iteratee2 = undefined2;
            } else {
              mapped.pop();
            }
            return mapped.length && mapped[0] === arrays[0] ? baseIntersection(mapped, getIteratee(iteratee2, 2)) : [];
          });
          var intersectionWith = baseRest(function(arrays) {
            var comparator = last(arrays), mapped = arrayMap(arrays, castArrayLikeObject);
            comparator = typeof comparator == "function" ? comparator : undefined2;
            if (comparator) {
              mapped.pop();
            }
            return mapped.length && mapped[0] === arrays[0] ? baseIntersection(mapped, undefined2, comparator) : [];
          });
          function join(array, separator) {
            return array == null ? "" : nativeJoin.call(array, separator);
          }
          function last(array) {
            var length = array == null ? 0 : array.length;
            return length ? array[length - 1] : undefined2;
          }
          function lastIndexOf(array, value, fromIndex) {
            var length = array == null ? 0 : array.length;
            if (!length) {
              return -1;
            }
            var index = length;
            if (fromIndex !== undefined2) {
              index = toInteger(fromIndex);
              index = index < 0 ? nativeMax(length + index, 0) : nativeMin(index, length - 1);
            }
            return value === value ? strictLastIndexOf(array, value, index) : baseFindIndex(array, baseIsNaN, index, true);
          }
          function nth(array, n) {
            return array && array.length ? baseNth(array, toInteger(n)) : undefined2;
          }
          var pull = baseRest(pullAll);
          function pullAll(array, values2) {
            return array && array.length && values2 && values2.length ? basePullAll(array, values2) : array;
          }
          function pullAllBy(array, values2, iteratee2) {
            return array && array.length && values2 && values2.length ? basePullAll(array, values2, getIteratee(iteratee2, 2)) : array;
          }
          function pullAllWith(array, values2, comparator) {
            return array && array.length && values2 && values2.length ? basePullAll(array, values2, undefined2, comparator) : array;
          }
          var pullAt = flatRest(function(array, indexes) {
            var length = array == null ? 0 : array.length, result2 = baseAt(array, indexes);
            basePullAt(array, arrayMap(indexes, function(index) {
              return isIndex(index, length) ? +index : index;
            }).sort(compareAscending));
            return result2;
          });
          function remove(array, predicate) {
            var result2 = [];
            if (!(array && array.length)) {
              return result2;
            }
            var index = -1, indexes = [], length = array.length;
            predicate = getIteratee(predicate, 3);
            while (++index < length) {
              var value = array[index];
              if (predicate(value, index, array)) {
                result2.push(value);
                indexes.push(index);
              }
            }
            basePullAt(array, indexes);
            return result2;
          }
          function reverse(array) {
            return array == null ? array : nativeReverse.call(array);
          }
          function slice(array, start, end) {
            var length = array == null ? 0 : array.length;
            if (!length) {
              return [];
            }
            if (end && typeof end != "number" && isIterateeCall(array, start, end)) {
              start = 0;
              end = length;
            } else {
              start = start == null ? 0 : toInteger(start);
              end = end === undefined2 ? length : toInteger(end);
            }
            return baseSlice(array, start, end);
          }
          function sortedIndex(array, value) {
            return baseSortedIndex(array, value);
          }
          function sortedIndexBy(array, value, iteratee2) {
            return baseSortedIndexBy(array, value, getIteratee(iteratee2, 2));
          }
          function sortedIndexOf(array, value) {
            var length = array == null ? 0 : array.length;
            if (length) {
              var index = baseSortedIndex(array, value);
              if (index < length && eq(array[index], value)) {
                return index;
              }
            }
            return -1;
          }
          function sortedLastIndex(array, value) {
            return baseSortedIndex(array, value, true);
          }
          function sortedLastIndexBy(array, value, iteratee2) {
            return baseSortedIndexBy(array, value, getIteratee(iteratee2, 2), true);
          }
          function sortedLastIndexOf(array, value) {
            var length = array == null ? 0 : array.length;
            if (length) {
              var index = baseSortedIndex(array, value, true) - 1;
              if (eq(array[index], value)) {
                return index;
              }
            }
            return -1;
          }
          function sortedUniq(array) {
            return array && array.length ? baseSortedUniq(array) : [];
          }
          function sortedUniqBy(array, iteratee2) {
            return array && array.length ? baseSortedUniq(array, getIteratee(iteratee2, 2)) : [];
          }
          function tail(array) {
            var length = array == null ? 0 : array.length;
            return length ? baseSlice(array, 1, length) : [];
          }
          function take(array, n, guard) {
            if (!(array && array.length)) {
              return [];
            }
            n = guard || n === undefined2 ? 1 : toInteger(n);
            return baseSlice(array, 0, n < 0 ? 0 : n);
          }
          function takeRight(array, n, guard) {
            var length = array == null ? 0 : array.length;
            if (!length) {
              return [];
            }
            n = guard || n === undefined2 ? 1 : toInteger(n);
            n = length - n;
            return baseSlice(array, n < 0 ? 0 : n, length);
          }
          function takeRightWhile(array, predicate) {
            return array && array.length ? baseWhile(array, getIteratee(predicate, 3), false, true) : [];
          }
          function takeWhile(array, predicate) {
            return array && array.length ? baseWhile(array, getIteratee(predicate, 3)) : [];
          }
          var union = baseRest(function(arrays) {
            return baseUniq(baseFlatten(arrays, 1, isArrayLikeObject, true));
          });
          var unionBy = baseRest(function(arrays) {
            var iteratee2 = last(arrays);
            if (isArrayLikeObject(iteratee2)) {
              iteratee2 = undefined2;
            }
            return baseUniq(baseFlatten(arrays, 1, isArrayLikeObject, true), getIteratee(iteratee2, 2));
          });
          var unionWith = baseRest(function(arrays) {
            var comparator = last(arrays);
            comparator = typeof comparator == "function" ? comparator : undefined2;
            return baseUniq(baseFlatten(arrays, 1, isArrayLikeObject, true), undefined2, comparator);
          });
          function uniq(array) {
            return array && array.length ? baseUniq(array) : [];
          }
          function uniqBy(array, iteratee2) {
            return array && array.length ? baseUniq(array, getIteratee(iteratee2, 2)) : [];
          }
          function uniqWith(array, comparator) {
            comparator = typeof comparator == "function" ? comparator : undefined2;
            return array && array.length ? baseUniq(array, undefined2, comparator) : [];
          }
          function unzip(array) {
            if (!(array && array.length)) {
              return [];
            }
            var length = 0;
            array = arrayFilter(array, function(group) {
              if (isArrayLikeObject(group)) {
                length = nativeMax(group.length, length);
                return true;
              }
            });
            return baseTimes(length, function(index) {
              return arrayMap(array, baseProperty(index));
            });
          }
          function unzipWith(array, iteratee2) {
            if (!(array && array.length)) {
              return [];
            }
            var result2 = unzip(array);
            if (iteratee2 == null) {
              return result2;
            }
            return arrayMap(result2, function(group) {
              return apply(iteratee2, undefined2, group);
            });
          }
          var without = baseRest(function(array, values2) {
            return isArrayLikeObject(array) ? baseDifference(array, values2) : [];
          });
          var xor = baseRest(function(arrays) {
            return baseXor(arrayFilter(arrays, isArrayLikeObject));
          });
          var xorBy = baseRest(function(arrays) {
            var iteratee2 = last(arrays);
            if (isArrayLikeObject(iteratee2)) {
              iteratee2 = undefined2;
            }
            return baseXor(arrayFilter(arrays, isArrayLikeObject), getIteratee(iteratee2, 2));
          });
          var xorWith = baseRest(function(arrays) {
            var comparator = last(arrays);
            comparator = typeof comparator == "function" ? comparator : undefined2;
            return baseXor(arrayFilter(arrays, isArrayLikeObject), undefined2, comparator);
          });
          var zip = baseRest(unzip);
          function zipObject(props, values2) {
            return baseZipObject(props || [], values2 || [], assignValue);
          }
          function zipObjectDeep(props, values2) {
            return baseZipObject(props || [], values2 || [], baseSet);
          }
          var zipWith = baseRest(function(arrays) {
            var length = arrays.length, iteratee2 = length > 1 ? arrays[length - 1] : undefined2;
            iteratee2 = typeof iteratee2 == "function" ? (arrays.pop(), iteratee2) : undefined2;
            return unzipWith(arrays, iteratee2);
          });
          function chain(value) {
            var result2 = lodash(value);
            result2.__chain__ = true;
            return result2;
          }
          function tap(value, interceptor) {
            interceptor(value);
            return value;
          }
          function thru(value, interceptor) {
            return interceptor(value);
          }
          var wrapperAt = flatRest(function(paths) {
            var length = paths.length, start = length ? paths[0] : 0, value = this.__wrapped__, interceptor = function(object) {
              return baseAt(object, paths);
            };
            if (length > 1 || this.__actions__.length || !(value instanceof LazyWrapper) || !isIndex(start)) {
              return this.thru(interceptor);
            }
            value = value.slice(start, +start + (length ? 1 : 0));
            value.__actions__.push({
              "func": thru,
              "args": [interceptor],
              "thisArg": undefined2
            });
            return new LodashWrapper(value, this.__chain__).thru(function(array) {
              if (length && !array.length) {
                array.push(undefined2);
              }
              return array;
            });
          });
          function wrapperChain() {
            return chain(this);
          }
          function wrapperCommit() {
            return new LodashWrapper(this.value(), this.__chain__);
          }
          function wrapperNext() {
            if (this.__values__ === undefined2) {
              this.__values__ = toArray(this.value());
            }
            var done = this.__index__ >= this.__values__.length, value = done ? undefined2 : this.__values__[this.__index__++];
            return { "done": done, "value": value };
          }
          function wrapperToIterator() {
            return this;
          }
          function wrapperPlant(value) {
            var result2, parent2 = this;
            while (parent2 instanceof baseLodash) {
              var clone2 = wrapperClone(parent2);
              clone2.__index__ = 0;
              clone2.__values__ = undefined2;
              if (result2) {
                previous.__wrapped__ = clone2;
              } else {
                result2 = clone2;
              }
              var previous = clone2;
              parent2 = parent2.__wrapped__;
            }
            previous.__wrapped__ = value;
            return result2;
          }
          function wrapperReverse() {
            var value = this.__wrapped__;
            if (value instanceof LazyWrapper) {
              var wrapped = value;
              if (this.__actions__.length) {
                wrapped = new LazyWrapper(this);
              }
              wrapped = wrapped.reverse();
              wrapped.__actions__.push({
                "func": thru,
                "args": [reverse],
                "thisArg": undefined2
              });
              return new LodashWrapper(wrapped, this.__chain__);
            }
            return this.thru(reverse);
          }
          function wrapperValue() {
            return baseWrapperValue(this.__wrapped__, this.__actions__);
          }
          var countBy = createAggregator(function(result2, value, key) {
            if (hasOwnProperty.call(result2, key)) {
              ++result2[key];
            } else {
              baseAssignValue(result2, key, 1);
            }
          });
          function every(collection, predicate, guard) {
            var func = isArray(collection) ? arrayEvery : baseEvery;
            if (guard && isIterateeCall(collection, predicate, guard)) {
              predicate = undefined2;
            }
            return func(collection, getIteratee(predicate, 3));
          }
          function filter(collection, predicate) {
            var func = isArray(collection) ? arrayFilter : baseFilter;
            return func(collection, getIteratee(predicate, 3));
          }
          var find = createFind(findIndex);
          var findLast = createFind(findLastIndex);
          function flatMap(collection, iteratee2) {
            return baseFlatten(map(collection, iteratee2), 1);
          }
          function flatMapDeep(collection, iteratee2) {
            return baseFlatten(map(collection, iteratee2), INFINITY);
          }
          function flatMapDepth(collection, iteratee2, depth) {
            depth = depth === undefined2 ? 1 : toInteger(depth);
            return baseFlatten(map(collection, iteratee2), depth);
          }
          function forEach(collection, iteratee2) {
            var func = isArray(collection) ? arrayEach : baseEach;
            return func(collection, getIteratee(iteratee2, 3));
          }
          function forEachRight(collection, iteratee2) {
            var func = isArray(collection) ? arrayEachRight : baseEachRight;
            return func(collection, getIteratee(iteratee2, 3));
          }
          var groupBy = createAggregator(function(result2, value, key) {
            if (hasOwnProperty.call(result2, key)) {
              result2[key].push(value);
            } else {
              baseAssignValue(result2, key, [value]);
            }
          });
          function includes(collection, value, fromIndex, guard) {
            collection = isArrayLike(collection) ? collection : values(collection);
            fromIndex = fromIndex && !guard ? toInteger(fromIndex) : 0;
            var length = collection.length;
            if (fromIndex < 0) {
              fromIndex = nativeMax(length + fromIndex, 0);
            }
            return isString(collection) ? fromIndex <= length && collection.indexOf(value, fromIndex) > -1 : !!length && baseIndexOf(collection, value, fromIndex) > -1;
          }
          var invokeMap = baseRest(function(collection, path, args) {
            var index = -1, isFunc = typeof path == "function", result2 = isArrayLike(collection) ? Array2(collection.length) : [];
            baseEach(collection, function(value) {
              result2[++index] = isFunc ? apply(path, value, args) : baseInvoke(value, path, args);
            });
            return result2;
          });
          var keyBy = createAggregator(function(result2, value, key) {
            baseAssignValue(result2, key, value);
          });
          function map(collection, iteratee2) {
            var func = isArray(collection) ? arrayMap : baseMap;
            return func(collection, getIteratee(iteratee2, 3));
          }
          function orderBy(collection, iteratees, orders, guard) {
            if (collection == null) {
              return [];
            }
            if (!isArray(iteratees)) {
              iteratees = iteratees == null ? [] : [iteratees];
            }
            orders = guard ? undefined2 : orders;
            if (!isArray(orders)) {
              orders = orders == null ? [] : [orders];
            }
            return baseOrderBy(collection, iteratees, orders);
          }
          var partition = createAggregator(function(result2, value, key) {
            result2[key ? 0 : 1].push(value);
          }, function() {
            return [[], []];
          });
          function reduce(collection, iteratee2, accumulator) {
            var func = isArray(collection) ? arrayReduce : baseReduce, initAccum = arguments.length < 3;
            return func(collection, getIteratee(iteratee2, 4), accumulator, initAccum, baseEach);
          }
          function reduceRight(collection, iteratee2, accumulator) {
            var func = isArray(collection) ? arrayReduceRight : baseReduce, initAccum = arguments.length < 3;
            return func(collection, getIteratee(iteratee2, 4), accumulator, initAccum, baseEachRight);
          }
          function reject(collection, predicate) {
            var func = isArray(collection) ? arrayFilter : baseFilter;
            return func(collection, negate(getIteratee(predicate, 3)));
          }
          function sample(collection) {
            var func = isArray(collection) ? arraySample : baseSample;
            return func(collection);
          }
          function sampleSize(collection, n, guard) {
            if (guard ? isIterateeCall(collection, n, guard) : n === undefined2) {
              n = 1;
            } else {
              n = toInteger(n);
            }
            var func = isArray(collection) ? arraySampleSize : baseSampleSize;
            return func(collection, n);
          }
          function shuffle(collection) {
            var func = isArray(collection) ? arrayShuffle : baseShuffle;
            return func(collection);
          }
          function size(collection) {
            if (collection == null) {
              return 0;
            }
            if (isArrayLike(collection)) {
              return isString(collection) ? stringSize(collection) : collection.length;
            }
            var tag = getTag(collection);
            if (tag == mapTag || tag == setTag) {
              return collection.size;
            }
            return baseKeys(collection).length;
          }
          function some(collection, predicate, guard) {
            var func = isArray(collection) ? arraySome : baseSome;
            if (guard && isIterateeCall(collection, predicate, guard)) {
              predicate = undefined2;
            }
            return func(collection, getIteratee(predicate, 3));
          }
          var sortBy = baseRest(function(collection, iteratees) {
            if (collection == null) {
              return [];
            }
            var length = iteratees.length;
            if (length > 1 && isIterateeCall(collection, iteratees[0], iteratees[1])) {
              iteratees = [];
            } else if (length > 2 && isIterateeCall(iteratees[0], iteratees[1], iteratees[2])) {
              iteratees = [iteratees[0]];
            }
            return baseOrderBy(collection, baseFlatten(iteratees, 1), []);
          });
          var now = ctxNow || function() {
            return root.Date.now();
          };
          function after(n, func) {
            if (typeof func != "function") {
              throw new TypeError2(FUNC_ERROR_TEXT);
            }
            n = toInteger(n);
            return function() {
              if (--n < 1) {
                return func.apply(this, arguments);
              }
            };
          }
          function ary(func, n, guard) {
            n = guard ? undefined2 : n;
            n = func && n == null ? func.length : n;
            return createWrap(func, WRAP_ARY_FLAG, undefined2, undefined2, undefined2, undefined2, n);
          }
          function before(n, func) {
            var result2;
            if (typeof func != "function") {
              throw new TypeError2(FUNC_ERROR_TEXT);
            }
            n = toInteger(n);
            return function() {
              if (--n > 0) {
                result2 = func.apply(this, arguments);
              }
              if (n <= 1) {
                func = undefined2;
              }
              return result2;
            };
          }
          var bind = baseRest(function(func, thisArg, partials) {
            var bitmask = WRAP_BIND_FLAG;
            if (partials.length) {
              var holders = replaceHolders(partials, getHolder(bind));
              bitmask |= WRAP_PARTIAL_FLAG;
            }
            return createWrap(func, bitmask, thisArg, partials, holders);
          });
          var bindKey = baseRest(function(object, key, partials) {
            var bitmask = WRAP_BIND_FLAG | WRAP_BIND_KEY_FLAG;
            if (partials.length) {
              var holders = replaceHolders(partials, getHolder(bindKey));
              bitmask |= WRAP_PARTIAL_FLAG;
            }
            return createWrap(key, bitmask, object, partials, holders);
          });
          function curry(func, arity, guard) {
            arity = guard ? undefined2 : arity;
            var result2 = createWrap(func, WRAP_CURRY_FLAG, undefined2, undefined2, undefined2, undefined2, undefined2, arity);
            result2.placeholder = curry.placeholder;
            return result2;
          }
          function curryRight(func, arity, guard) {
            arity = guard ? undefined2 : arity;
            var result2 = createWrap(func, WRAP_CURRY_RIGHT_FLAG, undefined2, undefined2, undefined2, undefined2, undefined2, arity);
            result2.placeholder = curryRight.placeholder;
            return result2;
          }
          function debounce(func, wait, options) {
            var lastArgs, lastThis, maxWait, result2, timerId, lastCallTime, lastInvokeTime = 0, leading = false, maxing = false, trailing = true;
            if (typeof func != "function") {
              throw new TypeError2(FUNC_ERROR_TEXT);
            }
            wait = toNumber(wait) || 0;
            if (isObject(options)) {
              leading = !!options.leading;
              maxing = "maxWait" in options;
              maxWait = maxing ? nativeMax(toNumber(options.maxWait) || 0, wait) : maxWait;
              trailing = "trailing" in options ? !!options.trailing : trailing;
            }
            function invokeFunc(time) {
              var args = lastArgs, thisArg = lastThis;
              lastArgs = lastThis = undefined2;
              lastInvokeTime = time;
              result2 = func.apply(thisArg, args);
              return result2;
            }
            function leadingEdge(time) {
              lastInvokeTime = time;
              timerId = setTimeout2(timerExpired, wait);
              return leading ? invokeFunc(time) : result2;
            }
            function remainingWait(time) {
              var timeSinceLastCall = time - lastCallTime, timeSinceLastInvoke = time - lastInvokeTime, timeWaiting = wait - timeSinceLastCall;
              return maxing ? nativeMin(timeWaiting, maxWait - timeSinceLastInvoke) : timeWaiting;
            }
            function shouldInvoke(time) {
              var timeSinceLastCall = time - lastCallTime, timeSinceLastInvoke = time - lastInvokeTime;
              return lastCallTime === undefined2 || timeSinceLastCall >= wait || timeSinceLastCall < 0 || maxing && timeSinceLastInvoke >= maxWait;
            }
            function timerExpired() {
              var time = now();
              if (shouldInvoke(time)) {
                return trailingEdge(time);
              }
              timerId = setTimeout2(timerExpired, remainingWait(time));
            }
            function trailingEdge(time) {
              timerId = undefined2;
              if (trailing && lastArgs) {
                return invokeFunc(time);
              }
              lastArgs = lastThis = undefined2;
              return result2;
            }
            function cancel() {
              if (timerId !== undefined2) {
                clearTimeout2(timerId);
              }
              lastInvokeTime = 0;
              lastArgs = lastCallTime = lastThis = timerId = undefined2;
            }
            function flush() {
              return timerId === undefined2 ? result2 : trailingEdge(now());
            }
            function debounced() {
              var time = now(), isInvoking = shouldInvoke(time);
              lastArgs = arguments;
              lastThis = this;
              lastCallTime = time;
              if (isInvoking) {
                if (timerId === undefined2) {
                  return leadingEdge(lastCallTime);
                }
                if (maxing) {
                  clearTimeout2(timerId);
                  timerId = setTimeout2(timerExpired, wait);
                  return invokeFunc(lastCallTime);
                }
              }
              if (timerId === undefined2) {
                timerId = setTimeout2(timerExpired, wait);
              }
              return result2;
            }
            debounced.cancel = cancel;
            debounced.flush = flush;
            return debounced;
          }
          var defer = baseRest(function(func, args) {
            return baseDelay(func, 1, args);
          });
          var delay = baseRest(function(func, wait, args) {
            return baseDelay(func, toNumber(wait) || 0, args);
          });
          function flip(func) {
            return createWrap(func, WRAP_FLIP_FLAG);
          }
          function memoize(func, resolver) {
            if (typeof func != "function" || resolver != null && typeof resolver != "function") {
              throw new TypeError2(FUNC_ERROR_TEXT);
            }
            var memoized = function() {
              var args = arguments, key = resolver ? resolver.apply(this, args) : args[0], cache = memoized.cache;
              if (cache.has(key)) {
                return cache.get(key);
              }
              var result2 = func.apply(this, args);
              memoized.cache = cache.set(key, result2) || cache;
              return result2;
            };
            memoized.cache = new (memoize.Cache || MapCache)();
            return memoized;
          }
          memoize.Cache = MapCache;
          function negate(predicate) {
            if (typeof predicate != "function") {
              throw new TypeError2(FUNC_ERROR_TEXT);
            }
            return function() {
              var args = arguments;
              switch (args.length) {
                case 0:
                  return !predicate.call(this);
                case 1:
                  return !predicate.call(this, args[0]);
                case 2:
                  return !predicate.call(this, args[0], args[1]);
                case 3:
                  return !predicate.call(this, args[0], args[1], args[2]);
              }
              return !predicate.apply(this, args);
            };
          }
          function once(func) {
            return before(2, func);
          }
          var overArgs = castRest(function(func, transforms) {
            transforms = transforms.length == 1 && isArray(transforms[0]) ? arrayMap(transforms[0], baseUnary(getIteratee())) : arrayMap(baseFlatten(transforms, 1), baseUnary(getIteratee()));
            var funcsLength = transforms.length;
            return baseRest(function(args) {
              var index = -1, length = nativeMin(args.length, funcsLength);
              while (++index < length) {
                args[index] = transforms[index].call(this, args[index]);
              }
              return apply(func, this, args);
            });
          });
          var partial = baseRest(function(func, partials) {
            var holders = replaceHolders(partials, getHolder(partial));
            return createWrap(func, WRAP_PARTIAL_FLAG, undefined2, partials, holders);
          });
          var partialRight = baseRest(function(func, partials) {
            var holders = replaceHolders(partials, getHolder(partialRight));
            return createWrap(func, WRAP_PARTIAL_RIGHT_FLAG, undefined2, partials, holders);
          });
          var rearg = flatRest(function(func, indexes) {
            return createWrap(func, WRAP_REARG_FLAG, undefined2, undefined2, undefined2, indexes);
          });
          function rest(func, start) {
            if (typeof func != "function") {
              throw new TypeError2(FUNC_ERROR_TEXT);
            }
            start = start === undefined2 ? start : toInteger(start);
            return baseRest(func, start);
          }
          function spread(func, start) {
            if (typeof func != "function") {
              throw new TypeError2(FUNC_ERROR_TEXT);
            }
            start = start == null ? 0 : nativeMax(toInteger(start), 0);
            return baseRest(function(args) {
              var array = args[start], otherArgs = castSlice(args, 0, start);
              if (array) {
                arrayPush(otherArgs, array);
              }
              return apply(func, this, otherArgs);
            });
          }
          function throttle(func, wait, options) {
            var leading = true, trailing = true;
            if (typeof func != "function") {
              throw new TypeError2(FUNC_ERROR_TEXT);
            }
            if (isObject(options)) {
              leading = "leading" in options ? !!options.leading : leading;
              trailing = "trailing" in options ? !!options.trailing : trailing;
            }
            return debounce(func, wait, {
              "leading": leading,
              "maxWait": wait,
              "trailing": trailing
            });
          }
          function unary(func) {
            return ary(func, 1);
          }
          function wrap(value, wrapper) {
            return partial(castFunction(wrapper), value);
          }
          function castArray() {
            if (!arguments.length) {
              return [];
            }
            var value = arguments[0];
            return isArray(value) ? value : [value];
          }
          function clone(value) {
            return baseClone(value, CLONE_SYMBOLS_FLAG);
          }
          function cloneWith(value, customizer) {
            customizer = typeof customizer == "function" ? customizer : undefined2;
            return baseClone(value, CLONE_SYMBOLS_FLAG, customizer);
          }
          function cloneDeep(value) {
            return baseClone(value, CLONE_DEEP_FLAG | CLONE_SYMBOLS_FLAG);
          }
          function cloneDeepWith(value, customizer) {
            customizer = typeof customizer == "function" ? customizer : undefined2;
            return baseClone(value, CLONE_DEEP_FLAG | CLONE_SYMBOLS_FLAG, customizer);
          }
          function conformsTo(object, source) {
            return source == null || baseConformsTo(object, source, keys(source));
          }
          function eq(value, other) {
            return value === other || value !== value && other !== other;
          }
          var gt = createRelationalOperation(baseGt);
          var gte = createRelationalOperation(function(value, other) {
            return value >= other;
          });
          var isArguments = baseIsArguments(function() {
            return arguments;
          }()) ? baseIsArguments : function(value) {
            return isObjectLike(value) && hasOwnProperty.call(value, "callee") && !propertyIsEnumerable.call(value, "callee");
          };
          var isArray = Array2.isArray;
          var isArrayBuffer = nodeIsArrayBuffer ? baseUnary(nodeIsArrayBuffer) : baseIsArrayBuffer;
          function isArrayLike(value) {
            return value != null && isLength(value.length) && !isFunction(value);
          }
          function isArrayLikeObject(value) {
            return isObjectLike(value) && isArrayLike(value);
          }
          function isBoolean(value) {
            return value === true || value === false || isObjectLike(value) && baseGetTag(value) == boolTag;
          }
          var isBuffer = nativeIsBuffer || stubFalse;
          var isDate = nodeIsDate ? baseUnary(nodeIsDate) : baseIsDate;
          function isElement(value) {
            return isObjectLike(value) && value.nodeType === 1 && !isPlainObject(value);
          }
          function isEmpty(value) {
            if (value == null) {
              return true;
            }
            if (isArrayLike(value) && (isArray(value) || typeof value == "string" || typeof value.splice == "function" || isBuffer(value) || isTypedArray(value) || isArguments(value))) {
              return !value.length;
            }
            var tag = getTag(value);
            if (tag == mapTag || tag == setTag) {
              return !value.size;
            }
            if (isPrototype(value)) {
              return !baseKeys(value).length;
            }
            for (var key in value) {
              if (hasOwnProperty.call(value, key)) {
                return false;
              }
            }
            return true;
          }
          function isEqual(value, other) {
            return baseIsEqual(value, other);
          }
          function isEqualWith(value, other, customizer) {
            customizer = typeof customizer == "function" ? customizer : undefined2;
            var result2 = customizer ? customizer(value, other) : undefined2;
            return result2 === undefined2 ? baseIsEqual(value, other, undefined2, customizer) : !!result2;
          }
          function isError(value) {
            if (!isObjectLike(value)) {
              return false;
            }
            var tag = baseGetTag(value);
            return tag == errorTag || tag == domExcTag || typeof value.message == "string" && typeof value.name == "string" && !isPlainObject(value);
          }
          function isFinite2(value) {
            return typeof value == "number" && nativeIsFinite(value);
          }
          function isFunction(value) {
            if (!isObject(value)) {
              return false;
            }
            var tag = baseGetTag(value);
            return tag == funcTag || tag == genTag || tag == asyncTag || tag == proxyTag;
          }
          function isInteger(value) {
            return typeof value == "number" && value == toInteger(value);
          }
          function isLength(value) {
            return typeof value == "number" && value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
          }
          function isObject(value) {
            var type = typeof value;
            return value != null && (type == "object" || type == "function");
          }
          function isObjectLike(value) {
            return value != null && typeof value == "object";
          }
          var isMap = nodeIsMap ? baseUnary(nodeIsMap) : baseIsMap;
          function isMatch(object, source) {
            return object === source || baseIsMatch(object, source, getMatchData(source));
          }
          function isMatchWith(object, source, customizer) {
            customizer = typeof customizer == "function" ? customizer : undefined2;
            return baseIsMatch(object, source, getMatchData(source), customizer);
          }
          function isNaN2(value) {
            return isNumber(value) && value != +value;
          }
          function isNative(value) {
            if (isMaskable(value)) {
              throw new Error2(CORE_ERROR_TEXT);
            }
            return baseIsNative(value);
          }
          function isNull(value) {
            return value === null;
          }
          function isNil(value) {
            return value == null;
          }
          function isNumber(value) {
            return typeof value == "number" || isObjectLike(value) && baseGetTag(value) == numberTag;
          }
          function isPlainObject(value) {
            if (!isObjectLike(value) || baseGetTag(value) != objectTag) {
              return false;
            }
            var proto = getPrototype(value);
            if (proto === null) {
              return true;
            }
            var Ctor = hasOwnProperty.call(proto, "constructor") && proto.constructor;
            return typeof Ctor == "function" && Ctor instanceof Ctor && funcToString.call(Ctor) == objectCtorString;
          }
          var isRegExp = nodeIsRegExp ? baseUnary(nodeIsRegExp) : baseIsRegExp;
          function isSafeInteger(value) {
            return isInteger(value) && value >= -MAX_SAFE_INTEGER && value <= MAX_SAFE_INTEGER;
          }
          var isSet = nodeIsSet ? baseUnary(nodeIsSet) : baseIsSet;
          function isString(value) {
            return typeof value == "string" || !isArray(value) && isObjectLike(value) && baseGetTag(value) == stringTag;
          }
          function isSymbol(value) {
            return typeof value == "symbol" || isObjectLike(value) && baseGetTag(value) == symbolTag;
          }
          var isTypedArray = nodeIsTypedArray ? baseUnary(nodeIsTypedArray) : baseIsTypedArray;
          function isUndefined(value) {
            return value === undefined2;
          }
          function isWeakMap(value) {
            return isObjectLike(value) && getTag(value) == weakMapTag;
          }
          function isWeakSet(value) {
            return isObjectLike(value) && baseGetTag(value) == weakSetTag;
          }
          var lt = createRelationalOperation(baseLt);
          var lte = createRelationalOperation(function(value, other) {
            return value <= other;
          });
          function toArray(value) {
            if (!value) {
              return [];
            }
            if (isArrayLike(value)) {
              return isString(value) ? stringToArray(value) : copyArray(value);
            }
            if (symIterator && value[symIterator]) {
              return iteratorToArray(value[symIterator]());
            }
            var tag = getTag(value), func = tag == mapTag ? mapToArray : tag == setTag ? setToArray : values;
            return func(value);
          }
          function toFinite(value) {
            if (!value) {
              return value === 0 ? value : 0;
            }
            value = toNumber(value);
            if (value === INFINITY || value === -INFINITY) {
              var sign = value < 0 ? -1 : 1;
              return sign * MAX_INTEGER;
            }
            return value === value ? value : 0;
          }
          function toInteger(value) {
            var result2 = toFinite(value), remainder = result2 % 1;
            return result2 === result2 ? remainder ? result2 - remainder : result2 : 0;
          }
          function toLength(value) {
            return value ? baseClamp(toInteger(value), 0, MAX_ARRAY_LENGTH) : 0;
          }
          function toNumber(value) {
            if (typeof value == "number") {
              return value;
            }
            if (isSymbol(value)) {
              return NAN;
            }
            if (isObject(value)) {
              var other = typeof value.valueOf == "function" ? value.valueOf() : value;
              value = isObject(other) ? other + "" : other;
            }
            if (typeof value != "string") {
              return value === 0 ? value : +value;
            }
            value = baseTrim(value);
            var isBinary = reIsBinary.test(value);
            return isBinary || reIsOctal.test(value) ? freeParseInt(value.slice(2), isBinary ? 2 : 8) : reIsBadHex.test(value) ? NAN : +value;
          }
          function toPlainObject(value) {
            return copyObject(value, keysIn(value));
          }
          function toSafeInteger(value) {
            return value ? baseClamp(toInteger(value), -MAX_SAFE_INTEGER, MAX_SAFE_INTEGER) : value === 0 ? value : 0;
          }
          function toString(value) {
            return value == null ? "" : baseToString(value);
          }
          var assign = createAssigner(function(object, source) {
            if (isPrototype(source) || isArrayLike(source)) {
              copyObject(source, keys(source), object);
              return;
            }
            for (var key in source) {
              if (hasOwnProperty.call(source, key)) {
                assignValue(object, key, source[key]);
              }
            }
          });
          var assignIn = createAssigner(function(object, source) {
            copyObject(source, keysIn(source), object);
          });
          var assignInWith = createAssigner(function(object, source, srcIndex, customizer) {
            copyObject(source, keysIn(source), object, customizer);
          });
          var assignWith = createAssigner(function(object, source, srcIndex, customizer) {
            copyObject(source, keys(source), object, customizer);
          });
          var at = flatRest(baseAt);
          function create(prototype, properties) {
            var result2 = baseCreate(prototype);
            return properties == null ? result2 : baseAssign(result2, properties);
          }
          var defaults = baseRest(function(object, sources) {
            object = Object2(object);
            var index = -1;
            var length = sources.length;
            var guard = length > 2 ? sources[2] : undefined2;
            if (guard && isIterateeCall(sources[0], sources[1], guard)) {
              length = 1;
            }
            while (++index < length) {
              var source = sources[index];
              var props = keysIn(source);
              var propsIndex = -1;
              var propsLength = props.length;
              while (++propsIndex < propsLength) {
                var key = props[propsIndex];
                var value = object[key];
                if (value === undefined2 || eq(value, objectProto[key]) && !hasOwnProperty.call(object, key)) {
                  object[key] = source[key];
                }
              }
            }
            return object;
          });
          var defaultsDeep = baseRest(function(args) {
            args.push(undefined2, customDefaultsMerge);
            return apply(mergeWith, undefined2, args);
          });
          function findKey(object, predicate) {
            return baseFindKey(object, getIteratee(predicate, 3), baseForOwn);
          }
          function findLastKey(object, predicate) {
            return baseFindKey(object, getIteratee(predicate, 3), baseForOwnRight);
          }
          function forIn(object, iteratee2) {
            return object == null ? object : baseFor(object, getIteratee(iteratee2, 3), keysIn);
          }
          function forInRight(object, iteratee2) {
            return object == null ? object : baseForRight(object, getIteratee(iteratee2, 3), keysIn);
          }
          function forOwn(object, iteratee2) {
            return object && baseForOwn(object, getIteratee(iteratee2, 3));
          }
          function forOwnRight(object, iteratee2) {
            return object && baseForOwnRight(object, getIteratee(iteratee2, 3));
          }
          function functions(object) {
            return object == null ? [] : baseFunctions(object, keys(object));
          }
          function functionsIn(object) {
            return object == null ? [] : baseFunctions(object, keysIn(object));
          }
          function get(object, path, defaultValue) {
            var result2 = object == null ? undefined2 : baseGet(object, path);
            return result2 === undefined2 ? defaultValue : result2;
          }
          function has(object, path) {
            return object != null && hasPath(object, path, baseHas);
          }
          function hasIn(object, path) {
            return object != null && hasPath(object, path, baseHasIn);
          }
          var invert = createInverter(function(result2, value, key) {
            if (value != null && typeof value.toString != "function") {
              value = nativeObjectToString.call(value);
            }
            result2[value] = key;
          }, constant(identity));
          var invertBy = createInverter(function(result2, value, key) {
            if (value != null && typeof value.toString != "function") {
              value = nativeObjectToString.call(value);
            }
            if (hasOwnProperty.call(result2, value)) {
              result2[value].push(key);
            } else {
              result2[value] = [key];
            }
          }, getIteratee);
          var invoke = baseRest(baseInvoke);
          function keys(object) {
            return isArrayLike(object) ? arrayLikeKeys(object) : baseKeys(object);
          }
          function keysIn(object) {
            return isArrayLike(object) ? arrayLikeKeys(object, true) : baseKeysIn(object);
          }
          function mapKeys(object, iteratee2) {
            var result2 = {};
            iteratee2 = getIteratee(iteratee2, 3);
            baseForOwn(object, function(value, key, object2) {
              baseAssignValue(result2, iteratee2(value, key, object2), value);
            });
            return result2;
          }
          function mapValues(object, iteratee2) {
            var result2 = {};
            iteratee2 = getIteratee(iteratee2, 3);
            baseForOwn(object, function(value, key, object2) {
              baseAssignValue(result2, key, iteratee2(value, key, object2));
            });
            return result2;
          }
          var merge = createAssigner(function(object, source, srcIndex) {
            baseMerge(object, source, srcIndex);
          });
          var mergeWith = createAssigner(function(object, source, srcIndex, customizer) {
            baseMerge(object, source, srcIndex, customizer);
          });
          var omit = flatRest(function(object, paths) {
            var result2 = {};
            if (object == null) {
              return result2;
            }
            var isDeep = false;
            paths = arrayMap(paths, function(path) {
              path = castPath(path, object);
              isDeep || (isDeep = path.length > 1);
              return path;
            });
            copyObject(object, getAllKeysIn(object), result2);
            if (isDeep) {
              result2 = baseClone(result2, CLONE_DEEP_FLAG | CLONE_FLAT_FLAG | CLONE_SYMBOLS_FLAG, customOmitClone);
            }
            var length = paths.length;
            while (length--) {
              baseUnset(result2, paths[length]);
            }
            return result2;
          });
          function omitBy(object, predicate) {
            return pickBy(object, negate(getIteratee(predicate)));
          }
          var pick = flatRest(function(object, paths) {
            return object == null ? {} : basePick(object, paths);
          });
          function pickBy(object, predicate) {
            if (object == null) {
              return {};
            }
            var props = arrayMap(getAllKeysIn(object), function(prop) {
              return [prop];
            });
            predicate = getIteratee(predicate);
            return basePickBy(object, props, function(value, path) {
              return predicate(value, path[0]);
            });
          }
          function result(object, path, defaultValue) {
            path = castPath(path, object);
            var index = -1, length = path.length;
            if (!length) {
              length = 1;
              object = undefined2;
            }
            while (++index < length) {
              var value = object == null ? undefined2 : object[toKey(path[index])];
              if (value === undefined2) {
                index = length;
                value = defaultValue;
              }
              object = isFunction(value) ? value.call(object) : value;
            }
            return object;
          }
          function set(object, path, value) {
            return object == null ? object : baseSet(object, path, value);
          }
          function setWith(object, path, value, customizer) {
            customizer = typeof customizer == "function" ? customizer : undefined2;
            return object == null ? object : baseSet(object, path, value, customizer);
          }
          var toPairs = createToPairs(keys);
          var toPairsIn = createToPairs(keysIn);
          function transform(object, iteratee2, accumulator) {
            var isArr = isArray(object), isArrLike = isArr || isBuffer(object) || isTypedArray(object);
            iteratee2 = getIteratee(iteratee2, 4);
            if (accumulator == null) {
              var Ctor = object && object.constructor;
              if (isArrLike) {
                accumulator = isArr ? new Ctor() : [];
              } else if (isObject(object)) {
                accumulator = isFunction(Ctor) ? baseCreate(getPrototype(object)) : {};
              } else {
                accumulator = {};
              }
            }
            (isArrLike ? arrayEach : baseForOwn)(object, function(value, index, object2) {
              return iteratee2(accumulator, value, index, object2);
            });
            return accumulator;
          }
          function unset(object, path) {
            return object == null ? true : baseUnset(object, path);
          }
          function update(object, path, updater) {
            return object == null ? object : baseUpdate(object, path, castFunction(updater));
          }
          function updateWith(object, path, updater, customizer) {
            customizer = typeof customizer == "function" ? customizer : undefined2;
            return object == null ? object : baseUpdate(object, path, castFunction(updater), customizer);
          }
          function values(object) {
            return object == null ? [] : baseValues(object, keys(object));
          }
          function valuesIn(object) {
            return object == null ? [] : baseValues(object, keysIn(object));
          }
          function clamp(number, lower, upper) {
            if (upper === undefined2) {
              upper = lower;
              lower = undefined2;
            }
            if (upper !== undefined2) {
              upper = toNumber(upper);
              upper = upper === upper ? upper : 0;
            }
            if (lower !== undefined2) {
              lower = toNumber(lower);
              lower = lower === lower ? lower : 0;
            }
            return baseClamp(toNumber(number), lower, upper);
          }
          function inRange(number, start, end) {
            start = toFinite(start);
            if (end === undefined2) {
              end = start;
              start = 0;
            } else {
              end = toFinite(end);
            }
            number = toNumber(number);
            return baseInRange(number, start, end);
          }
          function random(lower, upper, floating) {
            if (floating && typeof floating != "boolean" && isIterateeCall(lower, upper, floating)) {
              upper = floating = undefined2;
            }
            if (floating === undefined2) {
              if (typeof upper == "boolean") {
                floating = upper;
                upper = undefined2;
              } else if (typeof lower == "boolean") {
                floating = lower;
                lower = undefined2;
              }
            }
            if (lower === undefined2 && upper === undefined2) {
              lower = 0;
              upper = 1;
            } else {
              lower = toFinite(lower);
              if (upper === undefined2) {
                upper = lower;
                lower = 0;
              } else {
                upper = toFinite(upper);
              }
            }
            if (lower > upper) {
              var temp = lower;
              lower = upper;
              upper = temp;
            }
            if (floating || lower % 1 || upper % 1) {
              var rand = nativeRandom();
              return nativeMin(lower + rand * (upper - lower + freeParseFloat("1e-" + ((rand + "").length - 1))), upper);
            }
            return baseRandom(lower, upper);
          }
          var camelCase = createCompounder(function(result2, word, index) {
            word = word.toLowerCase();
            return result2 + (index ? capitalize(word) : word);
          });
          function capitalize(string) {
            return upperFirst(toString(string).toLowerCase());
          }
          function deburr(string) {
            string = toString(string);
            return string && string.replace(reLatin, deburrLetter).replace(reComboMark, "");
          }
          function endsWith(string, target, position) {
            string = toString(string);
            target = baseToString(target);
            var length = string.length;
            position = position === undefined2 ? length : baseClamp(toInteger(position), 0, length);
            var end = position;
            position -= target.length;
            return position >= 0 && string.slice(position, end) == target;
          }
          function escape(string) {
            string = toString(string);
            return string && reHasUnescapedHtml.test(string) ? string.replace(reUnescapedHtml, escapeHtmlChar) : string;
          }
          function escapeRegExp(string) {
            string = toString(string);
            return string && reHasRegExpChar.test(string) ? string.replace(reRegExpChar, "\\$&") : string;
          }
          var kebabCase = createCompounder(function(result2, word, index) {
            return result2 + (index ? "-" : "") + word.toLowerCase();
          });
          var lowerCase = createCompounder(function(result2, word, index) {
            return result2 + (index ? " " : "") + word.toLowerCase();
          });
          var lowerFirst = createCaseFirst("toLowerCase");
          function pad(string, length, chars) {
            string = toString(string);
            length = toInteger(length);
            var strLength = length ? stringSize(string) : 0;
            if (!length || strLength >= length) {
              return string;
            }
            var mid = (length - strLength) / 2;
            return createPadding(nativeFloor(mid), chars) + string + createPadding(nativeCeil(mid), chars);
          }
          function padEnd(string, length, chars) {
            string = toString(string);
            length = toInteger(length);
            var strLength = length ? stringSize(string) : 0;
            return length && strLength < length ? string + createPadding(length - strLength, chars) : string;
          }
          function padStart(string, length, chars) {
            string = toString(string);
            length = toInteger(length);
            var strLength = length ? stringSize(string) : 0;
            return length && strLength < length ? createPadding(length - strLength, chars) + string : string;
          }
          function parseInt2(string, radix, guard) {
            if (guard || radix == null) {
              radix = 0;
            } else if (radix) {
              radix = +radix;
            }
            return nativeParseInt(toString(string).replace(reTrimStart, ""), radix || 0);
          }
          function repeat(string, n, guard) {
            if (guard ? isIterateeCall(string, n, guard) : n === undefined2) {
              n = 1;
            } else {
              n = toInteger(n);
            }
            return baseRepeat(toString(string), n);
          }
          function replace() {
            var args = arguments, string = toString(args[0]);
            return args.length < 3 ? string : string.replace(args[1], args[2]);
          }
          var snakeCase = createCompounder(function(result2, word, index) {
            return result2 + (index ? "_" : "") + word.toLowerCase();
          });
          function split(string, separator, limit) {
            if (limit && typeof limit != "number" && isIterateeCall(string, separator, limit)) {
              separator = limit = undefined2;
            }
            limit = limit === undefined2 ? MAX_ARRAY_LENGTH : limit >>> 0;
            if (!limit) {
              return [];
            }
            string = toString(string);
            if (string && (typeof separator == "string" || separator != null && !isRegExp(separator))) {
              separator = baseToString(separator);
              if (!separator && hasUnicode(string)) {
                return castSlice(stringToArray(string), 0, limit);
              }
            }
            return string.split(separator, limit);
          }
          var startCase = createCompounder(function(result2, word, index) {
            return result2 + (index ? " " : "") + upperFirst(word);
          });
          function startsWith(string, target, position) {
            string = toString(string);
            position = position == null ? 0 : baseClamp(toInteger(position), 0, string.length);
            target = baseToString(target);
            return string.slice(position, position + target.length) == target;
          }
          function template(string, options, guard) {
            var settings = lodash.templateSettings;
            if (guard && isIterateeCall(string, options, guard)) {
              options = undefined2;
            }
            string = toString(string);
            options = assignInWith({}, options, settings, customDefaultsAssignIn);
            var imports = assignInWith({}, options.imports, settings.imports, customDefaultsAssignIn), importsKeys = keys(imports), importsValues = baseValues(imports, importsKeys);
            var isEscaping, isEvaluating, index = 0, interpolate2 = options.interpolate || reNoMatch, source = "__p += '";
            var reDelimiters = RegExp2(
              (options.escape || reNoMatch).source + "|" + interpolate2.source + "|" + (interpolate2 === reInterpolate ? reEsTemplate : reNoMatch).source + "|" + (options.evaluate || reNoMatch).source + "|$",
              "g"
            );
            var sourceURL = "//# sourceURL=" + (hasOwnProperty.call(options, "sourceURL") ? (options.sourceURL + "").replace(/\s/g, " ") : "lodash.templateSources[" + ++templateCounter + "]") + "\n";
            string.replace(reDelimiters, function(match, escapeValue, interpolateValue, esTemplateValue, evaluateValue, offset) {
              interpolateValue || (interpolateValue = esTemplateValue);
              source += string.slice(index, offset).replace(reUnescapedString, escapeStringChar);
              if (escapeValue) {
                isEscaping = true;
                source += "' +\n__e(" + escapeValue + ") +\n'";
              }
              if (evaluateValue) {
                isEvaluating = true;
                source += "';\n" + evaluateValue + ";\n__p += '";
              }
              if (interpolateValue) {
                source += "' +\n((__t = (" + interpolateValue + ")) == null ? '' : __t) +\n'";
              }
              index = offset + match.length;
              return match;
            });
            source += "';\n";
            var variable = hasOwnProperty.call(options, "variable") && options.variable;
            if (!variable) {
              source = "with (obj) {\n" + source + "\n}\n";
            } else if (reForbiddenIdentifierChars.test(variable)) {
              throw new Error2(INVALID_TEMPL_VAR_ERROR_TEXT);
            }
            source = (isEvaluating ? source.replace(reEmptyStringLeading, "") : source).replace(reEmptyStringMiddle, "$1").replace(reEmptyStringTrailing, "$1;");
            source = "function(" + (variable || "obj") + ") {\n" + (variable ? "" : "obj || (obj = {});\n") + "var __t, __p = ''" + (isEscaping ? ", __e = _.escape" : "") + (isEvaluating ? ", __j = Array.prototype.join;\nfunction print() { __p += __j.call(arguments, '') }\n" : ";\n") + source + "return __p\n}";
            var result2 = attempt(function() {
              return Function2(importsKeys, sourceURL + "return " + source).apply(undefined2, importsValues);
            });
            result2.source = source;
            if (isError(result2)) {
              throw result2;
            }
            return result2;
          }
          function toLower(value) {
            return toString(value).toLowerCase();
          }
          function toUpper(value) {
            return toString(value).toUpperCase();
          }
          function trim(string, chars, guard) {
            string = toString(string);
            if (string && (guard || chars === undefined2)) {
              return baseTrim(string);
            }
            if (!string || !(chars = baseToString(chars))) {
              return string;
            }
            var strSymbols = stringToArray(string), chrSymbols = stringToArray(chars), start = charsStartIndex(strSymbols, chrSymbols), end = charsEndIndex(strSymbols, chrSymbols) + 1;
            return castSlice(strSymbols, start, end).join("");
          }
          function trimEnd(string, chars, guard) {
            string = toString(string);
            if (string && (guard || chars === undefined2)) {
              return string.slice(0, trimmedEndIndex(string) + 1);
            }
            if (!string || !(chars = baseToString(chars))) {
              return string;
            }
            var strSymbols = stringToArray(string), end = charsEndIndex(strSymbols, stringToArray(chars)) + 1;
            return castSlice(strSymbols, 0, end).join("");
          }
          function trimStart(string, chars, guard) {
            string = toString(string);
            if (string && (guard || chars === undefined2)) {
              return string.replace(reTrimStart, "");
            }
            if (!string || !(chars = baseToString(chars))) {
              return string;
            }
            var strSymbols = stringToArray(string), start = charsStartIndex(strSymbols, stringToArray(chars));
            return castSlice(strSymbols, start).join("");
          }
          function truncate(string, options) {
            var length = DEFAULT_TRUNC_LENGTH, omission = DEFAULT_TRUNC_OMISSION;
            if (isObject(options)) {
              var separator = "separator" in options ? options.separator : separator;
              length = "length" in options ? toInteger(options.length) : length;
              omission = "omission" in options ? baseToString(options.omission) : omission;
            }
            string = toString(string);
            var strLength = string.length;
            if (hasUnicode(string)) {
              var strSymbols = stringToArray(string);
              strLength = strSymbols.length;
            }
            if (length >= strLength) {
              return string;
            }
            var end = length - stringSize(omission);
            if (end < 1) {
              return omission;
            }
            var result2 = strSymbols ? castSlice(strSymbols, 0, end).join("") : string.slice(0, end);
            if (separator === undefined2) {
              return result2 + omission;
            }
            if (strSymbols) {
              end += result2.length - end;
            }
            if (isRegExp(separator)) {
              if (string.slice(end).search(separator)) {
                var match, substring = result2;
                if (!separator.global) {
                  separator = RegExp2(separator.source, toString(reFlags.exec(separator)) + "g");
                }
                separator.lastIndex = 0;
                while (match = separator.exec(substring)) {
                  var newEnd = match.index;
                }
                result2 = result2.slice(0, newEnd === undefined2 ? end : newEnd);
              }
            } else if (string.indexOf(baseToString(separator), end) != end) {
              var index = result2.lastIndexOf(separator);
              if (index > -1) {
                result2 = result2.slice(0, index);
              }
            }
            return result2 + omission;
          }
          function unescape(string) {
            string = toString(string);
            return string && reHasEscapedHtml.test(string) ? string.replace(reEscapedHtml, unescapeHtmlChar) : string;
          }
          var upperCase = createCompounder(function(result2, word, index) {
            return result2 + (index ? " " : "") + word.toUpperCase();
          });
          var upperFirst = createCaseFirst("toUpperCase");
          function words(string, pattern, guard) {
            string = toString(string);
            pattern = guard ? undefined2 : pattern;
            if (pattern === undefined2) {
              return hasUnicodeWord(string) ? unicodeWords(string) : asciiWords(string);
            }
            return string.match(pattern) || [];
          }
          var attempt = baseRest(function(func, args) {
            try {
              return apply(func, undefined2, args);
            } catch (e) {
              return isError(e) ? e : new Error2(e);
            }
          });
          var bindAll = flatRest(function(object, methodNames) {
            arrayEach(methodNames, function(key) {
              key = toKey(key);
              baseAssignValue(object, key, bind(object[key], object));
            });
            return object;
          });
          function cond(pairs) {
            var length = pairs == null ? 0 : pairs.length, toIteratee = getIteratee();
            pairs = !length ? [] : arrayMap(pairs, function(pair) {
              if (typeof pair[1] != "function") {
                throw new TypeError2(FUNC_ERROR_TEXT);
              }
              return [toIteratee(pair[0]), pair[1]];
            });
            return baseRest(function(args) {
              var index = -1;
              while (++index < length) {
                var pair = pairs[index];
                if (apply(pair[0], this, args)) {
                  return apply(pair[1], this, args);
                }
              }
            });
          }
          function conforms(source) {
            return baseConforms(baseClone(source, CLONE_DEEP_FLAG));
          }
          function constant(value) {
            return function() {
              return value;
            };
          }
          function defaultTo(value, defaultValue) {
            return value == null || value !== value ? defaultValue : value;
          }
          var flow = createFlow();
          var flowRight = createFlow(true);
          function identity(value) {
            return value;
          }
          function iteratee(func) {
            return baseIteratee(typeof func == "function" ? func : baseClone(func, CLONE_DEEP_FLAG));
          }
          function matches(source) {
            return baseMatches(baseClone(source, CLONE_DEEP_FLAG));
          }
          function matchesProperty(path, srcValue) {
            return baseMatchesProperty(path, baseClone(srcValue, CLONE_DEEP_FLAG));
          }
          var method = baseRest(function(path, args) {
            return function(object) {
              return baseInvoke(object, path, args);
            };
          });
          var methodOf = baseRest(function(object, args) {
            return function(path) {
              return baseInvoke(object, path, args);
            };
          });
          function mixin(object, source, options) {
            var props = keys(source), methodNames = baseFunctions(source, props);
            if (options == null && !(isObject(source) && (methodNames.length || !props.length))) {
              options = source;
              source = object;
              object = this;
              methodNames = baseFunctions(source, keys(source));
            }
            var chain2 = !(isObject(options) && "chain" in options) || !!options.chain, isFunc = isFunction(object);
            arrayEach(methodNames, function(methodName) {
              var func = source[methodName];
              object[methodName] = func;
              if (isFunc) {
                object.prototype[methodName] = function() {
                  var chainAll = this.__chain__;
                  if (chain2 || chainAll) {
                    var result2 = object(this.__wrapped__), actions = result2.__actions__ = copyArray(this.__actions__);
                    actions.push({ "func": func, "args": arguments, "thisArg": object });
                    result2.__chain__ = chainAll;
                    return result2;
                  }
                  return func.apply(object, arrayPush([this.value()], arguments));
                };
              }
            });
            return object;
          }
          function noConflict() {
            if (root._ === this) {
              root._ = oldDash;
            }
            return this;
          }
          function noop() {
          }
          function nthArg(n) {
            n = toInteger(n);
            return baseRest(function(args) {
              return baseNth(args, n);
            });
          }
          var over = createOver(arrayMap);
          var overEvery = createOver(arrayEvery);
          var overSome = createOver(arraySome);
          function property(path) {
            return isKey(path) ? baseProperty(toKey(path)) : basePropertyDeep(path);
          }
          function propertyOf(object) {
            return function(path) {
              return object == null ? undefined2 : baseGet(object, path);
            };
          }
          var range = createRange();
          var rangeRight = createRange(true);
          function stubArray() {
            return [];
          }
          function stubFalse() {
            return false;
          }
          function stubObject() {
            return {};
          }
          function stubString() {
            return "";
          }
          function stubTrue() {
            return true;
          }
          function times(n, iteratee2) {
            n = toInteger(n);
            if (n < 1 || n > MAX_SAFE_INTEGER) {
              return [];
            }
            var index = MAX_ARRAY_LENGTH, length = nativeMin(n, MAX_ARRAY_LENGTH);
            iteratee2 = getIteratee(iteratee2);
            n -= MAX_ARRAY_LENGTH;
            var result2 = baseTimes(length, iteratee2);
            while (++index < n) {
              iteratee2(index);
            }
            return result2;
          }
          function toPath(value) {
            if (isArray(value)) {
              return arrayMap(value, toKey);
            }
            return isSymbol(value) ? [value] : copyArray(stringToPath(toString(value)));
          }
          function uniqueId(prefix) {
            var id = ++idCounter;
            return toString(prefix) + id;
          }
          var add = createMathOperation(function(augend, addend) {
            return augend + addend;
          }, 0);
          var ceil = createRound("ceil");
          var divide = createMathOperation(function(dividend, divisor) {
            return dividend / divisor;
          }, 1);
          var floor = createRound("floor");
          function max(array) {
            return array && array.length ? baseExtremum(array, identity, baseGt) : undefined2;
          }
          function maxBy(array, iteratee2) {
            return array && array.length ? baseExtremum(array, getIteratee(iteratee2, 2), baseGt) : undefined2;
          }
          function mean(array) {
            return baseMean(array, identity);
          }
          function meanBy(array, iteratee2) {
            return baseMean(array, getIteratee(iteratee2, 2));
          }
          function min(array) {
            return array && array.length ? baseExtremum(array, identity, baseLt) : undefined2;
          }
          function minBy(array, iteratee2) {
            return array && array.length ? baseExtremum(array, getIteratee(iteratee2, 2), baseLt) : undefined2;
          }
          var multiply = createMathOperation(function(multiplier, multiplicand) {
            return multiplier * multiplicand;
          }, 1);
          var round = createRound("round");
          var subtract = createMathOperation(function(minuend, subtrahend) {
            return minuend - subtrahend;
          }, 0);
          function sum(array) {
            return array && array.length ? baseSum(array, identity) : 0;
          }
          function sumBy(array, iteratee2) {
            return array && array.length ? baseSum(array, getIteratee(iteratee2, 2)) : 0;
          }
          lodash.after = after;
          lodash.ary = ary;
          lodash.assign = assign;
          lodash.assignIn = assignIn;
          lodash.assignInWith = assignInWith;
          lodash.assignWith = assignWith;
          lodash.at = at;
          lodash.before = before;
          lodash.bind = bind;
          lodash.bindAll = bindAll;
          lodash.bindKey = bindKey;
          lodash.castArray = castArray;
          lodash.chain = chain;
          lodash.chunk = chunk;
          lodash.compact = compact;
          lodash.concat = concat;
          lodash.cond = cond;
          lodash.conforms = conforms;
          lodash.constant = constant;
          lodash.countBy = countBy;
          lodash.create = create;
          lodash.curry = curry;
          lodash.curryRight = curryRight;
          lodash.debounce = debounce;
          lodash.defaults = defaults;
          lodash.defaultsDeep = defaultsDeep;
          lodash.defer = defer;
          lodash.delay = delay;
          lodash.difference = difference;
          lodash.differenceBy = differenceBy;
          lodash.differenceWith = differenceWith;
          lodash.drop = drop;
          lodash.dropRight = dropRight;
          lodash.dropRightWhile = dropRightWhile;
          lodash.dropWhile = dropWhile;
          lodash.fill = fill;
          lodash.filter = filter;
          lodash.flatMap = flatMap;
          lodash.flatMapDeep = flatMapDeep;
          lodash.flatMapDepth = flatMapDepth;
          lodash.flatten = flatten;
          lodash.flattenDeep = flattenDeep;
          lodash.flattenDepth = flattenDepth;
          lodash.flip = flip;
          lodash.flow = flow;
          lodash.flowRight = flowRight;
          lodash.fromPairs = fromPairs;
          lodash.functions = functions;
          lodash.functionsIn = functionsIn;
          lodash.groupBy = groupBy;
          lodash.initial = initial;
          lodash.intersection = intersection;
          lodash.intersectionBy = intersectionBy;
          lodash.intersectionWith = intersectionWith;
          lodash.invert = invert;
          lodash.invertBy = invertBy;
          lodash.invokeMap = invokeMap;
          lodash.iteratee = iteratee;
          lodash.keyBy = keyBy;
          lodash.keys = keys;
          lodash.keysIn = keysIn;
          lodash.map = map;
          lodash.mapKeys = mapKeys;
          lodash.mapValues = mapValues;
          lodash.matches = matches;
          lodash.matchesProperty = matchesProperty;
          lodash.memoize = memoize;
          lodash.merge = merge;
          lodash.mergeWith = mergeWith;
          lodash.method = method;
          lodash.methodOf = methodOf;
          lodash.mixin = mixin;
          lodash.negate = negate;
          lodash.nthArg = nthArg;
          lodash.omit = omit;
          lodash.omitBy = omitBy;
          lodash.once = once;
          lodash.orderBy = orderBy;
          lodash.over = over;
          lodash.overArgs = overArgs;
          lodash.overEvery = overEvery;
          lodash.overSome = overSome;
          lodash.partial = partial;
          lodash.partialRight = partialRight;
          lodash.partition = partition;
          lodash.pick = pick;
          lodash.pickBy = pickBy;
          lodash.property = property;
          lodash.propertyOf = propertyOf;
          lodash.pull = pull;
          lodash.pullAll = pullAll;
          lodash.pullAllBy = pullAllBy;
          lodash.pullAllWith = pullAllWith;
          lodash.pullAt = pullAt;
          lodash.range = range;
          lodash.rangeRight = rangeRight;
          lodash.rearg = rearg;
          lodash.reject = reject;
          lodash.remove = remove;
          lodash.rest = rest;
          lodash.reverse = reverse;
          lodash.sampleSize = sampleSize;
          lodash.set = set;
          lodash.setWith = setWith;
          lodash.shuffle = shuffle;
          lodash.slice = slice;
          lodash.sortBy = sortBy;
          lodash.sortedUniq = sortedUniq;
          lodash.sortedUniqBy = sortedUniqBy;
          lodash.split = split;
          lodash.spread = spread;
          lodash.tail = tail;
          lodash.take = take;
          lodash.takeRight = takeRight;
          lodash.takeRightWhile = takeRightWhile;
          lodash.takeWhile = takeWhile;
          lodash.tap = tap;
          lodash.throttle = throttle;
          lodash.thru = thru;
          lodash.toArray = toArray;
          lodash.toPairs = toPairs;
          lodash.toPairsIn = toPairsIn;
          lodash.toPath = toPath;
          lodash.toPlainObject = toPlainObject;
          lodash.transform = transform;
          lodash.unary = unary;
          lodash.union = union;
          lodash.unionBy = unionBy;
          lodash.unionWith = unionWith;
          lodash.uniq = uniq;
          lodash.uniqBy = uniqBy;
          lodash.uniqWith = uniqWith;
          lodash.unset = unset;
          lodash.unzip = unzip;
          lodash.unzipWith = unzipWith;
          lodash.update = update;
          lodash.updateWith = updateWith;
          lodash.values = values;
          lodash.valuesIn = valuesIn;
          lodash.without = without;
          lodash.words = words;
          lodash.wrap = wrap;
          lodash.xor = xor;
          lodash.xorBy = xorBy;
          lodash.xorWith = xorWith;
          lodash.zip = zip;
          lodash.zipObject = zipObject;
          lodash.zipObjectDeep = zipObjectDeep;
          lodash.zipWith = zipWith;
          lodash.entries = toPairs;
          lodash.entriesIn = toPairsIn;
          lodash.extend = assignIn;
          lodash.extendWith = assignInWith;
          mixin(lodash, lodash);
          lodash.add = add;
          lodash.attempt = attempt;
          lodash.camelCase = camelCase;
          lodash.capitalize = capitalize;
          lodash.ceil = ceil;
          lodash.clamp = clamp;
          lodash.clone = clone;
          lodash.cloneDeep = cloneDeep;
          lodash.cloneDeepWith = cloneDeepWith;
          lodash.cloneWith = cloneWith;
          lodash.conformsTo = conformsTo;
          lodash.deburr = deburr;
          lodash.defaultTo = defaultTo;
          lodash.divide = divide;
          lodash.endsWith = endsWith;
          lodash.eq = eq;
          lodash.escape = escape;
          lodash.escapeRegExp = escapeRegExp;
          lodash.every = every;
          lodash.find = find;
          lodash.findIndex = findIndex;
          lodash.findKey = findKey;
          lodash.findLast = findLast;
          lodash.findLastIndex = findLastIndex;
          lodash.findLastKey = findLastKey;
          lodash.floor = floor;
          lodash.forEach = forEach;
          lodash.forEachRight = forEachRight;
          lodash.forIn = forIn;
          lodash.forInRight = forInRight;
          lodash.forOwn = forOwn;
          lodash.forOwnRight = forOwnRight;
          lodash.get = get;
          lodash.gt = gt;
          lodash.gte = gte;
          lodash.has = has;
          lodash.hasIn = hasIn;
          lodash.head = head;
          lodash.identity = identity;
          lodash.includes = includes;
          lodash.indexOf = indexOf;
          lodash.inRange = inRange;
          lodash.invoke = invoke;
          lodash.isArguments = isArguments;
          lodash.isArray = isArray;
          lodash.isArrayBuffer = isArrayBuffer;
          lodash.isArrayLike = isArrayLike;
          lodash.isArrayLikeObject = isArrayLikeObject;
          lodash.isBoolean = isBoolean;
          lodash.isBuffer = isBuffer;
          lodash.isDate = isDate;
          lodash.isElement = isElement;
          lodash.isEmpty = isEmpty;
          lodash.isEqual = isEqual;
          lodash.isEqualWith = isEqualWith;
          lodash.isError = isError;
          lodash.isFinite = isFinite2;
          lodash.isFunction = isFunction;
          lodash.isInteger = isInteger;
          lodash.isLength = isLength;
          lodash.isMap = isMap;
          lodash.isMatch = isMatch;
          lodash.isMatchWith = isMatchWith;
          lodash.isNaN = isNaN2;
          lodash.isNative = isNative;
          lodash.isNil = isNil;
          lodash.isNull = isNull;
          lodash.isNumber = isNumber;
          lodash.isObject = isObject;
          lodash.isObjectLike = isObjectLike;
          lodash.isPlainObject = isPlainObject;
          lodash.isRegExp = isRegExp;
          lodash.isSafeInteger = isSafeInteger;
          lodash.isSet = isSet;
          lodash.isString = isString;
          lodash.isSymbol = isSymbol;
          lodash.isTypedArray = isTypedArray;
          lodash.isUndefined = isUndefined;
          lodash.isWeakMap = isWeakMap;
          lodash.isWeakSet = isWeakSet;
          lodash.join = join;
          lodash.kebabCase = kebabCase;
          lodash.last = last;
          lodash.lastIndexOf = lastIndexOf;
          lodash.lowerCase = lowerCase;
          lodash.lowerFirst = lowerFirst;
          lodash.lt = lt;
          lodash.lte = lte;
          lodash.max = max;
          lodash.maxBy = maxBy;
          lodash.mean = mean;
          lodash.meanBy = meanBy;
          lodash.min = min;
          lodash.minBy = minBy;
          lodash.stubArray = stubArray;
          lodash.stubFalse = stubFalse;
          lodash.stubObject = stubObject;
          lodash.stubString = stubString;
          lodash.stubTrue = stubTrue;
          lodash.multiply = multiply;
          lodash.nth = nth;
          lodash.noConflict = noConflict;
          lodash.noop = noop;
          lodash.now = now;
          lodash.pad = pad;
          lodash.padEnd = padEnd;
          lodash.padStart = padStart;
          lodash.parseInt = parseInt2;
          lodash.random = random;
          lodash.reduce = reduce;
          lodash.reduceRight = reduceRight;
          lodash.repeat = repeat;
          lodash.replace = replace;
          lodash.result = result;
          lodash.round = round;
          lodash.runInContext = runInContext2;
          lodash.sample = sample;
          lodash.size = size;
          lodash.snakeCase = snakeCase;
          lodash.some = some;
          lodash.sortedIndex = sortedIndex;
          lodash.sortedIndexBy = sortedIndexBy;
          lodash.sortedIndexOf = sortedIndexOf;
          lodash.sortedLastIndex = sortedLastIndex;
          lodash.sortedLastIndexBy = sortedLastIndexBy;
          lodash.sortedLastIndexOf = sortedLastIndexOf;
          lodash.startCase = startCase;
          lodash.startsWith = startsWith;
          lodash.subtract = subtract;
          lodash.sum = sum;
          lodash.sumBy = sumBy;
          lodash.template = template;
          lodash.times = times;
          lodash.toFinite = toFinite;
          lodash.toInteger = toInteger;
          lodash.toLength = toLength;
          lodash.toLower = toLower;
          lodash.toNumber = toNumber;
          lodash.toSafeInteger = toSafeInteger;
          lodash.toString = toString;
          lodash.toUpper = toUpper;
          lodash.trim = trim;
          lodash.trimEnd = trimEnd;
          lodash.trimStart = trimStart;
          lodash.truncate = truncate;
          lodash.unescape = unescape;
          lodash.uniqueId = uniqueId;
          lodash.upperCase = upperCase;
          lodash.upperFirst = upperFirst;
          lodash.each = forEach;
          lodash.eachRight = forEachRight;
          lodash.first = head;
          mixin(lodash, function() {
            var source = {};
            baseForOwn(lodash, function(func, methodName) {
              if (!hasOwnProperty.call(lodash.prototype, methodName)) {
                source[methodName] = func;
              }
            });
            return source;
          }(), { "chain": false });
          lodash.VERSION = VERSION;
          arrayEach(["bind", "bindKey", "curry", "curryRight", "partial", "partialRight"], function(methodName) {
            lodash[methodName].placeholder = lodash;
          });
          arrayEach(["drop", "take"], function(methodName, index) {
            LazyWrapper.prototype[methodName] = function(n) {
              n = n === undefined2 ? 1 : nativeMax(toInteger(n), 0);
              var result2 = this.__filtered__ && !index ? new LazyWrapper(this) : this.clone();
              if (result2.__filtered__) {
                result2.__takeCount__ = nativeMin(n, result2.__takeCount__);
              } else {
                result2.__views__.push({
                  "size": nativeMin(n, MAX_ARRAY_LENGTH),
                  "type": methodName + (result2.__dir__ < 0 ? "Right" : "")
                });
              }
              return result2;
            };
            LazyWrapper.prototype[methodName + "Right"] = function(n) {
              return this.reverse()[methodName](n).reverse();
            };
          });
          arrayEach(["filter", "map", "takeWhile"], function(methodName, index) {
            var type = index + 1, isFilter = type == LAZY_FILTER_FLAG || type == LAZY_WHILE_FLAG;
            LazyWrapper.prototype[methodName] = function(iteratee2) {
              var result2 = this.clone();
              result2.__iteratees__.push({
                "iteratee": getIteratee(iteratee2, 3),
                "type": type
              });
              result2.__filtered__ = result2.__filtered__ || isFilter;
              return result2;
            };
          });
          arrayEach(["head", "last"], function(methodName, index) {
            var takeName = "take" + (index ? "Right" : "");
            LazyWrapper.prototype[methodName] = function() {
              return this[takeName](1).value()[0];
            };
          });
          arrayEach(["initial", "tail"], function(methodName, index) {
            var dropName = "drop" + (index ? "" : "Right");
            LazyWrapper.prototype[methodName] = function() {
              return this.__filtered__ ? new LazyWrapper(this) : this[dropName](1);
            };
          });
          LazyWrapper.prototype.compact = function() {
            return this.filter(identity);
          };
          LazyWrapper.prototype.find = function(predicate) {
            return this.filter(predicate).head();
          };
          LazyWrapper.prototype.findLast = function(predicate) {
            return this.reverse().find(predicate);
          };
          LazyWrapper.prototype.invokeMap = baseRest(function(path, args) {
            if (typeof path == "function") {
              return new LazyWrapper(this);
            }
            return this.map(function(value) {
              return baseInvoke(value, path, args);
            });
          });
          LazyWrapper.prototype.reject = function(predicate) {
            return this.filter(negate(getIteratee(predicate)));
          };
          LazyWrapper.prototype.slice = function(start, end) {
            start = toInteger(start);
            var result2 = this;
            if (result2.__filtered__ && (start > 0 || end < 0)) {
              return new LazyWrapper(result2);
            }
            if (start < 0) {
              result2 = result2.takeRight(-start);
            } else if (start) {
              result2 = result2.drop(start);
            }
            if (end !== undefined2) {
              end = toInteger(end);
              result2 = end < 0 ? result2.dropRight(-end) : result2.take(end - start);
            }
            return result2;
          };
          LazyWrapper.prototype.takeRightWhile = function(predicate) {
            return this.reverse().takeWhile(predicate).reverse();
          };
          LazyWrapper.prototype.toArray = function() {
            return this.take(MAX_ARRAY_LENGTH);
          };
          baseForOwn(LazyWrapper.prototype, function(func, methodName) {
            var checkIteratee = /^(?:filter|find|map|reject)|While$/.test(methodName), isTaker = /^(?:head|last)$/.test(methodName), lodashFunc = lodash[isTaker ? "take" + (methodName == "last" ? "Right" : "") : methodName], retUnwrapped = isTaker || /^find/.test(methodName);
            if (!lodashFunc) {
              return;
            }
            lodash.prototype[methodName] = function() {
              var value = this.__wrapped__, args = isTaker ? [1] : arguments, isLazy = value instanceof LazyWrapper, iteratee2 = args[0], useLazy = isLazy || isArray(value);
              var interceptor = function(value2) {
                var result3 = lodashFunc.apply(lodash, arrayPush([value2], args));
                return isTaker && chainAll ? result3[0] : result3;
              };
              if (useLazy && checkIteratee && typeof iteratee2 == "function" && iteratee2.length != 1) {
                isLazy = useLazy = false;
              }
              var chainAll = this.__chain__, isHybrid = !!this.__actions__.length, isUnwrapped = retUnwrapped && !chainAll, onlyLazy = isLazy && !isHybrid;
              if (!retUnwrapped && useLazy) {
                value = onlyLazy ? value : new LazyWrapper(this);
                var result2 = func.apply(value, args);
                result2.__actions__.push({ "func": thru, "args": [interceptor], "thisArg": undefined2 });
                return new LodashWrapper(result2, chainAll);
              }
              if (isUnwrapped && onlyLazy) {
                return func.apply(this, args);
              }
              result2 = this.thru(interceptor);
              return isUnwrapped ? isTaker ? result2.value()[0] : result2.value() : result2;
            };
          });
          arrayEach(["pop", "push", "shift", "sort", "splice", "unshift"], function(methodName) {
            var func = arrayProto[methodName], chainName = /^(?:push|sort|unshift)$/.test(methodName) ? "tap" : "thru", retUnwrapped = /^(?:pop|shift)$/.test(methodName);
            lodash.prototype[methodName] = function() {
              var args = arguments;
              if (retUnwrapped && !this.__chain__) {
                var value = this.value();
                return func.apply(isArray(value) ? value : [], args);
              }
              return this[chainName](function(value2) {
                return func.apply(isArray(value2) ? value2 : [], args);
              });
            };
          });
          baseForOwn(LazyWrapper.prototype, function(func, methodName) {
            var lodashFunc = lodash[methodName];
            if (lodashFunc) {
              var key = lodashFunc.name + "";
              if (!hasOwnProperty.call(realNames, key)) {
                realNames[key] = [];
              }
              realNames[key].push({ "name": methodName, "func": lodashFunc });
            }
          });
          realNames[createHybrid(undefined2, WRAP_BIND_KEY_FLAG).name] = [{
            "name": "wrapper",
            "func": undefined2
          }];
          LazyWrapper.prototype.clone = lazyClone;
          LazyWrapper.prototype.reverse = lazyReverse;
          LazyWrapper.prototype.value = lazyValue;
          lodash.prototype.at = wrapperAt;
          lodash.prototype.chain = wrapperChain;
          lodash.prototype.commit = wrapperCommit;
          lodash.prototype.next = wrapperNext;
          lodash.prototype.plant = wrapperPlant;
          lodash.prototype.reverse = wrapperReverse;
          lodash.prototype.toJSON = lodash.prototype.valueOf = lodash.prototype.value = wrapperValue;
          lodash.prototype.first = lodash.prototype.head;
          if (symIterator) {
            lodash.prototype[symIterator] = wrapperToIterator;
          }
          return lodash;
        };
        var _ = runInContext();
        if (typeof define == "function" && typeof define.amd == "object" && define.amd) {
          root._ = _;
          define(function() {
            return _;
          });
        } else if (freeModule) {
          (freeModule.exports = _)._ = _;
          freeExports._ = _;
        } else {
          root._ = _;
        }
      }).call(exports);
    }
  });

  // node_modules/color-name/index.js
  var require_color_name = __commonJS({
    "node_modules/color-name/index.js"(exports, module) {
      "use strict";
      module.exports = {
        "aliceblue": [240, 248, 255],
        "antiquewhite": [250, 235, 215],
        "aqua": [0, 255, 255],
        "aquamarine": [127, 255, 212],
        "azure": [240, 255, 255],
        "beige": [245, 245, 220],
        "bisque": [255, 228, 196],
        "black": [0, 0, 0],
        "blanchedalmond": [255, 235, 205],
        "blue": [0, 0, 255],
        "blueviolet": [138, 43, 226],
        "brown": [165, 42, 42],
        "burlywood": [222, 184, 135],
        "cadetblue": [95, 158, 160],
        "chartreuse": [127, 255, 0],
        "chocolate": [210, 105, 30],
        "coral": [255, 127, 80],
        "cornflowerblue": [100, 149, 237],
        "cornsilk": [255, 248, 220],
        "crimson": [220, 20, 60],
        "cyan": [0, 255, 255],
        "darkblue": [0, 0, 139],
        "darkcyan": [0, 139, 139],
        "darkgoldenrod": [184, 134, 11],
        "darkgray": [169, 169, 169],
        "darkgreen": [0, 100, 0],
        "darkgrey": [169, 169, 169],
        "darkkhaki": [189, 183, 107],
        "darkmagenta": [139, 0, 139],
        "darkolivegreen": [85, 107, 47],
        "darkorange": [255, 140, 0],
        "darkorchid": [153, 50, 204],
        "darkred": [139, 0, 0],
        "darksalmon": [233, 150, 122],
        "darkseagreen": [143, 188, 143],
        "darkslateblue": [72, 61, 139],
        "darkslategray": [47, 79, 79],
        "darkslategrey": [47, 79, 79],
        "darkturquoise": [0, 206, 209],
        "darkviolet": [148, 0, 211],
        "deeppink": [255, 20, 147],
        "deepskyblue": [0, 191, 255],
        "dimgray": [105, 105, 105],
        "dimgrey": [105, 105, 105],
        "dodgerblue": [30, 144, 255],
        "firebrick": [178, 34, 34],
        "floralwhite": [255, 250, 240],
        "forestgreen": [34, 139, 34],
        "fuchsia": [255, 0, 255],
        "gainsboro": [220, 220, 220],
        "ghostwhite": [248, 248, 255],
        "gold": [255, 215, 0],
        "goldenrod": [218, 165, 32],
        "gray": [128, 128, 128],
        "green": [0, 128, 0],
        "greenyellow": [173, 255, 47],
        "grey": [128, 128, 128],
        "honeydew": [240, 255, 240],
        "hotpink": [255, 105, 180],
        "indianred": [205, 92, 92],
        "indigo": [75, 0, 130],
        "ivory": [255, 255, 240],
        "khaki": [240, 230, 140],
        "lavender": [230, 230, 250],
        "lavenderblush": [255, 240, 245],
        "lawngreen": [124, 252, 0],
        "lemonchiffon": [255, 250, 205],
        "lightblue": [173, 216, 230],
        "lightcoral": [240, 128, 128],
        "lightcyan": [224, 255, 255],
        "lightgoldenrodyellow": [250, 250, 210],
        "lightgray": [211, 211, 211],
        "lightgreen": [144, 238, 144],
        "lightgrey": [211, 211, 211],
        "lightpink": [255, 182, 193],
        "lightsalmon": [255, 160, 122],
        "lightseagreen": [32, 178, 170],
        "lightskyblue": [135, 206, 250],
        "lightslategray": [119, 136, 153],
        "lightslategrey": [119, 136, 153],
        "lightsteelblue": [176, 196, 222],
        "lightyellow": [255, 255, 224],
        "lime": [0, 255, 0],
        "limegreen": [50, 205, 50],
        "linen": [250, 240, 230],
        "magenta": [255, 0, 255],
        "maroon": [128, 0, 0],
        "mediumaquamarine": [102, 205, 170],
        "mediumblue": [0, 0, 205],
        "mediumorchid": [186, 85, 211],
        "mediumpurple": [147, 112, 219],
        "mediumseagreen": [60, 179, 113],
        "mediumslateblue": [123, 104, 238],
        "mediumspringgreen": [0, 250, 154],
        "mediumturquoise": [72, 209, 204],
        "mediumvioletred": [199, 21, 133],
        "midnightblue": [25, 25, 112],
        "mintcream": [245, 255, 250],
        "mistyrose": [255, 228, 225],
        "moccasin": [255, 228, 181],
        "navajowhite": [255, 222, 173],
        "navy": [0, 0, 128],
        "oldlace": [253, 245, 230],
        "olive": [128, 128, 0],
        "olivedrab": [107, 142, 35],
        "orange": [255, 165, 0],
        "orangered": [255, 69, 0],
        "orchid": [218, 112, 214],
        "palegoldenrod": [238, 232, 170],
        "palegreen": [152, 251, 152],
        "paleturquoise": [175, 238, 238],
        "palevioletred": [219, 112, 147],
        "papayawhip": [255, 239, 213],
        "peachpuff": [255, 218, 185],
        "peru": [205, 133, 63],
        "pink": [255, 192, 203],
        "plum": [221, 160, 221],
        "powderblue": [176, 224, 230],
        "purple": [128, 0, 128],
        "rebeccapurple": [102, 51, 153],
        "red": [255, 0, 0],
        "rosybrown": [188, 143, 143],
        "royalblue": [65, 105, 225],
        "saddlebrown": [139, 69, 19],
        "salmon": [250, 128, 114],
        "sandybrown": [244, 164, 96],
        "seagreen": [46, 139, 87],
        "seashell": [255, 245, 238],
        "sienna": [160, 82, 45],
        "silver": [192, 192, 192],
        "skyblue": [135, 206, 235],
        "slateblue": [106, 90, 205],
        "slategray": [112, 128, 144],
        "slategrey": [112, 128, 144],
        "snow": [255, 250, 250],
        "springgreen": [0, 255, 127],
        "steelblue": [70, 130, 180],
        "tan": [210, 180, 140],
        "teal": [0, 128, 128],
        "thistle": [216, 191, 216],
        "tomato": [255, 99, 71],
        "turquoise": [64, 224, 208],
        "violet": [238, 130, 238],
        "wheat": [245, 222, 179],
        "white": [255, 255, 255],
        "whitesmoke": [245, 245, 245],
        "yellow": [255, 255, 0],
        "yellowgreen": [154, 205, 50]
      };
    }
  });

  // node_modules/simple-swizzle/node_modules/is-arrayish/index.js
  var require_is_arrayish = __commonJS({
    "node_modules/simple-swizzle/node_modules/is-arrayish/index.js"(exports, module) {
      module.exports = function isArrayish(obj) {
        if (!obj || typeof obj === "string") {
          return false;
        }
        return obj instanceof Array || Array.isArray(obj) || obj.length >= 0 && (obj.splice instanceof Function || Object.getOwnPropertyDescriptor(obj, obj.length - 1) && obj.constructor.name !== "String");
      };
    }
  });

  // node_modules/simple-swizzle/index.js
  var require_simple_swizzle = __commonJS({
    "node_modules/simple-swizzle/index.js"(exports, module) {
      "use strict";
      var isArrayish = require_is_arrayish();
      var concat = Array.prototype.concat;
      var slice = Array.prototype.slice;
      var swizzle = module.exports = function swizzle2(args) {
        var results = [];
        for (var i = 0, len = args.length; i < len; i++) {
          var arg = args[i];
          if (isArrayish(arg)) {
            results = concat.call(results, slice.call(arg));
          } else {
            results.push(arg);
          }
        }
        return results;
      };
      swizzle.wrap = function(fn) {
        return function() {
          return fn(swizzle(arguments));
        };
      };
    }
  });

  // node_modules/color-string/index.js
  var require_color_string = __commonJS({
    "node_modules/color-string/index.js"(exports, module) {
      var colorNames = require_color_name();
      var swizzle = require_simple_swizzle();
      var hasOwnProperty = Object.hasOwnProperty;
      var reverseNames = /* @__PURE__ */ Object.create(null);
      for (name in colorNames) {
        if (hasOwnProperty.call(colorNames, name)) {
          reverseNames[colorNames[name]] = name;
        }
      }
      var name;
      var cs = module.exports = {
        to: {},
        get: {}
      };
      cs.get = function(string) {
        var prefix = string.substring(0, 3).toLowerCase();
        var val;
        var model;
        switch (prefix) {
          case "hsl":
            val = cs.get.hsl(string);
            model = "hsl";
            break;
          case "hwb":
            val = cs.get.hwb(string);
            model = "hwb";
            break;
          default:
            val = cs.get.rgb(string);
            model = "rgb";
            break;
        }
        if (!val) {
          return null;
        }
        return { model, value: val };
      };
      cs.get.rgb = function(string) {
        if (!string) {
          return null;
        }
        var abbr = /^#([a-f0-9]{3,4})$/i;
        var hex = /^#([a-f0-9]{6})([a-f0-9]{2})?$/i;
        var rgba = /^rgba?\(\s*([+-]?\d+)(?=[\s,])\s*(?:,\s*)?([+-]?\d+)(?=[\s,])\s*(?:,\s*)?([+-]?\d+)\s*(?:[,|\/]\s*([+-]?[\d\.]+)(%?)\s*)?\)$/;
        var per = /^rgba?\(\s*([+-]?[\d\.]+)\%\s*,?\s*([+-]?[\d\.]+)\%\s*,?\s*([+-]?[\d\.]+)\%\s*(?:[,|\/]\s*([+-]?[\d\.]+)(%?)\s*)?\)$/;
        var keyword = /^(\w+)$/;
        var rgb = [0, 0, 0, 1];
        var match;
        var i;
        var hexAlpha;
        if (match = string.match(hex)) {
          hexAlpha = match[2];
          match = match[1];
          for (i = 0; i < 3; i++) {
            var i2 = i * 2;
            rgb[i] = parseInt(match.slice(i2, i2 + 2), 16);
          }
          if (hexAlpha) {
            rgb[3] = parseInt(hexAlpha, 16) / 255;
          }
        } else if (match = string.match(abbr)) {
          match = match[1];
          hexAlpha = match[3];
          for (i = 0; i < 3; i++) {
            rgb[i] = parseInt(match[i] + match[i], 16);
          }
          if (hexAlpha) {
            rgb[3] = parseInt(hexAlpha + hexAlpha, 16) / 255;
          }
        } else if (match = string.match(rgba)) {
          for (i = 0; i < 3; i++) {
            rgb[i] = parseInt(match[i + 1], 0);
          }
          if (match[4]) {
            if (match[5]) {
              rgb[3] = parseFloat(match[4]) * 0.01;
            } else {
              rgb[3] = parseFloat(match[4]);
            }
          }
        } else if (match = string.match(per)) {
          for (i = 0; i < 3; i++) {
            rgb[i] = Math.round(parseFloat(match[i + 1]) * 2.55);
          }
          if (match[4]) {
            if (match[5]) {
              rgb[3] = parseFloat(match[4]) * 0.01;
            } else {
              rgb[3] = parseFloat(match[4]);
            }
          }
        } else if (match = string.match(keyword)) {
          if (match[1] === "transparent") {
            return [0, 0, 0, 0];
          }
          if (!hasOwnProperty.call(colorNames, match[1])) {
            return null;
          }
          rgb = colorNames[match[1]];
          rgb[3] = 1;
          return rgb;
        } else {
          return null;
        }
        for (i = 0; i < 3; i++) {
          rgb[i] = clamp(rgb[i], 0, 255);
        }
        rgb[3] = clamp(rgb[3], 0, 1);
        return rgb;
      };
      cs.get.hsl = function(string) {
        if (!string) {
          return null;
        }
        var hsl = /^hsla?\(\s*([+-]?(?:\d{0,3}\.)?\d+)(?:deg)?\s*,?\s*([+-]?[\d\.]+)%\s*,?\s*([+-]?[\d\.]+)%\s*(?:[,|\/]\s*([+-]?(?=\.\d|\d)(?:0|[1-9]\d*)?(?:\.\d*)?(?:[eE][+-]?\d+)?)\s*)?\)$/;
        var match = string.match(hsl);
        if (match) {
          var alpha = parseFloat(match[4]);
          var h = (parseFloat(match[1]) % 360 + 360) % 360;
          var s = clamp(parseFloat(match[2]), 0, 100);
          var l = clamp(parseFloat(match[3]), 0, 100);
          var a = clamp(isNaN(alpha) ? 1 : alpha, 0, 1);
          return [h, s, l, a];
        }
        return null;
      };
      cs.get.hwb = function(string) {
        if (!string) {
          return null;
        }
        var hwb = /^hwb\(\s*([+-]?\d{0,3}(?:\.\d+)?)(?:deg)?\s*,\s*([+-]?[\d\.]+)%\s*,\s*([+-]?[\d\.]+)%\s*(?:,\s*([+-]?(?=\.\d|\d)(?:0|[1-9]\d*)?(?:\.\d*)?(?:[eE][+-]?\d+)?)\s*)?\)$/;
        var match = string.match(hwb);
        if (match) {
          var alpha = parseFloat(match[4]);
          var h = (parseFloat(match[1]) % 360 + 360) % 360;
          var w = clamp(parseFloat(match[2]), 0, 100);
          var b = clamp(parseFloat(match[3]), 0, 100);
          var a = clamp(isNaN(alpha) ? 1 : alpha, 0, 1);
          return [h, w, b, a];
        }
        return null;
      };
      cs.to.hex = function() {
        var rgba = swizzle(arguments);
        return "#" + hexDouble(rgba[0]) + hexDouble(rgba[1]) + hexDouble(rgba[2]) + (rgba[3] < 1 ? hexDouble(Math.round(rgba[3] * 255)) : "");
      };
      cs.to.rgb = function() {
        var rgba = swizzle(arguments);
        return rgba.length < 4 || rgba[3] === 1 ? "rgb(" + Math.round(rgba[0]) + ", " + Math.round(rgba[1]) + ", " + Math.round(rgba[2]) + ")" : "rgba(" + Math.round(rgba[0]) + ", " + Math.round(rgba[1]) + ", " + Math.round(rgba[2]) + ", " + rgba[3] + ")";
      };
      cs.to.rgb.percent = function() {
        var rgba = swizzle(arguments);
        var r = Math.round(rgba[0] / 255 * 100);
        var g2 = Math.round(rgba[1] / 255 * 100);
        var b = Math.round(rgba[2] / 255 * 100);
        return rgba.length < 4 || rgba[3] === 1 ? "rgb(" + r + "%, " + g2 + "%, " + b + "%)" : "rgba(" + r + "%, " + g2 + "%, " + b + "%, " + rgba[3] + ")";
      };
      cs.to.hsl = function() {
        var hsla = swizzle(arguments);
        return hsla.length < 4 || hsla[3] === 1 ? "hsl(" + hsla[0] + ", " + hsla[1] + "%, " + hsla[2] + "%)" : "hsla(" + hsla[0] + ", " + hsla[1] + "%, " + hsla[2] + "%, " + hsla[3] + ")";
      };
      cs.to.hwb = function() {
        var hwba = swizzle(arguments);
        var a = "";
        if (hwba.length >= 4 && hwba[3] !== 1) {
          a = ", " + hwba[3];
        }
        return "hwb(" + hwba[0] + ", " + hwba[1] + "%, " + hwba[2] + "%" + a + ")";
      };
      cs.to.keyword = function(rgb) {
        return reverseNames[rgb.slice(0, 3)];
      };
      function clamp(num, min, max) {
        return Math.min(Math.max(min, num), max);
      }
      function hexDouble(num) {
        var str = Math.round(num).toString(16).toUpperCase();
        return str.length < 2 ? "0" + str : str;
      }
    }
  });

  // node_modules/color-convert/conversions.js
  var require_conversions = __commonJS({
    "node_modules/color-convert/conversions.js"(exports, module) {
      var cssKeywords = require_color_name();
      var reverseKeywords = {};
      for (const key of Object.keys(cssKeywords)) {
        reverseKeywords[cssKeywords[key]] = key;
      }
      var convert = {
        rgb: { channels: 3, labels: "rgb" },
        hsl: { channels: 3, labels: "hsl" },
        hsv: { channels: 3, labels: "hsv" },
        hwb: { channels: 3, labels: "hwb" },
        cmyk: { channels: 4, labels: "cmyk" },
        xyz: { channels: 3, labels: "xyz" },
        lab: { channels: 3, labels: "lab" },
        lch: { channels: 3, labels: "lch" },
        hex: { channels: 1, labels: ["hex"] },
        keyword: { channels: 1, labels: ["keyword"] },
        ansi16: { channels: 1, labels: ["ansi16"] },
        ansi256: { channels: 1, labels: ["ansi256"] },
        hcg: { channels: 3, labels: ["h", "c", "g"] },
        apple: { channels: 3, labels: ["r16", "g16", "b16"] },
        gray: { channels: 1, labels: ["gray"] }
      };
      module.exports = convert;
      for (const model of Object.keys(convert)) {
        if (!("channels" in convert[model])) {
          throw new Error("missing channels property: " + model);
        }
        if (!("labels" in convert[model])) {
          throw new Error("missing channel labels property: " + model);
        }
        if (convert[model].labels.length !== convert[model].channels) {
          throw new Error("channel and label counts mismatch: " + model);
        }
        const { channels, labels } = convert[model];
        delete convert[model].channels;
        delete convert[model].labels;
        Object.defineProperty(convert[model], "channels", { value: channels });
        Object.defineProperty(convert[model], "labels", { value: labels });
      }
      convert.rgb.hsl = function(rgb) {
        const r = rgb[0] / 255;
        const g2 = rgb[1] / 255;
        const b = rgb[2] / 255;
        const min = Math.min(r, g2, b);
        const max = Math.max(r, g2, b);
        const delta = max - min;
        let h;
        let s;
        if (max === min) {
          h = 0;
        } else if (r === max) {
          h = (g2 - b) / delta;
        } else if (g2 === max) {
          h = 2 + (b - r) / delta;
        } else if (b === max) {
          h = 4 + (r - g2) / delta;
        }
        h = Math.min(h * 60, 360);
        if (h < 0) {
          h += 360;
        }
        const l = (min + max) / 2;
        if (max === min) {
          s = 0;
        } else if (l <= 0.5) {
          s = delta / (max + min);
        } else {
          s = delta / (2 - max - min);
        }
        return [h, s * 100, l * 100];
      };
      convert.rgb.hsv = function(rgb) {
        let rdif;
        let gdif;
        let bdif;
        let h;
        let s;
        const r = rgb[0] / 255;
        const g2 = rgb[1] / 255;
        const b = rgb[2] / 255;
        const v = Math.max(r, g2, b);
        const diff = v - Math.min(r, g2, b);
        const diffc = function(c) {
          return (v - c) / 6 / diff + 1 / 2;
        };
        if (diff === 0) {
          h = 0;
          s = 0;
        } else {
          s = diff / v;
          rdif = diffc(r);
          gdif = diffc(g2);
          bdif = diffc(b);
          if (r === v) {
            h = bdif - gdif;
          } else if (g2 === v) {
            h = 1 / 3 + rdif - bdif;
          } else if (b === v) {
            h = 2 / 3 + gdif - rdif;
          }
          if (h < 0) {
            h += 1;
          } else if (h > 1) {
            h -= 1;
          }
        }
        return [
          h * 360,
          s * 100,
          v * 100
        ];
      };
      convert.rgb.hwb = function(rgb) {
        const r = rgb[0];
        const g2 = rgb[1];
        let b = rgb[2];
        const h = convert.rgb.hsl(rgb)[0];
        const w = 1 / 255 * Math.min(r, Math.min(g2, b));
        b = 1 - 1 / 255 * Math.max(r, Math.max(g2, b));
        return [h, w * 100, b * 100];
      };
      convert.rgb.cmyk = function(rgb) {
        const r = rgb[0] / 255;
        const g2 = rgb[1] / 255;
        const b = rgb[2] / 255;
        const k = Math.min(1 - r, 1 - g2, 1 - b);
        const c = (1 - r - k) / (1 - k) || 0;
        const m = (1 - g2 - k) / (1 - k) || 0;
        const y = (1 - b - k) / (1 - k) || 0;
        return [c * 100, m * 100, y * 100, k * 100];
      };
      function comparativeDistance(x, y) {
        return (x[0] - y[0]) ** 2 + (x[1] - y[1]) ** 2 + (x[2] - y[2]) ** 2;
      }
      convert.rgb.keyword = function(rgb) {
        const reversed = reverseKeywords[rgb];
        if (reversed) {
          return reversed;
        }
        let currentClosestDistance = Infinity;
        let currentClosestKeyword;
        for (const keyword of Object.keys(cssKeywords)) {
          const value = cssKeywords[keyword];
          const distance = comparativeDistance(rgb, value);
          if (distance < currentClosestDistance) {
            currentClosestDistance = distance;
            currentClosestKeyword = keyword;
          }
        }
        return currentClosestKeyword;
      };
      convert.keyword.rgb = function(keyword) {
        return cssKeywords[keyword];
      };
      convert.rgb.xyz = function(rgb) {
        let r = rgb[0] / 255;
        let g2 = rgb[1] / 255;
        let b = rgb[2] / 255;
        r = r > 0.04045 ? ((r + 0.055) / 1.055) ** 2.4 : r / 12.92;
        g2 = g2 > 0.04045 ? ((g2 + 0.055) / 1.055) ** 2.4 : g2 / 12.92;
        b = b > 0.04045 ? ((b + 0.055) / 1.055) ** 2.4 : b / 12.92;
        const x = r * 0.4124 + g2 * 0.3576 + b * 0.1805;
        const y = r * 0.2126 + g2 * 0.7152 + b * 0.0722;
        const z = r * 0.0193 + g2 * 0.1192 + b * 0.9505;
        return [x * 100, y * 100, z * 100];
      };
      convert.rgb.lab = function(rgb) {
        const xyz = convert.rgb.xyz(rgb);
        let x = xyz[0];
        let y = xyz[1];
        let z = xyz[2];
        x /= 95.047;
        y /= 100;
        z /= 108.883;
        x = x > 8856e-6 ? x ** (1 / 3) : 7.787 * x + 16 / 116;
        y = y > 8856e-6 ? y ** (1 / 3) : 7.787 * y + 16 / 116;
        z = z > 8856e-6 ? z ** (1 / 3) : 7.787 * z + 16 / 116;
        const l = 116 * y - 16;
        const a = 500 * (x - y);
        const b = 200 * (y - z);
        return [l, a, b];
      };
      convert.hsl.rgb = function(hsl) {
        const h = hsl[0] / 360;
        const s = hsl[1] / 100;
        const l = hsl[2] / 100;
        let t2;
        let t3;
        let val;
        if (s === 0) {
          val = l * 255;
          return [val, val, val];
        }
        if (l < 0.5) {
          t2 = l * (1 + s);
        } else {
          t2 = l + s - l * s;
        }
        const t1 = 2 * l - t2;
        const rgb = [0, 0, 0];
        for (let i = 0; i < 3; i++) {
          t3 = h + 1 / 3 * -(i - 1);
          if (t3 < 0) {
            t3++;
          }
          if (t3 > 1) {
            t3--;
          }
          if (6 * t3 < 1) {
            val = t1 + (t2 - t1) * 6 * t3;
          } else if (2 * t3 < 1) {
            val = t2;
          } else if (3 * t3 < 2) {
            val = t1 + (t2 - t1) * (2 / 3 - t3) * 6;
          } else {
            val = t1;
          }
          rgb[i] = val * 255;
        }
        return rgb;
      };
      convert.hsl.hsv = function(hsl) {
        const h = hsl[0];
        let s = hsl[1] / 100;
        let l = hsl[2] / 100;
        let smin = s;
        const lmin = Math.max(l, 0.01);
        l *= 2;
        s *= l <= 1 ? l : 2 - l;
        smin *= lmin <= 1 ? lmin : 2 - lmin;
        const v = (l + s) / 2;
        const sv = l === 0 ? 2 * smin / (lmin + smin) : 2 * s / (l + s);
        return [h, sv * 100, v * 100];
      };
      convert.hsv.rgb = function(hsv) {
        const h = hsv[0] / 60;
        const s = hsv[1] / 100;
        let v = hsv[2] / 100;
        const hi = Math.floor(h) % 6;
        const f = h - Math.floor(h);
        const p = 255 * v * (1 - s);
        const q = 255 * v * (1 - s * f);
        const t = 255 * v * (1 - s * (1 - f));
        v *= 255;
        switch (hi) {
          case 0:
            return [v, t, p];
          case 1:
            return [q, v, p];
          case 2:
            return [p, v, t];
          case 3:
            return [p, q, v];
          case 4:
            return [t, p, v];
          case 5:
            return [v, p, q];
        }
      };
      convert.hsv.hsl = function(hsv) {
        const h = hsv[0];
        const s = hsv[1] / 100;
        const v = hsv[2] / 100;
        const vmin = Math.max(v, 0.01);
        let sl;
        let l;
        l = (2 - s) * v;
        const lmin = (2 - s) * vmin;
        sl = s * vmin;
        sl /= lmin <= 1 ? lmin : 2 - lmin;
        sl = sl || 0;
        l /= 2;
        return [h, sl * 100, l * 100];
      };
      convert.hwb.rgb = function(hwb) {
        const h = hwb[0] / 360;
        let wh = hwb[1] / 100;
        let bl = hwb[2] / 100;
        const ratio = wh + bl;
        let f;
        if (ratio > 1) {
          wh /= ratio;
          bl /= ratio;
        }
        const i = Math.floor(6 * h);
        const v = 1 - bl;
        f = 6 * h - i;
        if ((i & 1) !== 0) {
          f = 1 - f;
        }
        const n = wh + f * (v - wh);
        let r;
        let g2;
        let b;
        switch (i) {
          default:
          case 6:
          case 0:
            r = v;
            g2 = n;
            b = wh;
            break;
          case 1:
            r = n;
            g2 = v;
            b = wh;
            break;
          case 2:
            r = wh;
            g2 = v;
            b = n;
            break;
          case 3:
            r = wh;
            g2 = n;
            b = v;
            break;
          case 4:
            r = n;
            g2 = wh;
            b = v;
            break;
          case 5:
            r = v;
            g2 = wh;
            b = n;
            break;
        }
        return [r * 255, g2 * 255, b * 255];
      };
      convert.cmyk.rgb = function(cmyk) {
        const c = cmyk[0] / 100;
        const m = cmyk[1] / 100;
        const y = cmyk[2] / 100;
        const k = cmyk[3] / 100;
        const r = 1 - Math.min(1, c * (1 - k) + k);
        const g2 = 1 - Math.min(1, m * (1 - k) + k);
        const b = 1 - Math.min(1, y * (1 - k) + k);
        return [r * 255, g2 * 255, b * 255];
      };
      convert.xyz.rgb = function(xyz) {
        const x = xyz[0] / 100;
        const y = xyz[1] / 100;
        const z = xyz[2] / 100;
        let r;
        let g2;
        let b;
        r = x * 3.2406 + y * -1.5372 + z * -0.4986;
        g2 = x * -0.9689 + y * 1.8758 + z * 0.0415;
        b = x * 0.0557 + y * -0.204 + z * 1.057;
        r = r > 31308e-7 ? 1.055 * r ** (1 / 2.4) - 0.055 : r * 12.92;
        g2 = g2 > 31308e-7 ? 1.055 * g2 ** (1 / 2.4) - 0.055 : g2 * 12.92;
        b = b > 31308e-7 ? 1.055 * b ** (1 / 2.4) - 0.055 : b * 12.92;
        r = Math.min(Math.max(0, r), 1);
        g2 = Math.min(Math.max(0, g2), 1);
        b = Math.min(Math.max(0, b), 1);
        return [r * 255, g2 * 255, b * 255];
      };
      convert.xyz.lab = function(xyz) {
        let x = xyz[0];
        let y = xyz[1];
        let z = xyz[2];
        x /= 95.047;
        y /= 100;
        z /= 108.883;
        x = x > 8856e-6 ? x ** (1 / 3) : 7.787 * x + 16 / 116;
        y = y > 8856e-6 ? y ** (1 / 3) : 7.787 * y + 16 / 116;
        z = z > 8856e-6 ? z ** (1 / 3) : 7.787 * z + 16 / 116;
        const l = 116 * y - 16;
        const a = 500 * (x - y);
        const b = 200 * (y - z);
        return [l, a, b];
      };
      convert.lab.xyz = function(lab) {
        const l = lab[0];
        const a = lab[1];
        const b = lab[2];
        let x;
        let y;
        let z;
        y = (l + 16) / 116;
        x = a / 500 + y;
        z = y - b / 200;
        const y2 = y ** 3;
        const x2 = x ** 3;
        const z2 = z ** 3;
        y = y2 > 8856e-6 ? y2 : (y - 16 / 116) / 7.787;
        x = x2 > 8856e-6 ? x2 : (x - 16 / 116) / 7.787;
        z = z2 > 8856e-6 ? z2 : (z - 16 / 116) / 7.787;
        x *= 95.047;
        y *= 100;
        z *= 108.883;
        return [x, y, z];
      };
      convert.lab.lch = function(lab) {
        const l = lab[0];
        const a = lab[1];
        const b = lab[2];
        let h;
        const hr = Math.atan2(b, a);
        h = hr * 360 / 2 / Math.PI;
        if (h < 0) {
          h += 360;
        }
        const c = Math.sqrt(a * a + b * b);
        return [l, c, h];
      };
      convert.lch.lab = function(lch) {
        const l = lch[0];
        const c = lch[1];
        const h = lch[2];
        const hr = h / 360 * 2 * Math.PI;
        const a = c * Math.cos(hr);
        const b = c * Math.sin(hr);
        return [l, a, b];
      };
      convert.rgb.ansi16 = function(args, saturation = null) {
        const [r, g2, b] = args;
        let value = saturation === null ? convert.rgb.hsv(args)[2] : saturation;
        value = Math.round(value / 50);
        if (value === 0) {
          return 30;
        }
        let ansi = 30 + (Math.round(b / 255) << 2 | Math.round(g2 / 255) << 1 | Math.round(r / 255));
        if (value === 2) {
          ansi += 60;
        }
        return ansi;
      };
      convert.hsv.ansi16 = function(args) {
        return convert.rgb.ansi16(convert.hsv.rgb(args), args[2]);
      };
      convert.rgb.ansi256 = function(args) {
        const r = args[0];
        const g2 = args[1];
        const b = args[2];
        if (r === g2 && g2 === b) {
          if (r < 8) {
            return 16;
          }
          if (r > 248) {
            return 231;
          }
          return Math.round((r - 8) / 247 * 24) + 232;
        }
        const ansi = 16 + 36 * Math.round(r / 255 * 5) + 6 * Math.round(g2 / 255 * 5) + Math.round(b / 255 * 5);
        return ansi;
      };
      convert.ansi16.rgb = function(args) {
        let color = args % 10;
        if (color === 0 || color === 7) {
          if (args > 50) {
            color += 3.5;
          }
          color = color / 10.5 * 255;
          return [color, color, color];
        }
        const mult = (~~(args > 50) + 1) * 0.5;
        const r = (color & 1) * mult * 255;
        const g2 = (color >> 1 & 1) * mult * 255;
        const b = (color >> 2 & 1) * mult * 255;
        return [r, g2, b];
      };
      convert.ansi256.rgb = function(args) {
        if (args >= 232) {
          const c = (args - 232) * 10 + 8;
          return [c, c, c];
        }
        args -= 16;
        let rem;
        const r = Math.floor(args / 36) / 5 * 255;
        const g2 = Math.floor((rem = args % 36) / 6) / 5 * 255;
        const b = rem % 6 / 5 * 255;
        return [r, g2, b];
      };
      convert.rgb.hex = function(args) {
        const integer = ((Math.round(args[0]) & 255) << 16) + ((Math.round(args[1]) & 255) << 8) + (Math.round(args[2]) & 255);
        const string = integer.toString(16).toUpperCase();
        return "000000".substring(string.length) + string;
      };
      convert.hex.rgb = function(args) {
        const match = args.toString(16).match(/[a-f0-9]{6}|[a-f0-9]{3}/i);
        if (!match) {
          return [0, 0, 0];
        }
        let colorString = match[0];
        if (match[0].length === 3) {
          colorString = colorString.split("").map((char) => {
            return char + char;
          }).join("");
        }
        const integer = parseInt(colorString, 16);
        const r = integer >> 16 & 255;
        const g2 = integer >> 8 & 255;
        const b = integer & 255;
        return [r, g2, b];
      };
      convert.rgb.hcg = function(rgb) {
        const r = rgb[0] / 255;
        const g2 = rgb[1] / 255;
        const b = rgb[2] / 255;
        const max = Math.max(Math.max(r, g2), b);
        const min = Math.min(Math.min(r, g2), b);
        const chroma = max - min;
        let grayscale;
        let hue;
        if (chroma < 1) {
          grayscale = min / (1 - chroma);
        } else {
          grayscale = 0;
        }
        if (chroma <= 0) {
          hue = 0;
        } else if (max === r) {
          hue = (g2 - b) / chroma % 6;
        } else if (max === g2) {
          hue = 2 + (b - r) / chroma;
        } else {
          hue = 4 + (r - g2) / chroma;
        }
        hue /= 6;
        hue %= 1;
        return [hue * 360, chroma * 100, grayscale * 100];
      };
      convert.hsl.hcg = function(hsl) {
        const s = hsl[1] / 100;
        const l = hsl[2] / 100;
        const c = l < 0.5 ? 2 * s * l : 2 * s * (1 - l);
        let f = 0;
        if (c < 1) {
          f = (l - 0.5 * c) / (1 - c);
        }
        return [hsl[0], c * 100, f * 100];
      };
      convert.hsv.hcg = function(hsv) {
        const s = hsv[1] / 100;
        const v = hsv[2] / 100;
        const c = s * v;
        let f = 0;
        if (c < 1) {
          f = (v - c) / (1 - c);
        }
        return [hsv[0], c * 100, f * 100];
      };
      convert.hcg.rgb = function(hcg) {
        const h = hcg[0] / 360;
        const c = hcg[1] / 100;
        const g2 = hcg[2] / 100;
        if (c === 0) {
          return [g2 * 255, g2 * 255, g2 * 255];
        }
        const pure = [0, 0, 0];
        const hi = h % 1 * 6;
        const v = hi % 1;
        const w = 1 - v;
        let mg = 0;
        switch (Math.floor(hi)) {
          case 0:
            pure[0] = 1;
            pure[1] = v;
            pure[2] = 0;
            break;
          case 1:
            pure[0] = w;
            pure[1] = 1;
            pure[2] = 0;
            break;
          case 2:
            pure[0] = 0;
            pure[1] = 1;
            pure[2] = v;
            break;
          case 3:
            pure[0] = 0;
            pure[1] = w;
            pure[2] = 1;
            break;
          case 4:
            pure[0] = v;
            pure[1] = 0;
            pure[2] = 1;
            break;
          default:
            pure[0] = 1;
            pure[1] = 0;
            pure[2] = w;
        }
        mg = (1 - c) * g2;
        return [
          (c * pure[0] + mg) * 255,
          (c * pure[1] + mg) * 255,
          (c * pure[2] + mg) * 255
        ];
      };
      convert.hcg.hsv = function(hcg) {
        const c = hcg[1] / 100;
        const g2 = hcg[2] / 100;
        const v = c + g2 * (1 - c);
        let f = 0;
        if (v > 0) {
          f = c / v;
        }
        return [hcg[0], f * 100, v * 100];
      };
      convert.hcg.hsl = function(hcg) {
        const c = hcg[1] / 100;
        const g2 = hcg[2] / 100;
        const l = g2 * (1 - c) + 0.5 * c;
        let s = 0;
        if (l > 0 && l < 0.5) {
          s = c / (2 * l);
        } else if (l >= 0.5 && l < 1) {
          s = c / (2 * (1 - l));
        }
        return [hcg[0], s * 100, l * 100];
      };
      convert.hcg.hwb = function(hcg) {
        const c = hcg[1] / 100;
        const g2 = hcg[2] / 100;
        const v = c + g2 * (1 - c);
        return [hcg[0], (v - c) * 100, (1 - v) * 100];
      };
      convert.hwb.hcg = function(hwb) {
        const w = hwb[1] / 100;
        const b = hwb[2] / 100;
        const v = 1 - b;
        const c = v - w;
        let g2 = 0;
        if (c < 1) {
          g2 = (v - c) / (1 - c);
        }
        return [hwb[0], c * 100, g2 * 100];
      };
      convert.apple.rgb = function(apple) {
        return [apple[0] / 65535 * 255, apple[1] / 65535 * 255, apple[2] / 65535 * 255];
      };
      convert.rgb.apple = function(rgb) {
        return [rgb[0] / 255 * 65535, rgb[1] / 255 * 65535, rgb[2] / 255 * 65535];
      };
      convert.gray.rgb = function(args) {
        return [args[0] / 100 * 255, args[0] / 100 * 255, args[0] / 100 * 255];
      };
      convert.gray.hsl = function(args) {
        return [0, 0, args[0]];
      };
      convert.gray.hsv = convert.gray.hsl;
      convert.gray.hwb = function(gray) {
        return [0, 100, gray[0]];
      };
      convert.gray.cmyk = function(gray) {
        return [0, 0, 0, gray[0]];
      };
      convert.gray.lab = function(gray) {
        return [gray[0], 0, 0];
      };
      convert.gray.hex = function(gray) {
        const val = Math.round(gray[0] / 100 * 255) & 255;
        const integer = (val << 16) + (val << 8) + val;
        const string = integer.toString(16).toUpperCase();
        return "000000".substring(string.length) + string;
      };
      convert.rgb.gray = function(rgb) {
        const val = (rgb[0] + rgb[1] + rgb[2]) / 3;
        return [val / 255 * 100];
      };
    }
  });

  // node_modules/color-convert/route.js
  var require_route = __commonJS({
    "node_modules/color-convert/route.js"(exports, module) {
      var conversions = require_conversions();
      function buildGraph() {
        const graph = {};
        const models = Object.keys(conversions);
        for (let len = models.length, i = 0; i < len; i++) {
          graph[models[i]] = {
            distance: -1,
            parent: null
          };
        }
        return graph;
      }
      function deriveBFS(fromModel) {
        const graph = buildGraph();
        const queue = [fromModel];
        graph[fromModel].distance = 0;
        while (queue.length) {
          const current = queue.pop();
          const adjacents = Object.keys(conversions[current]);
          for (let len = adjacents.length, i = 0; i < len; i++) {
            const adjacent = adjacents[i];
            const node = graph[adjacent];
            if (node.distance === -1) {
              node.distance = graph[current].distance + 1;
              node.parent = current;
              queue.unshift(adjacent);
            }
          }
        }
        return graph;
      }
      function link(from, to) {
        return function(args) {
          return to(from(args));
        };
      }
      function wrapConversion(toModel, graph) {
        const path = [graph[toModel].parent, toModel];
        let fn = conversions[graph[toModel].parent][toModel];
        let cur = graph[toModel].parent;
        while (graph[cur].parent) {
          path.unshift(graph[cur].parent);
          fn = link(conversions[graph[cur].parent][cur], fn);
          cur = graph[cur].parent;
        }
        fn.conversion = path;
        return fn;
      }
      module.exports = function(fromModel) {
        const graph = deriveBFS(fromModel);
        const conversion = {};
        const models = Object.keys(graph);
        for (let len = models.length, i = 0; i < len; i++) {
          const toModel = models[i];
          const node = graph[toModel];
          if (node.parent === null) {
            continue;
          }
          conversion[toModel] = wrapConversion(toModel, graph);
        }
        return conversion;
      };
    }
  });

  // node_modules/color-convert/index.js
  var require_color_convert = __commonJS({
    "node_modules/color-convert/index.js"(exports, module) {
      var conversions = require_conversions();
      var route = require_route();
      var convert = {};
      var models = Object.keys(conversions);
      function wrapRaw(fn) {
        const wrappedFn = function(...args) {
          const arg0 = args[0];
          if (arg0 === void 0 || arg0 === null) {
            return arg0;
          }
          if (arg0.length > 1) {
            args = arg0;
          }
          return fn(args);
        };
        if ("conversion" in fn) {
          wrappedFn.conversion = fn.conversion;
        }
        return wrappedFn;
      }
      function wrapRounded(fn) {
        const wrappedFn = function(...args) {
          const arg0 = args[0];
          if (arg0 === void 0 || arg0 === null) {
            return arg0;
          }
          if (arg0.length > 1) {
            args = arg0;
          }
          const result = fn(args);
          if (typeof result === "object") {
            for (let len = result.length, i = 0; i < len; i++) {
              result[i] = Math.round(result[i]);
            }
          }
          return result;
        };
        if ("conversion" in fn) {
          wrappedFn.conversion = fn.conversion;
        }
        return wrappedFn;
      }
      models.forEach((fromModel) => {
        convert[fromModel] = {};
        Object.defineProperty(convert[fromModel], "channels", { value: conversions[fromModel].channels });
        Object.defineProperty(convert[fromModel], "labels", { value: conversions[fromModel].labels });
        const routes = route(fromModel);
        const routeModels = Object.keys(routes);
        routeModels.forEach((toModel) => {
          const fn = routes[toModel];
          convert[fromModel][toModel] = wrapRounded(fn);
          convert[fromModel][toModel].raw = wrapRaw(fn);
        });
      });
      module.exports = convert;
    }
  });

  // node_modules/color/index.js
  var require_color = __commonJS({
    "node_modules/color/index.js"(exports, module) {
      var colorString = require_color_string();
      var convert = require_color_convert();
      var skippedModels = [
        "keyword",
        "gray",
        "hex"
      ];
      var hashedModelKeys = {};
      for (const model of Object.keys(convert)) {
        hashedModelKeys[[...convert[model].labels].sort().join("")] = model;
      }
      var limiters = {};
      function Color(object, model) {
        if (!(this instanceof Color)) {
          return new Color(object, model);
        }
        if (model && model in skippedModels) {
          model = null;
        }
        if (model && !(model in convert)) {
          throw new Error("Unknown model: " + model);
        }
        let i;
        let channels;
        if (object == null) {
          this.model = "rgb";
          this.color = [0, 0, 0];
          this.valpha = 1;
        } else if (object instanceof Color) {
          this.model = object.model;
          this.color = [...object.color];
          this.valpha = object.valpha;
        } else if (typeof object === "string") {
          const result = colorString.get(object);
          if (result === null) {
            throw new Error("Unable to parse color from string: " + object);
          }
          this.model = result.model;
          channels = convert[this.model].channels;
          this.color = result.value.slice(0, channels);
          this.valpha = typeof result.value[channels] === "number" ? result.value[channels] : 1;
        } else if (object.length > 0) {
          this.model = model || "rgb";
          channels = convert[this.model].channels;
          const newArray = Array.prototype.slice.call(object, 0, channels);
          this.color = zeroArray(newArray, channels);
          this.valpha = typeof object[channels] === "number" ? object[channels] : 1;
        } else if (typeof object === "number") {
          this.model = "rgb";
          this.color = [
            object >> 16 & 255,
            object >> 8 & 255,
            object & 255
          ];
          this.valpha = 1;
        } else {
          this.valpha = 1;
          const keys = Object.keys(object);
          if ("alpha" in object) {
            keys.splice(keys.indexOf("alpha"), 1);
            this.valpha = typeof object.alpha === "number" ? object.alpha : 0;
          }
          const hashedKeys = keys.sort().join("");
          if (!(hashedKeys in hashedModelKeys)) {
            throw new Error("Unable to parse color from object: " + JSON.stringify(object));
          }
          this.model = hashedModelKeys[hashedKeys];
          const { labels } = convert[this.model];
          const color = [];
          for (i = 0; i < labels.length; i++) {
            color.push(object[labels[i]]);
          }
          this.color = zeroArray(color);
        }
        if (limiters[this.model]) {
          channels = convert[this.model].channels;
          for (i = 0; i < channels; i++) {
            const limit = limiters[this.model][i];
            if (limit) {
              this.color[i] = limit(this.color[i]);
            }
          }
        }
        this.valpha = Math.max(0, Math.min(1, this.valpha));
        if (Object.freeze) {
          Object.freeze(this);
        }
      }
      Color.prototype = {
        toString() {
          return this.string();
        },
        toJSON() {
          return this[this.model]();
        },
        string(places) {
          let self2 = this.model in colorString.to ? this : this.rgb();
          self2 = self2.round(typeof places === "number" ? places : 1);
          const args = self2.valpha === 1 ? self2.color : [...self2.color, this.valpha];
          return colorString.to[self2.model](args);
        },
        percentString(places) {
          const self2 = this.rgb().round(typeof places === "number" ? places : 1);
          const args = self2.valpha === 1 ? self2.color : [...self2.color, this.valpha];
          return colorString.to.rgb.percent(args);
        },
        array() {
          return this.valpha === 1 ? [...this.color] : [...this.color, this.valpha];
        },
        object() {
          const result = {};
          const { channels } = convert[this.model];
          const { labels } = convert[this.model];
          for (let i = 0; i < channels; i++) {
            result[labels[i]] = this.color[i];
          }
          if (this.valpha !== 1) {
            result.alpha = this.valpha;
          }
          return result;
        },
        unitArray() {
          const rgb = this.rgb().color;
          rgb[0] /= 255;
          rgb[1] /= 255;
          rgb[2] /= 255;
          if (this.valpha !== 1) {
            rgb.push(this.valpha);
          }
          return rgb;
        },
        unitObject() {
          const rgb = this.rgb().object();
          rgb.r /= 255;
          rgb.g /= 255;
          rgb.b /= 255;
          if (this.valpha !== 1) {
            rgb.alpha = this.valpha;
          }
          return rgb;
        },
        round(places) {
          places = Math.max(places || 0, 0);
          return new Color([...this.color.map(roundToPlace(places)), this.valpha], this.model);
        },
        alpha(value) {
          if (value !== void 0) {
            return new Color([...this.color, Math.max(0, Math.min(1, value))], this.model);
          }
          return this.valpha;
        },
        red: getset("rgb", 0, maxfn(255)),
        green: getset("rgb", 1, maxfn(255)),
        blue: getset("rgb", 2, maxfn(255)),
        hue: getset(["hsl", "hsv", "hsl", "hwb", "hcg"], 0, (value) => (value % 360 + 360) % 360),
        saturationl: getset("hsl", 1, maxfn(100)),
        lightness: getset("hsl", 2, maxfn(100)),
        saturationv: getset("hsv", 1, maxfn(100)),
        value: getset("hsv", 2, maxfn(100)),
        chroma: getset("hcg", 1, maxfn(100)),
        gray: getset("hcg", 2, maxfn(100)),
        white: getset("hwb", 1, maxfn(100)),
        wblack: getset("hwb", 2, maxfn(100)),
        cyan: getset("cmyk", 0, maxfn(100)),
        magenta: getset("cmyk", 1, maxfn(100)),
        yellow: getset("cmyk", 2, maxfn(100)),
        black: getset("cmyk", 3, maxfn(100)),
        x: getset("xyz", 0, maxfn(95.047)),
        y: getset("xyz", 1, maxfn(100)),
        z: getset("xyz", 2, maxfn(108.833)),
        l: getset("lab", 0, maxfn(100)),
        a: getset("lab", 1),
        b: getset("lab", 2),
        keyword(value) {
          if (value !== void 0) {
            return new Color(value);
          }
          return convert[this.model].keyword(this.color);
        },
        hex(value) {
          if (value !== void 0) {
            return new Color(value);
          }
          return colorString.to.hex(this.rgb().round().color);
        },
        hexa(value) {
          if (value !== void 0) {
            return new Color(value);
          }
          const rgbArray = this.rgb().round().color;
          let alphaHex = Math.round(this.valpha * 255).toString(16).toUpperCase();
          if (alphaHex.length === 1) {
            alphaHex = "0" + alphaHex;
          }
          return colorString.to.hex(rgbArray) + alphaHex;
        },
        rgbNumber() {
          const rgb = this.rgb().color;
          return (rgb[0] & 255) << 16 | (rgb[1] & 255) << 8 | rgb[2] & 255;
        },
        luminosity() {
          const rgb = this.rgb().color;
          const lum = [];
          for (const [i, element] of rgb.entries()) {
            const chan = element / 255;
            lum[i] = chan <= 0.04045 ? chan / 12.92 : ((chan + 0.055) / 1.055) ** 2.4;
          }
          return 0.2126 * lum[0] + 0.7152 * lum[1] + 0.0722 * lum[2];
        },
        contrast(color2) {
          const lum1 = this.luminosity();
          const lum2 = color2.luminosity();
          if (lum1 > lum2) {
            return (lum1 + 0.05) / (lum2 + 0.05);
          }
          return (lum2 + 0.05) / (lum1 + 0.05);
        },
        level(color2) {
          const contrastRatio = this.contrast(color2);
          if (contrastRatio >= 7) {
            return "AAA";
          }
          return contrastRatio >= 4.5 ? "AA" : "";
        },
        isDark() {
          const rgb = this.rgb().color;
          const yiq = (rgb[0] * 2126 + rgb[1] * 7152 + rgb[2] * 722) / 1e4;
          return yiq < 128;
        },
        isLight() {
          return !this.isDark();
        },
        negate() {
          const rgb = this.rgb();
          for (let i = 0; i < 3; i++) {
            rgb.color[i] = 255 - rgb.color[i];
          }
          return rgb;
        },
        lighten(ratio) {
          const hsl = this.hsl();
          hsl.color[2] += hsl.color[2] * ratio;
          return hsl;
        },
        darken(ratio) {
          const hsl = this.hsl();
          hsl.color[2] -= hsl.color[2] * ratio;
          return hsl;
        },
        saturate(ratio) {
          const hsl = this.hsl();
          hsl.color[1] += hsl.color[1] * ratio;
          return hsl;
        },
        desaturate(ratio) {
          const hsl = this.hsl();
          hsl.color[1] -= hsl.color[1] * ratio;
          return hsl;
        },
        whiten(ratio) {
          const hwb = this.hwb();
          hwb.color[1] += hwb.color[1] * ratio;
          return hwb;
        },
        blacken(ratio) {
          const hwb = this.hwb();
          hwb.color[2] += hwb.color[2] * ratio;
          return hwb;
        },
        grayscale() {
          const rgb = this.rgb().color;
          const value = rgb[0] * 0.3 + rgb[1] * 0.59 + rgb[2] * 0.11;
          return Color.rgb(value, value, value);
        },
        fade(ratio) {
          return this.alpha(this.valpha - this.valpha * ratio);
        },
        opaquer(ratio) {
          return this.alpha(this.valpha + this.valpha * ratio);
        },
        rotate(degrees) {
          const hsl = this.hsl();
          let hue = hsl.color[0];
          hue = (hue + degrees) % 360;
          hue = hue < 0 ? 360 + hue : hue;
          hsl.color[0] = hue;
          return hsl;
        },
        mix(mixinColor, weight) {
          if (!mixinColor || !mixinColor.rgb) {
            throw new Error('Argument to "mix" was not a Color instance, but rather an instance of ' + typeof mixinColor);
          }
          const color1 = mixinColor.rgb();
          const color2 = this.rgb();
          const p = weight === void 0 ? 0.5 : weight;
          const w = 2 * p - 1;
          const a = color1.alpha() - color2.alpha();
          const w1 = ((w * a === -1 ? w : (w + a) / (1 + w * a)) + 1) / 2;
          const w2 = 1 - w1;
          return Color.rgb(
            w1 * color1.red() + w2 * color2.red(),
            w1 * color1.green() + w2 * color2.green(),
            w1 * color1.blue() + w2 * color2.blue(),
            color1.alpha() * p + color2.alpha() * (1 - p)
          );
        }
      };
      for (const model of Object.keys(convert)) {
        if (skippedModels.includes(model)) {
          continue;
        }
        const { channels } = convert[model];
        Color.prototype[model] = function(...args) {
          if (this.model === model) {
            return new Color(this);
          }
          if (args.length > 0) {
            return new Color(args, model);
          }
          return new Color([...assertArray(convert[this.model][model].raw(this.color)), this.valpha], model);
        };
        Color[model] = function(...args) {
          let color = args[0];
          if (typeof color === "number") {
            color = zeroArray(args, channels);
          }
          return new Color(color, model);
        };
      }
      function roundTo(number, places) {
        return Number(number.toFixed(places));
      }
      function roundToPlace(places) {
        return function(number) {
          return roundTo(number, places);
        };
      }
      function getset(model, channel, modifier) {
        model = Array.isArray(model) ? model : [model];
        for (const m of model) {
          (limiters[m] || (limiters[m] = []))[channel] = modifier;
        }
        model = model[0];
        return function(value) {
          let result;
          if (value !== void 0) {
            if (modifier) {
              value = modifier(value);
            }
            result = this[model]();
            result.color[channel] = value;
            return result;
          }
          result = this[model]().color[channel];
          if (modifier) {
            result = modifier(result);
          }
          return result;
        };
      }
      function maxfn(max) {
        return function(v) {
          return Math.max(0, Math.min(max, v));
        };
      }
      function assertArray(value) {
        return Array.isArray(value) ? value : [value];
      }
      function zeroArray(array, length) {
        for (let i = 0; i < length; i++) {
          if (typeof array[i] !== "number") {
            array[i] = 0;
          }
        }
        return array;
      }
      module.exports = Color;
    }
  });

  // src/js/ConsCircles.js
  var require_ConsCircles = __commonJS({
    "src/js/ConsCircles.js"(exports, module) {
      var Bliss2 = require_bliss();
      var _ = require_lodash();
      var Color = require_color();
      window.inter_functions = {
        linear: (t, b, c, d) => {
          return (c - b) * t / d + b;
        },
        easeInQuad: (t, b, c, d) => {
          t /= d;
          return (c - b) * t * t + b;
        },
        easeOutQuad: (t, b, c, d) => {
          t /= d;
          return -(c - b) * t * (t - 2) + b;
        },
        easeInOutQuad: (t, b, c, d) => {
          t /= d / 2;
          if (t < 1)
            return (c - b) / 2 * t * t + b;
          t--;
          return -(c - b) / 2 * (t * (t - 2) - 1) + b;
        }
      };
      var DEFAULT_EASING = "easeInOutQuad";
      window.interpolate = ({ a, b, time, duration, easing = DEFAULT_EASING }) => {
        const getVal = inter_functions[easing];
        if (Array.isArray(a)) {
          return a.map((value, i) => {
            return getVal(time, a[i], b[i], duration);
          });
        } else if (isFinite(a)) {
          return getVal(time, a, b, duration);
        } else {
          return a;
        }
      };
      var EMBED_STYLES = `
    .cons-circles figcaption { white-space:nowrap; overflow:hidden; text-overflow: ellipsis; transition: color .3s; height: 1.2em; }
    .cc-controls {display:flex; justify-content:space-between; align-items:center; }
    ul.cc-controls-group { display:flex; justify-content:center; padding: 0 2rem; flex-wrap:wrap; }
    button.cc-control { appearance:none; -webkit-appearance:none; border:none; border-radius:999px; margin:.2em; font-size: .7em; padding: .08em .6em; padding-left:1em; font-family:inherit; position:relative; white-space:nowrap;}
    button.cc-control:before { content:"\\2022"; display:inline-block; font-size:1em; line-height: 0; vertical-align:unset; position:absolute; left: .5ch; top: 1ch; }
    select.cc-nstyle-select { appearance:none; -webkit-appearance:none; }
    button.cc-global-switch, select.cc-nstyle-select { height: 2.4ch; font-family: inherit; border:none; border-radius:999px; margin:.2em; padding: .08em .6em; color:white; font-size: .4em; background:lightslategray; cursor:pointer;}
    button.cc-global-switch.active { border:.5px solid lightslategray; color: slategray; background: white;}
    button.cc-global-switch:hover, button.cc-global-switch:active {filter:brightness(0.7);}
    .cc-controls.no-groups button.cc-global-switch, .cc-controls.no-groups ul.cc-controls-group { visibility:hidden; }
`;
      var FIXTURE = {
        "Farmers": [2, 4, 45, 56, 23, 22, 2],
        "Doctors": [3, 56, 45, 4, 1, 1, 0],
        "Lawyers": [45, 34, 23, 4, 6, 1, 0]
      };
      var DEFAULTS = {
        bgColor: "white",
        byArea: true,
        canvasRes: 1e3,
        caption: "The default data",
        colors: ["seagreen", "orangered", "lightskyblue", "gold", "deeppink", "limegreen", "royalblue", "darkorange", "darkviolet"],
        dataIn: FIXTURE,
        debug: false,
        extFont: null,
        fontFamily: `system-ui, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"`,
        fontRatio: 30,
        labels: ["Low", "Neutral", "High"],
        labelSize: 40,
        mixOnShift: true,
        noControls: false,
        noTrack: true,
        nStyle: "highLow",
        percentOf: "row",
        showCaption: false,
        target: ".cons-circles",
        trackColor: "lightgray"
      };
      var CANVAS_RATIO = 5 / 1;
      var NSTYLE_OPTIONS = ["highLow", "percentHighLow", "all", "allPercent", "none"];
      function median(numbers) {
        const sorted = Array.from(numbers).sort((a, b) => a - b);
        const middle = Math.floor(sorted.length / 2);
        if (sorted.length % 2 === 0) {
          return (sorted[middle - 1] + sorted[middle]) / 2;
        }
        return sorted[middle];
      }
      var SceneItem = class {
        constructor(props = null) {
          if (_.isNull(props))
            throw "SceneItem requires properties, at least type and name";
          _.assign(this, {
            duration: 0,
            time: 0,
            type: "",
            content: ""
          }, props);
          this.start = {};
          this.end = {};
          if (!this.name)
            throw "SceneItem needs a name";
          this.id = _.uniqueId();
        }
        get isAnimating() {
          return this.time < this.duration;
        }
        setProp(prop, payload, duration = null) {
          const self2 = this;
          if (!_.isString(prop) && !_.isObject(prop))
            throw "setProp needs a prop!";
          if (_.isObject(prop)) {
            _.toPairs(prop).forEach((pair) => {
              self2.setProp(pair[0], pair[1]);
            });
            return;
          }
          self2.start[prop] = _.isUndefined(self2.end[prop]) ? payload : self2.end[prop];
          self2.end[prop] = payload;
          if (!_.isNull(duration) && isFinite(duration))
            _.assign(self2, {
              duration,
              time: 0
            });
        }
      };
      var ConsCircles = class {
        constructor(options = {}) {
          const CCStyles = $("#ConsCircleStyles");
          if (!CCStyles) {
            const actualStyles = $.create("style", {
              id: "ConsCircleStyles"
            });
            document.body.prepend(actualStyles);
            actualStyles.prepend(EMBED_STYLES);
          }
          this.options = _.assign({}, DEFAULTS, options);
          const {
            colors,
            dataIn,
            extFont,
            target,
            caption,
            showCaption,
            labels
          } = this.options;
          const check = ConsCircles.checkData(dataIn);
          if (check !== true)
            throw check;
          this.id = _.uniqueId();
          this.targetEl = document.querySelector(target);
          if (!(this.targetEl instanceof HTMLElement))
            throw "ConsCircles requires valid target element";
          if (!_.isNull(extFont)) {
            const linkEl = document.createElement("link");
            linkEl.setAttribute("rel", "stylesheet");
            linkEl.setAttribute("href", extFont);
            document.head.appendChild(linkEl);
          }
          this.data = dataIn;
          this.All = ConsCircles.rowSums(_.values(dataIn));
          this.n = _.sum(this.All);
          this.columns = this.All.length;
          this.groupLabels = ["All", ..._.keys(this.data)];
          this.groupColors = _.fromPairs(this.groupLabels.map((group, i) => {
            const colorIndex = i < colors.length ? i : i % colors.length;
            return [group, colors[colorIndex]];
          }));
          this.currentColor = colors[0];
          this.container = $.create("figure", {
            className: "cc-container",
            id: `cc-container-${this.id}`,
            style: {
              color: this.currentColor,
              display: "block",
              "font-family": this.options.fontFamily,
              margin: "0",
              width: "100%"
            },
            contents: [
              !!caption && showCaption ? {
                tag: "figcaption",
                id: `cc-caption-${this.id}`,
                contents: [caption, { tag: "span", className: "caption-add" }]
              } : null,
              {
                tag: "canvas",
                id: `cc-canvas-${this.id}`,
                style: {
                  width: "100%",
                  "aspect-ratio": `${CANVAS_RATIO}`
                },
                width: this.canvWidth,
                height: this.canvHeight
              },
              !this.options.noControls ? {
                tag: "div",
                id: `cc-controls-${this.id}`,
                className: `cc-controls ${this.hasGroups ? "has-groups" : "no-groups"}`,
                style: {
                  width: "100%"
                },
                contents: [{
                  tag: "button",
                  className: "cc-global-switch",
                  innerHTML: `n-Local`,
                  events: {
                    click: (evt) => {
                      this.handleGlobalSwitch.call(this, evt);
                    }
                  }
                }, {
                  tag: "ul",
                  className: "cc-controls-group",
                  contents: this.groupLabels.map((group) => {
                    return {
                      tag: "li",
                      contents: {
                        tag: "button",
                        className: "cc-control",
                        contents: group,
                        "data-group-name": group,
                        events: {
                          click: (evt) => {
                            this.handleAll.call(this, evt);
                          }
                        }
                      }
                    };
                  })
                }, {
                  tag: "select",
                  className: "cc-nstyle-select",
                  contents: NSTYLE_OPTIONS.map((nstyle) => {
                    const opt = {
                      tag: "option",
                      contents: _.startCase(nstyle).replace("Percent", "%"),
                      value: nstyle
                    };
                    if (nstyle == this.options.nStyle)
                      opt.selected = true;
                    return opt;
                  }),
                  events: {
                    change: (evt) => {
                      this.handleNStyleSelect.call(this, evt);
                    }
                  }
                }]
              } : null
            ],
            "aria-description": ConsCircles.genDescText(this)
          });
          this.targetEl.appendChild(this.container);
          this.setFontSize();
          window.addEventListener("resize", () => {
            this.setFontSize.call(this);
          });
          this.inView = ["All"];
          this.scene = [];
          const {
            discY,
            discXPositions,
            axisY,
            axisXPositions,
            colorTextOnBground,
            discLabels
          } = this;
          labels.forEach((content, i) => {
            const item = new SceneItem({
              type: "axis_label",
              content,
              name: `label_${_.snakeCase(content)}`,
              number: i
            });
            item.setProp({
              y: axisY,
              x: axisXPositions[i],
              fill: colorTextOnBground
            });
            this.scene.push(item);
          });
          this.visiblePercent.forEach((d, i) => {
            let x = discXPositions[i];
            let fill = ConsCircles.getRGB(this.options.bgColor);
            let disc = new SceneItem({
              type: "disc",
              name: `disc_${i + 1}`,
              number: i
            });
            disc.setProp({
              y: discY,
              x,
              fill,
              radius: 0
            });
            this.scene.push(disc);
          });
          this.visibleReal.forEach((real, i) => {
            let x = discXPositions[i];
            let fill = ConsCircles.getRGB(this.options.bgColor);
            let label = new SceneItem({
              type: "disc_label",
              name: `disc_label_${i + 1}`,
              content: discLabels[i],
              number: i
            });
            label.setProp({
              y: discY,
              x,
              fill
            });
            this.scene.push(label);
          });
        }
        init() {
          this.canvas = $("canvas", this.container);
          this.ctx = this.canvas.getContext("2d");
          this.update();
          this.loopStart();
        }
        get sceneIsStatic() {
          return this.scene.every((item) => item.time >= item.duration);
        }
        get colorTextOnColor() {
          return ConsCircles.getTextColor(this.currentColor, this.currentColor);
        }
        get colorTextOnBground() {
          return ConsCircles.getTextColor(this.bgColor, this.currentColor);
        }
        get discLabels() {
          const n = this.options.percentOf == "row" ? _.sum(this.visibleReal) : this.n;
          switch (this.options.nStyle) {
            case "none":
              return this.visibleReal.map((v) => "");
            case "highLow":
              return this.visibleReal.map((v, i) => {
                if (v == _.max(this.visibleReal)) {
                  return `${v}|(n=${n})`;
                }
                if (v == _.min(this.visibleReal)) {
                  return `(${v})`;
                }
                return "";
              });
            case "percentHighLow":
              return this.visiblePercent.map((v, i) => {
                if (v == _.max(this.visiblePercent)) {
                  return `${_.round(v * 100, 1)}%|(n=${n})`;
                }
                if (v == _.min(this.visiblePercent)) {
                  return `(${_.round(v * 100, 1)}%)`;
                }
                return "";
              });
            case "allPercent":
              return this.visiblePercent.map((v, i) => {
                if (v == _.max(this.visiblePercent)) {
                  return `${_.round(v * 100, 1)}%|(n=${n})`;
                } else {
                  return `${_.round(v * 100, 1)}%`;
                }
              });
            default:
              return this.visibleReal.map((v, i) => {
                return `${this.visibleReal[i]}`;
              });
          }
        }
        get canvWidth() {
          return this.options.canvasRes * devicePixelRatio;
        }
        get canvHeight() {
          return this.canvWidth / CANVAS_RATIO;
        }
        get axisY() {
          return this.canvHeight * 0.2;
        }
        get axisXPositions() {
          switch (this.options.labels.length) {
            case 1:
              return [this.canvWidth / 2];
            case 2:
              return [this.discXPositions[0], _.last(this.discXPositions)];
            case 3:
              return [this.discXPositions[0], this.canvWidth / 2, _.last(this.discXPositions)];
            default:
              if (this.options.labels.length < this.columns) {
                console.warn("ConsCircles passed less labels on X-axis than columns - please check.");
              }
              return this.discXPositions;
          }
        }
        get discY() {
          return this.canvHeight * 0.6;
        }
        get lowLabelY() {
          return this.canvHeight * 0.85;
        }
        get maxDiscRadius() {
          return this.canvHeight * 0.3;
        }
        get maxDiscArea() {
          return Math.PI * this.maxDiscRadius * this.maxDiscRadius;
        }
        get discXPositions() {
          const {
            canvWidth,
            maxDiscRadius,
            columns
          } = this;
          const gap = (canvWidth - maxDiscRadius * 2 * columns) / (columns - 1);
          return this.All.map((v, i) => {
            return i * (maxDiscRadius + gap) + maxDiscRadius * (i + 1);
          });
        }
        get hasGroups() {
          return this.rows.length > 1;
        }
        get rows() {
          return _.values(this.data);
        }
        get visibleReal() {
          const rows = this.inView.map((row) => {
            if (row == "All")
              return this.All;
            else
              return this.data[row];
          });
          return ConsCircles.rowSums(rows);
        }
        get visiblePercent() {
          const {
            visibleReal,
            n
          } = this;
          const {
            percentOf
          } = this.options;
          return visibleReal.map((v) => {
            return v / (percentOf == "row" ? _.sum(visibleReal) : n);
          });
        }
        get reweightedPercent() {
          const b = _.sum(this.visiblePercent);
          return this.visiblePercent.map((v) => v / b);
        }
        get discRadii() {
          if (this.options.byArea)
            return this.discRadiiByArea;
          const weightedRadius = this.options.percentOf == "row" ? this.maxDiscRadius / _.max(this.reweightedPercent) : this.maxDiscRadius;
          return this.options.percentOf == "row" ? this.reweightedPercent.map((pc) => pc * weightedRadius) : this.visiblePercent.map((pc) => pc * weightedRadius);
        }
        get discRadiiByArea() {
          const getRadius = (pc) => {
            return Math.sqrt(pc * this.maxDiscArea / Math.PI);
          };
          return this.options.percentOf == "row" ? this.reweightedPercent.map(getRadius) : this.visiblePercent.map(getRadius);
        }
        get standardRate() {
          return 15 + _.random(0, 10);
        }
        get realMean() {
          return _.mean(this.visibleReal);
        }
        get globalMedian() {
          return median(_.flatten(this.rows));
        }
        handleAll(evt) {
          evt.stopPropagation();
          const group = evt.target?.dataset?.groupName;
          if (!group)
            return;
          if (!this.options.mixOnShift || this.options.mixOnShift && evt.shiftKey) {
            if (this.inView.includes(group)) {
              this.inView.splice(this.inView.indexOf(group), 1);
            } else {
              this.inView.push(group);
            }
            if (this.inView.length == 0) {
              this.inView = [group];
              return;
            }
            if (this.inView.includes("All") && group !== "All") {
              this.inView.splice(this.inView.indexOf("All"), 1);
            }
            if (this.inView.includes("All") && group == "All") {
              this.inView = ["All"];
            } else if (this.inView.length == this.groupLabels.length - 1) {
              this.inView = ["All"];
            }
          } else {
            this.inView = [group];
          }
          this.update();
          this.loopStart();
        }
        handleGlobalSwitch(evt) {
          evt.stopPropagation();
          if (this.options.percentOf == "row") {
            this.options.percentOf = "n";
            evt.target.classList.add("active");
            evt.target.innerHTML = "n-Global";
          } else {
            this.options.percentOf = "row";
            evt.target.classList.remove("active");
            evt.target.innerHTML = "n-Local";
          }
          this.update();
          this.loopStart();
          return;
        }
        handleNStyleSelect(evt) {
          evt.stopPropagation();
          this.options.nStyle = evt.target.value;
          this.update();
          this.loopStart();
          return;
        }
        loop() {
          const self2 = this;
          const { ctx } = this;
          ctx.clearRect(0, 0, this.canvWidth, this.canvHeight);
          if (!self2.options.noTrack) {
            ctx.strokeStyle = self2.options.trackColor;
            ctx.moveTo(self2.discXPositions[0], self2.discY);
            ctx.lineTo(_.last(self2.discXPositions), self2.discY);
            ctx.stroke();
            self2.discXPositions.forEach((x) => {
              ctx.moveTo(x, self2.discY - 5);
              ctx.lineTo(x, self2.discY + 5);
              ctx.stroke();
            });
          }
          this.scene.forEach((item) => {
            switch (item.type) {
              case "axis_label":
                self2.drawAxisLabel(item);
                break;
              case "disc":
                self2.drawDisc(item);
                break;
              case "disc_label":
                self2.drawAxisLabel(item);
                break;
            }
          });
          if (!self2.sceneIsStatic) {
            window.setTimeout(() => {
              window.requestAnimationFrame(() => {
                self2.loop.call(self2);
              });
            }, 1e3 / 60);
          } else {
            self2.loop_running = false;
          }
        }
        loopStart() {
          if (this.loop_running !== true) {
            this.loop();
            this.loop_running = true;
          } else
            return;
        }
        drawAxisLabel(item) {
          const { ctx } = this;
          const { labelSize, fontFamily } = this.options;
          const { x } = item.end;
          const { time, duration } = item;
          const y = interpolate({ a: item.start.y, b: item.end.y, time, duration });
          const fill = ConsCircles.getInterpColor(item.start.fill || item.end.fill, item.end.fill, time, duration);
          ctx.fillStyle = fill;
          ctx.textAlign = "center";
          ctx.baseline = "bottom";
          if (item.content.split("|").length == 1) {
            ctx.font = `${labelSize}px ${fontFamily}`;
            ctx.fillText(item.content, x, y + this.options.labelSize * 0.3);
          } else {
            ctx.font = `${labelSize * 1}px ${fontFamily}`;
            const rowsNo = item.content.split("|").length, rowTop = y - rowsNo * labelSize * 0.5;
            item.content.split("|").forEach((content, i) => {
              let newY = rowTop + i * labelSize + labelSize * 0.6;
              ctx.fillText(content, x, newY);
            });
          }
          if (item.time < item.duration) {
            item.time = time + 1;
          }
        }
        drawDisc(item) {
          const { ctx } = this;
          const { x, y } = item.end;
          const { time, duration } = item;
          const fill = ConsCircles.getInterpColor(item.start.fill || item.end.fill, item.end.fill, time, duration);
          const radius = interpolate({ a: item.start.radius, b: item.end.radius, time, duration });
          ctx.fillStyle = fill;
          ctx.beginPath();
          ctx.arc(x, y, radius, 0, 2 * Math.PI);
          ctx.fill();
          if (item.time < duration) {
            item.time = time + 1;
          }
        }
        update() {
          this.currentColor = this.groupColors[this.inView[0]];
          if (this.inView.length > 1)
            this.currentColor = "darkgray";
          const { inView, currentColor, groupColors, options, standardRate, discRadii, discLabels, colorTextOnColor, colorTextOnBground, visibleReal, realMean, globalMedian, discY, lowLabelY } = this;
          if ($("span.caption-add", this.container) && this.hasGroups)
            $("span.caption-add", this.container).innerText = this.inView[0] == "All" ? " - All Groups" : ` - ${this.inView.join(" + ")}`;
          $(".cons-circles figcaption")._.style({ color: this.colorTextOnBground });
          this.scene.forEach((item, i) => {
            switch (item.type) {
              case "axis_label":
                item.setProp("fill", ConsCircles.getRGB(colorTextOnBground), standardRate);
                return;
              case "disc":
                item.setProp("radius", discRadii[item.number]);
                item.setProp("fill", ConsCircles.getRGB(currentColor), standardRate);
                return;
              case "disc_label":
                item.content = discLabels[item.number];
                if (discRadii[item.number] < this.options.labelSize * 1.5) {
                  item.setProp("y", lowLabelY);
                  item.setProp("fill", ConsCircles.getRGB(colorTextOnBground), standardRate);
                } else {
                  item.setProp("fill", ConsCircles.getRGB(colorTextOnColor), standardRate);
                  item.setProp("y", discY);
                }
                return;
            }
          });
          $$(`#cc-container-${this.id} button.cc-control`).forEach((butt) => {
            if (inView.includes(butt.dataset.groupName)) {
              butt._.style({
                backgroundColor: groupColors[butt.dataset.groupName],
                color: ConsCircles.getTextColor(groupColors[butt.dataset.groupName], groupColors[butt.dataset.groupName])
              });
            } else {
              butt._.style({
                backgroundColor: "transparent",
                color: ConsCircles.getTextColor(options.bgColor, groupColors[butt.dataset.groupName])
              });
            }
          });
        }
        setFontSize() {
          $(this.container)._.style({
            fontSize: `${_.floor(this.targetEl.clientWidth / this.options.fontRatio)}px`
          });
        }
        static getInterpColor(a, b, time, duration) {
          const start = Color(a);
          return start.mix(Color(b), time / duration);
        }
        static getTextColor(bgColor = "white", textColor = "white") {
          let newColor = Color(textColor);
          newColor = newColor.lightness(30);
          return Color(bgColor).isDark() ? "white" : newColor.toString();
        }
        static genDescText(ccObj) {
          return "";
        }
        static getRGB(color) {
          return Color(color).rgb().array();
        }
        static rowSums(data) {
          if (!_.isArray(data) && !_.isArray(data[0]))
            return null;
          return (data[0] || []).map((v, i) => {
            return _.sum(data.map((v2) => v2[i]));
          });
        }
        static checkData(data) {
          if (!_.isObject(data))
            return "Data is not an object";
          if (_.keys(data).includes("All"))
            return "'All' is a reserved group name";
          let consistent = true, size = null;
          _.forIn(data, (group) => {
            if (!_.isArray(group)) {
              consistent = "Data must be an object of value arrays";
              return;
            }
            if (!_.every(group, _.isFinite)) {
              consistent = "Data rows must be numbers";
              return;
            }
            if (_.isNull(size))
              size = group.length;
            if (group.length !== size) {
              consistent = "Data rows must all be same length";
              return;
            }
          });
          return consistent;
        }
      };
      window.ConsCircles = ConsCircles;
      module.exports = {
        ConsCircles,
        SceneItem
      };
    }
  });

  // dev/raw.csv
  var require_raw = __commonJS({
    "dev/raw.csv"(exports, module) {
      module.exports = "\uFEFF9,9,9,9,9,9,9,9,9,9,9,9,9\r\n9,9,9,9,9,9,9,9,9,9,9,9,9\r\n9,9,9,9,9,9,9,9,9,9,9,9,9\r\n9,9,9,9,9,9,9,9,9,9,9,9,9\r\n9,9,9,9,9,9,9,9,9,9,9,9,9\r\n9,9,9,9,9,9,9,9,9,9,9,9,9\r\n9,9,9,9,9,9,9,9,9,9,9,9,9\r\n9,9,9,9,9,9,9,9,9,9,9,9,9\r\n9,9,9,9,9,9,9,9,9,9,9,9,9\r\n9,9,9,9,9,9,9,9,9,9,9,9,9\r\n9,9,9,9,9,9,9,9,9,9,9,9,9\r\n9,9,9,9,9,9,9,9,9,9,9,9,9\r\n9,9,9,9,9,9,9,9,9,9,9,9,9\r\n9,9,9,9,9,9,9,9,9,9,9,9,9\r\n9,9,9,9,9,9,9,9,9,9,9,9,9\r\n9,9,9,9,9,9,9,9,9,9,9,9,9\r\n9,9,9,9,9,9,9,9,9,9,9,9,9\r\n9,9,9,9,9,9,9,9,9,9,9,9,9\r\n8,8,8,8,8,8,8,8,8,8,8,8,8\r\n8,8,8,8,8,8,8,8,8,8,8,8,8\r\n9,9,9,9,5,9,9,9,9,9,9,9,9\r\n9,9,9,9,5,9,9,9,9,9,9,9,9\r\n9,9,9,9,9,9,9,9,9,5,9,9,9\r\n9,9,9,9,5,9,9,9,9,9,9,5,9\r\n9,9,9,9,5,9,5,5,9,9,9,9,9\r\n9,5,9,9,5,9,5,9,9,9,9,9,9\r\n9,9,9,9,5,9,5,9,5,9,9,9,9\r\n9,9,9,9,8,9,9,9,9,9,9,9,9\r\n9,9,9,9,9,9,8,9,9,9,9,9,9\r\n9,8,9,9,9,9,9,9,9,9,9,9,9\r\n9,8,9,9,9,9,9,9,9,9,9,9,9\r\n9,8,9,9,9,9,9,9,9,9,9,9,9\r\n7,9,9,9,9,9,9,9,9,9,9,9,9\r\n9,7,9,9,9,9,9,9,9,9,9,9,9\r\n9,7,9,9,9,9,9,9,9,9,9,9,9\r\n9,9,9,9,7,9,9,9,9,9,9,9,9\r\n9,9,9,9,9,9,7,9,9,9,9,9,9\r\n9,9,9,9,9,9,7,9,9,9,9,9,9\r\n9,6,9,9,9,9,9,9,9,9,9,9,9\r\n9,9,9,9,9,9,9,9,9,6,9,9,9\r\n9,9,9,9,9,9,4,9,9,9,9,9,9\r\n9,9,9,9,9,9,9,3,9,9,9,9,9\r\n9,9,9,9,9,9,3,9,9,9,9,9,9\r\n9,8,9,9,9,9,9,9,9,9,9,8,9\r\n9,9,9,9,8,9,9,9,9,9,8,9,9\r\n9,8,9,9,9,9,8,9,9,9,9,9,9\r\n9,8,9,9,9,9,8,9,9,9,9,9,9\r\n9,9,9,9,9,7,7,9,9,9,9,9,9\r\n9,9,9,9,7,9,9,7,9,9,9,9,9\r\n7,9,7,9,9,9,9,9,9,9,9,9,9\r\n7,7,9,9,9,9,9,7,9,9,9,9,9\r\n7,7,7,9,9,9,9,9,9,9,9,9,9\r\n9,9,9,9,7,9,7,9,9,9,7,9,9\r\n3,3,3,9,9,9,9,9,9,9,9,9,9\r\n8,8,8,9,9,9,8,9,9,9,9,9,9\r\n9,9,9,9,7,9,7,7,7,9,9,9,9\r\n7,7,9,9,9,9,7,9,9,7,9,9,9\r\n8,8,8,9,8,9,8,9,9,9,9,9,9\r\n8,9,9,9,9,9,8,8,9,8,8,8,9\r\n8,9,8,9,9,9,9,9,9,8,8,8,8\r\n8,8,8,9,8,9,8,9,9,8,8,9,8\r\n8,8,8,8,8,8,8,9,9,9,8,9,9\r\n9,8,8,8,8,9,8,8,8,9,8,9,8\r\n8,8,8,8,8,8,7,8,8,8,8,8,8\r\n8,8,8,8,8,8,6,8,8,8,8,8,8\r\n7,7,8,8,8,8,8,8,8,8,8,8,8\r\n7,7,7,7,8,8,7,8,8,8,7,7,8\r\n8,7,7,7,7,8,7,7,8,7,8,8,8\r\n7,7,7,7,7,7,6,6,7,7,7,7,7\r\n9,9,9,9,5,9,1,9,9,9,9,9,9\r\n9,9,9,9,9,9,5,9,1,9,9,9,9\r\n9,9,9,9,5,9,9,9,9,9,7,9,9\r\n9,9,9,9,9,9,5,9,9,9,9,7,9\r\n9,9,7,9,9,9,5,9,9,9,9,9,9\r\n9,6,5,9,9,9,9,9,9,9,9,9,9\r\n9,9,9,9,6,9,5,9,9,9,9,9,9\r\n9,5,9,9,5,9,9,9,8,9,9,9,9\r\n9,9,9,9,8,9,9,9,5,5,9,9,9\r\n9,9,9,9,5,9,5,9,9,9,7,9,9\r\n9,9,9,9,5,9,7,5,9,9,5,9,9\r\n9,9,9,9,5,9,5,5,9,9,5,7,9\r\n9,9,9,9,3,9,5,9,9,9,9,9,9\r\n5,5,9,5,9,9,9,5,9,9,6,9,9\r\n9,9,9,9,9,9,9,3,5,5,9,9,9\r\n5,2,5,5,9,9,9,5,5,9,9,9,9\r\n7,8,9,9,9,9,9,9,9,9,9,9,9\r\n9,8,9,9,9,9,7,9,9,9,9,9,9\r\n9,8,9,9,9,9,9,9,9,9,9,9,7\r\n9,9,7,8,9,9,9,9,9,9,9,9,9\r\n9,9,9,9,8,9,9,9,9,9,7,9,9\r\n9,9,9,9,7,9,9,9,9,9,8,9,9\r\n9,9,9,9,9,9,8,7,9,9,9,9,9\r\n1,3,1,1,1,1,1,1,4,1,1,1,1\r\n6,9,9,9,9,9,9,9,9,9,7,9,9\r\n9,9,9,9,9,9,6,7,9,9,9,9,9\r\n9,9,9,9,7,9,6,9,9,9,9,9,9\r\n9,9,9,9,7,9,9,6,9,9,9,9,9\r\n9,8,8,9,5,9,9,9,9,9,9,9,9\r\n9,9,9,9,5,9,9,9,9,9,8,8,9\r\n9,9,9,9,9,9,5,9,9,9,8,8,9\r\n9,9,9,9,5,9,9,9,9,9,7,7,9\r\n9,8,9,9,4,9,9,9,9,9,9,9,9\r\n9,9,9,9,6,9,4,9,9,9,9,9,9\r\n7,9,9,9,9,9,3,9,9,9,9,9,9\r\n9,9,9,9,2,9,2,5,5,9,9,9,9\r\n8,7,8,9,9,9,9,9,9,9,9,9,9\r\n9,9,8,9,9,9,9,9,9,9,7,8,9\r\n9,9,9,9,8,9,8,9,9,9,9,9,7\r\n9,9,9,9,8,9,8,9,9,9,7,9,9\r\n9,9,8,9,9,9,9,9,7,9,8,9,9\r\n9,7,9,7,9,9,9,9,9,9,9,8,9\r\n7,7,8,9,9,9,9,9,9,9,9,9,9\r\n9,7,8,9,7,9,9,9,9,9,9,9,9\r\n8,9,9,9,9,9,9,9,9,6,8,9,9\r\n9,9,9,9,9,9,8,6,9,9,9,9,8\r\n6,7,9,9,9,9,7,9,9,9,9,9,9\r\n9,9,9,9,6,9,7,9,9,9,7,9,9\r\n8,5,8,8,9,9,9,9,9,9,9,9,9\r\n8,6,9,9,9,9,6,9,9,9,9,9,9\r\n9,7,9,9,9,9,5,7,9,7,9,9,9\r\n9,9,9,9,5,8,8,8,9,5,9,9,9\r\n9,9,9,9,5,9,5,7,7,9,7,9,9\r\n3,8,8,9,9,9,9,9,9,9,9,9,9\r\n5,5,5,9,7,9,9,9,9,9,7,7,9\r\n9,9,9,9,9,9,8,9,9,8,2,9,9\r\n3,3,9,9,8,9,9,9,9,9,9,9,9\r\n7,8,9,9,9,9,9,8,9,9,9,8,9\r\n7,8,9,9,9,9,8,9,9,9,9,8,9\r\n9,9,9,9,8,9,8,9,9,9,8,6,9\r\n7,7,8,9,9,9,7,9,9,9,9,9,9\r\n9,9,9,9,7,9,7,9,9,8,7,9,9\r\n1,3,3,1,1,1,4,1,1,1,3,1,1\r\n9,8,9,9,8,9,5,8,9,8,9,9,9\r\n9,7,7,9,6,9,6,9,9,9,9,9,9\r\n9,9,9,9,6,9,6,9,9,9,7,7,9\r\n9,9,9,9,7,9,6,9,9,9,6,7,9\r\n5,5,8,9,8,9,8,9,9,8,9,9,9\r\n8,5,8,9,8,9,5,8,9,9,5,5,9\r\n8,8,9,8,7,9,8,9,9,9,9,9,9\r\n9,9,7,7,9,9,9,8,8,8,9,9,9\r\n8,9,9,9,7,9,8,9,9,7,8,9,9\r\n9,9,9,9,7,8,7,9,9,9,8,8,9\r\n8,7,7,8,9,9,9,9,7,9,9,9,9\r\n7,7,8,9,9,9,9,7,9,9,7,9,9\r\n7,6,7,9,9,7,6,9,9,9,9,9,9\r\n8,5,8,8,8,9,5,8,9,9,8,9,9\r\n8,8,8,9,9,9,5,5,8,8,8,9,9\r\n8,5,5,8,8,9,8,9,9,9,9,8,8\r\n8,8,8,9,7,9,8,9,8,9,9,9,9\r\n9,8,8,8,9,9,6,8,8,9,9,9,9\r\n8,8,7,9,8,9,7,9,9,9,9,8,9\r\n7,8,9,9,9,9,8,9,8,9,8,9,7\r\n8,7,8,8,8,9,7,9,9,9,9,9,9\r\n7,7,7,9,8,9,8,8,9,9,9,9,9\r\n7,7,9,9,8,9,7,9,9,9,7,7,9\r\n9,7,9,9,7,9,7,9,9,8,7,7,9\r\n8,8,8,8,8,9,9,9,9,9,7,8,9\r\n8,8,8,8,9,9,7,7,9,8,9,9,9\r\n7,7,8,8,9,8,9,9,9,8,9,9,8\r\n8,8,6,9,9,8,6,6,6,9,9,9,9\r\n8,8,8,8,9,8,7,8,9,8,9,9,9\r\n8,9,9,8,8,9,9,8,8,7,8,9,7\r\n8,8,8,8,5,9,8,8,8,8,8,9,9\r\n7,7,8,9,7,7,8,8,9,8,8,9,9\r\n8,8,8,8,7,8,8,8,8,8,9,9,9\r\n8,7,8,8,7,8,8,8,8,8,9,9,9\r\n8,8,8,8,5,8,8,8,8,7,5,8,8\r\n8,8,8,8,8,8,6,8,9,8,6,6,9\r\n7,7,7,8,7,8,8,8,8,8,7,9,9\r\n5,7,7,7,5,7,8,7,8,8,8,7,7\r\n5,8,8,7,8,8,7,7,8,7,8,8,8\r\n8,8,8,8,7,8,7,8,8,7,7,6,8\r\n8,6,7,7,7,8,7,7,8,8,8,8,8\r\n8,7,7,8,7,8,8,6,8,8,6,6,8\r\n9,9,9,9,9,9,9,5,1,7,9,9,9\r\n5,9,5,9,3,9,1,9,9,9,9,9,5\r\n9,7,5,9,6,9,9,9,9,9,9,9,9\r\n5,9,9,9,5,9,7,9,9,8,5,5,9\r\n9,9,9,9,5,9,5,7,9,9,9,9,4\r\n9,3,5,9,7,9,9,9,9,9,9,9,9\r\n9,9,9,9,5,9,3,9,9,9,7,9,9\r\n9,9,9,9,5,9,9,9,9,9,3,7,9\r\n9,9,9,9,3,9,9,7,9,9,5,5,9\r\n9,9,3,9,9,9,5,7,5,9,9,9,9\r\n9,9,9,9,5,9,9,9,9,8,2,9,9\r\n9,9,9,9,5,5,2,5,9,9,9,8,9\r\n9,9,9,9,5,9,3,5,4,9,9,5,9\r\n9,8,9,9,6,9,7,9,9,9,9,9,9\r\n7,8,6,9,9,9,9,9,9,9,9,9,9\r\n9,7,8,9,9,9,6,9,9,9,9,9,9\r\n9,9,8,9,7,9,5,8,9,9,9,9,9\r\n9,9,9,9,8,9,7,9,9,9,8,5,9\r\n9,9,9,9,9,9,5,9,9,9,7,7,8\r\n9,9,7,9,5,9,6,9,9,7,9,9,9\r\n9,5,7,9,6,9,7,9,9,9,9,9,9\r\n9,9,9,9,9,7,7,9,5,5,9,8,9\r\n9,9,9,9,8,9,5,3,8,9,9,9,9\r\n5,3,9,9,7,9,7,9,9,9,9,9,9\r\n9,9,9,9,9,9,4,7,9,9,1,7,9\r\n6,9,9,9,8,9,7,8,9,9,9,9,9\r\n9,9,9,9,9,9,7,7,9,8,6,9,9\r\n9,9,9,9,5,9,7,8,9,9,8,9,8\r\n5,9,9,9,7,9,8,9,9,8,9,8,9\r\n9,9,9,9,7,9,7,9,9,9,8,5,8\r\n8,8,9,9,5,9,5,9,7,9,8,9,9\r\n7,7,7,9,5,9,5,9,9,8,9,9,9\r\n6,9,9,9,4,9,7,9,9,9,9,9,7\r\n8,7,9,9,5,9,7,7,9,9,5,5,9\r\n7,7,9,9,5,9,5,9,8,8,5,5,9\r\n7,9,8,8,5,9,9,5,9,9,5,5,8\r\n9,9,9,9,6,9,3,9,9,9,7,7,9\r\n9,9,9,9,3,9,7,9,7,9,5,7,9\r\n7,1,4,9,9,9,7,7,9,9,9,9,9\r\n2,5,9,5,2,9,5,9,9,9,5,6,6\r\n2,2,6,6,9,9,5,9,9,9,9,9,9\r\n7,6,6,9,8,9,9,9,9,9,9,8,9\r\n7,9,9,9,5,9,7,8,8,9,7,9,9\r\n8,7,7,9,5,9,7,9,9,9,8,9,9\r\n8,8,8,9,7,9,7,9,9,9,9,5,5\r\n8,8,8,8,6,9,9,9,9,9,5,5,9\r\n5,8,9,7,5,9,5,9,9,8,7,8,9\r\n9,9,9,9,3,9,9,9,8,8,9,7,7\r\n9,7,9,9,5,9,9,7,7,9,5,7,3\r\n7,7,7,9,3,9,4,9,9,9,9,9,9\r\n9,7,9,9,3,9,3,9,9,3,8,9,9\r\n8,7,9,9,5,8,8,8,8,9,9,9,9\r\n8,8,7,9,9,8,5,8,9,9,8,9,9\r\n8,9,8,9,5,9,4,8,9,9,8,8,9\r\n8,8,8,9,9,9,5,4,4,9,9,8,9\r\n6,7,8,8,8,9,7,9,9,9,9,9,9\r\n9,8,8,8,9,9,7,6,9,6,9,9,9\r\n9,5,7,8,8,9,5,7,7,8,9,9,9\r\n8,7,7,7,5,8,5,9,9,9,8,9,9\r\n9,8,9,7,9,9,7,8,9,9,6,9,7\r\n6,7,8,9,6,9,7,9,8,9,9,9,9\r\n7,7,5,9,7,9,7,9,9,9,8,8,9\r\n9,7,9,9,7,9,2,7,3,3,9,9,9\r\n7,4,9,9,7,9,7,9,9,9,7,9,6\r\n9,7,9,9,7,9,7,3,6,9,7,9,9\r\n9,8,6,8,9,9,8,8,8,9,5,5,8\r\n5,8,5,8,7,9,8,8,8,5,5,8,9\r\n8,6,7,8,8,9,9,8,9,8,9,9,9\r\n8,7,8,9,7,9,8,9,8,9,5,8,9\r\n5,7,8,8,7,8,5,9,8,9,8,9,9\r\n7,8,9,8,5,5,8,9,8,9,7,5,8\r\n8,6,7,9,8,9,8,7,8,9,9,9,9\r\n6,7,8,8,8,9,7,9,9,9,8,9,9\r\n8,7,8,9,7,5,7,7,8,9,9,9,9\r\n8,7,7,9,7,9,4,9,9,9,7,8,9\r\n3,7,8,9,7,9,9,7,7,9,8,9,9\r\n9,7,7,9,4,9,7,7,9,9,4,6,9\r\n8,8,7,9,5,8,7,8,9,9,8,8,9\r\n8,8,8,8,6,9,8,5,9,6,8,9,9\r\n5,8,5,9,8,9,7,5,7,8,8,8,8\r\n8,8,7,7,5,8,5,5,8,5,8,8,9\r\n7,7,8,9,8,9,6,8,8,9,8,9,9\r\n9,8,8,8,7,9,7,9,8,9,6,6,9\r\n8,7,8,9,3,9,7,7,9,9,8,8,9\r\n8,9,7,9,8,9,7,9,9,8,4,4,7\r\n6,7,9,9,6,9,7,8,9,9,7,7,7\r\n8,8,8,9,7,9,5,7,9,8,8,8,8\r\n5,5,7,7,7,9,9,8,8,8,8,8,8\r\n8,8,8,8,5,8,5,6,8,7,5,5,7\r\n8,7,8,6,8,8,6,9,9,9,6,8,9\r\n7,7,8,8,6,7,7,8,9,8,9,9,9\r\n7,7,8,8,9,9,7,6,6,9,8,9,7\r\n6,6,9,8,7,9,9,9,8,6,6,7,7\r\n4,7,7,8,8,9,7,9,9,9,7,7,7\r\n8,8,8,8,5,8,6,8,8,5,7,5,8\r\n7,8,8,9,8,8,6,8,7,9,8,9,8\r\n8,8,8,8,7,8,5,9,9,8,7,7,8\r\n7,7,8,5,3,8,8,8,8,8,5,5,8\r\n8,9,8,8,5,7,7,8,8,7,7,8,9\r\n7,8,8,9,4,9,7,7,9,8,7,7,8\r\n7,5,8,8,7,5,5,7,7,6,7,7,8\r\n7,7,7,7,4,7,7,9,8,8,9,9,8\r\n6,5,6,7,6,6,5,8,8,7,5,6,6\r\n8,3,8,8,8,9,8,8,8,8,8,7,9\r\n8,7,7,8,7,8,7,8,9,6,7,7,9\r\n7,5,7,7,7,8,7,7,8,9,7,7,8\r\n8,6,8,6,6,9,6,8,8,8,8,6,7\r\n6,6,6,8,6,8,5,8,8,8,6,7,8\r\n6,7,8,8,7,8,9,7,8,7,7,7,8\r\n7,7,7,8,6,7,5,7,6,7,8,8,8\r\n4,6,7,8,7,8,7,8,8,8,8,8,8\r\n8,6,7,6,7,4,6,7,7,8,8,8,8\r\n9,9,9,9,1,9,5,5,6,5,5,5,7\r\n1,8,9,5,5,5,1,5,5,1,7,1,1\r\n9,9,9,9,5,1,9,5,4,3,9,9,9\r\n9,9,9,5,5,9,9,1,2,3,9,9,9\r\n9,9,9,9,6,9,5,8,9,9,7,9,9\r\n6,8,9,9,5,4,9,9,9,9,9,9,9\r\n3,9,9,9,5,9,9,9,9,6,9,8,9\r\n9,9,9,9,5,9,3,8,5,9,9,7,9\r\n9,8,7,9,6,9,1,9,9,9,9,9,9\r\n9,1,4,8,7,9,9,9,9,9,9,9,9\r\n9,6,5,9,5,9,1,5,8,9,8,9,9\r\n7,9,9,7,5,9,5,5,4,9,1,9,9\r\n8,3,6,9,9,9,9,1,9,9,9,9,9\r\n1,9,3,9,9,9,6,9,9,7,9,9,9\r\n9,9,9,5,8,2,1,9,9,9,8,9,9\r\n7,9,8,9,6,9,5,9,9,5,8,9,9\r\n9,4,8,9,9,9,9,6,9,9,9,9,7\r\n4,7,6,5,5,9,9,9,9,9,7,9,9\r\n8,9,9,9,7,7,3,5,9,9,9,9,9\r\n8,7,9,9,2,9,5,9,9,9,7,9,9\r\n6,9,9,9,7,9,3,9,9,4,9,9,9\r\n1,7,9,9,9,5,8,8,7,5,9,5,9\r\n7,9,9,9,7,8,3,1,9,9,9,9,9\r\n5,6,7,9,8,9,9,8,9,9,8,9,9\r\n7,7,9,9,5,9,8,7,9,6,9,9,9\r\n6,9,9,9,4,9,7,9,9,9,9,7,8\r\n8,9,9,8,5,9,6,9,7,9,5,6,9\r\n5,7,7,9,5,9,9,8,9,7,5,6,9\r\n8,7,9,8,5,9,9,5,7,9,6,5,9\r\n5,8,7,9,5,9,6,5,9,7,8,9,9\r\n9,8,9,9,9,9,3,9,9,9,6,8,7\r\n7,7,8,9,5,9,9,8,9,9,3,9,9\r\n7,5,7,9,5,9,5,9,9,8,8,4,9\r\n9,7,5,9,3,9,5,9,9,8,7,8,9\r\n6,7,9,5,5,9,7,6,9,9,3,5,9\r\n4,5,6,6,4,9,9,9,8,9,9,9,9\r\n2,4,4,8,9,9,9,7,9,9,9,9,9\r\n6,8,8,8,5,9,7,9,8,9,9,9,9\r\n8,8,9,9,5,9,6,5,7,9,8,8,9\r\n7,8,8,9,6,9,5,8,9,8,5,5,9\r\n8,8,9,9,8,9,2,9,9,9,6,3,9\r\n8,8,9,8,7,9,7,9,9,9,5,6,9\r\n6,8,9,7,5,9,5,9,9,7,8,8,9\r\n5,7,9,9,7,9,4,8,8,9,9,9,8\r\n7,8,7,9,5,8,4,9,9,9,5,9,8\r\n9,7,5,4,8,9,8,9,9,8,4,5,9\r\n7,7,7,9,5,9,2,8,9,9,9,9,8\r\n8,7,7,8,8,9,9,5,5,5,5,1,7\r\n6,7,7,7,5,8,9,9,9,8,9,9,9\r\n9,7,9,9,8,9,5,8,9,7,6,7,9\r\n4,7,7,8,7,9,8,9,9,9,5,9,9\r\n6,6,7,7,5,9,7,8,9,9,9,5,9\r\n4,6,6,7,7,9,9,9,9,8,9,9,9\r\n8,7,6,9,5,9,8,9,8,9,8,5,8\r\n8,8,8,8,9,7,5,8,9,5,6,5,5\r\n8,7,9,8,8,9,7,5,9,9,6,8,9\r\n6,6,8,8,8,8,7,5,5,9,9,9,9\r\n6,7,7,9,5,9,7,9,9,9,8,8,8\r\n3,8,8,9,7,9,6,9,9,9,7,8,9\r\n8,8,4,9,7,9,7,3,9,9,9,9,8\r\n8,8,7,9,6,9,5,9,9,9,7,6,6\r\n3,6,6,8,7,9,8,9,7,9,9,9,9\r\n4,7,9,9,6,9,7,8,9,9,6,7,9\r\n3,8,5,8,7,9,9,8,9,8,5,8,8\r\n7,7,8,8,6,8,5,9,9,9,8,8,9\r\n8,8,8,9,6,9,5,7,8,5,8,7,9\r\n8,7,9,8,4,9,8,9,9,9,6,8,8\r\n7,8,6,8,9,9,5,5,8,6,8,8,5\r\n9,8,9,9,7,9,3,8,8,8,8,6,9\r\n4,8,8,8,5,8,6,6,8,5,9,9,9\r\n1,5,5,5,5,7,7,6,8,8,8,8,8\r\n6,4,4,8,8,9,8,9,9,9,9,7,8\r\n8,5,5,8,5,8,8,9,9,7,7,7,3\r\n8,8,8,9,9,3,3,5,4,4,9,5,8\r\n8,9,9,9,5,9,6,7,8,6,8,6,7\r\n6,8,8,9,7,9,9,7,7,8,3,9,9\r\n3,7,5,9,8,8,5,7,5,5,3,3,8\r\n5,5,6,7,6,9,7,6,8,8,7,9,9\r\n3,7,9,9,7,9,6,7,9,9,7,8,8\r\n6,7,8,9,5,5,6,9,6,6,7,9,7\r\n1,6,5,5,8,7,8,8,8,8,8,8,5\r\n2,7,8,9,4,9,7,8,9,9,8,8,8\r\n6,7,5,8,7,9,7,5,8,8,8,5,8\r\n6,8,8,9,4,9,6,8,9,9,7,8,8\r\n9,9,8,8,3,9,2,8,9,8,7,7,7\r\n8,7,6,9,4,9,7,8,6,9,7,8,9\r\n7,6,8,8,6,9,3,8,9,7,9,7,9\r\n4,7,4,9,3,8,7,8,8,9,7,9,9\r\n3,7,7,8,6,9,7,9,9,9,7,6,8\r\n7,4,7,9,9,8,5,7,7,8,9,4,7\r\n8,8,7,8,7,8,8,9,9,8,5,6,6\r\n6,6,7,7,5,8,7,8,8,8,5,8,9\r\n9,8,7,9,6,8,7,4,8,8,7,8,9\r\n7,5,7,8,7,8,6,8,8,6,5,7,9\r\n6,6,7,7,8,9,7,8,9,8,6,5,8\r\n7,7,7,7,5,7,7,5,8,7,5,3,4\r\n5,7,6,7,4,7,6,4,9,9,7,7,7\r\n7,8,8,8,6,8,6,7,8,9,5,8,8\r\n8,7,8,8,6,7,6,7,8,9,5,6,7\r\n7,7,6,8,5,8,6,5,7,8,4,4,7\r\n6,6,7,7,8,9,7,8,7,7,6,5,7\r\n4,6,6,6,4,7,7,8,6,7,5,5,6\r\n3,3,6,7,8,8,8,8,8,8,8,5,8\r\n6,5,6,8,4,8,6,8,8,8,7,8,8\r\n3,7,7,8,8,9,7,8,8,8,8,6,8\r\n7,4,7,8,7,9,8,7,8,7,8,6,8\r\n7,6,6,8,4,8,4,5,8,7,7,8,8\r\n7,7,3,8,4,7,8,7,8,9,4,8,8\r\n8,7,8,7,4,7,8,5,6,7,4,4,8\r\n3,7,7,8,6,8,6,7,3,6,8,8,5\r\n6,4,7,6,3,8,7,7,8,8,8,7,8\r\n5,9,5,9,1,6,7,9,3,9,5,9,9\r\n1,4,9,9,5,9,3,5,7,9,9,9,9\r\n9,7,9,9,5,9,6,9,3,9,9,8,9\r\n8,5,5,7,1,9,5,9,9,9,6,8,9\r\n9,9,9,9,1,9,7,6,5,9,4,6,9\r\n2,4,5,9,5,7,5,9,1,9,7,9,9\r\n9,1,2,8,3,9,3,9,9,9,5,5,5\r\n5,5,8,9,5,9,3,8,9,7,6,9,9\r\n9,9,9,9,3,9,4,8,9,9,7,6,9\r\n6,8,9,9,7,9,9,9,9,8,5,2,9\r\n7,8,4,9,3,9,9,9,9,9,2,9,9\r\n7,7,8,9,9,9,9,9,2,6,5,5,6\r\n4,7,6,8,9,9,9,9,7,5,9,9,7\r\n3,7,9,9,8,9,5,3,9,9,7,6,9\r\n3,8,8,9,5,8,5,7,5,8,5,2,9\r\n8,6,8,9,8,9,3,8,9,9,5,7,9\r\n7,9,6,8,5,9,5,5,6,9,3,8,8\r\n2,7,9,8,3,7,2,7,1,1,1,1,1\r\n7,3,8,2,9,9,2,3,1,1,9,7,9\r\n7,7,9,8,7,9,3,8,9,9,5,6,9\r\n3,4,7,9,5,9,7,7,9,9,5,7,8\r\n1,1,4,8,9,8,6,8,8,8,9,9,7\r\n8,3,8,9,7,9,4,8,5,8,9,7,9\r\n6,7,7,8,5,9,3,9,9,9,7,8,8\r\n6,7,9,9,4,8,6,5,9,9,8,8,4\r\n3,7,6,4,8,9,6,9,8,9,9,9,8\r\n6,8,4,7,5,6,5,7,7,9,5,5,8\r\n7,8,9,9,5,6,5,7,7,8,4,7,9\r\n4,7,9,8,5,9,6,5,9,7,8,7,6\r\n6,9,8,7,3,9,5,7,6,7,8,5,9\r\n6,7,7,4,7,9,3,8,9,9,8,9,9\r\n1,6,9,8,7,8,7,9,7,7,7,9,5\r\n7,7,5,6,3,7,4,9,9,9,9,7,7\r\n4,9,5,7,3,9,6,3,6,9,7,7,9\r\n8,8,8,7,4,8,8,8,9,6,5,9,9\r\n7,7,8,9,4,6,4,8,9,9,5,8,8\r\n7,8,7,9,6,6,3,7,9,9,8,5,8\r\n7,4,5,7,6,8,7,9,9,6,7,8,9\r\n6,4,7,5,6,9,7,8,7,5,6,5,7\r\n5,3,7,7,6,9,4,6,7,9,7,7,9\r\n7,7,7,8,5,8,4,8,8,8,5,6,9\r\n4,9,8,8,6,9,6,8,8,8,7,6,5\r\n8,7,7,8,9,9,8,7,8,7,6,3,5\r\n7,6,7,7,4,9,3,9,7,8,8,9,8\r\n8,7,9,8,4,7,3,9,9,8,7,6,7\r\n6,7,4,9,7,9,3,6,7,9,7,3,8\r\n4,2,2,7,2,8,2,8,8,8,1,1,3\r\n6,7,8,8,8,8,8,7,9,6,5,3,8\r\n7,6,7,8,8,4,4,7,9,5,6,6,8\r\n3,7,7,4,2,9,6,7,9,6,3,3,7\r\n3,6,6,7,4,8,8,8,9,7,6,8,7\r\n7,7,7,8,3,7,4,7,8,9,6,6,6\r\n9,4,3,2,2,5,1,8,9,8,1,1,5\r\n8,4,7,9,3,9,8,9,9,9,2,5,9\r\n3,7,8,7,2,9,2,9,9,9,1,5,9\r\n1,2,1,1,5,1,3,9,8,8,3,2,7\r\n5,4,5,9,4,8,5,8,9,7,2,1,7\r\n2,3,7,7,5,9,4,9,9,9,7,6,9\r\n8,7,9,9,2,9,5,8,7,3,2,4,9\r\n6,6,8,8,9,9,6,3,4,5,9,7,9\r\n7,3,7,7,8,9,4,5,6,9,7,4,9\r\n2,7,6,9,8,9,4,7,8,7,8,7,3\r\n4,9,5,9,1,9,3,9,8,9,7,7,6";
    }
  });

  // node_modules/papaparse/papaparse.min.js
  var require_papaparse_min = __commonJS({
    "node_modules/papaparse/papaparse.min.js"(exports, module) {
      !function(e, t) {
        "function" == typeof define && define.amd ? define([], t) : "object" == typeof module && "undefined" != typeof exports ? module.exports = t() : e.Papa = t();
      }(exports, function s() {
        "use strict";
        var f = "undefined" != typeof self ? self : "undefined" != typeof window ? window : void 0 !== f ? f : {};
        var n = !f.document && !!f.postMessage, o = n && /blob:/i.test((f.location || {}).protocol), a = {}, h = 0, b = { parse: function(e, t) {
          var i2 = (t = t || {}).dynamicTyping || false;
          M(i2) && (t.dynamicTypingFunction = i2, i2 = {});
          if (t.dynamicTyping = i2, t.transform = !!M(t.transform) && t.transform, t.worker && b.WORKERS_SUPPORTED) {
            var r = function() {
              if (!b.WORKERS_SUPPORTED)
                return false;
              var e2 = (i3 = f.URL || f.webkitURL || null, r2 = s.toString(), b.BLOB_URL || (b.BLOB_URL = i3.createObjectURL(new Blob(["(", r2, ")();"], { type: "text/javascript" })))), t2 = new f.Worker(e2);
              var i3, r2;
              return t2.onmessage = _, t2.id = h++, a[t2.id] = t2;
            }();
            return r.userStep = t.step, r.userChunk = t.chunk, r.userComplete = t.complete, r.userError = t.error, t.step = M(t.step), t.chunk = M(t.chunk), t.complete = M(t.complete), t.error = M(t.error), delete t.worker, void r.postMessage({ input: e, config: t, workerId: r.id });
          }
          var n2 = null;
          b.NODE_STREAM_INPUT, "string" == typeof e ? n2 = t.download ? new l(t) : new p(t) : true === e.readable && M(e.read) && M(e.on) ? n2 = new g2(t) : (f.File && e instanceof File || e instanceof Object) && (n2 = new c(t));
          return n2.stream(e);
        }, unparse: function(e, t) {
          var n2 = false, _2 = true, m2 = ",", y2 = "\r\n", s2 = '"', a2 = s2 + s2, i2 = false, r = null, o2 = false;
          !function() {
            if ("object" != typeof t)
              return;
            "string" != typeof t.delimiter || b.BAD_DELIMITERS.filter(function(e2) {
              return -1 !== t.delimiter.indexOf(e2);
            }).length || (m2 = t.delimiter);
            ("boolean" == typeof t.quotes || "function" == typeof t.quotes || Array.isArray(t.quotes)) && (n2 = t.quotes);
            "boolean" != typeof t.skipEmptyLines && "string" != typeof t.skipEmptyLines || (i2 = t.skipEmptyLines);
            "string" == typeof t.newline && (y2 = t.newline);
            "string" == typeof t.quoteChar && (s2 = t.quoteChar);
            "boolean" == typeof t.header && (_2 = t.header);
            if (Array.isArray(t.columns)) {
              if (0 === t.columns.length)
                throw new Error("Option columns is empty");
              r = t.columns;
            }
            void 0 !== t.escapeChar && (a2 = t.escapeChar + s2);
            ("boolean" == typeof t.escapeFormulae || t.escapeFormulae instanceof RegExp) && (o2 = t.escapeFormulae instanceof RegExp ? t.escapeFormulae : /^[=+\-@\t\r].*$/);
          }();
          var h2 = new RegExp(j(s2), "g");
          "string" == typeof e && (e = JSON.parse(e));
          if (Array.isArray(e)) {
            if (!e.length || Array.isArray(e[0]))
              return u2(null, e, i2);
            if ("object" == typeof e[0])
              return u2(r || Object.keys(e[0]), e, i2);
          } else if ("object" == typeof e)
            return "string" == typeof e.data && (e.data = JSON.parse(e.data)), Array.isArray(e.data) && (e.fields || (e.fields = e.meta && e.meta.fields || r), e.fields || (e.fields = Array.isArray(e.data[0]) ? e.fields : "object" == typeof e.data[0] ? Object.keys(e.data[0]) : []), Array.isArray(e.data[0]) || "object" == typeof e.data[0] || (e.data = [e.data])), u2(e.fields || [], e.data || [], i2);
          throw new Error("Unable to serialize unrecognized input");
          function u2(e2, t2, i3) {
            var r2 = "";
            "string" == typeof e2 && (e2 = JSON.parse(e2)), "string" == typeof t2 && (t2 = JSON.parse(t2));
            var n3 = Array.isArray(e2) && 0 < e2.length, s3 = !Array.isArray(t2[0]);
            if (n3 && _2) {
              for (var a3 = 0; a3 < e2.length; a3++)
                0 < a3 && (r2 += m2), r2 += v2(e2[a3], a3);
              0 < t2.length && (r2 += y2);
            }
            for (var o3 = 0; o3 < t2.length; o3++) {
              var h3 = n3 ? e2.length : t2[o3].length, u3 = false, f2 = n3 ? 0 === Object.keys(t2[o3]).length : 0 === t2[o3].length;
              if (i3 && !n3 && (u3 = "greedy" === i3 ? "" === t2[o3].join("").trim() : 1 === t2[o3].length && 0 === t2[o3][0].length), "greedy" === i3 && n3) {
                for (var d2 = [], l2 = 0; l2 < h3; l2++) {
                  var c2 = s3 ? e2[l2] : l2;
                  d2.push(t2[o3][c2]);
                }
                u3 = "" === d2.join("").trim();
              }
              if (!u3) {
                for (var p2 = 0; p2 < h3; p2++) {
                  0 < p2 && !f2 && (r2 += m2);
                  var g3 = n3 && s3 ? e2[p2] : p2;
                  r2 += v2(t2[o3][g3], p2);
                }
                o3 < t2.length - 1 && (!i3 || 0 < h3 && !f2) && (r2 += y2);
              }
            }
            return r2;
          }
          function v2(e2, t2) {
            if (null == e2)
              return "";
            if (e2.constructor === Date)
              return JSON.stringify(e2).slice(1, 25);
            var i3 = false;
            o2 && "string" == typeof e2 && o2.test(e2) && (e2 = "'" + e2, i3 = true);
            var r2 = e2.toString().replace(h2, a2);
            return (i3 = i3 || true === n2 || "function" == typeof n2 && n2(e2, t2) || Array.isArray(n2) && n2[t2] || function(e3, t3) {
              for (var i4 = 0; i4 < t3.length; i4++)
                if (-1 < e3.indexOf(t3[i4]))
                  return true;
              return false;
            }(r2, b.BAD_DELIMITERS) || -1 < r2.indexOf(m2) || " " === r2.charAt(0) || " " === r2.charAt(r2.length - 1)) ? s2 + r2 + s2 : r2;
          }
        } };
        if (b.RECORD_SEP = String.fromCharCode(30), b.UNIT_SEP = String.fromCharCode(31), b.BYTE_ORDER_MARK = "\uFEFF", b.BAD_DELIMITERS = ["\r", "\n", '"', b.BYTE_ORDER_MARK], b.WORKERS_SUPPORTED = !n && !!f.Worker, b.NODE_STREAM_INPUT = 1, b.LocalChunkSize = 10485760, b.RemoteChunkSize = 5242880, b.DefaultDelimiter = ",", b.Parser = E, b.ParserHandle = i, b.NetworkStreamer = l, b.FileStreamer = c, b.StringStreamer = p, b.ReadableStreamStreamer = g2, f.jQuery) {
          var d = f.jQuery;
          d.fn.parse = function(o2) {
            var i2 = o2.config || {}, h2 = [];
            return this.each(function(e2) {
              if (!("INPUT" === d(this).prop("tagName").toUpperCase() && "file" === d(this).attr("type").toLowerCase() && f.FileReader) || !this.files || 0 === this.files.length)
                return true;
              for (var t = 0; t < this.files.length; t++)
                h2.push({ file: this.files[t], inputElem: this, instanceConfig: d.extend({}, i2) });
            }), e(), this;
            function e() {
              if (0 !== h2.length) {
                var e2, t, i3, r, n2 = h2[0];
                if (M(o2.before)) {
                  var s2 = o2.before(n2.file, n2.inputElem);
                  if ("object" == typeof s2) {
                    if ("abort" === s2.action)
                      return e2 = "AbortError", t = n2.file, i3 = n2.inputElem, r = s2.reason, void (M(o2.error) && o2.error({ name: e2 }, t, i3, r));
                    if ("skip" === s2.action)
                      return void u2();
                    "object" == typeof s2.config && (n2.instanceConfig = d.extend(n2.instanceConfig, s2.config));
                  } else if ("skip" === s2)
                    return void u2();
                }
                var a2 = n2.instanceConfig.complete;
                n2.instanceConfig.complete = function(e3) {
                  M(a2) && a2(e3, n2.file, n2.inputElem), u2();
                }, b.parse(n2.file, n2.instanceConfig);
              } else
                M(o2.complete) && o2.complete();
            }
            function u2() {
              h2.splice(0, 1), e();
            }
          };
        }
        function u(e) {
          this._handle = null, this._finished = false, this._completed = false, this._halted = false, this._input = null, this._baseIndex = 0, this._partialLine = "", this._rowCount = 0, this._start = 0, this._nextChunk = null, this.isFirstChunk = true, this._completeResults = { data: [], errors: [], meta: {} }, function(e2) {
            var t = w(e2);
            t.chunkSize = parseInt(t.chunkSize), e2.step || e2.chunk || (t.chunkSize = null);
            this._handle = new i(t), (this._handle.streamer = this)._config = t;
          }.call(this, e), this.parseChunk = function(e2, t) {
            if (this.isFirstChunk && M(this._config.beforeFirstChunk)) {
              var i2 = this._config.beforeFirstChunk(e2);
              void 0 !== i2 && (e2 = i2);
            }
            this.isFirstChunk = false, this._halted = false;
            var r = this._partialLine + e2;
            this._partialLine = "";
            var n2 = this._handle.parse(r, this._baseIndex, !this._finished);
            if (!this._handle.paused() && !this._handle.aborted()) {
              var s2 = n2.meta.cursor;
              this._finished || (this._partialLine = r.substring(s2 - this._baseIndex), this._baseIndex = s2), n2 && n2.data && (this._rowCount += n2.data.length);
              var a2 = this._finished || this._config.preview && this._rowCount >= this._config.preview;
              if (o)
                f.postMessage({ results: n2, workerId: b.WORKER_ID, finished: a2 });
              else if (M(this._config.chunk) && !t) {
                if (this._config.chunk(n2, this._handle), this._handle.paused() || this._handle.aborted())
                  return void (this._halted = true);
                n2 = void 0, this._completeResults = void 0;
              }
              return this._config.step || this._config.chunk || (this._completeResults.data = this._completeResults.data.concat(n2.data), this._completeResults.errors = this._completeResults.errors.concat(n2.errors), this._completeResults.meta = n2.meta), this._completed || !a2 || !M(this._config.complete) || n2 && n2.meta.aborted || (this._config.complete(this._completeResults, this._input), this._completed = true), a2 || n2 && n2.meta.paused || this._nextChunk(), n2;
            }
            this._halted = true;
          }, this._sendError = function(e2) {
            M(this._config.error) ? this._config.error(e2) : o && this._config.error && f.postMessage({ workerId: b.WORKER_ID, error: e2, finished: false });
          };
        }
        function l(e) {
          var r;
          (e = e || {}).chunkSize || (e.chunkSize = b.RemoteChunkSize), u.call(this, e), this._nextChunk = n ? function() {
            this._readChunk(), this._chunkLoaded();
          } : function() {
            this._readChunk();
          }, this.stream = function(e2) {
            this._input = e2, this._nextChunk();
          }, this._readChunk = function() {
            if (this._finished)
              this._chunkLoaded();
            else {
              if (r = new XMLHttpRequest(), this._config.withCredentials && (r.withCredentials = this._config.withCredentials), n || (r.onload = v(this._chunkLoaded, this), r.onerror = v(this._chunkError, this)), r.open(this._config.downloadRequestBody ? "POST" : "GET", this._input, !n), this._config.downloadRequestHeaders) {
                var e2 = this._config.downloadRequestHeaders;
                for (var t in e2)
                  r.setRequestHeader(t, e2[t]);
              }
              if (this._config.chunkSize) {
                var i2 = this._start + this._config.chunkSize - 1;
                r.setRequestHeader("Range", "bytes=" + this._start + "-" + i2);
              }
              try {
                r.send(this._config.downloadRequestBody);
              } catch (e3) {
                this._chunkError(e3.message);
              }
              n && 0 === r.status && this._chunkError();
            }
          }, this._chunkLoaded = function() {
            4 === r.readyState && (r.status < 200 || 400 <= r.status ? this._chunkError() : (this._start += this._config.chunkSize ? this._config.chunkSize : r.responseText.length, this._finished = !this._config.chunkSize || this._start >= function(e2) {
              var t = e2.getResponseHeader("Content-Range");
              if (null === t)
                return -1;
              return parseInt(t.substring(t.lastIndexOf("/") + 1));
            }(r), this.parseChunk(r.responseText)));
          }, this._chunkError = function(e2) {
            var t = r.statusText || e2;
            this._sendError(new Error(t));
          };
        }
        function c(e) {
          var r, n2;
          (e = e || {}).chunkSize || (e.chunkSize = b.LocalChunkSize), u.call(this, e);
          var s2 = "undefined" != typeof FileReader;
          this.stream = function(e2) {
            this._input = e2, n2 = e2.slice || e2.webkitSlice || e2.mozSlice, s2 ? ((r = new FileReader()).onload = v(this._chunkLoaded, this), r.onerror = v(this._chunkError, this)) : r = new FileReaderSync(), this._nextChunk();
          }, this._nextChunk = function() {
            this._finished || this._config.preview && !(this._rowCount < this._config.preview) || this._readChunk();
          }, this._readChunk = function() {
            var e2 = this._input;
            if (this._config.chunkSize) {
              var t = Math.min(this._start + this._config.chunkSize, this._input.size);
              e2 = n2.call(e2, this._start, t);
            }
            var i2 = r.readAsText(e2, this._config.encoding);
            s2 || this._chunkLoaded({ target: { result: i2 } });
          }, this._chunkLoaded = function(e2) {
            this._start += this._config.chunkSize, this._finished = !this._config.chunkSize || this._start >= this._input.size, this.parseChunk(e2.target.result);
          }, this._chunkError = function() {
            this._sendError(r.error);
          };
        }
        function p(e) {
          var i2;
          u.call(this, e = e || {}), this.stream = function(e2) {
            return i2 = e2, this._nextChunk();
          }, this._nextChunk = function() {
            if (!this._finished) {
              var e2, t = this._config.chunkSize;
              return t ? (e2 = i2.substring(0, t), i2 = i2.substring(t)) : (e2 = i2, i2 = ""), this._finished = !i2, this.parseChunk(e2);
            }
          };
        }
        function g2(e) {
          u.call(this, e = e || {});
          var t = [], i2 = true, r = false;
          this.pause = function() {
            u.prototype.pause.apply(this, arguments), this._input.pause();
          }, this.resume = function() {
            u.prototype.resume.apply(this, arguments), this._input.resume();
          }, this.stream = function(e2) {
            this._input = e2, this._input.on("data", this._streamData), this._input.on("end", this._streamEnd), this._input.on("error", this._streamError);
          }, this._checkIsFinished = function() {
            r && 1 === t.length && (this._finished = true);
          }, this._nextChunk = function() {
            this._checkIsFinished(), t.length ? this.parseChunk(t.shift()) : i2 = true;
          }, this._streamData = v(function(e2) {
            try {
              t.push("string" == typeof e2 ? e2 : e2.toString(this._config.encoding)), i2 && (i2 = false, this._checkIsFinished(), this.parseChunk(t.shift()));
            } catch (e3) {
              this._streamError(e3);
            }
          }, this), this._streamError = v(function(e2) {
            this._streamCleanUp(), this._sendError(e2);
          }, this), this._streamEnd = v(function() {
            this._streamCleanUp(), r = true, this._streamData("");
          }, this), this._streamCleanUp = v(function() {
            this._input.removeListener("data", this._streamData), this._input.removeListener("end", this._streamEnd), this._input.removeListener("error", this._streamError);
          }, this);
        }
        function i(m2) {
          var a2, o2, h2, r = Math.pow(2, 53), n2 = -r, s2 = /^\s*-?(\d+\.?|\.\d+|\d+\.\d+)([eE][-+]?\d+)?\s*$/, u2 = /^(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))$/, t = this, i2 = 0, f2 = 0, d2 = false, e = false, l2 = [], c2 = { data: [], errors: [], meta: {} };
          if (M(m2.step)) {
            var p2 = m2.step;
            m2.step = function(e2) {
              if (c2 = e2, _2())
                g3();
              else {
                if (g3(), 0 === c2.data.length)
                  return;
                i2 += e2.data.length, m2.preview && i2 > m2.preview ? o2.abort() : (c2.data = c2.data[0], p2(c2, t));
              }
            };
          }
          function y2(e2) {
            return "greedy" === m2.skipEmptyLines ? "" === e2.join("").trim() : 1 === e2.length && 0 === e2[0].length;
          }
          function g3() {
            return c2 && h2 && (k("Delimiter", "UndetectableDelimiter", "Unable to auto-detect delimiting character; defaulted to '" + b.DefaultDelimiter + "'"), h2 = false), m2.skipEmptyLines && (c2.data = c2.data.filter(function(e2) {
              return !y2(e2);
            })), _2() && function() {
              if (!c2)
                return;
              function e2(e3, t3) {
                M(m2.transformHeader) && (e3 = m2.transformHeader(e3, t3)), l2.push(e3);
              }
              if (Array.isArray(c2.data[0])) {
                for (var t2 = 0; _2() && t2 < c2.data.length; t2++)
                  c2.data[t2].forEach(e2);
                c2.data.splice(0, 1);
              } else
                c2.data.forEach(e2);
            }(), function() {
              if (!c2 || !m2.header && !m2.dynamicTyping && !m2.transform)
                return c2;
              function e2(e3, t3) {
                var i3, r2 = m2.header ? {} : [];
                for (i3 = 0; i3 < e3.length; i3++) {
                  var n3 = i3, s3 = e3[i3];
                  m2.header && (n3 = i3 >= l2.length ? "__parsed_extra" : l2[i3]), m2.transform && (s3 = m2.transform(s3, n3)), s3 = v2(n3, s3), "__parsed_extra" === n3 ? (r2[n3] = r2[n3] || [], r2[n3].push(s3)) : r2[n3] = s3;
                }
                return m2.header && (i3 > l2.length ? k("FieldMismatch", "TooManyFields", "Too many fields: expected " + l2.length + " fields but parsed " + i3, f2 + t3) : i3 < l2.length && k("FieldMismatch", "TooFewFields", "Too few fields: expected " + l2.length + " fields but parsed " + i3, f2 + t3)), r2;
              }
              var t2 = 1;
              !c2.data.length || Array.isArray(c2.data[0]) ? (c2.data = c2.data.map(e2), t2 = c2.data.length) : c2.data = e2(c2.data, 0);
              m2.header && c2.meta && (c2.meta.fields = l2);
              return f2 += t2, c2;
            }();
          }
          function _2() {
            return m2.header && 0 === l2.length;
          }
          function v2(e2, t2) {
            return i3 = e2, m2.dynamicTypingFunction && void 0 === m2.dynamicTyping[i3] && (m2.dynamicTyping[i3] = m2.dynamicTypingFunction(i3)), true === (m2.dynamicTyping[i3] || m2.dynamicTyping) ? "true" === t2 || "TRUE" === t2 || "false" !== t2 && "FALSE" !== t2 && (function(e3) {
              if (s2.test(e3)) {
                var t3 = parseFloat(e3);
                if (n2 < t3 && t3 < r)
                  return true;
              }
              return false;
            }(t2) ? parseFloat(t2) : u2.test(t2) ? new Date(t2) : "" === t2 ? null : t2) : t2;
            var i3;
          }
          function k(e2, t2, i3, r2) {
            var n3 = { type: e2, code: t2, message: i3 };
            void 0 !== r2 && (n3.row = r2), c2.errors.push(n3);
          }
          this.parse = function(e2, t2, i3) {
            var r2 = m2.quoteChar || '"';
            if (m2.newline || (m2.newline = function(e3, t3) {
              e3 = e3.substring(0, 1048576);
              var i4 = new RegExp(j(t3) + "([^]*?)" + j(t3), "gm"), r3 = (e3 = e3.replace(i4, "")).split("\r"), n4 = e3.split("\n"), s4 = 1 < n4.length && n4[0].length < r3[0].length;
              if (1 === r3.length || s4)
                return "\n";
              for (var a3 = 0, o3 = 0; o3 < r3.length; o3++)
                "\n" === r3[o3][0] && a3++;
              return a3 >= r3.length / 2 ? "\r\n" : "\r";
            }(e2, r2)), h2 = false, m2.delimiter)
              M(m2.delimiter) && (m2.delimiter = m2.delimiter(e2), c2.meta.delimiter = m2.delimiter);
            else {
              var n3 = function(e3, t3, i4, r3, n4) {
                var s4, a3, o3, h3;
                n4 = n4 || [",", "	", "|", ";", b.RECORD_SEP, b.UNIT_SEP];
                for (var u3 = 0; u3 < n4.length; u3++) {
                  var f3 = n4[u3], d3 = 0, l3 = 0, c3 = 0;
                  o3 = void 0;
                  for (var p3 = new E({ comments: r3, delimiter: f3, newline: t3, preview: 10 }).parse(e3), g4 = 0; g4 < p3.data.length; g4++)
                    if (i4 && y2(p3.data[g4]))
                      c3++;
                    else {
                      var _3 = p3.data[g4].length;
                      l3 += _3, void 0 !== o3 ? 0 < _3 && (d3 += Math.abs(_3 - o3), o3 = _3) : o3 = _3;
                    }
                  0 < p3.data.length && (l3 /= p3.data.length - c3), (void 0 === a3 || d3 <= a3) && (void 0 === h3 || h3 < l3) && 1.99 < l3 && (a3 = d3, s4 = f3, h3 = l3);
                }
                return { successful: !!(m2.delimiter = s4), bestDelimiter: s4 };
              }(e2, m2.newline, m2.skipEmptyLines, m2.comments, m2.delimitersToGuess);
              n3.successful ? m2.delimiter = n3.bestDelimiter : (h2 = true, m2.delimiter = b.DefaultDelimiter), c2.meta.delimiter = m2.delimiter;
            }
            var s3 = w(m2);
            return m2.preview && m2.header && s3.preview++, a2 = e2, o2 = new E(s3), c2 = o2.parse(a2, t2, i3), g3(), d2 ? { meta: { paused: true } } : c2 || { meta: { paused: false } };
          }, this.paused = function() {
            return d2;
          }, this.pause = function() {
            d2 = true, o2.abort(), a2 = M(m2.chunk) ? "" : a2.substring(o2.getCharIndex());
          }, this.resume = function() {
            t.streamer._halted ? (d2 = false, t.streamer.parseChunk(a2, true)) : setTimeout(t.resume, 3);
          }, this.aborted = function() {
            return e;
          }, this.abort = function() {
            e = true, o2.abort(), c2.meta.aborted = true, M(m2.complete) && m2.complete(c2), a2 = "";
          };
        }
        function j(e) {
          return e.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        }
        function E(e) {
          var S, O = (e = e || {}).delimiter, x = e.newline, I = e.comments, T = e.step, D = e.preview, A = e.fastMode, L = S = void 0 === e.quoteChar || null === e.quoteChar ? '"' : e.quoteChar;
          if (void 0 !== e.escapeChar && (L = e.escapeChar), ("string" != typeof O || -1 < b.BAD_DELIMITERS.indexOf(O)) && (O = ","), I === O)
            throw new Error("Comment character same as delimiter");
          true === I ? I = "#" : ("string" != typeof I || -1 < b.BAD_DELIMITERS.indexOf(I)) && (I = false), "\n" !== x && "\r" !== x && "\r\n" !== x && (x = "\n");
          var F = 0, z = false;
          this.parse = function(r, t, i2) {
            if ("string" != typeof r)
              throw new Error("Input must be a string");
            var n2 = r.length, e2 = O.length, s2 = x.length, a2 = I.length, o2 = M(T), h2 = [], u2 = [], f2 = [], d2 = F = 0;
            if (!r)
              return C();
            if (A || false !== A && -1 === r.indexOf(S)) {
              for (var l2 = r.split(x), c2 = 0; c2 < l2.length; c2++) {
                if (f2 = l2[c2], F += f2.length, c2 !== l2.length - 1)
                  F += x.length;
                else if (i2)
                  return C();
                if (!I || f2.substring(0, a2) !== I) {
                  if (o2) {
                    if (h2 = [], k(f2.split(O)), R(), z)
                      return C();
                  } else
                    k(f2.split(O));
                  if (D && D <= c2)
                    return h2 = h2.slice(0, D), C(true);
                }
              }
              return C();
            }
            for (var p2 = r.indexOf(O, F), g3 = r.indexOf(x, F), _2 = new RegExp(j(L) + j(S), "g"), m2 = r.indexOf(S, F); ; )
              if (r[F] !== S)
                if (I && 0 === f2.length && r.substring(F, F + a2) === I) {
                  if (-1 === g3)
                    return C();
                  F = g3 + s2, g3 = r.indexOf(x, F), p2 = r.indexOf(O, F);
                } else if (-1 !== p2 && (p2 < g3 || -1 === g3))
                  f2.push(r.substring(F, p2)), F = p2 + e2, p2 = r.indexOf(O, F);
                else {
                  if (-1 === g3)
                    break;
                  if (f2.push(r.substring(F, g3)), w2(g3 + s2), o2 && (R(), z))
                    return C();
                  if (D && h2.length >= D)
                    return C(true);
                }
              else
                for (m2 = F, F++; ; ) {
                  if (-1 === (m2 = r.indexOf(S, m2 + 1)))
                    return i2 || u2.push({ type: "Quotes", code: "MissingQuotes", message: "Quoted field unterminated", row: h2.length, index: F }), E2();
                  if (m2 === n2 - 1)
                    return E2(r.substring(F, m2).replace(_2, S));
                  if (S !== L || r[m2 + 1] !== L) {
                    if (S === L || 0 === m2 || r[m2 - 1] !== L) {
                      -1 !== p2 && p2 < m2 + 1 && (p2 = r.indexOf(O, m2 + 1)), -1 !== g3 && g3 < m2 + 1 && (g3 = r.indexOf(x, m2 + 1));
                      var y2 = b2(-1 === g3 ? p2 : Math.min(p2, g3));
                      if (r.substr(m2 + 1 + y2, e2) === O) {
                        f2.push(r.substring(F, m2).replace(_2, S)), r[F = m2 + 1 + y2 + e2] !== S && (m2 = r.indexOf(S, F)), p2 = r.indexOf(O, F), g3 = r.indexOf(x, F);
                        break;
                      }
                      var v2 = b2(g3);
                      if (r.substring(m2 + 1 + v2, m2 + 1 + v2 + s2) === x) {
                        if (f2.push(r.substring(F, m2).replace(_2, S)), w2(m2 + 1 + v2 + s2), p2 = r.indexOf(O, F), m2 = r.indexOf(S, F), o2 && (R(), z))
                          return C();
                        if (D && h2.length >= D)
                          return C(true);
                        break;
                      }
                      u2.push({ type: "Quotes", code: "InvalidQuotes", message: "Trailing quote on quoted field is malformed", row: h2.length, index: F }), m2++;
                    }
                  } else
                    m2++;
                }
            return E2();
            function k(e3) {
              h2.push(e3), d2 = F;
            }
            function b2(e3) {
              var t2 = 0;
              if (-1 !== e3) {
                var i3 = r.substring(m2 + 1, e3);
                i3 && "" === i3.trim() && (t2 = i3.length);
              }
              return t2;
            }
            function E2(e3) {
              return i2 || (void 0 === e3 && (e3 = r.substring(F)), f2.push(e3), F = n2, k(f2), o2 && R()), C();
            }
            function w2(e3) {
              F = e3, k(f2), f2 = [], g3 = r.indexOf(x, F);
            }
            function C(e3) {
              return { data: h2, errors: u2, meta: { delimiter: O, linebreak: x, aborted: z, truncated: !!e3, cursor: d2 + (t || 0) } };
            }
            function R() {
              T(C()), h2 = [], u2 = [];
            }
          }, this.abort = function() {
            z = true;
          }, this.getCharIndex = function() {
            return F;
          };
        }
        function _(e) {
          var t = e.data, i2 = a[t.workerId], r = false;
          if (t.error)
            i2.userError(t.error, t.file);
          else if (t.results && t.results.data) {
            var n2 = { abort: function() {
              r = true, m(t.workerId, { data: [], errors: [], meta: { aborted: true } });
            }, pause: y, resume: y };
            if (M(i2.userStep)) {
              for (var s2 = 0; s2 < t.results.data.length && (i2.userStep({ data: t.results.data[s2], errors: t.results.errors, meta: t.results.meta }, n2), !r); s2++)
                ;
              delete t.results;
            } else
              M(i2.userChunk) && (i2.userChunk(t.results, n2, t.file), delete t.results);
          }
          t.finished && !r && m(t.workerId, t.results);
        }
        function m(e, t) {
          var i2 = a[e];
          M(i2.userComplete) && i2.userComplete(t), i2.terminate(), delete a[e];
        }
        function y() {
          throw new Error("Not implemented.");
        }
        function w(e) {
          if ("object" != typeof e || null === e)
            return e;
          var t = Array.isArray(e) ? [] : {};
          for (var i2 in e)
            t[i2] = w(e[i2]);
          return t;
        }
        function v(e, t) {
          return function() {
            e.apply(t, arguments);
          };
        }
        function M(e) {
          return "function" == typeof e;
        }
        return o && (f.onmessage = function(e) {
          var t = e.data;
          void 0 === b.WORKER_ID && t && (b.WORKER_ID = t.workerId);
          if ("string" == typeof t.input)
            f.postMessage({ workerId: b.WORKER_ID, results: b.parse(t.input, t.config), finished: true });
          else if (f.File && t.input instanceof File || t.input instanceof Object) {
            var i2 = b.parse(t.input, t.config);
            i2 && f.postMessage({ workerId: b.WORKER_ID, results: i2, finished: true });
          }
        }), (l.prototype = Object.create(u.prototype)).constructor = l, (c.prototype = Object.create(u.prototype)).constructor = c, (p.prototype = Object.create(p.prototype)).constructor = p, (g2.prototype = Object.create(u.prototype)).constructor = g2, b;
      });
    }
  });

  // node_modules/chart.js/dist/chart.js
  var require_chart = __commonJS({
    "node_modules/chart.js/dist/chart.js"(exports, module) {
      (function(global2, factory) {
        typeof exports === "object" && typeof module !== "undefined" ? module.exports = factory() : typeof define === "function" && define.amd ? define(factory) : (global2 = typeof globalThis !== "undefined" ? globalThis : global2 || self, global2.Chart = factory());
      })(exports, function() {
        "use strict";
        function noop() {
        }
        const uid = function() {
          let id = 0;
          return function() {
            return id++;
          };
        }();
        function isNullOrUndef(value) {
          return value === null || typeof value === "undefined";
        }
        function isArray(value) {
          if (Array.isArray && Array.isArray(value)) {
            return true;
          }
          const type = Object.prototype.toString.call(value);
          if (type.slice(0, 7) === "[object" && type.slice(-6) === "Array]") {
            return true;
          }
          return false;
        }
        function isObject(value) {
          return value !== null && Object.prototype.toString.call(value) === "[object Object]";
        }
        const isNumberFinite = (value) => (typeof value === "number" || value instanceof Number) && isFinite(+value);
        function finiteOrDefault(value, defaultValue) {
          return isNumberFinite(value) ? value : defaultValue;
        }
        function valueOrDefault(value, defaultValue) {
          return typeof value === "undefined" ? defaultValue : value;
        }
        const toPercentage = (value, dimension) => typeof value === "string" && value.endsWith("%") ? parseFloat(value) / 100 : value / dimension;
        const toDimension = (value, dimension) => typeof value === "string" && value.endsWith("%") ? parseFloat(value) / 100 * dimension : +value;
        function callback(fn, args, thisArg) {
          if (fn && typeof fn.call === "function") {
            return fn.apply(thisArg, args);
          }
        }
        function each(loopable, fn, thisArg, reverse) {
          let i, len, keys;
          if (isArray(loopable)) {
            len = loopable.length;
            if (reverse) {
              for (i = len - 1; i >= 0; i--) {
                fn.call(thisArg, loopable[i], i);
              }
            } else {
              for (i = 0; i < len; i++) {
                fn.call(thisArg, loopable[i], i);
              }
            }
          } else if (isObject(loopable)) {
            keys = Object.keys(loopable);
            len = keys.length;
            for (i = 0; i < len; i++) {
              fn.call(thisArg, loopable[keys[i]], keys[i]);
            }
          }
        }
        function _elementsEqual(a0, a1) {
          let i, ilen, v0, v1;
          if (!a0 || !a1 || a0.length !== a1.length) {
            return false;
          }
          for (i = 0, ilen = a0.length; i < ilen; ++i) {
            v0 = a0[i];
            v1 = a1[i];
            if (v0.datasetIndex !== v1.datasetIndex || v0.index !== v1.index) {
              return false;
            }
          }
          return true;
        }
        function clone$1(source) {
          if (isArray(source)) {
            return source.map(clone$1);
          }
          if (isObject(source)) {
            const target = /* @__PURE__ */ Object.create(null);
            const keys = Object.keys(source);
            const klen = keys.length;
            let k = 0;
            for (; k < klen; ++k) {
              target[keys[k]] = clone$1(source[keys[k]]);
            }
            return target;
          }
          return source;
        }
        function isValidKey(key) {
          return ["__proto__", "prototype", "constructor"].indexOf(key) === -1;
        }
        function _merger(key, target, source, options) {
          if (!isValidKey(key)) {
            return;
          }
          const tval = target[key];
          const sval = source[key];
          if (isObject(tval) && isObject(sval)) {
            merge(tval, sval, options);
          } else {
            target[key] = clone$1(sval);
          }
        }
        function merge(target, source, options) {
          const sources = isArray(source) ? source : [source];
          const ilen = sources.length;
          if (!isObject(target)) {
            return target;
          }
          options = options || {};
          const merger = options.merger || _merger;
          for (let i = 0; i < ilen; ++i) {
            source = sources[i];
            if (!isObject(source)) {
              continue;
            }
            const keys = Object.keys(source);
            for (let k = 0, klen = keys.length; k < klen; ++k) {
              merger(keys[k], target, source, options);
            }
          }
          return target;
        }
        function mergeIf(target, source) {
          return merge(target, source, { merger: _mergerIf });
        }
        function _mergerIf(key, target, source) {
          if (!isValidKey(key)) {
            return;
          }
          const tval = target[key];
          const sval = source[key];
          if (isObject(tval) && isObject(sval)) {
            mergeIf(tval, sval);
          } else if (!Object.prototype.hasOwnProperty.call(target, key)) {
            target[key] = clone$1(sval);
          }
        }
        function _deprecated(scope, value, previous, current) {
          if (value !== void 0) {
            console.warn(scope + ': "' + previous + '" is deprecated. Please use "' + current + '" instead');
          }
        }
        const keyResolvers = {
          "": (v) => v,
          x: (o) => o.x,
          y: (o) => o.y
        };
        function resolveObjectKey(obj, key) {
          const resolver = keyResolvers[key] || (keyResolvers[key] = _getKeyResolver(key));
          return resolver(obj);
        }
        function _getKeyResolver(key) {
          const keys = _splitKey(key);
          return (obj) => {
            for (const k of keys) {
              if (k === "") {
                break;
              }
              obj = obj && obj[k];
            }
            return obj;
          };
        }
        function _splitKey(key) {
          const parts = key.split(".");
          const keys = [];
          let tmp = "";
          for (const part of parts) {
            tmp += part;
            if (tmp.endsWith("\\")) {
              tmp = tmp.slice(0, -1) + ".";
            } else {
              keys.push(tmp);
              tmp = "";
            }
          }
          return keys;
        }
        function _capitalize(str) {
          return str.charAt(0).toUpperCase() + str.slice(1);
        }
        const defined = (value) => typeof value !== "undefined";
        const isFunction = (value) => typeof value === "function";
        const setsEqual = (a, b) => {
          if (a.size !== b.size) {
            return false;
          }
          for (const item of a) {
            if (!b.has(item)) {
              return false;
            }
          }
          return true;
        };
        function _isClickEvent(e) {
          return e.type === "mouseup" || e.type === "click" || e.type === "contextmenu";
        }
        const PI = Math.PI;
        const TAU = 2 * PI;
        const PITAU = TAU + PI;
        const INFINITY = Number.POSITIVE_INFINITY;
        const RAD_PER_DEG = PI / 180;
        const HALF_PI = PI / 2;
        const QUARTER_PI = PI / 4;
        const TWO_THIRDS_PI = PI * 2 / 3;
        const log10 = Math.log10;
        const sign = Math.sign;
        function niceNum(range) {
          const roundedRange = Math.round(range);
          range = almostEquals(range, roundedRange, range / 1e3) ? roundedRange : range;
          const niceRange = Math.pow(10, Math.floor(log10(range)));
          const fraction = range / niceRange;
          const niceFraction = fraction <= 1 ? 1 : fraction <= 2 ? 2 : fraction <= 5 ? 5 : 10;
          return niceFraction * niceRange;
        }
        function _factorize(value) {
          const result = [];
          const sqrt = Math.sqrt(value);
          let i;
          for (i = 1; i < sqrt; i++) {
            if (value % i === 0) {
              result.push(i);
              result.push(value / i);
            }
          }
          if (sqrt === (sqrt | 0)) {
            result.push(sqrt);
          }
          result.sort((a, b) => a - b).pop();
          return result;
        }
        function isNumber(n) {
          return !isNaN(parseFloat(n)) && isFinite(n);
        }
        function almostEquals(x, y, epsilon) {
          return Math.abs(x - y) < epsilon;
        }
        function almostWhole(x, epsilon) {
          const rounded = Math.round(x);
          return rounded - epsilon <= x && rounded + epsilon >= x;
        }
        function _setMinAndMaxByKey(array, target, property) {
          let i, ilen, value;
          for (i = 0, ilen = array.length; i < ilen; i++) {
            value = array[i][property];
            if (!isNaN(value)) {
              target.min = Math.min(target.min, value);
              target.max = Math.max(target.max, value);
            }
          }
        }
        function toRadians(degrees) {
          return degrees * (PI / 180);
        }
        function toDegrees(radians) {
          return radians * (180 / PI);
        }
        function _decimalPlaces(x) {
          if (!isNumberFinite(x)) {
            return;
          }
          let e = 1;
          let p = 0;
          while (Math.round(x * e) / e !== x) {
            e *= 10;
            p++;
          }
          return p;
        }
        function getAngleFromPoint(centrePoint, anglePoint) {
          const distanceFromXCenter = anglePoint.x - centrePoint.x;
          const distanceFromYCenter = anglePoint.y - centrePoint.y;
          const radialDistanceFromCenter = Math.sqrt(distanceFromXCenter * distanceFromXCenter + distanceFromYCenter * distanceFromYCenter);
          let angle = Math.atan2(distanceFromYCenter, distanceFromXCenter);
          if (angle < -0.5 * PI) {
            angle += TAU;
          }
          return {
            angle,
            distance: radialDistanceFromCenter
          };
        }
        function distanceBetweenPoints(pt1, pt2) {
          return Math.sqrt(Math.pow(pt2.x - pt1.x, 2) + Math.pow(pt2.y - pt1.y, 2));
        }
        function _angleDiff(a, b) {
          return (a - b + PITAU) % TAU - PI;
        }
        function _normalizeAngle(a) {
          return (a % TAU + TAU) % TAU;
        }
        function _angleBetween(angle, start, end, sameAngleIsFullCircle) {
          const a = _normalizeAngle(angle);
          const s = _normalizeAngle(start);
          const e = _normalizeAngle(end);
          const angleToStart = _normalizeAngle(s - a);
          const angleToEnd = _normalizeAngle(e - a);
          const startToAngle = _normalizeAngle(a - s);
          const endToAngle = _normalizeAngle(a - e);
          return a === s || a === e || sameAngleIsFullCircle && s === e || angleToStart > angleToEnd && startToAngle < endToAngle;
        }
        function _limitValue(value, min, max) {
          return Math.max(min, Math.min(max, value));
        }
        function _int16Range(value) {
          return _limitValue(value, -32768, 32767);
        }
        function _isBetween(value, start, end, epsilon = 1e-6) {
          return value >= Math.min(start, end) - epsilon && value <= Math.max(start, end) + epsilon;
        }
        function _lookup(table, value, cmp) {
          cmp = cmp || ((index2) => table[index2] < value);
          let hi = table.length - 1;
          let lo = 0;
          let mid;
          while (hi - lo > 1) {
            mid = lo + hi >> 1;
            if (cmp(mid)) {
              lo = mid;
            } else {
              hi = mid;
            }
          }
          return { lo, hi };
        }
        const _lookupByKey = (table, key, value, last) => _lookup(table, value, last ? (index2) => table[index2][key] <= value : (index2) => table[index2][key] < value);
        const _rlookupByKey = (table, key, value) => _lookup(table, value, (index2) => table[index2][key] >= value);
        function _filterBetween(values, min, max) {
          let start = 0;
          let end = values.length;
          while (start < end && values[start] < min) {
            start++;
          }
          while (end > start && values[end - 1] > max) {
            end--;
          }
          return start > 0 || end < values.length ? values.slice(start, end) : values;
        }
        const arrayEvents = ["push", "pop", "shift", "splice", "unshift"];
        function listenArrayEvents(array, listener) {
          if (array._chartjs) {
            array._chartjs.listeners.push(listener);
            return;
          }
          Object.defineProperty(array, "_chartjs", {
            configurable: true,
            enumerable: false,
            value: {
              listeners: [listener]
            }
          });
          arrayEvents.forEach((key) => {
            const method = "_onData" + _capitalize(key);
            const base = array[key];
            Object.defineProperty(array, key, {
              configurable: true,
              enumerable: false,
              value(...args) {
                const res = base.apply(this, args);
                array._chartjs.listeners.forEach((object) => {
                  if (typeof object[method] === "function") {
                    object[method](...args);
                  }
                });
                return res;
              }
            });
          });
        }
        function unlistenArrayEvents(array, listener) {
          const stub = array._chartjs;
          if (!stub) {
            return;
          }
          const listeners = stub.listeners;
          const index2 = listeners.indexOf(listener);
          if (index2 !== -1) {
            listeners.splice(index2, 1);
          }
          if (listeners.length > 0) {
            return;
          }
          arrayEvents.forEach((key) => {
            delete array[key];
          });
          delete array._chartjs;
        }
        function _arrayUnique(items) {
          const set2 = /* @__PURE__ */ new Set();
          let i, ilen;
          for (i = 0, ilen = items.length; i < ilen; ++i) {
            set2.add(items[i]);
          }
          if (set2.size === ilen) {
            return items;
          }
          return Array.from(set2);
        }
        function fontString(pixelSize, fontStyle, fontFamily) {
          return fontStyle + " " + pixelSize + "px " + fontFamily;
        }
        const requestAnimFrame = function() {
          if (typeof window === "undefined") {
            return function(callback2) {
              return callback2();
            };
          }
          return window.requestAnimationFrame;
        }();
        function throttled(fn, thisArg, updateFn) {
          const updateArgs = updateFn || ((args2) => Array.prototype.slice.call(args2));
          let ticking = false;
          let args = [];
          return function(...rest) {
            args = updateArgs(rest);
            if (!ticking) {
              ticking = true;
              requestAnimFrame.call(window, () => {
                ticking = false;
                fn.apply(thisArg, args);
              });
            }
          };
        }
        function debounce(fn, delay) {
          let timeout;
          return function(...args) {
            if (delay) {
              clearTimeout(timeout);
              timeout = setTimeout(fn, delay, args);
            } else {
              fn.apply(this, args);
            }
            return delay;
          };
        }
        const _toLeftRightCenter = (align) => align === "start" ? "left" : align === "end" ? "right" : "center";
        const _alignStartEnd = (align, start, end) => align === "start" ? start : align === "end" ? end : (start + end) / 2;
        const _textX = (align, left, right, rtl) => {
          const check = rtl ? "left" : "right";
          return align === check ? right : align === "center" ? (left + right) / 2 : left;
        };
        function _getStartAndCountOfVisiblePoints(meta, points, animationsDisabled) {
          const pointCount = points.length;
          let start = 0;
          let count = pointCount;
          if (meta._sorted) {
            const { iScale, _parsed } = meta;
            const axis = iScale.axis;
            const { min, max, minDefined, maxDefined } = iScale.getUserBounds();
            if (minDefined) {
              start = _limitValue(
                Math.min(
                  _lookupByKey(_parsed, iScale.axis, min).lo,
                  animationsDisabled ? pointCount : _lookupByKey(points, axis, iScale.getPixelForValue(min)).lo
                ),
                0,
                pointCount - 1
              );
            }
            if (maxDefined) {
              count = _limitValue(
                Math.max(
                  _lookupByKey(_parsed, iScale.axis, max, true).hi + 1,
                  animationsDisabled ? 0 : _lookupByKey(points, axis, iScale.getPixelForValue(max), true).hi + 1
                ),
                start,
                pointCount
              ) - start;
            } else {
              count = pointCount - start;
            }
          }
          return { start, count };
        }
        function _scaleRangesChanged(meta) {
          const { xScale, yScale, _scaleRanges } = meta;
          const newRanges = {
            xmin: xScale.min,
            xmax: xScale.max,
            ymin: yScale.min,
            ymax: yScale.max
          };
          if (!_scaleRanges) {
            meta._scaleRanges = newRanges;
            return true;
          }
          const changed = _scaleRanges.xmin !== xScale.min || _scaleRanges.xmax !== xScale.max || _scaleRanges.ymin !== yScale.min || _scaleRanges.ymax !== yScale.max;
          Object.assign(_scaleRanges, newRanges);
          return changed;
        }
        class Animator {
          constructor() {
            this._request = null;
            this._charts = /* @__PURE__ */ new Map();
            this._running = false;
            this._lastDate = void 0;
          }
          _notify(chart, anims, date, type) {
            const callbacks = anims.listeners[type];
            const numSteps = anims.duration;
            callbacks.forEach((fn) => fn({
              chart,
              initial: anims.initial,
              numSteps,
              currentStep: Math.min(date - anims.start, numSteps)
            }));
          }
          _refresh() {
            if (this._request) {
              return;
            }
            this._running = true;
            this._request = requestAnimFrame.call(window, () => {
              this._update();
              this._request = null;
              if (this._running) {
                this._refresh();
              }
            });
          }
          _update(date = Date.now()) {
            let remaining = 0;
            this._charts.forEach((anims, chart) => {
              if (!anims.running || !anims.items.length) {
                return;
              }
              const items = anims.items;
              let i = items.length - 1;
              let draw2 = false;
              let item;
              for (; i >= 0; --i) {
                item = items[i];
                if (item._active) {
                  if (item._total > anims.duration) {
                    anims.duration = item._total;
                  }
                  item.tick(date);
                  draw2 = true;
                } else {
                  items[i] = items[items.length - 1];
                  items.pop();
                }
              }
              if (draw2) {
                chart.draw();
                this._notify(chart, anims, date, "progress");
              }
              if (!items.length) {
                anims.running = false;
                this._notify(chart, anims, date, "complete");
                anims.initial = false;
              }
              remaining += items.length;
            });
            this._lastDate = date;
            if (remaining === 0) {
              this._running = false;
            }
          }
          _getAnims(chart) {
            const charts = this._charts;
            let anims = charts.get(chart);
            if (!anims) {
              anims = {
                running: false,
                initial: true,
                items: [],
                listeners: {
                  complete: [],
                  progress: []
                }
              };
              charts.set(chart, anims);
            }
            return anims;
          }
          listen(chart, event, cb) {
            this._getAnims(chart).listeners[event].push(cb);
          }
          add(chart, items) {
            if (!items || !items.length) {
              return;
            }
            this._getAnims(chart).items.push(...items);
          }
          has(chart) {
            return this._getAnims(chart).items.length > 0;
          }
          start(chart) {
            const anims = this._charts.get(chart);
            if (!anims) {
              return;
            }
            anims.running = true;
            anims.start = Date.now();
            anims.duration = anims.items.reduce((acc, cur) => Math.max(acc, cur._duration), 0);
            this._refresh();
          }
          running(chart) {
            if (!this._running) {
              return false;
            }
            const anims = this._charts.get(chart);
            if (!anims || !anims.running || !anims.items.length) {
              return false;
            }
            return true;
          }
          stop(chart) {
            const anims = this._charts.get(chart);
            if (!anims || !anims.items.length) {
              return;
            }
            const items = anims.items;
            let i = items.length - 1;
            for (; i >= 0; --i) {
              items[i].cancel();
            }
            anims.items = [];
            this._notify(chart, anims, Date.now(), "complete");
          }
          remove(chart) {
            return this._charts.delete(chart);
          }
        }
        var animator = new Animator();
        function round(v) {
          return v + 0.5 | 0;
        }
        const lim = (v, l, h) => Math.max(Math.min(v, h), l);
        function p2b(v) {
          return lim(round(v * 2.55), 0, 255);
        }
        function n2b(v) {
          return lim(round(v * 255), 0, 255);
        }
        function b2n(v) {
          return lim(round(v / 2.55) / 100, 0, 1);
        }
        function n2p(v) {
          return lim(round(v * 100), 0, 100);
        }
        const map$1 = { 0: 0, 1: 1, 2: 2, 3: 3, 4: 4, 5: 5, 6: 6, 7: 7, 8: 8, 9: 9, A: 10, B: 11, C: 12, D: 13, E: 14, F: 15, a: 10, b: 11, c: 12, d: 13, e: 14, f: 15 };
        const hex = [..."0123456789ABCDEF"];
        const h1 = (b) => hex[b & 15];
        const h2 = (b) => hex[(b & 240) >> 4] + hex[b & 15];
        const eq = (b) => (b & 240) >> 4 === (b & 15);
        const isShort = (v) => eq(v.r) && eq(v.g) && eq(v.b) && eq(v.a);
        function hexParse(str) {
          var len = str.length;
          var ret;
          if (str[0] === "#") {
            if (len === 4 || len === 5) {
              ret = {
                r: 255 & map$1[str[1]] * 17,
                g: 255 & map$1[str[2]] * 17,
                b: 255 & map$1[str[3]] * 17,
                a: len === 5 ? map$1[str[4]] * 17 : 255
              };
            } else if (len === 7 || len === 9) {
              ret = {
                r: map$1[str[1]] << 4 | map$1[str[2]],
                g: map$1[str[3]] << 4 | map$1[str[4]],
                b: map$1[str[5]] << 4 | map$1[str[6]],
                a: len === 9 ? map$1[str[7]] << 4 | map$1[str[8]] : 255
              };
            }
          }
          return ret;
        }
        const alpha = (a, f) => a < 255 ? f(a) : "";
        function hexString(v) {
          var f = isShort(v) ? h1 : h2;
          return v ? "#" + f(v.r) + f(v.g) + f(v.b) + alpha(v.a, f) : void 0;
        }
        const HUE_RE = /^(hsla?|hwb|hsv)\(\s*([-+.e\d]+)(?:deg)?[\s,]+([-+.e\d]+)%[\s,]+([-+.e\d]+)%(?:[\s,]+([-+.e\d]+)(%)?)?\s*\)$/;
        function hsl2rgbn(h, s, l) {
          const a = s * Math.min(l, 1 - l);
          const f = (n, k = (n + h / 30) % 12) => l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
          return [f(0), f(8), f(4)];
        }
        function hsv2rgbn(h, s, v) {
          const f = (n, k = (n + h / 60) % 6) => v - v * s * Math.max(Math.min(k, 4 - k, 1), 0);
          return [f(5), f(3), f(1)];
        }
        function hwb2rgbn(h, w, b) {
          const rgb = hsl2rgbn(h, 1, 0.5);
          let i;
          if (w + b > 1) {
            i = 1 / (w + b);
            w *= i;
            b *= i;
          }
          for (i = 0; i < 3; i++) {
            rgb[i] *= 1 - w - b;
            rgb[i] += w;
          }
          return rgb;
        }
        function hueValue(r, g2, b, d, max) {
          if (r === max) {
            return (g2 - b) / d + (g2 < b ? 6 : 0);
          }
          if (g2 === max) {
            return (b - r) / d + 2;
          }
          return (r - g2) / d + 4;
        }
        function rgb2hsl(v) {
          const range = 255;
          const r = v.r / range;
          const g2 = v.g / range;
          const b = v.b / range;
          const max = Math.max(r, g2, b);
          const min = Math.min(r, g2, b);
          const l = (max + min) / 2;
          let h, s, d;
          if (max !== min) {
            d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            h = hueValue(r, g2, b, d, max);
            h = h * 60 + 0.5;
          }
          return [h | 0, s || 0, l];
        }
        function calln(f, a, b, c) {
          return (Array.isArray(a) ? f(a[0], a[1], a[2]) : f(a, b, c)).map(n2b);
        }
        function hsl2rgb(h, s, l) {
          return calln(hsl2rgbn, h, s, l);
        }
        function hwb2rgb(h, w, b) {
          return calln(hwb2rgbn, h, w, b);
        }
        function hsv2rgb(h, s, v) {
          return calln(hsv2rgbn, h, s, v);
        }
        function hue(h) {
          return (h % 360 + 360) % 360;
        }
        function hueParse(str) {
          const m = HUE_RE.exec(str);
          let a = 255;
          let v;
          if (!m) {
            return;
          }
          if (m[5] !== v) {
            a = m[6] ? p2b(+m[5]) : n2b(+m[5]);
          }
          const h = hue(+m[2]);
          const p1 = +m[3] / 100;
          const p2 = +m[4] / 100;
          if (m[1] === "hwb") {
            v = hwb2rgb(h, p1, p2);
          } else if (m[1] === "hsv") {
            v = hsv2rgb(h, p1, p2);
          } else {
            v = hsl2rgb(h, p1, p2);
          }
          return {
            r: v[0],
            g: v[1],
            b: v[2],
            a
          };
        }
        function rotate(v, deg) {
          var h = rgb2hsl(v);
          h[0] = hue(h[0] + deg);
          h = hsl2rgb(h);
          v.r = h[0];
          v.g = h[1];
          v.b = h[2];
        }
        function hslString(v) {
          if (!v) {
            return;
          }
          const a = rgb2hsl(v);
          const h = a[0];
          const s = n2p(a[1]);
          const l = n2p(a[2]);
          return v.a < 255 ? `hsla(${h}, ${s}%, ${l}%, ${b2n(v.a)})` : `hsl(${h}, ${s}%, ${l}%)`;
        }
        const map$2 = {
          x: "dark",
          Z: "light",
          Y: "re",
          X: "blu",
          W: "gr",
          V: "medium",
          U: "slate",
          A: "ee",
          T: "ol",
          S: "or",
          B: "ra",
          C: "lateg",
          D: "ights",
          R: "in",
          Q: "turquois",
          E: "hi",
          P: "ro",
          O: "al",
          N: "le",
          M: "de",
          L: "yello",
          F: "en",
          K: "ch",
          G: "arks",
          H: "ea",
          I: "ightg",
          J: "wh"
        };
        const names$1 = {
          OiceXe: "f0f8ff",
          antiquewEte: "faebd7",
          aqua: "ffff",
          aquamarRe: "7fffd4",
          azuY: "f0ffff",
          beige: "f5f5dc",
          bisque: "ffe4c4",
          black: "0",
          blanKedOmond: "ffebcd",
          Xe: "ff",
          XeviTet: "8a2be2",
          bPwn: "a52a2a",
          burlywood: "deb887",
          caMtXe: "5f9ea0",
          KartYuse: "7fff00",
          KocTate: "d2691e",
          cSO: "ff7f50",
          cSnflowerXe: "6495ed",
          cSnsilk: "fff8dc",
          crimson: "dc143c",
          cyan: "ffff",
          xXe: "8b",
          xcyan: "8b8b",
          xgTMnPd: "b8860b",
          xWay: "a9a9a9",
          xgYF: "6400",
          xgYy: "a9a9a9",
          xkhaki: "bdb76b",
          xmagFta: "8b008b",
          xTivegYF: "556b2f",
          xSange: "ff8c00",
          xScEd: "9932cc",
          xYd: "8b0000",
          xsOmon: "e9967a",
          xsHgYF: "8fbc8f",
          xUXe: "483d8b",
          xUWay: "2f4f4f",
          xUgYy: "2f4f4f",
          xQe: "ced1",
          xviTet: "9400d3",
          dAppRk: "ff1493",
          dApskyXe: "bfff",
          dimWay: "696969",
          dimgYy: "696969",
          dodgerXe: "1e90ff",
          fiYbrick: "b22222",
          flSOwEte: "fffaf0",
          foYstWAn: "228b22",
          fuKsia: "ff00ff",
          gaRsbSo: "dcdcdc",
          ghostwEte: "f8f8ff",
          gTd: "ffd700",
          gTMnPd: "daa520",
          Way: "808080",
          gYF: "8000",
          gYFLw: "adff2f",
          gYy: "808080",
          honeyMw: "f0fff0",
          hotpRk: "ff69b4",
          RdianYd: "cd5c5c",
          Rdigo: "4b0082",
          ivSy: "fffff0",
          khaki: "f0e68c",
          lavFMr: "e6e6fa",
          lavFMrXsh: "fff0f5",
          lawngYF: "7cfc00",
          NmoncEffon: "fffacd",
          ZXe: "add8e6",
          ZcSO: "f08080",
          Zcyan: "e0ffff",
          ZgTMnPdLw: "fafad2",
          ZWay: "d3d3d3",
          ZgYF: "90ee90",
          ZgYy: "d3d3d3",
          ZpRk: "ffb6c1",
          ZsOmon: "ffa07a",
          ZsHgYF: "20b2aa",
          ZskyXe: "87cefa",
          ZUWay: "778899",
          ZUgYy: "778899",
          ZstAlXe: "b0c4de",
          ZLw: "ffffe0",
          lime: "ff00",
          limegYF: "32cd32",
          lRF: "faf0e6",
          magFta: "ff00ff",
          maPon: "800000",
          VaquamarRe: "66cdaa",
          VXe: "cd",
          VScEd: "ba55d3",
          VpurpN: "9370db",
          VsHgYF: "3cb371",
          VUXe: "7b68ee",
          VsprRggYF: "fa9a",
          VQe: "48d1cc",
          VviTetYd: "c71585",
          midnightXe: "191970",
          mRtcYam: "f5fffa",
          mistyPse: "ffe4e1",
          moccasR: "ffe4b5",
          navajowEte: "ffdead",
          navy: "80",
          Tdlace: "fdf5e6",
          Tive: "808000",
          TivedBb: "6b8e23",
          Sange: "ffa500",
          SangeYd: "ff4500",
          ScEd: "da70d6",
          pOegTMnPd: "eee8aa",
          pOegYF: "98fb98",
          pOeQe: "afeeee",
          pOeviTetYd: "db7093",
          papayawEp: "ffefd5",
          pHKpuff: "ffdab9",
          peru: "cd853f",
          pRk: "ffc0cb",
          plum: "dda0dd",
          powMrXe: "b0e0e6",
          purpN: "800080",
          YbeccapurpN: "663399",
          Yd: "ff0000",
          Psybrown: "bc8f8f",
          PyOXe: "4169e1",
          saddNbPwn: "8b4513",
          sOmon: "fa8072",
          sandybPwn: "f4a460",
          sHgYF: "2e8b57",
          sHshell: "fff5ee",
          siFna: "a0522d",
          silver: "c0c0c0",
          skyXe: "87ceeb",
          UXe: "6a5acd",
          UWay: "708090",
          UgYy: "708090",
          snow: "fffafa",
          sprRggYF: "ff7f",
          stAlXe: "4682b4",
          tan: "d2b48c",
          teO: "8080",
          tEstN: "d8bfd8",
          tomato: "ff6347",
          Qe: "40e0d0",
          viTet: "ee82ee",
          JHt: "f5deb3",
          wEte: "ffffff",
          wEtesmoke: "f5f5f5",
          Lw: "ffff00",
          LwgYF: "9acd32"
        };
        function unpack() {
          const unpacked = {};
          const keys = Object.keys(names$1);
          const tkeys = Object.keys(map$2);
          let i, j, k, ok, nk;
          for (i = 0; i < keys.length; i++) {
            ok = nk = keys[i];
            for (j = 0; j < tkeys.length; j++) {
              k = tkeys[j];
              nk = nk.replace(k, map$2[k]);
            }
            k = parseInt(names$1[ok], 16);
            unpacked[nk] = [k >> 16 & 255, k >> 8 & 255, k & 255];
          }
          return unpacked;
        }
        let names;
        function nameParse(str) {
          if (!names) {
            names = unpack();
            names.transparent = [0, 0, 0, 0];
          }
          const a = names[str.toLowerCase()];
          return a && {
            r: a[0],
            g: a[1],
            b: a[2],
            a: a.length === 4 ? a[3] : 255
          };
        }
        const RGB_RE = /^rgba?\(\s*([-+.\d]+)(%)?[\s,]+([-+.e\d]+)(%)?[\s,]+([-+.e\d]+)(%)?(?:[\s,/]+([-+.e\d]+)(%)?)?\s*\)$/;
        function rgbParse(str) {
          const m = RGB_RE.exec(str);
          let a = 255;
          let r, g2, b;
          if (!m) {
            return;
          }
          if (m[7] !== r) {
            const v = +m[7];
            a = m[8] ? p2b(v) : lim(v * 255, 0, 255);
          }
          r = +m[1];
          g2 = +m[3];
          b = +m[5];
          r = 255 & (m[2] ? p2b(r) : lim(r, 0, 255));
          g2 = 255 & (m[4] ? p2b(g2) : lim(g2, 0, 255));
          b = 255 & (m[6] ? p2b(b) : lim(b, 0, 255));
          return {
            r,
            g: g2,
            b,
            a
          };
        }
        function rgbString(v) {
          return v && (v.a < 255 ? `rgba(${v.r}, ${v.g}, ${v.b}, ${b2n(v.a)})` : `rgb(${v.r}, ${v.g}, ${v.b})`);
        }
        const to = (v) => v <= 31308e-7 ? v * 12.92 : Math.pow(v, 1 / 2.4) * 1.055 - 0.055;
        const from = (v) => v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
        function interpolate$1(rgb1, rgb2, t) {
          const r = from(b2n(rgb1.r));
          const g2 = from(b2n(rgb1.g));
          const b = from(b2n(rgb1.b));
          return {
            r: n2b(to(r + t * (from(b2n(rgb2.r)) - r))),
            g: n2b(to(g2 + t * (from(b2n(rgb2.g)) - g2))),
            b: n2b(to(b + t * (from(b2n(rgb2.b)) - b))),
            a: rgb1.a + t * (rgb2.a - rgb1.a)
          };
        }
        function modHSL(v, i, ratio) {
          if (v) {
            let tmp = rgb2hsl(v);
            tmp[i] = Math.max(0, Math.min(tmp[i] + tmp[i] * ratio, i === 0 ? 360 : 1));
            tmp = hsl2rgb(tmp);
            v.r = tmp[0];
            v.g = tmp[1];
            v.b = tmp[2];
          }
        }
        function clone(v, proto) {
          return v ? Object.assign(proto || {}, v) : v;
        }
        function fromObject(input) {
          var v = { r: 0, g: 0, b: 0, a: 255 };
          if (Array.isArray(input)) {
            if (input.length >= 3) {
              v = { r: input[0], g: input[1], b: input[2], a: 255 };
              if (input.length > 3) {
                v.a = n2b(input[3]);
              }
            }
          } else {
            v = clone(input, { r: 0, g: 0, b: 0, a: 1 });
            v.a = n2b(v.a);
          }
          return v;
        }
        function functionParse(str) {
          if (str.charAt(0) === "r") {
            return rgbParse(str);
          }
          return hueParse(str);
        }
        class Color {
          constructor(input) {
            if (input instanceof Color) {
              return input;
            }
            const type = typeof input;
            let v;
            if (type === "object") {
              v = fromObject(input);
            } else if (type === "string") {
              v = hexParse(input) || nameParse(input) || functionParse(input);
            }
            this._rgb = v;
            this._valid = !!v;
          }
          get valid() {
            return this._valid;
          }
          get rgb() {
            var v = clone(this._rgb);
            if (v) {
              v.a = b2n(v.a);
            }
            return v;
          }
          set rgb(obj) {
            this._rgb = fromObject(obj);
          }
          rgbString() {
            return this._valid ? rgbString(this._rgb) : void 0;
          }
          hexString() {
            return this._valid ? hexString(this._rgb) : void 0;
          }
          hslString() {
            return this._valid ? hslString(this._rgb) : void 0;
          }
          mix(color2, weight) {
            if (color2) {
              const c1 = this.rgb;
              const c2 = color2.rgb;
              let w2;
              const p = weight === w2 ? 0.5 : weight;
              const w = 2 * p - 1;
              const a = c1.a - c2.a;
              const w1 = ((w * a === -1 ? w : (w + a) / (1 + w * a)) + 1) / 2;
              w2 = 1 - w1;
              c1.r = 255 & w1 * c1.r + w2 * c2.r + 0.5;
              c1.g = 255 & w1 * c1.g + w2 * c2.g + 0.5;
              c1.b = 255 & w1 * c1.b + w2 * c2.b + 0.5;
              c1.a = p * c1.a + (1 - p) * c2.a;
              this.rgb = c1;
            }
            return this;
          }
          interpolate(color2, t) {
            if (color2) {
              this._rgb = interpolate$1(this._rgb, color2._rgb, t);
            }
            return this;
          }
          clone() {
            return new Color(this.rgb);
          }
          alpha(a) {
            this._rgb.a = n2b(a);
            return this;
          }
          clearer(ratio) {
            const rgb = this._rgb;
            rgb.a *= 1 - ratio;
            return this;
          }
          greyscale() {
            const rgb = this._rgb;
            const val = round(rgb.r * 0.3 + rgb.g * 0.59 + rgb.b * 0.11);
            rgb.r = rgb.g = rgb.b = val;
            return this;
          }
          opaquer(ratio) {
            const rgb = this._rgb;
            rgb.a *= 1 + ratio;
            return this;
          }
          negate() {
            const v = this._rgb;
            v.r = 255 - v.r;
            v.g = 255 - v.g;
            v.b = 255 - v.b;
            return this;
          }
          lighten(ratio) {
            modHSL(this._rgb, 2, ratio);
            return this;
          }
          darken(ratio) {
            modHSL(this._rgb, 2, -ratio);
            return this;
          }
          saturate(ratio) {
            modHSL(this._rgb, 1, ratio);
            return this;
          }
          desaturate(ratio) {
            modHSL(this._rgb, 1, -ratio);
            return this;
          }
          rotate(deg) {
            rotate(this._rgb, deg);
            return this;
          }
        }
        function index_esm(input) {
          return new Color(input);
        }
        function isPatternOrGradient(value) {
          if (value && typeof value === "object") {
            const type = value.toString();
            return type === "[object CanvasPattern]" || type === "[object CanvasGradient]";
          }
          return false;
        }
        function color(value) {
          return isPatternOrGradient(value) ? value : index_esm(value);
        }
        function getHoverColor(value) {
          return isPatternOrGradient(value) ? value : index_esm(value).saturate(0.5).darken(0.1).hexString();
        }
        const overrides = /* @__PURE__ */ Object.create(null);
        const descriptors = /* @__PURE__ */ Object.create(null);
        function getScope$1(node, key) {
          if (!key) {
            return node;
          }
          const keys = key.split(".");
          for (let i = 0, n = keys.length; i < n; ++i) {
            const k = keys[i];
            node = node[k] || (node[k] = /* @__PURE__ */ Object.create(null));
          }
          return node;
        }
        function set(root, scope, values) {
          if (typeof scope === "string") {
            return merge(getScope$1(root, scope), values);
          }
          return merge(getScope$1(root, ""), scope);
        }
        class Defaults {
          constructor(_descriptors2) {
            this.animation = void 0;
            this.backgroundColor = "rgba(0,0,0,0.1)";
            this.borderColor = "rgba(0,0,0,0.1)";
            this.color = "#666";
            this.datasets = {};
            this.devicePixelRatio = (context) => context.chart.platform.getDevicePixelRatio();
            this.elements = {};
            this.events = [
              "mousemove",
              "mouseout",
              "click",
              "touchstart",
              "touchmove"
            ];
            this.font = {
              family: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",
              size: 12,
              style: "normal",
              lineHeight: 1.2,
              weight: null
            };
            this.hover = {};
            this.hoverBackgroundColor = (ctx, options) => getHoverColor(options.backgroundColor);
            this.hoverBorderColor = (ctx, options) => getHoverColor(options.borderColor);
            this.hoverColor = (ctx, options) => getHoverColor(options.color);
            this.indexAxis = "x";
            this.interaction = {
              mode: "nearest",
              intersect: true,
              includeInvisible: false
            };
            this.maintainAspectRatio = true;
            this.onHover = null;
            this.onClick = null;
            this.parsing = true;
            this.plugins = {};
            this.responsive = true;
            this.scale = void 0;
            this.scales = {};
            this.showLine = true;
            this.drawActiveElementsOnTop = true;
            this.describe(_descriptors2);
          }
          set(scope, values) {
            return set(this, scope, values);
          }
          get(scope) {
            return getScope$1(this, scope);
          }
          describe(scope, values) {
            return set(descriptors, scope, values);
          }
          override(scope, values) {
            return set(overrides, scope, values);
          }
          route(scope, name, targetScope, targetName) {
            const scopeObject = getScope$1(this, scope);
            const targetScopeObject = getScope$1(this, targetScope);
            const privateName = "_" + name;
            Object.defineProperties(scopeObject, {
              [privateName]: {
                value: scopeObject[name],
                writable: true
              },
              [name]: {
                enumerable: true,
                get() {
                  const local = this[privateName];
                  const target = targetScopeObject[targetName];
                  if (isObject(local)) {
                    return Object.assign({}, target, local);
                  }
                  return valueOrDefault(local, target);
                },
                set(value) {
                  this[privateName] = value;
                }
              }
            });
          }
        }
        var defaults = new Defaults({
          _scriptable: (name) => !name.startsWith("on"),
          _indexable: (name) => name !== "events",
          hover: {
            _fallback: "interaction"
          },
          interaction: {
            _scriptable: false,
            _indexable: false
          }
        });
        function _isDomSupported() {
          return typeof window !== "undefined" && typeof document !== "undefined";
        }
        function _getParentNode(domNode) {
          let parent = domNode.parentNode;
          if (parent && parent.toString() === "[object ShadowRoot]") {
            parent = parent.host;
          }
          return parent;
        }
        function parseMaxStyle(styleValue, node, parentProperty) {
          let valueInPixels;
          if (typeof styleValue === "string") {
            valueInPixels = parseInt(styleValue, 10);
            if (styleValue.indexOf("%") !== -1) {
              valueInPixels = valueInPixels / 100 * node.parentNode[parentProperty];
            }
          } else {
            valueInPixels = styleValue;
          }
          return valueInPixels;
        }
        const getComputedStyle = (element) => window.getComputedStyle(element, null);
        function getStyle(el, property) {
          return getComputedStyle(el).getPropertyValue(property);
        }
        const positions = ["top", "right", "bottom", "left"];
        function getPositionedStyle(styles, style, suffix) {
          const result = {};
          suffix = suffix ? "-" + suffix : "";
          for (let i = 0; i < 4; i++) {
            const pos = positions[i];
            result[pos] = parseFloat(styles[style + "-" + pos + suffix]) || 0;
          }
          result.width = result.left + result.right;
          result.height = result.top + result.bottom;
          return result;
        }
        const useOffsetPos = (x, y, target) => (x > 0 || y > 0) && (!target || !target.shadowRoot);
        function getCanvasPosition(e, canvas) {
          const touches = e.touches;
          const source = touches && touches.length ? touches[0] : e;
          const { offsetX, offsetY } = source;
          let box = false;
          let x, y;
          if (useOffsetPos(offsetX, offsetY, e.target)) {
            x = offsetX;
            y = offsetY;
          } else {
            const rect = canvas.getBoundingClientRect();
            x = source.clientX - rect.left;
            y = source.clientY - rect.top;
            box = true;
          }
          return { x, y, box };
        }
        function getRelativePosition(evt, chart) {
          if ("native" in evt) {
            return evt;
          }
          const { canvas, currentDevicePixelRatio } = chart;
          const style = getComputedStyle(canvas);
          const borderBox = style.boxSizing === "border-box";
          const paddings = getPositionedStyle(style, "padding");
          const borders = getPositionedStyle(style, "border", "width");
          const { x, y, box } = getCanvasPosition(evt, canvas);
          const xOffset = paddings.left + (box && borders.left);
          const yOffset = paddings.top + (box && borders.top);
          let { width, height } = chart;
          if (borderBox) {
            width -= paddings.width + borders.width;
            height -= paddings.height + borders.height;
          }
          return {
            x: Math.round((x - xOffset) / width * canvas.width / currentDevicePixelRatio),
            y: Math.round((y - yOffset) / height * canvas.height / currentDevicePixelRatio)
          };
        }
        function getContainerSize(canvas, width, height) {
          let maxWidth, maxHeight;
          if (width === void 0 || height === void 0) {
            const container = _getParentNode(canvas);
            if (!container) {
              width = canvas.clientWidth;
              height = canvas.clientHeight;
            } else {
              const rect = container.getBoundingClientRect();
              const containerStyle = getComputedStyle(container);
              const containerBorder = getPositionedStyle(containerStyle, "border", "width");
              const containerPadding = getPositionedStyle(containerStyle, "padding");
              width = rect.width - containerPadding.width - containerBorder.width;
              height = rect.height - containerPadding.height - containerBorder.height;
              maxWidth = parseMaxStyle(containerStyle.maxWidth, container, "clientWidth");
              maxHeight = parseMaxStyle(containerStyle.maxHeight, container, "clientHeight");
            }
          }
          return {
            width,
            height,
            maxWidth: maxWidth || INFINITY,
            maxHeight: maxHeight || INFINITY
          };
        }
        const round1 = (v) => Math.round(v * 10) / 10;
        function getMaximumSize(canvas, bbWidth, bbHeight, aspectRatio) {
          const style = getComputedStyle(canvas);
          const margins = getPositionedStyle(style, "margin");
          const maxWidth = parseMaxStyle(style.maxWidth, canvas, "clientWidth") || INFINITY;
          const maxHeight = parseMaxStyle(style.maxHeight, canvas, "clientHeight") || INFINITY;
          const containerSize = getContainerSize(canvas, bbWidth, bbHeight);
          let { width, height } = containerSize;
          if (style.boxSizing === "content-box") {
            const borders = getPositionedStyle(style, "border", "width");
            const paddings = getPositionedStyle(style, "padding");
            width -= paddings.width + borders.width;
            height -= paddings.height + borders.height;
          }
          width = Math.max(0, width - margins.width);
          height = Math.max(0, aspectRatio ? Math.floor(width / aspectRatio) : height - margins.height);
          width = round1(Math.min(width, maxWidth, containerSize.maxWidth));
          height = round1(Math.min(height, maxHeight, containerSize.maxHeight));
          if (width && !height) {
            height = round1(width / 2);
          }
          return {
            width,
            height
          };
        }
        function retinaScale(chart, forceRatio, forceStyle) {
          const pixelRatio = forceRatio || 1;
          const deviceHeight = Math.floor(chart.height * pixelRatio);
          const deviceWidth = Math.floor(chart.width * pixelRatio);
          chart.height = deviceHeight / pixelRatio;
          chart.width = deviceWidth / pixelRatio;
          const canvas = chart.canvas;
          if (canvas.style && (forceStyle || !canvas.style.height && !canvas.style.width)) {
            canvas.style.height = `${chart.height}px`;
            canvas.style.width = `${chart.width}px`;
          }
          if (chart.currentDevicePixelRatio !== pixelRatio || canvas.height !== deviceHeight || canvas.width !== deviceWidth) {
            chart.currentDevicePixelRatio = pixelRatio;
            canvas.height = deviceHeight;
            canvas.width = deviceWidth;
            chart.ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
            return true;
          }
          return false;
        }
        const supportsEventListenerOptions = function() {
          let passiveSupported = false;
          try {
            const options = {
              get passive() {
                passiveSupported = true;
                return false;
              }
            };
            window.addEventListener("test", null, options);
            window.removeEventListener("test", null, options);
          } catch (e) {
          }
          return passiveSupported;
        }();
        function readUsedSize(element, property) {
          const value = getStyle(element, property);
          const matches = value && value.match(/^(\d+)(\.\d+)?px$/);
          return matches ? +matches[1] : void 0;
        }
        function toFontString(font) {
          if (!font || isNullOrUndef(font.size) || isNullOrUndef(font.family)) {
            return null;
          }
          return (font.style ? font.style + " " : "") + (font.weight ? font.weight + " " : "") + font.size + "px " + font.family;
        }
        function _measureText(ctx, data, gc, longest, string) {
          let textWidth = data[string];
          if (!textWidth) {
            textWidth = data[string] = ctx.measureText(string).width;
            gc.push(string);
          }
          if (textWidth > longest) {
            longest = textWidth;
          }
          return longest;
        }
        function _longestText(ctx, font, arrayOfThings, cache) {
          cache = cache || {};
          let data = cache.data = cache.data || {};
          let gc = cache.garbageCollect = cache.garbageCollect || [];
          if (cache.font !== font) {
            data = cache.data = {};
            gc = cache.garbageCollect = [];
            cache.font = font;
          }
          ctx.save();
          ctx.font = font;
          let longest = 0;
          const ilen = arrayOfThings.length;
          let i, j, jlen, thing, nestedThing;
          for (i = 0; i < ilen; i++) {
            thing = arrayOfThings[i];
            if (thing !== void 0 && thing !== null && isArray(thing) !== true) {
              longest = _measureText(ctx, data, gc, longest, thing);
            } else if (isArray(thing)) {
              for (j = 0, jlen = thing.length; j < jlen; j++) {
                nestedThing = thing[j];
                if (nestedThing !== void 0 && nestedThing !== null && !isArray(nestedThing)) {
                  longest = _measureText(ctx, data, gc, longest, nestedThing);
                }
              }
            }
          }
          ctx.restore();
          const gcLen = gc.length / 2;
          if (gcLen > arrayOfThings.length) {
            for (i = 0; i < gcLen; i++) {
              delete data[gc[i]];
            }
            gc.splice(0, gcLen);
          }
          return longest;
        }
        function _alignPixel(chart, pixel, width) {
          const devicePixelRatio2 = chart.currentDevicePixelRatio;
          const halfWidth = width !== 0 ? Math.max(width / 2, 0.5) : 0;
          return Math.round((pixel - halfWidth) * devicePixelRatio2) / devicePixelRatio2 + halfWidth;
        }
        function clearCanvas(canvas, ctx) {
          ctx = ctx || canvas.getContext("2d");
          ctx.save();
          ctx.resetTransform();
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.restore();
        }
        function drawPoint(ctx, options, x, y) {
          drawPointLegend(ctx, options, x, y, null);
        }
        function drawPointLegend(ctx, options, x, y, w) {
          let type, xOffset, yOffset, size, cornerRadius, width;
          const style = options.pointStyle;
          const rotation = options.rotation;
          const radius = options.radius;
          let rad = (rotation || 0) * RAD_PER_DEG;
          if (style && typeof style === "object") {
            type = style.toString();
            if (type === "[object HTMLImageElement]" || type === "[object HTMLCanvasElement]") {
              ctx.save();
              ctx.translate(x, y);
              ctx.rotate(rad);
              ctx.drawImage(style, -style.width / 2, -style.height / 2, style.width, style.height);
              ctx.restore();
              return;
            }
          }
          if (isNaN(radius) || radius <= 0) {
            return;
          }
          ctx.beginPath();
          switch (style) {
            default:
              if (w) {
                ctx.ellipse(x, y, w / 2, radius, 0, 0, TAU);
              } else {
                ctx.arc(x, y, radius, 0, TAU);
              }
              ctx.closePath();
              break;
            case "triangle":
              ctx.moveTo(x + Math.sin(rad) * radius, y - Math.cos(rad) * radius);
              rad += TWO_THIRDS_PI;
              ctx.lineTo(x + Math.sin(rad) * radius, y - Math.cos(rad) * radius);
              rad += TWO_THIRDS_PI;
              ctx.lineTo(x + Math.sin(rad) * radius, y - Math.cos(rad) * radius);
              ctx.closePath();
              break;
            case "rectRounded":
              cornerRadius = radius * 0.516;
              size = radius - cornerRadius;
              xOffset = Math.cos(rad + QUARTER_PI) * size;
              yOffset = Math.sin(rad + QUARTER_PI) * size;
              ctx.arc(x - xOffset, y - yOffset, cornerRadius, rad - PI, rad - HALF_PI);
              ctx.arc(x + yOffset, y - xOffset, cornerRadius, rad - HALF_PI, rad);
              ctx.arc(x + xOffset, y + yOffset, cornerRadius, rad, rad + HALF_PI);
              ctx.arc(x - yOffset, y + xOffset, cornerRadius, rad + HALF_PI, rad + PI);
              ctx.closePath();
              break;
            case "rect":
              if (!rotation) {
                size = Math.SQRT1_2 * radius;
                width = w ? w / 2 : size;
                ctx.rect(x - width, y - size, 2 * width, 2 * size);
                break;
              }
              rad += QUARTER_PI;
            case "rectRot":
              xOffset = Math.cos(rad) * radius;
              yOffset = Math.sin(rad) * radius;
              ctx.moveTo(x - xOffset, y - yOffset);
              ctx.lineTo(x + yOffset, y - xOffset);
              ctx.lineTo(x + xOffset, y + yOffset);
              ctx.lineTo(x - yOffset, y + xOffset);
              ctx.closePath();
              break;
            case "crossRot":
              rad += QUARTER_PI;
            case "cross":
              xOffset = Math.cos(rad) * radius;
              yOffset = Math.sin(rad) * radius;
              ctx.moveTo(x - xOffset, y - yOffset);
              ctx.lineTo(x + xOffset, y + yOffset);
              ctx.moveTo(x + yOffset, y - xOffset);
              ctx.lineTo(x - yOffset, y + xOffset);
              break;
            case "star":
              xOffset = Math.cos(rad) * radius;
              yOffset = Math.sin(rad) * radius;
              ctx.moveTo(x - xOffset, y - yOffset);
              ctx.lineTo(x + xOffset, y + yOffset);
              ctx.moveTo(x + yOffset, y - xOffset);
              ctx.lineTo(x - yOffset, y + xOffset);
              rad += QUARTER_PI;
              xOffset = Math.cos(rad) * radius;
              yOffset = Math.sin(rad) * radius;
              ctx.moveTo(x - xOffset, y - yOffset);
              ctx.lineTo(x + xOffset, y + yOffset);
              ctx.moveTo(x + yOffset, y - xOffset);
              ctx.lineTo(x - yOffset, y + xOffset);
              break;
            case "line":
              xOffset = w ? w / 2 : Math.cos(rad) * radius;
              yOffset = Math.sin(rad) * radius;
              ctx.moveTo(x - xOffset, y - yOffset);
              ctx.lineTo(x + xOffset, y + yOffset);
              break;
            case "dash":
              ctx.moveTo(x, y);
              ctx.lineTo(x + Math.cos(rad) * radius, y + Math.sin(rad) * radius);
              break;
          }
          ctx.fill();
          if (options.borderWidth > 0) {
            ctx.stroke();
          }
        }
        function _isPointInArea(point, area, margin) {
          margin = margin || 0.5;
          return !area || point && point.x > area.left - margin && point.x < area.right + margin && point.y > area.top - margin && point.y < area.bottom + margin;
        }
        function clipArea(ctx, area) {
          ctx.save();
          ctx.beginPath();
          ctx.rect(area.left, area.top, area.right - area.left, area.bottom - area.top);
          ctx.clip();
        }
        function unclipArea(ctx) {
          ctx.restore();
        }
        function _steppedLineTo(ctx, previous, target, flip, mode) {
          if (!previous) {
            return ctx.lineTo(target.x, target.y);
          }
          if (mode === "middle") {
            const midpoint = (previous.x + target.x) / 2;
            ctx.lineTo(midpoint, previous.y);
            ctx.lineTo(midpoint, target.y);
          } else if (mode === "after" !== !!flip) {
            ctx.lineTo(previous.x, target.y);
          } else {
            ctx.lineTo(target.x, previous.y);
          }
          ctx.lineTo(target.x, target.y);
        }
        function _bezierCurveTo(ctx, previous, target, flip) {
          if (!previous) {
            return ctx.lineTo(target.x, target.y);
          }
          ctx.bezierCurveTo(
            flip ? previous.cp1x : previous.cp2x,
            flip ? previous.cp1y : previous.cp2y,
            flip ? target.cp2x : target.cp1x,
            flip ? target.cp2y : target.cp1y,
            target.x,
            target.y
          );
        }
        function renderText(ctx, text, x, y, font, opts = {}) {
          const lines = isArray(text) ? text : [text];
          const stroke = opts.strokeWidth > 0 && opts.strokeColor !== "";
          let i, line;
          ctx.save();
          ctx.font = font.string;
          setRenderOpts(ctx, opts);
          for (i = 0; i < lines.length; ++i) {
            line = lines[i];
            if (stroke) {
              if (opts.strokeColor) {
                ctx.strokeStyle = opts.strokeColor;
              }
              if (!isNullOrUndef(opts.strokeWidth)) {
                ctx.lineWidth = opts.strokeWidth;
              }
              ctx.strokeText(line, x, y, opts.maxWidth);
            }
            ctx.fillText(line, x, y, opts.maxWidth);
            decorateText(ctx, x, y, line, opts);
            y += font.lineHeight;
          }
          ctx.restore();
        }
        function setRenderOpts(ctx, opts) {
          if (opts.translation) {
            ctx.translate(opts.translation[0], opts.translation[1]);
          }
          if (!isNullOrUndef(opts.rotation)) {
            ctx.rotate(opts.rotation);
          }
          if (opts.color) {
            ctx.fillStyle = opts.color;
          }
          if (opts.textAlign) {
            ctx.textAlign = opts.textAlign;
          }
          if (opts.textBaseline) {
            ctx.textBaseline = opts.textBaseline;
          }
        }
        function decorateText(ctx, x, y, line, opts) {
          if (opts.strikethrough || opts.underline) {
            const metrics = ctx.measureText(line);
            const left = x - metrics.actualBoundingBoxLeft;
            const right = x + metrics.actualBoundingBoxRight;
            const top = y - metrics.actualBoundingBoxAscent;
            const bottom = y + metrics.actualBoundingBoxDescent;
            const yDecoration = opts.strikethrough ? (top + bottom) / 2 : bottom;
            ctx.strokeStyle = ctx.fillStyle;
            ctx.beginPath();
            ctx.lineWidth = opts.decorationWidth || 2;
            ctx.moveTo(left, yDecoration);
            ctx.lineTo(right, yDecoration);
            ctx.stroke();
          }
        }
        function addRoundedRectPath(ctx, rect) {
          const { x, y, w, h, radius } = rect;
          ctx.arc(x + radius.topLeft, y + radius.topLeft, radius.topLeft, -HALF_PI, PI, true);
          ctx.lineTo(x, y + h - radius.bottomLeft);
          ctx.arc(x + radius.bottomLeft, y + h - radius.bottomLeft, radius.bottomLeft, PI, HALF_PI, true);
          ctx.lineTo(x + w - radius.bottomRight, y + h);
          ctx.arc(x + w - radius.bottomRight, y + h - radius.bottomRight, radius.bottomRight, HALF_PI, 0, true);
          ctx.lineTo(x + w, y + radius.topRight);
          ctx.arc(x + w - radius.topRight, y + radius.topRight, radius.topRight, 0, -HALF_PI, true);
          ctx.lineTo(x + radius.topLeft, y);
        }
        function _createResolver(scopes, prefixes = [""], rootScopes = scopes, fallback, getTarget = () => scopes[0]) {
          if (!defined(fallback)) {
            fallback = _resolve("_fallback", scopes);
          }
          const cache = {
            [Symbol.toStringTag]: "Object",
            _cacheable: true,
            _scopes: scopes,
            _rootScopes: rootScopes,
            _fallback: fallback,
            _getTarget: getTarget,
            override: (scope) => _createResolver([scope, ...scopes], prefixes, rootScopes, fallback)
          };
          return new Proxy(cache, {
            deleteProperty(target, prop) {
              delete target[prop];
              delete target._keys;
              delete scopes[0][prop];
              return true;
            },
            get(target, prop) {
              return _cached(
                target,
                prop,
                () => _resolveWithPrefixes(prop, prefixes, scopes, target)
              );
            },
            getOwnPropertyDescriptor(target, prop) {
              return Reflect.getOwnPropertyDescriptor(target._scopes[0], prop);
            },
            getPrototypeOf() {
              return Reflect.getPrototypeOf(scopes[0]);
            },
            has(target, prop) {
              return getKeysFromAllScopes(target).includes(prop);
            },
            ownKeys(target) {
              return getKeysFromAllScopes(target);
            },
            set(target, prop, value) {
              const storage = target._storage || (target._storage = getTarget());
              target[prop] = storage[prop] = value;
              delete target._keys;
              return true;
            }
          });
        }
        function _attachContext(proxy, context, subProxy, descriptorDefaults) {
          const cache = {
            _cacheable: false,
            _proxy: proxy,
            _context: context,
            _subProxy: subProxy,
            _stack: /* @__PURE__ */ new Set(),
            _descriptors: _descriptors(proxy, descriptorDefaults),
            setContext: (ctx) => _attachContext(proxy, ctx, subProxy, descriptorDefaults),
            override: (scope) => _attachContext(proxy.override(scope), context, subProxy, descriptorDefaults)
          };
          return new Proxy(cache, {
            deleteProperty(target, prop) {
              delete target[prop];
              delete proxy[prop];
              return true;
            },
            get(target, prop, receiver) {
              return _cached(
                target,
                prop,
                () => _resolveWithContext(target, prop, receiver)
              );
            },
            getOwnPropertyDescriptor(target, prop) {
              return target._descriptors.allKeys ? Reflect.has(proxy, prop) ? { enumerable: true, configurable: true } : void 0 : Reflect.getOwnPropertyDescriptor(proxy, prop);
            },
            getPrototypeOf() {
              return Reflect.getPrototypeOf(proxy);
            },
            has(target, prop) {
              return Reflect.has(proxy, prop);
            },
            ownKeys() {
              return Reflect.ownKeys(proxy);
            },
            set(target, prop, value) {
              proxy[prop] = value;
              delete target[prop];
              return true;
            }
          });
        }
        function _descriptors(proxy, defaults2 = { scriptable: true, indexable: true }) {
          const { _scriptable = defaults2.scriptable, _indexable = defaults2.indexable, _allKeys = defaults2.allKeys } = proxy;
          return {
            allKeys: _allKeys,
            scriptable: _scriptable,
            indexable: _indexable,
            isScriptable: isFunction(_scriptable) ? _scriptable : () => _scriptable,
            isIndexable: isFunction(_indexable) ? _indexable : () => _indexable
          };
        }
        const readKey = (prefix, name) => prefix ? prefix + _capitalize(name) : name;
        const needsSubResolver = (prop, value) => isObject(value) && prop !== "adapters" && (Object.getPrototypeOf(value) === null || value.constructor === Object);
        function _cached(target, prop, resolve2) {
          if (Object.prototype.hasOwnProperty.call(target, prop)) {
            return target[prop];
          }
          const value = resolve2();
          target[prop] = value;
          return value;
        }
        function _resolveWithContext(target, prop, receiver) {
          const { _proxy, _context, _subProxy, _descriptors: descriptors2 } = target;
          let value = _proxy[prop];
          if (isFunction(value) && descriptors2.isScriptable(prop)) {
            value = _resolveScriptable(prop, value, target, receiver);
          }
          if (isArray(value) && value.length) {
            value = _resolveArray(prop, value, target, descriptors2.isIndexable);
          }
          if (needsSubResolver(prop, value)) {
            value = _attachContext(value, _context, _subProxy && _subProxy[prop], descriptors2);
          }
          return value;
        }
        function _resolveScriptable(prop, value, target, receiver) {
          const { _proxy, _context, _subProxy, _stack } = target;
          if (_stack.has(prop)) {
            throw new Error("Recursion detected: " + Array.from(_stack).join("->") + "->" + prop);
          }
          _stack.add(prop);
          value = value(_context, _subProxy || receiver);
          _stack.delete(prop);
          if (needsSubResolver(prop, value)) {
            value = createSubResolver(_proxy._scopes, _proxy, prop, value);
          }
          return value;
        }
        function _resolveArray(prop, value, target, isIndexable) {
          const { _proxy, _context, _subProxy, _descriptors: descriptors2 } = target;
          if (defined(_context.index) && isIndexable(prop)) {
            value = value[_context.index % value.length];
          } else if (isObject(value[0])) {
            const arr = value;
            const scopes = _proxy._scopes.filter((s) => s !== arr);
            value = [];
            for (const item of arr) {
              const resolver = createSubResolver(scopes, _proxy, prop, item);
              value.push(_attachContext(resolver, _context, _subProxy && _subProxy[prop], descriptors2));
            }
          }
          return value;
        }
        function resolveFallback(fallback, prop, value) {
          return isFunction(fallback) ? fallback(prop, value) : fallback;
        }
        const getScope = (key, parent) => key === true ? parent : typeof key === "string" ? resolveObjectKey(parent, key) : void 0;
        function addScopes(set2, parentScopes, key, parentFallback, value) {
          for (const parent of parentScopes) {
            const scope = getScope(key, parent);
            if (scope) {
              set2.add(scope);
              const fallback = resolveFallback(scope._fallback, key, value);
              if (defined(fallback) && fallback !== key && fallback !== parentFallback) {
                return fallback;
              }
            } else if (scope === false && defined(parentFallback) && key !== parentFallback) {
              return null;
            }
          }
          return false;
        }
        function createSubResolver(parentScopes, resolver, prop, value) {
          const rootScopes = resolver._rootScopes;
          const fallback = resolveFallback(resolver._fallback, prop, value);
          const allScopes = [...parentScopes, ...rootScopes];
          const set2 = /* @__PURE__ */ new Set();
          set2.add(value);
          let key = addScopesFromKey(set2, allScopes, prop, fallback || prop, value);
          if (key === null) {
            return false;
          }
          if (defined(fallback) && fallback !== prop) {
            key = addScopesFromKey(set2, allScopes, fallback, key, value);
            if (key === null) {
              return false;
            }
          }
          return _createResolver(
            Array.from(set2),
            [""],
            rootScopes,
            fallback,
            () => subGetTarget(resolver, prop, value)
          );
        }
        function addScopesFromKey(set2, allScopes, key, fallback, item) {
          while (key) {
            key = addScopes(set2, allScopes, key, fallback, item);
          }
          return key;
        }
        function subGetTarget(resolver, prop, value) {
          const parent = resolver._getTarget();
          if (!(prop in parent)) {
            parent[prop] = {};
          }
          const target = parent[prop];
          if (isArray(target) && isObject(value)) {
            return value;
          }
          return target;
        }
        function _resolveWithPrefixes(prop, prefixes, scopes, proxy) {
          let value;
          for (const prefix of prefixes) {
            value = _resolve(readKey(prefix, prop), scopes);
            if (defined(value)) {
              return needsSubResolver(prop, value) ? createSubResolver(scopes, proxy, prop, value) : value;
            }
          }
        }
        function _resolve(key, scopes) {
          for (const scope of scopes) {
            if (!scope) {
              continue;
            }
            const value = scope[key];
            if (defined(value)) {
              return value;
            }
          }
        }
        function getKeysFromAllScopes(target) {
          let keys = target._keys;
          if (!keys) {
            keys = target._keys = resolveKeysFromAllScopes(target._scopes);
          }
          return keys;
        }
        function resolveKeysFromAllScopes(scopes) {
          const set2 = /* @__PURE__ */ new Set();
          for (const scope of scopes) {
            for (const key of Object.keys(scope).filter((k) => !k.startsWith("_"))) {
              set2.add(key);
            }
          }
          return Array.from(set2);
        }
        function _parseObjectDataRadialScale(meta, data, start, count) {
          const { iScale } = meta;
          const { key = "r" } = this._parsing;
          const parsed = new Array(count);
          let i, ilen, index2, item;
          for (i = 0, ilen = count; i < ilen; ++i) {
            index2 = i + start;
            item = data[index2];
            parsed[i] = {
              r: iScale.parse(resolveObjectKey(item, key), index2)
            };
          }
          return parsed;
        }
        const EPSILON = Number.EPSILON || 1e-14;
        const getPoint = (points, i) => i < points.length && !points[i].skip && points[i];
        const getValueAxis = (indexAxis) => indexAxis === "x" ? "y" : "x";
        function splineCurve(firstPoint, middlePoint, afterPoint, t) {
          const previous = firstPoint.skip ? middlePoint : firstPoint;
          const current = middlePoint;
          const next = afterPoint.skip ? middlePoint : afterPoint;
          const d01 = distanceBetweenPoints(current, previous);
          const d12 = distanceBetweenPoints(next, current);
          let s01 = d01 / (d01 + d12);
          let s12 = d12 / (d01 + d12);
          s01 = isNaN(s01) ? 0 : s01;
          s12 = isNaN(s12) ? 0 : s12;
          const fa = t * s01;
          const fb = t * s12;
          return {
            previous: {
              x: current.x - fa * (next.x - previous.x),
              y: current.y - fa * (next.y - previous.y)
            },
            next: {
              x: current.x + fb * (next.x - previous.x),
              y: current.y + fb * (next.y - previous.y)
            }
          };
        }
        function monotoneAdjust(points, deltaK, mK) {
          const pointsLen = points.length;
          let alphaK, betaK, tauK, squaredMagnitude, pointCurrent;
          let pointAfter = getPoint(points, 0);
          for (let i = 0; i < pointsLen - 1; ++i) {
            pointCurrent = pointAfter;
            pointAfter = getPoint(points, i + 1);
            if (!pointCurrent || !pointAfter) {
              continue;
            }
            if (almostEquals(deltaK[i], 0, EPSILON)) {
              mK[i] = mK[i + 1] = 0;
              continue;
            }
            alphaK = mK[i] / deltaK[i];
            betaK = mK[i + 1] / deltaK[i];
            squaredMagnitude = Math.pow(alphaK, 2) + Math.pow(betaK, 2);
            if (squaredMagnitude <= 9) {
              continue;
            }
            tauK = 3 / Math.sqrt(squaredMagnitude);
            mK[i] = alphaK * tauK * deltaK[i];
            mK[i + 1] = betaK * tauK * deltaK[i];
          }
        }
        function monotoneCompute(points, mK, indexAxis = "x") {
          const valueAxis = getValueAxis(indexAxis);
          const pointsLen = points.length;
          let delta, pointBefore, pointCurrent;
          let pointAfter = getPoint(points, 0);
          for (let i = 0; i < pointsLen; ++i) {
            pointBefore = pointCurrent;
            pointCurrent = pointAfter;
            pointAfter = getPoint(points, i + 1);
            if (!pointCurrent) {
              continue;
            }
            const iPixel = pointCurrent[indexAxis];
            const vPixel = pointCurrent[valueAxis];
            if (pointBefore) {
              delta = (iPixel - pointBefore[indexAxis]) / 3;
              pointCurrent[`cp1${indexAxis}`] = iPixel - delta;
              pointCurrent[`cp1${valueAxis}`] = vPixel - delta * mK[i];
            }
            if (pointAfter) {
              delta = (pointAfter[indexAxis] - iPixel) / 3;
              pointCurrent[`cp2${indexAxis}`] = iPixel + delta;
              pointCurrent[`cp2${valueAxis}`] = vPixel + delta * mK[i];
            }
          }
        }
        function splineCurveMonotone(points, indexAxis = "x") {
          const valueAxis = getValueAxis(indexAxis);
          const pointsLen = points.length;
          const deltaK = Array(pointsLen).fill(0);
          const mK = Array(pointsLen);
          let i, pointBefore, pointCurrent;
          let pointAfter = getPoint(points, 0);
          for (i = 0; i < pointsLen; ++i) {
            pointBefore = pointCurrent;
            pointCurrent = pointAfter;
            pointAfter = getPoint(points, i + 1);
            if (!pointCurrent) {
              continue;
            }
            if (pointAfter) {
              const slopeDelta = pointAfter[indexAxis] - pointCurrent[indexAxis];
              deltaK[i] = slopeDelta !== 0 ? (pointAfter[valueAxis] - pointCurrent[valueAxis]) / slopeDelta : 0;
            }
            mK[i] = !pointBefore ? deltaK[i] : !pointAfter ? deltaK[i - 1] : sign(deltaK[i - 1]) !== sign(deltaK[i]) ? 0 : (deltaK[i - 1] + deltaK[i]) / 2;
          }
          monotoneAdjust(points, deltaK, mK);
          monotoneCompute(points, mK, indexAxis);
        }
        function capControlPoint(pt, min, max) {
          return Math.max(Math.min(pt, max), min);
        }
        function capBezierPoints(points, area) {
          let i, ilen, point, inArea, inAreaPrev;
          let inAreaNext = _isPointInArea(points[0], area);
          for (i = 0, ilen = points.length; i < ilen; ++i) {
            inAreaPrev = inArea;
            inArea = inAreaNext;
            inAreaNext = i < ilen - 1 && _isPointInArea(points[i + 1], area);
            if (!inArea) {
              continue;
            }
            point = points[i];
            if (inAreaPrev) {
              point.cp1x = capControlPoint(point.cp1x, area.left, area.right);
              point.cp1y = capControlPoint(point.cp1y, area.top, area.bottom);
            }
            if (inAreaNext) {
              point.cp2x = capControlPoint(point.cp2x, area.left, area.right);
              point.cp2y = capControlPoint(point.cp2y, area.top, area.bottom);
            }
          }
        }
        function _updateBezierControlPoints(points, options, area, loop, indexAxis) {
          let i, ilen, point, controlPoints;
          if (options.spanGaps) {
            points = points.filter((pt) => !pt.skip);
          }
          if (options.cubicInterpolationMode === "monotone") {
            splineCurveMonotone(points, indexAxis);
          } else {
            let prev = loop ? points[points.length - 1] : points[0];
            for (i = 0, ilen = points.length; i < ilen; ++i) {
              point = points[i];
              controlPoints = splineCurve(
                prev,
                point,
                points[Math.min(i + 1, ilen - (loop ? 0 : 1)) % ilen],
                options.tension
              );
              point.cp1x = controlPoints.previous.x;
              point.cp1y = controlPoints.previous.y;
              point.cp2x = controlPoints.next.x;
              point.cp2y = controlPoints.next.y;
              prev = point;
            }
          }
          if (options.capBezierPoints) {
            capBezierPoints(points, area);
          }
        }
        const atEdge = (t) => t === 0 || t === 1;
        const elasticIn = (t, s, p) => -(Math.pow(2, 10 * (t -= 1)) * Math.sin((t - s) * TAU / p));
        const elasticOut = (t, s, p) => Math.pow(2, -10 * t) * Math.sin((t - s) * TAU / p) + 1;
        const effects = {
          linear: (t) => t,
          easeInQuad: (t) => t * t,
          easeOutQuad: (t) => -t * (t - 2),
          easeInOutQuad: (t) => (t /= 0.5) < 1 ? 0.5 * t * t : -0.5 * (--t * (t - 2) - 1),
          easeInCubic: (t) => t * t * t,
          easeOutCubic: (t) => (t -= 1) * t * t + 1,
          easeInOutCubic: (t) => (t /= 0.5) < 1 ? 0.5 * t * t * t : 0.5 * ((t -= 2) * t * t + 2),
          easeInQuart: (t) => t * t * t * t,
          easeOutQuart: (t) => -((t -= 1) * t * t * t - 1),
          easeInOutQuart: (t) => (t /= 0.5) < 1 ? 0.5 * t * t * t * t : -0.5 * ((t -= 2) * t * t * t - 2),
          easeInQuint: (t) => t * t * t * t * t,
          easeOutQuint: (t) => (t -= 1) * t * t * t * t + 1,
          easeInOutQuint: (t) => (t /= 0.5) < 1 ? 0.5 * t * t * t * t * t : 0.5 * ((t -= 2) * t * t * t * t + 2),
          easeInSine: (t) => -Math.cos(t * HALF_PI) + 1,
          easeOutSine: (t) => Math.sin(t * HALF_PI),
          easeInOutSine: (t) => -0.5 * (Math.cos(PI * t) - 1),
          easeInExpo: (t) => t === 0 ? 0 : Math.pow(2, 10 * (t - 1)),
          easeOutExpo: (t) => t === 1 ? 1 : -Math.pow(2, -10 * t) + 1,
          easeInOutExpo: (t) => atEdge(t) ? t : t < 0.5 ? 0.5 * Math.pow(2, 10 * (t * 2 - 1)) : 0.5 * (-Math.pow(2, -10 * (t * 2 - 1)) + 2),
          easeInCirc: (t) => t >= 1 ? t : -(Math.sqrt(1 - t * t) - 1),
          easeOutCirc: (t) => Math.sqrt(1 - (t -= 1) * t),
          easeInOutCirc: (t) => (t /= 0.5) < 1 ? -0.5 * (Math.sqrt(1 - t * t) - 1) : 0.5 * (Math.sqrt(1 - (t -= 2) * t) + 1),
          easeInElastic: (t) => atEdge(t) ? t : elasticIn(t, 0.075, 0.3),
          easeOutElastic: (t) => atEdge(t) ? t : elasticOut(t, 0.075, 0.3),
          easeInOutElastic(t) {
            const s = 0.1125;
            const p = 0.45;
            return atEdge(t) ? t : t < 0.5 ? 0.5 * elasticIn(t * 2, s, p) : 0.5 + 0.5 * elasticOut(t * 2 - 1, s, p);
          },
          easeInBack(t) {
            const s = 1.70158;
            return t * t * ((s + 1) * t - s);
          },
          easeOutBack(t) {
            const s = 1.70158;
            return (t -= 1) * t * ((s + 1) * t + s) + 1;
          },
          easeInOutBack(t) {
            let s = 1.70158;
            if ((t /= 0.5) < 1) {
              return 0.5 * (t * t * (((s *= 1.525) + 1) * t - s));
            }
            return 0.5 * ((t -= 2) * t * (((s *= 1.525) + 1) * t + s) + 2);
          },
          easeInBounce: (t) => 1 - effects.easeOutBounce(1 - t),
          easeOutBounce(t) {
            const m = 7.5625;
            const d = 2.75;
            if (t < 1 / d) {
              return m * t * t;
            }
            if (t < 2 / d) {
              return m * (t -= 1.5 / d) * t + 0.75;
            }
            if (t < 2.5 / d) {
              return m * (t -= 2.25 / d) * t + 0.9375;
            }
            return m * (t -= 2.625 / d) * t + 0.984375;
          },
          easeInOutBounce: (t) => t < 0.5 ? effects.easeInBounce(t * 2) * 0.5 : effects.easeOutBounce(t * 2 - 1) * 0.5 + 0.5
        };
        function _pointInLine(p1, p2, t, mode) {
          return {
            x: p1.x + t * (p2.x - p1.x),
            y: p1.y + t * (p2.y - p1.y)
          };
        }
        function _steppedInterpolation(p1, p2, t, mode) {
          return {
            x: p1.x + t * (p2.x - p1.x),
            y: mode === "middle" ? t < 0.5 ? p1.y : p2.y : mode === "after" ? t < 1 ? p1.y : p2.y : t > 0 ? p2.y : p1.y
          };
        }
        function _bezierInterpolation(p1, p2, t, mode) {
          const cp1 = { x: p1.cp2x, y: p1.cp2y };
          const cp2 = { x: p2.cp1x, y: p2.cp1y };
          const a = _pointInLine(p1, cp1, t);
          const b = _pointInLine(cp1, cp2, t);
          const c = _pointInLine(cp2, p2, t);
          const d = _pointInLine(a, b, t);
          const e = _pointInLine(b, c, t);
          return _pointInLine(d, e, t);
        }
        const intlCache = /* @__PURE__ */ new Map();
        function getNumberFormat(locale, options) {
          options = options || {};
          const cacheKey = locale + JSON.stringify(options);
          let formatter = intlCache.get(cacheKey);
          if (!formatter) {
            formatter = new Intl.NumberFormat(locale, options);
            intlCache.set(cacheKey, formatter);
          }
          return formatter;
        }
        function formatNumber(num, locale, options) {
          return getNumberFormat(locale, options).format(num);
        }
        const LINE_HEIGHT = new RegExp(/^(normal|(\d+(?:\.\d+)?)(px|em|%)?)$/);
        const FONT_STYLE = new RegExp(/^(normal|italic|initial|inherit|unset|(oblique( -?[0-9]?[0-9]deg)?))$/);
        function toLineHeight(value, size) {
          const matches = ("" + value).match(LINE_HEIGHT);
          if (!matches || matches[1] === "normal") {
            return size * 1.2;
          }
          value = +matches[2];
          switch (matches[3]) {
            case "px":
              return value;
            case "%":
              value /= 100;
              break;
          }
          return size * value;
        }
        const numberOrZero = (v) => +v || 0;
        function _readValueToProps(value, props) {
          const ret = {};
          const objProps = isObject(props);
          const keys = objProps ? Object.keys(props) : props;
          const read = isObject(value) ? objProps ? (prop) => valueOrDefault(value[prop], value[props[prop]]) : (prop) => value[prop] : () => value;
          for (const prop of keys) {
            ret[prop] = numberOrZero(read(prop));
          }
          return ret;
        }
        function toTRBL(value) {
          return _readValueToProps(value, { top: "y", right: "x", bottom: "y", left: "x" });
        }
        function toTRBLCorners(value) {
          return _readValueToProps(value, ["topLeft", "topRight", "bottomLeft", "bottomRight"]);
        }
        function toPadding(value) {
          const obj = toTRBL(value);
          obj.width = obj.left + obj.right;
          obj.height = obj.top + obj.bottom;
          return obj;
        }
        function toFont(options, fallback) {
          options = options || {};
          fallback = fallback || defaults.font;
          let size = valueOrDefault(options.size, fallback.size);
          if (typeof size === "string") {
            size = parseInt(size, 10);
          }
          let style = valueOrDefault(options.style, fallback.style);
          if (style && !("" + style).match(FONT_STYLE)) {
            console.warn('Invalid font style specified: "' + style + '"');
            style = "";
          }
          const font = {
            family: valueOrDefault(options.family, fallback.family),
            lineHeight: toLineHeight(valueOrDefault(options.lineHeight, fallback.lineHeight), size),
            size,
            style,
            weight: valueOrDefault(options.weight, fallback.weight),
            string: ""
          };
          font.string = toFontString(font);
          return font;
        }
        function resolve(inputs, context, index2, info) {
          let cacheable = true;
          let i, ilen, value;
          for (i = 0, ilen = inputs.length; i < ilen; ++i) {
            value = inputs[i];
            if (value === void 0) {
              continue;
            }
            if (context !== void 0 && typeof value === "function") {
              value = value(context);
              cacheable = false;
            }
            if (index2 !== void 0 && isArray(value)) {
              value = value[index2 % value.length];
              cacheable = false;
            }
            if (value !== void 0) {
              if (info && !cacheable) {
                info.cacheable = false;
              }
              return value;
            }
          }
        }
        function _addGrace(minmax, grace, beginAtZero) {
          const { min, max } = minmax;
          const change = toDimension(grace, (max - min) / 2);
          const keepZero = (value, add) => beginAtZero && value === 0 ? 0 : value + add;
          return {
            min: keepZero(min, -Math.abs(change)),
            max: keepZero(max, change)
          };
        }
        function createContext(parentContext, context) {
          return Object.assign(Object.create(parentContext), context);
        }
        const getRightToLeftAdapter = function(rectX, width) {
          return {
            x(x) {
              return rectX + rectX + width - x;
            },
            setWidth(w) {
              width = w;
            },
            textAlign(align) {
              if (align === "center") {
                return align;
              }
              return align === "right" ? "left" : "right";
            },
            xPlus(x, value) {
              return x - value;
            },
            leftForLtr(x, itemWidth) {
              return x - itemWidth;
            }
          };
        };
        const getLeftToRightAdapter = function() {
          return {
            x(x) {
              return x;
            },
            setWidth(w) {
            },
            textAlign(align) {
              return align;
            },
            xPlus(x, value) {
              return x + value;
            },
            leftForLtr(x, _itemWidth) {
              return x;
            }
          };
        };
        function getRtlAdapter(rtl, rectX, width) {
          return rtl ? getRightToLeftAdapter(rectX, width) : getLeftToRightAdapter();
        }
        function overrideTextDirection(ctx, direction) {
          let style, original;
          if (direction === "ltr" || direction === "rtl") {
            style = ctx.canvas.style;
            original = [
              style.getPropertyValue("direction"),
              style.getPropertyPriority("direction")
            ];
            style.setProperty("direction", direction, "important");
            ctx.prevTextDirection = original;
          }
        }
        function restoreTextDirection(ctx, original) {
          if (original !== void 0) {
            delete ctx.prevTextDirection;
            ctx.canvas.style.setProperty("direction", original[0], original[1]);
          }
        }
        function propertyFn(property) {
          if (property === "angle") {
            return {
              between: _angleBetween,
              compare: _angleDiff,
              normalize: _normalizeAngle
            };
          }
          return {
            between: _isBetween,
            compare: (a, b) => a - b,
            normalize: (x) => x
          };
        }
        function normalizeSegment({ start, end, count, loop, style }) {
          return {
            start: start % count,
            end: end % count,
            loop: loop && (end - start + 1) % count === 0,
            style
          };
        }
        function getSegment(segment, points, bounds) {
          const { property, start: startBound, end: endBound } = bounds;
          const { between, normalize } = propertyFn(property);
          const count = points.length;
          let { start, end, loop } = segment;
          let i, ilen;
          if (loop) {
            start += count;
            end += count;
            for (i = 0, ilen = count; i < ilen; ++i) {
              if (!between(normalize(points[start % count][property]), startBound, endBound)) {
                break;
              }
              start--;
              end--;
            }
            start %= count;
            end %= count;
          }
          if (end < start) {
            end += count;
          }
          return { start, end, loop, style: segment.style };
        }
        function _boundSegment(segment, points, bounds) {
          if (!bounds) {
            return [segment];
          }
          const { property, start: startBound, end: endBound } = bounds;
          const count = points.length;
          const { compare, between, normalize } = propertyFn(property);
          const { start, end, loop, style } = getSegment(segment, points, bounds);
          const result = [];
          let inside = false;
          let subStart = null;
          let value, point, prevValue;
          const startIsBefore = () => between(startBound, prevValue, value) && compare(startBound, prevValue) !== 0;
          const endIsBefore = () => compare(endBound, value) === 0 || between(endBound, prevValue, value);
          const shouldStart = () => inside || startIsBefore();
          const shouldStop = () => !inside || endIsBefore();
          for (let i = start, prev = start; i <= end; ++i) {
            point = points[i % count];
            if (point.skip) {
              continue;
            }
            value = normalize(point[property]);
            if (value === prevValue) {
              continue;
            }
            inside = between(value, startBound, endBound);
            if (subStart === null && shouldStart()) {
              subStart = compare(value, startBound) === 0 ? i : prev;
            }
            if (subStart !== null && shouldStop()) {
              result.push(normalizeSegment({ start: subStart, end: i, loop, count, style }));
              subStart = null;
            }
            prev = i;
            prevValue = value;
          }
          if (subStart !== null) {
            result.push(normalizeSegment({ start: subStart, end, loop, count, style }));
          }
          return result;
        }
        function _boundSegments(line, bounds) {
          const result = [];
          const segments = line.segments;
          for (let i = 0; i < segments.length; i++) {
            const sub = _boundSegment(segments[i], line.points, bounds);
            if (sub.length) {
              result.push(...sub);
            }
          }
          return result;
        }
        function findStartAndEnd(points, count, loop, spanGaps) {
          let start = 0;
          let end = count - 1;
          if (loop && !spanGaps) {
            while (start < count && !points[start].skip) {
              start++;
            }
          }
          while (start < count && points[start].skip) {
            start++;
          }
          start %= count;
          if (loop) {
            end += start;
          }
          while (end > start && points[end % count].skip) {
            end--;
          }
          end %= count;
          return { start, end };
        }
        function solidSegments(points, start, max, loop) {
          const count = points.length;
          const result = [];
          let last = start;
          let prev = points[start];
          let end;
          for (end = start + 1; end <= max; ++end) {
            const cur = points[end % count];
            if (cur.skip || cur.stop) {
              if (!prev.skip) {
                loop = false;
                result.push({ start: start % count, end: (end - 1) % count, loop });
                start = last = cur.stop ? end : null;
              }
            } else {
              last = end;
              if (prev.skip) {
                start = end;
              }
            }
            prev = cur;
          }
          if (last !== null) {
            result.push({ start: start % count, end: last % count, loop });
          }
          return result;
        }
        function _computeSegments(line, segmentOptions) {
          const points = line.points;
          const spanGaps = line.options.spanGaps;
          const count = points.length;
          if (!count) {
            return [];
          }
          const loop = !!line._loop;
          const { start, end } = findStartAndEnd(points, count, loop, spanGaps);
          if (spanGaps === true) {
            return splitByStyles(line, [{ start, end, loop }], points, segmentOptions);
          }
          const max = end < start ? end + count : end;
          const completeLoop = !!line._fullLoop && start === 0 && end === count - 1;
          return splitByStyles(line, solidSegments(points, start, max, completeLoop), points, segmentOptions);
        }
        function splitByStyles(line, segments, points, segmentOptions) {
          if (!segmentOptions || !segmentOptions.setContext || !points) {
            return segments;
          }
          return doSplitByStyles(line, segments, points, segmentOptions);
        }
        function doSplitByStyles(line, segments, points, segmentOptions) {
          const chartContext = line._chart.getContext();
          const baseStyle = readStyle(line.options);
          const { _datasetIndex: datasetIndex, options: { spanGaps } } = line;
          const count = points.length;
          const result = [];
          let prevStyle = baseStyle;
          let start = segments[0].start;
          let i = start;
          function addStyle(s, e, l, st) {
            const dir = spanGaps ? -1 : 1;
            if (s === e) {
              return;
            }
            s += count;
            while (points[s % count].skip) {
              s -= dir;
            }
            while (points[e % count].skip) {
              e += dir;
            }
            if (s % count !== e % count) {
              result.push({ start: s % count, end: e % count, loop: l, style: st });
              prevStyle = st;
              start = e % count;
            }
          }
          for (const segment of segments) {
            start = spanGaps ? start : segment.start;
            let prev = points[start % count];
            let style;
            for (i = start + 1; i <= segment.end; i++) {
              const pt = points[i % count];
              style = readStyle(segmentOptions.setContext(createContext(chartContext, {
                type: "segment",
                p0: prev,
                p1: pt,
                p0DataIndex: (i - 1) % count,
                p1DataIndex: i % count,
                datasetIndex
              })));
              if (styleChanged(style, prevStyle)) {
                addStyle(start, i - 1, segment.loop, prevStyle);
              }
              prev = pt;
              prevStyle = style;
            }
            if (start < i - 1) {
              addStyle(start, i - 1, segment.loop, prevStyle);
            }
          }
          return result;
        }
        function readStyle(options) {
          return {
            backgroundColor: options.backgroundColor,
            borderCapStyle: options.borderCapStyle,
            borderDash: options.borderDash,
            borderDashOffset: options.borderDashOffset,
            borderJoinStyle: options.borderJoinStyle,
            borderWidth: options.borderWidth,
            borderColor: options.borderColor
          };
        }
        function styleChanged(style, prevStyle) {
          return prevStyle && JSON.stringify(style) !== JSON.stringify(prevStyle);
        }
        var helpers = /* @__PURE__ */ Object.freeze({
          __proto__: null,
          easingEffects: effects,
          isPatternOrGradient,
          color,
          getHoverColor,
          noop,
          uid,
          isNullOrUndef,
          isArray,
          isObject,
          isFinite: isNumberFinite,
          finiteOrDefault,
          valueOrDefault,
          toPercentage,
          toDimension,
          callback,
          each,
          _elementsEqual,
          clone: clone$1,
          _merger,
          merge,
          mergeIf,
          _mergerIf,
          _deprecated,
          resolveObjectKey,
          _splitKey,
          _capitalize,
          defined,
          isFunction,
          setsEqual,
          _isClickEvent,
          toFontString,
          _measureText,
          _longestText,
          _alignPixel,
          clearCanvas,
          drawPoint,
          drawPointLegend,
          _isPointInArea,
          clipArea,
          unclipArea,
          _steppedLineTo,
          _bezierCurveTo,
          renderText,
          addRoundedRectPath,
          _lookup,
          _lookupByKey,
          _rlookupByKey,
          _filterBetween,
          listenArrayEvents,
          unlistenArrayEvents,
          _arrayUnique,
          _createResolver,
          _attachContext,
          _descriptors,
          _parseObjectDataRadialScale,
          splineCurve,
          splineCurveMonotone,
          _updateBezierControlPoints,
          _isDomSupported,
          _getParentNode,
          getStyle,
          getRelativePosition,
          getMaximumSize,
          retinaScale,
          supportsEventListenerOptions,
          readUsedSize,
          fontString,
          requestAnimFrame,
          throttled,
          debounce,
          _toLeftRightCenter,
          _alignStartEnd,
          _textX,
          _getStartAndCountOfVisiblePoints,
          _scaleRangesChanged,
          _pointInLine,
          _steppedInterpolation,
          _bezierInterpolation,
          formatNumber,
          toLineHeight,
          _readValueToProps,
          toTRBL,
          toTRBLCorners,
          toPadding,
          toFont,
          resolve,
          _addGrace,
          createContext,
          PI,
          TAU,
          PITAU,
          INFINITY,
          RAD_PER_DEG,
          HALF_PI,
          QUARTER_PI,
          TWO_THIRDS_PI,
          log10,
          sign,
          niceNum,
          _factorize,
          isNumber,
          almostEquals,
          almostWhole,
          _setMinAndMaxByKey,
          toRadians,
          toDegrees,
          _decimalPlaces,
          getAngleFromPoint,
          distanceBetweenPoints,
          _angleDiff,
          _normalizeAngle,
          _angleBetween,
          _limitValue,
          _int16Range,
          _isBetween,
          getRtlAdapter,
          overrideTextDirection,
          restoreTextDirection,
          _boundSegment,
          _boundSegments,
          _computeSegments
        });
        function binarySearch(metaset, axis, value, intersect) {
          const { controller, data, _sorted } = metaset;
          const iScale = controller._cachedMeta.iScale;
          if (iScale && axis === iScale.axis && axis !== "r" && _sorted && data.length) {
            const lookupMethod = iScale._reversePixels ? _rlookupByKey : _lookupByKey;
            if (!intersect) {
              return lookupMethod(data, axis, value);
            } else if (controller._sharedOptions) {
              const el = data[0];
              const range = typeof el.getRange === "function" && el.getRange(axis);
              if (range) {
                const start = lookupMethod(data, axis, value - range);
                const end = lookupMethod(data, axis, value + range);
                return { lo: start.lo, hi: end.hi };
              }
            }
          }
          return { lo: 0, hi: data.length - 1 };
        }
        function evaluateInteractionItems(chart, axis, position, handler, intersect) {
          const metasets = chart.getSortedVisibleDatasetMetas();
          const value = position[axis];
          for (let i = 0, ilen = metasets.length; i < ilen; ++i) {
            const { index: index2, data } = metasets[i];
            const { lo, hi } = binarySearch(metasets[i], axis, value, intersect);
            for (let j = lo; j <= hi; ++j) {
              const element = data[j];
              if (!element.skip) {
                handler(element, index2, j);
              }
            }
          }
        }
        function getDistanceMetricForAxis(axis) {
          const useX = axis.indexOf("x") !== -1;
          const useY = axis.indexOf("y") !== -1;
          return function(pt1, pt2) {
            const deltaX = useX ? Math.abs(pt1.x - pt2.x) : 0;
            const deltaY = useY ? Math.abs(pt1.y - pt2.y) : 0;
            return Math.sqrt(Math.pow(deltaX, 2) + Math.pow(deltaY, 2));
          };
        }
        function getIntersectItems(chart, position, axis, useFinalPosition, includeInvisible) {
          const items = [];
          if (!includeInvisible && !chart.isPointInArea(position)) {
            return items;
          }
          const evaluationFunc = function(element, datasetIndex, index2) {
            if (!includeInvisible && !_isPointInArea(element, chart.chartArea, 0)) {
              return;
            }
            if (element.inRange(position.x, position.y, useFinalPosition)) {
              items.push({ element, datasetIndex, index: index2 });
            }
          };
          evaluateInteractionItems(chart, axis, position, evaluationFunc, true);
          return items;
        }
        function getNearestRadialItems(chart, position, axis, useFinalPosition) {
          let items = [];
          function evaluationFunc(element, datasetIndex, index2) {
            const { startAngle, endAngle } = element.getProps(["startAngle", "endAngle"], useFinalPosition);
            const { angle } = getAngleFromPoint(element, { x: position.x, y: position.y });
            if (_angleBetween(angle, startAngle, endAngle)) {
              items.push({ element, datasetIndex, index: index2 });
            }
          }
          evaluateInteractionItems(chart, axis, position, evaluationFunc);
          return items;
        }
        function getNearestCartesianItems(chart, position, axis, intersect, useFinalPosition, includeInvisible) {
          let items = [];
          const distanceMetric = getDistanceMetricForAxis(axis);
          let minDistance = Number.POSITIVE_INFINITY;
          function evaluationFunc(element, datasetIndex, index2) {
            const inRange2 = element.inRange(position.x, position.y, useFinalPosition);
            if (intersect && !inRange2) {
              return;
            }
            const center = element.getCenterPoint(useFinalPosition);
            const pointInArea = !!includeInvisible || chart.isPointInArea(center);
            if (!pointInArea && !inRange2) {
              return;
            }
            const distance = distanceMetric(position, center);
            if (distance < minDistance) {
              items = [{ element, datasetIndex, index: index2 }];
              minDistance = distance;
            } else if (distance === minDistance) {
              items.push({ element, datasetIndex, index: index2 });
            }
          }
          evaluateInteractionItems(chart, axis, position, evaluationFunc);
          return items;
        }
        function getNearestItems(chart, position, axis, intersect, useFinalPosition, includeInvisible) {
          if (!includeInvisible && !chart.isPointInArea(position)) {
            return [];
          }
          return axis === "r" && !intersect ? getNearestRadialItems(chart, position, axis, useFinalPosition) : getNearestCartesianItems(chart, position, axis, intersect, useFinalPosition, includeInvisible);
        }
        function getAxisItems(chart, position, axis, intersect, useFinalPosition) {
          const items = [];
          const rangeMethod = axis === "x" ? "inXRange" : "inYRange";
          let intersectsItem = false;
          evaluateInteractionItems(chart, axis, position, (element, datasetIndex, index2) => {
            if (element[rangeMethod](position[axis], useFinalPosition)) {
              items.push({ element, datasetIndex, index: index2 });
              intersectsItem = intersectsItem || element.inRange(position.x, position.y, useFinalPosition);
            }
          });
          if (intersect && !intersectsItem) {
            return [];
          }
          return items;
        }
        var Interaction = {
          evaluateInteractionItems,
          modes: {
            index(chart, e, options, useFinalPosition) {
              const position = getRelativePosition(e, chart);
              const axis = options.axis || "x";
              const includeInvisible = options.includeInvisible || false;
              const items = options.intersect ? getIntersectItems(chart, position, axis, useFinalPosition, includeInvisible) : getNearestItems(chart, position, axis, false, useFinalPosition, includeInvisible);
              const elements2 = [];
              if (!items.length) {
                return [];
              }
              chart.getSortedVisibleDatasetMetas().forEach((meta) => {
                const index2 = items[0].index;
                const element = meta.data[index2];
                if (element && !element.skip) {
                  elements2.push({ element, datasetIndex: meta.index, index: index2 });
                }
              });
              return elements2;
            },
            dataset(chart, e, options, useFinalPosition) {
              const position = getRelativePosition(e, chart);
              const axis = options.axis || "xy";
              const includeInvisible = options.includeInvisible || false;
              let items = options.intersect ? getIntersectItems(chart, position, axis, useFinalPosition, includeInvisible) : getNearestItems(chart, position, axis, false, useFinalPosition, includeInvisible);
              if (items.length > 0) {
                const datasetIndex = items[0].datasetIndex;
                const data = chart.getDatasetMeta(datasetIndex).data;
                items = [];
                for (let i = 0; i < data.length; ++i) {
                  items.push({ element: data[i], datasetIndex, index: i });
                }
              }
              return items;
            },
            point(chart, e, options, useFinalPosition) {
              const position = getRelativePosition(e, chart);
              const axis = options.axis || "xy";
              const includeInvisible = options.includeInvisible || false;
              return getIntersectItems(chart, position, axis, useFinalPosition, includeInvisible);
            },
            nearest(chart, e, options, useFinalPosition) {
              const position = getRelativePosition(e, chart);
              const axis = options.axis || "xy";
              const includeInvisible = options.includeInvisible || false;
              return getNearestItems(chart, position, axis, options.intersect, useFinalPosition, includeInvisible);
            },
            x(chart, e, options, useFinalPosition) {
              const position = getRelativePosition(e, chart);
              return getAxisItems(chart, position, "x", options.intersect, useFinalPosition);
            },
            y(chart, e, options, useFinalPosition) {
              const position = getRelativePosition(e, chart);
              return getAxisItems(chart, position, "y", options.intersect, useFinalPosition);
            }
          }
        };
        const STATIC_POSITIONS = ["left", "top", "right", "bottom"];
        function filterByPosition(array, position) {
          return array.filter((v) => v.pos === position);
        }
        function filterDynamicPositionByAxis(array, axis) {
          return array.filter((v) => STATIC_POSITIONS.indexOf(v.pos) === -1 && v.box.axis === axis);
        }
        function sortByWeight(array, reverse) {
          return array.sort((a, b) => {
            const v0 = reverse ? b : a;
            const v1 = reverse ? a : b;
            return v0.weight === v1.weight ? v0.index - v1.index : v0.weight - v1.weight;
          });
        }
        function wrapBoxes(boxes) {
          const layoutBoxes = [];
          let i, ilen, box, pos, stack, stackWeight;
          for (i = 0, ilen = (boxes || []).length; i < ilen; ++i) {
            box = boxes[i];
            ({ position: pos, options: { stack, stackWeight = 1 } } = box);
            layoutBoxes.push({
              index: i,
              box,
              pos,
              horizontal: box.isHorizontal(),
              weight: box.weight,
              stack: stack && pos + stack,
              stackWeight
            });
          }
          return layoutBoxes;
        }
        function buildStacks(layouts2) {
          const stacks = {};
          for (const wrap of layouts2) {
            const { stack, pos, stackWeight } = wrap;
            if (!stack || !STATIC_POSITIONS.includes(pos)) {
              continue;
            }
            const _stack = stacks[stack] || (stacks[stack] = { count: 0, placed: 0, weight: 0, size: 0 });
            _stack.count++;
            _stack.weight += stackWeight;
          }
          return stacks;
        }
        function setLayoutDims(layouts2, params) {
          const stacks = buildStacks(layouts2);
          const { vBoxMaxWidth, hBoxMaxHeight } = params;
          let i, ilen, layout;
          for (i = 0, ilen = layouts2.length; i < ilen; ++i) {
            layout = layouts2[i];
            const { fullSize } = layout.box;
            const stack = stacks[layout.stack];
            const factor = stack && layout.stackWeight / stack.weight;
            if (layout.horizontal) {
              layout.width = factor ? factor * vBoxMaxWidth : fullSize && params.availableWidth;
              layout.height = hBoxMaxHeight;
            } else {
              layout.width = vBoxMaxWidth;
              layout.height = factor ? factor * hBoxMaxHeight : fullSize && params.availableHeight;
            }
          }
          return stacks;
        }
        function buildLayoutBoxes(boxes) {
          const layoutBoxes = wrapBoxes(boxes);
          const fullSize = sortByWeight(layoutBoxes.filter((wrap) => wrap.box.fullSize), true);
          const left = sortByWeight(filterByPosition(layoutBoxes, "left"), true);
          const right = sortByWeight(filterByPosition(layoutBoxes, "right"));
          const top = sortByWeight(filterByPosition(layoutBoxes, "top"), true);
          const bottom = sortByWeight(filterByPosition(layoutBoxes, "bottom"));
          const centerHorizontal = filterDynamicPositionByAxis(layoutBoxes, "x");
          const centerVertical = filterDynamicPositionByAxis(layoutBoxes, "y");
          return {
            fullSize,
            leftAndTop: left.concat(top),
            rightAndBottom: right.concat(centerVertical).concat(bottom).concat(centerHorizontal),
            chartArea: filterByPosition(layoutBoxes, "chartArea"),
            vertical: left.concat(right).concat(centerVertical),
            horizontal: top.concat(bottom).concat(centerHorizontal)
          };
        }
        function getCombinedMax(maxPadding, chartArea, a, b) {
          return Math.max(maxPadding[a], chartArea[a]) + Math.max(maxPadding[b], chartArea[b]);
        }
        function updateMaxPadding(maxPadding, boxPadding) {
          maxPadding.top = Math.max(maxPadding.top, boxPadding.top);
          maxPadding.left = Math.max(maxPadding.left, boxPadding.left);
          maxPadding.bottom = Math.max(maxPadding.bottom, boxPadding.bottom);
          maxPadding.right = Math.max(maxPadding.right, boxPadding.right);
        }
        function updateDims(chartArea, params, layout, stacks) {
          const { pos, box } = layout;
          const maxPadding = chartArea.maxPadding;
          if (!isObject(pos)) {
            if (layout.size) {
              chartArea[pos] -= layout.size;
            }
            const stack = stacks[layout.stack] || { size: 0, count: 1 };
            stack.size = Math.max(stack.size, layout.horizontal ? box.height : box.width);
            layout.size = stack.size / stack.count;
            chartArea[pos] += layout.size;
          }
          if (box.getPadding) {
            updateMaxPadding(maxPadding, box.getPadding());
          }
          const newWidth = Math.max(0, params.outerWidth - getCombinedMax(maxPadding, chartArea, "left", "right"));
          const newHeight = Math.max(0, params.outerHeight - getCombinedMax(maxPadding, chartArea, "top", "bottom"));
          const widthChanged = newWidth !== chartArea.w;
          const heightChanged = newHeight !== chartArea.h;
          chartArea.w = newWidth;
          chartArea.h = newHeight;
          return layout.horizontal ? { same: widthChanged, other: heightChanged } : { same: heightChanged, other: widthChanged };
        }
        function handleMaxPadding(chartArea) {
          const maxPadding = chartArea.maxPadding;
          function updatePos(pos) {
            const change = Math.max(maxPadding[pos] - chartArea[pos], 0);
            chartArea[pos] += change;
            return change;
          }
          chartArea.y += updatePos("top");
          chartArea.x += updatePos("left");
          updatePos("right");
          updatePos("bottom");
        }
        function getMargins(horizontal, chartArea) {
          const maxPadding = chartArea.maxPadding;
          function marginForPositions(positions2) {
            const margin = { left: 0, top: 0, right: 0, bottom: 0 };
            positions2.forEach((pos) => {
              margin[pos] = Math.max(chartArea[pos], maxPadding[pos]);
            });
            return margin;
          }
          return horizontal ? marginForPositions(["left", "right"]) : marginForPositions(["top", "bottom"]);
        }
        function fitBoxes(boxes, chartArea, params, stacks) {
          const refitBoxes = [];
          let i, ilen, layout, box, refit, changed;
          for (i = 0, ilen = boxes.length, refit = 0; i < ilen; ++i) {
            layout = boxes[i];
            box = layout.box;
            box.update(
              layout.width || chartArea.w,
              layout.height || chartArea.h,
              getMargins(layout.horizontal, chartArea)
            );
            const { same, other } = updateDims(chartArea, params, layout, stacks);
            refit |= same && refitBoxes.length;
            changed = changed || other;
            if (!box.fullSize) {
              refitBoxes.push(layout);
            }
          }
          return refit && fitBoxes(refitBoxes, chartArea, params, stacks) || changed;
        }
        function setBoxDims(box, left, top, width, height) {
          box.top = top;
          box.left = left;
          box.right = left + width;
          box.bottom = top + height;
          box.width = width;
          box.height = height;
        }
        function placeBoxes(boxes, chartArea, params, stacks) {
          const userPadding = params.padding;
          let { x, y } = chartArea;
          for (const layout of boxes) {
            const box = layout.box;
            const stack = stacks[layout.stack] || { count: 1, placed: 0, weight: 1 };
            const weight = layout.stackWeight / stack.weight || 1;
            if (layout.horizontal) {
              const width = chartArea.w * weight;
              const height = stack.size || box.height;
              if (defined(stack.start)) {
                y = stack.start;
              }
              if (box.fullSize) {
                setBoxDims(box, userPadding.left, y, params.outerWidth - userPadding.right - userPadding.left, height);
              } else {
                setBoxDims(box, chartArea.left + stack.placed, y, width, height);
              }
              stack.start = y;
              stack.placed += width;
              y = box.bottom;
            } else {
              const height = chartArea.h * weight;
              const width = stack.size || box.width;
              if (defined(stack.start)) {
                x = stack.start;
              }
              if (box.fullSize) {
                setBoxDims(box, x, userPadding.top, width, params.outerHeight - userPadding.bottom - userPadding.top);
              } else {
                setBoxDims(box, x, chartArea.top + stack.placed, width, height);
              }
              stack.start = x;
              stack.placed += height;
              x = box.right;
            }
          }
          chartArea.x = x;
          chartArea.y = y;
        }
        defaults.set("layout", {
          autoPadding: true,
          padding: {
            top: 0,
            right: 0,
            bottom: 0,
            left: 0
          }
        });
        var layouts = {
          addBox(chart, item) {
            if (!chart.boxes) {
              chart.boxes = [];
            }
            item.fullSize = item.fullSize || false;
            item.position = item.position || "top";
            item.weight = item.weight || 0;
            item._layers = item._layers || function() {
              return [{
                z: 0,
                draw(chartArea) {
                  item.draw(chartArea);
                }
              }];
            };
            chart.boxes.push(item);
          },
          removeBox(chart, layoutItem) {
            const index2 = chart.boxes ? chart.boxes.indexOf(layoutItem) : -1;
            if (index2 !== -1) {
              chart.boxes.splice(index2, 1);
            }
          },
          configure(chart, item, options) {
            item.fullSize = options.fullSize;
            item.position = options.position;
            item.weight = options.weight;
          },
          update(chart, width, height, minPadding) {
            if (!chart) {
              return;
            }
            const padding = toPadding(chart.options.layout.padding);
            const availableWidth = Math.max(width - padding.width, 0);
            const availableHeight = Math.max(height - padding.height, 0);
            const boxes = buildLayoutBoxes(chart.boxes);
            const verticalBoxes = boxes.vertical;
            const horizontalBoxes = boxes.horizontal;
            each(chart.boxes, (box) => {
              if (typeof box.beforeLayout === "function") {
                box.beforeLayout();
              }
            });
            const visibleVerticalBoxCount = verticalBoxes.reduce((total, wrap) => wrap.box.options && wrap.box.options.display === false ? total : total + 1, 0) || 1;
            const params = Object.freeze({
              outerWidth: width,
              outerHeight: height,
              padding,
              availableWidth,
              availableHeight,
              vBoxMaxWidth: availableWidth / 2 / visibleVerticalBoxCount,
              hBoxMaxHeight: availableHeight / 2
            });
            const maxPadding = Object.assign({}, padding);
            updateMaxPadding(maxPadding, toPadding(minPadding));
            const chartArea = Object.assign({
              maxPadding,
              w: availableWidth,
              h: availableHeight,
              x: padding.left,
              y: padding.top
            }, padding);
            const stacks = setLayoutDims(verticalBoxes.concat(horizontalBoxes), params);
            fitBoxes(boxes.fullSize, chartArea, params, stacks);
            fitBoxes(verticalBoxes, chartArea, params, stacks);
            if (fitBoxes(horizontalBoxes, chartArea, params, stacks)) {
              fitBoxes(verticalBoxes, chartArea, params, stacks);
            }
            handleMaxPadding(chartArea);
            placeBoxes(boxes.leftAndTop, chartArea, params, stacks);
            chartArea.x += chartArea.w;
            chartArea.y += chartArea.h;
            placeBoxes(boxes.rightAndBottom, chartArea, params, stacks);
            chart.chartArea = {
              left: chartArea.left,
              top: chartArea.top,
              right: chartArea.left + chartArea.w,
              bottom: chartArea.top + chartArea.h,
              height: chartArea.h,
              width: chartArea.w
            };
            each(boxes.chartArea, (layout) => {
              const box = layout.box;
              Object.assign(box, chart.chartArea);
              box.update(chartArea.w, chartArea.h, { left: 0, top: 0, right: 0, bottom: 0 });
            });
          }
        };
        class BasePlatform {
          acquireContext(canvas, aspectRatio) {
          }
          releaseContext(context) {
            return false;
          }
          addEventListener(chart, type, listener) {
          }
          removeEventListener(chart, type, listener) {
          }
          getDevicePixelRatio() {
            return 1;
          }
          getMaximumSize(element, width, height, aspectRatio) {
            width = Math.max(0, width || element.width);
            height = height || element.height;
            return {
              width,
              height: Math.max(0, aspectRatio ? Math.floor(width / aspectRatio) : height)
            };
          }
          isAttached(canvas) {
            return true;
          }
          updateConfig(config) {
          }
        }
        class BasicPlatform extends BasePlatform {
          acquireContext(item) {
            return item && item.getContext && item.getContext("2d") || null;
          }
          updateConfig(config) {
            config.options.animation = false;
          }
        }
        const EXPANDO_KEY = "$chartjs";
        const EVENT_TYPES = {
          touchstart: "mousedown",
          touchmove: "mousemove",
          touchend: "mouseup",
          pointerenter: "mouseenter",
          pointerdown: "mousedown",
          pointermove: "mousemove",
          pointerup: "mouseup",
          pointerleave: "mouseout",
          pointerout: "mouseout"
        };
        const isNullOrEmpty = (value) => value === null || value === "";
        function initCanvas(canvas, aspectRatio) {
          const style = canvas.style;
          const renderHeight = canvas.getAttribute("height");
          const renderWidth = canvas.getAttribute("width");
          canvas[EXPANDO_KEY] = {
            initial: {
              height: renderHeight,
              width: renderWidth,
              style: {
                display: style.display,
                height: style.height,
                width: style.width
              }
            }
          };
          style.display = style.display || "block";
          style.boxSizing = style.boxSizing || "border-box";
          if (isNullOrEmpty(renderWidth)) {
            const displayWidth = readUsedSize(canvas, "width");
            if (displayWidth !== void 0) {
              canvas.width = displayWidth;
            }
          }
          if (isNullOrEmpty(renderHeight)) {
            if (canvas.style.height === "") {
              canvas.height = canvas.width / (aspectRatio || 2);
            } else {
              const displayHeight = readUsedSize(canvas, "height");
              if (displayHeight !== void 0) {
                canvas.height = displayHeight;
              }
            }
          }
          return canvas;
        }
        const eventListenerOptions = supportsEventListenerOptions ? { passive: true } : false;
        function addListener(node, type, listener) {
          node.addEventListener(type, listener, eventListenerOptions);
        }
        function removeListener(chart, type, listener) {
          chart.canvas.removeEventListener(type, listener, eventListenerOptions);
        }
        function fromNativeEvent(event, chart) {
          const type = EVENT_TYPES[event.type] || event.type;
          const { x, y } = getRelativePosition(event, chart);
          return {
            type,
            chart,
            native: event,
            x: x !== void 0 ? x : null,
            y: y !== void 0 ? y : null
          };
        }
        function nodeListContains(nodeList, canvas) {
          for (const node of nodeList) {
            if (node === canvas || node.contains(canvas)) {
              return true;
            }
          }
        }
        function createAttachObserver(chart, type, listener) {
          const canvas = chart.canvas;
          const observer = new MutationObserver((entries) => {
            let trigger = false;
            for (const entry of entries) {
              trigger = trigger || nodeListContains(entry.addedNodes, canvas);
              trigger = trigger && !nodeListContains(entry.removedNodes, canvas);
            }
            if (trigger) {
              listener();
            }
          });
          observer.observe(document, { childList: true, subtree: true });
          return observer;
        }
        function createDetachObserver(chart, type, listener) {
          const canvas = chart.canvas;
          const observer = new MutationObserver((entries) => {
            let trigger = false;
            for (const entry of entries) {
              trigger = trigger || nodeListContains(entry.removedNodes, canvas);
              trigger = trigger && !nodeListContains(entry.addedNodes, canvas);
            }
            if (trigger) {
              listener();
            }
          });
          observer.observe(document, { childList: true, subtree: true });
          return observer;
        }
        const drpListeningCharts = /* @__PURE__ */ new Map();
        let oldDevicePixelRatio = 0;
        function onWindowResize() {
          const dpr = window.devicePixelRatio;
          if (dpr === oldDevicePixelRatio) {
            return;
          }
          oldDevicePixelRatio = dpr;
          drpListeningCharts.forEach((resize, chart) => {
            if (chart.currentDevicePixelRatio !== dpr) {
              resize();
            }
          });
        }
        function listenDevicePixelRatioChanges(chart, resize) {
          if (!drpListeningCharts.size) {
            window.addEventListener("resize", onWindowResize);
          }
          drpListeningCharts.set(chart, resize);
        }
        function unlistenDevicePixelRatioChanges(chart) {
          drpListeningCharts.delete(chart);
          if (!drpListeningCharts.size) {
            window.removeEventListener("resize", onWindowResize);
          }
        }
        function createResizeObserver(chart, type, listener) {
          const canvas = chart.canvas;
          const container = canvas && _getParentNode(canvas);
          if (!container) {
            return;
          }
          const resize = throttled((width, height) => {
            const w = container.clientWidth;
            listener(width, height);
            if (w < container.clientWidth) {
              listener();
            }
          }, window);
          const observer = new ResizeObserver((entries) => {
            const entry = entries[0];
            const width = entry.contentRect.width;
            const height = entry.contentRect.height;
            if (width === 0 && height === 0) {
              return;
            }
            resize(width, height);
          });
          observer.observe(container);
          listenDevicePixelRatioChanges(chart, resize);
          return observer;
        }
        function releaseObserver(chart, type, observer) {
          if (observer) {
            observer.disconnect();
          }
          if (type === "resize") {
            unlistenDevicePixelRatioChanges(chart);
          }
        }
        function createProxyAndListen(chart, type, listener) {
          const canvas = chart.canvas;
          const proxy = throttled((event) => {
            if (chart.ctx !== null) {
              listener(fromNativeEvent(event, chart));
            }
          }, chart, (args) => {
            const event = args[0];
            return [event, event.offsetX, event.offsetY];
          });
          addListener(canvas, type, proxy);
          return proxy;
        }
        class DomPlatform extends BasePlatform {
          acquireContext(canvas, aspectRatio) {
            const context = canvas && canvas.getContext && canvas.getContext("2d");
            if (context && context.canvas === canvas) {
              initCanvas(canvas, aspectRatio);
              return context;
            }
            return null;
          }
          releaseContext(context) {
            const canvas = context.canvas;
            if (!canvas[EXPANDO_KEY]) {
              return false;
            }
            const initial = canvas[EXPANDO_KEY].initial;
            ["height", "width"].forEach((prop) => {
              const value = initial[prop];
              if (isNullOrUndef(value)) {
                canvas.removeAttribute(prop);
              } else {
                canvas.setAttribute(prop, value);
              }
            });
            const style = initial.style || {};
            Object.keys(style).forEach((key) => {
              canvas.style[key] = style[key];
            });
            canvas.width = canvas.width;
            delete canvas[EXPANDO_KEY];
            return true;
          }
          addEventListener(chart, type, listener) {
            this.removeEventListener(chart, type);
            const proxies = chart.$proxies || (chart.$proxies = {});
            const handlers = {
              attach: createAttachObserver,
              detach: createDetachObserver,
              resize: createResizeObserver
            };
            const handler = handlers[type] || createProxyAndListen;
            proxies[type] = handler(chart, type, listener);
          }
          removeEventListener(chart, type) {
            const proxies = chart.$proxies || (chart.$proxies = {});
            const proxy = proxies[type];
            if (!proxy) {
              return;
            }
            const handlers = {
              attach: releaseObserver,
              detach: releaseObserver,
              resize: releaseObserver
            };
            const handler = handlers[type] || removeListener;
            handler(chart, type, proxy);
            proxies[type] = void 0;
          }
          getDevicePixelRatio() {
            return window.devicePixelRatio;
          }
          getMaximumSize(canvas, width, height, aspectRatio) {
            return getMaximumSize(canvas, width, height, aspectRatio);
          }
          isAttached(canvas) {
            const container = _getParentNode(canvas);
            return !!(container && container.isConnected);
          }
        }
        function _detectPlatform(canvas) {
          if (!_isDomSupported() || typeof OffscreenCanvas !== "undefined" && canvas instanceof OffscreenCanvas) {
            return BasicPlatform;
          }
          return DomPlatform;
        }
        var platforms = /* @__PURE__ */ Object.freeze({
          __proto__: null,
          _detectPlatform,
          BasePlatform,
          BasicPlatform,
          DomPlatform
        });
        const transparent = "transparent";
        const interpolators = {
          boolean(from2, to2, factor) {
            return factor > 0.5 ? to2 : from2;
          },
          color(from2, to2, factor) {
            const c0 = color(from2 || transparent);
            const c1 = c0.valid && color(to2 || transparent);
            return c1 && c1.valid ? c1.mix(c0, factor).hexString() : to2;
          },
          number(from2, to2, factor) {
            return from2 + (to2 - from2) * factor;
          }
        };
        class Animation {
          constructor(cfg, target, prop, to2) {
            const currentValue = target[prop];
            to2 = resolve([cfg.to, to2, currentValue, cfg.from]);
            const from2 = resolve([cfg.from, currentValue, to2]);
            this._active = true;
            this._fn = cfg.fn || interpolators[cfg.type || typeof from2];
            this._easing = effects[cfg.easing] || effects.linear;
            this._start = Math.floor(Date.now() + (cfg.delay || 0));
            this._duration = this._total = Math.floor(cfg.duration);
            this._loop = !!cfg.loop;
            this._target = target;
            this._prop = prop;
            this._from = from2;
            this._to = to2;
            this._promises = void 0;
          }
          active() {
            return this._active;
          }
          update(cfg, to2, date) {
            if (this._active) {
              this._notify(false);
              const currentValue = this._target[this._prop];
              const elapsed = date - this._start;
              const remain = this._duration - elapsed;
              this._start = date;
              this._duration = Math.floor(Math.max(remain, cfg.duration));
              this._total += elapsed;
              this._loop = !!cfg.loop;
              this._to = resolve([cfg.to, to2, currentValue, cfg.from]);
              this._from = resolve([cfg.from, currentValue, to2]);
            }
          }
          cancel() {
            if (this._active) {
              this.tick(Date.now());
              this._active = false;
              this._notify(false);
            }
          }
          tick(date) {
            const elapsed = date - this._start;
            const duration = this._duration;
            const prop = this._prop;
            const from2 = this._from;
            const loop = this._loop;
            const to2 = this._to;
            let factor;
            this._active = from2 !== to2 && (loop || elapsed < duration);
            if (!this._active) {
              this._target[prop] = to2;
              this._notify(true);
              return;
            }
            if (elapsed < 0) {
              this._target[prop] = from2;
              return;
            }
            factor = elapsed / duration % 2;
            factor = loop && factor > 1 ? 2 - factor : factor;
            factor = this._easing(Math.min(1, Math.max(0, factor)));
            this._target[prop] = this._fn(from2, to2, factor);
          }
          wait() {
            const promises = this._promises || (this._promises = []);
            return new Promise((res, rej) => {
              promises.push({ res, rej });
            });
          }
          _notify(resolved) {
            const method = resolved ? "res" : "rej";
            const promises = this._promises || [];
            for (let i = 0; i < promises.length; i++) {
              promises[i][method]();
            }
          }
        }
        const numbers = ["x", "y", "borderWidth", "radius", "tension"];
        const colors = ["color", "borderColor", "backgroundColor"];
        defaults.set("animation", {
          delay: void 0,
          duration: 1e3,
          easing: "easeOutQuart",
          fn: void 0,
          from: void 0,
          loop: void 0,
          to: void 0,
          type: void 0
        });
        const animationOptions = Object.keys(defaults.animation);
        defaults.describe("animation", {
          _fallback: false,
          _indexable: false,
          _scriptable: (name) => name !== "onProgress" && name !== "onComplete" && name !== "fn"
        });
        defaults.set("animations", {
          colors: {
            type: "color",
            properties: colors
          },
          numbers: {
            type: "number",
            properties: numbers
          }
        });
        defaults.describe("animations", {
          _fallback: "animation"
        });
        defaults.set("transitions", {
          active: {
            animation: {
              duration: 400
            }
          },
          resize: {
            animation: {
              duration: 0
            }
          },
          show: {
            animations: {
              colors: {
                from: "transparent"
              },
              visible: {
                type: "boolean",
                duration: 0
              }
            }
          },
          hide: {
            animations: {
              colors: {
                to: "transparent"
              },
              visible: {
                type: "boolean",
                easing: "linear",
                fn: (v) => v | 0
              }
            }
          }
        });
        class Animations {
          constructor(chart, config) {
            this._chart = chart;
            this._properties = /* @__PURE__ */ new Map();
            this.configure(config);
          }
          configure(config) {
            if (!isObject(config)) {
              return;
            }
            const animatedProps = this._properties;
            Object.getOwnPropertyNames(config).forEach((key) => {
              const cfg = config[key];
              if (!isObject(cfg)) {
                return;
              }
              const resolved = {};
              for (const option of animationOptions) {
                resolved[option] = cfg[option];
              }
              (isArray(cfg.properties) && cfg.properties || [key]).forEach((prop) => {
                if (prop === key || !animatedProps.has(prop)) {
                  animatedProps.set(prop, resolved);
                }
              });
            });
          }
          _animateOptions(target, values) {
            const newOptions = values.options;
            const options = resolveTargetOptions(target, newOptions);
            if (!options) {
              return [];
            }
            const animations = this._createAnimations(options, newOptions);
            if (newOptions.$shared) {
              awaitAll(target.options.$animations, newOptions).then(() => {
                target.options = newOptions;
              }, () => {
              });
            }
            return animations;
          }
          _createAnimations(target, values) {
            const animatedProps = this._properties;
            const animations = [];
            const running = target.$animations || (target.$animations = {});
            const props = Object.keys(values);
            const date = Date.now();
            let i;
            for (i = props.length - 1; i >= 0; --i) {
              const prop = props[i];
              if (prop.charAt(0) === "$") {
                continue;
              }
              if (prop === "options") {
                animations.push(...this._animateOptions(target, values));
                continue;
              }
              const value = values[prop];
              let animation = running[prop];
              const cfg = animatedProps.get(prop);
              if (animation) {
                if (cfg && animation.active()) {
                  animation.update(cfg, value, date);
                  continue;
                } else {
                  animation.cancel();
                }
              }
              if (!cfg || !cfg.duration) {
                target[prop] = value;
                continue;
              }
              running[prop] = animation = new Animation(cfg, target, prop, value);
              animations.push(animation);
            }
            return animations;
          }
          update(target, values) {
            if (this._properties.size === 0) {
              Object.assign(target, values);
              return;
            }
            const animations = this._createAnimations(target, values);
            if (animations.length) {
              animator.add(this._chart, animations);
              return true;
            }
          }
        }
        function awaitAll(animations, properties) {
          const running = [];
          const keys = Object.keys(properties);
          for (let i = 0; i < keys.length; i++) {
            const anim = animations[keys[i]];
            if (anim && anim.active()) {
              running.push(anim.wait());
            }
          }
          return Promise.all(running);
        }
        function resolveTargetOptions(target, newOptions) {
          if (!newOptions) {
            return;
          }
          let options = target.options;
          if (!options) {
            target.options = newOptions;
            return;
          }
          if (options.$shared) {
            target.options = options = Object.assign({}, options, { $shared: false, $animations: {} });
          }
          return options;
        }
        function scaleClip(scale, allowedOverflow) {
          const opts = scale && scale.options || {};
          const reverse = opts.reverse;
          const min = opts.min === void 0 ? allowedOverflow : 0;
          const max = opts.max === void 0 ? allowedOverflow : 0;
          return {
            start: reverse ? max : min,
            end: reverse ? min : max
          };
        }
        function defaultClip(xScale, yScale, allowedOverflow) {
          if (allowedOverflow === false) {
            return false;
          }
          const x = scaleClip(xScale, allowedOverflow);
          const y = scaleClip(yScale, allowedOverflow);
          return {
            top: y.end,
            right: x.end,
            bottom: y.start,
            left: x.start
          };
        }
        function toClip(value) {
          let t, r, b, l;
          if (isObject(value)) {
            t = value.top;
            r = value.right;
            b = value.bottom;
            l = value.left;
          } else {
            t = r = b = l = value;
          }
          return {
            top: t,
            right: r,
            bottom: b,
            left: l,
            disabled: value === false
          };
        }
        function getSortedDatasetIndices(chart, filterVisible) {
          const keys = [];
          const metasets = chart._getSortedDatasetMetas(filterVisible);
          let i, ilen;
          for (i = 0, ilen = metasets.length; i < ilen; ++i) {
            keys.push(metasets[i].index);
          }
          return keys;
        }
        function applyStack(stack, value, dsIndex, options = {}) {
          const keys = stack.keys;
          const singleMode = options.mode === "single";
          let i, ilen, datasetIndex, otherValue;
          if (value === null) {
            return;
          }
          for (i = 0, ilen = keys.length; i < ilen; ++i) {
            datasetIndex = +keys[i];
            if (datasetIndex === dsIndex) {
              if (options.all) {
                continue;
              }
              break;
            }
            otherValue = stack.values[datasetIndex];
            if (isNumberFinite(otherValue) && (singleMode || (value === 0 || sign(value) === sign(otherValue)))) {
              value += otherValue;
            }
          }
          return value;
        }
        function convertObjectDataToArray(data) {
          const keys = Object.keys(data);
          const adata = new Array(keys.length);
          let i, ilen, key;
          for (i = 0, ilen = keys.length; i < ilen; ++i) {
            key = keys[i];
            adata[i] = {
              x: key,
              y: data[key]
            };
          }
          return adata;
        }
        function isStacked(scale, meta) {
          const stacked = scale && scale.options.stacked;
          return stacked || stacked === void 0 && meta.stack !== void 0;
        }
        function getStackKey(indexScale, valueScale, meta) {
          return `${indexScale.id}.${valueScale.id}.${meta.stack || meta.type}`;
        }
        function getUserBounds(scale) {
          const { min, max, minDefined, maxDefined } = scale.getUserBounds();
          return {
            min: minDefined ? min : Number.NEGATIVE_INFINITY,
            max: maxDefined ? max : Number.POSITIVE_INFINITY
          };
        }
        function getOrCreateStack(stacks, stackKey, indexValue) {
          const subStack = stacks[stackKey] || (stacks[stackKey] = {});
          return subStack[indexValue] || (subStack[indexValue] = {});
        }
        function getLastIndexInStack(stack, vScale, positive, type) {
          for (const meta of vScale.getMatchingVisibleMetas(type).reverse()) {
            const value = stack[meta.index];
            if (positive && value > 0 || !positive && value < 0) {
              return meta.index;
            }
          }
          return null;
        }
        function updateStacks(controller, parsed) {
          const { chart, _cachedMeta: meta } = controller;
          const stacks = chart._stacks || (chart._stacks = {});
          const { iScale, vScale, index: datasetIndex } = meta;
          const iAxis = iScale.axis;
          const vAxis = vScale.axis;
          const key = getStackKey(iScale, vScale, meta);
          const ilen = parsed.length;
          let stack;
          for (let i = 0; i < ilen; ++i) {
            const item = parsed[i];
            const { [iAxis]: index2, [vAxis]: value } = item;
            const itemStacks = item._stacks || (item._stacks = {});
            stack = itemStacks[vAxis] = getOrCreateStack(stacks, key, index2);
            stack[datasetIndex] = value;
            stack._top = getLastIndexInStack(stack, vScale, true, meta.type);
            stack._bottom = getLastIndexInStack(stack, vScale, false, meta.type);
          }
        }
        function getFirstScaleId(chart, axis) {
          const scales2 = chart.scales;
          return Object.keys(scales2).filter((key) => scales2[key].axis === axis).shift();
        }
        function createDatasetContext(parent, index2) {
          return createContext(
            parent,
            {
              active: false,
              dataset: void 0,
              datasetIndex: index2,
              index: index2,
              mode: "default",
              type: "dataset"
            }
          );
        }
        function createDataContext(parent, index2, element) {
          return createContext(parent, {
            active: false,
            dataIndex: index2,
            parsed: void 0,
            raw: void 0,
            element,
            index: index2,
            mode: "default",
            type: "data"
          });
        }
        function clearStacks(meta, items) {
          const datasetIndex = meta.controller.index;
          const axis = meta.vScale && meta.vScale.axis;
          if (!axis) {
            return;
          }
          items = items || meta._parsed;
          for (const parsed of items) {
            const stacks = parsed._stacks;
            if (!stacks || stacks[axis] === void 0 || stacks[axis][datasetIndex] === void 0) {
              return;
            }
            delete stacks[axis][datasetIndex];
          }
        }
        const isDirectUpdateMode = (mode) => mode === "reset" || mode === "none";
        const cloneIfNotShared = (cached, shared) => shared ? cached : Object.assign({}, cached);
        const createStack = (canStack, meta, chart) => canStack && !meta.hidden && meta._stacked && { keys: getSortedDatasetIndices(chart, true), values: null };
        class DatasetController {
          constructor(chart, datasetIndex) {
            this.chart = chart;
            this._ctx = chart.ctx;
            this.index = datasetIndex;
            this._cachedDataOpts = {};
            this._cachedMeta = this.getMeta();
            this._type = this._cachedMeta.type;
            this.options = void 0;
            this._parsing = false;
            this._data = void 0;
            this._objectData = void 0;
            this._sharedOptions = void 0;
            this._drawStart = void 0;
            this._drawCount = void 0;
            this.enableOptionSharing = false;
            this.supportsDecimation = false;
            this.$context = void 0;
            this._syncList = [];
            this.initialize();
          }
          initialize() {
            const meta = this._cachedMeta;
            this.configure();
            this.linkScales();
            meta._stacked = isStacked(meta.vScale, meta);
            this.addElements();
          }
          updateIndex(datasetIndex) {
            if (this.index !== datasetIndex) {
              clearStacks(this._cachedMeta);
            }
            this.index = datasetIndex;
          }
          linkScales() {
            const chart = this.chart;
            const meta = this._cachedMeta;
            const dataset = this.getDataset();
            const chooseId = (axis, x, y, r) => axis === "x" ? x : axis === "r" ? r : y;
            const xid = meta.xAxisID = valueOrDefault(dataset.xAxisID, getFirstScaleId(chart, "x"));
            const yid = meta.yAxisID = valueOrDefault(dataset.yAxisID, getFirstScaleId(chart, "y"));
            const rid = meta.rAxisID = valueOrDefault(dataset.rAxisID, getFirstScaleId(chart, "r"));
            const indexAxis = meta.indexAxis;
            const iid = meta.iAxisID = chooseId(indexAxis, xid, yid, rid);
            const vid = meta.vAxisID = chooseId(indexAxis, yid, xid, rid);
            meta.xScale = this.getScaleForId(xid);
            meta.yScale = this.getScaleForId(yid);
            meta.rScale = this.getScaleForId(rid);
            meta.iScale = this.getScaleForId(iid);
            meta.vScale = this.getScaleForId(vid);
          }
          getDataset() {
            return this.chart.data.datasets[this.index];
          }
          getMeta() {
            return this.chart.getDatasetMeta(this.index);
          }
          getScaleForId(scaleID) {
            return this.chart.scales[scaleID];
          }
          _getOtherScale(scale) {
            const meta = this._cachedMeta;
            return scale === meta.iScale ? meta.vScale : meta.iScale;
          }
          reset() {
            this._update("reset");
          }
          _destroy() {
            const meta = this._cachedMeta;
            if (this._data) {
              unlistenArrayEvents(this._data, this);
            }
            if (meta._stacked) {
              clearStacks(meta);
            }
          }
          _dataCheck() {
            const dataset = this.getDataset();
            const data = dataset.data || (dataset.data = []);
            const _data = this._data;
            if (isObject(data)) {
              this._data = convertObjectDataToArray(data);
            } else if (_data !== data) {
              if (_data) {
                unlistenArrayEvents(_data, this);
                const meta = this._cachedMeta;
                clearStacks(meta);
                meta._parsed = [];
              }
              if (data && Object.isExtensible(data)) {
                listenArrayEvents(data, this);
              }
              this._syncList = [];
              this._data = data;
            }
          }
          addElements() {
            const meta = this._cachedMeta;
            this._dataCheck();
            if (this.datasetElementType) {
              meta.dataset = new this.datasetElementType();
            }
          }
          buildOrUpdateElements(resetNewElements) {
            const meta = this._cachedMeta;
            const dataset = this.getDataset();
            let stackChanged = false;
            this._dataCheck();
            const oldStacked = meta._stacked;
            meta._stacked = isStacked(meta.vScale, meta);
            if (meta.stack !== dataset.stack) {
              stackChanged = true;
              clearStacks(meta);
              meta.stack = dataset.stack;
            }
            this._resyncElements(resetNewElements);
            if (stackChanged || oldStacked !== meta._stacked) {
              updateStacks(this, meta._parsed);
            }
          }
          configure() {
            const config = this.chart.config;
            const scopeKeys = config.datasetScopeKeys(this._type);
            const scopes = config.getOptionScopes(this.getDataset(), scopeKeys, true);
            this.options = config.createResolver(scopes, this.getContext());
            this._parsing = this.options.parsing;
            this._cachedDataOpts = {};
          }
          parse(start, count) {
            const { _cachedMeta: meta, _data: data } = this;
            const { iScale, _stacked } = meta;
            const iAxis = iScale.axis;
            let sorted = start === 0 && count === data.length ? true : meta._sorted;
            let prev = start > 0 && meta._parsed[start - 1];
            let i, cur, parsed;
            if (this._parsing === false) {
              meta._parsed = data;
              meta._sorted = true;
              parsed = data;
            } else {
              if (isArray(data[start])) {
                parsed = this.parseArrayData(meta, data, start, count);
              } else if (isObject(data[start])) {
                parsed = this.parseObjectData(meta, data, start, count);
              } else {
                parsed = this.parsePrimitiveData(meta, data, start, count);
              }
              const isNotInOrderComparedToPrev = () => cur[iAxis] === null || prev && cur[iAxis] < prev[iAxis];
              for (i = 0; i < count; ++i) {
                meta._parsed[i + start] = cur = parsed[i];
                if (sorted) {
                  if (isNotInOrderComparedToPrev()) {
                    sorted = false;
                  }
                  prev = cur;
                }
              }
              meta._sorted = sorted;
            }
            if (_stacked) {
              updateStacks(this, parsed);
            }
          }
          parsePrimitiveData(meta, data, start, count) {
            const { iScale, vScale } = meta;
            const iAxis = iScale.axis;
            const vAxis = vScale.axis;
            const labels = iScale.getLabels();
            const singleScale = iScale === vScale;
            const parsed = new Array(count);
            let i, ilen, index2;
            for (i = 0, ilen = count; i < ilen; ++i) {
              index2 = i + start;
              parsed[i] = {
                [iAxis]: singleScale || iScale.parse(labels[index2], index2),
                [vAxis]: vScale.parse(data[index2], index2)
              };
            }
            return parsed;
          }
          parseArrayData(meta, data, start, count) {
            const { xScale, yScale } = meta;
            const parsed = new Array(count);
            let i, ilen, index2, item;
            for (i = 0, ilen = count; i < ilen; ++i) {
              index2 = i + start;
              item = data[index2];
              parsed[i] = {
                x: xScale.parse(item[0], index2),
                y: yScale.parse(item[1], index2)
              };
            }
            return parsed;
          }
          parseObjectData(meta, data, start, count) {
            const { xScale, yScale } = meta;
            const { xAxisKey = "x", yAxisKey = "y" } = this._parsing;
            const parsed = new Array(count);
            let i, ilen, index2, item;
            for (i = 0, ilen = count; i < ilen; ++i) {
              index2 = i + start;
              item = data[index2];
              parsed[i] = {
                x: xScale.parse(resolveObjectKey(item, xAxisKey), index2),
                y: yScale.parse(resolveObjectKey(item, yAxisKey), index2)
              };
            }
            return parsed;
          }
          getParsed(index2) {
            return this._cachedMeta._parsed[index2];
          }
          getDataElement(index2) {
            return this._cachedMeta.data[index2];
          }
          applyStack(scale, parsed, mode) {
            const chart = this.chart;
            const meta = this._cachedMeta;
            const value = parsed[scale.axis];
            const stack = {
              keys: getSortedDatasetIndices(chart, true),
              values: parsed._stacks[scale.axis]
            };
            return applyStack(stack, value, meta.index, { mode });
          }
          updateRangeFromParsed(range, scale, parsed, stack) {
            const parsedValue = parsed[scale.axis];
            let value = parsedValue === null ? NaN : parsedValue;
            const values = stack && parsed._stacks[scale.axis];
            if (stack && values) {
              stack.values = values;
              value = applyStack(stack, parsedValue, this._cachedMeta.index);
            }
            range.min = Math.min(range.min, value);
            range.max = Math.max(range.max, value);
          }
          getMinMax(scale, canStack) {
            const meta = this._cachedMeta;
            const _parsed = meta._parsed;
            const sorted = meta._sorted && scale === meta.iScale;
            const ilen = _parsed.length;
            const otherScale = this._getOtherScale(scale);
            const stack = createStack(canStack, meta, this.chart);
            const range = { min: Number.POSITIVE_INFINITY, max: Number.NEGATIVE_INFINITY };
            const { min: otherMin, max: otherMax } = getUserBounds(otherScale);
            let i, parsed;
            function _skip() {
              parsed = _parsed[i];
              const otherValue = parsed[otherScale.axis];
              return !isNumberFinite(parsed[scale.axis]) || otherMin > otherValue || otherMax < otherValue;
            }
            for (i = 0; i < ilen; ++i) {
              if (_skip()) {
                continue;
              }
              this.updateRangeFromParsed(range, scale, parsed, stack);
              if (sorted) {
                break;
              }
            }
            if (sorted) {
              for (i = ilen - 1; i >= 0; --i) {
                if (_skip()) {
                  continue;
                }
                this.updateRangeFromParsed(range, scale, parsed, stack);
                break;
              }
            }
            return range;
          }
          getAllParsedValues(scale) {
            const parsed = this._cachedMeta._parsed;
            const values = [];
            let i, ilen, value;
            for (i = 0, ilen = parsed.length; i < ilen; ++i) {
              value = parsed[i][scale.axis];
              if (isNumberFinite(value)) {
                values.push(value);
              }
            }
            return values;
          }
          getMaxOverflow() {
            return false;
          }
          getLabelAndValue(index2) {
            const meta = this._cachedMeta;
            const iScale = meta.iScale;
            const vScale = meta.vScale;
            const parsed = this.getParsed(index2);
            return {
              label: iScale ? "" + iScale.getLabelForValue(parsed[iScale.axis]) : "",
              value: vScale ? "" + vScale.getLabelForValue(parsed[vScale.axis]) : ""
            };
          }
          _update(mode) {
            const meta = this._cachedMeta;
            this.update(mode || "default");
            meta._clip = toClip(valueOrDefault(this.options.clip, defaultClip(meta.xScale, meta.yScale, this.getMaxOverflow())));
          }
          update(mode) {
          }
          draw() {
            const ctx = this._ctx;
            const chart = this.chart;
            const meta = this._cachedMeta;
            const elements2 = meta.data || [];
            const area = chart.chartArea;
            const active = [];
            const start = this._drawStart || 0;
            const count = this._drawCount || elements2.length - start;
            const drawActiveElementsOnTop = this.options.drawActiveElementsOnTop;
            let i;
            if (meta.dataset) {
              meta.dataset.draw(ctx, area, start, count);
            }
            for (i = start; i < start + count; ++i) {
              const element = elements2[i];
              if (element.hidden) {
                continue;
              }
              if (element.active && drawActiveElementsOnTop) {
                active.push(element);
              } else {
                element.draw(ctx, area);
              }
            }
            for (i = 0; i < active.length; ++i) {
              active[i].draw(ctx, area);
            }
          }
          getStyle(index2, active) {
            const mode = active ? "active" : "default";
            return index2 === void 0 && this._cachedMeta.dataset ? this.resolveDatasetElementOptions(mode) : this.resolveDataElementOptions(index2 || 0, mode);
          }
          getContext(index2, active, mode) {
            const dataset = this.getDataset();
            let context;
            if (index2 >= 0 && index2 < this._cachedMeta.data.length) {
              const element = this._cachedMeta.data[index2];
              context = element.$context || (element.$context = createDataContext(this.getContext(), index2, element));
              context.parsed = this.getParsed(index2);
              context.raw = dataset.data[index2];
              context.index = context.dataIndex = index2;
            } else {
              context = this.$context || (this.$context = createDatasetContext(this.chart.getContext(), this.index));
              context.dataset = dataset;
              context.index = context.datasetIndex = this.index;
            }
            context.active = !!active;
            context.mode = mode;
            return context;
          }
          resolveDatasetElementOptions(mode) {
            return this._resolveElementOptions(this.datasetElementType.id, mode);
          }
          resolveDataElementOptions(index2, mode) {
            return this._resolveElementOptions(this.dataElementType.id, mode, index2);
          }
          _resolveElementOptions(elementType, mode = "default", index2) {
            const active = mode === "active";
            const cache = this._cachedDataOpts;
            const cacheKey = elementType + "-" + mode;
            const cached = cache[cacheKey];
            const sharing = this.enableOptionSharing && defined(index2);
            if (cached) {
              return cloneIfNotShared(cached, sharing);
            }
            const config = this.chart.config;
            const scopeKeys = config.datasetElementScopeKeys(this._type, elementType);
            const prefixes = active ? [`${elementType}Hover`, "hover", elementType, ""] : [elementType, ""];
            const scopes = config.getOptionScopes(this.getDataset(), scopeKeys);
            const names2 = Object.keys(defaults.elements[elementType]);
            const context = () => this.getContext(index2, active);
            const values = config.resolveNamedOptions(scopes, names2, context, prefixes);
            if (values.$shared) {
              values.$shared = sharing;
              cache[cacheKey] = Object.freeze(cloneIfNotShared(values, sharing));
            }
            return values;
          }
          _resolveAnimations(index2, transition, active) {
            const chart = this.chart;
            const cache = this._cachedDataOpts;
            const cacheKey = `animation-${transition}`;
            const cached = cache[cacheKey];
            if (cached) {
              return cached;
            }
            let options;
            if (chart.options.animation !== false) {
              const config = this.chart.config;
              const scopeKeys = config.datasetAnimationScopeKeys(this._type, transition);
              const scopes = config.getOptionScopes(this.getDataset(), scopeKeys);
              options = config.createResolver(scopes, this.getContext(index2, active, transition));
            }
            const animations = new Animations(chart, options && options.animations);
            if (options && options._cacheable) {
              cache[cacheKey] = Object.freeze(animations);
            }
            return animations;
          }
          getSharedOptions(options) {
            if (!options.$shared) {
              return;
            }
            return this._sharedOptions || (this._sharedOptions = Object.assign({}, options));
          }
          includeOptions(mode, sharedOptions) {
            return !sharedOptions || isDirectUpdateMode(mode) || this.chart._animationsDisabled;
          }
          _getSharedOptions(start, mode) {
            const firstOpts = this.resolveDataElementOptions(start, mode);
            const previouslySharedOptions = this._sharedOptions;
            const sharedOptions = this.getSharedOptions(firstOpts);
            const includeOptions = this.includeOptions(mode, sharedOptions) || sharedOptions !== previouslySharedOptions;
            this.updateSharedOptions(sharedOptions, mode, firstOpts);
            return { sharedOptions, includeOptions };
          }
          updateElement(element, index2, properties, mode) {
            if (isDirectUpdateMode(mode)) {
              Object.assign(element, properties);
            } else {
              this._resolveAnimations(index2, mode).update(element, properties);
            }
          }
          updateSharedOptions(sharedOptions, mode, newOptions) {
            if (sharedOptions && !isDirectUpdateMode(mode)) {
              this._resolveAnimations(void 0, mode).update(sharedOptions, newOptions);
            }
          }
          _setStyle(element, index2, mode, active) {
            element.active = active;
            const options = this.getStyle(index2, active);
            this._resolveAnimations(index2, mode, active).update(element, {
              options: !active && this.getSharedOptions(options) || options
            });
          }
          removeHoverStyle(element, datasetIndex, index2) {
            this._setStyle(element, index2, "active", false);
          }
          setHoverStyle(element, datasetIndex, index2) {
            this._setStyle(element, index2, "active", true);
          }
          _removeDatasetHoverStyle() {
            const element = this._cachedMeta.dataset;
            if (element) {
              this._setStyle(element, void 0, "active", false);
            }
          }
          _setDatasetHoverStyle() {
            const element = this._cachedMeta.dataset;
            if (element) {
              this._setStyle(element, void 0, "active", true);
            }
          }
          _resyncElements(resetNewElements) {
            const data = this._data;
            const elements2 = this._cachedMeta.data;
            for (const [method, arg1, arg2] of this._syncList) {
              this[method](arg1, arg2);
            }
            this._syncList = [];
            const numMeta = elements2.length;
            const numData = data.length;
            const count = Math.min(numData, numMeta);
            if (count) {
              this.parse(0, count);
            }
            if (numData > numMeta) {
              this._insertElements(numMeta, numData - numMeta, resetNewElements);
            } else if (numData < numMeta) {
              this._removeElements(numData, numMeta - numData);
            }
          }
          _insertElements(start, count, resetNewElements = true) {
            const meta = this._cachedMeta;
            const data = meta.data;
            const end = start + count;
            let i;
            const move = (arr) => {
              arr.length += count;
              for (i = arr.length - 1; i >= end; i--) {
                arr[i] = arr[i - count];
              }
            };
            move(data);
            for (i = start; i < end; ++i) {
              data[i] = new this.dataElementType();
            }
            if (this._parsing) {
              move(meta._parsed);
            }
            this.parse(start, count);
            if (resetNewElements) {
              this.updateElements(data, start, count, "reset");
            }
          }
          updateElements(element, start, count, mode) {
          }
          _removeElements(start, count) {
            const meta = this._cachedMeta;
            if (this._parsing) {
              const removed = meta._parsed.splice(start, count);
              if (meta._stacked) {
                clearStacks(meta, removed);
              }
            }
            meta.data.splice(start, count);
          }
          _sync(args) {
            if (this._parsing) {
              this._syncList.push(args);
            } else {
              const [method, arg1, arg2] = args;
              this[method](arg1, arg2);
            }
            this.chart._dataChanges.push([this.index, ...args]);
          }
          _onDataPush() {
            const count = arguments.length;
            this._sync(["_insertElements", this.getDataset().data.length - count, count]);
          }
          _onDataPop() {
            this._sync(["_removeElements", this._cachedMeta.data.length - 1, 1]);
          }
          _onDataShift() {
            this._sync(["_removeElements", 0, 1]);
          }
          _onDataSplice(start, count) {
            if (count) {
              this._sync(["_removeElements", start, count]);
            }
            const newCount = arguments.length - 2;
            if (newCount) {
              this._sync(["_insertElements", start, newCount]);
            }
          }
          _onDataUnshift() {
            this._sync(["_insertElements", 0, arguments.length]);
          }
        }
        DatasetController.defaults = {};
        DatasetController.prototype.datasetElementType = null;
        DatasetController.prototype.dataElementType = null;
        class Element {
          constructor() {
            this.x = void 0;
            this.y = void 0;
            this.active = false;
            this.options = void 0;
            this.$animations = void 0;
          }
          tooltipPosition(useFinalPosition) {
            const { x, y } = this.getProps(["x", "y"], useFinalPosition);
            return { x, y };
          }
          hasValue() {
            return isNumber(this.x) && isNumber(this.y);
          }
          getProps(props, final) {
            const anims = this.$animations;
            if (!final || !anims) {
              return this;
            }
            const ret = {};
            props.forEach((prop) => {
              ret[prop] = anims[prop] && anims[prop].active() ? anims[prop]._to : this[prop];
            });
            return ret;
          }
        }
        Element.defaults = {};
        Element.defaultRoutes = void 0;
        const formatters = {
          values(value) {
            return isArray(value) ? value : "" + value;
          },
          numeric(tickValue, index2, ticks) {
            if (tickValue === 0) {
              return "0";
            }
            const locale = this.chart.options.locale;
            let notation;
            let delta = tickValue;
            if (ticks.length > 1) {
              const maxTick = Math.max(Math.abs(ticks[0].value), Math.abs(ticks[ticks.length - 1].value));
              if (maxTick < 1e-4 || maxTick > 1e15) {
                notation = "scientific";
              }
              delta = calculateDelta(tickValue, ticks);
            }
            const logDelta = log10(Math.abs(delta));
            const numDecimal = Math.max(Math.min(-1 * Math.floor(logDelta), 20), 0);
            const options = { notation, minimumFractionDigits: numDecimal, maximumFractionDigits: numDecimal };
            Object.assign(options, this.options.ticks.format);
            return formatNumber(tickValue, locale, options);
          },
          logarithmic(tickValue, index2, ticks) {
            if (tickValue === 0) {
              return "0";
            }
            const remain = tickValue / Math.pow(10, Math.floor(log10(tickValue)));
            if (remain === 1 || remain === 2 || remain === 5) {
              return formatters.numeric.call(this, tickValue, index2, ticks);
            }
            return "";
          }
        };
        function calculateDelta(tickValue, ticks) {
          let delta = ticks.length > 3 ? ticks[2].value - ticks[1].value : ticks[1].value - ticks[0].value;
          if (Math.abs(delta) >= 1 && tickValue !== Math.floor(tickValue)) {
            delta = tickValue - Math.floor(tickValue);
          }
          return delta;
        }
        var Ticks = { formatters };
        defaults.set("scale", {
          display: true,
          offset: false,
          reverse: false,
          beginAtZero: false,
          bounds: "ticks",
          grace: 0,
          grid: {
            display: true,
            lineWidth: 1,
            drawBorder: true,
            drawOnChartArea: true,
            drawTicks: true,
            tickLength: 8,
            tickWidth: (_ctx, options) => options.lineWidth,
            tickColor: (_ctx, options) => options.color,
            offset: false,
            borderDash: [],
            borderDashOffset: 0,
            borderWidth: 1
          },
          title: {
            display: false,
            text: "",
            padding: {
              top: 4,
              bottom: 4
            }
          },
          ticks: {
            minRotation: 0,
            maxRotation: 50,
            mirror: false,
            textStrokeWidth: 0,
            textStrokeColor: "",
            padding: 3,
            display: true,
            autoSkip: true,
            autoSkipPadding: 3,
            labelOffset: 0,
            callback: Ticks.formatters.values,
            minor: {},
            major: {},
            align: "center",
            crossAlign: "near",
            showLabelBackdrop: false,
            backdropColor: "rgba(255, 255, 255, 0.75)",
            backdropPadding: 2
          }
        });
        defaults.route("scale.ticks", "color", "", "color");
        defaults.route("scale.grid", "color", "", "borderColor");
        defaults.route("scale.grid", "borderColor", "", "borderColor");
        defaults.route("scale.title", "color", "", "color");
        defaults.describe("scale", {
          _fallback: false,
          _scriptable: (name) => !name.startsWith("before") && !name.startsWith("after") && name !== "callback" && name !== "parser",
          _indexable: (name) => name !== "borderDash" && name !== "tickBorderDash"
        });
        defaults.describe("scales", {
          _fallback: "scale"
        });
        defaults.describe("scale.ticks", {
          _scriptable: (name) => name !== "backdropPadding" && name !== "callback",
          _indexable: (name) => name !== "backdropPadding"
        });
        function autoSkip(scale, ticks) {
          const tickOpts = scale.options.ticks;
          const ticksLimit = tickOpts.maxTicksLimit || determineMaxTicks(scale);
          const majorIndices = tickOpts.major.enabled ? getMajorIndices(ticks) : [];
          const numMajorIndices = majorIndices.length;
          const first = majorIndices[0];
          const last = majorIndices[numMajorIndices - 1];
          const newTicks = [];
          if (numMajorIndices > ticksLimit) {
            skipMajors(ticks, newTicks, majorIndices, numMajorIndices / ticksLimit);
            return newTicks;
          }
          const spacing = calculateSpacing(majorIndices, ticks, ticksLimit);
          if (numMajorIndices > 0) {
            let i, ilen;
            const avgMajorSpacing = numMajorIndices > 1 ? Math.round((last - first) / (numMajorIndices - 1)) : null;
            skip(ticks, newTicks, spacing, isNullOrUndef(avgMajorSpacing) ? 0 : first - avgMajorSpacing, first);
            for (i = 0, ilen = numMajorIndices - 1; i < ilen; i++) {
              skip(ticks, newTicks, spacing, majorIndices[i], majorIndices[i + 1]);
            }
            skip(ticks, newTicks, spacing, last, isNullOrUndef(avgMajorSpacing) ? ticks.length : last + avgMajorSpacing);
            return newTicks;
          }
          skip(ticks, newTicks, spacing);
          return newTicks;
        }
        function determineMaxTicks(scale) {
          const offset = scale.options.offset;
          const tickLength = scale._tickSize();
          const maxScale = scale._length / tickLength + (offset ? 0 : 1);
          const maxChart = scale._maxLength / tickLength;
          return Math.floor(Math.min(maxScale, maxChart));
        }
        function calculateSpacing(majorIndices, ticks, ticksLimit) {
          const evenMajorSpacing = getEvenSpacing(majorIndices);
          const spacing = ticks.length / ticksLimit;
          if (!evenMajorSpacing) {
            return Math.max(spacing, 1);
          }
          const factors = _factorize(evenMajorSpacing);
          for (let i = 0, ilen = factors.length - 1; i < ilen; i++) {
            const factor = factors[i];
            if (factor > spacing) {
              return factor;
            }
          }
          return Math.max(spacing, 1);
        }
        function getMajorIndices(ticks) {
          const result = [];
          let i, ilen;
          for (i = 0, ilen = ticks.length; i < ilen; i++) {
            if (ticks[i].major) {
              result.push(i);
            }
          }
          return result;
        }
        function skipMajors(ticks, newTicks, majorIndices, spacing) {
          let count = 0;
          let next = majorIndices[0];
          let i;
          spacing = Math.ceil(spacing);
          for (i = 0; i < ticks.length; i++) {
            if (i === next) {
              newTicks.push(ticks[i]);
              count++;
              next = majorIndices[count * spacing];
            }
          }
        }
        function skip(ticks, newTicks, spacing, majorStart, majorEnd) {
          const start = valueOrDefault(majorStart, 0);
          const end = Math.min(valueOrDefault(majorEnd, ticks.length), ticks.length);
          let count = 0;
          let length, i, next;
          spacing = Math.ceil(spacing);
          if (majorEnd) {
            length = majorEnd - majorStart;
            spacing = length / Math.floor(length / spacing);
          }
          next = start;
          while (next < 0) {
            count++;
            next = Math.round(start + count * spacing);
          }
          for (i = Math.max(start, 0); i < end; i++) {
            if (i === next) {
              newTicks.push(ticks[i]);
              count++;
              next = Math.round(start + count * spacing);
            }
          }
        }
        function getEvenSpacing(arr) {
          const len = arr.length;
          let i, diff;
          if (len < 2) {
            return false;
          }
          for (diff = arr[0], i = 1; i < len; ++i) {
            if (arr[i] - arr[i - 1] !== diff) {
              return false;
            }
          }
          return diff;
        }
        const reverseAlign = (align) => align === "left" ? "right" : align === "right" ? "left" : align;
        const offsetFromEdge = (scale, edge, offset) => edge === "top" || edge === "left" ? scale[edge] + offset : scale[edge] - offset;
        function sample(arr, numItems) {
          const result = [];
          const increment = arr.length / numItems;
          const len = arr.length;
          let i = 0;
          for (; i < len; i += increment) {
            result.push(arr[Math.floor(i)]);
          }
          return result;
        }
        function getPixelForGridLine(scale, index2, offsetGridLines) {
          const length = scale.ticks.length;
          const validIndex2 = Math.min(index2, length - 1);
          const start = scale._startPixel;
          const end = scale._endPixel;
          const epsilon = 1e-6;
          let lineValue = scale.getPixelForTick(validIndex2);
          let offset;
          if (offsetGridLines) {
            if (length === 1) {
              offset = Math.max(lineValue - start, end - lineValue);
            } else if (index2 === 0) {
              offset = (scale.getPixelForTick(1) - lineValue) / 2;
            } else {
              offset = (lineValue - scale.getPixelForTick(validIndex2 - 1)) / 2;
            }
            lineValue += validIndex2 < index2 ? offset : -offset;
            if (lineValue < start - epsilon || lineValue > end + epsilon) {
              return;
            }
          }
          return lineValue;
        }
        function garbageCollect(caches, length) {
          each(caches, (cache) => {
            const gc = cache.gc;
            const gcLen = gc.length / 2;
            let i;
            if (gcLen > length) {
              for (i = 0; i < gcLen; ++i) {
                delete cache.data[gc[i]];
              }
              gc.splice(0, gcLen);
            }
          });
        }
        function getTickMarkLength(options) {
          return options.drawTicks ? options.tickLength : 0;
        }
        function getTitleHeight(options, fallback) {
          if (!options.display) {
            return 0;
          }
          const font = toFont(options.font, fallback);
          const padding = toPadding(options.padding);
          const lines = isArray(options.text) ? options.text.length : 1;
          return lines * font.lineHeight + padding.height;
        }
        function createScaleContext(parent, scale) {
          return createContext(parent, {
            scale,
            type: "scale"
          });
        }
        function createTickContext(parent, index2, tick) {
          return createContext(parent, {
            tick,
            index: index2,
            type: "tick"
          });
        }
        function titleAlign(align, position, reverse) {
          let ret = _toLeftRightCenter(align);
          if (reverse && position !== "right" || !reverse && position === "right") {
            ret = reverseAlign(ret);
          }
          return ret;
        }
        function titleArgs(scale, offset, position, align) {
          const { top, left, bottom, right, chart } = scale;
          const { chartArea, scales: scales2 } = chart;
          let rotation = 0;
          let maxWidth, titleX, titleY;
          const height = bottom - top;
          const width = right - left;
          if (scale.isHorizontal()) {
            titleX = _alignStartEnd(align, left, right);
            if (isObject(position)) {
              const positionAxisID = Object.keys(position)[0];
              const value = position[positionAxisID];
              titleY = scales2[positionAxisID].getPixelForValue(value) + height - offset;
            } else if (position === "center") {
              titleY = (chartArea.bottom + chartArea.top) / 2 + height - offset;
            } else {
              titleY = offsetFromEdge(scale, position, offset);
            }
            maxWidth = right - left;
          } else {
            if (isObject(position)) {
              const positionAxisID = Object.keys(position)[0];
              const value = position[positionAxisID];
              titleX = scales2[positionAxisID].getPixelForValue(value) - width + offset;
            } else if (position === "center") {
              titleX = (chartArea.left + chartArea.right) / 2 - width + offset;
            } else {
              titleX = offsetFromEdge(scale, position, offset);
            }
            titleY = _alignStartEnd(align, bottom, top);
            rotation = position === "left" ? -HALF_PI : HALF_PI;
          }
          return { titleX, titleY, maxWidth, rotation };
        }
        class Scale extends Element {
          constructor(cfg) {
            super();
            this.id = cfg.id;
            this.type = cfg.type;
            this.options = void 0;
            this.ctx = cfg.ctx;
            this.chart = cfg.chart;
            this.top = void 0;
            this.bottom = void 0;
            this.left = void 0;
            this.right = void 0;
            this.width = void 0;
            this.height = void 0;
            this._margins = {
              left: 0,
              right: 0,
              top: 0,
              bottom: 0
            };
            this.maxWidth = void 0;
            this.maxHeight = void 0;
            this.paddingTop = void 0;
            this.paddingBottom = void 0;
            this.paddingLeft = void 0;
            this.paddingRight = void 0;
            this.axis = void 0;
            this.labelRotation = void 0;
            this.min = void 0;
            this.max = void 0;
            this._range = void 0;
            this.ticks = [];
            this._gridLineItems = null;
            this._labelItems = null;
            this._labelSizes = null;
            this._length = 0;
            this._maxLength = 0;
            this._longestTextCache = {};
            this._startPixel = void 0;
            this._endPixel = void 0;
            this._reversePixels = false;
            this._userMax = void 0;
            this._userMin = void 0;
            this._suggestedMax = void 0;
            this._suggestedMin = void 0;
            this._ticksLength = 0;
            this._borderValue = 0;
            this._cache = {};
            this._dataLimitsCached = false;
            this.$context = void 0;
          }
          init(options) {
            this.options = options.setContext(this.getContext());
            this.axis = options.axis;
            this._userMin = this.parse(options.min);
            this._userMax = this.parse(options.max);
            this._suggestedMin = this.parse(options.suggestedMin);
            this._suggestedMax = this.parse(options.suggestedMax);
          }
          parse(raw, index2) {
            return raw;
          }
          getUserBounds() {
            let { _userMin, _userMax, _suggestedMin, _suggestedMax } = this;
            _userMin = finiteOrDefault(_userMin, Number.POSITIVE_INFINITY);
            _userMax = finiteOrDefault(_userMax, Number.NEGATIVE_INFINITY);
            _suggestedMin = finiteOrDefault(_suggestedMin, Number.POSITIVE_INFINITY);
            _suggestedMax = finiteOrDefault(_suggestedMax, Number.NEGATIVE_INFINITY);
            return {
              min: finiteOrDefault(_userMin, _suggestedMin),
              max: finiteOrDefault(_userMax, _suggestedMax),
              minDefined: isNumberFinite(_userMin),
              maxDefined: isNumberFinite(_userMax)
            };
          }
          getMinMax(canStack) {
            let { min, max, minDefined, maxDefined } = this.getUserBounds();
            let range;
            if (minDefined && maxDefined) {
              return { min, max };
            }
            const metas = this.getMatchingVisibleMetas();
            for (let i = 0, ilen = metas.length; i < ilen; ++i) {
              range = metas[i].controller.getMinMax(this, canStack);
              if (!minDefined) {
                min = Math.min(min, range.min);
              }
              if (!maxDefined) {
                max = Math.max(max, range.max);
              }
            }
            min = maxDefined && min > max ? max : min;
            max = minDefined && min > max ? min : max;
            return {
              min: finiteOrDefault(min, finiteOrDefault(max, min)),
              max: finiteOrDefault(max, finiteOrDefault(min, max))
            };
          }
          getPadding() {
            return {
              left: this.paddingLeft || 0,
              top: this.paddingTop || 0,
              right: this.paddingRight || 0,
              bottom: this.paddingBottom || 0
            };
          }
          getTicks() {
            return this.ticks;
          }
          getLabels() {
            const data = this.chart.data;
            return this.options.labels || (this.isHorizontal() ? data.xLabels : data.yLabels) || data.labels || [];
          }
          beforeLayout() {
            this._cache = {};
            this._dataLimitsCached = false;
          }
          beforeUpdate() {
            callback(this.options.beforeUpdate, [this]);
          }
          update(maxWidth, maxHeight, margins) {
            const { beginAtZero, grace, ticks: tickOpts } = this.options;
            const sampleSize = tickOpts.sampleSize;
            this.beforeUpdate();
            this.maxWidth = maxWidth;
            this.maxHeight = maxHeight;
            this._margins = margins = Object.assign({
              left: 0,
              right: 0,
              top: 0,
              bottom: 0
            }, margins);
            this.ticks = null;
            this._labelSizes = null;
            this._gridLineItems = null;
            this._labelItems = null;
            this.beforeSetDimensions();
            this.setDimensions();
            this.afterSetDimensions();
            this._maxLength = this.isHorizontal() ? this.width + margins.left + margins.right : this.height + margins.top + margins.bottom;
            if (!this._dataLimitsCached) {
              this.beforeDataLimits();
              this.determineDataLimits();
              this.afterDataLimits();
              this._range = _addGrace(this, grace, beginAtZero);
              this._dataLimitsCached = true;
            }
            this.beforeBuildTicks();
            this.ticks = this.buildTicks() || [];
            this.afterBuildTicks();
            const samplingEnabled = sampleSize < this.ticks.length;
            this._convertTicksToLabels(samplingEnabled ? sample(this.ticks, sampleSize) : this.ticks);
            this.configure();
            this.beforeCalculateLabelRotation();
            this.calculateLabelRotation();
            this.afterCalculateLabelRotation();
            if (tickOpts.display && (tickOpts.autoSkip || tickOpts.source === "auto")) {
              this.ticks = autoSkip(this, this.ticks);
              this._labelSizes = null;
              this.afterAutoSkip();
            }
            if (samplingEnabled) {
              this._convertTicksToLabels(this.ticks);
            }
            this.beforeFit();
            this.fit();
            this.afterFit();
            this.afterUpdate();
          }
          configure() {
            let reversePixels = this.options.reverse;
            let startPixel, endPixel;
            if (this.isHorizontal()) {
              startPixel = this.left;
              endPixel = this.right;
            } else {
              startPixel = this.top;
              endPixel = this.bottom;
              reversePixels = !reversePixels;
            }
            this._startPixel = startPixel;
            this._endPixel = endPixel;
            this._reversePixels = reversePixels;
            this._length = endPixel - startPixel;
            this._alignToPixels = this.options.alignToPixels;
          }
          afterUpdate() {
            callback(this.options.afterUpdate, [this]);
          }
          beforeSetDimensions() {
            callback(this.options.beforeSetDimensions, [this]);
          }
          setDimensions() {
            if (this.isHorizontal()) {
              this.width = this.maxWidth;
              this.left = 0;
              this.right = this.width;
            } else {
              this.height = this.maxHeight;
              this.top = 0;
              this.bottom = this.height;
            }
            this.paddingLeft = 0;
            this.paddingTop = 0;
            this.paddingRight = 0;
            this.paddingBottom = 0;
          }
          afterSetDimensions() {
            callback(this.options.afterSetDimensions, [this]);
          }
          _callHooks(name) {
            this.chart.notifyPlugins(name, this.getContext());
            callback(this.options[name], [this]);
          }
          beforeDataLimits() {
            this._callHooks("beforeDataLimits");
          }
          determineDataLimits() {
          }
          afterDataLimits() {
            this._callHooks("afterDataLimits");
          }
          beforeBuildTicks() {
            this._callHooks("beforeBuildTicks");
          }
          buildTicks() {
            return [];
          }
          afterBuildTicks() {
            this._callHooks("afterBuildTicks");
          }
          beforeTickToLabelConversion() {
            callback(this.options.beforeTickToLabelConversion, [this]);
          }
          generateTickLabels(ticks) {
            const tickOpts = this.options.ticks;
            let i, ilen, tick;
            for (i = 0, ilen = ticks.length; i < ilen; i++) {
              tick = ticks[i];
              tick.label = callback(tickOpts.callback, [tick.value, i, ticks], this);
            }
          }
          afterTickToLabelConversion() {
            callback(this.options.afterTickToLabelConversion, [this]);
          }
          beforeCalculateLabelRotation() {
            callback(this.options.beforeCalculateLabelRotation, [this]);
          }
          calculateLabelRotation() {
            const options = this.options;
            const tickOpts = options.ticks;
            const numTicks = this.ticks.length;
            const minRotation = tickOpts.minRotation || 0;
            const maxRotation = tickOpts.maxRotation;
            let labelRotation = minRotation;
            let tickWidth, maxHeight, maxLabelDiagonal;
            if (!this._isVisible() || !tickOpts.display || minRotation >= maxRotation || numTicks <= 1 || !this.isHorizontal()) {
              this.labelRotation = minRotation;
              return;
            }
            const labelSizes = this._getLabelSizes();
            const maxLabelWidth = labelSizes.widest.width;
            const maxLabelHeight = labelSizes.highest.height;
            const maxWidth = _limitValue(this.chart.width - maxLabelWidth, 0, this.maxWidth);
            tickWidth = options.offset ? this.maxWidth / numTicks : maxWidth / (numTicks - 1);
            if (maxLabelWidth + 6 > tickWidth) {
              tickWidth = maxWidth / (numTicks - (options.offset ? 0.5 : 1));
              maxHeight = this.maxHeight - getTickMarkLength(options.grid) - tickOpts.padding - getTitleHeight(options.title, this.chart.options.font);
              maxLabelDiagonal = Math.sqrt(maxLabelWidth * maxLabelWidth + maxLabelHeight * maxLabelHeight);
              labelRotation = toDegrees(Math.min(
                Math.asin(_limitValue((labelSizes.highest.height + 6) / tickWidth, -1, 1)),
                Math.asin(_limitValue(maxHeight / maxLabelDiagonal, -1, 1)) - Math.asin(_limitValue(maxLabelHeight / maxLabelDiagonal, -1, 1))
              ));
              labelRotation = Math.max(minRotation, Math.min(maxRotation, labelRotation));
            }
            this.labelRotation = labelRotation;
          }
          afterCalculateLabelRotation() {
            callback(this.options.afterCalculateLabelRotation, [this]);
          }
          afterAutoSkip() {
          }
          beforeFit() {
            callback(this.options.beforeFit, [this]);
          }
          fit() {
            const minSize = {
              width: 0,
              height: 0
            };
            const { chart, options: { ticks: tickOpts, title: titleOpts, grid: gridOpts } } = this;
            const display = this._isVisible();
            const isHorizontal = this.isHorizontal();
            if (display) {
              const titleHeight = getTitleHeight(titleOpts, chart.options.font);
              if (isHorizontal) {
                minSize.width = this.maxWidth;
                minSize.height = getTickMarkLength(gridOpts) + titleHeight;
              } else {
                minSize.height = this.maxHeight;
                minSize.width = getTickMarkLength(gridOpts) + titleHeight;
              }
              if (tickOpts.display && this.ticks.length) {
                const { first, last, widest, highest } = this._getLabelSizes();
                const tickPadding = tickOpts.padding * 2;
                const angleRadians = toRadians(this.labelRotation);
                const cos = Math.cos(angleRadians);
                const sin = Math.sin(angleRadians);
                if (isHorizontal) {
                  const labelHeight = tickOpts.mirror ? 0 : sin * widest.width + cos * highest.height;
                  minSize.height = Math.min(this.maxHeight, minSize.height + labelHeight + tickPadding);
                } else {
                  const labelWidth = tickOpts.mirror ? 0 : cos * widest.width + sin * highest.height;
                  minSize.width = Math.min(this.maxWidth, minSize.width + labelWidth + tickPadding);
                }
                this._calculatePadding(first, last, sin, cos);
              }
            }
            this._handleMargins();
            if (isHorizontal) {
              this.width = this._length = chart.width - this._margins.left - this._margins.right;
              this.height = minSize.height;
            } else {
              this.width = minSize.width;
              this.height = this._length = chart.height - this._margins.top - this._margins.bottom;
            }
          }
          _calculatePadding(first, last, sin, cos) {
            const { ticks: { align, padding }, position } = this.options;
            const isRotated = this.labelRotation !== 0;
            const labelsBelowTicks = position !== "top" && this.axis === "x";
            if (this.isHorizontal()) {
              const offsetLeft = this.getPixelForTick(0) - this.left;
              const offsetRight = this.right - this.getPixelForTick(this.ticks.length - 1);
              let paddingLeft = 0;
              let paddingRight = 0;
              if (isRotated) {
                if (labelsBelowTicks) {
                  paddingLeft = cos * first.width;
                  paddingRight = sin * last.height;
                } else {
                  paddingLeft = sin * first.height;
                  paddingRight = cos * last.width;
                }
              } else if (align === "start") {
                paddingRight = last.width;
              } else if (align === "end") {
                paddingLeft = first.width;
              } else if (align !== "inner") {
                paddingLeft = first.width / 2;
                paddingRight = last.width / 2;
              }
              this.paddingLeft = Math.max((paddingLeft - offsetLeft + padding) * this.width / (this.width - offsetLeft), 0);
              this.paddingRight = Math.max((paddingRight - offsetRight + padding) * this.width / (this.width - offsetRight), 0);
            } else {
              let paddingTop = last.height / 2;
              let paddingBottom = first.height / 2;
              if (align === "start") {
                paddingTop = 0;
                paddingBottom = first.height;
              } else if (align === "end") {
                paddingTop = last.height;
                paddingBottom = 0;
              }
              this.paddingTop = paddingTop + padding;
              this.paddingBottom = paddingBottom + padding;
            }
          }
          _handleMargins() {
            if (this._margins) {
              this._margins.left = Math.max(this.paddingLeft, this._margins.left);
              this._margins.top = Math.max(this.paddingTop, this._margins.top);
              this._margins.right = Math.max(this.paddingRight, this._margins.right);
              this._margins.bottom = Math.max(this.paddingBottom, this._margins.bottom);
            }
          }
          afterFit() {
            callback(this.options.afterFit, [this]);
          }
          isHorizontal() {
            const { axis, position } = this.options;
            return position === "top" || position === "bottom" || axis === "x";
          }
          isFullSize() {
            return this.options.fullSize;
          }
          _convertTicksToLabels(ticks) {
            this.beforeTickToLabelConversion();
            this.generateTickLabels(ticks);
            let i, ilen;
            for (i = 0, ilen = ticks.length; i < ilen; i++) {
              if (isNullOrUndef(ticks[i].label)) {
                ticks.splice(i, 1);
                ilen--;
                i--;
              }
            }
            this.afterTickToLabelConversion();
          }
          _getLabelSizes() {
            let labelSizes = this._labelSizes;
            if (!labelSizes) {
              const sampleSize = this.options.ticks.sampleSize;
              let ticks = this.ticks;
              if (sampleSize < ticks.length) {
                ticks = sample(ticks, sampleSize);
              }
              this._labelSizes = labelSizes = this._computeLabelSizes(ticks, ticks.length);
            }
            return labelSizes;
          }
          _computeLabelSizes(ticks, length) {
            const { ctx, _longestTextCache: caches } = this;
            const widths = [];
            const heights = [];
            let widestLabelSize = 0;
            let highestLabelSize = 0;
            let i, j, jlen, label, tickFont, fontString2, cache, lineHeight, width, height, nestedLabel;
            for (i = 0; i < length; ++i) {
              label = ticks[i].label;
              tickFont = this._resolveTickFontOptions(i);
              ctx.font = fontString2 = tickFont.string;
              cache = caches[fontString2] = caches[fontString2] || { data: {}, gc: [] };
              lineHeight = tickFont.lineHeight;
              width = height = 0;
              if (!isNullOrUndef(label) && !isArray(label)) {
                width = _measureText(ctx, cache.data, cache.gc, width, label);
                height = lineHeight;
              } else if (isArray(label)) {
                for (j = 0, jlen = label.length; j < jlen; ++j) {
                  nestedLabel = label[j];
                  if (!isNullOrUndef(nestedLabel) && !isArray(nestedLabel)) {
                    width = _measureText(ctx, cache.data, cache.gc, width, nestedLabel);
                    height += lineHeight;
                  }
                }
              }
              widths.push(width);
              heights.push(height);
              widestLabelSize = Math.max(width, widestLabelSize);
              highestLabelSize = Math.max(height, highestLabelSize);
            }
            garbageCollect(caches, length);
            const widest = widths.indexOf(widestLabelSize);
            const highest = heights.indexOf(highestLabelSize);
            const valueAt = (idx) => ({ width: widths[idx] || 0, height: heights[idx] || 0 });
            return {
              first: valueAt(0),
              last: valueAt(length - 1),
              widest: valueAt(widest),
              highest: valueAt(highest),
              widths,
              heights
            };
          }
          getLabelForValue(value) {
            return value;
          }
          getPixelForValue(value, index2) {
            return NaN;
          }
          getValueForPixel(pixel) {
          }
          getPixelForTick(index2) {
            const ticks = this.ticks;
            if (index2 < 0 || index2 > ticks.length - 1) {
              return null;
            }
            return this.getPixelForValue(ticks[index2].value);
          }
          getPixelForDecimal(decimal) {
            if (this._reversePixels) {
              decimal = 1 - decimal;
            }
            const pixel = this._startPixel + decimal * this._length;
            return _int16Range(this._alignToPixels ? _alignPixel(this.chart, pixel, 0) : pixel);
          }
          getDecimalForPixel(pixel) {
            const decimal = (pixel - this._startPixel) / this._length;
            return this._reversePixels ? 1 - decimal : decimal;
          }
          getBasePixel() {
            return this.getPixelForValue(this.getBaseValue());
          }
          getBaseValue() {
            const { min, max } = this;
            return min < 0 && max < 0 ? max : min > 0 && max > 0 ? min : 0;
          }
          getContext(index2) {
            const ticks = this.ticks || [];
            if (index2 >= 0 && index2 < ticks.length) {
              const tick = ticks[index2];
              return tick.$context || (tick.$context = createTickContext(this.getContext(), index2, tick));
            }
            return this.$context || (this.$context = createScaleContext(this.chart.getContext(), this));
          }
          _tickSize() {
            const optionTicks = this.options.ticks;
            const rot = toRadians(this.labelRotation);
            const cos = Math.abs(Math.cos(rot));
            const sin = Math.abs(Math.sin(rot));
            const labelSizes = this._getLabelSizes();
            const padding = optionTicks.autoSkipPadding || 0;
            const w = labelSizes ? labelSizes.widest.width + padding : 0;
            const h = labelSizes ? labelSizes.highest.height + padding : 0;
            return this.isHorizontal() ? h * cos > w * sin ? w / cos : h / sin : h * sin < w * cos ? h / cos : w / sin;
          }
          _isVisible() {
            const display = this.options.display;
            if (display !== "auto") {
              return !!display;
            }
            return this.getMatchingVisibleMetas().length > 0;
          }
          _computeGridLineItems(chartArea) {
            const axis = this.axis;
            const chart = this.chart;
            const options = this.options;
            const { grid, position } = options;
            const offset = grid.offset;
            const isHorizontal = this.isHorizontal();
            const ticks = this.ticks;
            const ticksLength = ticks.length + (offset ? 1 : 0);
            const tl = getTickMarkLength(grid);
            const items = [];
            const borderOpts = grid.setContext(this.getContext());
            const axisWidth = borderOpts.drawBorder ? borderOpts.borderWidth : 0;
            const axisHalfWidth = axisWidth / 2;
            const alignBorderValue = function(pixel) {
              return _alignPixel(chart, pixel, axisWidth);
            };
            let borderValue, i, lineValue, alignedLineValue;
            let tx1, ty1, tx2, ty2, x1, y1, x2, y2;
            if (position === "top") {
              borderValue = alignBorderValue(this.bottom);
              ty1 = this.bottom - tl;
              ty2 = borderValue - axisHalfWidth;
              y1 = alignBorderValue(chartArea.top) + axisHalfWidth;
              y2 = chartArea.bottom;
            } else if (position === "bottom") {
              borderValue = alignBorderValue(this.top);
              y1 = chartArea.top;
              y2 = alignBorderValue(chartArea.bottom) - axisHalfWidth;
              ty1 = borderValue + axisHalfWidth;
              ty2 = this.top + tl;
            } else if (position === "left") {
              borderValue = alignBorderValue(this.right);
              tx1 = this.right - tl;
              tx2 = borderValue - axisHalfWidth;
              x1 = alignBorderValue(chartArea.left) + axisHalfWidth;
              x2 = chartArea.right;
            } else if (position === "right") {
              borderValue = alignBorderValue(this.left);
              x1 = chartArea.left;
              x2 = alignBorderValue(chartArea.right) - axisHalfWidth;
              tx1 = borderValue + axisHalfWidth;
              tx2 = this.left + tl;
            } else if (axis === "x") {
              if (position === "center") {
                borderValue = alignBorderValue((chartArea.top + chartArea.bottom) / 2 + 0.5);
              } else if (isObject(position)) {
                const positionAxisID = Object.keys(position)[0];
                const value = position[positionAxisID];
                borderValue = alignBorderValue(this.chart.scales[positionAxisID].getPixelForValue(value));
              }
              y1 = chartArea.top;
              y2 = chartArea.bottom;
              ty1 = borderValue + axisHalfWidth;
              ty2 = ty1 + tl;
            } else if (axis === "y") {
              if (position === "center") {
                borderValue = alignBorderValue((chartArea.left + chartArea.right) / 2);
              } else if (isObject(position)) {
                const positionAxisID = Object.keys(position)[0];
                const value = position[positionAxisID];
                borderValue = alignBorderValue(this.chart.scales[positionAxisID].getPixelForValue(value));
              }
              tx1 = borderValue - axisHalfWidth;
              tx2 = tx1 - tl;
              x1 = chartArea.left;
              x2 = chartArea.right;
            }
            const limit = valueOrDefault(options.ticks.maxTicksLimit, ticksLength);
            const step = Math.max(1, Math.ceil(ticksLength / limit));
            for (i = 0; i < ticksLength; i += step) {
              const optsAtIndex = grid.setContext(this.getContext(i));
              const lineWidth = optsAtIndex.lineWidth;
              const lineColor = optsAtIndex.color;
              const borderDash = optsAtIndex.borderDash || [];
              const borderDashOffset = optsAtIndex.borderDashOffset;
              const tickWidth = optsAtIndex.tickWidth;
              const tickColor = optsAtIndex.tickColor;
              const tickBorderDash = optsAtIndex.tickBorderDash || [];
              const tickBorderDashOffset = optsAtIndex.tickBorderDashOffset;
              lineValue = getPixelForGridLine(this, i, offset);
              if (lineValue === void 0) {
                continue;
              }
              alignedLineValue = _alignPixel(chart, lineValue, lineWidth);
              if (isHorizontal) {
                tx1 = tx2 = x1 = x2 = alignedLineValue;
              } else {
                ty1 = ty2 = y1 = y2 = alignedLineValue;
              }
              items.push({
                tx1,
                ty1,
                tx2,
                ty2,
                x1,
                y1,
                x2,
                y2,
                width: lineWidth,
                color: lineColor,
                borderDash,
                borderDashOffset,
                tickWidth,
                tickColor,
                tickBorderDash,
                tickBorderDashOffset
              });
            }
            this._ticksLength = ticksLength;
            this._borderValue = borderValue;
            return items;
          }
          _computeLabelItems(chartArea) {
            const axis = this.axis;
            const options = this.options;
            const { position, ticks: optionTicks } = options;
            const isHorizontal = this.isHorizontal();
            const ticks = this.ticks;
            const { align, crossAlign, padding, mirror } = optionTicks;
            const tl = getTickMarkLength(options.grid);
            const tickAndPadding = tl + padding;
            const hTickAndPadding = mirror ? -padding : tickAndPadding;
            const rotation = -toRadians(this.labelRotation);
            const items = [];
            let i, ilen, tick, label, x, y, textAlign, pixel, font, lineHeight, lineCount, textOffset;
            let textBaseline = "middle";
            if (position === "top") {
              y = this.bottom - hTickAndPadding;
              textAlign = this._getXAxisLabelAlignment();
            } else if (position === "bottom") {
              y = this.top + hTickAndPadding;
              textAlign = this._getXAxisLabelAlignment();
            } else if (position === "left") {
              const ret = this._getYAxisLabelAlignment(tl);
              textAlign = ret.textAlign;
              x = ret.x;
            } else if (position === "right") {
              const ret = this._getYAxisLabelAlignment(tl);
              textAlign = ret.textAlign;
              x = ret.x;
            } else if (axis === "x") {
              if (position === "center") {
                y = (chartArea.top + chartArea.bottom) / 2 + tickAndPadding;
              } else if (isObject(position)) {
                const positionAxisID = Object.keys(position)[0];
                const value = position[positionAxisID];
                y = this.chart.scales[positionAxisID].getPixelForValue(value) + tickAndPadding;
              }
              textAlign = this._getXAxisLabelAlignment();
            } else if (axis === "y") {
              if (position === "center") {
                x = (chartArea.left + chartArea.right) / 2 - tickAndPadding;
              } else if (isObject(position)) {
                const positionAxisID = Object.keys(position)[0];
                const value = position[positionAxisID];
                x = this.chart.scales[positionAxisID].getPixelForValue(value);
              }
              textAlign = this._getYAxisLabelAlignment(tl).textAlign;
            }
            if (axis === "y") {
              if (align === "start") {
                textBaseline = "top";
              } else if (align === "end") {
                textBaseline = "bottom";
              }
            }
            const labelSizes = this._getLabelSizes();
            for (i = 0, ilen = ticks.length; i < ilen; ++i) {
              tick = ticks[i];
              label = tick.label;
              const optsAtIndex = optionTicks.setContext(this.getContext(i));
              pixel = this.getPixelForTick(i) + optionTicks.labelOffset;
              font = this._resolveTickFontOptions(i);
              lineHeight = font.lineHeight;
              lineCount = isArray(label) ? label.length : 1;
              const halfCount = lineCount / 2;
              const color2 = optsAtIndex.color;
              const strokeColor = optsAtIndex.textStrokeColor;
              const strokeWidth = optsAtIndex.textStrokeWidth;
              let tickTextAlign = textAlign;
              if (isHorizontal) {
                x = pixel;
                if (textAlign === "inner") {
                  if (i === ilen - 1) {
                    tickTextAlign = !this.options.reverse ? "right" : "left";
                  } else if (i === 0) {
                    tickTextAlign = !this.options.reverse ? "left" : "right";
                  } else {
                    tickTextAlign = "center";
                  }
                }
                if (position === "top") {
                  if (crossAlign === "near" || rotation !== 0) {
                    textOffset = -lineCount * lineHeight + lineHeight / 2;
                  } else if (crossAlign === "center") {
                    textOffset = -labelSizes.highest.height / 2 - halfCount * lineHeight + lineHeight;
                  } else {
                    textOffset = -labelSizes.highest.height + lineHeight / 2;
                  }
                } else {
                  if (crossAlign === "near" || rotation !== 0) {
                    textOffset = lineHeight / 2;
                  } else if (crossAlign === "center") {
                    textOffset = labelSizes.highest.height / 2 - halfCount * lineHeight;
                  } else {
                    textOffset = labelSizes.highest.height - lineCount * lineHeight;
                  }
                }
                if (mirror) {
                  textOffset *= -1;
                }
              } else {
                y = pixel;
                textOffset = (1 - lineCount) * lineHeight / 2;
              }
              let backdrop;
              if (optsAtIndex.showLabelBackdrop) {
                const labelPadding = toPadding(optsAtIndex.backdropPadding);
                const height = labelSizes.heights[i];
                const width = labelSizes.widths[i];
                let top = y + textOffset - labelPadding.top;
                let left = x - labelPadding.left;
                switch (textBaseline) {
                  case "middle":
                    top -= height / 2;
                    break;
                  case "bottom":
                    top -= height;
                    break;
                }
                switch (textAlign) {
                  case "center":
                    left -= width / 2;
                    break;
                  case "right":
                    left -= width;
                    break;
                }
                backdrop = {
                  left,
                  top,
                  width: width + labelPadding.width,
                  height: height + labelPadding.height,
                  color: optsAtIndex.backdropColor
                };
              }
              items.push({
                rotation,
                label,
                font,
                color: color2,
                strokeColor,
                strokeWidth,
                textOffset,
                textAlign: tickTextAlign,
                textBaseline,
                translation: [x, y],
                backdrop
              });
            }
            return items;
          }
          _getXAxisLabelAlignment() {
            const { position, ticks } = this.options;
            const rotation = -toRadians(this.labelRotation);
            if (rotation) {
              return position === "top" ? "left" : "right";
            }
            let align = "center";
            if (ticks.align === "start") {
              align = "left";
            } else if (ticks.align === "end") {
              align = "right";
            } else if (ticks.align === "inner") {
              align = "inner";
            }
            return align;
          }
          _getYAxisLabelAlignment(tl) {
            const { position, ticks: { crossAlign, mirror, padding } } = this.options;
            const labelSizes = this._getLabelSizes();
            const tickAndPadding = tl + padding;
            const widest = labelSizes.widest.width;
            let textAlign;
            let x;
            if (position === "left") {
              if (mirror) {
                x = this.right + padding;
                if (crossAlign === "near") {
                  textAlign = "left";
                } else if (crossAlign === "center") {
                  textAlign = "center";
                  x += widest / 2;
                } else {
                  textAlign = "right";
                  x += widest;
                }
              } else {
                x = this.right - tickAndPadding;
                if (crossAlign === "near") {
                  textAlign = "right";
                } else if (crossAlign === "center") {
                  textAlign = "center";
                  x -= widest / 2;
                } else {
                  textAlign = "left";
                  x = this.left;
                }
              }
            } else if (position === "right") {
              if (mirror) {
                x = this.left + padding;
                if (crossAlign === "near") {
                  textAlign = "right";
                } else if (crossAlign === "center") {
                  textAlign = "center";
                  x -= widest / 2;
                } else {
                  textAlign = "left";
                  x -= widest;
                }
              } else {
                x = this.left + tickAndPadding;
                if (crossAlign === "near") {
                  textAlign = "left";
                } else if (crossAlign === "center") {
                  textAlign = "center";
                  x += widest / 2;
                } else {
                  textAlign = "right";
                  x = this.right;
                }
              }
            } else {
              textAlign = "right";
            }
            return { textAlign, x };
          }
          _computeLabelArea() {
            if (this.options.ticks.mirror) {
              return;
            }
            const chart = this.chart;
            const position = this.options.position;
            if (position === "left" || position === "right") {
              return { top: 0, left: this.left, bottom: chart.height, right: this.right };
            }
            if (position === "top" || position === "bottom") {
              return { top: this.top, left: 0, bottom: this.bottom, right: chart.width };
            }
          }
          drawBackground() {
            const { ctx, options: { backgroundColor }, left, top, width, height } = this;
            if (backgroundColor) {
              ctx.save();
              ctx.fillStyle = backgroundColor;
              ctx.fillRect(left, top, width, height);
              ctx.restore();
            }
          }
          getLineWidthForValue(value) {
            const grid = this.options.grid;
            if (!this._isVisible() || !grid.display) {
              return 0;
            }
            const ticks = this.ticks;
            const index2 = ticks.findIndex((t) => t.value === value);
            if (index2 >= 0) {
              const opts = grid.setContext(this.getContext(index2));
              return opts.lineWidth;
            }
            return 0;
          }
          drawGrid(chartArea) {
            const grid = this.options.grid;
            const ctx = this.ctx;
            const items = this._gridLineItems || (this._gridLineItems = this._computeGridLineItems(chartArea));
            let i, ilen;
            const drawLine = (p1, p2, style) => {
              if (!style.width || !style.color) {
                return;
              }
              ctx.save();
              ctx.lineWidth = style.width;
              ctx.strokeStyle = style.color;
              ctx.setLineDash(style.borderDash || []);
              ctx.lineDashOffset = style.borderDashOffset;
              ctx.beginPath();
              ctx.moveTo(p1.x, p1.y);
              ctx.lineTo(p2.x, p2.y);
              ctx.stroke();
              ctx.restore();
            };
            if (grid.display) {
              for (i = 0, ilen = items.length; i < ilen; ++i) {
                const item = items[i];
                if (grid.drawOnChartArea) {
                  drawLine(
                    { x: item.x1, y: item.y1 },
                    { x: item.x2, y: item.y2 },
                    item
                  );
                }
                if (grid.drawTicks) {
                  drawLine(
                    { x: item.tx1, y: item.ty1 },
                    { x: item.tx2, y: item.ty2 },
                    {
                      color: item.tickColor,
                      width: item.tickWidth,
                      borderDash: item.tickBorderDash,
                      borderDashOffset: item.tickBorderDashOffset
                    }
                  );
                }
              }
            }
          }
          drawBorder() {
            const { chart, ctx, options: { grid } } = this;
            const borderOpts = grid.setContext(this.getContext());
            const axisWidth = grid.drawBorder ? borderOpts.borderWidth : 0;
            if (!axisWidth) {
              return;
            }
            const lastLineWidth = grid.setContext(this.getContext(0)).lineWidth;
            const borderValue = this._borderValue;
            let x1, x2, y1, y2;
            if (this.isHorizontal()) {
              x1 = _alignPixel(chart, this.left, axisWidth) - axisWidth / 2;
              x2 = _alignPixel(chart, this.right, lastLineWidth) + lastLineWidth / 2;
              y1 = y2 = borderValue;
            } else {
              y1 = _alignPixel(chart, this.top, axisWidth) - axisWidth / 2;
              y2 = _alignPixel(chart, this.bottom, lastLineWidth) + lastLineWidth / 2;
              x1 = x2 = borderValue;
            }
            ctx.save();
            ctx.lineWidth = borderOpts.borderWidth;
            ctx.strokeStyle = borderOpts.borderColor;
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.stroke();
            ctx.restore();
          }
          drawLabels(chartArea) {
            const optionTicks = this.options.ticks;
            if (!optionTicks.display) {
              return;
            }
            const ctx = this.ctx;
            const area = this._computeLabelArea();
            if (area) {
              clipArea(ctx, area);
            }
            const items = this._labelItems || (this._labelItems = this._computeLabelItems(chartArea));
            let i, ilen;
            for (i = 0, ilen = items.length; i < ilen; ++i) {
              const item = items[i];
              const tickFont = item.font;
              const label = item.label;
              if (item.backdrop) {
                ctx.fillStyle = item.backdrop.color;
                ctx.fillRect(item.backdrop.left, item.backdrop.top, item.backdrop.width, item.backdrop.height);
              }
              let y = item.textOffset;
              renderText(ctx, label, 0, y, tickFont, item);
            }
            if (area) {
              unclipArea(ctx);
            }
          }
          drawTitle() {
            const { ctx, options: { position, title, reverse } } = this;
            if (!title.display) {
              return;
            }
            const font = toFont(title.font);
            const padding = toPadding(title.padding);
            const align = title.align;
            let offset = font.lineHeight / 2;
            if (position === "bottom" || position === "center" || isObject(position)) {
              offset += padding.bottom;
              if (isArray(title.text)) {
                offset += font.lineHeight * (title.text.length - 1);
              }
            } else {
              offset += padding.top;
            }
            const { titleX, titleY, maxWidth, rotation } = titleArgs(this, offset, position, align);
            renderText(ctx, title.text, 0, 0, font, {
              color: title.color,
              maxWidth,
              rotation,
              textAlign: titleAlign(align, position, reverse),
              textBaseline: "middle",
              translation: [titleX, titleY]
            });
          }
          draw(chartArea) {
            if (!this._isVisible()) {
              return;
            }
            this.drawBackground();
            this.drawGrid(chartArea);
            this.drawBorder();
            this.drawTitle();
            this.drawLabels(chartArea);
          }
          _layers() {
            const opts = this.options;
            const tz = opts.ticks && opts.ticks.z || 0;
            const gz = valueOrDefault(opts.grid && opts.grid.z, -1);
            if (!this._isVisible() || this.draw !== Scale.prototype.draw) {
              return [{
                z: tz,
                draw: (chartArea) => {
                  this.draw(chartArea);
                }
              }];
            }
            return [{
              z: gz,
              draw: (chartArea) => {
                this.drawBackground();
                this.drawGrid(chartArea);
                this.drawTitle();
              }
            }, {
              z: gz + 1,
              draw: () => {
                this.drawBorder();
              }
            }, {
              z: tz,
              draw: (chartArea) => {
                this.drawLabels(chartArea);
              }
            }];
          }
          getMatchingVisibleMetas(type) {
            const metas = this.chart.getSortedVisibleDatasetMetas();
            const axisID = this.axis + "AxisID";
            const result = [];
            let i, ilen;
            for (i = 0, ilen = metas.length; i < ilen; ++i) {
              const meta = metas[i];
              if (meta[axisID] === this.id && (!type || meta.type === type)) {
                result.push(meta);
              }
            }
            return result;
          }
          _resolveTickFontOptions(index2) {
            const opts = this.options.ticks.setContext(this.getContext(index2));
            return toFont(opts.font);
          }
          _maxDigits() {
            const fontSize = this._resolveTickFontOptions(0).lineHeight;
            return (this.isHorizontal() ? this.width : this.height) / fontSize;
          }
        }
        class TypedRegistry {
          constructor(type, scope, override) {
            this.type = type;
            this.scope = scope;
            this.override = override;
            this.items = /* @__PURE__ */ Object.create(null);
          }
          isForType(type) {
            return Object.prototype.isPrototypeOf.call(this.type.prototype, type.prototype);
          }
          register(item) {
            const proto = Object.getPrototypeOf(item);
            let parentScope;
            if (isIChartComponent(proto)) {
              parentScope = this.register(proto);
            }
            const items = this.items;
            const id = item.id;
            const scope = this.scope + "." + id;
            if (!id) {
              throw new Error("class does not have id: " + item);
            }
            if (id in items) {
              return scope;
            }
            items[id] = item;
            registerDefaults(item, scope, parentScope);
            if (this.override) {
              defaults.override(item.id, item.overrides);
            }
            return scope;
          }
          get(id) {
            return this.items[id];
          }
          unregister(item) {
            const items = this.items;
            const id = item.id;
            const scope = this.scope;
            if (id in items) {
              delete items[id];
            }
            if (scope && id in defaults[scope]) {
              delete defaults[scope][id];
              if (this.override) {
                delete overrides[id];
              }
            }
          }
        }
        function registerDefaults(item, scope, parentScope) {
          const itemDefaults = merge(/* @__PURE__ */ Object.create(null), [
            parentScope ? defaults.get(parentScope) : {},
            defaults.get(scope),
            item.defaults
          ]);
          defaults.set(scope, itemDefaults);
          if (item.defaultRoutes) {
            routeDefaults(scope, item.defaultRoutes);
          }
          if (item.descriptors) {
            defaults.describe(scope, item.descriptors);
          }
        }
        function routeDefaults(scope, routes) {
          Object.keys(routes).forEach((property) => {
            const propertyParts = property.split(".");
            const sourceName = propertyParts.pop();
            const sourceScope = [scope].concat(propertyParts).join(".");
            const parts = routes[property].split(".");
            const targetName = parts.pop();
            const targetScope = parts.join(".");
            defaults.route(sourceScope, sourceName, targetScope, targetName);
          });
        }
        function isIChartComponent(proto) {
          return "id" in proto && "defaults" in proto;
        }
        class Registry {
          constructor() {
            this.controllers = new TypedRegistry(DatasetController, "datasets", true);
            this.elements = new TypedRegistry(Element, "elements");
            this.plugins = new TypedRegistry(Object, "plugins");
            this.scales = new TypedRegistry(Scale, "scales");
            this._typedRegistries = [this.controllers, this.scales, this.elements];
          }
          add(...args) {
            this._each("register", args);
          }
          remove(...args) {
            this._each("unregister", args);
          }
          addControllers(...args) {
            this._each("register", args, this.controllers);
          }
          addElements(...args) {
            this._each("register", args, this.elements);
          }
          addPlugins(...args) {
            this._each("register", args, this.plugins);
          }
          addScales(...args) {
            this._each("register", args, this.scales);
          }
          getController(id) {
            return this._get(id, this.controllers, "controller");
          }
          getElement(id) {
            return this._get(id, this.elements, "element");
          }
          getPlugin(id) {
            return this._get(id, this.plugins, "plugin");
          }
          getScale(id) {
            return this._get(id, this.scales, "scale");
          }
          removeControllers(...args) {
            this._each("unregister", args, this.controllers);
          }
          removeElements(...args) {
            this._each("unregister", args, this.elements);
          }
          removePlugins(...args) {
            this._each("unregister", args, this.plugins);
          }
          removeScales(...args) {
            this._each("unregister", args, this.scales);
          }
          _each(method, args, typedRegistry) {
            [...args].forEach((arg) => {
              const reg = typedRegistry || this._getRegistryForType(arg);
              if (typedRegistry || reg.isForType(arg) || reg === this.plugins && arg.id) {
                this._exec(method, reg, arg);
              } else {
                each(arg, (item) => {
                  const itemReg = typedRegistry || this._getRegistryForType(item);
                  this._exec(method, itemReg, item);
                });
              }
            });
          }
          _exec(method, registry2, component) {
            const camelMethod = _capitalize(method);
            callback(component["before" + camelMethod], [], component);
            registry2[method](component);
            callback(component["after" + camelMethod], [], component);
          }
          _getRegistryForType(type) {
            for (let i = 0; i < this._typedRegistries.length; i++) {
              const reg = this._typedRegistries[i];
              if (reg.isForType(type)) {
                return reg;
              }
            }
            return this.plugins;
          }
          _get(id, typedRegistry, type) {
            const item = typedRegistry.get(id);
            if (item === void 0) {
              throw new Error('"' + id + '" is not a registered ' + type + ".");
            }
            return item;
          }
        }
        var registry = new Registry();
        class PluginService {
          constructor() {
            this._init = [];
          }
          notify(chart, hook, args, filter) {
            if (hook === "beforeInit") {
              this._init = this._createDescriptors(chart, true);
              this._notify(this._init, chart, "install");
            }
            const descriptors2 = filter ? this._descriptors(chart).filter(filter) : this._descriptors(chart);
            const result = this._notify(descriptors2, chart, hook, args);
            if (hook === "afterDestroy") {
              this._notify(descriptors2, chart, "stop");
              this._notify(this._init, chart, "uninstall");
            }
            return result;
          }
          _notify(descriptors2, chart, hook, args) {
            args = args || {};
            for (const descriptor of descriptors2) {
              const plugin = descriptor.plugin;
              const method = plugin[hook];
              const params = [chart, args, descriptor.options];
              if (callback(method, params, plugin) === false && args.cancelable) {
                return false;
              }
            }
            return true;
          }
          invalidate() {
            if (!isNullOrUndef(this._cache)) {
              this._oldCache = this._cache;
              this._cache = void 0;
            }
          }
          _descriptors(chart) {
            if (this._cache) {
              return this._cache;
            }
            const descriptors2 = this._cache = this._createDescriptors(chart);
            this._notifyStateChanges(chart);
            return descriptors2;
          }
          _createDescriptors(chart, all) {
            const config = chart && chart.config;
            const options = valueOrDefault(config.options && config.options.plugins, {});
            const plugins2 = allPlugins(config);
            return options === false && !all ? [] : createDescriptors(chart, plugins2, options, all);
          }
          _notifyStateChanges(chart) {
            const previousDescriptors = this._oldCache || [];
            const descriptors2 = this._cache;
            const diff = (a, b) => a.filter((x) => !b.some((y) => x.plugin.id === y.plugin.id));
            this._notify(diff(previousDescriptors, descriptors2), chart, "stop");
            this._notify(diff(descriptors2, previousDescriptors), chart, "start");
          }
        }
        function allPlugins(config) {
          const localIds = {};
          const plugins2 = [];
          const keys = Object.keys(registry.plugins.items);
          for (let i = 0; i < keys.length; i++) {
            plugins2.push(registry.getPlugin(keys[i]));
          }
          const local = config.plugins || [];
          for (let i = 0; i < local.length; i++) {
            const plugin = local[i];
            if (plugins2.indexOf(plugin) === -1) {
              plugins2.push(plugin);
              localIds[plugin.id] = true;
            }
          }
          return { plugins: plugins2, localIds };
        }
        function getOpts(options, all) {
          if (!all && options === false) {
            return null;
          }
          if (options === true) {
            return {};
          }
          return options;
        }
        function createDescriptors(chart, { plugins: plugins2, localIds }, options, all) {
          const result = [];
          const context = chart.getContext();
          for (const plugin of plugins2) {
            const id = plugin.id;
            const opts = getOpts(options[id], all);
            if (opts === null) {
              continue;
            }
            result.push({
              plugin,
              options: pluginOpts(chart.config, { plugin, local: localIds[id] }, opts, context)
            });
          }
          return result;
        }
        function pluginOpts(config, { plugin, local }, opts, context) {
          const keys = config.pluginScopeKeys(plugin);
          const scopes = config.getOptionScopes(opts, keys);
          if (local && plugin.defaults) {
            scopes.push(plugin.defaults);
          }
          return config.createResolver(scopes, context, [""], {
            scriptable: false,
            indexable: false,
            allKeys: true
          });
        }
        function getIndexAxis(type, options) {
          const datasetDefaults = defaults.datasets[type] || {};
          const datasetOptions = (options.datasets || {})[type] || {};
          return datasetOptions.indexAxis || options.indexAxis || datasetDefaults.indexAxis || "x";
        }
        function getAxisFromDefaultScaleID(id, indexAxis) {
          let axis = id;
          if (id === "_index_") {
            axis = indexAxis;
          } else if (id === "_value_") {
            axis = indexAxis === "x" ? "y" : "x";
          }
          return axis;
        }
        function getDefaultScaleIDFromAxis(axis, indexAxis) {
          return axis === indexAxis ? "_index_" : "_value_";
        }
        function axisFromPosition(position) {
          if (position === "top" || position === "bottom") {
            return "x";
          }
          if (position === "left" || position === "right") {
            return "y";
          }
        }
        function determineAxis(id, scaleOptions) {
          if (id === "x" || id === "y") {
            return id;
          }
          return scaleOptions.axis || axisFromPosition(scaleOptions.position) || id.charAt(0).toLowerCase();
        }
        function mergeScaleConfig(config, options) {
          const chartDefaults = overrides[config.type] || { scales: {} };
          const configScales = options.scales || {};
          const chartIndexAxis = getIndexAxis(config.type, options);
          const firstIDs = /* @__PURE__ */ Object.create(null);
          const scales2 = /* @__PURE__ */ Object.create(null);
          Object.keys(configScales).forEach((id) => {
            const scaleConf = configScales[id];
            if (!isObject(scaleConf)) {
              return console.error(`Invalid scale configuration for scale: ${id}`);
            }
            if (scaleConf._proxy) {
              return console.warn(`Ignoring resolver passed as options for scale: ${id}`);
            }
            const axis = determineAxis(id, scaleConf);
            const defaultId = getDefaultScaleIDFromAxis(axis, chartIndexAxis);
            const defaultScaleOptions = chartDefaults.scales || {};
            firstIDs[axis] = firstIDs[axis] || id;
            scales2[id] = mergeIf(/* @__PURE__ */ Object.create(null), [{ axis }, scaleConf, defaultScaleOptions[axis], defaultScaleOptions[defaultId]]);
          });
          config.data.datasets.forEach((dataset) => {
            const type = dataset.type || config.type;
            const indexAxis = dataset.indexAxis || getIndexAxis(type, options);
            const datasetDefaults = overrides[type] || {};
            const defaultScaleOptions = datasetDefaults.scales || {};
            Object.keys(defaultScaleOptions).forEach((defaultID) => {
              const axis = getAxisFromDefaultScaleID(defaultID, indexAxis);
              const id = dataset[axis + "AxisID"] || firstIDs[axis] || axis;
              scales2[id] = scales2[id] || /* @__PURE__ */ Object.create(null);
              mergeIf(scales2[id], [{ axis }, configScales[id], defaultScaleOptions[defaultID]]);
            });
          });
          Object.keys(scales2).forEach((key) => {
            const scale = scales2[key];
            mergeIf(scale, [defaults.scales[scale.type], defaults.scale]);
          });
          return scales2;
        }
        function initOptions(config) {
          const options = config.options || (config.options = {});
          options.plugins = valueOrDefault(options.plugins, {});
          options.scales = mergeScaleConfig(config, options);
        }
        function initData(data) {
          data = data || {};
          data.datasets = data.datasets || [];
          data.labels = data.labels || [];
          return data;
        }
        function initConfig(config) {
          config = config || {};
          config.data = initData(config.data);
          initOptions(config);
          return config;
        }
        const keyCache = /* @__PURE__ */ new Map();
        const keysCached = /* @__PURE__ */ new Set();
        function cachedKeys(cacheKey, generate) {
          let keys = keyCache.get(cacheKey);
          if (!keys) {
            keys = generate();
            keyCache.set(cacheKey, keys);
            keysCached.add(keys);
          }
          return keys;
        }
        const addIfFound = (set2, obj, key) => {
          const opts = resolveObjectKey(obj, key);
          if (opts !== void 0) {
            set2.add(opts);
          }
        };
        class Config {
          constructor(config) {
            this._config = initConfig(config);
            this._scopeCache = /* @__PURE__ */ new Map();
            this._resolverCache = /* @__PURE__ */ new Map();
          }
          get platform() {
            return this._config.platform;
          }
          get type() {
            return this._config.type;
          }
          set type(type) {
            this._config.type = type;
          }
          get data() {
            return this._config.data;
          }
          set data(data) {
            this._config.data = initData(data);
          }
          get options() {
            return this._config.options;
          }
          set options(options) {
            this._config.options = options;
          }
          get plugins() {
            return this._config.plugins;
          }
          update() {
            const config = this._config;
            this.clearCache();
            initOptions(config);
          }
          clearCache() {
            this._scopeCache.clear();
            this._resolverCache.clear();
          }
          datasetScopeKeys(datasetType) {
            return cachedKeys(
              datasetType,
              () => [[
                `datasets.${datasetType}`,
                ""
              ]]
            );
          }
          datasetAnimationScopeKeys(datasetType, transition) {
            return cachedKeys(
              `${datasetType}.transition.${transition}`,
              () => [
                [
                  `datasets.${datasetType}.transitions.${transition}`,
                  `transitions.${transition}`
                ],
                [
                  `datasets.${datasetType}`,
                  ""
                ]
              ]
            );
          }
          datasetElementScopeKeys(datasetType, elementType) {
            return cachedKeys(
              `${datasetType}-${elementType}`,
              () => [[
                `datasets.${datasetType}.elements.${elementType}`,
                `datasets.${datasetType}`,
                `elements.${elementType}`,
                ""
              ]]
            );
          }
          pluginScopeKeys(plugin) {
            const id = plugin.id;
            const type = this.type;
            return cachedKeys(
              `${type}-plugin-${id}`,
              () => [[
                `plugins.${id}`,
                ...plugin.additionalOptionScopes || []
              ]]
            );
          }
          _cachedScopes(mainScope, resetCache) {
            const _scopeCache = this._scopeCache;
            let cache = _scopeCache.get(mainScope);
            if (!cache || resetCache) {
              cache = /* @__PURE__ */ new Map();
              _scopeCache.set(mainScope, cache);
            }
            return cache;
          }
          getOptionScopes(mainScope, keyLists, resetCache) {
            const { options, type } = this;
            const cache = this._cachedScopes(mainScope, resetCache);
            const cached = cache.get(keyLists);
            if (cached) {
              return cached;
            }
            const scopes = /* @__PURE__ */ new Set();
            keyLists.forEach((keys) => {
              if (mainScope) {
                scopes.add(mainScope);
                keys.forEach((key) => addIfFound(scopes, mainScope, key));
              }
              keys.forEach((key) => addIfFound(scopes, options, key));
              keys.forEach((key) => addIfFound(scopes, overrides[type] || {}, key));
              keys.forEach((key) => addIfFound(scopes, defaults, key));
              keys.forEach((key) => addIfFound(scopes, descriptors, key));
            });
            const array = Array.from(scopes);
            if (array.length === 0) {
              array.push(/* @__PURE__ */ Object.create(null));
            }
            if (keysCached.has(keyLists)) {
              cache.set(keyLists, array);
            }
            return array;
          }
          chartOptionScopes() {
            const { options, type } = this;
            return [
              options,
              overrides[type] || {},
              defaults.datasets[type] || {},
              { type },
              defaults,
              descriptors
            ];
          }
          resolveNamedOptions(scopes, names2, context, prefixes = [""]) {
            const result = { $shared: true };
            const { resolver, subPrefixes } = getResolver(this._resolverCache, scopes, prefixes);
            let options = resolver;
            if (needContext(resolver, names2)) {
              result.$shared = false;
              context = isFunction(context) ? context() : context;
              const subResolver = this.createResolver(scopes, context, subPrefixes);
              options = _attachContext(resolver, context, subResolver);
            }
            for (const prop of names2) {
              result[prop] = options[prop];
            }
            return result;
          }
          createResolver(scopes, context, prefixes = [""], descriptorDefaults) {
            const { resolver } = getResolver(this._resolverCache, scopes, prefixes);
            return isObject(context) ? _attachContext(resolver, context, void 0, descriptorDefaults) : resolver;
          }
        }
        function getResolver(resolverCache, scopes, prefixes) {
          let cache = resolverCache.get(scopes);
          if (!cache) {
            cache = /* @__PURE__ */ new Map();
            resolverCache.set(scopes, cache);
          }
          const cacheKey = prefixes.join();
          let cached = cache.get(cacheKey);
          if (!cached) {
            const resolver = _createResolver(scopes, prefixes);
            cached = {
              resolver,
              subPrefixes: prefixes.filter((p) => !p.toLowerCase().includes("hover"))
            };
            cache.set(cacheKey, cached);
          }
          return cached;
        }
        const hasFunction = (value) => isObject(value) && Object.getOwnPropertyNames(value).reduce((acc, key) => acc || isFunction(value[key]), false);
        function needContext(proxy, names2) {
          const { isScriptable, isIndexable } = _descriptors(proxy);
          for (const prop of names2) {
            const scriptable = isScriptable(prop);
            const indexable = isIndexable(prop);
            const value = (indexable || scriptable) && proxy[prop];
            if (scriptable && (isFunction(value) || hasFunction(value)) || indexable && isArray(value)) {
              return true;
            }
          }
          return false;
        }
        var version = "3.9.1";
        const KNOWN_POSITIONS = ["top", "bottom", "left", "right", "chartArea"];
        function positionIsHorizontal(position, axis) {
          return position === "top" || position === "bottom" || KNOWN_POSITIONS.indexOf(position) === -1 && axis === "x";
        }
        function compare2Level(l1, l2) {
          return function(a, b) {
            return a[l1] === b[l1] ? a[l2] - b[l2] : a[l1] - b[l1];
          };
        }
        function onAnimationsComplete(context) {
          const chart = context.chart;
          const animationOptions2 = chart.options.animation;
          chart.notifyPlugins("afterRender");
          callback(animationOptions2 && animationOptions2.onComplete, [context], chart);
        }
        function onAnimationProgress(context) {
          const chart = context.chart;
          const animationOptions2 = chart.options.animation;
          callback(animationOptions2 && animationOptions2.onProgress, [context], chart);
        }
        function getCanvas(item) {
          if (_isDomSupported() && typeof item === "string") {
            item = document.getElementById(item);
          } else if (item && item.length) {
            item = item[0];
          }
          if (item && item.canvas) {
            item = item.canvas;
          }
          return item;
        }
        const instances = {};
        const getChart = (key) => {
          const canvas = getCanvas(key);
          return Object.values(instances).filter((c) => c.canvas === canvas).pop();
        };
        function moveNumericKeys(obj, start, move) {
          const keys = Object.keys(obj);
          for (const key of keys) {
            const intKey = +key;
            if (intKey >= start) {
              const value = obj[key];
              delete obj[key];
              if (move > 0 || intKey > start) {
                obj[intKey + move] = value;
              }
            }
          }
        }
        function determineLastEvent(e, lastEvent, inChartArea, isClick) {
          if (!inChartArea || e.type === "mouseout") {
            return null;
          }
          if (isClick) {
            return lastEvent;
          }
          return e;
        }
        class Chart {
          constructor(item, userConfig) {
            const config = this.config = new Config(userConfig);
            const initialCanvas = getCanvas(item);
            const existingChart = getChart(initialCanvas);
            if (existingChart) {
              throw new Error(
                "Canvas is already in use. Chart with ID '" + existingChart.id + "' must be destroyed before the canvas with ID '" + existingChart.canvas.id + "' can be reused."
              );
            }
            const options = config.createResolver(config.chartOptionScopes(), this.getContext());
            this.platform = new (config.platform || _detectPlatform(initialCanvas))();
            this.platform.updateConfig(config);
            const context = this.platform.acquireContext(initialCanvas, options.aspectRatio);
            const canvas = context && context.canvas;
            const height = canvas && canvas.height;
            const width = canvas && canvas.width;
            this.id = uid();
            this.ctx = context;
            this.canvas = canvas;
            this.width = width;
            this.height = height;
            this._options = options;
            this._aspectRatio = this.aspectRatio;
            this._layers = [];
            this._metasets = [];
            this._stacks = void 0;
            this.boxes = [];
            this.currentDevicePixelRatio = void 0;
            this.chartArea = void 0;
            this._active = [];
            this._lastEvent = void 0;
            this._listeners = {};
            this._responsiveListeners = void 0;
            this._sortedMetasets = [];
            this.scales = {};
            this._plugins = new PluginService();
            this.$proxies = {};
            this._hiddenIndices = {};
            this.attached = false;
            this._animationsDisabled = void 0;
            this.$context = void 0;
            this._doResize = debounce((mode) => this.update(mode), options.resizeDelay || 0);
            this._dataChanges = [];
            instances[this.id] = this;
            if (!context || !canvas) {
              console.error("Failed to create chart: can't acquire context from the given item");
              return;
            }
            animator.listen(this, "complete", onAnimationsComplete);
            animator.listen(this, "progress", onAnimationProgress);
            this._initialize();
            if (this.attached) {
              this.update();
            }
          }
          get aspectRatio() {
            const { options: { aspectRatio, maintainAspectRatio }, width, height, _aspectRatio } = this;
            if (!isNullOrUndef(aspectRatio)) {
              return aspectRatio;
            }
            if (maintainAspectRatio && _aspectRatio) {
              return _aspectRatio;
            }
            return height ? width / height : null;
          }
          get data() {
            return this.config.data;
          }
          set data(data) {
            this.config.data = data;
          }
          get options() {
            return this._options;
          }
          set options(options) {
            this.config.options = options;
          }
          _initialize() {
            this.notifyPlugins("beforeInit");
            if (this.options.responsive) {
              this.resize();
            } else {
              retinaScale(this, this.options.devicePixelRatio);
            }
            this.bindEvents();
            this.notifyPlugins("afterInit");
            return this;
          }
          clear() {
            clearCanvas(this.canvas, this.ctx);
            return this;
          }
          stop() {
            animator.stop(this);
            return this;
          }
          resize(width, height) {
            if (!animator.running(this)) {
              this._resize(width, height);
            } else {
              this._resizeBeforeDraw = { width, height };
            }
          }
          _resize(width, height) {
            const options = this.options;
            const canvas = this.canvas;
            const aspectRatio = options.maintainAspectRatio && this.aspectRatio;
            const newSize = this.platform.getMaximumSize(canvas, width, height, aspectRatio);
            const newRatio = options.devicePixelRatio || this.platform.getDevicePixelRatio();
            const mode = this.width ? "resize" : "attach";
            this.width = newSize.width;
            this.height = newSize.height;
            this._aspectRatio = this.aspectRatio;
            if (!retinaScale(this, newRatio, true)) {
              return;
            }
            this.notifyPlugins("resize", { size: newSize });
            callback(options.onResize, [this, newSize], this);
            if (this.attached) {
              if (this._doResize(mode)) {
                this.render();
              }
            }
          }
          ensureScalesHaveIDs() {
            const options = this.options;
            const scalesOptions = options.scales || {};
            each(scalesOptions, (axisOptions, axisID) => {
              axisOptions.id = axisID;
            });
          }
          buildOrUpdateScales() {
            const options = this.options;
            const scaleOpts = options.scales;
            const scales2 = this.scales;
            const updated = Object.keys(scales2).reduce((obj, id) => {
              obj[id] = false;
              return obj;
            }, {});
            let items = [];
            if (scaleOpts) {
              items = items.concat(
                Object.keys(scaleOpts).map((id) => {
                  const scaleOptions = scaleOpts[id];
                  const axis = determineAxis(id, scaleOptions);
                  const isRadial = axis === "r";
                  const isHorizontal = axis === "x";
                  return {
                    options: scaleOptions,
                    dposition: isRadial ? "chartArea" : isHorizontal ? "bottom" : "left",
                    dtype: isRadial ? "radialLinear" : isHorizontal ? "category" : "linear"
                  };
                })
              );
            }
            each(items, (item) => {
              const scaleOptions = item.options;
              const id = scaleOptions.id;
              const axis = determineAxis(id, scaleOptions);
              const scaleType = valueOrDefault(scaleOptions.type, item.dtype);
              if (scaleOptions.position === void 0 || positionIsHorizontal(scaleOptions.position, axis) !== positionIsHorizontal(item.dposition)) {
                scaleOptions.position = item.dposition;
              }
              updated[id] = true;
              let scale = null;
              if (id in scales2 && scales2[id].type === scaleType) {
                scale = scales2[id];
              } else {
                const scaleClass = registry.getScale(scaleType);
                scale = new scaleClass({
                  id,
                  type: scaleType,
                  ctx: this.ctx,
                  chart: this
                });
                scales2[scale.id] = scale;
              }
              scale.init(scaleOptions, options);
            });
            each(updated, (hasUpdated, id) => {
              if (!hasUpdated) {
                delete scales2[id];
              }
            });
            each(scales2, (scale) => {
              layouts.configure(this, scale, scale.options);
              layouts.addBox(this, scale);
            });
          }
          _updateMetasets() {
            const metasets = this._metasets;
            const numData = this.data.datasets.length;
            const numMeta = metasets.length;
            metasets.sort((a, b) => a.index - b.index);
            if (numMeta > numData) {
              for (let i = numData; i < numMeta; ++i) {
                this._destroyDatasetMeta(i);
              }
              metasets.splice(numData, numMeta - numData);
            }
            this._sortedMetasets = metasets.slice(0).sort(compare2Level("order", "index"));
          }
          _removeUnreferencedMetasets() {
            const { _metasets: metasets, data: { datasets } } = this;
            if (metasets.length > datasets.length) {
              delete this._stacks;
            }
            metasets.forEach((meta, index2) => {
              if (datasets.filter((x) => x === meta._dataset).length === 0) {
                this._destroyDatasetMeta(index2);
              }
            });
          }
          buildOrUpdateControllers() {
            const newControllers = [];
            const datasets = this.data.datasets;
            let i, ilen;
            this._removeUnreferencedMetasets();
            for (i = 0, ilen = datasets.length; i < ilen; i++) {
              const dataset = datasets[i];
              let meta = this.getDatasetMeta(i);
              const type = dataset.type || this.config.type;
              if (meta.type && meta.type !== type) {
                this._destroyDatasetMeta(i);
                meta = this.getDatasetMeta(i);
              }
              meta.type = type;
              meta.indexAxis = dataset.indexAxis || getIndexAxis(type, this.options);
              meta.order = dataset.order || 0;
              meta.index = i;
              meta.label = "" + dataset.label;
              meta.visible = this.isDatasetVisible(i);
              if (meta.controller) {
                meta.controller.updateIndex(i);
                meta.controller.linkScales();
              } else {
                const ControllerClass = registry.getController(type);
                const { datasetElementType, dataElementType } = defaults.datasets[type];
                Object.assign(ControllerClass.prototype, {
                  dataElementType: registry.getElement(dataElementType),
                  datasetElementType: datasetElementType && registry.getElement(datasetElementType)
                });
                meta.controller = new ControllerClass(this, i);
                newControllers.push(meta.controller);
              }
            }
            this._updateMetasets();
            return newControllers;
          }
          _resetElements() {
            each(this.data.datasets, (dataset, datasetIndex) => {
              this.getDatasetMeta(datasetIndex).controller.reset();
            }, this);
          }
          reset() {
            this._resetElements();
            this.notifyPlugins("reset");
          }
          update(mode) {
            const config = this.config;
            config.update();
            const options = this._options = config.createResolver(config.chartOptionScopes(), this.getContext());
            const animsDisabled = this._animationsDisabled = !options.animation;
            this._updateScales();
            this._checkEventBindings();
            this._updateHiddenIndices();
            this._plugins.invalidate();
            if (this.notifyPlugins("beforeUpdate", { mode, cancelable: true }) === false) {
              return;
            }
            const newControllers = this.buildOrUpdateControllers();
            this.notifyPlugins("beforeElementsUpdate");
            let minPadding = 0;
            for (let i = 0, ilen = this.data.datasets.length; i < ilen; i++) {
              const { controller } = this.getDatasetMeta(i);
              const reset = !animsDisabled && newControllers.indexOf(controller) === -1;
              controller.buildOrUpdateElements(reset);
              minPadding = Math.max(+controller.getMaxOverflow(), minPadding);
            }
            minPadding = this._minPadding = options.layout.autoPadding ? minPadding : 0;
            this._updateLayout(minPadding);
            if (!animsDisabled) {
              each(newControllers, (controller) => {
                controller.reset();
              });
            }
            this._updateDatasets(mode);
            this.notifyPlugins("afterUpdate", { mode });
            this._layers.sort(compare2Level("z", "_idx"));
            const { _active, _lastEvent } = this;
            if (_lastEvent) {
              this._eventHandler(_lastEvent, true);
            } else if (_active.length) {
              this._updateHoverStyles(_active, _active, true);
            }
            this.render();
          }
          _updateScales() {
            each(this.scales, (scale) => {
              layouts.removeBox(this, scale);
            });
            this.ensureScalesHaveIDs();
            this.buildOrUpdateScales();
          }
          _checkEventBindings() {
            const options = this.options;
            const existingEvents = new Set(Object.keys(this._listeners));
            const newEvents = new Set(options.events);
            if (!setsEqual(existingEvents, newEvents) || !!this._responsiveListeners !== options.responsive) {
              this.unbindEvents();
              this.bindEvents();
            }
          }
          _updateHiddenIndices() {
            const { _hiddenIndices } = this;
            const changes = this._getUniformDataChanges() || [];
            for (const { method, start, count } of changes) {
              const move = method === "_removeElements" ? -count : count;
              moveNumericKeys(_hiddenIndices, start, move);
            }
          }
          _getUniformDataChanges() {
            const _dataChanges = this._dataChanges;
            if (!_dataChanges || !_dataChanges.length) {
              return;
            }
            this._dataChanges = [];
            const datasetCount = this.data.datasets.length;
            const makeSet = (idx) => new Set(
              _dataChanges.filter((c) => c[0] === idx).map((c, i) => i + "," + c.splice(1).join(","))
            );
            const changeSet = makeSet(0);
            for (let i = 1; i < datasetCount; i++) {
              if (!setsEqual(changeSet, makeSet(i))) {
                return;
              }
            }
            return Array.from(changeSet).map((c) => c.split(",")).map((a) => ({ method: a[1], start: +a[2], count: +a[3] }));
          }
          _updateLayout(minPadding) {
            if (this.notifyPlugins("beforeLayout", { cancelable: true }) === false) {
              return;
            }
            layouts.update(this, this.width, this.height, minPadding);
            const area = this.chartArea;
            const noArea = area.width <= 0 || area.height <= 0;
            this._layers = [];
            each(this.boxes, (box) => {
              if (noArea && box.position === "chartArea") {
                return;
              }
              if (box.configure) {
                box.configure();
              }
              this._layers.push(...box._layers());
            }, this);
            this._layers.forEach((item, index2) => {
              item._idx = index2;
            });
            this.notifyPlugins("afterLayout");
          }
          _updateDatasets(mode) {
            if (this.notifyPlugins("beforeDatasetsUpdate", { mode, cancelable: true }) === false) {
              return;
            }
            for (let i = 0, ilen = this.data.datasets.length; i < ilen; ++i) {
              this.getDatasetMeta(i).controller.configure();
            }
            for (let i = 0, ilen = this.data.datasets.length; i < ilen; ++i) {
              this._updateDataset(i, isFunction(mode) ? mode({ datasetIndex: i }) : mode);
            }
            this.notifyPlugins("afterDatasetsUpdate", { mode });
          }
          _updateDataset(index2, mode) {
            const meta = this.getDatasetMeta(index2);
            const args = { meta, index: index2, mode, cancelable: true };
            if (this.notifyPlugins("beforeDatasetUpdate", args) === false) {
              return;
            }
            meta.controller._update(mode);
            args.cancelable = false;
            this.notifyPlugins("afterDatasetUpdate", args);
          }
          render() {
            if (this.notifyPlugins("beforeRender", { cancelable: true }) === false) {
              return;
            }
            if (animator.has(this)) {
              if (this.attached && !animator.running(this)) {
                animator.start(this);
              }
            } else {
              this.draw();
              onAnimationsComplete({ chart: this });
            }
          }
          draw() {
            let i;
            if (this._resizeBeforeDraw) {
              const { width, height } = this._resizeBeforeDraw;
              this._resize(width, height);
              this._resizeBeforeDraw = null;
            }
            this.clear();
            if (this.width <= 0 || this.height <= 0) {
              return;
            }
            if (this.notifyPlugins("beforeDraw", { cancelable: true }) === false) {
              return;
            }
            const layers = this._layers;
            for (i = 0; i < layers.length && layers[i].z <= 0; ++i) {
              layers[i].draw(this.chartArea);
            }
            this._drawDatasets();
            for (; i < layers.length; ++i) {
              layers[i].draw(this.chartArea);
            }
            this.notifyPlugins("afterDraw");
          }
          _getSortedDatasetMetas(filterVisible) {
            const metasets = this._sortedMetasets;
            const result = [];
            let i, ilen;
            for (i = 0, ilen = metasets.length; i < ilen; ++i) {
              const meta = metasets[i];
              if (!filterVisible || meta.visible) {
                result.push(meta);
              }
            }
            return result;
          }
          getSortedVisibleDatasetMetas() {
            return this._getSortedDatasetMetas(true);
          }
          _drawDatasets() {
            if (this.notifyPlugins("beforeDatasetsDraw", { cancelable: true }) === false) {
              return;
            }
            const metasets = this.getSortedVisibleDatasetMetas();
            for (let i = metasets.length - 1; i >= 0; --i) {
              this._drawDataset(metasets[i]);
            }
            this.notifyPlugins("afterDatasetsDraw");
          }
          _drawDataset(meta) {
            const ctx = this.ctx;
            const clip = meta._clip;
            const useClip = !clip.disabled;
            const area = this.chartArea;
            const args = {
              meta,
              index: meta.index,
              cancelable: true
            };
            if (this.notifyPlugins("beforeDatasetDraw", args) === false) {
              return;
            }
            if (useClip) {
              clipArea(ctx, {
                left: clip.left === false ? 0 : area.left - clip.left,
                right: clip.right === false ? this.width : area.right + clip.right,
                top: clip.top === false ? 0 : area.top - clip.top,
                bottom: clip.bottom === false ? this.height : area.bottom + clip.bottom
              });
            }
            meta.controller.draw();
            if (useClip) {
              unclipArea(ctx);
            }
            args.cancelable = false;
            this.notifyPlugins("afterDatasetDraw", args);
          }
          isPointInArea(point) {
            return _isPointInArea(point, this.chartArea, this._minPadding);
          }
          getElementsAtEventForMode(e, mode, options, useFinalPosition) {
            const method = Interaction.modes[mode];
            if (typeof method === "function") {
              return method(this, e, options, useFinalPosition);
            }
            return [];
          }
          getDatasetMeta(datasetIndex) {
            const dataset = this.data.datasets[datasetIndex];
            const metasets = this._metasets;
            let meta = metasets.filter((x) => x && x._dataset === dataset).pop();
            if (!meta) {
              meta = {
                type: null,
                data: [],
                dataset: null,
                controller: null,
                hidden: null,
                xAxisID: null,
                yAxisID: null,
                order: dataset && dataset.order || 0,
                index: datasetIndex,
                _dataset: dataset,
                _parsed: [],
                _sorted: false
              };
              metasets.push(meta);
            }
            return meta;
          }
          getContext() {
            return this.$context || (this.$context = createContext(null, { chart: this, type: "chart" }));
          }
          getVisibleDatasetCount() {
            return this.getSortedVisibleDatasetMetas().length;
          }
          isDatasetVisible(datasetIndex) {
            const dataset = this.data.datasets[datasetIndex];
            if (!dataset) {
              return false;
            }
            const meta = this.getDatasetMeta(datasetIndex);
            return typeof meta.hidden === "boolean" ? !meta.hidden : !dataset.hidden;
          }
          setDatasetVisibility(datasetIndex, visible) {
            const meta = this.getDatasetMeta(datasetIndex);
            meta.hidden = !visible;
          }
          toggleDataVisibility(index2) {
            this._hiddenIndices[index2] = !this._hiddenIndices[index2];
          }
          getDataVisibility(index2) {
            return !this._hiddenIndices[index2];
          }
          _updateVisibility(datasetIndex, dataIndex, visible) {
            const mode = visible ? "show" : "hide";
            const meta = this.getDatasetMeta(datasetIndex);
            const anims = meta.controller._resolveAnimations(void 0, mode);
            if (defined(dataIndex)) {
              meta.data[dataIndex].hidden = !visible;
              this.update();
            } else {
              this.setDatasetVisibility(datasetIndex, visible);
              anims.update(meta, { visible });
              this.update((ctx) => ctx.datasetIndex === datasetIndex ? mode : void 0);
            }
          }
          hide(datasetIndex, dataIndex) {
            this._updateVisibility(datasetIndex, dataIndex, false);
          }
          show(datasetIndex, dataIndex) {
            this._updateVisibility(datasetIndex, dataIndex, true);
          }
          _destroyDatasetMeta(datasetIndex) {
            const meta = this._metasets[datasetIndex];
            if (meta && meta.controller) {
              meta.controller._destroy();
            }
            delete this._metasets[datasetIndex];
          }
          _stop() {
            let i, ilen;
            this.stop();
            animator.remove(this);
            for (i = 0, ilen = this.data.datasets.length; i < ilen; ++i) {
              this._destroyDatasetMeta(i);
            }
          }
          destroy() {
            this.notifyPlugins("beforeDestroy");
            const { canvas, ctx } = this;
            this._stop();
            this.config.clearCache();
            if (canvas) {
              this.unbindEvents();
              clearCanvas(canvas, ctx);
              this.platform.releaseContext(ctx);
              this.canvas = null;
              this.ctx = null;
            }
            this.notifyPlugins("destroy");
            delete instances[this.id];
            this.notifyPlugins("afterDestroy");
          }
          toBase64Image(...args) {
            return this.canvas.toDataURL(...args);
          }
          bindEvents() {
            this.bindUserEvents();
            if (this.options.responsive) {
              this.bindResponsiveEvents();
            } else {
              this.attached = true;
            }
          }
          bindUserEvents() {
            const listeners = this._listeners;
            const platform = this.platform;
            const _add = (type, listener2) => {
              platform.addEventListener(this, type, listener2);
              listeners[type] = listener2;
            };
            const listener = (e, x, y) => {
              e.offsetX = x;
              e.offsetY = y;
              this._eventHandler(e);
            };
            each(this.options.events, (type) => _add(type, listener));
          }
          bindResponsiveEvents() {
            if (!this._responsiveListeners) {
              this._responsiveListeners = {};
            }
            const listeners = this._responsiveListeners;
            const platform = this.platform;
            const _add = (type, listener2) => {
              platform.addEventListener(this, type, listener2);
              listeners[type] = listener2;
            };
            const _remove = (type, listener2) => {
              if (listeners[type]) {
                platform.removeEventListener(this, type, listener2);
                delete listeners[type];
              }
            };
            const listener = (width, height) => {
              if (this.canvas) {
                this.resize(width, height);
              }
            };
            let detached;
            const attached = () => {
              _remove("attach", attached);
              this.attached = true;
              this.resize();
              _add("resize", listener);
              _add("detach", detached);
            };
            detached = () => {
              this.attached = false;
              _remove("resize", listener);
              this._stop();
              this._resize(0, 0);
              _add("attach", attached);
            };
            if (platform.isAttached(this.canvas)) {
              attached();
            } else {
              detached();
            }
          }
          unbindEvents() {
            each(this._listeners, (listener, type) => {
              this.platform.removeEventListener(this, type, listener);
            });
            this._listeners = {};
            each(this._responsiveListeners, (listener, type) => {
              this.platform.removeEventListener(this, type, listener);
            });
            this._responsiveListeners = void 0;
          }
          updateHoverStyle(items, mode, enabled) {
            const prefix = enabled ? "set" : "remove";
            let meta, item, i, ilen;
            if (mode === "dataset") {
              meta = this.getDatasetMeta(items[0].datasetIndex);
              meta.controller["_" + prefix + "DatasetHoverStyle"]();
            }
            for (i = 0, ilen = items.length; i < ilen; ++i) {
              item = items[i];
              const controller = item && this.getDatasetMeta(item.datasetIndex).controller;
              if (controller) {
                controller[prefix + "HoverStyle"](item.element, item.datasetIndex, item.index);
              }
            }
          }
          getActiveElements() {
            return this._active || [];
          }
          setActiveElements(activeElements) {
            const lastActive = this._active || [];
            const active = activeElements.map(({ datasetIndex, index: index2 }) => {
              const meta = this.getDatasetMeta(datasetIndex);
              if (!meta) {
                throw new Error("No dataset found at index " + datasetIndex);
              }
              return {
                datasetIndex,
                element: meta.data[index2],
                index: index2
              };
            });
            const changed = !_elementsEqual(active, lastActive);
            if (changed) {
              this._active = active;
              this._lastEvent = null;
              this._updateHoverStyles(active, lastActive);
            }
          }
          notifyPlugins(hook, args, filter) {
            return this._plugins.notify(this, hook, args, filter);
          }
          _updateHoverStyles(active, lastActive, replay) {
            const hoverOptions = this.options.hover;
            const diff = (a, b) => a.filter((x) => !b.some((y) => x.datasetIndex === y.datasetIndex && x.index === y.index));
            const deactivated = diff(lastActive, active);
            const activated = replay ? active : diff(active, lastActive);
            if (deactivated.length) {
              this.updateHoverStyle(deactivated, hoverOptions.mode, false);
            }
            if (activated.length && hoverOptions.mode) {
              this.updateHoverStyle(activated, hoverOptions.mode, true);
            }
          }
          _eventHandler(e, replay) {
            const args = {
              event: e,
              replay,
              cancelable: true,
              inChartArea: this.isPointInArea(e)
            };
            const eventFilter = (plugin) => (plugin.options.events || this.options.events).includes(e.native.type);
            if (this.notifyPlugins("beforeEvent", args, eventFilter) === false) {
              return;
            }
            const changed = this._handleEvent(e, replay, args.inChartArea);
            args.cancelable = false;
            this.notifyPlugins("afterEvent", args, eventFilter);
            if (changed || args.changed) {
              this.render();
            }
            return this;
          }
          _handleEvent(e, replay, inChartArea) {
            const { _active: lastActive = [], options } = this;
            const useFinalPosition = replay;
            const active = this._getActiveElements(e, lastActive, inChartArea, useFinalPosition);
            const isClick = _isClickEvent(e);
            const lastEvent = determineLastEvent(e, this._lastEvent, inChartArea, isClick);
            if (inChartArea) {
              this._lastEvent = null;
              callback(options.onHover, [e, active, this], this);
              if (isClick) {
                callback(options.onClick, [e, active, this], this);
              }
            }
            const changed = !_elementsEqual(active, lastActive);
            if (changed || replay) {
              this._active = active;
              this._updateHoverStyles(active, lastActive, replay);
            }
            this._lastEvent = lastEvent;
            return changed;
          }
          _getActiveElements(e, lastActive, inChartArea, useFinalPosition) {
            if (e.type === "mouseout") {
              return [];
            }
            if (!inChartArea) {
              return lastActive;
            }
            const hoverOptions = this.options.hover;
            return this.getElementsAtEventForMode(e, hoverOptions.mode, hoverOptions, useFinalPosition);
          }
        }
        const invalidatePlugins = () => each(Chart.instances, (chart) => chart._plugins.invalidate());
        const enumerable = true;
        Object.defineProperties(Chart, {
          defaults: {
            enumerable,
            value: defaults
          },
          instances: {
            enumerable,
            value: instances
          },
          overrides: {
            enumerable,
            value: overrides
          },
          registry: {
            enumerable,
            value: registry
          },
          version: {
            enumerable,
            value: version
          },
          getChart: {
            enumerable,
            value: getChart
          },
          register: {
            enumerable,
            value: (...items) => {
              registry.add(...items);
              invalidatePlugins();
            }
          },
          unregister: {
            enumerable,
            value: (...items) => {
              registry.remove(...items);
              invalidatePlugins();
            }
          }
        });
        function abstract() {
          throw new Error("This method is not implemented: Check that a complete date adapter is provided.");
        }
        class DateAdapter {
          constructor(options) {
            this.options = options || {};
          }
          init(chartOptions) {
          }
          formats() {
            return abstract();
          }
          parse(value, format) {
            return abstract();
          }
          format(timestamp, format) {
            return abstract();
          }
          add(timestamp, amount, unit) {
            return abstract();
          }
          diff(a, b, unit) {
            return abstract();
          }
          startOf(timestamp, unit, weekday) {
            return abstract();
          }
          endOf(timestamp, unit) {
            return abstract();
          }
        }
        DateAdapter.override = function(members) {
          Object.assign(DateAdapter.prototype, members);
        };
        var _adapters = {
          _date: DateAdapter
        };
        function getAllScaleValues(scale, type) {
          if (!scale._cache.$bar) {
            const visibleMetas = scale.getMatchingVisibleMetas(type);
            let values = [];
            for (let i = 0, ilen = visibleMetas.length; i < ilen; i++) {
              values = values.concat(visibleMetas[i].controller.getAllParsedValues(scale));
            }
            scale._cache.$bar = _arrayUnique(values.sort((a, b) => a - b));
          }
          return scale._cache.$bar;
        }
        function computeMinSampleSize(meta) {
          const scale = meta.iScale;
          const values = getAllScaleValues(scale, meta.type);
          let min = scale._length;
          let i, ilen, curr, prev;
          const updateMinAndPrev = () => {
            if (curr === 32767 || curr === -32768) {
              return;
            }
            if (defined(prev)) {
              min = Math.min(min, Math.abs(curr - prev) || min);
            }
            prev = curr;
          };
          for (i = 0, ilen = values.length; i < ilen; ++i) {
            curr = scale.getPixelForValue(values[i]);
            updateMinAndPrev();
          }
          prev = void 0;
          for (i = 0, ilen = scale.ticks.length; i < ilen; ++i) {
            curr = scale.getPixelForTick(i);
            updateMinAndPrev();
          }
          return min;
        }
        function computeFitCategoryTraits(index2, ruler, options, stackCount) {
          const thickness = options.barThickness;
          let size, ratio;
          if (isNullOrUndef(thickness)) {
            size = ruler.min * options.categoryPercentage;
            ratio = options.barPercentage;
          } else {
            size = thickness * stackCount;
            ratio = 1;
          }
          return {
            chunk: size / stackCount,
            ratio,
            start: ruler.pixels[index2] - size / 2
          };
        }
        function computeFlexCategoryTraits(index2, ruler, options, stackCount) {
          const pixels = ruler.pixels;
          const curr = pixels[index2];
          let prev = index2 > 0 ? pixels[index2 - 1] : null;
          let next = index2 < pixels.length - 1 ? pixels[index2 + 1] : null;
          const percent = options.categoryPercentage;
          if (prev === null) {
            prev = curr - (next === null ? ruler.end - ruler.start : next - curr);
          }
          if (next === null) {
            next = curr + curr - prev;
          }
          const start = curr - (curr - Math.min(prev, next)) / 2 * percent;
          const size = Math.abs(next - prev) / 2 * percent;
          return {
            chunk: size / stackCount,
            ratio: options.barPercentage,
            start
          };
        }
        function parseFloatBar(entry, item, vScale, i) {
          const startValue = vScale.parse(entry[0], i);
          const endValue = vScale.parse(entry[1], i);
          const min = Math.min(startValue, endValue);
          const max = Math.max(startValue, endValue);
          let barStart = min;
          let barEnd = max;
          if (Math.abs(min) > Math.abs(max)) {
            barStart = max;
            barEnd = min;
          }
          item[vScale.axis] = barEnd;
          item._custom = {
            barStart,
            barEnd,
            start: startValue,
            end: endValue,
            min,
            max
          };
        }
        function parseValue(entry, item, vScale, i) {
          if (isArray(entry)) {
            parseFloatBar(entry, item, vScale, i);
          } else {
            item[vScale.axis] = vScale.parse(entry, i);
          }
          return item;
        }
        function parseArrayOrPrimitive(meta, data, start, count) {
          const iScale = meta.iScale;
          const vScale = meta.vScale;
          const labels = iScale.getLabels();
          const singleScale = iScale === vScale;
          const parsed = [];
          let i, ilen, item, entry;
          for (i = start, ilen = start + count; i < ilen; ++i) {
            entry = data[i];
            item = {};
            item[iScale.axis] = singleScale || iScale.parse(labels[i], i);
            parsed.push(parseValue(entry, item, vScale, i));
          }
          return parsed;
        }
        function isFloatBar(custom) {
          return custom && custom.barStart !== void 0 && custom.barEnd !== void 0;
        }
        function barSign(size, vScale, actualBase) {
          if (size !== 0) {
            return sign(size);
          }
          return (vScale.isHorizontal() ? 1 : -1) * (vScale.min >= actualBase ? 1 : -1);
        }
        function borderProps(properties) {
          let reverse, start, end, top, bottom;
          if (properties.horizontal) {
            reverse = properties.base > properties.x;
            start = "left";
            end = "right";
          } else {
            reverse = properties.base < properties.y;
            start = "bottom";
            end = "top";
          }
          if (reverse) {
            top = "end";
            bottom = "start";
          } else {
            top = "start";
            bottom = "end";
          }
          return { start, end, reverse, top, bottom };
        }
        function setBorderSkipped(properties, options, stack, index2) {
          let edge = options.borderSkipped;
          const res = {};
          if (!edge) {
            properties.borderSkipped = res;
            return;
          }
          if (edge === true) {
            properties.borderSkipped = { top: true, right: true, bottom: true, left: true };
            return;
          }
          const { start, end, reverse, top, bottom } = borderProps(properties);
          if (edge === "middle" && stack) {
            properties.enableBorderRadius = true;
            if ((stack._top || 0) === index2) {
              edge = top;
            } else if ((stack._bottom || 0) === index2) {
              edge = bottom;
            } else {
              res[parseEdge(bottom, start, end, reverse)] = true;
              edge = top;
            }
          }
          res[parseEdge(edge, start, end, reverse)] = true;
          properties.borderSkipped = res;
        }
        function parseEdge(edge, a, b, reverse) {
          if (reverse) {
            edge = swap(edge, a, b);
            edge = startEnd(edge, b, a);
          } else {
            edge = startEnd(edge, a, b);
          }
          return edge;
        }
        function swap(orig, v1, v2) {
          return orig === v1 ? v2 : orig === v2 ? v1 : orig;
        }
        function startEnd(v, start, end) {
          return v === "start" ? start : v === "end" ? end : v;
        }
        function setInflateAmount(properties, { inflateAmount }, ratio) {
          properties.inflateAmount = inflateAmount === "auto" ? ratio === 1 ? 0.33 : 0 : inflateAmount;
        }
        class BarController extends DatasetController {
          parsePrimitiveData(meta, data, start, count) {
            return parseArrayOrPrimitive(meta, data, start, count);
          }
          parseArrayData(meta, data, start, count) {
            return parseArrayOrPrimitive(meta, data, start, count);
          }
          parseObjectData(meta, data, start, count) {
            const { iScale, vScale } = meta;
            const { xAxisKey = "x", yAxisKey = "y" } = this._parsing;
            const iAxisKey = iScale.axis === "x" ? xAxisKey : yAxisKey;
            const vAxisKey = vScale.axis === "x" ? xAxisKey : yAxisKey;
            const parsed = [];
            let i, ilen, item, obj;
            for (i = start, ilen = start + count; i < ilen; ++i) {
              obj = data[i];
              item = {};
              item[iScale.axis] = iScale.parse(resolveObjectKey(obj, iAxisKey), i);
              parsed.push(parseValue(resolveObjectKey(obj, vAxisKey), item, vScale, i));
            }
            return parsed;
          }
          updateRangeFromParsed(range, scale, parsed, stack) {
            super.updateRangeFromParsed(range, scale, parsed, stack);
            const custom = parsed._custom;
            if (custom && scale === this._cachedMeta.vScale) {
              range.min = Math.min(range.min, custom.min);
              range.max = Math.max(range.max, custom.max);
            }
          }
          getMaxOverflow() {
            return 0;
          }
          getLabelAndValue(index2) {
            const meta = this._cachedMeta;
            const { iScale, vScale } = meta;
            const parsed = this.getParsed(index2);
            const custom = parsed._custom;
            const value = isFloatBar(custom) ? "[" + custom.start + ", " + custom.end + "]" : "" + vScale.getLabelForValue(parsed[vScale.axis]);
            return {
              label: "" + iScale.getLabelForValue(parsed[iScale.axis]),
              value
            };
          }
          initialize() {
            this.enableOptionSharing = true;
            super.initialize();
            const meta = this._cachedMeta;
            meta.stack = this.getDataset().stack;
          }
          update(mode) {
            const meta = this._cachedMeta;
            this.updateElements(meta.data, 0, meta.data.length, mode);
          }
          updateElements(bars, start, count, mode) {
            const reset = mode === "reset";
            const { index: index2, _cachedMeta: { vScale } } = this;
            const base = vScale.getBasePixel();
            const horizontal = vScale.isHorizontal();
            const ruler = this._getRuler();
            const { sharedOptions, includeOptions } = this._getSharedOptions(start, mode);
            for (let i = start; i < start + count; i++) {
              const parsed = this.getParsed(i);
              const vpixels = reset || isNullOrUndef(parsed[vScale.axis]) ? { base, head: base } : this._calculateBarValuePixels(i);
              const ipixels = this._calculateBarIndexPixels(i, ruler);
              const stack = (parsed._stacks || {})[vScale.axis];
              const properties = {
                horizontal,
                base: vpixels.base,
                enableBorderRadius: !stack || isFloatBar(parsed._custom) || (index2 === stack._top || index2 === stack._bottom),
                x: horizontal ? vpixels.head : ipixels.center,
                y: horizontal ? ipixels.center : vpixels.head,
                height: horizontal ? ipixels.size : Math.abs(vpixels.size),
                width: horizontal ? Math.abs(vpixels.size) : ipixels.size
              };
              if (includeOptions) {
                properties.options = sharedOptions || this.resolveDataElementOptions(i, bars[i].active ? "active" : mode);
              }
              const options = properties.options || bars[i].options;
              setBorderSkipped(properties, options, stack, index2);
              setInflateAmount(properties, options, ruler.ratio);
              this.updateElement(bars[i], i, properties, mode);
            }
          }
          _getStacks(last, dataIndex) {
            const { iScale } = this._cachedMeta;
            const metasets = iScale.getMatchingVisibleMetas(this._type).filter((meta) => meta.controller.options.grouped);
            const stacked = iScale.options.stacked;
            const stacks = [];
            const skipNull = (meta) => {
              const parsed = meta.controller.getParsed(dataIndex);
              const val = parsed && parsed[meta.vScale.axis];
              if (isNullOrUndef(val) || isNaN(val)) {
                return true;
              }
            };
            for (const meta of metasets) {
              if (dataIndex !== void 0 && skipNull(meta)) {
                continue;
              }
              if (stacked === false || stacks.indexOf(meta.stack) === -1 || stacked === void 0 && meta.stack === void 0) {
                stacks.push(meta.stack);
              }
              if (meta.index === last) {
                break;
              }
            }
            if (!stacks.length) {
              stacks.push(void 0);
            }
            return stacks;
          }
          _getStackCount(index2) {
            return this._getStacks(void 0, index2).length;
          }
          _getStackIndex(datasetIndex, name, dataIndex) {
            const stacks = this._getStacks(datasetIndex, dataIndex);
            const index2 = name !== void 0 ? stacks.indexOf(name) : -1;
            return index2 === -1 ? stacks.length - 1 : index2;
          }
          _getRuler() {
            const opts = this.options;
            const meta = this._cachedMeta;
            const iScale = meta.iScale;
            const pixels = [];
            let i, ilen;
            for (i = 0, ilen = meta.data.length; i < ilen; ++i) {
              pixels.push(iScale.getPixelForValue(this.getParsed(i)[iScale.axis], i));
            }
            const barThickness = opts.barThickness;
            const min = barThickness || computeMinSampleSize(meta);
            return {
              min,
              pixels,
              start: iScale._startPixel,
              end: iScale._endPixel,
              stackCount: this._getStackCount(),
              scale: iScale,
              grouped: opts.grouped,
              ratio: barThickness ? 1 : opts.categoryPercentage * opts.barPercentage
            };
          }
          _calculateBarValuePixels(index2) {
            const { _cachedMeta: { vScale, _stacked }, options: { base: baseValue, minBarLength } } = this;
            const actualBase = baseValue || 0;
            const parsed = this.getParsed(index2);
            const custom = parsed._custom;
            const floating = isFloatBar(custom);
            let value = parsed[vScale.axis];
            let start = 0;
            let length = _stacked ? this.applyStack(vScale, parsed, _stacked) : value;
            let head, size;
            if (length !== value) {
              start = length - value;
              length = value;
            }
            if (floating) {
              value = custom.barStart;
              length = custom.barEnd - custom.barStart;
              if (value !== 0 && sign(value) !== sign(custom.barEnd)) {
                start = 0;
              }
              start += value;
            }
            const startValue = !isNullOrUndef(baseValue) && !floating ? baseValue : start;
            let base = vScale.getPixelForValue(startValue);
            if (this.chart.getDataVisibility(index2)) {
              head = vScale.getPixelForValue(start + length);
            } else {
              head = base;
            }
            size = head - base;
            if (Math.abs(size) < minBarLength) {
              size = barSign(size, vScale, actualBase) * minBarLength;
              if (value === actualBase) {
                base -= size / 2;
              }
              const startPixel = vScale.getPixelForDecimal(0);
              const endPixel = vScale.getPixelForDecimal(1);
              const min = Math.min(startPixel, endPixel);
              const max = Math.max(startPixel, endPixel);
              base = Math.max(Math.min(base, max), min);
              head = base + size;
            }
            if (base === vScale.getPixelForValue(actualBase)) {
              const halfGrid = sign(size) * vScale.getLineWidthForValue(actualBase) / 2;
              base += halfGrid;
              size -= halfGrid;
            }
            return {
              size,
              base,
              head,
              center: head + size / 2
            };
          }
          _calculateBarIndexPixels(index2, ruler) {
            const scale = ruler.scale;
            const options = this.options;
            const skipNull = options.skipNull;
            const maxBarThickness = valueOrDefault(options.maxBarThickness, Infinity);
            let center, size;
            if (ruler.grouped) {
              const stackCount = skipNull ? this._getStackCount(index2) : ruler.stackCount;
              const range = options.barThickness === "flex" ? computeFlexCategoryTraits(index2, ruler, options, stackCount) : computeFitCategoryTraits(index2, ruler, options, stackCount);
              const stackIndex = this._getStackIndex(this.index, this._cachedMeta.stack, skipNull ? index2 : void 0);
              center = range.start + range.chunk * stackIndex + range.chunk / 2;
              size = Math.min(maxBarThickness, range.chunk * range.ratio);
            } else {
              center = scale.getPixelForValue(this.getParsed(index2)[scale.axis], index2);
              size = Math.min(maxBarThickness, ruler.min * ruler.ratio);
            }
            return {
              base: center - size / 2,
              head: center + size / 2,
              center,
              size
            };
          }
          draw() {
            const meta = this._cachedMeta;
            const vScale = meta.vScale;
            const rects = meta.data;
            const ilen = rects.length;
            let i = 0;
            for (; i < ilen; ++i) {
              if (this.getParsed(i)[vScale.axis] !== null) {
                rects[i].draw(this._ctx);
              }
            }
          }
        }
        BarController.id = "bar";
        BarController.defaults = {
          datasetElementType: false,
          dataElementType: "bar",
          categoryPercentage: 0.8,
          barPercentage: 0.9,
          grouped: true,
          animations: {
            numbers: {
              type: "number",
              properties: ["x", "y", "base", "width", "height"]
            }
          }
        };
        BarController.overrides = {
          scales: {
            _index_: {
              type: "category",
              offset: true,
              grid: {
                offset: true
              }
            },
            _value_: {
              type: "linear",
              beginAtZero: true
            }
          }
        };
        class BubbleController extends DatasetController {
          initialize() {
            this.enableOptionSharing = true;
            super.initialize();
          }
          parsePrimitiveData(meta, data, start, count) {
            const parsed = super.parsePrimitiveData(meta, data, start, count);
            for (let i = 0; i < parsed.length; i++) {
              parsed[i]._custom = this.resolveDataElementOptions(i + start).radius;
            }
            return parsed;
          }
          parseArrayData(meta, data, start, count) {
            const parsed = super.parseArrayData(meta, data, start, count);
            for (let i = 0; i < parsed.length; i++) {
              const item = data[start + i];
              parsed[i]._custom = valueOrDefault(item[2], this.resolveDataElementOptions(i + start).radius);
            }
            return parsed;
          }
          parseObjectData(meta, data, start, count) {
            const parsed = super.parseObjectData(meta, data, start, count);
            for (let i = 0; i < parsed.length; i++) {
              const item = data[start + i];
              parsed[i]._custom = valueOrDefault(item && item.r && +item.r, this.resolveDataElementOptions(i + start).radius);
            }
            return parsed;
          }
          getMaxOverflow() {
            const data = this._cachedMeta.data;
            let max = 0;
            for (let i = data.length - 1; i >= 0; --i) {
              max = Math.max(max, data[i].size(this.resolveDataElementOptions(i)) / 2);
            }
            return max > 0 && max;
          }
          getLabelAndValue(index2) {
            const meta = this._cachedMeta;
            const { xScale, yScale } = meta;
            const parsed = this.getParsed(index2);
            const x = xScale.getLabelForValue(parsed.x);
            const y = yScale.getLabelForValue(parsed.y);
            const r = parsed._custom;
            return {
              label: meta.label,
              value: "(" + x + ", " + y + (r ? ", " + r : "") + ")"
            };
          }
          update(mode) {
            const points = this._cachedMeta.data;
            this.updateElements(points, 0, points.length, mode);
          }
          updateElements(points, start, count, mode) {
            const reset = mode === "reset";
            const { iScale, vScale } = this._cachedMeta;
            const { sharedOptions, includeOptions } = this._getSharedOptions(start, mode);
            const iAxis = iScale.axis;
            const vAxis = vScale.axis;
            for (let i = start; i < start + count; i++) {
              const point = points[i];
              const parsed = !reset && this.getParsed(i);
              const properties = {};
              const iPixel = properties[iAxis] = reset ? iScale.getPixelForDecimal(0.5) : iScale.getPixelForValue(parsed[iAxis]);
              const vPixel = properties[vAxis] = reset ? vScale.getBasePixel() : vScale.getPixelForValue(parsed[vAxis]);
              properties.skip = isNaN(iPixel) || isNaN(vPixel);
              if (includeOptions) {
                properties.options = sharedOptions || this.resolveDataElementOptions(i, point.active ? "active" : mode);
                if (reset) {
                  properties.options.radius = 0;
                }
              }
              this.updateElement(point, i, properties, mode);
            }
          }
          resolveDataElementOptions(index2, mode) {
            const parsed = this.getParsed(index2);
            let values = super.resolveDataElementOptions(index2, mode);
            if (values.$shared) {
              values = Object.assign({}, values, { $shared: false });
            }
            const radius = values.radius;
            if (mode !== "active") {
              values.radius = 0;
            }
            values.radius += valueOrDefault(parsed && parsed._custom, radius);
            return values;
          }
        }
        BubbleController.id = "bubble";
        BubbleController.defaults = {
          datasetElementType: false,
          dataElementType: "point",
          animations: {
            numbers: {
              type: "number",
              properties: ["x", "y", "borderWidth", "radius"]
            }
          }
        };
        BubbleController.overrides = {
          scales: {
            x: {
              type: "linear"
            },
            y: {
              type: "linear"
            }
          },
          plugins: {
            tooltip: {
              callbacks: {
                title() {
                  return "";
                }
              }
            }
          }
        };
        function getRatioAndOffset(rotation, circumference, cutout) {
          let ratioX = 1;
          let ratioY = 1;
          let offsetX = 0;
          let offsetY = 0;
          if (circumference < TAU) {
            const startAngle = rotation;
            const endAngle = startAngle + circumference;
            const startX = Math.cos(startAngle);
            const startY = Math.sin(startAngle);
            const endX = Math.cos(endAngle);
            const endY = Math.sin(endAngle);
            const calcMax = (angle, a, b) => _angleBetween(angle, startAngle, endAngle, true) ? 1 : Math.max(a, a * cutout, b, b * cutout);
            const calcMin = (angle, a, b) => _angleBetween(angle, startAngle, endAngle, true) ? -1 : Math.min(a, a * cutout, b, b * cutout);
            const maxX = calcMax(0, startX, endX);
            const maxY = calcMax(HALF_PI, startY, endY);
            const minX = calcMin(PI, startX, endX);
            const minY = calcMin(PI + HALF_PI, startY, endY);
            ratioX = (maxX - minX) / 2;
            ratioY = (maxY - minY) / 2;
            offsetX = -(maxX + minX) / 2;
            offsetY = -(maxY + minY) / 2;
          }
          return { ratioX, ratioY, offsetX, offsetY };
        }
        class DoughnutController extends DatasetController {
          constructor(chart, datasetIndex) {
            super(chart, datasetIndex);
            this.enableOptionSharing = true;
            this.innerRadius = void 0;
            this.outerRadius = void 0;
            this.offsetX = void 0;
            this.offsetY = void 0;
          }
          linkScales() {
          }
          parse(start, count) {
            const data = this.getDataset().data;
            const meta = this._cachedMeta;
            if (this._parsing === false) {
              meta._parsed = data;
            } else {
              let getter = (i2) => +data[i2];
              if (isObject(data[start])) {
                const { key = "value" } = this._parsing;
                getter = (i2) => +resolveObjectKey(data[i2], key);
              }
              let i, ilen;
              for (i = start, ilen = start + count; i < ilen; ++i) {
                meta._parsed[i] = getter(i);
              }
            }
          }
          _getRotation() {
            return toRadians(this.options.rotation - 90);
          }
          _getCircumference() {
            return toRadians(this.options.circumference);
          }
          _getRotationExtents() {
            let min = TAU;
            let max = -TAU;
            for (let i = 0; i < this.chart.data.datasets.length; ++i) {
              if (this.chart.isDatasetVisible(i)) {
                const controller = this.chart.getDatasetMeta(i).controller;
                const rotation = controller._getRotation();
                const circumference = controller._getCircumference();
                min = Math.min(min, rotation);
                max = Math.max(max, rotation + circumference);
              }
            }
            return {
              rotation: min,
              circumference: max - min
            };
          }
          update(mode) {
            const chart = this.chart;
            const { chartArea } = chart;
            const meta = this._cachedMeta;
            const arcs = meta.data;
            const spacing = this.getMaxBorderWidth() + this.getMaxOffset(arcs) + this.options.spacing;
            const maxSize = Math.max((Math.min(chartArea.width, chartArea.height) - spacing) / 2, 0);
            const cutout = Math.min(toPercentage(this.options.cutout, maxSize), 1);
            const chartWeight = this._getRingWeight(this.index);
            const { circumference, rotation } = this._getRotationExtents();
            const { ratioX, ratioY, offsetX, offsetY } = getRatioAndOffset(rotation, circumference, cutout);
            const maxWidth = (chartArea.width - spacing) / ratioX;
            const maxHeight = (chartArea.height - spacing) / ratioY;
            const maxRadius = Math.max(Math.min(maxWidth, maxHeight) / 2, 0);
            const outerRadius = toDimension(this.options.radius, maxRadius);
            const innerRadius = Math.max(outerRadius * cutout, 0);
            const radiusLength = (outerRadius - innerRadius) / this._getVisibleDatasetWeightTotal();
            this.offsetX = offsetX * outerRadius;
            this.offsetY = offsetY * outerRadius;
            meta.total = this.calculateTotal();
            this.outerRadius = outerRadius - radiusLength * this._getRingWeightOffset(this.index);
            this.innerRadius = Math.max(this.outerRadius - radiusLength * chartWeight, 0);
            this.updateElements(arcs, 0, arcs.length, mode);
          }
          _circumference(i, reset) {
            const opts = this.options;
            const meta = this._cachedMeta;
            const circumference = this._getCircumference();
            if (reset && opts.animation.animateRotate || !this.chart.getDataVisibility(i) || meta._parsed[i] === null || meta.data[i].hidden) {
              return 0;
            }
            return this.calculateCircumference(meta._parsed[i] * circumference / TAU);
          }
          updateElements(arcs, start, count, mode) {
            const reset = mode === "reset";
            const chart = this.chart;
            const chartArea = chart.chartArea;
            const opts = chart.options;
            const animationOpts = opts.animation;
            const centerX = (chartArea.left + chartArea.right) / 2;
            const centerY = (chartArea.top + chartArea.bottom) / 2;
            const animateScale = reset && animationOpts.animateScale;
            const innerRadius = animateScale ? 0 : this.innerRadius;
            const outerRadius = animateScale ? 0 : this.outerRadius;
            const { sharedOptions, includeOptions } = this._getSharedOptions(start, mode);
            let startAngle = this._getRotation();
            let i;
            for (i = 0; i < start; ++i) {
              startAngle += this._circumference(i, reset);
            }
            for (i = start; i < start + count; ++i) {
              const circumference = this._circumference(i, reset);
              const arc = arcs[i];
              const properties = {
                x: centerX + this.offsetX,
                y: centerY + this.offsetY,
                startAngle,
                endAngle: startAngle + circumference,
                circumference,
                outerRadius,
                innerRadius
              };
              if (includeOptions) {
                properties.options = sharedOptions || this.resolveDataElementOptions(i, arc.active ? "active" : mode);
              }
              startAngle += circumference;
              this.updateElement(arc, i, properties, mode);
            }
          }
          calculateTotal() {
            const meta = this._cachedMeta;
            const metaData = meta.data;
            let total = 0;
            let i;
            for (i = 0; i < metaData.length; i++) {
              const value = meta._parsed[i];
              if (value !== null && !isNaN(value) && this.chart.getDataVisibility(i) && !metaData[i].hidden) {
                total += Math.abs(value);
              }
            }
            return total;
          }
          calculateCircumference(value) {
            const total = this._cachedMeta.total;
            if (total > 0 && !isNaN(value)) {
              return TAU * (Math.abs(value) / total);
            }
            return 0;
          }
          getLabelAndValue(index2) {
            const meta = this._cachedMeta;
            const chart = this.chart;
            const labels = chart.data.labels || [];
            const value = formatNumber(meta._parsed[index2], chart.options.locale);
            return {
              label: labels[index2] || "",
              value
            };
          }
          getMaxBorderWidth(arcs) {
            let max = 0;
            const chart = this.chart;
            let i, ilen, meta, controller, options;
            if (!arcs) {
              for (i = 0, ilen = chart.data.datasets.length; i < ilen; ++i) {
                if (chart.isDatasetVisible(i)) {
                  meta = chart.getDatasetMeta(i);
                  arcs = meta.data;
                  controller = meta.controller;
                  break;
                }
              }
            }
            if (!arcs) {
              return 0;
            }
            for (i = 0, ilen = arcs.length; i < ilen; ++i) {
              options = controller.resolveDataElementOptions(i);
              if (options.borderAlign !== "inner") {
                max = Math.max(max, options.borderWidth || 0, options.hoverBorderWidth || 0);
              }
            }
            return max;
          }
          getMaxOffset(arcs) {
            let max = 0;
            for (let i = 0, ilen = arcs.length; i < ilen; ++i) {
              const options = this.resolveDataElementOptions(i);
              max = Math.max(max, options.offset || 0, options.hoverOffset || 0);
            }
            return max;
          }
          _getRingWeightOffset(datasetIndex) {
            let ringWeightOffset = 0;
            for (let i = 0; i < datasetIndex; ++i) {
              if (this.chart.isDatasetVisible(i)) {
                ringWeightOffset += this._getRingWeight(i);
              }
            }
            return ringWeightOffset;
          }
          _getRingWeight(datasetIndex) {
            return Math.max(valueOrDefault(this.chart.data.datasets[datasetIndex].weight, 1), 0);
          }
          _getVisibleDatasetWeightTotal() {
            return this._getRingWeightOffset(this.chart.data.datasets.length) || 1;
          }
        }
        DoughnutController.id = "doughnut";
        DoughnutController.defaults = {
          datasetElementType: false,
          dataElementType: "arc",
          animation: {
            animateRotate: true,
            animateScale: false
          },
          animations: {
            numbers: {
              type: "number",
              properties: ["circumference", "endAngle", "innerRadius", "outerRadius", "startAngle", "x", "y", "offset", "borderWidth", "spacing"]
            }
          },
          cutout: "50%",
          rotation: 0,
          circumference: 360,
          radius: "100%",
          spacing: 0,
          indexAxis: "r"
        };
        DoughnutController.descriptors = {
          _scriptable: (name) => name !== "spacing",
          _indexable: (name) => name !== "spacing"
        };
        DoughnutController.overrides = {
          aspectRatio: 1,
          plugins: {
            legend: {
              labels: {
                generateLabels(chart) {
                  const data = chart.data;
                  if (data.labels.length && data.datasets.length) {
                    const { labels: { pointStyle } } = chart.legend.options;
                    return data.labels.map((label, i) => {
                      const meta = chart.getDatasetMeta(0);
                      const style = meta.controller.getStyle(i);
                      return {
                        text: label,
                        fillStyle: style.backgroundColor,
                        strokeStyle: style.borderColor,
                        lineWidth: style.borderWidth,
                        pointStyle,
                        hidden: !chart.getDataVisibility(i),
                        index: i
                      };
                    });
                  }
                  return [];
                }
              },
              onClick(e, legendItem, legend) {
                legend.chart.toggleDataVisibility(legendItem.index);
                legend.chart.update();
              }
            },
            tooltip: {
              callbacks: {
                title() {
                  return "";
                },
                label(tooltipItem) {
                  let dataLabel = tooltipItem.label;
                  const value = ": " + tooltipItem.formattedValue;
                  if (isArray(dataLabel)) {
                    dataLabel = dataLabel.slice();
                    dataLabel[0] += value;
                  } else {
                    dataLabel += value;
                  }
                  return dataLabel;
                }
              }
            }
          }
        };
        class LineController extends DatasetController {
          initialize() {
            this.enableOptionSharing = true;
            this.supportsDecimation = true;
            super.initialize();
          }
          update(mode) {
            const meta = this._cachedMeta;
            const { dataset: line, data: points = [], _dataset } = meta;
            const animationsDisabled = this.chart._animationsDisabled;
            let { start, count } = _getStartAndCountOfVisiblePoints(meta, points, animationsDisabled);
            this._drawStart = start;
            this._drawCount = count;
            if (_scaleRangesChanged(meta)) {
              start = 0;
              count = points.length;
            }
            line._chart = this.chart;
            line._datasetIndex = this.index;
            line._decimated = !!_dataset._decimated;
            line.points = points;
            const options = this.resolveDatasetElementOptions(mode);
            if (!this.options.showLine) {
              options.borderWidth = 0;
            }
            options.segment = this.options.segment;
            this.updateElement(line, void 0, {
              animated: !animationsDisabled,
              options
            }, mode);
            this.updateElements(points, start, count, mode);
          }
          updateElements(points, start, count, mode) {
            const reset = mode === "reset";
            const { iScale, vScale, _stacked, _dataset } = this._cachedMeta;
            const { sharedOptions, includeOptions } = this._getSharedOptions(start, mode);
            const iAxis = iScale.axis;
            const vAxis = vScale.axis;
            const { spanGaps, segment } = this.options;
            const maxGapLength = isNumber(spanGaps) ? spanGaps : Number.POSITIVE_INFINITY;
            const directUpdate = this.chart._animationsDisabled || reset || mode === "none";
            let prevParsed = start > 0 && this.getParsed(start - 1);
            for (let i = start; i < start + count; ++i) {
              const point = points[i];
              const parsed = this.getParsed(i);
              const properties = directUpdate ? point : {};
              const nullData = isNullOrUndef(parsed[vAxis]);
              const iPixel = properties[iAxis] = iScale.getPixelForValue(parsed[iAxis], i);
              const vPixel = properties[vAxis] = reset || nullData ? vScale.getBasePixel() : vScale.getPixelForValue(_stacked ? this.applyStack(vScale, parsed, _stacked) : parsed[vAxis], i);
              properties.skip = isNaN(iPixel) || isNaN(vPixel) || nullData;
              properties.stop = i > 0 && Math.abs(parsed[iAxis] - prevParsed[iAxis]) > maxGapLength;
              if (segment) {
                properties.parsed = parsed;
                properties.raw = _dataset.data[i];
              }
              if (includeOptions) {
                properties.options = sharedOptions || this.resolveDataElementOptions(i, point.active ? "active" : mode);
              }
              if (!directUpdate) {
                this.updateElement(point, i, properties, mode);
              }
              prevParsed = parsed;
            }
          }
          getMaxOverflow() {
            const meta = this._cachedMeta;
            const dataset = meta.dataset;
            const border = dataset.options && dataset.options.borderWidth || 0;
            const data = meta.data || [];
            if (!data.length) {
              return border;
            }
            const firstPoint = data[0].size(this.resolveDataElementOptions(0));
            const lastPoint = data[data.length - 1].size(this.resolveDataElementOptions(data.length - 1));
            return Math.max(border, firstPoint, lastPoint) / 2;
          }
          draw() {
            const meta = this._cachedMeta;
            meta.dataset.updateControlPoints(this.chart.chartArea, meta.iScale.axis);
            super.draw();
          }
        }
        LineController.id = "line";
        LineController.defaults = {
          datasetElementType: "line",
          dataElementType: "point",
          showLine: true,
          spanGaps: false
        };
        LineController.overrides = {
          scales: {
            _index_: {
              type: "category"
            },
            _value_: {
              type: "linear"
            }
          }
        };
        class PolarAreaController extends DatasetController {
          constructor(chart, datasetIndex) {
            super(chart, datasetIndex);
            this.innerRadius = void 0;
            this.outerRadius = void 0;
          }
          getLabelAndValue(index2) {
            const meta = this._cachedMeta;
            const chart = this.chart;
            const labels = chart.data.labels || [];
            const value = formatNumber(meta._parsed[index2].r, chart.options.locale);
            return {
              label: labels[index2] || "",
              value
            };
          }
          parseObjectData(meta, data, start, count) {
            return _parseObjectDataRadialScale.bind(this)(meta, data, start, count);
          }
          update(mode) {
            const arcs = this._cachedMeta.data;
            this._updateRadius();
            this.updateElements(arcs, 0, arcs.length, mode);
          }
          getMinMax() {
            const meta = this._cachedMeta;
            const range = { min: Number.POSITIVE_INFINITY, max: Number.NEGATIVE_INFINITY };
            meta.data.forEach((element, index2) => {
              const parsed = this.getParsed(index2).r;
              if (!isNaN(parsed) && this.chart.getDataVisibility(index2)) {
                if (parsed < range.min) {
                  range.min = parsed;
                }
                if (parsed > range.max) {
                  range.max = parsed;
                }
              }
            });
            return range;
          }
          _updateRadius() {
            const chart = this.chart;
            const chartArea = chart.chartArea;
            const opts = chart.options;
            const minSize = Math.min(chartArea.right - chartArea.left, chartArea.bottom - chartArea.top);
            const outerRadius = Math.max(minSize / 2, 0);
            const innerRadius = Math.max(opts.cutoutPercentage ? outerRadius / 100 * opts.cutoutPercentage : 1, 0);
            const radiusLength = (outerRadius - innerRadius) / chart.getVisibleDatasetCount();
            this.outerRadius = outerRadius - radiusLength * this.index;
            this.innerRadius = this.outerRadius - radiusLength;
          }
          updateElements(arcs, start, count, mode) {
            const reset = mode === "reset";
            const chart = this.chart;
            const opts = chart.options;
            const animationOpts = opts.animation;
            const scale = this._cachedMeta.rScale;
            const centerX = scale.xCenter;
            const centerY = scale.yCenter;
            const datasetStartAngle = scale.getIndexAngle(0) - 0.5 * PI;
            let angle = datasetStartAngle;
            let i;
            const defaultAngle = 360 / this.countVisibleElements();
            for (i = 0; i < start; ++i) {
              angle += this._computeAngle(i, mode, defaultAngle);
            }
            for (i = start; i < start + count; i++) {
              const arc = arcs[i];
              let startAngle = angle;
              let endAngle = angle + this._computeAngle(i, mode, defaultAngle);
              let outerRadius = chart.getDataVisibility(i) ? scale.getDistanceFromCenterForValue(this.getParsed(i).r) : 0;
              angle = endAngle;
              if (reset) {
                if (animationOpts.animateScale) {
                  outerRadius = 0;
                }
                if (animationOpts.animateRotate) {
                  startAngle = endAngle = datasetStartAngle;
                }
              }
              const properties = {
                x: centerX,
                y: centerY,
                innerRadius: 0,
                outerRadius,
                startAngle,
                endAngle,
                options: this.resolveDataElementOptions(i, arc.active ? "active" : mode)
              };
              this.updateElement(arc, i, properties, mode);
            }
          }
          countVisibleElements() {
            const meta = this._cachedMeta;
            let count = 0;
            meta.data.forEach((element, index2) => {
              if (!isNaN(this.getParsed(index2).r) && this.chart.getDataVisibility(index2)) {
                count++;
              }
            });
            return count;
          }
          _computeAngle(index2, mode, defaultAngle) {
            return this.chart.getDataVisibility(index2) ? toRadians(this.resolveDataElementOptions(index2, mode).angle || defaultAngle) : 0;
          }
        }
        PolarAreaController.id = "polarArea";
        PolarAreaController.defaults = {
          dataElementType: "arc",
          animation: {
            animateRotate: true,
            animateScale: true
          },
          animations: {
            numbers: {
              type: "number",
              properties: ["x", "y", "startAngle", "endAngle", "innerRadius", "outerRadius"]
            }
          },
          indexAxis: "r",
          startAngle: 0
        };
        PolarAreaController.overrides = {
          aspectRatio: 1,
          plugins: {
            legend: {
              labels: {
                generateLabels(chart) {
                  const data = chart.data;
                  if (data.labels.length && data.datasets.length) {
                    const { labels: { pointStyle } } = chart.legend.options;
                    return data.labels.map((label, i) => {
                      const meta = chart.getDatasetMeta(0);
                      const style = meta.controller.getStyle(i);
                      return {
                        text: label,
                        fillStyle: style.backgroundColor,
                        strokeStyle: style.borderColor,
                        lineWidth: style.borderWidth,
                        pointStyle,
                        hidden: !chart.getDataVisibility(i),
                        index: i
                      };
                    });
                  }
                  return [];
                }
              },
              onClick(e, legendItem, legend) {
                legend.chart.toggleDataVisibility(legendItem.index);
                legend.chart.update();
              }
            },
            tooltip: {
              callbacks: {
                title() {
                  return "";
                },
                label(context) {
                  return context.chart.data.labels[context.dataIndex] + ": " + context.formattedValue;
                }
              }
            }
          },
          scales: {
            r: {
              type: "radialLinear",
              angleLines: {
                display: false
              },
              beginAtZero: true,
              grid: {
                circular: true
              },
              pointLabels: {
                display: false
              },
              startAngle: 0
            }
          }
        };
        class PieController extends DoughnutController {
        }
        PieController.id = "pie";
        PieController.defaults = {
          cutout: 0,
          rotation: 0,
          circumference: 360,
          radius: "100%"
        };
        class RadarController extends DatasetController {
          getLabelAndValue(index2) {
            const vScale = this._cachedMeta.vScale;
            const parsed = this.getParsed(index2);
            return {
              label: vScale.getLabels()[index2],
              value: "" + vScale.getLabelForValue(parsed[vScale.axis])
            };
          }
          parseObjectData(meta, data, start, count) {
            return _parseObjectDataRadialScale.bind(this)(meta, data, start, count);
          }
          update(mode) {
            const meta = this._cachedMeta;
            const line = meta.dataset;
            const points = meta.data || [];
            const labels = meta.iScale.getLabels();
            line.points = points;
            if (mode !== "resize") {
              const options = this.resolveDatasetElementOptions(mode);
              if (!this.options.showLine) {
                options.borderWidth = 0;
              }
              const properties = {
                _loop: true,
                _fullLoop: labels.length === points.length,
                options
              };
              this.updateElement(line, void 0, properties, mode);
            }
            this.updateElements(points, 0, points.length, mode);
          }
          updateElements(points, start, count, mode) {
            const scale = this._cachedMeta.rScale;
            const reset = mode === "reset";
            for (let i = start; i < start + count; i++) {
              const point = points[i];
              const options = this.resolveDataElementOptions(i, point.active ? "active" : mode);
              const pointPosition = scale.getPointPositionForValue(i, this.getParsed(i).r);
              const x = reset ? scale.xCenter : pointPosition.x;
              const y = reset ? scale.yCenter : pointPosition.y;
              const properties = {
                x,
                y,
                angle: pointPosition.angle,
                skip: isNaN(x) || isNaN(y),
                options
              };
              this.updateElement(point, i, properties, mode);
            }
          }
        }
        RadarController.id = "radar";
        RadarController.defaults = {
          datasetElementType: "line",
          dataElementType: "point",
          indexAxis: "r",
          showLine: true,
          elements: {
            line: {
              fill: "start"
            }
          }
        };
        RadarController.overrides = {
          aspectRatio: 1,
          scales: {
            r: {
              type: "radialLinear"
            }
          }
        };
        class ScatterController extends DatasetController {
          update(mode) {
            const meta = this._cachedMeta;
            const { data: points = [] } = meta;
            const animationsDisabled = this.chart._animationsDisabled;
            let { start, count } = _getStartAndCountOfVisiblePoints(meta, points, animationsDisabled);
            this._drawStart = start;
            this._drawCount = count;
            if (_scaleRangesChanged(meta)) {
              start = 0;
              count = points.length;
            }
            if (this.options.showLine) {
              const { dataset: line, _dataset } = meta;
              line._chart = this.chart;
              line._datasetIndex = this.index;
              line._decimated = !!_dataset._decimated;
              line.points = points;
              const options = this.resolveDatasetElementOptions(mode);
              options.segment = this.options.segment;
              this.updateElement(line, void 0, {
                animated: !animationsDisabled,
                options
              }, mode);
            }
            this.updateElements(points, start, count, mode);
          }
          addElements() {
            const { showLine } = this.options;
            if (!this.datasetElementType && showLine) {
              this.datasetElementType = registry.getElement("line");
            }
            super.addElements();
          }
          updateElements(points, start, count, mode) {
            const reset = mode === "reset";
            const { iScale, vScale, _stacked, _dataset } = this._cachedMeta;
            const firstOpts = this.resolveDataElementOptions(start, mode);
            const sharedOptions = this.getSharedOptions(firstOpts);
            const includeOptions = this.includeOptions(mode, sharedOptions);
            const iAxis = iScale.axis;
            const vAxis = vScale.axis;
            const { spanGaps, segment } = this.options;
            const maxGapLength = isNumber(spanGaps) ? spanGaps : Number.POSITIVE_INFINITY;
            const directUpdate = this.chart._animationsDisabled || reset || mode === "none";
            let prevParsed = start > 0 && this.getParsed(start - 1);
            for (let i = start; i < start + count; ++i) {
              const point = points[i];
              const parsed = this.getParsed(i);
              const properties = directUpdate ? point : {};
              const nullData = isNullOrUndef(parsed[vAxis]);
              const iPixel = properties[iAxis] = iScale.getPixelForValue(parsed[iAxis], i);
              const vPixel = properties[vAxis] = reset || nullData ? vScale.getBasePixel() : vScale.getPixelForValue(_stacked ? this.applyStack(vScale, parsed, _stacked) : parsed[vAxis], i);
              properties.skip = isNaN(iPixel) || isNaN(vPixel) || nullData;
              properties.stop = i > 0 && Math.abs(parsed[iAxis] - prevParsed[iAxis]) > maxGapLength;
              if (segment) {
                properties.parsed = parsed;
                properties.raw = _dataset.data[i];
              }
              if (includeOptions) {
                properties.options = sharedOptions || this.resolveDataElementOptions(i, point.active ? "active" : mode);
              }
              if (!directUpdate) {
                this.updateElement(point, i, properties, mode);
              }
              prevParsed = parsed;
            }
            this.updateSharedOptions(sharedOptions, mode, firstOpts);
          }
          getMaxOverflow() {
            const meta = this._cachedMeta;
            const data = meta.data || [];
            if (!this.options.showLine) {
              let max = 0;
              for (let i = data.length - 1; i >= 0; --i) {
                max = Math.max(max, data[i].size(this.resolveDataElementOptions(i)) / 2);
              }
              return max > 0 && max;
            }
            const dataset = meta.dataset;
            const border = dataset.options && dataset.options.borderWidth || 0;
            if (!data.length) {
              return border;
            }
            const firstPoint = data[0].size(this.resolveDataElementOptions(0));
            const lastPoint = data[data.length - 1].size(this.resolveDataElementOptions(data.length - 1));
            return Math.max(border, firstPoint, lastPoint) / 2;
          }
        }
        ScatterController.id = "scatter";
        ScatterController.defaults = {
          datasetElementType: false,
          dataElementType: "point",
          showLine: false,
          fill: false
        };
        ScatterController.overrides = {
          interaction: {
            mode: "point"
          },
          plugins: {
            tooltip: {
              callbacks: {
                title() {
                  return "";
                },
                label(item) {
                  return "(" + item.label + ", " + item.formattedValue + ")";
                }
              }
            }
          },
          scales: {
            x: {
              type: "linear"
            },
            y: {
              type: "linear"
            }
          }
        };
        var controllers = /* @__PURE__ */ Object.freeze({
          __proto__: null,
          BarController,
          BubbleController,
          DoughnutController,
          LineController,
          PolarAreaController,
          PieController,
          RadarController,
          ScatterController
        });
        function clipArc(ctx, element, endAngle) {
          const { startAngle, pixelMargin, x, y, outerRadius, innerRadius } = element;
          let angleMargin = pixelMargin / outerRadius;
          ctx.beginPath();
          ctx.arc(x, y, outerRadius, startAngle - angleMargin, endAngle + angleMargin);
          if (innerRadius > pixelMargin) {
            angleMargin = pixelMargin / innerRadius;
            ctx.arc(x, y, innerRadius, endAngle + angleMargin, startAngle - angleMargin, true);
          } else {
            ctx.arc(x, y, pixelMargin, endAngle + HALF_PI, startAngle - HALF_PI);
          }
          ctx.closePath();
          ctx.clip();
        }
        function toRadiusCorners(value) {
          return _readValueToProps(value, ["outerStart", "outerEnd", "innerStart", "innerEnd"]);
        }
        function parseBorderRadius$1(arc, innerRadius, outerRadius, angleDelta) {
          const o = toRadiusCorners(arc.options.borderRadius);
          const halfThickness = (outerRadius - innerRadius) / 2;
          const innerLimit = Math.min(halfThickness, angleDelta * innerRadius / 2);
          const computeOuterLimit = (val) => {
            const outerArcLimit = (outerRadius - Math.min(halfThickness, val)) * angleDelta / 2;
            return _limitValue(val, 0, Math.min(halfThickness, outerArcLimit));
          };
          return {
            outerStart: computeOuterLimit(o.outerStart),
            outerEnd: computeOuterLimit(o.outerEnd),
            innerStart: _limitValue(o.innerStart, 0, innerLimit),
            innerEnd: _limitValue(o.innerEnd, 0, innerLimit)
          };
        }
        function rThetaToXY(r, theta, x, y) {
          return {
            x: x + r * Math.cos(theta),
            y: y + r * Math.sin(theta)
          };
        }
        function pathArc(ctx, element, offset, spacing, end, circular) {
          const { x, y, startAngle: start, pixelMargin, innerRadius: innerR } = element;
          const outerRadius = Math.max(element.outerRadius + spacing + offset - pixelMargin, 0);
          const innerRadius = innerR > 0 ? innerR + spacing + offset + pixelMargin : 0;
          let spacingOffset = 0;
          const alpha2 = end - start;
          if (spacing) {
            const noSpacingInnerRadius = innerR > 0 ? innerR - spacing : 0;
            const noSpacingOuterRadius = outerRadius > 0 ? outerRadius - spacing : 0;
            const avNogSpacingRadius = (noSpacingInnerRadius + noSpacingOuterRadius) / 2;
            const adjustedAngle = avNogSpacingRadius !== 0 ? alpha2 * avNogSpacingRadius / (avNogSpacingRadius + spacing) : alpha2;
            spacingOffset = (alpha2 - adjustedAngle) / 2;
          }
          const beta = Math.max(1e-3, alpha2 * outerRadius - offset / PI) / outerRadius;
          const angleOffset = (alpha2 - beta) / 2;
          const startAngle = start + angleOffset + spacingOffset;
          const endAngle = end - angleOffset - spacingOffset;
          const { outerStart, outerEnd, innerStart, innerEnd } = parseBorderRadius$1(element, innerRadius, outerRadius, endAngle - startAngle);
          const outerStartAdjustedRadius = outerRadius - outerStart;
          const outerEndAdjustedRadius = outerRadius - outerEnd;
          const outerStartAdjustedAngle = startAngle + outerStart / outerStartAdjustedRadius;
          const outerEndAdjustedAngle = endAngle - outerEnd / outerEndAdjustedRadius;
          const innerStartAdjustedRadius = innerRadius + innerStart;
          const innerEndAdjustedRadius = innerRadius + innerEnd;
          const innerStartAdjustedAngle = startAngle + innerStart / innerStartAdjustedRadius;
          const innerEndAdjustedAngle = endAngle - innerEnd / innerEndAdjustedRadius;
          ctx.beginPath();
          if (circular) {
            ctx.arc(x, y, outerRadius, outerStartAdjustedAngle, outerEndAdjustedAngle);
            if (outerEnd > 0) {
              const pCenter = rThetaToXY(outerEndAdjustedRadius, outerEndAdjustedAngle, x, y);
              ctx.arc(pCenter.x, pCenter.y, outerEnd, outerEndAdjustedAngle, endAngle + HALF_PI);
            }
            const p4 = rThetaToXY(innerEndAdjustedRadius, endAngle, x, y);
            ctx.lineTo(p4.x, p4.y);
            if (innerEnd > 0) {
              const pCenter = rThetaToXY(innerEndAdjustedRadius, innerEndAdjustedAngle, x, y);
              ctx.arc(pCenter.x, pCenter.y, innerEnd, endAngle + HALF_PI, innerEndAdjustedAngle + Math.PI);
            }
            ctx.arc(x, y, innerRadius, endAngle - innerEnd / innerRadius, startAngle + innerStart / innerRadius, true);
            if (innerStart > 0) {
              const pCenter = rThetaToXY(innerStartAdjustedRadius, innerStartAdjustedAngle, x, y);
              ctx.arc(pCenter.x, pCenter.y, innerStart, innerStartAdjustedAngle + Math.PI, startAngle - HALF_PI);
            }
            const p8 = rThetaToXY(outerStartAdjustedRadius, startAngle, x, y);
            ctx.lineTo(p8.x, p8.y);
            if (outerStart > 0) {
              const pCenter = rThetaToXY(outerStartAdjustedRadius, outerStartAdjustedAngle, x, y);
              ctx.arc(pCenter.x, pCenter.y, outerStart, startAngle - HALF_PI, outerStartAdjustedAngle);
            }
          } else {
            ctx.moveTo(x, y);
            const outerStartX = Math.cos(outerStartAdjustedAngle) * outerRadius + x;
            const outerStartY = Math.sin(outerStartAdjustedAngle) * outerRadius + y;
            ctx.lineTo(outerStartX, outerStartY);
            const outerEndX = Math.cos(outerEndAdjustedAngle) * outerRadius + x;
            const outerEndY = Math.sin(outerEndAdjustedAngle) * outerRadius + y;
            ctx.lineTo(outerEndX, outerEndY);
          }
          ctx.closePath();
        }
        function drawArc(ctx, element, offset, spacing, circular) {
          const { fullCircles, startAngle, circumference } = element;
          let endAngle = element.endAngle;
          if (fullCircles) {
            pathArc(ctx, element, offset, spacing, startAngle + TAU, circular);
            for (let i = 0; i < fullCircles; ++i) {
              ctx.fill();
            }
            if (!isNaN(circumference)) {
              endAngle = startAngle + circumference % TAU;
              if (circumference % TAU === 0) {
                endAngle += TAU;
              }
            }
          }
          pathArc(ctx, element, offset, spacing, endAngle, circular);
          ctx.fill();
          return endAngle;
        }
        function drawFullCircleBorders(ctx, element, inner) {
          const { x, y, startAngle, pixelMargin, fullCircles } = element;
          const outerRadius = Math.max(element.outerRadius - pixelMargin, 0);
          const innerRadius = element.innerRadius + pixelMargin;
          let i;
          if (inner) {
            clipArc(ctx, element, startAngle + TAU);
          }
          ctx.beginPath();
          ctx.arc(x, y, innerRadius, startAngle + TAU, startAngle, true);
          for (i = 0; i < fullCircles; ++i) {
            ctx.stroke();
          }
          ctx.beginPath();
          ctx.arc(x, y, outerRadius, startAngle, startAngle + TAU);
          for (i = 0; i < fullCircles; ++i) {
            ctx.stroke();
          }
        }
        function drawBorder(ctx, element, offset, spacing, endAngle, circular) {
          const { options } = element;
          const { borderWidth, borderJoinStyle } = options;
          const inner = options.borderAlign === "inner";
          if (!borderWidth) {
            return;
          }
          if (inner) {
            ctx.lineWidth = borderWidth * 2;
            ctx.lineJoin = borderJoinStyle || "round";
          } else {
            ctx.lineWidth = borderWidth;
            ctx.lineJoin = borderJoinStyle || "bevel";
          }
          if (element.fullCircles) {
            drawFullCircleBorders(ctx, element, inner);
          }
          if (inner) {
            clipArc(ctx, element, endAngle);
          }
          pathArc(ctx, element, offset, spacing, endAngle, circular);
          ctx.stroke();
        }
        class ArcElement extends Element {
          constructor(cfg) {
            super();
            this.options = void 0;
            this.circumference = void 0;
            this.startAngle = void 0;
            this.endAngle = void 0;
            this.innerRadius = void 0;
            this.outerRadius = void 0;
            this.pixelMargin = 0;
            this.fullCircles = 0;
            if (cfg) {
              Object.assign(this, cfg);
            }
          }
          inRange(chartX, chartY, useFinalPosition) {
            const point = this.getProps(["x", "y"], useFinalPosition);
            const { angle, distance } = getAngleFromPoint(point, { x: chartX, y: chartY });
            const { startAngle, endAngle, innerRadius, outerRadius, circumference } = this.getProps([
              "startAngle",
              "endAngle",
              "innerRadius",
              "outerRadius",
              "circumference"
            ], useFinalPosition);
            const rAdjust = this.options.spacing / 2;
            const _circumference = valueOrDefault(circumference, endAngle - startAngle);
            const betweenAngles = _circumference >= TAU || _angleBetween(angle, startAngle, endAngle);
            const withinRadius = _isBetween(distance, innerRadius + rAdjust, outerRadius + rAdjust);
            return betweenAngles && withinRadius;
          }
          getCenterPoint(useFinalPosition) {
            const { x, y, startAngle, endAngle, innerRadius, outerRadius } = this.getProps([
              "x",
              "y",
              "startAngle",
              "endAngle",
              "innerRadius",
              "outerRadius",
              "circumference"
            ], useFinalPosition);
            const { offset, spacing } = this.options;
            const halfAngle = (startAngle + endAngle) / 2;
            const halfRadius = (innerRadius + outerRadius + spacing + offset) / 2;
            return {
              x: x + Math.cos(halfAngle) * halfRadius,
              y: y + Math.sin(halfAngle) * halfRadius
            };
          }
          tooltipPosition(useFinalPosition) {
            return this.getCenterPoint(useFinalPosition);
          }
          draw(ctx) {
            const { options, circumference } = this;
            const offset = (options.offset || 0) / 2;
            const spacing = (options.spacing || 0) / 2;
            const circular = options.circular;
            this.pixelMargin = options.borderAlign === "inner" ? 0.33 : 0;
            this.fullCircles = circumference > TAU ? Math.floor(circumference / TAU) : 0;
            if (circumference === 0 || this.innerRadius < 0 || this.outerRadius < 0) {
              return;
            }
            ctx.save();
            let radiusOffset = 0;
            if (offset) {
              radiusOffset = offset / 2;
              const halfAngle = (this.startAngle + this.endAngle) / 2;
              ctx.translate(Math.cos(halfAngle) * radiusOffset, Math.sin(halfAngle) * radiusOffset);
              if (this.circumference >= PI) {
                radiusOffset = offset;
              }
            }
            ctx.fillStyle = options.backgroundColor;
            ctx.strokeStyle = options.borderColor;
            const endAngle = drawArc(ctx, this, radiusOffset, spacing, circular);
            drawBorder(ctx, this, radiusOffset, spacing, endAngle, circular);
            ctx.restore();
          }
        }
        ArcElement.id = "arc";
        ArcElement.defaults = {
          borderAlign: "center",
          borderColor: "#fff",
          borderJoinStyle: void 0,
          borderRadius: 0,
          borderWidth: 2,
          offset: 0,
          spacing: 0,
          angle: void 0,
          circular: true
        };
        ArcElement.defaultRoutes = {
          backgroundColor: "backgroundColor"
        };
        function setStyle(ctx, options, style = options) {
          ctx.lineCap = valueOrDefault(style.borderCapStyle, options.borderCapStyle);
          ctx.setLineDash(valueOrDefault(style.borderDash, options.borderDash));
          ctx.lineDashOffset = valueOrDefault(style.borderDashOffset, options.borderDashOffset);
          ctx.lineJoin = valueOrDefault(style.borderJoinStyle, options.borderJoinStyle);
          ctx.lineWidth = valueOrDefault(style.borderWidth, options.borderWidth);
          ctx.strokeStyle = valueOrDefault(style.borderColor, options.borderColor);
        }
        function lineTo(ctx, previous, target) {
          ctx.lineTo(target.x, target.y);
        }
        function getLineMethod(options) {
          if (options.stepped) {
            return _steppedLineTo;
          }
          if (options.tension || options.cubicInterpolationMode === "monotone") {
            return _bezierCurveTo;
          }
          return lineTo;
        }
        function pathVars(points, segment, params = {}) {
          const count = points.length;
          const { start: paramsStart = 0, end: paramsEnd = count - 1 } = params;
          const { start: segmentStart, end: segmentEnd } = segment;
          const start = Math.max(paramsStart, segmentStart);
          const end = Math.min(paramsEnd, segmentEnd);
          const outside = paramsStart < segmentStart && paramsEnd < segmentStart || paramsStart > segmentEnd && paramsEnd > segmentEnd;
          return {
            count,
            start,
            loop: segment.loop,
            ilen: end < start && !outside ? count + end - start : end - start
          };
        }
        function pathSegment(ctx, line, segment, params) {
          const { points, options } = line;
          const { count, start, loop, ilen } = pathVars(points, segment, params);
          const lineMethod = getLineMethod(options);
          let { move = true, reverse } = params || {};
          let i, point, prev;
          for (i = 0; i <= ilen; ++i) {
            point = points[(start + (reverse ? ilen - i : i)) % count];
            if (point.skip) {
              continue;
            } else if (move) {
              ctx.moveTo(point.x, point.y);
              move = false;
            } else {
              lineMethod(ctx, prev, point, reverse, options.stepped);
            }
            prev = point;
          }
          if (loop) {
            point = points[(start + (reverse ? ilen : 0)) % count];
            lineMethod(ctx, prev, point, reverse, options.stepped);
          }
          return !!loop;
        }
        function fastPathSegment(ctx, line, segment, params) {
          const points = line.points;
          const { count, start, ilen } = pathVars(points, segment, params);
          const { move = true, reverse } = params || {};
          let avgX = 0;
          let countX = 0;
          let i, point, prevX, minY, maxY, lastY;
          const pointIndex = (index2) => (start + (reverse ? ilen - index2 : index2)) % count;
          const drawX = () => {
            if (minY !== maxY) {
              ctx.lineTo(avgX, maxY);
              ctx.lineTo(avgX, minY);
              ctx.lineTo(avgX, lastY);
            }
          };
          if (move) {
            point = points[pointIndex(0)];
            ctx.moveTo(point.x, point.y);
          }
          for (i = 0; i <= ilen; ++i) {
            point = points[pointIndex(i)];
            if (point.skip) {
              continue;
            }
            const x = point.x;
            const y = point.y;
            const truncX = x | 0;
            if (truncX === prevX) {
              if (y < minY) {
                minY = y;
              } else if (y > maxY) {
                maxY = y;
              }
              avgX = (countX * avgX + x) / ++countX;
            } else {
              drawX();
              ctx.lineTo(x, y);
              prevX = truncX;
              countX = 0;
              minY = maxY = y;
            }
            lastY = y;
          }
          drawX();
        }
        function _getSegmentMethod(line) {
          const opts = line.options;
          const borderDash = opts.borderDash && opts.borderDash.length;
          const useFastPath = !line._decimated && !line._loop && !opts.tension && opts.cubicInterpolationMode !== "monotone" && !opts.stepped && !borderDash;
          return useFastPath ? fastPathSegment : pathSegment;
        }
        function _getInterpolationMethod(options) {
          if (options.stepped) {
            return _steppedInterpolation;
          }
          if (options.tension || options.cubicInterpolationMode === "monotone") {
            return _bezierInterpolation;
          }
          return _pointInLine;
        }
        function strokePathWithCache(ctx, line, start, count) {
          let path = line._path;
          if (!path) {
            path = line._path = new Path2D();
            if (line.path(path, start, count)) {
              path.closePath();
            }
          }
          setStyle(ctx, line.options);
          ctx.stroke(path);
        }
        function strokePathDirect(ctx, line, start, count) {
          const { segments, options } = line;
          const segmentMethod = _getSegmentMethod(line);
          for (const segment of segments) {
            setStyle(ctx, options, segment.style);
            ctx.beginPath();
            if (segmentMethod(ctx, line, segment, { start, end: start + count - 1 })) {
              ctx.closePath();
            }
            ctx.stroke();
          }
        }
        const usePath2D = typeof Path2D === "function";
        function draw(ctx, line, start, count) {
          if (usePath2D && !line.options.segment) {
            strokePathWithCache(ctx, line, start, count);
          } else {
            strokePathDirect(ctx, line, start, count);
          }
        }
        class LineElement extends Element {
          constructor(cfg) {
            super();
            this.animated = true;
            this.options = void 0;
            this._chart = void 0;
            this._loop = void 0;
            this._fullLoop = void 0;
            this._path = void 0;
            this._points = void 0;
            this._segments = void 0;
            this._decimated = false;
            this._pointsUpdated = false;
            this._datasetIndex = void 0;
            if (cfg) {
              Object.assign(this, cfg);
            }
          }
          updateControlPoints(chartArea, indexAxis) {
            const options = this.options;
            if ((options.tension || options.cubicInterpolationMode === "monotone") && !options.stepped && !this._pointsUpdated) {
              const loop = options.spanGaps ? this._loop : this._fullLoop;
              _updateBezierControlPoints(this._points, options, chartArea, loop, indexAxis);
              this._pointsUpdated = true;
            }
          }
          set points(points) {
            this._points = points;
            delete this._segments;
            delete this._path;
            this._pointsUpdated = false;
          }
          get points() {
            return this._points;
          }
          get segments() {
            return this._segments || (this._segments = _computeSegments(this, this.options.segment));
          }
          first() {
            const segments = this.segments;
            const points = this.points;
            return segments.length && points[segments[0].start];
          }
          last() {
            const segments = this.segments;
            const points = this.points;
            const count = segments.length;
            return count && points[segments[count - 1].end];
          }
          interpolate(point, property) {
            const options = this.options;
            const value = point[property];
            const points = this.points;
            const segments = _boundSegments(this, { property, start: value, end: value });
            if (!segments.length) {
              return;
            }
            const result = [];
            const _interpolate = _getInterpolationMethod(options);
            let i, ilen;
            for (i = 0, ilen = segments.length; i < ilen; ++i) {
              const { start, end } = segments[i];
              const p1 = points[start];
              const p2 = points[end];
              if (p1 === p2) {
                result.push(p1);
                continue;
              }
              const t = Math.abs((value - p1[property]) / (p2[property] - p1[property]));
              const interpolated = _interpolate(p1, p2, t, options.stepped);
              interpolated[property] = point[property];
              result.push(interpolated);
            }
            return result.length === 1 ? result[0] : result;
          }
          pathSegment(ctx, segment, params) {
            const segmentMethod = _getSegmentMethod(this);
            return segmentMethod(ctx, this, segment, params);
          }
          path(ctx, start, count) {
            const segments = this.segments;
            const segmentMethod = _getSegmentMethod(this);
            let loop = this._loop;
            start = start || 0;
            count = count || this.points.length - start;
            for (const segment of segments) {
              loop &= segmentMethod(ctx, this, segment, { start, end: start + count - 1 });
            }
            return !!loop;
          }
          draw(ctx, chartArea, start, count) {
            const options = this.options || {};
            const points = this.points || [];
            if (points.length && options.borderWidth) {
              ctx.save();
              draw(ctx, this, start, count);
              ctx.restore();
            }
            if (this.animated) {
              this._pointsUpdated = false;
              this._path = void 0;
            }
          }
        }
        LineElement.id = "line";
        LineElement.defaults = {
          borderCapStyle: "butt",
          borderDash: [],
          borderDashOffset: 0,
          borderJoinStyle: "miter",
          borderWidth: 3,
          capBezierPoints: true,
          cubicInterpolationMode: "default",
          fill: false,
          spanGaps: false,
          stepped: false,
          tension: 0
        };
        LineElement.defaultRoutes = {
          backgroundColor: "backgroundColor",
          borderColor: "borderColor"
        };
        LineElement.descriptors = {
          _scriptable: true,
          _indexable: (name) => name !== "borderDash" && name !== "fill"
        };
        function inRange$1(el, pos, axis, useFinalPosition) {
          const options = el.options;
          const { [axis]: value } = el.getProps([axis], useFinalPosition);
          return Math.abs(pos - value) < options.radius + options.hitRadius;
        }
        class PointElement extends Element {
          constructor(cfg) {
            super();
            this.options = void 0;
            this.parsed = void 0;
            this.skip = void 0;
            this.stop = void 0;
            if (cfg) {
              Object.assign(this, cfg);
            }
          }
          inRange(mouseX, mouseY, useFinalPosition) {
            const options = this.options;
            const { x, y } = this.getProps(["x", "y"], useFinalPosition);
            return Math.pow(mouseX - x, 2) + Math.pow(mouseY - y, 2) < Math.pow(options.hitRadius + options.radius, 2);
          }
          inXRange(mouseX, useFinalPosition) {
            return inRange$1(this, mouseX, "x", useFinalPosition);
          }
          inYRange(mouseY, useFinalPosition) {
            return inRange$1(this, mouseY, "y", useFinalPosition);
          }
          getCenterPoint(useFinalPosition) {
            const { x, y } = this.getProps(["x", "y"], useFinalPosition);
            return { x, y };
          }
          size(options) {
            options = options || this.options || {};
            let radius = options.radius || 0;
            radius = Math.max(radius, radius && options.hoverRadius || 0);
            const borderWidth = radius && options.borderWidth || 0;
            return (radius + borderWidth) * 2;
          }
          draw(ctx, area) {
            const options = this.options;
            if (this.skip || options.radius < 0.1 || !_isPointInArea(this, area, this.size(options) / 2)) {
              return;
            }
            ctx.strokeStyle = options.borderColor;
            ctx.lineWidth = options.borderWidth;
            ctx.fillStyle = options.backgroundColor;
            drawPoint(ctx, options, this.x, this.y);
          }
          getRange() {
            const options = this.options || {};
            return options.radius + options.hitRadius;
          }
        }
        PointElement.id = "point";
        PointElement.defaults = {
          borderWidth: 1,
          hitRadius: 1,
          hoverBorderWidth: 1,
          hoverRadius: 4,
          pointStyle: "circle",
          radius: 3,
          rotation: 0
        };
        PointElement.defaultRoutes = {
          backgroundColor: "backgroundColor",
          borderColor: "borderColor"
        };
        function getBarBounds(bar, useFinalPosition) {
          const { x, y, base, width, height } = bar.getProps(["x", "y", "base", "width", "height"], useFinalPosition);
          let left, right, top, bottom, half;
          if (bar.horizontal) {
            half = height / 2;
            left = Math.min(x, base);
            right = Math.max(x, base);
            top = y - half;
            bottom = y + half;
          } else {
            half = width / 2;
            left = x - half;
            right = x + half;
            top = Math.min(y, base);
            bottom = Math.max(y, base);
          }
          return { left, top, right, bottom };
        }
        function skipOrLimit(skip2, value, min, max) {
          return skip2 ? 0 : _limitValue(value, min, max);
        }
        function parseBorderWidth(bar, maxW, maxH) {
          const value = bar.options.borderWidth;
          const skip2 = bar.borderSkipped;
          const o = toTRBL(value);
          return {
            t: skipOrLimit(skip2.top, o.top, 0, maxH),
            r: skipOrLimit(skip2.right, o.right, 0, maxW),
            b: skipOrLimit(skip2.bottom, o.bottom, 0, maxH),
            l: skipOrLimit(skip2.left, o.left, 0, maxW)
          };
        }
        function parseBorderRadius(bar, maxW, maxH) {
          const { enableBorderRadius } = bar.getProps(["enableBorderRadius"]);
          const value = bar.options.borderRadius;
          const o = toTRBLCorners(value);
          const maxR = Math.min(maxW, maxH);
          const skip2 = bar.borderSkipped;
          const enableBorder = enableBorderRadius || isObject(value);
          return {
            topLeft: skipOrLimit(!enableBorder || skip2.top || skip2.left, o.topLeft, 0, maxR),
            topRight: skipOrLimit(!enableBorder || skip2.top || skip2.right, o.topRight, 0, maxR),
            bottomLeft: skipOrLimit(!enableBorder || skip2.bottom || skip2.left, o.bottomLeft, 0, maxR),
            bottomRight: skipOrLimit(!enableBorder || skip2.bottom || skip2.right, o.bottomRight, 0, maxR)
          };
        }
        function boundingRects(bar) {
          const bounds = getBarBounds(bar);
          const width = bounds.right - bounds.left;
          const height = bounds.bottom - bounds.top;
          const border = parseBorderWidth(bar, width / 2, height / 2);
          const radius = parseBorderRadius(bar, width / 2, height / 2);
          return {
            outer: {
              x: bounds.left,
              y: bounds.top,
              w: width,
              h: height,
              radius
            },
            inner: {
              x: bounds.left + border.l,
              y: bounds.top + border.t,
              w: width - border.l - border.r,
              h: height - border.t - border.b,
              radius: {
                topLeft: Math.max(0, radius.topLeft - Math.max(border.t, border.l)),
                topRight: Math.max(0, radius.topRight - Math.max(border.t, border.r)),
                bottomLeft: Math.max(0, radius.bottomLeft - Math.max(border.b, border.l)),
                bottomRight: Math.max(0, radius.bottomRight - Math.max(border.b, border.r))
              }
            }
          };
        }
        function inRange(bar, x, y, useFinalPosition) {
          const skipX = x === null;
          const skipY = y === null;
          const skipBoth = skipX && skipY;
          const bounds = bar && !skipBoth && getBarBounds(bar, useFinalPosition);
          return bounds && (skipX || _isBetween(x, bounds.left, bounds.right)) && (skipY || _isBetween(y, bounds.top, bounds.bottom));
        }
        function hasRadius(radius) {
          return radius.topLeft || radius.topRight || radius.bottomLeft || radius.bottomRight;
        }
        function addNormalRectPath(ctx, rect) {
          ctx.rect(rect.x, rect.y, rect.w, rect.h);
        }
        function inflateRect(rect, amount, refRect = {}) {
          const x = rect.x !== refRect.x ? -amount : 0;
          const y = rect.y !== refRect.y ? -amount : 0;
          const w = (rect.x + rect.w !== refRect.x + refRect.w ? amount : 0) - x;
          const h = (rect.y + rect.h !== refRect.y + refRect.h ? amount : 0) - y;
          return {
            x: rect.x + x,
            y: rect.y + y,
            w: rect.w + w,
            h: rect.h + h,
            radius: rect.radius
          };
        }
        class BarElement extends Element {
          constructor(cfg) {
            super();
            this.options = void 0;
            this.horizontal = void 0;
            this.base = void 0;
            this.width = void 0;
            this.height = void 0;
            this.inflateAmount = void 0;
            if (cfg) {
              Object.assign(this, cfg);
            }
          }
          draw(ctx) {
            const { inflateAmount, options: { borderColor, backgroundColor } } = this;
            const { inner, outer } = boundingRects(this);
            const addRectPath = hasRadius(outer.radius) ? addRoundedRectPath : addNormalRectPath;
            ctx.save();
            if (outer.w !== inner.w || outer.h !== inner.h) {
              ctx.beginPath();
              addRectPath(ctx, inflateRect(outer, inflateAmount, inner));
              ctx.clip();
              addRectPath(ctx, inflateRect(inner, -inflateAmount, outer));
              ctx.fillStyle = borderColor;
              ctx.fill("evenodd");
            }
            ctx.beginPath();
            addRectPath(ctx, inflateRect(inner, inflateAmount));
            ctx.fillStyle = backgroundColor;
            ctx.fill();
            ctx.restore();
          }
          inRange(mouseX, mouseY, useFinalPosition) {
            return inRange(this, mouseX, mouseY, useFinalPosition);
          }
          inXRange(mouseX, useFinalPosition) {
            return inRange(this, mouseX, null, useFinalPosition);
          }
          inYRange(mouseY, useFinalPosition) {
            return inRange(this, null, mouseY, useFinalPosition);
          }
          getCenterPoint(useFinalPosition) {
            const { x, y, base, horizontal } = this.getProps(["x", "y", "base", "horizontal"], useFinalPosition);
            return {
              x: horizontal ? (x + base) / 2 : x,
              y: horizontal ? y : (y + base) / 2
            };
          }
          getRange(axis) {
            return axis === "x" ? this.width / 2 : this.height / 2;
          }
        }
        BarElement.id = "bar";
        BarElement.defaults = {
          borderSkipped: "start",
          borderWidth: 0,
          borderRadius: 0,
          inflateAmount: "auto",
          pointStyle: void 0
        };
        BarElement.defaultRoutes = {
          backgroundColor: "backgroundColor",
          borderColor: "borderColor"
        };
        var elements = /* @__PURE__ */ Object.freeze({
          __proto__: null,
          ArcElement,
          LineElement,
          PointElement,
          BarElement
        });
        function lttbDecimation(data, start, count, availableWidth, options) {
          const samples = options.samples || availableWidth;
          if (samples >= count) {
            return data.slice(start, start + count);
          }
          const decimated = [];
          const bucketWidth = (count - 2) / (samples - 2);
          let sampledIndex = 0;
          const endIndex = start + count - 1;
          let a = start;
          let i, maxAreaPoint, maxArea, area, nextA;
          decimated[sampledIndex++] = data[a];
          for (i = 0; i < samples - 2; i++) {
            let avgX = 0;
            let avgY = 0;
            let j;
            const avgRangeStart = Math.floor((i + 1) * bucketWidth) + 1 + start;
            const avgRangeEnd = Math.min(Math.floor((i + 2) * bucketWidth) + 1, count) + start;
            const avgRangeLength = avgRangeEnd - avgRangeStart;
            for (j = avgRangeStart; j < avgRangeEnd; j++) {
              avgX += data[j].x;
              avgY += data[j].y;
            }
            avgX /= avgRangeLength;
            avgY /= avgRangeLength;
            const rangeOffs = Math.floor(i * bucketWidth) + 1 + start;
            const rangeTo = Math.min(Math.floor((i + 1) * bucketWidth) + 1, count) + start;
            const { x: pointAx, y: pointAy } = data[a];
            maxArea = area = -1;
            for (j = rangeOffs; j < rangeTo; j++) {
              area = 0.5 * Math.abs(
                (pointAx - avgX) * (data[j].y - pointAy) - (pointAx - data[j].x) * (avgY - pointAy)
              );
              if (area > maxArea) {
                maxArea = area;
                maxAreaPoint = data[j];
                nextA = j;
              }
            }
            decimated[sampledIndex++] = maxAreaPoint;
            a = nextA;
          }
          decimated[sampledIndex++] = data[endIndex];
          return decimated;
        }
        function minMaxDecimation(data, start, count, availableWidth) {
          let avgX = 0;
          let countX = 0;
          let i, point, x, y, prevX, minIndex, maxIndex, startIndex, minY, maxY;
          const decimated = [];
          const endIndex = start + count - 1;
          const xMin = data[start].x;
          const xMax = data[endIndex].x;
          const dx = xMax - xMin;
          for (i = start; i < start + count; ++i) {
            point = data[i];
            x = (point.x - xMin) / dx * availableWidth;
            y = point.y;
            const truncX = x | 0;
            if (truncX === prevX) {
              if (y < minY) {
                minY = y;
                minIndex = i;
              } else if (y > maxY) {
                maxY = y;
                maxIndex = i;
              }
              avgX = (countX * avgX + point.x) / ++countX;
            } else {
              const lastIndex = i - 1;
              if (!isNullOrUndef(minIndex) && !isNullOrUndef(maxIndex)) {
                const intermediateIndex1 = Math.min(minIndex, maxIndex);
                const intermediateIndex2 = Math.max(minIndex, maxIndex);
                if (intermediateIndex1 !== startIndex && intermediateIndex1 !== lastIndex) {
                  decimated.push({
                    ...data[intermediateIndex1],
                    x: avgX
                  });
                }
                if (intermediateIndex2 !== startIndex && intermediateIndex2 !== lastIndex) {
                  decimated.push({
                    ...data[intermediateIndex2],
                    x: avgX
                  });
                }
              }
              if (i > 0 && lastIndex !== startIndex) {
                decimated.push(data[lastIndex]);
              }
              decimated.push(point);
              prevX = truncX;
              countX = 0;
              minY = maxY = y;
              minIndex = maxIndex = startIndex = i;
            }
          }
          return decimated;
        }
        function cleanDecimatedDataset(dataset) {
          if (dataset._decimated) {
            const data = dataset._data;
            delete dataset._decimated;
            delete dataset._data;
            Object.defineProperty(dataset, "data", { value: data });
          }
        }
        function cleanDecimatedData(chart) {
          chart.data.datasets.forEach((dataset) => {
            cleanDecimatedDataset(dataset);
          });
        }
        function getStartAndCountOfVisiblePointsSimplified(meta, points) {
          const pointCount = points.length;
          let start = 0;
          let count;
          const { iScale } = meta;
          const { min, max, minDefined, maxDefined } = iScale.getUserBounds();
          if (minDefined) {
            start = _limitValue(_lookupByKey(points, iScale.axis, min).lo, 0, pointCount - 1);
          }
          if (maxDefined) {
            count = _limitValue(_lookupByKey(points, iScale.axis, max).hi + 1, start, pointCount) - start;
          } else {
            count = pointCount - start;
          }
          return { start, count };
        }
        var plugin_decimation = {
          id: "decimation",
          defaults: {
            algorithm: "min-max",
            enabled: false
          },
          beforeElementsUpdate: (chart, args, options) => {
            if (!options.enabled) {
              cleanDecimatedData(chart);
              return;
            }
            const availableWidth = chart.width;
            chart.data.datasets.forEach((dataset, datasetIndex) => {
              const { _data, indexAxis } = dataset;
              const meta = chart.getDatasetMeta(datasetIndex);
              const data = _data || dataset.data;
              if (resolve([indexAxis, chart.options.indexAxis]) === "y") {
                return;
              }
              if (!meta.controller.supportsDecimation) {
                return;
              }
              const xAxis = chart.scales[meta.xAxisID];
              if (xAxis.type !== "linear" && xAxis.type !== "time") {
                return;
              }
              if (chart.options.parsing) {
                return;
              }
              let { start, count } = getStartAndCountOfVisiblePointsSimplified(meta, data);
              const threshold = options.threshold || 4 * availableWidth;
              if (count <= threshold) {
                cleanDecimatedDataset(dataset);
                return;
              }
              if (isNullOrUndef(_data)) {
                dataset._data = data;
                delete dataset.data;
                Object.defineProperty(dataset, "data", {
                  configurable: true,
                  enumerable: true,
                  get: function() {
                    return this._decimated;
                  },
                  set: function(d) {
                    this._data = d;
                  }
                });
              }
              let decimated;
              switch (options.algorithm) {
                case "lttb":
                  decimated = lttbDecimation(data, start, count, availableWidth, options);
                  break;
                case "min-max":
                  decimated = minMaxDecimation(data, start, count, availableWidth);
                  break;
                default:
                  throw new Error(`Unsupported decimation algorithm '${options.algorithm}'`);
              }
              dataset._decimated = decimated;
            });
          },
          destroy(chart) {
            cleanDecimatedData(chart);
          }
        };
        function _segments(line, target, property) {
          const segments = line.segments;
          const points = line.points;
          const tpoints = target.points;
          const parts = [];
          for (const segment of segments) {
            let { start, end } = segment;
            end = _findSegmentEnd(start, end, points);
            const bounds = _getBounds(property, points[start], points[end], segment.loop);
            if (!target.segments) {
              parts.push({
                source: segment,
                target: bounds,
                start: points[start],
                end: points[end]
              });
              continue;
            }
            const targetSegments = _boundSegments(target, bounds);
            for (const tgt of targetSegments) {
              const subBounds = _getBounds(property, tpoints[tgt.start], tpoints[tgt.end], tgt.loop);
              const fillSources = _boundSegment(segment, points, subBounds);
              for (const fillSource of fillSources) {
                parts.push({
                  source: fillSource,
                  target: tgt,
                  start: {
                    [property]: _getEdge(bounds, subBounds, "start", Math.max)
                  },
                  end: {
                    [property]: _getEdge(bounds, subBounds, "end", Math.min)
                  }
                });
              }
            }
          }
          return parts;
        }
        function _getBounds(property, first, last, loop) {
          if (loop) {
            return;
          }
          let start = first[property];
          let end = last[property];
          if (property === "angle") {
            start = _normalizeAngle(start);
            end = _normalizeAngle(end);
          }
          return { property, start, end };
        }
        function _pointsFromSegments(boundary, line) {
          const { x = null, y = null } = boundary || {};
          const linePoints = line.points;
          const points = [];
          line.segments.forEach(({ start, end }) => {
            end = _findSegmentEnd(start, end, linePoints);
            const first = linePoints[start];
            const last = linePoints[end];
            if (y !== null) {
              points.push({ x: first.x, y });
              points.push({ x: last.x, y });
            } else if (x !== null) {
              points.push({ x, y: first.y });
              points.push({ x, y: last.y });
            }
          });
          return points;
        }
        function _findSegmentEnd(start, end, points) {
          for (; end > start; end--) {
            const point = points[end];
            if (!isNaN(point.x) && !isNaN(point.y)) {
              break;
            }
          }
          return end;
        }
        function _getEdge(a, b, prop, fn) {
          if (a && b) {
            return fn(a[prop], b[prop]);
          }
          return a ? a[prop] : b ? b[prop] : 0;
        }
        function _createBoundaryLine(boundary, line) {
          let points = [];
          let _loop = false;
          if (isArray(boundary)) {
            _loop = true;
            points = boundary;
          } else {
            points = _pointsFromSegments(boundary, line);
          }
          return points.length ? new LineElement({
            points,
            options: { tension: 0 },
            _loop,
            _fullLoop: _loop
          }) : null;
        }
        function _shouldApplyFill(source) {
          return source && source.fill !== false;
        }
        function _resolveTarget(sources, index2, propagate) {
          const source = sources[index2];
          let fill2 = source.fill;
          const visited = [index2];
          let target;
          if (!propagate) {
            return fill2;
          }
          while (fill2 !== false && visited.indexOf(fill2) === -1) {
            if (!isNumberFinite(fill2)) {
              return fill2;
            }
            target = sources[fill2];
            if (!target) {
              return false;
            }
            if (target.visible) {
              return fill2;
            }
            visited.push(fill2);
            fill2 = target.fill;
          }
          return false;
        }
        function _decodeFill(line, index2, count) {
          const fill2 = parseFillOption(line);
          if (isObject(fill2)) {
            return isNaN(fill2.value) ? false : fill2;
          }
          let target = parseFloat(fill2);
          if (isNumberFinite(target) && Math.floor(target) === target) {
            return decodeTargetIndex(fill2[0], index2, target, count);
          }
          return ["origin", "start", "end", "stack", "shape"].indexOf(fill2) >= 0 && fill2;
        }
        function decodeTargetIndex(firstCh, index2, target, count) {
          if (firstCh === "-" || firstCh === "+") {
            target = index2 + target;
          }
          if (target === index2 || target < 0 || target >= count) {
            return false;
          }
          return target;
        }
        function _getTargetPixel(fill2, scale) {
          let pixel = null;
          if (fill2 === "start") {
            pixel = scale.bottom;
          } else if (fill2 === "end") {
            pixel = scale.top;
          } else if (isObject(fill2)) {
            pixel = scale.getPixelForValue(fill2.value);
          } else if (scale.getBasePixel) {
            pixel = scale.getBasePixel();
          }
          return pixel;
        }
        function _getTargetValue(fill2, scale, startValue) {
          let value;
          if (fill2 === "start") {
            value = startValue;
          } else if (fill2 === "end") {
            value = scale.options.reverse ? scale.min : scale.max;
          } else if (isObject(fill2)) {
            value = fill2.value;
          } else {
            value = scale.getBaseValue();
          }
          return value;
        }
        function parseFillOption(line) {
          const options = line.options;
          const fillOption = options.fill;
          let fill2 = valueOrDefault(fillOption && fillOption.target, fillOption);
          if (fill2 === void 0) {
            fill2 = !!options.backgroundColor;
          }
          if (fill2 === false || fill2 === null) {
            return false;
          }
          if (fill2 === true) {
            return "origin";
          }
          return fill2;
        }
        function _buildStackLine(source) {
          const { scale, index: index2, line } = source;
          const points = [];
          const segments = line.segments;
          const sourcePoints = line.points;
          const linesBelow = getLinesBelow(scale, index2);
          linesBelow.push(_createBoundaryLine({ x: null, y: scale.bottom }, line));
          for (let i = 0; i < segments.length; i++) {
            const segment = segments[i];
            for (let j = segment.start; j <= segment.end; j++) {
              addPointsBelow(points, sourcePoints[j], linesBelow);
            }
          }
          return new LineElement({ points, options: {} });
        }
        function getLinesBelow(scale, index2) {
          const below = [];
          const metas = scale.getMatchingVisibleMetas("line");
          for (let i = 0; i < metas.length; i++) {
            const meta = metas[i];
            if (meta.index === index2) {
              break;
            }
            if (!meta.hidden) {
              below.unshift(meta.dataset);
            }
          }
          return below;
        }
        function addPointsBelow(points, sourcePoint, linesBelow) {
          const postponed = [];
          for (let j = 0; j < linesBelow.length; j++) {
            const line = linesBelow[j];
            const { first, last, point } = findPoint(line, sourcePoint, "x");
            if (!point || first && last) {
              continue;
            }
            if (first) {
              postponed.unshift(point);
            } else {
              points.push(point);
              if (!last) {
                break;
              }
            }
          }
          points.push(...postponed);
        }
        function findPoint(line, sourcePoint, property) {
          const point = line.interpolate(sourcePoint, property);
          if (!point) {
            return {};
          }
          const pointValue = point[property];
          const segments = line.segments;
          const linePoints = line.points;
          let first = false;
          let last = false;
          for (let i = 0; i < segments.length; i++) {
            const segment = segments[i];
            const firstValue = linePoints[segment.start][property];
            const lastValue = linePoints[segment.end][property];
            if (_isBetween(pointValue, firstValue, lastValue)) {
              first = pointValue === firstValue;
              last = pointValue === lastValue;
              break;
            }
          }
          return { first, last, point };
        }
        class simpleArc {
          constructor(opts) {
            this.x = opts.x;
            this.y = opts.y;
            this.radius = opts.radius;
          }
          pathSegment(ctx, bounds, opts) {
            const { x, y, radius } = this;
            bounds = bounds || { start: 0, end: TAU };
            ctx.arc(x, y, radius, bounds.end, bounds.start, true);
            return !opts.bounds;
          }
          interpolate(point) {
            const { x, y, radius } = this;
            const angle = point.angle;
            return {
              x: x + Math.cos(angle) * radius,
              y: y + Math.sin(angle) * radius,
              angle
            };
          }
        }
        function _getTarget(source) {
          const { chart, fill: fill2, line } = source;
          if (isNumberFinite(fill2)) {
            return getLineByIndex(chart, fill2);
          }
          if (fill2 === "stack") {
            return _buildStackLine(source);
          }
          if (fill2 === "shape") {
            return true;
          }
          const boundary = computeBoundary(source);
          if (boundary instanceof simpleArc) {
            return boundary;
          }
          return _createBoundaryLine(boundary, line);
        }
        function getLineByIndex(chart, index2) {
          const meta = chart.getDatasetMeta(index2);
          const visible = meta && chart.isDatasetVisible(index2);
          return visible ? meta.dataset : null;
        }
        function computeBoundary(source) {
          const scale = source.scale || {};
          if (scale.getPointPositionForValue) {
            return computeCircularBoundary(source);
          }
          return computeLinearBoundary(source);
        }
        function computeLinearBoundary(source) {
          const { scale = {}, fill: fill2 } = source;
          const pixel = _getTargetPixel(fill2, scale);
          if (isNumberFinite(pixel)) {
            const horizontal = scale.isHorizontal();
            return {
              x: horizontal ? pixel : null,
              y: horizontal ? null : pixel
            };
          }
          return null;
        }
        function computeCircularBoundary(source) {
          const { scale, fill: fill2 } = source;
          const options = scale.options;
          const length = scale.getLabels().length;
          const start = options.reverse ? scale.max : scale.min;
          const value = _getTargetValue(fill2, scale, start);
          const target = [];
          if (options.grid.circular) {
            const center = scale.getPointPositionForValue(0, start);
            return new simpleArc({
              x: center.x,
              y: center.y,
              radius: scale.getDistanceFromCenterForValue(value)
            });
          }
          for (let i = 0; i < length; ++i) {
            target.push(scale.getPointPositionForValue(i, value));
          }
          return target;
        }
        function _drawfill(ctx, source, area) {
          const target = _getTarget(source);
          const { line, scale, axis } = source;
          const lineOpts = line.options;
          const fillOption = lineOpts.fill;
          const color2 = lineOpts.backgroundColor;
          const { above = color2, below = color2 } = fillOption || {};
          if (target && line.points.length) {
            clipArea(ctx, area);
            doFill(ctx, { line, target, above, below, area, scale, axis });
            unclipArea(ctx);
          }
        }
        function doFill(ctx, cfg) {
          const { line, target, above, below, area, scale } = cfg;
          const property = line._loop ? "angle" : cfg.axis;
          ctx.save();
          if (property === "x" && below !== above) {
            clipVertical(ctx, target, area.top);
            fill(ctx, { line, target, color: above, scale, property });
            ctx.restore();
            ctx.save();
            clipVertical(ctx, target, area.bottom);
          }
          fill(ctx, { line, target, color: below, scale, property });
          ctx.restore();
        }
        function clipVertical(ctx, target, clipY) {
          const { segments, points } = target;
          let first = true;
          let lineLoop = false;
          ctx.beginPath();
          for (const segment of segments) {
            const { start, end } = segment;
            const firstPoint = points[start];
            const lastPoint = points[_findSegmentEnd(start, end, points)];
            if (first) {
              ctx.moveTo(firstPoint.x, firstPoint.y);
              first = false;
            } else {
              ctx.lineTo(firstPoint.x, clipY);
              ctx.lineTo(firstPoint.x, firstPoint.y);
            }
            lineLoop = !!target.pathSegment(ctx, segment, { move: lineLoop });
            if (lineLoop) {
              ctx.closePath();
            } else {
              ctx.lineTo(lastPoint.x, clipY);
            }
          }
          ctx.lineTo(target.first().x, clipY);
          ctx.closePath();
          ctx.clip();
        }
        function fill(ctx, cfg) {
          const { line, target, property, color: color2, scale } = cfg;
          const segments = _segments(line, target, property);
          for (const { source: src, target: tgt, start, end } of segments) {
            const { style: { backgroundColor = color2 } = {} } = src;
            const notShape = target !== true;
            ctx.save();
            ctx.fillStyle = backgroundColor;
            clipBounds(ctx, scale, notShape && _getBounds(property, start, end));
            ctx.beginPath();
            const lineLoop = !!line.pathSegment(ctx, src);
            let loop;
            if (notShape) {
              if (lineLoop) {
                ctx.closePath();
              } else {
                interpolatedLineTo(ctx, target, end, property);
              }
              const targetLoop = !!target.pathSegment(ctx, tgt, { move: lineLoop, reverse: true });
              loop = lineLoop && targetLoop;
              if (!loop) {
                interpolatedLineTo(ctx, target, start, property);
              }
            }
            ctx.closePath();
            ctx.fill(loop ? "evenodd" : "nonzero");
            ctx.restore();
          }
        }
        function clipBounds(ctx, scale, bounds) {
          const { top, bottom } = scale.chart.chartArea;
          const { property, start, end } = bounds || {};
          if (property === "x") {
            ctx.beginPath();
            ctx.rect(start, top, end - start, bottom - top);
            ctx.clip();
          }
        }
        function interpolatedLineTo(ctx, target, point, property) {
          const interpolatedPoint = target.interpolate(point, property);
          if (interpolatedPoint) {
            ctx.lineTo(interpolatedPoint.x, interpolatedPoint.y);
          }
        }
        var index = {
          id: "filler",
          afterDatasetsUpdate(chart, _args, options) {
            const count = (chart.data.datasets || []).length;
            const sources = [];
            let meta, i, line, source;
            for (i = 0; i < count; ++i) {
              meta = chart.getDatasetMeta(i);
              line = meta.dataset;
              source = null;
              if (line && line.options && line instanceof LineElement) {
                source = {
                  visible: chart.isDatasetVisible(i),
                  index: i,
                  fill: _decodeFill(line, i, count),
                  chart,
                  axis: meta.controller.options.indexAxis,
                  scale: meta.vScale,
                  line
                };
              }
              meta.$filler = source;
              sources.push(source);
            }
            for (i = 0; i < count; ++i) {
              source = sources[i];
              if (!source || source.fill === false) {
                continue;
              }
              source.fill = _resolveTarget(sources, i, options.propagate);
            }
          },
          beforeDraw(chart, _args, options) {
            const draw2 = options.drawTime === "beforeDraw";
            const metasets = chart.getSortedVisibleDatasetMetas();
            const area = chart.chartArea;
            for (let i = metasets.length - 1; i >= 0; --i) {
              const source = metasets[i].$filler;
              if (!source) {
                continue;
              }
              source.line.updateControlPoints(area, source.axis);
              if (draw2 && source.fill) {
                _drawfill(chart.ctx, source, area);
              }
            }
          },
          beforeDatasetsDraw(chart, _args, options) {
            if (options.drawTime !== "beforeDatasetsDraw") {
              return;
            }
            const metasets = chart.getSortedVisibleDatasetMetas();
            for (let i = metasets.length - 1; i >= 0; --i) {
              const source = metasets[i].$filler;
              if (_shouldApplyFill(source)) {
                _drawfill(chart.ctx, source, chart.chartArea);
              }
            }
          },
          beforeDatasetDraw(chart, args, options) {
            const source = args.meta.$filler;
            if (!_shouldApplyFill(source) || options.drawTime !== "beforeDatasetDraw") {
              return;
            }
            _drawfill(chart.ctx, source, chart.chartArea);
          },
          defaults: {
            propagate: true,
            drawTime: "beforeDatasetDraw"
          }
        };
        const getBoxSize = (labelOpts, fontSize) => {
          let { boxHeight = fontSize, boxWidth = fontSize } = labelOpts;
          if (labelOpts.usePointStyle) {
            boxHeight = Math.min(boxHeight, fontSize);
            boxWidth = labelOpts.pointStyleWidth || Math.min(boxWidth, fontSize);
          }
          return {
            boxWidth,
            boxHeight,
            itemHeight: Math.max(fontSize, boxHeight)
          };
        };
        const itemsEqual = (a, b) => a !== null && b !== null && a.datasetIndex === b.datasetIndex && a.index === b.index;
        class Legend extends Element {
          constructor(config) {
            super();
            this._added = false;
            this.legendHitBoxes = [];
            this._hoveredItem = null;
            this.doughnutMode = false;
            this.chart = config.chart;
            this.options = config.options;
            this.ctx = config.ctx;
            this.legendItems = void 0;
            this.columnSizes = void 0;
            this.lineWidths = void 0;
            this.maxHeight = void 0;
            this.maxWidth = void 0;
            this.top = void 0;
            this.bottom = void 0;
            this.left = void 0;
            this.right = void 0;
            this.height = void 0;
            this.width = void 0;
            this._margins = void 0;
            this.position = void 0;
            this.weight = void 0;
            this.fullSize = void 0;
          }
          update(maxWidth, maxHeight, margins) {
            this.maxWidth = maxWidth;
            this.maxHeight = maxHeight;
            this._margins = margins;
            this.setDimensions();
            this.buildLabels();
            this.fit();
          }
          setDimensions() {
            if (this.isHorizontal()) {
              this.width = this.maxWidth;
              this.left = this._margins.left;
              this.right = this.width;
            } else {
              this.height = this.maxHeight;
              this.top = this._margins.top;
              this.bottom = this.height;
            }
          }
          buildLabels() {
            const labelOpts = this.options.labels || {};
            let legendItems = callback(labelOpts.generateLabels, [this.chart], this) || [];
            if (labelOpts.filter) {
              legendItems = legendItems.filter((item) => labelOpts.filter(item, this.chart.data));
            }
            if (labelOpts.sort) {
              legendItems = legendItems.sort((a, b) => labelOpts.sort(a, b, this.chart.data));
            }
            if (this.options.reverse) {
              legendItems.reverse();
            }
            this.legendItems = legendItems;
          }
          fit() {
            const { options, ctx } = this;
            if (!options.display) {
              this.width = this.height = 0;
              return;
            }
            const labelOpts = options.labels;
            const labelFont = toFont(labelOpts.font);
            const fontSize = labelFont.size;
            const titleHeight = this._computeTitleHeight();
            const { boxWidth, itemHeight } = getBoxSize(labelOpts, fontSize);
            let width, height;
            ctx.font = labelFont.string;
            if (this.isHorizontal()) {
              width = this.maxWidth;
              height = this._fitRows(titleHeight, fontSize, boxWidth, itemHeight) + 10;
            } else {
              height = this.maxHeight;
              width = this._fitCols(titleHeight, fontSize, boxWidth, itemHeight) + 10;
            }
            this.width = Math.min(width, options.maxWidth || this.maxWidth);
            this.height = Math.min(height, options.maxHeight || this.maxHeight);
          }
          _fitRows(titleHeight, fontSize, boxWidth, itemHeight) {
            const { ctx, maxWidth, options: { labels: { padding } } } = this;
            const hitboxes = this.legendHitBoxes = [];
            const lineWidths = this.lineWidths = [0];
            const lineHeight = itemHeight + padding;
            let totalHeight = titleHeight;
            ctx.textAlign = "left";
            ctx.textBaseline = "middle";
            let row = -1;
            let top = -lineHeight;
            this.legendItems.forEach((legendItem, i) => {
              const itemWidth = boxWidth + fontSize / 2 + ctx.measureText(legendItem.text).width;
              if (i === 0 || lineWidths[lineWidths.length - 1] + itemWidth + 2 * padding > maxWidth) {
                totalHeight += lineHeight;
                lineWidths[lineWidths.length - (i > 0 ? 0 : 1)] = 0;
                top += lineHeight;
                row++;
              }
              hitboxes[i] = { left: 0, top, row, width: itemWidth, height: itemHeight };
              lineWidths[lineWidths.length - 1] += itemWidth + padding;
            });
            return totalHeight;
          }
          _fitCols(titleHeight, fontSize, boxWidth, itemHeight) {
            const { ctx, maxHeight, options: { labels: { padding } } } = this;
            const hitboxes = this.legendHitBoxes = [];
            const columnSizes = this.columnSizes = [];
            const heightLimit = maxHeight - titleHeight;
            let totalWidth = padding;
            let currentColWidth = 0;
            let currentColHeight = 0;
            let left = 0;
            let col = 0;
            this.legendItems.forEach((legendItem, i) => {
              const itemWidth = boxWidth + fontSize / 2 + ctx.measureText(legendItem.text).width;
              if (i > 0 && currentColHeight + itemHeight + 2 * padding > heightLimit) {
                totalWidth += currentColWidth + padding;
                columnSizes.push({ width: currentColWidth, height: currentColHeight });
                left += currentColWidth + padding;
                col++;
                currentColWidth = currentColHeight = 0;
              }
              hitboxes[i] = { left, top: currentColHeight, col, width: itemWidth, height: itemHeight };
              currentColWidth = Math.max(currentColWidth, itemWidth);
              currentColHeight += itemHeight + padding;
            });
            totalWidth += currentColWidth;
            columnSizes.push({ width: currentColWidth, height: currentColHeight });
            return totalWidth;
          }
          adjustHitBoxes() {
            if (!this.options.display) {
              return;
            }
            const titleHeight = this._computeTitleHeight();
            const { legendHitBoxes: hitboxes, options: { align, labels: { padding }, rtl } } = this;
            const rtlHelper = getRtlAdapter(rtl, this.left, this.width);
            if (this.isHorizontal()) {
              let row = 0;
              let left = _alignStartEnd(align, this.left + padding, this.right - this.lineWidths[row]);
              for (const hitbox of hitboxes) {
                if (row !== hitbox.row) {
                  row = hitbox.row;
                  left = _alignStartEnd(align, this.left + padding, this.right - this.lineWidths[row]);
                }
                hitbox.top += this.top + titleHeight + padding;
                hitbox.left = rtlHelper.leftForLtr(rtlHelper.x(left), hitbox.width);
                left += hitbox.width + padding;
              }
            } else {
              let col = 0;
              let top = _alignStartEnd(align, this.top + titleHeight + padding, this.bottom - this.columnSizes[col].height);
              for (const hitbox of hitboxes) {
                if (hitbox.col !== col) {
                  col = hitbox.col;
                  top = _alignStartEnd(align, this.top + titleHeight + padding, this.bottom - this.columnSizes[col].height);
                }
                hitbox.top = top;
                hitbox.left += this.left + padding;
                hitbox.left = rtlHelper.leftForLtr(rtlHelper.x(hitbox.left), hitbox.width);
                top += hitbox.height + padding;
              }
            }
          }
          isHorizontal() {
            return this.options.position === "top" || this.options.position === "bottom";
          }
          draw() {
            if (this.options.display) {
              const ctx = this.ctx;
              clipArea(ctx, this);
              this._draw();
              unclipArea(ctx);
            }
          }
          _draw() {
            const { options: opts, columnSizes, lineWidths, ctx } = this;
            const { align, labels: labelOpts } = opts;
            const defaultColor = defaults.color;
            const rtlHelper = getRtlAdapter(opts.rtl, this.left, this.width);
            const labelFont = toFont(labelOpts.font);
            const { color: fontColor, padding } = labelOpts;
            const fontSize = labelFont.size;
            const halfFontSize = fontSize / 2;
            let cursor;
            this.drawTitle();
            ctx.textAlign = rtlHelper.textAlign("left");
            ctx.textBaseline = "middle";
            ctx.lineWidth = 0.5;
            ctx.font = labelFont.string;
            const { boxWidth, boxHeight, itemHeight } = getBoxSize(labelOpts, fontSize);
            const drawLegendBox = function(x, y, legendItem) {
              if (isNaN(boxWidth) || boxWidth <= 0 || isNaN(boxHeight) || boxHeight < 0) {
                return;
              }
              ctx.save();
              const lineWidth = valueOrDefault(legendItem.lineWidth, 1);
              ctx.fillStyle = valueOrDefault(legendItem.fillStyle, defaultColor);
              ctx.lineCap = valueOrDefault(legendItem.lineCap, "butt");
              ctx.lineDashOffset = valueOrDefault(legendItem.lineDashOffset, 0);
              ctx.lineJoin = valueOrDefault(legendItem.lineJoin, "miter");
              ctx.lineWidth = lineWidth;
              ctx.strokeStyle = valueOrDefault(legendItem.strokeStyle, defaultColor);
              ctx.setLineDash(valueOrDefault(legendItem.lineDash, []));
              if (labelOpts.usePointStyle) {
                const drawOptions = {
                  radius: boxHeight * Math.SQRT2 / 2,
                  pointStyle: legendItem.pointStyle,
                  rotation: legendItem.rotation,
                  borderWidth: lineWidth
                };
                const centerX = rtlHelper.xPlus(x, boxWidth / 2);
                const centerY = y + halfFontSize;
                drawPointLegend(ctx, drawOptions, centerX, centerY, labelOpts.pointStyleWidth && boxWidth);
              } else {
                const yBoxTop = y + Math.max((fontSize - boxHeight) / 2, 0);
                const xBoxLeft = rtlHelper.leftForLtr(x, boxWidth);
                const borderRadius = toTRBLCorners(legendItem.borderRadius);
                ctx.beginPath();
                if (Object.values(borderRadius).some((v) => v !== 0)) {
                  addRoundedRectPath(ctx, {
                    x: xBoxLeft,
                    y: yBoxTop,
                    w: boxWidth,
                    h: boxHeight,
                    radius: borderRadius
                  });
                } else {
                  ctx.rect(xBoxLeft, yBoxTop, boxWidth, boxHeight);
                }
                ctx.fill();
                if (lineWidth !== 0) {
                  ctx.stroke();
                }
              }
              ctx.restore();
            };
            const fillText = function(x, y, legendItem) {
              renderText(ctx, legendItem.text, x, y + itemHeight / 2, labelFont, {
                strikethrough: legendItem.hidden,
                textAlign: rtlHelper.textAlign(legendItem.textAlign)
              });
            };
            const isHorizontal = this.isHorizontal();
            const titleHeight = this._computeTitleHeight();
            if (isHorizontal) {
              cursor = {
                x: _alignStartEnd(align, this.left + padding, this.right - lineWidths[0]),
                y: this.top + padding + titleHeight,
                line: 0
              };
            } else {
              cursor = {
                x: this.left + padding,
                y: _alignStartEnd(align, this.top + titleHeight + padding, this.bottom - columnSizes[0].height),
                line: 0
              };
            }
            overrideTextDirection(this.ctx, opts.textDirection);
            const lineHeight = itemHeight + padding;
            this.legendItems.forEach((legendItem, i) => {
              ctx.strokeStyle = legendItem.fontColor || fontColor;
              ctx.fillStyle = legendItem.fontColor || fontColor;
              const textWidth = ctx.measureText(legendItem.text).width;
              const textAlign = rtlHelper.textAlign(legendItem.textAlign || (legendItem.textAlign = labelOpts.textAlign));
              const width = boxWidth + halfFontSize + textWidth;
              let x = cursor.x;
              let y = cursor.y;
              rtlHelper.setWidth(this.width);
              if (isHorizontal) {
                if (i > 0 && x + width + padding > this.right) {
                  y = cursor.y += lineHeight;
                  cursor.line++;
                  x = cursor.x = _alignStartEnd(align, this.left + padding, this.right - lineWidths[cursor.line]);
                }
              } else if (i > 0 && y + lineHeight > this.bottom) {
                x = cursor.x = x + columnSizes[cursor.line].width + padding;
                cursor.line++;
                y = cursor.y = _alignStartEnd(align, this.top + titleHeight + padding, this.bottom - columnSizes[cursor.line].height);
              }
              const realX = rtlHelper.x(x);
              drawLegendBox(realX, y, legendItem);
              x = _textX(textAlign, x + boxWidth + halfFontSize, isHorizontal ? x + width : this.right, opts.rtl);
              fillText(rtlHelper.x(x), y, legendItem);
              if (isHorizontal) {
                cursor.x += width + padding;
              } else {
                cursor.y += lineHeight;
              }
            });
            restoreTextDirection(this.ctx, opts.textDirection);
          }
          drawTitle() {
            const opts = this.options;
            const titleOpts = opts.title;
            const titleFont = toFont(titleOpts.font);
            const titlePadding = toPadding(titleOpts.padding);
            if (!titleOpts.display) {
              return;
            }
            const rtlHelper = getRtlAdapter(opts.rtl, this.left, this.width);
            const ctx = this.ctx;
            const position = titleOpts.position;
            const halfFontSize = titleFont.size / 2;
            const topPaddingPlusHalfFontSize = titlePadding.top + halfFontSize;
            let y;
            let left = this.left;
            let maxWidth = this.width;
            if (this.isHorizontal()) {
              maxWidth = Math.max(...this.lineWidths);
              y = this.top + topPaddingPlusHalfFontSize;
              left = _alignStartEnd(opts.align, left, this.right - maxWidth);
            } else {
              const maxHeight = this.columnSizes.reduce((acc, size) => Math.max(acc, size.height), 0);
              y = topPaddingPlusHalfFontSize + _alignStartEnd(opts.align, this.top, this.bottom - maxHeight - opts.labels.padding - this._computeTitleHeight());
            }
            const x = _alignStartEnd(position, left, left + maxWidth);
            ctx.textAlign = rtlHelper.textAlign(_toLeftRightCenter(position));
            ctx.textBaseline = "middle";
            ctx.strokeStyle = titleOpts.color;
            ctx.fillStyle = titleOpts.color;
            ctx.font = titleFont.string;
            renderText(ctx, titleOpts.text, x, y, titleFont);
          }
          _computeTitleHeight() {
            const titleOpts = this.options.title;
            const titleFont = toFont(titleOpts.font);
            const titlePadding = toPadding(titleOpts.padding);
            return titleOpts.display ? titleFont.lineHeight + titlePadding.height : 0;
          }
          _getLegendItemAt(x, y) {
            let i, hitBox, lh;
            if (_isBetween(x, this.left, this.right) && _isBetween(y, this.top, this.bottom)) {
              lh = this.legendHitBoxes;
              for (i = 0; i < lh.length; ++i) {
                hitBox = lh[i];
                if (_isBetween(x, hitBox.left, hitBox.left + hitBox.width) && _isBetween(y, hitBox.top, hitBox.top + hitBox.height)) {
                  return this.legendItems[i];
                }
              }
            }
            return null;
          }
          handleEvent(e) {
            const opts = this.options;
            if (!isListened(e.type, opts)) {
              return;
            }
            const hoveredItem = this._getLegendItemAt(e.x, e.y);
            if (e.type === "mousemove" || e.type === "mouseout") {
              const previous = this._hoveredItem;
              const sameItem = itemsEqual(previous, hoveredItem);
              if (previous && !sameItem) {
                callback(opts.onLeave, [e, previous, this], this);
              }
              this._hoveredItem = hoveredItem;
              if (hoveredItem && !sameItem) {
                callback(opts.onHover, [e, hoveredItem, this], this);
              }
            } else if (hoveredItem) {
              callback(opts.onClick, [e, hoveredItem, this], this);
            }
          }
        }
        function isListened(type, opts) {
          if ((type === "mousemove" || type === "mouseout") && (opts.onHover || opts.onLeave)) {
            return true;
          }
          if (opts.onClick && (type === "click" || type === "mouseup")) {
            return true;
          }
          return false;
        }
        var plugin_legend = {
          id: "legend",
          _element: Legend,
          start(chart, _args, options) {
            const legend = chart.legend = new Legend({ ctx: chart.ctx, options, chart });
            layouts.configure(chart, legend, options);
            layouts.addBox(chart, legend);
          },
          stop(chart) {
            layouts.removeBox(chart, chart.legend);
            delete chart.legend;
          },
          beforeUpdate(chart, _args, options) {
            const legend = chart.legend;
            layouts.configure(chart, legend, options);
            legend.options = options;
          },
          afterUpdate(chart) {
            const legend = chart.legend;
            legend.buildLabels();
            legend.adjustHitBoxes();
          },
          afterEvent(chart, args) {
            if (!args.replay) {
              chart.legend.handleEvent(args.event);
            }
          },
          defaults: {
            display: true,
            position: "top",
            align: "center",
            fullSize: true,
            reverse: false,
            weight: 1e3,
            onClick(e, legendItem, legend) {
              const index2 = legendItem.datasetIndex;
              const ci = legend.chart;
              if (ci.isDatasetVisible(index2)) {
                ci.hide(index2);
                legendItem.hidden = true;
              } else {
                ci.show(index2);
                legendItem.hidden = false;
              }
            },
            onHover: null,
            onLeave: null,
            labels: {
              color: (ctx) => ctx.chart.options.color,
              boxWidth: 40,
              padding: 10,
              generateLabels(chart) {
                const datasets = chart.data.datasets;
                const { labels: { usePointStyle, pointStyle, textAlign, color: color2 } } = chart.legend.options;
                return chart._getSortedDatasetMetas().map((meta) => {
                  const style = meta.controller.getStyle(usePointStyle ? 0 : void 0);
                  const borderWidth = toPadding(style.borderWidth);
                  return {
                    text: datasets[meta.index].label,
                    fillStyle: style.backgroundColor,
                    fontColor: color2,
                    hidden: !meta.visible,
                    lineCap: style.borderCapStyle,
                    lineDash: style.borderDash,
                    lineDashOffset: style.borderDashOffset,
                    lineJoin: style.borderJoinStyle,
                    lineWidth: (borderWidth.width + borderWidth.height) / 4,
                    strokeStyle: style.borderColor,
                    pointStyle: pointStyle || style.pointStyle,
                    rotation: style.rotation,
                    textAlign: textAlign || style.textAlign,
                    borderRadius: 0,
                    datasetIndex: meta.index
                  };
                }, this);
              }
            },
            title: {
              color: (ctx) => ctx.chart.options.color,
              display: false,
              position: "center",
              text: ""
            }
          },
          descriptors: {
            _scriptable: (name) => !name.startsWith("on"),
            labels: {
              _scriptable: (name) => !["generateLabels", "filter", "sort"].includes(name)
            }
          }
        };
        class Title extends Element {
          constructor(config) {
            super();
            this.chart = config.chart;
            this.options = config.options;
            this.ctx = config.ctx;
            this._padding = void 0;
            this.top = void 0;
            this.bottom = void 0;
            this.left = void 0;
            this.right = void 0;
            this.width = void 0;
            this.height = void 0;
            this.position = void 0;
            this.weight = void 0;
            this.fullSize = void 0;
          }
          update(maxWidth, maxHeight) {
            const opts = this.options;
            this.left = 0;
            this.top = 0;
            if (!opts.display) {
              this.width = this.height = this.right = this.bottom = 0;
              return;
            }
            this.width = this.right = maxWidth;
            this.height = this.bottom = maxHeight;
            const lineCount = isArray(opts.text) ? opts.text.length : 1;
            this._padding = toPadding(opts.padding);
            const textSize = lineCount * toFont(opts.font).lineHeight + this._padding.height;
            if (this.isHorizontal()) {
              this.height = textSize;
            } else {
              this.width = textSize;
            }
          }
          isHorizontal() {
            const pos = this.options.position;
            return pos === "top" || pos === "bottom";
          }
          _drawArgs(offset) {
            const { top, left, bottom, right, options } = this;
            const align = options.align;
            let rotation = 0;
            let maxWidth, titleX, titleY;
            if (this.isHorizontal()) {
              titleX = _alignStartEnd(align, left, right);
              titleY = top + offset;
              maxWidth = right - left;
            } else {
              if (options.position === "left") {
                titleX = left + offset;
                titleY = _alignStartEnd(align, bottom, top);
                rotation = PI * -0.5;
              } else {
                titleX = right - offset;
                titleY = _alignStartEnd(align, top, bottom);
                rotation = PI * 0.5;
              }
              maxWidth = bottom - top;
            }
            return { titleX, titleY, maxWidth, rotation };
          }
          draw() {
            const ctx = this.ctx;
            const opts = this.options;
            if (!opts.display) {
              return;
            }
            const fontOpts = toFont(opts.font);
            const lineHeight = fontOpts.lineHeight;
            const offset = lineHeight / 2 + this._padding.top;
            const { titleX, titleY, maxWidth, rotation } = this._drawArgs(offset);
            renderText(ctx, opts.text, 0, 0, fontOpts, {
              color: opts.color,
              maxWidth,
              rotation,
              textAlign: _toLeftRightCenter(opts.align),
              textBaseline: "middle",
              translation: [titleX, titleY]
            });
          }
        }
        function createTitle(chart, titleOpts) {
          const title = new Title({
            ctx: chart.ctx,
            options: titleOpts,
            chart
          });
          layouts.configure(chart, title, titleOpts);
          layouts.addBox(chart, title);
          chart.titleBlock = title;
        }
        var plugin_title = {
          id: "title",
          _element: Title,
          start(chart, _args, options) {
            createTitle(chart, options);
          },
          stop(chart) {
            const titleBlock = chart.titleBlock;
            layouts.removeBox(chart, titleBlock);
            delete chart.titleBlock;
          },
          beforeUpdate(chart, _args, options) {
            const title = chart.titleBlock;
            layouts.configure(chart, title, options);
            title.options = options;
          },
          defaults: {
            align: "center",
            display: false,
            font: {
              weight: "bold"
            },
            fullSize: true,
            padding: 10,
            position: "top",
            text: "",
            weight: 2e3
          },
          defaultRoutes: {
            color: "color"
          },
          descriptors: {
            _scriptable: true,
            _indexable: false
          }
        };
        const map = /* @__PURE__ */ new WeakMap();
        var plugin_subtitle = {
          id: "subtitle",
          start(chart, _args, options) {
            const title = new Title({
              ctx: chart.ctx,
              options,
              chart
            });
            layouts.configure(chart, title, options);
            layouts.addBox(chart, title);
            map.set(chart, title);
          },
          stop(chart) {
            layouts.removeBox(chart, map.get(chart));
            map.delete(chart);
          },
          beforeUpdate(chart, _args, options) {
            const title = map.get(chart);
            layouts.configure(chart, title, options);
            title.options = options;
          },
          defaults: {
            align: "center",
            display: false,
            font: {
              weight: "normal"
            },
            fullSize: true,
            padding: 0,
            position: "top",
            text: "",
            weight: 1500
          },
          defaultRoutes: {
            color: "color"
          },
          descriptors: {
            _scriptable: true,
            _indexable: false
          }
        };
        const positioners = {
          average(items) {
            if (!items.length) {
              return false;
            }
            let i, len;
            let x = 0;
            let y = 0;
            let count = 0;
            for (i = 0, len = items.length; i < len; ++i) {
              const el = items[i].element;
              if (el && el.hasValue()) {
                const pos = el.tooltipPosition();
                x += pos.x;
                y += pos.y;
                ++count;
              }
            }
            return {
              x: x / count,
              y: y / count
            };
          },
          nearest(items, eventPosition) {
            if (!items.length) {
              return false;
            }
            let x = eventPosition.x;
            let y = eventPosition.y;
            let minDistance = Number.POSITIVE_INFINITY;
            let i, len, nearestElement;
            for (i = 0, len = items.length; i < len; ++i) {
              const el = items[i].element;
              if (el && el.hasValue()) {
                const center = el.getCenterPoint();
                const d = distanceBetweenPoints(eventPosition, center);
                if (d < minDistance) {
                  minDistance = d;
                  nearestElement = el;
                }
              }
            }
            if (nearestElement) {
              const tp = nearestElement.tooltipPosition();
              x = tp.x;
              y = tp.y;
            }
            return {
              x,
              y
            };
          }
        };
        function pushOrConcat(base, toPush) {
          if (toPush) {
            if (isArray(toPush)) {
              Array.prototype.push.apply(base, toPush);
            } else {
              base.push(toPush);
            }
          }
          return base;
        }
        function splitNewlines(str) {
          if ((typeof str === "string" || str instanceof String) && str.indexOf("\n") > -1) {
            return str.split("\n");
          }
          return str;
        }
        function createTooltipItem(chart, item) {
          const { element, datasetIndex, index: index2 } = item;
          const controller = chart.getDatasetMeta(datasetIndex).controller;
          const { label, value } = controller.getLabelAndValue(index2);
          return {
            chart,
            label,
            parsed: controller.getParsed(index2),
            raw: chart.data.datasets[datasetIndex].data[index2],
            formattedValue: value,
            dataset: controller.getDataset(),
            dataIndex: index2,
            datasetIndex,
            element
          };
        }
        function getTooltipSize(tooltip, options) {
          const ctx = tooltip.chart.ctx;
          const { body, footer, title } = tooltip;
          const { boxWidth, boxHeight } = options;
          const bodyFont = toFont(options.bodyFont);
          const titleFont = toFont(options.titleFont);
          const footerFont = toFont(options.footerFont);
          const titleLineCount = title.length;
          const footerLineCount = footer.length;
          const bodyLineItemCount = body.length;
          const padding = toPadding(options.padding);
          let height = padding.height;
          let width = 0;
          let combinedBodyLength = body.reduce((count, bodyItem) => count + bodyItem.before.length + bodyItem.lines.length + bodyItem.after.length, 0);
          combinedBodyLength += tooltip.beforeBody.length + tooltip.afterBody.length;
          if (titleLineCount) {
            height += titleLineCount * titleFont.lineHeight + (titleLineCount - 1) * options.titleSpacing + options.titleMarginBottom;
          }
          if (combinedBodyLength) {
            const bodyLineHeight = options.displayColors ? Math.max(boxHeight, bodyFont.lineHeight) : bodyFont.lineHeight;
            height += bodyLineItemCount * bodyLineHeight + (combinedBodyLength - bodyLineItemCount) * bodyFont.lineHeight + (combinedBodyLength - 1) * options.bodySpacing;
          }
          if (footerLineCount) {
            height += options.footerMarginTop + footerLineCount * footerFont.lineHeight + (footerLineCount - 1) * options.footerSpacing;
          }
          let widthPadding = 0;
          const maxLineWidth = function(line) {
            width = Math.max(width, ctx.measureText(line).width + widthPadding);
          };
          ctx.save();
          ctx.font = titleFont.string;
          each(tooltip.title, maxLineWidth);
          ctx.font = bodyFont.string;
          each(tooltip.beforeBody.concat(tooltip.afterBody), maxLineWidth);
          widthPadding = options.displayColors ? boxWidth + 2 + options.boxPadding : 0;
          each(body, (bodyItem) => {
            each(bodyItem.before, maxLineWidth);
            each(bodyItem.lines, maxLineWidth);
            each(bodyItem.after, maxLineWidth);
          });
          widthPadding = 0;
          ctx.font = footerFont.string;
          each(tooltip.footer, maxLineWidth);
          ctx.restore();
          width += padding.width;
          return { width, height };
        }
        function determineYAlign(chart, size) {
          const { y, height } = size;
          if (y < height / 2) {
            return "top";
          } else if (y > chart.height - height / 2) {
            return "bottom";
          }
          return "center";
        }
        function doesNotFitWithAlign(xAlign, chart, options, size) {
          const { x, width } = size;
          const caret = options.caretSize + options.caretPadding;
          if (xAlign === "left" && x + width + caret > chart.width) {
            return true;
          }
          if (xAlign === "right" && x - width - caret < 0) {
            return true;
          }
        }
        function determineXAlign(chart, options, size, yAlign) {
          const { x, width } = size;
          const { width: chartWidth, chartArea: { left, right } } = chart;
          let xAlign = "center";
          if (yAlign === "center") {
            xAlign = x <= (left + right) / 2 ? "left" : "right";
          } else if (x <= width / 2) {
            xAlign = "left";
          } else if (x >= chartWidth - width / 2) {
            xAlign = "right";
          }
          if (doesNotFitWithAlign(xAlign, chart, options, size)) {
            xAlign = "center";
          }
          return xAlign;
        }
        function determineAlignment(chart, options, size) {
          const yAlign = size.yAlign || options.yAlign || determineYAlign(chart, size);
          return {
            xAlign: size.xAlign || options.xAlign || determineXAlign(chart, options, size, yAlign),
            yAlign
          };
        }
        function alignX(size, xAlign) {
          let { x, width } = size;
          if (xAlign === "right") {
            x -= width;
          } else if (xAlign === "center") {
            x -= width / 2;
          }
          return x;
        }
        function alignY(size, yAlign, paddingAndSize) {
          let { y, height } = size;
          if (yAlign === "top") {
            y += paddingAndSize;
          } else if (yAlign === "bottom") {
            y -= height + paddingAndSize;
          } else {
            y -= height / 2;
          }
          return y;
        }
        function getBackgroundPoint(options, size, alignment, chart) {
          const { caretSize, caretPadding, cornerRadius } = options;
          const { xAlign, yAlign } = alignment;
          const paddingAndSize = caretSize + caretPadding;
          const { topLeft, topRight, bottomLeft, bottomRight } = toTRBLCorners(cornerRadius);
          let x = alignX(size, xAlign);
          const y = alignY(size, yAlign, paddingAndSize);
          if (yAlign === "center") {
            if (xAlign === "left") {
              x += paddingAndSize;
            } else if (xAlign === "right") {
              x -= paddingAndSize;
            }
          } else if (xAlign === "left") {
            x -= Math.max(topLeft, bottomLeft) + caretSize;
          } else if (xAlign === "right") {
            x += Math.max(topRight, bottomRight) + caretSize;
          }
          return {
            x: _limitValue(x, 0, chart.width - size.width),
            y: _limitValue(y, 0, chart.height - size.height)
          };
        }
        function getAlignedX(tooltip, align, options) {
          const padding = toPadding(options.padding);
          return align === "center" ? tooltip.x + tooltip.width / 2 : align === "right" ? tooltip.x + tooltip.width - padding.right : tooltip.x + padding.left;
        }
        function getBeforeAfterBodyLines(callback2) {
          return pushOrConcat([], splitNewlines(callback2));
        }
        function createTooltipContext(parent, tooltip, tooltipItems) {
          return createContext(parent, {
            tooltip,
            tooltipItems,
            type: "tooltip"
          });
        }
        function overrideCallbacks(callbacks, context) {
          const override = context && context.dataset && context.dataset.tooltip && context.dataset.tooltip.callbacks;
          return override ? callbacks.override(override) : callbacks;
        }
        class Tooltip extends Element {
          constructor(config) {
            super();
            this.opacity = 0;
            this._active = [];
            this._eventPosition = void 0;
            this._size = void 0;
            this._cachedAnimations = void 0;
            this._tooltipItems = [];
            this.$animations = void 0;
            this.$context = void 0;
            this.chart = config.chart || config._chart;
            this._chart = this.chart;
            this.options = config.options;
            this.dataPoints = void 0;
            this.title = void 0;
            this.beforeBody = void 0;
            this.body = void 0;
            this.afterBody = void 0;
            this.footer = void 0;
            this.xAlign = void 0;
            this.yAlign = void 0;
            this.x = void 0;
            this.y = void 0;
            this.height = void 0;
            this.width = void 0;
            this.caretX = void 0;
            this.caretY = void 0;
            this.labelColors = void 0;
            this.labelPointStyles = void 0;
            this.labelTextColors = void 0;
          }
          initialize(options) {
            this.options = options;
            this._cachedAnimations = void 0;
            this.$context = void 0;
          }
          _resolveAnimations() {
            const cached = this._cachedAnimations;
            if (cached) {
              return cached;
            }
            const chart = this.chart;
            const options = this.options.setContext(this.getContext());
            const opts = options.enabled && chart.options.animation && options.animations;
            const animations = new Animations(this.chart, opts);
            if (opts._cacheable) {
              this._cachedAnimations = Object.freeze(animations);
            }
            return animations;
          }
          getContext() {
            return this.$context || (this.$context = createTooltipContext(this.chart.getContext(), this, this._tooltipItems));
          }
          getTitle(context, options) {
            const { callbacks } = options;
            const beforeTitle = callbacks.beforeTitle.apply(this, [context]);
            const title = callbacks.title.apply(this, [context]);
            const afterTitle = callbacks.afterTitle.apply(this, [context]);
            let lines = [];
            lines = pushOrConcat(lines, splitNewlines(beforeTitle));
            lines = pushOrConcat(lines, splitNewlines(title));
            lines = pushOrConcat(lines, splitNewlines(afterTitle));
            return lines;
          }
          getBeforeBody(tooltipItems, options) {
            return getBeforeAfterBodyLines(options.callbacks.beforeBody.apply(this, [tooltipItems]));
          }
          getBody(tooltipItems, options) {
            const { callbacks } = options;
            const bodyItems = [];
            each(tooltipItems, (context) => {
              const bodyItem = {
                before: [],
                lines: [],
                after: []
              };
              const scoped = overrideCallbacks(callbacks, context);
              pushOrConcat(bodyItem.before, splitNewlines(scoped.beforeLabel.call(this, context)));
              pushOrConcat(bodyItem.lines, scoped.label.call(this, context));
              pushOrConcat(bodyItem.after, splitNewlines(scoped.afterLabel.call(this, context)));
              bodyItems.push(bodyItem);
            });
            return bodyItems;
          }
          getAfterBody(tooltipItems, options) {
            return getBeforeAfterBodyLines(options.callbacks.afterBody.apply(this, [tooltipItems]));
          }
          getFooter(tooltipItems, options) {
            const { callbacks } = options;
            const beforeFooter = callbacks.beforeFooter.apply(this, [tooltipItems]);
            const footer = callbacks.footer.apply(this, [tooltipItems]);
            const afterFooter = callbacks.afterFooter.apply(this, [tooltipItems]);
            let lines = [];
            lines = pushOrConcat(lines, splitNewlines(beforeFooter));
            lines = pushOrConcat(lines, splitNewlines(footer));
            lines = pushOrConcat(lines, splitNewlines(afterFooter));
            return lines;
          }
          _createItems(options) {
            const active = this._active;
            const data = this.chart.data;
            const labelColors = [];
            const labelPointStyles = [];
            const labelTextColors = [];
            let tooltipItems = [];
            let i, len;
            for (i = 0, len = active.length; i < len; ++i) {
              tooltipItems.push(createTooltipItem(this.chart, active[i]));
            }
            if (options.filter) {
              tooltipItems = tooltipItems.filter((element, index2, array) => options.filter(element, index2, array, data));
            }
            if (options.itemSort) {
              tooltipItems = tooltipItems.sort((a, b) => options.itemSort(a, b, data));
            }
            each(tooltipItems, (context) => {
              const scoped = overrideCallbacks(options.callbacks, context);
              labelColors.push(scoped.labelColor.call(this, context));
              labelPointStyles.push(scoped.labelPointStyle.call(this, context));
              labelTextColors.push(scoped.labelTextColor.call(this, context));
            });
            this.labelColors = labelColors;
            this.labelPointStyles = labelPointStyles;
            this.labelTextColors = labelTextColors;
            this.dataPoints = tooltipItems;
            return tooltipItems;
          }
          update(changed, replay) {
            const options = this.options.setContext(this.getContext());
            const active = this._active;
            let properties;
            let tooltipItems = [];
            if (!active.length) {
              if (this.opacity !== 0) {
                properties = {
                  opacity: 0
                };
              }
            } else {
              const position = positioners[options.position].call(this, active, this._eventPosition);
              tooltipItems = this._createItems(options);
              this.title = this.getTitle(tooltipItems, options);
              this.beforeBody = this.getBeforeBody(tooltipItems, options);
              this.body = this.getBody(tooltipItems, options);
              this.afterBody = this.getAfterBody(tooltipItems, options);
              this.footer = this.getFooter(tooltipItems, options);
              const size = this._size = getTooltipSize(this, options);
              const positionAndSize = Object.assign({}, position, size);
              const alignment = determineAlignment(this.chart, options, positionAndSize);
              const backgroundPoint = getBackgroundPoint(options, positionAndSize, alignment, this.chart);
              this.xAlign = alignment.xAlign;
              this.yAlign = alignment.yAlign;
              properties = {
                opacity: 1,
                x: backgroundPoint.x,
                y: backgroundPoint.y,
                width: size.width,
                height: size.height,
                caretX: position.x,
                caretY: position.y
              };
            }
            this._tooltipItems = tooltipItems;
            this.$context = void 0;
            if (properties) {
              this._resolveAnimations().update(this, properties);
            }
            if (changed && options.external) {
              options.external.call(this, { chart: this.chart, tooltip: this, replay });
            }
          }
          drawCaret(tooltipPoint, ctx, size, options) {
            const caretPosition = this.getCaretPosition(tooltipPoint, size, options);
            ctx.lineTo(caretPosition.x1, caretPosition.y1);
            ctx.lineTo(caretPosition.x2, caretPosition.y2);
            ctx.lineTo(caretPosition.x3, caretPosition.y3);
          }
          getCaretPosition(tooltipPoint, size, options) {
            const { xAlign, yAlign } = this;
            const { caretSize, cornerRadius } = options;
            const { topLeft, topRight, bottomLeft, bottomRight } = toTRBLCorners(cornerRadius);
            const { x: ptX, y: ptY } = tooltipPoint;
            const { width, height } = size;
            let x1, x2, x3, y1, y2, y3;
            if (yAlign === "center") {
              y2 = ptY + height / 2;
              if (xAlign === "left") {
                x1 = ptX;
                x2 = x1 - caretSize;
                y1 = y2 + caretSize;
                y3 = y2 - caretSize;
              } else {
                x1 = ptX + width;
                x2 = x1 + caretSize;
                y1 = y2 - caretSize;
                y3 = y2 + caretSize;
              }
              x3 = x1;
            } else {
              if (xAlign === "left") {
                x2 = ptX + Math.max(topLeft, bottomLeft) + caretSize;
              } else if (xAlign === "right") {
                x2 = ptX + width - Math.max(topRight, bottomRight) - caretSize;
              } else {
                x2 = this.caretX;
              }
              if (yAlign === "top") {
                y1 = ptY;
                y2 = y1 - caretSize;
                x1 = x2 - caretSize;
                x3 = x2 + caretSize;
              } else {
                y1 = ptY + height;
                y2 = y1 + caretSize;
                x1 = x2 + caretSize;
                x3 = x2 - caretSize;
              }
              y3 = y1;
            }
            return { x1, x2, x3, y1, y2, y3 };
          }
          drawTitle(pt, ctx, options) {
            const title = this.title;
            const length = title.length;
            let titleFont, titleSpacing, i;
            if (length) {
              const rtlHelper = getRtlAdapter(options.rtl, this.x, this.width);
              pt.x = getAlignedX(this, options.titleAlign, options);
              ctx.textAlign = rtlHelper.textAlign(options.titleAlign);
              ctx.textBaseline = "middle";
              titleFont = toFont(options.titleFont);
              titleSpacing = options.titleSpacing;
              ctx.fillStyle = options.titleColor;
              ctx.font = titleFont.string;
              for (i = 0; i < length; ++i) {
                ctx.fillText(title[i], rtlHelper.x(pt.x), pt.y + titleFont.lineHeight / 2);
                pt.y += titleFont.lineHeight + titleSpacing;
                if (i + 1 === length) {
                  pt.y += options.titleMarginBottom - titleSpacing;
                }
              }
            }
          }
          _drawColorBox(ctx, pt, i, rtlHelper, options) {
            const labelColors = this.labelColors[i];
            const labelPointStyle = this.labelPointStyles[i];
            const { boxHeight, boxWidth, boxPadding } = options;
            const bodyFont = toFont(options.bodyFont);
            const colorX = getAlignedX(this, "left", options);
            const rtlColorX = rtlHelper.x(colorX);
            const yOffSet = boxHeight < bodyFont.lineHeight ? (bodyFont.lineHeight - boxHeight) / 2 : 0;
            const colorY = pt.y + yOffSet;
            if (options.usePointStyle) {
              const drawOptions = {
                radius: Math.min(boxWidth, boxHeight) / 2,
                pointStyle: labelPointStyle.pointStyle,
                rotation: labelPointStyle.rotation,
                borderWidth: 1
              };
              const centerX = rtlHelper.leftForLtr(rtlColorX, boxWidth) + boxWidth / 2;
              const centerY = colorY + boxHeight / 2;
              ctx.strokeStyle = options.multiKeyBackground;
              ctx.fillStyle = options.multiKeyBackground;
              drawPoint(ctx, drawOptions, centerX, centerY);
              ctx.strokeStyle = labelColors.borderColor;
              ctx.fillStyle = labelColors.backgroundColor;
              drawPoint(ctx, drawOptions, centerX, centerY);
            } else {
              ctx.lineWidth = isObject(labelColors.borderWidth) ? Math.max(...Object.values(labelColors.borderWidth)) : labelColors.borderWidth || 1;
              ctx.strokeStyle = labelColors.borderColor;
              ctx.setLineDash(labelColors.borderDash || []);
              ctx.lineDashOffset = labelColors.borderDashOffset || 0;
              const outerX = rtlHelper.leftForLtr(rtlColorX, boxWidth - boxPadding);
              const innerX = rtlHelper.leftForLtr(rtlHelper.xPlus(rtlColorX, 1), boxWidth - boxPadding - 2);
              const borderRadius = toTRBLCorners(labelColors.borderRadius);
              if (Object.values(borderRadius).some((v) => v !== 0)) {
                ctx.beginPath();
                ctx.fillStyle = options.multiKeyBackground;
                addRoundedRectPath(ctx, {
                  x: outerX,
                  y: colorY,
                  w: boxWidth,
                  h: boxHeight,
                  radius: borderRadius
                });
                ctx.fill();
                ctx.stroke();
                ctx.fillStyle = labelColors.backgroundColor;
                ctx.beginPath();
                addRoundedRectPath(ctx, {
                  x: innerX,
                  y: colorY + 1,
                  w: boxWidth - 2,
                  h: boxHeight - 2,
                  radius: borderRadius
                });
                ctx.fill();
              } else {
                ctx.fillStyle = options.multiKeyBackground;
                ctx.fillRect(outerX, colorY, boxWidth, boxHeight);
                ctx.strokeRect(outerX, colorY, boxWidth, boxHeight);
                ctx.fillStyle = labelColors.backgroundColor;
                ctx.fillRect(innerX, colorY + 1, boxWidth - 2, boxHeight - 2);
              }
            }
            ctx.fillStyle = this.labelTextColors[i];
          }
          drawBody(pt, ctx, options) {
            const { body } = this;
            const { bodySpacing, bodyAlign, displayColors, boxHeight, boxWidth, boxPadding } = options;
            const bodyFont = toFont(options.bodyFont);
            let bodyLineHeight = bodyFont.lineHeight;
            let xLinePadding = 0;
            const rtlHelper = getRtlAdapter(options.rtl, this.x, this.width);
            const fillLineOfText = function(line) {
              ctx.fillText(line, rtlHelper.x(pt.x + xLinePadding), pt.y + bodyLineHeight / 2);
              pt.y += bodyLineHeight + bodySpacing;
            };
            const bodyAlignForCalculation = rtlHelper.textAlign(bodyAlign);
            let bodyItem, textColor, lines, i, j, ilen, jlen;
            ctx.textAlign = bodyAlign;
            ctx.textBaseline = "middle";
            ctx.font = bodyFont.string;
            pt.x = getAlignedX(this, bodyAlignForCalculation, options);
            ctx.fillStyle = options.bodyColor;
            each(this.beforeBody, fillLineOfText);
            xLinePadding = displayColors && bodyAlignForCalculation !== "right" ? bodyAlign === "center" ? boxWidth / 2 + boxPadding : boxWidth + 2 + boxPadding : 0;
            for (i = 0, ilen = body.length; i < ilen; ++i) {
              bodyItem = body[i];
              textColor = this.labelTextColors[i];
              ctx.fillStyle = textColor;
              each(bodyItem.before, fillLineOfText);
              lines = bodyItem.lines;
              if (displayColors && lines.length) {
                this._drawColorBox(ctx, pt, i, rtlHelper, options);
                bodyLineHeight = Math.max(bodyFont.lineHeight, boxHeight);
              }
              for (j = 0, jlen = lines.length; j < jlen; ++j) {
                fillLineOfText(lines[j]);
                bodyLineHeight = bodyFont.lineHeight;
              }
              each(bodyItem.after, fillLineOfText);
            }
            xLinePadding = 0;
            bodyLineHeight = bodyFont.lineHeight;
            each(this.afterBody, fillLineOfText);
            pt.y -= bodySpacing;
          }
          drawFooter(pt, ctx, options) {
            const footer = this.footer;
            const length = footer.length;
            let footerFont, i;
            if (length) {
              const rtlHelper = getRtlAdapter(options.rtl, this.x, this.width);
              pt.x = getAlignedX(this, options.footerAlign, options);
              pt.y += options.footerMarginTop;
              ctx.textAlign = rtlHelper.textAlign(options.footerAlign);
              ctx.textBaseline = "middle";
              footerFont = toFont(options.footerFont);
              ctx.fillStyle = options.footerColor;
              ctx.font = footerFont.string;
              for (i = 0; i < length; ++i) {
                ctx.fillText(footer[i], rtlHelper.x(pt.x), pt.y + footerFont.lineHeight / 2);
                pt.y += footerFont.lineHeight + options.footerSpacing;
              }
            }
          }
          drawBackground(pt, ctx, tooltipSize, options) {
            const { xAlign, yAlign } = this;
            const { x, y } = pt;
            const { width, height } = tooltipSize;
            const { topLeft, topRight, bottomLeft, bottomRight } = toTRBLCorners(options.cornerRadius);
            ctx.fillStyle = options.backgroundColor;
            ctx.strokeStyle = options.borderColor;
            ctx.lineWidth = options.borderWidth;
            ctx.beginPath();
            ctx.moveTo(x + topLeft, y);
            if (yAlign === "top") {
              this.drawCaret(pt, ctx, tooltipSize, options);
            }
            ctx.lineTo(x + width - topRight, y);
            ctx.quadraticCurveTo(x + width, y, x + width, y + topRight);
            if (yAlign === "center" && xAlign === "right") {
              this.drawCaret(pt, ctx, tooltipSize, options);
            }
            ctx.lineTo(x + width, y + height - bottomRight);
            ctx.quadraticCurveTo(x + width, y + height, x + width - bottomRight, y + height);
            if (yAlign === "bottom") {
              this.drawCaret(pt, ctx, tooltipSize, options);
            }
            ctx.lineTo(x + bottomLeft, y + height);
            ctx.quadraticCurveTo(x, y + height, x, y + height - bottomLeft);
            if (yAlign === "center" && xAlign === "left") {
              this.drawCaret(pt, ctx, tooltipSize, options);
            }
            ctx.lineTo(x, y + topLeft);
            ctx.quadraticCurveTo(x, y, x + topLeft, y);
            ctx.closePath();
            ctx.fill();
            if (options.borderWidth > 0) {
              ctx.stroke();
            }
          }
          _updateAnimationTarget(options) {
            const chart = this.chart;
            const anims = this.$animations;
            const animX = anims && anims.x;
            const animY = anims && anims.y;
            if (animX || animY) {
              const position = positioners[options.position].call(this, this._active, this._eventPosition);
              if (!position) {
                return;
              }
              const size = this._size = getTooltipSize(this, options);
              const positionAndSize = Object.assign({}, position, this._size);
              const alignment = determineAlignment(chart, options, positionAndSize);
              const point = getBackgroundPoint(options, positionAndSize, alignment, chart);
              if (animX._to !== point.x || animY._to !== point.y) {
                this.xAlign = alignment.xAlign;
                this.yAlign = alignment.yAlign;
                this.width = size.width;
                this.height = size.height;
                this.caretX = position.x;
                this.caretY = position.y;
                this._resolveAnimations().update(this, point);
              }
            }
          }
          _willRender() {
            return !!this.opacity;
          }
          draw(ctx) {
            const options = this.options.setContext(this.getContext());
            let opacity = this.opacity;
            if (!opacity) {
              return;
            }
            this._updateAnimationTarget(options);
            const tooltipSize = {
              width: this.width,
              height: this.height
            };
            const pt = {
              x: this.x,
              y: this.y
            };
            opacity = Math.abs(opacity) < 1e-3 ? 0 : opacity;
            const padding = toPadding(options.padding);
            const hasTooltipContent = this.title.length || this.beforeBody.length || this.body.length || this.afterBody.length || this.footer.length;
            if (options.enabled && hasTooltipContent) {
              ctx.save();
              ctx.globalAlpha = opacity;
              this.drawBackground(pt, ctx, tooltipSize, options);
              overrideTextDirection(ctx, options.textDirection);
              pt.y += padding.top;
              this.drawTitle(pt, ctx, options);
              this.drawBody(pt, ctx, options);
              this.drawFooter(pt, ctx, options);
              restoreTextDirection(ctx, options.textDirection);
              ctx.restore();
            }
          }
          getActiveElements() {
            return this._active || [];
          }
          setActiveElements(activeElements, eventPosition) {
            const lastActive = this._active;
            const active = activeElements.map(({ datasetIndex, index: index2 }) => {
              const meta = this.chart.getDatasetMeta(datasetIndex);
              if (!meta) {
                throw new Error("Cannot find a dataset at index " + datasetIndex);
              }
              return {
                datasetIndex,
                element: meta.data[index2],
                index: index2
              };
            });
            const changed = !_elementsEqual(lastActive, active);
            const positionChanged = this._positionChanged(active, eventPosition);
            if (changed || positionChanged) {
              this._active = active;
              this._eventPosition = eventPosition;
              this._ignoreReplayEvents = true;
              this.update(true);
            }
          }
          handleEvent(e, replay, inChartArea = true) {
            if (replay && this._ignoreReplayEvents) {
              return false;
            }
            this._ignoreReplayEvents = false;
            const options = this.options;
            const lastActive = this._active || [];
            const active = this._getActiveElements(e, lastActive, replay, inChartArea);
            const positionChanged = this._positionChanged(active, e);
            const changed = replay || !_elementsEqual(active, lastActive) || positionChanged;
            if (changed) {
              this._active = active;
              if (options.enabled || options.external) {
                this._eventPosition = {
                  x: e.x,
                  y: e.y
                };
                this.update(true, replay);
              }
            }
            return changed;
          }
          _getActiveElements(e, lastActive, replay, inChartArea) {
            const options = this.options;
            if (e.type === "mouseout") {
              return [];
            }
            if (!inChartArea) {
              return lastActive;
            }
            const active = this.chart.getElementsAtEventForMode(e, options.mode, options, replay);
            if (options.reverse) {
              active.reverse();
            }
            return active;
          }
          _positionChanged(active, e) {
            const { caretX, caretY, options } = this;
            const position = positioners[options.position].call(this, active, e);
            return position !== false && (caretX !== position.x || caretY !== position.y);
          }
        }
        Tooltip.positioners = positioners;
        var plugin_tooltip = {
          id: "tooltip",
          _element: Tooltip,
          positioners,
          afterInit(chart, _args, options) {
            if (options) {
              chart.tooltip = new Tooltip({ chart, options });
            }
          },
          beforeUpdate(chart, _args, options) {
            if (chart.tooltip) {
              chart.tooltip.initialize(options);
            }
          },
          reset(chart, _args, options) {
            if (chart.tooltip) {
              chart.tooltip.initialize(options);
            }
          },
          afterDraw(chart) {
            const tooltip = chart.tooltip;
            if (tooltip && tooltip._willRender()) {
              const args = {
                tooltip
              };
              if (chart.notifyPlugins("beforeTooltipDraw", args) === false) {
                return;
              }
              tooltip.draw(chart.ctx);
              chart.notifyPlugins("afterTooltipDraw", args);
            }
          },
          afterEvent(chart, args) {
            if (chart.tooltip) {
              const useFinalPosition = args.replay;
              if (chart.tooltip.handleEvent(args.event, useFinalPosition, args.inChartArea)) {
                args.changed = true;
              }
            }
          },
          defaults: {
            enabled: true,
            external: null,
            position: "average",
            backgroundColor: "rgba(0,0,0,0.8)",
            titleColor: "#fff",
            titleFont: {
              weight: "bold"
            },
            titleSpacing: 2,
            titleMarginBottom: 6,
            titleAlign: "left",
            bodyColor: "#fff",
            bodySpacing: 2,
            bodyFont: {},
            bodyAlign: "left",
            footerColor: "#fff",
            footerSpacing: 2,
            footerMarginTop: 6,
            footerFont: {
              weight: "bold"
            },
            footerAlign: "left",
            padding: 6,
            caretPadding: 2,
            caretSize: 5,
            cornerRadius: 6,
            boxHeight: (ctx, opts) => opts.bodyFont.size,
            boxWidth: (ctx, opts) => opts.bodyFont.size,
            multiKeyBackground: "#fff",
            displayColors: true,
            boxPadding: 0,
            borderColor: "rgba(0,0,0,0)",
            borderWidth: 0,
            animation: {
              duration: 400,
              easing: "easeOutQuart"
            },
            animations: {
              numbers: {
                type: "number",
                properties: ["x", "y", "width", "height", "caretX", "caretY"]
              },
              opacity: {
                easing: "linear",
                duration: 200
              }
            },
            callbacks: {
              beforeTitle: noop,
              title(tooltipItems) {
                if (tooltipItems.length > 0) {
                  const item = tooltipItems[0];
                  const labels = item.chart.data.labels;
                  const labelCount = labels ? labels.length : 0;
                  if (this && this.options && this.options.mode === "dataset") {
                    return item.dataset.label || "";
                  } else if (item.label) {
                    return item.label;
                  } else if (labelCount > 0 && item.dataIndex < labelCount) {
                    return labels[item.dataIndex];
                  }
                }
                return "";
              },
              afterTitle: noop,
              beforeBody: noop,
              beforeLabel: noop,
              label(tooltipItem) {
                if (this && this.options && this.options.mode === "dataset") {
                  return tooltipItem.label + ": " + tooltipItem.formattedValue || tooltipItem.formattedValue;
                }
                let label = tooltipItem.dataset.label || "";
                if (label) {
                  label += ": ";
                }
                const value = tooltipItem.formattedValue;
                if (!isNullOrUndef(value)) {
                  label += value;
                }
                return label;
              },
              labelColor(tooltipItem) {
                const meta = tooltipItem.chart.getDatasetMeta(tooltipItem.datasetIndex);
                const options = meta.controller.getStyle(tooltipItem.dataIndex);
                return {
                  borderColor: options.borderColor,
                  backgroundColor: options.backgroundColor,
                  borderWidth: options.borderWidth,
                  borderDash: options.borderDash,
                  borderDashOffset: options.borderDashOffset,
                  borderRadius: 0
                };
              },
              labelTextColor() {
                return this.options.bodyColor;
              },
              labelPointStyle(tooltipItem) {
                const meta = tooltipItem.chart.getDatasetMeta(tooltipItem.datasetIndex);
                const options = meta.controller.getStyle(tooltipItem.dataIndex);
                return {
                  pointStyle: options.pointStyle,
                  rotation: options.rotation
                };
              },
              afterLabel: noop,
              afterBody: noop,
              beforeFooter: noop,
              footer: noop,
              afterFooter: noop
            }
          },
          defaultRoutes: {
            bodyFont: "font",
            footerFont: "font",
            titleFont: "font"
          },
          descriptors: {
            _scriptable: (name) => name !== "filter" && name !== "itemSort" && name !== "external",
            _indexable: false,
            callbacks: {
              _scriptable: false,
              _indexable: false
            },
            animation: {
              _fallback: false
            },
            animations: {
              _fallback: "animation"
            }
          },
          additionalOptionScopes: ["interaction"]
        };
        var plugins = /* @__PURE__ */ Object.freeze({
          __proto__: null,
          Decimation: plugin_decimation,
          Filler: index,
          Legend: plugin_legend,
          SubTitle: plugin_subtitle,
          Title: plugin_title,
          Tooltip: plugin_tooltip
        });
        const addIfString = (labels, raw, index2, addedLabels) => {
          if (typeof raw === "string") {
            index2 = labels.push(raw) - 1;
            addedLabels.unshift({ index: index2, label: raw });
          } else if (isNaN(raw)) {
            index2 = null;
          }
          return index2;
        };
        function findOrAddLabel(labels, raw, index2, addedLabels) {
          const first = labels.indexOf(raw);
          if (first === -1) {
            return addIfString(labels, raw, index2, addedLabels);
          }
          const last = labels.lastIndexOf(raw);
          return first !== last ? index2 : first;
        }
        const validIndex = (index2, max) => index2 === null ? null : _limitValue(Math.round(index2), 0, max);
        class CategoryScale extends Scale {
          constructor(cfg) {
            super(cfg);
            this._startValue = void 0;
            this._valueRange = 0;
            this._addedLabels = [];
          }
          init(scaleOptions) {
            const added = this._addedLabels;
            if (added.length) {
              const labels = this.getLabels();
              for (const { index: index2, label } of added) {
                if (labels[index2] === label) {
                  labels.splice(index2, 1);
                }
              }
              this._addedLabels = [];
            }
            super.init(scaleOptions);
          }
          parse(raw, index2) {
            if (isNullOrUndef(raw)) {
              return null;
            }
            const labels = this.getLabels();
            index2 = isFinite(index2) && labels[index2] === raw ? index2 : findOrAddLabel(labels, raw, valueOrDefault(index2, raw), this._addedLabels);
            return validIndex(index2, labels.length - 1);
          }
          determineDataLimits() {
            const { minDefined, maxDefined } = this.getUserBounds();
            let { min, max } = this.getMinMax(true);
            if (this.options.bounds === "ticks") {
              if (!minDefined) {
                min = 0;
              }
              if (!maxDefined) {
                max = this.getLabels().length - 1;
              }
            }
            this.min = min;
            this.max = max;
          }
          buildTicks() {
            const min = this.min;
            const max = this.max;
            const offset = this.options.offset;
            const ticks = [];
            let labels = this.getLabels();
            labels = min === 0 && max === labels.length - 1 ? labels : labels.slice(min, max + 1);
            this._valueRange = Math.max(labels.length - (offset ? 0 : 1), 1);
            this._startValue = this.min - (offset ? 0.5 : 0);
            for (let value = min; value <= max; value++) {
              ticks.push({ value });
            }
            return ticks;
          }
          getLabelForValue(value) {
            const labels = this.getLabels();
            if (value >= 0 && value < labels.length) {
              return labels[value];
            }
            return value;
          }
          configure() {
            super.configure();
            if (!this.isHorizontal()) {
              this._reversePixels = !this._reversePixels;
            }
          }
          getPixelForValue(value) {
            if (typeof value !== "number") {
              value = this.parse(value);
            }
            return value === null ? NaN : this.getPixelForDecimal((value - this._startValue) / this._valueRange);
          }
          getPixelForTick(index2) {
            const ticks = this.ticks;
            if (index2 < 0 || index2 > ticks.length - 1) {
              return null;
            }
            return this.getPixelForValue(ticks[index2].value);
          }
          getValueForPixel(pixel) {
            return Math.round(this._startValue + this.getDecimalForPixel(pixel) * this._valueRange);
          }
          getBasePixel() {
            return this.bottom;
          }
        }
        CategoryScale.id = "category";
        CategoryScale.defaults = {
          ticks: {
            callback: CategoryScale.prototype.getLabelForValue
          }
        };
        function generateTicks$1(generationOptions, dataRange) {
          const ticks = [];
          const MIN_SPACING = 1e-14;
          const { bounds, step, min, max, precision, count, maxTicks, maxDigits, includeBounds } = generationOptions;
          const unit = step || 1;
          const maxSpaces = maxTicks - 1;
          const { min: rmin, max: rmax } = dataRange;
          const minDefined = !isNullOrUndef(min);
          const maxDefined = !isNullOrUndef(max);
          const countDefined = !isNullOrUndef(count);
          const minSpacing = (rmax - rmin) / (maxDigits + 1);
          let spacing = niceNum((rmax - rmin) / maxSpaces / unit) * unit;
          let factor, niceMin, niceMax, numSpaces;
          if (spacing < MIN_SPACING && !minDefined && !maxDefined) {
            return [{ value: rmin }, { value: rmax }];
          }
          numSpaces = Math.ceil(rmax / spacing) - Math.floor(rmin / spacing);
          if (numSpaces > maxSpaces) {
            spacing = niceNum(numSpaces * spacing / maxSpaces / unit) * unit;
          }
          if (!isNullOrUndef(precision)) {
            factor = Math.pow(10, precision);
            spacing = Math.ceil(spacing * factor) / factor;
          }
          if (bounds === "ticks") {
            niceMin = Math.floor(rmin / spacing) * spacing;
            niceMax = Math.ceil(rmax / spacing) * spacing;
          } else {
            niceMin = rmin;
            niceMax = rmax;
          }
          if (minDefined && maxDefined && step && almostWhole((max - min) / step, spacing / 1e3)) {
            numSpaces = Math.round(Math.min((max - min) / spacing, maxTicks));
            spacing = (max - min) / numSpaces;
            niceMin = min;
            niceMax = max;
          } else if (countDefined) {
            niceMin = minDefined ? min : niceMin;
            niceMax = maxDefined ? max : niceMax;
            numSpaces = count - 1;
            spacing = (niceMax - niceMin) / numSpaces;
          } else {
            numSpaces = (niceMax - niceMin) / spacing;
            if (almostEquals(numSpaces, Math.round(numSpaces), spacing / 1e3)) {
              numSpaces = Math.round(numSpaces);
            } else {
              numSpaces = Math.ceil(numSpaces);
            }
          }
          const decimalPlaces = Math.max(
            _decimalPlaces(spacing),
            _decimalPlaces(niceMin)
          );
          factor = Math.pow(10, isNullOrUndef(precision) ? decimalPlaces : precision);
          niceMin = Math.round(niceMin * factor) / factor;
          niceMax = Math.round(niceMax * factor) / factor;
          let j = 0;
          if (minDefined) {
            if (includeBounds && niceMin !== min) {
              ticks.push({ value: min });
              if (niceMin < min) {
                j++;
              }
              if (almostEquals(Math.round((niceMin + j * spacing) * factor) / factor, min, relativeLabelSize(min, minSpacing, generationOptions))) {
                j++;
              }
            } else if (niceMin < min) {
              j++;
            }
          }
          for (; j < numSpaces; ++j) {
            ticks.push({ value: Math.round((niceMin + j * spacing) * factor) / factor });
          }
          if (maxDefined && includeBounds && niceMax !== max) {
            if (ticks.length && almostEquals(ticks[ticks.length - 1].value, max, relativeLabelSize(max, minSpacing, generationOptions))) {
              ticks[ticks.length - 1].value = max;
            } else {
              ticks.push({ value: max });
            }
          } else if (!maxDefined || niceMax === max) {
            ticks.push({ value: niceMax });
          }
          return ticks;
        }
        function relativeLabelSize(value, minSpacing, { horizontal, minRotation }) {
          const rad = toRadians(minRotation);
          const ratio = (horizontal ? Math.sin(rad) : Math.cos(rad)) || 1e-3;
          const length = 0.75 * minSpacing * ("" + value).length;
          return Math.min(minSpacing / ratio, length);
        }
        class LinearScaleBase extends Scale {
          constructor(cfg) {
            super(cfg);
            this.start = void 0;
            this.end = void 0;
            this._startValue = void 0;
            this._endValue = void 0;
            this._valueRange = 0;
          }
          parse(raw, index2) {
            if (isNullOrUndef(raw)) {
              return null;
            }
            if ((typeof raw === "number" || raw instanceof Number) && !isFinite(+raw)) {
              return null;
            }
            return +raw;
          }
          handleTickRangeOptions() {
            const { beginAtZero } = this.options;
            const { minDefined, maxDefined } = this.getUserBounds();
            let { min, max } = this;
            const setMin = (v) => min = minDefined ? min : v;
            const setMax = (v) => max = maxDefined ? max : v;
            if (beginAtZero) {
              const minSign = sign(min);
              const maxSign = sign(max);
              if (minSign < 0 && maxSign < 0) {
                setMax(0);
              } else if (minSign > 0 && maxSign > 0) {
                setMin(0);
              }
            }
            if (min === max) {
              let offset = 1;
              if (max >= Number.MAX_SAFE_INTEGER || min <= Number.MIN_SAFE_INTEGER) {
                offset = Math.abs(max * 0.05);
              }
              setMax(max + offset);
              if (!beginAtZero) {
                setMin(min - offset);
              }
            }
            this.min = min;
            this.max = max;
          }
          getTickLimit() {
            const tickOpts = this.options.ticks;
            let { maxTicksLimit, stepSize } = tickOpts;
            let maxTicks;
            if (stepSize) {
              maxTicks = Math.ceil(this.max / stepSize) - Math.floor(this.min / stepSize) + 1;
              if (maxTicks > 1e3) {
                console.warn(`scales.${this.id}.ticks.stepSize: ${stepSize} would result generating up to ${maxTicks} ticks. Limiting to 1000.`);
                maxTicks = 1e3;
              }
            } else {
              maxTicks = this.computeTickLimit();
              maxTicksLimit = maxTicksLimit || 11;
            }
            if (maxTicksLimit) {
              maxTicks = Math.min(maxTicksLimit, maxTicks);
            }
            return maxTicks;
          }
          computeTickLimit() {
            return Number.POSITIVE_INFINITY;
          }
          buildTicks() {
            const opts = this.options;
            const tickOpts = opts.ticks;
            let maxTicks = this.getTickLimit();
            maxTicks = Math.max(2, maxTicks);
            const numericGeneratorOptions = {
              maxTicks,
              bounds: opts.bounds,
              min: opts.min,
              max: opts.max,
              precision: tickOpts.precision,
              step: tickOpts.stepSize,
              count: tickOpts.count,
              maxDigits: this._maxDigits(),
              horizontal: this.isHorizontal(),
              minRotation: tickOpts.minRotation || 0,
              includeBounds: tickOpts.includeBounds !== false
            };
            const dataRange = this._range || this;
            const ticks = generateTicks$1(numericGeneratorOptions, dataRange);
            if (opts.bounds === "ticks") {
              _setMinAndMaxByKey(ticks, this, "value");
            }
            if (opts.reverse) {
              ticks.reverse();
              this.start = this.max;
              this.end = this.min;
            } else {
              this.start = this.min;
              this.end = this.max;
            }
            return ticks;
          }
          configure() {
            const ticks = this.ticks;
            let start = this.min;
            let end = this.max;
            super.configure();
            if (this.options.offset && ticks.length) {
              const offset = (end - start) / Math.max(ticks.length - 1, 1) / 2;
              start -= offset;
              end += offset;
            }
            this._startValue = start;
            this._endValue = end;
            this._valueRange = end - start;
          }
          getLabelForValue(value) {
            return formatNumber(value, this.chart.options.locale, this.options.ticks.format);
          }
        }
        class LinearScale extends LinearScaleBase {
          determineDataLimits() {
            const { min, max } = this.getMinMax(true);
            this.min = isNumberFinite(min) ? min : 0;
            this.max = isNumberFinite(max) ? max : 1;
            this.handleTickRangeOptions();
          }
          computeTickLimit() {
            const horizontal = this.isHorizontal();
            const length = horizontal ? this.width : this.height;
            const minRotation = toRadians(this.options.ticks.minRotation);
            const ratio = (horizontal ? Math.sin(minRotation) : Math.cos(minRotation)) || 1e-3;
            const tickFont = this._resolveTickFontOptions(0);
            return Math.ceil(length / Math.min(40, tickFont.lineHeight / ratio));
          }
          getPixelForValue(value) {
            return value === null ? NaN : this.getPixelForDecimal((value - this._startValue) / this._valueRange);
          }
          getValueForPixel(pixel) {
            return this._startValue + this.getDecimalForPixel(pixel) * this._valueRange;
          }
        }
        LinearScale.id = "linear";
        LinearScale.defaults = {
          ticks: {
            callback: Ticks.formatters.numeric
          }
        };
        function isMajor(tickVal) {
          const remain = tickVal / Math.pow(10, Math.floor(log10(tickVal)));
          return remain === 1;
        }
        function generateTicks(generationOptions, dataRange) {
          const endExp = Math.floor(log10(dataRange.max));
          const endSignificand = Math.ceil(dataRange.max / Math.pow(10, endExp));
          const ticks = [];
          let tickVal = finiteOrDefault(generationOptions.min, Math.pow(10, Math.floor(log10(dataRange.min))));
          let exp = Math.floor(log10(tickVal));
          let significand = Math.floor(tickVal / Math.pow(10, exp));
          let precision = exp < 0 ? Math.pow(10, Math.abs(exp)) : 1;
          do {
            ticks.push({ value: tickVal, major: isMajor(tickVal) });
            ++significand;
            if (significand === 10) {
              significand = 1;
              ++exp;
              precision = exp >= 0 ? 1 : precision;
            }
            tickVal = Math.round(significand * Math.pow(10, exp) * precision) / precision;
          } while (exp < endExp || exp === endExp && significand < endSignificand);
          const lastTick = finiteOrDefault(generationOptions.max, tickVal);
          ticks.push({ value: lastTick, major: isMajor(tickVal) });
          return ticks;
        }
        class LogarithmicScale extends Scale {
          constructor(cfg) {
            super(cfg);
            this.start = void 0;
            this.end = void 0;
            this._startValue = void 0;
            this._valueRange = 0;
          }
          parse(raw, index2) {
            const value = LinearScaleBase.prototype.parse.apply(this, [raw, index2]);
            if (value === 0) {
              this._zero = true;
              return void 0;
            }
            return isNumberFinite(value) && value > 0 ? value : null;
          }
          determineDataLimits() {
            const { min, max } = this.getMinMax(true);
            this.min = isNumberFinite(min) ? Math.max(0, min) : null;
            this.max = isNumberFinite(max) ? Math.max(0, max) : null;
            if (this.options.beginAtZero) {
              this._zero = true;
            }
            this.handleTickRangeOptions();
          }
          handleTickRangeOptions() {
            const { minDefined, maxDefined } = this.getUserBounds();
            let min = this.min;
            let max = this.max;
            const setMin = (v) => min = minDefined ? min : v;
            const setMax = (v) => max = maxDefined ? max : v;
            const exp = (v, m) => Math.pow(10, Math.floor(log10(v)) + m);
            if (min === max) {
              if (min <= 0) {
                setMin(1);
                setMax(10);
              } else {
                setMin(exp(min, -1));
                setMax(exp(max, 1));
              }
            }
            if (min <= 0) {
              setMin(exp(max, -1));
            }
            if (max <= 0) {
              setMax(exp(min, 1));
            }
            if (this._zero && this.min !== this._suggestedMin && min === exp(this.min, 0)) {
              setMin(exp(min, -1));
            }
            this.min = min;
            this.max = max;
          }
          buildTicks() {
            const opts = this.options;
            const generationOptions = {
              min: this._userMin,
              max: this._userMax
            };
            const ticks = generateTicks(generationOptions, this);
            if (opts.bounds === "ticks") {
              _setMinAndMaxByKey(ticks, this, "value");
            }
            if (opts.reverse) {
              ticks.reverse();
              this.start = this.max;
              this.end = this.min;
            } else {
              this.start = this.min;
              this.end = this.max;
            }
            return ticks;
          }
          getLabelForValue(value) {
            return value === void 0 ? "0" : formatNumber(value, this.chart.options.locale, this.options.ticks.format);
          }
          configure() {
            const start = this.min;
            super.configure();
            this._startValue = log10(start);
            this._valueRange = log10(this.max) - log10(start);
          }
          getPixelForValue(value) {
            if (value === void 0 || value === 0) {
              value = this.min;
            }
            if (value === null || isNaN(value)) {
              return NaN;
            }
            return this.getPixelForDecimal(value === this.min ? 0 : (log10(value) - this._startValue) / this._valueRange);
          }
          getValueForPixel(pixel) {
            const decimal = this.getDecimalForPixel(pixel);
            return Math.pow(10, this._startValue + decimal * this._valueRange);
          }
        }
        LogarithmicScale.id = "logarithmic";
        LogarithmicScale.defaults = {
          ticks: {
            callback: Ticks.formatters.logarithmic,
            major: {
              enabled: true
            }
          }
        };
        function getTickBackdropHeight(opts) {
          const tickOpts = opts.ticks;
          if (tickOpts.display && opts.display) {
            const padding = toPadding(tickOpts.backdropPadding);
            return valueOrDefault(tickOpts.font && tickOpts.font.size, defaults.font.size) + padding.height;
          }
          return 0;
        }
        function measureLabelSize(ctx, font, label) {
          label = isArray(label) ? label : [label];
          return {
            w: _longestText(ctx, font.string, label),
            h: label.length * font.lineHeight
          };
        }
        function determineLimits(angle, pos, size, min, max) {
          if (angle === min || angle === max) {
            return {
              start: pos - size / 2,
              end: pos + size / 2
            };
          } else if (angle < min || angle > max) {
            return {
              start: pos - size,
              end: pos
            };
          }
          return {
            start: pos,
            end: pos + size
          };
        }
        function fitWithPointLabels(scale) {
          const orig = {
            l: scale.left + scale._padding.left,
            r: scale.right - scale._padding.right,
            t: scale.top + scale._padding.top,
            b: scale.bottom - scale._padding.bottom
          };
          const limits = Object.assign({}, orig);
          const labelSizes = [];
          const padding = [];
          const valueCount = scale._pointLabels.length;
          const pointLabelOpts = scale.options.pointLabels;
          const additionalAngle = pointLabelOpts.centerPointLabels ? PI / valueCount : 0;
          for (let i = 0; i < valueCount; i++) {
            const opts = pointLabelOpts.setContext(scale.getPointLabelContext(i));
            padding[i] = opts.padding;
            const pointPosition = scale.getPointPosition(i, scale.drawingArea + padding[i], additionalAngle);
            const plFont = toFont(opts.font);
            const textSize = measureLabelSize(scale.ctx, plFont, scale._pointLabels[i]);
            labelSizes[i] = textSize;
            const angleRadians = _normalizeAngle(scale.getIndexAngle(i) + additionalAngle);
            const angle = Math.round(toDegrees(angleRadians));
            const hLimits = determineLimits(angle, pointPosition.x, textSize.w, 0, 180);
            const vLimits = determineLimits(angle, pointPosition.y, textSize.h, 90, 270);
            updateLimits(limits, orig, angleRadians, hLimits, vLimits);
          }
          scale.setCenterPoint(
            orig.l - limits.l,
            limits.r - orig.r,
            orig.t - limits.t,
            limits.b - orig.b
          );
          scale._pointLabelItems = buildPointLabelItems(scale, labelSizes, padding);
        }
        function updateLimits(limits, orig, angle, hLimits, vLimits) {
          const sin = Math.abs(Math.sin(angle));
          const cos = Math.abs(Math.cos(angle));
          let x = 0;
          let y = 0;
          if (hLimits.start < orig.l) {
            x = (orig.l - hLimits.start) / sin;
            limits.l = Math.min(limits.l, orig.l - x);
          } else if (hLimits.end > orig.r) {
            x = (hLimits.end - orig.r) / sin;
            limits.r = Math.max(limits.r, orig.r + x);
          }
          if (vLimits.start < orig.t) {
            y = (orig.t - vLimits.start) / cos;
            limits.t = Math.min(limits.t, orig.t - y);
          } else if (vLimits.end > orig.b) {
            y = (vLimits.end - orig.b) / cos;
            limits.b = Math.max(limits.b, orig.b + y);
          }
        }
        function buildPointLabelItems(scale, labelSizes, padding) {
          const items = [];
          const valueCount = scale._pointLabels.length;
          const opts = scale.options;
          const extra = getTickBackdropHeight(opts) / 2;
          const outerDistance = scale.drawingArea;
          const additionalAngle = opts.pointLabels.centerPointLabels ? PI / valueCount : 0;
          for (let i = 0; i < valueCount; i++) {
            const pointLabelPosition = scale.getPointPosition(i, outerDistance + extra + padding[i], additionalAngle);
            const angle = Math.round(toDegrees(_normalizeAngle(pointLabelPosition.angle + HALF_PI)));
            const size = labelSizes[i];
            const y = yForAngle(pointLabelPosition.y, size.h, angle);
            const textAlign = getTextAlignForAngle(angle);
            const left = leftForTextAlign(pointLabelPosition.x, size.w, textAlign);
            items.push({
              x: pointLabelPosition.x,
              y,
              textAlign,
              left,
              top: y,
              right: left + size.w,
              bottom: y + size.h
            });
          }
          return items;
        }
        function getTextAlignForAngle(angle) {
          if (angle === 0 || angle === 180) {
            return "center";
          } else if (angle < 180) {
            return "left";
          }
          return "right";
        }
        function leftForTextAlign(x, w, align) {
          if (align === "right") {
            x -= w;
          } else if (align === "center") {
            x -= w / 2;
          }
          return x;
        }
        function yForAngle(y, h, angle) {
          if (angle === 90 || angle === 270) {
            y -= h / 2;
          } else if (angle > 270 || angle < 90) {
            y -= h;
          }
          return y;
        }
        function drawPointLabels(scale, labelCount) {
          const { ctx, options: { pointLabels } } = scale;
          for (let i = labelCount - 1; i >= 0; i--) {
            const optsAtIndex = pointLabels.setContext(scale.getPointLabelContext(i));
            const plFont = toFont(optsAtIndex.font);
            const { x, y, textAlign, left, top, right, bottom } = scale._pointLabelItems[i];
            const { backdropColor } = optsAtIndex;
            if (!isNullOrUndef(backdropColor)) {
              const borderRadius = toTRBLCorners(optsAtIndex.borderRadius);
              const padding = toPadding(optsAtIndex.backdropPadding);
              ctx.fillStyle = backdropColor;
              const backdropLeft = left - padding.left;
              const backdropTop = top - padding.top;
              const backdropWidth = right - left + padding.width;
              const backdropHeight = bottom - top + padding.height;
              if (Object.values(borderRadius).some((v) => v !== 0)) {
                ctx.beginPath();
                addRoundedRectPath(ctx, {
                  x: backdropLeft,
                  y: backdropTop,
                  w: backdropWidth,
                  h: backdropHeight,
                  radius: borderRadius
                });
                ctx.fill();
              } else {
                ctx.fillRect(backdropLeft, backdropTop, backdropWidth, backdropHeight);
              }
            }
            renderText(
              ctx,
              scale._pointLabels[i],
              x,
              y + plFont.lineHeight / 2,
              plFont,
              {
                color: optsAtIndex.color,
                textAlign,
                textBaseline: "middle"
              }
            );
          }
        }
        function pathRadiusLine(scale, radius, circular, labelCount) {
          const { ctx } = scale;
          if (circular) {
            ctx.arc(scale.xCenter, scale.yCenter, radius, 0, TAU);
          } else {
            let pointPosition = scale.getPointPosition(0, radius);
            ctx.moveTo(pointPosition.x, pointPosition.y);
            for (let i = 1; i < labelCount; i++) {
              pointPosition = scale.getPointPosition(i, radius);
              ctx.lineTo(pointPosition.x, pointPosition.y);
            }
          }
        }
        function drawRadiusLine(scale, gridLineOpts, radius, labelCount) {
          const ctx = scale.ctx;
          const circular = gridLineOpts.circular;
          const { color: color2, lineWidth } = gridLineOpts;
          if (!circular && !labelCount || !color2 || !lineWidth || radius < 0) {
            return;
          }
          ctx.save();
          ctx.strokeStyle = color2;
          ctx.lineWidth = lineWidth;
          ctx.setLineDash(gridLineOpts.borderDash);
          ctx.lineDashOffset = gridLineOpts.borderDashOffset;
          ctx.beginPath();
          pathRadiusLine(scale, radius, circular, labelCount);
          ctx.closePath();
          ctx.stroke();
          ctx.restore();
        }
        function createPointLabelContext(parent, index2, label) {
          return createContext(parent, {
            label,
            index: index2,
            type: "pointLabel"
          });
        }
        class RadialLinearScale extends LinearScaleBase {
          constructor(cfg) {
            super(cfg);
            this.xCenter = void 0;
            this.yCenter = void 0;
            this.drawingArea = void 0;
            this._pointLabels = [];
            this._pointLabelItems = [];
          }
          setDimensions() {
            const padding = this._padding = toPadding(getTickBackdropHeight(this.options) / 2);
            const w = this.width = this.maxWidth - padding.width;
            const h = this.height = this.maxHeight - padding.height;
            this.xCenter = Math.floor(this.left + w / 2 + padding.left);
            this.yCenter = Math.floor(this.top + h / 2 + padding.top);
            this.drawingArea = Math.floor(Math.min(w, h) / 2);
          }
          determineDataLimits() {
            const { min, max } = this.getMinMax(false);
            this.min = isNumberFinite(min) && !isNaN(min) ? min : 0;
            this.max = isNumberFinite(max) && !isNaN(max) ? max : 0;
            this.handleTickRangeOptions();
          }
          computeTickLimit() {
            return Math.ceil(this.drawingArea / getTickBackdropHeight(this.options));
          }
          generateTickLabels(ticks) {
            LinearScaleBase.prototype.generateTickLabels.call(this, ticks);
            this._pointLabels = this.getLabels().map((value, index2) => {
              const label = callback(this.options.pointLabels.callback, [value, index2], this);
              return label || label === 0 ? label : "";
            }).filter((v, i) => this.chart.getDataVisibility(i));
          }
          fit() {
            const opts = this.options;
            if (opts.display && opts.pointLabels.display) {
              fitWithPointLabels(this);
            } else {
              this.setCenterPoint(0, 0, 0, 0);
            }
          }
          setCenterPoint(leftMovement, rightMovement, topMovement, bottomMovement) {
            this.xCenter += Math.floor((leftMovement - rightMovement) / 2);
            this.yCenter += Math.floor((topMovement - bottomMovement) / 2);
            this.drawingArea -= Math.min(this.drawingArea / 2, Math.max(leftMovement, rightMovement, topMovement, bottomMovement));
          }
          getIndexAngle(index2) {
            const angleMultiplier = TAU / (this._pointLabels.length || 1);
            const startAngle = this.options.startAngle || 0;
            return _normalizeAngle(index2 * angleMultiplier + toRadians(startAngle));
          }
          getDistanceFromCenterForValue(value) {
            if (isNullOrUndef(value)) {
              return NaN;
            }
            const scalingFactor = this.drawingArea / (this.max - this.min);
            if (this.options.reverse) {
              return (this.max - value) * scalingFactor;
            }
            return (value - this.min) * scalingFactor;
          }
          getValueForDistanceFromCenter(distance) {
            if (isNullOrUndef(distance)) {
              return NaN;
            }
            const scaledDistance = distance / (this.drawingArea / (this.max - this.min));
            return this.options.reverse ? this.max - scaledDistance : this.min + scaledDistance;
          }
          getPointLabelContext(index2) {
            const pointLabels = this._pointLabels || [];
            if (index2 >= 0 && index2 < pointLabels.length) {
              const pointLabel = pointLabels[index2];
              return createPointLabelContext(this.getContext(), index2, pointLabel);
            }
          }
          getPointPosition(index2, distanceFromCenter, additionalAngle = 0) {
            const angle = this.getIndexAngle(index2) - HALF_PI + additionalAngle;
            return {
              x: Math.cos(angle) * distanceFromCenter + this.xCenter,
              y: Math.sin(angle) * distanceFromCenter + this.yCenter,
              angle
            };
          }
          getPointPositionForValue(index2, value) {
            return this.getPointPosition(index2, this.getDistanceFromCenterForValue(value));
          }
          getBasePosition(index2) {
            return this.getPointPositionForValue(index2 || 0, this.getBaseValue());
          }
          getPointLabelPosition(index2) {
            const { left, top, right, bottom } = this._pointLabelItems[index2];
            return {
              left,
              top,
              right,
              bottom
            };
          }
          drawBackground() {
            const { backgroundColor, grid: { circular } } = this.options;
            if (backgroundColor) {
              const ctx = this.ctx;
              ctx.save();
              ctx.beginPath();
              pathRadiusLine(this, this.getDistanceFromCenterForValue(this._endValue), circular, this._pointLabels.length);
              ctx.closePath();
              ctx.fillStyle = backgroundColor;
              ctx.fill();
              ctx.restore();
            }
          }
          drawGrid() {
            const ctx = this.ctx;
            const opts = this.options;
            const { angleLines, grid } = opts;
            const labelCount = this._pointLabels.length;
            let i, offset, position;
            if (opts.pointLabels.display) {
              drawPointLabels(this, labelCount);
            }
            if (grid.display) {
              this.ticks.forEach((tick, index2) => {
                if (index2 !== 0) {
                  offset = this.getDistanceFromCenterForValue(tick.value);
                  const optsAtIndex = grid.setContext(this.getContext(index2 - 1));
                  drawRadiusLine(this, optsAtIndex, offset, labelCount);
                }
              });
            }
            if (angleLines.display) {
              ctx.save();
              for (i = labelCount - 1; i >= 0; i--) {
                const optsAtIndex = angleLines.setContext(this.getPointLabelContext(i));
                const { color: color2, lineWidth } = optsAtIndex;
                if (!lineWidth || !color2) {
                  continue;
                }
                ctx.lineWidth = lineWidth;
                ctx.strokeStyle = color2;
                ctx.setLineDash(optsAtIndex.borderDash);
                ctx.lineDashOffset = optsAtIndex.borderDashOffset;
                offset = this.getDistanceFromCenterForValue(opts.ticks.reverse ? this.min : this.max);
                position = this.getPointPosition(i, offset);
                ctx.beginPath();
                ctx.moveTo(this.xCenter, this.yCenter);
                ctx.lineTo(position.x, position.y);
                ctx.stroke();
              }
              ctx.restore();
            }
          }
          drawBorder() {
          }
          drawLabels() {
            const ctx = this.ctx;
            const opts = this.options;
            const tickOpts = opts.ticks;
            if (!tickOpts.display) {
              return;
            }
            const startAngle = this.getIndexAngle(0);
            let offset, width;
            ctx.save();
            ctx.translate(this.xCenter, this.yCenter);
            ctx.rotate(startAngle);
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            this.ticks.forEach((tick, index2) => {
              if (index2 === 0 && !opts.reverse) {
                return;
              }
              const optsAtIndex = tickOpts.setContext(this.getContext(index2));
              const tickFont = toFont(optsAtIndex.font);
              offset = this.getDistanceFromCenterForValue(this.ticks[index2].value);
              if (optsAtIndex.showLabelBackdrop) {
                ctx.font = tickFont.string;
                width = ctx.measureText(tick.label).width;
                ctx.fillStyle = optsAtIndex.backdropColor;
                const padding = toPadding(optsAtIndex.backdropPadding);
                ctx.fillRect(
                  -width / 2 - padding.left,
                  -offset - tickFont.size / 2 - padding.top,
                  width + padding.width,
                  tickFont.size + padding.height
                );
              }
              renderText(ctx, tick.label, 0, -offset, tickFont, {
                color: optsAtIndex.color
              });
            });
            ctx.restore();
          }
          drawTitle() {
          }
        }
        RadialLinearScale.id = "radialLinear";
        RadialLinearScale.defaults = {
          display: true,
          animate: true,
          position: "chartArea",
          angleLines: {
            display: true,
            lineWidth: 1,
            borderDash: [],
            borderDashOffset: 0
          },
          grid: {
            circular: false
          },
          startAngle: 0,
          ticks: {
            showLabelBackdrop: true,
            callback: Ticks.formatters.numeric
          },
          pointLabels: {
            backdropColor: void 0,
            backdropPadding: 2,
            display: true,
            font: {
              size: 10
            },
            callback(label) {
              return label;
            },
            padding: 5,
            centerPointLabels: false
          }
        };
        RadialLinearScale.defaultRoutes = {
          "angleLines.color": "borderColor",
          "pointLabels.color": "color",
          "ticks.color": "color"
        };
        RadialLinearScale.descriptors = {
          angleLines: {
            _fallback: "grid"
          }
        };
        const INTERVALS = {
          millisecond: { common: true, size: 1, steps: 1e3 },
          second: { common: true, size: 1e3, steps: 60 },
          minute: { common: true, size: 6e4, steps: 60 },
          hour: { common: true, size: 36e5, steps: 24 },
          day: { common: true, size: 864e5, steps: 30 },
          week: { common: false, size: 6048e5, steps: 4 },
          month: { common: true, size: 2628e6, steps: 12 },
          quarter: { common: false, size: 7884e6, steps: 4 },
          year: { common: true, size: 3154e7 }
        };
        const UNITS = Object.keys(INTERVALS);
        function sorter(a, b) {
          return a - b;
        }
        function parse(scale, input) {
          if (isNullOrUndef(input)) {
            return null;
          }
          const adapter = scale._adapter;
          const { parser, round: round2, isoWeekday } = scale._parseOpts;
          let value = input;
          if (typeof parser === "function") {
            value = parser(value);
          }
          if (!isNumberFinite(value)) {
            value = typeof parser === "string" ? adapter.parse(value, parser) : adapter.parse(value);
          }
          if (value === null) {
            return null;
          }
          if (round2) {
            value = round2 === "week" && (isNumber(isoWeekday) || isoWeekday === true) ? adapter.startOf(value, "isoWeek", isoWeekday) : adapter.startOf(value, round2);
          }
          return +value;
        }
        function determineUnitForAutoTicks(minUnit, min, max, capacity) {
          const ilen = UNITS.length;
          for (let i = UNITS.indexOf(minUnit); i < ilen - 1; ++i) {
            const interval = INTERVALS[UNITS[i]];
            const factor = interval.steps ? interval.steps : Number.MAX_SAFE_INTEGER;
            if (interval.common && Math.ceil((max - min) / (factor * interval.size)) <= capacity) {
              return UNITS[i];
            }
          }
          return UNITS[ilen - 1];
        }
        function determineUnitForFormatting(scale, numTicks, minUnit, min, max) {
          for (let i = UNITS.length - 1; i >= UNITS.indexOf(minUnit); i--) {
            const unit = UNITS[i];
            if (INTERVALS[unit].common && scale._adapter.diff(max, min, unit) >= numTicks - 1) {
              return unit;
            }
          }
          return UNITS[minUnit ? UNITS.indexOf(minUnit) : 0];
        }
        function determineMajorUnit(unit) {
          for (let i = UNITS.indexOf(unit) + 1, ilen = UNITS.length; i < ilen; ++i) {
            if (INTERVALS[UNITS[i]].common) {
              return UNITS[i];
            }
          }
        }
        function addTick(ticks, time, timestamps) {
          if (!timestamps) {
            ticks[time] = true;
          } else if (timestamps.length) {
            const { lo, hi } = _lookup(timestamps, time);
            const timestamp = timestamps[lo] >= time ? timestamps[lo] : timestamps[hi];
            ticks[timestamp] = true;
          }
        }
        function setMajorTicks(scale, ticks, map2, majorUnit) {
          const adapter = scale._adapter;
          const first = +adapter.startOf(ticks[0].value, majorUnit);
          const last = ticks[ticks.length - 1].value;
          let major, index2;
          for (major = first; major <= last; major = +adapter.add(major, 1, majorUnit)) {
            index2 = map2[major];
            if (index2 >= 0) {
              ticks[index2].major = true;
            }
          }
          return ticks;
        }
        function ticksFromTimestamps(scale, values, majorUnit) {
          const ticks = [];
          const map2 = {};
          const ilen = values.length;
          let i, value;
          for (i = 0; i < ilen; ++i) {
            value = values[i];
            map2[value] = i;
            ticks.push({
              value,
              major: false
            });
          }
          return ilen === 0 || !majorUnit ? ticks : setMajorTicks(scale, ticks, map2, majorUnit);
        }
        class TimeScale extends Scale {
          constructor(props) {
            super(props);
            this._cache = {
              data: [],
              labels: [],
              all: []
            };
            this._unit = "day";
            this._majorUnit = void 0;
            this._offsets = {};
            this._normalized = false;
            this._parseOpts = void 0;
          }
          init(scaleOpts, opts) {
            const time = scaleOpts.time || (scaleOpts.time = {});
            const adapter = this._adapter = new _adapters._date(scaleOpts.adapters.date);
            adapter.init(opts);
            mergeIf(time.displayFormats, adapter.formats());
            this._parseOpts = {
              parser: time.parser,
              round: time.round,
              isoWeekday: time.isoWeekday
            };
            super.init(scaleOpts);
            this._normalized = opts.normalized;
          }
          parse(raw, index2) {
            if (raw === void 0) {
              return null;
            }
            return parse(this, raw);
          }
          beforeLayout() {
            super.beforeLayout();
            this._cache = {
              data: [],
              labels: [],
              all: []
            };
          }
          determineDataLimits() {
            const options = this.options;
            const adapter = this._adapter;
            const unit = options.time.unit || "day";
            let { min, max, minDefined, maxDefined } = this.getUserBounds();
            function _applyBounds(bounds) {
              if (!minDefined && !isNaN(bounds.min)) {
                min = Math.min(min, bounds.min);
              }
              if (!maxDefined && !isNaN(bounds.max)) {
                max = Math.max(max, bounds.max);
              }
            }
            if (!minDefined || !maxDefined) {
              _applyBounds(this._getLabelBounds());
              if (options.bounds !== "ticks" || options.ticks.source !== "labels") {
                _applyBounds(this.getMinMax(false));
              }
            }
            min = isNumberFinite(min) && !isNaN(min) ? min : +adapter.startOf(Date.now(), unit);
            max = isNumberFinite(max) && !isNaN(max) ? max : +adapter.endOf(Date.now(), unit) + 1;
            this.min = Math.min(min, max - 1);
            this.max = Math.max(min + 1, max);
          }
          _getLabelBounds() {
            const arr = this.getLabelTimestamps();
            let min = Number.POSITIVE_INFINITY;
            let max = Number.NEGATIVE_INFINITY;
            if (arr.length) {
              min = arr[0];
              max = arr[arr.length - 1];
            }
            return { min, max };
          }
          buildTicks() {
            const options = this.options;
            const timeOpts = options.time;
            const tickOpts = options.ticks;
            const timestamps = tickOpts.source === "labels" ? this.getLabelTimestamps() : this._generate();
            if (options.bounds === "ticks" && timestamps.length) {
              this.min = this._userMin || timestamps[0];
              this.max = this._userMax || timestamps[timestamps.length - 1];
            }
            const min = this.min;
            const max = this.max;
            const ticks = _filterBetween(timestamps, min, max);
            this._unit = timeOpts.unit || (tickOpts.autoSkip ? determineUnitForAutoTicks(timeOpts.minUnit, this.min, this.max, this._getLabelCapacity(min)) : determineUnitForFormatting(this, ticks.length, timeOpts.minUnit, this.min, this.max));
            this._majorUnit = !tickOpts.major.enabled || this._unit === "year" ? void 0 : determineMajorUnit(this._unit);
            this.initOffsets(timestamps);
            if (options.reverse) {
              ticks.reverse();
            }
            return ticksFromTimestamps(this, ticks, this._majorUnit);
          }
          afterAutoSkip() {
            if (this.options.offsetAfterAutoskip) {
              this.initOffsets(this.ticks.map((tick) => +tick.value));
            }
          }
          initOffsets(timestamps) {
            let start = 0;
            let end = 0;
            let first, last;
            if (this.options.offset && timestamps.length) {
              first = this.getDecimalForValue(timestamps[0]);
              if (timestamps.length === 1) {
                start = 1 - first;
              } else {
                start = (this.getDecimalForValue(timestamps[1]) - first) / 2;
              }
              last = this.getDecimalForValue(timestamps[timestamps.length - 1]);
              if (timestamps.length === 1) {
                end = last;
              } else {
                end = (last - this.getDecimalForValue(timestamps[timestamps.length - 2])) / 2;
              }
            }
            const limit = timestamps.length < 3 ? 0.5 : 0.25;
            start = _limitValue(start, 0, limit);
            end = _limitValue(end, 0, limit);
            this._offsets = { start, end, factor: 1 / (start + 1 + end) };
          }
          _generate() {
            const adapter = this._adapter;
            const min = this.min;
            const max = this.max;
            const options = this.options;
            const timeOpts = options.time;
            const minor = timeOpts.unit || determineUnitForAutoTicks(timeOpts.minUnit, min, max, this._getLabelCapacity(min));
            const stepSize = valueOrDefault(timeOpts.stepSize, 1);
            const weekday = minor === "week" ? timeOpts.isoWeekday : false;
            const hasWeekday = isNumber(weekday) || weekday === true;
            const ticks = {};
            let first = min;
            let time, count;
            if (hasWeekday) {
              first = +adapter.startOf(first, "isoWeek", weekday);
            }
            first = +adapter.startOf(first, hasWeekday ? "day" : minor);
            if (adapter.diff(max, min, minor) > 1e5 * stepSize) {
              throw new Error(min + " and " + max + " are too far apart with stepSize of " + stepSize + " " + minor);
            }
            const timestamps = options.ticks.source === "data" && this.getDataTimestamps();
            for (time = first, count = 0; time < max; time = +adapter.add(time, stepSize, minor), count++) {
              addTick(ticks, time, timestamps);
            }
            if (time === max || options.bounds === "ticks" || count === 1) {
              addTick(ticks, time, timestamps);
            }
            return Object.keys(ticks).sort((a, b) => a - b).map((x) => +x);
          }
          getLabelForValue(value) {
            const adapter = this._adapter;
            const timeOpts = this.options.time;
            if (timeOpts.tooltipFormat) {
              return adapter.format(value, timeOpts.tooltipFormat);
            }
            return adapter.format(value, timeOpts.displayFormats.datetime);
          }
          _tickFormatFunction(time, index2, ticks, format) {
            const options = this.options;
            const formats = options.time.displayFormats;
            const unit = this._unit;
            const majorUnit = this._majorUnit;
            const minorFormat = unit && formats[unit];
            const majorFormat = majorUnit && formats[majorUnit];
            const tick = ticks[index2];
            const major = majorUnit && majorFormat && tick && tick.major;
            const label = this._adapter.format(time, format || (major ? majorFormat : minorFormat));
            const formatter = options.ticks.callback;
            return formatter ? callback(formatter, [label, index2, ticks], this) : label;
          }
          generateTickLabels(ticks) {
            let i, ilen, tick;
            for (i = 0, ilen = ticks.length; i < ilen; ++i) {
              tick = ticks[i];
              tick.label = this._tickFormatFunction(tick.value, i, ticks);
            }
          }
          getDecimalForValue(value) {
            return value === null ? NaN : (value - this.min) / (this.max - this.min);
          }
          getPixelForValue(value) {
            const offsets = this._offsets;
            const pos = this.getDecimalForValue(value);
            return this.getPixelForDecimal((offsets.start + pos) * offsets.factor);
          }
          getValueForPixel(pixel) {
            const offsets = this._offsets;
            const pos = this.getDecimalForPixel(pixel) / offsets.factor - offsets.end;
            return this.min + pos * (this.max - this.min);
          }
          _getLabelSize(label) {
            const ticksOpts = this.options.ticks;
            const tickLabelWidth = this.ctx.measureText(label).width;
            const angle = toRadians(this.isHorizontal() ? ticksOpts.maxRotation : ticksOpts.minRotation);
            const cosRotation = Math.cos(angle);
            const sinRotation = Math.sin(angle);
            const tickFontSize = this._resolveTickFontOptions(0).size;
            return {
              w: tickLabelWidth * cosRotation + tickFontSize * sinRotation,
              h: tickLabelWidth * sinRotation + tickFontSize * cosRotation
            };
          }
          _getLabelCapacity(exampleTime) {
            const timeOpts = this.options.time;
            const displayFormats = timeOpts.displayFormats;
            const format = displayFormats[timeOpts.unit] || displayFormats.millisecond;
            const exampleLabel = this._tickFormatFunction(exampleTime, 0, ticksFromTimestamps(this, [exampleTime], this._majorUnit), format);
            const size = this._getLabelSize(exampleLabel);
            const capacity = Math.floor(this.isHorizontal() ? this.width / size.w : this.height / size.h) - 1;
            return capacity > 0 ? capacity : 1;
          }
          getDataTimestamps() {
            let timestamps = this._cache.data || [];
            let i, ilen;
            if (timestamps.length) {
              return timestamps;
            }
            const metas = this.getMatchingVisibleMetas();
            if (this._normalized && metas.length) {
              return this._cache.data = metas[0].controller.getAllParsedValues(this);
            }
            for (i = 0, ilen = metas.length; i < ilen; ++i) {
              timestamps = timestamps.concat(metas[i].controller.getAllParsedValues(this));
            }
            return this._cache.data = this.normalize(timestamps);
          }
          getLabelTimestamps() {
            const timestamps = this._cache.labels || [];
            let i, ilen;
            if (timestamps.length) {
              return timestamps;
            }
            const labels = this.getLabels();
            for (i = 0, ilen = labels.length; i < ilen; ++i) {
              timestamps.push(parse(this, labels[i]));
            }
            return this._cache.labels = this._normalized ? timestamps : this.normalize(timestamps);
          }
          normalize(values) {
            return _arrayUnique(values.sort(sorter));
          }
        }
        TimeScale.id = "time";
        TimeScale.defaults = {
          bounds: "data",
          adapters: {},
          time: {
            parser: false,
            unit: false,
            round: false,
            isoWeekday: false,
            minUnit: "millisecond",
            displayFormats: {}
          },
          ticks: {
            source: "auto",
            major: {
              enabled: false
            }
          }
        };
        function interpolate2(table, val, reverse) {
          let lo = 0;
          let hi = table.length - 1;
          let prevSource, nextSource, prevTarget, nextTarget;
          if (reverse) {
            if (val >= table[lo].pos && val <= table[hi].pos) {
              ({ lo, hi } = _lookupByKey(table, "pos", val));
            }
            ({ pos: prevSource, time: prevTarget } = table[lo]);
            ({ pos: nextSource, time: nextTarget } = table[hi]);
          } else {
            if (val >= table[lo].time && val <= table[hi].time) {
              ({ lo, hi } = _lookupByKey(table, "time", val));
            }
            ({ time: prevSource, pos: prevTarget } = table[lo]);
            ({ time: nextSource, pos: nextTarget } = table[hi]);
          }
          const span = nextSource - prevSource;
          return span ? prevTarget + (nextTarget - prevTarget) * (val - prevSource) / span : prevTarget;
        }
        class TimeSeriesScale extends TimeScale {
          constructor(props) {
            super(props);
            this._table = [];
            this._minPos = void 0;
            this._tableRange = void 0;
          }
          initOffsets() {
            const timestamps = this._getTimestampsForTable();
            const table = this._table = this.buildLookupTable(timestamps);
            this._minPos = interpolate2(table, this.min);
            this._tableRange = interpolate2(table, this.max) - this._minPos;
            super.initOffsets(timestamps);
          }
          buildLookupTable(timestamps) {
            const { min, max } = this;
            const items = [];
            const table = [];
            let i, ilen, prev, curr, next;
            for (i = 0, ilen = timestamps.length; i < ilen; ++i) {
              curr = timestamps[i];
              if (curr >= min && curr <= max) {
                items.push(curr);
              }
            }
            if (items.length < 2) {
              return [
                { time: min, pos: 0 },
                { time: max, pos: 1 }
              ];
            }
            for (i = 0, ilen = items.length; i < ilen; ++i) {
              next = items[i + 1];
              prev = items[i - 1];
              curr = items[i];
              if (Math.round((next + prev) / 2) !== curr) {
                table.push({ time: curr, pos: i / (ilen - 1) });
              }
            }
            return table;
          }
          _getTimestampsForTable() {
            let timestamps = this._cache.all || [];
            if (timestamps.length) {
              return timestamps;
            }
            const data = this.getDataTimestamps();
            const label = this.getLabelTimestamps();
            if (data.length && label.length) {
              timestamps = this.normalize(data.concat(label));
            } else {
              timestamps = data.length ? data : label;
            }
            timestamps = this._cache.all = timestamps;
            return timestamps;
          }
          getDecimalForValue(value) {
            return (interpolate2(this._table, value) - this._minPos) / this._tableRange;
          }
          getValueForPixel(pixel) {
            const offsets = this._offsets;
            const decimal = this.getDecimalForPixel(pixel) / offsets.factor - offsets.end;
            return interpolate2(this._table, decimal * this._tableRange + this._minPos, true);
          }
        }
        TimeSeriesScale.id = "timeseries";
        TimeSeriesScale.defaults = TimeScale.defaults;
        var scales = /* @__PURE__ */ Object.freeze({
          __proto__: null,
          CategoryScale,
          LinearScale,
          LogarithmicScale,
          RadialLinearScale,
          TimeScale,
          TimeSeriesScale
        });
        Chart.register(controllers, scales, elements, plugins);
        Chart.helpers = { ...helpers };
        Chart._adapters = _adapters;
        Chart.Animation = Animation;
        Chart.Animations = Animations;
        Chart.animator = animator;
        Chart.controllers = registry.controllers.items;
        Chart.DatasetController = DatasetController;
        Chart.Element = Element;
        Chart.elements = elements;
        Chart.Interaction = Interaction;
        Chart.layouts = layouts;
        Chart.platforms = platforms;
        Chart.Scale = Scale;
        Chart.Ticks = Ticks;
        Object.assign(Chart, controllers, scales, elements, plugins, platforms);
        Chart.Chart = Chart;
        if (typeof window !== "undefined") {
          window.Chart = Chart;
        }
        return Chart;
      });
    }
  });

  // src/js/index.js
  var require_js = __commonJS({
    "src/js/index.js"(exports) {
      var import_ConsCircles = __toESM(require_ConsCircles());
      var raw = require_raw();
      var Papa = require_papaparse_min();
      var _ = require_lodash();
      var { Chart } = require_chart();
      function getStandardDeviation(array, sample = false) {
        const n = sample ? array.length - 1 : array.length;
        const mean = array.reduce((a, b) => a + b) / n;
        return Math.sqrt(array.map((x) => Math.pow(x - mean, 2)).reduce((a, b) => a + b) / n);
      }
      var totalize_frequencies = (rows, cols = [1, 2, 3, 4, 5, 6, 7, 8, 9]) => {
        const whole_freq = _.countBy(_.flatten(rows), parseInt);
        if (!cols)
          return _.values(whole_freq);
        return cols.map((v) => whole_freq[v] || 0);
      };
      var data = Papa.parse(raw);
      var results = [];
      var SCALE_SIZE = 9;
      data.data.forEach((row) => {
        let freq = _.countBy(row, parseInt);
        let full_freq = Array.from(Array(SCALE_SIZE)).map((v, i) => {
          return freq[i + 1] || 0;
        });
        let max = _.max(_.values(freq));
        let modes = _.keys(freq).filter((k) => freq[k] == max).map(_.toNumber);
        results.push({
          row: row.map(_.toNumber),
          grav: _.mean(modes),
          range: _.keys(freq).length,
          stdDev: getStandardDeviation(row.map(_.toNumber), true),
          full_freq
        });
      });
      console.debug(`Mean Std Deviation : ${_.mean(results.map(({ stdDev }) => stdDev))}`);
      var allRows = results.map(({ row }) => row);
      var allRowsTotal = totalize_frequencies(allRows);
      results = _.shuffle(results);
      results = _.sortBy(results, ["range", "stdDev"]);
      var quartileCutoffs = [
        _.floor(results.length / 4),
        2 * _.floor(results.length / 4),
        3 * _.floor(results.length / 4)
      ];
      var first_quartile = totalize_frequencies(_.slice(allRows, 0, quartileCutoffs[0]));
      var second_quartile = totalize_frequencies(_.slice(allRows, quartileCutoffs[0], quartileCutoffs[1]));
      var third_quartile = totalize_frequencies(_.slice(allRows, quartileCutoffs[1], quartileCutoffs[2]));
      var fourth_quartile = totalize_frequencies(_.slice(allRows, quartileCutoffs[2]));
      var condensed_results = _.chunk(results, 4).map((chunk) => {
        return chunk.map(({ full_freq }) => full_freq);
      });
      var column_totals = (rows) => {
        return rows[0].map((value, column) => {
          return _.sum(rows.map((row) => row[column]));
        });
      };
      condensed_results = condensed_results.map(column_totals);
      var quartile_results = _.chunk(results, _.ceil(results.length / 4)).map((chunk) => {
        return chunk.map(({ full_freq }) => full_freq);
      });
      quartile_results = quartile_results.map(column_totals);
      var midsExtremesNinePoint = (row) => {
        return [row[4], row[5] + row[3], row[6] + row[2], row[7] + row[1], row[8] + row[0]];
      };
      var Bliss2 = require_bliss();
      var pages = [
        () => {
          window.g = new import_ConsCircles.ConsCircles({
            dataIn: {
              "1st Quartile": midsExtremesNinePoint(quartile_results[0]),
              "2nd Quartile": midsExtremesNinePoint(quartile_results[1]),
              "3rd Quartile": midsExtremesNinePoint(quartile_results[2]),
              "4th Quartile": midsExtremesNinePoint(quartile_results[3])
            },
            labels: ["Mid", "6/4", "7/3", "8/2", "9/1"],
            caption: "Scale range",
            colors: ["crimson", "lightpink", "gold", "maroon", "lightsteelblue", "mediumseagreen"],
            showCaption: true,
            extFont: "https://thiscovery-public-assets.s3.eu-west-1.amazonaws.com/fonts/fonts.css",
            fontFamily: `"thisco_Brown", "Brown-Regular", Arial, "Helvetica Neue", Helvetica, sans-serif`,
            nStyle: "all"
          });
          g.init();
        },
        () => {
          const container = $(".cons-circles");
          const canv = $.create("canvas", {
            style: {
              width: "100%",
              height: "70vh"
            }
          });
          container.appendChild(canv);
          canv.width = canv.clientWidth * devicePixelRatio;
          canv.height = canv.clientHeight * devicePixelRatio;
          const ctx = canv.getContext("2d");
          const data2 = {
            datasets: [{
              label: "StdDev v Modal Average",
              data: results.map((item, i) => {
                const x = i;
                return { y: item.stdDev, x: item.grav };
              }),
              borderColor: "crimson",
              fill: false
            }]
          };
          const config = {
            type: "scatter",
            data: data2,
            options: {}
          };
          const chart = new Chart(ctx, config);
        },
        () => {
          const container = $(".cons-circles");
          const canv = $.create("canvas", {
            style: {
              width: "100%",
              height: "70vh"
            }
          });
          container.appendChild(canv);
          canv.width = canv.clientWidth * devicePixelRatio;
          canv.height = canv.clientHeight * devicePixelRatio;
          const ctx = canv.getContext("2d");
          const data2 = {
            datasets: [{
              label: "Nines",
              data: results.map((item, i) => {
                const x = i;
                return { x, y: item.full_freq[8] };
              }),
              borderColor: "blue",
              fill: false,
              tension: 0.1
            }, {
              label: "Eights",
              data: results.map((item, i) => {
                const x = i;
                return { x, y: item.full_freq[7] };
              }),
              borderColor: "gold",
              fill: false,
              tension: 0.1
            }, {
              label: "Sevens",
              data: results.map((item, i) => {
                const x = i;
                return { x, y: item.full_freq[6] };
              }),
              borderColor: "crimson",
              fill: false,
              tension: 0.1
            }, {
              label: "Sixes",
              data: results.map((item, i) => {
                const x = i;
                return { x, y: item.full_freq[5] };
              }),
              borderColor: "seagreen",
              fill: false,
              tension: 0.1
            }]
          };
          console.debug({ nines: data2.datasets[0].data });
          const config = {
            type: "scatter",
            data: data2,
            options: {}
          };
          const chart = new Chart(ctx, config);
        },
        () => {
          const container = $(".cons-circles");
          const canv = $.create("canvas", {
            style: {
              width: "100%",
              height: "70vh"
            }
          });
          container.appendChild(canv);
          canv.width = canv.clientWidth * devicePixelRatio;
          canv.height = canv.clientHeight * devicePixelRatio;
          const ctx = canv.getContext("2d");
          const data2 = {
            datasets: [{
              label: "Extremes",
              data: condensed_results.map((item, i) => ({ x: i, y: item[8] + item[0] + item[4] })),
              borderColor: "blue",
              fill: false,
              tension: 0.1
            }, {
              label: "Eights or Twos",
              data: condensed_results.map((item, i) => ({ x: i, y: item[7] + item[1] })),
              borderColor: "gold",
              fill: false,
              tension: 0.1
            }, {
              label: "Sevens or Threes",
              data: condensed_results.map((item, i) => ({ x: i, y: item[6] + item[2] })),
              borderColor: "crimson",
              fill: false,
              tension: 0.1
            }, {
              label: "Sixes or Fours",
              data: condensed_results.map((item, i) => ({ x: i, y: item[5] + item[3] })),
              borderColor: "seagreen",
              fill: false,
              tension: 0.1
            }]
          };
          console.debug({ nines: data2.datasets[0].data });
          const config = {
            type: "scatter",
            data: data2,
            options: {}
          };
          const chart = new Chart(ctx, config);
        }
      ];
      var pageNo = 0;
      pages[pageNo].call(exports);
      window.document.body.addEventListener("keydown", (evt) => {
        evt.stopPropagation();
        if (evt.code == "ArrowRight") {
          pageNo = pageNo + 1;
          if (pageNo > pages.length - 1)
            pageNo = pages.length - 1;
          $(".cons-circles").innerHTML = "";
          pages[pageNo].call(exports);
        }
        if (evt.code == "ArrowLeft") {
          pageNo = pageNo - 1;
          if (pageNo < 0)
            pageNo = 0;
          $(".cons-circles").innerHTML = "";
          pages[pageNo].call(exports);
        }
      });
    }
  });
  require_js();
})();
/* @license
Papa Parse
v5.3.2
https://github.com/mholt/PapaParse
License: MIT
*/
/*!
 * @kurkle/color v0.2.1
 * https://github.com/kurkle/color#readme
 * (c) 2022 Jukka Kurkela
 * Released under the MIT License
 */
/*!
 * Chart.js v3.9.1
 * https://www.chartjs.org
 * (c) 2022 Chart.js Contributors
 * Released under the MIT License
 */
/**
 * @license
 * Lodash <https://lodash.com/>
 * Copyright OpenJS Foundation and other contributors <https://openjsf.org/>
 * Released under MIT license <https://lodash.com/license>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 */
