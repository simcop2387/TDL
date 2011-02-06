package Site::Pages::AJAJ::Todos::New;
use strictures 1;

use base qw/ Site::Pages::JSON /;
use Data::Dumper;

use Try::Tiny;

sub handle_POST {
  my ( $self ) = @_;
  
  my ( $uid ) = $self->unroll_session();
  my $data = $self->get_json();

  try {
    my $newhash;

    for (qw/title due description order lid/) { # only allow what we want
      $newhash->{$_} = $data->{$_} if exists($data->{$_});
    }
    $newhash->{uid} = $uid;

    my $row = $self->schema->resultset('Todo')->create($newhash);
    my $tid = $row->get_column('tid');
    return $self->json_success(tid => "$tid", DD=>Dumper($tid));
  } catch {
    return $self->json_failure(data=>$data, message => "$_");
  }
}

1;