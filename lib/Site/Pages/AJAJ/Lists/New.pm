package Site::Pages::AJAJ::Lists::New;
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

    for (qw/title order/) { # only allow what we want
      $newhash->{$_} = $data->{$_} if exists($data->{$_});
    }
    $newhash->{uid} = $uid;
    
    my $row = $self->schema->resultset('List')->create($newhash);
    my $lid = $row->get_column('lid');
    return $self->json_success(lid => "$lid", DD=>Dumper($lid));
  } catch {
    return $self->json_failure(message => "$_");
  }
}

1;