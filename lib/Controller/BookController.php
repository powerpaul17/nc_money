<?php

namespace OCA\Money\Controller;

use ArrayObject;

use OCP\IRequest;
use OCP\IDBConnection;

use OCA\Money\Controller\MoneyController;
use OCA\Money\Service\BookService;

class BookController extends MoneyController {

  private BookService $bookService;

  public function __construct(string $AppName, IRequest $request, IDBConnection $db, $UserId, BookService $bookService) {
    parent::__construct($AppName, $request, $db, $UserId);

    $this->bookService = $bookService;
  }

  /**
   * @NoAdminRequired
   */
  public function getBooks() {
    return $this->bookService->findAll($this->userId);
  }

  /**
   * @NoAdminRequired
   *
   * @param int $id
   */
  public function getBook($id) {
    return $this->bookService->find($id, $this->userId);
  }

  /**
   * @NoAdminRequired
   */
  public function updateBook(
    $id,
    $name,
    $description
  ) {
    return $this->bookService->update(
      $id,
      $name,
      $description,
      $this->userId
    );
  }

  /**
   * @NoAdminRequired
   */
  public function addBook(
    $name,
    $description
  ) {
    return $this->bookService->create(
      $name,
      $description,
      $this->userId
    );
  }

  /**
   * @NoAdminRequired
   *
   * @param int $id
   */
  public function deleteBook($id) {
    return $this->handleNotFound(function() use ($id) {
      return $this->bookService->delete($id, $this->userId);
    });
  }

}
