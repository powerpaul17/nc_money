<?php

namespace OCA\Money\Db;

use JsonSerializable;

use OCP\AppFramework\Db\Entity;

class Account extends Entity implements JsonSerializable {

  protected $name;
  protected $type;
  protected $currencyId;
  protected $description;
  protected $userId;

  public function __construct() {
    $this->addType('type', 'integer');
    $this->addType('currencyId', 'integer');
  }

  public function jsonSerialize() {
    return [
      'id' => $this->id,
      'name' => $this->name,
      'type' => $this->type,
      'currencyId' => $this->currencyId,
      'description' => $this->description
    ];
  }

}

?>
