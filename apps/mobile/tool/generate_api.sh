#!/usr/bin/env bash
# Regenerates packages/prismgo_api from apps/api/openapi.json.
# Needs Java 11+. Run `pnpm --filter @prismgo/api openapi` first if the API changed.
set -euo pipefail
cd "$(dirname "$0")/.."
rm -rf packages/prismgo_api
npx --yes @openapitools/openapi-generator-cli@2.25.2 generate -c openapi-generator.yaml
cd packages/prismgo_api
# Current json_serializable emits null-aware map elements, which need Dart 3.8+.
sed -i.bak "s/sdk: '>=3.5.0 <4.0.0'/sdk: '>=3.8.0 <4.0.0'/" pubspec.yaml && rm pubspec.yaml.bak
flutter pub get
dart run build_runner build --delete-conflicting-outputs
dart format lib >/dev/null
