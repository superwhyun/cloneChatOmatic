const HtmlWebPackPlugin = require("html-webpack-plugin");
const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");

module.exports = {
  output: {
    publicPath: "http://localhost:8080/",
  },

  resolve: {
    extensions: [".jsx", ".js", ".json"],
  },

  devServer: {
    port: 8080,
  },

  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader", "source-map-loader"],
      },
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        },
      },
    ],
  },

  // ModuleFederationPlugin을 쓰면, 내가 만든 웹앱을 아무데나 모듈화해서 갖다 박을 수 있음.
  plugins: [
    new ModuleFederationPlugin({
      name: "chat",
      library: { type: "var", name: "Chat"},
      filename: "remoteEntry.js",
      remotes: {},
      exposes: {
        "./Chat" : "./src/Chat",
      },
      shared: require("./package.json").dependencies,
    }),
    new HtmlWebPackPlugin({
      template: "./src/index.html",
    }),
  ],
};
