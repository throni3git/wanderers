<?php

$str_json = file_get_contents('php://input');
$_POST = json_decode($str_json, true) ? : [];
$header = 'From: contact@sojus3000.de' . "\r\n" .
    'X-Mailer: PHP/' . phpversion();

$mail_success = -1;

$mail_success = mail('contact@sojus3000.de', $_POST['mail_heading'], $_POST['mail_content'], $header);

if ($_POST['DBG_CONTACT_TILE'] == TRUE) {
    $mail_success = mail('throni3b5@mail.de', $_POST['mail_heading'], $_POST['mail_content'], $header);
}

echo($mail_success);

?>