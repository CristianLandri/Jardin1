<?php
// Responder siempre JSON y evitar que warnings impriman HTML
header('Content-Type: application/json; charset=utf-8');
ini_set('display_errors', 0);
error_reporting(E_ALL & ~E_NOTICE & ~E_WARNING);
include 'conexion.php';

$nombre = $_POST['nombre'] ?? '';
$puntos = isset($_POST['puntos']) ? (int)$_POST['puntos'] : 0;

if (empty($nombre)) {
    echo json_encode(['error' => 'Falta el nombre del alumno']);
    exit;
}

try {
    $sql = "UPDATE usuarios SET puntos = puntos + ? WHERE nombre = ?";
    $stmt = $conn->prepare($sql);
    if (!$stmt) throw new Exception($conn->error);
    $stmt->bind_param("is", $puntos, $nombre);
    $stmt->execute();

    $sql = "SELECT puntos FROM usuarios WHERE nombre = ?";
    $stmt2 = $conn->prepare($sql);
    if (!$stmt2) throw new Exception($conn->error);
    $stmt2->bind_param("s", $nombre);
    $stmt2->execute();
    $result = $stmt2->get_result();
    $row = $result->fetch_assoc();
    $puntosTotales = $row['puntos'] ?? 0;

    $sql = "INSERT INTO puntos (nombre_alumno, puntos, ultima_actualizacion)
            VALUES (?, ?, NOW())
            ON DUPLICATE KEY UPDATE 
            puntos = VALUES(puntos),
            ultima_actualizacion = NOW()";
    $stmt3 = $conn->prepare($sql);
    if (!$stmt3) throw new Exception($conn->error);
    $stmt3->bind_param("si", $nombre, $puntosTotales);
    $stmt3->execute();

    echo json_encode(['ok' => true, 'puntos' => (int)$puntosTotales]);
} catch (Exception $e) {
    // Log error to server error log and return JSON error
    error_log('sumar_puntos error: ' . $e->getMessage());
    echo json_encode(['error' => 'Error interno al actualizar puntos']);
}

$conn->close();
?>
