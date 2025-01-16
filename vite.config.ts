import path, { resolve } from 'path';
import ts from 'typescript';
import dts from 'vite-plugin-dts';

import { defineConfig } from 'vite';

// Utility function to transform `paths` from TypeScript to Vite aliases
function resolveTsconfigPathsToAlias(): Record<string, string> {
    const tsConfigPath = path.resolve(__dirname, 'tsconfig.json');

    // Lire et analyser le fichier tsconfig.json
    const tsConfig = ts.readConfigFile(tsConfigPath, ts.sys.readFile).config;

    // Extraire les paths de tsconfig.json
    const paths = tsConfig.compilerOptions.paths || {};

    // Transformer les paths en alias pour Vite
    return Object.entries(paths).reduce((aliases, [key, value]) => {
        // Supprime `/*` de la clé et valeur
        const aliasKey = key.replace('/*', '');
        const aliasValue = path.resolve(
            __dirname,
            (value as string[])[0].replace('/*', '')
        );
        aliases[aliasKey] = aliasValue;

        return aliases;
    }, {} as Record<string, string>);
}

export default defineConfig({
    resolve: {
        alias: {
            ...resolveTsconfigPathsToAlias(),
        },
    },
    build: {
        lib: {
            entry: resolve(__dirname, 'src/state/index.ts'),
            name: 'airs',
            fileName: 'airs',
            formats: ['es', 'umd'],
        },
        rollupOptions: {
            external: ['rxjs'],
            output: {
                globals: {
                    rxjs: 'rxjs',
                },
            },
        },
    },
    plugins: [
        dts({
            include: ['src/state/**/*'], // Génère des types uniquement pour "state"
            outDir: 'dist', // Dossier de sortie des types
        }),
    ],
});
