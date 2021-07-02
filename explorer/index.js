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
            address:'5f51f400',
        },
    })
    .then(response=>{
        let data = lget(response,'data.data');
        console.log('\n ----------patient---------\n');
        for(info of data){
            const inforamtion=info.data;
            const buf=Buffer.from(inforamtion,'base64');
            console.log(buf.toString());
        }
    });

    instance
    .get('/state',{
        params:{
            address:'5f51f401',
        },
    })
    .then(response=>{
        let data = lget(response,'data.data');
        console.log('\n\n ----------doctor---------\n');
        for(info of data){
            const inforamtion=info.data;
            const buf=Buffer.from(inforamtion,'base64');
            console.log(buf.toString());
        }
    });

    instance
    .get('/state',{
        params:{
            address:'5f51f411',
        },
    })
    .then(response=>{
        let data = lget(response,'data.data');
        console.log('\n\n ----------pharmacy---------\n');
        for(info of data){
            const inforamtion=info.data;
            const buf=Buffer.from(inforamtion,'base64');
            console.log(buf.toString());
        }
    });


