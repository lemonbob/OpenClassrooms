<?php
// $url needs to equal something like = 'https://api.datamuse.com/words?sp=duck&max=100&md=p';
$cntr = $_POST["task"];
$word = $_POST["word"];
$max = $_POST["max"];

//$jsonurl = 'https://api.datamuse.com/words?ml=duck&max=10&md=p';
//$json = file_get_contents($jsonurl);
$jsonurl = 'https://api.datamuse.com/words?';
$json = file_get_contents($jsonurl .$cntr .$word .'&max=' .$max .'&md=p');

echo $json;
?>
