import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class Profiles1704316133572 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'profiles',
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
            name: 'user_id',
            type: 'integer',
            isNullable: false,
          },
          {
            name: 'posts_status',
            type: 'enum',
            enum: ['private', 'public'],
            isNullable: false,
          },
          {
            name: 'friends_status',
            type: 'enum',
            enum: ['private', 'public'],
            isNullable: false,
          },
          {
            name: 'pages_status',
            type: 'enum',
            enum: ['private', 'public'],
            isNullable: false,
          },
          {
            name: 'groups_status',
            type: 'enum',
            enum: ['private', 'public'],
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
      'profiles',
      new TableForeignKey({
        columnNames: ['user_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'CASCADE',
        onUpdate: 'NO ACTION',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('profiles');
  }
}
