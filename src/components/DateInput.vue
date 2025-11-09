<template>
  <label class="flex flex-col items-baseline">
    {{ label }}
    <DatePicker
      class="date-input w-full"
      v-model:value="dateValue"
      type="date"
      :append-to-body="true"
      :placeholder="placeholder"
      :formatter="formatter"
      :disabled="!editable"
      :clearable="false"
    >
      <template #icon-calendar>
        <NcIconSvgWrapper
          :path="mdiCalendarBlank"
          :size="20"
        />
      </template>
    </DatePicker>
  </label>
</template>

<style>
  .date-input.mx-datepicker .mx-input-wrapper .mx-input {
    background: transparent !important;
    border: 2px solid transparent !important;
    box-shadow: none;
  }

  .date-input.mx-datepicker:not(.disabled) .mx-input-wrapper .mx-input:hover,
  .date-input.mx-datepicker .mx-input-wrapper .mx-input:focus {
    border-color: var(--color-primary-element) !important;
  }

  .mx-icon-left:before,
  .mx-icon-right:before,
  .mx-icon-double-left:before,
  .mx-icon-double-right:before,
  .mx-icon-double-left:after,
  .mx-icon-double-right:after {
    content: '';
    position: relative;
    top: -1px;
    display: inline-block;
    width: 10px;
    height: 10px;
    vertical-align: middle;
    border-style: solid;
    border-color: currentColor;
    border-width: 2px 0 0 2px;
    border-radius: 1px;
    box-sizing: border-box;
    transform-origin: center;
    transform: rotate(-45deg) scale(0.7);
  }

  .mx-icon-double-left:after {
    left: -4px;
  }

  .mx-icon-double-right:before {
    left: 4px;
  }

  .mx-icon-right:before,
  .mx-icon-double-right:before,
  .mx-icon-double-right:after {
    transform: rotate(135deg) scale(0.7);
  }

  .mx-btn {
    box-sizing: border-box;
    line-height: 1;
    font-size: 14px;
    font-weight: 500;
    padding: 7px 15px;
    margin: 0;
    cursor: pointer;
    background-color: transparent;
    outline: none;
    border: 1px solid rgba(0, 0, 0, 0.1);
    border-radius: 4px;
    color: #73879c;
    white-space: nowrap;
  }

  .mx-btn:hover {
    border-color: #1284e7;
    color: #1284e7;
  }

  .mx-btn-text {
    border: 0;
    padding: 0 4px;
    text-align: left;
    line-height: inherit;
  }

  .mx-scrollbar {
    height: 100%;
  }

  .mx-scrollbar:hover .mx-scrollbar-track {
    opacity: 1;
  }

  .mx-scrollbar-wrap {
    height: 100%;
    overflow-x: hidden;
    overflow-y: auto;
  }

  .mx-scrollbar-track {
    position: absolute;
    top: 2px;
    right: 2px;
    bottom: 2px;
    width: 6px;
    z-index: 1;
    border-radius: 4px;
    opacity: 0;
    transition: opacity 0.24s ease-out;
  }

  .mx-scrollbar-track .mx-scrollbar-thumb {
    position: absolute;
    width: 100%;
    height: 0;
    cursor: pointer;
    border-radius: inherit;
    background-color: #9093994d;
    transition: background-color 0.3s;
  }

  .mx-zoom-in-down-enter-active,
  .mx-zoom-in-down-leave-active {
    opacity: 1;
    transform: scaleY(1);
    transition:
      transform 0.3s cubic-bezier(0.23, 1, 0.32, 1),
      opacity 0.3s cubic-bezier(0.23, 1, 0.32, 1);
    transform-origin: center top;
  }

  .mx-zoom-in-down-enter,
  .mx-zoom-in-down-enter-from,
  .mx-zoom-in-down-leave-to {
    opacity: 0;
    transform: scaleY(0);
  }

  .mx-datepicker {
    position: relative;
    display: inline-block;
    width: 210px;
  }

  .mx-datepicker svg {
    width: 1em;
    height: 1em;
    vertical-align: -0.15em;
    fill: currentColor;
    overflow: hidden;
  }

  .mx-datepicker-inline {
    width: auto;
  }

  .mx-input-wrapper {
    position: relative;
  }

  .mx-input-wrapper .mx-icon-clear {
    display: none;
  }

  .mx-input-wrapper:hover .mx-icon-clear {
    display: block;
  }

  .mx-input-wrapper:hover .mx-icon-clear + .mx-icon-calendar {
    display: none;
  }

  .mx-input {
    display: inline-block;
    box-sizing: border-box;
    width: 100%;
    height: 34px;
    padding: 6px 30px 6px 10px;
    font-size: 14px;
    line-height: 1.4;
    color: #555;
    background-color: #fff;
    border: 1px solid #ccc;
    border-radius: 4px;
    box-shadow: inset 0 1px 1px #00000013;
  }

  .mx-input:hover,
  .mx-input:focus {
    border-color: #409aff;
  }

  .mx-input:disabled,
  .mx-input.disabled {
    color: #ccc;
    background-color: #f3f3f3;
    border-color: #ccc;
    cursor: not-allowed;
  }

  .mx-input:focus {
    outline: none;
  }

  .mx-input::-ms-clear {
    display: none;
  }

  .mx-icon-calendar,
  .mx-icon-clear {
    position: absolute;
    top: 50%;
    right: 8px;
    transform: translateY(-50%);
    font-size: 16px;
    line-height: 1;
    color: #00000080;
    vertical-align: middle;
  }

  .mx-icon-clear {
    cursor: pointer;
  }

  .mx-icon-clear:hover {
    color: #000c;
  }

  .mx-datepicker-main {
    font:
      14px/1.5 Helvetica Neue,
      Helvetica,
      Arial,
      Microsoft Yahei,
      sans-serif;
    color: #73879c;
    background-color: #fff;
    border: 1px solid #e8e8e8;
  }

  .mx-datepicker-popup {
    position: absolute;
    margin-top: 1px;
    margin-bottom: 1px;
    box-shadow: 0 6px 12px #0000002d;
    z-index: 2001;
  }

  .mx-datepicker-sidebar {
    float: left;
    box-sizing: border-box;
    width: 100px;
    padding: 6px;
    overflow: auto;
  }

  .mx-datepicker-sidebar + .mx-datepicker-content {
    margin-left: 100px;
    border-left: 1px solid #e8e8e8;
  }

  .mx-datepicker-body {
    position: relative;
    -webkit-user-select: none;
    user-select: none;
  }

  .mx-btn-shortcut {
    display: block;
    padding: 0 6px;
    line-height: 24px;
  }

  .mx-datepicker-header {
    padding: 6px 8px;
    border-bottom: 1px solid #e8e8e8;
  }

  .mx-datepicker-footer {
    padding: 6px 8px;
    text-align: right;
    border-top: 1px solid #e8e8e8;
  }

  .mx-calendar {
    box-sizing: border-box;
    width: 248px;
    padding: 6px 12px;
  }

  .mx-calendar + .mx-calendar {
    border-left: 1px solid #e8e8e8;
  }

  .mx-calendar-header {
    box-sizing: border-box;
    height: 34px;
    line-height: 34px;
    text-align: center;
    overflow: hidden;
  }

  .mx-btn-icon-left,
  .mx-btn-icon-double-left {
    float: left;
  }

  .mx-btn-icon-right,
  .mx-btn-icon-double-right {
    float: right;
  }

  .mx-calendar-header-label {
    font-size: 14px;
  }

  .mx-calendar-decade-separator {
    margin: 0 2px;
  }

  .mx-calendar-decade-separator:after {
    content: '~';
  }

  .mx-calendar-content {
    position: relative;
    height: 224px;
    box-sizing: border-box;
  }

  .mx-calendar-content .cell {
    cursor: pointer;
  }

  .mx-calendar-content .cell:hover {
    color: #73879c;
    background-color: #f3f9fe;
  }

  .mx-calendar-content .cell.active {
    color: #fff;
    background-color: #1284e7;
  }

  .mx-calendar-content .cell.in-range,
  .mx-calendar-content .cell.hover-in-range {
    color: #73879c;
    background-color: #dbedfb;
  }

  .mx-calendar-content .cell.disabled {
    cursor: not-allowed;
    color: #ccc;
    background-color: #f3f3f3;
  }

  .mx-calendar-week-mode .mx-date-row {
    cursor: pointer;
  }

  .mx-calendar-week-mode .mx-date-row:hover {
    background-color: #f3f9fe;
  }

  .mx-calendar-week-mode .mx-date-row.mx-active-week {
    background-color: #dbedfb;
  }

  .mx-calendar-week-mode .mx-date-row .cell:hover,
  .mx-calendar-week-mode .mx-date-row .cell.active {
    color: inherit;
    background-color: transparent;
  }

  .mx-week-number {
    opacity: 0.5;
  }

  .mx-table {
    table-layout: fixed;
    border-collapse: separate;
    border-spacing: 0;
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    text-align: center;
  }

  .mx-table th {
    padding: 0;
    font-weight: 500;
    vertical-align: middle;
  }

  .mx-table td {
    padding: 0;
    vertical-align: middle;
  }

  .mx-table-date td,
  .mx-table-date th {
    height: 32px;
    font-size: 12px;
  }

  .mx-table-date .today {
    color: #2a90e9;
  }

  .mx-table-date .cell.not-current-month {
    color: #ccc;
    background: none;
  }

  .mx-date-time {
    position: relative;
    width: 248px;
    height: 270px;
  }

  .mx-datepicker[data-v-cd1afd2] {
    -webkit-user-select: none;
    user-select: none;
    color: var(--color-main-text);
  }

  .mx-datepicker[data-v-cd1afd2] svg {
    fill: var(--color-main-text);
  }

  .mx-datepicker[data-v-cd1afd2] .mx-input-wrapper .mx-input {
    width: 100%;
    border: 2px solid var(--color-border-maxcontrast);
    background-color: var(--color-main-background);
    background-clip: content-box;
  }

  .mx-datepicker[data-v-cd1afd2]
    .mx-input-wrapper
    .mx-input:active:not(.disabled),
  .mx-datepicker[data-v-cd1afd2]
    .mx-input-wrapper
    .mx-input:hover:not(.disabled),
  .mx-datepicker[data-v-cd1afd2]
    .mx-input-wrapper
    .mx-input:focus:not(.disabled) {
    border-color: var(--color-primary-element);
  }

  .mx-datepicker[data-v-cd1afd2] .mx-input-wrapper:disabled,
  .mx-datepicker[data-v-cd1afd2] .mx-input-wrapper.disabled {
    cursor: not-allowed;
    opacity: 0.7;
  }

  .mx-datepicker[data-v-cd1afd2] .mx-input-wrapper .mx-icon-calendar,
  .mx-datepicker[data-v-cd1afd2] .mx-input-wrapper .mx-icon-clear {
    color: var(--color-text-lighter);
  }

  .mx-datepicker-main {
    color: var(--color-main-text);
    border: 1px solid var(--color-border);
    background-color: var(--color-main-background);
    font-family: var(--font-face) !important;
    line-height: 1.5;
  }

  .mx-datepicker-main svg {
    fill: var(--color-main-text);
  }

  .mx-datepicker-main.mx-datepicker-popup {
    z-index: 2000;
    box-shadow: none;
  }

  .mx-datepicker-main.mx-datepicker-popup
    .mx-datepicker-sidebar
    + .mx-datepicker-content {
    border-left: 1px solid var(--color-border);
  }

  .mx-datepicker-main.show-week-number .mx-calendar {
    width: 296px;
  }

  .mx-datepicker-main .mx-datepicker-header {
    border-bottom: 1px solid var(--color-border);
  }

  .mx-datepicker-main .mx-datepicker-footer {
    border-top: 1px solid var(--color-border);
  }

  .mx-datepicker-main .mx-datepicker-btn-confirm {
    background-color: var(--color-primary-element);
    border-color: var(--color-primary-element);
    color: var(--color-primary-element-text) !important;
    opacity: 1 !important;
  }

  .mx-datepicker-main .mx-datepicker-btn-confirm:hover {
    background-color: var(--color-primary-element-light) !important;
    border-color: var(--color-primary-element-light) !important;
  }

  .mx-datepicker-main .mx-calendar {
    width: 264px;
    padding: 5px;
  }

  .mx-datepicker-main .mx-calendar.mx-calendar-week-mode {
    width: 296px;
  }

  .mx-datepicker-main .mx-calendar + .mx-calendar {
    border-left: 1px solid var(--color-border);
  }

  .mx-datepicker-main .mx-table {
    text-align: center;
  }

  .mx-datepicker-main .mx-table thead > tr > th {
    text-align: center;
    opacity: 0.5;
    color: var(--color-text-lighter);
  }

  .mx-datepicker-main .mx-table tr:focus,
  .mx-datepicker-main .mx-table tr:hover,
  .mx-datepicker-main .mx-table tr:active {
    background-color: transparent;
  }

  .mx-datepicker-main .mx-table .cell {
    transition: all 0.1s ease-in-out;
    text-align: center;
    opacity: 0.7;
    border-radius: 50px;
  }

  .mx-datepicker-main .mx-table .cell > * {
    cursor: pointer;
  }

  .mx-datepicker-main .mx-table .cell.today {
    opacity: 1;
    color: var(--color-primary-element);
    font-weight: 700;
  }

  .mx-datepicker-main .mx-table .cell.today:hover,
  .mx-datepicker-main .mx-table .cell.today:focus {
    color: var(--color-primary-element-text);
  }

  .mx-datepicker-main .mx-table .cell.in-range,
  .mx-datepicker-main .mx-table .cell.disabled {
    border-radius: 0;
    font-weight: 400;
  }

  .mx-datepicker-main .mx-table .cell.in-range {
    opacity: 0.7;
  }

  .mx-datepicker-main .mx-table .cell.not-current-month {
    opacity: 0.5;
    color: var(--color-text-lighter);
  }

  .mx-datepicker-main .mx-table .cell.not-current-month:hover,
  .mx-datepicker-main .mx-table .cell.not-current-month:focus {
    opacity: 1;
  }

  .mx-datepicker-main .mx-table .cell:hover,
  .mx-datepicker-main .mx-table .cell:focus,
  .mx-datepicker-main .mx-table .cell.actived,
  .mx-datepicker-main .mx-table .cell.active,
  .mx-datepicker-main .mx-table .cell.in-range {
    opacity: 1;
    color: var(--color-primary-element-text);
    background-color: var(--color-primary-element);
    font-weight: 700;
  }

  .mx-datepicker-main .mx-table .cell.disabled {
    opacity: 0.5;
    color: var(--color-text-lighter);
    border-radius: 0;
    background-color: var(--color-background-darker);
  }

  .mx-datepicker-main .mx-table .mx-week-number {
    text-align: center;
    opacity: 0.7;
    border-radius: 50px;
  }

  .mx-datepicker-main .mx-table span.mx-week-number,
  .mx-datepicker-main .mx-table li.mx-week-number,
  .mx-datepicker-main .mx-table span.cell,
  .mx-datepicker-main .mx-table li.cell {
    min-height: 32px;
  }

  .mx-datepicker-main .mx-table.mx-table-date thead,
  .mx-datepicker-main .mx-table.mx-table-date tbody,
  .mx-datepicker-main .mx-table.mx-table-year,
  .mx-datepicker-main .mx-table.mx-table-month {
    display: flex;
    flex-direction: column;
    justify-content: space-around;
  }

  .mx-datepicker-main .mx-table.mx-table-date thead tr,
  .mx-datepicker-main .mx-table.mx-table-date tbody tr,
  .mx-datepicker-main .mx-table.mx-table-year tr,
  .mx-datepicker-main .mx-table.mx-table-month tr {
    display: inline-flex;
    align-items: center;
    flex: 1 1 32px;
    justify-content: space-around;
    min-height: 32px;
  }

  .mx-datepicker-main .mx-table.mx-table-date thead th,
  .mx-datepicker-main .mx-table.mx-table-date thead td,
  .mx-datepicker-main .mx-table.mx-table-date tbody th,
  .mx-datepicker-main .mx-table.mx-table-date tbody td,
  .mx-datepicker-main .mx-table.mx-table-year th,
  .mx-datepicker-main .mx-table.mx-table-year td,
  .mx-datepicker-main .mx-table.mx-table-month th,
  .mx-datepicker-main .mx-table.mx-table-month td {
    display: flex;
    align-items: center;
    flex: 0 1 32%;
    justify-content: center;
    min-width: 32px;
    height: 95%;
    min-height: 32px;
    transition: background 0.1s ease-in-out;
  }

  .mx-datepicker-main .mx-table.mx-table-year tr th,
  .mx-datepicker-main .mx-table.mx-table-year tr td {
    flex-basis: 48%;
  }

  .mx-datepicker-main .mx-table.mx-table-date tr th,
  .mx-datepicker-main .mx-table.mx-table-date tr td {
    flex-basis: 32px;
  }

  .mx-datepicker-main .mx-btn {
    min-width: 32px;
    height: 32px;
    margin: 0 2px !important;
    padding: 7px 10px;
    cursor: pointer;
    text-decoration: none;
    opacity: 0.5;
    color: var(--color-text-lighter);
    border-radius: 32px;
    line-height: 20px;
  }

  .mx-datepicker-main .mx-btn:hover,
  .mx-datepicker-main .mx-btn:focus {
    opacity: 1;
    color: var(--color-main-text);
    background-color: var(--color-background-darker);
  }

  .mx-datepicker-main .mx-calendar-header {
    display: inline-flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    height: 44px;
    margin-bottom: 4px;
  }

  .mx-datepicker-main .mx-calendar-header button {
    min-width: 32px;
    min-height: 32px;
    margin: 0;
    cursor: pointer;
    text-align: center;
    text-decoration: none;
    opacity: 0.7;
    color: var(--color-main-text);
    border-radius: 32px;
    line-height: 20px;
  }

  .mx-datepicker-main .mx-calendar-header button:hover,
  .mx-datepicker-main .mx-calendar-header button:focus {
    opacity: 1;
    color: var(--color-main-text);
    background-color: var(--color-background-darker);
  }

  .mx-datepicker-main .mx-calendar-header button.mx-btn-icon-double-left,
  .mx-datepicker-main .mx-calendar-header button.mx-btn-icon-left,
  .mx-datepicker-main .mx-calendar-header button.mx-btn-icon-right,
  .mx-datepicker-main .mx-calendar-header button.mx-btn-icon-double-right {
    align-items: center;
    justify-content: center;
    width: 32px;
    padding: 0;
  }

  .mx-datepicker-main .mx-calendar-header button.mx-btn-icon-double-left > i,
  .mx-datepicker-main .mx-calendar-header button.mx-btn-icon-left > i,
  .mx-datepicker-main .mx-calendar-header button.mx-btn-icon-right > i,
  .mx-datepicker-main .mx-calendar-header button.mx-btn-icon-double-right > i {
    background-repeat: no-repeat;
    background-size: 16px;
    background-position: center;
    filter: var(--background-invert-if-dark);
    display: inline-block;
    width: 32px;
    height: 32px;
  }

  .mx-datepicker-main
    .mx-calendar-header
    button.mx-btn-icon-double-left
    > i:after,
  .mx-datepicker-main
    .mx-calendar-header
    button.mx-btn-icon-double-left
    > i:before,
  .mx-datepicker-main .mx-calendar-header button.mx-btn-icon-left > i:after,
  .mx-datepicker-main .mx-calendar-header button.mx-btn-icon-left > i:before,
  .mx-datepicker-main .mx-calendar-header button.mx-btn-icon-right > i:after,
  .mx-datepicker-main .mx-calendar-header button.mx-btn-icon-right > i:before,
  .mx-datepicker-main
    .mx-calendar-header
    button.mx-btn-icon-double-right
    > i:after,
  .mx-datepicker-main
    .mx-calendar-header
    button.mx-btn-icon-double-right
    > i:before {
    content: none;
  }

  .mx-datepicker-main .mx-calendar-header button.mx-btn-text {
    line-height: initial;
  }

  .mx-datepicker-main .mx-calendar-header .mx-calendar-header-label {
    display: flex;
  }

  .mx-datepicker-main .mx-calendar-header .mx-btn-icon-double-left > i {
    background-image: url("data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20width='24'%20height='24'%20fill='%23222'%3e%3cpath%20d='M18.4%207.4L17%206l-6%206%206%206%201.4-1.4-4.6-4.6%204.6-4.6m-6%200L11%206l-6%206%206%206%201.4-1.4L7.8%2012l4.6-4.6z'/%3e%3c/svg%3e");
  }

  .mx-datepicker-main .mx-calendar-header .mx-btn-icon-left > i {
    background-image: url("data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20width='24'%20height='24'%20fill='%23222'%3e%3cpath%20d='M15.4%2016.6L10.8%2012l4.6-4.6L14%206l-6%206%206%206%201.4-1.4z'/%3e%3c/svg%3e");
  }

  .mx-datepicker-main .mx-calendar-header .mx-btn-icon-right > i {
    background-image: url("data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20width='24'%20height='24'%20fill='%23222'%3e%3cpath%20d='M8.6%2016.6l4.6-4.6-4.6-4.6L10%206l6%206-6%206-1.4-1.4z'/%3e%3c/svg%3e");
  }

  .mx-datepicker-main .mx-calendar-header .mx-btn-icon-double-right > i {
    background-image: url("data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20width='24'%20height='24'%20fill='%23222'%3e%3cpath%20d='M5.6%207.4L7%206l6%206-6%206-1.4-1.4%204.6-4.6-4.6-4.6m6%200L13%206l6%206-6%206-1.4-1.4%204.6-4.6-4.6-4.6z'/%3e%3c/svg%3e");
  }

  .mx-datepicker-main .mx-calendar-header button.mx-btn-icon-right {
    order: 2;
  }

  .mx-datepicker-main .mx-calendar-header button.mx-btn-icon-double-right {
    order: 3;
  }

  .mx-datepicker-main .mx-calendar-week-mode .mx-date-row .mx-week-number {
    font-weight: 700;
  }

  .mx-datepicker-main .mx-calendar-week-mode .mx-date-row:hover,
  .mx-datepicker-main .mx-calendar-week-mode .mx-date-row.mx-active-week {
    opacity: 1;
    border-radius: 50px;
    background-color: var(--color-background-dark);
  }

  .mx-datepicker-main .mx-calendar-week-mode .mx-date-row:hover td,
  .mx-datepicker-main .mx-calendar-week-mode .mx-date-row.mx-active-week td {
    background-color: transparent;
  }

  .mx-datepicker-main .mx-calendar-week-mode .mx-date-row:hover td,
  .mx-datepicker-main .mx-calendar-week-mode .mx-date-row:hover td:hover,
  .mx-datepicker-main .mx-calendar-week-mode .mx-date-row:hover td:focus,
  .mx-datepicker-main .mx-calendar-week-mode .mx-date-row.mx-active-week td,
  .mx-datepicker-main
    .mx-calendar-week-mode
    .mx-date-row.mx-active-week
    td:hover,
  .mx-datepicker-main
    .mx-calendar-week-mode
    .mx-date-row.mx-active-week
    td:focus {
    color: inherit;
  }

  .mx-datepicker-main .mx-calendar-week-mode .mx-date-row.mx-active-week {
    color: var(--color-primary-element-text);
    background-color: var(--color-primary-element);
  }

  .mx-datepicker-main .mx-calendar-week-mode .mx-date-row.mx-active-week td {
    opacity: 0.7;
    font-weight: 400;
  }

  .material-design-icon {
    display: flex;
    align-self: center;
    justify-self: center;
    align-items: center;
    justify-content: center;
  }

  .vs__dropdown-menu--floating {
    z-index: 100001 !important;
  }
