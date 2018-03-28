module.exports = {
    "extends": "airbnb",
    "env": {
      "browser": true,
      "node": true
    },
    "rules": {
      "react/jsx-filename-extension": [1, { "extensions": [".js", ".jsx"] }],
      "import/no-extraneous-dependencies": [
        "error", {
           "devDependencies": false,
           "optionalDependencies": false,
           "peerDependencies": false,
           "packageDir": "./"
        }],
      "react/prefer-stateless-function": [
        1, { "ignorePureComponents": false }],
      "max-len": [1, 120, 2, {ignoreComments: true}],
      "import/no-named-as-default": 0,
    },
};
