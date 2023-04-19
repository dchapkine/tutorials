import sys
import os.path
from llama_index import GPTSimpleVectorIndex, SimpleDirectoryReader

index = None
if os.path.isfile("index.json"):
    print("compiled index already exist")
    index = GPTSimpleVectorIndex.load_from_disk('index.json')
else:
    print("recompiling index")
    documents = SimpleDirectoryReader('data').load_data()
    index = GPTSimpleVectorIndex.from_documents(documents)
    index.save_to_disk('index.json')
response = index.query(sys.argv[1])
print(response)
