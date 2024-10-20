let headers = {
  "Content-Type": "application/json",
  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36 Edg/124.0.0.0",
};

headers = {
  'Host': 'koudashijie.com',
  'Connection': 'keep-alive',
  // 'Content-Length': '0',
  'User-Agent': 'Mozilla/5.0 (Linux; Android 7.1.2; Pixel Build/NHG47O) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.117 Mobile Safari/537.36',
  'Viewport-Width': '360',
  'Accept': '*/*',
  'Origin': 'https://koudashijie.com',
  'X-Requested-With': 'mark.via',
  'Sec-Fetch-Site': 'same-origin',
  'Sec-Fetch-Mode': 'cors',
  'Sec-Fetch-Dest': 'empty',
  'Referer': 'https://koudashijie.com',
  'Accept-Encoding': 'gzip, deflate',
  'Accept-Language': 'zh-CN,zh;q=0.9,en-US;q=0.8,en;q=0.7',
  'Cookie': 'codecombat.sess=eyJwYXNzcG9ydCI6e319; codecombat.sess.sig=mRrFN-1Q83MpSFEy9Joi80pGruE; shaTagVal=slug-2024-09-11-08-54-18'
}

var sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay));

Array.prototype.randomItem = function() {
  return this[Math.floor(Math.random() * this.length)]
};

(async function() {

  let authID = null
  let putData = {}
  let randomName = 'Lily' + Math.round(Math.random() * 100000)
  let timestamp = new Date().valueOf()
  let dateISOString = new Date(timestamp).toISOString()

  await fetch(`https://koudashijie.com/auth/whoami?_=${timestamp}`, {
    method: "GET",
    headers: headers
  }).then(async (res) => {
    console.log(res)

    let cookie = res['headers'].get('set-cookie')

    cookie = cookie.replaceAll('path=/; samesite=none; secure; httponly, ', '')
    cookie = cookie.replaceAll('path=/; samesite=none; secure; httponly', '')

    headers["Cookie"] = cookie

    //.split('; path=/; samesite=none; secure; httponly')[0] + '; shaTagVal=slug-2024-09-11-08-54-18'
    //console.log(headers['Cookie'])
    let resJson = await res.json()
    console.log(resJson)
    putData = resJson
    authID = resJson['_id']
  })

  // await sleep(5000)

  Object.assign(putData, {
    "activity": {
      "visit-codecombat": {
        "first": dateISOString,
        "count": 1,
        "last": dateISOString
      }
    },
    "referrer": "https://koudashijie.com/students",
    "emails": {
      "generalNews": {
        "enabled": false
      }
    },
    "firstName": randomName,
    "features": {
      "isNewDashboardActive": false
    }
  });

  console.log(authID, headers)

  await fetch(`https://koudashijie.com/db/user/${authID}/extra-provisions`, {
    method: 'PUT',
    headers: headers,
  }).then(async (res) => {
    console.log(res)
    //headers["Cookie"] = res['headers'].get('set-cookie')
    //console.log(headers['Cookie'])
    let resJson = await res.json()

    // console.log(resJson)
  })

  let sendBody = {
    "name": randomName + "",
    "password": "1379q123wertyuiop"
  }
  
  console.log(sendBody)
  sendBody = JSON.stringify(sendBody)
  // headers['Content-Length'] = sendBody.length
  headers['Content-Type'] = 'application/json'

  await fetch(`https://koudashijie.com/db/user/${authID}/signup-with-password`, {
    method: "POST",
    body: sendBody,
    headers: headers,
    //"credentials": "include"
  }).then(async (res) => {
    console.log(res)

    let resJson = await res.text()
    console.log(resJson)
  })
  
  headers['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8'
  
  await fetch(`https://koudashijie.com/db/classroom/~/members`, {
    method: "POST",
    body: 'code=FoodPlayWater',
    headers: headers,
    //"credentials": "include"
  }).then(async (res) => {
    console.log(res)

    let resJson = await res.text()
    console.log(resJson)
  })
  
  console.log('Finished with ' + sendBody)
})()
