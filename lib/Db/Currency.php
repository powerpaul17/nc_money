<?php

namespace OCA\Money\Db;

use JsonSerializable;

use OCP\AppFramework\Db\Entity;

class Currency extends Entity implements JsonSerializable {

  protected $userId;
  protected $name;
  protected $abbreviation;

  public funtion jsonSerialize() {
    return [
      'id' => $this->id,
      'name' => $this->name,
      'abbreviation' => $this->abbreviation
    ];
  }

}

?>
