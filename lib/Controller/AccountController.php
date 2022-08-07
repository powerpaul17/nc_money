<?php

namespace OCA\Money\Controller;

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
    $sql = 'SELECT a.*, ROUND(SUM(b.value), 2) AS balance ' .
           'FROM *PREFIX*money_accounts a ' .
           'LEFT JOIN *PREFIX*money_splits b ON b.dest_account_id = a.id ' .
           'LEFT JOIN *PREFIX*money_transactions c ON b.transaction_id = c.id ' .
           'WHERE a.user_id = ? ' .
           'GROUP BY a.id;';
    $query = $this->db->prepare($sql);
    $query->bindParam(1, $this->userId, \PDO::PARAM_INT);
    $query->execute();
    $rows = $query->fetchAll();
    $query->closeCursor();
    return $rows;
    //return new DataResponse($this->accountService->findAll($this->userId));
  }

  /**
   * @NoAdminRequired
   *
   * @param int $id
   */
  public function getAccount($id) {
    $sql = 'SELECT a.*, COALESCE(ROUND(SUM(b.value), 2), 0) AS balance ' .
           'FROM *PREFIX*money_accounts a ' .
           'LEFT JOIN *PREFIX*money_splits b ON b.dest_account_id = a.id ' .
           'LEFT JOIN *PREFIX*money_transactions c ON b.transaction_id = c.id ' .
           'WHERE a.id = ? AND a.user_id = ? ' .
           'GROUP BY a.id;';
    $query = $this->db->prepare($sql);

    $query->bindParam(1, $id, \PDO::PARAM_INT);
    $query->bindParam(2, $this->userId, \PDO::PARAM_STR);

    $query->execute();

    $row = $query->fetch();

    $query->closeCursor();

    return $row;
    //return new DataResponse($this->accountService->find($id, $this->userId));
  }

  /**
   * @NoAdminRequired
   *
   * @param int $id
   * @param int $type
   */
  public function updateAccount($id, $name, $type, $currency, $description) {
    $this->accountService->update($id, $name, $type, $currency, $description, $this->userId);
    return $this->getAccount($id);
  }

  /**
   * @NoAdminRequired
   *
   * @param int $type
   */
  public function addAccount($name, $type, $currency, $description) {
    $response = $this->accountService->create($name, $type, $currency, $description, $this->userId);
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

  /**
   * @NoAdminRequired
   *
   * @param int $id
   */
  public function getAccountBalance($id) {
    $sql = 'SELECT ROUND(SUM(a.value), 2) AS balance ' .
           'FROM *PREFIX*money_splits a ' .
           'LEFT JOIN *PREFIX*money_transactions b ON a.transaction_id = b.id ' .
           'WHERE dest_account_id = ? AND user_id = ?;';
    $query = $this->db->prepare($sql);

    $query->bindValue(1, $id, \PDO::PARAM_INT);
    $query->bindValue(2, $this->userId, \PDO::PARAM_STR);

    $query->execute();

    $result = $query->fetch();

    $query->closeCursor();

    // $result = $query->execute([$id, $this->userId])->fetch();
    return $result;
  }

}
