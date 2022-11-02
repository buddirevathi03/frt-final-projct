Target().then(function (value) {  })

async function Target () {

  var clickId = getCookie('rtb-global')

  if (!clickId || clickId === '') clickId = uuidv4()

  var expires = (new Date(Date.now() + 30 * 86400 * 1000)).toUTCString()
  document.cookie = 'rtb-global=' + clickId + '; expires=' + expires + 86400 +
    ';path=/;'

  var data = {
    url: window.location.href,
    referrer: document.referrer,
    unique_id: clickId
  }

  await fetch(
    'https://rtb-global.com/belter/targeting', {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
      },
    })

  return ''
}

function getCookie (cname) {
  var name = cname + '='
  var ca = document.cookie.split(';')
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i]
    while (c.charAt(0) === ' ') {
      c = c.substring(1)
    }
    if (c.indexOf(name) === 0) {
      return c.substring(name.length, c.length)
    }
  }
  return ''
}

function uuidv4 () {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = Math.random() * 16 | 0,
      v = c === 'x' ? r : (r & 0x3 | 0x8)
    return v.toString(16)
  })
}