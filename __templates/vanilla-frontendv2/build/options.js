module.exports = {
  entry: {
    main: './src/index.js'
  },
  alias: {},
  dev: {
    env: '"development"',
    assetsPublicPath: '/',
    port: 8080,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    proxy: {},
  },
  build: {
    env: '"production"',
    assetsPublicPath: '/',
    outputDirectory: 'dist',
    vendor: []
  }
}