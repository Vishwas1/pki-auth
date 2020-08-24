module.exports = {
  baseUrl: process.env.NODE_ENV === 'production'
    ? '/crypto/'
    : '/',
  devServer: {
      port: 9001
    }
}
