// get file arguments
const fs = require('fs');
const path = require('path');
const name = process.argv.slice(2).join(' ');

if(!name) {
    console.error("Please provide a name for the new project.");
    process.exit(1);
}

const nameNormalized = name.replaceAll(" ", "-").replaceAll("---", "-").toLowerCase();

let day = new Date().getDate();
let month = new Date().getMonth() + 1;

const months = ["jan", "feb", "mar", "apr", "may", "june", "july", "aug", "sept", "oct", "nov", "dec"];

let year = new Date().getFullYear();
const date = `${day} ${months[month-1]}, ${year}`;

let metaTitle = `<meta property="og:title"       content="${name}"`
let metaDesc  = `<meta property="og:description" content=""`
let metaURL   = `<meta property="og:url"         content="https://rus1130.github.io/projects/collection/${nameNormalized}.html"`

// find the longest of the three strings, and pad the others with spaces to match
let maxLength = Math.max(metaTitle.length, metaDesc.length, metaURL.length);
metaTitle = metaTitle.padEnd(maxLength, ' ') + " />";
metaDesc  = metaDesc.padEnd(maxLength, ' ') + " />";
metaURL   = metaURL.padEnd(maxLength, ' ') + " />";


const HTML_TEMPLATE = 
`<!-- written ${date} -->
<head>
    <link rel="stylesheet" href="./src/css.css">
    <script src="../Global/typewriter.js"></script>
    ${metaTitle}
    ${metaDesc}
    ${metaURL}
    <title>${name}</title>
</head>
<body>
    <div id="out"></div>
    <div class="button" id="return" onclick="location.href = 'https://rus1130.github.io/projects/collection/'" style="display: none;">▌< Return</div>
</body>
<script>
    fetch('./src/${nameNormalized}.tw')
    .then(response => response.text())
    .then(text => {
        let tw3 = new Typewriter3(text, document.getElementById("out"), {
            charDelay: 100,
            newlineDelay: 500,
            customDelays: {
                ",": 350,
                ".": 600
            },
            newpageText: "▌Next >",
            defaultTextColor: "#ffffff",
            defaultBackgroundColor: "#000000",
            onFunctionTag: () => {
                document.getElementById('return').style.display = 'block';
            }
        });

        document.body.addEventListener('keydown', (event) => {
            if (event.code === 'Space') tw3.togglePause();
            if (event.code === 'ArrowRight') tw3.speedOverride(1);
            if (event.code === 'ArrowLeft') tw3.speedOverride(null);
        });

        tw3.start();
    });
</script>`

const txt_TEMPLATE = 
`{{# written ${date} #}}
{{#timecalc
    char: 100
    newline: 500
    custom: {
        ",": 350
        ".": 600
    }
#}}
`

fs.writeFileSync(path.join('collection', `${nameNormalized}.html`), HTML_TEMPLATE.replaceAll("\n", "\r\n"));
fs.writeFileSync(path.join('collection', 'src', `${nameNormalized}.tw`), txt_TEMPLATE.replaceAll("\n", "\r\n"));

let homepage = fs.readFileSync(path.join('collection', 'index.html'), 'utf8');
let insertIndex = homepage.indexOf('<div class="button" onclick="location.href = \'https://rus1130.github.io/projects/index.html?bypass=true\'">▌< Return to main page</div>') - 4;
let newLink = `    <!-- <div class="button" onclick="location.href = './${nameNormalized}.html'">▌${name}</div> -->`;

homepage = homepage.slice(0, insertIndex) + newLink + '\r\n' + homepage.slice(insertIndex);
fs.writeFileSync(path.join('collection', 'index.html'), homepage);