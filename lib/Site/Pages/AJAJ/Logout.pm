package Site::Pages::AJAJ::Logout;
use strictures 1;

use base qw/ Site::Pages::JSON /;

sub handle_POST {
  my ( $self ) = @_;
  my ( $uid ) = $self->unroll_session();

  # just remove the key from the session DB
  if (my $session = $self->schema->resultset('Session')->find({uid=>$uid})) {
    $session->delete();
    return $self->json_success;
  } else {
    return $self->json_failure;
  }
}
