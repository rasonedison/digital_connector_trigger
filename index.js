const express = require('express');  
const axios = require('axios');  
  
const app = express();  
const PORT = 3000;  
  
// 配置 Express 应用以解析 JSON 格式的请求体  
app.use(express.json());  
  
// 定义转发的目标 API URL  
const apiUrls = [  
  'https://api1.example.com/post',  
  'https://api2.example.com/post',  
  'https://api3.example.com/post'  
];  
  
// 处理 POST 请求的路由  
app.post('/forward', async (req, res) => {  
  try {  
    // 并发地发送请求到所有 API  
    const responses = await Promise.all(  
      apiUrls.map(url => axios.post(url, req.body))  
    );  
  
    // 将所有响应数据发送回客户端（可选，根据实际情况调整）  
    res.json({  
      status: 'success',  
      responses: responses.map(response => ({  
        url: response.config.url,  
        status: response.status,  
        data: response.data  
      }))  
    });  
  } catch (error) {  
    // 如果有任何请求失败，则发送错误响应  
    res.status(500).json({  
      status: 'error',  
      message: 'Failed to forward to one or more APIs',  
      errors: error.response ? error.response.data : error.message  
    });  
  }  
});  
  
// 监听端口  
app.listen(PORT, () => {  
  console.log(`Server is running on port ${PORT}`);  
});
