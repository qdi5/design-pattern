void (function (root) {
var count = 0;
/**
 * Noop function.
 */
function noop(){}
/**
 * JSONP handler
 *
 * Options:
 *  - param {String} qs parameter (`callback`) // 传递给服务器端的参数，callback
 *  - prefix {String} qs parameter (`__jp`)  //  前端回调的函数的前缀
 *  - name {String} qs parameter (`prefix` + incr) // 前端回调的函数名称，由“prefix + 自增id”组成
 *  - timeout {Number} how long after a timeout error is emitted (`60000`) // 超时时间
 *
 * @param {String} url
 * @param {Object|Function} optional options / callback
 * @param {Function} optional callback
 */

function jsonp(url, opts, fn){
  debugger
  if ('function' == typeof opts) {
    fn = opts;
    opts = {};
  }
  if (!opts) opts = {};

  var prefix = opts.prefix || '__jp';

  // use the callback name that was passed if one was provided.
  // otherwise generate a unique name by incrementing our counter.
  var id = opts.name || (prefix + (count++));

  var param = opts.param || 'callback';
  var timeout = null != opts.timeout ? opts.timeout : 60000;
  var enc = encodeURIComponent;
  var target = document.getElementsByTagName('script')[0] || document.head;
  var script;
  var timer;


  if (timeout) {
    timer = setTimeout(function(){
      cleanup();
      if (fn) fn(new Error('Timeout'));
    }, timeout);
  }

  function cleanup(){
    if (script.parentNode) script.parentNode.removeChild(script);
    window[id] = noop;
    if (timer) clearTimeout(timer);
  }

  function cancel(){
    if (window[id]) {
      cleanup();
    }
  }

  window[id] = function(data){
    cleanup();
    if (fn) fn(null, data);
  };

  // add qs component
  url += (~url.indexOf('?') ? '&' : '?') + param + '=' + enc(id);
  url = url.replace('?&', '?');
  // create script
  script = document.createElement('script');
  script.src = url;
  target.parentNode.insertBefore(script, target);

  return cancel;
}
typeof module !== 'undefined' && module.exports ? module.exports = jsonp : (typeof define === 'function' && define.amd) ? define('jsonp', [], function() {
  return {
    jsonp: jsonp
  }
}) : root.jsonp = jsonp
})(this)
