import mysql.connector

# Configurações de conexão
config = {
    "host": "localhost",
    "user": "root",
    "password": "8642B.f.t13062005",
}

try:
    conn = mysql.connector.connect(**config)
    cursor = conn.cursor()

    print("\nRemovendo banco antigo (se existir)...")
    cursor.execute("DROP DATABASE IF EXISTS garage")

    print("Criando novo banco 'garage'...")
    cursor.execute("CREATE DATABASE garage")
    cursor.execute("USE garage")

    # TABELA DE USUÁRIOS
    cursor.execute("""
    CREATE TABLE usuarios (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nome VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        senha VARCHAR(255) NOT NULL,
        telefone VARCHAR(20)
    )
    """)

    # TABELA DE ADMINISTRADORES
    cursor.execute("""
    CREATE TABLE administradores (
        id INT AUTO_INCREMENT PRIMARY KEY,
        usuario_id INT NOT NULL,
        FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
    )
    """)

    # TABELA DE VEÍCULOS
    cursor.execute("""
    CREATE TABLE veiculos (
        id INT AUTO_INCREMENT PRIMARY KEY,
        type ENUM('carro', 'moto') NOT NULL,
        name VARCHAR(100) NOT NULL,
        brand VARCHAR(100) NOT NULL,
        year INT NOT NULL,
        price DECIMAL(15,2) NOT NULL,
        image VARCHAR(255),
        description TEXT,
        vendido BOOLEAN NOT NULL DEFAULT FALSE
    )
    """)

    # TABELA DE PEDIDOS
    cursor.execute("""
    CREATE TABLE pedidos (
        id INT AUTO_INCREMENT PRIMARY KEY,
        usuario_id INT NOT NULL,
        veiculo_id INT NOT NULL,
        data_pedido DATE NOT NULL,
        status ENUM('pendente', 'aprovado', 'cancelado') NOT NULL DEFAULT 'pendente',
        FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
        FOREIGN KEY (veiculo_id) REFERENCES veiculos(id)
    )
    """)

    # INSERT DE USUÁRIOS
    usuarios = [
        ("João Silva", "joao@email.com", "123456", "11999999999"),
        ("Maria Souza", "maria@email.com", "abcdef", "11988888888"),
        ("Carlos Lima", "carlos@email.com", "senha123", "11977777777"),
        ("Ana Pereira", "ana@email.com", "admin123", "11966666666"),
        ("Pedro Santos", "pedro@email.com", "admin456", "11955555555")
    ]
    cursor.executemany(
        "INSERT INTO usuarios (nome, email, senha, telefone) VALUES (%s, %s, %s, %s)",
        usuarios
    )
    conn.commit()

    # INSERT DE ADMINISTRADORES
    administradores = [
        (4,),  # Ana Pereira
        (5,)   # Pedro Santos
    ]
    cursor.executemany(
        "INSERT INTO administradores (usuario_id) VALUES (%s)",
        administradores
    )
    conn.commit()

    # INSERT DE VEÍCULOS (caminhos corrigidos para /images/)
    veiculos = [
        ("carro", "Ferrari F8 Tributo", "Ferrari", 2022, 3500000.00,
        "/images/1763665796177-ferrari.jpg", "Supercarro italiano com motor V8", False),

        ("carro", "Lamborghini Aventador", "Lamborghini", 2021, 4200000.00,
        "/images/1763665934524-lambofrente.webp", "Modelo icônico da Lamborghini", True),

        ("carro", "Porsche 911 Turbo S", "Porsche", 2023, 1500000.00,
        "/images/1763666142228-911-turbo-S-1.jpg", "Esportivo alemão de alta performance", False),

        ("carro", "Rolls-Royce Ghost", "Rolls-Royce", 2020, 5000000.00,
        "/images/1763666266828-rolls_royce_ghost_1.jpg", "Luxo absoluto em quatro rodas", True),

        ("carro", "Bentley Continental GT V8", "Bentley", 2022, 2000000.00,
        "/images/1763666377873-Bentley-Continental-GT-V8-Brasil_(3).jpg", "Elegância e potência britânica", False),

        ("moto", "Honda CBR 1000RR", "Honda", 2021, 98000.00,
        "/images/1763666456301-honda-cbr-em-curitiba-pr-3f4a4f02.webp", "Moto esportiva de alta performance", False),

        ("moto", "Yamaha MT-07", "Yamaha", 2023, 46000.00,
        "/images/1763666541325-yamaha-mt07-abs-wmimagem08401455624.webp", "Modelo muito popular e versátil", False),

        ("moto", "BMW S1000RR", "BMW", 2022, 120000.00,
        "/images/1763666613780-OIP.webp", "Superbike alemã de alto nível", True)
    ]

    cursor.executemany(
        """INSERT INTO veiculos 
        (type, name, brand, year, price, image, description, vendido) 
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s)""",
        veiculos
    )
    conn.commit()

    # INSERT DE PEDIDOS
    pedidos = [
        (1, 1, "2025-11-10", "pendente"),
        (2, 3, "2025-11-11", "aprovado"),
        (3, 6, "2025-11-12", "pendente"),
        (1, 7, "2025-11-13", "cancelado"),
        (5, 5, "2025-11-14", "aprovado")
    ]
    cursor.executemany(
        "INSERT INTO pedidos (usuario_id, veiculo_id, data_pedido, status) VALUES (%s, %s, %s, %s)",
        pedidos
    )
    conn.commit()

    print("\nBanco 'garage' criado e inserido com sucesso, com caminhos de imagem funcionando!")

except mysql.connector.Error as err:
    print(f"\nErro: {err}")

finally:
    if cursor:
        cursor.close()
    if conn:
        conn.close()
