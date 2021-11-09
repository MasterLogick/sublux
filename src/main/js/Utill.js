export {fileToBase64File, stringToBase64};

function fileToBase64File(file) {
    return new Promise((resolve, reject) => {
            const fr = new FileReader();
            fr.onloadend = () => {
                resolve({name: file.name, data: fr.result.substring(fr.result.lastIndexOf(",") + 1)});
            }
            fr.onerror = reject;
            fr.onabort = reject;
            fr.readAsDataURL(file);
        }
    );
}

function stringToBase64(string) {
    return btoa(toBinary(string));
}

function toBinary(string) {
    const codeUnits = new Uint16Array(string.length);
    for (let i = 0; i < codeUnits.length; i++) {
        codeUnits[i] = string.charCodeAt(i);
    }
    const charCodes = new Uint8Array(codeUnits.buffer);
    let result = '';
    for (let i = 0; i < charCodes.byteLength; i++) {
        result += String.fromCharCode(charCodes[i]);
    }
    return result;
}
