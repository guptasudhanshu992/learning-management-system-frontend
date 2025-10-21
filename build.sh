#!/bin/bash
# build.sh - Build script for Cloudflare Pages

# Build the project
npm run build

# If the build succeeds, you can use the deploy command directly
# This won't run in the Cloudflare Pages environment, but it's useful locally
if [ $? -eq 0 ] && [ "$CI" != "true" ]; then
    echo "Build succeeded! You can now deploy with: npm run deploy"
fi

# Exit with the status of the build command
exit $?