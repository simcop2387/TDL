package Site::Pages::AJAJ::Todos::Edit;
use strictures 1;

use base qw/ Site::Pages::JSON /;

use Try::Tiny;

sub handle_POST {
  my ( $self ) = @_;
  my ( $uid ) = $self->unroll_session();

  my $data = $self->get_json();
  my $tid = $data->{tid};
  my $newhash;

  if (my $item=$self->schema->resultset('Todo')->find({uid => $uid, tid => $tid})) {
    my $newhash;
    
    for (qw/title due description lid order finished/) { # only allow what we want
      $newhash->{$_} = $data->{$_} if exists($data->{$_});
    }

    try {
      $item->update($newhash);
      return $self->json_success(data => $newhash);
    } catch {
      return $self->json_failure(message => "$_");
    }
  } else {
    return $self->json_failure(message => "no such todo $tid");
  }
}

1;