function generateRandomHex(length) {
    let result = '';
    const characters = '0123456789ABCDEF';
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}

function generateKeysAndAddress() {
    const privateKey = generateRandomHex(64); // Generate a random 256-bit hex string as private key
    const publicKey = '04' + generateRandomHex(128); // Generate a random 512-bit hex string as public key
    const onionAddress = 'xplonion' + generateRandomHex(52) + '.onion'; // Generate a random 208-bit hex string for onion address
    document.getElementById('privateKey').innerText = privateKey;
    document.getElementById('publicKey').innerText = publicKey;
    document.getElementById('onionAddress').innerText = onionAddress;
}

document.getElementById('generateButton').addEventListener('click', generateKeysAndAddress);
