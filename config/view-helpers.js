const { json } = require("express");
const fs=require('fs')
const path=require('path');
const environment = require("./environment")

module.exports= (app)=>{
    app.locals.assetPath=function(filePath){
        
        if(environment.name=='development')
        return '/' + filePath;
        console.log('/'+ JSON.parse(fs.readFileSync(path.join(__dirname, '../public/assets/rev-manifest.json') ))[filePath]);
        return '/'+ JSON.parse(fs.readFileSync(path.join(__dirname, '../public/assets/rev-manifest.json') ))[filePath];
    }
}