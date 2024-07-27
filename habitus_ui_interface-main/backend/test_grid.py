from .backend import Backend
from .grid import Grid

class GridConfig1():
	def __init__(self):
		self.path = "../../../process_files/"
		self.path2 = None
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
		self.path2 = "../../../process_files/random/"
		self.supercorpus_filename = "wikipedia_artificial.csv"
		self.row_filename = "wikipedia_artificial_row_labels" # .csv"
		self.supercorpus_filepath = "../../../process_files/wikipedia_artificial/"
		self.k = 5
		self.anchor = "load_all"
		self.grid_filename = "wikipedia_artificial_grid"
		self.clustering_algorithm = "not_surdeanu"

class GridTest(): # (unittest.TestCase):
	def __init__(self):
		pass

	def write(self, gridConfig):
		backend: Backend = Backend(gridConfig.path)
		# This below should produce from a filepath ending with {wikipedia_article}/
		# path/cleaned_{wikipedia_article}.csv
		# path/cleaned_{wikipedia_article}_doc_distances_lem.npy
		# path/cleaned_{wikipedia_article}_doc_vecs_lem.json
		# path/{wikipedia_article}.csv
		# path/{wikipedia_article}_row_labels.csv
		backend.process_supercorpus(gridConfig.supercorpus_filepath)

		# This below only works after the files have been generated.
		backend.set_superfiles(gridConfig.supercorpus_filename, gridConfig.row_filename, gridConfig.path2)
		grid: Grid = backend.get_grid( \
			gridConfig.k, \
			gridConfig.anchor, \
			gridConfig.grid_filename, \
			gridConfig.clustering_algorithm \
		)
		# This below will create the files given {anchor}
		# path/{wikipedia_article}_{anchor}_cells.csv
		# path/{wikipedia_article}_{anchor}_documents.csv
		# path/{wikipedia_article}_{anchor}_specs.csv
		# path/{wikipedia_article}_{anchor}_tokens.csv
		# path/{wikipedia_article}_{anchor}_vectors.csv
		grid.dump()

		# The above 5 files should be turned into a single file for export or import.
		# If need be, they could be separate but zipped.

	def read(self, gridConfig):
		backend: Backend = Backend(gridConfig.path)
		backend.set_superfiles(gridConfig.supercorpus_filename, gridConfig.row_filename, gridConfig.path2)
		grid: Grid = backend.get_grid( \
			gridConfig.k, \
			gridConfig.anchor, \
			gridConfig.grid_filename, \
			gridConfig.clustering_algorithm \
		)
		grid.dump()

if __name__ == '__main__':
	gridTest = GridTest()

	# gridConfig = GridConfig1()
	# gridTest.write(gridConfig)
	# gridTest.read(gridConfig)

	gridConfig = GridConfig2()
	gridTest.read(gridConfig)
