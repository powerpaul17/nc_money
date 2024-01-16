<?php

namespace OCA\Money\Db;

use JsonSerializable;

use OCP\AppFramework\Db\Entity;

class Account extends Entity implements JsonSerializable {

  protected $name;
  protected $type;
  protected $currency;
  protected $description;
  protected $hidden;
  protected $archived;
  protected $icon;
  protected $userId;
  protected $bookId;
  protected $extraData;

  public function __construct() {
    $this->addType('type', 'integer');
  }

  public function jsonSerialize() {
    return [
      'id' => $this->id,
      'name' => $this->name,
      'type' => $this->type,
      'currency' => $this->currency,
      'description' => $this->description,
      'hidden' => $this->hidden,
      'archived' => $this->archived,
      'icon' => $this->icon,
      'extraData' => $this->extraData,
      'bookId' => $this->bookId
    ];
  }

}

?>
