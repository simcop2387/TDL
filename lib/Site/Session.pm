package Site::Session;

use Site::Utils;

require Exporter;
our @ISA = qw/ Exporter /;
our @EXPORT = qw/test_session extend_session make_session_key/;

###### Session helpers

sub test_session {
  my ( $req ) = @_;
  my ( $res, $con, $uri ) = get_request_info( $req );
  
  # TODO check the session
  my $session = $req->cookies->{session};
  my $r = $Site::heap{schema}->resultset('Session')->find({sessionkey => $session});
  
  return 0 unless $r;
  return 1;
}

#i might make this unneccesary, can't decide
sub extend_session {
  my ( $uid )= @_;
  
  # this will only work in POSTGRES. i don't care about being agnostic right now.
  $Site::heap{schema}->resultset('Session')->find({uid => $uid})
  ->update({expires => \[q[NOW() + interval '1 hour']]});
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