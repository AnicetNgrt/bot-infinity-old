const translate = require('translate');
const fetch = require('node-fetch');

exports.run = (text,lang)=>{

    return new Promise(async (resolve,reject)=>{
        var sourceText = text
    
        var sourceLang = 'fr';
    
        var targetLang = lang; 

    
        var url = "https://translate.googleapis.com/translate_a/single?client=gtx&sl=" 
                + sourceLang + "&tl=" + targetLang + "&dt=t&q=" + encodeURI(sourceText);
    
        var fetched = await fetch(url);
        var content = await fetched.text();
        resolve(content.split("[[[")[1].split(",")[0].replace(/['"]+/g, ''));
    
    });   
   
}



