"""empty message

Revision ID: d145d036a02f
Revises: 49e7d41a9e61
Create Date: 2020-11-08 04:02:52.364339

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'd145d036a02f'
down_revision = '49e7d41a9e61'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('activity',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('details', sa.String(length=350), nullable=False),
    sa.Column('label', sa.String(length=100), nullable=True),
    sa.Column('activity_type', sa.Enum('note', 'event'), nullable=True),
    sa.Column('contact_id', sa.Integer(), nullable=False),
    sa.Column('created_at', sa.DateTime(), nullable=True),
    sa.ForeignKeyConstraint(['contact_id'], ['contact.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.add_column('contact', sa.Column('agent_id', sa.Integer(), nullable=True))
    op.add_column('contact', sa.Column('contact_attemps', sa.Integer(), nullable=True))
    op.add_column('contact', sa.Column('contacted_at', sa.DateTime(), nullable=True))
    op.create_foreign_key(None, 'contact', 'agent', ['agent_id'], ['id'])
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_constraint(None, 'contact', type_='foreignkey')
    op.drop_column('contact', 'contacted_at')
    op.drop_column('contact', 'contact_attemps')
    op.drop_column('contact', 'agent_id')
    op.drop_table('activity')
    # ### end Alembic commands ###