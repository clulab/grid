# import unittest

from .backend import Backend
from .grid import Grid

class GridConfig1():
	def __init__(self):
		self.path = "../../../process_files/"
		self.supercorpus_filename = "wikipedia_article.csv"
		self.row_filename = "wikipedia_article_row_labels" # .csv"
		self.supercorpus_filepath = "../../../process_files/wikipedia_article/"
		self.k = 5
		self.anchor = "load_all"
		self.grid_filename = "wikipedia_article_grid"
		self.clustering_algorithm = "not_surdeanu"

class GridConfig2():
	def __init__(self):
		self.path = "../../../process_files/"
		self.supercorpus_filename = "wikipedia_artificial.csv"
		self.row_filename = "wikipedia_artificial_row_labels" # .csv"
		self.supercorpus_filepath = "../../../process_files/wikipedia_artificial/"
		self.k = 5
		self.anchor = "load_all"
		self.grid_filename = "wikipedia_artificial_grid"
		self.clustering_algorithm = "not_surdeanu"

class GridTest(): # (unittest.TestCase):
	def __init__(self):
		self.gridConfig = GridConfig1()
		self.backend: Backend = Backend(self.gridConfig.path)

	def setUp(self):
		# This below should produce from a filepath ending with {wikipedia_article}/
		# path/cleaned_{wikipedia_article}.csv
		# path/cleaned_{wikipedia_article}_doc_distances_lem.npy
		# path/cleaned_{wikipedia_article}_doc_vecs_lem.json
		# path/{wikipedia_article}.csv
		# path/{wikipedia_article}_row_labels.csv
		self.backend.process_supercorpus(self.gridConfig.supercorpus_filepath)

		# This below only works after the files have been generated.
		self.backend.set_superfiles(self.gridConfig.supercorpus_filename, self.gridConfig.row_filename)
		self.grid: Grid = self.backend.get_grid( \
			self.gridConfig.k, \
			self.gridConfig.anchor, \
			self.gridConfig.grid_filename, \
			self.gridConfig.clustering_algorithm \
		)
		# This below will create the files given {anchor}
		# path/{wikipedia_article}_{anchor}_cells.csv
		# path/{wikipedia_article}_{anchor}_documents.csv
		# path/{wikipedia_article}_{anchor}_specs.csv
		# path/{wikipedia_article}_{anchor}_tokens.csv
		# path/{wikipedia_article}_{anchor}_vectors.csv
		self.grid.dump()

		# The above 5 files should be turned into a single file for export or import.
		# If need be, they could be separate but zipped.

	def reuse(self):
		self.backend.set_superfiles(self.gridConfig.supercorpus_filename, self.gridConfig.row_filename)


	def test_delete_document(self):
		self.assertEqual(1, 1)

if __name__ == '__main__':
	# unittest.main()
	gridTest = GridTest()
	gridTest.setUp()
	gridTest.reuse()
