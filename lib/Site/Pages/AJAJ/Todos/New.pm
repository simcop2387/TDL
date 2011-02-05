package Site::Pages::AJAJ::Todos::New;
use strictures 1;

use base qw/ Site::Pages /;
use Site::Utils;

sub handle_POST {
  my ( $self ) = @_;
  
  my ( $uid ) = $self->unroll_session();
  my ($title, $id) = $self->get_params(qw/title id/);


}