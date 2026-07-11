from sentence_transformers import SentenceTransformer
import csv
import json
import nltk
import re
from nltk.corpus import stopwords, wordnet
from nltk.stem import WordNetLemmatizer

# 1. Setup NLTK data (run this once)
nltk.download('stopwords')
nltk.download('averaged_perceptron_tagger_eng')
nltk.download('wordnet')
nltk.download('omw-1.4')

# Initialize components
model = SentenceTransformer('BAAI/bge-small-en-v1.5')
lemmatizer = WordNetLemmatizer()
stop_words = set(stopwords.words('english'))

def get_wordnet_pos(treebank_tag):
    if treebank_tag.startswith('N'): return 'n' # Noun
    return None

def process_vocabulary(input_file, output_file):
    # Change 'words.txt' to your actual file name if different
    with open(input_file, 'r', encoding='utf-8') as f:
        raw_words = [line.strip().lower() for line in f if line.strip()]

    processed_data = {}
    
    print("Filtering and Lemmatizing...")
    for word in raw_words:
        # Strict Filtering Rules:
        if len(word) < 4: continue              # Remove short fragments
        if not re.match(r'^[a-z]+$', word): continue # Remove symbols/numbers
        if word in stop_words: continue         # Remove stop words
        
        # POS Tagging and Lemmatization
        pos_tag = nltk.pos_tag([word])[0][1]
        if pos_tag.startswith('NN'): # Only allow Nouns
            lemma = lemmatizer.lemmatize(word, pos='n')
            
            # Generate vector only for new, unique nouns
            if lemma not in processed_data:
                vec = model.encode(lemma).tolist()
                processed_data[lemma] = vec
                print(f"Processed: {lemma}")

    # Write to CSV
    with open(output_file, 'w', newline='', encoding='utf-8') as f:
        writer = csv.writer(f)
        writer.writerow(['word', 'vector'])
        for word, vec in processed_data.items():
            writer.writerow([word, json.dumps(vec)])
            
    print(f"Dataset complete: {len(processed_data)} unique nouns stored in {output_file}.")

if __name__ == "__main__":
    # Point this to your actual file name
    process_vocabulary('words.txt', 'output_ranks.csv')