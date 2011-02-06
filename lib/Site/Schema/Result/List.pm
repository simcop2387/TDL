package Site::Schema::Result::List;

# Created by DBIx::Class::Schema::Loader
# DO NOT MODIFY THE FIRST PART OF THIS FILE

use strict;
use warnings;

use base 'DBIx::Class::Core';


=head1 NAME

Site::Schema::Result::List

=cut

__PACKAGE__->table("lists");

=head1 ACCESSORS

=head2 uid

  data_type: 'integer'
  is_foreign_key: 1
  is_nullable: 0

=head2 title

  data_type: 'text'
  is_nullable: 0
  original: {data_type => "varchar"}

=head2 order

  data_type: 'integer'
  is_nullable: 0

=head2 lid

  data_type: 'integer'
  is_auto_increment: 1
  is_nullable: 0
  sequence: 'lists_lid_seq'

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
  "order",
  { data_type => "integer", is_nullable => 0 },
  "lid",
  {
    data_type         => "integer",
    is_auto_increment => 1,
    is_nullable       => 0,
    sequence          => "lists_lid_seq",
  },
);
__PACKAGE__->set_primary_key("lid");

=head1 RELATIONS

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

=head2 todos

Type: has_many

Related object: L<Site::Schema::Result::Todo>

=cut

__PACKAGE__->has_many(
  "todos",
  "Site::Schema::Result::Todo",
  { "foreign.lid" => "self.lid" },
  { cascade_copy => 0, cascade_delete => 0 },
);


# Created by DBIx::Class::Schema::Loader v0.07002 @ 2011-02-06 13:50:06
# DO NOT MODIFY THIS OR ANYTHING ABOVE! md5sum:ICHPdpvETGEvxzLs64bAqQ


# You can replace this text with custom content, and it will be preserved on regeneration
1;
