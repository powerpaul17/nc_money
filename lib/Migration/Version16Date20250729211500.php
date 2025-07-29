<?php

declare(strict_types=1);

namespace OCA\Money\Migration;

use Closure;
use OCP\DB\ISchemaWrapper;
use OCP\Migration\IOutput;
use OCP\Migration\SimpleMigrationStep;
use OCP\DB\Types;
use Doctrine\DBAL\Types\Type;

/**
 * Auto-generated migration step: Please modify to your needs!
 */
class Version16Date20250729211500 extends SimpleMigrationStep {

  /**
   * @param IOutput $output
   * @param Closure $schemaClosure The `\Closure` returns a `ISchemaWrapper`
   * @param array $options
   * @return null|ISchemaWrapper
   */
  public function changeSchema(IOutput $output, Closure $schemaClosure, array $options): ?ISchemaWrapper {
    $schema = $schemaClosure();

    $transactionsTable = $schema->getTable('money_transactions');

    $transactionsTable->changeColumn('description', [
      'type' => Type::getType(Types::STRING),
      'length' => 1024,
      'default' => '',
      'notnull' => false
    ]);

    $splitsTable = $schema->getTable('money_splits');

    $splitsTable->changeColumn('description', [
      'type' => Type::getType(Types::STRING),
      'length' => 1024,
      'default' => '',
      'notnull' => false
    ]);

    return $schema;
  }

}
