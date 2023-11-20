import { Response } from 'express';
import { CustomRequest } from '../middleware/auth.middleware';
import { AuthorizationCode } from 'simple-oauth2';

class AnafTokenController {

    async anafAuth(req: CustomRequest, res: Response) {
        const {id} = req.params;
        const config = {
            client: {
                id: '901ef31c4b0c585285074496f38d7e8a7e3ee71d711d4e65',
                secret: 'bc1defa27b86411888c706acc5384c8d0620603afab07e8a7e3ee71d711d4e65',
            },
            auth: {
                tokenHost: 'https://logincert.anaf.ro/anaf-oauth2/v1',
                tokenPath: '/token',
                authorizePath: '/authorize',
            },
        };

        try {
            const client = new AuthorizationCode(config);

            const authorizationUri = client.authorizeURL({
                redirect_uri: 'https://asibox.abvsoft.ro/api/anaf/callback',
                scope: 'authorization',
                state: `${id}`
            });
            return res.redirect(authorizationUri);
        } catch (error) {
            return res.status(500).json({
                error: `${error}`,
            });
        }
    }

    async anafCallback(req: CustomRequest, res: Response) {
        const config = {
            client: {
                id: '901ef31c4b0c585285074496f38d7e8a7e3ee71d711d4e65',
                secret: 'bc1defa27b86411888c706acc5384c8d0620603afab07e8a7e3ee71d711d4e65',
            },
            auth: {
                tokenHost: 'https://logincert.anaf.ro/anaf-oauth2/v1',
                tokenPath: '/token',
                authorizePath: '/authorize',
            },
        };
        const { code } = req.query;
        if (typeof code === 'string') {
            const options = {
                code,
                scope: 'authenticate',
                redirect_uri: 'https://asibox.abvsoft.ro/api/anaf/callback'
            };
            try {

                const client = new AuthorizationCode(config);
                const accessToken = await client.getToken(options);
                console.log("accessToken from anaf: ", accessToken);

                return res.redirect(`https://asibox.abvsoft.ro/settings-anaf?accessToken=${accessToken.token}}`)
            } catch (error) {
                return res.status(500).json({
                    error: `${error}`,
                });
            }
        } else {
            return res.status(400).json({
                message: "Invalid code parameter"
            })
        }
    }
}

export default new AnafTokenController();
