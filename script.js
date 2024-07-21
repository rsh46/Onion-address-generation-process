const ec = new elliptic.ec('ed25519');

function generateKeypair() {
    const key = ec.genKeyPair();
    return {
        privateKey: key.getPrivate('hex'),
        publicKey: key.getPublic('hex')
    };
}

function getOnionAddress(publicKey) {
    const pubBytes = hexToBytes(publicKey);
    const checksum = ".onion checksum";
    const version = new Uint8Array([0x03]);
    const combined = new Uint8Array(pubBytes.length + checksum.length + version.length);
    combined.set(pubBytes);
    combined.set(new TextEncoder().encode(checksum), pubBytes.length);
    combined.set(version, pubBytes.length + checksum.length);
    return base32Encode(combined).toLowerCase().slice(0, 56);
}

function hexToBytes(hex) {
    const bytes = new Uint8Array(hex.length / 2);
    for (let i = 0; i < hex.length; i += 2) {
        bytes[i / 2] = parseInt(hex.substr(i, 2), 16);
    }
    return bytes;
}

function base32Encode(input) {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
    let output = '';
    let bits = 0;
    let value = 0;

    for (let i = 0; i < input.length; i++) {
        value = (value << 8) | input[i];
        bits += 8;
        while (bits >= 5) {
            output += alphabet[(value >>> (bits - 5)) & 31];
            bits -= 5;
        }
    }
    if (bits > 0) {
        output += alphabet[(value << (5 - bits)) & 31];
    }
    return output;
}

function generateVanityAddress() {
    const prefix = document.getElementById('prefix').value.toLowerCase();
    const resultElement = document.getElementById('result');
    resultElement.textContent = 'Generating... This may take a while.';

    const worker = new Worker(URL.createObjectURL(new Blob([`
        ${generateKeypair.toString()}
        ${getOnionAddress.toString()}
        ${hexToBytes.toString()}
        ${base32Encode.toString()}
        
        onmessage = function(e) {
            const prefix = e.data;
            while (true) {
                const { privateKey, publicKey } = generateKeypair();
                const address = getOnionAddress(publicKey);
                if (address.startsWith(prefix)) {
                    postMessage({ privateKey, publicKey, address });
                    break;
                }
            }
        };
    `], {type: 'text/javascript'})));

    worker.onmessage = function(e) {
        const { privateKey, publicKey, address } = e.data;
        resultElement.innerHTML = `
            Found vanity address: ${address}<br><br>
            Private key: ${privateKey}<br><br>
            Public key: ${publicKey}
        `;
        worker.terminate();
    };

    worker.postMessage(prefix);
}
