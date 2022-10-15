## [Unreleased]

### Changed

- Use user's locale for date formatting
- Improve layout/design of transaction import dialog

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
