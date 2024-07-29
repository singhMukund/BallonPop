const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin'); // Import HtmlWebpackPlugin

module.exports = (env, argv) => {
  const isProduction = argv.mode === 'production';
  return {
    entry: './src/index.ts',
    mode: isProduction ? 'production' : 'development', // Set mode based on the environment
    module: {
      rules: [
        {
          test: /\.ts$/,
          use: 'ts-loader',
          exclude: /node_modules/,
        },
      ],
    },
    resolve: {
      extensions: ['.ts', '.js'],
    },
    devServer: {
      open: true,
      static: {
        directory: path.join(__dirname),
      },
      compress: false,
      port: 9000,
      hot: true,
    },
    output: {
      path: path.resolve(__dirname, 'public'),
      filename: 'bundle.js',
      clean: true, // Clean the output directory before each build
    },
    plugins: [
      new CopyWebpackPlugin({
        patterns: [{ from: 'src/assets', to: 'assets' }],
      }),
      new HtmlWebpackPlugin({
        template: 'index.html', // Path to your HTML template
      }),
    ],
    devtool: isProduction ? 'source-map' : 'inline-source-map', // Use source maps in development
  };
};
