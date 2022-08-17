<?php

namespace OCA\Money\Db;

use JsonSerializable;

use OCP\AppFramework\Db\Entity;

class Split extends Entity implements JsonSerializable {

  protected $transactionId;
  protected $destAccountId;
  protected $value;
  protected $convertRate;
  protected $description;
  protected $userId;

  public function __construct() {
    $this->addType('transactionId', 'integer');
    $this->addType('destAccountId', 'integer');
    $this->addType('value', 'float');
    $this->addType('convertRate', 'float');
  }

  public function jsonSerialize() {
    return [
      'id' => $this->id,
      'transactionId' => $this->transactionId,
      'destAccountId' => $this->destAccountId,
      'value' => $this->value,
      'convertRate' => $this->convertRate,
      'description' => $this->description
    ];
  }

}

?>
