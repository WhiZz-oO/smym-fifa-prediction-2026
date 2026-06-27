const fs=require('fs'); 

// 1. index.html
let idx=fs.readFileSync('index.html','utf8'); 
idx=idx.replace(/<select id="ward" class="fifa-input fifa-select">.*?<\/select>/s, '<select id="ward" class="fifa-input fifa-select"><option value="">Select your ward</option>' + Array.from({length:30},(_,i)=>'<option value="Ward ' + (i+1) + '">Ward ' + (i+1) + '</option>').join('') + '</select>'); 
idx=idx.replace(/<li class="nav-item ms-lg-3">\s*<a class="btn btn-gold-sm" href="pages\/admin\.html" id="navAdmin">\s*<i class="fas fa-lock me-1"><\/i> Admin\s*<\/a>\s*<\/li>/is, ''); 
idx=idx.replace(/<a href="pages\/admin\.html">Admin Panel<\/a>/i, ''); 
idx=idx.replace(/<select id="goldenBoot" class="fifa-input award-select">.*?<\/select>/s, '<input type="text" id="goldenBoot" class="fifa-input" placeholder="Type player name...">'); 
idx=idx.replace(/<select id="goldenBall" class="fifa-input award-select">.*?<\/select>/s, '<input type="text" id="goldenBall" class="fifa-input" placeholder="Type player name...">'); 
idx=idx.replace(/<select id="goldenGlove" class="fifa-input award-select">.*?<\/select>/s, '<input type="text" id="goldenGlove" class="fifa-input" placeholder="Type goalkeeper name...">'); 
idx=idx.replace(/<body.*?>/i, '<body>\n  <div class="smym-watermark">SMYM<br>CHEMMALAMATTOM</div>');
idx=idx.replace('+91 99999 99999', '+91 9207215221');
fs.writeFileSync('index.html', idx); 

// 2. js/api.js
let api=fs.readFileSync('js/api.js','utf8'); 
api=api.replace('TIMEOUT_MS: 15000', 'TIMEOUT_MS: 30000').replace(`tally('ward', 8)`, `tally('ward', 10)`); 
fs.writeFileSync('js/api.js', api); 

// 3. js/prediction.js
let pred=fs.readFileSync('js/prediction.js','utf8'); 
pred=pred.replace(/if \(bootEl && !PredState\.choicesInstances\.boot\) \{.*?PredState\.choicesInstances\.glove = new Choices\(gloveEl, choicesConfig\);\s*\}/s, ''); 
fs.writeFileSync('js/prediction.js', pred); 

// 4. google-app-script/Code.gs
let gs=fs.readFileSync('google-app-script/Code.gs','utf8'); 
gs=gs.replace('const limit   = 15;', 'const limit   = 1000;'); 
fs.writeFileSync('google-app-script/Code.gs', gs); 

// 5. admin.html
let adminHtml=fs.readFileSync('pages/admin.html','utf8'); 
adminHtml=adminHtml.replace(/<body.*?>/i, '<body>\n  <div class="smym-watermark">SMYM<br>CHEMMALAMATTOM</div>'); 
fs.writeFileSync('pages/admin.html', adminHtml); 

// 6. winner.html
let winHtml=fs.readFileSync('pages/winner.html','utf8'); 
winHtml=winHtml.replace(/<body.*?>/i, '<body>\n  <div class="smym-watermark">SMYM<br>CHEMMALAMATTOM</div>'); 
fs.writeFileSync('pages/winner.html', winHtml);

console.log("Replacements done!");
