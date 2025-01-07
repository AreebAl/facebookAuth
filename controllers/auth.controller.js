const passport = require('../config/passportConfig'); // Importing configured passport instance


exports.loginWithFacebook = (req, res, next) => {
    passport.authenticate('facebook', { scope: ['email', 'ads_management', 'business_management'] })(req, res, next);
  };
  
//   exports.facebookCallback = (req, res, next) => {
//     console.log("facebookCallback")
//     passport.authenticate('facebook', { failureRedirect: '/' }, (err, user) => {
//         console.log("passport.authenticate")
//       if (err || !user) {
//         console.log("error",err)
//         return res.redirect('/');
//       }
//       req.login(user, (loginErr) => {
//         if (loginErr) {
//           return next(loginErr);
//         }
//         return res.redirect('/auth/dashboard');
//       });
//     })(req, res, next);
//   };


exports.facebookCallback = (req, res, next) => {
    console.log("facebookCallback initiated");
  
    passport.authenticate('facebook', { failureRedirect: '/' }, (err, user) => {
      console.log("passport.authenticate callback");
  
      if (err) {
        console.error("Error during authentication:", err);
        return res.redirect('/');
      }
  
      if (!user) {
        console.warn("No user found during authentication");
        return res.redirect('/');
      }
  
      req.login(user, (loginErr) => {
        if (loginErr) {
          console.error("Error during user login:", loginErr);
          return next(loginErr);
        }
        console.log("User successfully logged in:", user);
        return res.redirect('/auth/dashboard');
      });
    })(req, res, next);
  };
  
  
  exports.dashboard = (req, res) => {
    const user = req.user;
    console.log("user",user)
    res.send(`
      <h1>Welcome ${user.profile.displayName}</h1>
      <img src="${user.profile.photos[0].value}" alt="Profile Picture" />
        <p>Name: ${user.profile.displayName}</p>
      <p>Email: ${user.profile.emails[0].value}</p>
      <p>Facebook ID: ${user.profile.id}</p>
      <a href="/auth/logout">Logout</a>
    `);
  };
  
  exports.logout = (req, res, next) => {
    req.logout((err) => {
      if (err) {
        return next(err);
      }
      res.redirect('/');
    });
  };
  