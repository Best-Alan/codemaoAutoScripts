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
var URITool = URIToolFactory()
// URITool = {}
// console.log(URITool)

Array.prototype.randomItem = function() {
  return this[Math.floor(Math.random() * this.length)]
};

main()

async function main() {
  // console.log(await createAccountCodecombat('chineseRandomName'))
  for (let count = 0; count < 200; count++) {
    console.log(await fakeSimulate())
  }
  //console.log(JSON.stringify(createdNameList, null, 2))
}

async function fakeSimulate() {

  let authID = null
  let putData = {}
  let randomSeed = Math.floor(Math.random() * 10000000000)
  let timestamp = new Date().valueOf()
  let dateISOString = new Date(timestamp).toISOString()

  let sendData = {
    'simulator[type]': 'browser',
    'simulator[version]': 4,
    'simulator[info][desktop]': 'true',
    'simulator[info][name]': 'chrome',
    'simulator[info][platform]': 'win',
    'simulator[info][version]': '86',
    background: 'false',
    levelID: 'wakka-maul',
    leagueID: '670f2a39d35085f6e5369560'
  }

  let twoGames;

  // let twoGames;
  // console.log(URITool.fromJSON(sendData))

  headers['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8'
  await fetch(`https://koudashijie.com/queue/scoring/getTwoGames`, {
    method: "POST",
    headers: headers,
    body: URITool.fromJSON(sendData)
  }).then(async (res) => {
    if (!res.ok) {
      throw (await res.text())
      return
    }
    twoGames = await res.json()
  })

  // console.log(twoGames)

  let sessions = twoGames["sessions"]

  Object.assign(sendData, {
    "originalSessionID": sessions[0]["sessionID"],
    "originalSessionRank": (sessions[0]["totalScore"] > sessions[1]["totalScore"]) ? 1 : 0, // 0大于1
    "sessions[0][sessionID]": sessions[0]["sessionID"],
    "sessions[0][submitDate]": sessions[0]["submitDate"],
    "sessions[0][creator]": sessions[0]["creator"],
    "sessions[0][name]": sessions[0]["creatorName"],
    "sessions[0][totalScore]": sessions[0]["totalScore"],
    "sessions[0][metrics][rank]": 0,
    "sessions[1][sessionID]": sessions[1]["sessionID"],
    "sessions[1][submitDate]": sessions[1]["submitDate"],
    "sessions[1][creator]": sessions[1]["creator"],
    "sessions[1][name]": sessions[1]["creatorName"],
    "sessions[1][totalScore]": sessions[1]["totalScore"],
    "sessions[1][metrics][rank]": 0,
    "randomSeed": randomSeed,
    "originalSessionTeam": sessions[0]["team"]
  })
  
  if(Math.random()>0.2){
    [sendData['sessions[0][team]']]
  }

  // console.log(sendData)

  if (sendData['sessions[0][name]'] == 'cb1024') {
    sendData['sessions[0][metrics][rank]'] = 1
  } else if (sendData['sessions[1][name]'] == 'cb1024') {
    sendData['sessions[1][metrics][rank]'] = 1
  } else if (Math.random() > 0.5) {
    let wellDone = ['李锦烨', '戴闻昕', 'chenxiang16']
    if (wellDone.includes(sendData['sessions[0][name]'])) {
      sendData['sessions[0][metrics][rank]'] = 1
    }
  }

  /*
  补全未知数据 ↑↑↑
  metrics rank
  sessionID
  ...
  （可能跟输赢有关系，等待网络）

  对了，劫持eval也许可以反编译代码，
  或者会不会是
  TextDecoder
  == += 运算符
  substring
  String.prototype.charCodeAt()
  问kimi 把'e502' 转换成'\uE502'不用eval

  proxyPin 收藏的请求 扣哒世界比赛赢别人，
  改个请求头里的Referer试试

  ↑↑↑ 得从模拟下手，不管用
  */

  await fetch(`https://koudashijie.com/queue/scoring/recordTwoGames`, {
    method: "PUT",
    headers: headers,
    body: URITool.fromJSON(sendData)
  }).then(async (res) => {
    if (!res.ok) {
      throw (await res.text())
      return
    }
    // console.log(await res.json())
  })

  return (['recordCompleted',
    sendData['sessions[0][name]'],
    sendData['sessions[0][metrics][rank]'],
    sendData['sessions[1][name]'],
    sendData['sessions[1][metrics][rank]']
  ])
}

function URIToolFactory() {
  return {
    toJSON: (URIText) => {
      // URIText = decodeURI(URIText)
      let result = {}
      URIText.split('&').map((item) => {
        result[
          decodeURI(item.split('=')[0])
        ] = decodeURI(item.split('=')[1])
      })
      return result;
    },
    fromJSON: (json) => {
      let result = []
      for (let item in json) {
        result.push(
          `${encodeURI(item)}=${encodeURI(json[item])}`
        )
      }
      result = result.join('&')
      return result;
    }
  }
}
