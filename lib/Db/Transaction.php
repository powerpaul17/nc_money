<?php

namespace OCA\Money\Db;

use JsonSerializable;

use OCP\AppFramework\Db\Entity;

class Transaction extends Entity implements JsonSerializable {

  protected $description;
  protected $currencyId;
  protected $date;
  protected $userId;

  public function __construct() {
    $this->addType('currencyId', 'integer');
  }

  public function jsonSerialize() {
    return [
      'id' => $this->id,
      'description' => $this->description,
      'currencyId' => $this->currencyId,
      'date' => $this->date
    ];
  }

}

?>
