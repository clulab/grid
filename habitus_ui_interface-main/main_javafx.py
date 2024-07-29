
print("This is main_javafx.py")

import sys
import uvicorn

from javafx_app import JavafxApp
from backend.javafx_frontend import JavafxFrontend

def getApp():
    app = JavafxApp(
        frontend = JavafxFrontend(sys.argv[1], './process_files/', sys.argv[2], 'kmeans')
        # frontend = JavafxFrontend('./process_files/', 6, 'kmeans')
    )
    return app

if __name__ == "__main__":
    uvicorn.run(getApp())
