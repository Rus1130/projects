// get file arguments
const fs = require('fs');
const path = require('path');
const name = process.argv.slice(2).join(' ');

if(!name) {
    console.error("Please provide a name for the new project.");
    process.exit(1);
}

const nameNormalized = name.replaceAll(/\W/g, "-").replaceAll(/-+/g, "-").toLowerCase();

let day = new Date().getDate();
let month = new Date().getMonth();
let year = new Date().getFullYear();

const months = ["jan", "feb", "mar", "apr", "may", "june", "july", "aug", "sept", "oct", "nov", "dec"];

const date = `${day} ${months[month]}, ${year}`;

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
    <link rel="icon" type="image/png" href="images/favicon.png">
    ${metaTitle}
    ${metaDesc}
    ${metaURL}
    <meta name="theme-color" content="#fe0275" />
    <title>${name}</title>
</head>
<body>
</body>
<script type="module">
    import { SuperType, SuperTypeError, TagArgument } from 'https://rus1130.github.io/supertype/index.js';

    const tw = new SuperType(document.body, {
        "end": function() {
            const returnButton = document.createElement("div");
            returnButton.classList.add("button");
            returnButton.id = "return";
            returnButton.textContent = "▌< Return";
            returnButton.onclick = () => {
                location.href = 'https://rus1130.github.io/projects/collection/';
            };
            tw.appendToTarget(returnButton);
            tw.target.style.overflowY = 'scroll';
            tw.target.classList.add('hide-scrollbar');
        }
    })

    await tw.load("./src/${nameNormalized}.st").then(() => {
        tw.allowControls("all");
        tw.start();
    })
</script>`

const txt_TEMPLATE = 
`{{# written ${date} #}}
typewriter: {
    charDelay: 50
    newlineDelay: 500
    textColor: #ffffff
    backgroundColor: #000000
    customDelays: {
        ",": 350
        ".": 600
    }
}



[sleep 1700][linebreak]
[function "end"]
`

fs.writeFileSync(path.join('collection', `${nameNormalized}.html`), HTML_TEMPLATE.replaceAll("\n", "\r\n"));
fs.writeFileSync(path.join('collection', 'src', `${nameNormalized}.st`), txt_TEMPLATE.replaceAll("\n", "\r\n"));

let homepage = fs.readFileSync(path.join('collection', 'index.html'), 'utf8');
let insertIndex = homepage.indexOf('<div class="button" onclick="location.href = \'https://rus1130.github.io/projects/index.html?bypass=true\'">▌< Return to main page</div>') - 4;
let newLink = `    <!-- <div class="button" onclick="location.href = './${nameNormalized}.html'">▌${name}</div> -->`;

homepage = homepage.slice(0, insertIndex) + newLink + '\r\n' + homepage.slice(insertIndex);
fs.writeFileSync(path.join('collection', 'index.html'), homepage);