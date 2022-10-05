<?php

namespace OCA\Money\Controller;

use OCP\IRequest;
use OCP\IDBConnection;
use OCP\AppFramework\Controller;

class MoneyController extends Controller {

  protected string $userId;
  protected IDBConnection $db;

  use Errors;

  public function __construct($AppName, IRequest $request, IDBConnection $db, $UserId) {
    parent::__construct($AppName, $request);

    $this->db = $db;
    $this->userId = $UserId;
  }

// Sum over all accounts for each category
//$query = \OCP\DB::prepare('SELECT a.type, FORMAT(SUM(b.value),2) FROM *PREFIX*money_accounts a LEFT JOIN *PREFIX*money_splits b ON b.dest_account_id = a.id GROUP BY a.type');

}

?>
