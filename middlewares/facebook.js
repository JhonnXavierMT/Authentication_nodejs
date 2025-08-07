
module.exports = function congifPassportFacebook(passport) {
    const FacebookStrategy = require('passport-facebook');
    passport.use('facebook', new FacebookStrategy({
        clientID: process.env['FACEBOOK_APP_ID'],
        clientSecret: process.env['FACEBOOK_APP_SECRET'],
        callbackURL: "/oauth2/redirect/facebook",
        enableProof: true,
        /*scope: ['user_friends', 'manage_pages'], */
        profileFields: ['displayName', 'emails']
    },
        function (accessToken, refreshToken, profile, cb) {
            const user = {
                name: profile.displayName,
                email: profile.emails?.[0]?.value,
            };
            return cb(null, user);
        }
    ));
}
