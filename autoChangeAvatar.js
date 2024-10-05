let headers = {
  "Content-Type": "application/json",
  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36 Edg/124.0.0.0",
};

let MONUMENT_VALLEY_AVATARS_URLS = JSON.parse(process.env.MONUMENT_VALLEY_AVATARS_URLS)

Array.prototype.randomItem = function() {
  return this[Math.floor(Math.random() * this.length)]
}

let avatarUrl = MONUMENT_VALLEY_AVATARS_URLS.randomItem()
console.log(avatarUrl);

(async function() {
  await fetch(`https://api.codemao.cn/tiger/v3/web/accounts/login`, {
    method: "POST",
    body: JSON.stringify({
      identity: process.env.IDENTITY,
      password: process.env.PASSWORD,
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

  fetch(`https://api.codemao.cn/tiger/v3/web/accounts/info`, {
    method: "P",
    body: JSON.stringify({
      "avatar_url": avatarUrl
    }),
    headers: headers
  }).then(async (res) => {
    //if (res.ok)
    console.log(res.status)
    if (!res.ok) {
      console.error('set Avatar', res.status, await res.text());
      throw new Error('TypeError')
    }
  })
})()
