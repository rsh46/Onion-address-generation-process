
const generateBtn = document.getElementById('generate-btn');
const resultDiv = document.getElementById('result');
const patternInput = document.getElementById('pattern');

let worker;

generateBtn.addEventListener('click', async () => {
	const pattern = patternInput.value;
	if (!worker) {
		worker = new Worker('worker.js');
	}

	worker.postMessage({ pattern });
	worker.onmessage = (event) => {
		const { privateKey, publicKey, onionAddress } = event.data;
		resultDiv.innerHTML = `
			<p>Private Key:</p>
			<pre>${base64Encode(privateKey)}</pre>
			<p>Public Key:</p>
			<pre>${base64Encode(publicKey)}</pre>
			<p>Onion Address:</p>
			<pre>${onionAddress}</pre>
		`;
	};
});

function base64Encode(buffer) {
	return btoa(String.fromCharCode(...new Uint8Array(buffer)));
}
  
