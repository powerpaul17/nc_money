angular.module('moneyApp')
.service('AccountService', function($q, CacheFactory, uuid4, $http) {
  var cacheFilled = false;
  var accounts = CacheFactory('money');
  var observerCallbacks = [];
  var loadPromise = undefined;

  this.registerObserverCallback = function(callback) {
    observerCallbacks.push(callback);
  };

  var notifyObservers = function(eventName, uid) {
    var ev = {
      event: eventName,
      uid: uid,
      accounts: acounts.values()
    };
    angular.forEach(observerCallbacks, function(callback) {
      callback(ev);
    });
  };

  this.fillCache = function() {
    if(_.isUndefined(loadPromise)) {
      loadPromise = $http.get("ajax/get-accounts");
      loadPromise.success(function(data, status, headers, config) {
        for(var i in data) {
          accounts.put(data[i].id, data[i]);
        }
        cacheFilled = true;
      });
    }
    return loadPromise;
  };

  this.getAll = function() {
    if(cacheFilled === false) {
      return this.fillCache().then(function() {
        return accounts.values();
      });
    } else {
      return $q.when(accounts.values());
    }
  };

  // this.getById = function(uid) {
  // 	if(cacheFilled === false) {
  // 		return this.fillCache().then(function() {
  // 			return accounts.get(uid);
  // 		});
  // 	} else {
  // 		return $q.when(accounts.get(uid));
  // 	}
  // };

  this.update = function(account) {
  	// return DavClient.updateCard(contact.data, {json: true}).then(function(xhr) {
  	// 	notifyObservers('update', account.uid());
  	// });
  };

  this.create = function(newAccount, uid) {
//  	newAccount = newAccount || new Contact(addressBook);
  	// var newUid = '';
  	// if(uuid4.validate(uid)) {
  	// 	newUid = uid;
  	// } else {
  	// 	newUid = uuid4.generate();
  	// }
  // 		newContact.uid(newUid);
  // 		if (_.isUndefined(newContact.fullName()) || newContact.fullName() === '') {
  // 			newContact.fullName(t('contacts', 'New contact'));
  // 		}
  //
  // 		return DavClient.createCard(
  // 			addressBook,
  // 			{
  // 				data: newContact.data.addressData,
  // 				filename: newUid + '.vcf'
  // 			}
  // 		).then(function(xhr) {
  // 			newContact.setETag(xhr.getResponseHeader('ETag'));
  // 			contacts.put(newUid, newContact);
  // 			notifyObservers('create', newUid);
  // 			return newContact;
  // 		}).catch(function(xhr) {
  // 			var msg = t('contacts', 'Contact could not be created.');
  // 			if (!angular.isUndefined(xhr) && !angular.isUndefined(xhr.responseXML) && !angular.isUndefined(xhr.responseXML.getElementsByTagNameNS('http://sabredav.org/ns', 'message'))) {
  // 				if ($(xhr.responseXML.getElementsByTagNameNS('http://sabredav.org/ns', 'message')).text()) {
  // 					msg = $(xhr.responseXML.getElementsByTagNameNS('http://sabredav.org/ns', 'message')).text();
  // 				}
  // 			}
  //
  // 			OC.Notification.showTemporary(msg);
  // 		});
  };

  	// this.getGroups = function () {
  		// return this.getAll().then(function(contacts) {
  		// 	return _.uniq(contacts.map(function (element) {
  		// 		return element.categories();
  		// 	}).reduce(function(a, b) {
  		// 		return a.concat(b);
  		// 	}, []).sort(), true);
  		// });
  	// };

// function(DavClient, AddressBookService, Contact, $q, CacheFactory, uuid4) {
//
//
// 	this.fillCache = function() {
// 		if (_.isUndefined(loadPromise)) {
// 			loadPromise = AddressBookService.getAll().then(function (enabledAddressBooks) {
// 				var promises = [];
// 				enabledAddressBooks.forEach(function (addressBook) {
// 					promises.push(
// 						AddressBookService.sync(addressBook).then(function (addressBook) {
// 							for (var i in addressBook.objects) {
// 								if (addressBook.objects[i].addressData) {
// 									var contact = new Contact(addressBook, addressBook.objects[i]);
// 									contacts.put(contact.uid(), contact);
// 								} else {
// 									// custom console
// 									console.log('Invalid contact received: ' + addressBook.objects[i].url);
// 								}
// 							}
// 						})
// 					);
// 				});
// 				return $q.all(promises).then(function () {
// 					cacheFilled = true;
// 				});
// 			});
// 		}
// 		return loadPromise;
// 	};
//

//

//
//
// 	this.import = function(data, type, addressBook, progressCallback) {
// 		addressBook = addressBook || AddressBookService.getDefaultAddressBook();
//
// 		var regexp = /BEGIN:VCARD[\s\S]*?END:VCARD/mgi;
// 		var singleVCards = data.match(regexp);
//
// 		if (!singleVCards) {
// 			OC.Notification.showTemporary(t('contacts', 'No contacts in file. Only VCard files are allowed.'));
// 			if (progressCallback) {
// 				progressCallback(1);
// 			}
// 			return;
// 		}
// 		var num = 1;
// 		for(var i in singleVCards) {
// 			var newContact = new Contact(addressBook, {addressData: singleVCards[i]});
// 			if (['3.0', '4.0'].indexOf(newContact.version()) < 0) {
// 				if (progressCallback) {
// 					progressCallback(num / singleVCards.length);
// 				}
// 				OC.Notification.showTemporary(t('contacts', 'Only VCard version 4.0 (RFC6350) or version 3.0 (RFC2426) are supported.'));
// 				num++;
// 				continue;
// 			}
// 			this.create(newContact, addressBook).then(function() {
// 				// Update the progress indicator
// 				if (progressCallback) {
// 					progressCallback(num / singleVCards.length);
// 				}
// 				num++;
// 			});
// 		}
// 	};
//
// 	this.moveContact = function (contact, addressbook) {
// 		if (contact.addressBookId === addressbook.displayName) {
// 			return;
// 		}
// 		contact.syncVCard();
// 		var clone = angular.copy(contact);
// 		var uid = contact.uid();
//
// 		// delete the old one before to avoid conflict
// 		this.delete(contact);
//
// 		// create the contact in the new target addressbook
// 		this.create(clone, addressbook, uid);
// 	};
//
// 	this.delete = function(contact) {
// 		// delete contact from server
// 		return DavClient.deleteCard(contact.data).then(function() {
// 			contacts.remove(contact.uid());
// 			notifyObservers('delete', contact.uid());
// 		});
// 	};
});
