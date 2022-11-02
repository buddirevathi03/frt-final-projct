// TODO: refactor the code. wrap everything in IIFE
const moeScript = document.currentScript;
let MOE_APP_ID, MOE_ENV, MOE_CLUSTER;
if (moeScript) {
  let srcArr = moeScript.src.split('?');
  srcArr = srcArr[1].split('&');
  srcArr.forEach((k) => {
    if(k.includes('app_id')) {
      MOE_APP_ID = k.split('=')[1] || '';
    } else if(k.includes('env')) {
      MOE_ENV = k.split('=')[1] || '';
    } else if(k.includes('cluster')) {
      MOE_CLUSTER = k.split('=')[1] || '';
    }
  })
}




(function (i, s, o, g, r, a, m, n) {
  i.moengage_object = r;
  t = {};
  q = function (f) {
    return function () {
      (i.moengage_q = i.moengage_q || []).push({
        f: f,
        a: arguments
      })
    }
  };
  f = ['track_event', 'add_user_attribute', 'add_first_name', 'add_last_name', 'add_email', 'add_mobile', 'add_user_name', 'add_gender', 'add_birthday', 'destroy_session', 'add_unique_user_id', 'moe_events', 'call_web_push', 'track', 'location_type_attribute'], h = {
    onsite: ["getData"]
  };
  for (k in f) {
    t[f[k]] = q(f[k])
  }
  a = s.createElement(o);
  m = s.getElementsByTagName(o)[0];
  a.async = 1;
  a.src = g;
  m.parentNode.insertBefore(a, m);
  i.moe = i.moe || function () {
    n = arguments[0];
    return t
  };
  a.onload = function () {
    if (n) {
      i[r] = moe(n)
    }
  }
})(window, document, 'script', 'https://cdn.moengage.com/webpush/moe_webSdk.min.latest.js', 'Moengage')

let moeConfig = {
  app_id: MOE_APP_ID,
  debug_logs: MOE_APP_ID.indexOf('_DEBUG') >= 0 ? 1 : 0, // if _DEBUG is found in app_id, then its test environment
  swPath: '/tools/moengage/sw.js',
  swScope: '/',
  
}

if(MOE_ENV) {
  moeConfig.environment =  MOE_ENV;
  moeConfig.inapp = {};
  moeConfig.inapp.host = 'https://' + MOE_ENV + '/';
}
if(MOE_CLUSTER) {
  moeConfig.cluster = MOE_CLUSTER;
}
Moengage = moe(moeConfig);
