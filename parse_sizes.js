const https = require('https');
https.get('https://siddz.com/', (res) => {
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    // Quick regex for headings and block sizes
    const matches = data.match(/className="[^"]*text-[0-9a-z]+[^"]*"/g);
    const unique = [...new Set(matches)];
    console.log("Classes found:");
    console.log(unique.join('\n').substring(0, 1000));
  });
});
