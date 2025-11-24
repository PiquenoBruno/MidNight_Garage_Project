import os
import json
import joblib
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.naive_bayes import MultinomialNB

# Caminho absoluto para intents.json
base_dir = os.path.dirname(os.path.dirname(__file__))
data_path = os.path.join(base_dir, "data", "intents.json")

# Carregar intents
with open(data_path, "r", encoding="utf-8") as f:
    intents = json.load(f)

texts = []
labels = []

for intent, examples in intents.items():
    for ex in examples:
        texts.append(ex)
        labels.append(intent)

# Vetorização
vectorizer = CountVectorizer()
X = vectorizer.fit_transform(texts)

# Treinamento
clf = MultinomialNB()
clf.fit(X, labels)

# Salvar modelo e vetor
models_path = os.path.join(base_dir, "models")
joblib.dump(clf, os.path.join(models_path, "intent_classifier.pkl"))
joblib.dump(vectorizer, os.path.join(models_path, "vectorizer.pkl"))

print("✅ Modelo treinado e salvo em /models")
