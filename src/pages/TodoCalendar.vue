<template>
  <header style="display: flex; justify-content: center; align-items: center; margin: 8px 0 0">
    <q-btn icon="chevron_left" flat round @click="viewPreviousMonth()" />
    <span class="q-mx-sm"
      >{{ monthList[viewMonthFirstDate.getMonth()] }}, {{ viewMonthFirstDate.getFullYear() }}</span
    >
    <q-btn icon="chevron_right" flat round @click="viewNextMonth()" />
  </header>
  <div class="q-pa-sm">
    <div class="calendar__row">
      <div class="calendar__column calendar__column--header" v-for="date of dateList" :key="date">
        {{ date }}
      </div>
    </div>
    <div class="calendar__row" v-for="(week, index) of viewDateArr" :key="index">
      <div
        class="calendar__column calendar__column--body"
        v-for="date of week"
        :key="date.dateIntlStr"
      >
        <span
          class="calendar__date-mark"
          :class="[
            date.isToday
              ? 'calendar__date-mark--today'
              : date.isActivateDate
                ? 'calendar__date-mark--activate'
                : 'calendar__date-mark--in-activate',
          ]"
          >{{ date.date }}</span
        >
        <ul class="calendar__todo-list" v-if="date.todoList.length > 0">
          <li v-for="todo in date.todoList" :key="todo.id">{{ todo.title }}</li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
// TODO: Calendar Date detail
import { computed, ref } from 'vue';

import type { Todo } from 'components/models';
import { todoStore } from 'stores/todo-store';
import { formatDate } from 'src/utils/formatter';

interface IDate {
  dateObj: Date;
  dateIntlStr: string;
  date: number;
  isActivateDate: boolean;
  isToday: boolean;
  todoList: Array<Todo>
}

const _todoStore = todoStore();
const dateList = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const monthList = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];
const viewMonthFirstDate = ref(_getFirstDate(new Date()));
let todayIntlStr = formatDate(new Date());

const viewDateArr = computed(() => {
  const previousMonthLastDate = new Date(viewMonthFirstDate.value.valueOf() - 24 * 60 * 60 * 1000);
  const nextMonthFirstDate = new Date(
    viewMonthFirstDate.value.getMonth() === 11
      ? `${viewMonthFirstDate.value.getFullYear() + 1}-1-1`
      : `${viewMonthFirstDate.value.getFullYear()}-${viewMonthFirstDate.value.getMonth() + 2}-1`,
  );
  const firstDay = viewMonthFirstDate.value.getDay();
  const allDateList: Array<IDate> = [];

  // Fill first week of month
  for (let i = 1; i <= 7; i++) {
    if (i <= firstDay) {
      allDateList.push(
        _dateConstructor(
          new Date(
            `${previousMonthLastDate.getFullYear()}-${previousMonthLastDate.getMonth() + 1}-${previousMonthLastDate.getDate() - firstDay + i}`,
          ),
          false,
        ),
      );
    } else {
      allDateList.push(
        _dateConstructor(
          new Date(
            `${viewMonthFirstDate.value.getFullYear()}-${viewMonthFirstDate.value.getMonth() + 1}-${i - firstDay}`,
          ),
          true,
        ),
      );
    }
  }

  const lastDate = new Date(nextMonthFirstDate.valueOf() - 24 * 60 * 60 * 1000);
  const monthLength = lastDate.getDate();

  // Fill main days of month
  // because first day start with 0
  for (let i = 7 - firstDay + 1; i <= monthLength; i++) {
    allDateList.push(
      _dateConstructor(
        new Date(
          `${viewMonthFirstDate.value.getFullYear()}-${viewMonthFirstDate.value.getMonth() + 1}-${i}`,
        ),
        true,
      ),
    );
  }

  // make sure calendar is a square
  let nextMonthIndex = 0;
  while (allDateList.length % 7 > 0) {
    allDateList.push(
      _dateConstructor(
        new Date(
          `${nextMonthFirstDate.getFullYear()}-${nextMonthFirstDate.getMonth() + 1}-${++nextMonthIndex}`,
        ),
        false,
      ),
    );
  }

  // rebuild arr as nest with 7 count up
  return allDateList.reduce(
    (acc, cur, index) => {
      if (index % 7 === 0) {
        acc.push([cur]);
      } else {
        acc[acc.length - 1]?.push(cur);
      }
      return acc;
    },
    [] as Array<Array<IDate>>,
  );
});

function viewNextMonth() {
  _refreshConstant();
  const currentDate = viewMonthFirstDate.value;
  viewMonthFirstDate.value = new Date(
    currentDate.getMonth() === 11
      ? `${currentDate.getFullYear() + 1}-1-1`
      : `${currentDate.getFullYear()}-${currentDate.getMonth() + 2}-1`,
  );
}

function viewPreviousMonth() {
  _refreshConstant();
  const currentDate = viewMonthFirstDate.value;
  viewMonthFirstDate.value = new Date(
    currentDate.getMonth() === 0
      ? `${currentDate.getFullYear() - 1}-12-1`
      : `${currentDate.getFullYear()}-${currentDate.getMonth()}-1`,
  );
}

function _refreshConstant() {
  todayIntlStr = formatDate(new Date());
}

function _getFirstDate(target: Date) {
  return new Date(`${target.getFullYear()}-${target.getMonth() + 1}-1`);
}

function _dateConstructor(date: Date, isActivateDate: boolean): IDate {
  const dateIntlStr = formatDate(date);
  return {
    dateObj: date,
    dateIntlStr: formatDate(date),
    date: date.getDate(),
    isActivateDate,
    isToday: todayIntlStr === dateIntlStr,
    todoList: _todoStore.getListByDate(dateIntlStr)
  };
}
</script>
<style lang="scss">
@use 'quasar/src/css/variables' as q;

.calendar {
  &__row {
    display: flex;
    border-left: 1px solid;
    border-color: q.$grey-7;

    &:first-child {
      border-top: 1px solid q.$grey-7;
    }
  }
  &__column {
    box-sizing: border-box;
    width: calc(100% / 7);
    border-right: 1px solid;
    border-bottom: 1px solid;
    border-color: q.$grey;

    &--header {
      height: 4ex;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    &--body {
      min-height: 60px;
    }
  }
  &__date-mark {
    display: inline-block;
    padding: 0 calc(q.$space-base / 2) 0;
    margin: calc(q.$space-base / 4);
    border-radius: 50%;
    min-height: 2em;
    min-width: 2em;
    text-align: center;
    line-height: 2em;

    &--today {
      background: q.$primary;
      color: white;
    }
    &--in-activate {
      color: q.$grey-6;
    }
  }
  &__todo-list {
    font-size: .8em;
    padding-left: q.$space-base * 1.5;
  }
}
</style>
