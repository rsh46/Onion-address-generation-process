 
document.getElementById('generate-btn').addEventListener('click', generateOnionAddress);

async function generateOnionAddress() {
    const outputDiv = document.getElementById('output');

    // Generate keys using SubtleCrypto (WebCrypto API)
    const keyPair = await window.crypto.subtle.generateKey({
        name: "RSA-OAEP",
        modulusLength: 2048,
        publicExponent: new Uint8Array([1, 0, 1]),
        hash: "SHA-256",
    }, true, ["encrypt", "decrypt"]);

    // Export the public key
    const publicKey = await window.crypto.subtle.exportKey('spki', keyPair.publicKey);
    const publicKeyBuffer = new Uint8Array(publicKey);
    
    // Export the private key
    const privateKey = await window.crypto.subtle.exportKey('pkcs8', keyPair.privateKey);
    const privateKeyBuffer = new Uint8Array(privateKey);
    
    // Generate onion address from public key
    const onionAddress = await generateOnionAddressFromPublicKey(publicKeyBuffer);

    // Convert keys to base64 for display
    const publicKeyBase64 = arrayBufferToBase64(publicKey);
    const privateKeyBase64 = arrayBufferToBase64(privateKey);

    // Create a new div for this address set
    const addressSetDiv = document.createElement('div');
    addressSetDiv.className = 'address-set';

    addressSetDiv.innerHTML = `
        <div>Onion Address: <span>${onionAddress}</span></div>
        <div>Public Key: <span>${publicKeyBase64}</span></div>
        <div>Private Key: <span>${privateKeyBase64}</span></div>
        <button class="copy-btn">Copy</button>
    `;

    // Add copy functionality
    addressSetDiv.querySelector('.copy-btn').addEventListener('click', () => {
        copyToClipboard(`Onion Address: ${onionAddress}\nPublic Key: ${publicKeyBase64}\nPrivate Key: ${privateKeyBase64}`);
        alert('Copied to clipboard!');
    });

    // Add the new address set to the output div
    outputDiv.appendChild(addressSetDiv);
}

async function generateOnionAddressFromPublicKey(publicKeyBuffer) {
    const publicKeyHash = await crypto.subtle.digest("SHA-256", publicKeyBuffer);
    const checksum = await crypto.subtle.digest("SHA-256", concatenateBuffers(new TextEncoder().encode(".onion checksum"), new Uint8Array(publicKeyHash), new Uint8Array([3])));
    const onionAddress = base32Encode(concatenateBuffers(new Uint8Array(publicKeyHash), new Uint8Array(checksum.slice(0, 2)), new Uint8Array([3]))).toLowerCase();
    return onionAddress;
}

function arrayBufferToBase64(buffer) {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
}

function concatenateBuffers(...buffers) {
    let totalLength = 0;
    for (const buffer of buffers) {
        totalLength += buffer.byteLength;
    }
    const concatenated = new Uint8Array(totalLength);
    let offset = 0;
    for (const buffer of buffers) {
        concatenated.set(new Uint8Array(buffer), offset);
        offset += buffer.byteLength;
    }
    return concatenated.buffer;
}

function base32Encode(buffer) {
    const alphabet = 'abcdefghijklmnopqrstuvwxyz234567';
    let bits = '';
    let base32 = '';
    for (const byte of new Uint8Array(buffer)) {
        bits += byte.toString(2).padStart(8, '0');
    }
    for (let i = 0; i < bits.length; i += 5) {
        base32 += alphabet[parseInt(bits.slice(i, i + 5), 2)];
    }
    return base32;
}

function copyToClipboard(text) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
}
 
