module.exports = function(app, passport, db) {

// normal routes ===============================================================

    // show the home page (will also have our login links)
    app.get('/', function(req, res) {
        res.render('index.ejs');
    });

    // PROFILE SECTION =========================
    app.get('/profile', isLoggedIn, function(req, res) {
        db.collection('roulette').find().toArray((err, result) => {
          if (err) return console.log(err)
          const resultFiltered = result.filter(function(result) {
                if(req.user.local.email == result.user){
                  return true
                }
            })
         if(req.user.local.accountType === "Admin") {
            res.render('admin.ejs', {
            user : req.user,
            roulette: result
         })} else {
          res.render('profile.ejs', {
          user : req.user,
          roulette: resultFiltered
        })}
        })
    });

    // LOGOUT ==============================
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });

// roulette board routes ===============================================================
// app.post('/profile/start', (req, res) => {
//       db.collection('roulette').save({user: req.body.email, wins: 0, losses: 0, total: 500}, (err, result) => {
//         if (err) return console.log(err)
//         console.log('saved to database')
//         res.redirect('/profile')
//       })
//     })

    app.put('/roulette', (req, res) => {
      function getChoice(){
        const randNum = Math.random()
        if(randNum <0.5){
          return "red"
        }else{
          return "black"
        }
      }
      const botChoice = getChoice();
      if(botChoice == req.body.choice){
          db.collection('roulette')
          .findOneAndUpdate({user:req.body.user}, {
            $set: {
              wins: req.body.wins+1,
              losses: req.body.losses,
              total: req.body.total +10,
              // botChoice: req.body.botChoice
            }
          }, {
            sort: {_id: -1},
            upsert: true
          }, (err, result) => {
            if (err) return res.send(err)
            res.send(result)
          }
      )

  }else if(botChoice != req.body.choice){
        db.collection('roulette')
        .findOneAndUpdate({user:req.body.user}, {
          $set: {
            wins: req.body.wins,
            losses: req.body.losses +1,
            total: req.body.total -10,
            // botChoice: req.body.botChoice
          }
        }, {
          sort: {_id: -1},
          upsert: true
        }, (err, result) => {
          if (err) return res.send(err)
          res.send(result)
        })
      }
    })


    // app.delete('/messages', (req, res) => {
    //   db.collection('messages').findOneAndDelete({name: req.body.name, msg: req.body.msg}, (err, result) => {
    //     if (err) return res.send(500, err)
    //     res.send('Message deleted!')
    //   })
    // })

// =============================================================================
// AUTHENTICATE (FIRST LOGIN) ==================================================
// =============================================================================

    // locally --------------------------------
        // LOGIN ===============================
        // show the login form
        app.get('/login', function(req, res) {
            res.render('login.ejs', { message: req.flash('loginMessage') });
        });

        // process the login form
        app.post('/login', passport.authenticate('local-login', {
            successRedirect : '/profile', // redirect to the secure profile section
            failureRedirect : '/login', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }));

        // SIGNUP =================================
        // show the signup form
        app.get('/signup', function(req, res) {
            res.render('signup.ejs', { message: req.flash('signupMessage') });
        });

        // process the signup form
        app.post('/signup', passport.authenticate('local-signup', {
            successRedirect : '/profile', // redirect to the secure profile section
            failureRedirect : '/signup', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }));


// =============================================================================
// UNLINK ACCOUNTS =============================================================
// =============================================================================
// used to unlink accounts. for social accounts, just remove the token
// for local account, remove email and password
// user account will stay active in case they want to reconnect in the future

    // local -----------------------------------
    app.get('/unlink/local', isLoggedIn, function(req, res) {
        var user            = req.user;
        user.local.email    = undefined;
        user.local.password = undefined;
        user.save(function(err) {
            res.redirect('/profile');
        });
    });

};

// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();

    res.redirect('/');
}
