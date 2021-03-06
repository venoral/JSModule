var SubCookieUtil = {
  /**
   * [get description]
   * @param  {[string]} name  [父cookie名称]
   * @param  {[string]} subName [子cookie名称]
   * @return {[type]}         [子cookie值]
   */
  get : function (name, subName){
    var subCookies = this.getAll(name);
    if(subCookies){
      return subCookies[subName];
    }
    return null;
  },
  /**
   * [getAll description]
   * @param  {[string]} name [父cookie名称]
   * @return {[object]}      [子cookie键值对对象]
   */
  getAll : function (name) {
    var cookie = document.cookie;
    var cookieName;
        cookieName = cookie.indexOf(name) != 0 ? ' '+ encodeURIComponent(name) + '=' : encodeURIComponent(name) + '=' ;
    var cookieStart = cookie.indexOf(cookieName),
        cookieValue = null,
        cookieEnd, subCookies, i ,len, parts, result = {};
    if(cookieStart > -1){
      cookieEnd = cookie.indexOf(';', cookieStart);
      if(cookieEnd == -1){
        cookieEnd = cookie.length;
      }
      cookieValue = cookie.substring(cookieStart + cookieName.length, cookieEnd);
      if(cookieValue.length > 0){
        subCookies = cookieValue.split('&');
        for(i=0, len =subCookies.length; i<len; i++){
          parts = subCookies[i].split('=');
          result[decodeURIComponent(parts[0])] = decodeURIComponent(parts[1]);
        }
        return result;
      }
    }
    return null;
  },
  /**
   * [set description]
   * @param {[string]} name  [父cookie名称]
   * @param {[string]} subName [子cookie名称]
   * @param {[string]} value [子cookie值]
   * @param {[date]} expires [失效时间]
   * @param {[string]} path  [指定域中路径]
   * @param {[string]} domain  [指定域]
   * @param {[boolean]} secure [安全标志]
   */
  set : function (name, subName, value, expires, path, domain, secure){
    var subcookies = this.getAll(name) || {};
    subcookies[subName] = value;
    this.setAll(name, subcookies, expires, path, domain, secure);
  },
  /**
   * [setAll description]
   * @param {[object]} subcookies [包含所有子cookie对象]
   */
  setAll : function (name, subcookies, expires, path, domain, secure){
    /*
    只适用于在浏览器通过document.cookie设置的name,
    而不能清除服务端返回的document.cookie，可能是因为服务端做了限制
    */
    var cookieText = encodeURIComponent(name) + '=',
        subcookiePart = new Array(), subName;

    for(subName in subcookies){
      if(subName.length>0 && subcookies.hasOwnProperty(subName)){
        subcookiePart.push(encodeURIComponent(subName) + '=' + encodeURIComponent(subcookies[subName]));
      }
    }

    if(subcookiePart.length > 0){

      cookieText += subcookiePart.join('&');
      if(expires instanceof Date){
        cookieText += '; expires=' + expires.toGMTString();
      }
      if(path){
        cookieText += '; path=' + path;
      }
      if(domain){
        cookieText += '; domain=' + domain;
      }
      if(secure){
        cookieText += '; secure';
      }
    }else{
      cookieText += '; expires=' + (new Date(0)).toGMTString();
    }

    document.cookie = cookieText;
  },
  /**
   * [删除某个子cookie]
   */
  unset : function (name, subName, path, domain, secure){
    var subcookies = this.getAll(name);
    if(subcookies){
      delete subcookies[subName];
      this.setAll(name, subcookies, path, domain, secure);
    }
  },
  /**
   * [删除父cookie]
   */
  unsetAll : function (name, path, domain, secure){
    this.setAll(name, null, new Date(0), path, domain, secure);
  }
}
