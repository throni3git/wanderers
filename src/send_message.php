<?php

		require 'libs/PHPMailer/PHPMailerAutoload.php';
		$mail = new PHPMailer;

		$mail->setFrom('contact@sojus3000.de', 'SOJUS3000.de');

		// $mail->addAddress('david.pawlus@arcor.de');
		$mail->addAddress('contact@sojus3000.de');
		$mail->CharSet = "UTF-8";
		$mail->Encoding = 'quoted-printable';
		$mail->Subject = 'New Mail from Website SOJUS3000.de';
		// $body = str_replace($search,$replace,file_get_contents('../preisalarm/contentMatch.html'));
		// $mail->msgHTML($body, dirname(__FILE__));
			
		$text = 'Name: '.$_POST['fn'].' '.$_POST['ln'].'</br>';
		$text .= 'Mail: '.$_POST['em'].'</br>';
		$text .= 'Nachricht: '.$_POST['msg'].'</br>';

		$text1 = 'Name: '.$_POST['fn'].' '.$_POST['ln']."\r\n";
		$text1 .= 'Mail: '.$_POST['em']."\r\n";
		$text1 .= 'Nachricht: '.$_POST['msg']."\r\n";

		$mail->isHTML(true); 

		$mail->Body = $text;
		$mail->AltBody = $text1;
			
		if($mail->send()){
			echo 'success';
		}else{
			echo 'error';
			 echo 'Mailer Error: ' . $mail->ErrorInfo;
		}
?>