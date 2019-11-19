module.exports = {
  "env": {
    "browser": true,
    "commonjs": true,
    "es6": true
  },
  "globals": {
    "gc": true,
    "Buffer": true,
    "__dirname": true,
    "mq": true,
    "db": true,
    "redis": true,
    "logger_debug": true,
    "process": true,
    "logger": true,
    "log4js": true,
  },
  "parser": "babel-eslint",
  "parserOptions": {
    "ecmaVersion": 2017,
    "sourceType": "module",
    "ecmaFeatures": {
      "jsx": true
    }
  },
  "rules": {
    "linebreak-style": [
      "error",
      "unix"
    ],
    "no-multiple-empty-lines": [
      "error", {"max": 1, "maxBOF": 1}
    ],
    "indent": ["error", 2],
    "quotes": [
      "error",
      "single"
    ],
    "semi": [
      "error",
      "never"
    ],
    "no-undef": 2
  }
}