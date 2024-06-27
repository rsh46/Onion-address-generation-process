document.getElementById('generate-btn').addEventListener('click', generateOnionAddress);

function generateOnionAddress() {
    const outputDiv = document.getElementById('output');

    // Generate keys using SubtleCrypto (WebCrypto API)
    window.crypto.subtle.generateKey(
        {
            name: "ECDSA",
            namedCurve: "P-256"
        },
        true,
        ["sign", "verify"]
    ).then(keyPair => {
        // Export the public key
        return window.crypto.subtle.exportKey(
            'spki',
            keyPair.publicKey
        ).then(publicKey => {
            // Export the private key
            return window.crypto.subtle.exportKey(
                'pkcs8',
                keyPair.privateKey
            ).then(privateKey => {
                // Generate onion address from public key (mocked here)
                const onionAddress = generateMockOnionAddress();

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
            });
        });
    }).catch(error => {
        console.error('Error generating keys:', error);
    });
}

function generateMockOnionAddress() {
    // Mock function to generate a dummy onion address
    return 'mockonionaddress123.onion';
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

function copyToClipboard(text) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
                    }
