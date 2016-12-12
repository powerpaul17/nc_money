<?php

namespace OCA\Money\Db;

use JsonSerializable;

use OCP\AppFramework\Db\Entity;

class Account extends Entity implements JsonSerializable {

  protected $userId;
  protected $name;
  protected $type;
  protected $currencyId;

  public funtion jsonSerialize() {
    return [
      'id' => $this->id,
      'name' => $this->name,
      'type' => $this->type
      'currencyId' => $this->currencyId;
    ];
  }

}

?>
