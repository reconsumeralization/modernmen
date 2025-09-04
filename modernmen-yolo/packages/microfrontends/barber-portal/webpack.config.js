const ModuleFederationPlugin = require('@module-federation/webpack').ModuleFederationPlugin;
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

module.exports = (env, argv) => {
  const isProduction = argv.mode === 'production';

  return {
    entry: './src/index.tsx',
    target: 'web',
    mode: argv.mode || 'development',
    devtool: isProduction ? 'source-map' : 'eval-cheap-module-source-map',

    devServer: {
      port: 3002,
      historyApiFallback: true,
      allowedHosts: 'all',
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
        'Access-Control-Allow-Headers': 'X-Requested-With, content-type, Authorization'
      }
    },

    resolve: {
      extensions: ['.tsx', '.ts', '.js', '.jsx'],
      alias: {
        '@': path.resolve(__dirname, 'src'),
      }
    },

    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: 'ts-loader',
          exclude: /node_modules/
        },
        {
          test: /\.css$/,
          use: [
            'style-loader',
            {
              loader: 'css-loader',
              options: {
                importLoaders: 1,
                modules: {
                  auto: true,
                  localIdentName: '[name]__[local]___[hash:base64:5]',
                },
              },
            },
            'postcss-loader'
          ]
        },
        {
          test: /\.(png|svg|jpg|jpeg|gif)$/i,
          type: 'asset/resource'
        }
      ]
    },

    plugins: [
      new ModuleFederationPlugin({
        name: 'barberPortal',
        filename: 'remoteEntry.js',
        exposes: {
          './App': './src/App.tsx',
          './BarberDashboard': './src/components/BarberDashboard.tsx',
          './ScheduleManagement': './src/components/ScheduleManagement.tsx',
          './AppointmentTracker': './src/components/AppointmentTracker.tsx',
        },
        shared: {
          react: {
            singleton: true,
            eager: true,
          },
          'react-dom': {
            singleton: true,
            eager: true,
          },
          'react-router-dom': {
            singleton: true,
          },
          '@supabase/supabase-js': {
            singleton: true,
          },
          '@tanstack/react-query': {
            singleton: true,
          },
          'lucide-react': {
            singleton: true,
          },
          'date-fns': {
            singleton: true,
          },
          'framer-motion': {
            singleton: true,
          }
        }
      }),
      new HtmlWebpackPlugin({
        template: './public/index.html',
        favicon: './public/favicon.ico'
      })
    ],

    optimization: {
      splitChunks: false,
      minimize: isProduction
    }
  };
};
