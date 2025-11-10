<?php
$conexion = new mysqli("localhost", "root", "", "jardin_db");

if ($conexion->connect_error) {
    die("Error de conexión: " . $conexion->connect_error);
}


if (isset($_POST['nombre'])) {
    $nombre = $conexion->real_escape_string($_POST['nombre']);

    $sql = "SELECT nombre, puntos, NOW() AS ultima_actualizacion FROM usuarios WHERE nombre = '$nombre' LIMIT 1";
    $resultado = $conexion->query($sql);

    if ($resultado && $resultado->num_rows > 0) {
        $fila = $resultado->fetch_assoc();
        echo json_encode($fila);
    } else {
        
        $conexion->query("INSERT INTO usuarios (nombre, puntos) VALUES ('$nombre', 0)");
        echo json_encode(["nombre" => $nombre, "puntos" => 0]);
    }
} 

else {
    $sql = "SELECT nombre, puntos, NOW() AS ultima_actualizacion FROM usuarios ORDER BY puntos DESC";
    $resultado = $conexion->query($sql);

    $datos = array();

    if ($resultado->num_rows > 0) {
        while ($fila = $resultado->fetch_assoc()) {
            $datos[] = $fila;
        }
    }

    echo json_encode($datos);
}

$conexion->close();
?>
