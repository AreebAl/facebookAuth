const passport = require('../config/passportConfig'); // Importing configured passport instance
const fetch = require('node-fetch');


// Function to get Ad Account IDs for the authenticated user
async function getAdAccountId(accessToken) {
    try {
      // Query Facebook's Graph API for the user's Ad Account(s)
      const response = await fetch(`https://graph.facebook.com/v21.0/me/adaccounts?access_token=${accessToken}`);
      const data = await response.json();
  
      if (data && data.data && data.data.length > 0) {
        // Assuming we use the first Ad Account ID for insights
        return data.data[0].id;
      } else {
        throw new Error('No Ad Accounts found for the user');
      }
    } catch (err) {
      console.error('Error fetching Ad Account:', err);
      throw err;
    }
  }


// Function to get insights for a given Ad Account and date range
async function getAdInsights(adAccountId, accessToken, startDate, endDate) {
    try {
      const response = await fetch(`https://graph.facebook.com/v21.0/${adAccountId}/insights?access_token=${accessToken}&time_range[since]=${startDate}&time_range[until]=${endDate}`);
      const data = await response.json();
  
      if (data.error) {
        throw new Error(data.error.message);
      }
  
      return data.data; // Return the insights data
    } catch (err) {
      console.error('Error fetching Ad Insights:', err);
      throw err;
    }
  }





