const axios = require('axios');
const fs = require('fs');

const basis = axios.get('https://ftx.com/api/markets/BTC/USD/candles?resolution=86400');
const futures = axios.get('https://ftx.com/api/markets/BTC-0326/candles?resolution=86400');
const futures2 = axios.get('https://ftx.com/api/markets/BTC-0625/candles?resolution=86400');
const futures3 = axios.get('https://ftx.com/api/markets/BTC-0924/candles?resolution=86400');
const futures4 = axios.get('https://ftx.com/api/markets/BTC-1231/candles?resolution=86400')

axios.all([basis,futures, futures2, futures3, futures4]).then(axios.spread((...responses)=>{
    const resultBasis = responses[0];
    const resultFutures = responses[1];
    const resultFutures2 = responses[2];
    const resultFutures3 = responses[3];
    const resultFutures4 = responses[4];

    console.log(resultBasis.data.result[resultBasis.data.result.length-1]);
    console.log(resultFutures.data.result[resultFutures.data.result.length-1]);

    let basisCount = resultBasis.data.result.length-1;
    let futuresCount = resultFutures.data.result.length-1;
    let futuresCount2 = resultFutures2.data.result.length-1;
    let futuresCount3 = resultFutures3.data.result.length-1;
    let futuresCount4 = resultFutures4.data.result.length-1;

    let timeframe = [];
    let basis = [];
    let futures = [];
    let spread = [];
    let futures2 = [];
    let spread2 = [];
    let futures3 = [];
    let spread3 = [];
    let futures4 = [];
    let spread4 = [];
    let text = '';

    while(basisCount>=0){
        let curr = '';
        timeframe.unshift(resultBasis.data.result[basisCount].startTime);
        curr = timeframe[0];
        basis.unshift(resultBasis.data.result[basisCount].open);
        //curr = curr + ' ' + basis[0];
        if(futuresCount>=0){
            futures.unshift(resultFutures.data.result[futuresCount].open);
            const b = resultBasis.data.result[basisCount].open;
            const f = resultFutures.data.result[futuresCount].open;
            spread.unshift((f-b)*100/b);
            curr = curr + ' ' + spread[0];
        }
        if(futuresCount2>=0){
            futures2.unshift(resultFutures2.data.result[futuresCount2].open);
            const b = resultBasis.data.result[basisCount].open;
            const f = resultFutures2.data.result[futuresCount2].open;
            spread2.unshift((f-b)*100/b);
            curr = curr + ' ' + spread2[0];
        }
        if(futuresCount3>=0){
            futures3.unshift(resultFutures3.data.result[futuresCount3].open);
            const b = resultBasis.data.result[basisCount].open;
            const f = resultFutures3.data.result[futuresCount3].open;
            spread3.unshift((f-b)*100/b);
            curr = curr + ' ' + spread3[0];
        }
        if(futuresCount4>=0){
            futures4.unshift(resultFutures4.data.result[futuresCount4].open);
            const b = resultBasis.data.result[basisCount].open;
            const f = resultFutures4.data.result[futuresCount4].open;
            spread4.unshift((f-b)*100/b);
            curr = curr + ' ' + spread4[0];
        }

        text = text + '\n' + curr;
        futuresCount--;
        futuresCount2--;
        futuresCount3--;
        futuresCount4--;
        basisCount--;
    }

    fs.writeFileSync('result_premium.txt',text,'utf8');
}));

