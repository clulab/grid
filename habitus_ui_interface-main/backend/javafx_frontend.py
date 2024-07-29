import pandas as pd
import os
import time

from .document import Document
from .frontend import Frontend
from .javafx_backend import JavafxBackend

class JavafxFrontend(Frontend):
    def __init__(self, dirname: str, path: str, k: int, clustering_algorithm: str):
    # def __init__(self, path: str, k: int, clustering_algorithm: str):
        super().__init__(path)
        self.path = path
        self.k = k
        self.clustering_algorithm = clustering_algorithm
        self.copy_on = False
        self.clicked_col = None
        self.clicked_row = None
        self.track_actions = {'actor': [], 'action':[], 'time': [], 'object_type': [], 'object_value': [], 'other_details': []}
        self.backend = JavafxBackend(dirname, self.backend) # Replace the backend with a new one having access to the old.
        # self.backend = JavafxBackend(self.backend) # Replace the backend with a new one having access to the old.
        # self.grid = self.backend.get_initial_grid()
        backend = self.backend

        self.heat_map = {
            "cobalt locations 1":   { 0: 1.0, 1: 0.8, 2: 0.6, 3: 0.4, 4: 0.2 },
            "cobalt locations 2":   { 0: 0.8, 1: 0.6, 2: 0.4, 3: 0.2, 4: 0.0 }
        }
        # self.grid = {
        #     "filename": backend.filename,
        #     "anchor": backend.anchor,
        #     "sentences": backend.sentences,
        #     "clicked_sentences": [],
        #     "grid": self.heat_map,
        #     "col_num_to_name": [ "col_one", "col_two", "col_three", "col_four", "col_all" ], # col_num_to_name,
        #     "frozen_columns": [], #frozen_columns,
        #     "row_contents": backend.row_contents
        # }

    def find_document(self, text: str) -> Document:
        return next(document for document in self.grid.documents if document.readable == text)

    def get_clicked_documents(self) -> list[Document]:
        if self.clicked_col == None and self.clicked_row == None:
            documents = []
        else:
            documents = self.grid.get_clicked_documents(self.clicked_col, self.clicked_row)
        return documents

    def show_grid(self) -> dict:
        return self.backend.get_grid()
        # return self.grid
    
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
            "filename": self.grid.unique_filename,
            "anchor": self.grid.anchor,
            "sentences": sentences,
            "clicked_sentences": clicked_sentences,
            "grid": heat_map,
            "col_num_to_name": col_num_to_name,
            "frozen_columns": frozen_columns,
            "row_contents": row_contents
        }

    def load_new_grid(self, newFilename: str, newAnchor: str):
        k = 5
        self.grid = self.backend.get_grid(k, newAnchor, newFilename, self.clustering_algorithm)
        self.clicked_row, self.clicked_col = None, None
        self.update_track_actions(['human', 'new_grid', time.time(), 'grid', newAnchor, None])
        return self.show_grid()


    def toggle_copy(self) -> bool:
        self.copy_on = not self.copy_on
        return self.copy_on

    def load_grid(self, unique_filename):
        self.round = 0
        grid = self.backend.load_grid(unique_filename, self.clustering_algorithm)
        if grid != None: # If the grid exists, load it. If it doesn't, keep the current grid.
            self.grid = grid
        self.copy_on = False
        self.clicked_col = None
        self.clicked_row = None
        self.update_track_actions(['human', 'load', time.time(), 'grid', unique_filename, None])
        return self.show_grid()

    def save_grid(self) -> bool:
        print("Saving grid at ", self.grid.unique_filename)
        self.grid.dump()
        self.update_track_actions(['human', 'save', time.time(), 'grid', self.grid.unique_filename, None])
        return True

    def save_as_grid(self, filename) -> dict:
        print("Saving grid at ", self.grid.unique_filename)
        self.update_track_actions(['human', 'save_as', time.time(), 'grid', filename, "old_" + self.grid.unique_filename])
        self.grid.dump() # Make sure the old one is saved
        self.grid.unique_filename = filename
        self.grid.dump() # Save grid at the new filename
        return self.show_grid()

    def delete_grid(self, filename) -> bool:
        self.grid = None
        files = [filename + '_' + file for file in ['cells.csv', 'vectors.csv', 'tokens.csv', 'specs.csv', 'documents.csv']]
        for file in files:
            os.remove(self.path + file)
        self.update_track_actions(['human', 'delete', time.time(), 'grid', filename, None])

    def trash(self, text: str) -> dict:
        document = self.find_document(text)
        self.grid.delete_document(document)
        self.save_grid()
        self.update_track_actions(['human', 'trash', time.time(), 'sentence', text, None])
        return self.show_grid()

    def regenerate(self) -> dict:
        self.grid.regenerate()
        self.clicked_col = None
        self.clicked_row = None
        self.clicked_documents = self.get_clicked_documents()
        self.save_grid()
        self.update_track_actions(['human', 'update', time.time(), 'grid', self.grid.unique_filename, None])
        return self.show_grid()

    def set_name(self, col_index: int, name: str) -> dict:
        cluster = self.grid.clusters[col_index]
        cluster.set_name(name, True)
        self.save_grid()
        self.update_track_actions(['human', 'rename_cluster', time.time(), 'cluster', name, 'old_' + cluster.name])
        return self.show_grid()

    def set_k(self, k: int) -> dict:
        self.grid.set_k(k)
        self.update_track_actions(['human', 'set_k', time.time(), 'k', k, None])
        return self.show_grid()

    def create_cluster(self, text: str) -> dict:
        frozen_docs = self.grid.create_human_cluster(text)
        self.save_grid()
        self.update_track_actions(['human', 'create_cluster', time.time(), 'cluster', text, None])
        [self.update_track_actions(['human', 'freeze', time.time(), 'sentence', doc.readable, 'cluster_' + text]) for doc in frozen_docs]
        return self.show_grid()

    def delete_frozen(self, col_index: int) -> dict:
        name = self.grid.clusters[col_index].name
        self.grid.delete_cluster(col_index)
        self.save_grid()
        self.update_track_actions(['human', 'delete_cluster', time.time(), 'cluster', name, None])
        return self.show_grid()

    def click(self, row_name: str, col_index: int) -> list[str]:
        row_index = next(index for index, row in enumerate(self.grid.rows) if row.name == row_name)
        self.clicked_row = row_index
        self.clicked_col = col_index
        documents = self.get_clicked_documents()
        texts = [document.readable for document in documents]
        self.update_track_actions(['human', 'click', time.time(), 'cell', str(row_index) + '_' + str(col_index), None])
        return texts

    def sentence_click(self, text: str):
        document = next(document for document in self.grid.clusters[self.clicked_col].documents if document.readable == text)
        self.update_track_actions(['human', 'click', time.time(), 'sentence', text, None])
        return [document.pre_context, text.split('.',1)[1], document.post_context]

    # This moves the sentence from the currently clicked_col and clicked_row to
    # the new row and column.
    def move(self, row_index: str, col_index: int, text: str) -> dict:
        assert col_index >= 0 # We're not deleting sentences in this way.
        document = next(document for document in self.grid.clusters[self.clicked_col].documents if document.readable == text)
        if self.copy_on:
            self.grid.copy_document(document, self.clicked_col, col_index)
            self.update_track_actions(['human', 'copy', time.time(), 'sentence', text, 'from_'+str(self.clicked_col)+'_to_'+str(col_index)])
        else:
            self.grid.move_document(document, self.clicked_col, col_index)
            self.update_track_actions(['human', 'move', time.time(), 'sentence', text, 'from_'+str(self.clicked_col)+'_to_'+str(col_index)])
        self.save_grid()
        return self.show_grid()


    # If you want to turn tracking off, here's where to look  ================================================================================================================================================================
    # def record_machine_moves(self, t):
    #     for i, c in enumerate(self.grid.clusters):
    #         if not c.is_frozen():
    #             for d in c.documents:
    #                 if d not in c.human_documents: # Only look at docs the machine moves, which aren't seeded and aren't frozen
    #                     self.update_track_actions([self.round, 'machine', 'move', t, 'sentence', d.readable, 'to_' + str(i)]) # Can't say which column something has been moved from during reclustering

    # def update_grid_record(self):
    #     grid_path = self.path + 'grid_' + self.tracking_filename
    #     df = self.grid.dump(grid_path, write = False)
    #     df['round'] = self.round
    #     df.to_csv(grid_path, mode = 'a', header = not os.path.exists(grid_path))

    def update_track_actions(self, info, on = True): # Just set this to on = False if you don't want to be tracked
        self.track_actions['actor'].append(info[0])
        self.track_actions['action'].append(info[1])
        self.track_actions['time'].append(info[2])
        self.track_actions['object_type'].append(info[3])
        self.track_actions['object_value'].append(info[4])
        self.track_actions['other_details'].append(info[5])

        if on:
            pd.DataFrame(self.track_actions).to_csv(self.path + 'action_report.csv') # Just rewrite every time. Slower than appending?

    # ==================================================================================================================================================================================================================================
