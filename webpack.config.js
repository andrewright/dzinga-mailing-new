const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const translationsEn = require('./translationEn.json');
const mjml = ['Registration_Cmplete_Profile_block', 'Registration_Confirm_Account'];

module.exports = {
  mode: "development", // "production" | "development" | "none"
  // Chosen mode tells webpack to use its built-in optimizations accordingly.
  entry: "./index.js", // string | object | array
  // defaults to ./src
  // Here the application starts executing
  // and webpack starts bundling
  
  module: {
    rules: [
      {
        test: /\.mjml$/,
        use: [
          { loader: 'mjml-with-images-loader?onlyHtml' },
          {
            loader: 'ejs-html-loader',
            options: translationsEn
          },
          ]
      },
    ],
  },
  output: {
    // options related to how webpack emits results
    path: path.resolve(__dirname, "dist"), // string
    // the target directory for all output files
    // must be an absolute path (use the Node.js path module)
    filename: "[name].js", // string
    // the filename template for entry chunks
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'template.html',
      template: 'template.mjml',
      inject: false,
    })
  ],
};
