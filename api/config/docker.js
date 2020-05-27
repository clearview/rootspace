module.exports = {
    port: 3001,
    postgres: '@@POSTGRES',
    jwtSecretKey: 'hxDSkATgxjx-xDmyasD4kR6dxHGEwfoxrbvymeeSI6qaZUP8qsJjAk_AXhBeBZMfaIrdraKnwCVaS1eHl8',
    google: {
        clientID: '@@GOOGLE_CLIENT_ID',
        clientSecret: '@@GOOGLE_CLIENT_SECRET',
        callbackPath: '@@GOOGLE_CALLBACK_PATH'
    },
    mail: {
        client: '@@MAIL_CLIENT',
        from: 'root@clearview.team',
        sendgrid: {
            api_key: '@@SENDGRID_API_KEY'
        }
    },
    s3: {
        bucket: 'cv-root-staging',
        accessKey: '@@S3_ACCESS_KEY',
        secretKey: '@@S3_SECRET_KEY'
    },
    uploadDir: '../uploads',
    domain: '@@DOMAIN',
    domainSignupPath: '@@DOMAIN_SIGNUP_PATH',
    domainEmailConfirmationPath: '@@DOMAIN_EMAIL_CONFIRMATION_PATH',
    domainInviteAcceptPath: '@@DOMAIN_INVITE_ACCEPT_PATH'
}
