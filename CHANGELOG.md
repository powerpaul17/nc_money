## [Unreleased]

## [0.29.0] - 2024-09-23

### Added

- Allow switching to yearly account values

## [0.28.0] - 2024-07-05

### Fixed

- Mobile layout problems

### Changed

- Use same book list item in app dashboard & dashboard widget

## [0.27.0] - 2024-06-28

### Added

- Reset input when escape key is pressed
- Implement audit logging
- Save collapsed state of book navigation items
- Enable creation of transactions by pressing enter

### Changed

- Improve account filtering

## [0.26.6] - 2024-06-10

### Changed

- Use correct number format in charts

## [0.26.5] - 2024-06-09

### Changed

- Add missing dayjs import

## [0.26.4] - 2024-06-09

### Changed

- Add missing date conversions in split store/service

## [0.26.3] - 2024-06-04

### Changed

- Save transaction date as string to avoid time zone issues

## [0.26.2] - 2024-05-31

### Changed

- Fix transaction list not updating (again)

## [0.26.1] - 2024-05-25

### Changed

- Fix transaction list not updating

## [0.26.0] - 2024-05-24

### Changed

- Fix wrong link to book in dashboard widget
- Allow creating a new transaction without a destination account

## [0.25.1] - 2024-02-20

### Added

- Migration tests for adding books table

## [0.25.0] - 2024-02-12

### Added

- Group accounts into books

## [0.24.0] - 2024-01-02

### Added

- Respect locale number settings when entering in a currency input
- Add transaction sidebar
- Add mobile view of transactions

### Changed

- Edit splits in transaction sidebar

### Changed

- Enable NC 28

## [0.23.1] - 2023-11-03

### Changed

- Fix typing & wrong account api calls

## [0.23.0] - 2023-11-02

### Added

- Allow sorting/filtering of accounts in list

## [0.22.1] - 2023-10-17

### Changed

- Fix balance calculation for account query & extract query builder generation

## [0.22.0] - 2023-10-12

### Added

- Save transaction import settings to account

## [0.21.2] - 2023-10-06

### Changed

- Add container around each chart to fix dashboard widget

## [0.21.1] - 2023-10-05

### Changed

- Downgrade vue-chartjs to a version supporting vue 2.7 & fix changed chart props

## [0.21.0] - 2023-10-05

### Added

- Automatic selection of matching columns of imported CSV file

### Changed

- Convert stores and services to classes
- Improve bar chart design/layout

## [0.20.0] - 2023-07-29

### Changed

- Enable app for NC 27

## [0.19.0] - 2023-06-05

### Added

- Show charts for account type page

### Changed

- Use date picker for date inputs
- Move accounts from navigation into separate list

## [0.18.0] - 2023-04-20

### Changed

- Improved account selection component

## [0.17.0] - 2023-04-12

### Added

- Added dashboard widget

### Changed

- Improved design/layout of line charts

## [0.16.0] - 2023-04-10

### Added

- Added dashboard with equity & assets/liabilities charts

## [0.15.3] - 2023-03-26

### Changed

- Fix undefined 'process.env.NODE_ENV' variable during build

## [0.15.2] - 2023-03-01

### Changed

- Fix showing monthly account (type) balances

## [0.15.1] - 2023-02-23

### Changed

- Fix updating of account (type) balances

## [0.15.0] - 2023-02-04

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
