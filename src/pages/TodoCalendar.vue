<template>
  <header style="display: flex; justify-content: center; align-items: center; margin: 8px 0 0">
    <q-btn icon="chevron_left" flat round @click="viewPreviousMonth()" />
    <span class="q-mx-sm"
      >{{ monthList[viewMonthFirstDate.getMonth()] }}, {{ viewMonthFirstDate.getFullYear() }}</span
    >
    <q-btn icon="chevron_right" flat round @click="viewNextMonth()" />
  </header>
  <div class="q-pa-sm">
    <div class="row">
      <div
        style="
          width: calc(100% / 7);
          height: 4ex;
          display: flex;
          align-items: center;
          justify-content: center;
          box-sizing: border-box;
          border: 1px solid #ddd;
        "
        v-for="date of dateList"
        :key="date"
      >
        {{ date }}
      </div>
    </div>
    <div
      class="row"
      style="border-color: #ddd; border-left: 1px; border-right: 1px"
      v-for="(week, index) of viewDateArr"
      :key="index"
    >
      <div
        class="q-pa-xs"
        :class="[
          date.isToday
            ? 'text-primary text-bold'
            : date.isActivateDate
              ? 'text-default'
              : 'text-blue-grey-6',
        ]"
        style="width: calc(100% / 7); height: 60px; box-sizing: border-box; border: 1px solid #ddd"
        v-for="date of week"
        :key="date.dateIntlStr"
      >
        {{ date.date }}
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { formatDate } from 'src/utils/formatter';
import { computed, ref } from 'vue';

interface IDate {
  dateObj: Date;
  dateIntlStr: string;
  date: number;
  isActivateDate: boolean;
  isToday: boolean;
}

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

// TODO: maybe load todo here
function _dateConstructor(date: Date, isActivateDate: boolean): IDate {
  const dateIntlStr = formatDate(date);
  return {
    dateObj: date,
    dateIntlStr: formatDate(date),
    date: date.getDate(),
    isActivateDate,
    isToday: todayIntlStr === dateIntlStr,
  };
}
</script>
