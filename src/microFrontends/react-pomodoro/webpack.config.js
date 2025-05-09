import { ModuleFederationPlugin } from 'webpack';

export default new ModuleFederationPlugin({
  name: 'pomodoro',
  filename: 'remoteEntry.js',
  exposes: { './Pomodoro': './src/components/Pomodoro.tsx' },
  shared: {
    react: { singleton: true },
    'react-dom': { singleton: true },
  },
});
