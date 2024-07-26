import unittest

from .backend import Backend
from .grid import Grid

class GridTest(unittest.TestCase):

	def setUp(self):
		path = "../../../process_files/"
		supercorpus_filename = "wikipedia_article.csv"
		row_filename = "wikipedia_article_row_labels.csv"
		supercorpus_filepath = "../../../process_files/wikipedia_article/"
		k = 5
		anchor = "load_all"
		grid_filename = "wikipedia_article_grid"
		clustering_algorithm = "not_surdeanu"
		
		backend: Backend = Backend(path)
		# This below should produce from a filepath ending with {wikipedia_article}/
		# path/cleaned_{wikipedia_article}.csv
		# path/cleaned_{wikipedia_article}_doc_distances_lem.npy
		# path/cleaned_{wikipedia_article}_doc_vecs_lem.json
		# path/{wikipedia_article}.csv
		# path/{wikipedia_article}_row_labels.csv
		backend.process_supercorpus(supercorpus_filepath)
		backend.set_superfiles(supercorpus_filename, row_filename)

		self.grid: Grid = backend.get_grid(k, anchor, grid_filename, clustering_algorithm)
		# This below will create the files given {anchor}
		# path/{wikipedia_article}_{anchor}_cells.csv
		# path/{wikipedia_article}_{anchor}_documents.csv
		# path/{wikipedia_article}_{anchor}_specs.csv
		# path/{wikipedia_article}_{anchor}_tokens.csv
		# path/{wikipedia_article}_{anchor}_vectors.csv
		self.grid.dump()

		# The above 5 files should be turned into a single file for export or import.
		# If need be, they could be separate but zipped.



	def test_delete_document(self):
		self.assertEqual(1, 1)

if __name__ == '__main__':
	unittest.main()
