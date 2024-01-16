import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class PostCommentReplies1704317997424 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'post_comment_replies',
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
            name: 'comment_id',
            type: 'integer',
            isNullable: false,
          },
          {
            name: 'user_id',
            type: 'integer',
            isNullable: false,
          },
          {
            name: 'comment',
            type: 'varchar',
            length: '1000',
            isNullable: true,
          },
          {
            name: 'images',
            type: 'simple-array',
            isNullable: true,
          },
          {
            name: 'videos',
            type: 'simple-array',
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
        ],
      }),
    );

    await queryRunner.createForeignKey(
      'post_comment_replies',
      new TableForeignKey({
        columnNames: ['comment_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'post_comments',
        onDelete: 'CASCADE',
        onUpdate: 'NO ACTION',
      }),
    );

    await queryRunner.createForeignKey(
      'post_comment_replies',
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
    await queryRunner.dropTable('post_comment_replies');
  }
}
