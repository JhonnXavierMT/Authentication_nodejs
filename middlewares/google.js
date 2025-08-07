module.exports = function configureGoogleStrategy(passport) {
    const GoogleStrategy = require('passport-google-oidc');
    
    // Configura la estrategia de Google
    passport.use('google',
        new GoogleStrategy({
            clientID: process.env['GOOGLE_CLIENT_ID'],         // ID de cliente de Google
            clientSecret: process.env['GOOGLE_CLIENT_SECRET'], // Secreto de cliente
            callbackURL: process.env['GOOGLE_CALLBACK_URL'],            // Ruta que Google llama tras login
            scope: ['profile', 'email']                        // Datos que solicitamos
        },
        function verify(issuer, profile, cb) {
            // Aquí recibimos los datos del usuario desde Google
            const user = {
                id: profile.id,
                name: profile.displayName,
                email: profile.emails?.[0]?.value,
                /* picture: profile.photos?.[0]?.value || profile._json?.picture || null */
            };
            // Passport guarda este objeto en req.user
            console.log(user)
            return cb(null, user);
        }));

    // Serializa el usuario en la sesión
    passport.serializeUser((user, done) => {
        done(null, user);
    });

    // Deserializa el usuario desde la sesión
    passport.deserializeUser((user, done) => {
        done(null, user);
    });
};
