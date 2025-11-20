# app.py — Código Python com as rotas corrigidas
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
#from google.genai.errors import APIError
from dotenv import load_dotenv # Adicionar para facilitar o carregamento da chave

load_dotenv() # Carrega variáveis de ambiente do arquivo .env, se existir

# ------------------------------------------------------------
# 1. Inicio flask
app = Flask(__name__)

# ------------------------------------------------------------
# 2. Configuração de ambiente
# Garantir que o servidor Flask rode na porta 3000 (padrão do JS)
NODE_API_URL = os.getenv("NODE_API_URL", "http://localhost:3001") 
# Lendo a chave da variável de ambiente (recomendado)
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY") 
# Se a chave não for encontrada, o client não inicializa, gerando um erro
if not GEMINI_API_KEY:
    print("ERRO: Variável de ambiente GEMINI_API_KEY não definida. O Chatbot não funcionará.")

# Inicialização do gemini
'''try:
    client = genai.Client(api_key=GEMINI_API_KEY) if GEMINI_API_KEY else None
except Exception as e:
    print(f"Erro ao inicializar o cliente Gemini: {e}")
    client = None'''
try:
    resposta_api = client.models.generate_content(
        model='gemini-2.5-flash',
        contents=prompt
    )
    conteudo = resposta_api.text
except genai.errors.APIError as e: # <--- Use genai.errors.APIError
    print("Erro Gemini API:", e)
    conteudo = "Desculpe, houve um erro ao gerar a resposta."
