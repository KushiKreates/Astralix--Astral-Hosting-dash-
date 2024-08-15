import express from 'express';
import DiscordOAuth2 from 'discord-oauth2';

const app = express();
const oauth = new DiscordOAuth2({
  clientId: '1272588690748870757',
  clientSecret: 'QmwnxFAsJGz46T-yjzMUK4uOHO99Rj3g',
  redirectUri: 'http://localhost:3000/discord-callback', // Must match the redirect URI used in authorization request
  scope: 'identify email guilds.join',
});

app.get('/discord-callback', async (req, res) => {
  const { code } = req.query;

  try {
    // Exchange the code for an access token
    const { access_token } = await oauth.tokenRequest({
      code,
      grantType: 'authorization_code',
      redirectUri: 'http://localhost:3000/discord-callback',
    });

    // Fetch user information
    const user = await oauth.getUser(access_token);

    // Handle user data (e.g., create/update user in your database)
    // ...

    // Redirect or respond to the user
    res.redirect('/dashboard'); // Redirect to a logged-in page
  } catch (error) {
    console.error('Error during Discord OAuth2 callback', error.message);
    res.redirect('/login'); // Redirect back to login if something goes wrong
  }
});

app.listen(3000, () => {
  console.log('Server listening on port 3000');
});
