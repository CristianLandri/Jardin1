<?php
header('Content-Type: application/json');
$host = 'localhost';
$user = 'root';
$pass = '';
$db = 'jardin';

$conn = new mysqli($host, $user, $pass, $db);

$registro_id = $_POST['registro_id'] ?? '';
if ($registro_id) {
  $hora_salida = date('Y-m-d H:i:s');
  $stmt = $conn->prepare("UPDATE registros_docentes SET hora_salida = ? WHERE id = ?");
  $stmt->bind_param("si", $hora_salida, $registro_id);
  $stmt->execute();
  echo json_encode(['ok' => true]);
} else {
  echo json_encode(['error' => 'Falta registro_id']);
}
?>
