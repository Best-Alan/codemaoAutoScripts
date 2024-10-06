let headers = {
  "Content-Type": "application/json",
  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36 Edg/124.0.0.0",
  /* "Origin": "https://nemo.codemao.cn", 
  "Extensions": "client_max_window_bits" */
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
    // console.log(res['headers'].get('set-cookie'))
    //if (res.ok)
    let resJson = await res.json()
    // console.log(resJson)
    headers.cookie = 'authorization=' + resJson.auth.token
    // headers["Cookie"] = res['headers'].get('set-cookie')
  })

  /* fetch(`https://api.codemao.cn/web/discussions/7437/comment`, {
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
  }) */
  
  console.log(headers)

  let connection = new WebSocket(
    // `wss://socketcv.codemao.cn:9096/cloudstorage/?session_id=${235556699}&authorization_type=${5}&stag=${2}&EIO=3&transport=websocket`, 
    'wss://socketcv.codemao.cn:9096/cloudstorage/?session_id=235556699&authorization_type=5&stag=2&token=none&EIO=3&transport=websocket', 
    {
      headers: headers
    }
  )
  
  connection.onmessage = (msg) => {
    console.log('连接信息', msg.data)
    connection.close()
  }

  connection.onerror = (msg) => {
    console.log('连接错误', msg)
  }

  connection.onclose = (msg) => {
    console.log('连接已关闭', msg)
  }
})()
