
import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { google } from 'googleapis';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class GmailProvider {
    private gmail;
    private logger = new Logger(GmailProvider.name);
    private initialized = false;
    private myEmail: string;

    constructor() {
        this.initGmailClient();
    }

    private initGmailClient() {
        try {
            // Resolve path to config_google relative to where the process is running
            // If running from backend root: ../config_google
            // If running from project root: ./config_google
            let configPath = path.join(process.cwd(), 'config_google');
            if (!fs.existsSync(configPath)) {
                configPath = path.join(process.cwd(), '../config_google');
            }

            this.logger.log(`Looking for Google config at: ${configPath}`);

            const credentialsPath = path.join(configPath, 'credentials.json');
            const tokenPath = path.join(configPath, 'token.json'); // Previously generated

            if (!fs.existsSync(credentialsPath)) {
                this.logger.error(`credentials.json not found at ${credentialsPath}`);
                return;
            }
            if (!fs.existsSync(tokenPath)) {
                this.logger.error(`token.json not found at ${tokenPath}. Please run token generation script.`);
                return;
            }

            const content = fs.readFileSync(credentialsPath, 'utf8');
            const credentials = JSON.parse(content);
            const keys = credentials.installed || credentials.web;

            if (!keys) {
                this.logger.error('Invalid credentials.json format');
                return;
            }

            const { client_secret, client_id, redirect_uris } = keys;
            const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

            const tokenContent = fs.readFileSync(tokenPath, 'utf8');
            oAuth2Client.setCredentials(JSON.parse(tokenContent));

            this.gmail = google.gmail({ version: 'v1', auth: oAuth2Client });
            this.initialized = true;
            this.logger.log('Gmail client initialized successfully');

        } catch (error) {
            this.logger.error('Failed to initialize Gmail client', error);
        }
    }

    async sendEmail(subject: string, body: string, replyTo: string) {
        if (!this.gmail) {
            // Try initializing again if it failed briefly or if lazy loading is better? 
            // For now, if init failed, we can't send.
            this.logger.error('Gmail client not ready');
            throw new InternalServerErrorException('Email service not available');
        }

        if (!this.myEmail) {
            try {
                const profile = await this.gmail.users.getProfile({ userId: 'me' });
                this.myEmail = profile.data.emailAddress;
                this.logger.log(`Detected authenticated email: ${this.myEmail}`);
            } catch (error) {
                this.logger.error('Failed to get user profile', error);
                throw new InternalServerErrorException('Failed to determine sender email');
            }
        }

        // "me" is the special value indicating the authenticated user
        // The 'From' header is automatically set by Gmail API to the authenticated user

        // Create email message
        // Note: Gmail API requires base64url encoding

        const utf8Subject = `=?utf-8?B?${Buffer.from(subject).toString('base64')}?=`;

        const messageParts = [
            `To: ${this.myEmail}`,
            `Subject: ${utf8Subject}`,
            `Reply-To: ${replyTo}`,
            'Content-Type: text/plain; charset=utf-8',
            'MIME-Version: 1.0',
            '',
            body,
        ];
        const message = messageParts.join('\n');

        const encodedMessage = Buffer.from(message)
            .toString('base64')
            .replace(/\+/g, '-')
            .replace(/\//g, '_')
            .replace(/=+$/, '');

        try {
            await this.gmail.users.messages.send({
                userId: 'me',
                requestBody: {
                    raw: encodedMessage,
                },
            });
            this.logger.log(`Email sent successfully to self (via Gmail API)`);
            return { success: true };
        } catch (error) {
            this.logger.error('Error sending email via Gmail API', error);
            throw new InternalServerErrorException('Failed to send email');
        }
    }
}
