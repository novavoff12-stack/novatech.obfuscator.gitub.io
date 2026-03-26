function stripComments(code) {
    code = code.replace(/--

\[

\[[\s\S]*?\]

\]

/g, "");
    code = code.replace(/--.*/g, "");
    return code;
}

function minify(code) {
    return code
        .split("\n")
        .map(l => l.trim())
        .filter(l => l.length > 0)
        .join(" ");
}

function renameVars(code) {
    let i = 1;
    const map = {};
    return code.replace(/\blocal\s+([a-zA-Z_][a-zA-Z0-9_]*)/g, (m, v) => {
        if (!map[v]) map[v] = "_v" + (i++);
        return "local " + map[v];
    });
}

function encryptStrings(code) {
    return code.replace(/"([^"]*)"/g, (m, str) => {
        const encoded = btoa(str);
        return `(_D("${encoded}"))`;
    });
}

function wrap(code) {
    return `
local b='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'

local function _D(s)
    return (function(data)
        local t={}
        for i=1,#data,4 do
            local n=(string.find(b,data:sub(i,i))-1)*262144
                +(string.find(b,data:sub(i+1,i+1))-1)*4096
                +(string.find(b,data:sub(i+2,i+2))-1)*64
                +(string.find(b,data:sub(i+3,i+3))-1)
            table.insert(t,string.char(math.floor(n/65536)%256,math.floor(n/256)%256,n%256))
        end
        return table.concat(t)
    end)(s)
end

(function()
${code}
end)()
`;
}

function obfuscate(code, mode) {
    code = stripComments(code);
    code = minify(code);
    code = renameVars(code);

    if (mode !== "light") {
        code = encryptStrings(code);
    }

    if (mode === "strong") {
        code = wrap(code);
    }

    return code;
}

document.addEventListener("DOMContentLoaded", () => {
    const input = document.getElementById("inputCode");
    const output = document.getElementById("outputCode");
    const mode = document.getElementById("mode");
    const btn = document.getElementById("runBtn");

    btn.onclick = () => {
        output.value = obfuscate(input.value, mode.value);
    };
});
