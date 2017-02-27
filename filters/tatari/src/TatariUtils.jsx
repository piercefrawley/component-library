import qs from 'qs';
// import { get, patch } from './TatariApi';

const memo = {};

export const getSaved = (restoreUrl) => {
  // if (restoreUrl === undefined) { // NOT TRUE!
  //   return { data: [] };
  // }

  // Populate filters from URL first, then try remote retrieve.
  // const url = window.location.href.split('?');
  // const params = qs.parse(url[1]);
  // return params.filters;

  // return (data === undefined
  //   ? get(restoreUrl)
  //   : { data });
};

// export const storedPatch = url => async (dispatch, getState) => {
//   dispatch(storedPatchRequest());
//
//   const payload = { filters: reduceAllFilters(getState)};
//
//   if (Object.keys(payload.filters).length === 0) {
//     return;
//   }
//
//   try {
//     await patch(url, payload);
//     dispatch(storedPatchResolve());
//   } catch (e) {
//     dispatch(storedPatchReject(e));
//   }
// };
// // ===== Helper functions
// const reduceAllFilters = (getState) => {
//   const filterData = activeFiltersSelector(getState());
//
//   const reduceSingle = (acc, value) => {
//     if (value.key && value.checked === true) {
//       acc.push(value.key);
//     }
//
//     return acc;
//   };
//
//   const reduceAll = (acc, values, key) => {
//     acc[key] = values.reduce(reduceSingle, []);
//     return acc;
//   };
//
//   return filterData.reduce(reduceAll, {});
// };

// ==== Reducer actions
// export const activeAdd = obj => async (dispatch) => {
//   if (memo[obj.key] !== undefined) {
//     const values = memo[obj.key].map((v) => { delete v.checked; return v; });
//
//     dispatch(activeAddResolve({ key: obj.key, values }));
//     return;
//   }
//
//   dispatch(activeAddRequest());
//   dispatch(setLoading(obj.key, true));
//
//   try {
//     const { data } = await get(obj.endpoint);
//     memo[obj.key] = data;
//     if (data.length) { memo[obj.key].unshift('SELECTALL'); }
//
//     dispatch(activeAddResolve({ key: obj.key, values: memo[obj.key] }));
//   } catch (e) {
//     dispatch(activeAddReject(e));
//   }
// };

// export const updateUrl = () => {
  // const url = window.location.href.split('?');
  // const params = qs.parse(url[1]);
  // // params.filters = reduceAllFilters(getState);
  // params.page = 1;
  //
  // const newParams = qs.stringify(params, { arrayFormat: 'brackets' });
  //
  // history.pushState(history.state, '', `${url[0]}?${newParams}`);

  // DRY THIS
  // const newParams = qs.stringify(params, { arrayFormat: 'brackets' });
  // const delimiter = (newParams.length ? '?' : '');
  // history.pushState(history.state, '', `${url[0]}${delimiter}${newParams}`);
// };
// // ===== Reducer
// const reducer = handleActions({
//   [AVAILABLE_FETCH_RESOLVE]: (state, { payload: data }) =>
//     state.set('availableFilters', data),
//
//   [ACTIVE_ADD_RESOLVE]: (state, { payload: { key, values } }) => {
//     return state
//       .setIn(['activeFiltersCheckedCount', key], 0)
//       .setIn(['activeFilters', key], values);
//   },
//
//   [ACTIVE_REMOVE_ONE]: (state, { payload: key }) =>
//     state.deleteIn(['activeFilters', key]),
//
//   [ACTIVE_REMOVE_ALL]: state =>
//     state.set('activeFilters', Map()),
//
//   [ACTIVE_REMOVE_EMPTY]: (state) => {
//     const active = state.get('activeFiltersCheckedCount') || List();
//     let newState = state;
//
//     active.forEach((value, key) => {
//       if (value === 0) {
//         newState = newState.deleteIn(['activeFilters', key]);
//       }
//     });
//
//     return newState;
//   },
//
//   [ACTIVE_SET_OPEN]: (state, { payload: { key } }) => {
//     if (state.getIn(['isOpen', key]) === true) {
//       return state;
//     }
//
//     return state.setIn(['isOpen', key], true);
//   },
//
//   [ACTIVE_SET_ALL_CLOSED]: state =>
//     state.get('isOpen')
//       ? state.set('isOpen', state.get('isOpen').map(() => false))
//       : state,
//
//   [TOGGLE_CHECKBOX]: (state, { payload: { itemKey, evt } }) => {
//     const target = evt.target;
//     const key = evt.target.value;
//
//     const values = state.getIn(['activeFilters', key]);
//     const index = values
//       .findIndex(v => v.key && (v.key.toString() === itemKey.toString()));
//     let count = state.getIn(['activeFiltersCheckedCount', key]) || 0;
//
//     if (target.checked) {
//       count += 1;
//       values[index].checked = true;
//     } else {
//       count -= 1;
//       delete values[index].checked;
//     }
//
//     return state
//       .setIn(['activeFiltersCheckedCount', key], count)
//       .setIn(['activeFilters', key], values);
//   },
//
//   [CHECK_ALL_CHECKBOXES]: (state, { payload: key }) => {
//     const values = state.getIn(['activeFilters', key]);
//     values.forEach(v => v === 'SELECTALL' ? null : v.checked = true);
//     return state
//       .setIn(['activeFiltersCheckedCount', key], values.length - 1)
//       .setIn(['activeFilters', key], values);
//   },
//
//   [UNCHECK_ALL_CHECKBOXES]: (state, { payload: key }) => {
//     const values = state.getIn(['activeFilters', key]);
//     values.forEach(v => (v === 'SELECTALL' ? null : delete (v.checked)));
//     return state
//       .setIn(['activeFiltersCheckedCount', key], 0)
//       .setIn(['activeFilters', key], values);
//   },
//
//   [SET_LOADING]: (state, { payload: { scope, value } }) =>
//     state.setIn(['isLoading', scope], value),
// }, Map());
