import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class UserActivities1705368065630 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'user_activities',
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
            name: 'login_time',
            type: 'date',
            isNullable: false,
          },
          {
            name: 'login_ip_address',
            type: 'varchar',
            isNullable: true,
            length: '100',
          },
          {
            name: 'device_os',
            type: 'varchar',
            isNullable: false,
            length: '50',
          },
          {
            name: 'device_model',
            type: 'varchar',
            length: '100',
            isNullable: false,
          },
          {
            name: 'user_agent',
            isNullable: true,
            type: 'text',
          },
          {
            name: 'type',
            type: 'enum',
            enum: [
              'Login',
              'Password Reset',
              'Login Success',
              'Login Failed',
              'Login Verification Failed',
              'Password Reset Verification Failed',
            ],
            isNullable: true,
          },
          {
            name: 'user_id',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'description',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'created_at',
            type: 'date',
            isNullable: false,
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
      'user_activities',
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
    await queryRunner.dropTable('user_activities');
  }
}
