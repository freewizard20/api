const axios = require('axios');

axios.get('https://api.exchangeratesapi.io/latest?base=USD
[출처] [NodeJS] 국제환율 정보 API|작성자 Printf')
.then((data)=>{
    console.log(data.data.data.closing_price);
})