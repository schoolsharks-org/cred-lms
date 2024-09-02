module.exports = {
    apps: [
      {
        name: 'sfl-sangram',
        script: 'server/dist/index.js',
        env: {
            MONGO_URI:"mongodb+srv://schoolsharks:UxwdRQLgJwtIS6uj@cluster0.k7bix.mongodb.net/",
            NODE_ENV:"production",
            PORT:5000,
            ACCESS_TOKEN_SECRET:"schoolsharksAccessTokenSecret",
            REFRESH_TOKEN_SECRET:"schoolsharksRefreshTokenSecret",  
            ACCESS_TOKEN_EXPIRY:"7d",
            REFRESH_TOKEN_EXPIRY:"7d",
            EMAIL_USER:"tech.schoolshark@gmail.com",
            EMAIL_PASS:"ojcw nuhm aeli ught",
          // Add other environment variables here
        }
      }
    ]
  };