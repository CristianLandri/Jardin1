<?php
header('Content-Type: application/json');
ini_set('display_errors', 0); 
require_once 'conexion.php'; 

$usuario = 'Docente2';           
$clave_real = 'Jardin_2025';     

$hash = password_hash($clave_real, PASSWORD_DEFAULT);


$stmt = $conn->prepare("INSERT INTO docentes (usuario, contrasena) VALUES (?, ?)");
$stmt->bind_param('ss', $usuario, $hash);
if ($stmt->execute()) {
    echo json_encode(['ok' => true, 'msg' => 'Docente creado', 'id' => $stmt->insert_id]);
} else {
    echo json_encode(['ok' => false, 'error' => $conn->error]);
}

$stmt->close();
$conn->close();
