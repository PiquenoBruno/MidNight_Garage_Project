import joblib

# Carregar modelo e vetor
clf = joblib.load("models/intent_classifier.pkl")
vectorizer = joblib.load("models/vectorizer.pkl")

def classificar(mensagem: str):
    X_test = vectorizer.transform([mensagem])
    return clf.predict(X_test)[0]