exports.loginWithFacebook = (req, res, next) => {
    passport.authenticate('facebook', { scope: ['email', 'ads_read','ads_management', 'business_management','public_profile'] })(req, res, next);
  };
  

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
    // res.send(`
    //   <h1>Welcome ${user.profile.displayName}</h1>
    //   <img src="${user.profile.photos[0].value}" alt="Profile Picture" />
    //     <p>Name: ${user.profile.displayName}</p>
    //   <p>Email: ${user.profile.emails[0].value}</p>
    //   <p>Facebook ID: ${user.profile.id}</p>
    //   <a href="/auth/logout">Logout</a>

    //  <!-- Button to fetch Insights -->
    // <button id="insightsButton">Get Insights</button>
    
    // <!-- Date Range Inputs -->
    // <label for="startDate">Start Date:</label>
    // <input type="date" id="startDate" name="startDate" required>
    // <label for="endDate">End Date:</label>
    // <input type="date" id="endDate" name="endDate" required>

    // <script>
    //   // Add click event listener to the button
    //   document.getElementById('insightsButton').addEventListener('click', () => {
    //     const startDate = document.getElementById('startDate').value;
    //     const endDate = document.getElementById('endDate').value;

    //     // Ensure both dates are selected
    //     if (startDate && endDate) {
    //       fetch('/auth/insights', {
    //         method: 'POST',
    //         headers: {
    //           'Content-Type': 'application/json'
    //         },
    //         body: JSON.stringify({ startDate, endDate })
    //       })
    //       .then(response => response.json())
    //       .then(data => {
    //         alert('Insights data fetched: ' + JSON.stringify(data));
    //       })
    //       .catch(err => {
    //         console.error('Error fetching insights:', err);
    //         alert('Error fetching insights');
    //       });
    //     } else {
    //       alert('Please select a valid date range');
    //     }
    //   });
    // </script>
    // `);
    // res.send(`
    //     <!DOCTYPE html>
    //     <html lang="en">
    //     <head>
    //       <meta charset="UTF-8">
    //       <meta name="viewport" content="width=device-width, initial-scale=1.0">
    //       <title>Dashboard</title>
    //       <style>
    //         body {
    //           font-family: Arial, sans-serif;
    //           background: linear-gradient(135deg, #4267b2, #3b5998);
    //           color: #fff;
    //           text-align: center;
    //           padding: 20px;
    //         }
    //         .container {
    //           background: #ffffff;
    //           color: #333;
    //           border-radius: 10px;
    //           box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
    //           padding: 30px 20px;
    //           max-width: 600px;
    //           margin: 50px auto;
    //         }
    //         h1 {
    //           font-size: 24px;
    //           margin-bottom: 20px;
    //         }
    //         p {
    //           font-size: 16px;
    //           margin: 10px 0;
    //         }
    //         img {
    //           border-radius: 50%;
    //           width: 100px;
    //           height: 100px;
    //           margin-bottom: 20px;
    //         }
    //         button {
    //           background-color: #4267b2;
    //           color: white;
    //           padding: 10px 20px;
    //           border: none;
    //           border-radius: 5px;
    //           cursor: pointer;
    //           font-size: 16px;
    //           margin-top: 20px;
    //           transition: background-color 0.3s ease, transform 0.2s ease;
    //         }
    //         button:hover {
    //           background-color: #365899;
    //           transform: translateY(-2px);
    //         }
    //         button:active {
    //           transform: translateY(1px);
    //         }
    //         label, input {
    //           display: block;
    //           margin: 10px auto;
    //           font-size: 14px;
    //         }
    //         input {
    //           padding: 5px;
    //           border-radius: 5px;
    //           border: 1px solid #ddd;
    //           width: 80%;
    //           max-width: 300px;
    //         }
    //       </style>
    //     </head>
    //     <body>
    //       <div class="container">
    //         <h1>Welcome ${user.profile.displayName}</h1>
    //         <img src="${user.profile.photos[0].value}" alt="Profile Picture" />
    //         <p><strong>Name:</strong> ${user.profile.displayName}</p>
    //         <p><strong>Email:</strong> ${user.profile.emails[0].value}</p>
    //         <p><strong>Facebook ID:</strong> ${user.profile.id}</p>
    //         <a href="/auth/logout">
    //           <button>Logout</button>
    //         </a>
            
    //         <!-- Insights Section -->
    //         <h2>Get Insights</h2>
    //         <label for="startDate">Start Date:</label>
    //         <input type="date" id="startDate" name="startDate" required>
    //         <label for="endDate">End Date:</label>
    //         <input type="date" id="endDate" name="endDate" required>
    //         <button id="insightsButton">Get Insights</button>
    //       </div>
    
    //       <script>
    //         // Add click event listener to the button
    //         document.getElementById('insightsButton').addEventListener('click', () => {
    //           const startDate = document.getElementById('startDate').value;
    //           const endDate = document.getElementById('endDate').value;
    
    //           // Ensure both dates are selected
    //           if (startDate && endDate) {
    //             fetch('/auth/insights', {
    //               method: 'POST',
    //               headers: {
    //                 'Content-Type': 'application/json'
    //               },
    //               body: JSON.stringify({ startDate, endDate })
    //             })
    //             .then(response => response.json())
    //             .then(data => {
    //               alert('Insights data fetched: ' + JSON.stringify(data));
    //             })
    //             .catch(err => {
    //               console.error('Error fetching insights:', err);
    //               alert('Error fetching insights');
    //             });
    //           } else {
    //             alert('Please select a valid date range');
    //           }
    //         });
    //       </script>
    //     </body>
    //     </html>
    //   `);
    res.send(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Dashboard</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            background: linear-gradient(135deg, #4267b2, #3b5998);
            color: #fff;
            text-align: center;
            padding: 20px;
          }
          .container {
            background: #ffffff;
            color: #333;
            border-radius: 10px;
            box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
            padding: 30px 20px;
            max-width: 600px;
            margin: 50px auto;
          }
          h1 {
            font-size: 24px;
            margin-bottom: 20px;
          }
          p {
            font-size: 16px;
            margin: 10px 0;
          }
          img {
            border-radius: 50%;
            width: 100px;
            height: 100px;
            margin-bottom: 20px;
          }
          button {
            background-color: #4267b2;
            color: white;
            padding: 10px 20px;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-size: 16px;
            margin-top: 20px;
            transition: background-color 0.3s ease, transform 0.2s ease;
          }
          button:hover {
            background-color: #365899;
            transform: translateY(-2px);
          }
          button:active {
            transform: translateY(1px);
          }
          label, input {
            display: block;
            margin: 10px auto;
            font-size: 14px;
          }
          input {
            padding: 5px;
            border-radius: 5px;
            border: 1px solid #ddd;
            width: 80%;
            max-width: 300px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Welcome ${user.profile.displayName}</h1>
          <img src="${user.profile.photos[0].value}" alt="Profile Picture" />
          <p><strong>Name:</strong> ${user.profile.displayName}</p>
          <p><strong>Email:</strong> ${user.profile.emails[0].value}</p>
          <p><strong>Facebook ID:</strong> ${user.profile.id}</p>
          <a href="/auth/logout">
            <button>Logout</button>
          </a>
          
          <!-- Insights Section -->
          <h2>Get Insights</h2>
          <label for="startDate">Start Date:</label>
          <input type="date" id="startDate" name="startDate">
          <label for="endDate">End Date:</label>
          <input type="date" id="endDate" name="endDate">
          <button id="insightsButton">Get Insights</button>
        </div>
      
        <script>
          document.getElementById('insightsButton').addEventListener('click', () => {
            let startDate = document.getElementById('startDate').value;
            let endDate = document.getElementById('endDate').value;
            
            // If either date is not provided, default to today's date.
            const today = new Date().toISOString().split("T")[0];
            if (!startDate) {
              startDate = today;
            }
            if (!endDate) {
              endDate = today;
            }
      
            // Proceed to fetch insights with the available (or defaulted) dates.
            fetch('/auth/insights', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({ startDate, endDate })
            })
            .then(response => response.json())
            .then(data => {
              alert('Insights data fetched: ' + JSON.stringify(data));
            })
            .catch(err => {
              console.error('Error fetching insights:', err);
              alert('Error fetching insights');
            });
          });
        </script>
      </body>
      </html>
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
  


//   exports.getInsights = async (req, res) => {
//     const { startDate, endDate } = req.body;
//     const user = req.user;
  
//     // Example: Make an API call to Meta's Marketing API to fetch insights data
//     try {
//       const accessToken = user.accessToken; // Assume accessToken is stored in the user session
//       console.log("accessToken",accessToken)
      
//       // Replace with actual API call to Meta's Marketing API for insights
//       const insightsData = await fetch(`https://graph.facebook.com/v21.0/${user.profile.id}/insights?access_token=${accessToken}&since=${startDate}&until=${endDate}`)
//         .then(response => response.json())
//         .catch(err => {
//           console.error('Error fetching insights from Meta API:', err);
//           throw new Error('Failed to fetch insights');
//         });
      
//       res.json(insightsData); // Return the insights data to the frontend
//     } catch (err) {
//       console.error('Error getting insights:', err);
//       res.status(500).json({ error: 'Failed to fetch insights' });
//     }
//   };


// Fetch Insights for the given date range and Ad Account ID
exports.getInsights = async (req, res) => {
    console.log("inside getInsights")
    const { startDate, endDate } = req.body;

    if (!startDate || !endDate) {
      const today = new Date().toISOString().split("T")[0];
      startDate = today;
      endDate = today;
    }
    
    console.log("startDate:", startDate);
    console.log("endDate:", endDate);
    console.log("startDate",startDate)
    console.log("endDate",endDate)
    const user = req.user;
    const accessToken = user.accessToken; // Assuming the accessToken is saved in the session
    console.log("insights accessToken",accessToken)
  
    try {
      // Fetch the user's Ad Account ID
      const adAccountId = await getAdAccountId(accessToken);
      console.log("Fetched Ad Account ID:", adAccountId);
  
      // Fetch insights for the Ad Account ID and the specified date range
      const insightsData = await getAdInsights(adAccountId, accessToken, startDate, endDate);
      console.log("insightsData",insightsData)
      res.json(insightsData); // Return insights data to the frontend
    } catch (err) {
      console.error('Error fetching insights:', err);
      res.status(500).json({ error: 'Failed to fetch insights' });
    }
  };


  exports.getInsightsForFacebook = async (req, res) => {
    console.log("inside getInsights")
    let { startDate, endDate } = req.body;

    if (!startDate || !endDate) {
      const today = new Date().toISOString().split("T")[0];
      startDate = today;
      endDate = today;
    }
    
    console.log("startDate:", startDate);
    console.log("endDate:", endDate);
    // const user = req.user;
    // const accessToken = user.accessToken; // Assuming the accessToken is saved in the session
    const accessToken=req.headers.authorization
    console.log("insights accessToken",accessToken)
  
    try {
      // Fetch the user's Ad Account ID
      const adAccountId = await getAdAccountId(accessToken);
      console.log("Fetched Ad Account ID:", adAccountId);
  
      // Fetch insights for the Ad Account ID and the specified date range
      const insightsData = await getAdInsights(adAccountId, accessToken, startDate, endDate);
      console.log("insightsData",insightsData)
      res.json(insightsData); // Return insights data to the frontend
    } catch (err) {
      console.error('Error fetching insights:', err);
      res.status(500).json({ error: 'Failed to fetch insights' });
    }
  };

