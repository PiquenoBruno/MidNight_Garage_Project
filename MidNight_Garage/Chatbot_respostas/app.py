from flask import Flask, request, jsonify
import joblib
import requests
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

clf = joblib.load("models/intent_classifier.pkl")
vectorizer = joblib.load("models/vectorizer.pkl")

def classificar(mensagem: str):
    X_test = vectorizer.transform([mensagem])
    return clf.predict(X_test)[0]

def responder(mensagem: str):
    intent = classificar(mensagem)

    if intent == "saudacao":
        return {"resposta": "Olá! Seja bem-vindo a MidNight-Garage."}
    elif intent == "contato":
        return {"resposta": "Você pode nos contatar pelo telefone (11) 9999-9999 ou pelo email suporte@MidNight.com."}
    elif intent == "veiculo":
        try:
            response = requests.post(
                "http://localhost:3000/chatbotfiltro",
                json={"text": mensagem}
            )
            if response.status_code == 200:
                return response.json()
            else:
                return {"erro": "Não foi possível consultar os veículos."}
        except Exception as e:
            return {"erro": f"Falha na integração: {str(e)}"}
    elif intent == "entrega":
        return {"resposta": "O frete varia conforme sua região. Qual CEP você gostaria de consultar?"}
    elif intent == "negociacao":
        return {"resposta": "Os pagamentos são feitos apenas mediante negociação direta com nosso consultor especializado."}
    elif intent == "promocao":
        return {"resposta": "Hoje temos condições exclusivas em alguns modelos. Deseja ver os carros em promoção?"}
    elif intent == "devolucao":
        return {"resposta": "Você pode devolver em até 7 dias corridos. Deseja iniciar o processo de devolução?"}
    else:
        return {"resposta": (
            "Não entendi sua pergunta. Talvez você esteja falando sobre: "
            "1) Saudação, 2) Contato, 3) Veículo, 4) Entrega, "
            "5) Negociação, 6) Promoções ou 7) Garantia."
        )}

@app.route("/chat", methods=["POST"])
def chat():
    data = request.get_json()
    mensagem = data.get("text", "")
    resposta = responder(mensagem)
    return jsonify(resposta)

if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5000, debug=True)
