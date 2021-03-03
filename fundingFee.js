const axios = require('axios');
const fs = require('fs');

axios.get('https://ftx.com/api/funding_rates?start_time=1583107200&future=BTC-PERP').then((data)=>{
    //console.log(data.data.result);
    let text = '';
    let average = 0;
    for(let i = 0 ; i < data.data.result.length ; i++){
        text = text + '\n' + data.data.result[i].time + ' ' + data.data.result[i].rate;
        average += data.data.result[i].rate;
    }
    console.log(average/data.data.result.length);
    fs.writeFileSync('funding.txt',text,'utf8');
})