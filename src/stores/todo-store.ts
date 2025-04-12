import { defineStore, acceptHMRUpdate } from 'pinia';

import type { Todo } from 'components/models';

import { TodoBus } from 'src/bus/todo-bus';

const _STORAGE = 'todoList';
const _STORAGE_VERSION = 1;

function _patchLocalStorageTodoList(todoList: Array<Todo>) {
  localStorage.setItem(
    _STORAGE,
    JSON.stringify({
      version: _STORAGE_VERSION,
      data: todoList,
    }),
  );
}

function _getLocalStorageTodoList(): Array<Todo> {
  const temp = JSON.parse(localStorage.getItem(_STORAGE) || 'null');

  if (!temp || temp?.version !== _STORAGE_VERSION || !temp?.data) {
    return [];
  }

  return temp.data;
}

function _solveDateListWith(todoList: Array<Todo>): Record<string, Array<Todo>> {
  return todoList
    .sort((a, b) => new Date(a.activateAt).valueOf() - new Date(b.activateAt).valueOf())
    .reduce(
      (acc, todo) => {
        if (!acc[todo.activateAt]) {
          acc[todo.activateAt] = [];
        }
        acc[todo.activateAt]?.push(todo);
        return acc;
      },
      {} as Record<string, Array<Todo>>,
    );
}
// 如果 Todo 是要考慮大量資料來往的，考慮到有可能會讓 filter 效率變得很差，那就應該走 IndexDB 且以日期為索引進行儲存
// 但是，在任何情況下把這麼多資料放在前端不太現實
export const todoStore = defineStore('todo', {
  state: () => ({
    todoList: _getLocalStorageTodoList(),
  }),

  getters: {
    todoCount: (state) => state.todoList.length,
    completedCount: (state) => state.todoList.filter((todo) => todo.completed).length,
    uncompletedCount: (state) => state.todoList.filter((todo) => !todo.completed).length,
  },

  actions: {
    add(todo: Todo) {
      this.todoList.push(todo);
      TodoBus.emit('updatedTodoList', todo, 'new');
      this.saveTodoList();
    },
    remove(todo: Todo) {
      this.todoList.splice(this.todoList.indexOf(todo), 1);
      TodoBus.emit('updatedTodoList', todo, 'remove');
      this.saveTodoList();
    },
    getListByDate(date: string): Array<Todo> {
      return this.todoList.filter((todo) => todo.activateAt === date);
    },
    // /*
    //  * Params: monthAndYear: string (MM-YYYY)
    //  */
    // getListByMonth(monthAndYear: string) {
    //   // todo.activateAt.replace(/^(\d{2})-(\d{2})-(\d{4})$/, '$2-$3'),
    //   return _solveDateListWith(
    //     this.todoList.filter((todo) => todo.activateAt.includes(monthAndYear)),
    //   );
    // },
    getListWithDate(): Record<string, Array<Todo>> {
      return _solveDateListWith(this.todoList);
    },

    saveTodoList() {
      _patchLocalStorageTodoList(this.todoList);
    },
  },
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(todoStore, import.meta.hot));
}
