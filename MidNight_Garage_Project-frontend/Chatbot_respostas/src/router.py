from src.classifier import classificar

def responder(mensagem: str):
    intent = classificar(mensagem)

    if intent == "saudacao":
        return "Olá! Seja bem-vindo ao LuxCars."
    elif intent == "contato":
        return "Você pode nos contatar pelo telefone (11) 9999-9999 ou pelo email suporte@luxcars.com."
    elif intent == "veiculo":
        return "Certo, você quer informações sobre um carro específico. Nome, ano e preço foram identificados."
    elif intent == "negociacao":
        return "Os pagamentos são feitos apenas mediante negociação direta com nosso consultor especializado."
    elif intent == "promocao":
        return "Hoje temos condições exclusivas em alguns modelos. Deseja ver os carros em promoção?"
    elif intent == "devolucao":
        return "Você pode devolver em até 7 dias corridos. Deseja iniciar o processo de devolução?"
    else:
        return ("Não entendi sua pergunta. Talvez você esteja falando sobre: "
                "1) Saudação, 2) Contato, 3) Veículo, "
                "4) Negociação, 5) Promoções ou 6) Garantia.")
