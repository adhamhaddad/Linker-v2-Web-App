import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class GroupMembers1704315109469 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'group_members',
        columns: [
          {
            name: 'id',
            type: 'integer',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'uuid',
            type: 'varchar',
            length: '145',
          },
          {
            name: 'group_id',
            type: 'integer',
            isNullable: false,
          },
          {
            name: 'member_id',
            type: 'integer',
            isNullable: false,
          },
          {
            name: 'profile_id',
            type: 'integer',
            isNullable: false,
          },
          {
            name: 'role',
            type: 'enum',
            enum: ['owner', 'super admin', 'admin', 'moderator', 'member'],
            isNullable: false,
          },
          {
            name: 'created_at',
            type: 'date',
            isNullable: true,
          },
          {
            name: 'updated_at',
            type: 'date',
            isNullable: true,
          },
        ],
      }),
    );

    await queryRunner.createForeignKey(
      'group_members',
      new TableForeignKey({
        columnNames: ['group_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'groups',
        onDelete: 'CASCADE',
        onUpdate: 'NO ACTION',
      }),
    );

    await queryRunner.createForeignKey(
      'group_members',
      new TableForeignKey({
        columnNames: ['member_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'CASCADE',
        onUpdate: 'NO ACTION',
      }),
    );

    await queryRunner.createForeignKey(
      'group_members',
      new TableForeignKey({
        columnNames: ['profile_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'profiles',
        onDelete: 'CASCADE',
        onUpdate: 'NO ACTION',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('group_members');
  }
}
