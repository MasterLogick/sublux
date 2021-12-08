import {bytesToBase64} from "byte-base64";

export {fileToBase64File, stringToUtf8Base64};

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

function stringToUtf8Base64(string) {
    return bytesToBase64(toBinary(string));
}

function toBinary(string) {
    return Uint8Array.from(Array.from(string).map(l => l.charCodeAt(0)));
}