except Exception as e:
# ------------------------------------------------------------
# 3. Modelo local de classificação de intenções (mantido)
# ... (Seu código de frases_usuario, intencoes, TfidfVectorizer e modelo_intencao continua aqui) ...

    frases_usuario = [
    # ---- SAUDAÇÕES ----
    "Oi", "Olá", "E aí",
    "Bom dia", "Boa tarde", "Boa noite",
    "Tudo bem?", "Como vai?", "Oi, tudo certo?",
    "Olá, tudo bem?", "Oi, tudo jóia?", "Olá, como posso falar com vocês?",
    "E aí, tudo tranquilo?", "Fala aí!", "Salve!",
    "Oi, posso tirar uma dúvida?", "Boa noite pessoal", "Boa tarde, tudo ok?",
    "Bom dia, preciso de ajuda", "Opa, e aí?",
    "Oi, tudo beleza?", "Olá, preciso de uma informação",
    "Oi, como posso começar?", "Bom dia, estão atendendo?",
    "Boa tarde, tudo bom por aí?", "E aí, posso perguntar uma coisa?",
    "Olá, estou chegando agora", "Opa, tudo certo?",
    "Olá, preciso falar com alguém", "Oi, gostaria de iniciar um atendimento",


    # ---- DESPEDIDAS ----
    "Tchau", "Até mais", "Falou", "Até logo",
    "Até breve", "Valeu, obrigado", "Até a próxima",
    "Fico por aqui", "Nos vemos depois", "Tenha um bom dia",
    "Boa noite e obrigado", "Até amanhã",
    "Valeu pela ajuda", "Obrigado pelo atendimento",
    "Até qualquer hora", "Me despeço por aqui",
    "Nos falamos depois", "A gente conversa mais tarde",
    "Fico no aguardo", "Obrigado, até mais",
    "Encerrando por aqui", "Obrigado pela atenção",
    "Até logo mais", "Até a próxima vez", "Obrigado, tchau",
    "Beleza, até mais tarde", "Valeu, até outra hora",
    "Muito obrigado, até mais", "Vou indo nessa", "Falamos depois",


    # ---- LISTAR PRODUTOS ----
    "Quais motos vocês têm?", "Quero ver os carros disponíveis",
    "Vocês têm SUVs à venda?", "Me mostre os modelos de motos",
    "Tem carro automático?", "Quero saber as motos novas",
    "O que vocês têm em estoque?", "Quais veículos estão disponíveis?",
    "Mostre as opções de carros populares", "Tem carros 0km?",
    "Quero ver as opções de motos", "Vocês trabalham com seminovos?",
    "Mostrem os veículos à venda", "Quero ver as opções de SUVs",
    "Vocês têm carros esportivos?", "Quais são os veículos do catálogo?",
    "Pode me mostrar o estoque?", "Quero ver os modelos de carros",
    "Tem algum carro novo chegando?", "O que tem disponível hoje?",
    "Quais motos estão em estoque?", "Vocês têm picapes?",
    "Lista de veículos, por favor", "Quero ver todos os carros",
    "Quais são as opções de 2023?", "Tem moto econômica?", 
    "Tem opções pra iniciantes?", "Quero ver veículos de entrada", 
    "Quais modelos vocês trabalham?", "Mostra tudo que vocês vendem",


    # ---- CONSULTAR PREÇO ----
    "Qual o preço da moto?", "Quanto custa um carro?", "Qual o valor da Honda CG 160?",
    "Quanto está o modelo X?", "Pode me informar o preço da moto?",
    "Quero saber o valor do carro automático", "Qual o preço mais em conta?",
    "Qual é o preço do carro mais barato?", "Quanto custa um carro popular?",
    "Qual o preço do modelo mais recente?", "Quanto tá saindo a moto hoje?",
    "Qual o valor aproximado?", "Tem preço promocional?", "Quanto custa esse veículo?",
    "O valor muda conforme o pagamento?", "Pode passar o preço pra mim?",
    "Qual o valor dessa SUV?", "Quanto está custando esse modelo?", "Tem tabela de preços?",
    "Qual o valor atualizado?", "Quanto fica esse carro à vista?", "Tem algum desconto no preço?",
    "Qual é o valor base?", "Pode me dizer o preço final?", "Quanto está saindo a 0km?",
    "Esse modelo custa quanto?", "Quero saber o preço exato",
    "O preço varia muito?", "Quanto custa a versão básica?", "Qual o valor do modelo top de linha?",


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
    "Preciso de ajuda com uma dúvida", "Quero mais informações sobre vocês",
    "Como funciona a garantia?", "Vocês têm assistência técnica?",
    "Quais são os horários de atendimento?", "Posso agendar um test drive?",
    "Tenho uma dúvida", "Pode me ajudar?", "Estou com uma dúvida sobre os veículos",
    "Queria tirar uma dúvida rápida", "Pode me explicar melhor?",
    "Queria saber mais informações", "Poderia me orientar?",
    "Onde vocês ficam?", "Qual o endereço da loja?", "Vocês têm outras unidades?",
    "Vocês abrem aos fins de semana?", "A loja fica aberta até que horas?",
    "Tem atendimento online?", "Vocês atendem por WhatsApp?",
    "Tem suporte após a compra?", "Quero falar com um atendente",
    "Como funciona o atendimento de vocês?", "Vocês trabalham feriado?",
    "Posso fazer uma visita?", "Como faço para ser atendido?",
    "O que vocês fazem exatamente?", "Quais serviços vocês oferecem?",
    "Como funciona o processo de compra?", "Poderia me explicar?",


    # ---- DOCUMENTAÇÃO ----
    "Quais documentos preciso para comprar um carro?", "Preciso de CNH para financiar?",
    "Que documentos são necessários para o financiamento?",
    "Quais documentos preciso levar na hora da compra?", "Tem que ter comprovante de renda?",
    "Quais papéis são exigidos para fazer a compra?", "Preciso do RG e CPF?",
    "Posso comprar com documento provisório?", "Vocês ajudam com a documentação?",
    "O que é necessário para fazer o contrato?", "Preciso de comprovante de residência?",
    "Quais documentos o banco pede?", "Pode financiar sem comprovante de renda?",
    "Quais documentos precisam estar atualizados?", "É necessário CNH definitiva?",
    "Posso comprar só com RG?", "Documentos para pessoa jurídica?",
    "Quais documentos pessoais eu preciso?", "Tem que levar comprovante de endereço?",
    "Como funciona a análise de documentos?", "Documentação pode ser digital?",
    "Precisa apresentar holerite?", "Precisa ter nome limpo?",
    "Quais papéis são assinados?", "Vocês conferem todos os documentos?",
    "Preciso levar tudo impresso?", "Como envio os documentos?",
    "Posso enviar foto dos documentos?", "Que documentos são validados na compra?",
    "Preciso de título de eleitor?",
]

