package Site::Pages::AJAJ::Lists::Edit;
use strictures 1;

use base qw/ Site::Pages::JSON /;

sub handle_POST {
  my ( $self ) = @_;
  my ( $uid ) = $self->unroll_session();
  
  my $data = $self->get_json();
  my $id = $data->{id};

  if (my $list=$self->schema->resultset('List')->find({uid => $uid, lid => $id})) {
    my $newhash;
    
    for (qw/title order/) { # only allow what we want
      $newhash->{$_} = $data->{$_} if exists($data->{$_});
    }
    $list->update($newhash);

    return $self->json_success;
  } else {
    return $self->json_failure;
  }
}

1;