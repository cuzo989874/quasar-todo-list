import { EventBus } from 'quasar';
import type { Todo } from 'src/components/models';

export const TodoBus = new EventBus<{
  updatedTodoList: (todo: Todo, type: 'new' | 'remove') => void;
}>();
