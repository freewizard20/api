const express = require('express');
const app = express();

app.set('view engine','ejs');
app.set('views','./views');

app.get('/',(req,res)=>{
	res.render('home',{bitcoin:30000,ethereum:3000,kimchi:2.89,exchange:0.03});
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
