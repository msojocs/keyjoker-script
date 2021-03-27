<?php
if($_GET['password'] != '******')exit;
if(!isset($_FILES['script']))exit;
print_r($_FILES);
$script = $_FILES['script'];
if($script['error'] != 0) exit;
move_uploaded_file($script['tmp_name'], __DIR__ . '/keyjoker.user.js');
copy(__DIR__ . '/keyjoker.user.js', __DIR__ . '/../../kj.user.js');