import { defineConfig } from 'dumi';

export default defineConfig({
  outputPath: 'docs-dist',
  themeConfig: {
    name: '@lobehub/ui-rn',
  },
  alias: {
    'react-native$': 'react-native-web',
    'react-native-svg$': 'react-native-svg-web',
  },
});
