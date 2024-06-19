class Sentence:
	def __init__(self, sentence):
		self.id = sentence["id"]
		self.text = sentence["text"]
		self.before = sentence.get("before", "")
		self.after = sentence.get("after", "")
		self.vector = sentence["vector"]
