<?php

namespace OCA\Money\Controller;

use ArrayObject;

use OCP\IRequest;
use OCP\IDBConnection;

use OCA\Money\Controller\MoneyController;
use OCA\Money\Service\AccountService;

class AccountController extends MoneyController {

  private AccountService $accountService;

  public function __construct(string $AppName, IRequest $request, IDBConnection $db, $UserId, AccountService $accountService) {
    parent::__construct($AppName, $request, $db, $UserId);

    $this->accountService = $accountService;
  }

  /**
   * @NoAdminRequired
   */
  public function getAccounts() {
    $qb = $this->createQueryBuilderForAccount();

    $qb->setParameter('user_id', $this->userId);

    $result = $qb->executeQuery();
    $rows = $result->fetchAll();
    $result->closeCursor();

    return array_values($this->transformAccountRowsWithBalances($rows));
  }

  /**
   * @NoAdminRequired
   *
   * @param int $id
   */
  public function getAccount($id) {
    $qb = $this->createQueryBuilderForAccount();

    $qb->andWhere('a.id = :id')
      ->setParameter('user_id', $this->userId)
      ->setParameter('id', $id);

    $result = $qb->executeQuery();
    $rows = $result->fetchAll();
    $result->closeCursor();

    return array_values($this->transformAccountRowsWithBalances($rows))[0];
  }

  private function createQueryBuilderForAccount() {
    $qb = $this->db->getQueryBuilder();

    $yearFunction = $qb->createFunction('EXTRACT(YEAR FROM c.date)');
    $monthFunction = $qb->createFunction('EXTRACT(MONTH FROM c.date)');

    $qb->select('a.*')
      ->selectAlias($yearFunction, 'year')
      ->selectAlias($monthFunction, 'month')
      ->selectAlias($qb->createFunction('SUM(b.value)'), 'balance')
      ->selectAlias($qb->createFunction('SUM(SUM(b.value)) OVER (PARTITION BY a.id ORDER BY EXTRACT(YEAR FROM c.date), EXTRACT(MONTH FROM c.date))'), 'running_balance')
      ->from('money_accounts', 'a')
      ->leftJoin('a', 'money_splits', 'b', 'b.dest_account_id = a.id')
      ->leftJoin('b', 'money_transactions', 'c', 'b.transaction_id = c.id')
      ->where('a.user_id = :user_id')
      ->groupBy($yearFunction, $monthFunction, 'a.id');

    return $qb;
  }

  /**
   * @NoAdminRequired
   *
   * @param int $id
   * @param int $type
   */
  public function updateAccount(
    $id,
    $name,
    $type,
    $currency,
    $description,
    $extraData,
    $bookId
  ) {
    $this->accountService->update(
      $id,
      $name,
      $type,
      $currency,
      $description,
      $extraData,
      $this->userId,
      $bookId
    );
    return $this->getAccount($id);
  }

  /**
   * @NoAdminRequired
   *
   * @param int $type
   */
  public function addAccount(
    $name,
    $type,
    $currency,
    $description,
    $extraData,
    $bookId
  ) {
    $response = $this->accountService->create(
      $name,
      $type,
      $currency,
      $description,
      $extraData,
      $this->userId,
      $bookId
    );
    return $this->getAccount($response->id);
  }

  /**
   * @NoAdminRequired
   *
   * @param int $id
   */
  public function deleteAccount($id) {
    return $this->handleNotFound(function() use ($id) {
      return $this->accountService->delete($id, $this->userId);
    });
  }

  private function transformAccountRowsWithBalances($rows) {
    $accounts = [];

    foreach ($rows as $row) {
      $id = (int) $row['id'];
      $balance = (float) $row['balance'];
      $running_balance = (float) $row['running_balance'];

      if (array_key_exists($row['id'], $accounts)) {
        $account = $accounts[$id];
      } else {
        $account = $accounts[$id] = [
          'id' => $id,
          'type' => (int) $row['type'],
          'name' => $row['name'],
          'description' => $row['description'],
          'icon' => $row['icon'],
          'currency' => $row['currency'],
          'stats' => new ArrayObject(),
          'extraData' => $row['extra_data'],
          'bookId' => $row['book_id']
        ];
      }

      $year = $row['year'];
      $month = $row['month'];

      if (!is_null($balance) && !is_null($year) && !is_null($month)) {
        $account['stats'][$year][$month] = [
          'value' => $balance,
          'balance' => $running_balance
        ];
      }
      $accounts[$id] = $account;
    }

    return $accounts;
  }

}
