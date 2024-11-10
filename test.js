

let headers = {
  "Content-Type": "application/json",
  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36 Edg/124.0.0.0",
};

var sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay));

function getAPI(...args) {
  var API = {
    "USER_DETAILS": "https://api.codemao.cn/web/users/details",
    "NEWEST_WORKS": `https://api.codemao.cn/creation-tools/v1/pc/discover/newest-work?work_origin_type=ORIGINAL_WORK&offset=0&limit=${args[1]}`,
    "LIKE_WORK": `https://api.codemao.cn/nemo/v2/works/${args[1]}/like`,
    "USER_WORKS": `https://api.codemao.cn/creation-tools/v2/user/center/work-list?type=newest&user_id=${args[1]}&offset=0&limit=4999`,
    "WORK_COMMENT": `https://api.codemao.cn/creation-tools/v1/works/${args[1]}/comment`,
    "NEMO_NEWEST_WORKS": `https://api.codemao.cn/nemo/v3/newest/work/original/list?offset=0&limit=${args[1]}`,
    "NEMO_LIKED_ME": `https://api.codemao.cn/nemo/v2/user/message/1?offset=0&limit=${args[1]}`
  }
  return API[args[0]]
}

function fetchInfo() {
  return {
    "credentials": "include",
    "headers": {
      "Content-Type": "application/json;charset=UTF-8",
      "User-Agent": "Mozilla/5.0 (Windows NT 5.1rv: 21.0) Gecko/20100101 Firefox/21",
      "Cookie": headers.cookie
    }
  }
}

async function like(id) {
  // console.log('like', id)
  let info = fetchInfo()
  info.method = 'POST'
  return (await fetch(getAPI('LIKE_WORK', id), info));
}

var paused = 0;
(async function() {
  await fetch(`https://api.codemao.cn/tiger/v3/web/accounts/login`, {
    method: "POST",
    body: JSON.stringify({
      identity: process.env.IDENTITY_1,
      password: process.env.PASSWORD_1,
      pid: "65edCTyg", // 写死的, 不会变动
      agreement_ids: [-1]
    }),
    headers: headers
  }).then(async (res) => {
    //if (res.ok)
    let resJson = await res.json()
    console.log(resJson)
    headers.cookie = 'authorization=' + resJson.auth.token
  })
  while (1) {
    
    let newest_work = await (await fetch(getAPI('NEMO_NEWEST_WORKS', 50), fetchInfo())).json();
    console.log(newest_work.items.map(i => i.work_id))
    //console.log(commented)
    for (let i of newest_work.items) {
      setTimeout(async() => {
        console.log((await like(i.work_id)).status, i.work_id)
      }, 0) 
    }
    while (paused) {
      await sleep(500)
    }
    await sleep(0)
    // save_data()
  }
})()
