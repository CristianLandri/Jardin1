<?php
header('Content-Type: application/json');
include 'conexion.php';

$nombre = $_POST['nombre'] ?? '';

if (empty($nombre)) {
  echo json_encode(['error' => 'Nombre vacío']);
  exit;
}

// Buscar usuario
$sql = "SELECT * FROM usuarios WHERE nombre = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $nombre);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
  // Ya existe
  $usuario = $result->fetch_assoc();
  $usuario['mensaje'] = 'Espero que te diviertas!';
} else {
  // Crear usuario nuevo
  $sql = "INSERT INTO usuarios (nombre, puntos) VALUES (?, 0)";
  $stmt = $conn->prepare($sql);
  $stmt->bind_param("s", $nombre);
  $stmt->execute();

  $usuario = ['nombre' => $nombre, 'puntos' => 0, 'mensaje' => 'registro exitoso'];
}

echo json_encode($usuario);
$conn->close();
?>
