package Site::Pages::AJAJ::Register;
use strictures 1;

use base qw/ Site::Pages::JSON /;

sub handle_POST {
  my ( $self ) = @_;

  # TODO: change this system to be more secure
  # Ideally i'd like to use a challenge response instead but this will suffice for now

  my $data = $self->get_json();
  my ($username, $passhash, $email) = @{$data}{qw/username password email/}; # for future

  unless ($self->schema->resultset('User')->find({username => $username})) {
    my $row = $self->schema->resultset('User')->create({username => $username, password=>$passhash, email => $email});
    my $uid = $row->uid; # should have a uid here, can only get one row from the database due to constraints
    my $key = make_session_key(); # get a new key, they aren't tied to the user or anything

    $self->res->cookies->{session} = $key; # should default to expire on browser close by default

    $self->schema->resultset('Session')->create({uid => $uid, sessionkey => $key, expires=>\[q[NOW() + interval '1 hour']]});

    return $self->json_success;
  } else {
    return $self->json_failure(message => "Username $username is in use");
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
