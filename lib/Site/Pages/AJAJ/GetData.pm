package Site::Pages::AJAJ::GetData;
use strictures 1;

use base qw/ Site::Pages::JSON /;

use JSON::XS;

sub handler {
  my ( $self ) = @_;
  
  my ( $uid ) = $self->unroll_session();
  
  my @lists;
  my @todos;
  my $rs_todo = $self->schema->resultset('Todo')->search({uid => $uid});
  my $rs_list = $self->schema->resultset('List')->search({uid => $uid});
  
  while (my $row=$rs_list->next()) {
    push @lists, {$row->get_columns};
  };
  while (my $row=$rs_todo->next()) {
    push @todos, {$row->get_columns};
  };
  
  my $hr = {
    lists => \@lists,
    todos => \@todos,
  };
  
  $self->res->headers({'Content-Type' => 'application/json'});
  $self->res->body(encode_json $hr);
  return $self->res;
}

# handle both so it's easier to debug on the CLI
sub handle_GET {
  goto &handler;
}

sub handle_POST {
  goto &handler;
}

1;
