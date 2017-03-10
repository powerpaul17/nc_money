<?php

OCP\User::checkLoggedIn();
OCP\App::checkAppEnabled('money');

$template = new \OCP\Template('money', 'personal');

// TODO: Pass in all values from config!
$userId = OCP\User::getUser();

$accountSummaryCurrency = OCP\Config::getUserValue($userId, 'money', 'accountSummaryCurrency');
$template->assign('accountSummaryCurrency', $accountSummaryCurrency);

return $template->fetchPage();

?>
