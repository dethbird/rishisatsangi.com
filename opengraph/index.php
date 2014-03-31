<?php
	$api_key = "c4ca4238a0b923820dcc509a6f75849b";
	$api_url = "http://artistcontrolbox.com/api";

	$ch = curl_init();
	curl_setopt($ch, CURLOPT_URL, $api_url."/".$_GET['type']."/?id=".$_GET['id']."&api_key=".$api_key); 
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1); 
 	$output = json_decode(curl_exec($ch)); 
 	curl_close($ch);
 	$output = $output[0];

?>
<html>
	<head>
		<meta property="og:site_name" content="RishiSatsangi.com">
		<meta property="og:type" content="website">
		<meta property="og:title" content="<?=$output->name?>">
		<meta property="og:description" content="<?=$output->description?$output->description:'artwork by Rishi Satsangi'?>">
		<meta property="og:image" content="<?=$output->image_url?>">
	</head>
	<body>
		<script>
			document.location = "http://rishisatsangi.com/#/" + "<?=$_GET['type']?>/<?=$_GET['id']?>";
		</script>
		<!--<pre><?=print_r($output,1)?></pre>-->
	</body>
</html>