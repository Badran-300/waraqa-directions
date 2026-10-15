const fs=require('fs'),vm=require('vm'),assert=require('assert'),crypto=require('crypto');
const ctx={window:{}};vm.runInNewContext(fs.readFileSync('dist/data.js','utf8'),ctx);const data=ctx.window.SHOWCASE;
assert.equal(data.directions.length,70);assert.equal(new Set(data.directions.map(d=>d.id)).size,70);assert.equal(data.groups.length,7);
const hashes=new Set();for(const g of data.groups)assert.equal(data.directions.filter(d=>d.group===g.key).length,10);
for(const d of data.directions){const b=fs.readFileSync('dist/assets/'+d.id+'.webp');assert(b.length>3000,d.id+' artwork empty');assert.equal(b.subarray(0,4).toString(),'RIFF');assert.equal(b.subarray(8,12).toString(),'WEBP');hashes.add(crypto.createHash('sha256').update(b).digest('hex'));for(const k of ['name','tagline','persona','use','motion','watch'])assert(d[k],d.id+' missing '+k);assert.equal(d.palette.length,4)}
assert.equal(hashes.size,70,'Every direction must have independent artwork');
for(const f of ['index.html','app.js','style.css','arabic.css','presentation.css','fonts/Arabic-Regular.ttf','fonts/Arabic-SemiBold.ttf','fonts/OFL.txt'])assert(fs.statSync('dist/'+f).size>100);
const html=fs.readFileSync('dist/index.html','utf8'),app=fs.readFileSync('dist/app.js','utf8');
for(const id of ['indexRail','slideIndex','prevButton','nextButton','position'])assert(html.includes('id="'+id+'"'),'Missing presentation control '+id);
for(const feature of ['starButton','savedButton','compareButton','fullscreenButton','id="search"','download='])assert(!html.includes(feature),'Unwanted presentation feature '+feature);
assert(!app.includes('localStorage'),'Presentation must not persist favorites');
assert(fs.statSync('dist/Waraqa-Directions.pdf').size>100000);assert.equal(fs.readFileSync('dist/Waraqa-Directions.pdf').subarray(0,4).toString(),'%PDF');
assert(fs.statSync('dist/Waraqa-Directions.pptx').size>100000);assert.equal(fs.readFileSync('dist/Waraqa-Directions.pptx').subarray(0,2).toString(),'PK');
for(const f of ['app.js','data.js'])new vm.Script(fs.readFileSync('dist/'+f,'utf8'));
console.log('PASS: 70 unique direction assets, 7 collections of 10, complete content, valid scripts, bundled fonts, PDF and PowerPoint.');
