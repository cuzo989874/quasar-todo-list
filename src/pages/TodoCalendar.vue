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
          <li v-for="todo in date.uncompletedTodoList" :key="todo.id" @click="openTodoPopUp($event, todo)">
            <span>{{ todo.title }}</span>
          </li>
        </ul>
        <div class="text-right text-grey-6 q-px-sm q-pb-xs" v-if="date.completedTodoList.length">
          <q-icon name="task_alt" />
          {{ date.completedTodoList.length }}
        </div>
      </div>
    </div>
    <q-popup-proxy ref="TodoPopUpRef" :target="_todoPopUpTarget" transition-show="scale" transition-hide="scale" no-parent-event>
      <div class="todo-popup" v-if="_activatePopUpTodo">
        <div class="todo-popup__header">
          <h4>{{ _activatePopUpTodo.title }}</h4>
          <p class="text-grey-4 q-mb-sm">{{ _activatePopUpTodo.activateAt }}</p>
        </div>
        <p class="q-px-sm" v-if="_activatePopUpTodo.description">{{ _activatePopUpTodo.description }}</p>
        <footer class="todo-popup__footer">
          <q-btn icon="edit" flat dense round @click="editTodo(_activatePopUpTodo)" />
          <q-btn icon="delete" flat dense round @click="deleteTodo(_activatePopUpTodo)" />
        </footer>
      </div>
    </q-popup-proxy>
  </div>
</template>
<script lang="ts" setup>
import { computed, ref, useTemplateRef } from 'vue';
import { Dialog, QPopupProxy } from 'quasar';

import type { Todo } from 'components/models';
import EditTodoDialog from 'components/features/EditTodoDialog.vue';
import { todoStore } from 'stores/todo-store';
import { formatDate } from 'src/utils/formatter';

interface IDate {
  dateObj: Date;
  dateIntlStr: string;
  date: number;
  isActivateDate: boolean;
  isToday: boolean;
  todoList: Array<Todo>;
  completedTodoList: Array<Todo>;
  uncompletedTodoList: Array<Todo>;
}
const dateList = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as const;
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
] as const;
const viewMonthFirstDate = ref(_getFirstDate(new Date()));

const _todoStore = todoStore();
let _todayIntlStr = formatDate(new Date());

//
const _TodoPopUpRef = useTemplateRef<QPopupProxy>('TodoPopUpRef');
const _todoPopUpTarget = ref<HTMLElement | undefined>(undefined);
const _activatePopUpTodo = ref<Todo | null>(null);

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

function openTodoPopUp(evt: MouseEvent, todo: Todo) {
  _todoPopUpTarget.value = evt.currentTarget as HTMLElement;
  _activatePopUpTodo.value = todo;
  _TodoPopUpRef.value?.show(evt);
}

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

function editTodo(todo: Todo) {
  const dialog = Dialog.create({
    component: EditTodoDialog,
    componentProps: todo,
    persistent: true
  }).onOk((newTodo) => {
    todo.title = newTodo.title;
    todo.description = newTodo.description;
    todo.activateAt = newTodo.activateAt;
    _todoStore.saveTodoList();
    dialog.hide();
  });
}

function deleteTodo(todo: Todo) {
  _todoStore.remove(todo);
}

function _refreshConstant() {
  _todayIntlStr = formatDate(new Date());
}

function _getFirstDate(target: Date) {
  return new Date(`${target.getFullYear()}-${target.getMonth() + 1}-1`);
}

function _dateConstructor(date: Date, isActivateDate: boolean): IDate {
  const dateIntlStr = formatDate(date);
  const todoList = _todoStore.getListByDate(dateIntlStr);
  const { uncompletedTodoList, completedTodoList } = todoList.reduce(
    (acc, cur) => {
      if (cur.completed) {
        acc.completedTodoList.push(cur);
      } else {
        acc.uncompletedTodoList.push(cur);
      }
      return acc;
    },
    {uncompletedTodoList: [] as Todo[], completedTodoList:[] as Todo[]},
  );

  return {
    dateObj: date,
    dateIntlStr: formatDate(date),
    date: date.getDate(),
    isActivateDate,
    isToday: _todayIntlStr === dateIntlStr,
    todoList,
    uncompletedTodoList,
    completedTodoList
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
    margin: calc(q.$space-base / 4);
    border-radius: 50%;
    min-height: 2em;
    min-width: 2em;
    text-align: center;
    line-height: 2em;

    &--today {
      background: q.$primary;
      color: white;
      font-weight: 600;
    }
    &--in-activate {
      color: q.$grey-6;
    }
  }
  &__todo-list {
    font-size: .8em;
    list-style: none;
    padding-left: 0;
    margin-top: calc(q.$space-base / 4);
    margin-bottom: calc(q.$space-base / 2);

    & > li {
      cursor: pointer;
      padding: 2px;
      margin: 0 2px;
      border-radius: 2px;
      transition: background .2s ease;

      &::before {
        content: '';
        display: inline-block;
        width: 0.5em;
        height: 0.5em;
        border-radius: 50%;
        margin: 0 calc(q.$space-base / 2) 0 calc(q.$space-base / 4);
        background: q.$primary;
      }

      &:hover {
        background: q.$blue-5;
      }

      & > span {
        overflow:hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
    }
  }
}
.todo-popup {
  min-width: 300px;
  max-width: min(95vw, 400px);

  &__header {
    padding: calc(q.$space-base / 2);
    color: white;
    background-color: q.$primary;

    & > h4 {
      font-size: 1.2em;
      line-height: 1.414;
      margin: 0;
    }
  }

  &__footer {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    padding: calc(q.$space-base / 4);
    gap: calc(q.$space-base / 2);
    color: q.$grey;
  }
}
</style>
