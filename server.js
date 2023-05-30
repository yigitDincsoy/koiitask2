const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3');
const { encrypt, decrypt, nonce } = require("solana-encryption");
const Keypair = require("@solana/web3.js").Keypair;
const cors = require('cors'); // Add the cors module

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors()); // Enable CORS for all routes

const db = new sqlite3.Database('./mydb.db', (err) => {
    if (err) {
        return console.error(err.message);
    }
    console.log('Connected to the SQlite database.');
    db.run(`CREATE TABLE IF NOT EXISTS messages (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            message TEXT)`, (err) => {
        if (err) {
            return console.error(err.message);
        }
        console.log("Messages table created successfully.");
    });
});

app.post('/listener', (req, res) => {
    let receivedString = req.body.string;
    if (receivedString) {
        //send something back
        let encryptedString = solanaEncrypt(receivedString);
        res.send(encryptedString);

        //insert data to db
        let stmt = db.prepare("INSERT INTO messages(message) VALUES (?)");
        stmt.run(encryptedString);
        stmt.finalize();
    } else {
        res.status(400).send("Invalid request");
    }
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));

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
  
    // console.log(encrypted)
    // console.log(typeof(encrypted))
    return encrypted;
}
