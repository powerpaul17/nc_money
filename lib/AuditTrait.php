<?php

namespace OCA\Money;

use JsonSerializable;

use OCP\EventDispatcher\IEventDispatcher;
use OCP\Log\Audit\CriticalActionPerformedEvent;
use OCP\AppFramework\Db\Entity;

trait AuditTrait {

  private IEventDispatcher $dispatcher;

  private function emitCreateAuditEvent(string $userId, string $entityName, Entity $entity) {
    $this->emitAuditEvent('user \'%s\' created a %s: %s', [
      $userId,
      $entityName,
      json_encode($entity)
    ]);
  }

  private function emitUpdateAuditEvents(
    string $userId,
    string $entityName,
    Entity $newEntity,
    Entity $oldEntity
  ) {
    $lines = $this->getLogLinesForEntityChanges(
      $newEntity->jsonSerialize(),
      $oldEntity->jsonSerialize()
    );

    foreach($lines as $line) {
      $this->emitAuditEvent('user \'%s\' ' . $line . ' of %s with id %s', [
        $userId,
        $entityName,
        $newEntity->id
      ]);
    }
  }

  private function emitDeleteAuditEvent(string $userId, string $entityName, Entity $entity) {
    $this->emitAuditEvent('user \'%s\' deleted %s: %s', [
      $userId,
      $entityName,
      json_encode($entity)
    ]);
  }

  private function emitAuditEvent(string $message, array $params) {
    $event = new CriticalActionPerformedEvent(
        $message,
        $params
    );

    $this->getDispatcher()->dispatchTyped($event);
  }

  private function getLogLinesForEntityChanges(array $newEntity, array $oldEntity) {
    $changes = array_diff(
      $newEntity,
      $oldEntity
    );

    $lines = [];

    foreach($changes as $key => $value) {
      array_push($lines, 'changed ' . $key . ' from ' . $oldEntity[$key] . ' to ' . $value);
    }

    return $lines;
  }

  private function getDispatcher(): IEventDispatcher {
    if(!isset($this->dispatcher)) {
      $this->dispatcher = \OCP\Server::get(IEventDispatcher::class);
    }

    return $this->dispatcher;
  }

}
