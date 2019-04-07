<?php

$str_json = file_get_contents('php://input');
$_POST = json_decode($str_json, true) ? : [];
$header = 'From: contact@sojus3000.de' . "\r\n" .
    'X-Mailer: PHP/' . phpversion();

$mail_success = -1;

$message = 'Nachricht von ' . $_POST['mail_from'] . "\n\n" . $_POST['mail_content'];

if ($_POST['DBG_CONTACT_TILE'] == TRUE) {
    $mail_success = mail('throni3b5@mail.de', $_POST['mail_heading'], $message, $header);
} else {
    $mail_success = mail('throni3b5@mail.de', $_POST['mail_heading'], $message, $header);
    $mail_success = mail('contact@sojus3000.de', $_POST['mail_heading'], $message, $header);
}

if ($_POST['send_copy_to_sender'] === TRUE) {
    $senderHeading = 'A copy of your message to SOJUS3000';
    $senderMessage = "Hello,\n\nyou've sent a message to SOJUS3000. Here is a copy of your text:\n\n" . $_POST['mail_content'] . "\n\nGreetings\nSOJUS3000";
    mail($_POST['mail_from'], $senderHeading, $senderMessage);
}

echo($mail_success);

?>