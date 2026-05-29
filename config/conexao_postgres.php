<?php
// banco.php ou onde estiver sua conexão PDO

// Se estiver rodando na nuvem (Render), ele lerá a variável de ambiente. 
// Se estiver local, você pode testar direto com a string do Neon ou manter o seu localhost.
$dbUrl = getenv('DATABASE_URL') ?: "pgsql:host=localhost;port=5432;dbname=Sagio;user=postgres;password=suasenha";

try {
    if (strpos($dbUrl, 'postgresql://') === 0) {
        // Formata a string do Neon para o padrão que o PDO do PHP entende
        $banco_dados = parse_url($dbUrl);
        $host = $banco_dados["host"];
        $port = $banco_dados["port"] ?? 5432;
        $user = $banco_dados["user"];
        $pass = $banco_dados["pass"];
        $dbname = ltrim($banco_dados["path"], '/');
        
        $dsn = "pgsql:host=$host;port=$port;dbname=$dbname;sslmode=require";
        $pdo = new PDO($dsn, $user, $pass, [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
        ]);
    } else {
        // Conexão padrão Localhost
        $pdo = new PDO($dbUrl, null, null, [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
        ]);
    }
} catch (PDOException $e) {
    // Retorna o erro em formato JSON para o nosso fetch do JS não quebrar
    header('Content-Type: application/json');
    echo json_encode([
        'status' => 'erro',
        'erro_detalhado' => 'Erro ao conectar ao banco de dados nuvem: ' . $e->getMessage()
    ]);
    exit;
}