module.exports = {
  testEnvironment: 'node',
  collectCoverageFrom: [
    'src/js/weapons/**/*.js',
    'src/js/characters/**/*.js',
    'src/js/game.js',
    '!src/js/**/__tests__/**',
  ],
};
