# app.py — Chatbot Flask integrado ao Gemini e API Node.js
# ------------------------------------------------------------
# Requer: pip install flask requests scikit-learn numpy python-dotenv google-genai
# ------------------------------------------------------------
# Bibliotecas importadas
from flask import Flask, request, jsonify
import requests
import numpy as np
import os
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.preprocessing import LabelEncoder
from google import genai
from google.genai.errors import APIError

# ------------------------------------------------------------
# 1. Inicio flask
app = Flask(__name__)

# ------------------------------------------------------------
# 2. Configuração de ambiente
NODE_API_URL = os.getenv("NODE_API_URL", "http://localhost:3000")
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "AIzaSyDlrXwCFHnfmLIfDVCegyLxpNNmIT1BJ5g")
# Inicialização do gemini
try:
    client = genai.Client(api_key=GEMINI_API_KEY)
except Exception as e:
    print(f"Erro ao inicializar o cliente Gemini: {e}")
    client = None

# ------------------------------------------------------------
# 3. Modelo local de classificação de intenções (expandido)

frases_exemplo = [
    # ---- SAUDAÇÕES ----
    "Oi",
    "Olá",
    "E aí",
    "Bom dia",
    "Boa tarde",
    "Boa noite",
    "Tudo bem?",
    "Como vai?",
    "Oi, tudo certo?",
    "Olá, tudo bem?",

    # ---- DESPEDIDAS ----
    "Tchau",
    "Até mais",
    "Falou",
    "Até logo",
    "Até breve",
    "Valeu, obrigado",
    "Até a próxima",
    "Fico por aqui",
    "Nos vemos depois",
    "Tenha um bom dia",

    # ---- LISTAR PRODUTOS ----
    "Quais motos vocês têm?",
    "Quero ver os carros disponíveis",
    "Vocês têm SUVs à venda?",
    "Me mostre os modelos de motos",
    "Tem carro automático?",
    "Quero saber as motos novas",
    "O que vocês têm em estoque?",
    "Quais veículos estão disponíveis?",
    "Mostre as opções de carros populares",
    "Tem carros 0km?",

    # ---- CONSULTAR PREÇO ----
    "Qual o preço da moto?",
    "Quanto custa um carro?",
    "Qual o valor da Honda CG 160?",
    "Quanto está o modelo X?",
    "Pode me informar o preço da moto?",
    "Quero saber o valor do carro automático",
    "Qual o preço mais em conta?",
    "Qual é o preço do carro mais barato?",
    "Quanto custa um carro popular?",
    "Qual o preço do modelo mais recente?",

    # ---- FINANCIAMENTO ----
    "Quero financiar uma moto",
    "Tem financiamento para carro?",
    "Posso parcelar o veículo?",
    "Quero saber como funciona o financiamento",
    "Vocês fazem crédito próprio?",
    "Posso dar entrada e financiar o resto?",
    "Como simulo um financiamento?",
    "Dá pra financiar sem entrada?",
    "Quais bancos fazem o financiamento?",
    "Quero simular as parcelas de um carro",

    # ---- PAGAMENTO ----
    "Como posso pagar?",
    "Vocês aceitam cartão de crédito?",
    "Posso pagar no boleto?",
    "Quais formas de pagamento aceitam?",
    "Posso dar entrada no PIX?",
    "Tem desconto à vista?",
    "Quais condições de pagamento vocês oferecem?",
    "Aceitam pagamento via transferência?",
    "Posso pagar metade no cartão e metade no dinheiro?",
    "Vocês parcelam sem juros?",

    # ---- ENTREGA ----
    "Qual o prazo de entrega?",
    "Em quanto tempo entregam o carro?",
    "Quanto tempo demora pra entregar a moto?",
    "Vocês entregam em outras cidades?",
    "A entrega é gratuita?",
    "Posso retirar o carro na loja?",
    "Vocês fazem entrega em domicílio?",
    "Quando o veículo fica pronto pra entrega?",
    "Tem opção de retirada rápida?",
    "Como funciona o processo de entrega?",

    # ---- OUTRAS ----
    "Preciso de ajuda com uma dúvida",
    "Quero mais informações sobre vocês",
    "Como funciona a garantia?",
    "Vocês têm assistência técnica?",
    "Quais são os horários de atendimento?",
    "Posso agendar um test drive?",

    # ---- DOCUMENTAÇÃO ----
  "Quais documentos preciso para comprar um carro?",
  "Preciso de CNH para financiar?",
  "Que documentos são necessários para o financiamento?",
  "Quais documentos preciso levar na hora da compra?",
  "Tem que ter comprovante de renda?",
  "Quais papéis são exigidos para fazer a compra?",
  "Preciso do RG e CPF?",
  "Posso comprar com documento provisório?",
  "Vocês ajudam com a documentação?",
  "O que é necessário para fazer o contrato?"

]

y = (
    ["saudacao"] * 10 +
    ["despedida"] * 10 +
    ["listar_produtos"] * 10 +
    ["consultar_preco"] * 10 +
    ["financiamento"] * 10 +
    ["pagamento"] * 10 +
    ["entrega"] * 10 +
    ["outra"] * 6 +
    ["documentacao"] * 10

)

# Treinamento do modelo local
vectorizer = TfidfVectorizer()
X = vectorizer.fit_transform(frases_exemplo).toarray()

