#!/bin/bash
set -euo pipefail

package_dir="$(CDPATH= cd -- "$(dirname "${BASH_SOURCE[0]}")" && pwd -P)"

if ! command -v python3 >/dev/null 2>&1; then
  printf '%s\n' '找不到 Python 3。此工具需要這部 Mac 已有可使用的 python3；不會自動安裝任何軟體。' >&2
  exit 1
fi
if [[ ! -f "$package_dir/preview.py" ]]; then
  printf '%s\n' '找不到 preview.py，請先完整解壓縮交付檔。' >&2
  exit 1
fi

exec python3 "$package_dir/preview.py"
