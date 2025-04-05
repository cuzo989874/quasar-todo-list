import { defineStore, acceptHMRUpdate } from 'pinia';

import type { Todo } from 'components/models';

import { TodoBus } from 'src/bus/todo-bus';

export const todoStore = defineStore('todo', {
  state: () => ({
    todoList: [] as Array<Todo>,
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
    },
    remove(todo: Todo) {
      this.todoList.splice(this.todoList.indexOf(todo), 1);
      TodoBus.emit('updatedTodoList', todo, 'remove');
    },
    getListByDate(date: string): Array<Todo> {
      return this.todoList.filter((todo) => todo.activateAt === date);
    },
    getListWithDate(filterCompleted = true): Record<string, Array<Todo>> {
      return this.todoList
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
    },
  },
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(todoStore, import.meta.hot));
}
