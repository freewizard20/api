const express = require('express');
const axios = require('axios');
const app = express();

app.set('view engine','ejs');
app.set('views','./views');

app.get('/',(req,res)=>{
	const bitcoin = axios.get('https://ftx.com/api/markets/BTC/USD');
	const ethereum = axios.get('https://ftx.com/api/markets/ETH/USD');
	const bitcoin_krw = axios.get('https://api.bithumb.com/public/ticker/BTC_KRW');
	const exchange = axios.get('https://ftx.com/api/markets/ETH/BTC');
	const usd = axios.get('https://api.exchangeratesapi.io/latest?base=USD');

	axios.all([bitcoin,ethereum,bitcoin_krw,exchange,usd]).then(axios.spread((...responses)=>{
		const resultbitcoin = responses[0];
		const resultethereum = responses[1];
		const resultbitcoin_krw = responses[2].data.data.closing_price;
		const resultexchange = responses[3];
		const usd = Math.round(responses[4].data.rates.KRW);
		const kimchi = (resultbitcoin_krw - (resultbitcoin.data.result.last * usd))* 100 / resultbitcoin_krw

		res.render('home',{bitcoin:resultbitcoin.data.result.last,ethereum:resultethereum.data.result.last,kimchi:kimchi.toFixed(2),exchange:resultexchange.data.result.last});
	}));
});

const date_curr = '0326';
const date_curr2 = '0625';
const date_curr3 = '0924';
const date_curr4 = '1231';

app.get('/current',(req,res)=>{
    const basis = axios.get('https://ftx.com/api/markets/BTC/USD');
    const futures = axios.get('https://ftx.com/api/markets/BTC-'+date_curr);
    const futures2 = axios.get('https://ftx.com/api/markets/BTC-'+date_curr2);
    const futures3 = axios.get('https://ftx.com/api/markets/BTC-'+date_curr3);
    const futures4 = axios.get('https://ftx.com/api/markets/BTC-'+date_curr4);

    const ebasis = axios.get('https://ftx.com/api/markets/ETH/USD');
    const efutures = axios.get('https://ftx.com/api/markets/ETH-'+date_curr);
    const efutures2 = axios.get('https://ftx.com/api/markets/ETH-'+date_curr2);
    const efutures3 = axios.get('https://ftx.com/api/markets/ETH-'+date_curr3);
    const efutures4 = axios.get('https://ftx.com/api/markets/ETH-'+date_curr4);

    axios.all([basis,futures,futures2,futures3,futures4,ebasis,efutures,efutures2,efutures3,efutures4]).then(axios.spread((...responses)=>{
        const data = [];
        const bitcoin = {};
        bitcoin.price = responses[0].data.result.last;
        bitcoin.futures = ((responses[1].data.result.last-responses[0].data.result.last)/responses[0].data.result.last*100).toFixed(2);
        bitcoin.futures2 = ((responses[2].data.result.last-responses[0].data.result.last)/responses[0].data.result.last*100).toFixed(2);
        bitcoin.futures3 = ((responses[3].data.result.last-responses[0].data.result.last)/responses[0].data.result.last*100).toFixed(2);
        bitcoin.futures4 = ((responses[4].data.result.last-responses[0].data.result.last)/responses[0].data.result.last*100).toFixed(2);
        data.push(bitcoin);
        const ethereum = {};
        ethereum.price = responses[5].data.result.last;
        ethereum.futures = ((responses[6].data.result.last-responses[5].data.result.last)/responses[5].data.result.last*100).toFixed(2);
        ethereum.futures2 = ((responses[7].data.result.last-responses[5].data.result.last)/responses[5].data.result.last*100).toFixed(2);
        ethereum.futures3 = ((responses[8].data.result.last-responses[5].data.result.last)/responses[5].data.result.last*100).toFixed(2);
        ethereum.futures4 = ((responses[9].data.result.last-responses[5].data.result.last)/responses[5].data.result.last*100).toFixed(2);
        data.push(ethereum);
        res.render('current',{data:data});
    }))
})

