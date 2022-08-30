
print("This is main2.py")

import sys
sys.path.append("./backend")

from document import Document
from fastapi import FastAPI, Depends
from frontend import Frontend
from pandas import DataFrame
from starlette.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=['*'],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class UvicornFrontend(Frontend):
    def __init__(self, path: str, k: int):
        super().__init__(path)
        self.grid = self.backend.get_grid(k)
        self.copy_on = False
        self.clicked_col = None
        self.clicked_row = None
        self.show_grid()

    def find_document(self, text: str) -> Document:
        return next(document for document in self.grid.documents if document.readable == text)

    def get_clicked_documents(self) -> list[Document]:
        if self.clicked_col == None and self.clicked_row == None:
            documents = []
        else:
            documents = self.grid.get_clicked_documents(self.clicked_col, self.clicked_row)
        return documents

    def show_grid(self) -> dict:
        clusters = self.grid.clusters
        rows = self.grid.rows

        # This doesn't include the trashed sentences.
        sentences = [document.readable for document in self.grid.documents]
        clicked_sentences = [document.readable for document in self.get_clicked_documents()]
        col_num_to_name = {index: cluster.name for index, cluster in enumerate(clusters)}
        frozen_columns = [index for index, cluster in enumerate(clusters) if cluster.is_frozen()]

        # If documents are in multiple columns, they will show up multiple times here.
        # The order will not be the same as with main.py.
        delta = 1.0 / len(sentences)
        row_contents = {}
        # map of row name to map of col index to number of sentences in that row and col
        heat_map: dict[str, dict[int, float]] = {row.name: {} for row in rows}
        for row_index, row in enumerate(rows):
            row_contents[row.name] = []
            for col_index, cluster in enumerate(clusters):
                cell_documents = self.grid.get_clicked_documents(col_index, row_index)
                row_contents[row.name] += cell_documents
                count = len(cell_documents)
                heat_map[row.name][col_index] = delta * count

        return {
            "sentences": sentences,
            "clicked_sentences": clicked_sentences,
            "grid": heat_map,
            "col_num_to_name": col_num_to_name,
            "frozen_columns": frozen_columns,
            "row_contents": row_contents
        }

    def toggle_copy(self) -> bool:
        self.copy_on = not self.copy_on
        return self.copy_on

    def load_grid(self, anchor):
        self.grid = self.backend.load_grid(anchor)
        self.copy_on = False
        self.clicked_col = None
        self.clicked_row = None
        return self.show_grid()

    def save_grid(self) -> bool:
        self.grid.dump()
        return True

    def trash(self, text: str) -> dict:
        document = self.find_document(text)
        self.grid.delete_document(document)
        return self.show_grid()

    def regenerate(self) -> dict:
        self.grid.regenerate()
        self.clicked_col = None
        self.clicked_row = None
        self.clicked_documents = self.get_clicked_documents()
        return self.show_grid()

    def set_name(self, col_index: int, name: str) -> dict:
        cluster = self.grid.clusters[col_index]
        cluster.set_name(name, True)
        return self.show_grid()

    def set_k(self, k: int) -> dict:
        self.grid.set_k(k)
        return self.show_grid()

    def create_cluster(self, text: str) -> dict:
        self.grid.create_human_cluster(True, text)
        return self.show_grid()

    def click(self, row_name: str, col_index: int) -> list[str]:
        row_index = next(index for index, row in enumerate(self.grid.rows) if row.name == row_name)
        self.clicked_row = row_index
        self.clicked_col = col_index
        documents = self.get_clicked_documents()
        texts = [document.readable for document in documents]
        return texts

    # This moves the sentence from the currently clicked_col and clicked_row to
    # the new row and column.
    def move(self, row_index: str, col_index: int, text: str) -> dict:
        assert col_index >= 0 # We're not deleting sentences in this way.
        document = next(document for document in self.grid.clusters[self.clicked_col].documents if document.readable == text)
        if self.copy_on:
            self.grid.copy_document(document, self.clicked_col, col_index)
        else:
            self.grid.move_document(document, self.clicked_col, col_index)
        return self.show_grid()

frontend = UvicornFrontend('../process_files/', 6)

# The purpose of the functions below is to
# - provide the entrypoint with @app.get
# - log the event for debugging and bookkeeping purposes
# - perform any necessary conversion on the parameters
# - call into the frontend to perform the action
# - return the right kind of result, probably forwarded from the frontend

@app.get("/data")
def root(data: DataFrame = Depends(frontend.show_grid)): # Depends( my function that changes data for front end )
    return data # returns to front end

@app.get("/drag/{row}/{col}/{sent}")
async def drag(row: str, col: str, sent: str):
    print("drag", f"Row: {row}\tCol: {col}\tText: {sent}")
    row, col, sent = row, int(col), sent
    return frontend.move(row, col, sent)

@app.get("/click/{row}/{col}")
async def click(row: str, col: str):
    print("click", row, col)
    row, col = row, int(col)
    return frontend.click(row, col)

@app.get("/editName/{ix}/{newName}")
async def editName(ix: int, newName: str):
    print("editName", ix, newName)
    return frontend.set_name(int(ix), newName)

@app.get("/textInput/{text}")
async def textInput(text: str):
    print("textInput", text)
    return frontend.create_cluster(text)

@app.get("/setK/{k}")
async def setK(k: int):
    print("setK", k)
    return frontend.set_k(k)

@app.get("/regenerate/")
async def regenerate():
    print("regenerate")
    return frontend.regenerate()

@app.get("/copyToggle/")
async def copyToggle():
    print("copyToggle")
    return frontend.toggle_copy()

@app.get("/saveGrid/")
async def saveGrid():
    print("saving grid")
    return frontend.save_grid()

@app.get("/loadGrid/{text}")
async def loadGrid(text: str):
    print("loading grid ", text)
    grid = frontend.load_grid(text)
    return grid

@app.get("/trash/{text}")
async def trash(text: str):
    print("trash ", text)
    return frontend.trash(text)
