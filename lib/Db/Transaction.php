<?php

namespace OCA\Money\Db;

use JsonSerializable;

use OCP\AppFramework\Db\Entity;

class Transaction extends Entity implements JsonSerializable {

  protected $description;
  protected $date;
  protected $timestampAdded;
  protected $userId;

  public function __construct() {

  }

  public function jsonSerialize() {
    return [
      'id' => $this->id,
      'description' => $this->description,
      'date' => $this->date,
      'timestampAdded' => $this->timestampAdded,
    ];
  }

}

?>
