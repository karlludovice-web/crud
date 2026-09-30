<?php

header("Content-Type: application/json");

require_once "db.php";

$sql = "SELECT id, user_id, title, completed FROM records ORDER BY id DESC";

$result = $conn->query($sql);

if (!$result) {

    http_response_code(500);

    echo json_encode([
        "success" => false,
        "message" => "Database query failed: " . $conn->error
    ]);

    exit;
}

$records = [];

while ($row = $result->fetch_assoc()) {

    $records[] = $row;

}

echo json_encode($records);

$conn->close();

?>