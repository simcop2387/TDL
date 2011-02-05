package Site::Pages::AJAJ::Login;
use strictures 1;

use base qw/ Site::Pages /;

sub handle_POST {
  my ( $self ) = @_;
  
  my ( $uid ) = $self->unroll_session();
  my ($title, $id) = $self->get_params(qw/title id/);

}