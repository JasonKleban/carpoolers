const HTMLInlineCSSWebpackPlugin = require('html-inline-css-webpack-plugin').default;
const HtmlInlineScriptPlugin = require('html-inline-script-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = (env) => ({
    entry: './src/index.tsx',
    mode: env.production ? 'production' : 'development',
    devtool: "inline-cheap-source-map",
    module: {
         rules: [
            {
               test: /\.(s(a|c)ss)$/,
               use: ['style-loader','css-loader', 'sass-loader']
            },
            { 
                test: /\.([cm]?ts|tsx)$/, 
                use: {
                    loader: "ts-loader",
                    options: {
                        compilerOptions: {
                            noEmit: false
                        }
                    }
                }
             }
         ]
     },
     resolve: {
       // Add `.ts` and `.tsx` as a resolvable extension.
       extensions: [".ts", ".tsx", ".js"],
       // Add support for TypeScripts fully qualified ESM imports.
       extensionAlias: {
        ".js": [".js", ".ts"],
        ".cjs": [".cjs", ".cts"],
        ".mjs": [".mjs", ".mts"]
       }
     },
     plugins: [
        new HtmlWebpackPlugin({
            filename: "index.html",
            inject: 'body',
            'meta': {
              'viewport': 'width=device-width, initial-scale=1, shrink-to-fit=no',
            },
            templateContent: `
              <html>
                <head><title>Mrs. Hillis' Carpoolers</title></head>
                <body>
                    <div id="root" />
                </body>
              </html>
            `}),
        env.production &&
            new HTMLInlineCSSWebpackPlugin(),
        env.production &&
            new HtmlInlineScriptPlugin(),
     ]
});