</style>

<style scoped>
  .mx-datepicker :deep(.mx-input-wrapper .mx-input) {
    background-clip: border-box;
  }

  .material-design-icon {
    display: flex;
    align-self: center;
    justify-self: center;
    align-items: center;
    justify-content: center;
  }

  .mx-datepicker .mx-input-wrapper .mx-input {
    background-clip: border-box;
  }

  .datetime-picker-inline-icon {
    opacity: 0.3;
    border: none;
    background-color: transparent;
    border-radius: 0;
    padding: 0 !important;
    margin: 0;
  }

  .datetime-picker-inline-icon--highlighted {
    opacity: 0.7;
  }

  .datetime-picker-inline-icon:focus,
  .datetime-picker-inline-icon:hover {
    opacity: 1;
  }
</style>

<script setup lang="ts">
  import dayjs from 'dayjs';

  import DatePicker from 'vue-datepicker-next';
  import 'vue-datepicker-next/index.css';

  import { mdiCalendarBlank } from '@mdi/js';

  import { computed } from 'vue';

  import { NcIconSvgWrapper } from '@nextcloud/vue';

  const props = defineProps({
    date: {
      type: Date,
      required: true
    },
    placeholder: {
      type: String,
      default: ''
    },
    label: {
      type: String,
      default: ''
    },
    editable: {
      type: Boolean,
      default: true
    }
  });

  const emit = defineEmits<{
    (event: 'date-changed', newDate: Date): void;
  }>();

  const dateValue = computed({
    get() {
      return props.date;
    },
    set(newDateValue) {
      emit('date-changed', newDateValue);
    }
  });

  const formatter = {
    stringify: (date: Date): string => dayjs(date).format('L'),
    parse: (value: string): Date => getDateFromValue(value)
  };

  function getDateFromValue(value: string): Date {
    const date =
      ['L', 'D', 'DD']
        .map((f) => dayjs(value, f))
        .find((djs) => djs.isValid()) ?? dayjs();

    return date.toDate();
  }
</script>
