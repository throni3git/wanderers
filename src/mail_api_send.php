<?php

require_once './common.php';

$str_json = file_get_contents('php://input');
$_POST = json_decode($str_json, true) ? : [];
$header = 'From: throni3b5@mail.de' . "\r\n" .
    'X-Mailer: PHP/' . phpversion();

// $mail_success = mail('throni3b5@mail.de', $_GET['mail_heading'], $_GET['mail_content'], $header);

$mail_success = mail($mail_to, $_POST['mail_heading'], $_POST['mail_content'], $header);

$mail_success = mail('throni3b5@mail.de', $_POST['mail_heading'], $_POST['mail_content'], $header);

$mail_success = mail('johannes@atomino-studio.de', $_POST['mail_heading'], $_POST['mail_content'], $header);


?>