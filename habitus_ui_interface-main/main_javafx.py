
print("This is main_javafx.py")

import sys
import uvicorn

from javafx_app import JavafxApp
from backend.javafx_frontend import JavafxFrontend

def getApp():
    app = JavafxApp(
        frontend = JavafxFrontend(sys.argv[1], './process_files/', 6,'kmeans')
    )
    return app

uvicorn.run(getApp())
