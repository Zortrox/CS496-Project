<?php
error_reporting(E_ALL);

echo "<h2>TCP/IP Connection</h2>\n";

/* Get the port for the WWW service. */
$service_port = 2000;

/* Get the IP address for the target host. */
$address = "52.14.24.8";

/* Create a TCP/IP socket. */
$socket = socket_create(AF_INET, SOCK_STREAM, SOL_TCP);
if ($socket === false) {
	echo "socket_create() failed: reason: " . socket_strerror(socket_last_error()) . "\n";
} else {
	echo "OK.\n";
}

echo "Attempting to connect to '$address' on port '$service_port'...";
$result = socket_connect($socket, $address, $service_port);
if ($result === false) {
	echo "socket_connect() failed.\nReason: ($result) " . socket_strerror(socket_last_error($socket)) . "\n";
} else {
	echo "OK.\n";
}

//"{\"name\":\"IDEK\",\"room\":1234,\"game\":1,\"players\":5,\"port\":3005,\"pass\":\"pika\"}"

$in = array("name" => "IDEK", "game" => 1, "players" => 5, "pass" => "pika");
$strIn = json_encode($in);
$out = '';

echo "Sending HTTP HEAD request...";
socket_write($socket, $strIn, strlen($strIn));
echo "OK.\n";

echo "Reading response:\n\n";
while (($out = socket_read($socket, 1)) != "") {
	echo $out;
}

echo "Closing socket...";
socket_close($socket);
echo "OK.\n\n";
?>