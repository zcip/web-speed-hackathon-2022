/* eslint-disable @typescript-eslint/no-var-requires */
const path = require("path");

const CopyPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const BundleAnalyzerPlugin =
  require("webpack-bundle-analyzer").BundleAnalyzerPlugin;
const CompressionPlugin = require("compression-webpack-plugin");

function abs(...args) {
  return path.join(__dirname, ...args);
}

const SRC_ROOT = abs("./src");
const DIST_PUBLIC = abs("./dist/public");

/** @type {Array<import('webpack').Configuration>} */
module.exports = (env, { mode }) => {
  return {
    devtool: mode !== "production" ? "eval-source-map" : "source-map",
    entry: path.join(SRC_ROOT, "client/index.jsx"),
    mode,
    module: {
      rules: [
        {
          exclude: /[\\/]esm[\\/]/,
          test: /\.jsx?$/,
          use: {
            loader: "babel-loader",
            options: {
              presets: [["@babel/preset-env", {}], "@babel/preset-react"],
            },
          },
        },
      ],
    },
    name: "client",
    optimization: {
      splitChunks: {
        cacheGroups: {
          vendor: {
            chunks: "all",
            name: "vendor",
            test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
          },
        },
      },
    },
    output: {
      filename: mode === "development" ? "[name].js" : "[chunkhash].js",
      path: DIST_PUBLIC,
      publicPath: "/",
    },
    plugins: [
      new CopyPlugin({
        patterns: [
          {
            from: "public",
            globOptions: {
              ignore: ["**/index.html"],
            },
          },
        ],
      }),
      new HtmlWebpackPlugin({
        filename: "index.html",
        template: "public/index.html",
      }),
      new CompressionPlugin(),
      mode === "development"
        ? new BundleAnalyzerPlugin()
        : new BundleAnalyzerPlugin({ analyzerMode: "json" }),
    ].filter(Boolean),
    resolve: {
      extensions: [".js", ".jsx"],
    },
    target: "web",
  };
};
