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
    $qb = $this->db->getQueryBuilder();

    $qb->select('a.*')
      ->selectAlias($qb->createFunction('ROUND(SUM(b.value), 2)'), 'balance')
      ->from('money_accounts', 'a')
      ->leftJoin('a', 'money_splits', 'b', 'b.dest_account_id = a.id')
      ->leftJoin('b', 'money_transactions', 'c', 'b.transaction_id = c.id')
      ->where('a.user_id = :user_id')
      ->groupBy('a.id')

      ->setParameter('user_id', $this->userId);

    $result = $qb->executeQuery();
    $rows = $result->fetchAll();
    $result->closeCursor();

    return $rows;
    //return new DataResponse($this->accountService->findAll($this->userId));
  }

  /**
   * @NoAdminRequired
   *
   * @param int $id
   */
  public function getAccount($id) {
    $qb = $this->db->getQueryBuilder();

    $qb->select('a.*')
      ->selectAlias($qb->createFunction('COALESCE(ROUND(SUM(b.value), 2), 0)'), 'balance')
      ->from('money_accounts' ,'a')
      ->leftJoin('a', 'money_splits', 'b', 'b.dest_account_id = a.id')
      ->leftJoin('b', 'money_transactions', 'c', 'b.transaction_id = c.id')
      ->where('a.id = :id')
      ->andWhere('a.user_id = :user_id')
      ->groupBy('a.id')

      ->setParameter('user_id', $this->userId)
      ->setParameter('id', $id);

    $result = $qb->executeQuery();
    $row = $result->fetch();
    $result->closeCursor();

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
    $qb = $this->db->getQueryBuilder();

    $qb->selectAlias($qb->createFunction('ROUND(SUM(a.value), 2)'), 'balance')
      ->from('money_splits' , 'a')
      ->leftJoin('a', 'money_transactions', 'b', 'a.transaction_id = b.id')
      ->where('dest_account_id = :dest_account_id')
      ->andWhere('user_id = :user_id')
      ->setParameter('user_id', $this->userId)
      ->setParameter('dest_acount_id', $id);

    $result = $qb->executeQuery();
    $returnValue = $result->fetch();
    $result->closeCursor();

    return $returnValue;
  }

}
