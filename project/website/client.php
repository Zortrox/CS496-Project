<!DOCTYPE html>
<html>
<head>
	<title>Client</title>
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<link href="css/controller.css" rel="stylesheet">
</head>
<body>

<?php
$roomNum = isset($_GET["room"]) ? $_GET["room"] : -1;
$client = isset($_GET["c"]) ? $_GET["c"] : -1;

if ($roomNum > -1 && $client > -1) {
?>
<script>
	var room = <?php echo $roomNum; ?>;
	var isClient = <?php echo $client ?>;
</script>
<?php 
} else {
	echo "variables not correct<br>";
	echo $roomNum . "<br>";
	echo $client . "<br>";
}
?>

<!--  PHP variables finished  -->

<div id="wrapper">

<div id="left" class="no-select">&lt;</div>
<div id="right" class="no-select">&gt;</div>

</div>

<script src="js/controller/controller.js"></script>
</body>
</html>