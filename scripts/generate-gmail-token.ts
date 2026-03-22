
import { google } from 'googleapis';
import * as fs from 'fs';
import * as path from 'path';
import * as readline from 'readline';

// Use process.cwd() to avoid __dirname issues in ESM/TS environments
const CREDENTIALS_PATH = path.join(process.cwd(), 'config_google', 'credentials.json');
const TOKEN_PATH = path.join(process.cwd(), 'config_google', 'token.json');
const SCOPES = [
    'https://www.googleapis.com/auth/gmail.send',
    'https://www.googleapis.com/auth/gmail.readonly'
];

async function generateToken() {
    if (!fs.existsSync(CREDENTIALS_PATH)) {
        console.error(`Error: Credentials file not found at ${CREDENTIALS_PATH}`);
        return;
    }

    const content = fs.readFileSync(CREDENTIALS_PATH, 'utf8');
    const credentials = JSON.parse(content);
    const keys = credentials.installed || credentials.web;

    if (!keys) {
        console.error('Error: Invalid credentials.json format. Missing "installed" or "web" key.');
        return;
    }

    const { client_secret, client_id, redirect_uris } = keys;
    const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

    const authUrl = oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: SCOPES,
    });

    console.log('Authorize this app by visiting this url:');
    console.log(authUrl);

    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    rl.question('Enter the code from that page here: ', async (code) => {
        rl.close();
        try {
            const { tokens } = await oAuth2Client.getToken(code);
            oAuth2Client.setCredentials(tokens);
            fs.writeFileSync(TOKEN_PATH, JSON.stringify(tokens));
            console.log('Token stored to', TOKEN_PATH);
        } catch (err) {
            console.error('Error retrieving access token:', err);
        }
    });
}

generateToken();
