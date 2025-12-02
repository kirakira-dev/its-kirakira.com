<?php
// API endpoint for KirunaNX update checker
// PHP version for traditional hosting

header('Content-Type: text/plain');

const KIRUNA_API_KEY = "3302b00ddb20209ad5b2a7158373a2f0bfafb2facd055f36f24a487371b59abb796ce611149b02c8d56c9eafcc859be07efca955a2bccfe083f62ee3951f1b58edc56430d69ea5643e93c00805cf1c2ba1915bb663cf6615c8594ce135e8cf874257b6bbd47e931f825203e9625fd9a2bf2ba561af99a0ccbde24782b8f69c9d4edaebf967fddea23025746a9f2a0fb636b33b4ab3330fcc075f362bef21a3148dc2ee3891b66144b3bcaddb24f06ffde423739d504113cec851e9a5577e3eac5844b5e7432c0dd0ed23b41b1f701f99fc67f993462fdad7c375b21b21bff96e27f0565feec08dc601529e9d5e73319ec454ece373c2c247711df59cc60c28687d7c9dfa6a79c9ef2f3e29d4ab2adadb01ebd861d9177d0affb745c4254e58db971b779897b60a56d68bd426c6566f0d015c4182570ad5beaae6a44e06f28dd7";

// Get key from headers, query params, or POST body
$key = $_SERVER['HTTP_X_API_KEY'] ?? $_GET['key'] ?? $_POST['key'] ?? null;

if ($key === KIRUNA_API_KEY) {
    echo "UpdateNone";
} else {
    echo "Invalid Request";
}
?>

