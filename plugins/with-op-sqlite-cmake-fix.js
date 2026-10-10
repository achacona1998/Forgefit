const { withDangerousMod } = require('@expo/config-plugins');
const fs = require('fs');
const path = require('path');

/**
 * Config plugin to fix op-sqlite CMake build for Expo CNG.
 * The issue: op-sqlite's CMakeLists.txt expects ReactAndroid::reactnative target
 * which is provided by ReactAndroid prefab from react-native-gradle-plugin.
 * In Expo CNG, we need to ensure CMake can find the ReactAndroid prefab.
 */
const withOpSqliteCmakeFix = (config) => {
  return withDangerousMod(config, [
    'android',
    async (config) => {
      const cmakeListsPath = path.join(
        config.modRequest.projectRoot,
        'node_modules',
        '@op-engineering',
        'op-sqlite',
        'android',
        'CMakeLists.txt'
      );

      if (!fs.existsSync(cmakeListsPath)) {
        console.warn('[withOpSqliteCmakeFix] CMakeLists.txt not found at:', cmakeListsPath);
        return config;
      }

      let content = fs.readFileSync(cmakeListsPath, 'utf8');

      // Check if already patched
      if (content.includes('find_package(ReactAndroid REQUIRED)')) {
        console.log('[withOpSqliteCmakeFix] CMakeLists.txt already patched');
        return config;
      }

      // Strategy: Add find_package(ReactAndroid) after project() declaration
      // and add ReactAndroid prefab paths to CMAKE_PREFIX_PATH
      const lines = content.split('\n');
      let insertIndex = 0;
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (line.startsWith('project(')) {
          insertIndex = i + 1;
          break;
        }
      }

      // Insert find_package and CMAKE_PREFIX_PATH addition
      const patchLines = [
        '',
        '# Added by withOpSqliteCmakeFix for Expo CNG compatibility',
        'find_package(ReactAndroid REQUIRED CONFIG)',
        'list(APPEND CMAKE_PREFIX_PATH "${CMAKE_SOURCE_DIR}/../../react-native/ReactAndroid")',
        'list(APPEND CMAKE_PREFIX_PATH "${CMAKE_SOURCE_DIR}/../../../react-native/ReactAndroid")',
        '',
      ];
      lines.splice(insertIndex, 0, ...patchLines);
      content = lines.join('\n');

      fs.writeFileSync(cmakeListsPath, content, 'utf8');
      console.log('[withOpSqliteCmakeFix] Patched CMakeLists.txt - added find_package(ReactAndroid) and CMAKE_PREFIX_PATH');

      return config;
    },
  ]);
};

module.exports = withOpSqliteCmakeFix;