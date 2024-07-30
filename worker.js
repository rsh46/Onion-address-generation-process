self.onmessage = async (event) => {
	const pattern = event.data.pattern;
	let keyPair, publicKey, onionAddress;

	do {
		keyPair = await crypto.subtle.generateKey(
			{
				name: "Ed25519",
				namedCurve: "Ed25519"
			},
			true,
			["sign", "verify"]
		);

		publicKey = await crypto.subtle.exportKey(
			"raw",
			keyPair.publicKey
		);

		onionAddress = `http://${base64Encode(publicKey)}.onion`;
	} while (!onionAddress.includes(pattern));

	self.postMessage({
		privateKey: await crypto.subtle.exportKey("raw", keyPair.privateKey),
		publicKey,
		onionAddress
	});
};

function base64Encode(buffer) {
	return btoa(String.fromCharCode(...new Uint8Array(buffer)));
}