app.get('/bitcoin',(req,res)=>{
	const basis = axios.get('https://ftx.com/api/markets/BTC/USD/candles?resolution=86400');
	const futures = axios.get('https://ftx.com/api/markets/BTC-'+date_curr+'/candles?resolution=86400');
	const futures2 = axios.get('https://ftx.com/api/markets/BTC-'+date_curr2+'/candles?resolution=86400');
	const futures3 = axios.get('https://ftx.com/api/markets/BTC-'+date_curr3+'/candles?resolution=86400');
	const futures4 = axios.get('https://ftx.com/api/markets/BTC-'+date_curr4+'/candles?resolution=86400');

axios.all([basis,futures, futures2, futures3, futures4]).then(axios.spread((...responses)=>{
    const resultBasis = responses[0];
    const resultFutures = responses[1];
    const resultFutures2 = responses[2];
    const resultFutures3 = responses[3];
    const resultFutures4 = responses[4];

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
	let data = [];

    while(basisCount>=0){
        let curr = '';
		let current = {};
        timeframe.unshift(resultBasis.data.result[basisCount].startTime);
        curr = timeframe[0];
		current.date = timeframe[0];
        basis.unshift(resultBasis.data.result[basisCount].open);
		current.price = basis[0];
        if(futuresCount>=0){
            futures.unshift(resultFutures.data.result[futuresCount].open);
            const b = resultBasis.data.result[basisCount].open;
            const f = resultFutures.data.result[futuresCount].open;
            spread.unshift((f-b)*100/b);
            curr = curr + ' ' + spread[0];
			current.first = spread[0].toFixed(2);
        }
        if(futuresCount2>=0){
            futures2.unshift(resultFutures2.data.result[futuresCount2].open);
            const b = resultBasis.data.result[basisCount].open;
            const f = resultFutures2.data.result[futuresCount2].open;
            spread2.unshift((f-b)*100/b);
            curr = curr + ' ' + spread2[0];
			current.second = spread2[0].toFixed(2);
        }
        if(futuresCount3>=0){
            futures3.unshift(resultFutures3.data.result[futuresCount3].open);
            const b = resultBasis.data.result[basisCount].open;
            const f = resultFutures3.data.result[futuresCount3].open;
            spread3.unshift((f-b)*100/b);
            curr = curr + ' ' + spread3[0];
			current.third = spread3[0].toFixed(2);
        }
        if(futuresCount4>=0){
            futures4.unshift(resultFutures4.data.result[futuresCount4].open);
            const b = resultBasis.data.result[basisCount].open;
            const f = resultFutures4.data.result[futuresCount4].open;
            spread4.unshift((f-b)*100/b);
            curr = curr + ' ' + spread4[0];
			current.fourth = spread4[0].toFixed(2);
        }

		data.push(current);
        text = text + '\n' + curr;
        futuresCount--;
        futuresCount2--;
        futuresCount3--;
        futuresCount4--;
        basisCount--;
    }

	res.render('bitcoin',{data:data});
}));
});

app.get('/ethereum',(req,res)=>{
	const basis = axios.get('https://ftx.com/api/markets/ETH/USD/candles?resolution=86400');
	const futures = axios.get('https://ftx.com/api/markets/ETH-'+date_curr+'/candles?resolution=86400');
	const futures2 = axios.get('https://ftx.com/api/markets/ETH-'+date_curr2+'/candles?resolution=86400');
	const futures3 = axios.get('https://ftx.com/api/markets/ETH-'+date_curr3+'/candles?resolution=86400');
	const futures4 = axios.get('https://ftx.com/api/markets/ETH-'+date_curr4+'/candles?resolution=86400')

axios.all([basis,futures, futures2, futures3, futures4]).then(axios.spread((...responses)=>{
    const resultBasis = responses[0];
    const resultFutures = responses[1];
    const resultFutures2 = responses[2];
    const resultFutures3 = responses[3];
    const resultFutures4 = responses[4];

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
	let data = [];

    while(basisCount>=0){
        let curr = '';
		let current = {};
        timeframe.unshift(resultBasis.data.result[basisCount].startTime);
        curr = timeframe[0];
		current.date = timeframe[0];
        basis.unshift(resultBasis.data.result[basisCount].open);
		current.price = basis[0];
        if(futuresCount>=0){
            futures.unshift(resultFutures.data.result[futuresCount].open);
            const b = resultBasis.data.result[basisCount].open;
            const f = resultFutures.data.result[futuresCount].open;
            spread.unshift((f-b)*100/b);
            curr = curr + ' ' + spread[0];
			current.first = spread[0].toFixed(2);
        }
        if(futuresCount2>=0){
            futures2.unshift(resultFutures2.data.result[futuresCount2].open);
            const b = resultBasis.data.result[basisCount].open;
            const f = resultFutures2.data.result[futuresCount2].open;
            spread2.unshift((f-b)*100/b);
            curr = curr + ' ' + spread2[0];
			current.second = spread2[0].toFixed(2);
        }
        if(futuresCount3>=0){
            futures3.unshift(resultFutures3.data.result[futuresCount3].open);
            const b = resultBasis.data.result[basisCount].open;
            const f = resultFutures3.data.result[futuresCount3].open;
            spread3.unshift((f-b)*100/b);
            curr = curr + ' ' + spread3[0];
			current.third = spread3[0].toFixed(2);
        }
        if(futuresCount4>=0){
            futures4.unshift(resultFutures4.data.result[futuresCount4].open);
            const b = resultBasis.data.result[basisCount].open;
            const f = resultFutures4.data.result[futuresCount4].open;
            spread4.unshift((f-b)*100/b);
            curr = curr + ' ' + spread4[0];
			current.fourth = spread4[0].toFixed(2);
        }

		data.push(current);
        text = text + '\n' + curr;
        futuresCount--;
        futuresCount2--;
        futuresCount3--;
        futuresCount4--;
        basisCount--;
    }

	res.render('ethereum',{data:data});
}));
});

app.get('/kimp',(req,res)=>{
	res.render('kimp',{data:[]});
});

app.listen(3001, ()=>{
	console.log('connect to 3001');
})
