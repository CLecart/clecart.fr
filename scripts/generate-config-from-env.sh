#!/usr/bin/env bash
set -euo pipefail

# Usage: copy .env.example -> .env, fill values, then run this script to create config.json
# It will write ./config.json which is gitignored.

if [ ! -f .env ]; then
  echo ".env not found. Copy .env.example to .env and fill values." >&2
  exit 1
fi

export $(grep -v '^#' .env | xargs)

cat > config.json <<EOF
{
  "emailjs": {
    "user": "${EMAILJS_USER}",
    "service": "${EMAILJS_SERVICE}",
    "template": "${EMAILJS_TEMPLATE}"
  }
}
EOF

echo "config.json generated (gitignored)."
