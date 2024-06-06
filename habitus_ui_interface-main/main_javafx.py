
print("This is main_javafx.py")

from javafx_app import JavafxApp
from backend.javafx_frontend import JavafxFrontend

# TODO change process_files into a command line argument
# TODO start npm to provide the UI
app = JavafxApp(
    frontend = JavafxFrontend('./process_files/', 6,'kmeans')
)
