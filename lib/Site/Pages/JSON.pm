package Site::Pages::JSON;
use strictures 1;
use Site::Utils;

use base qw/ Site::Pages /;

use JSON::XS;

my %js_succ = (success => JSON::XS::true);
my %js_fail = (success => JSON::XS::true);

my $json_success = encode_json \%js_succ;
my $json_failure = encode_json \%js_fail;

sub get_json {
  my ($self) = @_;
  print STDERR "DEBUG GET_JSON: ".$self->req->param('data');
  return decode_json $self->req->param('data');
}

sub json_success {
  my ( $self, %data ) = @_;

  $self->res->headers({'Content-Type' => 'application/json', 'X-DATA' => encode_json(\%data)});
  $self->res->body(encode_json {%js_succ, iwenttherightway=>1, %data});
  
  return $self->res;
}

sub json_failure {
  my ( $self, %data ) = @_;

  $self->res->headers({'Content-Type' => 'application/json', 'X-DATA' => encode_json(\%data)});
  if (%data) {
    $self->res->body(encode_json {%js_fail, iwenttherightway=>1, %data});
  } else {
    $self->res->body($json_failure);
  }
  
  return $self->res;
}

1;