intencoes = (
    ["saudacao"] * 30 +
    ["despedida"] * 30 +
    ["listar_produtos"] * 30 +
    ["consultar_preco"] * 30 +
    ["financiamento"] * 10 +
    ["pagamento"] * 10 +
    ["entrega"] * 10 +
    ["outra"] * 30 +
    ["documentacao"] * 30

)

# Treinamento do modelo local
vectorizer = TfidfVectorizer()
X = vectorizer.fit_transform(frases_usuario).toarray()

label_encoder = LabelEncoder()
y_encoded = label_encoder.fit_transform(intencoes)

modelo_intencao = LogisticRegression(max_iter=200)
modelo_intencao.fit(X, y_encoded)


# ------------------------------------------------------------
# 4. Busca produtos da API Node.js (Proxy)

def fetch_produtos_from_node():
    # Esta função faz um proxy para o endpoint /produtos no seu servidor Node.js
    try:
        resp = requests.get(f"{NODE_API_URL}/produtos", timeout=5)
        resp.raise_for_status()
        return resp.json()
    except Exception as e:
        print("Erro ao buscar produtos na Node API (Verifique se o Node está rodando):", e)
        return []

# ------------------------------------------------------------
# 5. Criação do prompt com intenções do usuario
# ... (Seu código da função criar_prompt continua aqui) ...

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

    Explique as formas de pagamento aceitas: cartão de débito e crédito, boleto, PIX, financiamento, consórcio.
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
    1. Explique de forma clara quais documentos geralmente são necessários para a compra ou financiamento (ex: RG, CPF, comprovante de renda, comprovante de residência, CNH).
    2. Avise que podem variar conforme a forma de pagamento e o banco.
    3. Seja cordial e convide o cliente a enviar os documentos digitalmente ou comparecer à loja.
    """
    elif intencao == "documentacao":
        return f"""
    Você é um atendente de concessionária especializado em documentação de veículos.

    Pergunta do cliente:
    "{pergunta}"

    Instruções:
    1. Explique de forma clara quais documentos geralmente são necessários para a compra ou financiamento (ex: RG, CPF, comprovante de renda, comprovante de residência, CNH).
    2. Informe que os documentos podem variar conforme o banco ou forma de pagamento.
    3. Seja cordial e convide o cliente a enviar documentos digitalmente ou comparecer à loja.
    """

    elif intencao == "outra":
       return f"""
    Você é um assistente de concessionária de veículos.

    Pergunta do cliente:
    "{pergunta}"

    Instruções:
    1. Responda de forma educada, clara e objetiva.
    2. Caso a dúvida seja geral (sobre loja, suporte, serviços, funcionamento, dúvidas vagas), explique de forma simples.
    3. Ofereça ajuda adicional e oriente o cliente sobre como prosseguir.
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

@app.route("/api/chat", methods=["POST"]) # Rota alterada para "/api/chat"
def chatbot():
    if client is None:
        return jsonify({"erro": "Cliente Gemini não inicializado. Verifique a chave API."}), 500

    dados_req = request.get_json(force=True)
    # O frontend envia a mensagem na chave 'prompt'
    pergunta = dados_req.get("prompt", "").strip() 

    if not pergunta:
        return jsonify({"erro": "Campo 'prompt' vazio."}), 400

    # Classificação de Intenção 
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
        "text": conteudo
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
    # Garante que o Flask use a porta 3000, conforme esperado pelo frontend JS
    app.run(host="0.0.0.0", port=int(os.getenv("PORT", 3000)), debug=True)
