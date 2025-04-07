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
  extraBabelPresets: ['@babel/preset-react'],
  extraBabelPlugins: ['@babel/plugin-transform-react-jsx'],
  chainWebpack(memo) {
    memo.module
      .rule('js')
      .include.add(/react-native-markdown-display/)
      .add(/react-native-mathjax-html-to-svg/)
      .add(/react-native-shiki-engine/)
      .end()
      .use('babel-loader')
      .loader('babel-loader')
      .options({
        presets: [
          '@babel/preset-react',
          [
            '@babel/preset-env',
            {
              modules: false,
              targets: {
                esmodules: true,
              },
            },
          ],
        ],
        plugins: ['@babel/plugin-transform-react-jsx'],
      });
    return memo;
  },
});
