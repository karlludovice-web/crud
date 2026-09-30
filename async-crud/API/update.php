<?php

header("Content-Type: application/json");

require_once "db.php";


$data = json_decode(
    file_get_contents("php://input"),
    true
);


if (
    !isset($data["id"]) ||
    !isset($data["title"]) ||
    !isset($data["user_id"])
) {

    http_response_code(400);

    echo json_encode([

        "success" => false,

        "message" =>
            "Missing required fields."

    ]);

    exit;

}


$id = intval(
    $data["id"]
);


$title = trim(
    $data["title"]
);


$user_id = intval(
    $data["user_id"]
);


if (
    $id <= 0 ||
    $title === "" ||
    $user_id <= 0
) {

    http_response_code(400);

    echo json_encode([

        "success" => false,

        "message" =>
            "Invalid data."

    ]);

    exit;

}


$stmt = $conn->prepare(
    "UPDATE records
     SET user_id = ?, title = ?
     WHERE id = ?"
);


$stmt->bind_param(
    "isi",
    $user_id,
    $title,
    $id
);


if ($stmt->execute()) {

    echo json_encode([

        "success" => true,

        "message" =>
            "Record updated successfully."

    ]);

} else {

    http_response_code(500);

    echo json_encode([

        "success" => false,

        "message" =>
            "Failed to update record."

    ]);

}


$stmt->close();

$conn->close();

?>