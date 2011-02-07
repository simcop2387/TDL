#!/usr/bin/perl

use Digest::HMAC qw(hmac hmac_hex);
use Digest::SHA256;

sub myhash {
 my $ctx = Digest::SHA256::new(256);
 $ctx->hash($_) for @_;
 $digest = $ctx->digest();
}

$key = 'A1C919268030A523A3DA7ED3431CF61B';
$data = 'password1';
 print hmac_hex($data, $key, \&myhash);
