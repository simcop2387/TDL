package Site::Pages::AJAJ::Login;
use strictures 1;

use base qw/ Site::Pages::JSON /;
use Site::Utils;
use Digest::HMAC qw(hmac_hex);
use Digest::SHA qw(sha256);

sub handle_POST {
  my ( $self ) = @_;

  # TODO: change this system to be more secure
  # Ideally i'd like to use a challenge response instead but this will suffice for now

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
      # TODO this reveals too much, needed for debugging though.
      return $self->json_failure(expected => $hmac, got => $passhash, challenge => $challenge);
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
