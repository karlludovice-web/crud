<?php

header("Content-Type: application/json");

require_once "db.php";


$data = json_decode(
    file_get_contents("php://input"),
    true
);


if (!isset($data["id"])) {

    http_response_code(400);

    echo json_encode([

        "success" => false,

        "message" =>
            "Record ID is required."

    ]);

    exit;

}


$id = intval(
    $data["id"]
);


if ($id <= 0) {

    http_response_code(400);

    echo json_encode([

        "success" => false,

        "message" =>
            "Invalid record ID."

    ]);

    exit;

}


$stmt = $conn->prepare(
    "DELETE FROM records
     WHERE id = ?"
);


$stmt->bind_param(
    "i",
    $id
);


if ($stmt->execute()) {

    echo json_encode([

        "success" => true,

        "message" =>
            "Record deleted successfully."

    ]);

} else {

    http_response_code(500);

    echo json_encode([

        "success" => false,

        "message" =>
            "Failed to delete record."

    ]);

}


$stmt->close();

$conn->close();

?>