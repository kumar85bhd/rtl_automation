const https = require('https');

https.get('https://code.claude.com/docs/en/claude-directory', (res) => {
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  res.on('end', () => {
    const textMatches = data.match(/<p>.*?<\/p>|<h2>.*?<\/h2>|<h3>.*?<\/h3>|<li>.*?<\/li>/gs);
    if(textMatches) {
        console.log(textMatches.map(m => m.replace(/<[^>]*>?/gm, '')).join('\n'));
    } else {
        console.log("No matches found.");
    }
  });
}).on("error", (err) => {
  console.log("Error: " + err.message);
});
