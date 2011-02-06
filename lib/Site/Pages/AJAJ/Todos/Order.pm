package Site::Pages::AJAJ::Todos::Order;
use strictures 1;

use base qw/ Site::Pages::JSON /;
use Try::Tiny;

sub handle_POST {
  my ( $self ) = @_;
  my ( $uid ) = $self->unroll_session();
  my $data = $self->get_json();
  
  my @ids = @{$data->{todos}};
  my $rs = $self->schema->resultset('Todo');
  
  my $coderef = sub {
    for my $i (0..$#ids) {
      $rs->find({tid => $ids[$i]})->update({order => $i})
    }
  };
  
  try {
    $self->schema->txn_do($coderef);
    return $self->json_success;
  } catch {
    return $self->json_failure(message => "$_");
  }
}

1;