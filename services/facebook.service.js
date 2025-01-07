const axios = require('axios');

class FacebookService {
  async exchangeCodeForAccessToken(code) {
    const { appId, appSecret, callbackURL } = require('../config/facebook.config');
    const url = `https://graph.facebook.com/v12.0/oauth/access_token`;

    const params = {
      client_id: appId,
      redirect_uri: callbackURL,
      client_secret: appSecret,
      code,
    };

    const response = await axios.get(url, { params });
    return response.data; // Includes access_token
  }

  async getUserProfile(accessToken) {
    const url = 'https://graph.facebook.com/me';
    const params = { access_token: accessToken, fields: 'id,name,email' };
    const response = await axios.get(url, { params });
    return response.data;
  }

  async getBusinessAccounts(accessToken) {
    const url = 'https://graph.facebook.com/v12.0/me/businesses';
    const params = { access_token: accessToken };
    const response = await axios.get(url, { params });
    return response.data;
  }
}

module.exports = new FacebookService();
