
print("This is main_javafx.py")

import sys
import uvicorn

from javafx_app import JavafxApp
from backend.javafx_frontend import JavafxFrontend

def getApp():
    dirname = sys.argv[1]
    k = 6 # int(sys.argv[2])
    app = JavafxApp(
        frontend = JavafxFrontend(dirname, './process_files/', k, 'kmeans')
    )
    return app

if __name__ == "__main__":
    uvicorn.run(getApp())
