package Site::Pages::AJAJ::GetData;
use strictures 1;

use base qw/ Site::Pages /;

sub handle_GET {
  my ( $self ) = @_;
  
  my ( $uid ) = $self->unroll_session();

}