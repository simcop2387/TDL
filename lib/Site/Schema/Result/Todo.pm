package Site::Schema::Result::Todo;

# Created by DBIx::Class::Schema::Loader
# DO NOT MODIFY THE FIRST PART OF THIS FILE

use strict;
use warnings;

use base 'DBIx::Class::Core';


=head1 NAME

Site::Schema::Result::Todo

=cut

__PACKAGE__->table("todos");

=head1 ACCESSORS

=head2 uid

  data_type: 'integer'
  is_foreign_key: 1
  is_nullable: 0

=head2 title

  data_type: 'text'
  is_nullable: 0
  original: {data_type => "varchar"}

=head2 due

  data_type: 'text'
  is_nullable: 1
  original: {data_type => "varchar"}

=head2 description

  data_type: 'text'
  is_nullable: 1

=head2 lid

  data_type: 'integer'
  is_foreign_key: 1
  is_nullable: 0

=head2 order

  data_type: 'integer'
  is_nullable: 0

=head2 finished

  data_type: 'boolean'
  default_value: false
  is_nullable: 0

=head2 tid

  data_type: 'integer'
  is_auto_increment: 1
  is_nullable: 0
  sequence: 'todos_tid_seq'

=cut

__PACKAGE__->add_columns(
  "uid",
  { data_type => "integer", is_foreign_key => 1, is_nullable => 0 },
  "title",
  {
    data_type   => "text",
    is_nullable => 0,
    original    => { data_type => "varchar" },
  },
  "due",
  {
    data_type   => "text",
    is_nullable => 1,
    original    => { data_type => "varchar" },
  },
  "description",
  { data_type => "text", is_nullable => 1 },
  "lid",
  { data_type => "integer", is_foreign_key => 1, is_nullable => 0 },
  "order",
  { data_type => "integer", is_nullable => 0 },
  "finished",
  { data_type => "boolean", default_value => \"false", is_nullable => 0 },
  "tid",
  {
    data_type         => "integer",
    is_auto_increment => 1,
    is_nullable       => 0,
    sequence          => "todos_tid_seq",
  },
);
__PACKAGE__->set_primary_key("tid");

=head1 RELATIONS

=head2 lid

Type: belongs_to

Related object: L<Site::Schema::Result::List>

=cut

__PACKAGE__->belongs_to(
  "lid",
  "Site::Schema::Result::List",
  { lid => "lid" },
  { is_deferrable => 1, on_delete => "CASCADE", on_update => "CASCADE" },
);

=head2 uid

Type: belongs_to

Related object: L<Site::Schema::Result::User>

=cut

__PACKAGE__->belongs_to(
  "uid",
  "Site::Schema::Result::User",
  { uid => "uid" },
  { is_deferrable => 1, on_delete => "CASCADE", on_update => "CASCADE" },
);


# Created by DBIx::Class::Schema::Loader v0.07002 @ 2011-02-06 13:47:20
# DO NOT MODIFY THIS OR ANYTHING ABOVE! md5sum:cv51jAUwRD+Mgx+ynlmVDA


# You can replace this text with custom content, and it will be preserved on regeneration
1;
