import unittest

from .backend import Backend
from .grid import Grid

class GridTest(unittest.TestCase):

	def setUp(self):
		path = "./process_files/"
		supercorpus_filename = ""
		row_filename = ""
		supercorpus_filepath = "example"
		k = 5
		anchor = "mineral"
		grid_filename = "grid"
		clustering_algorithm = "not_surdeanu"
		
		backend: Backend = Backend(path)
		backend.set_superfiles(supercorpus_filename, row_filename)
		# This below should produce from a filepath
		# path/filepath.csv
		# path/cleaned_filepath.csv
		# path/filepath_row_labels.csv
		backend.process_supercorpus(supercorpus_filepath)

		self.grid: Grid = backend.get_grid(k, anchor, grid_filename, clustering_algorithm)

	def test_delete_document(self):
		self.assertEqual(len(self.grid.clusters), 6, "should have correct number of initial clusters")
		self.grid.delete_document(0, 2)
		self.assertEqual(len(self.grid.clusters), 6, "should have correct number of clusters after deleting one document")
		self.grid.delete_document(0, 2)
		self.assertEqual(len(self.grid.clusters), 5, "should have correct number of clusters after deleting two documents")

if __name__ == '__main__':
	unittest.main()
