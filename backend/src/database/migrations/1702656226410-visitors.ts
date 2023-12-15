import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class Visitors1702656226410 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'visitors',
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
            name: 'requester_id',
            type: 'integer',
            isNullable: false,
          },
          {
            name: 'recipient_id',
            type: 'integer',
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
      'visitors',
      new TableForeignKey({
        columnNames: ['visitor_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'CASCADE',
        onUpdate: 'NO ACTION',
      }),
    );

    await queryRunner.createForeignKey(
      'visitors',
      new TableForeignKey({
        columnNames: ['recipient_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'CASCADE',
        onUpdate: 'NO ACTION',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('visitors');
  }
}
