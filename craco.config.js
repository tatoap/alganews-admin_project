const CracoLessPlugin = require('craco-less');

module.exports = {
  plugins: [
    {
      plugin: CracoLessPlugin,
      options: {
        lessLoaderOptions: {
          lessOptions: {
            javascriptEnabled: true,
          },
        },
      },
    },
  ],
  reactScriptsVersion: 'react-scripts' /* (default value) */,
  webpack: {
    mode: 'extends',
    configure: {
      module: {
        rules: [
          {
            test: /\.js$/,
            enforce: 'pre',
            use: ['source-map-loader'],
          },
        ],
      },
      ignoreWarnings: [/Failed to parse source map/],
    },
  },
};
