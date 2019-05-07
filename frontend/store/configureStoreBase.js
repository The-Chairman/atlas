import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import { createHashHistory } from 'history';
import { routerMiddleware, routerActions } from 'connected-react-router';
import { createLogger } from 'redux-logger';
import createRootReducer from '../reducers';
import * as UseCasesActions from '../actions/UseCases';
import * as ActivitiesActions from '../actions/Activities';
import * as ActorsActions from '../actions/Actors';
import * as CyberSecurityThreatsActions from '../actions/CyberSecurityThreats';
import * as DisciplinesActions from '../actions/Disciplines';
import * as InformationCategoriesActions from '../actions/InformationCategories';
import * as InformationTypesActions from '../actions/InformationTypes';
import * as LocationsActions from '../actions/Locations';
import * as RespondingOrganizationsActions from '../actions/RespondingOrganizations';
import type { UseCasesStateType,
              ActivitiesStateType,
              ActorsStateType,
              CyberSecurityThreatsStateType,
              DisciplinesStateType,
              InformationCategoriesStateType,
              InformationTypesStateType,
              LocationsStateType,
              RespondingOrganizationsStateType
              } from '../reducers/types';

const history = createHashHistory();

const rootReducer = createRootReducer(history);

const configureStore = (initialState?:{
                                        use_cases: UseCasesStateType,
                                        activities: ActivitiesStateType,
                                        actors: ActorsStateType,
                                        cybersecurity_threats: CyberSecurityThreatsStateType,
                                        disciplines: DisciplinesStateType,
                                        information_categories: InformationCategoriesStateType,
                                        information_types: InformationTypesStateType,
                                        locations: LocationsStateType,
                                        responding_organizations: RespondingOrganizationsStateType
                                        }) => {
  // Redux Configuration
  const middleware = [];
  const enhancers = [];

  // Thunk Middleware
  middleware.push(thunk);

  // Logging Middleware
  const logger = createLogger({
    level: 'info',
    collapsed: true
  });

  // Skip redux logs in console during the tests
  if (process.env.NODE_ENV !== 'test') {
    middleware.push(logger);
  }

  // Router Middleware
  const router = routerMiddleware(history);
  middleware.push(router);

  // Redux DevTools Configuration
  const actionCreators = {
    ...ActivitiesActions,
    ...ActorsActions,
    ...CyberSecurityThreatsActions,
    ...DisciplinesActions,
    ...InformationCategoriesActions,
    ...InformationTypesActions,
    ...LocationsActions,
    ...RespondingOrganizationsActions,
    ...UseCasesActions
  };
  // If Redux DevTools Extension is installed use it, otherwise use Redux compose
  /* eslint-disable no-underscore-dangle */
  const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
        // Options: http://extension.remotedev.io/docs/API/Arguments.html
        actionCreators
      })
    : compose;
  /* eslint-enable no-underscore-dangle */

  // Apply Middleware & Compose Enhancers
  enhancers.push(applyMiddleware(...middleware));
  const enhancer = composeEnhancers(...enhancers);

  // Create Store
  const store = createStore(rootReducer, initialState, enhancer);

  if (module.hot) {
    module.hot.accept(
      '../reducers',
      // eslint-disable-next-line global-require
      () => store.replaceReducer(require('../reducers').default)
    );
  }

  return store;
};

export default { configureStore, history };