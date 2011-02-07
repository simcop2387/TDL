package Site::Pages::AJAJ::Login;
use strictures 1;

use base qw/ Site::Pages::JSON /;
use Site::Utils;
use Digest::HMAC qw(hmac_hex);
use Digest::SHA qw(sha256);

# GET takes a username and gives back a challenge for that user
# POST takes the HMAC of the users password hash and the challenge for authentication
# this means that the password hash never gets transmitted and it can be verified and not have to worry about attacks (currently in 2011)
# there is a DoS possible by someone requestion lots of challenges for a user that would prevent login.  this should be dealt with at the dispatch/webserver level instead

sub handle_POST {
  my ( $self ) = @_;

  my $data = $self->get_json();
  my ($username, $passhash) = @{$data}{qw/username password/};
  
  if (my $row = $self->schema->resultset('User')->find({username => $username})) {
    my $challenge = $row->lastchallenge();
    my $dbpass = $row->password();
    my $hmac = callhmac($challenge, $dbpass);
    
    if ($passhash eq $hmac) {
      my $uid = $row->uid; # should have a uid here, can only get one row from the database due to constraints
      my $key = make_session_key(); # get a new key, they aren't tied to the user or anything

      $self->res->cookies->{session} = $key; # should default to expire on browser close by default

      if (my $r=$self->schema->resultset('Session')->find({uid => $uid})) {
        $r->update({sessionkey=>$key,
               expires=>\[q[NOW() + interval '1 hour']],
        });
      } else {
        $self->schema->resultset('Session')->create({uid => $uid, sessionkey => $key, expires=>\[q[NOW() + interval '1 hour']]})
      };

      return $self->json_success;
    } else {
      return $self->json_failure;
    }
  } else {
    return $self->json_failure;
  }
}

sub handle_GET {
  my ( $self ) = @_;
  my ( $data ) = $self->get_json();
  my $username = $data->{username};

  if (my $row = $self->schema->resultset('User')->find({username => $username})) { # check for an existing user
    my $challenge = make_session_key(); # get a long string of digits
    $row->update({lastchallenge => $challenge});

    return $self->json_success(challenge => $challenge);
  } else {
    return $self->json_failure();
  }
}

srand(time()); # TODO: not fully secure i know but at the moment it's just for testing
my $chars = "0123456789ABCDEF";
my $len = length($chars);
sub make_session_key {
  local $_;

  for my $a (1..32) {
    $_.=substr($chars, rand()*$len, 1)
  }

    return $_;
}

sub callhmac {
  my ($challenge, $passhash) = @_;
# this may need a substr, need to investigate!
  return hmac_hex($passhash, $challenge, \&sha256);
}
