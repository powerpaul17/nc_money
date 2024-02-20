<?php

namespace OCA\Money\tests\Migration;

use Exception;

use Doctrine\DBAL\Schema\Table;
use OC\DB\Connection;
use OC\DB\MigrationService;
use OC\DB\SchemaWrapper;
use OCP\AppFramework\App;
use OCP\IDBConnection;

use PHPUnit\Framework\TestCase;

/**
 * @runTestsInSeparateProcesses
 */
abstract class AbstractMigrationTestCase extends TestCase {
  /**
   * @var ContainerInterface
   */
  protected static $container;

  /**
   * @var IDBConnection
   */
  protected static $db;

  /**
   * @var MigrationService
   */
  protected $migrationService;

  /**
   * @var SchemaWrapper
   */
  protected $schema;

  protected static $connection;

  abstract protected function getPreviousMigrationName(): ?string;

  private const TMP_MIGRATIONS = '/tmp/old-migrations';

  public static function setUpBeforeClass(): void {
    self::hideMigrations();
    self::enableApp();
    self::restoreMigrations();

    $app = new App('money');
    self::$container = $app->getContainer();

    /**
     * @var IDBConnection $db
     */
    self::$db = self::$container->get(IDBConnection::class);
    self::assertIsObject(self::$db);

    self::$connection = \OC::$server->get(Connection::class);
  }

  public function setUp(): void {
    parent::setUp();

    /**
     * @var SchemaWrapper $schema
     */
    $this->schema = self::$container->query(SchemaWrapper::class);
    $this->assertIsObject($this->schema);

    $this->migrationService = new MigrationService('money', self::$connection);
    $this->assertIsObject($this->migrationService);

    // Reinstall app partially (just before the migration)
    $migrationBefore = $this->getPreviousMigrationName();
    if (!empty($migrationBefore)) {
      // We need to run a migration beforehand
      $this->migrationService->migrate($migrationBefore);
      $this->renewSchema();
    }
  }

  public function tearDown(): void {
    $this->resetDb();
    unset($this->migrationService);
  }

  public static function tearDownAfterClass(): void {
    unset(self::$container);
    unset(self::$db);
    unset(self::$connection);
  }

  protected function renewSchema(): void {
    $this->schema = new SchemaWrapper(self::$connection);
  }

  private static function enableApp() {
    self::runOccCommand(['app:enable', 'money']);
  }

  private static function hideMigrations() {
    if (!file_exists(self::TMP_MIGRATIONS)) {
      mkdir(self::TMP_MIGRATIONS);
    }

    exec('mv lib/Migration/* ' . self::TMP_MIGRATIONS);
  }

  private static function restoreMigrations() {
    exec('mv ' . self::TMP_MIGRATIONS . '/* lib/Migration');
  }

  private function resetDb(): void {
    $allTables = $this->schema->getTables();
    $tables = array_filter($allTables, function (Table $t) {
      return str_starts_with($t->getName(), 'oc_money');
    });

    /**
     * @var Table $t
     */
    foreach ($tables as $t) {
      $name = preg_replace('/^oc_/', '', $t->getName());
      $this->schema->dropTable($name);
    }

    $qb = self::$db->getQueryBuilder();
    $qb->delete('migrations')->where('app = :app');
    $qb->setParameter('app', 'money');
    $qb->executeStatement();

    $this->schema->performDropTableCalls();

    $this->renewSchema();
  }

  private static function runOccCommand(array $args, bool $forceprint = false) {
    $output = [];
    $ret = -1;
    $params = join(' ', array_map(function ($x) {
      return escapeshellarg($x);
    }, $args));

    $cmd = "php -f ../../occ $params 2>&1";

    exec($cmd, $output, $ret);
    if ($ret !== 0 || $forceprint) {
      echo "\nStandard output:\n";
      print_r($output);
      echo "Return value: $ret\n";
      if ($ret !== 0) {
        throw new Exception("Could not run OCC command");
      }
    }
  }

}
