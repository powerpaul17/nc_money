<?php

namespace OCA\Money\Service;

use Exception;

use OCP\AppFramework\Db\DoesNotExistException;
use OCP\AppFramework\Db\MultipleObjectsReturnedException;

use OCA\Money\Db\Book;
use OCA\Money\Db\BookMapper;

class BookService {

  private $mapper;

  public function __construct(BookMapper $mapper) {
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
    $description,
    $userId
  ) {
    $book = new Book();
    $book->setName($name);
    $book->setDescription($description);

    $book->setUserId($userId);
    return $this->mapper->insert($book);
  }

  public function update(
    $id,
    $name,
    $description,
    $userId
  ) {
    try {
      $book = $this->mapper->find($id, $userId);
      $book->setName($name);
      $book->setDescription($description);

      return $this->mapper->update($book);
    } catch(Exception $e) {
      $this->handleException($e);
    }
  }

  public function delete($id, $userId) {
    try {
      $book = $this->mapper->find($id, $userId);
      $this->mapper->delete($book);
      return $book;
    } catch(Exception $e) {
      $this->handleException($e);
    }
  }

}

?>
