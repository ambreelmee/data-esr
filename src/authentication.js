const Auth = {
  isAuthenticated() {
    if (new Date().getTime() - localStorage.getItem('setupTime') > 60 * 60 * 1000) {
      localStorage.clear();
    }
    return localStorage.getItem('token') !== null;
  },
  authenticate(cb) {
    this.isAuthenticated = true;
    setTimeout(cb, 100); // fake async
  },
  signout(cb) {
    this.isAuthenticated = false;
    setTimeout(cb, 100); // fake async
  },
};

export default Auth;
