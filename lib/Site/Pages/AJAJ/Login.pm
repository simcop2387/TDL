package Site::Pages::AJAJ::Login;
use strictures 1;

use base qw/ Site::Pages::JSON /;
use Site::Utils;
use Digest::HMAC qw(hmac_hex);
use Digest::SHA qw(sha256);

use Site::Session;

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
    
    $row->update({lastchallenge => undef}); # clear the challenge so it can't be reused
    
    if ($passhash eq $hmac) {
      my $uid = $row->uid; # should have a uid here, can only get one row from the database due to constraints

      create_session ( $uid, $self->req, $self->res );

      return $self->json_success;
    } else {
      return $self->json_failure;
    }
  } else {
    return $self->json_failure;
  }
}

# SECURITY FLAW
# This should actually always return a challenge for non-existant users rather than a "failure"

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

sub callhmac {
  my ($challenge, $passhash) = @_;
# this may need a substr, need to investigate!
  return hmac_hex($passhash, $challenge, \&sha256);
}

1
