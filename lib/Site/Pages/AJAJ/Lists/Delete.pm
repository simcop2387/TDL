package Site::Pages::AJAJ::Lists::Delete;
use strictures 1;

use base qw/ Site::Pages /;
use Site::Utils;

sub handle_POST {
  my ( $self ) = @_;
  
  my ( $uid ) = $self->unroll_session();
  my ( $id ) = $self->get_params(qw/id/);
  
  $self->schema->resultset('List')->find({tid => $id})->delete();
}

1;