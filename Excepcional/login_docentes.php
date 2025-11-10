<?php

header('Content-Type: application/json');
ini_set('display_errors', 0);
require_once 'conexion.php'; 

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['ok' => false, 'error' => 'Método no permitido']);
    exit;
}

$usuario = $_POST['usuario'] ?? '';
$contrasena = $_POST['contrasena'] ?? '';

if (empty($usuario) || empty($contrasena)) {
    echo json_encode(['ok' => false, 'error' => 'Faltan datos']);
    exit;
}


$stmt = $conn->prepare("SELECT id, contrasena FROM docentes WHERE usuario = ?");
$stmt->bind_param('s', $usuario);
$stmt->execute();
$res = $stmt->get_result();

if ($res->num_rows === 0) {
    echo json_encode(['ok' => false, 'error' => 'Usuario no encontrado']);
    exit;
}

$row = $res->fetch_assoc();
$id_docente = $row['id'];
$hash = $row['contrasena'];


if (!password_verify($contrasena, $hash)) {
    echo json_encode(['ok' => false, 'error' => 'Contraseña incorrecta']);
    exit;
}


$hora_entrada = date('Y-m-d H:i:s');
$stmt2 = $conn->prepare("INSERT INTO registros_docentes (docente_id, hora_entrada) VALUES (?, ?)");
$stmt2->bind_param('is', $id_docente, $hora_entrada);
$stmt2->execute();

echo json_encode([
    'ok' => true,
    'usuario' => $usuario,
    'registro_id' => $stmt2->insert_id
]);


$stmt2->close();
$stmt->close();
$conn->close();
