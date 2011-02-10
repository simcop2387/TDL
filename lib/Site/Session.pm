package Site::Session;
use strictures 1;

use Site::Utils;

require Exporter;
our @ISA = qw/ Exporter /;
our @EXPORT = qw/test_session extend_session make_session_key create_session/;

# TODO THIS WILL ONLY WORK ON POSTGRESQL
my $PG_NOW = \[q[NOW() + interval '1 hour']];

###### Session helpers

sub test_session {
  my ( $req ) = @_;
  #my ( $res, $con, $uri ) = get_request_info( $req );
  
  # TODO check the session
  my $session = $req->cookies->{session};
  my $ip = $req->address();
  my $r = $Site::heap{schema}->resultset('Session')->find({sessionkey => $session, ip => $ip, expires => \[q[>= NOW()]]});
  
  return 0 unless $r;
  return 1;
}

#i might make this unneccesary, can't decide
sub extend_session {
  my ( $row )= @_;

  my $key = make_session_key(); # we'll rotate it now
  # this will only work in POSTGRES. i don't care about being agnostic right now.
  $row->update({expires => $PG_NOW, sessionkey => $key});
  $res->cookies->{session} = {value => $key, path  => "/",}; # tell the client about it
}

sub create_session {
  my ( $uid, $req, $res ) = @_;

  my $ip = $req->address();
  my $key = make_session_key(); # get a new key, they aren't tied to the user or anything

  $res->cookies->{session} = {value => $key, path  => "/",}; # tell the client about it

  if (my $r=$Site::heap{schema}->resultset('Session')->find({uid => $uid})) {
    $r->update({sessionkey=>$key, expires=>$PG_NOW, ip=>$ip});
  } else {
    $Site::heap{schema}->resultset('Session')->create({uid => $uid, sessionkey => $key, expires => $PG_NOW, ip => $ip});
  };

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
};

1
