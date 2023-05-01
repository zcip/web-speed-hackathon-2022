/* eslint-disable @typescript-eslint/no-var-requires */
const path = require("path");

const nodeExternals = require("webpack-node-externals");

function abs(...args) {
  return path.join(__dirname, ...args);
}

const SRC_ROOT = abs("./src");
const DIST_ROOT = abs("./dist");

/** @type {import('webpack').Configuration} */
module.exports = (env, _argv) => {
  return {
    devtool: env.production ? "souce-map" : "eval",
    entry: path.join(SRC_ROOT, "server/index.js"),
    externals: [nodeExternals()],
    mode: env.production ? "production" : "development",
    module: {
      rules: [
        {
          exclude: /node_modules/,
          test: /\.(js|mjs|jsx)$/,
          use: {
            loader: "babel-loader",
            options: {
              presets: [
                [
                  "@babel/preset-env",
                  {
                    modules: "cjs",
                  },
                ],
              ],
            },
          },
        },
      ],
    },
    name: "server",
    output: {
      filename: "server.js",
      path: DIST_ROOT,
    },
    resolve: {
      extensions: [".mjs", ".js", ".jsx"],
    },
    target: "node",
  };
};
