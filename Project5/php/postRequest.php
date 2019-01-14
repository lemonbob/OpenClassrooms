<?php
// $url needs to equal something like = 'https://api.datamuse.com/words?sp=duck&max=100&md=p';

$cntr = filter_input(INPUT_POST, "task");
$word = filter_input(INPUT_POST, "word");
$max = filter_input(INPUT_POST, "max");

$word = urlencode($word);

$jsonurl = 'https://api.datamuse.com/words?';
$json = file_get_contents($jsonurl .$cntr .$word .'&max=' .$max .'&md=p');

echo $json;
?>
