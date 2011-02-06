package Site::Pages::JSON;
use strictures 1;
use Site::Utils;

use base qw/ Site::Pages /;

use JSON::XS;

my $json_success = encode_json {success => JSON::XS::true};
my $json_failure = encode_json {success => JSON::XS::false};

sub get_json {
  my ($self) = @_;
  print STDERR "DEBUG GET_JSON: ".$self->req->param('data');
  return decode_json $self->req->param('data');
}

sub json_success {
  my ( $self ) = @_;
  $self->res->headers({'Content-Type' => 'application/json'});
  $self->res->body($json_success);
  return $self->res;
}

sub json_failure {
  my ( $self ) = @_;
  $self->res->headers({'Content-Type' => 'application/json'});
  $self->res->body($json_failure);
  return $self->res;
}

1;
