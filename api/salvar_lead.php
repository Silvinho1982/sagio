<?php
// 1. Blindagem contra HTML na tela
ini_set('display_errors', 0);
error_reporting(0);
header('Content-Type: application/json; charset=utf-8');

// 2. Proteção contra erros fatais do servidor
register_shutdown_function(function() {
    $error = error_get_last();
    if ($error !== null && in_array($error['type'], [E_ERROR, E_PARSE, E_CORE_ERROR, E_COMPILE_ERROR])) {
        http_response_code(500);
        echo json_encode(['status' => 'erro', 'mensagem' => 'Falha interna: ' . $error['message']]);
        exit;
    }
});

try {
    // 3. Conecta ao Banco
    $caminho_conexao = __DIR__ . '/../config/conexao_postgres.php';
    if (!file_exists($caminho_conexao)) {
        throw new Exception("Arquivo de configuração do banco não encontrado.");
    }
    require_once $caminho_conexao;

    if (!isset($pdo_postgres)) {
        throw new Exception("A conexão com o banco não pôde ser estabelecida.");
    }

    // 4. Recebe os dados do formulário
    $nome     = $_POST['nome'] ?? '';
    $email    = $_POST['email'] ?? '';
    $telefone = $_POST['telefone'] ?? '';
    $lgpd     = $_POST['lgpd_consentimento'] ?? 'accepted';

    if (empty($nome) || empty($email)) {
        throw new Exception("Nome e e-mail são obrigatórios.");
    }

    // 5. Inicia a transação e salva no banco
    $pdo_postgres->beginTransaction();

    $sql_lead = "INSERT INTO usuarios_leads (nome, email, telefone, lgpd_consentimento) VALUES (:nome, :email, :telefone, :lgpd) RETURNING id";
    $stmt_lead = $pdo_postgres->prepare($sql_lead);
    $stmt_lead->execute([':nome' => $nome, ':email' => $email, ':telefone' => $telefone, ':lgpd' => $lgpd]);
    
    $id_lead = $stmt_lead->fetchColumn();

    $sql_passeio = "INSERT INTO solicitacoes_passeios (id_lead, tipo_passeio, data_passeio, quantidade_pessoas) VALUES (:id_lead, 'Passeio Tradicional Delta', CURRENT_DATE, 2)";
    $stmt_passeio = $pdo_postgres->prepare($sql_passeio);
    $stmt_passeio->execute([':id_lead' => $id_lead]);

    $pdo_postgres->commit();

    // 6. Resposta de Sucesso
    echo json_encode(['status' => 'sucesso', 'mensagem' => 'Lead salvo com sucesso na nuvem!']);

} catch (Throwable $e) { // Captura qualquer tipo de erro (PDOException, Exception, Error)
    if (isset($pdo_postgres) && $pdo_postgres->inTransaction()) {
        $pdo_postgres->rollBack();
    }
    http_response_code(500);
    echo json_encode(['status' => 'erro', 'mensagem' => $e->getMessage()]);
}
?>