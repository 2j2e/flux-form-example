export function* search() {
  while (true) {
    const action = yield take(Actions.Search.Customers);
    const { params, formName } = action.payload;
    yield put(Forms.loading(formName, true));
    
    try {
      let url = uri('customers/').setQuery(params);
      let result = yield call(get, url);
      yield put(success(result, params));
      yield put(Forms.loading(formName, false));
    }
    catch(e) {
      yield put(Forms.serverErrors(formName, e));
    }
  }
}