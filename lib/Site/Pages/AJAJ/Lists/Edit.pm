package Site::Pages::AJAJ::Lists::Edit;
use strictures 1;

use base qw/ Site::Pages /;
use Site::Utils;

sub handle_POST {
  my ( $self ) = @_;
  my ( $uid ) = $self->unroll_session();
  
  my $data = $self->get_json('data');
  my $id = $data->{id};

  if (my $list=$self->schema->resultset('List')->find({uid => $uid, lid => $id})) {
    my $newhash;
    
    for (qw/title/) { # only allow what we want
      $newhash->{$_} = $data->{$_} if exists($data->{$_});
    }
    $list->update($newhash);

    $self->res->body('{success: true}');
  } else {
    $self->res->body('{success: false}');
  }

  $self->res->headers({'Content-Type' => 'application/json'});
  return $self->res;
}