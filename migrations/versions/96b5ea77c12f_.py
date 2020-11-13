"""empty message

Revision ID: 96b5ea77c12f
Revises: 9ee9722c70b7
Create Date: 2020-11-13 00:06:08.282499

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '96b5ea77c12f'
down_revision = '9ee9722c70b7'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.alter_column('answer', 'comments',
               existing_type=sa.VARCHAR(length=120),
               nullable=True)
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.alter_column('answer', 'comments',
               existing_type=sa.VARCHAR(length=120),
               nullable=False)
    # ### end Alembic commands ###