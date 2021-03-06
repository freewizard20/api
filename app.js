const express = require('express');
const app = express();

app.get('/',(req,res)=>{
	res.send('Hello world from api');
	console.log('/ entered api');
});

app.listen(3001, ()=>{
	console.log('connect to 3001');
})
