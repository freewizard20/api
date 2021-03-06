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

app.get('/bitcoin',(req,res)=>{
	res.render('bitcoin',{data:[]});
});

app.get('/ethereum',(req,res)=>{
	res.render('ethereum',{data:[]});
});

app.get('/kimp',(req,res)=>{
	res.render('kimp',{data:[]});
});

app.listen(3001, ()=>{
	console.log('connect to 3001');
})
