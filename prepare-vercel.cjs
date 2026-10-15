const fs=require('fs'),path=require('path');
const root=__dirname,source=path.join(root,'dist'),output=path.join(root,'site');
fs.mkdirSync(output,{recursive:true});
for(const name of ['index.html','app.js','data.js','style.css','arabic.css','presentation.css','assets','fonts']){
  fs.cpSync(path.join(source,name),path.join(output,name),{recursive:true});
}
console.log('Presentation prepared: 70 directions, bundled artwork and Arabic fonts.');
