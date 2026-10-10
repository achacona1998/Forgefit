const { withDangerousMod } = require('@expo/config-plugins');
const fs = require('fs');
const path = require('path');

/**
 * Config plugin to fix expo-sqlite download from sqlite.org.
 * The issue: EAS workers can't reach www.sqlite.org due to network restrictions.
 * Fix: Patch the download URL to use GitHub releases mirror which is more reliable in CI/CD.
 */
const withExpoSqliteDownloadFix = (config) => {
  return withDangerousMod(config, [
    'android',
    async (config) => {
      const expoSqliteGradlePath = path.join(
        config.modRequest.projectRoot,
        'node_modules',
        'expo-sqlite',
        'android',
        'build.gradle'
      );

      if (!fs.existsSync(expoSqliteGradlePath)) {
        console.warn('[withExpoSqliteDownloadFix] expo-sqlite build.gradle not found at:', expoSqliteGradlePath);
        return config;
      }

      let content = fs.readFileSync(expoSqliteGradlePath, 'utf8');

      // Check if already patched
      if (content.includes('download_fixed') || content.includes('github.com/sqlite')) {
        console.log('[withExpoSqliteDownloadFix] Already patched');
        return config;
      }

      // The download URL pattern in expo-sqlite:
      // src("https://www.sqlite.org/2024/sqlite-amalgamation-${SQLITE_VERSION}.zip")
      const sqliteOrgPattern = /https:\/\/www\.sqlite\.org\/2024\/sqlite-amalgamation-\$\{SQLITE_VERSION\}\.zip/;
      
      if (sqliteOrgPattern.test(content)) {
        // Use GitHub releases mirror for SQLite - more reliable in CI/CD
        // SQLite releases are mirrored at github.com/sqlite/sqlite
        // Version 3.45.3 corresponds to SQLITE_VERSION=3450300
        const mirrorUrl = 'https://github.com/sqlite/sqlite/releases/download/version-3.45.3/sqlite-amalgamation-${SQLITE_VERSION}.zip';
        
        content = content.replace(sqliteOrgPattern, mirrorUrl);
        
        // Add a marker comment
        content = content.replace(
          'def SQLITE_VERSION',
          '// download_fixed: patched to use GitHub mirror\n// original: https://www.sqlite.org/2024/sqlite-amalgamation-${SQLITE_VERSION}.zip\ndef SQLITE_VERSION'
        );
        
        fs.writeFileSync(expoSqliteGradlePath, content, 'utf8');
        console.log('[withExpoSqliteDownloadFix] Patched download URL to use GitHub releases mirror');
      } else {
        console.warn('[withExpoSqliteDownloadFix] Could not find sqlite.org download pattern in build.gradle');
        console.log('[withExpoSqliteDownloadFix] First 500 chars:', content.substring(0, 500));
      }

      return config;
    },
  ]);
};

module.exports = withExpoSqliteDownloadFix;