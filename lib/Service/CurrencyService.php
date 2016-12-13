<?php

namespace OCA\Money\Service;

use Exception;

use OCP\AppFramework\Db\DoesNotExistException;
use OCP\AppFramework\Db\MultipleObjectsReturnedException;

use OCA\Money\Db\Currency;
use OCA\Money\Db\CurrencyMapper;

class CurrencyService {

  private $mapper;

  public function __construct(CurrencyMapper $mapper) {
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

  public function create($name, $abbreviation, $userId) {
    $currency = new Currency();
    $currency->setName($name);
    $currency->setAbbreviation($abbreviation);
    $currency->setUserId($userId);
    return $this->mapper->insert($currency);
  }

  public function update($id, $name, $abbreviation, $userId) {
    try {
      $currency = $this->mapper->find($id, $userId);
      $currency->setName($name);
      $currency->setAbbreviation($abbreviation);
      return $this->mapper->update($currency);
    } catch(Exception $e) {
      $this->handleException($e);
    }
  }

}

?>
