#!/usr/bin/perl

use feature qw(say);

use Digest::HMAC qw(hmac hmac_hex);
use Digest::SHA qw(sha256);
    use Crypt::PBKDF2 qw(PBKDF2_hex);
    my $pbkdf2 = Crypt::PBKDF2->new(
        hash_class => 'HMACSHA2', # this is the default
        iterations => 1000,      # so is this
        output_len => 32,        # and this
    );



$key = 'A1C919268030A523A3DA7ED3431CF61B';
$password = 'sindarin';
$salt = "simcop2387";

my $hex = $pbkdf2->PBKDF2_hex ($salt, $password);

say $hex;
say hmac_hex($hex, $key, \&sha256);
