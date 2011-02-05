package Site::Pages::AJAJ::Logout;
use strictures 1;

use base qw/ Site::Pages /;

sub handle_POST {
  my ( $self ) = @_;
  my ( $uid ) = $self->unroll_session();

  # just remove the key from the session DB
  $self->schema->resultset('Session')->find({uid=>$uid})->delete();

  $self->res->headers({'Content-Type' => 'application/json'});
  $self->res->body('{success: true}');
}
