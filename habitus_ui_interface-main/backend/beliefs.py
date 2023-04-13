import math
import numpy
import pandas
import random

from gensim.models import KeyedVectors

class Belief:
	def __init__(self, id: int, values: list) -> None:
		self.id: int = self.clean_integer(id, -1)
		self.belief: str = self.clean_string(values[0], "")
		self.title: str = self.clean_string(values[1], "")
		self.author: str = self.clean_string(values[2], "")
		self.year: int = self.clean_integer(values[3], -1)

	def clean_string(self, string: str, default_value: str) -> str:
		bad = string is None or string == "None" or (type(string) == float and math.isnan(string))
		some_string = string if not bad else default_value
		return some_string

	def clean_integer(self, integer: int, default_value: str) -> str:
		bad = integer is None or (type(integer) == float and math.isnan(integer))
		some_integer = str(integer) if not bad else default_value
		return some_integer

	def to_json(self) -> dict:
		return {
			"id": self.id,
			"belief": self.belief,
			"title": self.title,
			"author": self.author,
			"year": self.year
		}

class Beliefs():
	def __init__(self, path: str, prev_beliefs: str):
		self.encoding = "utf-8"
		if prev_beliefs:
			# Only read these once, if possible.
			self.beliefs = prev_beliefs.beliefs
			self.vectors = prev_beliefs.vectors
			self.model = prev_beliefs.model
		else:
			try:
				data_frame = pandas.read_table(path + "beliefs.tsv", index_col = 0, header = 0, encoding = self.encoding)
				self.beliefs: list[Belief] = [Belief(index, values) for index, values in enumerate(data_frame.values.tolist())]
				self.vectors = KeyedVectors.load_word2vec_format(path + "beliefs-vectors.txt")
				self.model = KeyedVectors.load_word2vec_format(path + "glove.6B.300d.txt")

			except:
				self.beliefs = None
				self.vectors = None
				self.model = None
		# if unique_filename:
		# 	try:
		# 		groundings_file_name = unique_filename + "_beliefs.tsv"
		# 		self.document_to_beliefs = self.read_groundings(path, groundings_file_name)
		# 	except:
		# 		self.document_to_beliefs = None
		# else:
		# 	self.document_to_beliefs = None

	# def read_groundings(self, path: str, groundings_file_name: str) -> list[list[int]]:
	# 	with open(path + groundings_file_name, "r", encoding = self.encoding) as file:
	# 		lines = [line.rstrip() for line in file]
	# 		beliefs = [[int(grounding_index) for grounding_index in line.split("\t")] for line in lines]
	# 	return beliefs

	def random_ground(self, text_index: int, text: str, k: int, model) -> list[Belief]:
		if self.beliefs:
			seed = hash(text)
			rndgen = random.Random(seed)
			beliefs = rndgen.sample(self.beliefs, k)
			return beliefs
		else:
			return []

	def vectorize(self, text: str):
		words = self.linguist.tokenize(text) # TODO: clean these up
		lower_words = [word.lower() for word in words]
		vector_words = [word for word in lower_words if word in self.model]
		if vector_words:
			vectors = [numpy.array(self.model[word]) for word in vector_words]
		else:
			vectors = [numpy.array([numpy.nan] * len(self.model['dog']))]
		sum = numpy.sum(vectors, axis = 0)
		length = numpy.linalg.norm(sum, axis = 0, ord = 2)
		norm = sum / length
		# list = [str(value) for value in norm.tolist()]
		# print(list) # need a vector of floats
		return norm

	def ranked_ground(self, text_index: int, text: str, k: int) -> list[Belief]:
		if self.beliefs and self.vectors:
			vector = self.vectorize(text)
			key_similarity_list = self.model.similar_by_vector(vector, k, None)
			beliefs = [self.beliefs[index] for index, similarity in key_similarity_list]
			return beliefs
		else:
			return []


	def ground(self, text_index: int, text: str, k: int) -> list[Belief]:
		return self.ranked_ground(text_index, text, k)
