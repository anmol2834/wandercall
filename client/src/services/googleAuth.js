// Professional Google OAuth 2.0 Service
class GoogleAuthService {
  constructor() {
    this.clientId = import.meta.env.VITE_GOOGLE_CLIENT_I;
    this.clientSecret = import.meta.env.VITE_GOOGLE_CLIENT_S;
    this.redirectUri = `${window.location.origin}/auth/callback`;
    this.scope = 'openid email profile';
    this.isInitialized = false;
    this.tokenClient = null;
  }

  async initialize() {
    if (this.isInitialized) return;

    return new Promise((resolve, reject) => {
      if (window.google) {
        this.initializeGoogleAuth(resolve, reject);
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = () => this.initializeGoogleAuth(resolve, reject);
      script.onerror = () => reject(new Error('Failed to load Google OAuth'));
      document.head.appendChild(script);
    });
  }

  initializeGoogleAuth(resolve, reject) {
    try {
      // Initialize OAuth 2.0 token client only (avoid FedCM issues)
      this.tokenClient = window.google.accounts.oauth2.initTokenClient({
        client_id: this.clientId,
        scope: this.scope,
        callback: this.handleTokenResponse.bind(this),
        error_callback: this.handleError.bind(this)
      });

      this.isInitialized = true;
      resolve();
    } catch (error) {
      reject(error);
    }
  }



  handleTokenResponse(response) {
    if (response.access_token) {
      this.getUserProfile(response.access_token);
    } else if (this.onError) {
      this.onError(new Error('Failed to get access token'));
    }
  }

  handleError(error) {
    if (this.onError) {
      this.onError(error);
    }
  }

  async getUserProfile(accessToken) {
    try {
      const response = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Accept': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch user profile');
      }
      
      const userInfo = await response.json();
      userInfo.access_token = accessToken;
      
      if (this.onSuccess) {
        this.onSuccess(userInfo);
      }
    } catch (error) {
      if (this.onError) {
        this.onError(error);
      }
    }
  }

  async signIn() {
    await this.initialize();
    
    return new Promise((resolve, reject) => {
      this.onSuccess = resolve;
      this.onError = reject;

      // Use OAuth 2.0 flow with improved settings
      this.tokenClient.requestAccessToken({ 
        prompt: 'select_account',
        include_granted_scopes: true
      });
    });
  }

  // Generate OAuth 2.0 authorization URL
  generateAuthUrl(state = null) {
    const params = new URLSearchParams({
      client_id: this.clientId,
      redirect_uri: this.redirectUri,
      scope: this.scope,
      response_type: 'code',
      access_type: 'offline',
      prompt: 'consent'
    });
    
    if (state) {
      params.append('state', state);
    }
    
    return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
  }

  // Revoke tokens
  async revokeToken(token) {
    try {
      await fetch(`https://oauth2.googleapis.com/revoke?token=${token}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });
    } catch (error) {
      console.warn('Failed to revoke token:', error);
    }
  }

  // Sign out
  signOut() {
    if (window.google) {
      window.google.accounts.id.disableAutoSelect();
    }
    if (this.tokenClient) {
      this.tokenClient = null;
    }
  }

  decodeJWT(token) {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (error) {
      throw new Error('Invalid JWT token');
    }
  }
}

export const googleAuthService = new GoogleAuthService();