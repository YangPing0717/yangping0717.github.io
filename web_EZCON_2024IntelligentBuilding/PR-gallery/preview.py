#!/usr/bin/env python3
"""從交付資料夾啟動僅供本機使用的靜態網頁預覽。"""

import functools
import http.server
import pathlib
import sys
import threading
import webbrowser


def main():
    if sys.version_info < (3, 7):
        print("本機預覽需要 Python 3.7 或更新版本。", file=sys.stderr)
        return 1
    preview_dir = pathlib.Path(__file__).resolve().parent
    if (preview_dir / "index.html").is_file():
        # 工具已隨網站複製：只服務目前的網站資料夾。
        entry_path = "/"
    elif (preview_dir / "3d-gallery" / "index.html").is_file():
        # 工具仍在交付檔外層：開啟內層的網站。
        entry_path = "/3d-gallery/"
    else:
        print("找不到同層的 index.html 或 3d-gallery/index.html，請確認網頁檔案完整。", file=sys.stderr)
        return 1

    handler = functools.partial(
        http.server.SimpleHTTPRequestHandler, directory=str(preview_dir)
    )
    # 使用作業系統分配的空閒埠，只接受本機 IPv4 連線。
    try:
        server = http.server.ThreadingHTTPServer(("127.0.0.1", 0), handler)
    except OSError as error:
        print("無法啟動本機預覽：{}".format(error), file=sys.stderr)
        return 1

    worker = threading.Thread(target=server.serve_forever, daemon=True)
    worker.start()
    url = "http://127.0.0.1:{}{}".format(server.server_port, entry_path)
    print("本機預覽已啟動：{}".format(url), flush=True)
    print("請保留此終端機視窗；結束預覽請在此按 Control + C。", flush=True)

    try:
        # 伺服器先開始接受連線，再交由預設瀏覽器開啟。
        try:
            opened = webbrowser.open(url)
        except (webbrowser.Error, OSError):
            opened = False
        if not opened:
            print("未能自動開啟瀏覽器，請手動開啟上方網址。", flush=True)
        while worker.is_alive():
            worker.join(timeout=0.5)
    except KeyboardInterrupt:
        print("\n正在停止本機預覽……", flush=True)
    finally:
        server.shutdown()
        server.server_close()
        worker.join()
    print("本機預覽已停止。", flush=True)
    return 0


if __name__ == "__main__":
    sys.exit(main())
