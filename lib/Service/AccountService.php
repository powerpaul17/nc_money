<?php

namespace OCA\Money\Service;

use Exception;

use OCP\AppFramework\Db\DoesNotExistException;
use OCP\AppFramework\Db\MultipleObjectsReturnedException;

use OCA\Money\Db\Account;
use OCA\Money\Db\AccountMapper;

class AccountService {

  private $mapper;

  public function __construct(AccountMapper $mapper) {
    $this->mapper = $mapper;
  }

  public function findAll($userId) {
    return $this->mapper->findAll($userId);
  }

  private function handleException($e) {
    if ($e instanceof DoesNotExistException ||
        $e instanceof MultipleObjectsReturnedException) {
          throw new NotFoundException($e->getMessage());
    } else {
      throw $e;
    }
  }

  public function find($id, $userId) {
    try {
      return $this->mapper->find($id, $userId);
    } catch(Exception $e) {
      $this->handleException($e);
    }
  }

  public function create($name, $type, $currencyId, $description, $userId) {
    $account = new Account();
    $account->setName($name);
    $account->setType($type);
    $account->setCurrencyId($currencyId);
    $account->setDescription($description);
    $account->setUserId($userId);
    return $this->mapper->insert($account);
  }

  public function update($id, $name, $type, $currencyId, $description, $userId) {
    try {
      $account = $this->mapper->find($id, $userId);
      $account->setName($name);
      $account->setType($type);
      $account->setCurrencyId($currencyId);
      $account->setDescription($description);
      return $this->mapper->update($account);
    } catch(Exception $e) {
      $this->handleException($e);
    }
  }

}

?>
