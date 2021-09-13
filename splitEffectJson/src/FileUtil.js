let fs = require("fs");
let path = require("path");
let readline = require("readline");

function readLineFilter(p, filter, callback, encoding) {
    let rl = readline.createInterface({input: fs.createReadStream(p, {encoding})});
    let arr = [];
    rl.on("line", function (line) {
        if (filter(line)) {
            arr.push(line);
        }
    });
    rl.on("close", function () {
        callback(arr);
    });
}

/**
 *
 * @param {string} dir
 * @param {number} [mode]
 * @return {boolean} result
 */
function mkdirsSync(dir, mode) {
    try {
        if (!fs.existsSync(dir)) {
            let tmp;
            dir = dir.replace(/\\/g, "/");
            dir.split("/").forEach((name) => {
                if (tmp) {
                    tmp = path.join(tmp, name);
                } else {
                    tmp = name;
                }
                if (!fs.existsSync(tmp)) {
                    if (!fs.mkdirSync(tmp, mode)) {
                        return false;
                    }
                }
            });
        }
        return true;
    } catch (e) {
        console.error(e);
        return false;
    }
}

/**
 *
 * @param {string} dir
 * @returns {boolean}
 */
function cleanDirSync(dir) {
    try {
        if (fs.existsSync(dir)) {
            let files = fs.readdirSync(dir);
            for (let name of files) {
                if (name.charAt(0) === ".") {
                    continue;
                }
                let p = path.join(dir, name);
                if (fs.lstatSync(p).isDirectory()) {
                    rmdirsSync(p);
                } else {
                    fs.unlinkSync(p);
                }
            }
        }
    } catch (e) {
        console.error(e);
        return false;
    }
    return true;
}

/**
 *
 * @param {string} dir
 * @return {boolean}
 */
function rmdirsSync(dir) {
    try {
        if (fs.existsSync(dir)) {
            let files = fs.readdirSync(dir);
            for (let name of files) {
                let p = path.join(dir, name);
                if (fs.lstatSync(p).isDirectory()) {
                    rmdirsSync(p);
                } else {
                    fs.unlinkSync(p);
                }
            }
            fs.rmdirSync(dir);
        }
    } catch (e) {
        console.error(e);
        return false;
    }
    return true;
}

/**
 *
 * @param {string} p
 */
function delAnyway(p) {
    if (!fs.existsSync(p)) {
        return false;
    }
    if (fs.lstatSync(p).isDirectory()) {
        rmdirsSync(p);
    } else {
        fs.unlinkSync(p);
    }
}


/**
 *
 * @param {string} dir
 * @param {string[]} [res]
 * @param {string|string[]} [ext]
 * @return {string[]}
 */
function walkSync(dir, res, ext) {
    res = res || [];
    let files = fs.readdirSync(dir);
    for (let f of files) {
        if (f.charAt(0) === ".") {
            continue;
        }
        let p = path.join(dir, f);
        let stat = fs.lstatSync(p);
        if (stat.isDirectory()) {
            walkSync(p, res, ext);
        } else if (stat.isFile()) {
            let extF = path.extname(f);
            if (typeof ext === "string") {
                if (extF !== ext) {
                    continue;
                }
            } else if (Array.isArray(ext)) {
                if (ext.indexOf(extF) < 0) {
                    continue;
                }
            }
            res.push(p);
        }
    }
    return res;
}

/**
 *
 * @param {string} dir
 * @param {string[]} [res]
 * @returns {string[]}
 */
function readDirListSync(dir, res) {
    res = res || [];
    let files = fs.readdirSync(dir);
    for (let f of files) {
        if (f.charAt(0) === ".") {
            continue;
        }
        let p = path.join(dir, f);
        let stat = fs.lstatSync(p);
        if (stat.isDirectory()) {
            res.push(f);
        }
    }
    return res;
}

/**
 *
 * @param {string} dir
 * @param {string|string[]} [ext]
 * @returns {string[]}
 */
function readFileListSync(dir, ext) {
    let res = [];
    let files = fs.readdirSync(dir);
    for (let f of files) {
        if (f.charAt(0) === ".") {
            continue;
        }
        let p = path.join(dir, f);
        let stat = fs.lstatSync(p);
        if (stat.isFile()) {
            let extF = path.extname(f);
            if (typeof ext === "string") {
                if (extF !== ext) {
                    continue;
                }
            } else if (Array.isArray(ext)) {
                if (ext.indexOf(extF) < 0) {
                    continue;
                }
            }
            res.push(f);
        }
    }
    return res;
}

module.exports = {
    readLineFilter,
    mkdirsSync,
    cleanDirSync,
    rmdirsSync,
    delAnyway,
    walkSync,
    readDirListSync,
    readFileListSync
};