document.getElementById('generateButton').addEventListener('click', async () => {
    const response = await fetch('/generate', {
        method: 'POST',
    });
    const data = await response.json();
    document.getElementById('privateKey').innerText = data.privateKey;
    document.getElementById('publicKey').innerText = data.publicKey;
    document.getElementById('onionAddress').innerText = data.onionAddress;
});
