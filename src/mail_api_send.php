<?php

require_once './common.php';

$str_json = file_get_contents('php://input');
$_POST = json_decode($str_json, true) ? : [];
$header = 'From: ' . $_POST['mail_from'] . "\r\n" .
    'X-Mailer: PHP/' . phpversion();

// $mail_success = mail($'contact@sojus3000.de', $_POST['mail_heading'], $_POST['mail_content'], $header);

$mail_success = mail($_POST['mail_to'], $_POST['mail_heading'], $_POST['mail_content'], $header);

?>