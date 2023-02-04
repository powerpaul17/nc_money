## [Unreleased]

### Changed

- Use BlinkDB for storing transactions/splits

## [0.14.2] - 2023-01-31

### Changed

- Fixed naming of migrations

## [0.14.1] - 2023-01-31

### Changed

- Fixed problem with deletion of accounts due to missing database properties

## [0.14.0] - 2023-01-30

### Added

- Allow usage of percentage in mathematical expressions

## [0.13.0] - 2023-01-01

## Changed

- Improved performance of transaction list
- Fixed wrong chart values of income/liabilities account summary
- Limit chart height for small screens

## [0.12.0] - 2022-12-20

### Added

- Show chart in account header

## [0.11.3] - 2022-12-07

### Changed

- Fixed more wrong index checks in split/transaction store

## [0.11.2] - 2022-12-06

### Changed

- Fixed problem with duplicates in split/transaction store

## [0.11.1] - 2022-12-01

### Changed

- Fixed navigation bar appearance in NC 25

## [0.11.0] - 2022-11-30

### Added

- Implement deleting accounts

## [0.10.0] - 2022-11-30

### Added

- Enable renaming of accounts in navigation item

### Changed

- Convert to Vue version 2.7

## [0.9.0] - 2022-11-11

### Added

- Added personal settings section for number format
- Add option for showing inverted income/liabilities account balances

### Changed

- Invert values of income/liabilities accounts to prevent confusion
- Fix dark mode in NC 25

## [0.8.2] - 2022-10-28

### Changed

- Cast account properties in controller instead of client
- Fix opening of account type list item menus

## [0.8.1] - 2022-10-27

### Changed

- Ensure account balances returned from the backend are numbers

## [0.8.0] - 2022-10-26

### Changed

- Show monthly values for income/expense accounts
- Use EXTRACT function instead of YEAR/MONTH in queries for compatibility with PostgreSQL

## [0.7.0] - 2022-10-17

### Changed

- Use user's locale for date formatting
- Improve layout/design of transaction import dialog
- Split value column into credit/debit columns in transaction import dialog

## [0.6.0] - 2022-10-12

### Added

- Group transactions by month

### Changed

- Improved transaction list scrolling

## [0.5.0] - 2022-10-05

### Added

- Added transaction import dialog

### Changed

- Layout/design improvements of transaction list items
- Show account type list items expanded by default

## [0.4.2] - 2022-09-20

### Changed

- Do not round balances in API controllers (may potentially fix problem with PostgreSQL)
- Group currency digits and make it configurable in component

## [0.4.1] - 2022-09-18

### Changed

- Use query builder instead of deprecated direct sql statements in account controller
- Fix error in math expression input when entering leading '-'

## [0.4.0] - 2022-09-06

### Added

- Currency inputs can now accept simple math expressions

### Changed

- Limit account view width for better readability

## [0.3.1] - 2022-08-31

### Changed

- Fixed using correct translation if available
- Moved translations into separate files

## [0.3.0] - 2022-08-30

### Added

- Add I18N
- Add loading icon to transaction/split items

### Changed

- Design improvements
- Fix transaction list scrolling

## [0.2.0] - 2022-08-26

### Changed

- Complete UI overhaul using Vue.js
- Use query builder instead of deprecated direct sql statements

## [0.1.13]

## [0.2.0] - 2017-01-25

Initial release
