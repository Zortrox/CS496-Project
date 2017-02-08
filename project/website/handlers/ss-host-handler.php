<?php
/**
 * Created by PhpStorm.
 * User: Chris
 * Date: 2/6/2017
 * Time: 9:28 AM
 */


echo "THIS IS DATA!\r\n";
print_r($_POST);
print_r($_GET);
if(!empty($_POST)){
    echo "Post Data:";
    print_r($_POST);
}

?>