label_encoder = LabelEncoder()
y_encoded = label_encoder.fit_transform(y)

modelo_intencao = LogisticRegression(max_iter=200)
modelo_intencao.fit(X, y_encoded)

# ------------------------------------------------------------
# 4. Busca produtos da API Node.js

def fetch_produtos_from_node():
    try:
        resp = requests.get(f"{NODE_API_URL}/produtos", timeout=5)
        resp.raise_for_status()
        return resp.json()
    except Exception as e:
        print("Erro ao buscar produtos na Node API:", e)
        return []

# ------------------------------------------------------------
# 5. Criação do prompt com intenções do usuario

def criar_prompt(intencao, pergunta, dados):
    if intencao == "saudacao":
        return f"""
Você é um assistente de concessionária de veículos.
Usuário disse: "{pergunta}"
Responda de forma amigável e acolhedora, dando boas-vindas e se colocando à disposição para ajudar.
"""

    elif intencao == "despedida":
        return f"""
Você é um assistente de concessionária de veículos.
Usuário disse: "{pergunta}"
Responda de forma cordial e natural, agradecendo o contato e desejando um bom dia/noite.
"""

    elif intencao == "listar_produtos":
        if not dados:
            contexto = "- (Nenhum produto retornado da API)"
        else:
            contexto = "\n".join([
                f"- {p.get('nome', 'Produto desconhecido')} — R$ {p.get('preco', '?')} — Estoque: {p.get('estoque', '?')}"
                for p in dados
            ])

        return f"""
Você é um assistente de vendas de concessionária que vende **carros e motos**.

Pergunta do cliente:
"{pergunta}"

Dados disponíveis:
{contexto}

Regras:
1. Liste apenas os produtos que estão acima.
2. Seja cordial, objetivo e natural.
3. Ofereça ajuda para test-drive ou mais informações.
"""

    elif intencao == "financiamento":
        return f"""
Você é um consultor de financiamento de concessionária.

Pergunta do cliente:
"{pergunta}"

Instruções:
1. Explique como funcionaria o financiamento (ex: entrada + 48x), mas avise que depende da análise de crédito.
2. Sugira alternativas com parcelas menores.
3. Seja cordial e convide o cliente para contato.
"""

    elif intencao == "consultar_preco":
        return f"""
Você é um atendente especializado em preços.

Pergunta do cliente:
"{pergunta}"

Instruções:
1. Informe o preço com clareza se houver dados.
2. Avise que o valor pode variar conforme forma de pagamento.
3. Ofereça opções de financiamento ou parcelamento.
"""

    elif intencao == "pagamento":
        return f"""
Você é um assistente de pagamentos de concessionária.

Pergunta:
"{pergunta}"

Explique as formas de pagamento aceitas: cartão, boleto, PIX, financiamento.
Seja cordial e convide o cliente a entrar em contato para detalhes.
"""

    elif intencao == "entrega":
        return f"""
Você é um atendente da área de entregas.

Pergunta:
"{pergunta}"

Explique prazos típicos, entrega em domicílio e retirada em loja.
Seja simpático e claro nas informações.
"""
    elif intencao == "documentacao":
      return f"""
  Você é um atendente de concessionária especializado em documentação de veículos.

  Pergunta do cliente:
  "{pergunta}"

  Instruções:
  1. Explique de forma clara quais documentos geralmente são necessários para a compra ou financiamento (ex: RG, CPF, comprovante de renda, CNH).
  2. Avise que podem variar conforme a forma de pagamento e o banco.
  3. Seja cordial e convide o cliente a enviar os documentos digitalmente ou comparecer à loja.
  """

    else:
        return f"""
Você é um assistente de concessionária de veículos.

Pergunta:
"{pergunta}"

Responda de forma cordial e útil.
"""

# ------------------------------------------------------------
# 6. Rota principal do chatbot

@app.route("/chatbot", methods=["POST"])
def chatbot():
    if client is None:
        return jsonify({"erro": "Cliente Gemini não inicializado."}), 500

    dados_req = request.get_json(force=True)
    pergunta = dados_req.get("pergunta", "").strip()

    if not pergunta:
        return jsonify({"erro": "Campo 'pergunta' vazio."}), 400

    X_new = vectorizer.transform([pergunta]).toarray()
    y_pred = modelo_intencao.predict(X_new)
    intencao_prevista = label_encoder.inverse_transform(y_pred)[0]

    produtos = fetch_produtos_from_node()

    prompt = criar_prompt(intencao_prevista, pergunta, produtos)

    try:
        resposta_api = client.models.generate_content(
            model='gemini-2.5-flash',
            contents=prompt
        )
        conteudo = resposta_api.text
    except APIError as e:
        print("Erro Gemini API:", e)
        conteudo = "Desculpe, houve um erro ao gerar a resposta."
    except Exception as e:
        print("Erro inesperado:", e)
        conteudo = "Desculpe, ocorreu um erro inesperado."

    return jsonify({
        "intencao": intencao_prevista,
        "resposta": conteudo
    })

# ------------------------------------------------------------
# 7. Proxy simples de produtos

@app.route("/produtos-proxy", methods=["GET"])
def produtos_proxy():
    produtos = fetch_produtos_from_node()
    return jsonify(produtos)

# ------------------------------------------------------------
# 8. Execução do Flask

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int(os.getenv("PORT", 3000)), debug=True)


