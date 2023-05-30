import React, { useState } from "react";
import "./Main.css";
const { encrypt, decrypt, nonce } = require("solana-encryption");
const Keypair = require("@solana/web3.js").Keypair;

function Main() {
  const [encryptedData, set_encryptedData] = useState("");
  const [decryptedData, set_decryptedData] = useState("");

  //Unused for now
  const [encryptedMessage, setEncryptedMessage] = useState("");

  return (
    <div id="Main">
      <h1>Encryption and Decryption App</h1>

      <div className = "box">
      <input type="text" id="userInput"     placeholder="Enter message to encrypt"/>
      <button
        onClick={() => {
          const inputValue = document.getElementById("userInput").value;
          solanaEncrypt(inputValue);
        }}
      >
        Encrypt
      </button>

      <h2>Encrypted message:</h2>
      <p>{encryptedData}</p>
      <p>{encryptedMessage}</p>

      <h2>Decrypted message:</h2>
      <p>{decryptedData}</p>

      </div>

      <div className = "box">
        <h2>New functionality!</h2>
        <h3>Try our API now:</h3>


        <input type="text" id="userInputAPI"   placeholder="Enter message to encrypt"/>
      <button
        onClick={() => {
          const inputValue = document.getElementById("userInputAPI").value;
          postRequest(inputValue);
        }}
      > Send a POST Request</button>
        <p id="serverResponseRenderArea"></p>

        </div>

 
    </div>




  );



  function solanaEncrypt(toEncrypt) {
    const message = toEncrypt;
  
    // Generate two random key pairs
    const keypairA = Keypair.generate();
    const keypairB = Keypair.generate();
  
    // Get the public and private keys from the keypairs
    const publicKey_sender = keypairA.publicKey.toBase58();
    const privateKey_sender = keypairA.secretKey;
    const publicKey_receiver = keypairB.publicKey.toBase58();
    const privateKey_receiver = keypairB.secretKey;
  
    // Generate a nonce
    const newNonce = nonce();
  
    const encrypted = encrypt(
      message,
      newNonce,
      publicKey_receiver,
      privateKey_sender
    );

    const decrypted = decrypt(
        encrypted,
        newNonce,
        publicKey_sender,
        privateKey_receiver
      
      );
  
    console.log(encrypted);
    set_encryptedData(encrypted);
    set_decryptedData(decrypted);
  }


  function postRequest(arg1) {
// get the data 
let data = {
  string: arg1,
};

// Turn the data into JSON
let jsonData = JSON.stringify(data);

// Define the request details
let url = 'http://localhost:3000/listener';
let options = {
  method: 'POST',
  headers: {
      'Content-Type': 'application/json'
  },
  body: jsonData
};

// Send the request
fetch(url, options)
  .then(response => response.json()) 
  .then(responseData => {
      // Do something with the response
      console.log(responseData);

      document.getElementById("serverResponseRenderArea").innerHTML =  JSON.stringify(responseData);


  })
  .catch(error => console.error('Error:', error));

  }

  

}

export default Main;
