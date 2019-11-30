// import { saveState, loadState } from './service';
import v4 from 'uuid/v4';

const defaultState = {
  todos: [],
  visibilityFilter: 'SHOW_ALL',
};

const createController = async function(
  this: { state: any; setState: Function },
  {
    // controllerConfig,
    frameworkData,
    appData: appDataPromise,
  }: {
    frameworkData: any;
    appData?: Promise<any>;
    widgetConfig: any;
  },
): Promise<{ methods?: any; corvid?: any; pageReady?: Function }> {
  // const { id: userId } = controllerConfig.wixCodeApi.user.currentUser;

  // Load app data
  // const initialState = await loadState(userId);
  // console.log({ initialState });
  const initialState = undefined;

  // Wait for framework data / setup data
  const experiments = await frameworkData.experimentsPromise;
  const appData = await appDataPromise;

  // Set initial state
  this.state = initialState || defaultState;

  console.log('In Controller');
  console.log({ experiments, appData });

  return {
    // Methods exposed to the widget
    methods: {
      addTodo: (text: string) => {
        this.setState({
          todos: [
            ...this.state.todos,
            {
              id: v4(),
              text,
              completed: false,
            },
          ],
        });
      },
      toggleTodo: (id: string) => {
        this.setState({
          todos: this.state.todos.map((todo: any) => {
            if (todo.id === id) {
              return {
                ...todo,
                completed: !todo.completed,
              };
            }

            return todo;
          }),
        });
      },
      setVisibilityFilter: (
        visibilityFilter: 'SHOW_ALL' | 'SHOW_ACTIVE' | 'SHOW_COMPLETED',
      ) => {
        this.setState({ visibilityFilter });
      },
    },
    // Expose Corvid API
    corvid: {
      getTodos: () => this.state.todos,
    },
  };
};

export default createController;
