#!/usr/bin/perl

use Digest::HMAC qw(hmac hmac_hex);
use Digest::SHA qw(sha256);

$key = 'A1C919268030A523A3DA7ED3431CF61B';
$data = 'password1';

print hmac_hex($data, $key, \&sha256);