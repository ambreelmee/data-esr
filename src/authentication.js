const Auth = {
  isAuthenticated() {
    if (new Date().getTime() - localStorage.getItem('setupTime') > 24 * 60 * 60 * 1000) {
      localStorage.clear();
    }
    return localStorage.getItem('token') !== null;
  },
};

export default Auth;
