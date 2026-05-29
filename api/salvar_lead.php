<?php
// Habilita a exibição de erros para o nosso teste local
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Define o cabeçalho para retorno em formato JSON
header('Content-Type: application/json; charset=utf-8');

// Importa a conexão com o PostgreSQL
require_once __DIR__ . '/../config/conexao_postgres.php';

// Simula o recebimento de dados via POST (ou pega do formulário real)
// Para testar direto no navegador, se não houver dados via POST, usamos dados de teste
$nome       = $_POST['nome'] ?? 'Cliente Teste Postgres';
$email      = $_POST['email'] ?? 'teste_pg_' . time() . '@sagio.com.br';
$telefone   = $_POST['telefone'] ?? '(86) 99999-9999';
$lgpd       = $_POST['lgpd_consentimento'] ?? 'accepted';

try {
    // 1. Inicia o cronômetro de alta precisão
    $tempo_inicio = microtime(true);

    // 2. Prepara a transação para garantir integridade (Boa prática de Engenharia)
    $pdo_postgres->beginTransaction();

    // 3. Query 1: Inserir na tabela de Leads (Com os campos de consentimento da LGPD)
    $sql_lead = "INSERT INTO usuarios_leads (nome, email, telefone, lgpd_consentimento) 
                 VALUES (:nome, :email, :telefone, :lgpd) RETURNING id";
    
    $stmt_lead = $pdo_postgres->prepare($sql_lead);
    $stmt_lead->execute([
        ':nome'     => $nome,
        ':email'    => $email,
        ':telefone' => $telefone,
        ':lgpd'     => $lgpd
    ]);
    
    // Recupera o ID gerado pelo PostgreSQL usando o RETURNING id
    $id_lead = $stmt_lead->fetchColumn();

    // 4. Query 2: Inserir a solicitação de passeio vinculada a esse Lead
    $sql_passeio = "INSERT INTO solicitacoes_passeios (id_lead, tipo_passeio, data_passeio, quantidade_pessoas) 
                    VALUES (:id_lead, :tipo_passeio, :data_passeio, :quantidade_pessoas)";
    
    $stmt_passeio = $pdo_postgres->prepare($sql_passeio);
    $stmt_passeio->execute([
        ':id_lead'            => $id_lead,
        ':tipo_passeio'       => 'Passeio Tradicional Delta',
        ':data_passeio'       => date('Y-m-d', strtotime('+7 days')), // Próxima semana
        ':quantidade_pessoas' => 2
    ]);

    // Confirma as inserções no banco
    $pdo_postgres->commit();

    // 5. Para o cronômetro e calcula a diferença
    $tempo_fim = microtime(true);
    $tempo_execucao = ($tempo_fim - $tempo_inicio) * 1000; // Converte para milissegundos

    // Retorna a resposta de sucesso e a métrica de desempenho
    echo json_encode([
        'status' => 'sucesso',
        'banco' => 'PostgreSQL',
        'mensagem' => 'Lead e pedido salvos com total conformidade à LGPD!',
        'id_gerado' => $id_lead,
        'performance' => [
            'tempo_ms' => round($tempo_execucao, 4) . ' ms',
            'timestamp' => date('Y-m-d H:i:s')
        ]
    ], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);

} catch (Exception $e) {
    // Se algo der errado, desfaz tudo para não sujar o banco
    if ($pdo_postgres->inTransaction()) {
        $pdo_postgres->rollBack();
    }

    // Retorna o erro em formato JSON
    http_response_code(500);
    echo json_encode([
        'status' => 'erro',
        'banco' => 'PostgreSQL',
        'mensagem' => 'Falha ao processar a requisição.',
        'erro_detalhado' => $e->getMessage()
    ], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
}