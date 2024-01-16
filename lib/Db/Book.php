<?php

namespace OCA\Money\Db;

use JsonSerializable;

use OCP\AppFramework\Db\Entity;

class Book extends Entity implements JsonSerializable {

  protected $name;
  protected $description;
  protected $userId;

  public function __construct() {}

  public function jsonSerialize() {
    return [
      'id' => $this->id,
      'name' => $this->name,
      'description' => $this->description,
    ];
  }

}

?>
