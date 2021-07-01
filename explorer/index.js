//We will simply fetch contents of blockchain and display them here..
const lget = require('lodash/get');
const axios = require('axios');

const instance = axios.create({
    baseURL: 'http://localhost:8008/',
    timeout: 1000,
    headers: { 'X-Custom-Header': 'foobar' },
});


instance
    .get('/state',{
        params:{
            address:'5f51f4',
        },
    })
    .then(response=>{
        let data = lget(response,'data.data');
        console.log('\n details:\n');
        for(info of data){
            const inforamtion=info.data;
            const buf=Buffer.from(inforamtion,'base64');
            console.log(buf.toString());
        }
    });


