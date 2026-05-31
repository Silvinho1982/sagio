<?php
$dbUrl = getenv('DATABASE_URL');

if (!$dbUrl) {
    throw new Exception('DATABASE_URL não configurada no Render.');
}

// Trata a URL
$banco_dados = parse_url($dbUrl);
if (!$banco_dados || !isset($banco_dados["host"])) {
    throw new Exception('Formato da DATABASE_URL inválido.');
}

$host = $banco_dados["host"];
$port = $banco_dados["port"] ?? 5432;
$user = $banco_dados["user"] ?? '';
$pass = $banco_dados["pass"] ?? '';
$dbname = isset($banco_dados["path"]) ? ltrim($banco_dados["path"], '/') : '';

$dsn = "pgsql:host=$host;port=$port;dbname=$dbname;sslmode=require";

// Cria a conexão (sem try/catch aqui, o erro sobe para o salvar_lead.php)
$pdo_postgres = new PDO($dsn, $user, $pass, [
    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
]);
?>