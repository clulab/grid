import os

from fastapi import FastAPI, Depends
from pandas import DataFrame
from starlette.middleware.cors import CORSMiddleware

class JavafxApp(FastAPI):
    def __init__(self, frontend):
        super().__init__()
        self.add_middleware(
            CORSMiddleware,
            allow_origins=['*'],
            allow_credentials=True,
            allow_methods=["*"],
            allow_headers=["*"],
        )
        self.frontend = frontend

        # The purpose of the functions below is to
        # - provide the entrypoint with @app.get
        # - log the event for debugging and bookkeeping purposes
        # - perform any necessary conversion on the parameters
        # - call into the frontend to perform the action
        # - return the right kind of result, probably forwarded from the frontend

        @self.get("/backend-ready")
        def backend_ready():
            return {"message": "Backend is ready!"}

        @self.get("/data/")
        def root(data: DataFrame = Depends(self.frontend.show_grid)): # Depends( my function that changes data for front end )
            return data # returns to front end

        @self.get("/showGrids/")
        async def showGrids():
            grids = []
            for file in os.listdir(self.frontend.path):
                if file.endswith("specs.csv"): # All Grids write out an anchor file
                    gridName = file.rsplit('_', 1) # But not all Grids are named by the anchor, they have their own filenames
                    grids.append(gridName[0])
            grids.sort()
            return {'grids': grids, 'filepath': self.frontend.path}

        @self.get("/processSupercorpus/")
        async def processSupercorpus(supercorpusFilepath: str):
            print(supercorpusFilepath)
            return self.frontend.backend.process_supercorpus(supercorpusFilepath)

        @self.get("/setSuperfiles/")
        async def setSuperfiles(corpusFilename: str, rowFilename: str):
            return self.frontend.backend.set_superfiles(corpusFilename, rowFilename)

        @self.get("/loadNewGrid/")
        async def loadNewGrid(corpusFilename: str, rowFilename: str, newFilename: str, newAnchor: str):
            print("loadNewGrid", newFilename, newAnchor)
            if self.frontend.backend.set_superfiles(corpusFilename, rowFilename):
                return self.frontend.load_new_grid(newFilename, newAnchor)
            else:
                return False

        @self.get("/loadGrid/")
        async def loadGrid(text: str):
            print("loading grid ", text)
            grid = self.frontend.load_grid(text)
            return grid

        @self.get("/saveGrid/")
        async def saveGrid():
            print("saving grid")
            return self.frontend.save_grid()

        @self.get("/saveAsGrid/")
        async def saveAsGrid(text: str):
            print("saving grid as ", text)
            return self.frontend.save_as_grid(text)

        @self.get("/deleteGrid/")
        async def deleteGrid(text: str):
            print("deleting ", text)
            return self.frontend.delete_grid(text)

        @self.get("/drag/")
        async def drag(row: str, col: int, sent: str):
            print("drag", f"Row: {row}\tCol: {col}\tText: {sent}")
            return self.frontend.move(row, col, sent)

        @self.get("/click/")
        async def click(row: str, col: int):
            print("click", row, col)
            return self.frontend.click(row, col)

        @self.get("/sentenceClick/")
        async def sentenceClick(text: str):
            print("sentenceClick", text)
            return self.frontend.sentence_click(text)

        @self.get("/editName/")
        async def editName(id: int, name: str):
            print("editName", id, name)
            return self.frontend.set_name(id, name)

        @self.get("/deleteFrozenColumn/")
        async def deleteFrozenColumn(id: int):
            print("deleteFrozen", id)
            return self.frontend.delete_frozen(id)

        @self.get("/textInput/")
        async def textInput(text: str):
            print("textInput", text)
            return self.frontend.create_cluster(text)

        @self.get("/setK/")
        async def setK(k: int):
            print("setK", k)
            return self.frontend.set_k(k)

        @self.get("/regenerate/")
        async def regenerate():
            print("regenerate")
            return self.frontend.regenerate()

        @self.get("/copyToggle/")
        async def copyToggle():
            print("copyToggle")
            return self.frontend.toggle_copy()

        @self.get("/trash/")
        async def trash(text: str):
            print("trash ", text)
            return self.frontend.trash(text)
