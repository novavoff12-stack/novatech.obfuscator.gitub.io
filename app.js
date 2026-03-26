function removeLineComments(code) {
    // Fjerner -- kommentar til linjeslutt (ikke perfekt, men greit for demo)
    return code.split("\n").map(line => {
        const idx = line.indexOf("--");
        if (idx !== -1) {
            return line.slice(0, idx);
        }
        return line;
    }).join("\n");
}

function removeBlockComments(code) {
    // Naiv fjerning av --[[ ... ]] blokker
    return code.replace(/--

\[

\[[\s\S]*?\]

\]

/g, "");
}

function compressWhitespace(code) {
    // Fjerner overflødig whitespace og tomme linjer
    return code
        .split("\n")
        .map(line => line.trim())
        .filter(line => line.length > 0)
        .join(" ");
}

function renameSimpleVariables(code) {
    // Veldig enkel variabel-rename: finner "local <navn> =" og gir nye navn
    const varRegex = /\blocal\s+([a-zA-Z_][a-zA-Z0-9_]*)\s*=/g;
    let match;
    let counter = 1;
    const map = {};

    while ((match = varRegex.exec(code)) !== null) {
        const original = match[1];
        if (!map[original]) {
            map[original] = "v" + (counter++);
        }
    }

    // Erstatt alle forekomster av disse variablene
    for (const [orig, renamed] of Object.entries(map)) {
        const re = new RegExp("\\b" + orig + "\\b", "g");
        code = code.replace(re, renamed);
    }

    return code;
}

function obfuscateLua(code) {
    let result = code;

    result = removeBlockComments(result);
    result = removeLineComments(result);
    result = compressWhitespace(result);
    result = renameSimpleVariables(result);

    return result;
}

document.addEventListener("DOMContentLoaded", () => {
    const input = document.getElementById("inputCode");
    const output = document.getElementById("outputCode");
    const btn = document.getElementById("obfuscateBtn");

    btn.addEventListener("click", () => {
        const src = input.value || "";
        const obf = obfuscateLua(src);
        output.value = obf;
    });
});
