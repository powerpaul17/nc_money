<?php

namespace OCA\Money\Db;

use JsonSerializable;

use OCP\AppFramework\Db\Entity;

class Transaction extends Entity implements JsonSerializable {

  protected $description;
  protected $currencyId;
  protected $timestamp;
  protected $value;
  protected $userId;

  public function __construct() {
    $this->addType('currencyId', 'integer');
    $this->addType('value', 'float');
  }

  public function jsonSerialize() {
    return [
      'id' => $this->id,
      'description' => $this->description,
      'timestamp' => $this->timestamp,
      'value' => $this->value
    ];
  }

}

?>
