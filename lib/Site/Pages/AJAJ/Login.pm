package Site::Pages::AJAJ::Login;
use strictures 1;

use base qw/ Site::Pages /;

sub handle_POST {
  my ( $self ) = @_;

  # TODO: change this system to be more secure
  # Ideally i'd like to use a challenge response instead but this will suffice
  $self->res->headers({'Content-Type' => 'application/json'});

  my $data = $self->get_json('data');
  my ($username, $passhash) = @{$data}{qw/username password/};
  
  if (my $row = $self->schema->resultset('User')
    ->find({username => $username, password => $passhash})) {
    my $uid = $row->uid; # should have a uid here, can only get one row from the database due to constraints
    my $key = make_session_key(); # get a new key, they aren't tied to the user or anything

    $self->res->body('{success: true}');
    $self->res->cookies->{session} = $key; # should default to expire on browser close by default

    if (my $r=$self->schema->resultset('Session')->search({uid => $uid})) {
      $r->single->update({sessionkey=>$key,
               expires=>\[q[NOW() + interval '1 hour']],
      });
    } else {
      $self->schema->resultset('Session')->insert({uid => $uid, sessionkey => $key, expires=>\[q[NOW() + interval '1 hour']]})
    }
  } else {
    # TODO should I be using a JSON module for this kind of response? it's fixed
    $self->res->body('{success: false}');
  }

  return $self->res;
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
