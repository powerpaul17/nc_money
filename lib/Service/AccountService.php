<?php

namespace OCA\Money\Service;

use Exception;

use OCP\AppFramework\Db\DoesNotExistException;
use OCP\AppFramework\Db\MultipleObjectsReturnedException;

use OCA\Money\Db\Account;
use OCA\Money\Db\AccountMapper;

use OCA\Money\AuditTrait;

class AccountService {

  use AuditTrait;

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

  public function create(
    $name,
    $type,
    $currency,
    $description,
    $extraData,
    $userId,
    $bookId
  ) {
    $account = new Account();
    $account->setName($name);
    $account->setType($type);
    $account->setCurrency($currency);
    $account->setDescription($description);
    $account->setExtraData($extraData);

    $account->setUserId($userId);
    $account->setBookId($bookId);

    $insertedAccount = $this->mapper->insert($account);

    $this->emitCreateAuditEvent($userId, 'account', $insertedAccount);

    return $insertedAccount;
  }

  public function update(
    $id,
    $name,
    $type,
    $currency,
    $description,
    $extraData,
    $userId,
    $bookId
  ) {
    try {
      $account = $this->mapper->find($id, $userId);
      $originalAccount = clone $account;

      $account->setBookId($bookId);

      $account->setName($name);
      $account->setType($type);
      $account->setCurrency($currency);
      $account->setDescription($description);
      $account->setExtraData($extraData);

      $updatedAccount = $this->mapper->update($account);

      $this->emitUpdateAuditEvents($userId, 'account', $updatedAccount, $originalAccount);

      return $updatedAccount;
    } catch(Exception $e) {
      $this->handleException($e);
    }
  }

  public function delete($id, $userId) {
    try {
      $account = $this->mapper->find($id, $userId);
      $this->mapper->delete($account);

      $this->emitDeleteAuditEvent($userId, 'account', $account);

      return $account;
    } catch(Exception $e) {
      $this->handleException($e);
    }
  }

}

?>
