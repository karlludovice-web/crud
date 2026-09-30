<?php

header("Content-Type: application/json");

require_once "db.php";


// Get JSON data

$input = file_get_contents("php://input");

$data = json_decode($input, true);


// Check JSON

if ($data === null) {

    http_response_code(400);

    echo json_encode([
        "success" => false,
        "message" => "Invalid JSON data."
    ]);

    exit;

}


// Check required fields

if (
    !isset($data["title"]) ||
    !isset($data["user_id"])
) {

    http_response_code(400);

    echo json_encode([
        "success" => false,
        "message" => "Title and User ID are required."
    ]);

    exit;

}


// Get values

$title = trim($data["title"]);

$user_id = intval($data["user_id"]);


// Validate values

if (
    $title === "" ||
    $user_id <= 0
) {

    http_response_code(400);

    echo json_encode([
        "success" => false,
        "message" => "Invalid title or User ID."
    ]);

    exit;

}


// Insert record

$stmt = $conn->prepare(
    "INSERT INTO records (user_id, title, completed)
     VALUES (?, ?, 0)"
);


if (!$stmt) {

    http_response_code(500);

    echo json_encode([
        "success" => false,
        "message" => "Failed to prepare database query."
    ]);

    exit;

}


$stmt->bind_param(
    "is",
    $user_id,
    $title
);


// Execute

if ($stmt->execute()) {

    echo json_encode([
        "success" => true,
        "message" => "Record created successfully.",
        "id" => $stmt->insert_id
    ]);

} else {

    http_response_code(500);

    echo json_encode([
        "success" => false,
        "message" => "Failed to create record."
    ]);

}


$stmt->close();

$conn->close();

?>