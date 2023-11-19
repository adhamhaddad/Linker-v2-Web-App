import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class Users1700346440034 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'users',
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
            name: 'first_name',
            type: 'varchar',
            isNullable: false,
            length: '145',
          },
          {
            name: 'middle_name',
            type: 'varchar',
            isNullable: true,
            length: '145',
          },
          {
            name: 'last_name',
            type: 'varchar',
            isNullable: false,
            length: '145',
          },
          {
            name: 'email',
            type: 'varchar',
            length: '145',
            isNullable: false,
          },
          {
            name: 'password',
            isNullable: false,
            type: 'text',
          },
          {
            name: 'birth_date',
            type: 'date',
            isNullable: true,
          },
          {
            name: 'gender',
            type: 'enum',
            enum: ['male', 'female'],
            isNullable: false,
          },
          {
            name: 'email_verified_at',
            type: 'timestamp',
            default: null,
            isNullable: true,
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
          {
            name: 'deleted_at',
            type: 'date',
            isNullable: true,
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('users');
  }
}
