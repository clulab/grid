import json
import os.path
import pandas as pd

from . import corpus_parser
from .cluster import Cluster
from .corpus import Corpus
from .document import Document
from .grid import Grid
from .linguist import Linguist
from .row import Row
from .sentence import Sentence

class RowWithSentences:
	def __init__(self, row):
		self.row: Row = Row(row["name"])
		self.sentences: list[Sentence] = [Sentence(sentence) for sentence in row["sentences"]]

class RowWithDocuments:
	def __init__(self, rowWithSentences: RowWithSentences, start_index: int):
		self.row: Row = rowWithSentences.row
		self.documents: list[Document] = [self.to_document(sentence, index + start_index) for index, sentence in enumerate(rowWithSentences.sentences)]

	def to_document(self, sentence: Sentence, index: int) -> Document:
		document = Document(
			index,
			sentence.text,
			sentence.text,
			sentence.text.split(),
			sentence.before,
			sentence.after,
			# shuffle these a little
			[True, False, False, False, True] # there are five columns and the last should be True
		)
		document.set_vector(sentence.vector)
		return document

class JavafxBackend():
	def __init__(self, k, dirname, backend):
	# def __init__(self, backend):
		# self.filename = filename
		self.backend = backend
		# with open(filename, encoding="utf-8") as file:
		# 	data = json.load(file)
		# self.anchor = data["anchor"]
		# self.rows_with_sentences = [RowWithSentences(row) for row in data["rows"]]
		# sentence_count = 0
		# self.rows_with_documents = []
		# for row_with_sentences in self.rows_with_sentences:
		# 	self.rows_with_documents.append(RowWithDocuments(row_with_sentences, sentence_count))
		# 	sentence_count += len(row_with_sentences.sentences)
		# This below is the flat version.
		# self.sentences = [sentence for row_with_sentences in self.rows_with_sentences for sentence in row_with_sentences.sentences]
		# self.row_contents = dict([(row_with_documents.row.name, row_with_documents.documents) for row_with_documents in self.rows_with_documents])
		# This should be map of name to array of sentences
		# Turn it into map to array of documents
		self.set_superfiles("habitus.csv", "habitus_row_labels", dirname + "/")
		self.get_initial_grid(k)
		print("This is a test.")
	
	def process_supercorpus(self, supercorpus_filepath):
		return self.backend.process_supercorpus(supercorpus_filepath)
	
	def set_superfiles(self, supercorpus_filename, row_filename, dirname: str):
		return self.backend.set_superfiles(supercorpus_filename, row_filename, dirname)

	def get_initial_grid(self, k) -> Grid:
		# grid = Grid.generate(self.path, self.clean_supercorpus_filename, self.row_labels_filename, grid_filename, self.corpus, k, clustering_algorithm)
		# grid = Grid("path", "supercorpus_filename", "row_labels_filename", "unique_filename", None, 6, None, [])
		# return grid
		initial_grid = self.backend.get_grid(k, anchor="load_all", grid_filename="habitus", clustering_algorithm = "kmeans")
		return initial_grid
	
	def get_grid(self, k: int, anchor: str, grid_filename: str, clustering_algorithm: str) -> Grid:
		return self.backend.get_grid(k, anchor, grid_filename, clustering_algorithm)

	def load_grid(self, unique_filename: str, clustering_algorithm: str) -> Grid:
		return self.backend.load_grid(unique_filename, clustering_algorithm)

	def set_up_corpus(self, anchor: str):
		return self.backend.set_up_corpus(anchor)

	def load_clusters(self, cells, col_names: list[str]):
		return self.backend.load_clusters(cells, col_names)
	