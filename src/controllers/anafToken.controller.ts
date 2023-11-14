import { Request, Response } from 'express';
import { CustomRequest } from '../middleware/auth.middleware';
import express from 'express';
import { AuthorizationCode } from 'simple-oauth2';
import axios from 'axios';

class AnafTokenController {
    async generateToken(req: CustomRequest, res: express.Response) {
        // Configure your OAuth 2.0 Credentials
        const config = {
            client: {
                id: 'ea0d72df2fe5111362a06bd28ac27e8a7e3ee71d86a22e65',
                secret: 'dae976ac8550ab6bd6f7355fc9a87f5be607f7384b967e8a7e3ee71d86a22e65',
            },
            auth: {
                tokenHost: 'https://logincert.anaf.ro/anaf-oauth2/v1/',
                tokenPath: 'token',
                authorizePath: 'authorize',
            },
        };

        const code = req.query.code;

        // Check if 'code' is a string (it should not be an array or an object)
        if (typeof code !== 'string') {
            return res.status(400).send('Invalid code parameter.');
        }
        // Initialize the OAuth2 Library
        const client = new AuthorizationCode(config);
        const options = {
            code: code,
            redirect_uri: 'http://localhost:3000/callback',
        };

        try {
            const accessToken = await client.getToken(options);
            console.log('The resulting token: ', accessToken.token);

            // Now you have the access token, you can use it to make API requests
            res.send('Authentication successful! Check console for details.');
        } catch (error) {
            console.error('Access Token Error', error.message);
            res.status(500).json('Authentication failed');
        }
    }

    async anafAuth(req: Request, res: Response) {
		const {id} = req.query;
        try {
            const userId = `${id}`;
            const clientId = 'dcc8a2cdb860cfb9d412e81791d57e8a7e3ee71dd71a4e65';
            const redirectUri = 'https://drauber.abvsoft.ro/api/anaf/callback';
            const authorizationUrl = 'https://logincert.anaf.ro/anaf-oauth2/v1/authorize';

            // Redirect the user to the authorization URL
            const authParams = {
                response_type: 'code',
                client_id: clientId,
                redirect_uri: redirectUri,
                state: `${userId}`,
            };

            const authUrl = `${authorizationUrl}?response_type=${authParams.response_type}&client_id=${authParams.client_id}&redirect_uri=${authParams.redirect_uri}&state=${authParams.state}`;

            return res.redirect(authUrl);
        } catch (error) {
            return res.status(500).json({
                error: `${error}`,
            });
        }
    }

    async anafCallback(req: Request, res: Response) {
        const query = req.query;
        try {
            const redirectUri = 'https://drauber.abvsoft.ro/api/anaf/callback';
            const tokenUrl = 'https://logincert.anaf.ro/anaf-oauth2/v1/token';
            const clientId = 'dcc8a2cdb860cfb9d412e81791d57e8a7e3ee71dd71a4e65';
            const clientSecret = 'c08e74035a89911b96d702c7b544eead4a822193ff7d7e8a7e3ee71dd71a4e65';

            const data = {
                grant_type: 'authorization_code',
                code: 'code',
                redirect_uri: redirectUri,
            };

            axios
                .post(tokenUrl, data, {
                    auth: {
                        username: clientId,
                        password: clientSecret,
                    },
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                })
                .then((response) => {
                    const accessToken = response.data.access_token;
                    const refreshToken = response.data.refresh_token;

                    /** find user by query.state
                     * store tokens
                     */

                    return res.status(200).json({
                        message: 'Success!',
                        accessToken,
                        refreshToken,
                        query,
                    });
                })
                .catch((err) => {
                    return res.status(500).json({
                        error: `${err}`,
                        query,
                    });
                });
        } catch (error) {
            return res.status(500).json({
                error: `${error}`,
                query,
            });
        }
    }
}

export default new AnafTokenController();
