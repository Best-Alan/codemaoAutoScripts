console.log(fetch)

let headers = {
  "Content-Type": "application/json",
  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36 Edg/124.0.0.0",
};

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

  fetch(`https://api.codemao.cn/web/discussions/7437/comment`, {
    method: "POST",
    body: JSON.stringify({
      "content": "test",
      "rich_content": "test_rich_c",
      "source": "WORK_SHOP"
    }),
    headers: headers
  }).then(async (res) => {
    //if (res.ok)
    console.log(await res.json())
  })
})()
